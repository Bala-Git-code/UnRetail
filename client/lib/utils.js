import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCondition(condition) {
  switch (condition) {
    case 'LIKE_NEW':
      return 'Pristine / Like New';
    case 'GENTLY_USED':
      return 'Gently Loved';
    case 'FLAWED':
      return 'Vintage Character';
    default:
      return condition || 'Curated Quality';
  }
}
