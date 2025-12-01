/**
 * Backend API Load Test Script
 * Tests all major endpoints with concurrent requests
 * 
 * Usage: node loadtest.js
 * Requirements: npm install axios
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';
const CONCURRENT_REQUESTS = 10;
const TEST_ITERATIONS = 5;

// Color codes for console output
const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m'
};

// Test results storage
const results = {
    passed: 0,
    failed: 0,
    totalTime: 0,
    tests: []
};

// Helper to make requests
async function makeRequest(method, endpoint, data = null) {
    const start = Date.now();
    try {
        const config = {
            method,
            url: `${BASE_URL}${endpoint}`,
            ...(data && { data })
        };
        const response = await axios(config);
        const duration = Date.now() - start;
        return { success: true, status: response.status, duration, data: response.data };
    } catch (error) {
        const duration = Date.now() - start;
        return {
            success: false,
            status: error.response?.status || 0,
            duration,
            error: error.message
        };
    }
}

// Test scenarios
const testScenarios = [
    {
        name: 'Dashboard Stats',
        method: 'GET',
        endpoint: '/reports/dashboard'
    },
    {
        name: 'List Suppliers',
        method: 'GET',
        endpoint: '/suppliers?page=1&limit=20'
    },
    {
        name: 'List Materials',
        method: 'GET',
        endpoint: '/materials?page=1&limit=20'
    },
    {
        name: 'List Menu Items',
        method: 'GET',
        endpoint: '/menu-items?page=1&limit=20'
    },
    {
        name: 'List Production Logs',
        method: 'GET',
        endpoint: '/production-logs?page=1&limit=20'
    },
    {
        name: 'List Yield Tests',
        method: 'GET',
        endpoint: '/yield-tests?page=1&limit=20'
    },
    {
        name: 'Business Settings',
        method: 'GET',
        endpoint: '/business-settings'
    }
];

// Run a single test
async function runTest(scenario) {
    const result = await makeRequest(scenario.method, scenario.endpoint, scenario.data);
    return {
        scenario: scenario.name,
        ...result
    };
}

// Run concurrent tests
async function runConcurrentTests(scenario, count) {
    const promises = Array(count).fill(null).map(() => runTest(scenario));
    return await Promise.all(promises);
}

// Calculate statistics
function calculateStats(testResults) {
    const durations = testResults.map(r => r.duration);
    const successCount = testResults.filter(r => r.success).length;

    return {
        total: testResults.length,
        success: successCount,
        failed: testResults.length - successCount,
        successRate: ((successCount / testResults.length) * 100).toFixed(2),
        avgDuration: (durations.reduce((a, b) => a + b, 0) / durations.length).toFixed(2),
        minDuration: Math.min(...durations),
        maxDuration: Math.max(...durations)
    };
}

// Main load test function
async function runLoadTest() {
    console.log(`${colors.blue}═══════════════════════════════════════════`);
    console.log(`  CostFlow Backend API Load Test`);
    console.log(`═══════════════════════════════════════════${colors.reset}\n`);

    console.log(`Configuration:`);
    console.log(`  Base URL: ${BASE_URL}`);
    console.log(`  Concurrent Requests: ${CONCURRENT_REQUESTS}`);
    console.log(`  Test Iterations: ${TEST_ITERATIONS}`);
    console.log(`  Total Tests: ${testScenarios.length * TEST_ITERATIONS * CONCURRENT_REQUESTS}\n`);

    const overallStart = Date.now();

    for (let iteration = 1; iteration <= TEST_ITERATIONS; iteration++) {
        console.log(`${colors.yellow}─── Iteration ${iteration}/${TEST_ITERATIONS} ───${colors.reset}`);

        for (const scenario of testScenarios) {
            const testResults = await runConcurrentTests(scenario, CONCURRENT_REQUESTS);
            const stats = calculateStats(testResults);

            results.tests.push({
                iteration,
                scenario: scenario.name,
                stats
            });

            const statusColor = stats.successRate >= 100 ? colors.green :
                stats.successRate >= 80 ? colors.yellow : colors.red;

            console.log(`  ${scenario.name.padEnd(25)} ${statusColor}${stats.successRate}%${colors.reset} ` +
                `(avg: ${stats.avgDuration}ms, min: ${stats.minDuration}ms, max: ${stats.maxDuration}ms)`);
        }
        console.log('');
    }

    const overallDuration = Date.now() - overallStart;

    // Calculate overall statistics
    const allTests = results.tests.flatMap(t => Array(CONCURRENT_REQUESTS).fill(t.stats));
    const totalRequests = testScenarios.length * TEST_ITERATIONS * CONCURRENT_REQUESTS;
    const totalSuccess = results.tests.reduce((sum, t) => sum + parseInt(t.stats.success), 0);
    const totalFailed = totalRequests - totalSuccess;
    const overallSuccessRate = ((totalSuccess / totalRequests) * 100).toFixed(2);

    // Print summary
    console.log(`${colors.blue}═══════════════════════════════════════════`);
    console.log(`  Test Summary`);
    console.log(`═══════════════════════════════════════════${colors.reset}\n`);

    console.log(`Total Requests:    ${totalRequests}`);
    console.log(`Successful:        ${colors.green}${totalSuccess}${colors.reset}`);
    console.log(`Failed:            ${totalFailed > 0 ? colors.red : colors.green}${totalFailed}${colors.reset}`);
    console.log(`Success Rate:      ${overallSuccessRate >= 95 ? colors.green : colors.yellow}${overallSuccessRate}%${colors.reset}`);
    console.log(`Total Duration:    ${(overallDuration / 1000).toFixed(2)}s`);
    console.log(`Requests/Second:   ${(totalRequests / (overallDuration / 1000)).toFixed(2)}`);

    console.log(`\n${colors.blue}═══════════════════════════════════════════${colors.reset}\n`);

    // Overall status
    if (overallSuccessRate >= 95) {
        console.log(`${colors.green}✓ ALL TESTS PASSED${colors.reset}\n`);
        process.exit(0);
    } else if (overallSuccessRate >= 80) {
        console.log(`${colors.yellow}⚠ SOME TESTS FAILED${colors.reset}\n`);
        process.exit(1);
    } else {
        console.log(`${colors.red}✗ MANY TESTS FAILED${colors.reset}\n`);
        process.exit(1);
    }
}

// Check if server is running
async function checkServer() {
    try {
        await axios.get(`${BASE_URL}/reports/dashboard`);
        return true;
    } catch (error) {
        return false;
    }
}

// Run the load test
(async () => {
    const serverRunning = await checkServer();

    if (!serverRunning) {
        console.log(`${colors.red}Error: Backend server is not running!${colors.reset}`);
        console.log(`Please start the backend server first:`);
        console.log(`  cd backend`);
        console.log(`  npm run dev\n`);
        process.exit(1);
    }

    await runLoadTest();
})();
