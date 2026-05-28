import { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ── Isometric city builder (ported from script.js) ─────────────────────────
function buildIsoCity(svgEl) {
  if (!svgEl || svgEl.dataset.built) return;
  svgEl.dataset.built = '1';

  const s = 30, sx = s * Math.cos(Math.PI / 6), sy = s * 0.5;
  const ox = 300, oy = 265;

  function iso(x, y, z) { return { x: ox + x * sx - y * sx, y: oy + x * sy + y * sy - z * s }; }
  function pt(p) { return p.x.toFixed(1) + ',' + p.y.toFixed(1); }

  function pathFace(pts, fill, stroke, sw) {
    const d = 'M ' + pts.map(pt).join(' L ') + ' Z';
    const sa = stroke ? ` stroke="${stroke}" stroke-width="${sw || 0.5}"` : '';
    return `<path d="${d}" fill="${fill}"${sa}/>`;
  }

  function lerp2(A, B, t) { return { x: A.x + (B.x - A.x) * t, y: A.y + (B.y - A.y) * t }; }
  function bl(A, B, C, D, u, v) { return lerp2(lerp2(A, B, u), lerp2(D, C, u), v); }

  function makeWindows(A, B, C, D, rows, cols, fill) {
    let out = '';
    const pu = 0.12, pv = 0.08;
    const cu = (1 - 2 * pu) / cols, cv = (1 - 2 * pv) / rows;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const u1 = pu + c * cu + cu * 0.15, u2 = pu + (c + 1) * cu - cu * 0.15;
        const v1 = pv + r * cv + cv * 0.12, v2 = pv + (r + 1) * cv - cv * 0.12;
        const wa = bl(A, B, C, D, u1, v1), wb = bl(A, B, C, D, u2, v1);
        const wc = bl(A, B, C, D, u2, v2), wd = bl(A, B, C, D, u1, v2);
        out += pathFace([wa, wb, wc, wd], fill, 'none');
      }
    }
    return out;
  }

  function building(gx, gy, w, d, h, col) {
    const tfl = iso(gx, gy, h), tfr = iso(gx + w, gy, h);
    const tbr = iso(gx + w, gy + d, h), tbl = iso(gx, gy + d, h);
    const bfl = iso(gx, gy, 0), bfr = iso(gx + w, gy, 0);
    const bbr = iso(gx + w, gy + d, 0), bbl = iso(gx, gy + d, 0);
    const { top, left, right, wl, wr } = col;
    const winR = Math.max(1, Math.round(h * 1.6));
    const winC = Math.max(1, Math.round(w));
    let g = '<g class="iso-bld">';
    g += pathFace([tfl, tbl, bbl, bfl], left, '#00000018', 0.5);
    g += pathFace([tfr, tbr, bbr, bfr], right, '#00000018', 0.5);
    g += pathFace([tfl, tfr, tbr, tbl], top, '#ffffff28', 0.5);
    if (h >= 2) {
      g += makeWindows(tfr, tbr, bbr, bfr, winR, winC, wr);
      g += makeWindows(tfl, tbl, bbl, bfl, winR, Math.max(1, Math.round(d)), wl);
    }
    return g + '</g>';
  }

  function tree(gx, gy) {
    const b = iso(gx, gy, 0), m = iso(gx, gy, 1.4);
    const cx = b.x, ty = b.y;
    return `<g class="iso-tree">
      <rect x="${(cx - 2.5).toFixed(1)}" y="${m.y.toFixed(1)}" width="5" height="${(ty - m.y).toFixed(1)}" fill="#92400e" rx="1"/>
      <polygon points="${cx},${(m.y - 14).toFixed(1)} ${(cx - 11).toFixed(1)},${(m.y + 2).toFixed(1)} ${(cx + 11).toFixed(1)},${(m.y + 2).toFixed(1)}" fill="#059669"/>
      <polygon points="${cx},${(m.y - 8).toFixed(1)} ${(cx - 8).toFixed(1)},${(m.y + 5).toFixed(1)} ${(cx + 8).toFixed(1)},${(m.y + 5).toFixed(1)}" fill="#10b981"/>
    </g>`;
  }

  const C = {
    teal:   { top: '#00d09c', left: '#005f43', right: '#00845f', wl: '#6ee7b7aa', wr: '#a7f3d0aa' },
    blue:   { top: '#818cf8', left: '#1e3a8a', right: '#2563eb', wl: '#bfdbfeaa', wr: '#dbeafeaa' },
    red:    { top: '#fca5a5', left: '#991b1b', right: '#b91c1c', wl: '#fecacaaa', wr: '#fee2e2aa' },
    purple: { top: '#c4b5fd', left: '#5b21b6', right: '#7c3aed', wl: '#ddd6feaa', wr: '#ede9feaa' },
    gold:   { top: '#fde68a', left: '#92400e', right: '#d97706', wl: '#fef3c7aa', wr: '#fefce8aa' },
    green:  { top: '#6ee7b7', left: '#047857', right: '#059669', wl: '#a7f3d0aa', wr: '#d1fae5aa' },
  };

  const buildings = [
    [-3, 5, 1.5, 1.5, 2.5, C.purple],
    [1, 5, 1.5, 1.5, 2.8, C.gold],
    [-1, 4, 1, 1, 1.8, C.green],
    [-4, 2, 1.5, 1.5, 3.8, C.blue],
    [2, 2, 1.5, 1.5, 3.2, C.red],
    [-1, 0, 2, 2, 6, C.teal],
  ];

  let groundHTML = '';
  for (let x = -5; x < 5; x++) {
    for (let y = 0; y < 8; y++) {
      const a = iso(x, y, 0), b = iso(x + 1, y, 0), c = iso(x + 1, y + 1, 0), d = iso(x, y + 1, 0);
      const shade = (x + y) % 2 === 0 ? '#e8f9f4' : '#f0fdf8';
      groundHTML += pathFace([a, b, c, d], shade, '#c8e8da', 0.4);
    }
  }

  const ra = iso(-1, 0, 0.02), rb = iso(2, 0, 0.02), rc = iso(2, 4, 0.02), rd = iso(-1, 4, 0.02);
  const roadHTML = pathFace([ra, rb, rc, rd], '#d4ede6', 'none');

  let bHTML = '';
  buildings.forEach(([gx, gy, w, d, h, col]) => { bHTML += building(gx, gy, w, d, h, col); });

  const treesHTML = [tree(-3, 1), tree(3, 1), tree(-3, 3), tree(3, 3), tree(0, 3.5)].join('');

  const pData = [
    { id: 'isoP1', cx: 425, cy: 85, r: 5.5, fill: '#f5a623' },
    { id: 'isoP2', cx: 465, cy: 130, r: 3.5, fill: '#00d09c' },
    { id: 'isoP3', cx: 100, cy: 100, r: 4.5, fill: '#5367ff' },
    { id: 'isoP4', cx: 395, cy: 195, r: 3, fill: '#eb5b3c' },
    { id: 'isoP5', cx: 85, cy: 175, r: 4, fill: '#8b5cf6' },
    { id: 'isoP6', cx: 480, cy: 60, r: 3, fill: '#f5a623' },
    { id: 'isoP7', cx: 120, cy: 230, r: 3, fill: '#00d09c' },
  ];
  const particlesHTML = pData.map(p =>
    `<circle id="${p.id}" cx="${p.cx}" cy="${p.cy}" r="${p.r}" fill="${p.fill}" opacity="0.65" class="iso-particle"/>`
  ).join('');

  const mainTopR = iso(1, 0, 6);
  const connHTML = `
    <line x1="${mainTopR.x.toFixed(1)}" y1="${mainTopR.y.toFixed(1)}" x2="430" y2="88" stroke="#00d09c" stroke-width="1.2" stroke-dasharray="4,4" opacity="0.35" class="iso-conn"/>
    <line x1="${mainTopR.x.toFixed(1)}" y1="${mainTopR.y.toFixed(1)}" x2="418" y2="192" stroke="#eb5b3c" stroke-width="1" stroke-dasharray="4,4" opacity="0.3" class="iso-conn"/>
  `;

  const defs = `<defs>
    <filter id="isoDrop" x="-10%" y="-10%" width="120%" height="130%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#00000020"/>
    </filter>
    <radialGradient id="grdGround" cx="50%" cy="40%" r="55%">
      <stop offset="0%" stop-color="#e8faf4"/>
      <stop offset="100%" stop-color="#f4f7fe"/>
    </radialGradient>
  </defs>`;

  svgEl.innerHTML = defs + groundHTML + roadHTML + treesHTML + bHTML + particlesHTML + connHTML;

  const blds = svgEl.querySelectorAll('.iso-bld');
  gsap.set(blds, { opacity: 0, y: 24 });
  gsap.to(blds, { opacity: 1, y: 0, duration: 0.72, stagger: 0.1, ease: 'back.out(1.3)', delay: 0.85 });

  svgEl.querySelectorAll('.iso-tree').forEach((t, i) => {
    gsap.to(t, { y: -4, duration: 2.2 + i * 0.3, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: i * 0.25 });
  });

  pData.forEach((p, i) => {
    const el = document.getElementById(p.id);
    if (!el) return;
    gsap.to(el, {
      attr: { cy: p.cy - 18 }, opacity: 0,
      duration: 2.4 + i * 0.35, ease: 'power1.inOut',
      repeat: -1, delay: i * 0.55, repeatDelay: 0.3,
      onRepeat() { gsap.set(el, { attr: { cy: p.cy }, opacity: 0.65 }); },
    });
  });

  svgEl.querySelectorAll('.iso-conn').forEach(l => {
    const len = l.getTotalLength ? l.getTotalLength() : 120;
    gsap.fromTo(l,
      { strokeDasharray: len, strokeDashoffset: len },
      { strokeDashoffset: 0, duration: 1.4, ease: 'power2.out', delay: 1.2 }
    );
  });
}

// ── Shared finance helpers (ported from script.js) ──────────────────────────
function calcEMIFormula(P, annualRate, years) {
  const r = annualRate / 100 / 12;
  const n = years * 12;
  if (r === 0) return P / n;
  return P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
}

function fmtInr(val) { return '₹' + Math.round(val).toLocaleString('en-IN'); }

function fmtCur(val) {
  if (val >= 10000000) return '₹' + (val / 10000000).toFixed(2) + ' Cr';
  if (val >= 100000) return '₹' + (val / 100000).toFixed(2) + 'L';
  if (val >= 1000) return '₹' + Math.round(val).toLocaleString('en-IN');
  return '₹' + val.toFixed(0);
}

function drawDonut(canvas, seg1, seg2, color1, color2) {
  if (!canvas) return;
  const dpr = window.devicePixelRatio || 1;
  const size = 200;
  canvas.width = size * dpr; canvas.height = size * dpr;
  canvas.style.width = size + 'px'; canvas.style.height = size + 'px';
  const ctx = canvas.getContext('2d');
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);
  const cx = size / 2, cy = size / 2, r = 78, lw = 24;
  const total = seg1 + seg2;
  const a1 = total > 0 ? (seg1 / total) * Math.PI * 2 : 0;
  ctx.clearRect(0, 0, size, size);
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.strokeStyle = '#f0f0f0'; ctx.lineWidth = lw; ctx.stroke();
  ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + a1);
  ctx.strokeStyle = color1; ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.stroke();
  ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI / 2 + a1, -Math.PI / 2 + Math.PI * 2);
  ctx.strokeStyle = color2; ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.stroke();
}

