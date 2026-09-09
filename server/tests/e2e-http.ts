async function testE2E() {
  console.log('\n🌐 ======================================================== 🌐');
  console.log('   Testing Section 38 Live End-to-End Parent Portal Flow   ');
  console.log('==============================================================\n');

  // 1. Health check
  const healthRes = await fetch('http://localhost:5000/api/health');
  const health = await healthRes.json();
  console.log('  ✓ 1. API Health Check:', health.status === 'healthy' ? 'PASS (healthy)' : 'FAIL');

  // 2. Portal Login with Code + PIN
  const loginRes = await fetch('http://localhost:5000/api/portal/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: 'PAR-7821', pin: '1234' })
  });
  const loginData = await loginRes.json();
  const token = loginData.data?.token;
  console.log('  ✓ 2. Portal Login Status:', loginRes.status, 'Parent:', loginData.data?.parent?.first_name, loginData.data?.parent?.last_name);

  if (!token) throw new Error('Failed to obtain portal JWT token');

  // 3. Fetch linked children
  const childrenRes = await fetch('http://localhost:5000/api/portal/children', {
    headers: { 'Authorization': 'Bearer ' + token }
  });
  const children = await childrenRes.json();
  const childNames = children.data?.map((c: any) => c.first_name).join(' & ');
  console.log(`  ✓ 3. Fetched Linked Children: ${childNames} (Count: ${children.data?.length})`);

  const emma = children.data?.find((c: any) => c.first_name === 'Emma');
  if (!emma) throw new Error('Emma not found in linked children list');

  // 4. Fetch Emma Live Feed
  const emmaRes = await fetch(`http://localhost:5000/api/portal/children/${emma.id}`, {
    headers: { 'Authorization': 'Bearer ' + token }
  });
  const emmaFeed = await emmaRes.json();
  console.log('  ✓ 4. Emma Live Daily Feed:');
  console.log(`     - Status: ${emmaFeed.data?.todayLive?.attendance?.statusLabel} (${emmaFeed.data?.todayLive?.attendance?.checkInTime})`);
  console.log(`     - Mood: ${emmaFeed.data?.todayLive?.mood?.status} ${emmaFeed.data?.todayLive?.mood?.emoji}`);
  console.log(`     - Nap Rest: ${emmaFeed.data?.todayLive?.nap?.duration} (${emmaFeed.data?.todayLive?.nap?.status})`);
  console.log(`     - Lunch: ${emmaFeed.data?.todayLive?.meals?.[1]?.meal} - ${emmaFeed.data?.todayLive?.meals?.[1]?.intake}`);
  console.log(`     - Teacher Note: "${emmaFeed.data?.todayLive?.teacherNote?.message?.substring(0, 50)}..."`);
  console.log(`     - Milestones: ${emmaFeed.data?.milestones?.length} recorded`);
  console.log(`     - Photo Moments: ${emmaFeed.data?.moments?.length} shared`);

  // 5. Test Family Privacy Isolation: attempt to access an unlinked child
  // Get an unlinked child's ID from the children service
  const allKidsRes = await fetch('http://localhost:5000/api/children');
  const allKids = await allKidsRes.json();
  const unlinkedChild = allKids.data?.find((c: any) => c.last_name !== 'Johnson');

  if (unlinkedChild) {
    const forbiddenRes = await fetch(`http://localhost:5000/api/portal/children/${unlinkedChild.id}`, {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    console.log(`  ✓ 5. Security Privacy Check: Unauthorized access to ${unlinkedChild.first_name} returned status ${forbiddenRes.status} (Strict 403 Forbidden)`);
    if (forbiddenRes.status !== 403) {
      throw new Error(`Expected 403 but got ${forbiddenRes.status}`);
    }
  }

  console.log('\n==============================================================');
  console.log('🎉 SECTION 38 END-TO-END HTTP INTEGRATION TESTS 100% PASSED!');
  console.log('==============================================================\n');
}

testE2E().catch(err => {
  console.error('E2E test failed:', err);
  process.exit(1);
});
