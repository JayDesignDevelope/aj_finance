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
    { id: 'first-step',   icon: '🌱', name: 'First Step',     desc: 'Completed your first module' },
    { id: 'streak-7',     icon: '🔥', name: '7-Day Streak',   desc: 'Learned 7 days in a row' },
    { id: 'quiz-ace',     icon: '🎯', name: 'Quiz Ace',       desc: 'Scored 100% on a quiz' },
    { id: 'saver',        icon: '🐷', name: 'Super Saver',    desc: 'Finished the Smart Saver level' },
    { id: 'first-trade',  icon: '📈', name: 'First Trade',    desc: 'Made your first virtual investment' },
    { id: 'diversified',  icon: '🧩', name: 'Diversified',    desc: 'Held 4+ asset types at once' },
    { id: 'sip-starter',  icon: '🪴', name: 'SIP Starter',    desc: 'Started a parent-approved SIP' },
    { id: 'founder',      icon: '🚀', name: 'Founder',        desc: 'Reached the Founder Mindset level' }
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
    { id: 'invest',    name: '₹1 Lakh Challenge',   sub: 'Investment Simulator',    icon: '💰', tag: 'Classic', color: '#00d09c' },
    { id: 'budget',    name: 'Budget Boss',         sub: 'Monthly Budget Game',     icon: '🧾', tag: 'Classic', color: '#5367ff' },
    { id: 'cibil',     name: 'CIBIL Builder',       sub: 'Credit Score Game',       icon: '📊', tag: 'Classic', color: '#f5a623' },
    { id: 'sipmagic',  name: 'SIP Magic',           sub: 'Compound Interest Wizard',icon: '✨', tag: 'Classic', color: '#eb5b3c' },
    { id: 'pocket',    name: 'Pocket Money Challenge', sub: 'Spend, save or invest?', icon: '🪙', tag: 'New', color: '#00d09c' },
    { id: 'startup',   name: 'Startup Builder',     sub: 'Grow a company',          icon: '🚀', tag: 'New', color: '#9b51e0' },
    { id: 'stocksim',  name: 'Stock Market Simulator', sub: 'Trade the ticker',     icon: '📈', tag: 'New', color: '#eb5b3c' },
    { id: 'inflation', name: 'Inflation Challenge', sub: 'Beat rising prices',      icon: '🎈', tag: 'New', color: '#f5a623' },
    { id: 'goal',      name: 'Goal Planner',        sub: 'Reach your dream',        icon: '🎯', tag: 'New', color: '#5367ff' },
    { id: 'scam',      name: 'Scam Detection',      sub: 'Spot the fraud',          icon: '🛡️', tag: 'New', color: '#0ea5e9' },
    { id: 'debt',      name: 'Good Debt vs Bad Debt', sub: 'Sort the loans',        icon: '⚖️', tag: 'New', color: '#00b386' }
  ];

  /* ------------------------------------------------------------- seed state */

  function seed() {
    return {
      user: { loggedIn: false, role: 'student', name: 'Aarav Sharma',
              grade: 'Class 11', avatar: '🧑‍🎓', childName: 'Aarav Sharma' },
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

  var NAV = [
    { id: 'home',     label: 'Home',          to: 'index.html', root: true },
    { id: 'learn',    label: 'Learn',         to: 'learn.html' },
    { id: 'games',    label: 'Money Games',   to: 'money-games.html' },
    { id: 'invest',   label: 'Student Invest',to: 'student-invest.html' },
    { id: 'parents',  label: 'Parents',       to: 'for-parents.html' },
    { id: 'schools',  label: 'Schools',       to: 'for-schools.html' },
    { id: 'startup',  label: 'Startup Club',  to: 'startup-club.html' },
    { id: 'markets',  label: 'Markets',       to: 'markets.html' }
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
        '<a href="' + p.P + dashTo + '" class="fgn-link fgn-dash' + (activeId === 'dashboard' ? ' active' : '') + '">Dashboard</a>' +
        '<a href="' + p.P + 'learn.html" class="fgn-chip" title="Money Score / Streak">' +
          '<span class="fgn-chip-flame">🔥 ' + state.learning.streak + '</span>' +
          '<span class="fgn-chip-score">' + state.learning.moneyScore + '</span>' +
        '</a>' +
        '<button class="fgn-avatar" onclick="FG._logout()" title="' + state.user.name + ' — click to log out">' + (state.user.avatar || '🙂') + '</button>';
    } else {
      right =
        '<a href="' + p.P + 'login.html" class="fgn-login">Login</a>' +
        '<a href="' + p.P + 'for-students.html" class="fgn-cta">Get Started</a>';
    }

    var nav =
      '<a href="#fg-main" class="fg-skip">Skip to content</a>' +
      '<nav class="fgnav" id="fgnav">' +
        '<div class="fgnav-in">' +
          '<a href="' + p.R + 'index.html" class="fgn-logo">' +
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
            footCol('Learn', [['Learning Levels', p.P + 'learn.html'], ['Money Games', p.P + 'money-games.html'], ['Student Invest', p.P + 'student-invest.html'], ['Markets', p.P + 'markets.html']]) +
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
    LEVELS: LEVELS, BADGES: BADGES, ASSETS: ASSETS, GAMES: GAMES,
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
