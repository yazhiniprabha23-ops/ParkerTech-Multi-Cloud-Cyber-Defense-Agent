const analyzeAwsEvent = require("./awsEventAnalyzer");

const tests = [
  {
    name: "Failed console login",
    event: {
      EventName: "ConsoleLogin",
      CloudTrailEvent: JSON.stringify({
        responseElements: {
          ConsoleLogin: "Failure",
        },
      }),
    },
    expected: true,
  },
  {
    name: "Access denied",
    event: {
      EventName: "DescribeInstances",
      CloudTrailEvent: JSON.stringify({
        errorCode: "AccessDenied",
        errorMessage: "Access denied",
      }),
    },
    expected: true,
  },
  {
    name: "Sensitive IAM change",
    event: {
      EventName: "CreateAccessKey",
      CloudTrailEvent: "{}",
    },
    expected: true,
  },
  {
    name: "Normal activity",
    event: {
      EventName: "DescribeInstances",
      CloudTrailEvent: "{}",
    },
    expected: false,
  },
];

let failed = 0;

for (const test of tests) {
  const result = analyzeAwsEvent(test.event);
  const passed = result.suspicious === test.expected;

  console.log(
    `${passed ? "PASS" : "FAIL"}: ${test.name}`,
    JSON.stringify(result)
  );

  if (!passed) {
    failed++;
  }
}

console.log(`\n${tests.length - failed}/${tests.length} tests passed.`);

if (failed > 0) {
  process.exitCode = 1;
}