import prisma from '../src/prisma/client.js';

/**
 * Cleanup Script — Removes junk/test items from the database
 * 
 * Detects items with:
 * - Gibberish titles (random characters, very short titles, etc.)
 * - Invalid categories not matching the official taxonomy
 * - Nonsensical descriptions
 * - Test/dummy data patterns
 */

// Official taxonomy categories and subcategories
const VALID_CATEGORIES = ['Apparel', 'Accessories', 'Tech & Retro Electronics'];
const VALID_SUBCATEGORIES = [
  'Tops & Graphic Tees', 'Outerwear & Jackets', 'Denim & Bottoms',
  'Dresses & Skirts', 'Knitwear & Sweaters',
  'Bags & Backpacks', 'Footwear & Sneakers', 'Headwear', 'Jewelry', 'Eyewear',
  'Digicams', 'Gaming', 'Electronics',
  'Other',
];

// Known good seed item IDs (keep these)
const SEED_ITEM_IDS = ['item-101', 'item-102', 'item-104', 'item-105', 'item-106'];

function isGibberish(text) {
  if (!text || text.trim().length === 0) return true;
  
  const cleaned = text.trim().toLowerCase();
  
  // Too short to be a real title (less than 5 chars)
  if (cleaned.length < 5) return true;
  
  // Check for random character sequences (consonant clusters with no vowels)
  const vowelRatio = (cleaned.match(/[aeiou]/gi) || []).length / cleaned.replace(/\s/g, '').length;
  if (vowelRatio < 0.1 && cleaned.length > 5) return true;
  
  // Check for repeated characters like "aaaaaaa" or "dndhejahdksj"
  const uniqueChars = new Set(cleaned.replace(/\s/g, '').split('')).size;
  const totalChars = cleaned.replace(/\s/g, '').length;
  if (totalChars > 8 && uniqueChars / totalChars < 0.3) return true;
  
  // Check for common test patterns
  const testPatterns = [
    /^test/i, /^asdf/i, /^qwer/i, /^zxcv/i, /^abc/i,
    /^sample/i, /^dummy/i, /^fake/i, /^lorem/i,
    /^aaa/i, /^bbb/i, /^xxx/i, /^zzz/i,
    /^djsk/i, /^dndh/i, /^jhdks/i,
    /^\d+$/, // Just numbers
  ];
  
  return testPatterns.some((p) => p.test(cleaned));
}

function isInvalidCategory(category) {
  return !VALID_CATEGORIES.includes(category);
}

function isInvalidSubcategory(subcategory) {
  if (!subcategory) return false; // subcategory is optional
  return !VALID_SUBCATEGORIES.includes(subcategory);
}

async function cleanup() {
  console.log('🧹 UnRetail Database Cleanup — Scanning for junk/test items...\n');
  
  try {
    const allItems = await prisma.item.findMany({
      include: { shop: { select: { shopName: true } } },
      orderBy: { createdAt: 'asc' },
    });
    
    console.log(`📦 Total items in database: ${allItems.length}\n`);
    
    const junkItems = [];
    const cleanItems = [];
    
    for (const item of allItems) {
      const reasons = [];
      
      // Skip known seed items
      if (SEED_ITEM_IDS.includes(item.id)) {
        cleanItems.push(item);
        continue;
      }
      
      // Check for gibberish title
      if (isGibberish(item.title)) {
        reasons.push(`Gibberish/test title: "${item.title}"`);
      }
      
      // Check for invalid category
      if (isInvalidCategory(item.category)) {
        reasons.push(`Invalid category: "${item.category}"`);
      }
      
      // Check for invalid subcategory
      if (isInvalidSubcategory(item.subcategory)) {
        reasons.push(`Invalid subcategory: "${item.subcategory}"`);
      }
      
      // Check for gibberish description
      if (isGibberish(item.description) && item.description?.length > 0) {
        reasons.push(`Gibberish description: "${item.description?.substring(0, 40)}..."`);
      }
      
      // Check for nonsensical price (0 or negative)
      if (!item.price || item.price <= 0) {
        reasons.push(`Invalid price: ${item.price}`);
      }
      
      if (reasons.length > 0) {
        junkItems.push({ item, reasons });
      } else {
        cleanItems.push(item);
      }
    }
    
    console.log('─'.repeat(70));
    console.log(`✅ CLEAN items (keeping): ${cleanItems.length}`);
    console.log('─'.repeat(70));
    cleanItems.forEach((item) => {
      console.log(`  ✅ "${item.title}" | ${item.category} > ${item.subcategory || 'N/A'} | ₹${item.price}`);
    });
    
    console.log('');
    console.log('─'.repeat(70));
    console.log(`🗑️  JUNK items (will be deleted): ${junkItems.length}`);
    console.log('─'.repeat(70));
    
    if (junkItems.length === 0) {
      console.log('\n🎉 No junk items found! Your database is already clean.\n');
      await prisma.$disconnect();
      return;
    }
    
    for (const { item, reasons } of junkItems) {
      console.log(`\n  🗑️  ID: ${item.id}`);
      console.log(`     Title: "${item.title}"`);
      console.log(`     Category: "${item.category}" > "${item.subcategory || 'N/A'}"`);
      console.log(`     Price: ₹${item.price}`);
      console.log(`     Created: ${item.createdAt}`);
      reasons.forEach((r) => console.log(`     ⚠️  ${r}`));
    }
    
    // Perform deletion
    console.log(`\n${'─'.repeat(70)}`);
    console.log(`🔥 Deleting ${junkItems.length} junk items...\n`);
    
    const junkIds = junkItems.map(({ item }) => item.id);
    
    // First check for any orders referencing these items
    const ordersOnJunk = await prisma.order.findMany({
      where: { itemId: { in: junkIds } },
      select: { id: true, itemId: true },
    });
    
    if (ordersOnJunk.length > 0) {
      console.log(`⚠️  ${ordersOnJunk.length} orders reference junk items. Deleting those orders first...`);
      for (const order of ordersOnJunk) {
        // Delete disputes tied to the order first
        await prisma.dispute.deleteMany({ where: { orderId: order.id } });
        await prisma.order.delete({ where: { id: order.id } });
      }
      console.log(`   Cleaned up ${ordersOnJunk.length} related orders.\n`);
    }
    
    const result = await prisma.item.deleteMany({
      where: { id: { in: junkIds } },
    });
    
    console.log(`✅ Successfully deleted ${result.count} junk items from the database!`);
    
    // Final count
    const remaining = await prisma.item.count();
    console.log(`📦 Remaining items in database: ${remaining}\n`);
    
  } catch (err) {
    console.error('❌ Cleanup error:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

cleanup();
