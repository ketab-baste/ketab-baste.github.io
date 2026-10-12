'use strict';

/* ---------- کتاب: متن کامل فصل‌ها برای خواندن ---------- */

// متن هر فصل همان فایل نویسنده است (book/N.md) و اینجا فقط نمایش داده می‌شود؛ هیچ کلمه‌ای بازنویسی نمی‌شود.
// فصل تازه: فایل را بی‌تغییر در book/N.md بگذار، این عدد را بالا ببر و همان فایل را به SHELL در sw.js اضافه کن.
const BOOK_COUNT = 15;
const book = { chapters: {}, state: 'idle' };

const bkInline = (s) => esc(s)
  .replace(/`([^`]+)`/g, '<code dir="ltr">$1</code>')
  .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  .replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a class="bk-src" href="$2" target="_blank" rel="noopener">$1</a>')
  .replace(/\n/g, '<br>');
// «شرط → اقدام» در دو خط جدا دیده می‌شود؛ پیکانِ داخل ** ** یا «» جزو خودِ جمله است و جدا نمی‌شود
const bkParts = (s) => {
  const parts = [''];
  s.split(/(\*\*[^*]+\*\*|«[^»]*»)/).forEach((seg, k) => {
    if (k % 2) { parts[parts.length - 1] += seg; return; }
    seg.split(/ [→←] /).forEach((x, j) => { if (j) parts.push(x); else parts[parts.length - 1] += x; });
  });
  return parts;
};
const bkArrow = (s) => bkParts(s).length > 1;
const bkRich = (s) => {
  const [first, ...rest] = bkParts(s);
  return rest.length ? `<span class="bk-if">${bkInline(first)}</span>${rest.map((p) => `<span class="bk-then"><b class="bk-arr">→</b> ${bkInline(p)}</span>`).join('')}` : bkInline(s);
};

// چند مورد شماره‌دار که در یک خط آمده‌اند («۱. … ۲. … ۳. …») جدا از هم نشان داده می‌شوند
const bkSteps = (s) => {
  const m = s.match(/^([۰-۹]{1,2})\.\s+/), out = [];
  if (!m) return out;
  let n = [...m[1]].reduce((a, c) => a * 10 + '۰۱۲۳۴۵۶۷۸۹'.indexOf(c), 0), rest = s.slice(m[0].length);
  for (;;) {
    const k = rest.indexOf(` ${fa(n + 1)}. `);
    out.push([fa(n), k < 0 ? rest : rest.slice(0, k)]);
    if (k < 0) return out;
    rest = rest.slice(k + fa(++n).length + 3);
  }
};

const BK_ITEM = /^\s{0,3}(?:-|(\d+)\.)\s+(.*)$/;
const BK_KINDS = [[/چک‌لیست/, 'check'], [/اشتباه/, 'wrong'], [/جواب نداد/, 'fix'], [/معیار موفقیت/, 'goal'], [/پروتکل/, 'proto']];

function bkBlocks(src) {
  const lines = src.replace(/\r/g, '').split('\n');
  const out = [];
  const blank = (l) => !l.trim();
  // خط ادامه با دو فاصلهٔ پایانی یعنی شکست خط
  const join = (ls) => ls.map((l, i) => (i < ls.length - 1 ? (/ {2,}$/.test(l) ? l.trim() + '\n' : l.trim() + ' ') : l.trim())).join('');
  let i = 0;
  while (i < lines.length) {
    const l = lines[i];
    if (blank(l)) { i++; continue; }
    const h = l.match(/^(#{1,4})\s+(.*)$/);
    if (h) { out.push({ t: 'h' + h[1].length, text: h[2].trim() }); i++; continue; }
    if (l.startsWith('```')) {
      const code = [];
      for (i++; i < lines.length && !lines[i].startsWith('```'); i++) code.push(lines[i]);
      out.push({ t: 'code', lines: code }); i++;
      continue;
    }
    if (l.startsWith('|')) {
      const rows = [];
      while (i < lines.length && lines[i].startsWith('|')) rows.push(lines[i++].trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim()));
      out.push({ t: 'table', head: rows[0], rows: rows.slice(2) });
      continue;
    }
    if (l.startsWith('>')) {
      const q = [];
      while (i < lines.length && lines[i].startsWith('>')) q.push(lines[i++].replace(/^>\s?/, ''));
      out.push({ t: 'quote', text: join(q) });
      continue;
    }
    const it = l.match(BK_ITEM);
    if (it) {
      const ordered = it[1] !== undefined, items = [];
      while (i < lines.length) {
        const m = lines[i].match(BK_ITEM);
        if (m && (m[1] !== undefined) === ordered) { items.push([m[2]]); i++; continue; }
        if (!blank(lines[i]) && /^\s{2,}\S/.test(lines[i])) { items[items.length - 1].push(lines[i]); i++; continue; }
        if (blank(lines[i])) {
          let j = i;
          while (j < lines.length && blank(lines[j])) j++;
          const next = lines[j] || '', nm = next.match(BK_ITEM);
          if (nm && (nm[1] !== undefined) === ordered) { i = j; continue; }
          if (/^\s{2,}\S/.test(next)) { items[items.length - 1].push(''); i = j; continue; }
        }
        break;
      }
      out.push({ t: 'list', ordered, start: +it[1] || 1, items: items.map(bkItem) });
      continue;
    }
    const p = [];
    while (i < lines.length && !blank(lines[i]) && !/^(#{1,4}\s|\||>|```)/.test(lines[i]) && !(p.length && BK_ITEM.test(lines[i]))) p.push(lines[i++]);
    out.push({ t: 'p', text: join(p) });
  }
  return out;
}

