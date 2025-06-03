const fs = require('fs');
const path = require('path');

const resultsPath = process.argv[2];
if (!resultsPath) {
  console.error('Usage: node extract-failed-tests.js <path_to_test_results.json>');
  process.exit(1);
}

try {
  const rawData = fs.readFileSync(path.resolve(resultsPath), 'utf-8');
  const jsonData = JSON.parse(rawData);
  
  const failedTests = [];
  
  if (jsonData.testResults) {
    jsonData.testResults.forEach(suite => {
      if (suite.assertionResults) {
        suite.assertionResults.forEach(test => {
          if (test.status === 'failed') {
            // Extract relative path for suite name
            let suiteName = suite.name;
            if (jsonData.config && jsonData.config.rootDir) {
                suiteName = suite.name.startsWith(jsonData.config.rootDir) 
                            ? path.relative(jsonData.config.rootDir, suite.name)
                            : suite.name;
            }
            failedTests.push({
              suite: suiteName,
              name: test.title,
              // failureMessages: test.failureMessages.join('\n'), // Can be very long
              location: test.location ? `${path.basename(suite.name)}:${test.location.line}` : 'N/A'
            });
          }
        });
      }
    });
  }
  
  if (failedTests.length > 0) {
    console.log('Failed tests:');
    failedTests.forEach(test => {
      console.log(`- Test: ${test.name}, Location: ${test.location}`);
    });
  } else {
    console.log('No failed tests found or JSON structure not as expected.');
  }
  
} catch (error) {
  console.error('Error processing test results:', error.message);
  if (error.message.includes('Unexpected end of JSON input') || error.message.includes('Unexpected token')) {
    console.error('The JSON file might be corrupted or incomplete.');
  }
  process.exit(1);
}