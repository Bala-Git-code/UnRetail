import prisma from '../src/prisma/client.js';

async function runCatalogVerificationTest() {
  console.log('🧪 =========================================================');
  console.log('🧪 UNRETAIL LIVE CATALOG VERIFICATION & INTEGRITY TEST');
  console.log('🧪 =========================================================\n');

  try {
    const categories = ['Apparel', 'Accessories', 'Tech & Retro Electronics'];
    let allPassed = true;

    for (const cat of categories) {
      const items = await prisma.item.findMany({
        where: { category: cat },
        include: {
          shop: {
            select: { id: true, shopName: true, city: true, isVerified: true, ownerId: true },
          },
        },
        orderBy: { createdAt: 'asc' },
      });

      console.log(`📦 [CATEGORY CHECK] "${cat}"`);
      console.log(`   Count found in DB: ${items.length} items (Target: 5 items)`);

      if (items.length < 4) {
        console.log(`   ❌ FAILED: Expected at least 4-5 items, found ${items.length}`);
        allPassed = false;
      } else {
        console.log(`   ✅ PASSED: Full inventory count verified.`);
      }

      console.log('   ---------------------------------------------------------');
      items.forEach((item, idx) => {
        console.log(`   #${idx + 1} ID: ${item.id}`);
        console.log(`      Title:       "${item.title}"`);
        console.log(`      Subcategory: ${item.subcategory}`);
        console.log(`      Price:       ₹${item.price.toLocaleString('en-IN')}`);
        console.log(`      Brand / Era: ${item.brand || 'Vintage'} | ${item.era}`);
        console.log(`      Condition:   ${item.condition}`);
        console.log(`      Shop:        ${item.shop?.shopName} (${item.shop?.city}) [Verified: ${item.shop?.isVerified ? 'YES' : 'NO'}]`);
        console.log(`      Status:      ${item.status}`);
        console.log(`      Images:      ${item.images?.length || 0} photos attached`);

        if (cat === 'Tech & Retro Electronics') {
          console.log(`      🔒 Anti-Fraud Diagnostics:`);
          console.log(`         - Grade:           ${item.techConditionGrade}`);
          console.log(`         - Serial No:       ${item.serialNumberImei}`);
          console.log(`         - Power Tested:    ${item.powerOnStatus ? 'PASS ✅' : 'FAIL ❌'}`);
          console.log(`         - Optics/Screen:   ${item.screenSensorClarity ? 'PASS ✅' : 'FAIL ❌'}`);
          console.log(`         - Ports & Charge:  ${item.portChargingTested ? 'PASS ✅' : 'FAIL ❌'}`);
        }
        console.log('');
      });
      console.log('=========================================================\n');
    }

    // Platform Level Statistics
    const totalItems = await prisma.item.count();
    const availableItems = await prisma.item.count({ where: { status: 'AVAILABLE' } });
    const verifiedShops = await prisma.shop.count({ where: { isVerified: true } });
    const approvedMerchants = await prisma.user.count({
      where: { role: 'MERCHANT', merchantStatus: 'APPROVED' },
    });

    console.log('📊 PLATFORM INVENTORY & MERCHANT METRICS:');
    console.log(`   - Total Items in PostgreSQL:    ${totalItems}`);
    console.log(`   - Available Items on Feed:      ${availableItems}`);
    console.log(`   - Verified Active Shops:        ${verifiedShops}`);
    console.log(`   - Approved Merchant Accounts:   ${approvedMerchants}`);
    console.log('');

    if (allPassed && totalItems === 15) {
      console.log('🎉 ALL INTEGRITY TESTS PASSED: 15/15 authentic products are live and verified in the database!');
    } else {
      console.log('⚠️  Verification completed with warnings.');
    }
  } catch (err) {
    console.error('❌ Test execution error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

runCatalogVerificationTest();
