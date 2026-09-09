import { ChildrenService } from '../src/services/children.service.js';
import { AuthService } from '../src/services/auth.service.js';
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

export async function runChildrenTests() {
  console.log('\n👶 ======================================================== 👶');
  console.log('   Running Phase 2: Child & Parent Management Automated Tests   ');
  console.log('==============================================================\n');

  try {
    // 1. Age Calculation Engine
    console.log('--- Test Suite 1: Early-Years Age Calculation ---');
    const ageEmma = ChildrenService.calculateAge('2022-06-15');
    assert(ageEmma.years === 4, `Emma years calculated as 4 (got ${ageEmma.years})`);
    assert(ageEmma.formatted.includes('year'), `Formatted age contains year units: "${ageEmma.formatted}"`);

    const ageToddler = ChildrenService.calculateAge('2024-12-20');
    assert(ageToddler.years === 1, `Noah years calculated as 1 (got ${ageToddler.years})`);

    // 2. Child Listing & Filtering
    console.log('\n--- Test Suite 2: Children Directory & Health Filters ---');
    const allChildren = await ChildrenService.listChildren({});
    assert(allChildren.length >= 18, `Retrieved all enrolled children (total: ${allChildren.length})`);

    const emma = allChildren.find((c: any) => c.first_name === 'Emma' && c.last_name === 'Johnson');
    assert(!!emma, 'Emma Johnson exists in active directory');
    assert(emma.classroom_name === 'Sunshine Classroom', 'Emma is enrolled in Sunshine Classroom');
    assert(emma.allergies && emma.allergies.includes('Peanuts'), 'Emma has Peanuts allergy recorded');

    // Allergy Filter
    const childrenWithAllergies = await ChildrenService.listChildren({ has_allergy: true });
    assert(childrenWithAllergies.length > 0, `Allergy filter returns children with allergies (${childrenWithAllergies.length} found)`);
    assert(childrenWithAllergies.every((c: any) => c.allergies.length > 0), 'All returned children have non-empty allergies array');

    // 3. Child 360 Profile
    console.log('\n--- Test Suite 3: 360 Child Profile & Relationships ---');
    const emmaProfile = await ChildrenService.getChildById(emma.id);
    assert(!!emmaProfile, 'Emma 360 profile retrieved');
    assert(emmaProfile!.guardians.length >= 2, `Emma has multiple guardians mapped (found ${emmaProfile!.guardians.length})`);
    
    const mother = emmaProfile!.guardians.find((g: any) => g.relationship === 'Mother');
    assert(!!mother && mother.parent_first_name === 'Sarah', 'Mother is Sarah Johnson with primary status');
    assert(mother!.pickup_authorized === true, 'Mother has pickup authorization');

    // 4. Authorized Pickups Security (#7 & #14)
    console.log('\n--- Test Suite 4: Authorized Pickup Security ---');
    assert(emmaProfile!.authorized_pickups.length >= 2, `Authorized pickups list retrieved (found ${emmaProfile!.authorized_pickups.length})`);

    const approvedPickup = emmaProfile!.authorized_pickups.find((p: any) => p.authorization_status === 'approved');
    assert(!!approvedPickup, `Approved pickup found: ${approvedPickup?.name} (${approvedPickup?.relationship})`);

    const revokedPickup = emmaProfile!.authorized_pickups.find((p: any) => p.authorization_status === 'revoked');
    assert(!!revokedPickup, `Revoked contact detected: ${revokedPickup?.name} (Status: ${revokedPickup?.authorization_status})`);

    // Add new authorized pickup test
    const newPickup = await ChildrenService.addAuthorizedPickup(emma.id, {
      name: 'Uncle Robert',
      relationship: 'Uncle',
      phone: '+251 91 188 7766',
      notes: 'Weekend pickup only',
    });
    assert(newPickup.name === 'Uncle Robert', 'Added new authorized pickup successfully');

    // Revoke the new pickup
    const revoked = await ChildrenService.updatePickupStatus(newPickup.id, 'revoked');
    assert(revoked.authorization_status === 'revoked', 'Pickup authorization successfully revoked');

    // 5. Parent-Child Privacy Isolation (#56 Security: Parents cannot access other families)
    console.log('\n--- Test Suite 5: Parent Privacy & Family Isolation ---');
    const parentLogin = await AuthService.login('parent@littlestars.edu', 'Parent123!');
    const parentUserId = parentLogin.user.id;

    // Check Sarah can access Emma and Noah
    const canAccessEmma = await ChildrenService.checkParentAccessToChild(parentUserId, emma.id);
    assert(canAccessEmma === true, 'Parent Sarah Johnson has verified access to her daughter Emma');

    const noah = allChildren.find((c: any) => c.first_name === 'Noah' && c.last_name === 'Johnson');
    const canAccessNoah = await ChildrenService.checkParentAccessToChild(parentUserId, noah.id);
    assert(canAccessNoah === true, 'Parent Sarah Johnson has verified access to her son Noah');

    // Check Sarah CANNOT access Daniel Solomon (another family)
    const daniel = allChildren.find((c: any) => c.first_name === 'Daniel' && c.last_name === 'Solomon');
    const canAccessDaniel = await ChildrenService.checkParentAccessToChild(parentUserId, daniel.id);
    assert(canAccessDaniel === false, 'Parent Sarah Johnson is STRICTLY FORBIDDEN from accessing Daniel Solomon');

    // 6. Parents Directory
    console.log('\n--- Test Suite 6: Parents Directory ---');
    const parents = await ChildrenService.listParents({});
    assert(parents.length >= 5, `Parents directory retrieved (${parents.length} parents)`);

    const sarahPr = parents.find((p: any) => p.email === 'parent@littlestars.edu');
    assert(!!sarahPr, 'Sarah Johnson found in parents directory');
    assert(sarahPr.children.length === 2, `Sarah has 2 linked children in directory (${sarahPr.children.map((c: any) => c.child_name).join(', ')})`);

    console.log('\n==============================================================');
    console.log(`🏁 PHASE 2 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log('==============================================================\n');

    return { passed, failed };
  } catch (err) {
    console.error('Test execution error:', err);
    throw err;
  }
}

if (process.argv[1] && process.argv[1].includes('children.test')) {
  runChildrenTests()
    .then(({ failed }) => {
      process.exit(failed > 0 ? 1 : 0);
    })
    .catch(() => process.exit(1))
    .finally(() => pool.end());
}
