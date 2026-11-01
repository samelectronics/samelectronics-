// R9 · the questions people ask, by topic. Each page shows its own topic; /faq shows them all with a search. Answers that
// depend on the owner's final terms say "sample". The Control Room can override any topic (site key 'faq').
export type Topic = 'shop' | 'repair' | 'wholesale' | 'worldwide' | 'payments' | 'membership' | 'account';
export const TOPICS: { id: Topic; name: string; theme: string; icon: string }[] = [
  { id: 'shop', name: 'Parts & grades', theme: 'label', icon: 'M21 8 12 3 3 8v8l9 5 9-5zM3 8l9 5 9-5M12 13v8' },
  { id: 'repair', name: 'Repairs', theme: 'ticket', icon: 'M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z' },
  { id: 'wholesale', name: 'Trade & wholesale', theme: 'pallet', icon: 'M3 21h18M5 21V10l7-5 7 5v11M9 21v-6h6v6' },
  { id: 'worldwide', name: 'Shipping worldwide', theme: 'ship', icon: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM2 12h20M12 2c3 3 4 6 4 10s-1 7-4 10c-3-3-4-6-4-10s1-7 4-10' },
  { id: 'payments', name: 'Payments', theme: 'card', icon: 'M2 6h20v12H2zM2 10h20M6 15h4' },
  { id: 'membership', name: 'Sam Circuit cards', theme: 'chip', icon: 'M6 6h12v12H6zM9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4' },
  { id: 'account', name: 'Your account', theme: 'bench', icon: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0' },
];
export const FAQ: Record<Topic, [string, string][]> = {
  shop: [
    ['What do the grades mean?', 'Service Pack is the original part from the phone maker, in its own box. Original Pulled is original, taken from another phone and tested. Premium and Standard are high-quality aftermarket parts. Every grade is labelled on the part and in the shop.'],
    ['Is every part tested?', 'Yes. Screens, batteries, cameras and flex cables are tested on the bench before they ship or are fitted.'],
    ['How do I know a part fits my phone?', 'Add your phone under My devices and the shop marks every part that fits. Not sure of your model? Use the model code lookup on the Repair page.'],
    ['Are the prices on the site final?', 'Prices shown now are samples while the shop is being set up. Final prices come from our stock system and appear here automatically.'],
    ['What warranty do parts have?', 'Each grade has its own warranty, shown on the part. Service Pack and Original grades carry the longest. The full terms are on the Warranty page.'],
  ],
  repair: [
    ['How long does a repair take?', 'Most screen and battery fits take under an hour while you wait in Deira. Board work can take a day or more; we tell you before we start.'],
    ['Do I pay before the repair?', 'No. You see the part price and fitting fee upfront, approve it, and pay when the phone is ready.'],
    ['Will my data be safe?', 'We do not need your passcode for most repairs, and we never open your apps or photos. Back up your phone before any repair to be safe.'],
    ['What if the repair does not work?', 'If we cannot fix it, you pay nothing for the fitting. Repairs carry the warranty of the part used.'],
    ['How do I find my model?', 'Look in Settings → About phone for the model number (for example SM-A546). The Repair page shows where to find it on each brand.'],
  ],
  wholesale: [
    ['Who can get trade prices?', 'Repair shops, phone shops and resellers with a valid trade licence. Apply once; after approval every part shows your trade price.'],
    ['Is there a minimum order?', 'No fixed minimum for approved trade accounts. Bulk quotes are available for larger orders.'],
    ['How fast is approval?', 'Usually within one working day after we check your licence.'],
    ['Can I order on credit?', 'Credit terms are offered to long-standing trade partners case by case. Ask your account manager.'],
  ],
  worldwide: [
    ['Do you ship outside the UAE?', 'Yes. We ship to the GCC, Africa, Asia and Europe by courier or cargo. Delivery time and cost are shown before you pay.'],
    ['Who pays customs and duties?', 'Duties are paid by the receiver unless agreed otherwise. We provide a full commercial invoice for every shipment.'],
    ['Can you ship to a freight forwarder?', 'Yes. Give us the forwarder address in Dubai and we deliver it there, often the same day.'],
    ['How are parts packed?', 'Screens travel in rigid cartons with foam; batteries ship under dangerous-goods rules.'],
  ],
  payments: [
    ['Which payment methods do you accept?', 'The methods available today are listed on the Payments page. The owner switches methods on and off, so the list is always current.'],
    ['Is VAT included?', 'Prices for UAE customers include 5% VAT, shown separately at checkout. Export orders are zero-rated.'],
    ['Can I pay cash in the shop?', 'Yes, cash and card are accepted in our Deira shop.'],
  ],
  membership: [
    ['What is Sam Circuit?', 'Our membership: one card for customers, one for repair shops and suppliers, and an invitation-only card for our most loyal customers.'],
    ['Do repairs earn points?', 'Yes. The part and the fitting fee both count.'],
    ['How do I join?', 'Create an account. The customer card is yours at once; the trade card follows trade approval.'],
  ],
  account: [
    ['Do I need an account to order?', 'No. You can check out as a guest. An account keeps your orders, devices, saved parts and points in one place.'],
    ['When can I write a review?', 'After staff confirm your order. Reviews are marked Verified purchase so other buyers can trust them.'],
    ['How do I delete my data?', 'Use the privacy form on the Contact page. We answer within 30 days.'],
  ],
};