// خط‌های تورفتهٔ زیر یک مورد (فهرست تودرتو، بند ادامه) خودشان بلوک‌اند و داخل همان مورد می‌آیند
function bkItem(ls) {
  const rest = ls.slice(1), pad = Math.min(...rest.filter((l) => l.trim()).map((l) => l.match(/^\s*/)[0].length));
  const [first, ...sub] = bkBlocks([ls[0], ...rest.map((l) => l.slice(pad))].join('\n'));
  return first && first.t === 'p' ? { text: first.text, sub } : { text: '', sub: first ? [first, ...sub] : [] };
}

// نمودار درختیِ متنی (├── شاخه ──► نتیجه) به شکل شاخه‌های تودرتو کشیده می‌شود
function bkTree(lines) {
  const root = { text: '', kids: [] }, stack = [];
  let last = root;
  for (const raw of lines) {
    const m = raw.match(/^([\s│]*)[├└]─+\s*(.*)$/);
    if (m) {
      while (stack.length && stack[stack.length - 1][0] >= m[1].length) stack.pop();
      const [label, ...to] = m[2].split(/\s*─+►\s*/);
      last = { label, text: to.join(' '), kids: [] };
      (stack.length ? stack[stack.length - 1][1] : root).kids.push(last);
      stack.push([m[1].length, last]);
    } else {
      const t = raw.replace(/^[\s│]+/, '').trim();
      if (t) last.text += (last.text ? ' ' : '') + t;
    }
  }
  if (!root.kids.length) return `<pre class="bk-pre" dir="auto">${esc(lines.join('\n'))}</pre>`;
  const draw = (n) => `${n.label ? `<b>${bkInline(n.label)}</b>` : ''}<span>${bkInline(n.text)}</span>${n.kids.length ? `<ul>${n.kids.map((k) => `<li${k.kids.length ? '' : ' class="leaf"'}>${draw(k)}</li>`).join('')}</ul>` : ''}`;
  return `<div class="bk-tree">${draw(root)}</div>`;
}

function bkTable(b) {
  // جدول پهن روی گوشی خوانا نیست: هر ردیف یک کارت می‌شود
  const cards = b.head.length >= 4 || (b.head.length === 3 && window.innerWidth < 480);
  return `<div class="bk-tablewrap"><table class="bk-table${cards ? ' cards' : ''}">
    <thead><tr>${b.head.map((c) => `<th>${bkInline(c)}</th>`).join('')}</tr></thead>
    <tbody>${b.rows.map((r) => `<tr>${b.head.map((hd, k) => `<td data-label="${esc(hd)}"${has(r[k]) ? '' : ' class="blank"'}>${bkInline(r[k] || '')}</td>`).join('')}</tr>`).join('')}</tbody>
  </table></div>`;
}

