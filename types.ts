
export type ActivityCategory = 'attraction' | 'food' | 'accommodation' | 'transport' | 'custom';

export interface Activity {
  id: string;
  name: string;
  category: ActivityCategory;
  time: string; // HH:mm
  address: string;
  notes?: string;
  estimatedCost: number;
  actualCost: number;
  duration?: string;
  completed: boolean;
  latitude?: number;
  longitude?: number;
}

export interface DayPlan {
  date: string; // ISO string
  activities: Activity[];
}

export interface Accommodation {
  id: string;
  hotelName: string;
  address: string;
  checkIn: string;
  checkOut: string;
  bookingRef: string;
  cost: number;
  contactInfo: string;
}

export interface Tripmate {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'owner' | 'editor' | 'viewer';
}

export interface Trip {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  totalBudget: number;
  itinerary: DayPlan[];
  accommodations: Accommodation[];
  tripmates: Tripmate[];
  shareCode?: string;
  coverImage?: string;
}

export interface BudgetStats {
  category: string;
  planned: number;
  actual: number;
}
