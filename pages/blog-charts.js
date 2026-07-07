/* ============================================================================
   FinGarage Blog — lightweight inline-SVG chart renderer
   Supports: line, bar, donut. No external dependencies. Theme-aware.
   Usage: renderChart(config) -> returns an SVG string.
   ============================================================================ */

(function () {
  const AXIS = 'var(--text-muted,#888899)';
  const GRID = 'var(--border-color,#e5e7eb)';
  const INK  = 'var(--text-secondary,#555577)';

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

  /* ---- LINE ---- */
  function lineChart(c) {
    const W = 640, H = 300, pad = { t: 20, r: 20, b: 42, l: 48 };
    const iw = W - pad.l - pad.r, ih = H - pad.t - pad.b;
    const all = c.series.flatMap(s => s.data);
    let min = Math.min(...all), max = Math.max(...all);
    if (min > 0) min = 0;
    const range = (max - min) || 1;
    const xN = c.x.length;
    const xAt = i => pad.l + (xN === 1 ? iw / 2 : (i / (xN - 1)) * iw);
    const yAt = v => pad.t + ih - ((v - min) / range) * ih;

    let grid = '', ticks = 4;
    for (let g = 0; g <= ticks; g++) {
      const val = min + (range * g / ticks);
      const y = yAt(val);
      grid += `<line x1="${pad.l}" y1="${y}" x2="${W - pad.r}" y2="${y}" stroke="${GRID}" stroke-width="1"/>`;
      grid += `<text x="${pad.l - 8}" y="${y + 4}" text-anchor="end" font-size="11" fill="${AXIS}">${Math.round(val)}</text>`;
    }
    let xlabels = '';
    c.x.forEach((lb, i) => {
      xlabels += `<text x="${xAt(i)}" y="${H - pad.b + 20}" text-anchor="middle" font-size="11" fill="${AXIS}">${esc(lb)}</text>`;
    });
    let paths = '';
    c.series.forEach(s => {
      const pts = s.data.map((v, i) => `${xAt(i)},${yAt(v)}`).join(' ');
      paths += `<polyline points="${pts}" fill="none" stroke="${s.color}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>`;
      s.data.forEach((v, i) => { paths += `<circle cx="${xAt(i)}" cy="${yAt(v)}" r="3.5" fill="${s.color}"/>`; });
    });
    return svgWrap(W, H, grid + xlabels + paths) + legend(c.series);
  }

  /* ---- BAR (supports negative + grouped) ---- */
  function barChart(c) {
    const W = 640, H = 300, pad = { t: 20, r: 20, b: 56, l: 52 };
    const iw = W - pad.l - pad.r, ih = H - pad.t - pad.b;
    const all = c.series.flatMap(s => s.data);
    let min = Math.min(...all, 0), max = Math.max(...all, 0);
    const range = (max - min) || 1;
    const yAt = v => pad.t + ih - ((v - min) / range) * ih;
    const groups = c.x.length, sN = c.series.length;
    const gw = iw / groups, bw = Math.min(46, (gw * 0.7) / sN);

    let grid = '', ticks = 4;
    for (let g = 0; g <= ticks; g++) {
      const val = min + (range * g / ticks);
      const y = yAt(val);
      grid += `<line x1="${pad.l}" y1="${y}" x2="${W - pad.r}" y2="${y}" stroke="${GRID}" stroke-width="1"/>`;
      grid += `<text x="${pad.l - 8}" y="${y + 4}" text-anchor="end" font-size="11" fill="${AXIS}">${Math.round(val)}</text>`;
    }
    const zeroY = yAt(0);
    let bars = '', xlabels = '';
    c.x.forEach((lb, i) => {
      const cx = pad.l + gw * i + gw / 2;
      const totalW = bw * sN + (sN - 1) * 4;
      c.series.forEach((s, si) => {
        const v = s.data[i];
        const x = cx - totalW / 2 + si * (bw + 4);
        const y = v >= 0 ? yAt(v) : zeroY;
        const h = Math.abs(yAt(v) - zeroY);
        bars += `<rect x="${x}" y="${y}" width="${bw}" height="${Math.max(h, 1)}" rx="4" fill="${s.color}"/>`;
        bars += `<text x="${x + bw / 2}" y="${v >= 0 ? y - 6 : y + h + 14}" text-anchor="middle" font-size="10.5" font-weight="600" fill="${INK}">${v}</text>`;
      });
      const words = String(lb).split(' ');
      const wrapped = words.length > 2
        ? `<tspan x="${cx}" dy="0">${esc(words.slice(0, Math.ceil(words.length / 2)).join(' '))}</tspan><tspan x="${cx}" dy="13">${esc(words.slice(Math.ceil(words.length / 2)).join(' '))}</tspan>`
        : `<tspan x="${cx}" dy="0">${esc(lb)}</tspan>`;
      xlabels += `<text y="${H - pad.b + 18}" text-anchor="middle" font-size="10.5" fill="${AXIS}">${wrapped}</text>`;
    });
    return svgWrap(W, H, grid + `<line x1="${pad.l}" y1="${zeroY}" x2="${W - pad.r}" y2="${zeroY}" stroke="${AXIS}" stroke-width="1.5"/>` + bars + xlabels) + (sN > 1 ? legend(c.series) : '');
  }

  /* ---- DONUT ---- */
  function donutChart(c) {
    const size = 280, cx = size / 2, cy = size / 2, r = 100, rin = 62;
    const total = c.series.reduce((a, s) => a + s.value, 0) || 1;
    let a0 = -Math.PI / 2, arcs = '';
    c.series.forEach(s => {
      const frac = s.value / total, a1 = a0 + frac * Math.PI * 2;
      const large = frac > 0.5 ? 1 : 0;
      const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
      const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
      const xi0 = cx + rin * Math.cos(a1), yi0 = cy + rin * Math.sin(a1);
      const xi1 = cx + rin * Math.cos(a0), yi1 = cy + rin * Math.sin(a0);
      arcs += `<path d="M${x0} ${y0} A${r} ${r} 0 ${large} 1 ${x1} ${y1} L${xi0} ${yi0} A${rin} ${rin} 0 ${large} 0 ${xi1} ${yi1} Z" fill="${s.color}"/>`;
      a0 = a1;
    });
    const svg = `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;display:block;margin:0 auto;">${arcs}<text x="${cx}" y="${cy - 2}" text-anchor="middle" font-size="13" fill="${AXIS}">Total</text><text x="${cx}" y="${cy + 18}" text-anchor="middle" font-size="18" font-weight="700" fill="var(--text-primary,#1a1a2e)">100%</text></svg>`;
    const leg = c.series.map(s =>
      `<div style="display:flex;align-items:center;gap:8px;font-size:12.5px;color:${INK};">
         <span style="width:11px;height:11px;border-radius:3px;background:${s.color};flex:none;"></span>
         <span>${esc(s.name)} — <strong style="color:var(--text-primary,#1a1a2e);">${s.value}%</strong></span>
       </div>`).join('');
    return `<div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:28px;">${svg}<div style="display:flex;flex-direction:column;gap:10px;">${leg}</div></div>`;
  }

  function svgWrap(w, h, inner) {
    return `<svg viewBox="0 0 ${w} ${h}" width="100%" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style="display:block;max-width:100%;">${inner}</svg>`;
  }
  function legend(series) {
    return `<div style="display:flex;flex-wrap:wrap;gap:18px;justify-content:center;margin-top:6px;">` +
      series.map(s => `<div style="display:flex;align-items:center;gap:7px;font-size:12.5px;color:${INK};"><span style="width:14px;height:3px;border-radius:2px;background:${s.color};"></span>${esc(s.name)}</div>`).join('') +
      `</div>`;
  }

  function renderChart(c) {
    if (!c) return '';
    let body = '';
    if (c.type === 'line') body = lineChart(c);
    else if (c.type === 'bar') body = barChart(c);
    else if (c.type === 'donut') body = donutChart(c);
    return `<figure style="margin:28px 0;padding:22px 20px 16px;background:var(--bg-secondary,#f7f9fc);border:1px solid var(--border-color,#e5e7eb);border-radius:14px;">
      ${body}
      ${c.caption ? `<figcaption style="text-align:center;font-size:12.5px;color:var(--text-muted,#888899);margin-top:14px;font-style:italic;">${esc(c.caption)}</figcaption>` : ''}
    </figure>`;
  }

  window.renderChart = renderChart;
})();