function bkBlock(b) {
  if (b.t === 'h4') return `<h4>${bkInline(b.text)}</h4>`;
  if (b.t[0] === 'h') return `<h3>${bkInline(b.text)}</h3>`;
  if (b.t === 'table') return bkTable(b);
  if (b.t === 'code') return bkTree(b.lines);
  if (b.t === 'quote') return `<blockquote class="bk-quote">${bkInline(b.text)}</blockquote>`;
  if (b.t === 'list') {
    const tag = b.ordered ? 'ol' : 'ul';
    return `<${tag} class="bk-list"${b.ordered && b.start > 1 ? ` start="${b.start}"` : ''}>${b.items.map((x) => `<li${bkArrow(x.text) ? ' class="bk-arrow"' : ''}>${bkRich(x.text)}${x.sub.map(bkBlock).join('')}</li>`).join('')}</${tag}>`;
  }
  const steps = bkSteps(b.text);
  if (steps.length) return steps.map(([num, t]) => `<div class="bk-step"><i>${num}</i><p class="bk-lead">${bkInline(t)}</p></div>`).join('');
  if (/^\*\*[^*]+\*\*$/.test(b.text)) return `<p class="bk-label">${bkInline(b.text)}</p>`;
  return `<p class="${b.text.startsWith('**') ? 'bk-lead' : ''}${bkArrow(b.text) ? ' bk-arrow' : ''}">${bkRich(b.text)}</p>`;
}

function bkParse(n, src) {
  const blocks = bkBlocks(src);
  // فصل ۶ تیتر بخش‌ها را هم بدون علامت # نوشته است («۱. مسئله»)
  if (!blocks.some((b) => b.t === 'h2')) blocks.forEach((b) => { if (b.t === 'p' && /^[۰-۹]\.\s+[^\n.]{1,40}$/.test(b.text)) b.t = 'h2'; });
  // فصل ۱ عنوانش را بدون علامت # نوشته است
  const head = blocks[0].t === 'h1' || blocks[0].t === 'p' ? blocks.shift().text : '';
  const [label, ...rest] = head.split(' — ');
  const toc = [];
  let html = '', openSec = false;
  for (const b of blocks) {
    if (b.t === 'h2') {
      const m = b.text.match(/^([۰-۹0-9]+)\.\s*(.*)$/) || [0, '', b.text];
      const kind = (BK_KINDS.find(([re]) => re.test(m[2])) || [0, 'plain'])[1];
      const id = 'bk-s' + (toc.length + 1);
      toc.push([id, m[1], m[2]]);
      html += `${openSec ? '</section>' : ''}<section class="bk-sec bk-${kind}" id="${id}"><h2>${m[1] ? `<i>${m[1]}</i>` : ''}<span>${bkInline(m[2])}</span></h2>`;
      openSec = true;
    } else html += bkBlock(b);
  }
  if (openSec) html += '</section>';
  return { n, label: label.trim(), title: rest.join(' — ').trim(), toc, html, mins: Math.max(1, Math.round(src.split(/\s+/).length / 180)) };
}

function bookLoad() {
  if (book.state === 'loading' || book.state === 'ready') return;
  book.state = 'loading';
  Promise.all(Array.from({ length: BOOK_COUNT }, (_, k) => fetch(`book/${k + 1}.md`).then((r) => (r.ok ? r.text() : Promise.reject(r.status)))))
    .then((texts) => { texts.forEach((t, k) => { book.chapters[k + 1] = bkParse(k + 1, t); }); book.state = 'ready'; })
    .catch(() => { book.state = 'failed'; })
    .then(() => { if (A() ? A().kind === 'book' : db.tab === 'book') render(); });
}

const bkWait = () => (book.state === 'failed'
  ? '<p>متن کتاب باز نشد. اینترنت را بررسی کن.</p><button class="btn big" data-act="book-retry">دوباره تلاش کن</button>'
  : '<p class="count">در حال بازکردن کتاب…</p>');
const bkPct = (n) => { const s = db.book[n]; return !s ? 0 : s.done ? 100 : Math.round((s.max || 0) * 100); };

