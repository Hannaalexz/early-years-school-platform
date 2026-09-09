import { AuthService } from '../src/services/auth.service.js';
import { UserService } from '../src/services/user.service.js';
import { pool } from '../src/config/db.js';
import { runChildrenTests } from './children.test.js';
import { runPortalTests } from './portal.test.js';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${testName}`);
    failed++;
  }
}

async function runAll() {
  console.log('\n🧪 ======================================================== 🧪');
  console.log('   Running Full Platform Test Suite (Phases 1 & 2)           ');
  console.log('==============================================================\n');

  try {
    // 1. Database Connection & Demo Accounts
    console.log('--- Suite 1: Seeding & Demo Accounts Verification ---');
    const demoAccounts = await AuthService.getDemoAccounts();
    assert(demoAccounts.length >= 5, `Found demo accounts (found ${demoAccounts.length})`);

    // 2. Authentication: Valid Login
    console.log('\n--- Suite 2: Authentication & Token Generation ---');
    const adminLogin = await AuthService.login('admin@littlestars.edu', 'Admin123!', '127.0.0.1');
    assert(!!adminLogin.token, 'Admin login generated JWT token');
    assert(adminLogin.user.role === 'school_admin', 'Admin user role is school_admin');
    assert(adminLogin.user.permissions.includes('children:manage'), 'Admin has children:manage permission');

    // 3. User Service
    console.log('\n--- Suite 3: User Service & Multi-Tenancy ---');
    const users = await UserService.listUsers({});
    assert(users.length >= 5, `Users listed successfully (total: ${users.length})`);

    console.log(`\n🏁 Platform Core Tests: ${passed} PASSED, ${failed} FAILED`);

    // 4. Run Children & Parent Management Suite
    const childResults = await runChildrenTests();

    // 5. Run Lightweight Parent Portal Suite
    const portalResults = await runPortalTests();

    const totalPassed = passed + childResults.passed + portalResults.passed;
    const totalFailed = failed + childResults.failed + portalResults.failed;

    console.log('\n==============================================================');
    console.log(`🎉 OVERALL TEST SUITE TOTAL: ${totalPassed} PASSED, ${totalFailed} FAILED`);
    console.log('==============================================================\n');

    process.exit(totalFailed > 0 ? 1 : 0);
  } catch (error) {
    console.error('Test execution failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runAll();