function rangeFill(val, min, max) {
  const pct = ((val - min) / (max - min)) * 100;
  return { background: `linear-gradient(to right, #00d09c 0%, #00d09c ${pct}%, #e0e0e0 ${pct}%, #e0e0e0 100%)` };
}

// ── Data ───────────────────────────────────────────────────────────────────────
const PRODUCTS = [
  {
    title: 'Personal Loan',
    desc: 'Quick and flexible personal loan assistance for salaried and self-employed individuals.',
    tags: ['Fast Approval', 'Low Interest'],
    iconBg: 'linear-gradient(135deg,#e8f9f4,#d0f4ea)',
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M3 17L9 11L13 15L21 7" stroke="#00d09c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M17 7H21V11" stroke="#00d09c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  },
  {
    title: 'Business Loan',
    desc: 'Business funding solutions designed to support growth and working capital requirements.',
    tags: ['Growth Funding', 'Working Capital'],
    iconBg: 'linear-gradient(135deg,#eef0ff,#dde1ff)',
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#5367ff" strokeWidth="2.5"/><path d="M12 3V12L17 17" stroke="#5367ff" strokeWidth="2.5" strokeLinecap="round"/></svg>,
  },
  {
    title: 'Professional Loan',
    desc: 'Financial solutions for doctors, CAs, consultants, and working professionals.',
    tags: ['For Professionals', 'Flexible Terms'],
    iconBg: 'linear-gradient(135deg,#fff8e8,#ffefc2)',
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><rect x="4" y="8" width="16" height="12" rx="2" stroke="#f5a623" strokeWidth="2.5"/><path d="M8 8L12 3L16 8" stroke="#f5a623" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  },
  {
    title: 'Home Loan',
    desc: 'Trusted home loan assistance with competitive banking options from top banks.',
    tags: ['Best Rates', 'Up to 30 yrs'],
    iconBg: 'linear-gradient(135deg,#fef0ec,#fdddd4)',
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="#eb5b3c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><polyline points="9 22 9 12 15 12 15 22" stroke="#eb5b3c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  },
  {
    title: 'Loan Against Property',
    desc: 'Secure funding solutions against residential or commercial property at competitive rates.',
    tags: ['Secured Loan', 'High Amount'],
    iconBg: 'linear-gradient(135deg,#f3eeff,#e4d9ff)',
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M12 2L15 8H21L16 12L18 19L12 15L6 19L8 12L3 8H9L12 2Z" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  },
  {
    title: 'Balance Transfer',
    desc: 'Transfer your existing loan to a lower interest rate. Save on EMI with better terms.',
    tags: ['Lower EMI', 'Better Rates'],
    iconBg: 'linear-gradient(135deg,#e8f9f4,#ccf2e5)',
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="3" stroke="#00b386" strokeWidth="2.5"/><path d="M8 12H16M8 8H16M8 16H12" stroke="#00b386" strokeWidth="2" strokeLinecap="round"/></svg>,
  },
];

const STEPS = [
  {
    num: '1', title: 'Apply Online',
    desc: 'Fill in a simple application form with your basic details. No Aadhaar or PAN required at this stage.',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="#fff" strokeWidth="2" strokeLinecap="round"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    color: '#5367ff',
  },
  {
    num: '2', title: 'Submit Documents',
    desc: 'Securely upload required documents through our encrypted portal after initial verification.',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="#fff" strokeWidth="2" strokeLinecap="round"/><polyline points="17 8 12 3 7 8" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><line x1="12" y1="3" x2="12" y2="15" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>,
    color: '#00d09c',
  },
  {
    num: '3', title: 'Verification & Eligibility',
    desc: 'Our team and banking partners verify your information following RBI-compliant processes.',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#fff" strokeWidth="2" strokeLinejoin="round"/><path d="M9 12l2 2 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    color: '#f5a623',
  },
  {
    num: '4', title: 'Loan Disbursal',
    desc: 'Once approved, the loan amount is disbursed directly to your bank account by the lending partner.',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="2" y="7" width="20" height="14" rx="2" stroke="#fff" strokeWidth="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" stroke="#fff" strokeWidth="2"/></svg>,
    color: '#8b5cf6',
  },
];

const PARTNERS = [
  { name: 'HDFC Bank', type: 'Private Bank', accent: '#004C8F', loans: 'Home · Personal · Business', abbr: 'HDFC' },
  { name: 'State Bank of India', type: 'PSU Bank', accent: '#22409A', loans: 'Home · Education · LAP', abbr: 'SBI' },
  { name: 'ICICI Bank', type: 'Private Bank', accent: '#F36C21', loans: 'Personal · Business · LAP', abbr: 'ICICI' },
  { name: 'Axis Bank', type: 'Private Bank', accent: '#97144D', loans: 'Home · Personal · Business', abbr: 'AXIS' },
  { name: 'Kotak Mahindra', type: 'Private Bank', accent: '#EE3124', loans: 'Personal · Home · Business', abbr: 'KMB' },
  { name: 'Bajaj Finserv', type: 'NBFC', accent: '#004b8d', loans: 'Personal · Business · Medical', abbr: 'BFL' },
  { name: 'LIC Housing Finance', type: 'HFC', accent: '#003479', loans: 'Home · LAP · Construction', abbr: 'LICHF' },
  { name: 'Tata Capital', type: 'NBFC', accent: '#00a1e4', loans: 'Personal · Business · Home', abbr: 'TATA' },
];

const TICKER_ITEMS = [
  { name: 'Personal Loan', price: 'from 10.49%', change: 'Low Interest' },
  { name: 'Business Loan', price: 'from 14.0%', change: 'Fast Approval' },
  { name: 'Home Loan', price: 'from 8.35%', change: 'Lowest Rates' },
  { name: 'Loan Against Property', price: 'from 9.5%', change: 'Flexible Tenure' },
  { name: 'Professional Loan', price: 'from 10.75%', change: 'Quick Disbursal' },
  { name: 'SBI', price: 'PL @ 11.15%', change: 'Trusted Partner' },
  { name: 'HDFC Bank', price: 'PL @ 10.75%', change: 'Trusted Partner' },
  { name: 'ICICI Bank', price: 'PL @ 10.85%', change: 'Trusted Partner' },
];

const NUMBERS = [
  { target: 50000, prefix: '', suffix: '+', decimals: 0, label: 'Happy Customers', width: 95, color: '#00d09c', iconBg: 'linear-gradient(135deg,#e8f9f4,#ccf2e5)',
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="#00d09c" strokeWidth="2" strokeLinecap="round"/><circle cx="9" cy="7" r="4" stroke="#00d09c" strokeWidth="2"/><path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="#00d09c" strokeWidth="2" strokeLinecap="round"/><path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="#00d09c" strokeWidth="2" strokeLinecap="round"/></svg> },
  { target: 500, prefix: '₹', suffix: ' Cr+', decimals: 0, label: 'Loans Facilitated', width: 88, color: '#5367ff', iconBg: 'linear-gradient(135deg,#eef0ff,#dde1ff)',
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 1V23M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="#5367ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { target: 15, prefix: '', suffix: '+', decimals: 0, label: 'Banking Partners', width: 78, color: '#f5a623', iconBg: 'linear-gradient(135deg,#fff8e8,#ffefc2)',
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M3 17L9 11L13 15L21 7" stroke="#f5a623" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M17 7H21V11" stroke="#f5a623" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { target: 4.9, prefix: '', suffix: '/5', decimals: 1, label: 'Customer Rating', width: 96, color: '#eb5b3c', iconBg: 'linear-gradient(135deg,#fef0ec,#fdddd4)',
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 2L15 8H21L16 12L18 19L12 15L6 19L8 12L3 8H9L12 2Z" stroke="#eb5b3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { target: 24, prefix: '', suffix: 'hrs', decimals: 0, label: 'Fast Processing', width: 82, color: '#8b5cf6', iconBg: 'linear-gradient(135deg,#f3eeff,#e4d9ff)',
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1" stroke="#8b5cf6" strokeWidth="2"/><rect x="14" y="3" width="7" height="7" rx="1" stroke="#8b5cf6" strokeWidth="2"/><rect x="3" y="14" width="7" height="7" rx="1" stroke="#8b5cf6" strokeWidth="2"/><rect x="14" y="14" width="7" height="7" rx="1" stroke="#8b5cf6" strokeWidth="2"/></svg> },
  { target: 100, prefix: '', suffix: '%', decimals: 0, label: 'Secure & Encrypted', width: 100, color: '#00b386', iconBg: 'linear-gradient(135deg,#e8f9f4,#ccf2e5)',
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#00b386" strokeWidth="2"/><path d="M8 12L11 15L16 9" stroke="#00b386" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg> },
];

const INDEX_CARDS = [
  { name: 'Personal Loan', badge: 'Popular', price: '10.49%', stroke: '#00d09c', points: '0,30 10,28 20,32 30,22 40,25 50,18 60,20 70,12 80,15 90,8 100,10 110,6 120,9' },
  { name: 'Home Loan', badge: 'Best Rate', price: '8.35%', stroke: '#00d09c', points: '0,35 10,30 20,33 30,25 40,28 50,15 60,20 70,18 80,12 90,14 100,8 110,10 120,6' },
  { name: 'Business Loan', badge: 'Fast', price: '14.0%', stroke: '#e53935', points: '0,8 10,10 20,6 30,15 40,12 50,20 60,18 70,25 80,22 90,28 100,30 110,26 120,32' },
  { name: 'Loan vs Property', badge: 'Secure', price: '9.50%', stroke: '#00d09c', points: '0,32 10,28 20,30 30,20 40,22 50,15 60,18 70,10 80,14 90,8 100,12 110,6 120,8' },
];

const RATE_TABLES = {
  personal: {
    head: ['Bank', 'Rate p.a.', 'Max Tenure', 'Highlight'],
    rows: [
      { dot: '#5367ff', bank: 'Axis Bank', rate: '10.49%', tenure: '5 yrs', tag: 'Best Rate', best: true, rateClass: 'positive fw600' },
      { dot: '#5367ff', bank: 'HDFC Bank', rate: '10.75%', tenure: '5 yrs', tag: 'Fast Disbursal' },
      { dot: '#f5a623', bank: 'ICICI Bank', rate: '10.85%', tenure: '5 yrs', tag: 'Easy Docs' },
      { dot: '#00d09c', bank: 'SBI', rate: '11.15%', tenure: '5 yrs', tag: 'Govt. Backed' },
      { dot: '#eb5b3c', bank: 'Kotak Bank', rate: '10.99%', tenure: '5 yrs', tag: 'Instant' },
    ],
  },
  home: {
    head: ['Bank', 'Rate p.a.', 'Max Tenure', 'Highlight'],
    rows: [
      { dot: '#5367ff', bank: 'HDFC Bank', rate: '8.35%', tenure: '30 yrs', tag: 'Best Rate', best: true, rateClass: 'positive fw600' },
      { dot: '#eb5b3c', bank: 'LIC HFL', rate: '8.45%', tenure: '30 yrs', tag: 'Trusted' },
      { dot: '#00d09c', bank: 'SBI', rate: '8.50%', tenure: '30 yrs', tag: 'Govt. Backed' },
      { dot: '#8b5cf6', bank: 'Axis Bank', rate: '8.70%', tenure: '30 yrs', tag: 'Easy Process' },
      { dot: '#f5a623', bank: 'ICICI Bank', rate: '8.75%', tenure: '30 yrs', tag: 'Top Lender' },
    ],
  },
  business: {
    head: ['Bank / NBFC', 'Rate p.a.', 'Max Tenure', 'Highlight'],
    rows: [
      { dot: '#00d09c', bank: 'HDFC Bank', rate: '14.0%', tenure: '4 yrs', tag: 'Best Rate', best: true, rateClass: 'positive fw600' },
      { dot: '#1976d2', bank: 'Bajaj Finserv', rate: '14.5%', tenure: '5 yrs', tag: 'High Limit' },
      { dot: '#8b5cf6', bank: 'IDFC First', rate: '14.5%', tenure: '4 yrs', tag: 'Fast' },
      { dot: '#f5a623', bank: 'Tata Capital', rate: '15.0%', tenure: '4 yrs', tag: 'Flexible' },
      { dot: '#eb5b3c', bank: 'Lendingkart', rate: '16.0%', tenure: '3 yrs', tag: 'Startup OK' },
    ],
  },
  lap: {
    head: ['Bank', 'Rate p.a.', 'Max Tenure', 'Highlight'],
    rows: [
      { dot: '#5367ff', bank: 'HDFC Bank', rate: '9.35%', tenure: '15 yrs', tag: 'Best Rate', best: true, rateClass: 'positive fw600' },
      { dot: '#00d09c', bank: 'SBI', rate: '9.50%', tenure: '15 yrs', tag: 'Govt. Backed' },
      { dot: '#f5a623', bank: 'ICICI Bank', rate: '9.75%', tenure: '15 yrs', tag: 'High LTV' },
      { dot: '#8b5cf6', bank: 'Axis Bank', rate: '9.90%', tenure: '15 yrs', tag: 'Easy Process' },
      { dot: '#eb5b3c', bank: 'Bajaj Finserv', rate: '10.50%', tenure: '12 yrs', tag: 'Fast' },
    ],
  },
};
const RATE_TAB_LABELS = { personal: 'Personal Loan', home: 'Home Loan', business: 'Business Loan', lap: 'Loan vs Property' };

const FIN_SERVICES = [
  { id: 'wealth', title: 'Wealth Advisory', desc: 'SIP, Mutual Funds & Goal-based investment planning to grow your money steadily.', iconBg: 'linear-gradient(135deg,#e8faf4,#c8f0e4)',
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M3 17L9 11L13 15L21 7" stroke="#00d09c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M17 7H21V11" stroke="#00d09c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { id: 'insurance', title: 'Insurance Advisory', desc: 'Term, Health & Business Insurance — we help you choose the right cover, not just any cover.', iconBg: 'linear-gradient(135deg,#eef0ff,#dde0ff)',
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#5367ff" strokeWidth="2" strokeLinejoin="round"/></svg> },
  { id: 'tax', title: 'Tax Planning Guidance', desc: 'ITR filing support & smart tax-saving strategies to legally reduce your tax burden.', iconBg: 'linear-gradient(135deg,#fff8ed,#feecd0)',
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="#f5a623" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><polyline points="14 2 14 8 20 8" stroke="#f5a623" strokeWidth="2"/><line x1="8" y1="13" x2="16" y2="13" stroke="#f5a623" strokeWidth="2" strokeLinecap="round"/><line x1="8" y1="17" x2="16" y2="17" stroke="#f5a623" strokeWidth="2" strokeLinecap="round"/></svg> },
  { id: 'credit', title: 'Credit Score Improvement', desc: 'Free CIBIL check + personalised tips to boost your score and unlock better loan offers.', iconBg: 'linear-gradient(135deg,#fce8e4,#fdd0c8)',
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#eb5b3c" strokeWidth="2"/><path d="M9 12l2 2 4-4" stroke="#eb5b3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { id: 'planning', title: 'Financial Planning', desc: "Retirement corpus, children's education fund, and long-term wealth building — all planned for you.", iconBg: 'linear-gradient(135deg,#f0ebff,#e0d5ff)',
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="#8b5cf6" strokeWidth="2" strokeLinejoin="round"/><polyline points="9 22 9 12 15 12 15 22" stroke="#8b5cf6" strokeWidth="2" strokeLinejoin="round"/></svg> },
];

const TOOL_META = {
  emi: { title: 'EMI Calculator', sub: 'Calculate your monthly loan repayment', iconBg: 'linear-gradient(135deg,#e8f9f4,#ccf2e5)',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="#00d09c" strokeWidth="2"/><path d="M3 9h18" stroke="#00d09c" strokeWidth="2"/><path d="M8 2v4M16 2v4" stroke="#00d09c" strokeWidth="2" strokeLinecap="round"/><path d="M8 13h8M8 17h5" stroke="#00d09c" strokeWidth="2" strokeLinecap="round"/></svg> },
  cibil: { title: 'CIBIL Score Guide', sub: 'Understand and improve your credit score', iconBg: 'linear-gradient(135deg,#fff8e8,#ffefc2)',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 2L15 8H21L16 12L18 19L12 15L6 19L8 12L3 8H9L12 2Z" stroke="#f5a623" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  eligibility: { title: 'Eligibility Checker', sub: 'Find your estimated loan eligibility instantly', iconBg: 'linear-gradient(135deg,#eef0ff,#dde1ff)',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M9 11l3 3L22 4" stroke="#5367ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="#5367ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  sip: { title: 'SIP Calculator', sub: 'Plan your monthly investments and returns', iconBg: 'linear-gradient(135deg,#f3eeff,#e4d9ff)',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 17L9 11L13 15L21 7" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M17 7H21V11" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  balance: { title: 'Balance Transfer Calculator', sub: 'See how much you save with a lower interest rate', iconBg: 'linear-gradient(135deg,#fef0ec,#fdddd4)',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M17 1l4 4-4 4" stroke="#eb5b3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 11V9a4 4 0 014-4h14" stroke="#eb5b3c" strokeWidth="2" strokeLinecap="round"/><path d="M7 23l-4-4 4-4" stroke="#eb5b3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 13v2a4 4 0 01-4 4H3" stroke="#eb5b3c" strokeWidth="2" strokeLinecap="round"/></svg> },
  compare: { title: 'Loan Comparison Tool', sub: 'Compare interest rates across top banks', iconBg: 'linear-gradient(135deg,#e8f9f4,#ccf2e5)',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1" stroke="#00b386" strokeWidth="2"/><rect x="14" y="3" width="7" height="7" rx="1" stroke="#00b386" strokeWidth="2"/><rect x="3" y="14" width="7" height="7" rx="1" stroke="#00b386" strokeWidth="2"/><rect x="14" y="14" width="7" height="7" rx="1" stroke="#00b386" strokeWidth="2"/></svg> },
};

const TOOL_CARDS = [
  { id: 'emi', iconBg: 'linear-gradient(135deg,#e8f9f4,#ccf2e5)', tagBg: '#e8f9f4', tagColor: '#00b386', tag: 'Popular', title: 'EMI Calculator', desc: 'Instantly calculate your monthly EMI. Adjust amount, rate, and tenure with sliders.', preview: <><span>₹5L · 12% · 5yr</span><span className="l-thc-pval">₹11,122/mo</span></>, cta: 'Open Calculator', ctaColor: '#00d09c',
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="#00d09c" strokeWidth="2"/><path d="M3 9h18" stroke="#00d09c" strokeWidth="2"/><path d="M8 2v4M16 2v4" stroke="#00d09c" strokeWidth="2" strokeLinecap="round"/><path d="M8 13h8M8 17h5" stroke="#00d09c" strokeWidth="2" strokeLinecap="round"/></svg> },
  { id: 'cibil', iconBg: 'linear-gradient(135deg,#fff8e8,#ffefc2)', tagBg: '#fff8e8', tagColor: '#e08a00', tag: 'Free Guide', title: 'CIBIL Score Check', desc: 'Understand your credit score, what it means for approval, and how to improve it.', preview: <div className="l-thc-cibil-mini"><div className="l-thc-cibil-bar"><div className="l-thc-cibil-fill" style={{ width: '78%' }} /></div><span>750+ = Excellent</span></div>, cta: 'Check Score Guide', ctaColor: '#f5a623',
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M12 2L15 8H21L16 12L18 19L12 15L6 19L8 12L3 8H9L12 2Z" stroke="#f5a623" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { id: 'eligibility', iconBg: 'linear-gradient(135deg,#eef0ff,#dde1ff)', tagBg: '#eef0ff', tagColor: '#5367ff', tag: 'Instant', title: 'Eligibility Checker', desc: 'Find how much loan you qualify for based on your income and existing EMIs.', preview: <><span>₹50K salary</span><span className="l-thc-pval" style={{ color: '#5367ff' }}>~₹12L eligible</span></>, cta: 'Check Eligibility', ctaColor: '#5367ff',
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M9 11l3 3L22 4" stroke="#5367ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="#5367ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { id: 'sip', iconBg: 'linear-gradient(135deg,#f3eeff,#e4d9ff)', tagBg: '#f3eeff', tagColor: '#8b5cf6', tag: 'Investment', title: 'SIP Calculator', desc: 'Calculate the future value of your SIP investments with compounding returns over time.', preview: <><span>₹5K/mo · 12% · 10yr</span><span className="l-thc-pval" style={{ color: '#8b5cf6' }}>₹11.6L</span></>, cta: 'Calculate Returns', ctaColor: '#8b5cf6',
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M3 17L9 11L13 15L21 7" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M17 7H21V11" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { id: 'balance', iconBg: 'linear-gradient(135deg,#fef0ec,#fdddd4)', tagBg: '#fef0ec', tagColor: '#eb5b3c', tag: 'Save Money', title: 'Balance Transfer Calc', desc: 'See how much you save by switching your existing loan to a lower interest rate.', preview: <><span>14% → 10.5%</span><span className="l-thc-pval" style={{ color: '#eb5b3c' }}>Save ₹2.3L+</span></>, cta: 'Calculate Savings', ctaColor: '#eb5b3c',
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M17 1l4 4-4 4" stroke="#eb5b3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 11V9a4 4 0 014-4h14" stroke="#eb5b3c" strokeWidth="2" strokeLinecap="round"/><path d="M7 23l-4-4 4-4" stroke="#eb5b3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 13v2a4 4 0 01-4 4H3" stroke="#eb5b3c" strokeWidth="2" strokeLinecap="round"/></svg> },
  { id: 'compare', iconBg: 'linear-gradient(135deg,#e8f9f4,#ccf2e5)', tagBg: '#e8f9f4', tagColor: '#00b386', tag: 'Compare', title: 'Loan Comparison Tool', desc: 'Compare rates, EMIs, and total costs across SBI, HDFC, ICICI, Axis, and Kotak.', preview: <><span>5 banks compared</span><span className="l-thc-pval" style={{ color: '#00b386' }}>Pick best deal</span></>, cta: 'Compare Banks', ctaColor: '#00b386',
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1" stroke="#00b386" strokeWidth="2"/><rect x="14" y="3" width="7" height="7" rx="1" stroke="#00b386" strokeWidth="2"/><rect x="3" y="14" width="7" height="7" rx="1" stroke="#00b386" strokeWidth="2"/><rect x="14" y="14" width="7" height="7" rx="1" stroke="#00b386" strokeWidth="2"/></svg> },
];

const BANK_RATES = {
  personal: [
    { bank: 'Axis Bank', rate: 10.49 }, { bank: 'HDFC Bank', rate: 10.75 },
    { bank: 'ICICI Bank', rate: 10.85 }, { bank: 'SBI', rate: 11.15 },
    { bank: 'Kotak Bank', rate: 10.99 }, { bank: 'Bajaj Finserv', rate: 13.0 },
  ],
  home: [
    { bank: 'HDFC Bank', rate: 8.35 }, { bank: 'LIC HFL', rate: 8.45 },
    { bank: 'SBI', rate: 8.50 }, { bank: 'Axis Bank', rate: 8.70 },
    { bank: 'ICICI Bank', rate: 8.75 }, { bank: 'Kotak Bank', rate: 8.85 },
  ],
  business: [
    { bank: 'HDFC Bank', rate: 14.0 }, { bank: 'Bajaj Finserv', rate: 14.5 },
    { bank: 'IDFC First', rate: 14.5 }, { bank: 'Tata Capital', rate: 15.0 },
    { bank: 'Lendingkart', rate: 16.0 }, { bank: 'FlexiLoans', rate: 18.0 },
  ],
  lap: [
    { bank: 'SBI', rate: 9.15 }, { bank: 'HDFC Bank', rate: 9.50 },
    { bank: 'ICICI Bank', rate: 9.60 }, { bank: 'Axis Bank', rate: 9.75 },
    { bank: 'Bajaj Finserv', rate: 10.0 }, { bank: 'Kotak Bank', rate: 10.25 },
  ],
};

const CONSULT_ICONS = {
  'Wealth Advisory': { bg: '#e8faf4', emoji: '📈' },
  'Insurance Advisory': { bg: '#eef0ff', emoji: '🛡️' },
  'Tax Planning Guidance': { bg: '#fff8ed', emoji: '📋' },
  'Credit Score Improvement': { bg: '#fce8e4', emoji: '⭐' },
  'Financial Planning': { bg: '#f0ebff', emoji: '🏡' },
};

const CIBIL_RANGES = [
  { dot: '#e53935', range: '300–549', label: 'Poor' },
  { dot: '#f5a623', range: '550–649', label: 'Fair' },
  { dot: '#ffd700', range: '650–749', label: 'Good' },
  { dot: '#00d09c', range: '750–799', label: 'Very Good' },
  { dot: '#00b386', range: '800–900', label: 'Excellent' },
];

function cibilInfo(score) {
  if (score < 550) return { label: 'Poor', desc: 'Your score needs significant improvement. Most lenders may decline loan applications or offer very high interest rates.', approval: 'Low approval chances', rate: 'Rates may exceed 18% p.a.', badgeBg: '#fdecea', color: '#e53935' };
  if (score < 650) return { label: 'Fair', desc: 'Your score is fair. Some lenders may approve loans but at higher rates. Focus on improving payment history.', approval: 'Moderate approval chances', rate: 'Rates typically 15%–18% p.a.', badgeBg: '#fff8e8', color: '#f5a623' };
  if (score < 750) return { label: 'Good', desc: 'Good score! Most banks will consider your application. You can negotiate for better interest rates.', approval: 'Good approval chances', rate: 'Rates from 12%–15% p.a.', badgeBg: '#fffde7', color: '#ffd700' };
  if (score < 800) return { label: 'Very Good', desc: 'Very good credit score! Banks will readily approve your loan with competitive interest rates.', approval: 'High approval chances', rate: 'Best rates from 10.49% p.a.', badgeBg: '#e8f9f4', color: '#00d09c' };
  return { label: 'Excellent', desc: 'Excellent credit score! You qualify for the best loan products with the lowest interest rates available.', approval: 'Very high approval chances', rate: 'Best rates from 10.49% p.a.', badgeBg: '#e8f9f4', color: '#00b386' };
}

// ── EMI Tool Panel ───────────────────────────────────────────────────────────
function EmiPanel({ onApply }) {
  const [amount, setAmount] = useState(500000);
  const [rate, setRate] = useState(12);
  const [tenure, setTenure] = useState(5);
  const canvasRef = useRef(null);

  const emi = calcEMIFormula(amount, rate, tenure);
  const totalPayment = emi * tenure * 12;
  const totalInterest = totalPayment - amount;

  // Amortization
  const amort = [];
  { let bal = amount; const r = rate / 100 / 12;
    for (let yr = 1; yr <= tenure; yr++) {
      let yp = 0, yi = 0;
      for (let m = 0; m < 12; m++) { if (bal <= 0) break; const ip = bal * r; const pp = Math.min(emi - ip, bal); yi += ip; yp += pp; bal -= pp; }
      amort.push({ yr, principal: yp, interest: yi, balance: Math.max(0, bal) });
    } }

  useEffect(() => { drawDonut(canvasRef.current, amount, totalInterest, '#5367ff', '#00d09c'); }, [amount, totalInterest]);

  return (
    <div className="l-tool-two-col">
      <div className="l-tool-inputs-col">
        <ToolSlider label="Loan Amount" prefix="₹" value={amount} setValue={setAmount} min={50000} max={10000000} step={10000} minLabel="₹50K" maxLabel="₹1 Cr" />
        <ToolSlider label="Interest Rate (p.a.)" suffix="%" value={rate} setValue={setRate} min={6} max={30} step={0.1} minLabel="6%" maxLabel="30%" />
        <ToolSlider label="Loan Tenure" suffix="Yrs" value={tenure} setValue={setTenure} min={1} max={30} step={1} minLabel="1 Yr" maxLabel="30 Yrs" />
        <div className="l-emi-result-cards">
          <div className="l-erc-item" style={{ '--erc-color': '#00d09c' }}><span className="l-erc-label">Monthly EMI</span><span className="l-erc-val">{fmtInr(emi)}</span></div>
          <div className="l-erc-item" style={{ '--erc-color': '#5367ff' }}><span className="l-erc-label">Total Interest</span><span className="l-erc-val">{fmtCur(totalInterest)}</span></div>
          <div className="l-erc-item" style={{ '--erc-color': '#f5a623' }}><span className="l-erc-label">Total Payment</span><span className="l-erc-val">{fmtCur(totalPayment)}</span></div>
        </div>
      </div>
      <div className="l-tool-result-col">
        <div className="l-tool-chart-wrap">
          <canvas ref={canvasRef} />
          <div className="l-tool-chart-center"><span className="l-tcc-label">Monthly EMI</span><span className="l-tcc-val">{fmtInr(emi)}</span></div>
        </div>
        <div className="l-tool-legend">
          <div className="l-tl-item"><span className="l-tl-dot" style={{ background: '#5367ff' }} /><span>Principal</span><strong>{fmtCur(amount)}</strong></div>
          <div className="l-tl-item"><span className="l-tl-dot" style={{ background: '#00d09c' }} /><span>Total Interest</span><strong>{fmtCur(totalInterest)}</strong></div>
        </div>
        <div className="l-tool-amort">
          <div className="l-ta-title">Yearly Amortization</div>
          <div className="l-ta-table-wrap">
            <table className="l-ta-table"><thead><tr><th>Year</th><th>Principal</th><th>Interest</th><th>Balance</th></tr></thead>
              <tbody>{amort.map(a => <tr key={a.yr}><td>Yr {a.yr}</td><td>{fmtCur(a.principal)}</td><td>{fmtCur(a.interest)}</td><td>{fmtCur(a.balance)}</td></tr>)}</tbody>
            </table>
          </div>
        </div>
        <button className="l-btn-primary l-tool-cta-btn" onClick={onApply}>Apply Now</button>
      </div>
    </div>
  );
}

// ── CIBIL Tool Panel ──────────────────────────────────────────────────────────
function CibilPanel({ onApply }) {
  const [score, setScore] = useState(750);
  const pathRef = useRef(null);
  const info = cibilInfo(score);

  useEffect(() => {
    const pct = (score - 300) / 600;
    const dashOffset = 267 * (1 - pct);
    if (pathRef.current) gsap.to(pathRef.current, { attr: { 'stroke-dashoffset': dashOffset }, duration: 0.4, ease: 'power2.out' });
  }, [score]);

  return (
    <div className="l-cibil-layout">
      <div className="l-cibil-gauge-col">
        <div className="l-cibil-gauge-wrap">
          <svg className="l-cibil-gauge-svg" viewBox="0 0 220 130" fill="none">
            <path d="M25 110 A85 85 0 0 1 195 110" stroke="#eee" strokeWidth="20" strokeLinecap="round" fill="none" />
            <path ref={pathRef} d="M25 110 A85 85 0 0 1 195 110" stroke="url(#cibGrad)" strokeWidth="20" strokeLinecap="round" fill="none" strokeDasharray="267" strokeDashoffset="67" />
            <defs><linearGradient id="cibGrad" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#e53935" /><stop offset="40%" stopColor="#f5a623" /><stop offset="70%" stopColor="#00d09c" /><stop offset="100%" stopColor="#00b386" /></linearGradient></defs>
          </svg>
          <div className="l-cibil-num-wrap">
            <span className="l-cibil-num">{score}</span>
            <span className="l-cibil-badge" style={{ background: info.badgeBg, color: info.color }}>{info.label}</span>
          </div>
        </div>
        <input type="range" className="l-slider l-cibil-slider" min={300} max={900} value={score} onChange={e => setScore(parseInt(e.target.value, 10))} style={rangeFill(score, 300, 900)} />
        <div className="l-tig-minmax"><span>300 (Poor)</span><span>900 (Best)</span></div>
        <div className="l-cibil-ranges">
          {CIBIL_RANGES.map(r => <div key={r.range} className="l-cr-item"><span className="l-cr-dot" style={{ background: r.dot }} /><span>{r.range}</span><strong>{r.label}</strong></div>)}
        </div>
      </div>
      <div className="l-cibil-info-col">
        <div className="l-cibil-impact-card" style={{ borderLeftColor: info.color }}>
          <p className="l-cic-desc">{info.desc}</p>
          <div className="l-cle-items">
            <div className="l-cle-item"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#00d09c" strokeWidth="2" /><path d="M8 12l3 3 5-6" stroke="#00d09c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg><span>{info.approval}</span></div>
            <div className="l-cle-item"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 1V23M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke="#5367ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg><span>{info.rate}</span></div>
          </div>
        </div>
        <div className="l-cibil-tips">
          <h4>How to improve your CIBIL score</h4>
          <div className="l-ct-item"><span className="l-ct-num">1</span><span>Pay all EMIs and credit card bills on time — payment history is 35% of your score.</span></div>
          <div className="l-ct-item"><span className="l-ct-num">2</span><span>Keep credit utilisation below 30% of your total credit limit at all times.</span></div>
          <div className="l-ct-item"><span className="l-ct-num">3</span><span>Avoid multiple loan applications in a short period — each creates a hard inquiry.</span></div>
          <div className="l-ct-item"><span className="l-ct-num">4</span><span>Maintain a healthy mix of secured (home/auto) and unsecured (personal) credit.</span></div>
        </div>
        <div className="l-cibil-cta-row">
          <p>Want us to help you get the best rate for your score?</p>
          <button className="l-btn-primary" style={{ marginTop: 12, display: 'inline-flex' }} onClick={onApply}>Talk to Our Expert</button>
        </div>
      </div>
    </div>
  );
}

// ── Eligibility Tool Panel ─────────────────────────────────────────────────────
function EligibilityPanel({ onApply }) {
  const [employment, setEmployment] = useState('salaried');
  const [income, setIncome] = useState(50000);
  const [existingEMI, setExistingEMI] = useState(0);
  const [loanType, setLoanType] = useState('personal');

  const rateMap = { personal: 10.49, business: 14, home: 8.35, lap: 9.5, professional: 10.75 };
  const tenureMap = { personal: 5, business: 4, home: 20, lap: 15, professional: 5 };
  const rate = rateMap[loanType] || 10.49;
  const tenure = tenureMap[loanType] || 5;
  const disposable = Math.max(0, income - existingEMI);
  const maxEMI = disposable * 0.5;
  const r = rate / 100 / 12, n = tenure * 12;
  let eligible = 0;
  if (maxEMI > 0 && r > 0) eligible = maxEMI * (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n));
  const pct = Math.min(100, (eligible / 5000000) * 100);

  return (
    <div className="l-tool-two-col">
      <div className="l-tool-inputs-col">
        <div className="l-el-toggle-wrap">
          <button className={`l-el-toggle-btn ${employment === 'salaried' ? 'active' : ''}`} onClick={() => setEmployment('salaried')}>Salaried</button>
          <button className={`l-el-toggle-btn ${employment === 'self' ? 'active' : ''}`} onClick={() => setEmployment('self')}>Self-Employed</button>
        </div>
        <ToolSlider label={employment === 'salaried' ? 'Monthly Salary (₹)' : 'Monthly Net Income (₹)'} prefix="₹" value={income} setValue={setIncome} min={10000} max={500000} step={1000} minLabel="₹10K" maxLabel="₹5L" />
        <ToolSlider label="Existing Monthly EMIs (₹)" prefix="₹" value={existingEMI} setValue={setExistingEMI} min={0} max={200000} step={500} minLabel="₹0" maxLabel="₹2L" />
        <div className="l-tool-input-group">
          <label className="l-tig-standalone-label">Loan Type</label>
          <select className="l-tool-select" value={loanType} onChange={e => setLoanType(e.target.value)}>
            <option value="personal">Personal Loan (10.49%)</option>
            <option value="business">Business Loan (14%)</option>
            <option value="home">Home Loan (8.35%)</option>
            <option value="lap">Loan Against Property (9.5%)</option>
            <option value="professional">Professional Loan (10.75%)</option>
          </select>
        </div>
      </div>
      <div className="l-tool-result-col">
        <div className="l-el-result-box">
          <div className="l-el-result-label">Estimated Eligibility</div>
          <div className="l-el-result-amount">{eligible > 0 ? fmtInr(eligible) : 'Not Eligible'}</div>
          <div className="l-el-result-sub">{`Based on ${rate.toFixed(2)}% rate · ${tenure} yr tenure`}</div>
          <div className="l-el-prog-wrap">
            <div className="l-el-prog-track"><div className="l-el-prog-fill" style={{ width: pct + '%' }} /></div>
            <div className="l-el-prog-labels"><span>Low</span><span>Good</span><span>High</span></div>
          </div>
        </div>
        <div className="l-el-breakdown">
          <div className="l-elb-row"><span>Monthly Income</span><strong>{fmtInr(income)}</strong></div>
          <div className="l-elb-row"><span>Existing EMIs</span><strong>{fmtInr(existingEMI)}</strong></div>
          <div className="l-elb-row"><span>Disposable Income</span><strong>{fmtInr(disposable)}</strong></div>
          <div className="l-elb-row l-elb-highlight"><span>Max New EMI (50%)</span><strong>{fmtInr(maxEMI)}</strong></div>
          <div className="l-elb-row"><span>Rate Applied</span><strong>{rate.toFixed(2)}% p.a.</strong></div>
        </div>
        <button className="l-btn-primary l-tool-cta-btn" onClick={onApply}>Apply for Loan</button>
      </div>
    </div>
  );
}

// ── SIP Tool Panel ──────────────────────────────────────────────────────────
function SipPanel() {
  const [amount, setAmount] = useState(5000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);
  const canvasRef = useRef(null);

  const r = rate / 100 / 12, n = years * 12;
  const fv = amount * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
  const invested = amount * n;
  const returns = fv - invested;
  const gainPct = invested > 0 ? (returns / invested) * 100 : 0;
  const barW = Math.min(100, gainPct / 3);

  useEffect(() => { drawDonut(canvasRef.current, invested, returns, '#8b5cf6', '#00d09c'); }, [invested, returns]);

  return (
    <div className="l-tool-two-col">
      <div className="l-tool-inputs-col">
        <ToolSlider label="Monthly Investment" prefix="₹" value={amount} setValue={setAmount} min={500} max={100000} step={500} minLabel="₹500" maxLabel="₹1L" />
        <ToolSlider label="Expected Return Rate (p.a.)" suffix="%" value={rate} setValue={setRate} min={4} max={30} step={0.5} minLabel="4%" maxLabel="30%" />
        <ToolSlider label="Time Period" suffix="Yrs" value={years} setValue={setYears} min={1} max={40} step={1} minLabel="1 Yr" maxLabel="40 Yrs" />
        <div className="l-emi-result-cards">
          <div className="l-erc-item" style={{ '--erc-color': '#8b5cf6' }}><span className="l-erc-label">Total Invested</span><span className="l-erc-val">{fmtCur(invested)}</span></div>
          <div className="l-erc-item" style={{ '--erc-color': '#00d09c' }}><span className="l-erc-label">Est. Returns</span><span className="l-erc-val">{fmtCur(returns)}</span></div>
          <div className="l-erc-item" style={{ '--erc-color': '#f5a623' }}><span className="l-erc-label">Total Value</span><span className="l-erc-val">{fmtCur(fv)}</span></div>
        </div>
      </div>
      <div className="l-tool-result-col">
        <div className="l-tool-chart-wrap">
          <canvas ref={canvasRef} />
          <div className="l-tool-chart-center"><span className="l-tcc-label">Total Value</span><span className="l-tcc-val">{fmtCur(fv)}</span></div>
        </div>
        <div className="l-tool-legend">
          <div className="l-tl-item"><span className="l-tl-dot" style={{ background: '#8b5cf6' }} /><span>Amount Invested</span><strong>{fmtCur(invested)}</strong></div>
          <div className="l-tl-item"><span className="l-tl-dot" style={{ background: '#00d09c' }} /><span>Returns Earned</span><strong>{fmtCur(returns)}</strong></div>
        </div>
        <div className="l-sip-wealth-bar">
          <div className="l-swb-label">Wealth Gain Ratio</div>
          <div className="l-swb-track"><div className="l-swb-fill" style={{ width: barW + '%' }} /></div>
          <div className="l-swb-nums"><span>0%</span><span className="l-swb-pct">+{Math.round(gainPct)}%</span></div>
        </div>
      </div>
    </div>
  );
}

// ── Balance Transfer Tool Panel ─────────────────────────────────────────────────
function BalancePanel({ onApply }) {
  const [amount, setAmount] = useState(1000000);
  const [tenure, setTenure] = useState(10);
  const [oldRate, setOldRate] = useState(14);
  const [newRate, setNewRate] = useState(10.5);

  const oldEMI = calcEMIFormula(amount, oldRate, tenure);
  const newEMI = calcEMIFormula(amount, newRate, tenure);
  const oldTotal = oldEMI * tenure * 12;
  const newTotal = newEMI * tenure * 12;
  const oldInterest = oldTotal - amount;
  const newInterest = newTotal - amount;
  const monthlySaving = oldEMI - newEMI;
  const totalSaving = oldInterest - newInterest;

  return (
    <div className="l-tool-two-col">
      <div className="l-tool-inputs-col">
        <ToolSlider label="Outstanding Loan Amount" prefix="₹" value={amount} setValue={setAmount} min={50000} max={10000000} step={10000} minLabel="₹50K" maxLabel="₹1 Cr" />
        <ToolSlider label="Remaining Tenure" suffix="Yrs" value={tenure} setValue={setTenure} min={1} max={30} step={1} minLabel="1 Yr" maxLabel="30 Yrs" />
        <ToolSlider label="Current Interest Rate" suffix="%" value={oldRate} setValue={setOldRate} min={6} max={36} step={0.1} minLabel="6%" maxLabel="36%" />
        <ToolSlider label="New Rate (AJ Finance)" suffix="%" value={newRate} setValue={setNewRate} min={6} max={30} step={0.1} minLabel="6%" maxLabel="30%" />
      </div>
      <div className="l-tool-result-col">
        <div className="l-bt-comparison">
          <div className="l-btc-col l-btc-old">
            <div className="l-btc-bank-label">Current Loan</div>
            <div className="l-btc-emi">{fmtInr(oldEMI)}</div>
            <div className="l-btc-sub">per month</div>
            <div className="l-btc-detail"><span>Total Interest</span><strong>{fmtCur(oldInterest)}</strong></div>
            <div className="l-btc-detail"><span>Total Payment</span><strong>{fmtCur(oldTotal)}</strong></div>
            <div className="l-btc-rate-tag">{oldRate.toFixed(1)}% p.a.</div>
          </div>
          <div className="l-btc-vs"><svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M5 12H19M13 6l6 6-6 6" stroke="#00d09c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
          <div className="l-btc-col l-btc-new">
            <div className="l-btc-bank-label">After Transfer</div>
            <div className="l-btc-emi l-btc-emi-new">{fmtInr(newEMI)}</div>
            <div className="l-btc-sub">per month</div>
            <div className="l-btc-detail"><span>Total Interest</span><strong>{fmtCur(newInterest)}</strong></div>
            <div className="l-btc-detail"><span>Total Payment</span><strong>{fmtCur(newTotal)}</strong></div>
            <div className="l-btc-rate-tag l-btc-rate-new">{newRate.toFixed(1)}% p.a.</div>
          </div>
        </div>
        <div className="l-bt-savings-box">
          <div className="l-btsb-row"><span>Monthly EMI Savings</span><strong className="l-positive">{monthlySaving > 0 ? fmtInr(monthlySaving) : '—'}</strong></div>
          <div className="l-btsb-row l-btsb-highlight"><span>Total Interest Saved</span><strong className="l-positive">{totalSaving > 0 ? fmtCur(totalSaving) : '—'}</strong></div>
        </div>
        <button className="l-btn-primary l-tool-cta-btn" onClick={onApply}>Transfer My Loan</button>
      </div>
    </div>
  );
}

// ── Loan Comparison Tool Panel ──────────────────────────────────────────────────
function ComparePanel({ onApply }) {
  const [loanType, setLoanType] = useState('personal');
  const [amount, setAmount] = useState(1000000);
  const [tenure, setTenure] = useState(5);

  const banks = BANK_RATES[loanType] || BANK_RATES.personal;
  const sorted = [...banks].sort((a, b) => a.rate - b.rate);

  return (
    <>
      <div className="l-compare-controls">
        <div className="l-cc-group">
          <label>Loan Type</label>
          <select className="l-tool-select" value={loanType} onChange={e => setLoanType(e.target.value)}>
            <option value="personal">Personal Loan</option>
            <option value="home">Home Loan</option>
            <option value="business">Business Loan</option>
            <option value="lap">Loan Against Property</option>
          </select>
        </div>
        <div className="l-cc-group">
          <label>Loan Amount</label>
          <div className="l-tig-input-wrap l-cc-input-wrap"><span>₹</span><input type="number" value={amount} min={50000} max={10000000} step={50000} onChange={e => setAmount(parseFloat(e.target.value) || 0)} /></div>
        </div>
        <div className="l-cc-group">
          <label>Tenure (Years)</label>
          <div className="l-tig-input-wrap l-cc-input-wrap"><input type="number" value={tenure} min={1} max={30} onChange={e => setTenure(parseFloat(e.target.value) || 1)} /><span>Yrs</span></div>
        </div>
      </div>
      <div className="l-compare-table-wrap">
        <table className="l-compare-table">
          <thead><tr><th>Bank / Lender</th><th>Int. Rate (p.a.)</th><th>Monthly EMI</th><th>Total Interest</th><th>Total Payment</th><th></th></tr></thead>
          <tbody>
            {sorted.map((b, i) => {
              const emi = calcEMIFormula(amount, b.rate, tenure);
              const tp = emi * tenure * 12;
              const ti = tp - amount;
              return (
                <tr key={b.bank} className={i === 0 ? 'l-cmp-best' : ''}>
                  <td><span className="l-cmp-bank">{b.bank}</span>{i === 0 && <span className="l-cmp-badge">Best Rate</span>}</td>
                  <td><span className="l-cmp-rate">{b.rate.toFixed(2)}%</span></td>
                  <td><strong>{fmtInr(emi)}</strong></td>
                  <td>{fmtCur(ti)}</td>
                  <td>{fmtCur(tp)}</td>
                  <td><button className="l-cmp-apply" onClick={onApply}>Apply</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="l-compare-note">Rates are indicative starting rates as of 2025. Actual rates depend on applicant profile, credit score, and bank policy.</div>
    </>
  );
}

// ── Reusable slider with synced number input ────────────────────────────────────
function ToolSlider({ label, value, setValue, min, max, step = 1, prefix, suffix, minLabel, maxLabel }) {
  return (
    <div className="l-tool-input-group">
      <div className="l-tig-label-row">
        <label>{label}</label>
        <div className="l-tig-input-wrap">
          {prefix && <span>{prefix}</span>}
          <input type="number" value={value} min={min} max={max} step={step} onChange={e => setValue(parseFloat(e.target.value) || 0)} />
          {suffix && <span>{suffix}</span>}
        </div>
      </div>
      <input type="range" className="l-slider l-tool-range" min={min} max={max} step={step} value={value} onChange={e => setValue(parseFloat(e.target.value))} style={rangeFill(value, min, max)} />
      <div className="l-tig-minmax"><span>{minLabel}</span><span>{maxLabel}</span></div>
    </div>
  );
}

// ── Animated stat counter ───────────────────────────────────────────────────────
function NumberCounter({ target, prefix, suffix, decimals }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obj = { val: 0 };
    let tween;
    ScrollTrigger.create({
      trigger: el, start: 'top 90%', once: true,
      onEnter: () => {
        tween = gsap.to(obj, {
          val: target, duration: 2, ease: 'power2.out',
          onUpdate() { el.textContent = prefix + obj.val.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + suffix; },
          onComplete() { el.textContent = prefix + target.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + suffix; },
        });
      },
    });
    return () => { if (tween) tween.kill(); };
  }, [target, prefix, suffix, decimals]);
  return <span ref={ref} className="l-counter">{prefix}0{suffix}</span>;
}

export default function Landing() {
  const rootRef = useRef(null);
  const navRef = useRef(null);
  const svgRef = useRef(null);
  const tickerRef = useRef(null);
  const sheetRef = useRef(null);

  const [activeRateTab, setActiveRateTab] = useState('personal');
  const [openTool, setOpenTool] = useState(null);
  const [consultService, setConsultService] = useState(null);
  const [consultSuccess, setConsultSuccess] = useState(false);

  const openConsultation = useCallback((service) => {
    setConsultSuccess(false);
    setConsultService(service);
  }, []);
  const closeConsultation = useCallback(() => setConsultService(null), []);

  const openToolSheet = useCallback((id) => setOpenTool(id), []);
  const closeToolSheet = useCallback(() => {
    if (sheetRef.current) {
      gsap.to(sheetRef.current, { y: '100%', duration: 0.4, ease: 'power3.in', onComplete: () => setOpenTool(null) });
    } else {
      setOpenTool(null);
    }
  }, []);

  // Animate tool sheet in when it opens
  useEffect(() => {
    if (openTool && sheetRef.current) {
      gsap.fromTo(sheetRef.current, { y: '100%' }, { y: '0%', duration: 0.5, ease: 'power3.out' });
      document.body.style.overflow = 'hidden';
    }
    if (!openTool) document.body.style.overflow = '';
    return () => { if (!openTool) document.body.style.overflow = ''; };
  }, [openTool]);

  // Esc closes overlays
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        if (openTool) closeToolSheet();
        if (consultService) closeConsultation();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openTool, consultService, closeToolSheet, closeConsultation]);

  // Consult modal entrance
  useEffect(() => {
    if (consultService) {
      const modal = rootRef.current?.querySelector('.l-consult-modal');
      if (modal) gsap.fromTo(modal, { opacity: 0, y: 30, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'power3.out' });
      document.body.style.overflow = 'hidden';
    } else if (!openTool) {
      document.body.style.overflow = '';
    }
  }, [consultService, openTool]);

  useEffect(() => {
    buildIsoCity(svgRef.current);

    const nav = navRef.current;
    const handleScroll = () => nav.classList.toggle('l-scrolled', window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.25 });
      tl
        .fromTo('.l-hero-badge', { opacity: 0, y: 20, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.6 })
        .fromTo('.l-hero-word', { opacity: 0, y: 40, rotateX: 40 }, { opacity: 1, y: 0, rotateX: 0, duration: 0.7, stagger: 0.1, ease: 'back.out(1.4)' }, '-=0.2')
        .fromTo('.l-hero-sub', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, '-=1.0')
        .fromTo('.l-hero-cta > *', { opacity: 0, y: 20, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.12, ease: 'back.out(1.5)' }, '-=0.4')
        .fromTo('.l-hero-stats', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.3')
        .fromTo('.l-hero-visual', { opacity: 0, x: 60, scale: 0.95 }, { opacity: 1, x: 0, scale: 1, duration: 1, ease: 'power3.out' }, '-=0.8')
        .fromTo('.l-hiso-badge', { opacity: 0, scale: 0.7, y: 10 }, { opacity: 1, scale: 1, y: 0, duration: 0.5, stagger: 0.18, ease: 'back.out(1.7)' }, '-=0.4');

      gsap.to('.l-hiso-badge', { y: '-=9', duration: 2.1, ease: 'sine.inOut', yoyo: true, repeat: -1, stagger: { each: 0.55, from: 'start' }, delay: 1.8 });

      document.querySelectorAll('.l-stat-count').forEach(el => {
        const target = parseInt(el.dataset.target, 10);
        if (!target) return;
        const obj = { val: 0 };
        gsap.fromTo(el, { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.4)', delay: 1.2 });
        gsap.to(obj, {
          val: target, duration: 2, ease: 'power2.out', delay: 1.2,
          onUpdate() { el.textContent = target >= 1000 ? Math.round(obj.val).toLocaleString('en-IN') : Math.round(obj.val); },
          onComplete() { el.textContent = target >= 1000 ? target.toLocaleString('en-IN') : target; gsap.fromTo(el, { scale: 1 }, { scale: 1.12, duration: 0.2, yoyo: true, repeat: 1, ease: 'power2.inOut' }); },
        });
      });

      gsap.utils.toArray('.l-section-header').forEach(el => {
        gsap.set(el, { opacity: 0, y: 20 });
        ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true, onEnter: () => gsap.to(el, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }) });
      });

      gsap.utils.toArray('.l-number-card').forEach((card, i) => {
        gsap.set(card, { opacity: 0, y: 30 });
        ScrollTrigger.create({ trigger: card, start: 'top 88%', once: true, onEnter: () => gsap.to(card, { opacity: 1, y: 0, duration: 0.6, delay: i * 0.06, ease: 'power2.out' }) });
      });
      gsap.utils.toArray('.l-number-bar-fill').forEach(bar => {
        const w = bar.dataset.width || 0;
        ScrollTrigger.create({ trigger: bar, start: 'top 92%', once: true, onEnter: () => gsap.to(bar, { width: w + '%', duration: 1.5, ease: 'power2.out', delay: 0.3 }) });
      });

      gsap.utils.toArray('.l-index-card').forEach((el, i) => {
        gsap.set(el, { opacity: 0, y: 24 });
        ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true, onEnter: () => gsap.to(el, { opacity: 1, y: 0, duration: 0.6, delay: i * 0.05, ease: 'power2.out' }) });
      });
      gsap.utils.toArray('.l-index-sparkline polyline').forEach(line => {
        ScrollTrigger.create({
          trigger: line.closest('.l-index-card'), start: 'top 85%', once: true,
          onEnter: () => { const len = line.getTotalLength(); gsap.fromTo(line, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 1.5, ease: 'power2.out' }); },
        });
      });
      gsap.utils.toArray('.l-rate-tabs-wrap').forEach(el => {
        gsap.set(el, { opacity: 0, y: 24 });
        ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true, onEnter: () => gsap.to(el, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }) });
      });

      gsap.utils.toArray('.l-fsc-card').forEach((card, i) => {
        gsap.set(card, { opacity: 0, y: 30 });
        ScrollTrigger.create({ trigger: card, start: 'top 88%', once: true, onEnter: () => gsap.to(card, { opacity: 1, y: 0, duration: 0.55, delay: (i % 3) * 0.09, ease: 'power2.out' }) });
      });

      gsap.utils.toArray('.l-product-card').forEach((card, i) => {
        gsap.set(card, { opacity: 0, y: 30 });
        ScrollTrigger.create({ trigger: card, start: 'top 88%', once: true, onEnter: () => gsap.to(card, { opacity: 1, y: 0, duration: 0.6, delay: i * 0.05, ease: 'power2.out' }) });
      });

      gsap.utils.toArray('.l-tool-hub-card').forEach((card, i) => {
        gsap.set(card, { opacity: 0, y: 30 });
        ScrollTrigger.create({ trigger: card, start: 'top 88%', once: true, onEnter: () => gsap.to(card, { opacity: 1, y: 0, duration: 0.55, delay: i * 0.07, ease: 'power2.out' }) });
      });

      gsap.utils.toArray('.l-step').forEach((el, i) => {
        gsap.set(el, { opacity: 0, y: 28 });
        ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: () => gsap.to(el, { opacity: 1, y: 0, duration: 0.55, delay: i * 0.12, ease: 'power2.out' }) });
      });

      gsap.utils.toArray('.l-partner-card').forEach((el, i) => {
        gsap.set(el, { opacity: 0, y: 24 });
        ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: () => gsap.to(el, { opacity: 1, y: 0, duration: 0.5, delay: i * 0.06, ease: 'power2.out' }) });
      });

      gsap.from('.l-about-grid', { scrollTrigger: { trigger: '.l-about-grid', start: 'top 88%', once: true }, y: 25, opacity: 0, duration: 0.6, ease: 'power2.out' });
      gsap.utils.toArray('.l-about-metric').forEach((el, i) => {
        gsap.set(el, { opacity: 0, y: 20, scale: 0.9 });
        ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true, onEnter: () => gsap.to(el, { opacity: 1, y: 0, scale: 1, duration: 0.5, delay: i * 0.1, ease: 'back.out(1.4)' }) });
      });

      gsap.fromTo('.l-cta-banner', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', scrollTrigger: { trigger: '.l-cta-banner', start: 'top 85%', once: true } });
    }, rootRef);

    const handleMouseMove = (e) => {
      const mx = e.clientX / window.innerWidth - 0.5;
      const my = e.clientY / window.innerHeight - 0.5;
      document.querySelectorAll('.l-hiso-badge').forEach((card, i) => {
        const speed = (i + 1) * 10;
        gsap.to(card, { x: mx * speed, y: my * speed, duration: 0.8, ease: 'power2.out' });
      });
    };
    window.addEventListener('mousemove', handleMouseMove);

    const anchors = rootRef.current?.querySelectorAll('a[href^="#"]') ?? [];
    const handleAnchorClick = (e) => {
      const href = e.currentTarget.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const top = target.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    };
    anchors.forEach(a => a.addEventListener('click', handleAnchorClick));

    // Ticker pause on hover
    const tk = tickerRef.current;
    const pause = () => { if (tk) tk.style.animationPlayState = 'paused'; };
    const resume = () => { if (tk) tk.style.animationPlayState = 'running'; };
    if (tk) { tk.addEventListener('mouseenter', pause); tk.addEventListener('mouseleave', resume); }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      anchors.forEach(a => a.removeEventListener('click', handleAnchorClick));
      if (tk) { tk.removeEventListener('mouseenter', pause); tk.removeEventListener('mouseleave', resume); }
      ctx.revert();
      document.body.style.overflow = '';
    };
  }, []);

  const goToApply = useCallback(() => { closeToolSheet(); }, [closeToolSheet]);

  const handleConsultSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const name = (fd.get('cName') || '').toString().trim();
    const phone = (fd.get('cPhone') || '').toString().trim();
    if (!name || !/^[6-9][0-9]{9}$/.test(phone)) {
      alert('Please enter a valid name and 10-digit mobile number.');
      return;
    }
    setConsultSuccess(true);
    setTimeout(() => closeConsultation(), 3000);
  };

  const consultMeta = consultService ? (CONSULT_ICONS[consultService] || { bg: '#e8faf4', emoji: '💼' }) : null;

  return (
    <div className="landing-root" ref={rootRef}>

      {/* Navbar */}
      <nav className="l-nav" ref={navRef}>
        <div className="l-nav-inner">
          <div className="l-logo">
            <span className="l-logo-mark">AJ</span>
            <span className="l-logo-text">Finance</span>
          </div>
          <div className="l-nav-links">
            <a href="#products" className="l-nav-link">Services</a>
            <a href="#tools" className="l-nav-link">Tools</a>
            <a href="#process" className="l-nav-link">How It Works</a>
            <a href="#partners" className="l-nav-link">Banks</a>
            <a href="#about" className="l-nav-link">About</a>
          </div>
          <Link to="/login" className="l-login-btn">Staff Login</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="l-hero" id="home">
        <div className="l-container l-hero-layout">
          <div className="l-hero-content">
            <div className="l-hero-badge">
              <span className="l-badge-dot" />
              Trusted financial assistance partner
            </div>
            <h1 className="l-hero-title">
              <span className="l-hero-word">Trusted</span>{' '}
              <span className="l-hero-word">Finance</span>
              <br />
              <span className="l-hero-highlight">
                <span className="l-hero-word">Assistance</span>{' '}
                <span className="l-hero-word">Made</span>{' '}
                <span className="l-hero-word">Simple</span>
              </span>
            </h1>
            <p className="l-hero-sub">
              Secure, transparent, and fast financial solutions through trusted banking partners.
              AJ Finance helps individuals, professionals, and businesses access the right financial solutions.
            </p>
            <div className="l-hero-cta">
              <a href="#products" className="l-btn-primary">Explore Services</a>
              <Link to="/login" className="l-btn-outline">Staff Portal</Link>
            </div>
            <div className="l-hero-stats">
              <div className="l-stat">
                <span className="l-stat-count" data-target="50000">50,000</span>
                <span className="l-stat-suffix">+</span>
                <span className="l-stat-label">Happy Customers</span>
              </div>
              <div className="l-stat-div" />
              <div className="l-stat">
                <span className="l-stat-count" data-target="15">15</span>
                <span className="l-stat-suffix">+</span>
                <span className="l-stat-label">Banking Partners</span>
              </div>
              <div className="l-stat-div" />
              <div className="l-stat">
                <span className="l-stat-count" data-target="500">500</span>
                <span className="l-stat-suffix"> Cr+</span>
                <span className="l-stat-label">Loans Facilitated</span>
              </div>
            </div>
          </div>
          <div className="l-hero-visual">
            <svg ref={svgRef} className="l-iso-svg" viewBox="0 0 600 520" xmlns="http://www.w3.org/2000/svg" />
            <div className="l-hiso-badge l-hiso-b1">
              <div className="l-hb-icon" style={{ color: '#00d09c' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="#00d09c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <div><div className="l-hb-label" style={{ color: '#00d09c' }}>Loan Approved</div><div className="l-hb-val">₹5,00,000</div></div>
            </div>
            <div className="l-hiso-badge l-hiso-b2">
              <div className="l-hb-icon" style={{ color: '#f5a623' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" stroke="#f5a623" strokeWidth="2" fill="#f5a623" opacity="0.8" strokeLinejoin="round" /></svg>
              </div>
              <div><div className="l-hb-label" style={{ color: '#b57800' }}>CIBIL Score</div><div className="l-hb-val">780 Excellent</div></div>
            </div>
            <div className="l-hiso-badge l-hiso-b3">
              <div className="l-hb-icon" style={{ color: '#5367ff' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M19 5L5 19M9 7a2 2 0 11-4 0 2 2 0 014 0zm10 10a2 2 0 11-4 0 2 2 0 014 0z" stroke="#5367ff" strokeWidth="2" strokeLinecap="round" /></svg>
              </div>
              <div><div className="l-hb-label" style={{ color: '#5367ff' }}>Best Rate</div><div className="l-hb-val">8.5% p.a.</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* Ticker */}
      <section className="l-ticker-section">
        <div className="l-ticker-wrap">
          <div className="l-ticker" ref={tickerRef}>
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((t, i) => (
              <div className="l-ticker-item" key={i}>
                <span className="l-ticker-name">{t.name}</span>
                <span className="l-ticker-price">{t.price}</span>
                <span className="l-ticker-change l-positive">{t.change}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Numbers That Matter */}
      <section className="l-numbers-section" id="numbers">
        <div className="l-container">
          <div className="l-section-header">
            <h2 className="l-section-title">Why Customers Trust AJ Finance</h2>
            <p className="l-section-sub">Professional financial assistance with proven track record</p>
          </div>
          <div className="l-numbers-grid">
            {NUMBERS.map(n => (
              <div key={n.label} className="l-number-card">
                <div className="l-number-icon-wrap" style={{ background: n.iconBg }}>{n.icon}</div>
                <div className="l-number-value"><NumberCounter target={n.target} prefix={n.prefix} suffix={n.suffix} decimals={n.decimals} /></div>
                <div className="l-number-label">{n.label}</div>
                <div className="l-number-bar"><div className="l-number-bar-fill" data-width={n.width} style={{ background: n.color }} /></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Market / Rate Comparison */}
      <section className="l-market-section" id="market">
        <div className="l-container">
          <div className="l-section-header">
            <h2 className="l-section-title">Loan Rate Comparison</h2>
            <p className="l-section-sub">Compare loan interest rates across top banks and NBFCs</p>
          </div>
          <div className="l-market-grid">
            {INDEX_CARDS.map(c => (
              <div key={c.name} className="l-market-card l-index-card">
                <div className="l-index-header">
                  <div className="l-index-name">{c.name}</div>
                  <span className="l-index-badge l-positive">{c.badge}</span>
                </div>
                <div className="l-index-price">{c.price}</div>
                <div className="l-index-change l-positive">Starting Rate p.a.</div>
                <svg className="l-index-sparkline" viewBox="0 0 120 40"><polyline points={c.points} fill="none" stroke={c.stroke} strokeWidth="2" /></svg>
              </div>
            ))}
          </div>

          <div className="l-rate-tabs-wrap">
            <div className="l-rate-tabs">
              {Object.keys(RATE_TABLES).map(key => (
                <button key={key} className={`l-rate-tab ${activeRateTab === key ? 'active' : ''}`} onClick={() => setActiveRateTab(key)}>{RATE_TAB_LABELS[key]}</button>
              ))}
            </div>
            <div className="l-rate-tab-panels">
              <div className="l-rate-tab-panel active">
                <div className="l-market-table">
                  <div className="l-mt-row l-mt-header">{RATE_TABLES[activeRateTab].head.map(h => <span key={h}>{h}</span>)}</div>
                  {RATE_TABLES[activeRateTab].rows.map(row => (
                    <div className="l-mt-row" key={row.bank}>
                      <span className="l-mt-company"><span className="l-mt-dot" style={{ background: row.dot }} />{row.bank}</span>
                      <span className={row.rateClass || ''}>{row.rate}</span>
                      <span>{row.tenure}</span>
                      <span className={`l-mt-badge ${row.best ? 'best' : ''}`}>{row.tag}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <p className="l-rate-disclaimer">* Rates are indicative as of 2025. Actual rates depend on credit profile and bank policy.</p>
          </div>
        </div>
      </section>

      {/* Financial Services Beyond Loans */}
      <section className="l-fsc-section" id="financial-services">
        <div className="l-container">
          <div className="l-section-header">
            <h2 className="l-section-title">Beyond Loans — Full Financial Guidance</h2>
            <p className="l-section-sub">We don't just help with loans. We guide you across your complete financial journey.</p>
          </div>
          <div className="l-fsc-grid">
            {FIN_SERVICES.map(s => (
              <div key={s.id} className="l-fsc-card">
                <div className="l-fsc-icon" style={{ background: s.iconBg }}>{s.icon}</div>
                <h3 className="l-fsc-title">{s.title}</h3>
                <p className="l-fsc-desc">{s.desc}</p>
                <button className="l-fsc-btn" onClick={() => openConsultation(s.title)}>Know More</button>
              </div>
            ))}
          </div>
          <p className="l-fsc-note">We are a guidance &amp; referral service — not direct sellers of investment or insurance products.</p>
        </div>
      </section>

      {/* Services / Products */}
      <section className="l-section" id="products">
        <div className="l-container">
          <div className="l-section-header">
            <h2 className="l-section-title">Our Financial Services</h2>
            <p className="l-section-sub">Comprehensive loan assistance for individuals, professionals, and businesses</p>
          </div>
          <div className="l-products-grid">
            {PRODUCTS.map(p => (
              <div key={p.title} className="l-product-card">
                <div className="l-product-icon" style={{ background: p.iconBg }}>{p.icon}</div>
                <h3 className="l-product-title">{p.title}</h3>
                <p className="l-product-desc">{p.desc}</p>
                <div className="l-product-tags">{p.tags.map(t => <span key={t} className="l-tag">{t}</span>)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Hub */}
      <section className="l-tools-section" id="tools">
        <div className="l-container">
          <div className="l-section-header">
            <div className="l-tools-eyebrow">Smart Financial Tools</div>
            <h2 className="l-section-title">Free Tools to Make Smarter Decisions</h2>
            <p className="l-section-sub">Calculate, compare, and plan your finances — no login required</p>
          </div>
          <div className="l-tools-hub-grid">
            {TOOL_CARDS.map(c => (
              <div key={c.id} className="l-tool-hub-card" onClick={() => openToolSheet(c.id)}>
                <div className="l-thc-header">
                  <div className="l-thc-icon-wrap" style={{ background: c.iconBg }}>{c.icon}</div>
                  <span className="l-thc-tag" style={{ background: c.tagBg, color: c.tagColor }}>{c.tag}</span>
                </div>
                <h3 className="l-thc-title">{c.title}</h3>
                <p className="l-thc-desc">{c.desc}</p>
                <div className="l-thc-preview">{c.preview}</div>
                <button className="l-thc-cta" style={{ color: c.ctaColor, borderColor: `${c.ctaColor}59` }}>
                  {c.cta} <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12H19M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="l-section l-section-alt" id="process">
        <div className="l-container">
          <div className="l-section-header">
            <h2 className="l-section-title">Simple &amp; Easy Loan Process</h2>
            <p className="l-section-sub">A simple 4-step process to get the loan assistance you need.</p>
          </div>
          <div className="l-process-grid">
            {STEPS.map((s, i) => (
              <div key={s.num} className="l-step">
                <div className="l-step-bubble" style={{ background: `linear-gradient(135deg, ${s.color}, ${s.color}cc)` }}>
                  <span className="l-step-num">{s.num}</span>
                  <div className="l-step-icon">{s.icon}</div>
                </div>
                {i < STEPS.length - 1 && <div className="l-step-connector" />}
                <div className="l-step-card">
                  <h3 className="l-step-title">{s.title}</h3>
                  <p className="l-step-desc">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="l-section" id="partners">
        <div className="l-container">
          <div className="l-section-header">
            <h2 className="l-section-title">Our Banking Partners</h2>
            <p className="l-section-sub">We work with RBI-registered banks and NBFCs to offer you the best loan options.</p>
          </div>
          <div className="l-partners-grid">
            {PARTNERS.map(p => (
              <div key={p.name} className="l-partner-card">
                <div className="l-partner-accent" style={{ background: p.accent }} />
                <div className="l-partner-logo" style={{ color: p.accent }}>{p.abbr}</div>
                <div className="l-partner-name">{p.name}</div>
                <div className="l-partner-type">{p.type}</div>
                <div className="l-partner-loans">{p.loans}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="l-section l-section-alt" id="about">
        <div className="l-container">
          <div className="l-about-grid">
            <div>
              <h2 className="l-section-title" style={{ textAlign: 'left', marginBottom: 20 }}>About AJ Finance</h2>
              <p className="l-about-para">AJ Finance is a professional financial assistance company helping customers access personal loans, business loans, and professional financial solutions through trusted banking partners and NBFCs.</p>
              <p className="l-about-para">Our goal is to simplify the loan process with transparency, fast support, and secure documentation handling.</p>
              <p className="l-about-para">We are a guidance and referral service — not direct sellers of financial products. We focus on providing customers with a smooth and trustworthy financial experience.</p>
              <Link to="/login" className="l-btn-primary" style={{ display: 'inline-block', marginTop: 24 }}>Access Staff Portal</Link>
            </div>
            <div className="l-about-cards">
              {[
                { label: 'Happy Customers', value: '50,000+', color: 'var(--primary)' },
                { label: 'Banking Partners', value: '15+', color: 'var(--blue)' },
                { label: 'Loans Facilitated', value: '500 Cr+', color: 'var(--gold)' },
                { label: 'Cities Covered', value: '50+', color: 'var(--purple)' },
              ].map(m => (
                <div key={m.label} className="l-about-metric">
                  <div className="l-metric-val" style={{ color: m.color }}>{m.value}</div>
                  <div className="l-metric-label">{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="l-cta-banner">
        <div className="l-container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 12 }}>Ready to get started?</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 28, fontSize: 15 }}>Staff members can log in to manage loans, customers, and commissions.</p>
          <Link to="/login" className="l-cta-btn">Go to Staff Login</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="l-footer">
        <div className="l-container">
          <div className="l-footer-inner">
            <div>
              <div className="l-logo" style={{ marginBottom: 12 }}>
                <span className="l-logo-mark">AJ</span>
                <span className="l-logo-text" style={{ color: '#fff' }}>Finance</span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, maxWidth: 280, lineHeight: 1.7 }}>
                Professional financial assistance company helping customers access the right financial solutions.
              </p>
            </div>
            <div className="l-footer-links">
              <div className="l-footer-col">
                <div className="l-footer-heading">Services</div>
                {['Personal Loan', 'Business Loan', 'Home Loan', 'LAP', 'Professional Loan', 'Balance Transfer'].map(s => (
                  <a key={s} href="#products" className="l-footer-link">{s}</a>
                ))}
              </div>
              <div className="l-footer-col">
                <div className="l-footer-heading">Company</div>
                <a href="#about" className="l-footer-link">About Us</a>
                <a href="#partners" className="l-footer-link">Banking Partners</a>
                <a href="#process" className="l-footer-link">How It Works</a>
                <a href="#tools" className="l-footer-link">Financial Tools</a>
                <Link to="/login" className="l-footer-link">Staff Login</Link>
              </div>
            </div>
          </div>
          <div className="l-footer-bottom">
            <span>2025 AJ Finance. All rights reserved.</span>
            <span>This is a guidance and referral service — not a direct lender.</span>
          </div>
        </div>
      </footer>

      {/* ── Tool Bottom Sheet ── */}
      {openTool && (
        <>
          <div className="l-tool-backdrop active" onClick={closeToolSheet} />
          <div className="l-tool-sheet" ref={sheetRef}>
            <div className="l-tool-sheet-handle" />
            <div className="l-tool-sheet-head">
              <div className="l-tsh-info">
                <div className="l-tsh-icon" style={{ background: TOOL_META[openTool].iconBg }}>{TOOL_META[openTool].icon}</div>
                <div>
                  <h2 className="l-tsh-title">{TOOL_META[openTool].title}</h2>
                  <p className="l-tsh-sub">{TOOL_META[openTool].sub}</p>
                </div>
              </div>
              <button className="l-tool-close-btn" onClick={closeToolSheet} aria-label="Close tool">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" /></svg>
              </button>
            </div>
            <div className="l-tool-sheet-body">
              <div className="l-tool-panel active">
                {openTool === 'emi' && <EmiPanel onApply={goToApply} />}
                {openTool === 'cibil' && <CibilPanel onApply={goToApply} />}
                {openTool === 'eligibility' && <EligibilityPanel onApply={goToApply} />}
                {openTool === 'sip' && <SipPanel />}
                {openTool === 'balance' && <BalancePanel onApply={goToApply} />}
                {openTool === 'compare' && <ComparePanel onApply={goToApply} />}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Consultation Modal ── */}
      {consultService && (
        <>
          <div className="l-consult-backdrop active" onClick={closeConsultation} />
          <div className="l-consult-modal active">
            <button className="l-consult-close" onClick={closeConsultation} aria-label="Close">&times;</button>
            {!consultSuccess ? (
              <>
                <div className="l-consult-icon-wrap" style={{ background: consultMeta.bg }}>{consultMeta.emoji}</div>
                <h3 className="l-consult-title">{consultService}</h3>
                <p className="l-consult-sub">Book a free call — our expert will guide you personally</p>
                <form className="l-consult-form" onSubmit={handleConsultSubmit}>
                  <div className="l-consult-field">
                    <label>Your Name</label>
                    <input type="text" name="cName" placeholder="Full name" required />
                  </div>
                  <div className="l-consult-field">
                    <label>Mobile Number</label>
                    <input type="tel" name="cPhone" placeholder="10-digit mobile" pattern="[6-9][0-9]{9}" maxLength={10} required />
                  </div>
                  <div className="l-consult-field">
                    <label>Best Time to Call</label>
                    <select name="cTime" defaultValue="Evening (4pm–7pm)">
                      <option value="Morning (9am–12pm)">Morning (9am–12pm)</option>
                      <option value="Afternoon (12pm–4pm)">Afternoon (12pm–4pm)</option>
                      <option value="Evening (4pm–7pm)">Evening (4pm–7pm)</option>
                    </select>
                  </div>
                  <button type="submit" className="l-consult-submit">Book Free Consultation</button>
                </form>
              </>
            ) : (
              <div className="l-consult-success">
                <div className="l-consult-success-icon">✓</div>
                <h4>Request Submitted!</h4>
                <p>We'll call you during your preferred time. Thank you!</p>
              </div>
            )}
          </div>
        </>
      )}

    </div>
  );
}
