/** Inline <head> script (G9): applies the saved language (lang + dir) before the first paint. */
export const LANG_KEY = 'se-lang';
export const PRE_PAINT = `try{if(location.pathname==='/'&&!sessionStorage.getItem('se-booted')&&!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('se-boot');setTimeout(function(){document.documentElement.classList.remove('se-boot')},6000);}}catch(e){}try{var l=localStorage.getItem('${LANG_KEY}');if(l==='ar'){document.documentElement.lang='ar';document.documentElement.dir='rtl';}}catch(e){}`;
