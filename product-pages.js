/* Shared product page JS */
(function() {
    // Restore dark mode preference
    if (localStorage.getItem('aj-dark-mode') === 'dark') {
        document.body.classList.add('dark-mode');
    }
    document.addEventListener('DOMContentLoaded', function() {
        // Dark toggle
        var toggle = document.getElementById('darkToggle');
        if (toggle) {
            toggle.addEventListener('click', function() {
                document.body.classList.toggle('dark-mode');
                localStorage.setItem('aj-dark-mode', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
            });
        }
        // FAQ accordion
        document.querySelectorAll('.faq-q-pg').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var answer = this.nextElementSibling;
                var isOpen = answer.classList.contains('open');
                document.querySelectorAll('.faq-q-pg').forEach(function(b){ b.classList.remove('open'); });
                document.querySelectorAll('.faq-a-pg').forEach(function(a){ a.classList.remove('open'); });
                if (!isOpen) { this.classList.add('open'); answer.classList.add('open'); }
            });
        });
        // SMP tab switcher
        if (window.switchSMPTab === undefined) {
            window.switchSMPTab = function(btn, tabId) {
                document.querySelectorAll('.smp-tab').forEach(function(t){ t.classList.remove('active'); });
                document.querySelectorAll('.smp-content').forEach(function(p){ p.classList.remove('active'); });
                btn.classList.add('active');
                var panel = document.getElementById('smp-' + tabId);
                if (panel) panel.classList.add('active');
            };
        }
        if (window.toggleServicesMenu === undefined) {
            window.toggleServicesMenu = function(e) {
                e.preventDefault(); e.stopPropagation();
                var panel = document.getElementById('smpPanel');
                var overlay = document.getElementById('smpOverlay');
                if (panel.classList.contains('open')) {
                    panel.classList.remove('open'); overlay.classList.remove('open');
                    document.getElementById('servicesToggle').classList.remove('active');
                } else {
                    panel.classList.add('open'); overlay.classList.add('open');
                    document.getElementById('servicesToggle').classList.add('active');
                }
            };
        }
        if (window.closeSMP === undefined) {
            window.closeSMP = function() {
                var panel = document.getElementById('smpPanel');
                var overlay = document.getElementById('smpOverlay');
                if (panel) panel.classList.remove('open');
                if (overlay) overlay.classList.remove('open');
                var t = document.getElementById('servicesToggle');
                if (t) t.classList.remove('active');
            };
        }
        // Mobile menu toggle
        var mobileToggle = document.getElementById('mobileToggle');
        var mobileMenu = document.getElementById('mobileMenu');
        if (mobileToggle && mobileMenu) {
            mobileToggle.addEventListener('click', function() {
                mobileMenu.classList.toggle('active');
                mobileToggle.classList.toggle('active');
            });
        }
        // Close SMP on Escape
        document.addEventListener('keydown', function(e){ if (e.key === 'Escape') window.closeSMP && window.closeSMP(); });
    });
})();

