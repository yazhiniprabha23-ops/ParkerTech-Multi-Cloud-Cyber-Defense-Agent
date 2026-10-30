
const analyzeGcpEvent = require("./gcpEventAnalyzer");

const tests = [
  {
    name: "Failed action",
    event: {
      protoPayload: {
        methodName: "compute.instances.get",
        status: { code: 7 },
      },
    },
    expected: true,
  },
  {
    name: "IAM policy change",
    event: {
      protoPayload: {
        methodName: "SetIamPolicy",
        status: { code: 0 },
      },
    },
    expected: true,
  },
  {
    name: "Service account key creation",
    event: {
      protoPayload: {
        methodName: "google.iam.admin.v1.CreateServiceAccountKey",
        status: { code: 0 },
      },
    },
    expected: true,
  },
  {
    name: "Normal activity",
    event: {
      protoPayload: {
        methodName: "compute.instances.list",
        status: { code: 0 },
      },
    },
    expected: false,
  },
];

let passed = 0;

for (const test of tests) {
  const result = analyzeGcpEvent(test.event);
  const success = result.suspicious === test.expected;

  console.log(
    `${success ? "PASS" : "FAIL"}: ${test.name}`
  );

  if (success) passed++;
}

console.log(`\n${passed}/${tests.length} tests passed`);