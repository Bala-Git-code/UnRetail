/**
 * UnRetail Standard Multi-Tier Taxonomy & Fraud Prevention Attributes
 */

export const TAXONOMY = [
  {
    id: 'Apparel',
    name: 'Apparel / Clothing',
    shortName: 'Apparel',
    slug: 'apparel',
    iconName: 'Shirt',
    description: 'Archival streetwear, vintage denim, outerwear, and graphic tees',
    subcategories: [
      { id: 'Tops & Graphic Tees', name: 'Tops & Graphic Tees', slug: 'tops-graphic-tees' },
      { id: 'Outerwear & Jackets', name: 'Outerwear & Jackets', slug: 'outerwear-jackets' },
      { id: 'Denim & Bottoms', name: 'Denim & Bottoms', slug: 'denim-bottoms' },
      { id: 'Dresses & Skirts', name: 'Dresses & Skirts', slug: 'dresses-skirts' },
      { id: 'Knitwear & Sweaters', name: 'Knitwear & Sweaters', slug: 'knitwear-sweaters' },
      { id: 'Other', name: 'Other', slug: 'other' },
    ],
    sizeOptions: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL','OS'],
  },
  {
    id: 'Accessories',
    name: 'Accessories',
    shortName: 'Accessories',
    slug: 'accessories',
    iconName: 'Sparkles',
    description: 'Bags, archival sneakers, headwear, jewelry, and luxury eyewear',
    subcategories: [
      { id: 'Bags & Backpacks', name: 'Bags & Backpacks', slug: 'bags-backpacks' },
      { id: 'Footwear & Sneakers', name: 'Footwear & Sneakers', slug: 'footwear-sneakers' },
      { id: 'Headwear', name: 'Headwear', slug: 'headwear' },
      { id: 'Jewelry', name: 'Jewelry', slug: 'jewelry' },
      { id: 'Eyewear', name: 'Eyewear', slug: 'eyewear' },
      { id: 'Other', name: 'Other', slug: 'other' },
    ],
    sizeOptions: ['US 7', 'US 8', 'US 9', 'US 10', 'US 11', 'US 12', 'Small', 'Medium', 'Large', 'OS'],
  },
  {
    id: 'Tech & Retro Electronics',
    name: 'Tech & Electronics',
    shortName: 'Tech & Electronics',
    slug: 'tech-retro-electronics',
    iconName: 'Camera',
    description: 'CCD digicams, gaming handhelds, vintage electronics, and audio grails',
    subcategories: [
      { id: 'Digicams', name: 'Digicams', slug: 'digicams' },
      { id: 'Gaming', name: 'Gaming', slug: 'gaming' },
      { id: 'Electronics', name: 'Electronics', slug: 'electronics' },
      { id: 'Other', name: 'Other', slug: 'other' },
    ],
    sizeOptions: ['Compact', 'Pocket', 'Handheld', 'Standard Desktop', 'Modular', 'OS'],
  },
];

export const TECH_CONDITION_GRADES = [
  {
    value: 'Grade A - Mint',
    label: 'Grade A - Mint',
    badgeClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    description: '100% operational, pristine casing/optics, battery tested, no visible scratches or dead pixels.',
  },
  {
    value: 'Grade B - Good',
    label: 'Grade B - Good',
    badgeClass: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
    description: 'Fully functional, light cosmetic wear or minor patina consistent with vintage age.',
  },
  {
    value: 'Grade C - Fair',
    label: 'Grade C - Fair',
    badgeClass: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    description: 'Operational core features with noticeable wear, scuffs, or minor secondary flaws.',
  },
  {
    value: 'Spares & Repair',
    label: 'Spares & Repair',
    badgeClass: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    description: 'Non-functional or partially defective; sold as-is for restoration, parts, or display.',
  },
];

export const FOUR_POINT_OPERATIONAL_CHECKLIST = [
  {
    key: 'powerOnStatus',
    label: '1. Power-On & Boot Cycle Verification',
    description: 'Device powers on cleanly with steady indicator/display and zero startup error loops.',
  },
  {
    key: 'screenSensorClarity',
    label: '2. Screen, Sensor & Lens Clarity Inspection',
    description: 'LCD panel / optical glass inspected for fungus, dust haze, dead pixels, and scratches.',
  },
  {
    key: 'portChargingTested',
    label: '3. Port, Battery & Charging Circuit Test',
    description: 'Data ports, battery contacts, and charging cycles pass full continuity checks.',
  },
  {
    key: 'knownDefectsReported',
    label: '4. Full Defect & Patina Disclosure',
    description: 'All cosmetic or mechanical nuances have been transparently documented and photographed.',
  },
];

export function getCategoryById(categoryId) {
  if (!categoryId || categoryId === 'ALL') return null;
  const lower = categoryId.toLowerCase();
  return TAXONOMY.find(
    (c) =>
      c.id.toLowerCase() === lower ||
      c.name.toLowerCase() === lower ||
      c.shortName.toLowerCase() === lower ||
      c.slug.toLowerCase() === lower ||
      (c.id.includes('Tech') && lower.includes('tech'))
  );
}

export function getSubcategories(categoryId) {
  const cat = getCategoryById(categoryId);
  return cat ? cat.subcategories : [];
}

export function isTechCategory(categoryName) {
  if (!categoryName) return false;
  const lower = categoryName.toLowerCase();
  return (
    categoryName === 'Tech & Retro Electronics' ||
    categoryName === 'Tech & Electronics' ||
    lower.includes('tech') ||
    lower.includes('electronics')
  );
}
