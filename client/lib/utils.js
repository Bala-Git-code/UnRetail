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
      return 'Like New';
    case 'GENTLY_USED':
      return 'Gently Used';
    case 'FLAWED':
      return 'Flawed';
    default:
      return condition || 'Good';
  }
}
