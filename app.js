'use strict';

/* ---------- داده‌های ثابت ---------- */

const GAPS = {
  none: { label: 'شکافی نبود', advice: 'جلسهٔ بعد خروجی را یک پله بالاتر ببر؛ به‌جای تعریف، یک مثال یا مسئلهٔ تازه.' },
  forgot: { label: 'فراموش کردم', advice: 'فراموشی پیش‌فرض مغز است. بازیابی کوتاه فردا همین را هدف می‌گیرد.' },
  apply: { label: 'تعریف را می‌دانم، کاربردش را نه', advice: 'خروجی جلسهٔ بعد را «حل یک نمونهٔ تازه» بگذار، نه توضیح تعریف.' },
  prereq: { label: 'یک پیش‌نیاز را ندارم', advice: 'اسم همان پیش‌نیاز را بنویس و جلسهٔ بعد را فقط به آن بده.' },
  step: { label: 'در یک مرحلهٔ مشخص گیر کردم', advice: 'همان مرحله را جدا کن و یک مثال حل‌شده‌اش را قدم‌به‌قدم خودت بازنویسی کن.' },
  blank: { label: 'ذهنم کاملاً سفید شد', advice: 'ورودی زیاد بوده. دفعهٔ بعد نصف همین حجم را بخوان و زودتر ببند.' },
  detail: { label: 'کلیات یادم هست، جزئیات نه', advice: 'از روی متن عبور کرده‌ای. بخش‌ها را کوچک‌تر کن و بعد از هر بخش ببند و بنویس.' },
  slow: { label: 'یادم آمد، ولی با مکث و زحمت زیاد', advice: 'این در مرحلهٔ اول یادگیری طبیعی است، نه شکست. فردا همین مطلب را یک بار دیگر از حافظه بنویس؛ هر بار روان‌تر می‌شود.' },
  half: { label: 'فقط نیمهٔ اول جلسه یادم هست', advice: 'جلسه برای توان امروزت بلند بوده. دفعهٔ بعد کوتاه‌ترش کن، یا وسطش یک بار ببند و بنویس.' },
  attention: { label: 'حواسم جای دیگری بود', advice: 'مسئله تمرکز است، نه روش یادگیری. جلسه را کوتاه‌تر کن و گوشی را از اتاق بیرون ببر.' },
};

const OBSTACLES = {
  vague: {
    label: 'کار برایم مبهم است',
    ask: 'دقیقاً نمی‌دانم گام بعدی چیست.',
    step: 'فقط سه سؤال مشخص از این مبحث را پیدا می‌کنم و علامت می‌زنم.',
    min: 10,
  },
  hard: {
    label: 'برای سطح فعلی‌ام سخت است',
    ask: 'نمی‌فهمم مسئله چه می‌خواهد یا از کجا باید شروع کنم.',
    step: 'فقط یک اصطلاح، یک مثال حل‌شده یا یک پیش‌نیاز را بررسی می‌کنم.',
    min: 10,
  },
  fear: {
    label: 'از اشتباه یا نتیجهٔ ضعیف می‌ترسم',
    ask: 'خود درس نه؛ حسی که دربارهٔ خودم می‌سازد آزارم می‌دهد.',
    step: 'یک تلاش خصوصی و ناقص می‌کنم. درست‌بودن جواب هدف نیست.',
    min: 8,
  },
  tired: {
    label: 'واقعاً خسته یا خواب‌آلودم',
    ask: 'در کارهای ساده هم کند و پرخطا شده‌ام.',
    step: 'استراحت می‌کنم؛ بدون شبکهٔ اجتماعی و بدون کار ذهنی تازه. بعد یک کار سبک‌تر را امتحان می‌کنم.',
    min: 15,
    rest: true,
  },
  escape: {
    label: 'دنبال پاداش فوری‌ام',
    ask: 'کار روشن است، ولی دستم سمت گوشی یا ویدئو می‌رود.',
    step: 'گوشی را بیرون از دسترس می‌گذارم و بدون جابه‌جایی فقط روی همین کار می‌مانم.',
    min: 10,
  },
  meaning: {
    label: 'نمی‌بینم این کار چه ارزشی دارد',
    ask: 'نمی‌توانم بگویم این کار به کدام هدفم وصل است.',
    step: 'این کار به … وصل است. کوچک‌ترین بخش همین کار را انجام می‌دهم.',
    min: 10,
  },
};

const CAUSES = {
  phone: { label: 'برداشتن گوشی', advice: 'مسیر تا گوشی کوتاه است. آن را بیرون از اتاق بگذار، نه فقط بی‌صدا یا رو به پایین.' },
  notif: { label: 'اعلان', advice: 'ورودی هنوز باز است. اعلان همان برنامه را کامل ببند: صدا، بنر، لرزش و عدد روی آیکون.' },
  tab: { label: 'تب یا برنامهٔ دیگر', advice: 'برای درس یک پروفایل جدا بساز و قبل از جلسه تب‌های اضافه را ببند، نه کوچک.' },
  up: { label: 'بلندشدن یا وسیله', advice: 'هرچه این جلسه لازم دارد قبل از شروع روی میز باشد و بقیه بیرون از دید.' },
  thought: { label: 'فکر مزاحم', advice: 'یک برگه کنار دستت بگذار؛ فکر را بنویس و برگرد سر همان خط.' },
  noise: { label: 'صدا یا آدم‌ها', advice: 'جا یا ساعت جلسه را عوض کن؛ با اراده نمی‌شود صدا را خاموش کرد.' },
  tired: { label: 'خستگی', advice: 'جلسه را به بازهٔ پرانرژی روزت ببر و کوتاه‌ترش کن.' },
  lost: { label: 'نفهمیدن مطلب', advice: 'این وقفه از پیش‌نیاز می‌آید، نه از تمرکز. یک جلسه را فقط به همان پیش‌نیاز بده.' },
  real: { label: 'وقفهٔ واقعی', advice: 'قبل از ترک میز یک خط بنویس: کجا بودم و قدم بعدی چیست. هزینهٔ اصلی وقفه بعد از آن می‌آید.' },
  look: { label: 'جست‌وجوی درسی', advice: 'سؤال را دقیق بنویس، فقط همان را پیدا کن و برگرد. جست‌وجوی باز حواس‌پرتی است با ظاهر درسی.' },
  other: { label: 'چیز دیگر', advice: 'چند بار دیگر ثبت کن تا معلوم شود این «چیز دیگر» دقیقاً چیست.' },
};

const MYTHS = {
  mood: {
    label: 'تا حالش نباشد شروع نمی‌کنم',
    wrong: 'حال خوب کمک است، پیش‌شرط نیست.',
    rule: ['حس مطالعه ندارم', 'فقط ۵ دقیقه با یک کار کوچک و مشخص شروع می‌کنم؛ بعد تصمیم می‌گیرم ادامه بدهم یا نه.'],
    test: 'جلسه را بدون حال کامل شروع کن؛ پنج دقیقه کافی است.',
    minutes: 5,
  },
  more: {
    label: 'هرچه بیشتر بخوانم، بیشتر یاد می‌گیرم',
    wrong: 'زمان لازم است، کافی نیست.',
    rule: ['خواستم بخشی را یک دور دیگر بخوانم', 'کتاب را می‌بندم و دو دقیقه هرچه یادم مانده می‌نویسم.'],
    test: 'وسط جلسه، به‌جای دور دوم، دست‌کم یک بار «ببند و بنویس» را بزن.',
  },
  hours: {
    label: 'روز خوب یعنی ساعت زیاد',
    wrong: 'ساعت داده است، نمره نیست.',
    rule: ['خواستم روزم را ارزیابی کنم', 'اول می‌نویسم چه چیزی را بدون کتاب می‌توانم توضیح بدهم یا حل کنم؛ ساعت را فقط کنارش ثبت می‌کنم.'],
    test: 'آخر جلسه اول خروجی را بنویس، بعد به دقیقه‌ها نگاه کن.',
  },
  marathon: {
    label: 'تمرکز جدی یعنی چند ساعت پشت‌سرهم',
    wrong: 'توجه پایدار منبع نامحدود نیست.',
    rule: ['می‌خواهم جلسه بچینم', 'بلوکی می‌چینم که امروز واقعاً تمامش می‌کنم، و بعدش یک وقفهٔ کوتاهِ بدون گوشی.'],
    test: 'یک بلوک کوتاه بچین و تا آخرش برو.',
    minutes: 25,
  },
  cram: {
    label: 'شب امتحان جبران می‌کنم',
    wrong: 'فشرده‌خوانی تعمیر اضطراری است، نه جبران.',
    rule: ['وسوسه شدم مبحثی را برای شب امتحان نگه دارم', 'همین امروز یک جلسهٔ کوتاه با همان مبحث دارم.'],
    test: 'همان مبحثِ عقب‌افتاده را امروز بیست دقیقه ببین.',
    minutes: 15,
  },
};

const MODEL = { attn: 'توجه: دروازهٔ باریک', work: 'حافظهٔ کاری: میز کوچک', long: 'حافظهٔ بلندمدت: وصل‌کردن به دانسته‌ها', forget: 'فراموشی و بازیابی' };
const SCAN_GOAL = 'بگویم این مبحث از چه اجزایی ساخته شده و کدام پیش‌نیازهایش را بلد نیستم';
const SCAN_CRITERION = 'اجزا و پیش‌نیازهای ناآشنا را بدون نگاه به منبع فهرست می‌کنم';
const SLOTS = ['صبح', 'ظهر', 'عصر', 'شب'];
const BLOCKS = [10, 15, 25, 35, 45, 60, 90];
const LEAN_MIN = [15, 25, 35, 45];
const LOADS = { heavy: 'سنگین', mid: 'متوسط', light: 'سبک' };
const WINS = { peak: 'اوج', mid: 'متوسط', trough: 'فرود' };

const AUDIT = {
  desk: ['میدان دید و سطح میز', 'فقط کتاب همین جلسه، دفتر، خودکار و آب بماند. بقیه برود در کشو یا قفسه.'],
  phone: ['فاصله و دسترسی گوشی', 'بیرون از اتاق، یا جایی که برای رسیدن به آن باید بلند شوی.'],
  light: ['نور', 'از کنار یا روبه‌رو، نه از پشت سر و نه در چشم. شب: چراغ مطالعه به‌اضافهٔ نور ملایم اتاق.'],
  sound: ['صدا', 'به‌ترتیب: سکوت، صدای یکنواخت، موسیقی بی‌کلام و آشنا. کلام‌دار و پادکست نه.'],
  seat: ['دما و نشستن', 'صندلی و میز، نه تخت. پا روی زمین، آرنج حدود ۹۰ درجه، دمای راحت.'],
  place: ['جای ثابت و نقطهٔ فرود', 'یک نقطه فقط برای مطالعه. اگر نداری، یک کیف ثابت با همان چیدمان همیشگی.'],
};

const DEVICES = {
  paper: ['کاغذ', 'حریف اصلی گوشی است. اول جای گوشی و اعلان‌ها را درست کن.'],
  laptop: ['لپ‌تاپ', 'حریف اصلی تب‌ها و پیام‌رسان دسکتاپ است: پروفایل جدا برای درس، تب اضافه بسته، مسدودکنندهٔ زمانی برای سایت‌های ستون سوم.'],
  phone: ['گوشی', 'ابزار و دام یک‌جاست: برنامهٔ درس تمام‌صفحه، قفل برنامه برای خروج، و کم‌کم بردن متن روی کاغذ یا رایانه.'],
};
const COLS = {
  urgent: ['فوری', 'فقط تماس همین‌ها از حالت تمرکز رد می‌شود. اگر شک داری، فوری نیست.'],
  later: ['تأخیرپذیر', 'اعلان لحظه‌ای نه؛ دو یا سه نوبت مشخص در روز.'],
  off: ['غیرضروری', 'اعلان کامل بسته، با عدد روی آیکون. بیرون از صفحهٔ اول و بدون ورود خودکار.'],
};
const TRIGGERS = { notif: 'اعلان', self: 'خودم، بدون اعلان', tab: 'تب رایانه', real: 'پیام مهم واقعی' };
const SNAGS = {
  restless: ['گوشی که دور است بی‌قرار می‌شوم', 'فاصله را کمی کم کن ولی کنترل را نگه دار: بدون اعلان، بیرون از دید، با یک نوبت چک بعد از جلسه.'],
  bypass: ['مسدودکننده را دور می‌زنم', 'قانون زیادی سخت بوده. مدتش را کوتاه‌تر و پنجرهٔ بازگشت را روشن‌تر کن؛ رمز را به یک نفر دیگر بسپار.'],
  reachable: ['باید در دسترس بمانم', 'کل سیستم را رها نکن؛ فهرست مجاز را دقیق‌تر کن. یکی دو نفر حق تماس دارند، بقیه می‌روند روی نوبت.'],
  onphone: ['روی گوشی درس می‌خوانم و به برنامهٔ بغلی می‌پرم', 'یا متن را از گوشی بیرون ببر، یا قفل برنامه را اجباری کن. «خودم کنترل می‌کنم» اینجا جواب نمی‌دهد.'],
  hard: ['تا مطلب سخت می‌شود به اینترنت پناه می‌برم', 'این دیگر فقط محیط نیست؛ میل به فرار از سختی است. محیط را دست نزن و همان لحظه «شروع نمی‌کنم یا فرار می‌کنم» را بزن.'],
  exception: ['چند روز خوب بود و با یک استثنا برگشت', 'برای استثنا از قبل قاعده بگذار: حتی روز امتحان اعلان غیرضروری باز نمی‌شود؛ فقط فهرست مجاز بزرگ‌تر می‌شود.'],
  bigger: ['خواب و خلقم هم به‌هم‌ریخته و گوشی از کنترلم خارج است', 'این از طراحی محیط مطالعه بزرگ‌تر است. کمک‌گرفتن از یک متخصص قدم منطقی‌تری است.'],
};

const MOODS = { good: 'خوب', ok: 'معمولی', low: 'بی‌حوصله' };
const PING = { focus: 'تمرکز کاری', pseudo: 'شبه‌تمرکز', away: 'حواس‌پرتی' };
const OUTER = ['phone', 'notif', 'tab', 'up', 'noise'], INNER = ['thought'];
const ISSUES = {
  nogoal: { label: 'هدف مشخصی نداشتم', advice: 'هدف را آن‌قدر کوچک کن که یک خروجیِ دیدنی داشته باشد. بدون هدف، تمرکز تعریف‌شدنی نیست.' },
  unstable: { label: 'توجهم پایدار نماند', advice: 'مهارت اصلی نپریدن نیست؛ زود فهمیدن و برگشتن است. دفعهٔ بعد برگشت‌ها را بشمار.' },
  pseudo: { label: 'شبه‌تمرکز', advice: 'بدن پای کار بود و پردازشی نبود. بعد از هر بخش ببند و یک جمله بازگو کن؛ نشد، همان‌جا برگرد.' },
  outer: { label: 'حواس‌پرتی بیرونی', advice: 'گره در چیدمان محیط است، نه در مهارت تمرکز. فعلاً فقط بدان منبع غالب کجاست.' },
  inner: { label: 'حواس‌پرتی درونی', advice: 'فکر را در یک خط بنویس، مشخص کن کِی به آن می‌رسی و برگرد سر همان خط.' },
  flow: { label: 'منتظر حس غرقگی بودم', advice: 'غرقگی شرط شروع یا معیار موفقیت نیست. کار پیش رفت و زحمت داشت؛ این خودِ تمرکز است.' },
};
const ATTN_SNAGS = {
  empty: ['برگه خالی ماند ولی جلسه بی‌نتیجه بود', 'پرش‌ها را ندیده‌ای، نه این‌که نبوده‌اند. زنگ را روی هر ۲ دقیقه بگذار و هر بار فقط بپرس: الان ذهنم کجا بود؟'],
  same: ['تمرکز کاری و شبه‌تمرکز را از هم تشخیص نمی‌دهم', 'در هر زنگ یک جمله از مطلب را آهسته بازگو کن. نشد، شبه‌تمرکز بود.'],
  all: ['کل جلسه حواس‌پرتی بود', 'واحد را کوچک کن: بلوک ده‌دقیقه‌ای با زنگ هر ۲ دقیقه. تکه‌های ۳۰ تا ۹۰ ثانیه‌ای تمرکز پیدا می‌شود؛ همان‌ها را ببین.'],
  low: ['پرش کم است ولی دقیقهٔ تمرکز هم کم', 'احتمالاً رخوت یا خستگی است. اگر برگرداندن توجه شدنی ولی پرزحمت است، مقاومت است؛ اگر مطلب ساده هم پردازش نمی‌شود، خستگی.'],
  lost: ['توجهم روی متن است ولی معنا ساخته نمی‌شود', 'این ضعف تمرکز نیست و با زور حل نمی‌شود. بنویس دقیقاً کدام واژه، مرحله یا رابطه را نمی‌فهمی.'],
  blame: ['موقع ثبت خودم را سرزنش می‌کنم', 'فقط ثبت، بدون داور. قضاوت برگه را خوش‌بینانه و بی‌فایده می‌کند.'],
  slow: ['زنگ‌ها رشتهٔ فکرم را پاره می‌کنند', 'اگر زنگ بیش از دو بار از یک مسیر فکری مفید بیرونت آورد، «فقط پایان» را بزن. وگرنه همین نسخه دقیق‌تر است.'],
  wide: ['در گفت‌وگو و کارهای موردعلاقه هم توجهم نمی‌ماند', 'اگر این الگو شدید و فراگیر است، از مهارت مطالعه بزرگ‌تر است. مطرح‌کردنش با یک متخصص منطقی است.'],
};

const STOPS = {
  sleepy: ['خواب‌آلودگی آشکار', 'زور نزن. استراحت، غذا یا خواب اول است.'],
  prereq: ['یک پیش‌نیاز را ندارم', 'اسم همان پیش‌نیاز را نقطهٔ ورود بعدی کن.'],
  lost: ['مطلب را اصلاً نمی‌فهمم', 'محل دقیق ابهام را بنویس. از اینجا مسئله فهم است، نه شروع.'],
  wrong: ['کار را اشتباه انتخاب کرده‌ام', 'کار درست را همین‌جا به‌عنوان نقطهٔ ورود بعدی بنویس.'],
  env: ['مزاحمت محیط', 'جا یا ساعت بعدی را مشخص بنویس.'],
  none: ['دلیل مشخصی ندارم', 'بدون دلیل مشخص، این همان مقاومت است که لباس منطق پوشیده. یک بازهٔ کوتاه دیگر را امتحان کن.'],
};
// مانع‌های لحظهٔ شروع: [برچسب، مسیر، آزمایش مرتبط]
const HURDLES = {
  vague: ['نمی‌توانم حرکت اول را در یک جمله بنویسم', 'کار را نصف کن و باز نصف، تا حرکتی سی‌ثانیه‌ای بماند. اگر هر روز نمی‌دانی از کدام درس، گره در کارت روزانه است.', 'loop'],
  cue: ['نشانه رخ نمی‌دهد یا از کنارش می‌گذرم', 'نشانه‌ای بردار که در هفت روز گذشته هر روز واقعاً رخ داده. اگر چنین چیزی نداری، ساعت مشخص بگذار.', 'time'],
  prep: ['در آماده‌سازی گیر می‌کنم', 'آماده‌سازی را به پایان جلسهٔ قبل ببر. در ده دقیقهٔ قبل از شروع، نه برنامهٔ تازه و نه منبع بهتر؛ همین منبع را باز کن.', ''],
  phone: ['گوشی یا اینترنت', 'این دسترسیِ آسان است، نه ضعف تو. فاصلهٔ فیزیکی را بیشتر کن: اتاق دیگر، حالت پرواز، یا دست یک نفر دیگر.', 'digital'],
  big: ['کار بزرگ و بی‌شکل است', 'حداکثر پنج دقیقه سه تا پنج زیرکار بنویس و همین امروز اولی را با ورود کوچک شروع کن. فهرست‌نویسیِ بیشتر خودش فرار است.', ''],
  fear: ['از بد انجام‌دادن می‌ترسم', 'عمداً زشت شروع کن: رونویسی کج‌وکوله، حل با حدس، تعریف ناقص. فقط ببین دقیقاً کجا گیر می‌کنی.', ''],
  one: ['فقط در یک درس شروع نمی‌کنم', 'حرکت اول را موقتاً «شناخت وضعیت» کن: پنج دقیقه فقط فهرست و تیترهای همان فصل.', ''],
  five: ['وارد می‌شوم ولی همیشه در همان پنج دقیقه تمام می‌کنم', 'از قبل و آشکارا بنویس: «بعد از ورود، مگر با دلیل مشخص، ده دقیقهٔ دیگر می‌مانم.» اگر ادامه واقعاً طاقت‌فرساست، بلوک را کوتاه‌تر بچین.', ''],
  alone: ['کنار دیگران شروع می‌کنم، تنها نه', 'فعلاً نشانه را به یک جا یا یک همراه گره بزن: رسیدن به کتابخانه، یا قرار مطالعهٔ هم‌زمان. داربست موقت است.', ''],
  tired: ['بدن خاموش است', 'زور نزن. یک ورود ۶۰ ثانیه‌ای آزمایشی؛ اگر خواندن یک خط هم فرو ریخت، استراحت و خواب اول است.', ''],
  days: ['چند روز است هیچ ورودی نبوده', 'نه جبران، نه جلسهٔ خوب. برای ۲۴ ساعت آینده فقط یک ورود ۶۰ ثانیه‌ای در زمان مشخص.', ''],
  wide: ['در بیشتر کارهای زندگی هم شروع نمی‌کنم', 'اگر هفته‌هاست ادامه دارد و خلق، انرژی یا خواب هم افت کرده، این از یک تکنیک مطالعه بزرگ‌تر است. حرف‌زدن با پزشک یا متخصص سلامت روان قدم معقول‌تری است.', ''],
  other: ['چیز دیگر', 'چند بار دیگر ثبت کن تا معلوم شود دقیقاً چیست.', ''],
};
const LOOP_SNAGS = {
  surprise: ['هر اتفاق غیرمنتظره کل هفته را می‌برد', 'بافر کم است. در جلسهٔ هفتگی فقط نیمی از ظرفیت را پر کن و ساعت ثابت را با نشانهٔ رویدادی عوض کن.'],
  quit: ['بعد از یک روز خراب کل هفته را رها می‌کنم', 'قانون ترمیم همان روز: یک کار را کوچک یا منتقل کن و بقیه را نگه دار. یک خانهٔ خالی یعنی اصلاح، نه ابطال.'],
  comp: ['روز بعد می‌خواهم دوبرابر جبران کنم', 'جبران ممنوع. فردا همان برنامهٔ عادی یا نسخهٔ حداقلی.'],
  guilt: ['بازبینی هفتگی عذاب وجدان می‌آورد', 'سؤال را عوض کن: «آن روز چه شرایطی جلسه را ریخت؟» و بازبینی را دقیقاً در هفتهٔ بد انجام بده؛ بیشترین داده همان‌جاست.'],
  tool: ['هر هفته ابزار یا قالب را عوض می‌کنم', 'همین کارت ساده را چهارده روز ثابت نگه دار. اگر بدون مرتب‌کردن بی‌قرار می‌شوی، برنامه‌ریزی دارد جای شروعِ سخت را پر می‌کند.'],
  anx: ['خودِ برنامه مضطربم می‌کند', 'سیستم را تنبیهی‌تر نکن؛ کوچک‌ترش کن. اگر این الگو در چند حوزهٔ زندگی هست و با خواب و انرژی گره خورده، مشورت با یک متخصص کمک می‌کند.'],
};

// قالب زمانی جلسه. bell: end = پایان‌دهنده، cue = یادآور، cap = سقف قطعی
const FMT = {
  short: { label: 'کوتاه', opts: [10, 15, 20], rest: 5, bell: 'end', note: 'یک واحد کوچک با یک خروجی کوچک. زنگ پایان‌دهنده است؛ همین یک نوبت هم جلسهٔ معتبر است.' },
  pomo: { label: 'پومودورو', opts: [25, 30, 35], rest: 5, bell: 'end', note: 'هر دوره یک واحد کار: یک مسئله یا بیست کارت. زنگ پایان‌دهنده است؛ کار تازه شروع نکن.' },
  deep: { label: 'بلوک عمیق', opts: [30, 40, 45, 60, 75, 90], rest: 10, bell: 'cue', note: 'فقط یک فعالیت. زنگ یادآور است: تا نزدیک‌ترین نقطهٔ توقف طبیعی برو و بایست.' },
  flex: { label: 'انعطاف‌پذیر', opts: [40, 50, 60], rest: 10, bell: 'cap', note: 'بازبینی در دقیقهٔ ۲۰ و بعد هر ده دقیقه با سه نشانه. این عدد سقف قطعی است و جابه‌جا نمی‌شود.' },
};
const FMT_ORDER = ['short', 'pomo', 'flex', 'deep'];
const SIGNS = ['همان خط را دوباره می‌خوانم و نمی‌فهمم', 'خطاهای پیش‌پاافتاده‌ام زیاد شده', 'نمی‌توانم بگویم قدم بعدی چیست'];
const FMT_CUTS = { none: 'هیچ‌جا', cut: 'زنگ وسط واحد کار برید', tail: 'نیمهٔ دوم بی‌حاصل بود' };
const FMT_SNAGS = {
  cut: ['زنگ مرتب وسط پیشرفت مفید می‌خورد', 'اول اندازهٔ واحد را درست کن: هر دوره یک مسئله. اگر کار واقعاً پیوسته است، برای همین نوع کار یک پله بالاتر برو و پومودورو را برای مرور نگه دار.'],
  tail: ['نیمهٔ دوم جلسه مرتب بی‌حاصل است', 'جلسهٔ بعد کوتاه‌تر، خروجی کوچک‌تر. چند جلسهٔ کوتاهِ تمام‌شده از یک جلسهٔ بلند که همیشه می‌شکند بیشتر می‌دهد.'],
  first: ['از همان دقایق اول چیزی روشن نمی‌شود، در هر قالبی', 'مسئله زمان‌بندی نیست. سراغ پیش‌نیاز، دشواری مطلب یا روش مطالعه برو؛ زمان‌سنج این را حل نمی‌کند.'],
  loose: ['جلسهٔ انعطاف‌پذیر یا کش می‌آید یا با اولین سختی تمام می‌شود', 'موقتاً انعطاف را کنار بگذار و سه جلسه فقط قالب ثابت اجرا کن. انعطاف مال وقتی است که به سقف و بازبینی پایبند بمانی.'],
  back: ['بعد از استراحت برنمی‌گردم', 'طول کار را دست نزن؛ استراحت را عوض کن: بدون صفحه‌نمایش، با زنگ و ساعت بازگشتِ نوشته‌شده. اگر یک هفته بعد هم نشد، مدتی فقط یک نوبت کار و پایان.'],
  start: ['حتی جلسهٔ ده‌دقیقه‌ای را هم شروع نمی‌کنم', 'مسئله شروع است، نه قالب.', 'start'],
  clock: ['مدام ساعت را نگاه می‌کنم و مضطرب می‌شوم', 'زمان‌سنج را از جلوی چشم بردار و فقط صدای پایانش را نگه دار، یا به‌جای شمارش معکوس ساعتِ پایان را بنویس.'],
  env: ['محیط مرتب جلسه را قطع می‌کند', 'برای آن بازه واحدهای کوتاه با خروجی مستقل بردار و بلوک عمیق را بگذار برای وقتی که واقعاً می‌توانی از آن محافظت کنی. وقفهٔ بیرونی ناتوانی تو نیست.'],
  hop: ['هر هفته قالب تازه‌ای امتحان می‌کنم', 'گشتن دنبال روش بهتر هم شکلی از عقب‌انداختن است. تا سه جلسهٔ هم‌نوع با یک قالب نگذشته، عوضش نکن.'],
  worn: ['دو نشانهٔ افت دارم و ده دقیقه استراحت هم برطرفش نکرد', 'جلسه را ببند و باقی‌مانده را یک خروجی کوچک برای جلسهٔ بعد کن. اگر این وضعیت پایدار است و فقط مال مطالعه نیست، بررسی با یک متخصص از زمان‌سنج‌های بیشتر مفیدتر است.'],
};

const TRACES = { solve: 'راه‌حل یا بخشی از آن', explain: 'توضیح نوشته', map: 'ساختار بخش', stuck: 'محل دقیق گیر', none: 'هیچ' };
const RAMP_FAILS = {
  vague: ['هدف مبهم', 'فعل را عوض کن. «بخوانم» را کنار بگذار: «بدون نگاه، این بخش را در پنج خط توضیح می‌دهم» یا «تا خط سوم راه‌حل می‌نویسم».'],
  lost: ['مطلب نامفهوم', 'به‌زور ادامه نده. گم‌شده را در یک خط بنویس: کدام کلمه، قانون یا پیش‌نیاز. این «ورود ناموفق» نیست؛ مسئله فهم است.'],
  big: ['واحد بزرگ', 'نصفش کن: یک زیرمرحله، نه کل مسئله.'],
  phone: ['گوشی', 'جلسهٔ بعد گوشی را قبل از نشستن به اتاق دیگر ببر. اگر تقریباً هر جلسه تکرار می‌شود، با اراده حلش نکن.'],
  stall: ['تعلل در بارگذاری', 'رمپ به تعلل تبدیل شده. زنگ تمدید ندارد؛ با سؤال ناقص هم برو سراغ قفل.'],
  tired: ['خستگی', 'رمپ کم‌خوابی را جبران نمی‌کند. اگر نوشتن یک جمله هم ممکن نیست، خواب و استراحت اول است.'],
};
const RAMP_SNAGS = {
  nosit: ['اصلاً نمی‌نشینم یا کار را باز نمی‌کنم', 'این شروع است، نه ورود.', 'start'],
  norescue: ['بررسی میانی کامل نشد و «نجات» را هم اجرا نکردم', 'مشکل از اجراست، نه روش. یک بلوک دیگر را فقط با اجرای درست نجات آزمون کن: سؤالِ گیر در یک خط، بعد کوچک‌ترین قدم.'],
  fake: ['«وارد شدم» ولی خروجی‌ام هایلایت و دوباره‌خوانی است', 'ورود صوری بوده؛ سکوت را با عمق اشتباه گرفته‌ای. واحد را مطالبه‌گر کن و با همان مدت دوباره آزمون کن، نه طولانی‌تر.'],
  easy: ['کار آن‌قدر آسان است که حوصله‌ام سر می‌رود', 'یک درجه سخت‌تر: از خواندن به توضیحِ بدون متن، یا از مثال حل‌شده به مسئلهٔ مشابهِ بدون راه‌حل.'],
  leave: ['در بررسی میانی داخل بودم، ولی بعدش نمی‌مانم', 'رمپ کارش را کرده. حالا مسئله نگه‌داشتن تمرکز است، یا بلوک از ظرفیت فعلی‌ات بلندتر است؛ کوتاهش کن.', 'keep'],
  one: ['فقط در یک درس وارد نمی‌شوم', 'تمرکز عمومی نیست. یا پیش‌نیاز و روش همان درس است، یا فرار از درسی که احتمال شکست در آن را بالا می‌بینی.'],
  hour: ['فقط در ساعت‌های خاصی وارد می‌شوم', 'جای کار عمیق را در روزت جابه‌جا کن.', 'time'],
  three: ['سه بلوک پیاپی درست اجرا شد و هیچ خروجی نبود', 'بلوک چهارم را همان‌شکل نگذار. فقط یک متغیر: هدف، اندازهٔ واحد، یا جای گوشی. عمق با فشار بیشتر ساخته نمی‌شود.'],
  wide: ['چند هفته است در هیچ درسی و بیرون از درس هم نمی‌توانم روی یک کار بمانم', 'نتیجه نگیر که ذاتاً تمرکز نداری. اگر با خواب مناسب هم همین است یا فشار روانی‌ات زیاد است، گفت‌وگو با پزشک یا روان‌شناس قدم منطقی بعدی است.'],
};

const JUMPS = { thought: 'فکر', check: 'میل به چک', outer: 'محرک بیرونی', real: 'وقفهٔ واقعی', look: 'جست‌وجو' };
const KEEP_PARTS = { phone: 'جای گوشی', sheet: 'برگهٔ پارک', note: 'یادداشت بازگشت', guard: 'اگر، آنگاه' };
const KEEP_SNAGS = {
  blind: ['اصلاً متوجه پرش نمی‌شوم؛ یک ربع بعد به خودم می‌آیم', 'گره در «دیدن» است. چند جلسه «نقشهٔ توجه» را روی هر ۵ دقیقه بگذار و هر بار بپرس: ذهنم کجاست، قدم بعدی چیست؟ کمک موقت است.'],
  phone: ['گوشی هر بار برنده می‌شود', 'اراده نیست، دسترسی است. یک مرحله اصطکاک بیشتر: اتاق دیگر یا دست یکی از اعضای خانه. اگر ابزار درس است، فقط همان فایل و حالت پرواز.', 'digital'],
  again: ['فکر پارک‌شده مدام برمی‌گردد', 'یا مبهم نوشته‌ای («کارها»)، یا هیچ‌وقت سراغ برگه نمی‌روی. مشخصش کن و بعد از همین جلسه واقعاً رسیدگی کن تا ذهن به برگه اعتماد کند. اگر واقعاً زمان‌حساس است، جلسه را آگاهانه نگه دار و با لنگر برگرد.'],
  worry: ['نگرانی است و اقدام روشنی ندارد', 'یک زمان مشخص بیرون از مطالعه برایش بگذار و فعلاً به قدم کوچک برگرد.'],
  ink: ['نوشتنِ فکر بیشتر درگیرم می‌کند', 'نسخهٔ تک‌کلمه‌ای را روشن کن: فقط «خانه»، «نمره»؛ زمان رسیدگی برای همه ثابت. اگر برچسب هم نشخوار ساخت، ثبت فکر را کنار بگذار و فقط به قدم بعدی برگرد.'],
  hard: ['پرش‌ها دقیقاً سر بخش سخت می‌آیند', 'قدم بعدی را کوچک‌تر کن: «فقط داده‌ها را بنویسم». اگر گیر از نفهمیدن است، بنویس دقیقاً چه چیزی را نمی‌فهمی.'],
  noise: ['آدم‌ها و سروصدا هر روز تکرار می‌شوند', 'این دیگر شرایط محیط است. تا آن زمان جلسه را کوتاه‌تر کن، چند سؤال مستقل بردار و یادداشت بازگشت را اجباری کن.', 'env'],
  fog: ['بعد از بازگشت‌های مکرر، کار مه‌آلود و پرخطاست', 'احتمالاً خستگی است، نه کم‌جدیتی. زور را قطع کن و چند دقیقه بدون گوشی از میز دور شو. اگر مه ماند، کار سبک‌تر یا پایان جلسه.'],
  show: ['خودِ پروتکل شلوغ و نمایشی شده', 'حداقلش را نگه دار: برگه، گوشیِ دور، و یک سؤال: «ضروری است؟ اگر نه، قدم بعدی چیست؟»'],
  wide: ['حواس‌پرتی شدید و قدیمی است و در بیشتر زندگی‌ام هست', 'این فقط تکنیک مطالعه نیست و این اپ جای تشخیصش نیست. گفت‌وگو با روان‌شناس یا پزشک کمک می‌کند. تا آن زمان، تک‌کلمه و قدم‌های کوچک از جنگیدن با فکر بهتر است.'],
};

const VAGUE_VERBS =/(بخوانم|بخونم|مطالعه کنم|مرور کنم|کار کنم|بفهمم|یاد بگیرم|مسلط شوم|مسلط بشوم|مسلط بشم|تمام کنم|تموم کنم|نگاه کنم|ببینم)\s*[.!]?$/;
const SEEN_CRITERION = /(وقتی (دیدم|ببینم)|مرور کنم|بخوانم|بخونم)/;

/* ---------- ذخیره‌سازی ---------- */

const KEY = 'ketab-baste';
const blankDb = () => ({
  sessions: [], obstacles: [], experiment: null, active: null, tab: 'today',
  plans: [], abandoned: [], logs: [], days: {}, baseline: null, pattern: null, myths: [], mythWrap: null, lab: 'hub',
  env: null, digital: null, tplans: [], landing: null,
  starts: [], startLab: null, attn: null, weeks: [], loop: null,
  ramp: null, keep: null, fmtLab: null, parked: [], formats: {}, guard: '', guideSeen: false, book: {}, chapters: [], habits: [{}, {}],
  ai: { calls: 0, tin: 0, tout: 0, cost: 0, day: 0, dayCalls: 0, cache: [], trend: null },
});
let db = blankDb();

// فیلتر فصل‌ها: db.chapters خالی یعنی همه. فیلتر فقط پنهان می‌کند و هیچ داده‌ای را پاک نمی‌کند.
// هر ابزار به فصل خودش وصل است؛ تا وقتی فصلش مرور نشده، زیر «بقیه» (۰) می‌ماند.
const CHAPTERS = [[1, 'مطالعهٔ مؤثر'], [2, 'چرا سخت است؟'], [3, 'توجه و یادگیری'], [4, 'افسانه‌های مطالعه'], [5, 'نقطهٔ شروع'], [6, 'هدف خروجی‌محور'], [0, 'بقیهٔ فصل‌ها']];
// آزمایش‌های زبانهٔ «آزمایش» و فصلشان؛ هرچه اینجا نیست زیر «بقیه» است
const LAB_CH = { reread: 3, myths: 4, baseline: 5 };
const labOn = (view) => chOn(LAB_CH[view] ?? 0);
const anyLab = () => chOn(0) || Object.values(LAB_CH).some((c) => chOn(c));
const chOn = (ch, list = db.chapters) => !list.length || list.includes(ch);
try {
  db = Object.assign(blankDb(), JSON.parse(localStorage.getItem(KEY) || '{}'));
} catch (e) { /* دادهٔ خراب: از صفر شروع می‌کنیم */ }

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(db)); } catch (e) { toast('ذخیره نشد؛ حافظهٔ مرورگر پر است.'); }
  if (!acc.uid) return;
  const c = coreOf(db);
  if (c !== lastCore) { lastCore = c; acc.dirty = true; saveAcc(); syncSoon(); }
}

/* ---------- حساب و همگام‌سازی ---------- */

// Firebase از راه REST و بدون کتابخانه. این کلید عمومی است؛ امنیت را قانون‌های Firestore می‌دهد:
// هر کاربر فقط سند users/{uid} خودش را می‌خواند و می‌نویسد.
const FB = { key: 'AIzaSyDk4Wzf7GHn6cn4EjKkTIyfTx8PmjlelI4', project: 'ketab-baste' };
const ACC_KEY = 'ketab-baste-acc';
let acc = {};
try { acc = JSON.parse(localStorage.getItem(ACC_KEY) || '{}'); } catch (e) { /* بدون حساب */ }
const saveAcc = () => { try { localStorage.setItem(ACC_KEY, JSON.stringify(acc)); } catch (e) { /* بدون ذخیره */ } };

// جابه‌جایی بین زبانه‌ها تغییر داده نیست و نباید چیزی بفرستد
const coreOf = (d) => JSON.stringify({ ...d, tab: '', lab: '' });
let lastCore = acc.uid ? coreOf(db) : '', syncTimer = 0, syncing = false, syncErr = '';
const syncSoon = () => { clearTimeout(syncTimer); syncTimer = setTimeout(sync, 4000); };

const ACC_ERR = {
  EMAIL_EXISTS: 'با این ایمیل قبلاً حساب ساخته شده. «ورود» را بزن.',
  INVALID_LOGIN_CREDENTIALS: 'ایمیل یا رمز درست نیست.',
  EMAIL_NOT_FOUND: 'ایمیل یا رمز درست نیست.',
  INVALID_PASSWORD: 'ایمیل یا رمز درست نیست.',
  INVALID_EMAIL: 'ایمیل را درست بنویس.',
  WEAK_PASSWORD: 'رمز دست‌کم ۶ نویسه باشد.',
  MISSING_PASSWORD: 'رمز را بنویس.',
  TOO_MANY_ATTEMPTS_TRY_LATER: 'تلاش زیاد بود. چند دقیقه بعد دوباره امتحان کن.',
  USER_DISABLED: 'این حساب بسته شده است.',
};

async function fbFetch(url, opts) {
  const r = await fetch(url, { cache: 'no-store', ...opts }).catch(() => { throw new Error('اینترنت وصل نیست.'); });
  return [r, await r.json().catch(() => ({}))];
}

async function fbAuth(path, body) {
  const [r, j] = await fbFetch(`https://identitytoolkit.googleapis.com/v1/accounts:${path}?key=${FB.key}`,
    { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
  if (!r.ok) throw new Error(ACC_ERR[(j.error?.message || '').split(' ')[0]] || 'نشد. دوباره امتحان کن.');
  return j;
}

async function fbToken() {
  if (acc.exp - Date.now() > 6e4) return acc.idToken;
  const [r, j] = await fbFetch(`https://securetoken.googleapis.com/v1/token?key=${FB.key}`,
    { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: 'grant_type=refresh_token&refresh_token=' + encodeURIComponent(acc.refresh) });
  if (r.status === 400) { accLeave(); throw new Error('از حساب بیرون افتاده‌ای. دوباره وارد شو.'); }
  if (!r.ok) throw new Error('همگام‌سازی نشد. بعداً دوباره تلاش می‌شود.');
  Object.assign(acc, { idToken: j.id_token, refresh: j.refresh_token, exp: Date.now() + j.expires_in * 1000 }); saveAcc();
  return acc.idToken;
}

async function fbDoc(method, query = '', body) {
  return fbFetch(`https://firestore.googleapis.com/v1/projects/${FB.project}/databases/(default)/documents/users/${acc.uid}${query}`,
    { method, headers: { authorization: 'Bearer ' + await fbToken(), 'content-type': 'application/json' }, body: body && JSON.stringify(body) });
}

async function pull() {
  const [r, j] = await fbDoc('GET');
  if (r.status === 404) return null;
  if (!r.ok) throw new Error('همگام‌سازی نشد. بعداً دوباره تلاش می‌شود.');
  return { data: JSON.parse(j.fields.data.stringValue), at: j.updateTime };
}

// فقط وقتی می‌نویسد که حساب از آخرین دیدارِ این دستگاه عوض نشده باشد؛ وگرنه false
async function push() {
  const sent = lastCore;
  const [r, j] = await fbDoc('PATCH', acc.at ? '?currentDocument.updateTime=' + encodeURIComponent(acc.at) : '?currentDocument.exists=false',
    { fields: { data: { stringValue: JSON.stringify(db) } } });
  if (['FAILED_PRECONDITION', 'ALREADY_EXISTS', 'NOT_FOUND'].includes(j.error?.status)) return false;
  if (!r.ok) throw new Error(r.status === 400 ? 'داده‌ها برای حساب بیش از اندازه بزرگ شده. یک فایل پشتیبان بگیر.' : 'همگام‌سازی نشد. بعداً دوباره تلاش می‌شود.');
  acc.at = j.updateTime; acc.dirty = lastCore !== sent;
  return true;
}

function adopt(remote) {
  db = Object.assign(blankDb(), remote.data, { tab: db.tab });
  acc.at = remote.at; acc.dirty = false; lastCore = coreOf(db);
  render();
}

async function sync() {
  if (!acc.uid || syncing) return;
  syncing = true; clearTimeout(syncTimer);
  try {
    if (!acc.dirty || !await push()) {
      const remote = await pull();
      if (!remote) { acc.at = ''; await push(); }
      else if (remote.at !== acc.at) {
        if (acc.dirty && !confirm('هم این دستگاه و هم حسابت از آخرین همگام‌سازی عوض شده‌اند.\n\nتأیید: دادهٔ حساب می‌آید.\nلغو: دادهٔ این دستگاه می‌ماند و به حساب می‌رود.')) { acc.at = remote.at; await push(); }
        else adopt(remote);
      }
    }
    syncErr = '';
  } catch (e) { syncErr = e.message; }
  syncing = false; saveAcc();
  if (acc.dirty && !syncErr) syncSoon();
  if (db.tab === 'settings' && !A() && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName || '')) render();
}

const hasLocal = () => coreOf({ ...db, guideSeen: false, active: null }) !== coreOf(blankDb());

async function accEnter(j) {
  const mine = acc.owner === j.localId, fresh = !acc.owner;
  acc = { uid: j.localId, email: j.email, idToken: j.idToken, refresh: j.refreshToken, exp: Date.now() + j.expiresIn * 1000,
    owner: j.localId, at: mine ? acc.at : '', dirty: mine && !!acc.dirty };
  lastCore = coreOf(db);
  if (!mine) {
    const remote = await pull();
    // دادهٔ این دستگاه یا مال کاربر دیگری است، یا هنوز به هیچ حسابی نرفته
    if (!fresh) adopt(remote || { data: {}, at: '' });
    else if (remote && (!hasLocal() || confirm('این حساب از قبل داده دارد.\n\nتأیید: دادهٔ حساب جای دادهٔ این دستگاه می‌آید.\nلغو: دادهٔ این دستگاه می‌ماند و به حساب می‌رود.'))) adopt(remote);
    else { acc.at = remote ? remote.at : ''; acc.dirty = true; }
  }
  saveAcc(); await sync();
}

// خروج: دادهٔ همین دستگاه می‌ماند و اگر همین کاربر برگردد، از همان‌جا ادامه می‌دهد
function accLeave() {
  acc = { owner: acc.owner, at: acc.at, dirty: acc.dirty }; saveAcc(); clearTimeout(syncTimer);
}

/* ---------- ابزارها ---------- */

const $ = (s, el = document) => el.querySelector(s);
const fa = (n) => String(n).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);
const fa1 = (x) => fa(String(Math.round(x * 10) / 10).replace('.', '٫'));
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const DAY = 864e5;
const dayKey = (ts) => { const d = new Date(ts); return d.getFullYear() * 1e4 + (d.getMonth() + 1) * 100 + d.getDate(); };
const today = () => dayKey(Date.now());
const startOfDay = (ts) => { const d = new Date(ts); d.setHours(0, 0, 0, 0); return d.getTime(); };
const addDays = (ts, n) => { const d = new Date(startOfDay(ts)); d.setDate(d.getDate() + n); return d.getTime(); };
const dateFa = (ts) => new Date(ts).toLocaleDateString('fa-IR', { weekday: 'long', day: 'numeric', month: 'long' });
const weekdayFa = (ts) => new Date(ts).toLocaleDateString('fa-IR', { weekday: 'long' });
const clock = (ms) => { const s = Math.max(0, Math.ceil(ms / 1000)); return fa(String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0')); };
const elapsedMin = (from) => Math.max(1, Math.round((Date.now() - from) / 6e4));
const sum = (list, pick) => list.reduce((n, x) => n + (pick(x) || 0), 0);
const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, Math.round(+n) || 0));
const has = (s) => !!(s || '').trim();
const avg = (list, pick) => (list.length ? sum(list, pick) / list.length : null);
const round5 = (n) => Math.ceil(n / 5) * 5;
const hm = (t) => { const [h, m] = (t || '').split(':').map(Number); return h * 60 + (m || 0); };
const span = (f, t) => fa(f) + (t ? ' تا ' + fa(t) : '');
const tomorrowKey = () => dayKey(addDays(Date.now(), 1));

function setPath(path, value) {
  const keys = path.split('.');
  let o = db;
  keys.slice(0, -1).forEach((k) => { o = o[k] ??= {}; });
  o[keys[keys.length - 1]] = value;
}

function toast(msg) {
  let t = $('#toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), 3200);
}

function ding() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [0, 0.35].forEach((at) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.value = 660; o.connect(g); g.connect(ctx.destination);
      g.gain.setValueAtTime(0.0001, ctx.currentTime + at);
      g.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + at + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + at + 0.3);
      o.start(ctx.currentTime + at); o.stop(ctx.currentTime + at + 0.32);
    });
  } catch (e) { /* بدون صدا */ }
  if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
}

function notify(body) {
  if (!('Notification' in window) || Notification.permission !== 'granted' || !document.hidden) return;
  navigator.serviceWorker?.ready.then((r) => r.showNotification('ویر', { body, icon: 'icons/icon-192.png', lang: 'fa', dir: 'rtl' })).catch(() => {});
}

function download(name, text, type) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text], { type }));
  a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

function calendarReminder(session) {
  const d = new Date(Date.now() + DAY);
  const p = (n) => String(n).padStart(2, '0');
  const stamp = (x) => `${x.getFullYear()}${p(x.getMonth() + 1)}${p(x.getDate())}T${p(x.getHours())}${p(x.getMinutes())}00`;
  const end = new Date(d.getTime() + 10 * 6e4);
  const text = (s) => s.replace(/[\\;,]/g, (c) => '\\' + c).replace(/\n/g, ' ');
  download('bazyabi-farda.ics', [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//ketab-baste//fa', 'BEGIN:VEVENT',
    `UID:${session.id}@ketab-baste`, `DTSTAMP:${stamp(new Date())}`, `DTSTART:${stamp(d)}`, `DTEND:${stamp(end)}`,
    `SUMMARY:${text('بازیابی ده‌دقیقه‌ای: ' + session.subject)}`,
    `DESCRIPTION:${text('قبل از مطالعهٔ تازه، از حافظه بنویس: ' + session.goal)}`,
    'BEGIN:VALARM', 'ACTION:DISPLAY', 'DESCRIPTION:بازیابی', 'TRIGGER:PT0M', 'END:VALARM',
    'END:VEVENT', 'END:VCALENDAR',
  ].join('\r\n'), 'text/calendar');
}

/* ---------- محاسبه‌ها ---------- */

const dueRetrievals = () => db.sessions.filter((s) => !s.retrieved && dayKey(s.date) < today() && Date.now() - s.date < 7 * DAY);
const feelMatches = (s) => (s.feel >= 7 && s.outcome === 'full') || (s.feel >= 4 && s.feel <= 6 && s.outcome === 'partial') || (s.feel <= 3 && s.outcome === 'none');
const OUTCOME = { full: 'رسیدم', partial: 'تا حدی', none: 'نرسیدم' };
const realOf = (s) => s.real ?? s.studied;

function tally(list, pick) {
  const m = {};
  list.forEach((x) => { const k = pick(x); if (k) m[k] = (m[k] || 0) + 1; });
  return Object.entries(m).sort((a, b) => b[1] - a[1]);
}

const goalHint = (goal) => (!goal ? '' : VAGUE_VERBS.test(goal)
  ? 'این فعل از بیرون دیده نمی‌شود. بنویس در پایان چه کاری را بدون نگاه‌کردن انجام می‌دهی: حل کنم، توضیح بدهم، بنویسم، مقایسه کنم.'
  : goal.length > 140 ? 'خروجی بزرگ است. آن‌قدر باریکش کن که در همین جلسه تمام شود.' : '');
const criterionHint = (c) => (SEEN_CRITERION.test(c || '') ? 'این معیار با نگاه به متن هم اجرا می‌شود. چیزی بنویس که فقط از حافظه شدنی باشد.' : '');

// بلندترین فاصلهٔ بدون وقفه، از روی لحظه‌های ثبت‌شده در همین جلسه
function longestFocus(a) {
  const pts = [a.startedAt, ...a.urges.map((u) => u.at).filter(Boolean), Date.now()];
  let max = 0;
  for (let i = 1; i < pts.length; i++) max = Math.max(max, pts[i] - pts[i - 1]);
  return Math.max(1, Math.round(max / 6e4));
}

const sleepHours = (d) => {
  if (!d?.bed || !d?.wake) return null;
  const [bh, bm] = d.bed.split(':').map(Number), [wh, wm] = d.wake.split(':').map(Number);
  let m = wh * 60 + wm - (bh * 60 + bm);
  if (m <= 0) m += 1440;
  return m / 60;
};

const causesOf = (sessions, logs) => [
  ...sessions.flatMap((s) => [...s.urges.map((u) => u.cause), ...(s.cause ? Array(Math.max(0, (s.breaks || 0) - s.urges.length)).fill(s.cause) : [])]),
  ...logs.flatMap((l) => (l.cause ? Array(l.breaks || 0).fill(l.cause) : [])),
].filter(Boolean);

const baseDayNo = (b) => Math.round((startOfDay(Date.now()) - startOfDay(b.start)) / DAY) + 1;
const baseRunning = (b) => Date.now() < addDays(b.start, b.days);

function baselineDays(b) {
  return Array.from({ length: b.days }, (_, i) => {
    const ts = addDays(b.start, i), k = dayKey(ts);
    const ss = db.sessions.filter((s) => dayKey(s.date) === k), ls = db.logs.filter((l) => dayKey(l.date) === k);
    return {
      ts, n: ss.length + ls.length, day: db.days[k] || null,
      presence: sum(ss, (s) => s.studied) + sum(ls, (l) => l.presence),
      real: sum(ss, realOf) + sum(ls, (l) => l.real),
      longest: Math.max(0, ...ss.map((s) => s.longest || 0), ...ls.map((l) => l.longest || 0)),
      causes: causesOf(ss, ls),
      signs: [...ss.map((x) => x.can), ...ls.map((l) => l.sign)].filter(has),
    };
  });
}

function baselineProfile(b) {
  const days = baselineDays(b);
  const slept = days.filter((d) => sleepHours(d.day) != null), rated = days.filter((d) => d.day?.quality);
  const energy = SLOTS.map((_, n) => n + 1).map((i) => { const v = days.map((d) => d.day?.['e' + i]).filter(Boolean); return v.length ? sum(v, (x) => x) / v.length : 0; });
  const pair = rated.filter((d) => d.n).sort((x, y) => y.day.quality - x.day.quality);
  let link = '';
  if (pair.length < 2) link = 'برای دیدن رابطه، دست‌کم دو روز هم خواب و هم جلسه ثبت کن.';
  else {
    const best = pair[0], worst = pair[pair.length - 1], diff = best.longest - worst.longest;
    link = best.day.quality === worst.day.quality ? 'کیفیت خواب این روزها یکسان بود؛ رابطه‌ای دیده نمی‌شود.'
      : diff > 0 ? `بعد از بهترین خواب، تمرکز پیوسته ${fa(diff)} دقیقه بلندتر از بعدِ بدترین خواب بود.`
      : diff < 0 ? `بعد از بهترین خواب، تمرکز پیوسته ${fa(-diff)} دقیقه کوتاه‌تر بود؛ خواب تنها عامل نیست.`
      : 'تمرکز بعد از خواب خوب و بد فرقی نکرد.';
  }
  return {
    days, link, linked: pair.length >= 2,
    records: sum(days, (d) => d.n),
    avgReal: sum(days, (d) => d.real) / days.length,
    presence: sum(days, (d) => d.presence), real: sum(days, (d) => d.real),
    longest: Math.max(0, ...days.map((d) => d.longest)),
    cause: tally(days.flatMap((d) => d.causes), (c) => c)[0]?.[0] || null,
    sleep: slept.length ? sum(slept, (d) => sleepHours(d.day)) / slept.length : null,
    quality: rated.length ? sum(rated, (d) => d.day.quality) / rated.length : null,
    slot: Math.max(...energy) ? SLOTS[energy.indexOf(Math.max(...energy))] : null,
  };
}

/* محیط، دیجیتال و زمان */

const countCause = (s, c) => s.urges.filter((u) => u.cause === c).length;
const firstBreakOf = (s) => s.urges[0]?.min ?? s.studied;
const startOf = (s) => s.date - s.studied * 6e4;
const slotOf = (ts) => { const h = new Date(ts).getHours(); return h < 5 ? 3 : h < 12 ? 0 : h < 16 ? 1 : h < 20 ? 2 : 3; };
const auditLeft = (e) => Object.keys(AUDIT).filter((k) => !e.audit?.[k]?.done).length;

function envStats(list) {
  const timed = list.filter((s) => s.lag != null);
  return { n: list.length, timed: timed.length, up: avg(list, (s) => countCause(s, 'up')), reach: avg(list, (s) => countCause(s, 'phone')), lag: avg(timed, (s) => s.lag) };
}

function digDays(d) {
  return Array.from({ length: 7 }, (_, i) => {
    const ts = addDays(d.start, i), k = dayKey(ts);
    const ss = db.sessions.filter((s) => dayKey(s.date) === k), ls = db.logs.filter((l) => dayKey(l.date) === k);
    const c = causesOf(ss, ls), n = (x) => c.filter((y) => y === x).length;
    return {
      ts, n: ss.length + ls.length, sessions: ss.length,
      minutes: sum(ss, (s) => s.studied) + sum(ls, (l) => l.presence),
      pickups: n('phone'), switches: n('tab'), notifs: n('notif'),
      first: ss.length ? Math.min(...ss.map(firstBreakOf)) : null,
      focus: ss.filter((s) => s.focusOn).length,
    };
  });
}

// نقشهٔ انرژی از ثبت‌های هفت روز اخیر
function energyMap() {
  const from = dayKey(Date.now() - 6 * DAY);
  const days = Object.entries(db.days).filter(([k]) => +k >= from).map(([, d]) => d).filter((d) => SLOTS.some((_, i) => d['e' + (i + 1)]));
  const avgs = SLOTS.map((_, i) => avg(days.map((d) => d['e' + (i + 1)]).filter(Boolean), (x) => x));
  const rated = avgs.filter((x) => x != null);
  const ready = days.length >= 3 && rated.length >= 2;
  const max = Math.max(...rated), min = Math.min(...rated);
  const flat = ready && max - min < 0.5, ok = ready && !flat;
  return { n: days.length, avgs, ready, flat, peak: ok ? avgs.indexOf(max) : -1, trough: ok ? avgs.lastIndexOf(min) : -1 };
}
const slotLabel = (m, i) => (i === m.peak ? 'اوج' : i === m.trough ? 'فرود' : m.peak >= 0 && m.avgs[i] != null ? 'متوسط' : '·');

const effMin = (k) => sum(db.sessions.filter((s) => dayKey(s.date) === k), realOf) + sum(db.logs.filter((l) => dayKey(l.date) === k), (l) => l.real);
function capacity() {
  const y = effMin(dayKey(Date.now() - DAY)), t = effMin(today());
  const mean = avg([y, t].filter(Boolean), (x) => x);
  return { y, t, mean, cap: mean ? Math.max(10, round5(mean * 0.7)) : null };
}

const planFor = (k) => db.tplans.filter((p) => p.day === k).pop();
const dayWord = (p) => (p.day === today() ? 'امروز' : p.day === tomorrowKey() ? 'فردا' : weekdayFa(p.ts));
const estOf = (a) => (a.base > 0 ? round5(a.base * (coef() || (a.hist === 'no' ? 1.3 : 1.2))) : 0);
const blockFor = (m) => [...BLOCKS].reverse().find((b) => b <= m) || BLOCKS[0];
const lockLine = (p) => `${dayWord(p)}، ${span(p.from, p.to)}، «${esc(p.task)}» را ${fa(p.minutes)} دقیقه انجام می‌دهم. اگر نشد، ${span(p.altFrom, p.altTo)} نسخهٔ کوچک: ${esc(p.small)}.`;
const reviewDue = () => db.tplans.filter((p) => p.day <= today() && !p.reviewed && p.ts >= addDays(Date.now(), -3)
  && (p.done || p.day < today() || new Date().getHours() >= 18)).pop();

function winOf(p, ts) {
  const d = new Date(ts), now = d.getHours() * 60 + d.getMinutes();
  const inside = (f, t) => !!f && now >= hm(f) - 15 && now <= (t ? hm(t) : hm(f) + p.minutes);
  return dayKey(ts) !== p.day ? 'other' : inside(p.from, p.to) ? 'peak' : inside(p.altFrom, p.altTo) ? 'alt' : 'other';
}

function planChecks(p, cap) {
  const all = [{ load: 'heavy', win: 'peak', min: p.minutes || 0 }, ...p.tasks];
  const total = sum(all, (t) => t.min);
  return [
    cap && total > cap && `جمع برنامه ${fa(total)} دقیقه است و سقف واقعی‌ات ${fa(cap)}. یک کار را بردار یا نسخهٔ کوچک‌ترش را بنویس؛ بقیه جای زندگی واقعی است.`,
    all.filter((t) => t.load === 'heavy').length > 3 && 'بیشتر از سه کار سنگین در یک روز، برنامهٔ آرزوست. دو یا سه تا کافی است.',
    all.some((t) => t.load === 'heavy' && t.win === 'trough') && 'یک کار سنگین را در فرود گذاشته‌ای. فقط وقتی هیچ اختیار دیگری نداری.',
    all.some((t) => t.load === 'light' && t.win === 'peak') && 'یک کار سبک وارد اوج شده. آن را به فرود ببر.',
  ].filter(Boolean);
}

/* حلقهٔ برنامه، نقشهٔ توجه و لحظهٔ شروع */

// ضریب خطای شخصی: زمان واقعی تقسیم بر اولین تخمین
function coef() {
  const t = db.tplans.filter((p) => p.actual > 0 && p.base > 0 && p.done && p.done !== 'no').slice(-7);
  const z = db.loop?.k0 || {};
  const guess = [1, 2, 3].filter((i) => z['e' + i] > 0 && z['a' + i] > 0).map((i) => z['a' + i] / z['e' + i]);
  const k = t.length >= 3 ? avg(t, (p) => p.actual / p.base) : avg(guess, (x) => x);
  return k ? Math.min(3, Math.max(1, k)) : null;
}

const weekNow = () => db.weeks.filter((w) => w.made >= addDays(Date.now(), -6)).pop();
const markOf = (p) => (!p.done ? '·' : p.done === 'no' ? '✗' : p.state === 'part' || p.state === 'min' ? '~' : '✓');
const planOk = (p) => !!p.done && (p.done === 'no' ? p.carry === 'move' || p.carry === 'shrink' : p.state !== 'part' || !!p.carry);
const didStart = (k) => effMin(k) > 0 || db.starts.some((x) => dayKey(x.date) === k && x.after !== 'miss');

function loopDays(from, n) {
  return Array.from({ length: n }, (_, i) => {
    const ts = addDays(from, i), k = dayKey(ts), p = planFor(k);
    return { ts, k, p, past: k <= today(), worked: didStart(k) };
  });
}

function loopStats(days) {
  const cards = days.filter((d) => d.p).map((d) => d.p), ran = cards.filter((p) => p.done && p.done !== 'no');
  return {
    cards: cards.length, logged: cards.filter((p) => p.reviewed).length,
    full: ran.filter((p) => markOf(p) === '✓').length, part: ran.filter((p) => markOf(p) === '~').length,
    none: cards.filter((p) => p.done === 'no').length, ok: cards.filter(planOk).length,
    ratio: avg(ran.filter((p) => p.actual > 0), (p) => p.actual / p.minutes),
    took: avg(cards.filter((p) => p.took), (p) => p.took),
    block: tally(cards, (p) => (p.block || '').trim())[0]?.[0] || '',
  };
}

const sideOf = (c) => (OUTER.includes(c) ? 'out' : INNER.includes(c) ? 'in' : '');
const awayOf = (s) => Math.max(0, s.studied - realOf(s) - (s.pseudo || 0));
const twoLines = (s) => (s.recall || '').trim().length >= 30;
const mapSentence = (s) => `${fa(s.studied)} دقیقه نشستم؛ حدود ${fa(realOf(s))} دقیقه تمرکز کاری، ${fa(s.pseudo || 0)} شبه‌تمرکز و ${fa(awayOf(s))} حواس‌پرتی، با ${fa(s.urges.length)} پرش.`;

function guessIssue(a) {
  const sides = a.urges.map((u) => sideOf(u.cause)), out = sides.filter((x) => x === 'out').length, inn = sides.filter((x) => x === 'in').length;
  const pseudo = a.pseudo || 0, away = Math.max(0, a.studied - (a.real ?? a.studied) - pseudo);
  return pseudo > 0 && pseudo >= away ? 'pseudo' : out + inn >= 2 ? (out >= inn ? 'outer' : 'inner') : 'unstable';
}

const firstHint = (a) => (/(حال|حوصله)\S* ?(آمد|داشتم|بود)|آماده (شدم|شوم|بودم)|وقت کردم/.test(a.ifWhen || '')
  ? 'نشانه باید رخدادی بیرونی باشد، نه حال درونی: یک ساعت مشخص، یا کاری که هر روز واقعاً می‌کنی.'
  : VAGUE_VERBS.test((a.ifThen || '').trim()) ? 'این هدف است، نه حرکت. یک فعل با مفعول مشخص، در حد دو دقیقه: «صورت سؤال ۳ را در دفتر می‌نویسم».'
  : /(مرتب|آماده می|برنامه\S* ?(می‌نویسم|می‌ریزم)|منبع بهتر|جست‌وجو)/.test(a.ifThen || '') ? 'این آماده‌سازی است. حرکت اول روی خودِ درس است: خواندن، نوشتن، حل‌کردن یا به‌یادآوردن.' : '');

// ورود به عمق، حفظ تمرکز، قالب زمانی
const jumpType = (c) => (c === 'thought' ? 'thought' : c === 'phone' || c === 'tab' ? 'check' : c === 'real' || c === 'look' ? c : c ? 'outer' : '');
const fmtOf = (m) => (m <= 20 ? 'short' : m <= 35 ? 'pomo' : 'deep');
const suggestFmt = (a) => (a.hardDay === 'yes' ? 'short' : !a.cut || !a.hardDay ? '' : a.cut === 'bits' ? 'pomo' : a.guarded === 'yes' ? 'deep' : 'flex');
const applyFmt = (a) => { a.minutes = { short: a.cut === 'cont' ? 10 : 15, pomo: 25, deep: 45, flex: 40 }[a.fmt]; };
const stretchy = (a) => a.fmt === 'short' && a.cut === 'cont';
const hhmm = (ts) => new Date(ts).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
const wtypes = () => [...new Set(db.sessions.map((s) => s.wtype).filter(Boolean))].slice(-12);
const openParked = () => db.parked.filter((p) => p.state !== 'done' && p.state !== 'drop');
const park = (text, when, subject) => db.parked.push({ id: uid(), text, when, subject, date: Date.now(), n: 0, state: '' });
const earlyCuts = (s) => s.urges.filter((u) => ['phone', 'tab', 'notif'].includes(u.cause) && u.at >= s.lockAt && u.at < s.lockAt + 15 * 6e4).length;
const midOk = (s) => s.mid === 'yes' || s.mid === 'rescue';
const traced = (s) => !!s.trace && s.trace !== 'none';
const rampOk = (s, base) => s.loadMin <= 8 && midOk(s) && traced(s) && (base > 0 ? earlyCuts(s) < base : earlyCuts(s) <= 1);
const rampList = () => (db.ramp ? db.sessions.filter((s) => s.ramp && s.date >= db.ramp.start) : []);
const keepList = () => (db.keep ? db.sessions.filter((s) => s.sheet && s.date >= db.keep.start) : []);
const fmtList = () => (db.fmtLab ? db.sessions.filter((s) => s.fmt && s.date >= db.fmtLab.start && (!has(db.fmtLab.type) || s.wtype === db.fmtLab.type.trim())) : []);
const exitsOf = (s) => s.urges.filter((u) => jumpType(u.cause) === 'check').length;
const longsOf = (s) => s.urges.filter((u) => u.long).length;
const per30 = (n, s) => (n * 30) / Math.max(1, s.studied);
const inBounds = (s) => s.studied <= s.minutes + 6;

// همان محرک سه بار در ده دقیقه، یا همان فکر سه بار در یک جلسه
function threeRule(a) {
  const now = Date.now(), n = {};
  a.urges.forEach((u) => { if (u.cause && u.cause !== 'real' && (u.cause === 'thought' || u.at >= now - 10 * 6e4)) n[u.cause] = (n[u.cause] || 0) + 1; });
  const c = Object.keys(n).find((k) => n[k] >= 3);
  return !c ? '' : c === 'thought' ? 'فکر مزاحم سه بار آمد. یک نوبت پنج‌دقیقه‌ای بعد از جلسه برایش رزرو کن و تا آن‌وقت دنبالش نرو.'
    : `«${CAUSES[c].label}» در ده دقیقه سه بار تو را کشید. بار چهارم را با اراده جواب نده؛ همین حالا حذفش کن. ${CAUSES[c].advice}`;
}

function toLock(a) {
  const now = Date.now();
  a.loadMin = a.loadAt ? Math.round((now - a.loadAt) / 6e4) : 0;
  a.rampState = 'lock'; a.lockAt = now; a.midAt = now + (a.minutes < 25 ? 8 : 10) * 6e4; a.rang = now >= a.endsAt;
  if (a.ping > 0) a.nextPingAt = now + a.ping * 6e4;
}

// بعد از ورود کوچک (یا بدون آن): بارگذاری زمان‌دار، یا مستقیم قفل
function toLoad(a) {
  if (a.ramp > 0) Object.assign(a, { rampState: 'load', loadAt: Date.now(), loadEndsAt: Date.now() + a.ramp * 6e4, rang: false });
  else if (a.ramp) toLock(a);
}

const entered = (x) => x.after !== 'miss';
const entryDays = (since) => new Set([...db.sessions, ...db.starts.filter(entered)].filter((x) => x.date >= since).map((x) => dayKey(x.date))).size;

function startDays(lab) {
  return Array.from({ length: 7 }, (_, i) => {
    const ts = addDays(lab.start, i), k = dayKey(ts);
    const ss = db.sessions.filter((s) => dayKey(s.date) === k), st = db.starts.filter((x) => dayKey(x.date) === k);
    const all = [...ss, ...st].sort((x, y) => x.date - y.date);
    const kinds = all.map((x) => x.firstKind).filter(Boolean), miss = st.find((x) => !entered(x));
    return {
      ts, n: all.length, sessions: ss.length, in: ss.length > 0 || st.some(entered),
      mood: all.find((x) => x.mood)?.mood || '', lag: all.find((x) => x.lag != null)?.lag ?? null,
      kind: kinds.includes('content') ? 'content' : kinds[0] || '',
      after: ss.length ? (ss.some((s) => s.entryAfter === 'more') ? 'more' : 'go') : st.some(entered) ? 'stop' : miss ? 'miss' : '',
      next: ss.some((s) => has(s.nextFirst)) || st.some((x) => x.next), block: miss?.block || '',
    };
  });
}

// «اگر جواب نداد چه؟» فصل ۴: [وضعیت، کار بعدی، دقیقهٔ جلسهٔ کوچک]
const MYTH_FIX = [
  ['قانون را نوشتم ولی شروع نمی‌کنم', 'کار هنوز بزرگ است. آن را به دو دقیقه برسان: فقط بازکردن کتاب، فقط خواندن عنوان.', 2],
  ['بلافاصله بعد از خواندن هم چیزی یادم نمی‌آید', 'مشکل از روش خواندن است، نه از باور. متن را به بخش‌های کوچک‌تر بشکن و بعد از هر بخش ببند و بنویس (فصل ۱۸ و ۱۹).'],
  ['همان لحظه یادم می‌آید، فردا نه', 'طبیعی است؛ مرور کم است. همان مبحث را فردا چند دقیقه از حافظه بنویس (فصل ۲۰).'],
  ['بدون ساعت‌شماری کارم کم شد یا مضطرب شدم', 'ساعت را دور نریز؛ فقط زیر خروجی بنویسش، نه بالای آن.'],
  ['در بلوک کوتاه هم تمرکز ندارم', 'با ده دقیقه شروع کن. اگر مزاحم بیرونی است (گوشی، صدا) فصل ۷ و ۸؛ اگر فکر مزاحم است فصل ۱۴.', 10],
  ['می‌دانم فاصله‌گذاری بهتر است ولی باز عقب می‌اندازم', 'این دیگر باور نیست؛ الگوی اهمال‌کاری است (فصل ۲۵).'],
  ['باور عوض شد ولی احساس گناه مانده', 'طبیعی است؛ احساس کندتر از باور به‌روز می‌شود. اگر سرزنش مداوم و آزاردهنده است، فصل ۳۰.'],
  ['امتحان چند روز دیگر است', 'این فصل روش عادی است، نه اضطراری. پروتکل اضطراری در فصل ۳۸ است.'],
  ['چند روز است تقریباً نمی‌خوابم یا حتی کار کوچک ناممکن است', 'به زور ادامه نده و این را «باور غلط» حساب نکن. کمک‌گرفتن از یک متخصص مناسب است.'],
];
const mythToday = () => db.myths.find((m) => dayKey(m.date) === today());
const mythDays = () => new Set(db.myths.map((m) => dayKey(m.date))).size;

// مبحث‌هایی که در دو روز جدا یا بیشتر دیده شده‌اند
function spreadSubjects(since) {
  const m = {};
  const add = (subject, ts) => { if (ts >= since) (m[subject] ||= new Set()).add(dayKey(ts)); };
  db.sessions.forEach((s) => { add(s.subject, s.date); if (s.retrieved) add(s.subject, s.retrieved.date); });
  return Object.values(m).filter((set) => set.size >= 2).length;
}

function weekSigns() {
  const now = Date.now(), since = now - 7 * DAY, prev = now - 14 * DAY;
  const week = db.sessions.filter((s) => s.date >= since);
  const between = (list, from, to) => list.filter((x) => x.date >= from && x.date < to).length;
  const studyDays = new Set(week.map((s) => dayKey(s.date)));
  const outputDays = new Set([...week.filter((s) => has(s.can)), ...db.myths.filter((m) => m.date >= since && (has(m.can) || has(m.output)))].map((x) => dayKey(x.date)));
  return {
    week,
    startDays: new Set([...studyDays, ...db.logs.filter((l) => l.date >= since).map((l) => dayKey(l.date))]).size,
    closed: week.filter((s) => s.chunks.length).length,
    studyDays: studyDays.size, outputDays: outputDays.size,
    done: week.length, donePrev: between(db.sessions, prev, since),
    dropped: between(db.abandoned, since, now + 1), droppedPrev: between(db.abandoned, prev, since),
    spread: spreadSubjects(since),
  };
}

/* ---------- تم ---------- */

// انتخاب ظاهر مال همین دستگاه است؛ جدا از داده‌ها می‌ماند. [نام، رنگ نوار مرورگر، سه رنگ نمونه]
const THEME_KEY = 'ketab-baste-theme';
const THEMES = {
  blue: ['آبی و سرخ', '#16233f', ['#16233f', '#c2334d', '#f9fafb']],
  green: ['سبز و طلایی', '#14432f', ['#14432f', '#c9a227', '#ffffff']],
};
const MODE_KEY = 'ketab-baste-mode';
const MODES = { auto: 'مثل گوشی', light: 'روشن', dark: 'تیره' };
const sysDark = matchMedia('(prefers-color-scheme: dark)');
let theme = 'blue', mode = 'auto';
try { theme = localStorage.getItem(THEME_KEY) || 'blue'; mode = localStorage.getItem(MODE_KEY) || 'auto'; } catch (e) { /* پیش‌فرض */ }
if (!THEMES[theme]) theme = 'blue';
if (!MODES[mode]) mode = 'auto';
function applyTheme() {
  const root = document.documentElement.dataset;
  if (theme === 'blue') delete root.theme; else root.theme = theme;
  root.mode = mode === 'auto' ? (sysDark.matches ? 'dark' : 'light') : mode;
  document.querySelector('meta[name="theme-color"]').content = THEMES[theme][1];
}
applyTheme();
sysDark.addEventListener('change', applyTheme);

/* ---------- هوشواره ---------- */

// کلید و تنظیمات جدا از داده‌ها می‌ماند تا وارد فایل پشتیبان نشود
const AI_KEY = 'ketab-baste-ai';
// قیمت هر یک میلیون توکن به دلار: [ورودی، خروجی]
const AI_MODELS = {
  'claude-haiku-5-5': ['Haiku، کم‌مصرف', 0.1, 0.5],
  'claude-sonnet-5-5': ['Sonnet، دقیق‌تر', 2, 10],
  'claude-opus-5-5': ['Opus، گران', 4, 20],
};
let aiCfg = { key: '', model: 'claude-haiku-5-5', cap: 30 };
try { Object.assign(aiCfg, JSON.parse(localStorage.getItem(AI_KEY) || '{}')); } catch (e) { /* تنظیمات خراب: پیش‌فرض */ }
if (!AI_MODELS[aiCfg.model]) aiCfg.model = 'claude-haiku-5-5';
const saveAi = () => { try { localStorage.setItem(AI_KEY, JSON.stringify(aiCfg)); } catch (e) { /* بدون ذخیره */ } };
let aiBusy = '';

const AI_SYSTEM = 'You are the coach inside a Persian study app built on closed-book retrieval practice. '
  + 'Write every value in Persian, informal «تو», concrete, at most 25 words each. No praise, no blame, no generic study advice. '
  + 'Use only the data given; when it is too thin to judge, say so in the relevant field.';
const str = { type: 'string' };
const labelsOf = (map) => Object.entries(map).map(([k, v]) => `${k}=${v.label || v[0]}`).join('; ');
const topOf = (pairs, map) => pairs.slice(0, 3).map(([k, n]) => `${map?.[k]?.label || k}×${n}`).join('، ');

// هر کار: دستور کوتاه، کمترین دادهٔ لازم، شکل پاسخ، نمایش، و (اختیاری) گذاشتن پاسخ در فرم
const AI_TASKS = {
  goal: {
    ask: 'Rewrite the session goal as one observable output the learner can produce without looking at the source, small enough for this one session (verbs like solve, explain, write, compare; never read, review, understand). criterion: how they check it closed-book, with a count or threshold. first: the first two-minute move on the material itself. Keep their topic and any wording that is already good.',
    input: (a) => (!has(a.subject) && !has(a.goal) ? 'اول موضوع یا خروجی را هرطور که به ذهنت می‌رسد بنویس.'
      : { subject: a.subject, goal: a.goal, criterion: a.criterion, minutes: a.minutes, kind: a.mode }),
    props: { goal: str, criterion: str, first: str },
    show: (r) => `<p>${esc(r.goal)}</p><p class="fine">معیار: ${esc(r.criterion)}<br>حرکت اول: ${esc(r.first)}</p>`,
    useLabel: 'همین را بگذار',
    use: (a, r) => { a.goal = r.goal; a.criterion = r.criterion; if (!has(a.ifThen)) a.ifThen = r.first; },
  },
  check: {
    ask: () => `Judge the closed-book recall against the goal and criterion. You cannot see the source: judge coverage and specificity, not factual correctness. outcome is "full" only when the criterion is visibly met. gap: the single best fit of ${labelsOf(GAPS)}. where: one sentence naming exactly what is missing. next: one concrete output for the next session.`,
    input: (a) => (!has(a.recall) ? 'چیزی از حافظه ننوشته‌ای که بشود سنجید.' : { goal: a.goal, criterion: a.criterion, recall: a.recall }),
    props: { outcome: { type: 'string', enum: ['full', 'partial', 'none'] }, gap: { type: 'string', enum: Object.keys(GAPS) }, where: str, next: str },
    show: (r) => `<p>${OUTCOME[r.outcome]}؛ ${GAPS[r.gap].label}</p><p>${esc(r.where)}</p><p class="fine">جلسهٔ بعد: ${esc(r.next)}<br>منبع را ندیده؛ فقط نوشتهٔ تو را با هدف و معیار سنجیده. داور آخر خودتی.</p>`,
    useLabel: 'همین را انتخاب کن',
    use: (a, r) => { a.outcome = r.outcome; a.gap = r.gap; a.gapNote = r.where; },
  },
  step: {
    ask: 'The learner is stuck or has drifted from the task. Give the smallest entry step on that same task, doable in a few minutes (step), and a visible output for it (output). Not rest, not planning, not a different task.',
    input: (a) => (a.kind === 'session'
      ? (has(a.midQ) ? { task: a.goal, stuckOn: a.midQ } : 'اول بنویس روی چه چیزی گیر کرده‌ای.')
      : has(a.task) ? { task: a.task, obstacle: OBSTACLES[a.obstacle].label, feeling: a.feeling, minutes: a.minutes } : 'بنویس قرار بود چه کاری انجام بدهی.'),
    props: { step: str, output: str },
    show: (r) => `<p>${esc(r.step)}</p><p class="fine">خروجی: ${esc(r.output)}</p>`,
    useLabel: 'همین گام',
    use: (a, r) => { if (a.kind === 'session') a.midStep = r.step; else { a.stepText = r.step; a.output = r.output; } },
  },
  retr: {
    ask: 'Compare what the learner recalled on the study day (then) with today\'s closed-book recall (now). rate: kept, some or lost. lost: one sentence naming what dropped out. ask: two short questions, separated by a line break, to answer from memory before reopening the source, aimed at what dropped.',
    input: (a) => {
      const s = db.sessions.find((x) => x.id === a.sessionId);
      return !has(a.text) ? 'امروز چیزی ننوشته‌ای که بشود مقایسه کرد.' : { goal: s.goal, then: s.recall, now: a.text };
    },
    props: { rate: { type: 'string', enum: ['kept', 'some', 'lost'] }, lost: str, ask: str },
    show: (r) => `<p>${esc(r.lost)}</p><p class="fine">قبل از بازکردن منبع، از حافظه:</p><p class="pre">${esc(r.ask)}</p>`,
    useLabel: 'همین ارزیابی',
    use: (a, r) => { a.rate = r.rate; },
  },
  tplan: {
    ask: 'For the learner\'s single heavy task of the day give: small, the minimum version that still saves a bad day (about a third of it); first, the very first concrete action, under two minutes.',
    input: (a) => (has(a.task) ? { task: a.task, minutes: estOf(a) || undefined } : 'اول کار سنگین را بنویس.'),
    props: { small: str, first: str },
    show: (r) => `<p>نسخهٔ کوچک: ${esc(r.small)}</p><p>نقطهٔ شروع: ${esc(r.first)}</p>`,
    useLabel: 'همین‌ها را بگذار',
    use: (a, r) => { a.small = r.small; a.first = r.first; },
  },
  week: {
    ask: 'From last week\'s daily-card stats propose exactly one adjustment for this week (fix): specific, small, drawn from the data and not from guilt. why: the number it rests on.',
    input: (a) => {
      const st = loopStats(loopDays(addDays(Date.now(), -6), 7)), prev = db.weeks[db.weeks.length - 1];
      return !st.cards ? 'هنوز کارت روزانه‌ای در این هفته نیست که بشود از آن اصلاح درآورد.' : {
        dailyCards: st.cards, full: st.full, partial: st.part, notDone: st.none, cardsWithoutNightLog: st.cards - st.logged,
        actualOverEstimate: st.ratio ? +st.ratio.toFixed(2) : undefined, topBlocker: st.block, sessions: weekSigns().done,
        mainCause: a.cause, lastFix: prev?.fix, lastFixWorked: a.fixWorked,
      };
    },
    props: { fix: str, why: str },
    show: (r) => `<p>${esc(r.fix)}</p><p class="fine">${esc(r.why)}</p>`,
    useLabel: 'همین اصلاح',
    use: (a, r) => { a.fix = r.fix; },
  },
  trend: {
    global: true,
    ask: 'From one week of the learner\'s numbers give up to three observations (seen, one per line), each tying two numbers together, then exactly one small, concrete change to try this week (change). Minutes are input, not a score; reaching the criterion and next-day retrieval matter most.',
    input: () => {
      const w = weekSigns(), week = w.week, lag = avg(week.filter((s) => s.lag != null), (s) => s.lag);
      const obs = db.obstacles.filter((o) => o.date >= Date.now() - 14 * DAY);
      return week.length < 3 ? 'برای تحلیل، دست‌کم سه جلسه در هفت روز اخیر لازم است.' : {
        sessions: week.length, sessionsPrevWeek: w.donePrev, abandoned: w.dropped, studyDays: w.studyDays,
        reached: week.filter((s) => s.outcome === 'full').length, partly: week.filter((s) => s.outcome === 'partial').length,
        criterionActuallyRun: week.filter((s) => s.ran === 'yes').length, feelingMatchedTest: week.filter(feelMatches).length,
        nextDayRetrievals: week.filter((s) => s.retrieved).length, closeAndWriteSessions: w.closed,
        minutesPresent: sum(week, (s) => s.studied), minutesReal: sum(week, realOf), minutesPseudoFocus: sum(week, (s) => s.pseudo),
        avgLongestFocus: Math.round(avg(week, (s) => s.longest)), avgMinutesToFirstLine: lag == null ? undefined : +lag.toFixed(1),
        gaps: topOf(tally(week, (s) => (s.gap === 'none' ? null : s.gap)), GAPS), breakCauses: topOf(tally(causesOf(week, []), (c) => c), CAUSES),
        obstacles14d: topOf(tally(obs, (o) => o.obstacle), OBSTACLES), formats: topOf(tally(week, (s) => s.fmt), FMT),
        lowMoodStarts: week.filter((s) => s.mood === 'low').length,
      };
    },
    props: { seen: str, change: str },
    show: (r) => `<p class="pre">${esc(r.seen)}</p><div class="next"><span>فقط یک تغییر برای این هفته</span><p>${esc(r.change)}</p></div>`,
  },
};

const hashOf = (t) => { let h = 5381; for (let i = 0; i < t.length; i++) h = (h * 33 ^ t.charCodeAt(i)) >>> 0; return h.toString(36); };

// یک درخواست کوتاه و بدون تکرار؛ ورودیِ تکراری از حافظهٔ خود اپ جواب می‌گیرد
async function askAi(task, input) {
  const T = AI_TASKS[task], ai = db.ai, body = JSON.stringify(input);
  const id = hashOf(task + aiCfg.model + body), hit = ai.cache.find((c) => c[0] === id);
  if (hit) return { r: hit[1], cached: true };
  if (!navigator.onLine) throw new Error('آفلاینی. بقیهٔ اپ بدون هوشواره هم کار می‌کند.');
  if (ai.day !== today()) { ai.day = today(); ai.dayCalls = 0; }
  if (ai.dayCalls >= aiCfg.cap) throw new Error(`سقف امروز پر شد: ${fa(aiCfg.cap)} درخواست. از تنظیمات عوضش کن.`);
  const haiku = aiCfg.model.includes('haiku');
  let res;
  try {
    res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json', 'x-api-key': aiCfg.key, 'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: aiCfg.model,
        // مدل‌های بزرگ‌تر فکرکردن را خاموش نمی‌کنند و برایش جا لازم دارند
        max_tokens: haiku ? 600 : 2500,
        ...(haiku ? { thinking: { type: 'disabled' } } : {}),
        system: AI_SYSTEM + '\n' + (typeof T.ask === 'function' ? T.ask() : T.ask),
        messages: [{ role: 'user', content: body }],
        output_config: {
          effort: 'low',
          format: { type: 'json_schema', schema: { type: 'object', properties: T.props, required: Object.keys(T.props), additionalProperties: false } },
        },
      }),
    });
  } catch (e) { throw new Error('به هوشواره وصل نشد. اینترنت را نگاه کن.'); }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(res.status === 401 ? 'کلید API پذیرفته نشد. در تنظیمات درستش کن.'
      : res.status === 429 ? 'سقف مصرف یا سرعتِ حساب پر شده. کمی بعد دوباره بزن.'
      : res.status >= 500 ? 'سرور هوشواره شلوغ است. کمی بعد دوباره بزن.'
      : 'هوشواره درخواست را نپذیرفت: ' + (data.error?.message || res.status));
  }
  const u = data.usage || {}, [, pin, pout] = AI_MODELS[aiCfg.model];
  ai.calls++; ai.dayCalls++; ai.tin += u.input_tokens || 0; ai.tout += u.output_tokens || 0;
  ai.cost += ((u.input_tokens || 0) * pin + (u.output_tokens || 0) * pout) / 1e6;
  save();
  if (data.stop_reason === 'refusal') throw new Error('هوشواره به این متن جواب نداد. متن را عوض کن یا خودت ادامه بده.');
  if (data.stop_reason === 'max_tokens') throw new Error('پاسخ هوشواره نیمه‌کاره ماند. دوباره بزن.');
  let r;
  try { r = JSON.parse(data.content.find((b) => b.type === 'text').text); } catch (e) { throw new Error('پاسخ هوشواره خوانا نبود. دوباره بزن.'); }
  ai.cache = [...ai.cache, [id, r]].slice(-30);
  save();
  return { r, cached: false };
}

const aiResult = (task) => (AI_TASKS[task].global ? db.ai[task] : A()?.ai?.[task]);
// دکمه و پاسخ هوشواره؛ بدون کلید هیچ‌چیز نشان داده نمی‌شود و هیچ درخواستی خودکار نیست
function aiPart(task, label) {
  if (!aiCfg.key) return '';
  const T = AI_TASKS[task], r = aiResult(task);
  return `${r ? `<div class="ai-box"><span>هوشواره</span>${T.show(r)}${T.use ? `<button class="btn" data-act="ai-use" data-task="${task}">${T.useLabel}</button>` : ''}</div>` : ''}
    <button class="btn big ai" data-act="ai" data-task="${task}"${aiBusy ? ' disabled' : ''}>${aiBusy === task ? 'هوشواره دارد می‌نویسد…' : label}</button>`;
}

/* ---------- تکه‌های مشترک رابط ---------- */

const A = () => db.active;
// بخش‌های تاشو: هرچه برای قدم بعدی لازم نیست بسته می‌ماند
const folds = {};
const fold = (key, title, inner, openByDefault = false, sub = '') => `
  <details class="fold" data-fold="${key}"${folds[key] ?? openByDefault ? ' open' : ''}>
    <summary><span>${title}${sub ? `<small>${sub}</small>` : ''}</span></summary>
    ${inner}
  </details>`;
const dueStack = (list) => list.slice(0, 2).join('') + (list.length > 2 ? fold('dues', `${fa(list.length - 2)} کار دیگر برای امروز`, list.slice(2).join('')) : '');
const choice = (name, value, label, current, sub = '') => `
  <label class="choice${current === value ? ' on' : ''}">
    <input type="radio" name="${name}" value="${value}" data-bind="${name}"${current === value ? ' checked' : ''}>
    <span><b>${label}</b>${sub ? `<small>${sub}</small>` : ''}</span>
  </label>`;
const seg = (field, options, current, aria, attr = 'data-bind') => `
  <div class="seg" role="radiogroup" aria-label="${aria}">
    ${options.map(([v, l]) => `<label class="${current === v ? 'on' : ''}"><input type="radio" name="${field}" value="${v}" ${attr}="${field}"${typeof v === 'number' ? ' data-num' : ''}${current === v ? ' checked' : ''}>${l}</label>`).join('')}
  </div>`;
const minutesPicker = (field, options, current) => seg(field, options.map((m) => [m, fa(m) + ' دقیقه']), current, 'مدت');
const fivePicker = (field, current, aria) => seg(field, [1, 2, 3, 4, 5].map((n) => [n, fa(n)]), current, aria);
const textField = (label, bind, value, placeholder = '', small = '', attr = 'data-bind') => `
  <label class="field"><span>${label}</span>
    <input type="text" ${attr}="${bind}" value="${esc(value || '')}" placeholder="${placeholder}">${small ? `<small>${small}</small>` : ''}</label>`;
const numField = (label, bind, value, small = '', attr = 'data-bind') => `
  <label class="field"><span>${label}</span>
    <input type="number" inputmode="numeric" min="0" ${attr}="${bind}" data-num value="${value ?? ''}">${small ? `<small>${small}</small>` : ''}</label>`;
const dbText = (label, path, value, placeholder = '', small = '') => textField(label, path, value, placeholder, small, 'data-db');
const dbNum = (label, path, value, small = '') => numField(label, path, value, small, 'data-db');
const dbCheck = (path, on, text) => `<label class="check"><input type="checkbox" data-db="${path}"${on ? ' checked' : ''}><span>${text}</span></label>`;
const pick = (attr, path, options, current, aria, empty) => `
  <select ${attr}="${path}" aria-label="${aria}">
    ${empty ? `<option value="">${empty}</option>` : ''}
    ${options.map(([v, l]) => `<option value="${v}"${current === v ? ' selected' : ''}>${l}</option>`).join('')}
  </select>`;
const facts = (rows) => `<ul class="facts">${rows.map(([k, v]) => `<li class="${v ? 'ok' : ''}"><span>${k}</span><b>${v || 'ثبت نشده'}</b></li>`).join('')}</ul>`;
const goalList = (rows) => `<ul class="goals">${rows.map(([t, n, need]) => `<li class="${n >= need ? 'ok' : ''}"><span>${t}</span><b>${fa(Math.min(n, need))} از ${fa(need)}</b></li>`).join('')}</ul>`;
const bars = (rows, names) => {
  const max = rows[0][1];
  return `<ul class="bars">${rows.map(([k, n]) => `<li><span>${names[k].label}</span><i style="--w:${(n / max) * 100}%"></i><b>${fa(n)}</b></li>`).join('')}</ul>`;
};
const urgeLog = (urges) => (urges.length ? `
  <ul class="urges">${urges.map((u) => `<li><span>دقیقهٔ ${fa(u.min)}</span>${esc([CAUSES[u.cause]?.label, u.before, u.long && 'بیش از پنج دقیقه'].filter(Boolean).join('، ') || 'بدون توضیح')}</li>`).join('')}</ul>` : '');
const URGE_PH = {
  '': 'مثلاً: به واژهٔ ناآشنا رسیدم', thought: 'یک خط: جواب پیام خانه', check: 'چه چیزی را می‌خواستی ببینی؟ مثلاً: گروه',
  outer: 'درست قبلش چه شد؟', real: 'کجا بودم: سؤال ۶، نیروها رسم شد', look: 'سؤال دقیق: معنی «آنتالپی»',
};
const URGE_TIP = {
  thought: 'تحلیلش نکن و با خودت بحث نکن. اگر مهم است، زمانش را نوشته‌ای.',
  check: 'گوشی را برندار، حتی برای ساعت. یک خط از کار را انجام بده؛ میل خودش فروکش می‌کند.',
  outer: 'دنبالش نرو. اگر چندثانیه‌ای حذف می‌شود حذفش کن. به آدم‌ها: «وسط این سؤالم؛ ده دقیقه دیگر می‌آیم. فوری است؟»',
  real: 'شمارهٔ صفحه کافی نیست؛ منطق ادامه را بنویس. اضطراری است؟ برو و بعداً بنویس.',
  look: 'فقط همین، حدود دو دقیقه، جواب در یک خط. نشد، بنویس «نیاز به منبع» و سراغ بخش دیگری از کار برو.',
};
const parkSheet = (items) => `
  <ul class="parked">${items.map((p) => `
    <li><b>${esc(p.text)}</b>${p.n ? `<small>${fa(p.n)} بار دیگر هم آمد</small>` : ''}
      <input type="text" data-db="parked.${db.parked.indexOf(p)}.when" value="${esc(p.when)}" placeholder="کِی؟" aria-label="زمان رسیدگی">
      <div class="row eq"><button class="btn" data-act="park-set" data-id="${p.id}" data-v="done">انجام شد</button>${p.state ? '' : `<button class="btn" data-act="park-set" data-id="${p.id}" data-v="timed">همین زمان</button>`}<button class="btn" data-act="park-set" data-id="${p.id}" data-v="drop">حذف</button></div>
    </li>`).join('')}</ul>`;
// برگهٔ پارک: نام‌گذاری پرش، پاسخ کوتاهِ همان شاخه، و برگشت با یک عمل
const urgeBox = (a) => {
  // فصل ۲: فقط یک علامت و چند کلمه دربارهٔ لحظهٔ قبل از فرار؛ نسخهٔ کامل مال فصل‌های بعد است
  if (!chOn(0, a.ch || db.chapters)) {
    return `
  <div class="urge">
    <label for="urge">دلت خواست کار را رها کنی؟ با آن نجنگ. فقط بنویس درست قبلش چه شد و برگرد.</label>
    <div class="row">
      <input id="urge" type="text" data-bind="urgeDraft" value="${esc(a.urgeDraft || '')}" placeholder="${URGE_PH['']}" enterkeyhint="done">
      <button class="btn quiet" data-act="urge">ثبت</button>
    </div>
    ${urgeLog(a.urges)}
  </div>`;
  }
  const c = a.urgeCause || '', t = jumpType(c), one = db.keep?.oneWord, three = threeRule(a);
  const mine = openParked().filter((p) => p.date >= a.startedAt);
  if (a.away) {
    return `
  <div class="urge">
    <label>یادداشت بازگشت</label>
    <p class="goal-line">${esc(a.away.where) || 'جای توقف را ننوشتی.'}${has(a.away.next) ? `<br>قدم بعدی: ${esc(a.away.next)}` : ''}</p>
    <button class="btn primary big" data-act="back">برگشتم؛ همین قدم</button>
    <p class="fine">گوشی را «تا جا بیفتم» باز نکن و از اول صفحه نخوان. یکی دو دقیقه فقط قدم‌های نوشته‌شده.</p>
  </div>`;
  }
  return `
  <div class="urge">
    <label for="urge">جدا شدی؟ در یک کلمه نامش را بگو، همان‌جا قطعش کن و با یک عمل برگرد. با آن نجنگ.</label>
    <div class="row">
      <select data-bind="urgeCause" aria-label="علت وقفه">
        <option value="">علت</option>
        ${Object.entries(CAUSES).map(([k, x]) => `<option value="${k}"${c === k ? ' selected' : ''}>${x.label}</option>`).join('')}
      </select>
      <input id="urge" type="text" data-bind="urgeDraft" value="${esc(a.urgeDraft || '')}" placeholder="${one && t === 'thought' ? 'فقط یک کلمه: خانه' : URGE_PH[t]}" enterkeyhint="done">
      <button class="btn quiet" data-act="urge">${t === 'real' ? 'می‌روم' : 'ثبت'}</button>
    </div>
    ${t === 'thought' && !one ? `<input type="text" data-bind="urgeWhen" value="${esc(a.urgeWhen || '')}" placeholder="کِی به آن می‌رسم؟ پیش‌فرض: بعد از این جلسه" aria-label="زمان رسیدگی">` : ''}
    ${t === 'real' ? `<input type="text" data-bind="urgeNext" value="${esc(a.urgeNext || '')}" placeholder="قدم بعدی: معادلهٔ محور افقی" aria-label="قدم بعدی">` : ''}
    ${t && t !== 'real' ? `<label class="check"><input type="checkbox" data-bind="urgeLong" ${a.urgeLong ? 'checked' : ''}><span>بیش از پنج دقیقه رفته بودم.</span></label>` : ''}
    ${URGE_TIP[t] ? `<p class="fine">${URGE_TIP[t]}</p>` : ''}
    ${three ? `<p class="advice">${three}</p>` : ''}
    ${mine.length ? `<ul class="urges">${mine.map((p) => `<li><span>بعداً</span>${esc(p.text)}، ${esc(p.when)}<button class="back" data-act="park-again" data-id="${p.id}">دوباره آمد</button></li>`).join('')}</ul>` : ''}
    ${urgeLog(a.urges)}
  </div>`;
};
const snagBox = (path, map, cur) => `
  <section>
    <h2>چیزی درست کار نمی‌کند؟</h2>
    ${pick('data-db', path, Object.entries(map).map(([k, v]) => [k, v[0]]), cur, 'گیر کار', 'نه، همین است')}
    ${map[cur] ? `<p class="advice">${map[cur][1]}</p>${map[cur][2] ? `<button class="btn big" data-act="lab-view" data-view="${map[cur][2]}">باز کن</button>` : ''}` : ''}
  </section>`;
const ruleLine = (m) => `اگر ${esc(m.ifText)}، آنگاه ${esc(m.thenText)}`;

/* ---------- صفحه‌ها ---------- */

function viewToday() {
  const due = dueRetrievals();
  const todays = db.sessions.filter((s) => dayKey(s.date) === today());
  const exp = db.experiment;
  const expDue = exp && !exp.later && Date.now() - exp.day1 >= 20 * 36e5;
  const b = db.baseline, m = mythToday(), d = db.days[today()];
  const mythWeek = !m && !db.mythWrap && db.myths.some((x) => Date.now() - x.date < 7 * DAY);
  const env = db.env, dig = db.digital, tp = planFor(today()), rv = reviewDue();
  const envLeft = env && Date.now() - env.start < 7 * DAY ? auditLeft(env) : 0;
  const planNight = db.tplans.length && new Date().getHours() >= 18 && !planFor(tomorrowKey());
  const sl = db.startLab, slDay = sl ? baseDayNo(sl) : 0, at = db.attn, atN = at ? db.sessions.filter((s) => s.ping && s.date >= at.start).length : 0;
  // هر کارت: [فصل، محتوا]
  const allDues = [
    [3, due.length ? `
    <section class="due">
      <h2>اول، بازیابی دیروز</h2>
      <p>قبل از مطالعهٔ تازه، ده دقیقه مطالب قبلی را از حافظه روی صفحه بیاور.</p>
      ${due.map((s) => `
        <div class="due-item">
          <div><b>${esc(s.subject)}</b><span>${esc(s.goal)}</span></div>
          <button class="btn" data-act="retrieve" data-id="${s.id}">بازیابی کن</button>
        </div>`).join('')}
    </section>` : ''],
    [3, expDue ? `
    <section class="due">
      <h2>نوبت دوم آزمایش رسیده</h2>
      <p>بدون هیچ مروری، همان پنج سؤال هر دو متن را دوباره جواب بده.</p>
      <button class="btn" data-act="tab" data-tab="lab" data-view="reread">ثبت نمره‌های امروز</button>
    </section>` : ''],
    [5, b && baseRunning(b) ? `
    <section class="due">
      <h2>ثبت واقعی، روز ${fa(baseDayNo(b))} از ${fa(b.days)}</h2>
      <p>این روزها فقط اندازه بگیر. قرار نیست بهتر از همیشه باشی.</p>
      ${d?.quality ? '' : '<button class="btn" data-act="new-day">ثبت خواب دیشب</button>'}
    </section>` : b && !b.seen ? `
    <section class="due">
      <h2>پروفایل نقطهٔ شروع آماده است</h2>
      <p>عددهای واقعی این چند روز کنار هم چیده شده.</p>
      <button class="btn" data-act="tab" data-tab="lab" data-view="baseline">دیدن پروفایل</button>
    </section>` : ''],
    [4, m ? `
    <section class="due">
      <h2>قانون امروز</h2>
      <p class="goal-line">${ruleLine(m)}</p>
      ${m.done ? `<p>${m.done === 'yes' ? 'اجرا شد.' : 'اجرا نشد؛ این هم داده است.'} ${esc(m.happened)}</p>` : `
        <p>${MYTHS[m.myth].test}</p>
        ${todays.length ? '<button class="btn" data-act="myth-close">ثبت نتیجهٔ قانون</button>' : '<button class="btn" data-act="myth-session">شروع جلسهٔ آزمایشی</button>'}`}
    </section>` : mythWeek ? `
    <section class="due">
      <h2>قانون امروز را انتخاب نکرده‌ای</h2>
      <p>روز ${fa(mythDays() + 1)} از ۷. فقط یک افسانه، فقط برای امروز.</p>
      <button class="btn" data-act="new-myth">انتخاب قانون امروز</button>
    </section>` : ''],
    [0, tp && !tp.done ? `
    <section class="due">
      <h2>کار اول امروز</h2>
      <p class="goal-line">${esc(tp.task)}</p>
      <p>${span(tp.from, tp.to)}، ${fa(tp.minutes)} دقیقه. در این پنجره فقط همین کار.</p>
      ${has(tp.first) ? `<p class="count">${has(tp.cue) ? `اگر ${esc(tp.cue)}، آنگاه ` : 'نقطهٔ شروع: '}${esc(tp.first)}</p>` : ''}
      <button class="btn" data-act="tplan-go" data-id="${tp.id}">شروع کار اول</button>
      <p class="count">اگر پنجره از دست رفت، ${span(tp.altFrom, tp.altTo)}: ${esc(tp.small)}</p>
      <div class="row acts"><button class="btn quiet" data-act="tplan-small" data-id="${tp.id}">شروع نسخهٔ کوچک</button><button class="btn quiet" data-act="tplan-miss" data-id="${tp.id}">امروز نشد</button></div>
    </section>` : rv ? `
    <section class="due">
      <h2>بررسی پنج‌دقیقه‌ای ${dayWord(rv)}</h2>
      <p>کار اول کجا انجام شد و برآوردت چقدر به واقعیت نزدیک بود؟ بدون سرزنش.</p>
      <button class="btn" data-act="tab" data-tab="lab" data-view="time">بررسی و طراحی فردا</button>
    </section>` : planNight ? `
    <section class="due">
      <h2>فردا را امشب بچین</h2>
      <p>فقط سه تصمیم: کار اول، بهترین پنجره، نسخهٔ کوچک.</p>
      <button class="btn" data-act="new-tplan">طراحی فردا</button>
    </section>` : ''],
    [0, db.loop && !weekNow() ? `
    <section class="due">
      <h2>جلسهٔ هفتگی، بیست دقیقه</h2>
      <p>اول بررسی هفتهٔ قبل، بعد سه خروجی و دقیقاً یک اصلاح.</p>
      <button class="btn" data-act="new-week">شروع جلسهٔ هفتگی</button>
    </section>` : ''],
    [0, sl && slDay <= 7 && !didStart(today()) ? `
    <section class="due">
      <h2>ورود کوچک، روز ${fa(slDay)} از ۷</h2>
      <p>امروز هنوز ورودی ثبت نشده. حالِ خوب شرط نیست؛ فقط حرکت اول.</p>
      <div class="row acts"><button class="btn" data-act="new-session">ورود پنج‌دقیقه‌ای</button><button class="btn quiet" data-act="new-quick">۶۰ ثانیه</button></div>
    </section>` : sl && slDay > 7 && !sl.seen ? `
    <section class="due">
      <h2>هفت روزِ ورود کوچک تمام شد</h2>
      <p>عددها را کنار خط پایه ببین و نسخهٔ شخصی شروعت را بنویس.</p>
      <button class="btn" data-act="tab" data-tab="lab" data-view="start">تحلیل روز هفتم</button>
    </section>` : ''],
    [0, at && atN < 3 ? `
    <section class="due">
      <h2>نقشهٔ توجه، جلسهٔ ${fa(atN + 1)} از ۳</h2>
      <p>همان درس این روزها، با زنگ هر پنج دقیقه. فقط ببین و نام بگذار.</p>
      <button class="btn" data-act="attn-session">شروع جلسه با نقشه</button>
    </section>` : ''],
    [0, db.ramp && rampList().length < 4 ? `
    <section class="due">
      <h2>رمپ ورود، بلوک ${fa(rampList().length + 1)} از ۴</h2>
      <p>پارک، واحد کار، بارگذاریِ زمان‌دار، قفل. ورود را با خروجی بسنج، نه با حس.</p>
      <button class="btn" data-act="ramp-session">شروع بلوک با رمپ</button>
    </section>` : ''],
    [0, db.keep && keepList().length < 3 ? `
    <section class="due">
      <h2>لنگر، پارک، بازگشت؛ جلسهٔ ${fa(keepList().length + 1)} از ۳</h2>
      <p>حواس‌پرتی می‌آید. فقط زود ببین و با یک عمل برگرد.</p>
      <button class="btn" data-act="keep-session">شروع جلسه با برگهٔ پارک</button>
    </section>` : ''],
    [0, db.fmtLab && fmtList().length < 3 ? `
    <section class="due">
      <h2>قالب جلسه، ${fa(fmtList().length + 1)} از ۳</h2>
      <p>${has(db.fmtLab.type) ? `نوع کار: ${esc(db.fmtLab.type)}. ` : ''}همان قالب، بدون تغییر وسط جلسه؛ بعدش یک خط ثبت.</p>
      <button class="btn" data-act="fmt-session">شروع جلسهٔ این نوع کار</button>
    </section>` : ''],
    [0, dig && !dig.wrap ? `
    <section class="due">
      <h2>${baseDayNo(dig) <= 7 ? `محیط دیجیتال، روز ${fa(baseDayNo(dig))} از ۷` : 'جمع‌بندی هفتهٔ دیجیتال'}</h2>
      <p>${baseDayNo(dig) > 7 ? 'هفت روز گذشت. عددها را کنار خط پایه ببین.'
        : has(dig.rule?.place) ? `گوشی: ${esc(dig.rule.place)}${has(dig.rule.next) ? `. چک بعدی: ${esc(dig.rule.next)}` : ''}` : 'این هفته چیزی به سیستم اضافه نکن؛ فقط اجرا و ثبت.'}</p>
      <button class="btn" data-act="tab" data-tab="lab" data-view="digital">${baseDayNo(dig) > 7 ? 'جمع‌بندی' : 'کاربرگ هفت روز'}</button>
    </section>` : ''],
    [0, envLeft ? `
    <section class="due">
      <h2>بازطراحی محیط، ${fa(envLeft)} عامل مانده</h2>
      <p>با همین وسایلی که داری. اگر کش آمده، با همین وضعیت یک جلسهٔ کوتاه بخوان.</p>
      <button class="btn" data-act="tab" data-tab="lab" data-view="env">ادامهٔ ممیزی</button>
    </section>` : ''],
  ].filter(([, html]) => html);
  const dues = allDues.filter(([c]) => chOn(c)).map(([, html]) => html), hiddenDues = allDues.length - dues.length;
  const R = chOn(0);
  return `
    <header class="top">
      <p class="date">${dateFa(Date.now())}</p>
      <h1>اگر همین الان منبع را ببندی، چه چیزی در ذهنت می‌ماند؟</h1>
    </header>

    ${chChips()}

    ${db.guideSeen ? '' : `
    <section class="due">
      <h2>راهنمای یک‌دقیقه‌ای</h2>
      <p>هر بخش اپ برای چیست و از کجا شروع کنی. بعداً هم از دکمهٔ «راهنما» بالای هر صفحه باز می‌شود.</p>
      <div class="row acts"><button class="btn" data-act="guide" data-focus="start">دیدن راهنما</button><button class="btn quiet" data-act="guide-skip">بعداً</button></div>
    </section>`}

    ${dueStack(dues)}
    ${hiddenDues ? `<p class="fine">${fa(hiddenDues)} کار امروز مال فصل‌هایی است که الان انتخاب نکرده‌ای. <button class="btn link" data-act="ch" data-ch="all">همه را نشان بده</button></p>` : ''}

    <section class="start">
      <button class="btn primary big" data-act="new-session">شروع جلسهٔ مطالعه</button>
      ${R || chOn(2) ? `<div class="row eq">${R ? '<button class="btn quiet" data-act="new-quick">فقط ۶۰ ثانیه</button>' : ''}${chOn(2) ? '<button class="btn quiet" data-act="new-obstacle">شروع نمی‌کنم</button>' : ''}</div>` : ''}
      ${R ? `      ${db.landing ? `<p class="count">نقطهٔ ورود بعدی${has(db.landing.subject) ? ` از ${esc(db.landing.subject)}` : ''}: ${has(db.landing.when) ? `اگر ${esc(db.landing.when)}، آنگاه ` : ''}${esc(db.landing.text)}</p>` : ''}
      ${has(sl?.recipe) ? `<p class="count">نسخهٔ شروع من: ${esc(sl.recipe)}</p>` : ''}` : ''}
    </section>

    ${R && openParked().length ? `
    <section>
      <h2>برگهٔ پارک</h2>
      <p class="fine">چیزهایی که وسط جلسه کنار گذاشتی. تا آخر امروز: انجام، زمان دقیق، یا حذف.</p>
      ${parkSheet(openParked())}
    </section>` : ''}

    ${(R || chOn(6)) && db.plans.length ? `
    <section>
      <h2>هدف‌های نوشته‌شده</h2>
      <ul class="log">${db.plans.map((p) => `
        <li>
          <div class="log-head"><b>${esc(p.subject)}</b><span class="tag">${fa(p.minutes)} دقیقه</span></div>
          <p>${esc(p.goal)}</p>
          <small>اگر ${esc(p.ifWhen)}، آنگاه ${esc(p.ifThen)}</small>
          <div class="row acts"><button class="btn" data-act="plan-start" data-id="${p.id}">الان همان لحظه است</button><button class="btn quiet" data-act="plan-drop" data-id="${p.id}">حذف</button></div>
        </li>`).join('')}</ul>
    </section>` : ''}

    ${R || chOn(5) ? `<section>
      <h2>خواب و انرژی</h2>
      ${d ? `<p class="count">${sleepHours(d) != null ? `${fa1(sleepHours(d))} ساعت خواب` : 'ساعت خواب ثبت نشده'}${d.quality ? `، کیفیت ${fa(d.quality)} از ۵` : ''}${[d.e1, d.e2, d.e3, d.e4].some(Boolean) ? `، انرژی ${[d.e1, d.e2, d.e3, d.e4].map((e, i) => (e ? `${SLOTS[i]} ${fa(e)}` : '')).filter(Boolean).join('، ')}` : ''}</p>` : '<p class="empty">سوختِ امروز را هم اندازه بگیر، نه فقط اراده را.</p>'}
      <button class="btn big" data-act="new-day">${d ? 'تکمیل ثبت امروز' : 'ثبت خواب و انرژی امروز'}</button>
    </section>` : ''}

    <section>
      <h2>جلسه‌های امروز</h2>
      ${todays.length ? `<ul class="log">${todays.map(sessionRow).join('')}</ul>` : `<p class="empty">هنوز جلسه‌ای ثبت نشده. اولین جلسه را با یک خروجی کوچک شروع کن.</p>`}
      ${R || chOn(5) ? '<button class="btn link" data-act="new-manual">بدون اپ درس خواندم؛ همین حالا ثبتش کن</button>' : ''}
    </section>`;
}

const chChips = () => `
  <div class="chips" role="group" aria-label="ابزارهای کدام فصل؟">
    <button data-act="ch" data-ch="all" aria-pressed="${!db.chapters.length}">همه</button>${CHAPTERS.map(([n, t]) => `
    <button data-act="ch" data-ch="${n}" aria-pressed="${db.chapters.includes(n)}">${n ? `فصل ${fa(n)} · ` : ''}${t}</button>`).join('')}
  </div>`;

const sessionRow = (s) => `
  <li>
    <div class="log-head"><b>${esc(s.subject)}</b><span class="tag ${s.outcome}">${OUTCOME[s.outcome]}</span></div>
    <p>${esc(s.goal)}</p>
    ${has(s.can) ? `<p class="count">حالا می‌توانم: ${esc(s.can)}</p>` : ''}
    <small>${s.real != null ? `${fa(s.real)} دقیقهٔ واقعی از ${fa(s.studied)}` : `${fa(s.studied)} دقیقه`}${s.load ? `، کار ${LOADS[s.load]}` : ''}، شکاف: ${GAPS[s.gap].label}${s.ran === 'no' ? '، معیار اجرا نشد' : ''}${s.retrieved ? '، بازیابی شد' : ''}</small>
  </li>`;

function viewSession() {
  const a = A();
  // تکه‌های جلسه هم به فصل خودشان وصل‌اند؛ انتخاب فصل‌ها موقع شروع جلسه ثابت می‌شود
  const R = chOn(0, a.ch || []), C2 = chOn(2, a.ch || []), C3 = chOn(3, a.ch || []), C4 = chOn(4, a.ch || []), C5 = chOn(5, a.ch || []), C6 = chOn(6, a.ch || []);
  if (a.step === 'setup') {
    const hint = goalHint((a.goal || '').trim()), cHint = criterionHint(a.criterion);
    const em = energyMap(), slot = slotOf(Date.now()), rule = db.digital?.rule;
    const sug = suggestFmt(a), F = FMT[a.fmt] || FMT.pomo, prevT = has(a.wtype) && db.sessions.filter((s) => s.wtype === a.wtype.trim()).pop();
    const loadHint = !a.load || em.peak < 0 ? 'سنگینی به آشنایی تو با کار بستگی دارد، نه به اسم درس.'
      : a.load === 'heavy' && slot === em.trough ? `الان، ${SLOTS[slot]}، فرودِ توست. کار سنگین را به ${SLOTS[em.peak]} ببر یا همین‌جا نسخهٔ کوچکش را بردار.`
      : a.load === 'light' && slot === em.peak ? `الان اوج توست. کار سبک را به ${SLOTS[em.trough]} تبعید کن و این ساعت را به کار سنگین بده.`
      : a.load === 'heavy' && slot === em.peak ? 'الان اوج توست؛ جای کار سنگین همین‌جاست.'
      : 'سنگینی به آشنایی تو با کار بستگی دارد، نه به اسم درس.';
    const phoneHint = { out: 'بهترین حالت.', drawer: 'خوب است، به شرطی که برای برداشتنش باید بلند شوی.',
      tool: 'برنامهٔ درس را تمام‌صفحه باز کن و اگر می‌شود خروج را قفل کن.', desk: 'رو به پایین هم کافی نیست؛ هنوز یک حرکت فاصله دارد.' }[a.phonePlace] || 'بی‌صدا و رو به پایین روی میز حساب نیست.';
    return `
      <header class="flow"><button class="back" data-act="cancel">انصراف</button><h1>خروجی این جلسه</h1></header>
      ${tip('session')}
      ${R ? '' : `
      ${textField('موضوع', 'subject', a.subject, 'مثلاً: مشتق زنجیره‌ای، تمرین‌های صفحهٔ ۸۴', C6 ? 'اگر در یک جلسه تمام نمی‌شود، هنوز موضوع نیست؛ فصل است.' : 'آن‌قدر کوچک که در همین جلسه تمام شود.')}
      <label class="field"><span>تا پایان این جلسه باید بتوانم…</span>
        <textarea rows="3" data-bind="goal" data-live placeholder="تفاوت list و tuple را با دو مثال توضیح بدهم">${esc(a.goal || '')}</textarea></label>
      <p class="hint" id="goal-hint" ${hint ? '' : 'hidden'}>${hint}</p>
      ${C6 ? `<label class="field"><span>از کجا می‌فهمم رسیده‌ام؟ بدون نگاه به منبع</span>
        <input type="text" data-bind="criterion" data-live value="${esc(a.criterion || '')}" placeholder="مثلاً: ۵ تمرین بدون نگاه به حل؛ ۴ تا درست"></label>
      <p class="hint" id="crit-hint" ${cHint ? '' : 'hidden'}>${cHint}</p>
      ${aiPart('goal', 'هدف و معیار را با هوشواره تیز کن')}` : ''}
      <div class="field"><span>مدت مطالعه</span>${seg('minutes', (a.short ? [a.short, ...LEAN_MIN] : LEAN_MIN).map((n) => [n, fa(n)]), a.minutes, 'مدت به دقیقه')}
        <small>دقیقه. تایمر که تمام شد، منبع را می‌بندی و از حفظ می‌نویسی.</small></div>
      ${C3 ? `<div class="field"><span>گوشی کجاست؟</span>
        ${seg('phonePlace', [['out', 'بیرون اتاق'], ['drawer', 'کشو یا کیف'], ['tool', 'ابزار درس'], ['desk', 'روی میز']], a.phonePlace, 'جای گوشی')}
        <small>${phoneHint}</small></div>` : ''}
      <button class="btn primary big" data-act="start-study">شروع مطالعه</button>
      ${C6 ? `${fold('s-goal', 'مرز، لحظهٔ شروع و نوع جلسه', `
      <div class="field"><span>این جلسه چه جور جلسه‌ای است؟</span>
        ${seg('mode', [['normal', 'عادی'], ['scan', 'مطلب کاملاً تازه'], ['min', 'روز کم‌انرژی']], a.mode, 'نوع جلسه')}
        <small>${a.mode === 'scan' ? 'اول عنوان‌ها، خلاصه و سؤال‌های آخر فصل را نگاه کن. هدف این جلسه شناختن ساختار است، نه حل‌کردن.'
          : a.mode === 'min' ? 'هدف مینیمم: یک کار کوچک که حتماً تمام می‌شود. زنجیره قطع نشود، همین کافی است.'
          : 'یک هدف اصلی. اگر وقت ماند، هدف دوم.'}</small></div>
      ${textField('امروز جزو هدف نیست', 'out', a.out, 'مثلاً: مسائل ترکیبی')}
      <div class="field"><span>لحظهٔ شروع</span>
        <div class="ifthen">
          <label><i>اگر</i><input type="text" data-bind="ifWhen" value="${esc(a.ifWhen || '')}" placeholder="ساعت ۵ شد و پشت میز نشستم"></label>
          <label><i>آنگاه</i><input type="text" data-bind="ifThen" value="${esc(a.ifThen || '')}" placeholder="دفتر تمرین را باز می‌کنم و مسئلهٔ اول را می‌خوانم"></label>
        </div>
        <small>«آنگاه» اولین اقدام است: آن‌قدر کوچک که تقریباً اراده نخواهد.</small></div>
      <p class="hint" id="first-hint" ${firstHint(a) ? '' : 'hidden'}>${firstHint(a)}</p>
      ${textField('چرا این؟', 'why', a.why, 'دلیل واقعی، نه شعار')}`, a.mode !== 'normal', 'اختیاری')}
      <button class="btn big" data-act="plan-save">هدف را نگه دار برای همان لحظه</button>` : ''}`}
      ${!R ? '' : `
      ${textField('موضوع باریک', 'subject', a.subject, 'مثلاً: مشتق زنجیره‌ای، تمرین‌های صفحهٔ ۸۴', 'اگر در یک جلسه تمام نمی‌شود، هنوز موضوع نیست؛ فصل است.')}
      <label class="field"><span>تا پایان این جلسه باید بتوانم…</span>
        <textarea rows="3" data-bind="goal" data-live placeholder="${a.mode === 'min' ? 'تعریف را از حفظ بنویسم و یک مثال بزنم' : 'مسائل سقوط آزاد صفحهٔ ۶۲ را بدون حل‌المسائل حل کنم'}">${esc(a.goal || '')}</textarea></label>
      <p class="hint" id="goal-hint" ${hint ? '' : 'hidden'}>${hint}</p>
      <label class="field"><span>از کجا می‌فهمم رسیده‌ام؟ بدون نگاه به منبع</span>
        <input type="text" data-bind="criterion" data-live value="${esc(a.criterion || '')}" placeholder="مثلاً: ۵ تمرین بدون نگاه به حل؛ ۴ تا درست"></label>
      <p class="hint" id="crit-hint" ${cHint ? '' : 'hidden'}>${cHint}</p>
      ${aiPart('goal', 'هدف و معیار را با هوشواره تیز کن')}
      <div class="field"><span>${a.fmt === 'flex' ? 'سقف قطعی' : 'مدت کار'}</span>${seg('minutes', F.opts.map((n) => [n, fa(n)]), a.minutes, 'مدت به دقیقه')}
        <small>دقیقه. عدد فرضیه است، نه قانون؛ از جلسه‌های اخیرت بردار، نه از آرزو.${prevT ? ` آخرین بار در این نوع کار ${fa(realOf(prevT))} دقیقهٔ واقعی از ${fa(prevT.studied)} داشتی.` : ''}${a.fmt === 'deep' && a.minutes > 60 ? ' بلوک بلندتر فقط بعد از چند بلوک موفقِ کوتاه‌تر در همین نوع کار.' : ''}</small></div>
      <div class="field"><span>گوشی کجاست؟</span>
        ${seg('phonePlace', [['out', 'بیرون اتاق'], ['drawer', 'کشو یا کیف'], ['tool', 'ابزار درس'], ['desk', 'روی میز']], a.phonePlace, 'جای گوشی')}
        <small>${phoneHint}</small></div>
      <button class="btn primary big" data-act="start-study">شروع مطالعه</button>
      <p class="fine">همین‌ها برای شروع کافی است. بخش‌های پایین اختیاری‌اند؛ هر کدام را خواستی باز کن.</p>
      ${fold('s-start', 'نوع جلسه و لحظهٔ شروع', `
      <div class="field"><span>این جلسه چه جور جلسه‌ای است؟</span>
        ${seg('mode', [['normal', 'عادی'], ['scan', 'مطلب کاملاً تازه'], ['min', 'روز کم‌انرژی']], a.mode, 'نوع جلسه')}
        <small>${a.mode === 'scan' ? 'اول عنوان‌ها، خلاصه و سؤال‌های آخر فصل را نگاه کن. هدف این جلسه شناختن ساختار است، نه حل‌کردن.'
          : a.mode === 'min' ? 'هدف مینیمم: یک کار کوچک که حتماً تمام می‌شود. زنجیره قطع نشود، همین کافی است.'
          : 'یک هدف اصلی. اگر وقت ماند، هدف دوم.'}</small></div>
      ${textField('امروز جزو هدف نیست', 'out', a.out, 'اختیاری؛ مثلاً: مسائل ترکیبی')}
      <div class="field"><span>لحظهٔ شروع</span>
        <div class="ifthen">
          <label><i>اگر</i><input type="text" data-bind="ifWhen" value="${esc(a.ifWhen || '')}" placeholder="ساعت ۵ شد و پشت میز نشستم"></label>
          <label><i>آنگاه</i><input type="text" data-bind="ifThen" value="${esc(a.ifThen || '')}" placeholder="دفتر تمرین را باز می‌کنم و مسئلهٔ اول را می‌خوانم"></label>
        </div>
        <small>«آنگاه» حرکت اول است: روی خودِ درس، دقیق، حدود دو دقیقه، و فقط یکی. نشانه یک رخداد بیرونی باشد.</small></div>
      <p class="hint" id="first-hint" ${firstHint(a) ? '' : 'hidden'}>${firstHint(a)}</p>
      <div class="field"><span>ورود کوچک</span>
        ${seg('entry', [[5, '۵ دقیقه'], [2, '۲ دقیقه'], [1, '۶۰ ثانیه'], [0, 'مستقیم']], a.entry, 'مدت ورود')}
        <small>${a.entry ? 'فقط همین مدت روی حرکت اول. بعدش واقعاً آزادی ادامه بدهی یا بایستی؛ فقط عقب‌انداختنش ممنوع است.' : 'بدون بازهٔ ورود، یک‌راست سراغ بلوک.'}</small></div>
      <div class="field"><span>حال قبل از شروع</span>${seg('mood', Object.entries(MOODS), a.mood, 'حال قبل از شروع')}
        <small>شرط شروع نیست؛ فقط ثبت می‌شود تا ببینی بی‌حوصله هم شروع می‌کنی.</small></div>
      ${textField('چرا این؟', 'why', a.why, 'اختیاری؛ دلیل واقعی، نه شعار')}
      <div class="field"><span>بار ذهنی این کار</span>${seg('load', Object.entries(LOADS), a.load, 'بار ذهنی')}
        <small>${loadHint}</small></div>`, a.entry > 0 || a.mode !== 'normal')}
      ${fold('s-fmt', 'قالب این جلسه', `
        <label class="field"><span>نوع کار</span>
          <input type="text" data-bind="wtype" list="wtypes" value="${esc(a.wtype || '')}" placeholder="مثلاً: حل تمرین فیزیک، مرور واژگان">
          <datalist id="wtypes">${wtypes().map((w) => `<option value="${esc(w)}">`).join('')}</datalist>
          <small>${FMT[db.formats[(a.wtype || '').trim()]] ? `پیش‌فرض خودت برای این نوع کار: ${FMT[db.formats[a.wtype.trim()]].label}.` : 'قالب مالِ نوع کار است، نه کل درس.'}</small></label>
        <div class="field"><span>اگر وسط این کار پنج دقیقه قطع شوم…</span>
          ${seg('cut', [['bits', 'چیزی از دست نمی‌رود'], ['cont', 'مسیر فکرم می‌ریزد']], a.cut, 'هزینهٔ قطع‌شدن')}</div>
        <div class="field"><span>امروز شروع سخت است، انرژی کم است، زیر نیم ساعت وقت دارم یا محیط ناپایدار است؟</span>
          ${seg('hardDay', [['yes', 'بله'], ['no', 'نه']], a.hardDay, 'روز سخت')}</div>
        ${a.cut === 'cont' && a.hardDay === 'no' ? `<div class="field"><span>زمان محافظت‌شده دارم و جلسه‌های اخیرم نشان می‌دهد این مدت را با کیفیت تاب می‌آورم؟</span>
          ${seg('guarded', [['yes', 'بله'], ['no', 'نه، یا طول کار معلوم نیست']], a.guarded, 'ظرفیت فعلی')}</div>` : ''}
        <div class="field"><span>قالب</span>${seg('fmt', FMT_ORDER.map((k) => [k, FMT[k].label]), a.fmt, 'قالب جلسه')}
          <small>${sug && sug !== a.fmt ? `پیشنهادِ دو سؤال «${FMT[sug].label}» بود. ` : ''}${stretchy(a) ? 'ده دقیقه با تمدید اختیاری: سر زنگ کار را قطع نکن؛ فقط بپرس «ده دقیقهٔ دیگر می‌توانم؟»، تا سقف چهل.' : F.note}</small></div>`, !!db.fmtLab && fmtList().length < 3)}
      ${fold('s-ramp', 'ورود و لنگر', `
        <div class="field"><span>رمپ ورود</span>
          ${seg('ramp', [[0, 'خاموش'], [8, 'کامل'], [3, 'فشرده'], ['hot', 'گرمم']], a.ramp, 'رمپ ورود')}
          <small>${a.ramp === 8 ? 'حداکثر هشت دقیقه بارگذاری با لبهٔ آسانِ همین کار، بعد قفل. زنگ تمدید ندارد.'
            : a.ramp === 3 ? 'برای بلوک بیست‌دقیقه‌ای: سه دقیقه بارگذاری، بعد قفل.'
            : a.ramp === 'hot' ? 'جلسهٔ دوم روی همین موضوع: بدون بارگذاری، مستقیم قفل. بررسی میانی سر جایش است.'
            : 'برای وقتی که می‌نشینی ولی از سطح به کار سخت نمی‌رسی.'}${a.ramp && a.minutes > 45 ? ' برای آزمودن ورود، بلوک را از ۴۵ دقیقه بلندتر نکن.' : ''}</small></div>
        ${a.ramp ? `
        <div class="field"><span>پارک، حداکثر دو دقیقه</span>
          <div class="ifthen">
            <label><i>ذهنم</i><input type="text" data-bind="park" value="${esc(a.park || '')}" placeholder="بلندترین چیزی که الان ذهنم را می‌کشد"></label>
            <label><i>کِی</i><input type="text" data-bind="parkWhen" value="${esc(a.parkWhen || '')}" placeholder="بلافاصله بعد از این بلوک"></label>
          </div>
          <small>فقط بلندترینش. فهرست کارها را اینجا باز نکن.</small></div>
        ${textField('اگر گیر کردم، اولین قدم جایگزینم', 'fallback', a.fallback, 'مثلاً: برمی‌گردم به مثال حل‌شدهٔ صفحهٔ ۶۲', 'واحد کار همان خروجی بالاست: فعل، محدوده، خروجی. باید بشود به آن جواب غلط داد.')}` : ''}
        ${textField('محتمل‌ترین حواس‌پرتی این جلسه: اگر…', 'guard', a.guard, 'خواستم گروه کلاس را چک کنم', 'آنگاه روی برگه می‌نویسمش و قدم بعدی را انجام می‌دهم. یک جملهٔ خوب را جلسه‌ها تکرار کن.')}`, !!a.ramp)}
      ${fold('s-mode', 'حالت مطالعه', `
        ${has(rule?.place) ? `<p class="count">قاعدهٔ خودت: گوشی ${esc(rule.place)}${has(rule.people) ? `؛ فقط ${esc(rule.people)} فوری می‌رسند` : ''}${has(rule.next) ? `؛ چک بعدی ${esc(rule.next)}` : ''}.</p>` : ''}
        ${textField('برای این جلسه فقط به این‌ها نیاز دارم', 'needs', a.needs, 'مثلاً: کتاب، دفتر تمرین، مستندات پایتون', 'هرچه در این فهرست نیست تا پایان جلسه بسته می‌ماند.')}
        <label class="check"><input type="checkbox" data-bind="deskClear" ${a.deskClear ? 'checked' : ''}>
          <span>روی میز فقط وسایل همین جلسه است.</span></label>
        <label class="check"><input type="checkbox" data-bind="focusOn" ${a.focusOn ? 'checked' : ''}>
          <span>حالت تمرکز روشن است و تب‌ها و برنامه‌های اضافه بسته‌اند، نه کوچک.</span></label>
        <div class="field"><span>کجا نشسته‌ام؟</span>
          ${seg('place', [['fixed', 'جای همیشگی مطالعه'], ['other', 'جای دیگر']], a.place, 'جای مطالعه')}</div>
        <div class="field"><span>نقشهٔ توجه</span>
          ${seg('ping', [[0, 'خاموش'], [5, 'هر ۵ دقیقه'], [2, 'هر ۲ دقیقه'], ['end', 'فقط پایان']], a.ping, 'زنگ نمونه‌گیری')}
          <small>${a.ping === 'end' ? 'بدون زنگ میانی؛ برای وقتی که زنگ رشتهٔ حل مسئله را پاره می‌کند. سه عدد را آخر جلسه می‌نویسی.'
            : a.ping ? `با هر لرزش، ده ثانیه: یکی از سه برچسب را بزن و برگرد. بلوک ۱۵ تا ۲۵ دقیقه کافی است${a.minutes > 25 ? '؛ این جلسه را طولانی‌تر نکن' : ''}.`
            : 'زنگ بی‌صدا وسط جلسه می‌پرسد توجهت الان کجاست.'}</small></div>`, !!a.ping)}
      <button class="btn big" data-act="plan-save">هدف را نگه دار برای همان لحظه</button>`}`;
  }

  if (a.step === 'study' && a.entryState === 'run') {
    const over = Date.now() >= a.entryEndsAt;
    return `
      <header class="flow"><button class="back" data-act="cancel">رها کردن جلسه</button><h1>ورود کوچک</h1></header>
      <p class="goal-line">${esc(a.ifThen)}</p>
      <div class="timer" data-timer="${a.entryEndsAt}" aria-live="off">${clock(a.entryEndsAt - Date.now())}</div>
      <p class="timer-note">${over ? 'زنگ خورد. پانزده ثانیه مکث کن و یکی را بزن.' : 'این مقاومتِ شروع است. با آن بحث نکن؛ از رویش رد شو.'}</p>
      ${over ? `
        <button class="btn primary big" data-act="entry-go">ادامه می‌دهم</button>
        ${a.entryMore < 2 ? '<button class="btn big" data-act="entry-more">سنگین است؛ یک پنج‌دقیقهٔ دیگر</button>' : ''}
        <button class="btn big" data-act="entry-stop">توقف آگاهانه</button>
        <p class="fine">لازم نیست حس خوبی داشته باشی؛ کافی است ادامه ممکن باشد.</p>` : `
        <p class="count">مجاز: کند خواندن، ناقص فهمیدن، حل غلط، شروع زشت. ممنوع: عوض‌کردن درس، «اول یک چیز دیگر»، گوشی.</p>
        <button class="btn link" data-act="entry-go">راه افتادم؛ برو به جلسه</button>`}
      ${urgeBox(a)}`;
  }

  if (a.step === 'study' && a.rampState === 'load') {
    const over = Date.now() >= a.loadEndsAt;
    return `
      <header class="flow"><button class="back" data-act="cancel">رها کردن جلسه</button><h1>بارگذاری</h1></header>
      <p class="goal-line">${esc(a.goal)}</p>
      <div class="timer" data-timer="${a.loadEndsAt}" aria-live="off">${clock(a.loadEndsAt - Date.now())}</div>
      <p class="timer-note">${over ? 'زنگ خورد و تمدید ندارد. حس آمادگی شرط ورود نیست.' : 'لبهٔ آسانِ همین کار. نه کار دیگر، نه سخت‌ترین نقطه، نه تب تازه.'}</p>
      ${textField('دفعهٔ قبل کجا رها کردم؟', 'loadLast', a.loadLast, 'یا: از این تعریف یا این مثال شروع می‌کنم')}
      ${textField('سؤال این واحد چیست؟', 'loadQ', a.loadQ, 'یک جمله')}
      <p class="count">یک تماس سبک: در مسئله، فقط داده‌ها و خواسته را بنویس. در متن، تیترها را ببین و دو سؤال بنویس. در نوشتن، چند جملهٔ آزاد و بی‌قضاوت.</p>
      <button class="btn primary big" data-act="lock">${over ? 'شروع قفل' : 'داخل مسئله‌ام؛ قفل'}</button>
      <p class="fine">تازه از شبکه‌های اجتماعی آمده‌ای؟ این چند دقیقه را روی کاغذ و بدون صفحه‌نمایش بگذران.</p>`;
  }

  if (a.step === 'stop') return stopForm(a);

  if (a.step === 'study') {
    const over = Date.now() >= a.endsAt, F = FMT[a.fmt], total = Math.round((a.endsAt - a.startedAt) / 6e4);
    const bell = !F ? 'زمان تمام شد. منبع را ببند.'
      : F.bell === 'cap' ? 'سقف است و جابه‌جا نمی‌شود. اگر حل نشد، محل گیر را بنویس و ببند.'
      : stretchy(a) ? 'کار را قطع نکن؛ فقط بپرس: ده دقیقهٔ دیگر می‌توانم؟'
      : F.bell === 'cue' ? 'زنگ یادآور: تا نزدیک‌ترین نقطهٔ توقف طبیعی برو و بایست.'
      : 'زنگ پایان‌دهنده: جمله یا مرحلهٔ جاری را تمام کن و بایست. کار تازه شروع نکن.';
    return `
      <header class="flow"><button class="back" data-act="cancel">رها کردن جلسه</button><h1>${esc(a.subject)}</h1></header>
      ${a.midDue ? `
      <section class="due">
        <h2>بررسی میانی</h2>
        ${a.midHelp ? `
        <p>از نو شروع نکن. سؤالی را که رویش گیر کرده‌ای در یک خط بنویس و کوچک‌ترین قدم را همین حالا بردار: یک خط راه‌حل، یک تعریف، یک داده.</p>
        ${textField('روی این گیر کرده‌ام', 'midQ', a.midQ)}${aiPart('step', 'کوچک‌ترین قدم را هوشواره پیشنهاد بدهد')}${textField('کوچک‌ترین قدم', 'midStep', a.midStep)}
        <button class="btn" data-act="mid-rescue">قدم را برداشتم؛ ادامه</button>` : `
        ${textField('دارم سعی می‌کنم…', 'midTry', a.midTry)}${textField('قدم بعدی‌ام…', 'midNext', a.midNext)}
        <div class="row eq"><button class="btn" data-act="mid-ok">کامل شد</button><button class="btn" data-act="mid-help">کامل نمی‌شود</button></div>
        <p class="fine">بدون بلندشدن. کند و سخت بودن اشکالی ندارد؛ اگر این دو جمله را داری، داخلی.</p>`}
      </section>` : ''}
      ${a.signDue && !over ? `
      <section class="due">
        <h2>بازبینی، دقیقهٔ ${fa(elapsedMin(a.startedAt))}</h2>
        ${SIGNS.map((s, i) => `<label class="check"><input type="checkbox" data-bind="sg${i}" ${a['sg' + i] ? 'checked' : ''}><span>${s}</span></label>`).join('')}
        <button class="btn" data-act="signs">ثبت بازبینی</button>
        <p class="fine">بی‌حوصلگی جزو نشانه‌ها نیست. دو تا از سه یعنی جمع‌بندی و توقف.</p>
      </section>` : ''}
      ${a.signStop ? '<p class="advice">دو نشانه از سه را داری. جمع‌بندی کن و بایست؛ سقف هدفِ اجباری نیست.</p>' : ''}
      ${a.pingDue && !over ? `
      <section class="due">
        <h2>الان کدام؟</h2>
        <div class="row eq">${Object.entries(PING).map(([k, l]) => `<button class="btn" data-act="ping" data-v="${k}">${l}</button>`).join('')}</div>
        <p class="fine">ده ثانیه، بدون داور. اگر نمی‌توانی جملهٔ آخر را بازگو کنی، شبه‌تمرکز است.</p>
      </section>` : ''}
      <p class="goal-line">${esc(a.goal)}</p>
      <p class="count"${R || C6 ? '' : ' hidden'}>معیار: ${esc(a.criterion)}${has(a.out) ? `<br>امروز نه: ${esc(a.out)}` : ''}${has(a.needs) ? `<br>فقط با: ${esc(a.needs)}` : ''}</p>
      ${R ? `<label class="field"><span>لنگر: قدم بعدی</span>
        <input type="text" data-bind="anchor" value="${esc(a.anchor || '')}" placeholder="کوچک‌ترین عملِ مانده: خط بعدیِ راه‌حل، سؤال بعدی"></label>` : ''}
      <div class="timer" data-timer="${a.endsAt}" aria-live="off">${clock(a.endsAt - Date.now())}</div>
      <p class="timer-note">${over ? bell : R || C3 ? 'هر بخش سه یا چهار ایده دارد. بخش را که خواندی، ببند و بنویس.' : 'فقط چیزی را علامت بزن که به همین خروجی مربوط است، و کنارش بنویس چرا: تعریف، مثال، مرحلهٔ حل.'}</p>
      ${a.rampState === 'lock' ? `<p class="count">قفل: تا پایان بلوک جابه‌جایی اختیاری نداری. گیر کردی؟ حدود هفت دقیقه روی همان گره بمان و روی کاغذ راه امتحان کن${has(a.fallback) ? `؛ بعد: ${esc(a.fallback)}` : ''}.</p>` : ''}
      ${has(a.guard) ? `<p class="count">اگر ${esc(a.guard)}، آنگاه روی برگه می‌نویسمش و قدم بعدی را انجام می‌دهم.</p>` : ''}
      ${a.chunks.length ? `<p class="count">${fa(a.chunks.length)} بخش را بسته و بازسازی کرده‌ای${a.chunks.some((c) => has(c.title)) ? `: ${a.chunks.map((c) => esc(c.title)).filter(Boolean).join('، ')}` : ''}.</p>` : ''}
      ${a.pings?.length ? `<p class="count">نقشهٔ توجه: ${fa(a.pings.length)} نمونه. هر پرش را پایین با علتش بزن.</p>` : ''}
      ${!over || !F ? '' : stretchy(a) ? (total + 10 <= 40 ? '<button class="btn big" data-act="stretch">ده دقیقهٔ دیگر می‌توانم</button>' : '')
        : F.bell !== 'cap' && !a.ext ? '<button class="btn big" data-act="extend">تا پایان همین واحد؛ یک بار، حداکثر پنج دقیقه</button>' : ''}
      ${over || !(R || C3 || C4) ? '' : `<button class="btn big" data-act="chunk">به‌جای دور دوم؛ ببند و بنویس</button>`}
      <button class="btn primary big" data-act="to-feel">${over ? 'برو به آزمون کتاب‌بسته' : 'جلسه را تمام کن'}</button>
      ${R || C2 ? urgeBox(a) : ''}
      <button class="btn link" data-act="halve">هدف برای این جلسه بزرگ است</button>
      ${C2 ? '<button class="btn link" data-act="stuck">گیر کرده‌ام و نمی‌توانم ادامه بدهم</button>' : ''}`;
  }

  if (a.step === 'halve') {
    return `
      <header class="flow"><button class="back" data-act="to-study">برگشت به جلسه</button><h1>هدف را نصف کن</h1></header>
      <p>هدف ابزار هدایت است، نه قرارداد. همین حالا کوچکش کن و ادامه بده؛ تایمر نمی‌ایستد.</p>
      <label class="field"><span>تا پایان این جلسه باید بتوانم…</span>
        <textarea rows="3" data-bind="goal">${esc(a.goal || '')}</textarea></label>
      ${R || C6 ? textField('معیار تازه، بدون نگاه به منبع', 'criterion', a.criterion) : ''}
      <button class="btn primary big" data-act="halve-done">ادامهٔ جلسه</button>`;
  }

  if (a.step === 'chunk') {
    return cover(`
      <h1>منبع را ببند</h1>
      <p>هرچه از همین بخش یادت مانده بنویس. ناقص و به‌هم‌ریخته اشکالی ندارد.</p>
      <p class="fine">درس مسئله‌ای است؟ به‌جای خلاصه، یک تمرین همین بخش را بدون نگاه به راه‌حل حل کن.</p>
      <textarea class="sheet" rows="8" data-bind="chunkDraft" placeholder="از حافظه…" autofocus>${esc(a.chunkDraft || '')}</textarea>
      <button class="btn primary big" data-act="chunk-check">نوشتم؛ حالا با منبع مقایسه می‌کنم</button>`);
  }

  if (a.step === 'chunk-check') {
    return `
      <header class="flow"><h1>منبع را باز کن</h1></header>
      <p>فقط جاهای خالی یا اشتباه را پیدا کن. دوباره نخوان.</p>
      <blockquote class="mine">${esc(a.chunkDraft) || 'چیزی ننوشتی.'}</blockquote>
      <div class="field"><span>چند جای خالی یا اشتباه بود؟</span>
        <div class="stepper"><button class="btn" data-act="gaps-" aria-label="کمتر">−</button><output>${fa(a.chunkGaps)}</output><button class="btn" data-act="gaps+" aria-label="بیشتر">+</button></div></div>
      ${textField('عنوان این بخش با کلمات خودم', 'chunkTitle', a.chunkTitle, 'کوتاه؛ مثلاً: چرا توجه دروازهٔ باریک است')}
      ${textField('این به چه چیزی که از قبل می‌دانم وصل می‌شود؟', 'chunkHook', a.chunkHook, 'شبیهِ… است، چون…')}
      <button class="btn primary big" data-act="chunk-done">بخش بعدی</button>`;
  }

  if (a.step === 'feel') {
    return `
      <header class="flow"><h1>${R || C5 ? 'قبل از آزمون، دو عدد و یک حدس' : 'قبل از آزمون، یک حدس'}</h1></header>
      ${R || !C5 ? '' : `<p>${fa(a.studied)} دقیقه پای کار بودی. همین حالا بنویس؛ حافظه تا شب وقفه‌ها را پاک می‌کند.</p>
      <div class="grid2">
        ${numField('دقیقهٔ واقعی', 'real', a.real, 'ذهنت واقعاً با مطلب درگیر بود.')}
        ${numField('بلندترین تمرکز', 'longest', a.longest, 'تا اولین وقفهٔ جدی.')}
        ${numField('تعداد وقفه', 'breaks', a.breaks)}
      </div>
      <div class="field"><span>علت غالب وقفه‌ها</span>
        ${pick('data-bind', 'cause', Object.entries(CAUSES).map(([k, c]) => [k, c.label]), a.cause, 'علت وقفه', 'علت')}</div>`}
      ${!R ? '' : `<p>${fa(a.studied)} دقیقه پای کار بودی. همین حالا بنویس؛ حافظه تا شب وقفه‌ها را پاک می‌کند.</p>
      <div class="grid2">
        ${numField('دقیقهٔ واقعی', 'real', a.real, 'ذهنت واقعاً با مطلب درگیر بود.')}
        ${numField('بلندترین تمرکز', 'longest', a.longest, a.urges.length ? `از روی ${fa(a.urges.length)} وقفهٔ ثبت‌شده.` : 'تا اولین وقفهٔ جدی.')}
        ${numField('دقیقهٔ شبه‌تمرکز', 'pseudo', a.pseudo, 'چشم روی متن، ذهن بدون پردازش.')}
        ${numField('دقیقه تا خط اول', 'lag', a.lag, 'از نشانه تا اولین کار روی درس.')}
      </div>
      ${a.pings?.length ? `<p class="count">از ${fa(a.pings.length)} نمونه: ${Object.entries(PING).map(([k, l]) => `${fa(a.pings.filter((p) => p.v === k).length)} ${l}`).join('، ')}. عددهای بالا از همین‌ها پر شده؛ صادقانه اصلاحشان کن.</p>` : ''}
      ${a.ping ? `<p class="fine">هرچه از ${fa(a.studied)} دقیقه بماند، حواس‌پرتی حساب می‌شود.</p>` : ''}
      <div class="field"><span>اولین کاری که کردم</span>
        ${seg('firstKind', [['content', 'روی خودِ درس'], ['prep', 'آماده‌سازی']], a.firstKind, 'جنس شروع')}</div>`}
      <p>حس می‌کنی چقدر به خروجی این جلسه رسیده‌ای؟ بعداً این حس را با نتیجهٔ واقعی مقایسه می‌کنیم.</p>
      <p class="goal-line">${esc(a.goal)}</p>
      <div class="scale">
        <input type="range" min="0" max="10" step="1" value="${a.feel}" data-bind="feel" data-num data-live aria-label="حس یادگیری از ده">
        <output id="feel-out">${fa(a.feel)} از ۱۰</output>
      </div>
      <button class="btn primary big" data-act="to-recall">همه‌چیز را بستم؛ شروع آزمون</button>`;
  }

  if (a.step === 'recall') {
    return cover(`
      <div class="timer small" data-timer="${a.recallEndsAt}">${clock(a.recallEndsAt - Date.now())}</div>
      <h1>کتاب بسته است</h1>
      <p class="goal-line">${esc(a.goal)}</p>
      ${has(a.criterion) ? `<p>معیار را همین‌جا اجرا کن: ${esc(a.criterion)}</p>` : ''}
      <p>بدون نگاه‌کردن بنویس یا حل کن. جمله‌های کتاب را از حفظ نیاور.</p>
      <textarea class="sheet" rows="10" data-bind="recall" placeholder="از حافظه…" autofocus>${esc(a.recall || '')}</textarea>
      <button class="btn primary big" data-act="to-compare">تمام شد؛ مقایسه با هدف</button>`);
  }

  if (a.step === 'compare') {
    return `
      <header class="flow"><h1>مقایسه با هدف</h1></header>
      <div class="pair">
        <div><span>قرار بود بتوانم</span><p>${esc(a.goal)}</p></div>
        <div><span>از حافظه بیرون آمد</span><p>${esc(a.recall) || 'چیزی ننوشتی.'}</p></div>
      </div>
      ${aiPart('check', 'نظر هوشواره دربارهٔ نوشته‌ام')}
      ${R || C6 ? `<div class="field"><span>معیار را واقعاً اجرا کردم؟</span>
        <small class="above">${esc(a.criterion)}</small>
        ${choice('ran', 'yes', 'بله، بدون نگاه به منبع', a.ran)}${choice('ran', 'no', 'نه؛ فقط حس می‌کنم بلدم', a.ran)}</div>` : ''}
      <div class="field"><span>به خروجی رسیدم؟</span>
        ${choice('outcome', 'full', 'رسیدم', a.outcome)}${choice('outcome', 'partial', 'تا حدی', a.outcome)}${choice('outcome', 'none', 'نرسیدم', a.outcome)}</div>
      <div class="field"><span>شکاف دقیقاً چیست؟ «بلد نیستم» جواب نیست.</span>
        ${Object.entries(GAPS).map(([k, g]) => choice('gap', k, g.label, a.gap)).join('')}</div>
      ${textField('کجا دقیقاً؟ یک جمله', 'gapNote', a.gapNote, 'مثلاً: ترتیب مراحل حل از دستم رفت')}
      ${a.ping ? `<div class="field"><span>مسئلهٔ اصلی توجه در این جلسه؛ فقط یکی</span>
        ${Object.entries(ISSUES).map(([k, x]) => choice('issue', k, x.label, a.issue)).join('')}</div>` : ''}
      ${R || C5 || C6 ? textField('الان چه کاری می‌توانم بکنم که قبل از این جلسه نمی‌توانستم؟', 'can', a.can, 'یک جمله، بدون نگاه به منبع', 'اگر چیزی به ذهنت نمی‌رسد خالی بگذار؛ همین هم داده است.') : ''}
      ${R && (a.ramp || a.fmt) ? `
      <fieldset class="group"><legend>ورود و قالب</legend>
        ${a.ramp ? `
        <div class="field"><span>ردّ قابل‌دیدن این بلوک</span>
          ${pick('data-bind', 'trace', Object.entries(TRACES), a.trace, 'ردّ بلوک')}
          <small>بدون ردّ فقط حس می‌ماند، و حس در دقیقه‌های اول فریبنده است.</small></div>
        ${rampOk(a, db.ramp?.base) ? '' : `<div class="field"><span>ورود نشد؛ علت، فقط یکی</span>
          ${pick('data-bind', 'rampFail', Object.entries(RAMP_FAILS).map(([k, v]) => [k, v[0]]), a.rampFail, 'علت واردنشدن', 'انتخاب کن')}</div>`}` : ''}
        ${a.fmt ? `
        <div class="field"><span>زمان‌بندی کجا مزاحم شد؟</span>
          ${Object.entries(FMT_CUTS).map(([k, l]) => choice('fmtSnag', k, l, a.fmtSnag)).join('')}</div>
        ${textField('برای جلسهٔ بعد فقط یک چیز را عوض می‌کنم', 'fmtNext', a.fmtNext, 'اختیاری؛ مثلاً: هر دوره یک مسئله')}` : ''}
      </fieldset>` : ''}
      <button class="btn primary big" data-act="finish-session">ثبت جلسه</button>`;
  }

  if (a.step === 'done') {
    const s = db.sessions.find((x) => x.id === a.savedId);
    const match = feelMatches(s);
    const same = db.sessions.filter((x) => x.subject === s.subject).slice(-3);
    const sameType = db.sessions.filter((x) => x.fmt && x.wtype === s.wtype).slice(-3);
    const notes = !R ? [
      C6 && s.ran === 'no' && 'معیار اجرا نشد؛ پس این نتیجه هنوز حس است، نه سنجش. دفعهٔ بعد جلسه را با اجرای معیار ببند، نه با تمام‌شدن زمان.',
      C6 && s.ran !== 'no' && s.outcome === 'full' && s.feel <= 3 && 'به معیار رسیدی ولی حس یادگیری نداری. احتمالاً معیار با شناختن جواب پر شده. آن را به تولید بدون راهنما عوض کن: حل، نوشتن یا توضیح از حفظ.',
      C6 && !has(s.can) && 'نتوانستی بگویی چه چیزی اضافه شد. این هم داده است: یا هدف مبهم بود یا روش. جلسهٔ بعد خروجی را کوچک‌تر بنویس.',
      same.length === 3 && same.every((x) => x.outcome !== 'full') && 'سه جلسهٔ پشت‌سرهم روی همین موضوع به هدف نرسیدی. به‌زور ادامه نده؛ مشکل احتمالاً پیش‌نیاز یا روش است، نه خودِ تو.',
      s.halved && 'وسط جلسه هدف را کوچک کردی. دفعهٔ بعد از همان اول همین اندازه بنویس.',
    ].filter(Boolean) : [
      s.ran === 'no' && 'معیار اجرا نشد؛ پس این نتیجه هنوز حس است، نه سنجش. دفعهٔ بعد جلسه را با اجرای معیار ببند، نه با تمام‌شدن زمان.',
      s.ran !== 'no' && s.outcome === 'full' && s.feel <= 3 && 'به معیار رسیدی ولی حس یادگیری نداری. احتمالاً معیار با شناختن جواب پر شده. آن را به تولید بدون راهنما عوض کن: حل، نوشتن یا توضیح از حفظ.',
      !has(s.can) && 'نتوانستی بگویی چه چیزی اضافه شد. یا هدف مبهم بود یا روش؛ جلسهٔ بعد خروجی را کوچک‌تر بنویس و وسط کار بیشتر «ببند و بنویس».',
      same.length === 3 && same.every((x) => x.outcome !== 'full') && 'سه جلسهٔ پشت‌سرهم روی همین موضوع به معیار نرسیدی. به‌زور ادامه نده؛ مشکل احتمالاً پیش‌نیاز یا روش است، نه هدف.',
      s.halved && 'وسط جلسه هدف را کوچک کردی. دفعهٔ بعد از همان اول همین اندازه بنویس.',
      s.lag > 3 && `از نشستن تا خط اول ${fa(s.lag)} دقیقه شد. همین پایین نقطهٔ فرود جلسهٔ بعد را بچین تا فردا این فاصله نزدیک صفر شود.`,
      countCause(s, 'notif') > 0 && CAUSES.notif.advice,
      s.place === 'other' && db.sessions.slice(-4).filter((x) => x.place === 'other').length >= 3 && 'چند جلسهٔ اخیر هر بار جای تازه‌ای بوده. اگر جای ثابت نداری، یک کیف مطالعهٔ ثابت با همان چیدمان بساز.',
      s.firstKind === 'prep' && 'اولین کارت آماده‌سازی بود، نه درس. آماده‌سازی را همین حالا برای جلسهٔ بعد انجام بده تا فردا حرکت اول روی خودِ محتوا باشد.',
      s.ping && !twoLines(s) && realOf(s) * 2 > s.studied && 'نتوانستی دو خط از حافظه بنویسی، ولی بیشترِ جلسه را تمرکز حساب کرده‌ای. سهم شبه‌تمرکز را دست‌کم گرفته‌ای.',
      s.ping && !s.urges.length && s.outcome === 'none' && ATTN_SNAGS.empty[1],
      s.ramp && (rampOk(s, db.ramp?.base) ? 'ورود موفق: بارگذاری کوتاه، بررسی میانی کامل و یک ردّ روی کاغذ. حس غرقگی لازم نبود.' : RAMP_FAILS[s.rampFail]?.[1]),
      s.ramp && s.loadMin > 8 && s.rampFail !== 'stall' && RAMP_FAILS.stall[1],
      FMT_SNAGS[s.fmtSnag]?.[1],
      s.ext && sameType.length === 3 && sameType.every((x) => x.ext) && 'سه جلسهٔ پیاپی زنگ وسط پیشرفت خورد. مشکل از قالب است؛ برای این نوع کار عوضش کن.',
      longsOf(s) >= 2 && longsOf(s) * 2 > s.urges.length && 'بیشترِ پرش‌ها بلند بود. قبل از تکنیک تازه، تشخیص را دوباره بسنج: خستگی، سختی مطلب یا فرار از کار دشوار.',
    ].filter(Boolean);
    const unsettled = db.parked.filter((p) => !p.state);
    return `
      <header class="flow"><h1>جلسه ثبت شد</h1></header>
      ${has(s.can) ? `<div class="next"><span>حالا می‌توانم</span><p>${esc(s.can)}</p></div>` : ''}
      <div class="verdict">
        <div><span>حس تو</span><b>${fa(s.feel)} از ۱۰</b></div>
        <div><span>نتیجهٔ آزمون</span><b>${OUTCOME[s.outcome]}</b></div>
      </div>
      <p>${match ? 'این بار حس و نتیجه با هم خواندند.' : 'حس و نتیجه با هم نخواندند. فعلاً به آزمون تکیه کن، نه به حس هنگام خواندن.'}</p>
      ${R || C5 ? `<p class="count">دادهٔ کمکی: ${fa(s.studied)} دقیقه حضور، ${fa(s.real)} دقیقه واقعی، بلندترین تمرکز ${fa(s.longest)} دقیقه.</p>` : `<p class="count">${fa(s.studied)} دقیقه مطالعه. این عدد فقط می‌گوید چقدر وقت گذاشتی؛ نتیجه را ردیف بالا می‌گوید.</p>`}
      ${s.ping ? `<div class="next"><span>نقشهٔ توجه این جلسه</span><p>${mapSentence(s)}</p></div>
        ${ISSUES[s.issue] ? `<p>مشکل اصلی این جلسه «${ISSUES[s.issue].label}» بود، نه این‌که کلاً آدم بی‌تمرکزی باشی.</p><p class="advice">${ISSUES[s.issue].advice}</p>` : ''}` : ''}
      ${notes.map((n) => `<p class="advice">${n}</p>`).join('')}
      <div class="next">
        <span>قدم بعدی برای «${GAPS[s.gap].label}»</span>
        <p>${GAPS[s.gap].advice}</p>
      </div>
      ${!R ? '' : `${unsettled.length ? `
      <fieldset class="group"><legend>برگهٔ پارک را خالی کن</legend>
        <p class="fine">هر خط: انجامش بده، زمان دقیق بده، یا حذفش کن. برگه‌ای که خالی نشود، ذهن دیگر به آن اعتماد نمی‌کند.</p>
        ${parkSheet(unsettled)}
      </fieldset>` : ''}
      <fieldset class="group"><legend>خروج تمیز، یک دقیقه</legend>
        ${textField('کجا متوقف شدم', 'stopAt', a.stopAt, 'مثلاً: سؤال ۶، معادلهٔ افقی نوشته شد')}
        ${textField('حرکت اول جلسهٔ بعد', 'nextFirst', a.nextFirst, 'مثلاً: سؤال ۵ صفحهٔ ۴۱، فقط نوشتن داده‌ها')}
        ${textField('اگر چه شد؟', 'nextWhen', a.nextWhen, 'مثلاً: ساعت ۱۸ شد / ظرف ناهار را شستم', 'الان که ذهنت هنوز وسط درس است، شروعِ فردا را بساز؛ روزهای خوب هم.')}
        <label class="check"><input type="checkbox" data-bind="landed" ${a.landed ? 'checked' : ''}>
          <span>کتاب روی همان صفحه باز مانده، خودکار کنارش است و بقیهٔ وسایل برگشته سر جایش.</span></label>
      </fieldset>`}
      ${!(R || C3) ? '' : `<p>فردا، قبل از هر مطالعهٔ تازه، همین جلسه را ده دقیقه از حافظه بازیابی کن. با بازکردن اپ یادآورش را می‌بینی.</p>
      <button class="btn big" data-act="ics" data-id="${s.id}">یادآور فردا را به تقویم اضافه کن</button>`}
      ${!R ? '' : `<button class="btn big" data-act="rest" data-id="${s.id}">استراحت با مرز و نوبت بعد</button>
      <button class="btn big" data-act="phone-window">پنجرهٔ گوشی، ده دقیقه</button>`}
      <button class="btn primary big" data-act="close">برگشت به امروز</button>`;
  }
  return '';
}

function viewRest() {
  const a = A();
  if (a.step === 'pick') {
    return `
      <header class="flow"><button class="back" data-act="rest-close">امروز کافی است</button><h1>استراحت با مرز</h1></header>
      <p>«کمی استراحت» مرز نیست. مدت، ساعت بازگشت و نقطهٔ شروع را ببند.</p>
      <div class="field"><span>مدت</span>${seg('minutes', [3, 5, 10, 15].map((n) => [n, fa(n)]), a.minutes, 'مدت استراحت')}
        <small>دقیقه؛ یعنی تا ${hhmm(Date.now() + a.minutes * 6e4)}.</small></div>
      ${textField('شروع از', 'next', a.next, 'مثلاً: علامت مرحلهٔ سوم راه‌حل را بررسی می‌کنم', '«ادامهٔ ریاضی» نقطهٔ بازگشت نیست.')}
      <button class="btn primary big" data-act="rest-run">شروع استراحت</button>
      <p class="fine">کاری که تمام‌کردنش آسان است: چند قدم راه، آب، نگاه به بیرون. گوشی و ویدئوی کوتاه از این جنس نیستند.</p>`;
  }
  const over = Date.now() >= a.endsAt;
  return `
    <header class="flow"><h1>استراحت</h1></header>
    <p class="goal-line">تا ${hhmm(a.endsAt)}؛ شروع از: ${esc(a.next)}</p>
    <div class="timer" data-timer="${a.endsAt}">${clock(a.endsAt - Date.now())}</div>
    <p class="timer-note">${over ? 'تمام شد. هر دقیقه‌ای که بگذرد، تأخیر بازگشت ثبت می‌شود.' : 'بدون صفحه‌نمایش.'}</p>
    <button class="btn primary big" data-act="rest-back">برگشتم؛ نوبت بعد</button>
    <button class="btn link" data-act="rest-close">امروز کافی است</button>`;
}

const cover = (inner) => `<div class="cover">${inner}</div>`;

const stopForm = (a) => `
  <header class="flow"><button class="back" data-act="stop-back">برگشت</button><h1>توقف آگاهانه</h1></header>
  <p>ورود انجام شد؛ این شکست نیست. فقط بنویس چرا می‌ایستی و از کجا برمی‌گردی.</p>
  <div class="field"><span>می‌ایستم چون…</span>
    ${Object.entries(STOPS).map(([k, v]) => choice('reason', k, v[0], a.reason, a.reason === k ? v[1] : '')).join('')}</div>
  ${a.reason === 'none' && (a.entryMore ?? a.more ?? 0) < 2 ? '<button class="btn big" data-act="stop-more">یک پنج‌دقیقهٔ دیگر</button>' : ''}
  ${textField('نقطهٔ ورود بعدی', 'nextFirst', a.nextFirst, 'مثلاً: مثال حل‌شدهٔ صفحهٔ ۴۰ را رونویسی می‌کنم')}
  ${textField('اگر چه شد؟', 'nextWhen', a.nextWhen, 'مثلاً: فردا ساعت ۱۷ شد')}
  <div class="grid2">
    ${numField('دقیقه تا خط اول', 'lag', a.lag, 'از نشانه تا اولین کار روی درس.')}
    <div class="field"><span>اولین کارم</span>${seg('firstKind', [['content', 'درس'], ['prep', 'آماده‌سازی']], a.firstKind, 'جنس شروع')}</div>
  </div>
  <button class="btn primary big" data-act="stop-save">ثبت توقف</button>`;

function viewQuick() {
  const a = A();
  if (a.step === 'stop') return stopForm(a);
  if (a.step === 'pick') {
    return `
      <header class="flow"><button class="back" data-act="cancel">انصراف</button><h1>شروع ۶۰ ثانیه‌ای</h1></header>
      <p>برای روزی که هیچ‌چیز آماده نیست. اولین کار عقب‌افتاده‌ای که منبعش دمِ دست است؛ سی ثانیه برای انتخاب، بدون بازبینی.</p>
      ${textField('الان کدام درس؟', 'subject', a.subject, 'مثلاً: آمار، تمرین‌های فصل ۲')}
      <div class="field"><span>حال الان</span>${seg('mood', Object.entries(MOODS), a.mood, 'حال قبل از شروع')}</div>
      <button class="btn primary big" data-act="quick-run">شروع ۶۰ ثانیه</button>
      <p class="fine">این فقط «صفر مطلق» را می‌شکند. روش اصلی همان حرکت اولِ ازپیش‌نوشته است.</p>`;
  }
  const over = Date.now() >= a.endsAt;
  return `
    <header class="flow"><h1>${esc(a.subject)}</h1></header>
    <p>عنوان بخش یا صورت سؤال را بخوان و یک جمله، یک داده، یک فرمول یا یک سؤال از آن بنویس.</p>
    <div class="timer" data-timer="${a.endsAt}">${clock(a.endsAt - Date.now())}</div>
    <textarea rows="3" data-bind="line" placeholder="همان یک خط…" aria-label="یک خط از درس">${esc(a.line || '')}</textarea>
    <p class="timer-note">${over ? 'تمام شد. حالا یکی را بزن.' : 'شروع زشت مجاز است.'}</p>
    <button class="btn primary big" data-act="quick-go">ادامه می‌دهم؛ جلسهٔ کامل</button>
    ${a.more < 2 ? '<button class="btn big" data-act="quick-more">یک پنج‌دقیقهٔ دیگر</button>' : ''}
    <button class="btn big" data-act="quick-stop">توقف آگاهانه</button>`;
}

function viewWeek() {
  const a = A(), prev = db.weeks[db.weeks.length - 1], w = weekSigns();
  const st = loopStats(loopDays(addDays(Date.now(), -6), 7));
  const timer = `<div class="timer small" data-timer="${a.capAt}">${clock(a.capAt - Date.now())}</div>`;
  if (a.step === 'review') {
    return `
      <header class="flow"><button class="back" data-act="cancel">انصراف</button>${timer}<h1>اول بررسی، بعد برنامه</h1></header>
      <p>فقط داده جمع کن. اینجا جای محاکمه نیست؛ هفتهٔ بد بیشترین داده را دارد.</p>
      ${facts([
        ['کارت روزانه', `${fa(st.cards)} روز از ۷`],
        ['کامل، ناقص، نشد', `${fa(st.full)}، ${fa(st.part)}، ${fa(st.none)}`],
        ['کارتِ بدون ثبت شبانه', fa(st.cards - st.logged)],
        ['جلسهٔ واقعی', fa(w.done)],
        ['زمان واقعی در برابر تخمین', st.ratio != null ? `${fa1(st.ratio)} برابر` : ''],
        ['مانع پرتکرار', esc(st.block)],
        ...(prev ? prev.outs.map((o, i) => [`خروجی: ${esc(o.t)}`, `${fa(db.tplans.filter((p) => p.week === prev.id && +p.out === i && p.out !== '' && p.done && p.done !== 'no').length)} روز`]) : []),
        ...(has(prev?.fix) ? [['اصلاح هفتهٔ قبل', esc(prev.fix)]] : []),
      ])}
      ${textField('دلیل اصلی کارهای انجام‌نشده، یک کلمه', 'cause', a.cause, 'خواب، حجم زیاد، سخت بود، گوشی')}
      ${has(prev?.fix) ? `<div class="field"><span>اصلاح هفتهٔ قبل کمک کرد؟</span>${seg('fixWorked', [['yes', 'بله'], ['no', 'نه'], ['dk', 'معلوم نیست']], a.fixWorked, 'اثر اصلاح قبلی')}</div>` : ''}
      <button class="btn primary big" data-act="week-plan">برو به برنامهٔ هفته</button>`;
  }
  const room = w.done ? Math.max(1, Math.floor((w.done * a.buffer) / 100)) : null, pool = a.mode === 'pool';
  const tip = st.none >= 3 ? 'حجم را کم کن: یک کار اصلی در روز، با زمانی که از ثبت آمده.'
    : st.ratio > 1.25 ? 'تخمین‌ها را در ضریب خطای خودت ضرب کن.'
    : st.cards - st.logged >= 3 ? 'ثبت شبانه را سبک کن: فقط علامت، بلافاصله بعد از بستن کتاب.'
    : st.part >= 3 ? 'کار دوم را از کارت روزانه بیرون ببر.' : '';
  return `
    <header class="flow"><button class="back" data-act="cancel">انصراف</button>${timer}<h1>برنامهٔ هفته، روی یک برگه</h1></header>
    <div class="field"><span>این هفته چطور است؟</span>
      ${seg('mode', [['week', 'هفتهٔ عادی'], ['pool', 'هفته‌پذیر نیست']], a.mode, 'نوع هفته')}
      <small>${pool ? 'مخزن اولویت: خروجی‌ها بدون روز. هر شب یکی را برمی‌داری و برایش نشانه و نقطهٔ شروع می‌نویسی.' : 'اول زندگی واقعی را ببین، بعد برای مطالعه جا پیدا کن.'}</small></div>
    ${textField('تعهدهای ثابت این هفته', 'fixed', a.fixed, 'کلاس، کار، رفت‌وآمد، قرار خانوادگی')}
    ${[1, 2, 3].map((i) => `
      <fieldset class="group"><legend>خروجی ${fa(i)}${i > 1 ? '، اختیاری' : ''}</legend>
        ${textField('نتیجهٔ مشخص، نه اسم درس', 'o' + i, a['o' + i], i === 1 ? 'مثلاً: آماده‌شدن برای آزمون فیزیک' : '')}
        ${textField('حداقل پیشرفت قابل قبول', 'm' + i, a['m' + i], i === 1 ? 'مثلاً: حل ۸ مسئلهٔ منتخب و ثبت دو خطای پرتکرار' : '')}
        ${pool ? '' : textField('روزهای اجرا', 'd' + i, a['d' + i], i === 1 ? 'مثلاً: شنبه و دوشنبه' : '')}
      </fieldset>`).join('')}
    <p class="fine">سه تا، نه بیشتر. بقیه در فهرست پشتیبان می‌ماند.</p>
    <div class="field"><span>چقدر از ظرفیت را پر می‌کنم؟</span>
      ${seg('buffer', [[70, '۷۰ درصد'], [50, '۵۰ درصد']], a.buffer, 'سهم پرشده از ظرفیت')}
      <small>بقیه جای کلاس اضافه، کارِ سخت‌تر از انتظار و زندگی معمولی است. اگر برنامه مرتب می‌ریزد، پنجاه.</small></div>
    ${numField('برای چند جلسه برنامه می‌ریزم؟', 'n', a.n, room ? `هفتهٔ قبل ${fa(w.done)} جلسهٔ واقعی داشتی؛ ${fa(a.buffer)} درصدش می‌شود ${fa(room)}.` : 'برای همان تعدادی که معمولاً واقعاً داری، نه تعدادی که روی کاغذ جا می‌شود.')}
    ${room && a.n > room ? `<p class="advice">این از ظرفیت واقعی‌ات بیشتر است. ${fa(room)} جلسه بچین؛ قبل از بیشترکردن ساعت، برنامه را واقعی‌تر کن.</p>` : ''}
    ${textField('کدام بخش هفته را عمداً خالی گذاشتم؟', 'free', a.free, 'مثلاً: پنجشنبه عصر')}
    ${textField('تنها اصلاح این هفته', 'fix', a.fix, 'مثلاً: یک بلوک را از عصر به صبح می‌برم', `دقیقاً یکی، از داده نه از عذاب وجدان. ${tip}`)}
    ${aiPart('week', 'پیشنهاد یک اصلاح از دادهٔ هفته')}
    <button class="btn primary big" data-act="week-save">قفل هفته</button>`;
}

function viewObstacle() {
  const a = A();
  if (a.step === 'pick') {
    return `
      <header class="flow"><button class="back" data-act="cancel">انصراف</button><h1>الان از کار فاصله گرفته‌ام</h1></header>
      <p>این سرزنش نیست؛ فقط می‌خواهیم مانع همین جلسه را پیدا کنیم.</p>
      ${textField('کاری که قرار بود انجام بدهم', 'task', a.task, 'مثلاً: تمرین‌های حلقهٔ for')}
      <div class="field"><span>کدام یکی الان پررنگ‌تر است؟ اگر دو تا درست است، آن که زودتر آمد.</span>
        ${Object.entries(OBSTACLES).map(([k, o]) => choice('obstacle', k, o.label, a.obstacle, o.ask)).join('')}</div>
      ${textField('درست قبل از فرار چه حس یا فکری داشتم؟', 'feeling', a.feeling, 'اختیاری')}
      <button class="btn primary big" data-act="to-entry">ساختن گام ورودی</button>`;
  }

  if (a.step === 'entry') {
    const o = OBSTACLES[a.obstacle];
    return `
      <header class="flow"><button class="back" data-act="back-pick">تغییر مانع</button><h1>گام ورودی</h1></header>
      <p class="goal-line">${o.label}</p>
      <label class="field"><span>${o.rest ? 'برنامهٔ استراحت' : 'دقیقاً چه می‌کنم؟ کوچک، روشن و مربوط به همان درس'}</span>
        <textarea rows="3" data-bind="stepText">${esc(a.stepText || '')}</textarea></label>
      ${o.rest ? '' : textField('تا پایان این بازه، خروجی من این است…', 'output', a.output, 'مثلاً: یک تعریف با کلمات خودم', '«تمرکز عالی» خروجی نیست؛ چیزی بنویس که بتوانی ببینی انجام شده.')}
      ${o.rest ? '' : aiPart('step', 'گام را هوشواره برای همین کار بنویسد')}
      <div class="field"><span>مدت بازه</span>${minutesPicker('minutes', o.rest ? [10, 15] : [2, 5, 10, 15], a.minutes)}</div>
      <button class="btn primary big" data-act="start-run">${o.rest ? 'شروع استراحت' : 'شروع بازه'}</button>`;
  }

  if (a.step === 'run') {
    const over = Date.now() >= a.endsAt;
    const o = OBSTACLES[a.obstacle];
    return `
      <header class="flow"><h1>${o.rest ? 'استراحت' : 'فقط همین گام'}</h1></header>
      <p class="goal-line">${esc(a.stepText)}</p>
      ${a.output ? `<p class="count">خروجی: ${esc(a.output)}</p>` : ''}
      <div class="timer" data-timer="${a.endsAt}">${clock(a.endsAt - Date.now())}</div>
      <p class="timer-note">${over ? 'بازه تمام شد.' : o.rest ? 'شبکهٔ اجتماعی استراحت نیست.' : 'بعد از این بازه تصمیم می‌گیری ادامه بدهی یا نه.'}</p>
      <button class="btn primary big" data-act="to-decide">${over ? 'تصمیم بعد از بازه' : 'زودتر تمام شد'}</button>
      ${o.rest ? '' : urgeBox(a)}`;
  }

  if (a.step === 'decide') {
    const o = OBSTACLES[a.obstacle];
    return `
      <header class="flow"><h1>تصمیم بعد از بازه</h1></header>
      ${urgeLog(a.urges)}
      <div class="field"><span>${o.rest ? 'استراحت واقعی بود؟' : 'گام ورودی انجام شد؟'}</span>
        ${choice('done', 'yes', 'بله', a.done)}${choice('done', 'no', 'نه', a.done)}</div>
      <div class="field"><span>مانع اصلی همان بود؟</span>
        ${choice('same', 'yes', 'همان بود', a.same)}${choice('same', 'no', 'چیز دیگری آشکار شد', a.same)}</div>
      <div class="field"><span>حالا چه می‌کنم؟</span>
        ${choice('next', 'continue', 'ادامه می‌دهم', a.next, 'کار روشن‌تر شده و هنوز ظرفیت دارم.')}
        ${choice('next', 'shrink', 'گام را کوچک‌تر می‌کنم', a.next, 'تا حد بازکردن فایل یا خواندن صورت مسئله.')}
        ${choice('next', 'switch', 'مانع را دوباره تشخیص می‌دهم', a.next, 'اگر گام کوچک جواب نداد، تشخیص را عوض کن، نه خودت را.')}</div>
      <button class="btn primary big" data-act="finish-obstacle">ثبت و ادامه</button>`;
  }
  return '';
}

function viewRetrieval() {
  const a = A();
  const s = db.sessions.find((x) => x.id === a.sessionId);
  if (a.step === 'write') {
    return cover(`
      <div class="timer small" data-timer="${a.endsAt}">${clock(a.endsAt - Date.now())}</div>
      <h1>بازیابی ${esc(s.subject)}</h1>
      <p class="goal-line">${esc(s.goal)}</p>
      <p>بدون بازکردن منبع یا یادداشت‌ها، هرچه از آن جلسه مانده بنویس. مکث و کندی طبیعی است.</p>
      <textarea class="sheet" rows="10" data-bind="text" placeholder="از حافظه…" autofocus>${esc(a.text || '')}</textarea>
      <button class="btn primary big" data-act="retr-compare">نوشتم؛ مقایسه کن</button>
      <button class="btn link" data-act="cancel">بعداً</button>`);
  }
  return `
    <header class="flow"><h1>چه چیزی ماند؟</h1></header>
    <div class="pair">
      <div><span>همان روز نوشته بودی</span><p>${esc(s.recall) || 'چیزی ثبت نشده بود.'}</p></div>
      <div><span>امروز از حافظه</span><p>${esc(a.text) || 'چیزی ننوشتی.'}</p></div>
    </div>
    ${aiPart('retr', 'هوشواره بگوید چه چیزی افتاده')}
    <div class="field"><span>نسبت به همان روز</span>
      ${choice('rate', 'kept', 'تقریباً همه‌اش مانده', a.rate)}
      ${choice('rate', 'some', 'بخشی از آن مانده', a.rate)}
      ${choice('rate', 'lost', 'تقریباً چیزی نمانده', a.rate, 'این شکست نیست؛ فراموشی بدون مرور طبیعی است. حالا منبع را باز کن و فقط جاهای خالی را پر کن.')}</div>
    <button class="btn primary big" data-act="retr-finish">ثبت بازیابی</button>`;
}

function viewDay() {
  const a = A();
  return `
    <header class="flow"><button class="back" data-act="cancel">انصراف</button><h1>خواب و انرژی امروز</h1></header>
    <p>هرچه را تا این ساعت می‌دانی پر کن؛ بقیه را بعداً کامل می‌کنی.</p>
    <div class="grid2">
      <label class="field"><span>دیشب خوابیدم</span><input type="time" data-bind="bed" value="${esc(a.bed || '')}"></label>
      <label class="field"><span>امروز بیدار شدم</span><input type="time" data-bind="wake" value="${esc(a.wake || '')}"></label>
    </div>
    <div class="field"><span>کیفیت خواب، با حسِ لحظهٔ بیداری</span>${fivePicker('quality', a.quality, 'کیفیت خواب از پنج')}
      <small>۱ یعنی له و خسته، ۵ یعنی سرحال.</small></div>
    ${SLOTS.map((s, i) => `<div class="field"><span>انرژی ${s}</span>${fivePicker('e' + (i + 1), a['e' + (i + 1)], 'انرژی ' + s + ' از پنج')}</div>`).join('')}
    <button class="btn primary big" data-act="day-save">ثبت</button>`;
}

function viewManual() {
  const a = A();
  return `
    <header class="flow"><button class="back" data-act="cancel">انصراف</button><h1>ثبت جلسه‌ای که گذشت</h1></header>
    <p>تا چند دقیقه بعد از جلسه بنویس، نه آخر شب از روی حافظه.</p>
    ${textField('چه خواندم؟', 'subject', a.subject, 'مثلاً: زیست، فصل دو')}
    <div class="grid2">
      ${numField('دقیقهٔ حضور', 'presence', a.presence, 'از نشستن تا بلندشدن.')}
      ${numField('دقیقهٔ واقعی', 'real', a.real, 'ذهن واقعاً درگیر مطلب.')}
      ${numField('بلندترین تمرکز', 'longest', a.longest, 'تا اولین وقفهٔ جدی.')}
      ${numField('تعداد وقفه', 'breaks', a.breaks)}
    </div>
    <div class="field"><span>علت غالب وقفه‌ها</span>
      ${pick('data-bind', 'cause', Object.entries(CAUSES).map(([k, c]) => [k, c.label]), a.cause, 'علت وقفه', 'علت')}</div>
    ${textField('یک نشانهٔ یادگیری', 'sign', a.sign, 'مثلاً: سه مسئله را حل کردم', '«فیزیک خواندم» نشانه نیست. اگر چیزی نداری خالی بگذار.')}
    <button class="btn primary big" data-act="manual-save">ثبت</button>`;
}

function viewPattern() {
  const a = A();
  const attempt = (n, label) => `
    <fieldset class="group"><legend>${label}</legend>
      ${textField('با چه شرایطی شروع شد؟', 'h' + n, a['h' + n], 'با انگیزه؟ با فشار امتحان؟')}
      ${textField('چقدر طول کشید تا رها شد؟', 'l' + n, a['l' + n], 'مثلاً: چهار روز')}
      ${textField('درست قبل از رهاکردن چه شد؟', 'b' + n, a['b' + n], 'مثلاً: یک روز عقب افتادم')}
    </fieldset>`;
  return `
    <header class="flow"><button class="back" data-act="cancel">انصراف</button><h1>الگوی شکست‌های قبلی</h1></header>
    <p>دنبال تکرار بگرد، نه جزئیات هر بار. دو تلاش جدی کافی است.</p>
    ${attempt(1, 'تلاش اول')}${attempt(2, 'تلاش دوم')}${attempt(3, 'تلاش سوم، اختیاری')}
    <label class="field"><span>الگوی غالب در یک جمله</span>
      <textarea rows="3" data-bind="sentence" placeholder="معمولاً وقتی … اتفاق می‌افتد، … می‌کنم و روند متوقف می‌شود.">${esc(a.sentence || '')}</textarea>
      <small>الگوهای رایج: شروع پرفشار و بعد فروپاشی؛ یک روز بد که چند روز شد؛ عقب‌افتادن از برنامه و رهاکردن کامل.</small></label>
    ${textField('اگر ماه آینده فقط یک چیز بهتر شود', 'one', a.one, 'همان که هم شروع را ممکن می‌کند هم ادامه را')}
    <button class="btn primary big" data-act="pattern-save">ثبت الگو</button>`;
}

function viewMyth() {
  const a = A();
  if (a.step === 'pick') {
    return `
      <header class="flow"><button class="back" data-act="cancel">انصراف</button><h1>قانون امروز</h1></header>
      <p>هر روز فقط یک افسانه. همه را با هم عوض نکن.</p>
      ${textField('اگر امروز مطالعه‌ام خوب پیش نرود، به خودم می‌گویم…', 'hidden', a.hidden, 'جملهٔ واقعی‌ای که در سرت تکرار می‌شود')}
      <div class="field"><span>این جمله به کدام باور نزدیک‌تر است؟</span>
        ${Object.entries(MYTHS).map(([k, m]) => choice('myth', k, m.label, a.myth, m.wrong)).join('')}</div>
      <div class="field"><span>قانون جایگزین، با جملهٔ خودت</span>
        <div class="ifthen">
          <label><i>اگر</i><input type="text" data-bind="ifText" value="${esc(a.ifText || '')}"></label>
          <label><i>آنگاه</i><input type="text" data-bind="thenText" value="${esc(a.thenText || '')}"></label>
        </div>
        <small>رفتار بنویس، نه شعار. «باید منظم باشم» اجراشدنی نیست.</small></div>
      ${textField('کار مشخص امروز', 'task', a.task, 'مثلاً: سه مسئلهٔ صفحهٔ ۴۱', 'جلسهٔ آزمایشی امروز روی همین کار است.')}
      ${textField('قانون قدیمی پیش‌بینی می‌کند که…', 'predict', a.predict, 'مثلاً: بدون حال خوب هیچ‌چیز یاد نمی‌گیرم')}
      <button class="btn primary big" data-act="myth-save">این قانونِ امروز من است</button>`;
  }
  const m = db.myths.find((x) => x.id === a.entryId);
  return `
    <header class="flow"><h1>قانون در برابر داده</h1></header>
    <p class="goal-line">${ruleLine(m)}</p>
    <div class="field"><span>قانون را اجرا کردم؟</span>
      ${choice('did', 'yes', 'بله', a.did)}${choice('did', 'no', 'نه', a.did, 'یک روز بدون اجرا داده است، نه جرم.')}</div>
    ${textField('خروجی قابل دیدن', 'output', a.output, 'مثلاً: سه مسئله حل شد')}
    ${textField('بدون نگاه به کتاب چه چیزی توانستم بگویم یا حل کنم؟', 'can', a.can, 'مثلاً: تعریف مشتق را از حفظ نوشتم', 'ساعت را بعد از این بنویس، نه به‌جای این.')}
    <div class="pair">
      <div><span>قانون قدیمی پیش‌بینی کرده بود</span><p>${esc(m.predict) || 'چیزی ننوشته بودی.'}</p></div>
    </div>
    ${textField('واقعاً چه شد؟', 'happened', a.happened, 'مثلاً: بعد از پنج دقیقه ادامه دادم')}
    <button class="btn primary big" data-act="myth-done">ثبت</button>
    <button class="btn link" data-act="myth-later">بعداً</button>`;
}

function viewTrends() {
  const all = db.sessions;
  const w = weekSigns(), week = w.week;
  const matched = all.filter(feelMatches).length;
  const gaps = tally(all, (s) => (s.gap === 'none' ? null : s.gap));
  const obs = tally(db.obstacles, (o) => o.obstacle);
  const causes = tally(causesOf(all, db.logs), (c) => c);
  // هم حسِ نوشته‌شده موقع انتخاب مانع، هم یادداشت‌های لحظهٔ فرار؛ تازه‌ترها اول
  const triggers = [...all.flatMap((s) => s.urges.map((u) => [u.at, u.before])), ...db.obstacles.flatMap((o) => [[o.date, o.feeling], ...o.urges.map((u) => [u.at, u.before])])]
    .filter(([, t]) => has(t)).sort((x, y) => y[0] - x[0]).slice(0, 6).map(([, t]) => t);
  const doneSteps = [...new Set(db.obstacles.filter((o) => o.done === 'yes' && OBSTACLES[o.obstacle] && !OBSTACLES[o.obstacle].rest).reverse().map((o) => o.step))].slice(0, 3);
  const fears = db.obstacles.filter((o) => o.obstacle === 'fear').length;
  const retrieved = all.filter((s) => s.retrieved);
  const chunks = all.reduce((n, s) => n + s.chunks.length, 0);
  const stepsDone = db.obstacles.filter((o) => o.done === 'yes').length;
  const tiredLately = db.obstacles.filter((o) => o.obstacle === 'tired' && o.date >= Date.now() - 14 * DAY).length;
  const b = db.baseline;
  const setWeek = week.filter((s) => s.phonePlace), lagWeek = avg(setWeek.filter((s) => s.lag != null), (s) => s.lag);
  const ten = db.tplans.filter((p) => p.ts >= addDays(Date.now(), -9) && p.day <= today());
  const R = chOn(0), C2 = chOn(2);
  // ستون چهارم: فصلِ هر نشانه؛ بدون آن یعنی «بقیه»
  const goals = [
    ['سه جلسه با هدف خروجی و آزمون کتاب‌بسته', all.length, 3, 1],
    ['سه جلسه که معیارش واقعاً اجرا شد', all.filter((s) => s.ran === 'yes').length, 3, 6],
    ['چهار پایانِ آگاهانه: «حالا می‌توانم…»', all.filter((s) => has(s.can)).length, 4, 6],
    ['سه بار «بخوان، ببند، بنویس» وسط جلسه', chunks, 3, 3],
    ['سه لحظهٔ مقاومت با مانع مشخص، نه «تنبلی»', db.obstacles.length, 3, 2],
    ['دو گام ورودی که واقعاً انجام شد', stepsDone, 2, 2],
    ['دو بازیابی روز بعد', retrieved.length, 2, 3],
    ['یک مبحث در دو روز جدا، نه یک نشست فشرده', spreadSubjects(0), 1, 4],
    ['پروفایل نقطهٔ شروع از سه روز ثبت واقعی', b && !baseRunning(b) && baselineProfile(b).records ? 1 : 0, 1, 5],
    ['هفت روز «افسانه یا داده؟»', mythDays(), 7, 4],
    ['آزمایش دوباره‌خوانی در برابر بازیابی', db.experiment?.later ? 1 : 0, 1, 3],
    ['شش عامل محیط، ممیزی و اصلاح شد', db.env ? 6 - auditLeft(db.env) : 0, 6],
    ['پنج پایانِ جلسه با نقطهٔ فرودِ آماده', all.filter((s) => s.landed).length, 5],
    ['هفت روز ثبت محیط دیجیتال', db.digital ? digDays(db.digital).filter((d) => d.n).length : 0, 7],
    ['ده روز اخیر: کار اول در پنجرهٔ خودش', ten.filter((p) => p.done === 'peak' || p.done === 'alt').length, 7],
    ['چهارده روز اخیر: کارت روزانه با ثبت شبانه', db.tplans.filter((p) => p.reviewed && p.ts >= addDays(Date.now(), -13)).length, 10],
    ['دو جلسهٔ هفتگی با یک اصلاح', db.weeks.filter((x) => has(x.fix)).length, 2],
    ['سه جلسه با نقشهٔ توجه و مسئلهٔ نام‌دار', all.filter((s) => s.ping && s.issue).length, 3],
    ['هفت روز اخیر: ورود واقعی روی درس', entryDays(addDays(Date.now(), -6)), 5],
    ['پنج پایانِ جلسه با «اگر، آنگاهِ» جلسهٔ بعد', all.filter((s) => has(s.nextFirst)).length, 5],
    ['چهار بلوک اخیر با رمپ: ورود موفق', all.filter((s) => s.ramp).slice(-4).filter((s) => rampOk(s, db.ramp?.base)).length, 3],
    ['سه جلسهٔ اخیر با برگهٔ پارک: خروجی حفظ شد', all.filter((s) => s.sheet).slice(-3).filter((s) => has(s.can)).length, 3],
    ['شش جلسهٔ اخیر با قالب: بسته‌شدن در مرز', all.filter((s) => s.fmt).slice(-6).filter(inBounds).length, 4],
  ].filter((g) => chOn(g[3] ?? 0));

  if (!all.length && !(C2 && db.obstacles.length) && !((R || chOn(5)) && db.logs.length)) {
    return `<header class="top"><h1>روند</h1></header>
      <p class="empty">اینجا خروجی جلسه‌ها را می‌بینی، نه ساعت نشستن پای درس. بعد از اولین جلسه پر می‌شود.</p>
      <button class="btn primary big" data-act="new-session">شروع جلسهٔ مطالعه</button>`;
  }

  return `
    <header class="top"><h1>روند</h1></header>

    <section>
      <h2>هفت روز گذشته</h2>
      <div class="verdict${R || chOn(3) ? ' three' : ''}">
        <div><span>جلسهٔ سنجیده</span><b>${fa(week.length)}</b></div>
        <div><span>به هدف رسید</span><b>${fa(week.filter((s) => s.outcome === 'full').length)}</b></div>
        ${R || chOn(3) ? `<div><span>بازیابی روز بعد</span><b>${fa(week.filter((s) => s.retrieved).length)}</b></div>` : ''}
      </div>
      ${(R || chOn(6)) && week.length >= 5 && week.filter((s) => s.outcome === 'full').length * 5 < week.length * 2 ? '<p class="advice">هدف می‌نویسی ولی کمتر به معیار می‌رسی. مسئله هدف‌گذاری نیست، روش است: وسط جلسه بیشتر ببند و بنویس و خروجی را کوچک‌تر بگیر.</p>' : ''}
      ${(R || chOn(6)) && week.length ? `<p class="count">جلسهٔ مبهم، بدون «حالا می‌توانم…»: ${fa(week.filter((s) => !has(s.can)).length)} (هفتهٔ قبل ${fa(all.filter((s) => s.date < Date.now() - 7 * DAY && s.date >= Date.now() - 14 * DAY && !has(s.can)).length)}).</p>` : ''}
    </section>

    ${!R ? '' : `<section>
      <h2>بلوک‌ها و دقیقه‌ها</h2>
      <div class="verdict three">
        <div><span>بلوک تمام‌شده، هفتهٔ قبل ${fa(w.donePrev)}</span><b>${fa(w.done)}</b></div>
        <div><span>بلوک رهاشده، هفتهٔ قبل ${fa(w.droppedPrev)}</span><b>${fa(w.dropped)}</b></div>
        <div><span>دقیقهٔ واقعی از ${fa(sum(week, (s) => s.studied))} حضور</span><b>${fa(sum(week, realOf))}</b></div>
      </div>
      <p class="fine">دقیقه ورودی است، نه نمره. اول به ردیف بالا نگاه کن.</p>
      ${w.dropped > w.done ? '<p class="advice">بیشتر از آن‌که تمام کنی، رها کرده‌ای. بلوک را کوتاه‌تر بچین؛ ده دقیقهٔ تمام‌شده از چهل‌وپنج دقیقهٔ رهاشده جلوتر است.</p>' : ''}
    </section>

    ${aiCfg.key ? `<section><h2>نگاه هوشواره به این هفته</h2>
      ${aiPart('trend', 'تحلیل هفته')}
      <p class="fine">فقط عددهای همین صفحه فرستاده می‌شود، نه نوشته‌هایت. تا عددها عوض نشود، درخواست تازه‌ای نمی‌رود.</p></section>` : ''}

    ${setWeek.length ? `
    <section>
      <h2>محیط و شروع</h2>
      <div class="verdict three">
        <div><span>دقیقه تا خط اول</span><b>${lagWeek != null ? fa1(lagWeek) : '·'}</b></div>
        <div><span>دقیقه تا اولین قطع</span><b>${fa(Math.round(avg(setWeek, firstBreakOf)))}</b></div>
        <div><span>جای ثابت، از ${fa(setWeek.length)} جلسه</span><b>${fa(setWeek.filter((s) => s.place === 'fixed').length)}</b></div>
      </div>
      <p class="fine">ساعتِ پای میز این‌ها را نشان نمی‌دهد: شروع چقدر طول کشید و جلسه چقدر دوام آورد.</p>
      ${lagWeek > 3 ? '<p class="advice">شروع هنوز پرهزینه است. آخر هر جلسه نقطهٔ فرود را بچین: کتاب باز، خودکار کنارش، یک خط برای اولین کار.</p>' : ''}
    </section>` : ''}`}

    ${all.length ? `
    <section>
      <h2>حس تو در برابر آزمون</h2>
      <p>در ${fa(matched)} جلسه از ${fa(all.length)}، حدس قبل از آزمون با نتیجه یکی بود.
      ${all.length >= 3 && matched * 2 < all.length ? 'حس هنگام خواندن فعلاً راهنمای قابل‌اعتمادی نیست؛ به آزمون تکیه کن.' : ''}</p>
    </section>` : ''}

    ${gaps.length ? `<section><h2>شکاف‌های پرتکرار</h2>${bars(gaps, GAPS)}<p class="advice">${GAPS[gaps[0][0]].advice}</p></section>` : ''}

    ${(R || chOn(5)) && causes.length ? `<section><h2>علت وقفه‌ها</h2>${bars(causes, CAUSES)}<p class="advice">${CAUSES[causes[0][0]].advice}</p></section>` : ''}

    ${!C2 ? '' : `

    ${obs.length ? `<section><h2>مانع‌های پرتکرار</h2>${bars(obs, OBSTACLES)}
      ${tiredLately >= 4 ? '<p class="advice">در دو هفتهٔ اخیر بارها «خستگی» را انتخاب کرده‌ای. قبل از بیشترکردن فشار، خواب و حجم برنامه را بررسی کن. اگر این وضعیت در بیشتر کارهای زندگی‌ات هم هست و ادامه دارد، صحبت با پزشک یا مشاور قدم مسئولانه‌تری است.</p>' : ''}
      ${fears >= 3 ? '<p class="advice">چند بار «ترس از اشتباه» را انتخاب کرده‌ای. پس مسئله فقط شروع‌کردن نیست؛ فصل‌های کمال‌گرایی و ترس از شکست را زودتر بخوان.</p>' : ''}</section>` : ''}

    ${triggers.length ? `<section><h2>درست قبل از فرار</h2>
      <ul class="plain">${triggers.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></section>` : ''}

    ${doneSteps.length ? `<section><h2>گام‌هایی که واقعاً برداشتی</h2>
      <ul class="plain">${doneSteps.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
      <p class="fine">دفعهٔ بعد که شروع سخت شد، از یکی از همین‌ها شروع کن.</p></section>` : ''}`}

    ${fold('t-goals', 'نشانه‌های جاافتادن', goalList(goals), false, `${fa(goals.filter(([, n, need]) => n >= need).length)} از ${fa(goals.length)}`)}

    ${all.length ? fold('t-all', 'همهٔ جلسه‌ها', `<ul class="log">${[...all].reverse().slice(0, 30).map(sessionRow).join('')}</ul>`, false, fa(all.length)) : ''}`;
}

/* ---------- آزمایش‌ها ---------- */

const labBack = '<button class="back" data-act="lab-view" data-view="hub">همهٔ آزمایش‌ها</button>';

function viewLab() {
  const sub = { reread: viewReread, baseline: viewBaseline, myths: viewMyths, env: viewEnv, digital: viewDigital, time: viewTime, loop: viewLoop, attn: viewAttn, start: viewStart, ramp: viewRamp, keep: viewKeep, fmt: viewFmt }[db.lab];
  if (sub && labOn(db.lab)) return sub();
  db.lab = 'hub';
  const b = db.baseline, e = db.experiment, en = db.env, dg = db.digital;
  const sl = db.startLab, at = db.attn, atN = at ? db.sessions.filter((s) => s.ping && s.date >= at.start).length : 0;
  const tp = planFor(tomorrowKey()) || planFor(today());
  const card = (view, title, text, status) => !labOn(view) ? [false, ''] : [status !== 'شروع نشده', `
    <li><button class="lab-row" data-act="lab-view" data-view="${view}">
      <b>${title}</b>${status !== 'شروع نشده' ? `<span class="tag">${status}</span>` : ''}
      <small>${text}</small>
    </button></li>`];
  const cards = [
    card('baseline', 'سه روز ثبت واقعی', 'قبل از هر برنامه‌ای، ببین الان دقیقاً کجا ایستاده‌ای.',
      !b ? 'شروع نشده' : baseRunning(b) ? `روز ${fa(baseDayNo(b))} از ${fa(b.days)}` : 'پروفایل آماده است'),
    card('env', 'بازطراحی محیط مطالعه', 'یک‌بار میز، نور، صدا و جای گوشی را بچین و اثرش را با عدد ببین.',
      !en ? 'شروع نشده' : auditLeft(en) ? `${fa(auditLeft(en))} عامل مانده` : 'ممیزی کامل شد'),
    card('digital', 'هفت روز محیط دیجیتال', 'اعلان، دسترسی و حالت مطالعه را یک‌بار بچین؛ بعد فقط اجرا و ثبت.',
      !dg ? 'شروع نشده' : dg.wrap ? 'هفته جمع‌بندی شد' : `روز ${fa(Math.min(7, baseDayNo(dg)))} از ۷`),
    card('time', 'معماری زمان', 'کار سنگین در ساعت اوج، با برآورد واقعی و یک نسخهٔ کوچکِ جایگزین.',
      tp ? `کار اولِ ${dayWord(tp)} قفل شده` : db.tplans.length ? 'کار اول فردا نوشته نشده' : 'شروع نشده'),
    card('loop', 'حلقهٔ سبک برنامه', 'کارت پنج‌دقیقه‌ای، ثبت نودثانیه‌ای و هفته‌ای یک اصلاح؛ چهارده روز.',
      !db.loop ? 'شروع نشده' : !weekNow() ? 'جلسهٔ هفتگی مانده' : `روز ${fa(Math.min(14, baseDayNo(db.loop)))} از ۱۴`),
    card('start', 'ورود کوچک', 'فاصلهٔ «الان شروع می‌کنم» تا اولین کار واقعی را هفت روز اندازه بگیر و کوتاه کن.',
      !sl ? 'شروع نشده' : baseDayNo(sl) > 7 ? 'تحلیل روز هفتم' : `روز ${fa(baseDayNo(sl))} از ۷`),
    card('attn', 'نقشهٔ توجه', 'سه جلسه فقط ببین و نام بگذار: تمرکز کاری، شبه‌تمرکز یا حواس‌پرتی.',
      !at ? 'شروع نشده' : atN >= 3 ? 'خط پایه آماده است' : `${fa(atN)} جلسه از ۳`),
    card('ramp', 'رمپ ورود', 'نشسته‌ای ولی وارد نشده‌ای؟ چهار بلوک: پارک، بارگذاری، قفل و بررسی میانی.',
      !db.ramp ? 'شروع نشده' : rampList().length >= 4 ? 'تحلیل چهار بلوک' : `${fa(rampList().length)} بلوک از ۴`),
    card('keep', 'لنگر، پارک، بازگشت', 'سه جلسه: پرش را زود ببین و ارزان برگرد؛ هدف صفرِ حواس‌پرتی نیست.',
      !db.keep ? 'شروع نشده' : keepList().length >= 3 ? 'جمع‌بندی سه جلسه' : `${fa(keepList().length)} جلسه از ۳`),
    card('fmt', 'قالب جلسه', 'کوتاه، پومودورو، بلوک عمیق یا انعطاف‌پذیر؟ برای هر نوع کار، پیش‌فرض خودت را پیدا کن.',
      !db.fmtLab ? 'شروع نشده' : fmtList().length >= 3 ? 'قاعدهٔ تصمیم آماده است' : `${fa(fmtList().length)} جلسه از ۳`),
    card('myths', 'هفت روز «افسانه یا داده؟»', 'هر روز یک باور قدیمی را با یک قانون «اگر، آنگاه» محک بزن.',
      db.mythWrap ? 'هفته جمع‌بندی شد' : db.myths.length ? `${fa(Math.min(7, mythDays()))} روز از ۷` : 'شروع نشده'),
    card('reread', 'دوباره‌خوانی در برابر بازیابی', 'دو متن، دو روش، یک روز فاصله.',
      !e ? 'شروع نشده' : e.later ? 'نتیجه آماده است' : 'منتظر نوبت دوم'),
  ];
  const on = cards.filter(([started]) => started).map(([, html]) => html), off = cards.filter(([started, html]) => !started && html).map(([, html]) => html);
  return `
    <header class="top"><h1>آزمایش روی خودت</h1>
      <p>هر آزمایش یک تمرین چندروزه است. هم‌زمان یکی کافی است.</p></header>
    ${on.length ? `<section><h2>شروع‌کرده‌ای</h2><ul class="lab-list">${on.join('')}</ul></section>` : ''}
    ${off.length ? `<section><h2>${on.length ? 'بقیهٔ آزمایش‌ها' : 'یکی را انتخاب کن'}</h2><ul class="lab-list">${off.join('')}</ul></section>` : ''}`;
}


function viewBaseline() {
  const b = db.baseline;
  const head = `<header class="top">${labBack}<h1>سه روز ثبت واقعی</h1>
    <p>برنامه روی عدد واقعی ساخته می‌شود، نه روی تصویری که از خودت داری.</p></header>`;
  const pt = db.pattern;
  const pattern = `
    <section>
      <h2>الگوی شکست‌های قبلی</h2>
      ${pt?.sentence ? `<p class="goal-line">${esc(pt.sentence)}</p>` : '<p class="empty">دو یا سه تلاش قبلی را کنار هم بگذار تا ببینی کجا شبیه هم تمام شده‌اند.</p>'}
      <button class="btn big" data-act="new-pattern">${pt ? 'ویرایش الگو' : 'تحلیل تلاش‌های قبلی'}</button>
    </section>`;

  if (!b) {
    return `${head}
      <ol class="steps">
        <li>سه روز پشت‌سرهم و معمولی؛ نه روز امتحان، نه تعطیلی کامل.</li>
        <li>هر جلسه را با همین اپ بگیر یا بلافاصله بعدش دستی ثبت کن.</li>
        <li>هر صبح خواب دیشب و در طول روز انرژی‌ات را بزن.</li>
        <li>چیزی را بهتر نکن. اگر هم‌زمان اندازه بگیری و اصلاح کنی، نقطهٔ شروع گم می‌شود.</li>
      </ol>
      <button class="btn primary big" data-act="base-start">از امروز شروع کن</button>
      ${pattern}`;
  }

  const p = baselineProfile(b), running = baseRunning(b);
  const table = `
    <table class="result calm">
      <thead><tr><th>روز</th><th>حضور</th><th>واقعی</th><th>تمرکز</th><th>وقفه</th><th>خواب</th></tr></thead>
      <tbody>${p.days.map((d) => `<tr><th>${weekdayFa(d.ts)}</th>
        <td>${d.n ? fa(d.presence) : '·'}</td><td>${d.n ? fa(d.real) : '·'}</td><td>${d.longest ? fa(d.longest) : '·'}</td>
        <td>${d.n ? fa(d.causes.length) : '·'}</td><td>${d.day?.quality ? fa(d.day.quality) + ' از ۵' : '·'}</td></tr>`).join('')}</tbody>
    </table>
    <p class="fine">عددها به دقیقه‌اند. حضور یعنی پای میز بودن؛ واقعی یعنی ذهنِ درگیر.</p>`;
  const signs = p.days.some((d) => d.signs.length) ? `<p class="fine">نشانه‌های یادگیری این روزها:</p>
    <ul class="plain">${p.days.flatMap((d) => d.signs.map((x) => `<li>${weekdayFa(d.ts)}: ${esc(x)}</li>`)).join('')}</ul>` : '';

  if (running) {
    return `${head}
      <section>
        <h2>روز ${fa(baseDayNo(b))} از ${fa(b.days)}</h2>
        ${table}
        <p>امروز را مثل همیشه بگذران. این روزها اندازه‌گیری‌اند، نه مسابقه.</p>
        <button class="btn primary big" data-act="new-session">شروع جلسه با تایمر</button>
        <button class="btn big" data-act="new-manual">ثبت دستی جلسه‌ای که گذشت</button>
        <button class="btn big" data-act="new-day">خواب و انرژی امروز</button>
        ${signs}
        ${fold('base-small', 'ثبت سنگین است؟', `
          <p>رهایش نکن، کوچکش کن: بعد از هر جلسه فقط ثبت دستی را با حضور، دقیقهٔ واقعی و تعداد وقفه پر کن.</p>
          <p>اگر این هم سنگین است، هر شب فقط یک عدد:</p>
          <label class="field"><span>بلندترین تکهٔ مطالعهٔ واقعیِ امروز، به دقیقه</span>
            <input type="number" inputmode="numeric" min="0" data-lab="oneNum" data-num value="${db.labDraft?.oneNum ?? ''}"></label>
          <button class="btn" data-act="base-one">ثبت همین یک عدد</button>
          <p class="fine">اگر این هم نشد، گره در شروع‌کردن است، نه در اندازه‌گیری (فصل ۱۲).</p>`)}
      </section>
      ${pattern}
      <button class="btn link" data-act="base-reset">ثبت را از نو شروع کن</button>`;
  }

  b.seen = true;
  if (!p.records) {
    return `${head}
      <section>
        <h2>${fa(b.days)} روز گذشت و جلسه‌ای ثبت نشد</h2>
        <p>این شکست نیست؛ خودش داده است. احتمالاً گره در شروع‌کردن است، نه در اندازه‌گیری.</p>
        <button class="btn primary big" data-act="new-obstacle">مانع شروع را پیدا کن</button>
        <button class="btn big" data-act="base-more">سه روز دیگر، فقط با ثبت دستی</button>
      </section>
      ${pattern}`;
  }

  const spread = Math.max(...p.days.map((d) => d.real)) >= 2 * Math.max(1, Math.min(...p.days.map((d) => d.real)));
  const answered = [p.records, p.longest, p.cause, p.linked, pt?.sentence].filter(Boolean).length;
  const ms = db.sessions.length, matched = db.sessions.filter(feelMatches).length;
  return `${head}
    <section>
      <h2>پروفایل مطالعهٔ من</h2>
      ${facts([
        ['میانگین مطالعهٔ واقعی در روز', `${fa(Math.round(p.avgReal))} دقیقه`],
        ['از هر ساعت حضور', p.presence ? `${fa(Math.round((p.real / p.presence) * 60))} دقیقه واقعی` : ''],
        ['بلندترین تمرکز پیوسته', p.longest ? `${fa(p.longest)} دقیقه` : ''],
        ['شایع‌ترین علت وقفه', p.cause ? CAUSES[p.cause].label : ''],
        ['میانگین خواب', p.sleep != null ? `${fa1(p.sleep)} ساعت${p.quality ? `، کیفیت ${fa1(p.quality)}` : ''}` : ''],
        ['بازهٔ پرانرژی روز', p.slot || ''],
        ['اگر فقط یک چیز بهتر شود', esc(pt?.one || '')],
      ])}
      ${p.cause ? `<p class="advice">${CAUSES[p.cause].advice}</p>` : ''}
      <p class="fine">این نقطهٔ شروع است، نه حکم دربارهٔ توانایی‌ات. عددهای هفتهٔ اولِ ثبت معمولاً کمی بهتر از روزهای معمول‌اند؛ خودِ نگاه‌کردن رفتار را عوض می‌کند.</p>
    </section>

    <section>
      <h2>روز به روز</h2>
      ${table}
      ${signs}
      <p class="advice">${p.link}</p>
      ${spread ? '<p>روزها خیلی با هم فرق دارند؛ این طبیعی است. به‌جای میانگین، ببین روز خوب چه چیزی متفاوت داشت: خواب، هدف مشخص‌تر یا جای بهتر؟</p>' : ''}
      ${p.sleep != null && p.sleep < 6 ? '<p class="fine">خواب این چند روز کم بوده. اگر خستگی یا بی‌حوصلگی فقط سر درس نیست و در بقیهٔ زندگی‌ات هم هست، کنار این ابزار با یک متخصص حرف بزن.</p>' : ''}
      ${ms >= 3 ? `<p class="fine">حدس در برابر آزمون: ${fa(matched)} از ${fa(ms)} جلسه. اگر همه‌چیز خوب به نظر می‌رسد ولی نتیجه‌ها غافلگیرت می‌کنند، به این عدد نگاه کن.</p>` : ''}
    </section>

    ${pattern}

    <section>
      <h2>می‌توانم با عدد جواب بدهم؟</h2>
      ${goalList([
        ['روزی چند دقیقه واقعاً می‌خوانم', p.records ? 1 : 0, 1],
        ['بلندترین تمرکز پیوسته‌ام', p.longest ? 1 : 0, 1],
        ['اصلی‌ترین منبع وقفه', p.cause ? 1 : 0, 1],
        ['رابطهٔ خواب و تمرکز', p.linked ? 1 : 0, 1],
        ['الگوی شکست در یک جمله', pt?.sentence ? 1 : 0, 1],
      ])}
      ${answered < 5 ? '<p>هنوز جایی را حدس می‌زنی. قبل از برنامه‌ریزی، سه روز دیگر با دقت بیشتر ثبت کن.</p>' : '<p>نقطهٔ شروع روشن است. از اینجا به بعد هر هدف را روی همین عددها بچین، نه روی بهترین روزت.</p>'}
      <button class="btn big" data-act="base-more">سه روز دیگر ثبت کن</button>
      <button class="btn link" data-act="base-reset">ثبت تازه از صفر</button>
    </section>`;
}

function viewMyths() {
  const m = mythToday(), w = weekSigns(), d = db.labDraft || (db.labDraft = {});
  const top = tally(db.myths, (x) => x.myth)[0];
  const first = db.myths[0];
  const wrapDue = !db.mythWrap && first && (mythDays() >= 7 || Date.now() - first.date >= 7 * DAY);
  const todayHas = db.sessions.some((s) => dayKey(s.date) === today());
  return `
    <header class="top">${labBack}<h1>افسانه یا داده؟</h1>
      <p>باور با استدلال عوض نمی‌شود؛ با چند روز شاهدِ رفتاری عوض می‌شود.</p></header>

    <section>
      <h2>امروز</h2>
      ${!m ? `<p class="empty">فقط یک افسانه، فقط برای بیست‌وچهار ساعت.</p>
        <button class="btn primary big" data-act="new-myth">انتخاب قانون امروز</button>` : `
        <p class="goal-line">${ruleLine(m)}</p>
        ${m.done ? `<p>${m.done === 'yes' ? 'اجرا شد.' : 'اجرا نشد؛ این هم داده است.'} ${esc(m.happened)}</p>` : `
          <p>${MYTHS[m.myth].test}</p>
          <button class="btn primary big" data-act="myth-session">شروع جلسهٔ آزمایشی</button>
          <button class="btn big" data-act="myth-close">ثبت نتیجه${todayHas ? '' : '، بدون جلسه'}</button>
`}`}
    </section>

    ${db.myths.length ? fold('myth-fix', 'جواب نداد؟', `<ul class="log">${MYTH_FIX.map(([when, then, n]) => `
      <li><b>${when}</b><p>${then}</p>
        ${n ? `<button class="btn" data-act="myth-small" data-n="${n}">جلسهٔ ${fa(n)} دقیقه‌ای</button>` : ''}</li>`).join('')}</ul>`) : ''}

    ${db.myths.length ? `
    <section>
      <h2>کاربرگ هفت روز</h2>
      <ul class="log">${[...db.myths].reverse().slice(0, 14).map((x) => `
        <li>
          <div class="log-head"><b>${MYTHS[x.myth].label}</b><span class="tag ${x.done === 'yes' ? 'full' : x.done === 'no' ? 'none' : ''}">${x.done === 'yes' ? 'اجرا شد' : x.done === 'no' ? 'اجرا نشد' : 'باز'}</span></div>
          <p>${ruleLine(x)}</p>
          ${has(x.task) ? `<p class="count">کار امروز: ${esc(x.task)}</p>` : ''}
          ${has(x.output) ? `<p class="count">خروجی: ${esc(x.output)}</p>` : ''}
          ${has(x.can) ? `<p class="count">بدون کتاب: ${esc(x.can)}</p>` : ''}
          <small>${weekdayFa(x.date)}${has(x.predict) ? `، پیش‌بینی: ${esc(x.predict)}` : ''}${has(x.happened) ? `، واقعیت: ${esc(x.happened)}` : ''}</small>
        </li>`).join('')}</ul>
    </section>` : ''}

    ${wrapDue ? `
    <section class="due">
      <h2>جمع‌بندی هفته</h2>
      <p>پرتکرارترین افسانهٔ تو: «${MYTHS[top[0]].label}»، ${fa(top[1])} روز.</p>
      <label class="field"><span>داده‌های واقعی من نشان دادند که…</span>
        <input type="text" data-lab="wrapData" value="${esc(d.wrapData || '')}"></label>
      <label class="field"><span>تصمیم هفتهٔ بعد من این است…</span>
        <input type="text" data-lab="wrapDecision" value="${esc(d.wrapDecision || '')}"></label>
      <button class="btn primary big" data-act="myth-wrap">ثبت جمع‌بندی</button>
    </section>` : db.mythWrap ? `
    <section>
      <h2>جمع‌بندی هفته</h2>
      ${facts([['پرتکرارترین افسانه', MYTHS[db.mythWrap.top]?.label || ''], ['داده‌ها نشان دادند', esc(db.mythWrap.data)], ['تصمیم هفتهٔ بعد', esc(db.mythWrap.decision)]])}
      <button class="btn big" data-act="myth-again">یک هفتهٔ دیگر</button>
    </section>` : ''}

    <section>
      <h2>نشانه‌های هفت روز اخیر</h2>
      ${goalList([
        ['روزهایی که بدون انتظارِ حال خوب شروع شد', w.startDays, 5],
        ['جلسه‌هایی که قبل از دور دوم، بسته و نوشته شد', w.closed, 4],
        ['روزهایی که خروجی مشخص دارند، نه فقط ساعت', w.outputDays, Math.max(1, w.studyDays)],
        ['مبحثی که در دو روز جدا دیده شد', w.spread, 1],
      ])}
      <p class="count">بلوک تمام‌شده ${fa(w.done)} (هفتهٔ قبل ${fa(w.donePrev)})، رهاشده ${fa(w.dropped)} (هفتهٔ قبل ${fa(w.droppedPrev)}).</p>
      <p class="fine">اثر هر روش را همان لحظه نسنج؛ بلافاصله بعد از خواندن، دوباره‌خوانی همیشه خوب به نظر می‌رسد. بازیابیِ فردا داور است.</p>
    </section>`;
}

function viewEnv() {
  const e = db.env;
  const head = `<header class="top">${labBack}<h1>بازطراحی محیط مطالعه</h1>
    <p>یک‌بار، حداکثر ۴۵ دقیقه، با همین وسایلی که داری. اتاق رؤیایی لازم نیست.</p></header>`;
  if (!e) {
    return `${head}
      <ol class="steps">
        <li>اول یک جلسهٔ معمولی بگیر، بدون هیچ تغییری؛ این خط پایه است.</li>
        <li>شش عامل محیط را ممیزی کن و تغییر هرکدام را همین امروز انجام بده.</li>
        <li>سه جلسهٔ بعد را با همین اپ بگیر. عددها خودشان کنار خط پایه می‌نشینند.</li>
      </ol>
      <button class="btn primary big" data-act="env-start">شروع ممیزی</button>`;
  }

  const post = db.sessions.filter((s) => s.date > e.start), st = envStats(post), b = e.base || {};
  const left = auditLeft(e);
  const stalled = left && !post.length && Date.now() - e.start > 2 * DAY;
  const lagOk = st.timed >= 3 && st.lag <= 3;
  const fewer = st.n >= 3 && (b.up != null || b.reach != null) && st.up + st.reach < (b.up || 0) + (b.reach || 0);
  const recent = post.filter((s) => s.date >= Date.now() - 7 * DAY);
  const top = tally(causesOf(post, []), (c) => c)[0]?.[0];
  const route = {
    phone: 'میز مرتب است و باز دستت سمت گوشی می‌رود. گره دیجیتال است، نه فیزیکی.',
    notif: 'وقفه‌ها از اعلان می‌آید. گره دیجیتال است، نه فیزیکی.',
    tab: 'وقفه‌ها از تب و برنامه می‌آید. گره دیجیتال است، نه فیزیکی.',
    thought: 'محیط آرام است و ذهن شلوغ. این محرک درونی است و با چیدمان حل نمی‌شود؛ فکر را روی برگه بنویس و برگرد سر همان خط.',
    tired: 'اگر تا می‌نشینی خوابت می‌گیرد، یا این جا با خواب گره خورده یا خواب کم است. جا را عوض کن و ثبت خواب را نگاه کن.',
    noise: 'صدا دست تو نیست. به‌ترتیب امتحان کن: ساعت آرام‌تر، صدای یکنواخت یا گوش‌گیر، و آخر سر جای دیگر.',
    lost: CAUSES.lost.advice,
    up: 'هنوز وسط جلسه دنبال وسیله بلند می‌شوی. نقطهٔ فرود را جدی‌تر بچین و فهرست «فقط با این‌ها» را قبل از شروع کامل کن.',
  }[top];
  const cell = (x, unit = '') => (x == null ? '·' : fa1(x) + unit);

  return `${head}
    ${stalled ? '<p class="advice">چند روز است میز را بهینه می‌کنی و جلسه‌ای ثبت نشده. همین الان با همین وضعیت یک جلسهٔ کوتاه بخوان؛ نسخهٔ ناقصِ اجراشده جلوتر از نسخهٔ کاملِ اجرانشده است.</p><button class="btn primary big" data-act="new-session">شروع جلسهٔ کوتاه</button>' : ''}

    <section>
      <h2>خط پایه</h2>
      <p>سه عدد از آخرین جلسهٔ معمولی، قبل از هر تغییری.</p>
      <div class="grid2">
        ${dbNum('بلندشدن از جا', 'env.base.up', b.up, 'چند بار.')}
        ${dbNum('دست به گوشی یا وسیله', 'env.base.reach', b.reach, 'چند بار.')}
        ${dbNum('دقیقه تا خط اول', 'env.base.lag', b.lag, 'از نشستن تا شروع واقعی.')}
      </div>
    </section>

    <section>
      <h2>ممیزی شش عامل</h2>
      ${Object.entries(AUDIT).map(([k, [label, tip]]) => {
        const f = e.audit?.[k] || {};
        return `<fieldset class="group"><legend>${label}</legend>
          <p class="fine">${tip}</p>
          ${dbText('وضعیت فعلی', `env.audit.${k}.now`, f.now)}
          ${dbText('تغییر لازم امروز', `env.audit.${k}.change`, f.change)}
          ${dbCheck(`env.audit.${k}.done`, f.done, 'انجام شد')}
        </fieldset>`;
      }).join('')}
      <p class="fine">میز چند روز بعد دوباره شلوغ می‌شود. نگه‌داشتنش با «نقطهٔ فرود» در پایان هر جلسه است، نه با یک پاک‌سازی دیگر.</p>
    </section>

    <section>
      <h2>سنجش دوباره</h2>
      ${st.n ? `
      <table class="result calm">
        <thead><tr><th></th><th>بلندشدن</th><th>دست به گوشی</th><th>تا خط اول</th></tr></thead>
        <tbody>
          <tr><th>خط پایه</th><td>${cell(b.up)}</td><td>${cell(b.reach)}</td><td>${cell(b.lag, ' دقیقه')}</td></tr>
          <tr><th>${fa(st.n)} جلسهٔ بعد</th><td>${cell(st.up)}</td><td>${cell(st.reach)}</td><td>${cell(st.lag, ' دقیقه')}</td></tr>
        </tbody>
      </table>
      <p class="fine">میانگین هر جلسه. بلندشدن و گوشی را وسط جلسه با «وقفه» ثبت کن تا این جدول پر شود.</p>` : '<p class="empty">بعد از ممیزی، سه جلسه با همین اپ بگیر تا مقایسه ساخته شود.</p>'}
      ${goalList([
        ['از نشستن تا خط اول، سه دقیقه یا کمتر', lagOk ? 1 : 0, 1],
        ['وقفهٔ فیزیکی کمتر از خط پایه', fewer ? 1 : 0, 1],
        ['جلسه‌های هفت روز اخیر در جای ثابت', recent.filter((s) => s.place === 'fixed').length, Math.max(4, Math.ceil(recent.length * 0.8))],
      ])}
      ${st.n >= 5 && Date.now() - e.start >= 7 * DAY ? (lagOk || fewer
        ? '<p>محیط حالا کمکت می‌کند، نه این‌که هر جلسه با آن بجنگی. همین را نگه دار؛ کامل‌ترش نکن.</p>'
        : '<p class="advice">بعد از یک هفته اجرای کامل، نه شروع سریع‌تر شد و نه وقفه کمتر. گلوگاه اصلی‌ات محیط فیزیکی نیست؛ به پروفایل نقطهٔ شروع برگرد.</p><button class="btn big" data-act="lab-view" data-view="baseline">پروفایل نقطهٔ شروع</button>') : ''}
      ${route && st.n >= 3 ? `<p class="advice">${route}</p>${CAUSES[top] && ['phone', 'notif', 'tab'].includes(top) ? '<button class="btn big" data-act="lab-view" data-view="digital">محیط دیجیتال</button>' : ''}` : ''}
      ${post.length >= 3 && db.obstacles.filter((o) => o.date > e.start).length > post.length ? '<p class="advice">محیط آماده است و باز شروع نمی‌کنی. مانع احتمالاً ابهام کار یا ترس است، نه میز.</p>' : ''}
    </section>
    <button class="btn link" data-act="env-reset">ممیزی تازه از صفر</button>`;
}

function viewDigital() {
  const d = db.digital;
  const head = `<header class="top">${labBack}<h1>محیط دیجیتال</h1>
    <p>هر روز با گوشی نجنگ. یک‌بار سیستم را بچین، بعد فقط اجرا کن.</p></header>`;
  if (!d) {
    return `${head}
      <ol class="steps">
        <li>خط پایه: یک جلسهٔ معمولی، بدون اصلاح محیط.</li>
        <li>ساخت سیستم، حداکثر ۴۰ دقیقه: چه چیزی اجازهٔ ورود دارد، حواس‌پرتی چقدر دور است، و قبل از هر جلسه چه چیزی سر جایش است.</li>
        <li>هفت روز فقط اجرا و ثبت. تنظیمات را هر شب از نو نچین.</li>
      </ol>
      <button class="btn primary big" data-act="dig-start">شروع آزمایش هفت‌روزه</button>`;
  }

  const days = digDays(d), dayNo = baseDayNo(d), b = d.base || {}, built = d.built || {}, rule = d.rule || {}, draft = db.labDraft || {};
  const post = db.sessions.filter((s) => s.date >= startOfDay(d.start)), last = post.slice(-3);
  const active = days.filter((x) => x.sessions);
  const totals = [['notif', sum(days, (x) => x.notifs)], ['phone', sum(days, (x) => x.pickups)], ['tab', sum(days, (x) => x.switches)]].sort((x, y) => y[1] - x[1]);
  const layer = { notif: 'لایهٔ ورود ناقص است. ', phone: 'اعلان نمی‌آید و خودت سراغش می‌روی؛ لایهٔ دسترسی ضعیف است. ', tab: 'گوشی آرام است و رایانه منحرفت می‌کند. ' };
  const fourth = { paper: 'برنامه‌های ستون سوم از صفحهٔ اول رفتند و ورود خودکارشان قطع شد', laptop: 'برای درس پروفایل جدا دارم و سایت‌های ستون سوم در ساعت درس بسته‌اند', phone: 'برنامهٔ درس تمام‌صفحه باز می‌شود و خروجش قفل دارد' }[d.device || 'paper'];
  const three = last.length >= 3;
  const pk = avg(last, (s) => countCause(s, 'phone')), fb = avg(last, firstBreakOf);
  const wd = d.wrapDraft || {};

  return `${head}
    <section>
      <h2>خط پایه</h2>
      <div class="field"><span>معمولاً روی چه درس می‌خوانم؟</span>
        ${seg('digital.device', Object.entries(DEVICES).map(([k, v]) => [k, v[0]]), d.device, 'دستگاه اصلی', 'data-db')}
        ${d.device ? `<small>${DEVICES[d.device][1]}</small>` : ''}</div>
      <p class="count">عددهای یک جلسهٔ معمولی، قبل از هر تغییری:</p>
      <div class="grid2">
        ${dbNum('مدت جلسه', 'digital.base.minutes', b.minutes, 'دقیقه.')}
        ${dbNum('برداشتن گوشی', 'digital.base.pickups', b.pickups, 'چند بار.')}
        ${dbNum('سوییچ بی‌دلیل', 'digital.base.switches', b.switches, 'تب یا برنامه.')}
        ${dbNum('اولین قطع', 'digital.base.first', b.first, 'دقیقهٔ چندم.')}
      </div>
      <div class="field"><span>اصلی‌ترین محرک</span>
        ${pick('data-db', 'digital.base.trigger', Object.entries(TRIGGERS), b.trigger, 'محرک اصلی', 'انتخاب کن')}</div>
    </section>

    <section>
      <h2>سه ستون</h2>
      <p>هر برنامه، سایت یا نوع پیام فقط یک برچسب می‌گیرد.</p>
      ${Object.entries(COLS).map(([k, [label, tip]]) => {
        const list = (d.apps || []).map((x, i) => [x, i]).filter(([x]) => x.col === k);
        return `<div class="field"><span>${label}</span><small class="above">${tip}</small>
          ${list.length ? `<ul class="plain">${list.map(([x, i]) => `<li class="line"><span>${esc(x.name)}</span><button class="back" data-act="dig-del-app" data-i="${i}">حذف</button></li>`).join('')}</ul>` : ''}</div>`;
      }).join('')}
      <div class="row">
        <input type="text" data-db="labDraft.appName" value="${esc(draft.appName || '')}" placeholder="مثلاً: گروه کلاسی" aria-label="نام برنامه یا پیام">
        ${pick('data-db', 'labDraft.appCol', Object.entries(COLS).map(([k, v]) => [k, v[0]]), draft.appCol || 'off', 'ستون')}
        <button class="btn quiet" data-act="dig-add-app">افزودن</button>
      </div>
    </section>

    <section>
      <h2>ساخت سیستم</h2>
      ${dbCheck('digital.built.notif', built.notif, 'اعلان‌های غیرضروری را کامل بستم، با عدد روی آیکون')}
      ${dbCheck('digital.built.focus', built.focus, 'حالت تمرکز «مطالعه» را ساختم و افراد مجاز را مشخص کردم')}
      ${dbCheck('digital.built.place', built.place, 'جای گوشی هنگام مطالعه را از پیش تعیین کردم')}
      ${dbCheck('digital.built.device', built.device, fourth)}
      <p class="fine">از ابزارهای خود گوشی و رایانه شروع کن. چند مسدودکننده با هم، خودش حواس‌پرتی است.</p>
    </section>

    <section>
      <h2>قاعدهٔ جلسه</h2>
      ${dbText('جای گوشی من هنگام مطالعه', 'digital.rule.place', rule.place, 'مثلاً: کشوی اتاق کناری')}
      ${dbText('کسانی که اجازه دارند فوری برسند', 'digital.rule.people', rule.people, 'مثلاً: مادر و پدر', 'به همین‌ها بگو: کار فوری بود زنگ بزنید؛ به پیام دیرتر جواب می‌دهم.')}
      ${dbText('زمان مجاز بعدی برای پیام و شبکه', 'digital.rule.next', rule.next, 'مثلاً: ده دقیقه بعد از هر جلسه', 'محرومیت دائمی چند روز بعد می‌ترکد. یک پنجرهٔ کوتاه و مشخص بگذار.')}
      <p class="fine">این سه خط قبل از هر جلسه، در «حالت مطالعه»، جلوی چشمت می‌آید.</p>
    </section>

    <section>
      <h2>هفت روز${dayNo <= 7 ? `، روز ${fa(dayNo)}` : ''}</h2>
      <table class="result calm">
        <thead><tr><th>روز</th><th>مدت</th><th>گوشی</th><th>سوییچ</th><th>اعلان</th><th>اولین قطع</th><th>تمرکز</th></tr></thead>
        <tbody>${days.map((x) => `<tr><th>${weekdayFa(x.ts)}</th>
          <td>${x.n ? fa(x.minutes) : '·'}</td><td>${x.n ? fa(x.pickups) : '·'}</td><td>${x.n ? fa(x.switches) : '·'}</td><td>${x.n ? fa(x.notifs) : '·'}</td>
          <td>${x.first != null ? fa(x.first) : '·'}</td><td>${x.sessions ? `${fa(x.focus)} از ${fa(x.sessions)}` : '·'}</td></tr>`).join('')}</tbody>
      </table>
      <p class="fine">از جلسه‌های همین اپ پر می‌شود. وسط جلسه هر وقفه را با علتش بزن: اعلان، برداشتن گوشی، یا تب. ستون آخر یعنی حالت تمرکز روشن بود.</p>
      ${totals[0][1] && post.length >= 2 ? `<p class="advice">${layer[totals[0][0]]}${CAUSES[totals[0][0]].advice}</p>` : ''}
      ${post.length >= 3 && post.filter((s) => s.focusOn).length * 2 < post.length ? '<p class="advice">در بیشتر جلسه‌ها حالت تمرکز خاموش بوده. سیستم را از نو نچین؛ فقط همان دو دقیقهٔ قبل از جلسه را اجرا کن.</p>' : ''}
      <div class="field"><span>چیزی هست که عددها نشان نمی‌دهند؟</span>
        ${pick('data-db', 'digital.snag', Object.entries(SNAGS).map(([k, v]) => [k, v[0]]), d.snag, 'گیر کار', 'نه، همین است')}</div>
      ${SNAGS[d.snag] ? `<p class="advice">${SNAGS[d.snag][1]}</p>${d.snag === 'hard' ? '<button class="btn big" data-act="new-obstacle">شروع نمی‌کنم یا فرار می‌کنم</button>' : ''}` : ''}
    </section>

    ${d.wrap ? `
    <section>
      <h2>جمع‌بندی روز هفتم</h2>
      ${facts([['بیشترین کمک', { entry: 'بستن اعلان‌ها', access: 'فاصله با گوشی', computer: 'جداکردن رایانه' }[d.wrap.layer] || ''], ['جایی که دور زدم', esc(d.wrap.bypass)], ['فردا همان نقطه را', esc(d.wrap.harder)]])}
      <p class="fine">از اینجا سخت‌گیرانه‌ترش نکن، مگر یک نقطهٔ مشخص هنوز تکرار شود.</p>
      <button class="btn big" data-act="dig-again">یک هفتهٔ دیگر</button>
    </section>` : dayNo >= 7 ? `
    <section class="due">
      <h2>جمع‌بندی روز هفتم</h2>
      ${active.length >= 4 ? `<p>برداشتن گوشی در هر روز: سه روز اول ${fa1(avg(active.slice(0, 3), (x) => x.pickups))}، سه روز آخر ${fa1(avg(active.slice(-3), (x) => x.pickups))}. اولین قطع: از دقیقهٔ ${fa1(avg(active.slice(0, 3), (x) => x.first))} به ${fa1(avg(active.slice(-3), (x) => x.first))}.</p>`
        : '<p>کمتر از چهار روز جلسه ثبت شده؛ مقایسهٔ اول و آخر هفته هنوز معنی ندارد. با عدد جواب بده، نه با حس.</p>'}
      <div class="field"><span>کدام لایه بیشتر کمک کرد؟</span>
        ${seg('digital.wrapDraft.layer', [['entry', 'اعلان'], ['access', 'فاصله'], ['computer', 'رایانه']], wd.layer, 'لایهٔ مؤثر', 'data-db')}</div>
      ${dbText('کجا سیستم را دور زدم؟', 'digital.wrapDraft.bypass', wd.bypass)}
      ${dbText('فردا همان نقطه را چطور سخت‌تر می‌کنم؟', 'digital.wrapDraft.harder', wd.harder)}
      <button class="btn primary big" data-act="dig-wrap">ثبت جمع‌بندی</button>
    </section>` : ''}

    <section>
      <h2>سیستم کار می‌کند؟</h2>
      ${goalList([
        ['برداشتن گوشی کمتر از خط پایه', three && b.pickups != null && (pk < b.pickups || pk === 0) ? 1 : 0, 1],
        ['اولین قطع دیرتر از خط پایه', three && b.first != null && fb > b.first ? 1 : 0, 1],
        ['سه جلسهٔ آخر بدون اعلان', three && !sum(last, (s) => countCause(s, 'notif')) ? 1 : 0, 1],
        ['جلسه‌هایی که با حالت تمرکز شروع شد', post.filter((s) => s.focusOn).length, Math.max(4, Math.ceil(post.length * 0.8))],
      ])}
      <p class="fine">هدف صفرشدن نیست؛ کم‌شدنِ آشکار قطع‌های غیرضروری است. ساعت نشستن پای میز هم معیار نیست.</p>
    </section>
    <button class="btn link" data-act="dig-reset">آزمایش تازه از صفر</button>`;
}

function viewTime() {
  const m = energyMap(), c = capacity(), now = Date.now();
  const recent = db.sessions.filter((s) => s.date >= now - 14 * DAY);
  const cur = planFor(tomorrowKey()) || planFor(today()), rv = reviewDue(), ri = db.tplans.indexOf(rv);
  const ten = db.tplans.filter((p) => p.ts >= addDays(now, -9) && p.day <= today());
  const hit = ten.filter((p) => p.done === 'peak' || p.done === 'alt').length, lost = ten.filter((p) => p.done === 'no').length;
  const loaded = db.sessions.filter((s) => s.date >= now - 10 * DAY && s.load);
  const heavyLow = m.trough >= 0 ? loaded.filter((s) => s.load === 'heavy' && slotOf(startOf(s)) === m.trough).length : null;
  const lightHigh = m.peak >= 0 ? loaded.filter((s) => s.load === 'light' && slotOf(startOf(s)) === m.peak).length : null;
  const timed = db.tplans.filter((p) => p.actual > 0 && p.done !== 'no').slice(-5);
  const ratio = avg(timed, (p) => p.actual / p.minutes);
  const lastFix = [...db.tplans].reverse().find((p) => has(p.fix));

  return `
    <header class="top">${labBack}<h1>معماری زمان</h1>
      <p>ساعت‌های روز با هم برابر نیستند. اول انرژی و ظرفیت واقعی، بعد تقویم.</p></header>

    <section>
      <h2>نقشهٔ انرژی</h2>
      <table class="result calm">
        <thead><tr><th>بازه</th><th>انرژی</th><th>برچسب</th><th>جلسه</th><th>به هدف رسید</th></tr></thead>
        <tbody>${SLOTS.map((name, i) => {
          const ss = recent.filter((s) => slotOf(startOf(s)) === i);
          return `<tr><th>${name}</th><td>${m.avgs[i] != null ? fa1(m.avgs[i]) : '·'}</td><td>${slotLabel(m, i)}</td>
            <td>${ss.length ? fa(ss.length) : '·'}</td><td>${ss.length ? fa(ss.filter((s) => s.outcome === 'full').length) : '·'}</td></tr>`;
        }).join('')}</tbody>
      </table>
      <p class="fine">${!m.ready ? `انرژی ${fa(m.n)} روز ثبت شده. با سه تا پنج روز، اوج و فرود برچسب می‌خورد.`
        : m.flat ? 'انرژی بازه‌ها تقریباً یکی است. تا هفت روز ادامه بده؛ الگو دیرتر از حدس اول پیدا می‌شود.'
        : `اوج تو ${SLOTS[m.peak]} است و فرودت ${SLOTS[m.trough]}. دو ستون آخر رفتار واقعی دو هفتهٔ اخیر است؛ اگر با برچسب نمی‌خواند، به رفتار اعتماد کن.`}</p>
      ${m.flat && m.n >= 7 ? '<p class="advice">بعد از هفت روز هنوز اوج و فرودی دیده نمی‌شود. این می‌تواند نشانهٔ کم‌خوابی یا فشار مزمن باشد. برنامه را سنگین‌تر نکن؛ اول خواب را ببین و اگر ادامه داشت با یک متخصص حرف بزن.</p>' : ''}
      <button class="btn big" data-act="new-day">ثبت انرژی امروز</button>
    </section>

    <section>
      <h2>ظرفیت واقعی</h2>
      <div class="verdict three">
        <div><span>دقیقهٔ مؤثر دیروز</span><b>${fa(c.y)}</b></div>
        <div><span>دقیقهٔ مؤثر امروز</span><b>${fa(c.t)}</b></div>
        <div><span>سقف برنامهٔ فردا</span><b>${c.cap ? fa(c.cap) : '·'}</b></div>
      </div>
      <p class="fine">${c.cap ? 'سقف حدود هفتاد درصدِ میانگین همین دو روز است، نه عددی که دلت می‌خواهد. بقیه جای رفت‌وآمد، خستگی و اتفاق است.' : 'هنوز دقیقهٔ مؤثری برای دیروز و امروز ثبت نشده. ساعت خالی ظرفیت نیست؛ اول یک جلسه بگیر.'}</p>
    </section>

    ${rv ? `
    <section class="due">
      <h2>بررسی ${dayWord(rv)}</h2>
      <p class="goal-line">${esc(rv.task)}</p>
      <div class="field"><span>کار اول کجا انجام شد؟</span>
        ${seg(`tplans.${ri}.done`, [['peak', 'در اوج'], ['alt', 'جایگزین'], ['other', 'بیرون از پنجره'], ['no', 'نشد']], rv.done, 'نتیجهٔ کار اول', 'data-db')}</div>
      ${!rv.done || rv.done === 'no' ? '' : `<div class="field"><span>چقدرش انجام شد؟</span>
        ${seg(`tplans.${ri}.state`, [['full', '✓ کامل'], ['part', '~ بخشی'], ['min', 'فقط حداقلی']], rv.state, 'مقدار انجام‌شده', 'data-db')}</div>`}
      ${rv.done === 'no' ? '' : dbNum('واقعاً چند دقیقه طول کشید؟', `tplans.${ri}.actual`, rv.actual, `برآورد قفل‌شده ${fa(rv.minutes)} دقیقه بود.`)}
      ${dbText('مانع اصلی، یک کلمه', `tplans.${ri}.block`, rv.block, 'خواب، حجم، سخت بود، گوشی', 'فقط علامت و علت. «باز خراب کردم» ثبت نیست.')}
      ${rv.done === 'no' || rv.state === 'part' ? `<div class="field"><span>جامانده را چه می‌کنم؟</span>
        ${seg(`tplans.${ri}.carry`, [['move', 'فردا'], ['shrink', 'کوچک‌تر'], ['drop', 'حذف']], rv.carry, 'تصمیم دربارهٔ جامانده', 'data-db')}
        <small>خودبه‌خود به فردا سُر نمی‌خورد؛ یکی را آگاهانه بزن.</small></div>` : ''}
      ${dbText('کدام کار سبک وارد اوج شد؟', `tplans.${ri}.intruder`, rv.intruder, 'اگر نشد خالی بگذار')}
      ${dbText('یک اصلاح کوچک برای فردا', `tplans.${ri}.fix`, rv.fix, 'فقط همان جایی که خراب شد')}
      <button class="btn primary big" data-act="tplan-review" data-id="${rv.id}">ثبت بررسی</button>
    </section>` : ''}

    <section>
      <h2>کار اول</h2>
      ${cur ? `
        <p class="goal-line">${lockLine(cur)}</p>
        ${cur.tasks.length ? `<ul class="plain">${cur.tasks.map((t) => `<li>${esc(t.name)}، ${LOADS[t.load]} در ${WINS[t.win]}، ${fa(t.min)} دقیقه</li>`).join('')}</ul>` : ''}
        ${planChecks(cur, c.cap).map((x) => `<p class="advice">${x}</p>`).join('')}
        ${cur.done ? `<p class="count">${{ peak: 'در پنجرهٔ اوج انجام شد.', alt: 'در پنجرهٔ جایگزین انجام شد.', other: 'انجام شد، بیرون از هر دو پنجره.', no: 'انجام نشد. این داده است، نه شکست.' }[cur.done]}</p>` : `<button class="btn big" data-act="tplan-edit" data-id="${cur.id}">ویرایش</button>`}
        ${cur.day === today() && !planFor(tomorrowKey()) ? '<button class="btn primary big" data-act="new-tplan">طراحی فردا</button>' : ''}`
      : `<p class="empty">هر شب فقط سه تصمیم: کار اول فردا، بهترین پنجرهٔ در دسترس، و نسخهٔ کوچکِ جایگزین.</p>
        ${has(lastFix?.fix) ? `<p class="count">اصلاح قبلی‌ات: ${esc(lastFix.fix)}</p>` : ''}
        <button class="btn primary big" data-act="new-tplan">طراحی کار اول</button>`}
    </section>

    ${ten.length || loaded.length ? `
    <section>
      <h2>ده روز اخیر</h2>
      ${goalList([['کار اول در اوج یا در جایگزینِ ازپیش‌نوشته', hit, 7]])}
      ${facts([
        ['روزهایی که کار اول رها شد', ten.length ? fa(lost) : ''],
        ['کار سنگین در ساعت فرود', heavyLow != null ? `${fa(heavyLow)} بار` : ''],
        ['کار سبک در ساعت اوج', lightHigh != null ? `${fa(lightHigh)} بار` : ''],
        ['زمان واقعی در برابر برآورد', ratio != null ? `${fa1(ratio)} برابر` : ''],
      ])}
      ${ten.slice(-3).filter((p) => p.done === 'no').length >= 2 ? '<p class="advice">برنامه هنوز می‌ترکد. جای کارها را عوض نکن؛ حجم را کم کن: روزی یک کار سنگین و یک کار متوسط.</p>' : ''}
      ${ratio > 1.25 ? '<p class="advice">هنوز خوش‌بینانه برآورد می‌کنی. عدد بعدی را از همین واقعیت‌ها بردار، نه از «اگر خوب پیش برود».</p>' : ''}
      ${heavyLow > 2 ? '<p class="advice">کار سنگین مدام به ساعت فرود می‌افتد. اگر اوجت همیشه قفل است، فقط همان یک پنجرهٔ قابل‌کنترل را معماری کن و از همان محافظت کن.</p>' : ''}
      ${lightHigh > 1 ? '<p class="advice">بهترین ساعتت خرج کار سبک می‌شود چون حس پیشرفت می‌دهد. مرتب‌کردن و مرور آشنا را عمداً به فرود ببر.</p>' : ''}
      <p class="fine">اگر ساعتِ پای میز کمتر شده ولی کار اول بیشتر تمام می‌شود، معماری‌ات بهتر شده است. برنامه‌ای که خراب شد داده است؛ فقط همان قسمت را اصلاح کن.</p>
    </section>` : ''}`;
}

function viewLoop() {
  const L = db.loop;
  const head = `<header class="top">${labBack}<h1>حلقهٔ سبک</h1>
    <p>برنامه، اجرا، ثبت، بررسی، اصلاح. هفته‌ای بیست دقیقه، روزی پنج.</p></header>`;
  if (!L) {
    return `${head}
      <ol class="steps">
        <li>هر شب یک کارت پنج‌دقیقه‌ای: یک کار اصلی، نقطهٔ شروع و نسخهٔ حداقلی.</li>
        <li>هر شب نود ثانیه ثبت: چه شد، چقدر طول کشید، مانع چه بود. روز صفر هم ثبت می‌شود.</li>
        <li>هفته‌ای یک جلسهٔ بیست‌دقیقه‌ای که با بررسی شروع می‌شود و دقیقاً یک اصلاح می‌سازد.</li>
        <li>چهارده روز. هدف اجرای بی‌نقص نیست؛ بستن یک دور کامل است.</li>
      </ol>
      <button class="btn primary big" data-act="loop-start">شروع چهارده روز</button>`;
  }

  const dayNo = baseDayNo(L), days = loopDays(L.start, 14), st = loopStats(days), w1 = loopStats(days.slice(0, 7)), w2 = loopStats(days.slice(7));
  const wk = weekNow(), weeks = db.weeks.filter((w) => w.made >= startOfDay(L.start)), k = coef(), z = L.k0 || {};
  const cur = planFor(tomorrowKey()) || planFor(today()), rv = reviewDue();
  const both = days.filter((d) => d.p?.reviewed).length;
  const bad = days.map((d, i) => [d, days[i + 1]]).filter(([d, n]) => n && d.k < today() && (d.p?.done === 'no' || !d.worked));
  const back = bad.filter(([, n]) => n.worked).length;
  const crit = [
    ['کارت و ثبت شبانه، ده روز از چهارده', both, 10],
    ['دو جلسهٔ هفتگی', weeks.length, 2],
    ['کارت زیر پنج دقیقه و جلسهٔ هفتگی زیر بیست', st.took != null && st.took <= 300 && weeks.every((w) => w.took <= 1200) ? 1 : 0, 1],
    ['هفتهٔ دوم: کار اصلی کامل، کوچک یا منتقل شد', w2.ok, Math.max(2, Math.ceil(w2.cards / 2))],
    ['تخمینِ هفتهٔ دوم به واقعیت نزدیک‌تر شد', w1.ratio != null && w2.ratio != null && Math.abs(w2.ratio - 1) < Math.abs(w1.ratio - 1) ? 1 : 0, 1],
    ['بعد از روز بد، فردایش برگشتم', bad.length ? back : dayNo > 7 ? 1 : 0, Math.max(1, Math.ceil(bad.length / 2))],
    ['یک اصلاح که از داده آمد، نه از حس', weeks.some((w) => has(w.fix)) ? 1 : 0, 1],
  ];
  const met = crit.filter(([, n, need]) => n >= need).length;
  const late = days.filter((d) => d.p && d.k < today() && !d.p.reviewed).length;
  const diag = [
    st.cards >= 4 && st.none * 2 >= st.cards && ['کارت می‌نویسی و روز شروع نمی‌شود. گره در برنامه نیست؛ کار اصلی را ده تا پانزده دقیقه‌ای کن و سراغ لحظهٔ شروع برو، نه بازنویسی جدول.', 'start', 'ورود کوچک'],
    st.cards >= 4 && st.part * 2 >= st.cards && ['برنامه هنوز آرزوست. فقط یک کار اصلی، با زمانی که از ثبت قبلی آمده. تا دو روز پشت‌سرهم تمام نشده، چیزی اضافه نکن.'],
    late >= 3 && ['ثبت شبانه سنگین است. فقط علامت بزن، بلافاصله بعد از بستن کتاب؛ بدون هیچ کلمه‌ای.'],
    st.took > 600 && ['نوشتن کارت بیشتر از ده دقیقه طول می‌کشد؛ برنامه‌ریزی خودش کار شده. یک هفته فقط همین کارت، بدون مرتب‌کردن و ابزار تازه.'],
    dayNo > 14 && st.cards >= 6 && st.ok * 5 < st.cards * 2 && ['بعد از دو هفته هنوز کمتر از ۴۰ درصد اجرا می‌شود. مسئله بیرون از برنامه است: خواب و انرژی، هدف مبهم، یا فرار از کار. همین سیستم را بیشتر فشار نده.', 'baseline', 'پروفایل نقطهٔ شروع'],
  ].filter(Boolean);
  const pair = (i) => `${dbNum(`تخمین کار ${fa(i)}`, `loop.k0.e${i}`, z['e' + i], 'دقیقه.')}${dbNum('واقعی', `loop.k0.a${i}`, z['a' + i], 'دقیقه.')}`;

  return `${head}
    <section>
      <h2>ضریب خطای من</h2>
      <div class="verdict">
        <div><span>زمان واقعی، برابرِ تخمین</span><b>${k ? fa1(k) : '·'}</b></div>
        <div><span>هفتهٔ اول، هفتهٔ دوم</span><b>${w1.ratio != null ? fa1(w1.ratio) : '·'}، ${w2.ratio != null ? fa1(w2.ratio) : '·'}</b></div>
      </div>
      <p class="fine">${k ? 'تخمینِ کارت‌ها خودکار در همین عدد ضرب می‌شود. قرار نیست بهتر حدس بزنی؛ حدست تصحیح می‌شود.' : 'سه کار مطالعاتی اخیرت را به یاد بیاور. بعد از سه ثبت شبانه، این عدد از دادهٔ واقعی می‌آید.'}</p>
      <div class="grid2">${[1, 2, 3].map(pair).join('')}</div>
    </section>

    <section>
      <h2>این هفته</h2>
      ${wk ? `
        ${facts(wk.outs.map((o, i) => [`${esc(o.t)}${has(o.days) ? `، ${esc(o.days)}` : ''}`, `${esc(o.min)}${(() => { const n = db.tplans.filter((p) => p.week === wk.id && p.out !== '' && +p.out === i && p.done && p.done !== 'no').length; return n ? `، ${fa(n)} روز` : ''; })()}`]))}
        ${has(wk.fix) ? `<p class="goal-line">تنها اصلاح این هفته: ${esc(wk.fix)}</p>` : ''}
        ${wk.mode === 'pool' ? '<p class="fine">هفتهٔ مخزنی: هر شب یکی از این‌ها را بردار. سه چهار روز که اجرا شد، برنامهٔ هفتگی را برگردان.</p>' : ''}`
      : `<p class="empty">جلسهٔ هفتگی این هفته برگزار نشده. همیشه با بررسی شروع می‌شود، نه با آرزوی تازه.</p>
        <button class="btn primary big" data-act="new-week">جلسهٔ هفتگی، بیست دقیقه</button>`}
    </section>

    <section>
      <h2>کارت و ثبت</h2>
      ${cur ? `<p class="goal-line">${lockLine(cur)}</p>${has(cur.first) ? `<p class="count">نقطهٔ شروع: ${esc(cur.first)}</p>` : ''}` : '<p class="empty">واحد برنامه خروجی است، نه ساعت. یک کار اصلی، نه بیشتر.</p>'}
      ${!planFor(tomorrowKey()) ? `<button class="btn ${rv ? '' : 'primary '}big" data-act="new-tplan">کارت ${planFor(today()) || new Date().getHours() >= 15 ? 'فردا' : 'امروز'}، پنج دقیقه</button>` : ''}
      ${rv ? `<button class="btn primary big" data-act="lab-view" data-view="time">ثبت شبانهٔ ${dayWord(rv)}، نود ثانیه</button>` : ''}
    </section>

    <section>
      <h2>چهارده روز${dayNo <= 14 ? `، روز ${fa(dayNo)}` : ''}</h2>
      <table class="result calm">
        <thead><tr><th>روز</th><th>کار اصلی</th><th>وضعیت</th><th>تخمین / واقعی</th><th>مانع</th></tr></thead>
        <tbody>${days.filter((d) => d.past).map((d) => `<tr><th>${weekdayFa(d.ts)}</th>
          <td>${d.p ? esc(d.p.task.slice(0, 26)) : 'بدون کارت'}</td><td>${d.p ? markOf(d.p) : '·'}</td>
          <td>${d.p ? `${fa(d.p.minutes)} / ${d.p.actual > 0 ? fa(d.p.actual) : '·'}` : '·'}</td><td>${esc(d.p?.block || '') || '·'}</td></tr>`).join('')}</tbody>
      </table>
      <p class="fine">✓ انجام شد، ~ بخشی یا فقط نسخهٔ حداقلی، ✗ نشد. روزی که فقط حداقلی انجام شد صفر نیست. خانهٔ خالی را فردا دوبرابر پر نکن.</p>
      ${diag.map(([text, view, label]) => `<p class="advice">${text}</p>${view ? `<button class="btn big" data-act="lab-view" data-view="${view}">${label}</button>` : ''}`).join('')}
      <div class="field"><span>چیزی هست که جدول نشان نمی‌دهد؟</span>
        ${pick('data-db', 'loop.snag', Object.entries(LOOP_SNAGS).map(([key, v]) => [key, v[0]]), L.snag, 'گیر کار', 'نه، همین است')}</div>
      ${LOOP_SNAGS[L.snag] ? `<p class="advice">${LOOP_SNAGS[L.snag][1]}</p>` : ''}
    </section>

    <section>
      <h2>حلقه بسته می‌شود؟</h2>
      ${goalList(crit)}
      <p>${met >= 5 ? 'سیستم کار می‌کند. فاصلهٔ «گفتم انجام می‌دهم» و «انجام دادم» کم شده؛ حالا می‌شود دقیق‌ترش کرد.'
        : dayNo > 14 ? 'دور اول تمام شد و هنوز چند نشانه مانده. همین حلقه را کوچک‌تر کن، نه سخت‌گیرانه‌تر.'
        : 'معیار بیشترشدن ساعت نیست؛ نزدیک‌شدن برنامه به واقعیت است.'}</p>
      ${dayNo > 14 ? '<button class="btn big" data-act="loop-again">یک دور چهارده‌روزهٔ دیگر</button>' : ''}
    </section>
    <button class="btn link" data-act="loop-reset">حلقهٔ تازه از صفر</button>`;
}

function viewAttn() {
  const t = db.attn;
  const head = `<header class="top">${labBack}<h1>نقشهٔ توجه</h1>
    <p>«تمرکز ندارم» پنج چیز متفاوت است. اول ببین کدام است؛ درمان بعد.</p></header>`;
  if (!t) {
    return `${head}
      <ol class="steps">
        <li>سه جلسه در یک هفته، با همان درس این روزها؛ هرکدام ۱۵ تا ۲۵ دقیقه.</li>
        <li>زنگ بی‌صدا هر پنج دقیقه: یکی از سه برچسب را بزن و برگرد. هر پرش را با مقصدش ثبت کن.</li>
        <li>آخر جلسه سه عدد، دو خط از حافظه، و فقط یک مسئلهٔ اصلی.</li>
        <li>در این هفته محیط را عوض نکن و جلسه را طولانی‌تر نکن.</li>
      </ol>
      <button class="btn primary big" data-act="attn-start">شروع سه جلسه</button>`;
  }

  const list = db.sessions.filter((s) => s.ping && s.date >= t.start), last = list[list.length - 1], three = list.length >= 3;
  const jumps = list.flatMap((s) => s.urges), dest = tally(jumps, (u) => u.cause || 'other');
  const out = jumps.filter((u) => sideOf(u.cause) === 'out').length, inn = jumps.filter((u) => sideOf(u.cause) === 'in').length;
  const ratio = avg(list, (s) => realOf(s) / s.studied), issues = tally(list, (s) => s.issue);
  return `${head}
    <section>
      <h2>${three ? 'خط پایه' : `جلسهٔ ${fa(list.length + 1)} از ۳`}</h2>
      ${three ? `
      <div class="verdict three">
        <div><span>پرش در هر جلسه</span><b>${fa1(jumps.length / list.length)}</b></div>
        <div><span>نسبت تمرکز واقعی</span><b>${fa(Math.round(ratio * 100))}٪</b></div>
        <div><span>منبع غالب</span><b>${!out && !inn ? '·' : out >= inn ? 'بیرونی' : 'درونی'}</b></div>
      </div>
      <p class="fine">لازم نیست این عددها بالا باشند؛ لازم است واقعی باشند. همین دو عدد نقطهٔ شروعِ بالابردن ظرفیت است.</p>` : ''}
      <button class="btn ${three ? '' : 'primary '}big" data-act="attn-session">جلسه با نقشهٔ توجه</button>
      <p class="fine">بین جلسه‌ها فقط یک چیز را عوض کن: یا هدف را دقیق‌تر، یا فاصلهٔ زنگ را. وگرنه نمی‌فهمی چه چیزی تشخیص را بهتر کرد.</p>
    </section>

    ${list.length ? `
    <section>
      <h2>جلسه‌ها</h2>
      <table class="result calm">
        <thead><tr><th>جلسه</th><th>پرش</th><th>تمرکز</th><th>شبه</th><th>پرت</th><th>نسبت</th><th>دو خط</th></tr></thead>
        <tbody>${list.slice(-6).map((s) => `<tr><th>${weekdayFa(s.date)}</th><td>${fa(s.urges.length)}</td><td>${fa(realOf(s))}</td><td>${fa(s.pseudo || 0)}</td><td>${fa(awayOf(s))}</td>
          <td>${fa(Math.round((realOf(s) / s.studied) * 100))}٪</td><td>${twoLines(s) ? '✓' : '✗'}</td></tr>`).join('')}</tbody>
      </table>
      <p class="fine">عددها به دقیقه‌اند. «دو خط» یعنی در آزمون کتاب‌بسته چیزی از حافظه نوشتی؛ تنها داور بیرونی همین است.</p>
      <p class="goal-line">${mapSentence(last)}</p>
      ${dest.length ? `<h2>مقصد پرش‌ها</h2>${bars(dest, CAUSES)}` : ''}
      ${issues.length ? `<h2>مسئلهٔ اصلی</h2>${bars(issues, ISSUES)}<p class="advice">${ISSUES[issues[0][0]].advice}</p>` : ''}
      ${three && dest[0] && ['phone', 'notif', 'tab'].includes(dest[0][0]) ? '<button class="btn big" data-act="lab-view" data-view="digital">محیط دیجیتال</button>' : ''}
      ${three && issues[0]?.[0] === 'outer' && dest[0] && ['up', 'noise'].includes(dest[0][0]) ? '<button class="btn big" data-act="lab-view" data-view="env">بازطراحی محیط</button>' : ''}
    </section>` : ''}

    ${three ? `
    <section>
      <h2>بعد از جلسهٔ سوم</h2>
      ${dbText('فقط یک تغییر کوچک برای هفتهٔ بعد', 'attn.change', t.change, 'مثلاً: هدف را با شمارهٔ صفحه می‌نویسم')}
      ${dbText('تفاوت تمرکز، شبه‌تمرکز و حواس‌پرتی، با مثالی از جلسهٔ خودم', 'attn.explain', t.explain, 'مثلاً: دقیقهٔ ده چشمم روی متن بود ولی…')}
    </section>` : ''}

    <section>
      <h2>چیزی درست کار نمی‌کند؟</h2>
      ${pick('data-db', 'attn.snag', Object.entries(ATTN_SNAGS).map(([key, v]) => [key, v[0]]), t.snag, 'گیر کار', 'نه، همین است')}
      ${ATTN_SNAGS[t.snag] ? `<p class="advice">${ATTN_SNAGS[t.snag][1]}</p>` : ''}
    </section>

    <section>
      <h2>تشخیص به کار می‌آید؟</h2>
      ${goalList([
        ['سه جلسه با هدف یک‌جمله‌ای و نقشه', list.length, 3],
        ['دو خط از حافظه، در دو جلسه از سه', list.slice(-3).filter(twoLines).length, 2],
        ['مسئلهٔ غالب با اسم مشخص، نه «تمرکز ندارم»', three && ISSUES[last.issue] ? 1 : 0, 1],
        ['توضیح تفاوت‌ها با مثال خودم', has(t.explain) ? 1 : 0, 1],
        ['جلسه‌ها طولانی‌تر نشدند', three && list.every((s) => s.minutes <= 25) ? 1 : 0, 1],
      ])}
      <p class="fine">موفقیت این هفته بیشتر نشستن نیست. این است که بدانی توجهت چه انتخابی کرد، چقدر ماند و از کجا رفت.</p>
    </section>
    <button class="btn link" data-act="attn-reset">سه جلسهٔ تازه از صفر</button>`;
}

function viewStart() {
  const L = db.startLab;
  const head = `<header class="top">${labBack}<h1>ورود کوچک</h1>
    <p>مشکل خواستن نیست؛ فاصلهٔ «الان شروع می‌کنم» تا اولین کار واقعی روی درس است.</p></header>`;
  if (!L) {
    return `${head}
      <ol class="steps">
        <li>حرکت اول را از قبل بنویس و به یک نشانهٔ بیرونی گره بزن.</li>
        <li>سر نشانه فقط پنج دقیقه؛ بعدش واقعاً آزادی ادامه بدهی یا بایستی.</li>
        <li>هر جلسه را با نوشتن حرکت اولِ جلسهٔ بعد تمام کن.</li>
        <li>هفت روز. ساعت مطالعه معیار نیست؛ فقط شروع‌ها شمرده می‌شوند.</li>
      </ol>
      <button class="btn primary big" data-act="start-start">شروع هفت روز</button>`;
  }

  const dayNo = baseDayNo(L), days = startDays(L), b = L.base || {}, draft = db.labDraft || {};
  const baseLag = avg([b.d1, b.d2, b.d3].filter((x) => x != null), (x) => x);
  const inDays = days.filter((d) => d.in), lagged = inDays.filter((d) => d.lag != null), lag = avg(lagged, (d) => d.lag);
  const low = days.filter((d) => d.mood === 'low'), kinds = inDays.filter((d) => d.kind);
  const ss = db.sessions.filter((s) => s.date >= startOfDay(L.start) && s.date < addDays(L.start, 7));
  const stops = db.starts.filter((x) => x.after === 'stop' && x.date >= startOfDay(L.start)).length;
  const block = tally(db.starts.filter((x) => !entered(x) && x.date >= startOfDay(L.start)), (x) => x.block)[0]?.[0];
  const ended = dayNo > 7 || ss.length >= 5;
  const okRate = inDays.length >= 5, okLag = lagged.length >= 3 && (lagged.filter((d) => d.lag <= 5).length * 2 > lagged.length || (baseLag != null && lag < baseLag * 0.7));
  if (ended) L.seen = true;
  const AFTER = { go: 'ادامه', more: 'بازهٔ دیگر', stop: 'توقف', miss: 'نشد' };

  return `${head}
    <section>
      <h2>الگوی فعلی</h2>
      <p>سه بار اخیری که دیر شروع کردی: از قرار تا اولین کار روی درس چند دقیقه شد؟</p>
      <div class="grid2">
        ${dbNum('بار اول', 'startLab.base.d1', b.d1, 'دقیقه.')}${dbNum('بار دوم', 'startLab.base.d2', b.d2, 'دقیقه.')}
        ${dbNum('بار سوم', 'startLab.base.d3', b.d3, 'دقیقه.')}
      </div>
      ${dbText('معمولاً درست قبل از شروع، من…', 'startLab.base.habit', b.habit, 'مثلاً: «فقط یک نگاه» به پیام‌ها می‌اندازم')}
      ${baseLag != null ? `<p class="count">خط پایه: حدود ${fa(Math.round(baseLag))} دقیقه تأخیر.</p>` : ''}
    </section>

    <section>
      <h2>امروز</h2>
      ${db.landing ? `<p class="goal-line">${has(db.landing.when) ? `اگر ${esc(db.landing.when)}، آنگاه ` : ''}${esc(db.landing.text)}</p>` : '<p class="empty">حرکت اول هنوز نوشته نشده. در صفحهٔ جلسه، «آنگاه» همان است.</p>'}
      <button class="btn primary big" data-act="new-session">جلسه با ورود پنج‌دقیقه‌ای</button>
      <button class="btn big" data-act="new-quick">شروع ۶۰ ثانیه‌ای</button>
      <div class="field"><span>شروع نشد؟ فقط یک مانع</span>
        <div class="row wide">
          ${pick('data-db', 'labDraft.block', Object.entries(HURDLES).map(([key, v]) => [key, v[0]]), draft.block, 'مانع شروع', 'انتخاب کن')}
          <button class="btn quiet" data-act="start-miss">ثبت</button>
        </div>
        <small>سرزنش نه؛ مانع را ثبت کن و فقط یک چیز را عوض کن.</small></div>
      ${HURDLES[draft.block] ? `<p class="advice">${HURDLES[draft.block][1]}</p>${HURDLES[draft.block][2] ? '<button class="btn big" data-act="lab-view" data-view="' + HURDLES[draft.block][2] + '">باز کن</button>' : ''}` : ''}
    </section>

    <section>
      <h2>هفت روز${dayNo <= 7 ? `، روز ${fa(dayNo)}` : ''}</h2>
      <table class="result calm">
        <thead><tr><th>روز</th><th>حال</th><th>تأخیر</th><th>ورود</th><th>اولین کار</th><th>بعدش</th><th>ورود بعدی</th></tr></thead>
        <tbody>${days.map((d) => `<tr><th>${weekdayFa(d.ts)}</th><td>${MOODS[d.mood] || '·'}</td><td>${d.lag != null ? fa(d.lag) : '·'}</td>
          <td>${d.n ? (d.in ? '✓' : '✗') : '·'}</td><td>${{ content: 'درس', prep: 'مقدمات' }[d.kind] || '·'}</td><td>${AFTER[d.after] || '·'}</td><td>${d.n ? (d.next ? '✓' : '✗') : '·'}</td></tr>`).join('')}</tbody>
      </table>
      <p class="fine">از جلسه‌های همین اپ پر می‌شود. تأخیر تقریبی است، به دقیقه؛ وقفهٔ اجباری را تعلل حساب نکن.</p>
    </section>

    ${ended ? `
    <section class="due">
      <h2>تحلیل روز هفتم</h2>
      ${facts([
        ['روزهایی که ورود واقعی رخ داد', `${fa(inDays.length)} از ۷`],
        ['میانگین تأخیر', lag != null ? `${fa1(lag)} دقیقه${baseLag != null ? `، خط پایه ${fa(Math.round(baseLag))}` : ''}` : ''],
        ['شروع در روزهای بی‌حوصله', low.length ? `${fa(low.filter((d) => d.in).length)} از ${fa(low.length)}` : ''],
        ['پرتکرارترین مانع', block ? HURDLES[block][0] : ''],
      ])}
      ${block ? `<p class="advice">${HURDLES[block][1]}</p>` : ''}
      ${dbText('نسخهٔ شخصی شروع من، در یک جمله', 'startLab.recipe', L.recipe, 'ساعت ۱۸، میز کتابخانه، گوشی در کیف، ورود ۵ دقیقه‌ای با نوشتن داده‌های سؤال اول')}
      <p>${okRate && okLag ? 'این روش برای تو کار می‌کند. نسخه‌ات را نگه دار و نقطهٔ ورود بعدی را روزهای خوب هم بنویس.'
        : inDays.length < 3 ? 'حتی با نسخهٔ ۶۰ ثانیه‌ای کمتر از سه روز ورود داشتی. گره احتمالاً در مکانیک شروع نیست؛ مانع را دقیق‌تر پیدا کن.'
        : 'بهتر شده ولی هنوز به آستانه نرسیده. فقط یک اصلاح: نشانهٔ روشن‌تر، حرکت اولِ کوچک‌تر، یا برداشتن یک مانع مشخص. بعد هفت روز دیگر.'}</p>
      ${inDays.length < 3 ? '<button class="btn big" data-act="new-obstacle">مانع را پیدا کن</button>' : ''}
      <button class="btn big" data-act="start-again">هفت روز دیگر</button>
    </section>` : ''}

    <section>
      <h2>شروع قابل‌اعتماد شده؟</h2>
      ${goalList([
        ['ورود واقعی روی درس، پنج روز از هفت', inDays.length, 5],
        ['تأخیر پنج دقیقه یا کمتر، یا آشکارا کمتر از خط پایه', okLag ? 1 : 0, 1],
        ['اولین کار خودِ درس بود، نه آماده‌سازی', kinds.filter((d) => d.kind === 'content').length, Math.max(3, Math.ceil(kinds.length * 0.6))],
        ['شروع در روز بی‌حوصله', low.filter((d) => d.in).length, 1],
        ['نقطهٔ ورود بعدی نوشته شد', inDays.filter((d) => d.next).length, Math.max(3, Math.ceil(inDays.length * 0.6))],
      ])}
      <p class="count">بعد از ورود: ${fa(ss.filter((s) => s.entry).length)} بار ادامه، ${fa(stops)} توقف آگاهانه.</p>
      <p class="fine">ادامه‌دادن و ساعت مطالعه معیار این هفته نیست. اگر ورودها زیاد شده و ادامه‌ها کم است، گام بعدی نگه‌داشتن تمرکز است، نه شروع.</p>
      ${ss.filter((s) => s.entry).length >= 3 && ss.filter((s) => s.entry && s.studied <= s.entry + 1).length * 2 > ss.filter((s) => s.entry).length ? `<p class="advice">${HURDLES.five[1]}</p>` : ''}
    </section>
    <button class="btn link" data-act="start-reset">هفت روز تازه از صفر</button>`;
}

function viewRamp() {
  const R = db.ramp;
  const head = `<header class="top">${labBack}<h1>رمپ ورود</h1>
    <p>نشسته‌ای ولی هنوز وارد نشده‌ای. عمق رفتار است، نه حس: یک کار مطالبه‌گر، بدون جابه‌جایی، با یک ردّ دیدنی.</p></header>`;
  if (!R) {
    return `${head}
      <ol class="steps">
        <li>پارک: بلندترین چیزی که ذهنت را می‌کشد، با زمان برگشتن به آن.</li>
        <li>واحد کار، به‌علاوهٔ یک قدم جایگزین برای وقتِ گیرکردن.</li>
        <li>بارگذاری، حداکثر هشت دقیقه، با لبهٔ آسانِ همان کار. بعد قفل.</li>
        <li>دقیقهٔ ده: «دارم سعی می‌کنم… / قدم بعدی‌ام…». نشد، کوچک‌ترین قدم؛ نه شروع از نو.</li>
        <li>چهار بلوک در هفت روز. غرقگی، انگیزه و طول جلسه معیار نیست.</li>
      </ol>
      <button class="btn primary big" data-act="ramp-start">شروع چهار بلوک</button>`;
  }

  const list = rampList().slice(-4), four = list.length >= 4, ok = (s) => rampOk(s, R.base);
  const good = list.filter(ok), bad = list.filter((s) => !ok(s));
  const fail = tally(bad, (s) => s.rampFail)[0]?.[0], fast = good.length ? [...good].sort((x, y) => x.loadMin - y.loadMin)[0] : null;
  return `${head}
    <section>
      <h2>${four ? 'چهار بلوک' : `بلوک ${fa(list.length + 1)} از ۴`}</h2>
      ${dbNum('عدد پایه، اختیاری', 'ramp.base', R.base, 'در یک جلسهٔ معمولیِ بدون رمپ، در پانزده دقیقهٔ اول چند بار برای گوشی یا کار نامربوط قطع کردی؟')}
      <button class="btn ${four ? '' : 'primary '}big" data-act="ramp-session">بلوک با رمپ</button>
      <p class="fine">بلوک ۲۵ تا ۴۵ دقیقه. اگر فقط بیست دقیقه داری، «فشرده» را بزن؛ حذفش نکن.</p>
    </section>

    ${list.length ? `
    <section>
      <h2>بلوک‌ها</h2>
      <table class="result calm">
        <thead><tr><th>بلوک</th><th>مدت</th><th>بارگذاری</th><th>میانی</th><th>قطع</th><th>ردّ</th><th>کتاب‌بسته</th><th>ورود</th></tr></thead>
        <tbody>${list.map((s) => `<tr><th>${weekdayFa(s.date)}</th><td>${fa(s.studied)}</td><td>${fa(s.loadMin ?? 0)}${s.loadMin > 8 ? '!' : ''}</td>
          <td>${{ yes: '✓', rescue: 'نجات' }[s.mid] || '✗'}</td><td>${fa(earlyCuts(s))}</td><td>${traced(s) ? '✓' : '✗'}</td>
          <td>${{ full: 'بله', partial: 'نیمه', none: 'نه' }[s.outcome]}</td><td>${ok(s) ? '✓' : RAMP_FAILS[s.rampFail]?.[0] || '✗'}</td></tr>`).join('')}</tbody>
      </table>
      <p class="fine">مدت و بارگذاری به دقیقه. «قطع» یعنی برداشتن گوشی یا کار نامربوط در پانزده دقیقهٔ اول قفل.</p>
    </section>` : ''}

    ${four ? `
    <section class="due">
      <h2>بعد از بلوک چهارم</h2>
      ${facts([
        ['ورود اتفاق افتاد', `${fa(good.length)} بلوک از ۴`],
        ['تکرارشونده‌ترین علت شکست', fail ? RAMP_FAILS[fail][0] : ''],
        ['سریع‌ترین ورود', fast ? `${weekdayFa(fast.date)}، ${esc(fast.subject)}` : ''],
      ])}
      ${dbText('در آن بلوک چه چیزی فرق داشت؟', 'ramp.diff', R.diff)}
      ${dbText('برای چهار بلوک بعدی فقط یک چیز را عوض می‌کنم', 'ramp.change', R.change, 'هدف مشخص‌تر، واحد کوچک‌تر، یا گوشی بیرون اتاق')}
      <p>${good.length >= 3 ? 'رمپ برای تو کار می‌کند. نشانهٔ پیشرفت بعدی: بارگذاری کوتاه‌تر و بلوک‌های بیشتری که با «گرمم» شروع می‌شوند.'
        : fail === 'lost' || fail === 'tired' ? 'علت غالب از جنس ورود نیست. از این پروتکل بیرون بیا و سراغ همان مانع برو.'
        : 'با بلوک طولانی‌تر تکرارش نکن. فقط تکرارشونده‌ترین علت را برای چهار بلوک بعد عوض کن.'}</p>
      ${fail ? `<p class="advice">${RAMP_FAILS[fail][1]}</p>` : ''}
      <button class="btn big" data-act="ramp-again">چهار بلوک دیگر</button>
    </section>` : ''}

    ${snagBox('ramp.snag', RAMP_SNAGS, R.snag)}

    <section>
      <h2>ورود تکرارپذیر شده؟</h2>
      ${goalList([
        ['ورود موفق، سه بلوک از چهار', good.length, 3],
        ['آزمون کتاب‌بسته «بله» یا «نیمه»، دو بلوک', list.filter((s) => s.outcome !== 'none').length, 2],
        ['برای هر بلوک ناموفق یک علت ثبت شد', list.length && bad.every((s) => s.rampFail) ? 1 : 0, 1],
      ])}
      <p class="fine">ورود موفق: بارگذاری تا هشت دقیقه، دو جملهٔ بررسی میانی، یک ردّ دیدنی، و قطعِ کمتر از عدد پایه. سی دقیقهٔ قفل‌شده عمیق است؛ سه ساعت حضور پراکنده نیست.</p>
    </section>
    <button class="btn link" data-act="ramp-reset">چهار بلوک تازه از صفر</button>`;
}

function viewKeep() {
  const K = db.keep;
  const head = `<header class="top">${labBack}<h1>لنگر، پارک، بازگشت</h1>
    <p>حواس‌پرتی قرار است بیاید. شکست آمدنش نیست؛ نداشتنِ جوابِ ازپیش‌معلوم برای برگشتن است.</p></header>`;
  if (!K) {
    return `${head}
      <ol class="steps">
        <li>لنگر: کار این جلسه و قدم بعدی. قدم بعدی یک عمل است، نه «تمرکز کنم».</li>
        <li>برگهٔ پارک کنار دست؛ گوشی جایی که برای برداشتنش باید بلند شوی.</li>
        <li>هر پرش: نامش را بگو، بپرس «همین حالا لازم است؟»، یک خط، و با یک عمل برگرد.</li>
        <li>همان محرک سه بار در ده دقیقه؟ حذفش کن؛ ارادهٔ بیشتر خرج نکن.</li>
        <li>سه جلسهٔ مشابه. تا تمام نشده، تکنیک تازه اضافه نکن.</li>
      </ol>
      <button class="btn primary big" data-act="keep-start">شروع سه جلسه</button>`;
  }

  const all = keepList(), list = all.slice(-3), three = all.length >= 3, b = K.base || {}, first = all[0];
  const based = b.phone != null || b.long != null, cmp = based ? list : all.slice(1).slice(-2);
  const e0 = b.phone ?? (first ? per30(exitsOf(first), first) : 0), l0 = b.long ?? (first ? per30(longsOf(first), first) : 0);
  const exits = avg(cmp, (s) => per30(exitsOf(s), s)), longs = avg(cmp, (s) => per30(longsOf(s), s));
  const okExit = cmp.length >= 2 && (exits < e0 || exits === 0), okLong = cmp.length >= 2 && (longs < l0 || longs === 0);
  const jumps = list.flatMap((s) => s.urges), seen = jumps.filter((u) => u.cause !== 'real'), quick = seen.filter((u) => !u.long).length;
  const reals = jumps.filter((u) => u.cause === 'real'), noted = reals.filter((u) => u.note).length;
  const top = tally(jumps, (u) => u.cause)[0]?.[0];
  const stale = db.parked.filter((p) => p.date >= K.start && p.state !== 'timed' && (p.state ? dayKey(p.closed) > dayKey(p.date) : dayKey(p.date) < today())).length;
  const row = (s) => {
    const r = s.urges.filter((u) => u.cause === 'real'), kind = tally(s.urges, (u) => jumpType(u.cause))[0]?.[0];
    return `<tr><th>${weekdayFa(s.date)}</th><td>${fa(s.studied)}</td><td>${fa(exitsOf(s))}</td><td>${fa(s.urges.filter((u) => u.cause !== 'real' && !u.long).length)}</td>
      <td>${fa(longsOf(s))}</td><td>${r.length ? `${fa(r.filter((u) => u.note).length)} از ${fa(r.length)}` : '·'}</td><td>${JUMPS[kind] || '·'}</td><td>${has(s.can) ? '✓' : '✗'}</td></tr>`;
  };
  return `${head}
    <section>
      <h2>${three ? 'سه جلسه' : `جلسهٔ ${fa(all.length + 1)} از ۳`}</h2>
      <p>خط پایه: یک جلسهٔ معمولیِ بدون پروتکل، فقط با چوب‌خط. اگر نداری، جلسهٔ اول مبنا می‌شود.</p>
      <div class="grid2">
        ${dbNum('برداشتن گوشی', 'keep.base.phone', b.phone, 'بار.')}${dbNum('پرش بالای پنج دقیقه', 'keep.base.long', b.long, 'بار.')}
      </div>
      ${dbText('جملهٔ اگر، آنگاه من: اگر…', 'guard', db.guard, 'خواستم گروه کلاس را چک کنم', 'آنگاه روی برگه می‌نویسمش و قدم بعدی را انجام می‌دهم.')}
      ${dbCheck('keep.oneWord', K.oneWord, 'نسخهٔ تک‌کلمه‌ای: فکر را فقط با یک کلمه پارک می‌کنم و زمان رسیدگیِ همه ثابت است.')}
      <p class="fine">از اول انتخابش نکن. فقط اگر بعد از یک جلسه دیدی نوشتنِ فکر بیشتر درگیرت می‌کند.</p>
      <button class="btn ${three ? '' : 'primary '}big" data-act="keep-session">جلسه با لنگر و برگهٔ پارک</button>
      <p class="fine">یک جلسهٔ پیوستهٔ ۲۵ تا ۴۰ دقیقه کافی است. اگر وقفه‌ای پیش نیامد، عمداً وقفه نساز.</p>
    </section>

    ${list.length ? `
    <section>
      <h2>جلسه‌ها</h2>
      <table class="result calm">
        <thead><tr><th>جلسه</th><th>دقیقه</th><th>گوشی</th><th>برگشت</th><th>بلند</th><th>یادداشت</th><th>پرتکرار</th><th>خروجی</th></tr></thead>
        <tbody>${list.map(row).join('')}</tbody>
      </table>
      <p class="fine">گوشی: برداشتن گوشی یا تب نامرتبط. برگشت: پرشی که دیدی و با یک عمل برگشتی. بلند: بیش از پنج دقیقه. یادداشت: یادداشت بازگشت قبل از وقفهٔ واقعی. آمدنِ یک فکر به‌تنهایی پرش نیست.</p>
    </section>` : ''}

    ${three ? `
    <section class="due">
      <h2>بعد از جلسهٔ سوم</h2>
      ${facts([['بیشترین قطع واقعی', top ? CAUSES[top].label : '']])}
      <div class="field"><span>این جزء بیشترین کمک را کرد</span>
        ${pick('data-db', 'keep.part', Object.entries(KEEP_PARTS), K.part, 'جزء پروتکل', 'انتخاب کن')}</div>
      ${dbText('در جلسهٔ بعد فقط همین یک تغییر', 'keep.change', K.change)}
      <p>${okExit || okLong ? 'پروتکل کار کرده. پنج جلسهٔ بعد همین را نگه دار و چیزی به آن اضافه نکن.'
        : 'هیچ‌کدام تغییر نکرده. اول ببین واقعاً اجرا شد یا نه: گوشی دور بود؟ برگه کنار دستت بود؟ اگر بله، فقط شاخه‌ای را دنبال کن که با همین الگوی ثبت‌شده جور است.'}</p>
      ${okLong && !okExit ? '<p class="advice">تعداد پرش کم نشده ولی پرش‌های بلند کوتاه شده‌اند؛ این یعنی کار کرده. مهارت اینجا بازگشت است، نه حذف فکر.</p>' : ''}
      ${top && CAUSES[top] && !(okExit || okLong) ? `<p class="advice">${CAUSES[top].advice}</p>` : ''}
    </section>` : ''}

    ${snagBox('keep.snag', KEEP_SNAGS, K.snag)}

    <section>
      <h2>بازگشت ارزان شده؟</h2>
      ${goalList([
        ['خروج غیرضروری کمتر از خط پایه', okExit ? 1 : 0, 1],
        ['پرش بلند کمتر، و برگشت با یک عمل در بیشتر پرش‌ها', okLong && quick * 2 >= seen.length ? 1 : 0, 1],
        ...(reals.length ? [['یادداشت بازگشت قبل از بیشترِ وقفه‌های واقعی', noted * 2 > reals.length ? 1 : 0, 1]] : []),
        ['خروجی قابل‌بررسی در هر سه جلسه', list.filter((s) => has(s.can)).length, 3],
        ['برگهٔ «بعداً» همان روز خالی شد', three && !stale ? 1 : 0, 1],
      ])}
      <p class="fine">اگر طول جلسه‌ها فرق دارد، عددها به ازای هر سی دقیقه مقایسه می‌شوند. ساعتِ بیشتر پای میز، بدون کم‌شدن این عددها، پیشرفت نیست؛ «انگار بهتر بودم» هم جای چوب‌خط را نمی‌گیرد.</p>
    </section>
    <button class="btn link" data-act="keep-reset">سه جلسهٔ تازه از صفر</button>`;
}

function viewFmt() {
  const L = db.fmtLab;
  const head = `<header class="top">${labBack}<h1>قالب جلسه</h1>
    <p>مدتِ جادویی وجود ندارد. قالب کوتاه ابزار شروع است و بلوک بلند ابزار حفظ پیوستگی.</p></header>`;
  if (!L) {
    return `${head}
      <ol class="steps">
        <li>خروجی جلسه در یک جمله؛ بدون آن، زمان‌سنج فقط مدت نشستن را می‌سنجد.</li>
        <li>دو سؤال: قطع‌شدن وسط این کار چقدر هزینه دارد؟ امروز چیزی محدودم می‌کند؟</li>
        <li>سه مرز: معنای زنگ، ساعت پایان استراحت، و نقطهٔ بازگشت.</li>
        <li>بعد از جلسه یک خط ثبت، و فقط یک تغییر.</li>
        <li>با سه جلسه از یک نوع کار قضاوت کن، نه با یک جلسهٔ بد.</li>
      </ol>
      <button class="btn primary big" data-act="fmt-start">شروع سه جلسه</button>`;
  }

  const all = fmtList(), list = all.slice(-3), six = all.slice(-6), three = all.length >= 3, type = (L.type || '').trim();
  const cuts = list.filter((s) => s.fmtSnag === 'cut').length, tails = list.filter((s) => s.fmtSnag === 'tail').length;
  const clean = list.filter((s) => s.fmtSnag === 'none' && s.outcome !== 'none').length;
  const cur = list[list.length - 1]?.fmt, i = FMT_ORDER.indexOf(cur);
  const move = !three ? '' : cuts >= 2 ? FMT_ORDER[Math.min(3, i + 1)] : tails >= 2 ? FMT_ORDER[Math.max(0, i - 1)] : clean >= 2 ? cur : '';
  const a3 = six.slice(0, 3), b3 = six.slice(3), bad = (l) => l.filter((s) => s.fmtSnag === 'cut' || s.fmtSnag === 'tail').length;
  const lagOf = (l) => avg(l.filter((s) => s.backLag != null), (s) => s.backLag), lagA = lagOf(a3), lagB = lagOf(b3);
  return `${head}
    <section>
      <h2>${three ? 'سه جلسه' : `جلسهٔ ${fa(all.length + 1)} از ۳`}</h2>
      ${dbText('نوع کاری که زیاد تکرار می‌شود', 'fmtLab.type', L.type, 'مثلاً: حل تمرین فیزیک', 'فقط جلسه‌های همین نوع کار شمرده می‌شود. مقایسهٔ مرور واژه با حل مسئلهٔ تازه چیزی دربارهٔ قالب نمی‌گوید.')}
      ${FMT[db.formats[type]] ? `<p class="count">پیش‌فرض فعلی برای «${esc(type)}»: ${FMT[db.formats[type]].label}.</p>` : ''}
      <button class="btn ${three ? '' : 'primary '}big" data-act="fmt-session">جلسهٔ این نوع کار</button>
      <p class="fine">تصمیمِ قبل از جلسه نباید بیش از یک دقیقه طول بکشد. مرددی؟ کار تکه‌تکه با یک نوبت ۲۵ دقیقه‌ای؛ کار پیوسته با انعطاف‌پذیر و سقف چهل.</p>
    </section>

    ${list.length ? `
    <section>
      <h2>جلسه‌ها</h2>
      <table class="result calm">
        <thead><tr><th>جلسه</th><th>قالب</th><th>دقیقه</th><th>خروجی</th><th>زنگ برید</th><th>نیمهٔ دوم</th><th>تأخیر بازگشت</th></tr></thead>
        <tbody>${list.map((s) => `<tr><th>${weekdayFa(s.date)}</th><td>${FMT[s.fmt].label}</td><td>${fa(s.studied)}</td><td>${OUTCOME[s.outcome]}</td>
          <td>${s.fmtSnag === 'cut' ? 'بله' : 'نه'}</td><td>${s.fmtSnag === 'tail' ? 'بی‌حاصل' : '✓'}</td><td>${s.backLag != null ? fa(s.backLag) : '·'}</td></tr>`).join('')}</tbody>
      </table>
      <p class="fine">تأخیر بازگشت به دقیقه؛ با «استراحت با مرز» در پایان جلسه ثبت می‌شود.</p>
    </section>` : ''}

    ${three ? `
    <section class="due">
      <h2>قاعدهٔ تصمیم</h2>
      <p>${cuts >= 2 ? `در دو جلسه زنگ واحد کار را برید. برای این نوع کار یک پله بلندتر یا منعطف‌تر${move !== cur ? `: «${FMT[move].label}»` : '؛ همین قالب با عدد بزرگ‌تر'}.`
        : tails >= 2 ? `در دو جلسه نیمهٔ دوم بی‌حاصل بود. یک پله کوتاه‌تر${move !== cur ? `: «${FMT[move].label}»` : '؛ همین قالب با عدد کوچک‌تر'}، و خروجی کوچک‌تر.`
        : clean >= 2 ? `خروجی انجام شد و هیچ‌کدام از دو مشکل نبود. «${FMT[cur].label}» پیش‌فرضِ این نوع کار.`
        : 'هنوز الگوی روشنی نیست. سه جلسهٔ دیگر با همین قالب، و فقط یک تغییر.'}</p>
      ${move && type ? `<button class="btn big" data-act="fmt-default" data-v="${move}">«${FMT[move].label}» پیش‌فرضِ «${esc(type)}» شود</button>` : ''}
      ${dbText('برای این نوع کار، قالب پیش‌فرض من … است، چون…', 'fmtLab.why', L.why)}
      ${dbText('در روز سخت، آن را تبدیل می‌کنم به…', 'fmtLab.hard', L.hard, 'مثلاً: ده دقیقه با تمدید اختیاری')}
      ${dbText('در سه جلسهٔ بعد فقط این را تغییر می‌دهم', 'fmtLab.change', L.change)}
      <button class="btn big" data-act="fmt-again">سه جلسهٔ دیگر</button>
    </section>` : ''}

    ${snagBox('fmtLab.snag', FMT_SNAGS, L.snag)}

    <section>
      <h2>قالب جا افتاده؟ شش جلسه</h2>
      ${goalList([
        ['قالب و خروجی قبل از شروع مشخص بود', six.length, 5],
        ['خروجی قابل‌بررسی، یا مانعی با اسم مشخص', six.filter((s) => has(s.can) || has(s.gapNote)).length, 4],
        ['قطعِ بدموقع و نیمهٔ بی‌حاصل، کمتر از سه جلسهٔ اول', b3.length === 3 && (bad(b3) < bad(a3) || !bad(b3)) ? 1 : 0, 1],
        ['تأخیر بازگشت از استراحت کمتر شد', lagA != null && lagB != null && (lagB < lagA || !lagB) ? 1 : 0, 1],
        ['بسته‌شدن در مرز، بدون تمدید پیاپی', six.filter(inBounds).length, 4],
      ])}
      <p class="fine">اگر مرزها رعایت می‌شود ولی خروجی نیست، قالب اجرا می‌شود اما به یادگیری نمی‌رسد؛ مسئلهٔ بعدی روش مطالعه است. بیشترشدن مدت نشستن، با افت دقت و فهم، موفقیت نیست.</p>
      ${Object.keys(db.formats).length ? `<h2>پیش‌فرض‌های من</h2>
        <ul class="plain">${Object.entries(db.formats).map(([k, v]) => `<li class="line"><span>${esc(k)}: ${FMT[v]?.label || ''}</span><button class="back" data-act="fmt-forget" data-k="${esc(k)}">حذف</button></li>`).join('')}</ul>
        <p class="fine">جا افتاده وقتی برای یک کار تکه‌تکه و یک کار پیوسته بدانی از چه قالبی شروع می‌کنی، روز سخت چطور کوچکش می‌کنی و با چه نشانه‌ای عوضش می‌کنی.</p>` : ''}
    </section>
    <button class="btn link" data-act="fmt-reset">سه جلسهٔ تازه از صفر</button>`;
}

function viewTplan() {
  const a = A(), c = capacity(), m = energyMap(), est = estOf(a), k = coef(), wk = weekNow();
  const lastFix = [...db.tplans].reverse().find((p) => has(p.fix));
  return `
    <header class="flow"><button class="back" data-act="cancel">انصراف</button>
      ${a.capAt ? `<div class="timer small" data-timer="${a.capAt}">${clock(a.capAt - Date.now())}</div>` : ''}
      <h1>کار اولِ ${a.tday === 'today' ? 'امروز' : 'فردا'}</h1></header>
    <p>پنج دقیقه. کارتِ ناتمامِ قابل‌اجرا از کارتِ کاملِ اجرانشده بهتر است.</p>
    ${wk?.outs.length ? `<div class="field"><span>از کدام خروجی هفته؟</span>
      ${pick('data-bind', 'out', wk.outs.map((o, i) => [String(i), `${esc(o.t)}: ${esc(o.min)}`]), a.out, 'خروجی هفته', 'هیچ‌کدام')}</div>` : ''}
    <div class="field"><span>برای کدام روز؟</span>${seg('tday', [['today', 'امروز'], ['tomorrow', 'فردا']], a.tday, 'روز برنامه')}</div>
    <p class="count">${c.cap ? `دقیقهٔ مؤثر: دیروز ${fa(c.y)}، امروز ${fa(c.t)}. سقف واقع‌بینانه: ${fa(c.cap)} دقیقه.` : 'هنوز دقیقهٔ مؤثری ثبت نشده؛ عدد را کوچک بگیر.'}${has(lastFix?.fix) ? `<br>اصلاح قبلی‌ات: ${esc(lastFix.fix)}` : ''}</p>
    ${textField('فقط یک کار سنگین', 'task', a.task, 'مثلاً: ده مسئله از مبحث امروز فیزیک', 'همان که اگر فقط خودش درست انجام شود، روز باخته نیست.')}
    <div class="field"><span>زمانش را از کجا می‌دانم؟</span>
      ${seg('hist', [['yes', 'آخرین‌بارِ کار مشابه'], ['no', 'حدس اول']], a.hist, 'مبنای برآورد')}</div>
    ${numField(a.hist === 'no' ? 'اولین عددی که به ذهنم می‌رسد' : 'آخرین‌بار چند دقیقه طول کشید؟', 'base', a.base, k ? `در ضریب خطای خودت، ${fa1(k)}، ضرب می‌شود.` : a.hist === 'no' ? 'سی درصد رویش می‌آید؛ ذهن همیشه بهترین سناریو را می‌بیند.' : 'بیست درصد رویش می‌آید، حتی اگر مطمئنی این بار سریع‌تر است.')}
    <p class="goal-line" id="est-out">${est ? `برآورد قفل‌شده: ${fa(est)} دقیقه` : 'برآورد: هنوز عددی ننوشته‌ای'}</p>
    <div class="field"><span>پنجرهٔ اوج</span>
      <div class="grid2">
        <input type="time" data-bind="from" value="${esc(a.from || '')}" aria-label="شروع پنجرهٔ اوج">
        <input type="time" data-bind="to" value="${esc(a.to || '')}" aria-label="پایان پنجرهٔ اوج">
      </div>
      <small>${m.peak >= 0 ? `اوج تو از روی ثبت‌ها: ${SLOTS[m.peak]}. ` : ''}اگر بهترین ساعتت قفل است، بهترین پنجرهٔ در دسترس را بنویس. در این پنجره فقط همین کار.</small></div>
    <div class="field"><span>پنجرهٔ جایگزین</span>
      <div class="grid2">
        <input type="time" data-bind="altFrom" value="${esc(a.altFrom || '')}" aria-label="شروع پنجرهٔ جایگزین">
        <input type="time" data-bind="altTo" value="${esc(a.altTo || '')}" aria-label="پایان پنجرهٔ جایگزین">
      </div></div>
    ${aiPart('tplan', 'نسخهٔ کوچک و نقطهٔ شروع از هوشواره')}
    ${textField('نسخهٔ کوچکِ همان کار', 'small', a.small, 'مثلاً: چهار مسئله به‌جای ده تا', 'چتر نجات روز بد: کوچک‌ترین کاری که روز را از صفر نجات می‌دهد.')}
    ${textField('نقطهٔ شروع', 'first', a.first, 'مثلاً: فایل تمرین را باز می‌کنم و فقط سؤال اول را حل می‌کنم', 'اولین عملِ خیلی مشخص؛ فقط شروع را معلوم کن، نه دقیقه‌به‌دقیقهٔ روز را.')}
    ${textField('نشانهٔ شروع، اگر ساعت‌هایت به‌هم می‌ریزد', 'cue', a.cue, 'مثلاً: بعد از ناهار / به‌محض برگشتن از کلاس', 'اختیاری. نشانهٔ رویدادی در زندگی نامنظم از ساعت پایدارتر است.')}

    <fieldset class="group"><legend>کار دوم، اختیاری</legend>
      <p class="fine">حداکثر دو تا، و فقط اگر وقت یا انرژی ماند. دستهٔ هر کار را بار ذهنی‌اش تعیین می‌کند.</p>
      ${a.tasks.length ? `<ul class="plain">${a.tasks.map((t, i) => `<li class="line"><span>${esc(t.name)}، ${LOADS[t.load]} در ${WINS[t.win]}، ${fa(t.min)} دقیقه</span><button class="back" data-act="tplan-del" data-i="${i}">حذف</button></li>`).join('')}</ul>` : ''}
      <div class="row">
        <input type="text" data-bind="tName" value="${esc(a.tName || '')}" placeholder="مثلاً: مرور فلش‌کارت" aria-label="نام کار">
        <input type="number" inputmode="numeric" min="1" class="mini" data-bind="tMin" data-num value="${a.tMin ?? ''}" placeholder="دقیقه" aria-label="دقیقه">
      </div>
      <div class="field"><span>بار ذهنی</span>${seg('tLoad', Object.entries(LOADS), a.tLoad, 'بار ذهنی کار')}</div>
      <div class="field"><span>در کدام پنجره؟</span>${seg('tWin', Object.entries(WINS), a.tWin, 'پنجرهٔ کار')}</div>
      <button class="btn big" data-act="tplan-add">افزودن به برنامه</button>
    </fieldset>
    ${planChecks({ minutes: est, tasks: a.tasks }, c.cap).map((x) => `<p class="advice">${x}</p>`).join('')}
    <button class="btn primary big" data-act="tplan-save">قفل کن</button>`;
}

function viewWindow() {
  const a = A(), over = Date.now() >= a.endsAt;
  return `
    <header class="flow"><h1>پنجرهٔ گوشی</h1></header>
    <p>پیام‌ها و شبکه‌ها همین حالا، نه وسط فهمِ پاراگراف بعدی.</p>
    <div class="timer" data-timer="${a.endsAt}">${clock(a.endsAt - Date.now())}</div>
    <p class="timer-note">${over ? 'پنجره بسته شد. گوشی برگردد سر جای خودش.' : 'کوتاه و مشخص. بعدش تا جلسهٔ بعد بسته می‌ماند.'}</p>
    <button class="btn primary big" data-act="close">${over ? 'برگشت به امروز' : 'زودتر بستم'}</button>`;
}

function viewReread() {
  const e = db.experiment;
  const d = db.labDraft || (db.labDraft = {});
  const score = (f, label) => `<label class="field half"><span>${label}</span>
    <input type="number" inputmode="numeric" min="0" max="10" data-lab="${f}" value="${d[f] ?? ''}" placeholder="از ۱۰"></label>`;
  const head = `<header class="top">${labBack}<h1>روش تو در برابر مغز تو</h1>
    <p>دوباره‌خوانی یا بازیابی؟ یک عدد از عملکرد خودت بگیر.</p></header>`;

  if (!e) {
    return `${head}
      <ol class="steps">
        <li>دو متن حدوداً دوصفحه‌ای با دشواری برابر انتخاب کن؛ موضوعی که کمتر می‌دانی.</li>
        <li><b>متن الف:</b> دو بار کامل بخوان، حدود ۱۵ دقیقه.</li>
        <li><b>متن ب:</b> یک بار بخوان، ببند، هرچه یادت مانده بنویس و بعد با متن اصلاحش کن؛ حدود ۱۵ دقیقه.</li>
        <li>برای هر متن پنج سؤال بساز، بدون نگاه‌کردن جواب بده و از ده به خودت نمره بده.</li>
      </ol>
      <div class="grid2">${score('a1', 'نمرهٔ متن الف، دوباره‌خوانی')}${score('b1', 'نمرهٔ متن ب، بازیابی')}</div>
      <button class="btn primary big" data-act="lab-day1">ثبت نمره‌های امروز</button>`;
  }

  if (!e.later) {
    const wait = e.day1 + 20 * 36e5 - Date.now();
    return `${head}
      <div class="verdict"><div><span>الف، بلافاصله</span><b>${fa(e.a1)}</b></div><div><span>ب، بلافاصله</span><b>${fa(e.b1)}</b></div></div>
      ${wait > 0 ? `<p>حدود ${fa(Math.ceil(wait / 36e5))} ساعت دیگر برگرد. تا آن موقع هیچ‌کدام از دو متن را مرور نکن.</p>` : `
        <p>بدون هیچ مروری، همان پنج سؤال را برای هر دو متن دوباره جواب بده.</p>
        <div class="grid2">${score('a2', 'متن الف، امروز')}${score('b2', 'متن ب، امروز')}</div>
        <button class="btn primary big" data-act="lab-day2">ثبت و دیدن نتیجه</button>`}
      <button class="btn link" data-act="lab-reset">آزمایش را از نو شروع کن</button>`;
  }

  const dropA = e.a1 - e.a2, dropB = e.b1 - e.b2;
  const verdict = e.b2 > e.a2 ? 'بعد از یک روز، بازیابی بیشتر از دوباره‌خوانی در ذهنت نگه داشت.'
    : e.b2 === e.a2 ? 'دو روش برای تو برابر درآمدند. با دو متن دیگر تکرارش کن.'
    : 'نتیجه خلاف انتظار است. اول بررسی کن موقع «ببند» واقعاً متن بسته بود؛ رایج‌ترین دلیل همین است.';
  return `${head}
    <table class="result">
      <thead><tr><th>روش</th><th>بلافاصله</th><th>۲۴ ساعت بعد</th><th>افت</th></tr></thead>
      <tbody>
        <tr><th>الف، دوباره‌خوانی</th><td>${fa(e.a1)}</td><td>${fa(e.a2)}</td><td>${fa(dropA)}</td></tr>
        <tr><th>ب، بازیابی</th><td>${fa(e.b1)}</td><td>${fa(e.b2)}</td><td>${fa(dropB)}</td></tr>
      </tbody>
    </table>
    <p>${verdict}</p>
    <fieldset class="group"><legend>دو عادتِ ناسازگار با مدل</legend>
      <p class="fine">کدام عادت فعلی‌ات با طرز کار توجه و حافظه نمی‌خواند، و از امروز چه چیزی جایش می‌آید؟ مثال: «هایلایت‌کردن هنگام خواندن» ← «بستن کتاب و نوشتن سه خط».</p>
      ${db.habits.map((h, i) => `
      ${dbText(`عادت ${fa(i + 1)}`, `habits.${i}.h`, h.h, 'مثلاً: چک‌کردن پیام وسط درس')}
      ${pick('data-db', `habits.${i}.p`, Object.entries(MODEL), h.p, 'با کدام بخش مدل ناسازگار است؟', 'با کدام بخش ناسازگار است؟')}
      ${dbText('جایگزین از امروز', `habits.${i}.s`, h.s, 'مثلاً: گوشی بیرون اتاق تا آخر جلسه')}`).join('')}
    </fieldset>
    <button class="btn big" data-act="lab-reset">آزمایش تازه با دو متن دیگر</button>`;
}

/* ---------- راهنما ---------- */

// هر بخش تازه‌ای که به اپ اضافه می‌شود، یک ردیف هم اینجا می‌گیرد: [کلید، عنوان، برای چیست، چطور]
const GUIDE = [
  ['start', 'از کجا شروع کنم؟', [
    ['first', 'سه قدم، همین', 'اپ یک کار می‌کند: جلسهٔ مطالعه را با چیزی که واقعاً یاد گرفته‌ای می‌سنجد، نه با ساعت.',
      '۱. «شروع جلسهٔ مطالعه» را بزن و بنویس آخر جلسه باید چه کاری بتوانی. ۲. تایمر که تمام شد منبع را ببند و از حفظ بنویس. ۳. فردا اپ همان مطلب را دوباره از تو می‌پرسد. بقیهٔ بخش‌ها اختیاری‌اند و لازم نیست همه را بلد باشی.'],
  ]],
  ['today', 'زبانهٔ امروز', [
    ['session', 'شروع جلسهٔ مطالعه', 'کار اصلی اپ. قبل از خواندن معلوم می‌کنی آخر جلسه باید چه کاری بتوانی، و بعد با کتابِ بسته خودت را می‌سنجی.',
      'فقط موضوع، هدف، معیار، مدت و جای گوشی را پر کن و «شروع مطالعه» را بزن. بخش‌های تاشوی پایین فرم اختیاری‌اند.'],
    ['quick', 'فقط ۶۰ ثانیه', 'برای وقتی که حوصلهٔ یک جلسهٔ کامل را نداری. فقط یک دقیقه روی اولین حرکت درس می‌مانی.',
      'بزن، یک حرکت کوچک انتخاب کن و یک دقیقه انجامش بده. بعدش آزادی ادامه بدهی یا بایستی.'],
    ['obstacle', 'شروع نمی‌کنم', 'برای وقتی که از درس فرار می‌کنی. به‌جای «تنبلی»، مانع واقعی را پیدا می‌کنی و یک قدم ورودی کوچک برمی‌داری.',
      'مانع را از فهرست انتخاب کن؛ اپ برای همان مانع یک قدم کوچک پیشنهاد می‌دهد.'],
    ['retrieval', 'بازیابی دیروز', 'مطلبی که دیروز خوانده‌ای را امروز از حافظه بیرون می‌کشی تا ماندگار شود.',
      'خودش بالای صفحهٔ امروز ظاهر می‌شود. «بازیابی کن» را بزن و بدون نگاه به منبع بنویس.'],
    ['cards', 'کارت‌های بالای صفحه', 'کارهایی که امروز نوبتشان است: بازیابی، آزمایشی که شروع کرده‌ای، کار اول روز.',
      'دو کارت اول مهم‌ترند. اگر بیشتر باشد، زیر «کار دیگر برای امروز» جمع شده‌اند.'],
    ['chapters', 'انتخاب فصل', 'اپ را خلوت می‌کند: فقط ابزارهای فصل‌هایی را می‌بینی که الان با آن‌ها کار داری.',
      'از ردیف بالای صفحهٔ امروز یک یا چند فصل را بزن؛ «همه» همه‌چیز را برمی‌گرداند. چیزی پاک نمی‌شود: داده‌های فصل‌های پنهان سر جایشان می‌مانند و با انتخاب دوباره برمی‌گردند.'],
    ['day', 'خواب و انرژی', 'خواب دیشب و انرژی‌ات در طول روز را ثبت می‌کنی تا ساعت اوج و فرودت پیدا شود.',
      'روزی یک‌بار، چند ثانیه. بعد از چند روز اپ می‌گوید کار سنگین را کِی بگذاری.'],
    ['manual', 'بدون اپ درس خواندم', 'جلسه‌ای را که بیرون از اپ خوانده‌ای ثبت می‌کنی تا آمارت کامل بماند.',
      'لینک پایین صفحهٔ امروز. فقط مدت و موضوع را می‌خواهد.'],
    ['plans', 'هدف‌های نوشته‌شده', 'هدف جلسه‌ای را که قرار است بعداً بخوانی از قبل می‌نویسی، با لحظهٔ شروعش.',
      'در فرم جلسه «هدف را نگه دار برای همان لحظه» را بزن. وقتش که رسید، از صفحهٔ امروز «الان همان لحظه است» را بزن.'],
    ['parked', 'برگهٔ پارک و هدف‌های نوشته‌شده', 'فکرهای مزاحمی که وسط جلسه کنار گذاشته‌ای و هدف‌هایی که برای بعد نگه داشته‌ای.',
      'فقط وقتی چیزی در آن‌ها باشد دیده می‌شوند. هر خط را انجام بده، زمان بده یا حذف کن.'],
  ]],
  ['trends', 'زبانهٔ روند', [
    ['week', 'عددهای هفته', 'نشان می‌دهد در هفت روز گذشته چند جلسه داشتی و در چندتا به هدف رسیدی.',
      'اول به «به هدف رسید» نگاه کن، نه به دقیقه‌ها. جملهٔ کنار خط قرمز پیشنهاد اپ برای قدم بعدی است.'],
    ['bars', 'شکاف‌ها، وقفه‌ها و مانع‌ها', 'پرتکرارترین دلیل‌های نرسیدن، حواس‌پرتی و شروع‌نکردن تو را می‌شمارد.',
      'بلندترین میله را ببین؛ همان را اول درست کن.'],
    ['signs', 'نشانه‌های جاافتادن', 'فهرست عادت‌هایی که اپ می‌خواهد در تو جا بیفتد، با پیشرفت هر کدام.',
      'بسته است تا صفحه خلوت بماند. هر وقت خواستی بازش کن.'],
  ]],
  ['lab', 'زبانهٔ آزمایش', [
    ['hub', 'آزمایش یعنی چه؟', 'هر آزمایش یک تمرین چندروزه برای حل یک مشکل مشخص است، مثل دیر شروع‌کردن یا حواس‌پرتی.',
      'لازم نیست همه را انجام بدهی. یکی را که به مشکلت می‌خورد باز کن؛ هم‌زمان یکی کافی است. بالای هر آزمایش «این بخش برای چیست؟» را هم داری.'],
    ['baseline', 'سه روز ثبت واقعی', 'قبل از هر تغییری می‌بینی الان واقعاً چقدر و چطور درس می‌خوانی.',
      'سه روز فقط ثبت کن و چیزی را عوض نکن. آخرش یک پروفایل از نقطهٔ شروعت می‌گیری.'],
    ['env', 'بازطراحی محیط مطالعه', 'میز، نور، صدا و جای گوشی را یک‌بار درست می‌چینی.',
      'شش عامل را یکی‌یکی بررسی و اصلاح کن، با همین وسایلی که داری.'],
    ['digital', 'هفت روز محیط دیجیتال', 'اعلان‌ها و دسترسی به گوشی را طوری می‌چینی که وسط درس مزاحم نشوند.',
      'روز اول تنظیم کن؛ شش روز بعد فقط اجرا و هر روز یک ثبت کوتاه.'],
    ['time', 'معماری زمان', 'هر شب کار اول فردا را با ساعت مشخص و یک نسخهٔ کوچک جایگزین می‌چینی.',
      'شب‌ها پنج دقیقه: کار اول، بهترین ساعت، نسخهٔ کوچک. فردا همان را روی صفحهٔ امروز می‌بینی.'],
    ['loop', 'حلقهٔ سبک برنامه', 'برنامه‌ریزی را سبک نگه می‌دارد: کارت روزانه و هفته‌ای فقط یک اصلاح.',
      'چهارده روز: هر روز کارت و ثبت کوتاه، هر هفته یک جلسهٔ بیست‌دقیقه‌ای.'],
    ['start', 'ورود کوچک', 'برای کسی که شروع‌کردن برایش سخت است. فاصلهٔ «الان شروع می‌کنم» تا کار واقعی را کوتاه می‌کند.',
      'هفت روز، هر روز یک ورود پنج‌دقیقه‌ای روی اولین حرکت درس.'],
    ['attn', 'نقشهٔ توجه', 'می‌فهمی وسط جلسه توجهت واقعاً کجاست: روی کار، ظاهراً روی کار، یا جای دیگر.',
      'سه جلسه با زنگ بی‌صدا. هر بار فقط یکی از سه برچسب را بزن.'],
    ['ramp', 'رمپ ورود', 'برای وقتی که پشت میز نشسته‌ای ولی وارد کار سخت نمی‌شوی.',
      'چهار بلوک: چند دقیقه شروع آسان، بعد قفل روی کار اصلی.'],
    ['keep', 'لنگر، پارک، بازگشت', 'یاد می‌گیری حواس‌پرتی را زود ببینی و با یک حرکت برگردی.',
      'سه جلسه: هر فکر مزاحم را روی برگهٔ پارک بنویس و برگرد سر قدم بعدی.'],
    ['fmt', 'قالب جلسه', 'پیدا می‌کنی برای هر نوع کار، جلسهٔ کوتاه بهتر جواب می‌دهد یا بلند.',
      'سه جلسه با یک نوع کار و یک قالب ثابت؛ بعدش پیش‌فرض خودت را داری.'],
    ['myths', 'هفت روز «افسانه یا داده؟»', 'باورهای قدیمی‌ات دربارهٔ درس‌خواندن را با تجربهٔ خودت محک می‌زنی.',
      'هر روز یک باور، یک قانون «اگر، آنگاه»، و آخر روز ثبت نتیجه.'],
    ['reread', 'دوباره‌خوانی در برابر بازیابی', 'خودت می‌بینی دوباره‌خواندن بهتر جواب می‌دهد یا از حفظ نوشتن.',
      'دو متن کوتاه، دو روش، و فردا یک آزمون از هر دو.'],
  ]],
  ['book', 'زبانهٔ کتاب', [
    ['read', 'خواندن فصل‌ها', 'متن کامل فصل‌های کتاب، بی‌هیچ تغییری، برای وقتی که می‌خواهی خودِ فصل را بخوانی نه اینکه تمرینش را اجرا کنی.',
      'روی یک فصل بزن و بخوان. با فهرست بالای فصل به هر بخش می‌پری. اپ یادش می‌ماند تا کجا خوانده‌ای و دفعهٔ بعد از همان‌جا باز می‌کند.'],
  ]],
  ['settings', 'زبانهٔ تنظیمات', [
    ['theme', 'رنگ‌بندی', 'ظاهر اپ را عوض می‌کند: آبی و سرخ، یا سبز و طلایی و سفید؛ هر کدام روشن یا تیره. هیچ چیز دیگری تغییر نمی‌کند.', 'رنگ را از ردیف بالا و روشن یا تیره را از ردیف پایین انتخاب کن. «مثل گوشی» یعنی با حالت خودِ گوشی عوض شود. انتخابت روی همین گوشی می‌ماند.'],
    ['notif', 'هشدار پایان تایمر', 'وقتی اپ در پس‌زمینه است، پایان تایمر را خبر می‌دهد.', 'یک‌بار «روشن‌کردن اعلان» را بزن.'],
    ['ai', 'هوشواره', 'کمک‌یار اختیاری که هدف را دقیق‌تر می‌کند و هفته‌ات را تحلیل می‌کند. اپ بدون آن هم کامل است.',
      'کلید API را وارد کن. فقط وقتی دکمه‌اش را بزنی درخواست می‌رود و روی ارزان‌ترین حالت تنظیم است.'],
    ['account', 'حساب', 'داده‌هایت را روی اینترنت هم نگه می‌دارد تا با عوض‌شدن گوشی یا پاک‌شدن مرورگر از بین نرود. هر کس حساب و دادهٔ جدای خودش را دارد.',
      'یک‌بار با ایمیل و رمز حساب بساز. از آن به بعد خودش همگام می‌شود؛ روی گوشی دیگر فقط «ورود» را بزن.'],
    ['data', 'داده‌ها', 'بدون حساب، همه‌چیز فقط روی همین گوشی ذخیره می‌شود.', 'اگر حساب نداری، هر چند وقت یک فایل پشتیبان بگیر؛ با پاک‌شدن مرورگر، داده‌ها هم می‌روند.'],
  ]],
];
const GUIDE_BY = Object.fromEntries(GUIDE.flatMap(([, , items]) => items.map((g) => [g[0], g])));
// هر ردیف راهنما مال کدام فصل است؛ هرچه اینجا نیست زیر «بقیه» است. کتاب و تنظیمات همیشه هستند.
const GUIDE_CH = { first: 1, session: 1, chapters: 1, week: 1, bars: 1, obstacle: 2, retrieval: 3, cards: 3, hub: 3, reread: 3, myths: 4, baseline: 5, day: 5, manual: 5, plans: 6 };
const guideOn = (group, key) => group === 'book' || group === 'settings' || chOn(GUIDE_CH[key] ?? 0);
const tip = (k) => (GUIDE_BY[k] ? fold('tip-' + k, 'این بخش برای چیست؟', `<p>${GUIDE_BY[k][2]}</p><p class="count">${GUIDE_BY[k][3]}</p>`) : '');
const helpBtn = (focus) => `<button class="back help" data-act="guide" data-focus="${focus}">راهنما</button>`;

function viewGuide() {
  return `
    <header class="flow"><button class="back" data-act="cancel">بستن راهنما</button><h1>راهنمای اپ</h1></header>
    <p class="count">هر بخش برای چیست و چطور از آن استفاده کنی. روی هر عنوان بزن.</p>
    ${GUIDE.map(([k, title, items]) => [k, title, items.filter(([key]) => guideOn(k, key))]).filter(([, , items]) => items.length).map(([k, title, items]) => fold('g-' + k, title, items.map(([, t, what, how]) => `
      <div class="guide-item"><b>${t}</b><p>${what}</p><p class="count">${how}</p></div>`).join(''), k === A().focus || k === 'start')).join('')}`;
}

function viewSettings() {
  const perm = 'Notification' in window ? Notification.permission : 'unsupported';
  return `
    <header class="top"><h1>تنظیمات</h1></header>
    <section>
      <h2>رنگ‌بندی</h2>
      <div class="themes">${Object.entries(THEMES).map(([k, [name, , sw]]) => `
        <button data-act="theme" data-theme="${k}" aria-pressed="${theme === k}"><i>${sw.map((c) => `<b style="background:${c}"></b>`).join('')}</i>${name}</button>`).join('')}</div>
      <div class="themes three">${Object.entries(MODES).map(([k, name]) => `
        <button data-act="mode" data-mode="${k}" aria-pressed="${mode === k}">${name}</button>`).join('')}</div>
    </section>
    <section>
      <h2>هشدار پایان تایمر</h2>
      <p>${perm === 'granted' ? 'اعلان روشن است. وقتی اپ در پس‌زمینه باز باشد، پایان تایمر را خبر می‌دهد.'
        : perm === 'denied' ? 'اعلان در تنظیمات مرورگر مسدود شده است. از همان‌جا می‌توانی آزادش کنی.'
        : perm === 'unsupported' ? 'این مرورگر اعلان ندارد. تایمر با صدا و لرزش خبر می‌دهد.'
        : 'تایمر با صدا خبر می‌دهد. برای وقتی که اپ در پس‌زمینه است، اعلان را روشن کن.'}</p>
      ${perm === 'default' ? '<button class="btn big" data-act="notif">روشن‌کردن اعلان</button>' : ''}
      <p class="fine">یادآور «بازیابی فردا» با بازکردن اپ نشان داده می‌شود. برای یادآور سر ساعت، بعد از هر جلسه آن را به تقویم گوشی اضافه کن.</p>
    </section>
    <section>
      <h2>هوشواره</h2>
      <p>${aiCfg.key ? 'روشن است. هر جا دکمه‌اش را ببینی، فقط با زدنِ خودت یک درخواست کوتاه می‌رود.' : 'اختیاری است و اپ بدون آن کامل کار می‌کند. با کلید API کلاود روشن می‌شود.'}</p>
      <label class="field"><span>کلید API کلاود</span>
        <input type="password" data-ai="key" value="${esc(aiCfg.key)}" placeholder="sk-ant-…" autocomplete="off" spellcheck="false" dir="ltr">
        <small>از console.anthropic.com بگیر. فقط روی همین دستگاه می‌ماند، وارد فایل پشتیبان نمی‌شود و فقط به خودِ Anthropic فرستاده می‌شود.</small></label>
      ${aiCfg.key ? `<div class="field"><span>مدل</span>${pick('data-ai', 'model', Object.entries(AI_MODELS).map(([k, v]) => [k, v[0]]), aiCfg.model, 'مدل هوشواره')}
        <small>Haiku برای همهٔ کارهای این اپ کافی است و حدود بیست برابر از Sonnet ارزان‌تر.</small></div>
      <div class="field"><span>سقف درخواست در روز</span>${pick('data-ai', 'cap', [[10, '۱۰'], [30, '۳۰'], [100, '۱۰۰']], aiCfg.cap, 'سقف روزانه')}</div>
      <button class="btn big ai" data-act="ai-test"${aiBusy ? ' disabled' : ''}>${aiBusy === 'test' ? 'در حال آزمودن…' : 'آزمودن کلید'}</button>
      ${facts([
        ['درخواست‌ها، امروز', db.ai.calls ? `${fa(db.ai.calls)}، ${fa(db.ai.day === today() ? db.ai.dayCalls : 0)}` : ''],
        ['توکن ورودی و خروجی', db.ai.calls ? `${fa(db.ai.tin)} و ${fa(db.ai.tout)}` : ''],
        ['هزینهٔ تقریبی تا امروز', db.ai.calls ? `${fa(db.ai.cost.toFixed(4))} دلار` : ''],
      ])}
      <p class="fine">کم‌مصرف چیده شده: مدل ارزان، پاسخ کوتاه، بدون درخواست خودکار، و جواب تکراری از حافظهٔ خود اپ. برای اطمینان، در کنسول Anthropic هم سقف خرج ماهانه بگذار.</p>
      <button class="btn big danger" data-act="ai-off">پاک‌کردن کلید</button>` : ''}
    </section>
    ${!FB.key ? '' : acc.uid ? `<section>
      <h2>حساب</h2>
      <p>با <b dir="ltr">${esc(acc.email)}</b> وارد شده‌ای. ${syncErr ? esc(syncErr) : acc.dirty ? 'تغییرهای تازه تا چند لحظهٔ دیگر به حساب می‌رود.' : 'همه‌چیز با حسابت همگام است.'}</p>
      <button class="btn big" data-act="acc-sync">همین حالا همگام کن</button>
      <button class="btn big danger" data-act="acc-out">خروج از حساب</button>
    </section>` : `<section>
      <h2>حساب</h2>
      <p>اختیاری است. با حساب، داده‌هایت روی اینترنت هم نگه داشته می‌شود و روی هر گوشی که وارد شوی همان را می‌بینی.</p>
      <label class="field"><span>ایمیل</span><input type="email" id="acc-email" autocomplete="email" spellcheck="false" dir="ltr"></label>
      <label class="field"><span>رمز</span><input type="password" id="acc-pass" autocomplete="current-password" dir="ltr">
        <small>دست‌کم ۶ نویسه.</small></label>
      <button class="btn big primary" data-act="acc-go" data-path="signInWithPassword">ورود</button>
      <button class="btn big" data-act="acc-go" data-path="signUp">ساختن حساب تازه</button>
      <button class="btn link" data-act="acc-reset">رمز را فراموش کرده‌ام</button>
    </section>`}
    <section>
      <h2>داده‌ها</h2>
      <p>${acc.uid ? 'داده‌ها هم روی این دستگاه است و هم در حسابت. بدون اینترنت هم کار می‌کند و بعداً همگام می‌شود.' : 'همه‌چیز فقط روی همین دستگاه و همین مرورگر ذخیره می‌شود.'}</p>
      <button class="btn big" data-act="export">گرفتن فایل پشتیبان</button>
      <label class="btn big file">بازگرداندن از فایل پشتیبان<input type="file" accept="application/json" data-import hidden></label>
      <button class="btn big danger" data-act="wipe">پاک‌کردن همهٔ داده‌ها</button>
    </section>`;
}

/* ---------- رندر ---------- */

const TABS = [['today', 'امروز'], ['trends', 'روند'], ['lab', 'آزمایش'], ['book', 'کتاب'], ['settings', 'تنظیمات']];
const FLOWS = { session: viewSession, obstacle: viewObstacle, retrieval: viewRetrieval, day: viewDay, manual: viewManual, pattern: viewPattern, myth: viewMyth, tplan: viewTplan, window: viewWindow, quick: viewQuick, week: viewWeek, rest: viewRest, guide: viewGuide, book: viewBook };

function render() {
  const a = A();
  const app = $('#app');
  // زبانهٔ «آزمایش» فقط وقتی هست که فصل‌های انتخاب‌شده آزمایشی داشته باشند
  const tabs = TABS.filter(([k]) => k !== 'lab' || anyLab());
  if (!tabs.some(([k]) => k === db.tab)) db.tab = 'today';
  const view = a ? FLOWS[a.kind]
    : { today: viewToday, trends: viewTrends, lab: viewLab, book: viewBookTab, settings: viewSettings }[db.tab] || viewToday;
  const html = view();
  // راهنما همه‌جا یک‌جور: دکمه بالای هر زبانه، توضیح کوتاه بالای هر آزمایش
  app.innerHTML = a ? html
    : db.tab === 'lab' && db.lab !== 'hub' && GUIDE_BY[db.lab] ? html.replace('</header>', '</header>' + tip(db.lab))
    : html.replace('<header class="top">', '<header class="top">' + helpBtn(db.tab));
  document.body.classList.toggle('in-flow', !!a);
  document.body.classList.toggle('covered', !!$('.cover'));
  $('#tabs').innerHTML = a ? '' : tabs.map(([k, l]) => `<button data-act="tab" data-tab="${k}"${db.tab === k ? ' aria-current="page"' : ''}>${l}</button>`).join('');
  if (a && a.kind === 'book') bookMount();
  save();
  histSync();
}

/* ---------- دکمهٔ برگشتِ گوشی ---------- */

// هر قدم رو به جلو یک خانه در تاریخچهٔ مرورگر می‌گیرد تا «برگشت» همان یک قدم را برگرداند، نه اینکه اپ را ببندد.
// عمق: امروز = ۰، زبانهٔ دیگر = ۱، یک آزمایشِ باز = ۲، و هر صفحهٔ بازشده (جلسه، راهنما، فصل کتاب) یکی بیشتر.
const depth = () => {
  let d = db.tab === 'today' ? 0 : db.tab === 'lab' && db.lab !== 'hub' ? 2 : 1;
  for (let a = A(); a; a = a.parent) d++;
  return d;
};
let hist = history.state?.d || 0, histHold = false;
history.scrollRestoration = 'manual';

function histSync() {
  if (histHold) return;
  const d = depth();
  // خانه‌ای که بدون لمس کاربر ساخته شود را مرورگر موقع برگشت نادیده می‌گیرد؛ تا اولین لمس صبر می‌کنیم
  if (d > hist && navigator.userActivation && !navigator.userActivation.hasBeenActive) return;
  while (hist < d) history.pushState({ d: ++hist }, '');
  if (d < hist) { histHold = true; history.go(d - hist); }
}

// یک قدم به عقب، همان کاری که دکمهٔ برگشتِ خودِ صفحه می‌کند
function backStep() {
  if (A()) {
    const b = $('#app .back:not(.help)');
    return b ? b.click() : toast('از دکمه‌های همین صفحه ادامه بده.');
  }
  if (db.tab === 'lab' && db.lab !== 'hub') db.lab = 'hub'; else db.tab = 'today';
  render(); window.scrollTo(0, 0);
}

window.addEventListener('popstate', (e) => {
  hist = e.state?.d || 0;
  // برگشتی که خود اپ خواسته بود (بعد از بستن یک صفحه با دکمه)
  if (histHold) { histHold = false; return histSync(); }
  histHold = true;
  for (let d = depth(); d > hist; d = depth()) { backStep(); if (depth() >= d) break; }
  histHold = false;
  histSync();
});

function go(step) { A().step = step; render(); window.scrollTo(0, 0); }
function open(active) { db.active = active; for (const k in folds) delete folds[k]; render(); window.scrollTo(0, 0); }

function newSession(over = {}) {
  const a = {
    kind: 'session', step: 'setup', mode: 'normal', minutes: 25, chunks: [], urges: [],
    feel: 5, outcome: 'partial', gap: 'forgot', entry: db.startLab && baseDayNo(db.startLab) <= 7 ? 5 : 0, ping: 0, pings: [],
    ramp: 0, sheet: true, guard: db.guard || '', ...over,
  };
  a.fmt ||= db.formats[a.wtype] || fmtOf(a.minutes);
  if (!FMT[a.fmt].opts.includes(a.minutes)) applyFmt(a);
  a.ch = [...db.chapters];
  // فقط ابزار فصل ۱: جلسهٔ ساده، بدون تکه‌های فصل‌های دیگر
  if (!chOn(0)) Object.assign(a, { fmt: '', entry: 0, ramp: 0, ping: 0, sheet: false, minutes: LEAN_MIN.includes(a.minutes) || a.minutes === a.short ? a.minutes : 25 });
  return a;
}
const fromLanding = () => (db.landing ? { ifThen: db.landing.text, ifWhen: db.landing.when || '', loadLast: db.landing.at || '' } : {});
const tplanDraft = (over = {}) => ({ kind: 'tplan', hist: 'yes', tasks: [], tLoad: 'mid', tWin: 'mid', openedAt: Date.now(), capAt: Date.now() + 5 * 6e4, ...over });

function applyMode(a) {
  if (a.mode === 'scan') {
    if (!has(a.goal)) a.goal = SCAN_GOAL;
    if (!has(a.criterion)) a.criterion = SCAN_CRITERION;
  } else {
    if (a.goal === SCAN_GOAL) a.goal = '';
    if (a.criterion === SCAN_CRITERION) a.criterion = '';
  }
  if (a.mode === 'min') { a.minutes = 15; if (a.fmt) a.fmt = 'short'; }
}

/* ---------- رویدادها ---------- */

const actions = {
  ...bookActions,
  ch: (el) => {
    const v = el.dataset.ch, n = +v;
    db.chapters = v === 'all' ? [] : db.chapters.includes(n) ? db.chapters.filter((x) => x !== n) : [...db.chapters, n];
    if (db.chapters.length === CHAPTERS.length) db.chapters = [];
    render();
  },
  tab: (el) => { db.tab = el.dataset.tab; if (el.dataset.view) db.lab = el.dataset.view; render(); window.scrollTo(0, 0); },
  'lab-view': (el) => { db.lab = el.dataset.view; render(); window.scrollTo(0, 0); },

  guide: (el) => { db.guideSeen = true; open({ kind: 'guide', focus: el.dataset.focus }); },
  'guide-skip': () => { db.guideSeen = true; render(); },
  'new-session': () => open(newSession(fromLanding())),
  'start-study': () => {
    const a = A();
    const R = chOn(0, a.ch || []);
    if (!has(a.subject) || !has(a.goal)) return toast('موضوع و خروجی جلسه را بنویس.');
    if (!R) {
      if (chOn(3, a.ch) && !a.phonePlace) return toast('بگو گوشی الان کجاست.');
      if (chOn(3, a.ch) && a.phonePlace === 'desk') return toast('اول گوشی را از روی میز بردار؛ کشو، کیف یا بیرون اتاق.');
      if (chOn(6, a.ch) && !has(a.criterion)) return toast('معیار را بنویس: از کجا می‌فهمی رسیده‌ای؟');
      db.plans = db.plans.filter((p) => p.id !== a.planId);
      Object.assign(a, { startedAt: Date.now(), endsAt: Date.now() + a.minutes * 6e4, rang: false, pings: [], entryState: '', rampState: '', anchor: '', signs: [], ext: 0, away: null });
      return go('study');
    }
    if (!has(a.criterion)) return toast('معیار را بنویس: از کجا می‌فهمی رسیده‌ای؟');
    if (!a.phonePlace) return toast('بگو گوشی الان کجاست.');
    if (a.phonePlace === 'desk') return toast('اول گوشی را از روی میز بردار؛ کشو، کیف یا بیرون اتاق.');
    if (a.entry && !has(a.ifThen)) { folds['s-start'] = true; render(); return toast('حرکت اول را در «آنگاه» بنویس: اولین کار روی خودِ درس، حدود دو دقیقه.'); }
    db.plans = db.plans.filter((p) => p.id !== a.planId);
    db.landing = null;
    a.startedAt = Date.now(); a.endsAt = a.startedAt + a.minutes * 6e4; a.rang = false;
    a.pings = []; a.pingDue = false; a.entryMore = 0;
    a.entryState = a.entry ? 'run' : ''; a.entryEndsAt = a.startedAt + a.entry * 6e4;
    a.nextPingAt = a.ping > 0 ? a.startedAt + a.ping * 6e4 : 0;
    db.guard = (a.guard || '').trim();
    if (has(a.park)) park(a.park.trim(), (a.parkWhen || '').trim() || 'بلافاصله بعد از این بلوک', a.subject.trim());
    Object.assign(a, { anchor: a.ifThen || '', signs: [], ext: 0, away: null, rampState: '', mid: '', midDue: false, signDue: false, signStop: false });
    a.nextSignAt = a.fmt === 'flex' ? a.startedAt + 20 * 6e4 : 0;
    if (!a.entry) toLoad(a);
    go('study');
  },
  'entry-go': () => {
    const a = A();
    a.entryState = 'done'; a.entryAfter = a.entryMore ? 'more' : 'go'; a.rang = Date.now() >= a.endsAt;
    if (a.ping > 0) a.nextPingAt = Date.now() + a.ping * 6e4;
    toLoad(a);
    render(); window.scrollTo(0, 0);
  },
  lock: () => { toLock(A()); render(); window.scrollTo(0, 0); toast('قفل. دقیقه‌های اول معمولاً ناخوشایندند؛ قضاوت را به بررسی میانی بسپار.'); },
  'mid-ok': () => {
    const a = A();
    if (!has(a.midTry) || !has(a.midNext)) return toast('هر دو جمله را کامل کن؛ اگر نمی‌شود، «کامل نمی‌شود» را بزن.');
    Object.assign(a, { mid: 'yes', midDue: false, anchor: a.midNext.trim() }); render(); toast('داخلی. ادامه بده.');
  },
  'mid-help': () => { A().midHelp = true; render(); },
  'mid-rescue': () => {
    const a = A();
    if (!has(a.midStep)) return toast('کوچک‌ترین قدم را بنویس و همین حالا بردار.');
    Object.assign(a, { mid: 'rescue', midDue: false, anchor: a.midStep.trim() }); render(); toast('همان بلوک را ادامه بده.');
  },
  signs: () => {
    const a = A(), n = [0, 1, 2].filter((i) => a['sg' + i]).length;
    a.signs.push({ min: elapsedMin(a.startedAt), n });
    Object.assign(a, { sg0: false, sg1: false, sg2: false, signDue: false, signStop: n >= 2, nextSignAt: Date.now() + 10 * 6e4 });
    render(); toast(n >= 2 ? 'دو نشانه: جمع‌بندی کن و بایست.' : 'تا پایان واحد فعلی ادامه بده.');
  },
  extend: () => { const a = A(); a.ext = 1; a.endsAt = Date.now() + 5 * 6e4; a.rang = false; render(); toast('فقط تا پایان همین واحد. ثبت شد.'); },
  stretch: () => { const a = A(); a.minutes += 10; a.stretch = (a.stretch || 0) + 1; a.endsAt = Date.now() + 10 * 6e4; a.rang = false; render(); },
  back: () => {
    const a = A(), w = a.away, gone = Date.now() - w.at;
    a.urges.push({ min: elapsedMin(a.startedAt), at: Date.now(), cause: 'real', before: w.where, note: has(w.where) || has(w.next), long: gone > 5 * 6e4, gone: Math.round(gone / 1000) });
    a.away = null; render();
    toast(has(a.anchor) ? `حالا فقط همین: ${a.anchor}` : 'از آخرین نقطهٔ روشن ادامه بده، نه از اول صفحه.');
  },
  'park-again': (el) => {
    const a = A(), p = db.parked.find((x) => x.id === el.dataset.id);
    p.n++; a.urges.push({ min: elapsedMin(a.startedAt), at: Date.now(), cause: 'thought', before: p.text });
    render(); toast('علامت خورد؛ خط تازه لازم ندارد. برگرد.');
  },
  'park-set': (el) => { Object.assign(db.parked.find((x) => x.id === el.dataset.id), { state: el.dataset.v, closed: Date.now() }); render(); },
  rest: (el) => {
    saveLanding();
    const s = db.sessions.find((x) => x.id === el.dataset.id);
    open({ kind: 'rest', step: 'pick', minutes: FMT[s.fmt]?.rest || 5, from: s.id, next: s.nextFirst || '' });
  },
  'rest-run': () => {
    const a = A();
    if (!has(a.next)) return toast('نقطهٔ بازگشت را بنویس: از کجا شروع می‌کنی؟');
    a.endsAt = Date.now() + a.minutes * 6e4; a.rang = false; go('run');
  },
  'rest-back': () => {
    const a = A(), s = db.sessions.find((x) => x.id === a.from) || {}, lag = Math.max(0, Math.round((Date.now() - a.endsAt) / 6e4));
    s.backLag = lag;
    open(newSession({ subject: s.subject || '', wtype: s.wtype || '', fmt: s.fmt, minutes: s.minutes || 25, cut: s.cut || undefined, load: s.load || undefined, ifThen: a.next.trim(), entry: 0, ramp: s.ramp ? 'hot' : 0 }));
    toast(lag ? `${fa(lag)} دقیقه دیرتر برگشتی؛ ثبت شد.` : 'سر وقت برگشتی.');
  },
  'rest-close': () => { db.active = null; db.tab = 'today'; render(); window.scrollTo(0, 0); },
  'entry-more': () => { const a = A(); a.entryMore++; a.entryEndsAt = Date.now() + 5 * 6e4; a.rang = false; render(); },
  'entry-stop': () => go('stop'),
  'stop-back': () => go(A().kind === 'quick' ? 'run' : 'study'),
  'stop-more': () => actions[A().kind === 'quick' ? 'quick-more' : 'entry-more'](),
  'stop-save': () => {
    const a = A();
    if (!a.reason) return toast('یک دلیل مشخص انتخاب کن.');
    if (!has(a.nextFirst)) return toast('نقطهٔ ورود بعدی را بنویس: از کجا برمی‌گردی؟');
    const subject = (a.subject || '').trim();
    db.starts.push({
      id: uid(), date: Date.now(), subject, first: (a.ifThen || a.line || '').trim(), mood: a.mood || '', quick: a.kind === 'quick',
      entry: a.kind === 'quick' ? 1 : a.entry, more: a.entryMore ?? a.more ?? 0, after: 'stop', reason: a.reason,
      lag: a.lag == null ? null : clamp(a.lag, 0, 180), firstKind: a.firstKind || '', next: true,
    });
    db.landing = { text: a.nextFirst.trim(), when: (a.nextWhen || '').trim(), subject, date: Date.now() };
    db.active = null; db.tab = 'today'; render(); window.scrollTo(0, 0);
    toast('ورود ثبت شد. توقف آگاهانه شکست نیست.');
  },
  ping: (el) => {
    const a = A();
    a.pings.push({ min: elapsedMin(a.startedAt), v: el.dataset.v });
    a.pingDue = false; a.nextPingAt = Date.now() + a.ping * 6e4; render();
    toast(el.dataset.v === 'away' ? 'مقصدش را پایین در «وقفه» بزن و برگرد.' : 'ثبت شد. برگرد سر کار.');
  },

  'new-quick': () => open({ kind: 'quick', step: 'pick', more: 0, subject: db.landing?.subject || '' }),
  'quick-run': () => {
    const a = A();
    if (!has(a.subject)) return toast('فقط اسم درس را بنویس و شروع کن.');
    a.startedAt = Date.now(); a.endsAt = a.startedAt + 6e4; a.rang = false;
    go('run');
  },
  'quick-more': () => { const a = A(); a.more++; a.endsAt = Date.now() + 5 * 6e4; a.rang = false; go('run'); },
  'quick-stop': () => { A().firstKind ??= 'content'; go('stop'); },
  'quick-go': () => {
    const a = A();
    db.starts.push({
      id: uid(), date: Date.now(), subject: a.subject.trim(), first: (a.line || '').trim(), mood: a.mood || '', quick: true,
      entry: 1, more: a.more, after: 'go', lag: null, firstKind: 'content', next: false,
    });
    open(newSession({ subject: a.subject.trim(), mood: a.mood, entry: 0, firstKind: 'content' }));
    toast('راه افتادی. خروجی را کوچک بنویس و همان‌جا ادامه بده.');
  },
  'plan-save': () => {
    const a = A();
    if (!has(a.subject) || !has(a.goal) || !has(a.criterion)) return toast('موضوع، خروجی و معیار را بنویس.');
    if (!has(a.ifWhen) || !has(a.ifThen)) { folds['s-goal'] = folds['s-start'] = true; render(); return toast('لحظهٔ شروع را کامل کن: اگر چه شد، آنگاه چه می‌کنی؟'); }
    db.plans = db.plans.filter((p) => p.id !== a.planId);
    db.plans.push({
      id: uid(), created: Date.now(), mode: a.mode, minutes: a.minutes, subject: a.subject.trim(), goal: a.goal.trim(),
      criterion: a.criterion.trim(), out: (a.out || '').trim(), why: (a.why || '').trim(), ifWhen: a.ifWhen.trim(), ifThen: a.ifThen.trim(),
    });
    db.active = null; db.tab = 'today'; render(); window.scrollTo(0, 0);
    toast('هدف نوشته شد. همان لحظه که رسید، از صفحهٔ امروز شروعش کن.');
  },
  'plan-start': (el) => {
    const { id, created, ...p } = db.plans.find((x) => x.id === el.dataset.id);
    open(newSession({ ...p, planId: id }));
  },
  'plan-drop': (el) => { db.plans = db.plans.filter((p) => p.id !== el.dataset.id); render(); },
  chunk: () => { const a = A(); a.chunkDraft = ''; a.chunkGaps = 0; a.chunkHook = ''; a.chunkTitle = ''; go('chunk'); },
  'chunk-check': () => go('chunk-check'),
  'gaps+': () => { A().chunkGaps++; render(); },
  'gaps-': () => { const a = A(); a.chunkGaps = Math.max(0, a.chunkGaps - 1); render(); },
  'chunk-done': () => {
    const a = A();
    a.chunks.push({ text: a.chunkDraft || '', gaps: a.chunkGaps, hook: a.chunkHook || '', title: (a.chunkTitle || '').trim() });
    go('study');
  },
  urge: () => {
    const a = A(), c = a.urgeCause || '', t = jumpType(c), text = (a.urgeDraft || '').trim(), next = (a.urgeNext || '').trim();
    const clear = () => Object.assign(a, { urgeDraft: '', urgeCause: '', urgeWhen: '', urgeNext: '', urgeLong: false });
    if (t === 'real') {
      a.away = { at: Date.now(), where: text, next };
      if (next) a.anchor = next;
      clear(); render();
      return toast(text || next ? 'یادداشت ماند. وقتی برگشتی اول همین را بخوان.' : 'برو. در اولین لحظهٔ امن بنویس کجا بودی.');
    }
    a.urges.push({ min: elapsedMin(a.startedAt), at: Date.now(), cause: c, before: text, long: !!a.urgeLong });
    if (t === 'thought' && text) park(text, db.keep?.oneWord ? 'ده دقیقه بعد از آخرین جلسهٔ امروز' : (a.urgeWhen || '').trim() || 'بعد از این جلسه', (a.subject || a.task || '').trim());
    clear(); render();
    toast(has(a.anchor) ? `ثبت شد. حالا یک عمل: ${a.anchor}` : 'ثبت شد. برگرد سر همان خط.');
  },
  halve: () => go('halve'),
  'to-study': () => go('study'),
  'halve-done': () => {
    const a = A();
    if (!has(a.goal) || ((chOn(0, a.ch || []) || chOn(6, a.ch || [])) && !has(a.criterion))) return toast('خروجی تازه را بنویس.');
    a.halved = true; go('study');
  },
  stuck: () => {
    const parent = A();
    open({ kind: 'obstacle', step: 'pick', task: parent.subject, obstacle: 'hard', urges: [], parent });
  },
  'to-feel': () => {
    const a = A();
    a.studied = elapsedMin(a.startedAt); a.longest = longestFocus(a);
    const n = a.pings?.length, share = (v) => Math.round((a.studied * a.pings.filter((p) => p.v === v).length) / n);
    if (n) { a.real ??= share('focus'); a.pseudo ??= share('pseudo'); }
    a.real ??= a.studied; a.firstKind ??= 'content';
    go('feel');
  },
  'to-recall': () => { const a = A(); a.recallEndsAt = Date.now() + 5 * 6e4; a.rang = false; go('recall'); },
  'to-compare': () => {
    const a = A();
    if (a.ping) a.issue ??= guessIssue(a);
    a.trace ??= has(a.recall) ? 'explain' : 'none'; a.fmtSnag ??= 'none';
    go('compare');
  },
  'finish-session': () => {
    const a = A();
    const R = chOn(0, a.ch || []);
    if ((R || chOn(6, a.ch || [])) && !a.ran) return toast('بگو معیار را واقعاً اجرا کردی یا نه.');
    const inside = rampOk(a, db.ramp?.base);
    if (a.ramp && !inside && !a.rampFail) return toast('ورود نشد؛ یک علت مشخص انتخاب کن. همین داده است.');
    const real = clamp(a.real, 0, a.studied);
    const s = {
      mood: a.mood || '', entry: a.entry || 0, entryMore: a.entryMore || 0, entryAfter: a.entryAfter || '', firstKind: a.firstKind || '',
      ping: a.ping || 0, pings: a.pings || [], pseudo: clamp(a.pseudo, 0, a.studied - real), issue: a.ping ? a.issue || '' : '',
      id: uid(), date: Date.now(), subject: a.subject.trim(), goal: a.goal.trim(), minutes: a.minutes, studied: a.studied,
      mode: a.mode, criterion: (a.criterion || '').trim(), out: (a.out || '').trim(), why: (a.why || '').trim(), halved: !!a.halved,
      real, longest: clamp(a.longest, 0, a.studied), ran: a.ran || '', can: (a.can || '').trim(),
      chunks: a.chunks, urges: a.urges, feel: a.feel, recall: (a.recall || '').trim(),
      outcome: a.outcome, gap: a.gap, gapNote: (a.gapNote || '').trim(), retrieved: null,
      load: a.load || '', needs: (a.needs || '').trim(), phonePlace: a.phonePlace || '', place: a.place || '',
      deskClear: !!a.deskClear, focusOn: !!a.focusOn, lag: a.lag == null ? null : clamp(a.lag, 0, 180),
      ramp: a.ramp || 0, loadMin: a.loadMin ?? null, lockAt: a.lockAt || 0, mid: a.mid || '', trace: a.ramp ? a.trace : '', rampFail: a.ramp && !inside ? a.rampFail : '',
      sheet: !!a.sheet, fmt: a.fmt || '', wtype: (a.wtype || '').trim(), cut: a.cut || '', ext: a.ext || 0, stretch: a.stretch || 0, signs: a.signs || [],
      fmtSnag: a.fmt ? a.fmtSnag || 'none' : '', fmtNext: (a.fmtNext || '').trim(), backLag: null,
      breaks: clamp(a.breaks, 0, 99), cause: a.cause || '',
    };
    db.sessions.push(s);
    const tp = db.tplans.find((p) => p.id === a.tplanId);
    if (tp) Object.assign(tp, { done: winOf(tp, a.startedAt), actual: s.studied, sessionId: s.id, state: a.viaSmall ? 'min' : s.outcome === 'full' ? 'full' : 'part' });
    const m = mythToday();
    if (chOn(4, a.ch || []) && m && !m.done) return open({ kind: 'myth', step: 'close', entryId: m.id, did: 'yes', can: s.can, after: s.id, ch: a.ch });
    a.savedId = s.id; go('done');
  },
  ics: (el) => calendarReminder(db.sessions.find((s) => s.id === el.dataset.id)),
  close: () => { saveLanding(); db.active = null; db.tab = 'today'; render(); window.scrollTo(0, 0); },
  'phone-window': () => { saveLanding(); open({ kind: 'window', endsAt: Date.now() + 10 * 6e4 }); },
  cancel: () => {
    const a = A();
    const started = a.kind === 'session' && a.step !== 'setup';
    if (started && !confirm('این جلسه ثبت نمی‌شود. رها کنم؟')) return;
    if (started) db.abandoned.push({ date: Date.now(), minutes: a.minutes, studied: elapsedMin(a.startedAt) });
    open(a.parent || null);
  },

  'new-obstacle': () => open({ kind: 'obstacle', step: 'pick', obstacle: 'vague', urges: [] }),
  'to-entry': () => {
    const a = A(), o = OBSTACLES[a.obstacle];
    if (!has(a.task)) return toast('بنویس قرار بود چه کاری انجام بدهی.');
    a.stepText = o.step; a.minutes = o.min; a.output = '';
    go('entry');
  },
  'back-pick': () => go('pick'),
  'start-run': () => {
    const a = A(), o = OBSTACLES[a.obstacle];
    if (!has(a.stepText)) return toast('گام ورودی را بنویس.');
    if (!o.rest && !has(a.output)) return toast('یک خروجی قابل‌دیدن برای این بازه بنویس.');
    a.startedAt = Date.now(); a.endsAt = a.startedAt + a.minutes * 6e4; a.rang = false;
    a.done = 'yes'; a.same = 'yes'; a.next = 'continue';
    go('run');
  },
  'to-decide': () => go('decide'),
  'finish-obstacle': () => {
    const a = A();
    db.obstacles.push({
      id: uid(), date: Date.now(), task: a.task.trim(), obstacle: a.obstacle, feeling: (a.feeling || '').trim(),
      step: a.stepText.trim(), output: (a.output || '').trim(), minutes: a.minutes, urges: a.urges,
      done: a.done, same: a.same, next: a.next,
    });
    if (a.next === 'continue') {
      db.active = a.parent || null;
      if (!a.parent) db.tab = 'today';
      render(); window.scrollTo(0, 0);
      toast(a.parent ? 'برگشتی به جلسه.' : 'ثبت شد. حالا یک جلسهٔ کامل را شروع کن.');
    } else if (a.next === 'shrink') {
      Object.assign(a, { step: 'entry', urges: [], minutes: 2, stepText: 'فقط فایل یا کتاب را باز می‌کنم و صورت اولین مسئله را می‌خوانم.', output: '' });
      render(); window.scrollTo(0, 0);
    } else {
      Object.assign(a, { step: 'pick', urges: [] });
      render(); window.scrollTo(0, 0);
    }
  },

  retrieve: (el) => open({ kind: 'retrieval', step: 'write', sessionId: el.dataset.id, endsAt: Date.now() + 10 * 6e4, rate: 'some' }),
  'retr-compare': () => go('compare'),
  'retr-finish': () => {
    const a = A();
    db.sessions.find((s) => s.id === a.sessionId).retrieved = { date: Date.now(), text: (a.text || '').trim(), rate: a.rate };
    open(null);
    toast('بازیابی ثبت شد.');
  },

  'new-day': () => open({ kind: 'day', ...(db.days[today()] || {}) }),
  'day-save': () => {
    const { bed, wake, quality, e1, e2, e3, e4 } = A();
    if (!bed && !wake && !quality && !e1 && !e2 && !e3 && !e4) return toast('دست‌کم یک مورد را پر کن.');
    db.days[today()] = { bed, wake, quality, e1, e2, e3, e4 };
    open(null);
    toast('ثبت شد.');
  },

  'new-manual': () => open({ kind: 'manual', breaks: 0 }),
  'manual-save': () => {
    const a = A();
    if (!has(a.subject) || !(a.presence > 0)) return toast('بنویس چه خواندی و چند دقیقه پای کار بودی.');
    const real = clamp(a.real ?? a.presence, 0, a.presence);
    db.logs.push({
      id: uid(), date: Date.now(), subject: a.subject.trim(), presence: clamp(a.presence, 1, 1440), real,
      longest: clamp(a.longest ?? real, 0, real), breaks: clamp(a.breaks, 0, 99), cause: a.cause || '', sign: (a.sign || '').trim(),
    });
    open(null);
    toast(real < a.presence ? `ثبت شد: ${fa(real)} دقیقهٔ واقعی از ${fa(a.presence)}.` : 'ثبت شد.');
  },

  'new-pattern': () => {
    const p = db.pattern || { attempts: [] };
    const flat = {};
    p.attempts.forEach((t, i) => { flat['h' + (i + 1)] = t.how; flat['l' + (i + 1)] = t.long; flat['b' + (i + 1)] = t.before; });
    open({ kind: 'pattern', sentence: p.sentence, one: p.one, ...flat });
  },
  'pattern-save': () => {
    const a = A();
    const attempts = [1, 2, 3].map((n) => ({ how: (a['h' + n] || '').trim(), long: (a['l' + n] || '').trim(), before: (a['b' + n] || '').trim() }))
      .filter((t) => t.how || t.long || t.before);
    if (attempts.length < 2) return toast('دست‌کم دو تلاش قبلی را بنویس تا تکرار دیده شود.');
    if (!has(a.sentence)) return toast('الگوی مشترک را در یک جمله بنویس.');
    db.pattern = { attempts, sentence: a.sentence.trim(), one: (a.one || '').trim(), date: Date.now() };
    open(null);
  },

  'base-start': () => { db.baseline = { start: Date.now(), days: 3 }; render(); window.scrollTo(0, 0); toast('شروع شد. مثل همیشه درس بخوان.'); },
  'base-one': () => {
    const n = +db.labDraft?.oneNum;
    if (!(n > 0)) return toast('یک عدد بنویس، حتی اگر کوچک است.');
    db.logs.push({ id: uid(), date: Date.now(), subject: 'ثبت یک‌عددی', presence: clamp(n, 1, 1440), real: clamp(n, 1, 1440), longest: clamp(n, 1, 1440), breaks: 0, cause: '', sign: '' });
    db.labDraft = {}; render(); toast('ثبت شد. همین یک عدد هم داده است.');
  },
  'base-more': () => {
    const b = db.baseline;
    b.days = Math.max(b.days, baseDayNo(b) - 1) + 3; b.seen = false;
    render(); window.scrollTo(0, 0);
  },
  'base-reset': () => {
    if (!confirm('پنجرهٔ ثبت از نو شروع می‌شود. جلسه‌های ثبت‌شده پاک نمی‌شوند. ادامه بدهم؟')) return;
    db.baseline = null; render(); window.scrollTo(0, 0);
  },

  'new-myth': () => {
    if (mythToday()) return toast('قانون امروز را انتخاب کرده‌ای. فردا سراغ بعدی برو.');
    const [ifText, thenText] = MYTHS.mood.rule;
    open({ kind: 'myth', step: 'pick', myth: 'mood', ifText, thenText });
  },
  'myth-save': () => {
    const a = A();
    if (!has(a.ifText) || !has(a.thenText)) return toast('قانون «اگر، آنگاه» را کامل بنویس.');
    db.myths.push({
      id: uid(), date: Date.now(), myth: a.myth, hidden: (a.hidden || '').trim(), ifText: a.ifText.trim(), thenText: a.thenText.trim(),
      task: (a.task || '').trim(), predict: (a.predict || '').trim(), done: null, output: '', can: '', happened: '',
    });
    db.active = null; db.tab = 'lab'; db.lab = 'myths'; render(); window.scrollTo(0, 0);
  },
  'myth-session': () => {
    const m = mythToday();
    const n = MYTHS[m.myth].minutes;
    open(newSession({ subject: m.task || '', ...(n ? { minutes: n, short: n } : {}) }));
    toast(MYTHS[m.myth].test);
  },
  'myth-close': () => {
    const m = mythToday();
    const last = db.sessions.filter((s) => dayKey(s.date) === today()).pop();
    open({ kind: 'myth', step: 'close', entryId: m.id, did: 'yes', can: last?.can || '' });
  },
  'myth-done': () => {
    const a = A();
    if (!has(a.happened)) return toast('بنویس واقعاً چه شد؛ همین داده است.');
    Object.assign(db.myths.find((x) => x.id === a.entryId), { done: a.did, output: (a.output || '').trim(), can: (a.can || '').trim(), happened: a.happened.trim() });
    actions['myth-later']();
  },
  'myth-small': (el) => { const n = +el.dataset.n; open(newSession({ subject: mythToday()?.task || '', minutes: n, short: n })); },
  'myth-later': () => { const a = A(); open(a.after ? { kind: 'session', step: 'done', savedId: a.after, ch: a.ch } : null); },
  'myth-wrap': () => {
    const { wrapData, wrapDecision } = db.labDraft || {};
    if (!has(wrapData) || !has(wrapDecision)) return toast('هر دو جمله را کامل کن.');
    db.mythWrap = { date: Date.now(), top: tally(db.myths, (x) => x.myth)[0][0], data: wrapData.trim(), decision: wrapDecision.trim() };
    db.labDraft = {}; render();
  },
  'myth-again': () => {
    if (!confirm('کاربرگ این هفته بایگانی و یک هفتهٔ تازه شروع می‌شود. ادامه بدهم؟')) return;
    db.mythArchive = [...(db.mythArchive || []), { wrap: db.mythWrap, entries: db.myths }];
    db.myths = []; db.mythWrap = null; render(); window.scrollTo(0, 0);
  },

  'env-start': () => {
    const last = db.sessions[db.sessions.length - 1];
    db.env = { start: Date.now(), base: last ? { up: countCause(last, 'up'), reach: countCause(last, 'phone'), lag: last.lag ?? undefined } : {}, audit: {} };
    render(); window.scrollTo(0, 0);
  },
  'env-reset': () => {
    if (!confirm('خط پایه و ممیزی پاک می‌شود. جلسه‌های ثبت‌شده می‌مانند. ادامه بدهم؟')) return;
    db.env = null; render(); window.scrollTo(0, 0);
  },

  'dig-start': () => {
    const last = db.sessions[db.sessions.length - 1];
    db.digital = {
      start: Date.now(), apps: [], built: {}, rule: {}, wrap: null,
      base: last ? { minutes: last.studied, pickups: countCause(last, 'phone'), switches: countCause(last, 'tab'), first: last.urges[0]?.min } : {},
    };
    render(); window.scrollTo(0, 0);
  },
  'dig-add-app': () => {
    const d = db.labDraft || {};
    if (!has(d.appName)) return toast('اسم برنامه، سایت یا نوع پیام را بنویس.');
    (db.digital.apps ||= []).push({ name: d.appName.trim(), col: d.appCol || 'off' });
    d.appName = ''; render();
  },
  'dig-del-app': (el) => { db.digital.apps.splice(+el.dataset.i, 1); render(); },
  'dig-wrap': () => {
    const w = db.digital.wrapDraft || {};
    if (!w.layer) return toast('بگو کدام لایه بیشتر کمک کرد.');
    db.digital.wrap = { date: Date.now(), layer: w.layer, bypass: (w.bypass || '').trim(), harder: (w.harder || '').trim() };
    db.digital.wrapDraft = {}; render();
  },
  'dig-again': () => { Object.assign(db.digital, { start: Date.now(), wrap: null, snag: '' }); render(); window.scrollTo(0, 0); },
  'dig-reset': () => {
    if (!confirm('خط پایه، ستون‌ها و قاعدهٔ جلسه پاک می‌شود. ادامه بدهم؟')) return;
    db.digital = null; render(); window.scrollTo(0, 0);
  },

  'new-tplan': () => open(tplanDraft({ tday: new Date().getHours() >= 15 || planFor(today()) ? 'tomorrow' : 'today' })),
  'tplan-edit': (el) => {
    const p = db.tplans.find((x) => x.id === el.dataset.id);
    open(tplanDraft({
      editId: p.id, tday: p.day === today() ? 'today' : 'tomorrow', hist: p.hist, base: p.base, task: p.task,
      from: p.from, to: p.to, altFrom: p.altFrom, altTo: p.altTo, small: p.small, tasks: [...p.tasks],
      first: p.first, cue: p.cue, out: p.out,
    }));
  },
  'tplan-add': () => {
    const a = A();
    if (!has(a.tName) || !(a.tMin > 0)) return toast('اسم کار و دقیقه‌اش را بنویس.');
    if (a.tasks.length >= 2) return toast('حداکثر دو کار اختیاری. کارت روزانه فهرست آرزو نیست.');
    a.tasks.push({ name: a.tName.trim(), load: a.tLoad, win: a.tWin, min: clamp(a.tMin, 1, 600) });
    a.tName = ''; a.tMin = undefined; render();
  },
  'tplan-del': (el) => { A().tasks.splice(+el.dataset.i, 1); render(); },
  'tplan-save': () => {
    const a = A();
    if (!has(a.task)) return toast('کار اول را بنویس؛ فقط یک کار.');
    if (!(a.base > 0)) return toast('زمان را بنویس؛ از روی سابقه، نه خوش‌بینی.');
    if (!a.from) return toast('پنجرهٔ اوج از چه ساعتی شروع می‌شود؟');
    if (!a.altFrom || !has(a.small)) return toast('پنجرهٔ جایگزین و نسخهٔ کوچک را بنویس؛ بدون آن‌ها یک تأخیر کل روز را می‌ریزد.');
    if (!has(a.first)) return toast('نقطهٔ شروع را بنویس: اولین عملِ خیلی مشخص.');
    const ts = a.tday === 'today' ? startOfDay(Date.now()) : addDays(Date.now(), 1), day = dayKey(ts);
    db.tplans = db.tplans.filter((p) => p.id !== a.editId && !(p.day === day && !p.done));
    db.tplans.push({
      id: uid(), made: Date.now(), ts, day, task: a.task.trim(), hist: a.hist, base: a.base, minutes: estOf(a),
      from: a.from, to: a.to || '', altFrom: a.altFrom, altTo: a.altTo || '', small: a.small.trim(), tasks: a.tasks, done: null,
      first: a.first.trim(), cue: (a.cue || '').trim(), out: a.out ?? '', week: weekNow()?.id || '',
      took: a.openedAt ? Math.round((Date.now() - a.openedAt) / 1000) : 0,
    });
    db.active = null; db.tab = 'lab'; db.lab = 'time'; render(); window.scrollTo(0, 0);
    toast('قفل شد. سر همان ساعت، از صفحهٔ امروز شروعش کن.');
  },
  'tplan-go': (el) => {
    const p = db.tplans.find((x) => x.id === el.dataset.id);
    open(newSession({ subject: p.task, minutes: blockFor(p.minutes), load: 'heavy', tplanId: p.id, ifThen: p.first || db.landing?.text || '', ifWhen: p.cue || '' }));
  },
  'tplan-small': (el) => {
    const p = db.tplans.find((x) => x.id === el.dataset.id);
    open(newSession({ subject: p.task, goal: p.small, mode: 'min', minutes: 15, load: 'heavy', tplanId: p.id, viaSmall: true, ifThen: p.first || '' }));
  },
  'tplan-miss': (el) => {
    db.tplans.find((x) => x.id === el.dataset.id).done = 'no';
    render(); toast('ثبت شد. شب در بررسی ببین کدام قسمت خراب شد، نه کل برنامه.');
  },
  'tplan-review': (el) => {
    const p = db.tplans.find((x) => x.id === el.dataset.id);
    if (!p.done) return toast('بگو کار اول کجا انجام شد.');
    if ((p.done === 'no' || p.state === 'part') && !p.carry) return toast('برای جامانده تصمیم بگیر: فردا، کوچک‌تر، یا حذف.');
    p.reviewed = Date.now();
    if ((p.carry === 'move' || p.carry === 'shrink') && !planFor(tomorrowKey())) {
      open(tplanDraft({ tday: 'tomorrow', task: p.carry === 'shrink' ? p.small : p.task, first: p.first, cue: p.cue, out: p.out, from: p.from, to: p.to, altFrom: p.altFrom, altTo: p.altTo }));
      return toast('جامانده آگاهانه به کارت فردا رفت. زمان و نسخهٔ کوچکش را بنویس.');
    }
    render(); window.scrollTo(0, 0);
    toast(p.done === 'no' || !(p.actual > 0) ? 'بررسی ثبت شد.'
      : p.actual > p.minutes * 1.15 ? `واقعیت ${fa(p.actual)} دقیقه بود و برآورد ${fa(p.minutes)}. عدد بعدی را از همین بردار.`
      : p.actual >= p.minutes * 0.7 ? 'برآوردت به واقعیت نزدیک بود.' : 'بررسی ثبت شد.');
  },

  'loop-start': () => { db.loop = { start: Date.now(), k0: {} }; render(); window.scrollTo(0, 0); toast('شروع شد. اولین قدم: کارت فردا، پنج دقیقه.'); },
  'loop-again': () => { db.loop.start = Date.now(); db.loop.snag = ''; render(); window.scrollTo(0, 0); },
  'loop-reset': () => {
    if (!confirm('دور چهارده‌روزه از نو شروع می‌شود. کارت‌ها و هفته‌های ثبت‌شده می‌مانند. ادامه بدهم؟')) return;
    db.loop = null; render(); window.scrollTo(0, 0);
  },
  'new-week': () => {
    const had = db.tplans.some((p) => p.ts >= addDays(Date.now(), -7)) || db.weeks.length > 0, prev = db.weeks[db.weeks.length - 1];
    open({
      kind: 'week', step: had ? 'review' : 'plan', mode: prev?.mode || 'week', buffer: prev?.buffer || 70, fixed: prev?.fixed || '', had,
      cause: loopStats(loopDays(addDays(Date.now(), -6), 7)).block, openedAt: Date.now(), capAt: Date.now() + 20 * 6e4,
    });
  },
  'week-plan': () => go('plan'),
  'week-save': () => {
    const a = A(), t = (x) => (x || '').trim();
    const outs = [1, 2, 3].map((i) => ({ t: t(a['o' + i]), min: t(a['m' + i]), days: a.mode === 'pool' ? '' : t(a['d' + i]) })).filter((o) => o.t);
    if (!outs.length) return toast('دست‌کم یک خروجی مشخص بنویس؛ حداکثر سه تا.');
    if (outs.some((o) => !o.min)) return toast('برای هر خروجی یک حداقلِ قابل قبول بنویس؛ نسخهٔ کوچک، نه ایده‌آل.');
    if (a.had && !has(a.fix)) return toast('دقیقاً یک اصلاح بنویس؛ از دادهٔ هفتهٔ قبل.');
    db.weeks.push({
      id: uid(), made: Date.now(), took: Math.round((Date.now() - a.openedAt) / 1000), mode: a.mode, buffer: a.buffer, n: a.n ?? null,
      fixed: t(a.fixed), outs, free: t(a.free), fix: t(a.fix), cause: t(a.cause), fixWorked: a.fixWorked || '',
    });
    db.loop ||= { start: Date.now(), k0: {} };
    db.active = null; db.tab = 'lab'; db.lab = 'loop'; render(); window.scrollTo(0, 0);
    toast('هفته قفل شد. تا جلسهٔ بعد، فقط کارت روزانه و ثبت شبانه.');
  },

  'attn-start': () => { db.attn = { start: Date.now() }; render(); window.scrollTo(0, 0); },
  'attn-session': () => open(newSession({ ...fromLanding(), ping: db.attn?.snag === 'slow' ? 'end' : db.attn?.snag === 'all' || db.attn?.snag === 'empty' ? 2 : 5, minutes: db.attn?.snag === 'all' ? 10 : 25, entry: 0 })),
  'attn-reset': () => {
    if (!confirm('شمارش سه جلسه از نو شروع می‌شود. جلسه‌های ثبت‌شده می‌مانند. ادامه بدهم؟')) return;
    db.attn = null; render(); window.scrollTo(0, 0);
  },

  'ramp-start': () => { db.ramp = { start: Date.now() }; render(); window.scrollTo(0, 0); },
  'ramp-session': () => open(newSession({ ...fromLanding(), ramp: 8, fmt: 'deep', minutes: 30, entry: 0 })),
  'ramp-again': () => { Object.assign(db.ramp, { start: Date.now(), snag: '' }); render(); window.scrollTo(0, 0); },
  'ramp-reset': () => {
    if (!confirm('شمارش چهار بلوک و عدد پایه از نو شروع می‌شود. جلسه‌های ثبت‌شده می‌مانند. ادامه بدهم؟')) return;
    db.ramp = null; render(); window.scrollTo(0, 0);
  },
  'keep-start': () => { db.keep = { start: Date.now(), base: {} }; render(); window.scrollTo(0, 0); },
  'keep-session': () => open(newSession({ ...fromLanding(), entry: 0 })),
  'keep-reset': () => {
    if (!confirm('خط پایه و شمارش سه جلسه از نو شروع می‌شود. جلسه‌های ثبت‌شده می‌مانند. ادامه بدهم؟')) return;
    db.keep = null; render(); window.scrollTo(0, 0);
  },
  'fmt-start': () => { db.fmtLab = { start: Date.now(), type: '' }; render(); window.scrollTo(0, 0); },
  'fmt-session': () => open(newSession({ ...fromLanding(), wtype: (db.fmtLab?.type || '').trim(), entry: 0 })),
  'fmt-default': (el) => { db.formats[db.fmtLab.type.trim()] = el.dataset.v; render(); toast('پیش‌فرض ثبت شد. دفعهٔ بعد با همین نوع کار، خودش انتخاب می‌شود.'); },
  'fmt-forget': (el) => { delete db.formats[el.dataset.k]; render(); },
  'fmt-again': () => { Object.assign(db.fmtLab, { start: Date.now(), snag: '' }); render(); window.scrollTo(0, 0); },
  'fmt-reset': () => {
    if (!confirm('شمارش سه جلسه از نو شروع می‌شود. پیش‌فرض‌ها و جلسه‌های ثبت‌شده می‌مانند. ادامه بدهم؟')) return;
    db.fmtLab = null; render(); window.scrollTo(0, 0);
  },

  'start-start': () => { db.startLab = { start: Date.now(), base: {} }; render(); window.scrollTo(0, 0); },
  'start-miss': () => {
    const d = db.labDraft || {};
    if (!HURDLES[d.block]) return toast('فقط یک مانع را انتخاب کن.');
    db.starts.push({ id: uid(), date: Date.now(), after: 'miss', block: d.block });
    render(); toast('ثبت شد؛ این داده است، نه جرم. همین امروز یک ورود ۶۰ ثانیه‌ای را امتحان کن.');
  },
  'start-again': () => { Object.assign(db.startLab, { start: Date.now(), seen: false }); render(); window.scrollTo(0, 0); },
  'start-reset': () => {
    if (!confirm('خط پایه و هفت روز از نو شروع می‌شود. جلسه‌های ثبت‌شده می‌مانند. ادامه بدهم؟')) return;
    db.startLab = null; render(); window.scrollTo(0, 0);
  },

  'lab-day1': () => {
    const { a1, b1 } = db.labDraft;
    if (!validScore(a1) || !validScore(b1)) return toast('هر دو نمره را بین ۰ تا ۱۰ بنویس.');
    db.experiment = { day1: Date.now(), a1: +a1, b1: +b1 }; db.labDraft = {}; render();
  },
  'lab-day2': () => {
    const { a2, b2 } = db.labDraft;
    if (!validScore(a2) || !validScore(b2)) return toast('هر دو نمره را بین ۰ تا ۱۰ بنویس.');
    Object.assign(db.experiment, { later: Date.now(), a2: +a2, b2: +b2 }); db.labDraft = {}; render();
  },
  'lab-reset': () => {
    if (db.experiment && !db.experiment.later && !confirm('نمره‌های روز اول پاک می‌شود. از نو شروع کنم؟')) return;
    db.experiment = null; db.labDraft = {}; render();
  },

  ai: async (el) => {
    const task = el.dataset.task, T = AI_TASKS[task], a = A();
    if (aiBusy) return;
    const input = T.input(a);
    if (typeof input === 'string') return toast(input);
    aiBusy = task; render();
    try {
      const { r, cached } = await askAi(task, input);
      if (T.global) db.ai[task] = r;
      else if (A() === a) (a.ai ||= {})[task] = r;
      if (cached) toast('ورودی عوض نشده؛ همان پاسخ قبلی است و درخواستی نرفت.');
    } catch (e) { toast(e.message); }
    aiBusy = ''; render();
  },
  'ai-use': (el) => { const a = A(), task = el.dataset.task; AI_TASKS[task].use(a, a.ai[task]); delete a.ai[task]; render(); toast('گذاشته شد. هر جایش را خواستی عوض کن.'); },
  'ai-test': async () => {
    if (aiBusy) return;
    aiBusy = 'test'; render();
    try { await askAi('step', { task: 'آزمودن اتصال', stuckOn: 'آزمایش' }); toast('کلید کار می‌کند.'); } catch (e) { toast(e.message); }
    aiBusy = ''; render();
  },
  'ai-off': () => { if (!confirm('کلید از این دستگاه پاک می‌شود. پاک کنم؟')) return; aiCfg.key = ''; saveAi(); render(); },
  'acc-go': async (el) => {
    const email = $('#acc-email').value.trim(), password = $('#acc-pass').value;
    if (!email || password.length < 6) return toast('ایمیل و رمزِ دست‌کم ۶ نویسه‌ای را بنویس.');
    el.disabled = true;
    try { await accEnter(await fbAuth(el.dataset.path, { email, password, returnSecureToken: true })); toast('وارد شدی.'); render(); }
    catch (e) { toast(e.message); el.disabled = false; }
  },
  'acc-reset': async () => {
    const email = $('#acc-email').value.trim();
    if (!email) return toast('اول ایمیلت را بنویس.');
    try { await fbAuth('sendOobCode', { requestType: 'PASSWORD_RESET', email }); toast('اگر با این ایمیل حسابی باشد، پیوند تغییر رمز برایش فرستاده شد.'); } catch (e) { toast(e.message); }
  },
  'acc-sync': async () => { await sync(); toast(syncErr || 'همگام شد.'); render(); },
  'acc-out': async () => {
    if (acc.dirty) await sync();
    if (acc.dirty && !confirm('تغییرهای آخر هنوز به حساب نرفته. با این حال خارج شوم؟')) return;
    accLeave(); render(); toast('خارج شدی. داده‌های این دستگاه سر جایش است.');
  },
  notif: () => Notification.requestPermission().then(render),
  theme: (el) => { theme = el.dataset.theme; try { localStorage.setItem(THEME_KEY, theme); } catch (e) { /* بدون ذخیره */ } applyTheme(); render(); },
  mode: (el) => { mode = el.dataset.mode; try { localStorage.setItem(MODE_KEY, mode); } catch (e) { /* بدون ذخیره */ } applyTheme(); render(); },
  export: () => download('ketab-baste-backup.json', JSON.stringify(db, null, 2), 'application/json'),
  wipe: () => {
    if (!confirm(`همهٔ جلسه‌ها و ثبت‌ها ${acc.uid ? 'روی این دستگاه و در حسابت ' : ''}برای همیشه پاک می‌شود. پاک کنم؟`)) return;
    db = blankDb(); db.tab = 'settings'; render(); toast('همه‌چیز پاک شد.');
  },
};

function saveLanding() {
  const a = A();
  const s = a?.kind === 'session' && db.sessions.find((x) => x.id === a.savedId);
  if (!s) return;
  s.landed = !!a.landed; s.nextFirst = (a.nextFirst || '').trim(); s.stopAt = (a.stopAt || '').trim();
  if (s.nextFirst) db.landing = { text: s.nextFirst, when: (a.nextWhen || '').trim(), subject: s.subject, at: s.stopAt, date: Date.now() };
}

const validScore = (v) => v !== '' && v != null && +v >= 0 && +v <= 10;

document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-act]');
  if (el && actions[el.dataset.act]) actions[el.dataset.act](el);
  histSync();
});

document.addEventListener('input', (e) => {
  const t = e.target;
  if (t.dataset.ai) { aiCfg[t.dataset.ai] = t.dataset.ai === 'cap' ? +t.value : t.value.trim(); saveAi(); return t.tagName === 'SELECT' ? render() : undefined; }
  if (t.dataset.lab) { (db.labDraft || (db.labDraft = {}))[t.dataset.lab] = t.value; return save(); }
  if (t.dataset.db) {
    setPath(t.dataset.db, t.type === 'checkbox' ? t.checked : 'num' in t.dataset ? (t.value === '' ? undefined : +t.value) : t.value);
    return t.type === 'checkbox' || t.type === 'radio' || t.tagName === 'SELECT' ? render() : save();
  }
  if (!t.dataset.bind || !A()) return;
  const a = A(), bind = t.dataset.bind;
  a[bind] = t.type === 'checkbox' ? t.checked : 'num' in t.dataset ? (t.value === '' ? undefined : +t.value) : t.value;
  if (bind === 'mode') applyMode(a);
  if (bind === 'myth') [a.ifText, a.thenText] = MYTHS[a.myth].rule;
  if (a.kind === 'session' && (bind === 'cut' || bind === 'hardDay' || bind === 'guarded') && suggestFmt(a)) { a.fmt = suggestFmt(a); applyFmt(a); }
  if (a.kind === 'session' && bind === 'fmt') applyFmt(a);
  if (bind === 'wtype' && db.formats[t.value.trim()]) { a.fmt = db.formats[t.value.trim()]; applyFmt(a); return render(); }
  if (bind === 'urgeCause' || bind === 'trace') return render();
  if (t.type === 'radio') return render();
  if (bind === 'feel') $('#feel-out').textContent = fa(a.feel) + ' از ۱۰';
  if (bind === 'base' && $('#est-out')) $('#est-out').textContent = estOf(a) ? `برآورد قفل‌شده: ${fa(estOf(a))} دقیقه` : 'برآورد: هنوز عددی ننوشته‌ای';
  const hint = bind === 'goal' && a.step === 'setup' ? [$('#goal-hint'), goalHint(t.value.trim())]
    : bind === 'criterion' && a.step === 'setup' ? [$('#crit-hint'), criterionHint(t.value)]
    : (bind === 'ifThen' || bind === 'ifWhen') && $('#first-hint') ? [$('#first-hint'), firstHint(a)] : null;
  if (hint) { hint[0].textContent = hint[1]; hint[0].hidden = !hint[1]; }
  save();
});

document.addEventListener('toggle', (e) => {
  if (e.target.dataset?.fold) folds[e.target.dataset.fold] = e.target.open;
}, true);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && e.target.id === 'urge') actions.urge();
});

document.addEventListener('change', (e) => {
  if (e.target.dataset.ai === 'key') return render();
  if (!('import' in e.target.dataset) || !e.target.files[0]) return;
  e.target.files[0].text().then((txt) => {
    const data = JSON.parse(txt);
    if (!Array.isArray(data.sessions) || !Array.isArray(data.obstacles)) throw new Error('shape');
    if (!confirm('داده‌های فعلی با این فایل جایگزین می‌شود. ادامه بدهم؟')) return;
    db = Object.assign(blankDb(), data, { active: null, tab: 'settings' }); render(); toast('بازگردانده شد.');
  }).catch(() => toast('این فایل پشتیبانِ ویر نیست.'));
});

/* ---------- تایمر ---------- */

setInterval(() => {
  const el = $('[data-timer]');
  if (!el) return;
  const left = +el.dataset.timer - Date.now();
  el.textContent = clock(left);
  const a = A();
  if (left <= 0 && a && !a.rang) {
    const cap = a.kind === 'tplan' ? 'پنج دقیقه تمام شد. قلم زمین؛ همین را قفل کن.' : a.kind === 'week' ? 'بیست دقیقه تمام شد. برنامهٔ ناتمامِ قابل‌اجرا کافی است.' : '';
    a.rang = true; ding();
    notify(cap || (a.kind === 'rest' ? 'استراحت تمام شد. برگرد سر همان قدم.' : a.rampState === 'load' ? 'بارگذاری تمام شد. تمدید ندارد؛ برو سراغ قفل.' : a.entryState === 'run' ? 'ورود تمام شد. ادامه، یک بازهٔ دیگر، یا توقف آگاهانه؟' : a.step === 'study' ? 'زمان مطالعه تمام شد. منبع را ببند.' : a.kind === 'window' ? 'پنجرهٔ گوشی بسته شد.' : 'بازه تمام شد.'));
    if (cap) toast(cap);
    if (a.step === 'study' || a.step === 'run' || a.kind === 'window') render(); else save();
  }
  // زنگ بی‌صدای نقشهٔ توجه؛ وسط تایپ مزاحم نمی‌شود
  const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName || '');
  if (a?.kind === 'session' && a.step === 'study' && a.entryState !== 'run' && a.ping > 0 && !a.pingDue && !typing
    && Date.now() >= a.nextPingAt && Date.now() < a.endsAt - 3e4) {
    a.pingDue = true;
    if (navigator.vibrate) navigator.vibrate(150);
    notify('الان کدام؟ تمرکز کاری، شبه‌تمرکز یا حواس‌پرتی.');
    render();
  }
  // بررسی میانیِ قفل و بازبینیِ جلسهٔ انعطاف‌پذیر
  const live = a?.kind === 'session' && a.step === 'study' && a.entryState !== 'run' && !typing;
  if (live && a.rampState === 'lock' && !a.mid && !a.midDue && Date.now() >= a.midAt) {
    a.midDue = true;
    if (navigator.vibrate) navigator.vibrate(150);
    notify('بررسی میانی: دارم سعی می‌کنم… / قدم بعدی‌ام…');
    render();
  }
  if (live && a.rampState !== 'load' && a.nextSignAt && !a.signDue && !a.signStop && Date.now() >= a.nextSignAt && Date.now() < a.endsAt - 3e4) {
    a.signDue = true;
    if (navigator.vibrate) navigator.vibrate(150);
    notify('بازبینی: سه نشانه را نگاه کن.');
    render();
  }
}, 500);

document.addEventListener('visibilitychange', () => {
  if (!document.hidden && !A()) render();
  if (!document.hidden || acc.dirty) sync();
});
window.addEventListener('online', sync);
sync();

// خط‌های بسته‌شدهٔ برگهٔ پارک بعد از سه هفته پاک می‌شوند
db.parked = db.parked.filter((p) => p.state !== 'done' && p.state !== 'drop' || Date.now() - p.closed < 21 * DAY);

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  // نسخهٔ تازه همان بار اول دیده شود، نه بعد از چند بار باز و بسته کردن اپ
  const had = !!navigator.serviceWorker.controller;
  navigator.serviceWorker.addEventListener('controllerchange', () => { if (had && !A()) location.reload(); });
  navigator.serviceWorker.register('sw.js').catch(() => {});
}

render();
