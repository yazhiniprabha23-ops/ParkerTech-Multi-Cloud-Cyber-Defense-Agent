function analyzeAwsEvent(event) {
  let details = {};

  try {
    details = JSON.parse(event.CloudTrailEvent || "{}");
  } catch {
    // Continue with the available event fields.
  }

  const eventName = String(event.EventName || "Unknown");
  const errorCode = String(details.errorCode || "").toLowerCase();
  const errorMessage = String(details.errorMessage || "").toLowerCase();

  const failureReason = String(
    details.additionalEventData?.FailureReason ||
      details.additionalEventData?.failureReason ||
      ""
  ).toLowerCase();

  const findings = [];

  // Rule 1: Failed AWS console login.
  const loginResult = String(
    details.responseElements?.ConsoleLogin || ""
  ).toLowerCase();

  const loginFailure =
    loginResult === "failure" ||
    (
      eventName === "ConsoleLogin" &&
      (
        errorCode.includes("failed") ||
        errorMessage.includes("authentication failed") ||
        errorMessage.includes("invalid password") ||
        failureReason.includes("failed") ||
        failureReason.includes("failure")
      )
    );

  if (eventName === "ConsoleLogin" && loginFailure) {
    findings.push({
      severity: "High",
      reason: "Failed AWS console login - investigate",
    });
  }

  // Rule 2: Access-denied or authorization errors.
  const accessDenied =
    errorCode.includes("accessdenied") ||
    errorCode.includes("unauthorized") ||
    errorMessage.includes("access denied") ||
    errorMessage.includes("accessdenied") ||
    errorMessage.includes("unauthorized");

  if (accessDenied) {
    findings.push({
      severity: "Medium",
      reason: "AWS access-denied or authorization error",
    });
  }

  // Rule 3: Sensitive IAM changes.
  const sensitiveIamChange =
    /^(CreateRole|AttachRolePolicy|PutUserPolicy|CreateAccessKey|UpdateAssumeRolePolicy|AttachUserPolicy|PutRolePolicy|CreatePolicyVersion|PutRolePermissionsBoundary|DeleteRolePermissionsBoundary|CreateLoginProfile|UpdateLoginProfile|DeactivateMFADevice|DeleteVirtualMFADevice)$/i.test(
      eventName
    );

  if (sensitiveIamChange) {
    findings.push({
      severity: "Medium",
      reason: "Sensitive IAM or authentication change requiring review",
    });
  }

  return {
    suspicious: findings.length > 0,
    findings,
  };
}

module.exports = analyzeAwsEvent;