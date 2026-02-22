export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface Service {
  id: string;
  name: string;
  category: string;
  categoryLabel: string;
  price: number;
  unit: string;
  duration: string;
  rating: number;
  reviewCount: number;
  image: string;
  icon: string;
  color: string;
  description: string;
  includes: string[];
}

export interface Booking {
  id: string;
  userId: string;
  serviceId: string;
  serviceName: string;
  serviceImage: string;
  date: string;
  time: string;
  address: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  total: number;
  notes: string;
}

// ── Mock databas ───────────────────────────────────────────────────────────────

const users: (User & { password: string })[] = [
  {
    id: '1',
    name: 'Erik Svensson',
    email: 'test@cleanpro.se',
    phone: '070-123 45 67',
    password: '123456',
  },
];

let bookingsDb: Booking[] = [
  {
    id: 'b1',
    userId: '1',
    serviceId: '2',
    serviceName: 'Djupstädning',
    serviceImage:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
    date: '2026-03-05',
    time: '10:00',
    address: 'Storgatan 12, Stockholm',
    status: 'confirmed',
    total: 650,
    notes: '',
  },
  {
    id: 'b2',
    userId: '1',
    serviceId: '1',
    serviceName: 'Standardstädning',
    serviceImage:
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=80',
    date: '2026-02-10',
    time: '14:00',
    address: 'Storgatan 12, Stockholm',
    status: 'completed',
    total: 700,
    notes: 'Vardagsrum och sovrum prioriteras',
  },
];

export const services: Service[] = [
  {
    id: '1',
    name: 'Standardstädning',
    category: 'hem',
    categoryLabel: 'Hemstädning',
    price: 350,
    unit: 'tim',
    duration: '2–4 timmar',
    rating: 4.8,
    reviewCount: 142,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80',
    icon: 'home',
    color: '#2563EB',
    description:
      'Grundlig städning av alla rum i ditt hem. Inkluderar dammsugning, moppning, dammtorkning och sanering.',
    includes: ['Dammsugning & moppning', 'Dammtorkning', 'Köksrengöring', 'Badrumsstädning', 'Fönsterputs'],
  },
  {
    id: '2',
    name: 'Djupstädning',
    category: 'hem',
    categoryLabel: 'Hemstädning',
    price: 650,
    unit: 'paket',
    duration: '4–8 timmar',
    rating: 4.9,
    reviewCount: 98,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    icon: 'sparkles',
    color: '#10B981',
    description:
      'Grundlig djupstädning av hem eller lägenhet. Varje hörn rengörs noggrant med hygiengaranti.',
    includes: ['Allmän städning', 'Inuti skåp', 'Ugn & kylskåp', 'Balkong', 'Detaljerat badrum'],
  },
  {
    id: '3',
    name: 'Flyttstädning',
    category: 'hem',
    categoryLabel: 'Hemstädning',
    price: 900,
    unit: 'paket',
    duration: '6–10 timmar',
    rating: 4.7,
    reviewCount: 67,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
    icon: 'cube',
    color: '#F59E0B',
    description:
      'Grundlig städning före eller efter flytt. Vi ser till att bostaden lämnas i perfekt skick.',
    includes: ['Full djupstädning', 'Vägg­rengöring', 'Golvpolering', 'Ytterdörr', 'Terrass/balkong'],
  },
  {
    id: '4',
    name: 'Kontorsstädning',
    category: 'kontor',
    categoryLabel: 'Kontorsstädning',
    price: 400,
    unit: 'tim',
    duration: '2–6 timmar',
    rating: 4.8,
    reviewCount: 53,
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80',
    icon: 'briefcase',
    color: '#8B5CF6',
    description:
      'Professionell kontorsstädning. Håll er arbetsplats hygienisk och välordnad för ökad produktivitet.',
    includes: ['Bord & stolar', 'Golvrengöring', 'Pentry/kokvrå', 'Toaletter', 'Dörrar & fönster'],
  },
  {
    id: '5',
    name: 'Fönsterputs',
    category: 'special',
    categoryLabel: 'Specialtjänster',
    price: 280,
    unit: 'paket',
    duration: '1–3 timmar',
    rating: 4.6,
    reviewCount: 89,
    image: 'https://images.unsplash.com/photo-1527515545081-5db817172677?w=600&q=80',
    icon: 'tablet-portrait',
    color: '#06B6D4',
    description:
      'Professionell puts av invändiga och utvändiga fönster. Kristallklara fönster med experthjälp.',
    includes: ['Invändiga fönster', 'Utvändiga fönster', 'Bågputs', 'Persienner'],
  },
  {
    id: '6',
    name: 'Matta- & möbeltvätt',
    category: 'special',
    categoryLabel: 'Specialtjänster',
    price: 200,
    unit: 'st',
    duration: '2–4 timmar',
    rating: 4.9,
    reviewCount: 112,
    image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&q=80',
    icon: 'color-palette',
    color: '#EC4899',
    description:
      'Djuptvättning av mattor och möbler. Fläck- och luktborttagning för ett fräscht hem.',
    includes: ['Kemtvätt', 'Fläckborttagning', 'Luktborttagning', 'Snabb torkning'],
  },
  {
    id: '7',
    name: 'Köksrengöring',
    category: 'special',
    categoryLabel: 'Specialtjänster',
    price: 300,
    unit: 'paket',
    duration: '2–3 timmar',
    rating: 4.7,
    reviewCount: 76,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80',
    icon: 'restaurant',
    color: '#F97316',
    description:
      'Detaljerad rengöring av köket. Ugn, kylskåp och alla vitvaror rengörs grundligt.',
    includes: ['Insida ugn', 'Kylskåp', 'Spis & fläkt', 'Skåpdörrar', 'Diskho & kranar'],
  },
];

