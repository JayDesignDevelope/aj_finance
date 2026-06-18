/* ============================================================================
   FinGarage Platform Core  —  fg-app.js
   ----------------------------------------------------------------------------
   Front-end-only prototype layer for the "Duolingo for Money" revamp.

   Provides, on window.FG:
     • FG.state / FG.save()            persistent demo state (localStorage)
     • FG.auth                         mock login / logout / role
     • FG.LEVELS / FG.BADGES / FG.ASSETS / FG.GAMES   content definitions
     • FG.mountChrome(activeId)        injects the global navbar + footer
     • FG.fmtINR / FG.fmtShortINR ...  formatting + small helpers
     • FG.portfolio.*                  virtual-portfolio helpers (buy/sell/value)
     • FG.learning.*                   level / xp / streak / badge helpers

   No backend. Everything lives in localStorage under FG_KEY so the demo
   survives reloads. Call FG.reset() from the console to wipe.
   ========================================================================== */
(function () {
  'use strict';

  var FG_KEY = 'fg_state_v2';

  /* ---------------------------------------------------------------- content */

  var LEVELS = [
    {
      id: 1, name: 'Money Rookie', grade: 'Class 9–10', color: '#00d09c',
      tagline: 'Where money actually comes from — and where it goes.',
      topics: ['What is Money', 'Needs vs Wants', 'Pocket Money Management',
               'Saving Habit', 'Banking Basics', 'UPI', 'Emergency Fund']
    },
    {
      id: 2, name: 'Smart Saver', grade: 'Class 10–11', color: '#5367ff',
      tagline: 'Make every rupee report for duty.',
      topics: ['Budgeting', '50/30/20 Rule', 'Inflation', 'Fixed Deposits',
               'Recurring Deposits', 'Goal Planning', 'Compound Interest']
    },
    {
      id: 3, name: 'Young Investor', grade: 'Class 11–12', color: '#f5a623',
      tagline: 'Let your money start earning its own money.',
      topics: ['SIP', 'Mutual Funds', 'Index Funds', 'Risk vs Return',
               'Long-Term Investing', 'Power of Compounding']
    },
    {
      id: 4, name: 'Market Explorer', grade: 'College', color: '#eb5b3c',
      tagline: 'Read the markets like a map, not a maze.',
      topics: ['Stocks', 'Nifty', 'Sensex', 'Gold', 'Bonds', 'ETFs',
               'Portfolio Allocation']
    },
    {
      id: 5, name: 'Founder Mindset', grade: 'College', color: '#9b51e0',
      tagline: 'Think like the people who build the companies you invest in.',
      topics: ['Business Models', 'Revenue', 'Profit', 'Startup Valuation',
               'Funding Rounds', 'Entrepreneurship', 'Pitching Ideas']
    }
  ];

  var BADGES = [
    { id: 'first-step',   icon: 'sprout',       name: 'First Step',     desc: 'Completed your first module' },
    { id: 'streak-7',     icon: 'flame',        name: '7-Day Streak',   desc: 'Learned 7 days in a row' },
    { id: 'quiz-ace',     icon: 'target',       name: 'Quiz Ace',       desc: 'Scored 100% on a quiz' },
    { id: 'saver',        icon: 'piggy',        name: 'Super Saver',    desc: 'Finished the Smart Saver level' },
    { id: 'first-trade',  icon: 'trending-up',  name: 'First Trade',    desc: 'Made your first virtual investment' },
    { id: 'diversified',  icon: 'puzzle',       name: 'Diversified',    desc: 'Held 4+ asset types at once' },
    { id: 'sip-starter',  icon: 'plant',        name: 'SIP Starter',    desc: 'Started a parent-approved SIP' },
    { id: 'founder',      icon: 'rocket',       name: 'Founder',        desc: 'Reached the Founder Mindset level' }
  ];

  // Virtual-investing universe for the Portfolio Simulator.
  var ASSETS = [
    { id: 'nifty50',  name: 'Nifty 50',       type: 'Index',   risk: 'Medium', base: 100, drift: 0.0009, vol: 0.012, color: '#00d09c' },
    { id: 'gold',     name: 'Gold',           type: 'Commodity', risk: 'Low',  base: 100, drift: 0.0005, vol: 0.008, color: '#f5a623' },
    { id: 'debt',     name: 'Debt Fund',      type: 'Debt',    risk: 'Low',    base: 100, drift: 0.0003, vol: 0.002, color: '#5367ff' },
    { id: 'startup',  name: 'Startup Basket', type: 'Equity',  risk: 'High',   base: 100, drift: 0.0014, vol: 0.030, color: '#9b51e0' },
    { id: 'reliance', name: 'Reliance',       type: 'Stock',   risk: 'Medium', base: 100, drift: 0.0010, vol: 0.018, color: '#eb5b3c' },
    { id: 'tcs',      name: 'TCS',            type: 'Stock',   risk: 'Medium', base: 100, drift: 0.0008, vol: 0.015, color: '#0ea5e9' }
  ];

  // Registry powering the Money Games hub. The 4 originals + 7 new games.
  var GAMES = [
    { id: 'invest',    name: '₹1 Lakh Challenge',   sub: 'Investment Simulator',    icon: 'coins',        tag: 'Classic', color: '#00d09c' },
    { id: 'budget',    name: 'Budget Boss',         sub: 'Monthly Budget Game',     icon: 'receipt',      tag: 'Classic', color: '#5367ff' },
    { id: 'cibil',     name: 'CIBIL Builder',       sub: 'Credit Score Game',       icon: 'bar-chart',    tag: 'Classic', color: '#f5a623' },
    { id: 'sipmagic',  name: 'SIP Magic',           sub: 'Compound Interest Wizard',icon: 'sparkles',     tag: 'Classic', color: '#eb5b3c' },
    { id: 'pocket',    name: 'Pocket Money Challenge', sub: 'Spend, save or invest?', icon: 'wallet',     tag: 'New', color: '#00d09c' },
    { id: 'startup',   name: 'Startup Builder',     sub: 'Grow a company',          icon: 'rocket',       tag: 'New', color: '#9b51e0' },
    { id: 'stocksim',  name: 'Stock Market Simulator', sub: 'Trade the ticker',     icon: 'line-chart',   tag: 'New', color: '#eb5b3c' },
    { id: 'inflation', name: 'Inflation Challenge', sub: 'Beat rising prices',      icon: 'trending-up',  tag: 'New', color: '#f5a623' },
    { id: 'goal',      name: 'Goal Planner',        sub: 'Reach your dream',        icon: 'target',       tag: 'New', color: '#5367ff' },
    { id: 'scam',      name: 'Scam Detection',      sub: 'Spot the fraud',          icon: 'shield',       tag: 'New', color: '#0ea5e9' },
    { id: 'debt',      name: 'Good Debt vs Bad Debt', sub: 'Sort the loans',        icon: 'scale',        tag: 'New', color: '#00b386' }
  ];

  /* ----------------------------------------------------------- icon system */
  // Professional inline-SVG line icons (24x24, stroke=currentColor). Use names —
  // never emoji — across the platform. FG.icon('flame', {size:20}) -> '<svg…>'.
  var ICONS = {
    dot:        '<circle cx="12" cy="12" r="3"/>',
    user:       '<circle cx="12" cy="8" r="3.5"/><path d="M5 20c0-3.5 3-5.5 7-5.5s7 2 7 5.5"/>',
    users:      '<circle cx="9" cy="8" r="3"/><path d="M3 19c0-3 3-5 6-5s6 2 6 5"/><path d="M16 5.5a3 3 0 0 1 0 5.5"/><path d="M17.5 14c2 .5 3.5 2 3.5 5"/>',
    flame:      '<path d="M12 3c.5 2.5 3.5 3.5 3.5 7a3.5 3.5 0 0 1-7 0c0-1.2.6-2.2 1.5-3 .2 1 .8 1.7 1.5 2 0-2.2-.5-4-1.5-6z"/><path d="M12 21a6 6 0 0 0 6-6c0-4-3-6-4-9 .5 5-4 5-4 9a3 3 0 0 0 .2 1"/>',
    target:     '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1"/>',
    rocket:     '<path d="M9 15c-1.5.5-3 2-3.5 4 2-.5 3.5-2 4-3.5"/><path d="M9 15l-2.5-2.5C8 7 11.5 4 18 4c0 6.5-3 10-8.5 11.5z"/><circle cx="14.5" cy="9" r="1.5"/>',
    'trending-up':   '<path d="M3 17l6-6 4 4 8-8"/><path d="M17 7h4v4"/>',
    'trending-down': '<path d="M3 7l6 6 4-4 8 8"/><path d="M17 17h4v-4"/>',
    'bar-chart': '<line x1="6" y1="20" x2="6" y2="12"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="18" y1="20" x2="18" y2="9"/><line x1="3" y1="20" x2="21" y2="20"/>',
    'line-chart':'<path d="M4 4v16h16"/><path d="M7 14l4-4 3 3 5-6"/>',
    'chart-pie': '<path d="M21 12a9 9 0 1 1-9-9v9z"/><path d="M12 3a9 9 0 0 1 9 9h-9z"/>',
    coins:      '<ellipse cx="9" cy="7" rx="6" ry="3"/><path d="M3 7v4c0 1.7 2.7 3 6 3s6-1.3 6-3V7"/><path d="M9 14v4c0 1.7 2.7 3 6 3s6-1.3 6-3v-4c0-1.7-2.7-3-6-3"/>',
    coin:       '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v10M9.5 9.5h3.5a1.5 1.5 0 0 1 0 3h-2a1.5 1.5 0 0 0 0 3H14"/>',
    wallet:     '<path d="M3 7a2 2 0 0 1 2-2h12v3"/><rect x="3" y="7" width="18" height="12" rx="2"/><circle cx="16.5" cy="13" r="1.3"/>',
    piggy:      '<path d="M16 7c2.5 0 5 2 5 5 0 1.4-.6 2.6-1.6 3.5L20 19h-3l-.5-1.5a8 8 0 0 1-4 0L12 19H9l-.6-2.2C6 16 4 14 4 11.5 4 9 6.5 7 10 7z"/><path d="M3 11h2"/><circle cx="16.5" cy="11" r=".8"/><path d="M10 7c0-1.7 1.3-3 3-3"/>',
    receipt:    '<path d="M5 3h14v18l-2.3-1.3L14.4 21 12 19.6 9.6 21l-2.3-1.3L5 21z"/><path d="M8.5 8h7M8.5 12h7M8.5 16h4"/>',
    shield:     '<path d="M12 3l8 3v5c0 5-3.4 8.4-8 10-4.6-1.6-8-5-8-10V6z"/>',
    'shield-check':'<path d="M12 3l8 3v5c0 5-3.4 8.4-8 10-4.6-1.6-8-5-8-10V6z"/><path d="M9 12l2 2 4-4"/>',
    scale:      '<path d="M12 3v18"/><path d="M7 21h10"/><path d="M4.5 7h15"/><path d="M7 3l-3 8a3 3 0 0 0 6 0z"/><path d="M17 3l3 8a3 3 0 0 1-6 0z"/><path d="M9 3h6"/>',
    puzzle:     '<path d="M10 4.5a1.5 1.5 0 0 1 3 0c0 .8.7 1.5 1.5 1.5H17v2.5c0 .8.7 1.5 1.5 1.5a1.5 1.5 0 0 1 0 3c-.8 0-1.5.7-1.5 1.5V18h-2.5c-.8 0-1.5.7-1.5 1.5a1.5 1.5 0 0 1-3 0c0-.8-.7-1.5-1.5-1.5H6v-2.5c0-.8-.7-1.5-1.5-1.5a1.5 1.5 0 0 1 0-3c.8 0 1.5-.7 1.5-1.5V6h2.5c.8 0 1.5-.7 1.5-1.5z"/>',
    sprout:     '<path d="M12 21v-9"/><path d="M12 12C12 8 9 6 5 6c0 4 3 6 7 6z"/><path d="M12 13c0-3.5 3-5.5 7-5.5 0 3.5-3 5.5-7 5.5z"/>',
    plant:      '<path d="M12 22v-9"/><path d="M9 22h6"/><path d="M12 13c-1-4-5-5-8-5 .5 4 3.5 6 8 6z"/><path d="M14.5 8c1.5-.3 3-1.5 3.3-3.5-2 .2-3 1.3-3.3 3.5z"/>',
    trophy:     '<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 5H5a3 3 0 0 0 3 3"/><path d="M16 5h3a3 3 0 0 1-3 3"/><path d="M10 13.5h4l1 4.5H9z"/><path d="M7.5 21h9"/>',
    medal:      '<circle cx="12" cy="14.5" r="5.5"/><path d="M8.5 3l3.5 5 3.5-5"/><path d="M12 12.5v4M10 14.5h4"/>',
    star:       '<path d="M12 3.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L12 17.1 6.7 19.6l1-5.8L3.5 9.7l5.9-.9z"/>',
    check:      '<path d="M5 12.5l4.5 4.5L19 7"/>',
    'check-circle':'<circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-5"/>',
    book:       '<path d="M5 4h12a1 1 0 0 1 1 1v15H7a2 2 0 0 0-2 2z"/><path d="M18 16H7a2 2 0 0 0-2 2"/>',
    cap:        '<path d="M3 9l9-4 9 4-9 4z"/><path d="M7 11v4.5c0 1.2 2.2 2.5 5 2.5s5-1.3 5-2.5V11"/><path d="M21 9v5"/>',
    gamepad:    '<rect x="2.5" y="7.5" width="19" height="9" rx="4.5"/><path d="M7.5 11v3M6 12.5h3"/><circle cx="16" cy="11.5" r="1"/><circle cx="18" cy="14" r="1"/>',
    briefcase:  '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M3 12.5h18"/>',
    bulb:       '<path d="M9.5 18h5"/><path d="M10 21h4"/><path d="M12 3a6 6 0 0 0-3.8 10.6c.8.7 1.3 1.5 1.3 2.4h5c0-.9.5-1.7 1.3-2.4A6 6 0 0 0 12 3z"/>',
    gift:       '<rect x="3" y="8" width="18" height="13" rx="1"/><path d="M3 12.5h18"/><path d="M12 8v13"/><path d="M12 8C10.5 8 8 7.5 8 5.5S11 5 12 8c1-3 4-2.5 4-.5S13.5 8 12 8z"/>',
    sparkles:   '<path d="M12 3l1.4 4.1L18 8.5l-4.6 1.4L12 14l-1.4-4.1L6 8.5l4.6-1.4z"/><path d="M18 14l.8 2.2L21 17l-2.2.8L18 20l-.8-2.2L15 17l2.2-.8z"/>',
    building:   '<rect x="5" y="3" width="14" height="18" rx="1"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2"/><path d="M10 21v-3h4v3"/>',
    bank:       '<path d="M3 9l9-5 9 5"/><path d="M4 9.5h16"/><path d="M6 10v7M10 10v7M14 10v7M18 10v7"/><path d="M3 20.5h18"/>',
    compass:    '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2.2 4.8-4.8 2.2 2.2-4.8z"/>',
    map:        '<path d="M9 4L3.5 6v14L9 18l6 2 5.5-2V4L15 6z"/><path d="M9 4v14M15 6v14"/>',
    brain:      '<path d="M12 5a2.5 2.5 0 0 0-5 .5A2.5 2.5 0 0 0 5 9a2.5 2.5 0 0 0 1 4.5A2.5 2.5 0 0 0 8 18a2.5 2.5 0 0 0 4 .5z"/><path d="M12 5a2.5 2.5 0 0 1 5 .5A2.5 2.5 0 0 1 19 9a2.5 2.5 0 0 1-1 4.5A2.5 2.5 0 0 1 16 18a2.5 2.5 0 0 1-4 .5z"/>',
    calendar:   '<rect x="3.5" y="5" width="17" height="16" rx="2"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/>',
    hourglass:  '<path d="M6 3h12M6 21h12"/><path d="M6.5 3c0 4 5.5 5.5 5.5 9s-5.5 5-5.5 9"/><path d="M17.5 3c0 4-5.5 5.5-5.5 9s5.5 5 5.5 9"/>',
    pause:      '<rect x="7" y="5" width="3.2" height="14" rx="1"/><rect x="13.8" y="5" width="3.2" height="14" rx="1"/>',
    play:       '<path d="M7 5l12 7-12 7z"/>',
    refresh:    '<path d="M4 11a8 8 0 0 1 14-4.5L20.5 9"/><path d="M20.5 4v5h-5"/><path d="M20 13a8 8 0 0 1-14 4.5L3.5 15"/><path d="M3.5 20v-5h5"/>',
    x:          '<path d="M6 6l12 12M18 6L6 18"/>',
    'x-circle': '<circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6"/>',
    'thumbs-up':'<path d="M7 11v8H4v-8z"/><path d="M7 11l4-7c1.5 0 2.5 1 2.3 2.6L13 9h5a2 2 0 0 1 2 2.4l-1.4 6A2 2 0 0 1 16.6 19H7"/>',
    'thumbs-down':'<path d="M17 13V5h3v8z"/><path d="M17 13l-4 7c-1.5 0-2.5-1-2.3-2.6L11 15H6a2 2 0 0 1-2-2.4l1.4-6A2 2 0 0 1 7.4 5H17"/>',
    flag:       '<path d="M5 21V4"/><path d="M5 4.5h13l-2.2 4 2.2 4H5"/>',
    'credit-card':'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M7 15h4"/>',
    megaphone:  '<path d="M4 11v2.5l13 5.5V5z"/><path d="M17 8.5a3.5 3.5 0 0 1 0 7"/><path d="M7 14v4.5h3.5"/>',
    mail:       '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 7l8.5 6 8.5-6"/>',
    heart:      '<path d="M12 21C7 17 4 13.5 4 9.5A4 4 0 0 1 12 8a4 4 0 0 1 8 1.5c0 4-3 7.5-8 11.5z"/>',
    gem:        '<path d="M6 3h12l3 5-9 13L3 8z"/><path d="M3 8h18M9 3L6 8l6 13 6-13-3-5"/>',
    zap:        '<path d="M13 3L4 14h7l-1 7 9-11h-7z"/>',
    pin:        '<path d="M12 21s-6-5.2-6-10A6 6 0 0 1 18 11c0 4.8-6 10-6 10z"/><circle cx="12" cy="11" r="2.2"/>',
    hand:       '<path d="M7 11.5V6a1.5 1.5 0 0 1 3 0v4.5V4a1.5 1.5 0 0 1 3 0v6V5.5a1.5 1.5 0 0 1 3 0V13a6 6 0 0 1-6 6 5 5 0 0 1-5-4l-1-3a1.5 1.5 0 0 1 2.7-1.2z"/>',
    code:       '<path d="M8.5 8l-4 4 4 4M15.5 8l4 4-4 4M13.5 5l-3 14"/>',
    palette:    '<path d="M12 3a9 9 0 1 0 0 18c1.4 0 2-1 2-2s-.5-1.4-.5-2.4S14.6 13 16 13h2a3 3 0 0 0 3-3c0-4-4-7-9-7z"/><circle cx="8" cy="11" r="1"/><circle cx="12" cy="7.5" r="1"/><circle cx="16" cy="10" r="1"/>',
    flask:      '<path d="M9 3h6M10 3v6.5l-5 8.5a2 2 0 0 0 1.7 3h10.6a2 2 0 0 0 1.7-3l-5-8.5V3"/><path d="M7.5 15h9"/>',
    'lock-open':'<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 7.8-1.2"/>',
    activity:   '<path d="M3 12h4l3-8 4 16 3-8h4"/>',
    'arrow-right':'<path d="M5 12h14M13 6l6 6-6 6"/>',
    route:      '<circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/><path d="M8 19h6a4 4 0 0 0 0-8h-4a4 4 0 0 1 0-8h6"/>',
    plus:       '<path d="M12 5v14M5 12h14"/>',
    handshake:  '<path d="M11 6L8 9l-3-1-2 2 4 4 2-2"/><path d="M13 6l3 3 3-1 2 2-4 4-2-2"/><path d="M10 13l2 2 2-2"/>'
  };
  function icon(name, opts) {
    opts = opts || {};
    var size = opts.size || 24, sw = (opts.stroke != null ? opts.stroke : 2);
    var inner = ICONS[name] || ICONS.dot;
    return '<svg class="fg-ic' + (opts.cls ? ' ' + opts.cls : '') + '" width="' + size + '" height="' + size +
      '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + sw +
      '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + inner + '</svg>';
  }

  /* ------------------------------------------------------------- seed state */

  function seed() {
    return {
      user: { loggedIn: false, role: 'student', name: 'Aarav Sharma',
              grade: 'Class 11', avatar: 'user', childName: 'Aarav Sharma' },
      learning: {
        level: 3, xp: 2450, moneyScore: 720, streak: 12,
        lastActive: todayStr(),
        levelProgress: { 1: 7, 2: 7, 3: 3, 4: 0, 5: 0 }, // topics completed per level
        quizzes: { taken: 24, correct: 19 },
        badges: ['first-step', 'streak-7', 'quiz-ace', 'saver', 'first-trade']
      },
      portfolio: {
        startValue: 100000,
        cash: 38000,
        holdings: [
          { assetId: 'nifty50', units: 340, avgPrice: 100 },
          { assetId: 'gold',    units: 180, avgPrice: 100 },
          { assetId: 'startup', units: 120, avgPrice: 100 }
        ],
        sip: { active: true, amount: 1000, approvedByParent: true, months: 4 },
        seedDay: dayIndex()
      }
    };
  }

  /* ------------------------------------------------------------ persistence */

  var state;
  function load() {
    try {
      var raw = localStorage.getItem(FG_KEY);
      state = raw ? JSON.parse(raw) : seed();
    } catch (e) { state = seed(); }
    return state;
  }
  function save() {
    try { localStorage.setItem(FG_KEY, JSON.stringify(state)); } catch (e) {}
  }
  function reset() { localStorage.removeItem(FG_KEY); load(); if (window.FG) window.FG.state = state; }

  /* ----------------------------------------------------------------- dates */

  function todayStr() {
    var d = new Date();
    return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
  }
  function dayIndex() { return Math.floor(Date.now() / 86400000); }

  /* ------------------------------------------------------------- formatting */

  function fmtINR(v) { return '₹' + Math.round(v).toLocaleString('en-IN'); }
  function fmtShortINR(v) {
    v = Math.round(v);
    if (v >= 10000000) return '₹' + (v / 10000000).toFixed(2) + ' Cr';
    if (v >= 100000)   return '₹' + (v / 100000).toFixed(2) + ' L';
    if (v >= 1000)     return '₹' + (v / 1000).toFixed(1) + 'K';
    return '₹' + v;
  }
  function pct(v) { return (v >= 0 ? '+' : '') + v.toFixed(2) + '%'; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  /* --------------------------------------------------- deterministic prices */
  // Simulated "live" price per asset, stable within a session, drifting by day.
  function priceOf(asset, t) {
    if (t == null) t = (dayIndex() - (state.portfolio.seedDay || dayIndex())) + nowFraction();
    // smooth pseudo-random walk from a fixed seed per asset
    var seedN = hash(asset.id);
    var p = asset.base;
    var wave = Math.sin(t * 0.9 + seedN) * asset.vol + Math.sin(t * 0.31 + seedN * 2) * asset.vol * 0.6;
    p = asset.base * (1 + asset.drift * t * 40 + wave);
    return Math.max(asset.base * 0.4, p);
  }
  function nowFraction() {
    var d = new Date();
    return (d.getHours() * 60 + d.getMinutes()) / 1440;
  }
  function hash(s) { var h = 0; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 997; return h / 100; }

  /* --------------------------------------------------------------- learning */

  var learning = {
    level: function () { return state.learning.level; },
    levelObj: function () { return LEVELS[clamp(state.learning.level - 1, 0, 4)]; },
    levelPctFor: function (lvlId) {
      var total = LEVELS[lvlId - 1].topics.length;
      var done = state.learning.levelProgress[lvlId] || 0;
      return Math.round((done / total) * 100);
    },
    completeTopic: function (lvlId) {
      var total = LEVELS[lvlId - 1].topics.length;
      var cur = state.learning.levelProgress[lvlId] || 0;
      if (cur < total) {
        state.learning.levelProgress[lvlId] = cur + 1;
        state.learning.xp += 50;
        state.learning.moneyScore = clamp(state.learning.moneyScore + 8, 0, 1000);
        if (state.learning.levelProgress[lvlId] === total && state.learning.level === lvlId && lvlId < 5)
          state.learning.level = lvlId + 1;
        save();
      }
    },
    award: function (badgeId) {
      if (state.learning.badges.indexOf(badgeId) === -1) {
        state.learning.badges.push(badgeId); save(); return true;
      }
      return false;
    }
  };

  /* -------------------------------------------------------------- portfolio */

  var portfolio = {
    holdingValue: function () {
      return state.portfolio.holdings.reduce(function (sum, h) {
        var a = assetById(h.assetId);
        return sum + (a ? priceOf(a) * h.units : 0); // ₹ value = current price × units
      }, 0);
    },
    totalValue: function () { return state.portfolio.cash + portfolio.holdingValue(); },
    returnsPct: function () {
      var sv = state.portfolio.startValue;
      return ((portfolio.totalValue() - sv) / sv) * 100;
    },
    buy: function (assetId, rupees) {
      var a = assetById(assetId); if (!a) return false;
      if (rupees > state.portfolio.cash) return false;
      var price = priceOf(a);
      var units = rupees / price;
      var h = state.portfolio.holdings.filter(function (x) { return x.assetId === assetId; })[0];
      if (h) {
        var totCost = h.avgPrice * h.units + price * units;
        h.units += units; h.avgPrice = totCost / h.units;
      } else {
        state.portfolio.holdings.push({ assetId: assetId, units: units, avgPrice: price });
      }
      state.portfolio.cash -= rupees;
      if (state.portfolio.holdings.length >= 4) learning.award('diversified');
      learning.award('first-trade'); save(); return true;
    },
    sell: function (assetId, rupees) {
      var a = assetById(assetId); if (!a) return false;
      var h = state.portfolio.holdings.filter(function (x) { return x.assetId === assetId; })[0];
      if (!h) return false;
      var price = priceOf(a);
      var curVal = price * h.units;
      rupees = Math.min(rupees, curVal);
      var unitsSold = rupees / price;
      h.units -= unitsSold;
      state.portfolio.cash += rupees;
      state.portfolio.holdings = state.portfolio.holdings.filter(function (x) { return x.units > 0.01; });
      save(); return true;
    }
  };
  function assetById(id) { return ASSETS.filter(function (a) { return a.id === id; })[0]; }

  /* ------------------------------------------------------------------- auth */

  var auth = {
    login: function (role, name) {
      state.user.loggedIn = true;
      state.user.role = role || 'student';
      if (name) state.user.name = name;
      save();
    },
    logout: function () { state.user.loggedIn = false; save(); },
    isLoggedIn: function () { return !!state.user.loggedIn; },
    role: function () { return state.user.role; }
  };

  /* ------------------------------------------------- global navbar + footer */

  function paths() {
    var inPages = /\/pages\//.test(location.pathname);
    return {
      R: inPages ? '../' : '',          // root-level assets (index.html, css/js)
      P: inPages ? '' : 'pages/'        // pages/*.html
    };
  }

  // The academy is a self-contained sub-site: its Home is the academy landing
  // (pages/academy.html) and its Learn is the gamified levels (academy-learn.html).
  var NAV = [
    { id: 'home',      label: 'Home',          to: 'academy.html' },
    { id: 'learn',     label: 'Learn',         to: 'academy-learn.html' },
    { id: 'games',     label: 'Money Games',   to: 'money-games.html' },
    { id: 'invest',    label: 'Student Invest',to: 'student-invest.html' },
    { id: 'parents',   label: 'Parents',       to: 'for-parents.html' },
    { id: 'schools',   label: 'Schools',       to: 'for-schools.html' },
    { id: 'startup',   label: 'Startup Club',  to: 'startup-club.html' },
    { id: 'markets',   label: 'Markets',       to: 'markets.html' },
    { id: 'dashboard', label: 'Dashboard',     to: 'student-dashboard.html' }
  ];

  function href(item, p) { return (item.root ? p.R : p.P) + item.to; }

  function mountChrome(activeId) {
    if (!state) load();
    var p = paths();
    var loggedIn = auth.isLoggedIn();
    var role = auth.role();
    var dashTo = role === 'parent' ? 'parent-dashboard.html'
               : role === 'school' ? 'for-schools.html' : 'student-dashboard.html';

    var links = NAV.map(function (n) {
      return '<a href="' + href(n, p) + '" class="fgn-link' + (n.id === activeId ? ' active' : '') + '">' + n.label + '</a>';
    }).join('');

    var right;
    if (loggedIn) {
      right =
        '<a href="' + p.P + 'academy-learn.html" class="fgn-chip" title="Money Score / Streak">' +
          '<span class="fgn-chip-flame">' + icon('flame', { size: 14 }) + state.learning.streak + '</span>' +
          '<span class="fgn-chip-score">' + state.learning.moneyScore + '</span>' +
        '</a>' +
        '<button class="fgn-avatar" onclick="FG._logout()" title="' + state.user.name + ' — click to log out">' + icon('user', { size: 18 }) + '</button>';
    } else {
      right =
        '<a href="' + p.P + 'login.html" class="fgn-login">Login</a>' +
        '<a href="' + p.P + 'for-students.html" class="fgn-cta">Get Started</a>';
    }

    var nav =
      '<a href="#fg-main" class="fg-skip">Skip to content</a>' +
      '<nav class="fgnav" id="fgnav">' +
        '<div class="fgnav-in">' +
          '<a href="' + p.P + 'academy.html" class="fgn-logo">' +
            '<span class="fgn-logo-mark">FG</span><span class="fgn-logo-txt">FinGarage</span>' +
          '</a>' +
          '<div class="fgnav-links" id="fgnavLinks">' + links + '</div>' +
          '<div class="fgnav-right">' + right + '</div>' +
          '<button class="fgnav-burger" aria-label="Menu" onclick="FG._toggleMobile()">' +
            '<span></span><span></span><span></span>' +
          '</button>' +
        '</div>' +
        '<div class="fgnav-mobile" id="fgnavMobile">' + links +
          '<a href="' + p.P + (loggedIn ? dashTo : 'login.html') + '" class="fgn-link">' + (loggedIn ? 'Dashboard' : 'Login') + '</a>' +
          '<a href="' + p.P + 'contact.html" class="fgn-link">Contact</a>' +
        '</div>' +
      '</nav>';

    var year = new Date().getFullYear();
    var footer =
      '<footer class="fgfoot">' +
        '<div class="fgfoot-in">' +
          '<div class="fgfoot-brand">' +
            '<div class="fgn-logo"><span class="fgn-logo-mark">FG</span><span class="fgn-logo-txt">FinGarage</span></div>' +
            '<p>India\'s money-learning playground. Learn money, practice investing, and build wealth habits from school age — with students, parents and schools together.</p>' +
            '<p class="fgfoot-mission">Learn → Practice → Invest → Compete → Build Wealth</p>' +
          '</div>' +
          '<div class="fgfoot-cols">' +
            footCol('Learn', [['Learning Levels', p.P + 'academy-learn.html'], ['Money Games', p.P + 'money-games.html'], ['Student Invest', p.P + 'student-invest.html'], ['Markets', p.P + 'markets.html']]) +
            footCol('For You', [['For Students', p.P + 'for-students.html'], ['For Parents', p.P + 'for-parents.html'], ['For Schools', p.P + 'for-schools.html'], ['Startup Club', p.P + 'startup-club.html']]) +
            footCol('Company', [['About', p.P + 'about.html'], ['Contact', p.P + 'contact.html'], ['Blog', p.P + 'blog.html'], ['Future Finance', p.P + 'future-finance.html']]) +
          '</div>' +
        '</div>' +
        '<div class="fgfoot-bottom">' +
          '<span>© ' + year + ' FinGarage. A financial-literacy learning prototype — virtual money only, not investment advice.</span>' +
        '</div>' +
      '</footer>';

    // Inject the global chrome: nav (+ skip link) at the top of <body>, footer at the end.
    // Guard against double-mounting if a page accidentally calls this twice.
    if (!document.querySelector('.fgnav')) {
      document.body.insertBefore(buildFrag(nav), document.body.firstChild);
    }
    if (!document.querySelector('.fgfoot')) {
      document.body.appendChild(buildFrag(footer));
    }
    wireScroll();
    revealInit();
  }

  // Fade/slide elements with .fg-reveal into view as they scroll in.
  function revealInit() {
    var els = document.querySelectorAll('.fg-reveal');
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('in'); }); return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  }

  function buildFrag(html) {
    var t = document.createElement('template');
    t.innerHTML = html.trim();
    var frag = document.createDocumentFragment();
    while (t.content.firstChild) frag.appendChild(t.content.firstChild);
    return frag;
  }
  function footCol(title, items) {
    return '<div class="fgfoot-col"><h4>' + title + '</h4>' +
      items.map(function (it) { return '<a href="' + it[1] + '">' + it[0] + '</a>'; }).join('') +
      '</div>';
  }
  function wireScroll() {
    var nav = document.getElementById('fgnav');
    if (!nav) return;
    function onScroll() { nav.classList.toggle('scrolled', window.scrollY > 8); }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ------------------------------------------------------- nav interactions */

  function _toggleMobile() {
    var m = document.getElementById('fgnavMobile');
    if (m) m.classList.toggle('open');
  }
  function _logout() { auth.logout(); location.reload(); }

  // Lightweight toast notification.
  var _toastTimer;
  function toast(msg) {
    var t = document.querySelector('.fg-toast');
    if (!t) { t = document.createElement('div'); t.className = 'fg-toast'; document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('show');
    clearTimeout(_toastTimer);
    _toastTimer = setTimeout(function () { t.classList.remove('show'); }, 2600);
  }

  /* ----------------------------------------------------------------- expose */

  load();

  window.FG = {
    state: state,
    save: save, reset: reset, load: function () { state = load(); FG.state = state; return state; },
    LEVELS: LEVELS, BADGES: BADGES, ASSETS: ASSETS, GAMES: GAMES, ICONS: ICONS, icon: icon,
    auth: auth, learning: learning, portfolio: portfolio,
    assetById: assetById, priceOf: priceOf,
    fmtINR: fmtINR, fmtShortINR: fmtShortINR, pct: pct, clamp: clamp,
    badgeById: function (id) { return BADGES.filter(function (b) { return b.id === id; })[0]; },
    mountChrome: mountChrome, revealInit: revealInit, toast: toast,
    _toggleMobile: _toggleMobile, _logout: _logout
  };
  // keep FG.state pointing at the live object after load
  FG.state = state;
})();
