
function analyzeGcpEvent(event) {
  const auditLog = event.protoPayload || {};

  const methodName = (
    auditLog.methodName ||
    event.eventName ||
    ""
  ).toLowerCase();

  const status = auditLog.status || {};

  const principalEmail =
    auditLog.authenticationInfo?.principalEmail ||
    event.principalEmail ||
    "Unknown";

  let severity = "Normal";
  let reason = "No suspicious activity detected";

  // Rule 1: Detect failed or denied actions
  if (
    status.code !== undefined &&
    status.code !== null &&
    Number(status.code) !== 0
  ) {
    severity = "Medium";
    reason = "An action failed or was denied";
  }

  // Rule 2: Detect IAM permission or role changes
  else if (
    methodName.includes("setiampolicy") ||
    methodName.includes("setiam") ||
    methodName.includes("createrole") ||
    methodName.includes("deleterole") ||
    methodName.includes("updaterole") ||
    methodName.includes("create role") ||
    methodName.includes("update role")
  ) {
    severity = "High";
    reason = "IAM permissions or roles may have changed";
  }

  // Rule 3: Detect service-account key creation
  else if (
    methodName.includes("serviceaccountkey") ||
    methodName.includes("serviceaccountkeys") ||
    methodName.includes("createkey") ||
    methodName.includes("serviceaccountkeys.create")
  ) {
    severity = "High";
    reason = "A service-account key may have been created";
  }

  // Rule 4: Detect audit logging configuration changes
  else if (
    methodName.includes("auditconfig") ||
    methodName.includes("setauditconfig")
  ) {
    severity = "High";
    reason = "Audit logging configuration may have changed";
  }

  // Rule 5: Detect sensitive service-account operations
  else if (
    methodName.includes("serviceaccounts.create") ||
    methodName.includes("serviceaccounts.setiampolicy") ||
    methodName.includes("serviceaccounts.delete")
  ) {
    severity = "High";
    reason = "A sensitive service-account operation was detected";
  }

  // Rule 6: Detect potentially disruptive operations
  else if (
    methodName.includes("projects.delete") ||
    methodName.includes("services.disable") ||
    methodName.includes("disable service")
  ) {
    severity = "High";
    reason = "A potentially disruptive cloud operation was detected";
  }

  // Rule 7: Flag project creation for review
  else if (
    methodName.includes("createproject") ||
    methodName.includes("projects.create")
  ) {
    severity = "Medium";
    reason = "New project creation should be reviewed";
  }

  // Rule 8: Flag project moves for review
  else if (
    methodName.includes("moveproject") ||
    methodName.includes("projects.move")
  ) {
    severity = "Medium";
    reason = "Project movement should be reviewed";
  }

  // Rule 9: Flag billing-account changes for review
  else if (
    methodName.includes("assignresourcetobillingaccount") ||
    methodName.includes("billingaccounts")
  ) {
    severity = "Medium";
    reason = "A billing-account change should be reviewed";
  }

  // Rule 10: Flag service enablement for review
  else if (
    methodName.includes("enableservice") ||
    methodName.includes("serviceusage.enable")
  ) {
    severity = "Low";
    reason = "A Google Cloud service was enabled";
  }

  return {
    eventName:
      auditLog.methodName ||
      event.eventName ||
      "Unknown activity",

    principalEmail,
    severity,
    reason,

    suspicious:
      severity === "High" ||
      severity === "Medium",

    source: event.simulated
      ? "GCP Simulation"
      : "Google Cloud",

    simulated: event.simulated === true,
  };
}

module.exports = analyzeGcpEvent;
