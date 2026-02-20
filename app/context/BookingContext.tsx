import React, { createContext, useContext, useState } from 'react';

export interface Service {
  id: string;
  name: string;
  icon: string;
  duration: string;
  price: number;
  description: string;
  color: string;
}

export interface Booking {
  id: string;
  service: Service;
  date: string;
  time: string;
  address: string;
  rooms: number;
  notes: string;
  totalPrice: number;
  status: 'upcoming' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  memberSince: string;
  totalBookings: number;
}

export const SERVICES: Service[] = [
  {
    id: '1',
    name: 'Hemstädning',
    icon: 'home-outline',
    duration: '2–3 tim',
    price: 499,
    description: 'Grundlig städning av hela hemmet',
    color: '#0EA5E9',
  },
  {
    id: '2',
    name: 'Storstädning',
    icon: 'sparkles-outline',
    duration: '4–6 tim',
    price: 899,
    description: 'Djupstädning med allt ingår',
    color: '#10B981',
  },
  {
    id: '3',
    name: 'Fönsterputs',
    icon: 'water-outline',
    duration: '1–2 tim',
    price: 349,
    description: 'Fönsterputsning in- och utsida',
    color: '#8B5CF6',
  },
  {
    id: '4',
    name: 'Flyttstädning',
    icon: 'cube-outline',
    duration: '6–8 tim',
    price: 1299,
    description: 'Komplett städning vid flytt',
    color: '#F59E0B',
  },
  {
    id: '5',
    name: 'Kontorsstädning',
    icon: 'business-outline',
    duration: '2–4 tim',
    price: 699,
    description: 'Professionell kontorsstädning',
    color: '#EF4444',
  },
  {
    id: '6',
    name: 'Trappstädning',
    icon: 'layers-outline',
    duration: '1 tim',
    price: 249,
    description: 'Städning av trapphus och entré',
    color: '#06B6D4',
  },
];

const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'b1',
    service: SERVICES[0],
    date: '2026-02-25',
    time: '10:00',
    address: 'Storgatan 12, Stockholm',
    rooms: 3,
    notes: 'Ring på dörren',
    totalPrice: 499,
    status: 'upcoming',
    createdAt: '2026-02-20',
  },
  {
    id: 'b2',
    service: SERVICES[1],
    date: '2026-02-10',
    time: '09:00',
    address: 'Storgatan 12, Stockholm',
    rooms: 4,
    notes: '',
    totalPrice: 899,
    status: 'completed',
    createdAt: '2026-02-05',
  },
  {
    id: 'b3',
    service: SERVICES[2],
    date: '2026-01-28',
    time: '14:00',
    address: 'Storgatan 12, Stockholm',
    rooms: 0,
    notes: 'Utsidan också tack',
    totalPrice: 349,
    status: 'completed',
    createdAt: '2026-01-20',
  },
  {
    id: 'b4',
    service: SERVICES[3],
    date: '2026-01-15',
    time: '08:00',
    address: 'Gamla stan 5, Stockholm',
    rooms: 5,
    notes: 'Komplettflytt',
    totalPrice: 1299,
    status: 'completed',
    createdAt: '2026-01-10',
  },
  {
    id: 'b5',
    service: SERVICES[0],
    date: '2026-01-05',
    time: '11:00',
    address: 'Storgatan 12, Stockholm',
    rooms: 3,
    notes: '',
    totalPrice: 499,
    status: 'cancelled',
    createdAt: '2025-12-28',
  },
];

const MOCK_USER: UserProfile = {
  name: 'Anna Johansson',
  email: 'anna@example.com',
  phone: '+46 70 123 45 67',
  address: 'Storgatan 12, 111 23 Stockholm',
  memberSince: 'Januari 2025',
  totalBookings: 12,
};

interface BookingContextType {
  bookings: Booking[];
  user: UserProfile;
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => void;
  cancelBooking: (id: string) => void;
  updateUser: (updates: Partial<UserProfile>) => void;
}

const BookingContext = createContext<BookingContextType | null>(null);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
  const [user, setUser] = useState<UserProfile>(MOCK_USER);

  const addBooking = (bookingData: Omit<Booking, 'id' | 'createdAt'>) => {
    const newBooking: Booking = {
      ...bookingData,
      id: `b${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setBookings(prev => [newBooking, ...prev]);
  };

  const cancelBooking = (id: string) => {
    setBookings(prev =>
      prev.map(b => (b.id === id ? { ...b, status: 'cancelled' } : b))
    );
  };

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  return (
    <BookingContext.Provider value={{ bookings, user, addBooking, cancelBooking, updateUser }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be inside BookingProvider');
  return ctx;
}
