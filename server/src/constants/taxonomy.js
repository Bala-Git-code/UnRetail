/**
 * UnRetail Standard Multi-Tier Taxonomy (Backend)
 */

export const TAXONOMY = [
  {
    id: 'Apparel',
    name: 'Apparel / Clothing',
    shortName: 'Apparel',
    slug: 'apparel',
    subcategories: [
      { id: 'Tops & Graphic Tees', name: 'Tops & Graphic Tees', slug: 'tops-graphic-tees' },
      { id: 'Outerwear & Jackets', name: 'Outerwear & Jackets', slug: 'outerwear-jackets' },
      { id: 'Denim & Bottoms', name: 'Denim & Bottoms', slug: 'denim-bottoms' },
      { id: 'Dresses & Skirts', name: 'Dresses & Skirts', slug: 'dresses-skirts' },
      { id: 'Knitwear & Sweaters', name: 'Knitwear & Sweaters', slug: 'knitwear-sweaters' },
      { id: 'Other', name: 'Other', slug: 'other' },
    ],
  },
  {
    id: 'Accessories',
    name: 'Accessories',
    shortName: 'Accessories',
    slug: 'accessories',
    subcategories: [
      { id: 'Bags & Backpacks', name: 'Bags & Backpacks', slug: 'bags-backpacks' },
      { id: 'Footwear & Sneakers', name: 'Footwear & Sneakers', slug: 'footwear-sneakers' },
      { id: 'Headwear', name: 'Headwear', slug: 'headwear' },
      { id: 'Jewelry', name: 'Jewelry', slug: 'jewelry' },
      { id: 'Eyewear', name: 'Eyewear', slug: 'eyewear' },
      { id: 'Other', name: 'Other', slug: 'other' },
    ],
  },
  {
    id: 'Tech & Retro Electronics',
    name: 'Tech & Electronics',
    shortName: 'Tech & Electronics',
    slug: 'tech-retro-electronics',
    subcategories: [
      { id: 'Digicams', name: 'Digicams', slug: 'digicams' },
      { id: 'Gaming', name: 'Gaming', slug: 'gaming' },
      { id: 'Electronics', name: 'Electronics', slug: 'electronics' },
      { id: 'Other', name: 'Other', slug: 'other' },
    ],
  },
];

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
