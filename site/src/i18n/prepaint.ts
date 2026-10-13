/** Inline <head> script (G9): applies the saved language (lang + dir) before the first paint. */
export const LANG_KEY = 'se-lang';
export const PRE_PAINT = `try{var l=localStorage.getItem('${LANG_KEY}');if(l==='ar'){document.documentElement.lang='ar';document.documentElement.dir='rtl';}}catch(e){}`;
