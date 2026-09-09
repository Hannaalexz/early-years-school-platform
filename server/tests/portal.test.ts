import { PortalService } from '../src/services/portal.service.js';
import { pool } from '../src/config/db.js';

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

export async function runPortalTests(): Promise<{ passed: number; failed: number }> {
  console.log('\n--- Suite 5: Lightweight Parent Portal Access & Security ---');

  try {
    // 1. Portal Login with Code + PIN
    const codeLogin = await PortalService.loginWithPortalPin('PAR-7821', '1234');
    assert(!!codeLogin.token, 'Parent login with Portal Code PAR-7821 succeeded');
    assert(codeLogin.parent.first_name === 'Sarah', 'Returned parent profile for Sarah');
    assert(!!codeLogin.school.name, 'Returned school details in portal login payload');

    // 2. Portal Login with Phone + PIN
    const phoneLogin = await PortalService.loginWithPortalPin('+251 91 144 5566', '1234');
    assert(!!phoneLogin.token, 'Parent login with phone number succeeded');

    // 3. Invalid PIN rejection
    let pinRejected = false;
    try {
      await PortalService.loginWithPortalPin('PAR-7821', '9999');
    } catch (e: any) {
      if (e.message.includes('INVALID_PIN')) {
        pinRejected = true;
      }
    }
    assert(pinRejected, 'Incorrect PIN was strictly rejected with INVALID_PIN error');

    // 4. Unknown Identifier rejection
    let unknownRejected = false;
    try {
      await PortalService.loginWithPortalPin('UNKNOWN-9999', '1234');
    } catch (e: any) {
      if (e.message.includes('PARENT_NOT_FOUND')) {
        unknownRejected = true;
      }
    }
    assert(unknownRejected, 'Unknown identifier was rejected with PARENT_NOT_FOUND error');

    // 5. Parent's Children List
    const sarahId = codeLogin.parent.id;
    const children = await PortalService.getParentChildren(sarahId);
    assert(children.length >= 1, `Fetched parent's children (found ${children.length})`);
    const emma = children.find(c => c.first_name === 'Emma');
    assert(!!emma, 'Parent Sarah is correctly linked to Emma Johnson');
    assert(emma?.calculated_age.formatted.includes('year'), 'Calculated age present in parent portal view');

    // 6. Child Live Feed & Daily Care Status
    if (emma) {
      const feed = await PortalService.getChildLiveFeed(sarahId, emma.id);
      assert(!!feed.todayLive, 'Live daily feed structure returned');
      assert(feed.todayLive.attendance.status === 'present', 'Attendance status reflects present');
      assert(feed.todayLive.meals.length >= 3, 'Meal updates present in daily report');
      assert(!!feed.todayLive.nap.duration, 'Nap time details present');
      assert(feed.todayLive.activities.length >= 2, 'Curriculum activities present');
      assert(!!feed.todayLive.teacherNote.message, 'Teacher daily note is populated');
      assert(feed.milestones.length >= 3, 'Development milestones returned for portfolio');
      assert(feed.moments.length >= 2, 'Classroom moment photos returned');
    }

    // 7. Security Isolation: Parent cannot access unauthorized child
    const otherChildRes = await pool.query(
      `SELECT c.id, c.first_name FROM children c 
       WHERE c.id NOT IN (SELECT child_id FROM child_guardians WHERE parent_id = $1) 
       LIMIT 1`,
      [sarahId]
    );

    if (otherChildRes.rows.length > 0) {
      const unauthorizedChild = otherChildRes.rows[0];
      let forbiddenCaught = false;
      try {
        await PortalService.getChildLiveFeed(sarahId, unauthorizedChild.id);
      } catch (e: any) {
        if (e.statusCode === 403 || e.message.includes('FORBIDDEN')) {
          forbiddenCaught = true;
        }
      }
      assert(forbiddenCaught, `Strict 403 Forbidden when accessing unlinked child (${unauthorizedChild.first_name})`);
    }

  } catch (error) {
    console.error('Portal tests error:', error);
    failed++;
  }

  return { passed, failed };
}
