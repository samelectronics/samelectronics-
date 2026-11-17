// Owner (17 Nov): "Samsoom must support our 24 languages." The words Samsoom understands, in every site language
// (en de fr es it pt ca gl eu ro ru zh ar fa ur hi ml am om sw ha ig yo tl). Each English key is the meaning; the list
// holds how people write it. Matching is done on normalised text (lower case, accents removed), so write the words
// plainly. Words in scripts without spaces (Chinese) or that take endings (Indic, Ethiopic) match inside longer words.

export const N = (s: string) =>
  ' ' + String(s || '').toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .replace(/[ً-ْـ]/g, '').replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي')
    .replace(/[’'`]/g, '').replace(/[^\p{L}\p{N}]+/gu, ' ').replace(/(\p{L})\1{2,}/gu, '$1$1').trim() + ' ';

const latin = (w: string) => /^[a-z0-9 ]+$/.test(w);
const cjk = (w: string) => /[\u3040-\u9fff]/.test(w);
/** one word in the (normalised) text: Latin and short words must stand alone; Chinese, and longer words in other
 *  scripts, may sit inside a longer word (endings and particles are glued on in those languages) */
export const hit = (n: string, w: string) => (cjk(w) ? n.includes(w) : latin(w) ? n.includes(' ' + w + ' ') || (w.length > 5 && !w.includes(' ') && n.includes(w)) : w.length <= 3 ? n.includes(' ' + w + ' ') : n.includes(w));
/** true when one of the words is in the (normalised) text */
export const has = (n: string, words: string[]) => words.some((w) => hit(n, w));

const L = (s: string) => s.split('|').map((w) => N(w).trim()).filter(Boolean);

/** business words: any of these adds the English word in front, so the rest of the brain reads every language */
export const CANON: Record<string, string[]> = {
  screen: L('screen|display|lcd|oled|touch|glass|bildschirm|ecran|pantalla|schermo|tela|ecra|pantaila|экран|дисплей|屏幕|屏|صفحه|نمایشگر|اسکرین|سکرین|شاشه|स्क्रीन|डिस्प्ले|സ്ക്രീൻ|ഡിസ്പ്ലേ|ስክሪን|skriinii|skrini|allon fuska|fuska|ihuenyo|iboju|iskrin'),
  battery: L('battery|batt|akku|batterie|bateria|batteria|baterie|bateria|aki|аккумулятор|батарея|батарейка|电池|باتری|بیٹری|بطاريه|बैटरी|ബാറ്ററി|ባትሪ|baatirii|betri|batir|batrị|batiri|baterya'),
  charging: L('charging|charger|charge port|port|ladebuchse|ladeanschluss|connecteur|port de charge|puerto de carga|conector de carga|porta di ricarica|connettore|conector|porta de carregamento|kargatzeko|mufa|разъем|зарядки|充电口|尾插|پورت شارژ|چارجنگ|منفذ الشحن|سوكت|चार्जिंग पोर्ट|ചാർജിംഗ് പോർട്ട്|የቻርጅ|chaarjii|kuchaji|caji|chaja|agbara|charging port'),
  camera: L('camera|cam|lens|kamera|camara|fotocamera|camera|kamera|камера|摄像头|相机|镜头|دوربین|کیمرہ|كاميرا|कैमरा|ക്യാമറ|ካሜራ|kaameraa|kyamara|igwefoto|kamẹra'),
  'back cover': L('back cover|backcover|back glass|ruckseite|ruckdeckel|dos|vitre arriere|tapa trasera|tapa|cover posteriore|scocca|tampa traseira|tapa del darrere|atzeko|capac spate|задняя крышка|крышка|后盖|درب پشت|بیک کور|غطاء خلفي|ظهر|बैक कवर|ബാക്ക് കവർ|የኋላ ሽፋን|kava ya nyuma|murfin baya|akpuchi azụ|ideri ẹhin|takip sa likod'),
  frame: L('frame|housing|chassis|rahmen|gehause|cadre|chassis|marco|carcasa|telaio|aro|carcaca|marc|markoa|rama|carcasa|рамка|корпус|中框|边框|فریم|بدنه|فریم|اطار|هيكل|फ्रेम|ഫ്രെയിം|ፍሬም'),
  speaker: L('speaker|earpiece|microphone|mic|lautsprecher|mikrofon|haut parleur|micro|altavoz|microfono|altoparlante|alto falante|altaveu|bozgorailu|difuzor|динамик|микрофон|扬声器|听筒|麦克风|بلندگو|اسپیکر|سپیکر|مايك|سماعه|स्पीकर|माइक|സ്പീക്കർ|ድምጽ ማጉያ|spika|lasifika'),
  hours: L('open|opening|hours|closed|close|offen|geoffnet|offnungszeiten|geschlossen|ouvert|horaires|ferme|abierto|horario|cerrado|aperto|orari|chiuso|aberto|horario|fechado|obert|horari|tancat|irekita|ordutegia|itxita|deschis|program|inchis|открыто|часы работы|закрыто|营业|开门|关门|几点开|باز|ساعت کاری|تعطیل|کھلا|اوقات|بند|مفتوح|دوام|مسكر|مغلق|खुला|समय|बंद|തുറന്ന|സമയം|ክፍት|ሰዓት|banaa|cufaa|wazi|saa ngapi|imefungwa|a bude|a rufe|meghere|mechiri|ṣi silẹ|ti ti|bukas|sarado'),
  shipping: L('ship|shipping|deliver|delivery|send|versand|liefern|lieferung|versenden|livraison|livrer|expedition|envoyer|envio|enviar|envian|entrega|spedizione|spedire|consegna|spedite|envio|entrega|enviam|enviament|bidalketa|bidali|livrare|livrati|trimite|доставка|доставляете|отправка|发货|运送|邮寄|快递|ارسال|حمل|ترسیل|بھیج|ڈیلیوری|شحن|توصيل|ترسلون|शिपिंग|डिलीवरी|भेज|ഷിപ്പിംഗ്|ഡെലിവറി|മലക|መላኪያ|ትልካላችሁ|ergaa|kusafirisha|usafirishaji|mnatuma|jigila|aika|kai|mbupu|zipu|ifiranṣẹ|fi ranṣẹ|ipadala|padala|deliver'),
  price: L('price|cost|how much|preis|kosten|wie viel|wieviel|prix|combien|cout|precio|cuanto|cuesta|prezzo|quanto|costa|preco|quanto custa|preu|quant|prezo|prezioa|zenbat|pret|cat costa|цена|стоимость|сколько|价格|多少钱|价钱|قیمت|چند|کتنے|سعر|بكم|كم|قديش|कीमत|कितना|दाम|വില|എത്ര|ዋጋ|ስንት|gatii|meeqa|bei|kiasi gani|farashi|nawa|ọnụ ahịa|ego ole|iye owo|elo ni|presyo|magkano'),
  repair: L('repair|fix|broken|reparatur|reparieren|kaputt|reparation|reparer|casse|reparar|reparacion|arreglar|roto|rota|riparare|riparazione|rotto|consertar|reparo|quebrado|partido|reparacio|trencat|konpondu|hautsi|reparatie|repara|stricat|spart|ремонт|починить|сломан|разбит|维修|修理|坏了|碎了|تعمیر|خراب|شکسته|مرمت|ٹوٹ|خراب|تصليح|صيانه|مكسور|خربان|मरम्मत|ठीक|टूट|खराब|റിപ്പയർ|നന്നാക്ക|പൊട്ടി|ጥገና|ተሰብሯል|suphuu|cabe|kutengeneza|rekebisha|imevunjika|gyara|karye|rụzi|gbajiri|tun ṣe|fọ|ayusin|sira|basag'),
  location: L('where|address|location|map|directions|wo seid|adresse|standort|ou etes|adresse|donde|direccion|ubicacion|dove|indirizzo|onde|endereco|localizacao|on sou|adreca|onde|enderezo|helbidea|unde|adresa|где|адрес|在哪|地址|位置|کجا|آدرس|کہاں|پتہ|وين|اين|عنوان|موقع|कहाँ|पता|എവിടെ|വിലാസം|የት|አድራሻ|eessa|teessoo|wapi|anwani|adireshi|ebee|adreesi|nibo|adiresi|saan|lokasyon'),
  warranty: L('warranty|guarantee|garantie|garantia|garanzia|bermea|garantie|гарантия|保修|质保|گارانتی|ضمانت|وارنٹی|ضمان|वारंटी|गारंटी|വാറന്റി|ዋስትና|dhamana|garanti|nkwa|iṣeduro|garantiya'),
  wholesale: L('wholesale|bulk|trade|dealer|grosshandel|haendler|en gros|grossiste|mayorista|al por mayor|ingrosso|grossista|atacado|atacadista|majorista|por xunto|handizka|en gros|angro|оптом|опт|批发|عمده|ہول سیل|جمله|تاجر|थोक|മൊത്ത|ጅምላ|jumlaa|jumla|sari|ahia ukwu|osunwon|pakyawan'),
  contact: L('contact|call|phone number|whatsapp|wechat|email|kontakt|anrufen|telefonnummer|appeler|telephone|contacto|llamar|telefono|contatto|chiamare|contato|ligar|telefone|trucar|deitu|suna|контакт|позвонить|телефон|联系|电话|微信|تماس|شماره|رابطہ|نمبر|تواصل|رقم|اتصل|संपर्क|फोन नंबर|ബന്ധപ്പെടുക|ፋንሳ|ስልክ|bilbila|simu|namba|lamba|kira|kpọọ|nọmba|numero|tawag'),
  grades: L('grade|quality|original|genuine|copy|qualitat|qualite|calidad|qualita|qualidade|kalitatea|calitate|качество|оригинал|质量|原装|کیفیت|اصل|کوالٹی|اصلي|جوده|गुणवत्ता|असली|ഗുണനിലവാരം|ጥራት|qulqullina|ubora|inganci|ogo|didara|kalidad|orihinal'),
  difference: L('difference|compare|versus|unterschied|vergleich|difference|diferencia|comparar|differenza|diferenca|diferentzia|diferenta|разница|отличие|区别|差别|تفاوت|فرق|الفرق|अंतर|फर्क|വ്യത്യാസം|ልዩነት|garaagarummaa|tofauti|bambanci|ọdịiche|iyatọ|pagkakaiba'),
  cheapest: L('cheapest|cheap|lowest|budget|gunstig|billig|moins cher|pas cher|barato|mas barato|economico|economico|piu economico|mais barato|merkeena|ieftin|дешевле|дешевый|самый дешевый|便宜|最便宜|ارزان|سستا|ارخص|رخيص|सस्ता|വിലകുറഞ്ഞ|ርካሽ|rakasaa|bei nafuu|mai arha|dị ọnụ ala|olowo pọọku|mura|pinakamura'),
  tomorrow: L('tomorrow|morgen|demain|manana|domani|amanha|dema|bihar|maine|завтра|明天|فردا|کل|بكره|بكرا|غدا|कल|നാളെ|ነገ|boru|kesho|gobe|echi|ọla|bukas'),
  today: L('today|now|heute|jetzt|aujourdhui|maintenant|hoy|ahora|oggi|adesso|hoje|agora|avui|ara|gaur|orain|azi|acum|сегодня|сейчас|今天|现在|امروز|الان|آج|ابھی|اليوم|आज|अभी|ഇന്ന്|ഇപ്പോൾ|ዛሬ|አሁን|har a|leo|sasa|yau|yanzu|taa|ugbu a|oni|nisisiyi|ngayon'),
  order: L('my order|track|tracking|bestellung|sendungsverfolgung|commande|suivi|pedido|seguimiento|ordine|tracciamento|encomenda|rastreio|comanda|eskaera|заказ|отследить|订单|物流|سفارش|پیگیری|آرڈر|طلبي|الطلب|ऑर्डर|ഓർഡർ|ትዕዛዝ|ajaja|oda|odar|iwu|aṣẹ|order ko'),
};

/** everyday talk: what the visitor means, in every language */
export const TALK: Record<string, string[]> = {
  greet: L('hi|hello|hey|hiya|howdy|yo|sup|good morning|good evening|good afternoon|hallo|moin|servus|guten tag|guten morgen|bonjour|salut|bonsoir|hola|buenas|buenos dias|ciao|salve|buongiorno|ola|oi|bom dia|boa tarde|bon dia|kaixo|egun on|buna|salut|privet|здравствуйте|привет|добрый день|你好|您好|嗨|salam|سلام|درود|مرحبا|اهلا|هلا|السلام عليكم|مرحبتين|صباح الخير|مساء الخير|السلام علیکم|آداب|नमस्ते|नमस्कार|हेलो|നമസ്കാരം|ഹലോ|ሰላም|ጤና ይስጥልኝ|akkam|nagaa|habari|jambo|hujambo|mambo|sannu|barka|ndewo|kedu|bawo|pẹlẹ|ẹ kaaro|kumusta|musta|magandang umaga'),
  howareyou: L('how are you|how r u|how are u|hows it going|how is it going|whats up|wie gehts|wie geht es|comment ca va|ca va|como estas|que tal|come stai|come va|como vai|tudo bem|como esta|com estas|como estas|zer moduz|ce faci|ce mai faci|как дела|как ты|你好吗|最近怎么样|چطوری|حالت چطوره|خوبی|كيفك|كيف حالك|شلونك|شخبارك|آپ کیسے|کیا حال|कैसे हो|आप कैसे|क्या हाल|സുഖമാണോ|എങ്ങനെയുണ്ട്|እንዴት ነህ|እንደምን|akkam jirta|habari yako|u hali gani|uko aje|yaya kake|ina kwana|kedu ka i mere|bawo ni|ṣe daadaa ni|kumusta ka'),
  fine: L('im fine|i am fine|im good|i am good|fine thanks|good thanks|im great|all good|not bad|mir gehts gut|gut danke|ca va bien|je vais bien|estoy bien|bien gracias|sto bene|bene grazie|estou bem|tudo bem|estic be|ondo nago|sunt bine|хорошо|нормально|我很好|还不错|خوبم|ٹھیک ہوں|بخير|الحمد لله|ठीक हूँ|मैं ठीक|സുഖം|ደህና ነኝ|nagaa dha|nzuri|salama|lafiya|adị m mma|mo wa daadaa|mabuti'),
  thanks: L('thanks|thank you|thank|thx|ty|cheers|appreciate|danke|merci|gracias|grazie|obrigado|obrigada|gracies|grazas|eskerrik asko|multumesc|mersi|спасибо|благодарю|谢谢|多谢|感谢|مرسی|ممنون|سپاس|شکریہ|شكرا|مشكور|تسلم|يعطيك العافيه|धन्यवाद|शुक्रिया|നന്ദി|አመሰግናለሁ|galatoomi|asante|nagode|daalụ|ẹ se|o ṣeun|o se|e se|ese|o seun|salamat'),
  bye: L('bye|goodbye|see you|see ya|cya|good night|tschuss|auf wiedersehen|gute nacht|au revoir|a plus|bonne nuit|adios|hasta luego|buenas noches|arrivederci|buonanotte|tchau|adeus|ate logo|adeu|fins aviat|agur|la revedere|pa|пока|до свидания|спокойной ночи|再见|拜拜|晚安|خداحافظ|خدا حافظ|شب بخیر|اللہ حافظ|مع السلامه|باي|تصبح على خير|अलविदा|फिर मिलेंगे|शुभ रात्रि|വിട|ശുഭരാത്രി|ደህና ሁን|ቻው|nagaatti|kwaheri|usiku mwema|sai anjima|sai an jima|ka omesia|odabọ|o dabọ|paalam'),
  sorry: L('sorry|my bad|apologies|entschuldigung|tut mir leid|pardon|desole|perdon|lo siento|perdona|scusa|scusami|mi dispiace|desculpa|desculpe|perdao|ho sento|barkatu|scuze|imi pare rau|извините|простите|прости|对不起|抱歉|不好意思|ببخشید|متاسفم|معاف|معذرت|اسف|سامحني|عذرا|माफ|क्षमा|ക്ഷമിക്കണം|ይቅርታ|dhiifama|samahani|yi hakuri|gafara|ndo|ma binu|pasensya|patawad'),
  yes: L('yes|yeah|yep|yup|sure|ok|okay|alright|of course|ja|oui|si|sim|bai|da|да|конечно|好|是|是的|对|好的|بله|آره|باشه|ہاں|جی|نعم|اي|ايوه|اكيد|تمام|हाँ|हां|जी|ठीक है|ഉവ്വ്|ശരി|አዎ|እሺ|eeyyee|ndiyo|sawa|eh|ee|ọ dị mma|bẹẹni|o dara|oo|opo|sige'),
  no: L('no|nope|nah|not now|nein|non|nao|ez|nu|нет|不|不是|不用|نه|نخیر|نہیں|لا|لأ|नहीं|ഇല്ല|አይ|lakki|hapana|a a|mba|rara|hindi'),
  angry: L('stupid|useless|idiot|dumb|trash|rubbish|garbage|wtf|shut up|hate you|scam|scammer|worst|terrible|awful|bad service|dumm|blod|nutzlos|scheisse|nul|idiot|debile|arnaque|estupido|inutil|idiota|tonto|basura|estafa|stupido|inutile|cretino|truffa|burro|lixo|golpe|ruc|inutil|ergela|prost|inutil|teapa|дурак|тупой|бесполезный|ужасно|развод|笨|垃圾|傻|骗子|没用|احمق|خنگ|کلاهبردار|بیکار|بکواس|احمق|غبي|حمار|تافه|نصاب|زباله|बेवकूफ|बकवास|धोखा|बेकार|മണ്ടൻ|ചതി|ደደብ|አጭበርባሪ|gowwaa|mjinga|tapeli|wawa|dan damfara|onye nzuzu|ojoro|omugọ|jibiti|bobo|tanga|scam'),
  love: L('love you|i love you|cute|so cute|you are cute|good bot|good boy|smart|clever|well done|nice one|awesome|amazing|you are the best|ich liebe dich|suss|toll|je taime|mignon|genial|te quiero|te amo|lindo|eres el mejor|ti amo|carino|sei il migliore|eu te amo|fofo|t estimo|maite zaitut|te iubesc|люблю тебя|милый|молодец|我爱你|可爱|真棒|دوستت دارم|نازی|عالی|پیار|زبردست|احبك|حبيبي|كيوت|شاطر|يا سلام|प्यार|प्यारा|बढ़िया|ഇഷ്ടം|സൂപ്പർ|እወድሃለሁ|ጎበዝ|sin jaalladha|nakupenda|hodari|ina sonka|kai gwani|ahụrụ m gị n anya|mo nifẹ rẹ|mahal kita|ang galing'),
  bot: L('are you a robot|are you a bot|are you ai|are you real|are you human|are you a person|who made you|bist du ein bot|bist du echt|es tu un robot|es tu humain|eres un robot|eres real|eres humano|sei un robot|sei umano|voce e um robo|voce e real|ets un robot|robota zara|esti robot|ты бот|ты робот|ты человек|你是机器人|你是真人|تو رباتی|آدمی|کیا تم روبوٹ|انت روبوت|انت حقيقي|انت انسان|क्या तुम रोबोट|നീ റോബോട്ട്|ሮቦት ነህ|roobootii|wewe ni roboti|kai mutum ne|ị bụ robot|ṣe roboti ni ọ|robot ka ba'),
  name: L('who are you|your name|whats your name|what is your name|wer bist du|wie heisst du|qui es tu|comment tu tappelles|quien eres|como te llamas|chi sei|come ti chiami|quem e voce|qual e o seu nome|qui ets|com et dius|nor zara|cine esti|cum te cheama|кто ты|как тебя зовут|你是谁|你叫什么|تو کی هستی|اسمت چیه|تم کون|آپ کا نام|مين انت|من انت|شو اسمك|ما اسمك|तुम कौन|आपका नाम|നീ ആരാണ്|പേര് എന്താണ്|ማን ነህ|ስምህ ማን|maqaan kee|eenyu|wewe ni nani|jina lako|kai wanene|sunanka|onye ka ị bụ|aha gị|tani ni ọ|kini orukọ rẹ|sino ka|ano pangalan mo'),
  time: L('what time|time is it|the time|current time|wie spat|uhrzeit|quelle heure|que hora|que horas|che ore|che ora|quina hora|zer ordu|cat e ora|который час|сколько времени|几点|現在幾點|ساعت چنده|ساعت چند|کتنے بجے|وقت کیا|كم الساعه|الساعه كم|कितने बजे|समय क्या|സമയം എത്ര|ስንት ሰዓት|sa aatii meeqa|saa ngapi|karfe nawa|oge ole|aago melo|anong oras'),
  date: L('what day|which day|todays date|the date|what is the date|welcher tag|welches datum|quel jour|quelle date|que dia|que fecha|che giorno|che data|que dia|que data|quin dia|zer egun|ce zi|ce data|какое число|какой день|какая дата|今天几号|星期几|今天是|امروز چندمه|چه روزی|تاریخ|آج کیا تاریخ|کون سا دن|التاريخ|اي يوم|आज क्या तारीख|कौन सा दिन|ഏത് ദിവസം|തീയതി|ቀኑ|ዛሬ ምን ቀን|guyyaa|tarehe|siku gani|wace rana|kwanan wata|ụbọchị ole|ọjọ wo|anong petsa|anong araw'),
  weather: L('weather|hot outside|raining|temperature|wetter|meteo|temps quil fait|clima|tiempo hace|tempo|eguraldi|vremea|погода|天气|هوا چطوره|آب و هوا|موسم|طقس|الجو|मौसम|കാലാവസ്ഥ|የአየር ሁኔታ|qilleensa|hali ya hewa|yanayi|ihu igwe|oju ọjọ|panahon'),
  joke: L('joke|funny|make me laugh|tell me something funny|witz|blague|chiste|broma|barzelletta|piada|acudit|txiste|banc|gluma|шутка|анекдот|рассмеши|笑话|段子|جوک|لطیفه|لطیفہ|مذاق|نكته|نكتة|ضحكني|चुटकुला|मज़ाक|തമാശ|ቀልድ|qoosaa|utani|mzaha|kichekesho|barkwanci|njakịrị|awada|biro'),
  fact: L('fun fact|did you know|tell me something|interesting|a fact|fakt|wusstest du|le saviez|fait|dato curioso|sabias que|curiosita|lo sapevi|curiosidade|voce sabia|sabies que|ba al zenekien|stiai ca|факт|интересное|趣闻|你知道吗|حقیقت جالب|میدونستی|دلچسپ|هل تعلم|معلومه|क्या आप जानते|रोचक तथ्य|രസകരമായ|አስደሳች|wanta beekamaa|je wajua|ka sani|ị maara|ṣe o mọ|alam mo ba'),
  help: L('help|what can you do|what do you do|how can you help|menu|options|hilfe|was kannst du|aide|que peux tu|que sais tu faire|ayuda|que puedes hacer|que sabes hacer|aiuto|cosa sai fare|cosa puoi fare|ajuda|o que voce faz|o que podes|que pots fer|axuda|laguntza|ajutor|ce poti face|помощь|помоги|что ты умеешь|帮助|帮忙|你能做什么|کمک|چه کار میکنی|مدد|کیا کر سکتے|مساعده|ساعدني|ماذا تستطيع|شو بتعرف|मदद|क्या कर सकते|സഹായം|എന്ത് ചെയ്യാൻ|እርዳታ|ምን ትሰራለህ|gargaarsa|msaada|unaweza kufanya nini|taimako|me za ka iya|enyemaka|kedu ihe ị nwere ike|iranlọwọ|kini o le ṣe|tulong|ano ang kaya mo'),
  bored: L('bored|boring|langweilig|je mennuie|ennuyeux|aburrido|me aburro|annoiato|mi annoio|entediado|tedio|avorrit|aspertuta|ma plictisesc|скучно|无聊|حوصلم سر رفت|بور|بور ہو|زهقان|مليت|बोर|ബോറടി|አሰልቺ|na boa|nimechoka|na gaji|ike agwụla m|o su mi|nababagot'),
  notcharging: L('not charging|wont charge|doesnt charge|does not charge|stopped charging|charging slow|ladt nicht|ne charge pas|ne charge plus|no carga|no se carga|non carica|non si carica|nao carrega|no carrega|ez du kargatzen|nu se incarca|не заряжается|不充电|充不进电|充不了电|شارژ نمیشه|شارژ نمیگیره|چارج نہیں|ما يشحن|ما بيشحن|لا يشحن|चार्ज नहीं|ചാർജ് ആകുന്നില്ല|ቻርጅ አያደርግም|hin chaarjii|haichaji|baya caji|anaghị achaji|ko gba agbara|ayaw mag charge|hindi nagcha charge'),
  drain: L('battery dies|battery drains|drains fast|dies fast|battery health|battery life|battery bad|akku leer|akku halt nicht|se decharge|batterie faible|se descarga|bateria dura poco|si scarica|batteria dura poco|descarrega|bateria acaba|descarrega rapid|bateria azkar|se descarca|быстро садится|разряжается|掉电快|耗电|不耐用|باتری زود تموم|زود خالی|جلدی ختم|البطاريه تخلص|البطاريه ضعيفه|बैटरी जल्दी|ബാറ്ററി പെട്ടെന്ന്|ባትሪው ቶሎ|dafqa dhuma|betri inaisha haraka|batir na karewa|batrị na-agwụ ngwa ngwa|batiri n tan|mabilis maubos'),
  water: L('water|wet|liquid|rain on|fell in|dropped in|wasser|nass|eau|mouille|tombe dans|agua|mojado|se cayo al|acqua|bagnato|caduto in|agua|molhado|caiu na|aigua|mullat|ura|bustia|apa|вода|намок|упал в воду|进水|掉水里|湿了|آب|خیس|پانی|گیلا|ماء|مي|بلل|وقع بالماي|पानी|गीला|വെള്ളം|നനഞ്ഞു|ውሃ|bishaan|maji|imelowa|ruwa|mmiri|omi|tubig|nabasa'),
  cracked: L('cracked|crack|smashed|shattered|dropped it|fell|gesprungen|zerbrochen|runtergefallen|fissure|casse|tombe|rompio|se cayo|rajada|crepato|rotto|e caduto|rachado|trincado|caiu|esquerdat|caigut|pitzatuta|crapat|a cazut|треснул|разбился|упал|碎了|裂了|摔了|ترک|افتاد|ٹوٹ گیا|گر گیا|انكسر|مكسور|وقع|شعر|टूट गया|गिर गया|दरार|പൊട്ടി|വീണു|ተሰብሯል|ወደቀ|cabe|kufe|imepasuka|imeanguka|ya fashe|ya fadi|gbawara|fọ|ṣubu|basag|nahulog'),
  slow: L('slow|lag|laggy|freezes|hot|overheat|overheating|heats up|langsam|hangt|heiss|lent|bloque|chauffe|lento|se traba|caliente|se calienta|lento|blocca|scalda|lento|trava|esquenta|aquece|lent|s escalfa|motel|berotu|merge greu|incinge|тормозит|медленно|греется|зависает|卡|慢|发热|发烫|کند|داغ|هنگ|سست|گرم|ہینگ|بطيء|يعلق|حار|يسخن|धीमा|हैंग|गर्म|സ്ലോ|ചൂടാകുന്നു|ቀርፋፋ|ይሞቃል|suuta|polepole|inapata joto|a hankali|zafi|nwayọọ|ọkụ|lọra|gbona|mabagal|mainit'),
  modelcode: L('model code|model number|which model|what model|find my model|modellnummer|welches modell|numero de modele|quel modele|numero de modelo|que modelo|cual modelo|numero di modello|quale modello|numero do modelo|qual modelo|quin model|zein modelo|numarul modelului|ce model|номер модели|какая модель|型号|什么型号|شماره مدل|چه مدلی|ماڈل نمبر|کون سا ماڈل|رقم الموديل|اي موديل|मॉडल नंबर|कौन सा मॉडल|മോഡൽ നമ്പർ|ሞዴል ቁጥር|lakkoofsa moodeelaa|nambari ya modeli|lambar samfuri|nọmba ụdị|nọmba awoṣe|model number ko'),
  photo: L('photo|picture|image|pic|screenshot|foto|bild|photo|imagen|foto|immagine|fotografia|imaxe|argazkia|poza|imagine|фото|картинка|снимок|照片|图片|截图|عکس|تصویر|اسکرین شات|فوٹو|تصویر|صوره|صورة|فوتو|फोटो|तस्वीर|ഫോട്ടോ|ፎቶ|suuraa|picha|hoto|foto|aworan|larawan'),
  currency: L('usd|dollar|dollars|us dollar|dollar americain|dolar|dolares|dollaro|dollari|dolares|dolars|dolarrak|dolari|доллар|美元|دلار|ڈالر|دولار|डॉलर|ഡോളർ|ዶላር|doolara|dola|dala|dọla|dọla|dolyar'),
};

/** a few iPhone model numbers (the A-number printed on the SIM tray slot and in Settings → About) */
export const APPLE: Record<string, string> = {
  A2221: 'iPhone 11', A2111: 'iPhone 11', A2223: 'iPhone 11', A2215: 'iPhone 11 Pro', A2160: 'iPhone 11 Pro', A2217: 'iPhone 11 Pro', A2218: 'iPhone 11 Pro Max', A2161: 'iPhone 11 Pro Max', A2220: 'iPhone 11 Pro Max',
  A2403: 'iPhone 12', A2172: 'iPhone 12', A2402: 'iPhone 12', A2404: 'iPhone 12', A2399: 'iPhone 12 mini', A2176: 'iPhone 12 mini', A2398: 'iPhone 12 mini', A2400: 'iPhone 12 mini',
  A2407: 'iPhone 12 Pro', A2341: 'iPhone 12 Pro', A2406: 'iPhone 12 Pro', A2408: 'iPhone 12 Pro', A2411: 'iPhone 12 Pro Max', A2342: 'iPhone 12 Pro Max', A2410: 'iPhone 12 Pro Max', A2412: 'iPhone 12 Pro Max',
  A2633: 'iPhone 13', A2482: 'iPhone 13', A2631: 'iPhone 13', A2634: 'iPhone 13', A2635: 'iPhone 13', A2628: 'iPhone 13 mini', A2481: 'iPhone 13 mini', A2626: 'iPhone 13 mini', A2629: 'iPhone 13 mini', A2630: 'iPhone 13 mini',
  A2638: 'iPhone 13 Pro', A2483: 'iPhone 13 Pro', A2636: 'iPhone 13 Pro', A2639: 'iPhone 13 Pro', A2640: 'iPhone 13 Pro', A2643: 'iPhone 13 Pro Max', A2484: 'iPhone 13 Pro Max', A2641: 'iPhone 13 Pro Max', A2644: 'iPhone 13 Pro Max', A2645: 'iPhone 13 Pro Max',
  A2882: 'iPhone 14', A2649: 'iPhone 14', A2881: 'iPhone 14', A2883: 'iPhone 14', A2884: 'iPhone 14', A2886: 'iPhone 14 Plus', A2632: 'iPhone 14 Plus', A2885: 'iPhone 14 Plus', A2887: 'iPhone 14 Plus', A2888: 'iPhone 14 Plus',
  A2890: 'iPhone 14 Pro', A2650: 'iPhone 14 Pro', A2889: 'iPhone 14 Pro', A2891: 'iPhone 14 Pro', A2892: 'iPhone 14 Pro', A2894: 'iPhone 14 Pro Max', A2651: 'iPhone 14 Pro Max', A2893: 'iPhone 14 Pro Max', A2895: 'iPhone 14 Pro Max', A2896: 'iPhone 14 Pro Max',
  A3090: 'iPhone 15', A2846: 'iPhone 15', A3089: 'iPhone 15', A3092: 'iPhone 15', A3094: 'iPhone 15 Plus', A2847: 'iPhone 15 Plus', A3093: 'iPhone 15 Plus', A3096: 'iPhone 15 Plus',
  A3102: 'iPhone 15 Pro', A2848: 'iPhone 15 Pro', A3101: 'iPhone 15 Pro', A3104: 'iPhone 15 Pro', A3106: 'iPhone 15 Pro Max', A2849: 'iPhone 15 Pro Max', A3105: 'iPhone 15 Pro Max', A3108: 'iPhone 15 Pro Max',
};

export const LANGS = ['en', 'de', 'fr', 'es', 'it', 'pt', 'ca', 'gl', 'eu', 'ro', 'ru', 'zh', 'ar', 'fa', 'ur', 'hi', 'ml', 'am', 'om', 'sw', 'ha', 'ig', 'yo', 'tl'];
const EN_DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
let dayMap: [string, number][] | null = null;
/** weekday names in every language (from the browser), so "viernes", "пятница" or "الجمعة" all mean Friday */
export function dayIn(n: string): number {
  if (!dayMap) {
    const m = new Map<string, number>();
    EN_DAYS.forEach((d, i) => m.set(d, i));
    for (const l of LANGS) {
      try { const f = new Intl.DateTimeFormat(l, { weekday: 'long', timeZone: 'UTC' }); for (let i = 0; i < 7; i++) { const w = N(f.format(new Date(Date.UTC(2023, 0, 1 + i)))).trim(); if (w.length > 2) m.set(w, i); } } catch { /* no names for this language */ }
    }
    ['جمعه', 'جمعة', 'الجمعه', 'سبت', 'احد', 'اتوار', 'jumamosi', 'ijumaa', 'jumaa'].forEach((w, k) => m.set(N(w).trim(), [5, 5, 5, 6, 0, 0, 6, 5, 5][k]));
    dayMap = [...m.entries()].sort((a, b) => b[0].length - a[0].length);
  }
  for (const [w, i] of dayMap) if (hit(n, w)) return i;
  return -1;
}

let countryNames: Map<string, string> | null = null;
/** country names in every language: "Nigeria", "Nigéria", "Нигерия", "نيجيريا" → the English name the data uses */
export function countryIn(n: string, english: string[]): string | null {
  if (!countryNames) {
    countryNames = new Map();
    english.forEach((e) => countryNames!.set(N(e).trim(), e));
    try {
      const en = new Intl.DisplayNames(['en'], { type: 'region' }), want = new Map(english.map((e) => [e.toLowerCase(), e])), codes: [string, string][] = [];
      for (let a = 65; a < 91; a++) for (let b = 65; b < 91; b++) { const c = String.fromCharCode(a, b); try { const nm = en.of(c); if (nm && nm !== c && want.has(nm.toLowerCase())) codes.push([c, want.get(nm.toLowerCase())!]); } catch { /* */ } }
      for (const l of LANGS) { try { const dn = new Intl.DisplayNames([l], { type: 'region' }); codes.forEach(([c, e]) => { const nm = dn.of(c); if (nm && nm !== c) countryNames!.set(N(nm).trim(), e); }); } catch { /* */ } }
    } catch { /* old browser: English names only */ }
  }
  let best: string | null = null, bl = 0;
  for (const [w, e] of countryNames) if (w.length > bl && hit(n, w)) { best = e; bl = w.length; }
  return best;
}
