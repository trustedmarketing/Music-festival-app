// In-app store for purchasing extra budget points

export interface StoreItem {
  id: string;
  name: string;
  description: string;
  emoji: string;
  pointsAwarded: number;
  priceDisplay: string; // Display price (e.g. "$0.99")
  priceCents: number;   // Actual price in cents for IAP
  popular?: boolean;
  bestValue?: boolean;
}

export const STORE_ITEMS: StoreItem[] = [
  {
    id: 'points_3',
    name: 'Small Boost',
    description: '+$3 festival budget',
    emoji: '🎟️',
    pointsAwarded: 3,
    priceDisplay: '$0.99',
    priceCents: 99,
  },
  {
    id: 'points_5',
    name: 'Medium Boost',
    description: '+$5 festival budget',
    emoji: '🎫',
    pointsAwarded: 5,
    priceDisplay: '$1.99',
    priceCents: 199,
    popular: true,
  },
  {
    id: 'points_10',
    name: 'Big Boost',
    description: '+$10 festival budget',
    emoji: '💎',
    pointsAwarded: 10,
    priceDisplay: '$2.99',
    priceCents: 299,
    bestValue: true,
  },
  {
    id: 'points_20',
    name: 'Mega Boost',
    description: '+$20 festival budget',
    emoji: '🏆',
    pointsAwarded: 20,
    priceDisplay: '$4.99',
    priceCents: 499,
  },
];
