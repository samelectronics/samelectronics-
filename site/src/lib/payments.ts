// R9 · every payment method we could offer, worldwide. The owner switches each on or off in the Control Room
// (Settings → Payment methods, site key 'payments'); /payments and the checkout show only the ones switched on.
// Defaults are the methods a Deira shop typically takes today and are marked to confirm.
export type Pay = { id: string; name: string; group: string; where: string; note?: string };
export const PAY_GROUPS = ['In the shop', 'Cards', 'Wallets', 'Pay later', 'Bank transfer', 'Money transfer', 'Regional', 'On delivery'];
export const PAYMENTS: Pay[] = [
  { id: 'cash', name: 'Cash (AED)', group: 'In the shop', where: 'Deira shop' },
  { id: 'card-pos', name: 'Card at the counter', group: 'In the shop', where: 'Deira shop', note: 'Visa, Mastercard and more on the shop terminal' },
  { id: 'visa', name: 'Visa', group: 'Cards', where: 'Worldwide' }, { id: 'mastercard', name: 'Mastercard', group: 'Cards', where: 'Worldwide' },
  { id: 'amex', name: 'American Express', group: 'Cards', where: 'Worldwide' }, { id: 'unionpay', name: 'UnionPay', group: 'Cards', where: 'China, Asia' },
  { id: 'jcb', name: 'JCB', group: 'Cards', where: 'Japan, Asia' }, { id: 'diners', name: 'Diners Club', group: 'Cards', where: 'Worldwide' }, { id: 'discover', name: 'Discover', group: 'Cards', where: 'USA' },
  { id: 'applepay', name: 'Apple Pay', group: 'Wallets', where: 'Worldwide' }, { id: 'googlepay', name: 'Google Pay', group: 'Wallets', where: 'Worldwide' }, { id: 'samsungpay', name: 'Samsung Pay', group: 'Wallets', where: 'Worldwide' },
  { id: 'paypal', name: 'PayPal', group: 'Wallets', where: 'Worldwide' }, { id: 'alipay', name: 'Alipay', group: 'Wallets', where: 'China' }, { id: 'wechat', name: 'WeChat Pay', group: 'Wallets', where: 'China' },
  { id: 'tabby', name: 'Tabby', group: 'Pay later', where: 'UAE, Saudi Arabia, Kuwait', note: 'Split in 4, no interest' }, { id: 'tamara', name: 'Tamara', group: 'Pay later', where: 'UAE, Saudi Arabia', note: 'Split in 3 or 4' },
  { id: 'postpay', name: 'Postpay', group: 'Pay later', where: 'UAE' }, { id: 'cashew', name: 'Cashew', group: 'Pay later', where: 'UAE' }, { id: 'klarna', name: 'Klarna', group: 'Pay later', where: 'Europe, USA' },
  { id: 'bank-uae', name: 'Bank transfer (UAE)', group: 'Bank transfer', where: 'UAE', note: 'For trade orders; goods ship when the transfer clears' },
  { id: 'swift', name: 'International transfer (SWIFT)', group: 'Bank transfer', where: 'Worldwide', note: 'For export orders' }, { id: 'sepa', name: 'SEPA transfer (EUR)', group: 'Bank transfer', where: 'Europe' },
  { id: 'wise', name: 'Wise', group: 'Money transfer', where: 'Worldwide' }, { id: 'payoneer', name: 'Payoneer', group: 'Money transfer', where: 'Worldwide' },
  { id: 'westernunion', name: 'Western Union', group: 'Money transfer', where: 'Worldwide' }, { id: 'moneygram', name: 'MoneyGram', group: 'Money transfer', where: 'Worldwide' },
  { id: 'mada', name: 'mada', group: 'Regional', where: 'Saudi Arabia' }, { id: 'stcpay', name: 'STC Pay', group: 'Regional', where: 'Saudi Arabia' }, { id: 'benefit', name: 'BenefitPay', group: 'Regional', where: 'Bahrain' },
  { id: 'knet', name: 'KNET', group: 'Regional', where: 'Kuwait' }, { id: 'fawry', name: 'Fawry', group: 'Regional', where: 'Egypt' }, { id: 'upi', name: 'UPI', group: 'Regional', where: 'India' },
  { id: 'mpesa', name: 'M-Pesa', group: 'Regional', where: 'Kenya, East Africa' }, { id: 'ideal', name: 'iDEAL', group: 'Regional', where: 'Netherlands' },
  { id: 'cod-cash', name: 'Cash on delivery', group: 'On delivery', where: 'UAE' }, { id: 'cod-card', name: 'Card on delivery', group: 'On delivery', where: 'UAE' },
];
export const PAY_DEFAULT: Record<string, boolean> = { cash: true, 'card-pos': true, visa: true, mastercard: true, 'bank-uae': true, swift: true, 'cod-cash': true };
