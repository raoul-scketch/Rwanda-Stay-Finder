import { useState, useCallback } from 'react';
import type { PaymentMethod } from '@workspace/api-client-react';

export type BookingDraft = {
  accommodationId: number | null;
  checkIn: string | null;
  checkOut: string | null;
  guests: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  specialRequests: string;
  paymentMethod: PaymentMethod | null;
};

const initialState: BookingDraft = {
  accommodationId: null,
  checkIn: null,
  checkOut: null,
  guests: 1,
  guestName: "",
  guestEmail: "",
  guestPhone: "",
  specialRequests: "",
  paymentMethod: null,
};

// Simple singleton for demo purposes to share across routes if needed,
// though usually we'd use Context or Zustand. For this app, local state in the flow is fine,
// but we'll export a custom hook structure.
export function useBookingState(initial?: Partial<BookingDraft>) {
  const [draft, setDraft] = useState<BookingDraft>({ ...initialState, ...initial });

  const updateDraft = useCallback((updates: Partial<BookingDraft>) => {
    setDraft(prev => ({ ...prev, ...updates }));
  }, []);

  const resetDraft = useCallback(() => {
    setDraft(initialState);
  }, []);

  return { draft, updateDraft, resetDraft };
}