function viewBookTab() {
  bookLoad();
  const last = db.book.last && !db.book[db.book.last]?.done ? book.chapters[db.book.last] : null;
  return `
    <header class="top"><h1>کتاب مطالعه مؤثر</h1><p>متن کامل فصل‌ها، همان‌طور که نوشته شده‌اند.</p></header>
    ${book.state !== 'ready' ? bkWait() : `
    ${last && bkPct(last.n) > 0 ? `<button class="btn big primary" data-act="book-open" data-ch="${last.n}">ادامهٔ ${last.label}</button>` : ''}
    <ul class="bk-shelf">${Object.values(book.chapters).map((c) => {
      const pct = bkPct(c.n);
      return `<li><button class="bk-ch${pct === 100 ? ' done' : ''}" data-act="book-open" data-ch="${c.n}">
        <i aria-hidden="true">${fa(c.n)}</i>
        <span><small>${c.label} · حدود ${fa(c.mins)} دقیقه</small><b>${esc(c.title)}</b>
          <em>${pct === 100 ? 'خوانده شد' : pct ? `${fa(pct)}٪ خوانده‌ای` : 'هنوز نخوانده‌ای'}</em></span>
        <u style="--w:${pct}%"></u>
      </button></li>`;
    }).join('')}</ul>`}`;
}

function viewBook() {
  bookLoad();
  const c = book.chapters[A().ch];
  if (!c) return `<header class="flow"><button class="back" data-act="cancel">برگشت به کتاب</button></header>${bkWait()}`;
  const prev = book.chapters[c.n - 1], next = book.chapters[c.n + 1];
  return `
    <div class="bk-bar"><button class="back" data-act="cancel">برگشت به کتاب</button><span>${c.label}</span><i class="bk-prog"><b></b></i></div>
    <article class="bk">
      <header class="bk-hero">
        <i aria-hidden="true">${fa(c.n)}</i>
        <small>${c.label}</small>
        <h1>${esc(c.title)}</h1>
        <p>${fa(c.toc.length)} بخش · حدود ${fa(c.mins)} دقیقه</p>
      </header>
      <nav class="bk-toc" aria-label="بخش‌های فصل">${c.toc.map(([id, num, t]) => `<button data-act="book-jump" data-to="${id}"><i>${num}</i>${esc(t)}</button>`).join('')}</nav>
      ${c.html}
    </article>
    <div class="bk-end">
      ${next ? `<button class="btn big primary" data-act="book-open" data-ch="${next.n}" data-top="1">${next.label}: ${esc(next.title)}</button>` : ''}
      ${prev ? `<button class="btn big quiet" data-act="book-open" data-ch="${prev.n}" data-top="1">${prev.label}: ${esc(prev.title)}</button>` : ''}
      <button class="btn link" data-act="cancel">برگشت به فهرست کتاب</button>
    </div>`;
}

const bkRoom = () => Math.max(1, document.documentElement.scrollHeight - window.innerHeight);

// بعد از هر رندرِ صفحهٔ فصل: برگشتن به همان‌جایی که خواننده بود
function bookMount() {
  const a = A(), c = book.chapters[a.ch];
  if (!c || book.mounted === a) return bookTrack();
  book.mounted = a;
  const s = db.book[c.n];
  window.scrollTo(0, s && !s.done && !a.top ? s.pos * bkRoom() : 0);
  a.top = false;
  bookTrack();
}

let bkSaveTimer = 0;
function bookTrack() {
  const a = A(), bar = $('.bk-prog b');
  if (!a || a.kind !== 'book' || !bar || book.mounted !== a) return;
  const f = Math.min(1, Math.max(0, window.scrollY / bkRoom()));
  bar.style.width = f * 100 + '%';
  const s = db.book[a.ch] ||= { pos: 0, max: 0 };
  s.pos = f;
  s.max = Math.max(s.max || 0, f);
  if (f > 0.97) s.done = true;
  clearTimeout(bkSaveTimer);
  bkSaveTimer = setTimeout(save, 600);
}
window.addEventListener('scroll', bookTrack, { passive: true });

const bookActions = {
  'book-open': (el) => { db.book.last = +el.dataset.ch; db.active = { kind: 'book', ch: +el.dataset.ch, top: !!el.dataset.top }; render(); },
  'book-jump': (el) => document.getElementById(el.dataset.to)?.scrollIntoView(),
  'book-retry': () => { book.state = 'idle'; render(); },
};
