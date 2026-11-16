/** True when the site runs inside the hero iPad (or any frame): no sounds, medals, tours, banners or tracking there. */
export const isEmbed = (): boolean => { try { return typeof window !== 'undefined' && window.self !== window.top; } catch { return true; } };
