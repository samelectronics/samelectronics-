// P1 · The site's backend contract. Every page talks to `backend` (src/lib/backend/index.ts) through these methods only,
// so switching from the demo (this device) to Supabase changes nothing in the pages.
//   · local    — works today with no server: everything is kept in this browser (demo accounts, orders, chats…)
//   · supabase — used automatically once NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set
//                (tables, security rules and triggers: supabase/schema.sql; e-mails: Resend, see supabase/README.md)

export type Role = 'owner' | 'manager' | 'accountant' | 'sales' | 'warehouse' | 'technician' | 'support' | 'editor';
export type User = {
  id: string; email: string; name: string; phone?: string; verified: boolean; createdAt: number;
  kind: 'customer' | 'wholesale'; tradeApproved: boolean; points: number; card?: { kind: 'circuit' | 'grid' | 'circle'; no: string; level: number } | null;
  avatar?: string; country?: string; city?: string; lang?: string; contactEmail?: string;
};
export type Company = {
  id: string; owner: string; name: string; tradeLicence?: string; trn?: string; kind: 'repair-shop' | 'trader' | 'exporter' | 'retailer' | 'other';
  phone?: string; email?: string; website?: string; locations: { id: string; label: string; address: string; city: string; country: string; main?: boolean }[];
  approved: boolean; note?: string; createdAt: number;
};
export type OrderLine = { id: string; title: string; grade: string; qty: number; unit: number };
export type Order = {
  id: string; no: string; user?: string; email: string; name: string; phone: string; lines: OrderLine[]; sub: number; vat: number; ship: number; total: number;
  delivery: 'pickup' | 'uae' | 'world'; address?: string; country?: string; note?: string; status: 'New' | 'Quoted' | 'Confirmed' | 'Ready' | 'Collected / Shipped' | 'Closed' | 'Cancelled';
  pay: 'whatsapp' | 'cash' | 'card' | 'transfer'; company?: string; createdAt: number; history: { at: number; status: string; by?: string }[];
};
export type Review = { id: string; product: string; user: string; name: string; stars: number; title: string; text: string; verified: boolean; at: number };
export type Message = { id: string; thread: string; from: 'visitor' | 'staff' | 'samsoom'; name: string; text: string; at: number; read?: boolean };
export type Thread = { id: string; user?: string; name: string; email?: string; topic: string; status: 'open' | 'waiting' | 'closed'; at: number; last: string; unread: number; assigned?: string };
export type Staff = {
  id: string; email: string; name: string; role: Role; title: string; photo?: string; phone?: string; branch: string; active: boolean;
  perms: Perm[]; joined: number; lastSeen?: number;
};
export type Perm =
  | 'products' | 'prices' | 'stock' | 'orders' | 'repairs' | 'customers' | 'approvals' | 'chat' | 'content' | 'samsoom' | 'banners'
  | 'accounting' | 'reports' | 'emails' | 'staff' | 'settings' | 'audit';
export type Application = { id: string; type: 'job' | 'wholesale' | 'membership' | 'circle'; name: string; email: string; phone?: string; data: Record<string, string>; status: 'new' | 'reviewing' | 'approved' | 'declined'; at: number };
export type Audit = { id: string; staff: string; action: string; target: string; at: number; detail?: string };
export type Result<T> = { ok: true; data: T } | { ok: false; error: string };

export interface Backend {
  mode: 'local' | 'supabase';
  // accounts (customers) — real e-mail confirmation on Supabase; the demo shows the code on screen
  me(): Promise<User | null>;
  signUp(i: { email: string; password: string; name: string; phone?: string; kind?: User['kind'] }): Promise<Result<{ needsVerify: boolean; demoCode?: string }>>;
  verify(email: string, code: string): Promise<Result<User>>;
  resend(email: string): Promise<Result<{ demoCode?: string }>>;
  signIn(email: string, password: string): Promise<Result<User>>;
  signOut(): Promise<void>;
  resetPassword(email: string): Promise<Result<{ demoCode?: string }>>;
  updateMe(p: Partial<User>): Promise<Result<User>>;
  linkCard(kind: 'circuit' | 'grid' | 'circle', no: string): Promise<Result<User>>;
  // companies (on top of the personal profile)
  companies(): Promise<Company[]>;
  saveCompany(c: Partial<Company> & { name: string }): Promise<Result<Company>>;
  removeCompany(id: string): Promise<void>;
  // orders
  placeOrder(o: Omit<Order, 'id' | 'no' | 'createdAt' | 'history' | 'status'>): Promise<Result<Order>>;
  myOrders(): Promise<Order[]>;
  // reviews (only account holders; "verified" when they bought it)
  reviews(product: string): Promise<Review[]>;
  addReview(r: { product: string; stars: number; title: string; text: string }): Promise<Result<Review>>;
  // live chat with the team + contact forms
  threads(): Promise<Thread[]>;
  messages(thread: string): Promise<Message[]>;
  send(i: { thread?: string; name: string; email?: string; topic?: string; text: string; from?: Message['from'] }): Promise<Result<{ thread: string }>>;
  apply(a: Omit<Application, 'id' | 'status' | 'at'>): Promise<Result<Application>>;
  // staff (Control Room)
  staffMe(): Promise<Staff | null>;
  staffSignIn(email: string, password: string): Promise<Result<Staff>>;
  staffSignOut(): Promise<void>;
  staffList(): Promise<Staff[]>;
  saveStaff(s: Partial<Staff> & { email: string; name: string; role: Role }): Promise<Result<Staff>>;
  allOrders(): Promise<Order[]>;
  setOrderStatus(id: string, status: Order['status']): Promise<Result<Order>>;
  customers(): Promise<User[]>;
  approveTrade(userId: string, ok: boolean): Promise<Result<User>>;
  applications(): Promise<Application[]>;
  setApplication(id: string, status: Application['status']): Promise<void>;
  audit(): Promise<Audit[]>;
  log(action: string, target: string, detail?: string): Promise<void>;
  // site settings edited from the Control Room (banners, Samsoom emotes, section texts, prices, stock…)
  setting<T>(key: string, fallback: T): Promise<T>;
  saveSetting<T>(key: string, value: T): Promise<void>;
}

/** what each role may do by default (owner and managers: everything). The owner can change these per person. */
export const ROLE_PERMS: Record<Role, Perm[]> = {
  owner: ['products', 'prices', 'stock', 'orders', 'repairs', 'customers', 'approvals', 'chat', 'content', 'samsoom', 'banners', 'accounting', 'reports', 'emails', 'staff', 'settings', 'audit'],
  manager: ['products', 'prices', 'stock', 'orders', 'repairs', 'customers', 'approvals', 'chat', 'content', 'samsoom', 'banners', 'accounting', 'reports', 'emails', 'staff', 'settings', 'audit'],
  accountant: ['orders', 'accounting', 'reports', 'customers'],
  sales: ['orders', 'customers', 'chat', 'stock'],
  warehouse: ['stock', 'orders', 'products'],
  technician: ['repairs', 'stock', 'chat'],
  support: ['chat', 'orders', 'customers'],
  editor: ['content', 'banners', 'samsoom', 'products'],
};
export const ROLE_NAMES: Record<Role, string> = { owner: 'Owner', manager: 'Manager', accountant: 'Accountant', sales: 'Sales', warehouse: 'Warehouse', technician: 'Technician', support: 'Customer support', editor: 'Content editor' };
