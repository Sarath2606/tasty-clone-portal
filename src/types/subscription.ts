export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in months
  features: string[];
  isPopular?: boolean;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  plan: SubscriptionPlan;
  status: 'active' | 'cancelled' | 'expired';
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  paymentMethod: string;
  lastPaymentDate: Date;
  nextPaymentDate?: Date;
  totalAmount: number;
}

export type SubscriptionStatus = Subscription['status']; 