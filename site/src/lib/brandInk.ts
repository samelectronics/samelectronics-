// Owner (16 Nov): brand buttons show each brand in its own colour, like its real logo.
export const BRAND_INK: Record<string, string> = {
  apple: '#000000', samsung: '#1428A0', xiaomi: '#FF6900', redmi: '#E4002B', poco: '#D9A300', huawei: '#CF0A2C', honor: '#0B1F3A',
  oppo: '#046A38', realme: '#D9A300', oneplus: '#EB0028', vivo: '#415FFF', infinix: '#111111', tecno: '#0055A5', google: '#4285F4', pixel: '#4285F4',
  nokia: '#124191', motorola: '#5C92FA', sony: '#000000', lg: '#A50034', itel: '#E60012', zte: '#008ED3', lenovo: '#E2231A', nothing: '#111111',
};
export const brandInk = (id: string) => BRAND_INK[id] || BRAND_INK[id.replace(/-.*$/, '')] || '#26282B';