// ── API-simulering ─────────────────────────────────────────────────────────────

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const api = {
  // Auth
  async login(email: string, password: string) {
    await delay(800);
    const user = users.find((u) => u.email === email && u.password === password);
    if (!user) throw new Error('Felaktig e-postadress eller lösenord.');
    const token = `token_${user.id}_${Date.now()}`;
    return { user: { id: user.id, name: user.name, email: user.email, phone: user.phone }, token };
  },

  async register(name: string, email: string, phone: string, password: string) {
    await delay(1000);
    if (users.find((u) => u.email === email)) throw new Error('Den här e-postadressen är redan registrerad.');
    const newUser = { id: String(users.length + 1), name, email, phone, password };
    users.push(newUser);
    const token = `token_${newUser.id}_${Date.now()}`;
    return { user: { id: newUser.id, name, email, phone }, token };
  },

  // Services
  async getServices(category?: string): Promise<Service[]> {
    await delay(400);
    if (category && category !== 'alla') {
      return services.filter((s) => s.category === category);
    }
    return services;
  },

  async getService(id: string): Promise<Service> {
    await delay(200);
    const service = services.find((s) => s.id === id);
    if (!service) throw new Error('Tjänsten hittades inte.');
    return service;
  },

  // Bookings
  async getBookings(userId: string): Promise<Booking[]> {
    await delay(600);
    return [...bookingsDb]
      .filter((b) => b.userId === userId)
      .sort((a, b) => b.date.localeCompare(a.date));
  },

  async createBooking(data: {
    userId: string;
    serviceId: string;
    serviceName: string;
    serviceImage: string;
    date: string;
    time: string;
    address: string;
    notes: string;
    total: number;
  }): Promise<Booking> {
    await delay(900);
    const newBooking: Booking = {
      id: `b${Date.now()}`,
      ...data,
      status: 'confirmed',
    };
    bookingsDb.push(newBooking);
    return newBooking;
  },

  async cancelBooking(bookingId: string): Promise<void> {
    await delay(500);
    const b = bookingsDb.find((b) => b.id === bookingId);
    if (b) b.status = 'cancelled';
  },
};
