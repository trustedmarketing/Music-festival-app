// Venue progression system — upgrade your festival venue as you level up

export interface Venue {
  id: string;
  name: string;
  emoji: string;
  capacity: number;
  description: string;
  unlockLevel: number;
  attendanceMultiplier: number;
  color: string;
}

export const VENUES: Venue[] = [
  {
    id: 'park',
    name: 'Park Pavilion',
    emoji: '🏕️',
    capacity: 5000,
    description: 'A cozy outdoor pavilion in the local park',
    unlockLevel: 0,
    attendanceMultiplier: 1.0,
    color: '#4CAF50',
  },
  {
    id: 'amphitheatre',
    name: 'Local Amphitheatre',
    emoji: '🎭',
    capacity: 15000,
    description: 'An open-air amphitheatre with great acoustics',
    unlockLevel: 2,
    attendanceMultiplier: 1.3,
    color: '#2196F3',
  },
  {
    id: 'indoor_stadium',
    name: 'Indoor Stadium',
    emoji: '🏟️',
    capacity: 40000,
    description: 'A climate-controlled arena with massive production',
    unlockLevel: 5,
    attendanceMultiplier: 1.6,
    color: '#9C27B0',
  },
  {
    id: 'outdoor_stadium',
    name: 'Outdoor Stadium',
    emoji: '🏟️',
    capacity: 80000,
    description: 'A giant open-air stadium under the stars',
    unlockLevel: 8,
    attendanceMultiplier: 2.0,
    color: '#FF9800',
  },
  {
    id: 'mega_festival',
    name: 'Mega Festival Grounds',
    emoji: '🌍',
    capacity: 250000,
    description: 'Woodstock-scale festival grounds — the stuff of legend',
    unlockLevel: 12,
    attendanceMultiplier: 3.0,
    color: '#F44336',
  },
];

export function getAvailableVenues(level: number): Venue[] {
  return VENUES.filter(v => v.unlockLevel <= level);
}

export function getNextVenue(level: number): Venue | null {
  return VENUES.find(v => v.unlockLevel > level) || null;
}