// ===================================================================
// ===== PRODUCT PAGE ISOMETRIC HERO SCENES ===========================
// Themed isometric SVG vignette injected into .product-hero-visual.
// The billboard reads the page's own badge + first stat, so the art
// always matches the page content. Pure CSS animations (no GSAP here).
// ===================================================================
(function initProductIso() {

  var SCENE_MAP = {
    'home-loan': 'house', 'home-insurance': 'house', 'lap': 'house', 'top-up-loan': 'house',
    'auto-loan': 'car', 'motor-insurance': 'car',
    'business-loan': 'office', 'msme-loan': 'office', 'working-capital': 'office',
    'unsecured-business-loan': 'office', 'bridge-financing': 'office',
    'project-funding': 'office', 'reits': 'office', 'group-insurance': 'office',
    'mutual-funds': 'growth', 'sip': 'growth', 'swp': 'growth', 'stp': 'growth',
    'pms': 'growth', 'aif': 'growth', 'bonds': 'growth', 'wealth-management': 'growth',
    'portfolio-advisory': 'growth', 'goal-planning': 'growth', 'tax-planning': 'growth',
    'term-insurance': 'shield', 'ulip': 'shield', 'child-plan': 'shield',
    'critical-illness': 'shield', 'health-insurance': 'shield', 'family-floater': 'shield',
    'advisory': 'shield',
    'education-loan': 'campus',
    'personal-loan': 'coins', 'las': 'coins',
    'nps': 'retire', 'retirement-planning': 'retire', 'retirement-plan': 'retire',
    'senior-citizen-cover': 'retire'
  };

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    var visual = document.querySelector('.product-hero-visual');
    if (!visual || visual.querySelector('.piso-wrap')) return;
    var page = (location.pathname.split('/').pop() || '').replace('.html', '');
    var type = SCENE_MAP[page];
    if (!type) return;

    // Billboard content from the page itself
    var badgeEl = document.querySelector('.product-hero-badge');
    var valEl = document.querySelector('.product-hero-stats .phs-val');
    var labEl = document.querySelector('.product-hero-stats .phs-label');
    var badge = badgeEl ? badgeEl.textContent.trim().toUpperCase() : 'AJ FINANCE';
    var val = valEl ? valEl.textContent.trim() : '';
    var lab = labEl ? labEl.textContent.trim() : '';

    // ── Iso toolkit ─────────────────────────────────────────────
    var S = 24, SX = S * 0.866, SY = S * 0.5, OX = 180, OY = 138;
    function iso(x, y, z) { return { x: OX + (x - y) * SX, y: OY + (x + y) * SY - z * S }; }
    function pt(p) { return p.x.toFixed(1) + ',' + p.y.toFixed(1); }
    function face(pts, fill, stroke, sw) {
      return '<path d="M ' + pts.map(pt).join(' L ') + ' Z" fill="' + fill + '"' +
        (stroke ? ' stroke="' + stroke + '" stroke-width="' + (sw || 0.5) + '"' : '') + '/>';
    }
    // Box with correct visible faces (x=max right, y=max left)
    function box(gx, gy, w, d, h, c) {
      var tfl = iso(gx, gy, h), tfr = iso(gx + w, gy, h), tbr = iso(gx + w, gy + d, h), tbl = iso(gx, gy + d, h);
      var bfr = iso(gx + w, gy, 0), bbr = iso(gx + w, gy + d, 0), bbl = iso(gx, gy + d, 0);
      return face([tbl, tbr, bbr, bbl], c.l, '#00000022') +
             face([tfr, tbr, bbr, bfr], c.r, '#00000022') +
             face([tfl, tfr, tbr, tbl], c.t, '#ffffff30');
    }
    // Pyramid roof over a footprint
    function pyramid(gx, gy, w, d, z, apexH, cl, cr) {
      var p1 = iso(gx, gy, z), p2 = iso(gx + w, gy, z), p3 = iso(gx + w, gy + d, z), p4 = iso(gx, gy + d, z);
      var ap = iso(gx + w / 2, gy + d / 2, z + apexH);
      return '<polygon points="' + pt(p3) + ' ' + pt(p4) + ' ' + pt(ap) + '" fill="' + cl + '" stroke="#00000022" stroke-width="0.5"/>' +
             '<polygon points="' + pt(p2) + ' ' + pt(p3) + ' ' + pt(ap) + '" fill="' + cr + '" stroke="#00000022" stroke-width="0.5"/>';
    }
    // Face-plane groups (matrix flush on left/right faces)
    function onLeft(gx, yPl, zTop, inner) {
      var p = iso(gx, yPl, zTop);
      return '<g transform="matrix(0.866,0.5,0,1,' + p.x.toFixed(1) + ',' + p.y.toFixed(1) + ')">' + inner + '</g>';
    }
    function onRight(xPl, yFr, zTop, inner) {
      var p = iso(xPl, yFr, zTop);
      return '<g transform="matrix(0.866,-0.5,0,1,' + p.x.toFixed(1) + ',' + p.y.toFixed(1) + ')">' + inner + '</g>';
    }
    function ground(r, fill, line) {
      var html = face([iso(-r, -r, 0), iso(r, -r, 0), iso(r, r, 0), iso(-r, r, 0)], fill, line, 0.8);
      for (var i = -r + 1; i < r; i++) {
        html += '<line x1="' + iso(i, -r, 0).x.toFixed(1) + '" y1="' + iso(i, -r, 0).y.toFixed(1) + '" x2="' + iso(i, r, 0).x.toFixed(1) + '" y2="' + iso(i, r, 0).y.toFixed(1) + '" stroke="' + line + '" stroke-width="0.4"/>' +
                '<line x1="' + iso(-r, i, 0).x.toFixed(1) + '" y1="' + iso(-r, i, 0).y.toFixed(1) + '" x2="' + iso(r, i, 0).x.toFixed(1) + '" y2="' + iso(r, i, 0).y.toFixed(1) + '" stroke="' + line + '" stroke-width="0.4"/>';
      }
      return html;
    }
    function tree(gx, gy, sc) {
      sc = sc || 1;
      var b = iso(gx, gy, 0), m = iso(gx, gy, 1.1 * sc);
      return '<g class="piso-sway">' +
        '<rect x="' + (b.x - 1.8).toFixed(1) + '" y="' + m.y.toFixed(1) + '" width="3.6" height="' + (b.y - m.y).toFixed(1) + '" fill="#92400e" rx="1"/>' +
        '<polygon points="' + b.x + ',' + (m.y - 11 * sc).toFixed(1) + ' ' + (b.x - 8 * sc).toFixed(1) + ',' + (m.y + 2).toFixed(1) + ' ' + (b.x + 8 * sc).toFixed(1) + ',' + (m.y + 2).toFixed(1) + '" fill="#059669"/>' +
        '<polygon points="' + b.x + ',' + (m.y - 5 * sc).toFixed(1) + ' ' + (b.x - 6 * sc).toFixed(1) + ',' + (m.y + 4.5).toFixed(1) + ' ' + (b.x + 6 * sc).toFixed(1) + ',' + (m.y + 4.5).toFixed(1) + '" fill="#10b981"/></g>';
    }
    function bush(gx, gy) {
      var b = iso(gx, gy, 0);
      return '<ellipse cx="' + b.x.toFixed(1) + '" cy="' + (b.y - 2.5).toFixed(1) + '" rx="5.5" ry="4" fill="#10b981"/>' +
             '<ellipse cx="' + (b.x + 4).toFixed(1) + '" cy="' + (b.y - 1.5).toFixed(1) + '" rx="4" ry="3" fill="#059669"/>';
    }
    // Coin cylinder stack at grid pos; n coins; returns html
    function coinStack(gx, gy, n, rupee) {
      var b = iso(gx, gy, 0), html = '', rx = 10, ry = 4.6, t = 3.6;
      for (var i = 0; i < n; i++) {
        var cy = b.y - i * t;
        html += '<path d="M ' + (b.x - rx) + ' ' + (cy - t) + ' A ' + rx + ' ' + ry + ' 0 0 0 ' + (b.x + rx) + ' ' + (cy - t) + ' L ' + (b.x + rx) + ' ' + cy + ' A ' + rx + ' ' + ry + ' 0 0 1 ' + (b.x - rx) + ' ' + cy + ' Z" fill="#d97706" stroke="#92400e" stroke-width="0.5"/>';
        html += '<ellipse cx="' + b.x + '" cy="' + (cy - t) + '" rx="' + rx + '" ry="' + ry + '" fill="#fbbf24" stroke="#b45309" stroke-width="0.6"/>';
      }
      if (rupee) html += '<text x="' + b.x + '" y="' + (b.y - n * t + 1.8) + '" font-size="6" font-weight="800" fill="#92400e" text-anchor="middle" font-family="\'Plus Jakarta Sans\',sans-serif">₹</text>';
      return html;
    }
    // Standing billboard with page badge + stat (back-right corner)
    function billboard(gx, gy, accent) {
      // shrink the value font for long stats so it never overflows the panel
      var vf = val.length > 11 ? 6.6 : (val.length > 8 ? 8 : 11);
      var bb = '';
      bb += '<rect x="14" y="34" width="2.2" height="10" fill="#0f3d33"/>' +
            '<rect x="64" y="34" width="2.2" height="10" fill="#0f3d33"/>' +
            '<rect x="0" y="0" width="80" height="34" rx="3" fill="#0b1626" stroke="' + accent + '55" stroke-width="0.8"/>' +
            '<circle cx="6.5" cy="7" r="1.6" fill="' + accent + '" class="piso-blink"/>' +
            '<text x="11" y="9" font-size="5" font-weight="700" fill="' + accent + '" letter-spacing="0.8" font-family="\'Plus Jakarta Sans\',sans-serif">' + badge.slice(0, 18) + '</text>' +
            '<text x="40" y="22.5" font-size="' + vf + '" font-weight="800" fill="#f1f5f9" text-anchor="middle" font-family="\'Plus Jakarta Sans\',sans-serif">' + val + '</text>' +
            '<text x="40" y="30" font-size="4.6" fill="#94a3b8" text-anchor="middle" font-family="\'Plus Jakarta Sans\',sans-serif">' + lab + '</text>';
      return '<g class="piso-rise" style="animation-delay:.55s">' + onRight(gx, gy, 3.3, bb) + '</g>';
    }
    function rise(html, delay) {
      return '<g class="piso-rise" style="animation-delay:' + delay + 's">' + html + '</g>';
    }

    // ── Palettes ────────────────────────────────────────────────
    var TEAL = { t: '#00d09c', l: '#005f43', r: '#00845f' };
    var BLUE = { t: '#818cf8', l: '#1e3a8a', r: '#2563eb' };
    var PURP = { t: '#c4b5fd', l: '#5b21b6', r: '#7c3aed' };
    var GOLD = { t: '#fde68a', l: '#92400e', r: '#d97706' };
    var CREAM = { t: '#fef3c7', l: '#d6bb8d', r: '#efe0bd' };
    var RED = { t: '#fca5a5', l: '#991b1b', r: '#b91c1c' };
    var GREEN = { t: '#6ee7b7', l: '#047857', r: '#059669' };

    var G_FILL = '#e8f9f4', G_LINE = '#c8e8da';

    // ── Scenes ──────────────────────────────────────────────────
    var scenes = {

      house: function () {
        var h = ground(3.4, G_FILL, G_LINE);
        // driveway
        h += face([iso(1.1, 0.2, 0.01), iso(1.9, 0.2, 0.01), iso(1.9, 3.4, 0.01), iso(1.1, 3.4, 0.01)], '#d4ede6');
        // house body + roof + chimney
        h += rise(
          box(-1.6, -0.9, 2.2, 2.0, 1.5, CREAM) +
          pyramid(-1.75, -1.05, 2.5, 2.3, 1.5, 1.0, '#991b1b', '#dc2626') +
          box(0.15, -0.75, 0.3, 0.3, 2.15, RED) +
          // door + windows on the left face
          onLeft(-1.6, 1.1, 1.5,
            '<rect x="19" y="17" width="9.5" height="19" rx="1.5" fill="#7c2d12"/>' +
            '<circle cx="26.5" cy="27" r="0.9" fill="#fbbf24"/>' +
            '<rect x="4" y="12" width="10" height="9" rx="1" fill="#bfdbfe" stroke="#7c2d12" stroke-width="0.8"/>' +
            '<line x1="9" y1="12" x2="9" y2="21" stroke="#7c2d12" stroke-width="0.6"/>' +
            '<rect x="33" y="12" width="10" height="9" rx="1" fill="#bfdbfe" stroke="#7c2d12" stroke-width="0.8"/>' +
            '<line x1="38" y1="12" x2="38" y2="21" stroke="#7c2d12" stroke-width="0.6"/>'
          ) +
          // window on the right face
          onRight(0.6, 1.1, 1.5, '<rect x="12" y="11" width="11" height="10" rx="1" fill="#bfdbfe" stroke="#7c2d12" stroke-width="0.8"/><line x1="17.5" y1="11" x2="17.5" y2="21" stroke="#7c2d12" stroke-width="0.6"/>'),
          0.15);
        // garage
        h += rise(
          box(0.7, -0.7, 1.1, 1.1, 0.9, CREAM) +
          face([iso(0.7, 0.4, 0.9), iso(1.8, 0.4, 0.9), iso(1.8, 0.4, 0.92), iso(0.7, 0.4, 0.92)], '#d97706') +
          onLeft(0.7, 0.4, 0.78, '<rect x="3" y="0" width="20" height="17" rx="1.5" fill="#9a7b4f"/><line x1="3" y1="4.5" x2="23" y2="4.5" stroke="#7c5e3a" stroke-width="0.8"/><line x1="3" y1="9" x2="23" y2="9" stroke="#7c5e3a" stroke-width="0.8"/><line x1="3" y1="13.5" x2="23" y2="13.5" stroke="#7c5e3a" stroke-width="0.8"/>'),
          0.3);
        // approved flag on roof
        var fp = iso(-0.5, 0.1, 2.5), ft = iso(-0.5, 0.1, 3.4);
        h += rise('<line x1="' + fp.x + '" y1="' + fp.y + '" x2="' + ft.x + '" y2="' + ft.y + '" stroke="#475569" stroke-width="1.4"/>' +
          '<path d="M ' + ft.x + ' ' + ft.y + ' l 22 3.5 l -22 3.5 Z" fill="#00d09c"/>' +
          '<text x="' + (ft.x + 4) + '" y="' + (ft.y + 5.7) + '" font-size="4.6" font-weight="800" fill="#04342a" font-family="\'Plus Jakarta Sans\',sans-serif">APPROVED</text>', 0.7);
        h += tree(-2.6, 1.6, 1.05) + tree(2.6, -1.6, 0.9) + bush(-0.4, 2.5) + bush(-2.7, -0.6);
        h += billboard(3.1, 2.0, '#00d09c');
        return h;
      },

      car: function () {
        var h = ground(3.4, G_FILL, G_LINE);
        // road band
        h += face([iso(-3.4, -0.2, 0.01), iso(3.4, -0.2, 0.01), iso(3.4, 1.4, 0.01), iso(-3.4, 1.4, 0.01)], '#cfdfd9');
        for (var x = -3.1; x < 3.2; x += 0.9) {
          h += face([iso(x, 0.55, 0.02), iso(x + 0.45, 0.55, 0.02), iso(x + 0.45, 0.65, 0.02), iso(x, 0.65, 0.02)], '#ffffffcc');
        }
        // car: body + cabin + wheels + lights
        var carHtml =
          box(-1.1, 0.15, 2.0, 0.95, 0.45, { t: '#34d399', l: '#065f46', r: '#059669' }) +
          box(-0.55, 0.25, 1.0, 0.75, 0.78, { t: '#a7f3d0', l: '#047857', r: '#10b981' });
        var w1 = iso(-0.72, 1.1, 0), w2 = iso(0.62, 1.1, 0), w3 = iso(0.95, 0.36, 0);
        carHtml += '<ellipse cx="' + w1.x + '" cy="' + (w1.y - 2.2) + '" rx="4.6" ry="4.2" fill="#1f2937"/><ellipse cx="' + w1.x + '" cy="' + (w1.y - 2.2) + '" rx="2" ry="1.8" fill="#9ca3af"/>';
        carHtml += '<ellipse cx="' + w2.x + '" cy="' + (w2.y - 2.2) + '" rx="4.6" ry="4.2" fill="#1f2937"/><ellipse cx="' + w2.x + '" cy="' + (w2.y - 2.2) + '" rx="2" ry="1.8" fill="#9ca3af"/>';
        carHtml += '<ellipse cx="' + w3.x + '" cy="' + (w3.y - 2.2) + '" rx="4.2" ry="3.8" fill="#1f2937"/><ellipse cx="' + w3.x + '" cy="' + (w3.y - 2.2) + '" rx="1.8" ry="1.6" fill="#9ca3af"/>';
        var hl = iso(0.92, 0.3, 0.32);
        carHtml += '<circle cx="' + hl.x + '" cy="' + hl.y + '" r="1.7" fill="#fef08a" class="piso-blink"/>';
        // motion dashes behind
        var m1 = iso(-1.5, 0.6, 0.3);
        carHtml += '<g class="piso-dashes"><line x1="' + (m1.x - 18) + '" y1="' + m1.y + '" x2="' + (m1.x - 8) + '" y2="' + (m1.y - 5.5) + '" stroke="#94a3b8" stroke-width="1.6" stroke-linecap="round"/><line x1="' + (m1.x - 26) + '" y1="' + (m1.y + 9) + '" x2="' + (m1.x - 16) + '" y2="' + (m1.y + 3.5) + '" stroke="#94a3b8" stroke-width="1.4" stroke-linecap="round"/></g>';
        h += rise(carHtml, 0.2);
        h += tree(-2.5, 2.4, 0.95) + tree(2.4, -2.2, 0.85) + bush(0.4, 2.6);
        h += billboard(3.1, 2.0, '#00d09c');
        return h;
      },

      office: function () {
        var h = ground(3.4, G_FILL, G_LINE);
        function winsL(gx, yPl, zTop, w, rows, cols) {
          var inner = '', cw = (w * S - 8) / cols;
          for (var r2 = 0; r2 < rows; r2++) for (var c2 = 0; c2 < cols; c2++) {
            inner += '<rect x="' + (4 + c2 * cw + 1).toFixed(1) + '" y="' + (5 + r2 * 11).toFixed(1) + '" width="' + (cw - 2.4).toFixed(1) + '" height="7" rx="0.8" fill="#bfdbfe99"/>';
          }
          return onLeft(gx, yPl, zTop, inner);
        }
        h += rise(box(-2.3, -1.4, 1.4, 1.3, 2.2, BLUE) + winsL(-2.3, -0.1, 2.2, 1.4, 4, 3), 0.15);
        h += rise(box(-0.4, -1.2, 1.6, 1.5, 3.2, TEAL) + winsL(-0.4, 0.3, 3.2, 1.6, 6, 3) +
          onRight(1.2, 0.3, 3.62,
            '<rect x="0" y="0" width="34" height="9" rx="1.5" fill="#0b1626" stroke="#00d09c66" stroke-width="0.6"/>' +
            '<text x="17" y="6.3" font-size="4.6" font-weight="800" fill="#00d09c" text-anchor="middle" letter-spacing="0.6" font-family="\'Plus Jakarta Sans\',sans-serif">AJ FINANCE</text>' +
            '<rect x="5" y="9" width="1.6" height="3" fill="#0f3d33"/><rect x="27" y="9" width="1.6" height="3" fill="#0f3d33"/>'),
          0.3);
        h += rise(box(1.6, -0.5, 1.2, 1.1, 1.6, PURP) + winsL(1.6, 0.6, 1.6, 1.2, 3, 3), 0.45);
        // antenna
        var ab = iso(0.4, -0.9, 3.2), at = iso(0.4, -0.9, 4.1);
        h += rise('<line x1="' + ab.x + '" y1="' + ab.y + '" x2="' + at.x + '" y2="' + at.y + '" stroke="#475569" stroke-width="1.4"/><circle cx="' + at.x + '" cy="' + at.y + '" r="1.8" fill="#ef4444" class="piso-blink"/>', 0.6);
        h += tree(-1.4, 2.2, 0.95) + tree(2.7, 1.5, 0.85) + bush(0.3, 2.7);
        h += billboard(3.1, 2.2, '#00d09c');
        return h;
      },

      growth: function () {
        var h = ground(3.4, G_FILL, G_LINE);
        var bars = [
          [-2.5, 0.0, 0.6, GREEN], [-1.5, -0.2, 1.1, TEAL], [-0.5, -0.4, 1.7, TEAL],
          [0.5, -0.6, 2.3, BLUE], [1.5, -0.8, 3.0, PURP]
        ];
        for (var i = 0; i < bars.length; i++) {
          h += rise(box(bars[i][0], bars[i][1], 0.8, 0.8, bars[i][2], bars[i][3]), 0.12 + i * 0.12);
        }
        // arrow over bar tops
        var pts = [];
        for (var j = 0; j < bars.length; j++) {
          var tp = iso(bars[j][0] + 0.4, bars[j][1] + 0.4, bars[j][2] + 0.45);
          pts.push(tp.x.toFixed(1) + ',' + tp.y.toFixed(1));
        }
        var last = iso(2.45, -0.85, 3.9);
        pts.push(last.x.toFixed(1) + ',' + last.y.toFixed(1));
        h += '<polyline points="' + pts.join(' ') + '" fill="none" stroke="#eb5b3c" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" class="piso-draw"/>' +
             '<path d="M ' + (last.x - 9) + ' ' + (last.y - 1) + ' L ' + (last.x + 1) + ' ' + (last.y - 1) + ' L ' + (last.x - 3) + ' ' + (last.y + 8) + '" fill="none" stroke="#eb5b3c" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" class="piso-rise" style="animation-delay:1.9s"/>';
        h += rise(coinStack(2.0, 1.3, 4, true), 0.7) + rise(coinStack(2.85, 0.75, 2, false), 0.85);
        h += tree(-2.7, 1.9, 0.9) + bush(-0.9, 2.5);
        h += billboard(-0.4, 2.6, '#00d09c');
        return h;
      },

      shield: function () {
        var h = ground(3.4, G_FILL, G_LINE);
        // family home + savings under protection
        h += rise(box(-1.9, 0.3, 1.3, 1.2, 0.95, CREAM) + pyramid(-2.0, 0.2, 1.5, 1.4, 0.95, 0.6, '#991b1b', '#dc2626'), 0.3);
        h += rise(coinStack(0.4, 1.5, 3, true), 0.45);
        // big standing shield
        var sc = iso(0.4, -0.9, 0);
        var sh = '<g class="piso-rise" style="animation-delay:.12s">' +
          '<path d="M ' + (sc.x + 3) + ' ' + (sc.y - 64) + ' c 11 6 22 6 24 6 v 22 c 0 18 -14 28 -24 33 Z" fill="#0e7a62"/>' +
          '<path d="M ' + sc.x + ' ' + (sc.y - 65) + ' c -12 6 -24 6 -26 6 v 23 c 0 19 15 29 26 34 c 11 -5 26 -15 26 -34 v -23 c -2 0 -14 0 -26 -6 Z" fill="#00d09c" stroke="#04614d" stroke-width="1.2"/>' +
          '<path d="M ' + sc.x + ' ' + (sc.y - 59) + ' c -9 4.5 -18 5 -20 5 v 18 c 0 15 11 23 20 27.5 Z" fill="#ffffff2e"/>' +
          '<path d="M ' + (sc.x - 9) + ' ' + (sc.y - 34) + ' l 7 7 l 13 -14" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" class="piso-draw"/>' +
          '</g>';
        h += sh;
        h += tree(2.6, 0.3, 0.9) + tree(-2.7, 2.3, 0.8) + bush(1.6, 2.6);
        h += billboard(3.1, 2.1, '#00d09c');
        return h;
      },

      campus: function () {
        var h = ground(3.4, G_FILL, G_LINE);
        // main hall + pediment + columns
        h += rise(
          box(-1.7, -0.9, 2.6, 1.7, 1.5, CREAM) +
          onLeft(-1.7, 0.8, 1.5,
            '<polygon points="2,9 52,9 27,1" fill="#fde68a" stroke="#b45309" stroke-width="0.8"/>' +
            '<rect x="6" y="11" width="4" height="24" fill="#fef3c7" stroke="#d97706" stroke-width="0.5"/>' +
            '<rect x="17" y="11" width="4" height="24" fill="#fef3c7" stroke="#d97706" stroke-width="0.5"/>' +
            '<rect x="28" y="11" width="4" height="24" fill="#fef3c7" stroke="#d97706" stroke-width="0.5"/>' +
            '<rect x="39" y="11" width="4" height="24" fill="#fef3c7" stroke="#d97706" stroke-width="0.5"/>' +
            '<rect x="22.5" y="24" width="9" height="11" rx="1" fill="#78350f"/>'),
          0.15);
        // graduation cap on roof: flat diamond + button + tassel
        var cc = iso(-0.4, 0.0, 2.1);
        var c1 = iso(-1.3, 0.0, 2.1), c2 = iso(-0.4, -0.9, 2.1), c3 = iso(0.5, 0.0, 2.1), c4 = iso(-0.4, 0.9, 2.1);
        h += rise(
          box(-0.75, -0.35, 0.7, 0.7, 0.55, { t: '#1f2937', l: '#0b1320', r: '#111c2e' }) +
          '<polygon points="' + pt(c1) + ' ' + pt(c2) + ' ' + pt(c3) + ' ' + pt(c4) + '" fill="#1f2937" stroke="#0b1320" stroke-width="0.8"/>' +
          '<circle cx="' + cc.x + '" cy="' + cc.y + '" r="1.6" fill="#fbbf24"/>' +
          '<path d="M ' + cc.x + ' ' + cc.y + ' Q ' + (cc.x + 16) + ' ' + (cc.y + 2) + ' ' + (cc.x + 18) + ' ' + (cc.y + 14) + '" fill="none" stroke="#fbbf24" stroke-width="1.3" class="piso-sway"/>' +
          '<circle cx="' + (cc.x + 18) + '" cy="' + (cc.y + 15.5) + '" r="2" fill="#fbbf24" class="piso-sway"/>',
          0.45);
        // books stack
        var bk = iso(1.7, 1.1, 0);
        h += rise('<g>' +
          '<rect x="' + (bk.x - 13) + '" y="' + (bk.y - 5) + '" width="26" height="5" rx="1" fill="#2563eb"/>' +
          '<rect x="' + (bk.x - 11) + '" y="' + (bk.y - 10) + '" width="24" height="5" rx="1" fill="#dc2626"/>' +
          '<rect x="' + (bk.x - 12) + '" y="' + (bk.y - 15) + '" width="22" height="5" rx="1" fill="#059669"/></g>', 0.6);
        h += tree(-2.6, 1.9, 0.95) + tree(2.7, -1.4, 0.85) + bush(0.4, 2.6);
        h += billboard(3.1, 2.1, '#00d09c');
        return h;
      },

      coins: function () {
        var h = ground(3.4, G_FILL, G_LINE);
        h += rise(coinStack(-1.3, 0.4, 6, true), 0.15);
        h += rise(coinStack(-0.1, 1.2, 4, true), 0.3);
        h += rise(coinStack(0.8, 0.1, 2, false), 0.45);
        // standing debit card
        var cardInner =
          '<rect x="0" y="0" width="58" height="36" rx="4" fill="#0b1626" stroke="#00d09c55" stroke-width="0.8"/>' +
          '<rect x="5" y="7" width="10" height="7.5" rx="1.5" fill="#fbbf24"/>' +
          '<text x="5" y="24" font-size="5.4" font-weight="700" fill="#cbd5e1" letter-spacing="1" font-family="\'Plus Jakarta Sans\',sans-serif">•••• 4218</text>' +
          '<text x="5" y="31.5" font-size="4" fill="#00d09c" font-family="\'Plus Jakarta Sans\',sans-serif" font-weight="700">AJ FINANCE</text>' +
          '<circle cx="48" cy="27" r="4.5" fill="#eb5b3c88"/><circle cx="53" cy="27" r="4.5" fill="#fbbf2488"/>';
        h += rise(onRight(1.9, 0.9, 1.75, cardInner), 0.6);
        // scattered coins
        var s1 = iso(-2.3, 1.9, 0), s2 = iso(1.0, 2.3, 0);
        h += '<ellipse cx="' + s1.x + '" cy="' + (s1.y - 2) + '" rx="7" ry="3.2" fill="#fbbf24" stroke="#b45309" stroke-width="0.6"/>' +
             '<ellipse cx="' + s2.x + '" cy="' + (s2.y - 2) + '" rx="6" ry="2.8" fill="#fbbf24" stroke="#b45309" stroke-width="0.6"/>';
        h += tree(2.7, -1.8, 0.85) + bush(-2.6, -0.7);
        h += billboard(3.1, 2.1, '#00d09c');
        return h;
      },

      retire: function () {
        var h = ground(3.4, G_FILL, G_LINE);
        // beach umbrella
        var ub = iso(-0.6, 0.2, 0), ut = iso(-0.6, 0.2, 3.1);
        var umb = '<line x1="' + ub.x + '" y1="' + (ub.y - 2) + '" x2="' + ut.x + '" y2="' + ut.y + '" stroke="#92400e" stroke-width="2.2"/>';
        for (var k = 0; k < 6; k++) {
          var a1 = Math.PI + k * Math.PI / 6, a2 = Math.PI + (k + 1) * Math.PI / 6;
          var px1 = ut.x + 38 * Math.cos(a1), py1 = ut.y + 6 + 19 * Math.sin(a1);
          var px2 = ut.x + 38 * Math.cos(a2), py2 = ut.y + 6 + 19 * Math.sin(a2);
          umb += '<path d="M ' + ut.x + ' ' + (ut.y - 8) + ' L ' + px1.toFixed(1) + ' ' + py1.toFixed(1) + ' Q ' + ((px1 + px2) / 2).toFixed(1) + ' ' + ((py1 + py2) / 2 + 4).toFixed(1) + ' ' + px2.toFixed(1) + ' ' + py2.toFixed(1) + ' Z" fill="' + (k % 2 ? '#00d09c' : '#f1f5f9') + '" stroke="#04614d" stroke-width="0.7"/>';
        }
        umb += '<circle cx="' + ut.x + '" cy="' + (ut.y - 9) + '" r="2" fill="#04614d"/>';
        h += rise(umb, 0.2);
        // nest egg: coin stacks under umbrella
        h += rise(coinStack(0.3, 1.0, 5, true), 0.4);
        h += rise(coinStack(-1.5, 1.4, 3, true), 0.55);
        // bench
        var be = box(1.6, -1.2, 1.3, 0.5, 0.42, { t: '#d6bb8d', l: '#8a6b41', r: '#b08d57' });
        h += rise(be, 0.65);
        h += tree(-2.7, -0.9, 1.0) + tree(2.7, 1.6, 0.9) + bush(-2.3, 2.4);
        h += billboard(3.1, 2.1, '#00d09c');
        return h;
      }
    };

    var sceneHTML = scenes[type] ? scenes[type]() : '';
    if (!sceneHTML) return;

    var wrap = document.createElement('div');
    wrap.className = 'piso-wrap';
    wrap.setAttribute('aria-hidden', 'true');
    wrap.innerHTML = '<svg viewBox="28 20 304 222" xmlns="http://www.w3.org/2000/svg">' + sceneHTML + '</svg>';
    visual.insertBefore(wrap, visual.firstChild);
  });
})();
