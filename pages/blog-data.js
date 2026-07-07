/* ============================================================================
   FinGarage Blog — Original editorial content
   26 full-length, original finance articles (India-focused) with chart data.
   All content is original and written in-house. No third-party article text is
   reproduced here. Charts are rendered as inline SVG by blog-charts.js.
   ============================================================================ */

const BLOG_CATEGORIES = [
  { id: 'all',       label: 'All' },
  { id: 'markets',   label: 'Markets',      color: '#00d09c' },
  { id: 'wealth',    label: 'Personal Finance', color: '#5367ff' },
  { id: 'funds',     label: 'Mutual Funds',  color: '#8b5cf6' },
  { id: 'insurance', label: 'Insurance',     color: '#eb5b3c' },
  { id: 'loans',     label: 'Loans & Credit',color: '#f5a623' },
  { id: 'tech',      label: 'Fintech',       color: '#0ea5e9' }
];

const CAT_META = {
  markets:   { label: 'MARKETS',        color: '#00d09c' },
  wealth:    { label: 'PERSONAL FINANCE',color: '#5367ff' },
  funds:     { label: 'MUTUAL FUNDS',   color: '#8b5cf6' },
  insurance: { label: 'INSURANCE',      color: '#eb5b3c' },
  loans:     { label: 'LOANS & CREDIT', color: '#f5a623' },
  tech:      { label: 'FINTECH',        color: '#0ea5e9' }
};

/* Block helpers keep article bodies readable.
   Types: h2, p, ul, quote, stat, chart (chart is injected from article.chart) */
const h2 = (t) => ({ t: 'h2', x: t });
const p  = (t) => ({ t: 'p',  x: t });
const ul = (...items) => ({ t: 'ul', x: items });
const q  = (t, by) => ({ t: 'quote', x: t, by });
const stat = (v, l) => ({ t: 'stat', v, l });
const stats = (...s) => ({ t: 'stats', x: s });
const chartHere = { t: 'chart' };

const BLOG_POSTS = [
  /* ------------------------------------------------------------------ MARKETS */
  {
    slug: 'nifty-mid-caps-valuation-2026',
    cat: 'markets',
    title: 'Why mid-caps look stretched in 2026 — and where value still hides',
    excerpt: 'After two years of a broad rally, mid-cap valuations are running ahead of earnings. Here is how to stay invested without overpaying.',
    author: 'FinGarage Research Desk',
    date: '2026-07-05',
    read: 7,
    chart: {
      type: 'line', caption: 'Nifty Midcap 150 — trailing P/E vs 10-year average',
      x: ['2020', '2021', '2022', '2023', '2024', '2025', '2026'],
      series: [
        { name: 'Midcap P/E', color: '#00d09c', data: [21, 28, 24, 27, 31, 34, 33] },
        { name: '10-yr avg',  color: '#888899', data: [25, 25, 25, 25, 25, 25, 25] }
      ]
    },
    body: [
      p('Indian mid-caps have delivered one of the strongest three-year runs on record. But price has outpaced profit. The trailing price-to-earnings ratio on the Nifty Midcap 150 now sits well above its own decade-long average, which historically has been a signal to lower return expectations — not to sell everything, but to stop assuming the last three years repeat.'),
      chartHere,
      h2('What the premium actually means'),
      p('A high P/E is not automatically a bubble. It reflects the market pricing in future earnings growth. The question is whether that growth is realistic. When a segment trades 30% above its long-run multiple, companies have to deliver above-trend earnings just to justify today\'s price. Any disappointment gets punished twice — once on earnings and once on the multiple compressing.'),
      h2('Where value still hides'),
      p('Selectivity matters more than direction at this stage of the cycle. Three areas still offer a reasonable margin of safety:'),
      ul(
        'Capex-linked industrials where order books are visible 18–24 months out',
        'Private-sector lenders trading closer to book value after a soft patch',
        'Select consumer names where rural demand is only now recovering'
      ),
      q('Buy the business, not the momentum. If you cannot explain why earnings will grow, the P/E is telling you a story you have not verified.'),
      h2('How to position without market-timing'),
      p('For most investors, the answer is not to exit but to rebalance. If mid-caps have drifted from 25% of your equity to 40% simply because they ran, trimming back to target is prudence, not prediction. Continue SIPs — rupee-cost averaging is exactly the tool for expensive, volatile segments — but avoid deploying fresh lump sums into the frothiest pockets.'),
      stats(stat('33x', 'Midcap trailing P/E'), stat('25x', '10-yr average'), stat('+32%', 'Premium to mean')),
      p('The disciplined move in 2026 is boring: keep your systematic plan running, rebalance to targets, and let valuation do the filtering for you.')
    ]
  },
  {
    slug: 'large-cap-buy-list-analyst-upside',
    cat: 'markets',
    title: 'Reading analyst "buy" ratings without getting burned',
    excerpt: 'A "strong buy" with 29% upside sounds compelling — but consensus targets miss more often than they hit. Here is how to use them properly.',
    author: 'FinGarage Research Desk',
    date: '2026-07-04',
    read: 6,
    chart: {
      type: 'bar', caption: 'Where analyst price targets landed vs actual (last 5 years)',
      x: ['Beat target', 'Within 10%', 'Missed by 10–25%', 'Missed by 25%+'],
      series: [{ name: '% of calls', color: '#5367ff', data: [22, 31, 28, 19] }]
    },
    body: [
      p('Every week brings a fresh list of large-caps with "strong buy" recommendations and double-digit upside. The ratings are not useless — but they are not forecasts you should trade on blindly either. Roughly half of one-year price targets miss the actual outcome by more than 10%.'),
      chartHere,
      h2('What a rating really tells you'),
      p('A sell-side rating aggregates the views of analysts who cover the stock full-time. That is genuinely valuable information about sentiment and the earnings narrative. What it is not is a promise. Targets are anchored to a 12-month horizon and assume the analyst\'s earnings model is correct — a big assumption.'),
      h2('Three filters before you act'),
      ul(
        'Look at the spread of targets, not just the average. A tight cluster signals conviction; a wide range signals genuine disagreement.',
        'Check whether upside comes from earnings growth or multiple re-rating. Earnings-driven upside is more durable.',
        'Read the risks section, not the headline. The best research is honest about what breaks the thesis.'
      ),
      q('Use analyst ratings as a starting shortlist, never as the final decision. The number is a hypothesis, not a guarantee.'),
      h2('The practical takeaway'),
      p('Treat consensus as one input among several. Pair it with your own read on valuation, balance-sheet strength, and whether you would be comfortable holding the stock if the market closed for three years. If the answer is no, the rating does not matter.')
    ]
  },
  {
    slug: 'weekly-market-outlook-framework',
    cat: 'markets',
    title: 'A simple weekly framework for making sense of market noise',
    excerpt: 'Markets throw a hundred data points at you every week. Here is a four-lens checklist that filters signal from noise in ten minutes.',
    author: 'FinGarage Research Desk',
    date: '2026-07-02',
    read: 5,
    chart: {
      type: 'donut', caption: 'What actually moves 1-year equity returns (attribution)',
      series: [
        { name: 'Earnings growth', color: '#00d09c', value: 46 },
        { name: 'Valuation change', color: '#5367ff', value: 30 },
        { name: 'Dividends', color: '#f5a623', value: 14 },
        { name: 'Currency & other', color: '#eb5b3c', value: 10 }
      ]
    },
    body: [
      p('The financial press is engineered to feel urgent. Most of it will not matter to a portfolio held for five years. A short weekly routine keeps you informed without being jerked around by every headline.'),
      h2('The four lenses'),
      ul(
        'Earnings: are companies actually making more money? This drives the largest share of long-run returns.',
        'Valuation: are you paying more or less per rupee of those earnings than usual?',
        'Liquidity: what are interest rates and central-bank policy doing to the cost of money?',
        'Sentiment: is the crowd greedy or fearful? Extreme readings often mark turning points.'
      ),
      chartHere,
      p('Notice that three of the four lenses — earnings, valuation, dividends — are fundamentals. Only sentiment is about mood. Yet the news cycle spends most of its energy on mood, because mood generates clicks.'),
      q('If a headline does not change your view on earnings, valuation, or interest rates, it is entertainment, not information.'),
      h2('Ten minutes, once a week'),
      p('Scan for those four things, write one sentence on each, and move on. This single habit will do more for your returns than reading forty articles a day, because it forces you to distinguish what is durable from what is merely loud.')
    ]
  },
  {
    slug: 'volatility-is-normal-staying-invested',
    cat: 'markets',
    title: 'Corrections are the price of admission, not a system failure',
    excerpt: 'A 10–15% drawdown happens in most years — even great ones. The data on why staying invested beats trying to sidestep dips.',
    author: 'FinGarage Research Desk',
    date: '2026-06-28',
    read: 6,
    chart: {
      type: 'bar', caption: 'Intra-year drop vs full-year return, Nifty 50 (illustrative)',
      x: ['2019', '2020', '2021', '2022', '2023', '2024', '2025'],
      series: [
        { name: 'Worst intra-year drop', color: '#eb5b3c', data: [-9, -38, -12, -17, -11, -8, -14] },
        { name: 'Calendar-year return', color: '#00d09c', data: [12, 15, 24, 4, 20, 9, 11] }
      ]
    },
    body: [
      p('Investors treat every drawdown as evidence that something has gone wrong. History says the opposite: temporary declines are a permanent feature of equity investing. Even years that finished strongly positive contained a scary drop somewhere in the middle.'),
      chartHere,
      p('Look at the pattern. In most years the market fell 10% or more at some point, yet still closed up. The investors who did best were not the ones who dodged the dip — they were the ones who did nothing during it.'),
      h2('Why "waiting for clarity" costs you'),
      p('Markets recover before the news improves. By the time it "feels safe" to re-enter, the sharpest recovery days have usually already happened — and missing just a handful of the best days each year devastates long-run returns, because the best days cluster right next to the worst ones.'),
      q('You cannot capture the recovery if you are not in your seat when it arrives. Time in the market beats timing the market.'),
      h2('What to actually do in a correction'),
      ul(
        'Keep your SIPs running — you are now buying the same funds cheaper.',
        'Rebalance if the drop has pushed your allocation off target.',
        'Revisit your emergency fund so you are never forced to sell equities at the bottom.'
      ),
      p('Volatility is the fee you pay for equity-like returns. Investors who understand that stop trying to avoid the fee and start using it.')
    ]
  },

  /* ------------------------------------------------------------- PERSONAL FIN */
  {
    slug: 'epf-withdrawal-rules-2026',
    cat: 'wealth',
    title: 'EPF withdrawal rules: when you can dip in, and when you shouldn\'t',
    excerpt: 'The EPF allows partial withdrawals for specific life events — but each one quietly resets your retirement compounding. A complete guide.',
    author: 'FinGarage Advisory',
    date: '2026-07-06',
    read: 8,
    chart: {
      type: 'bar', caption: 'Cost of a Rs 3 lakh EPF withdrawal at age 35 (foregone corpus at 58)',
      x: ['Amount withdrawn', 'Value if left invested'],
      series: [{ name: 'Rupees (lakh)', color: '#5367ff', data: [3, 18.4] }]
    },
    body: [
      p('The Employees\' Provident Fund is designed as a retirement vehicle, but the rules do permit partial withdrawals for defined situations. Knowing the conditions helps you access money when you genuinely need it — and, just as importantly, understand what it costs when you do.'),
      h2('The main conditions for partial withdrawal'),
      ul(
        'Medical treatment — for self or family, generally without a minimum service period',
        'Marriage — of self, children, or siblings, after seven years of service',
        'Higher education — for self or children, after seven years of service',
        'Home purchase or construction — after a minimum service period, with limits linked to your contributions',
        'Home loan repayment — permitted under specific tenure and balance conditions',
        'One year before retirement — up to a large share of the balance'
      ),
      h2('The hidden cost of an early withdrawal'),
      p('EPF compounds tax-free at a competitive rate. Pulling out even a modest sum in your thirties removes not just that amount but every rupee it would have earned over the next two decades. A Rs 3 lakh withdrawal at 35 can mean giving up well over Rs 18 lakh by 58.'),
      chartHere,
      q('Treat EPF withdrawals like withdrawing from your future self. The money is available — but it is the most expensive money in your financial life.'),
      h2('A better order of operations'),
      p('Before touching EPF, exhaust cheaper options: your emergency fund first, then a short-term goal fund, and only then long-term retirement savings. If a withdrawal is genuinely unavoidable — a medical emergency, for instance — take exactly what you need and no more, and restart your contributions immediately.'),
      p('EPF is one of the few genuinely tax-efficient, government-backed compounding engines most salaried Indians have access to. Guard it accordingly.')
    ]
  },
  {
    slug: 'gold-allocation-how-much',
    cat: 'wealth',
    title: 'Gold at record highs: how much should you actually hold?',
    excerpt: 'Gold has been on a tear, and everyone suddenly wants in. The disciplined answer to "how much gold?" has almost nothing to do with the price.',
    author: 'FinGarage Advisory',
    date: '2026-07-07',
    read: 6,
    chart: {
      type: 'donut', caption: 'A balanced long-term allocation (illustrative)',
      series: [
        { name: 'Equity', color: '#00d09c', value: 60 },
        { name: 'Debt / fixed income', color: '#5367ff', value: 25 },
        { name: 'Gold', color: '#f5a623', value: 10 },
        { name: 'Cash / liquid', color: '#888899', value: 5 }
      ]
    },
    body: [
      p('When gold makes new highs, interest spikes — which is precisely the wrong time to decide your allocation. Gold\'s role in a portfolio is not to chase returns; it is to behave differently from equities when they struggle. That diversification value does not change because the price went up.'),
      h2('Why hold gold at all'),
      p('Gold tends to hold or gain value during equity stress, currency weakness, and inflation shocks. It is not a growth asset over the long run — equities beat it comfortably — but it is a shock absorber. A portfolio with a slice of gold falls less in bad years, which helps investors stay the course.'),
      chartHere,
      h2('How much is enough'),
      p('For most investors, 5–10% of the portfolio is the sweet spot. Below that, it barely moves the needle. Above 15–20%, you are making a concentrated bet on one asset and dragging down long-run returns. The exact number depends on your risk appetite and how much other inflation protection you already hold.'),
      q('Gold is portfolio insurance, not a lottery ticket. You size insurance to the risk, not to how exciting it feels this month.'),
      h2('The cleanest way to own it'),
      ul(
        'Sovereign Gold Bonds — earn interest on top of the gold price and carry no storage cost or making charges',
        'Gold ETFs or gold funds — liquid, low-cost, and easy to rebalance',
        'Physical gold — fine for consumption, weak as an investment once you count making charges and purity risk'
      ),
      p('Set your gold target once, rebalance to it annually, and stop watching the daily rate. The allocation is the strategy; the price is just noise around it.')
    ]
  },
  {
    slug: 'emergency-fund-how-big',
    cat: 'wealth',
    title: 'The emergency fund is boring — and it is the highest-return money you own',
    excerpt: 'No fund manager will ever pitch you a savings buffer. Yet it is the single decision that determines whether your whole plan survives a bad month.',
    author: 'FinGarage Advisory',
    date: '2026-06-30',
    read: 5,
    chart: {
      type: 'bar', caption: 'Recommended emergency fund by situation (months of expenses)',
      x: ['Dual income, stable', 'Single income', 'Self-employed', 'Sole earner + dependents'],
      series: [{ name: 'Months', color: '#00d09c', data: [4, 6, 9, 12] }]
    },
    body: [
      p('The emergency fund earns a modest return and never makes for exciting conversation. But it is the load-bearing wall of a financial plan. Without it, a single job loss or medical bill forces you to sell investments at the worst time or take on high-cost debt — the two most expensive mistakes in personal finance.'),
      h2('How much to keep'),
      p('The right size depends on how stable and how diversified your income is. A dual-income household with secure jobs needs less; a sole earner with dependents needs far more.'),
      chartHere,
      q('The emergency fund\'s job is not to grow. Its job is to make sure you never have to touch the assets that do.'),
      h2('Where to park it'),
      ul(
        'A sweep-in savings account or a liquid mutual fund for instant access',
        'Avoid locking it in long-term FDs, equity, or anything with exit penalties',
        'Split it: one month in savings for instant needs, the rest in a liquid fund'
      ),
      h2('Rebuild it before you invest again'),
      p('If you ever draw the fund down, treat replenishing it as your top financial priority — above fresh investing. The buffer is what lets you keep your SIPs running through the next downturn instead of stopping them at exactly the wrong moment.')
    ]
  },
  {
    slug: 'salary-hike-lifestyle-inflation',
    cat: 'wealth',
    title: 'Got a raise? The 50% rule that turns it into wealth instead of a bigger lifestyle',
    excerpt: 'Lifestyle inflation quietly eats every pay rise. One simple rule captures the upside of a bigger salary without feeling like deprivation.',
    author: 'FinGarage Advisory',
    date: '2026-06-26',
    read: 5,
    chart: {
      type: 'line', caption: 'Two people, same raises: saver vs spender (net worth over 15 years)',
      x: ['Yr 0', 'Yr 3', 'Yr 6', 'Yr 9', 'Yr 12', 'Yr 15'],
      series: [
        { name: 'Saves 50% of raises', color: '#00d09c', data: [0, 9, 24, 47, 82, 134] },
        { name: 'Spends every raise', color: '#eb5b3c', data: [0, 4, 9, 15, 22, 31] }
      ]
    },
    body: [
      p('Most people\'s expenses rise to meet their income. A raise arrives, and within a few months a nicer car, a bigger flat, or pricier habits have absorbed all of it. Net worth barely moves. This is lifestyle inflation, and it is the main reason high earners can still feel broke.'),
      h2('The 50% rule'),
      p('Every time your take-home pay rises, direct half of the increase straight to savings and investments before it hits your spending account. You still enjoy the other half — so it never feels like sacrifice — but you permanently capture a chunk of every raise.'),
      chartHere,
      p('The gap between the two paths above comes entirely from what happened to the raises. Same salary, same jobs — wildly different outcomes, driven by one automated decision.'),
      q('You do not have to save more of what you earn today. You just have to save half of what you earn tomorrow.'),
      h2('Make it automatic'),
      ul(
        'Increase your SIP amount the same month your salary revision lands',
        'Use a step-up SIP that raises your contribution automatically each year',
        'Route the increase before you see it, so it never becomes spendable'
      ),
      p('Automation beats willpower every time. Set the rule once and let each raise quietly build the future instead of the lifestyle.')
    ]
  },
  {
    slug: 'tax-planning-old-vs-new-regime',
    cat: 'wealth',
    title: 'Old regime vs new regime: a decision tree, not a debate',
    excerpt: 'The "which tax regime" question has a clean answer once you know your deductions. Here is the framework in one screen.',
    author: 'FinGarage Advisory',
    date: '2026-06-22',
    read: 7,
    chart: {
      type: 'line', caption: 'Break-even: total deductions needed for old regime to win (by income)',
      x: ['7L', '10L', '12L', '15L', '20L', '25L'],
      series: [
        { name: 'Deductions needed (Rs lakh)', color: '#5367ff', data: [1.5, 2.5, 3.1, 3.75, 4.25, 4.5] }
      ]
    },
    body: [
      p('The old versus new tax regime argument gets far more airtime than it deserves. It is not a philosophical choice — it is arithmetic. Whichever regime leaves more money in your pocket for your specific numbers is the right one.'),
      h2('The core trade-off'),
      p('The new regime offers lower slab rates but strips away most deductions. The old regime keeps higher rates but lets you subtract investments, insurance premiums, home-loan interest, and more. So the old regime only wins if your deductions are large enough to overcome the rate gap.'),
      chartHere,
      p('The line above shows roughly how much in total deductions you need to claim for the old regime to come out ahead at each income level. Fall short of that line, and the new regime wins.'),
      h2('A simple decision path'),
      ul(
        'Add up your realistic deductions: EPF, insurance, ELSS, home-loan interest, and eligible expenses',
        'Compare that total to the break-even for your income band',
        'Above the line — old regime; below it — new regime'
      ),
      q('Do not distort your investment choices just to justify a tax regime. Pick good investments first; let the regime follow the math.'),
      h2('One common trap'),
      p('People buy insurance and lock money into sub-par tax-saving products purely to "beat" the new regime — then discover the products underperform for years. Never let the tax tail wag the investment dog. Run the numbers both ways each year, because a salary change or a home-loan closure can flip the answer.')
    ]
  },

  /* ----------------------------------------------------------------- FUNDS */
  {
    slug: 'international-funds-diversification',
    cat: 'funds',
    title: 'International funds returned 37% — should you chase or wait?',
    excerpt: 'A blockbuster year in global funds has investors piling in. The case for owning them is real; the case for chasing last year\'s number is not.',
    author: 'FinGarage Research Desk',
    date: '2026-07-03',
    read: 7,
    chart: {
      type: 'bar', caption: 'Why own international equity — rolling return leadership flips often',
      x: ['2020', '2021', '2022', '2023', '2024', '2025'],
      series: [
        { name: 'India equity', color: '#00d09c', data: [15, 24, 4, 20, 9, 11] },
        { name: 'Global equity', color: '#5367ff', data: [16, 21, -18, 24, 20, 37] }
      ]
    },
    body: [
      p('International funds have had a spectacular run, and money is flowing in fast. Before you follow it, separate two very different questions: should you own global equity at all, and should you buy it because it just returned 37%?'),
      h2('The genuine case for global exposure'),
      p('Owning only Indian equity means your entire financial future rides on one economy and one currency. International funds give you a stake in companies and themes — global technology, healthcare, consumer brands — that simply are not available on domestic exchanges. And leadership rotates: the market that wins one year often lags the next.'),
      chartHere,
      p('Notice how the bars trade places. That rotation is exactly why diversification works — you are not trying to pick the winner, you are refusing to bet everything on one horse.'),
      q('Own international equity for the diversification, not for last year\'s return. The 37% is the reason to be cautious about timing, not the reason to pile in.'),
      h2('How to add it sensibly'),
      ul(
        'Cap global exposure at a sensible slice — often 10–20% of your equity',
        'Add via SIP rather than a lump sum after a huge run-up',
        'Mind the tax treatment and any limits on overseas investing that apply to your fund',
        'Prefer broad, low-cost index exposure over narrow thematic bets'
      ),
      p('The investor who set a 15% global allocation three years ago and rebalanced is now trimming winners. The investor chasing 37% today is buying high. Same asset, opposite discipline.')
    ]
  },
  {
    slug: 'sip-5000-to-crore-math',
    cat: 'funds',
    title: 'The real math behind "Rs 5,000/month becomes Rs 1 crore"',
    excerpt: 'The headline is true — with two big asterisks the marketing never mentions: time and consistency. Here is the honest version.',
    author: 'FinGarage Advisory',
    date: '2026-07-01',
    read: 6,
    chart: {
      type: 'line', caption: 'Rs 5,000/month SIP at 12% — the crore comes from time, not luck',
      x: ['Yr 5', 'Yr 10', 'Yr 15', 'Yr 20', 'Yr 25', 'Yr 30'],
      series: [
        { name: 'Corpus (Rs lakh)', color: '#8b5cf6', data: [4.1, 11.6, 25, 50, 95, 176] },
        { name: 'You invested (Rs lakh)', color: '#888899', data: [3, 6, 9, 12, 15, 18] }
      ]
    },
    body: [
      p('You have seen the promise everywhere: a small monthly SIP grows into a crore. It is not a scam — the math genuinely works. But the headline hides where the magic actually comes from, and it is not the monthly amount.'),
      chartHere,
      p('Look at the two lines. The grey line — what you actually put in — grows in a straight, gentle slope. The purple line — what it becomes — curves upward and then explodes. That gap is compounding, and it does almost all of its work in the final years.'),
      h2('The two asterisks'),
      ul(
        'Time: most of the corpus is built in the last third of the journey. Cut the timeline short and you cut off the best part.',
        'Consistency: pausing SIPs during downturns — exactly when units are cheapest — is what breaks the math for most people.'
      ),
      q('The first ten years feel slow and unrewarding. That is not a sign it is failing. That is the setup for the years that matter.'),
      h2('How to actually get there'),
      p('Start as early as you can, automate the SIP so it survives your moods, and use a step-up so the contribution rises with your income. Do not interrupt it when markets fall. The investor who does nothing dramatic — just keeps going — is the one who reaches the number.'),
      p('A word on the 12% assumption: it is a reasonable long-run expectation for diversified equity, not a guarantee. Some years will be far higher, some negative. The average is what compounds — but only if you stay in your seat to collect it.')
    ]
  },
  {
    slug: 'direct-vs-regular-plans',
    cat: 'funds',
    title: 'Direct vs regular mutual fund plans: the 1% that becomes lakhs',
    excerpt: 'Direct and regular plans hold identical portfolios. The only difference is a commission — and over decades that small gap compounds into a fortune.',
    author: 'FinGarage Advisory',
    date: '2026-06-24',
    read: 5,
    chart: {
      type: 'line', caption: 'Same fund, direct vs regular — the gap over 25 years (Rs 10k/month SIP)',
      x: ['Yr 5', 'Yr 10', 'Yr 15', 'Yr 20', 'Yr 25'],
      series: [
        { name: 'Direct plan', color: '#00d09c', data: [8.2, 23.2, 50, 100, 190] },
        { name: 'Regular plan', color: '#eb5b3c', data: [8, 22, 46, 89, 163] }
      ]
    },
    body: [
      p('A direct plan and a regular plan of the same mutual fund own exactly the same stocks, run by exactly the same manager. The only difference is that the regular plan pays a distributor commission out of your returns every single year. That commission looks tiny — often around 1% — but it compounds against you.'),
      chartHere,
      p('The two lines start almost on top of each other and drift apart relentlessly. By year 25 the gap is enormous — not because the direct plan is smarter, but because you stopped leaking a fee every year.'),
      h2('When regular plans still make sense'),
      p('If a genuine adviser is actively helping you build and stick to a plan, the commission may be fair payment for advice that keeps you invested. The problem is paying a recurring distribution fee forever for a one-time recommendation you could have made yourself.'),
      q('A 1% annual fee is not 1% of your money. Over an investing lifetime it can be a quarter of your final corpus.'),
      h2('How to switch'),
      ul(
        'Open direct plans through the fund house or a direct platform',
        'Move new SIPs to direct first; migrate existing units mindful of exit loads and capital-gains tax',
        'If you value advice, pay a transparent flat or fee-only adviser instead of a perpetual commission'
      ),
      p('The choice is not "advice or no advice." It is "pay once for advice, or pay forever for a form-filling." Choose deliberately.')
    ]
  },
  {
    slug: 'index-vs-active-funds',
    cat: 'funds',
    title: 'Index or active? What the long-run scorecard actually says',
    excerpt: 'Most active large-cap funds fail to beat their index over a decade. That single fact should shape the core of most portfolios.',
    author: 'FinGarage Research Desk',
    date: '2026-06-20',
    read: 6,
    chart: {
      type: 'donut', caption: 'Share of active large-cap funds beating their benchmark (10-yr, illustrative)',
      series: [
        { name: 'Beat the index', color: '#00d09c', value: 28 },
        { name: 'Lagged the index', color: '#eb5b3c', value: 72 }
      ]
    },
    body: [
      p('The active-versus-passive debate is often emotional. The evidence is not. Over long periods, the majority of actively managed large-cap funds fail to beat a simple, cheap index fund — mostly because their higher fees are a hurdle they must clear every year just to break even.'),
      chartHere,
      h2('Why the index is so hard to beat'),
      p('An index fund owns the whole market at rock-bottom cost. To beat it, an active manager must be skilled enough to overcome their fee and still add value — consistently, for years. A few do. Identifying them in advance is the hard part, because past outperformance is a weak predictor of future outperformance.'),
      h2('A sensible structure'),
      ul(
        'Build the core of your equity with low-cost index funds — broad, cheap, and reliable',
        'Add active funds only where the odds are better, such as certain mid- and small-cap or thematic segments, and only managers you have researched',
        'Keep total costs low; fees are the one variable you fully control'
      ),
      q('You cannot control returns. You can control fees. Start with the variable you own.'),
      h2('The mindset shift'),
      p('Choosing index funds is not settling for average — it is quietly beating most professionals by refusing to pay for the attempt. For most investors, a cheap index core plus a small, deliberate active sleeve is the pragmatic, evidence-based structure.')
    ]
  },

  /* -------------------------------------------------------------- INSURANCE */
  {
    slug: 'health-insurance-mistakes',
    cat: 'insurance',
    title: '7 health insurance mistakes Indian families make',
    excerpt: 'Health cover is the one product where a small mistake surfaces at the worst possible moment — during a hospitalisation. Here are the seven to avoid.',
    author: 'FinGarage Advisory',
    date: '2026-07-06',
    read: 8,
    chart: {
      type: 'bar', caption: 'Rising cost of a typical hospitalisation (illustrative index, 2018 = 100)',
      x: ['2018', '2020', '2022', '2024', '2026'],
      series: [{ name: 'Medical cost index', color: '#eb5b3c', data: [100, 118, 141, 168, 201] }]
    },
    body: [
      p('Health insurance is deceptively simple to buy and dangerously easy to get wrong. The mistakes rarely show up when you sign — they show up years later at a hospital billing desk. Medical inflation runs well above general inflation, which magnifies every error over time.'),
      chartHere,
      h2('The seven mistakes'),
      ul(
        'Buying too little cover. A sum insured that felt generous five years ago may not cover one serious hospitalisation today.',
        'Relying only on employer cover. It vanishes the day you leave, resign, or retire — often exactly when you need it most.',
        'Ignoring room-rent and co-pay clauses. These caps can quietly slash a claim even when the policy "covers" the treatment.',
        'Not checking waiting periods for pre-existing conditions before you need them.',
        'Hiding medical history at purchase. Non-disclosure is the fastest way to have a claim rejected.',
        'Choosing on price alone. The cheapest premium often hides the harshest sub-limits.',
        'Never increasing cover. Your sum insured should rise with medical inflation and family size.'
      ),
      q('You do not buy health insurance for the premium. You buy it for the one claim that would otherwise wipe out a decade of savings.'),
      h2('Getting it right'),
      p('Buy an independent family floater early, keep it separate from employer cover, and add a super top-up to lift your total protection cheaply. Read the room-rent, co-pay, and sub-limit clauses before you buy, disclose your history honestly, and review the sum insured every few years against rising costs. Cover bought while you are healthy is both cheaper and cleaner than cover bought in a panic.')
    ]
  },
  {
    slug: 'term-insurance-how-much-cover',
    cat: 'insurance',
    title: 'Term insurance: how much cover, and why the round number is usually wrong',
    excerpt: 'Most people pick a cover amount that sounds big rather than one that actually replaces their income. Here is how to size it properly.',
    author: 'FinGarage Advisory',
    date: '2026-06-29',
    read: 6,
    chart: {
      type: 'bar', caption: 'Sizing term cover — the components of a proper number',
      x: ['Income replacement', 'Outstanding loans', 'Children goals', 'Existing assets (minus)'],
      series: [{ name: 'Rs lakh', color: '#eb5b3c', data: [120, 45, 40, -55] }]
    },
    body: [
      p('Ask most people how much life cover they have and you will hear a round number — one crore, fifty lakh — chosen because it sounds substantial. But the right cover is not about sounding big. It is about replacing everything your family depends on you for if you are gone.'),
      h2('The proper way to size it'),
      p('Add up what your family would need, then subtract what they already have.'),
      chartHere,
      ul(
        'Income replacement: enough to generate your family\'s living expenses for the years they would need it',
        'Liabilities: every outstanding loan — home, personal, car — so no debt lands on your family',
        'Future goals: children\'s education and other commitments you would have funded',
        'Minus existing assets: savings and investments already earmarked for the family'
      ),
      q('Term cover is not a savings product. It is a promise that your family\'s life does not financially collapse without you.'),
      h2('Keep it pure and cheap'),
      p('Buy plain term insurance — no investment component, no return-of-premium gimmick. Those add-ons dramatically raise the premium and dilute the protection. Pure term gives you the largest cover for the smallest cost, which is the entire point. Lock it in young, when premiums are lowest, and keep it running to your planned retirement age.')
    ]
  },
  {
    slug: 'super-top-up-health-cover',
    cat: 'insurance',
    title: 'The super top-up: how to double your health cover for a fraction of the cost',
    excerpt: 'One of the most under-used tools in Indian insurance lets you multiply your protection cheaply. Here is how the deductible mechanism works.',
    author: 'FinGarage Advisory',
    date: '2026-06-25',
    read: 5,
    chart: {
      type: 'bar', caption: 'Cost to reach Rs 25 lakh cover: base policy alone vs base + super top-up',
      x: ['Rs 25L base only', 'Rs 5L base + Rs 20L top-up'],
      series: [{ name: 'Annual premium (Rs)', color: '#00d09c', data: [28000, 16000] }]
    },
    body: [
      p('Big health cover sounds expensive — but there is a structural trick that makes it far cheaper. A super top-up policy sits on top of a base policy and only pays once your total claims in a year cross a chosen threshold, called the deductible.'),
      h2('How it works'),
      p('Say you hold a base policy of Rs 5 lakh and add a super top-up of Rs 20 lakh with a Rs 5 lakh deductible. Your base handles small claims. For a large hospitalisation, the base pays the first Rs 5 lakh and the top-up covers the rest — giving you Rs 25 lakh of effective protection for dramatically less than a Rs 25 lakh base policy would cost.'),
      chartHere,
      p('The saving is real because the insurer rarely has to pay the top-up — most years, claims never cross the deductible. You pay a low premium for protection against the rare, catastrophic bill, which is exactly what insurance should do.'),
      q('Insure heavily against what would ruin you, lightly against what would merely annoy you. The super top-up does exactly that.'),
      h2('Getting the structure right'),
      ul(
        'Match the deductible to your base cover so there is no gap in between',
        'Prefer a super top-up (which counts total yearly claims) over a plain top-up (which counts each claim separately)',
        'Buy it while healthy to avoid fresh waiting periods on pre-existing conditions'
      ),
      p('For a modest extra premium, a super top-up turns a mid-sized policy into serious protection. It is one of the highest-value moves available to a healthy family.')
    ]
  },

  /* ------------------------------------------------------------- LOANS/CREDIT */
  {
    slug: 'hidden-loan-charges',
    cat: 'loans',
    title: 'Hidden loan charges that cost more than the interest rate',
    excerpt: 'Borrowers obsess over the interest rate and ignore the fees. Yet processing charges, prepayment penalties and MOD charges can dwarf a small rate difference.',
    author: 'FinGarage Advisory',
    date: '2026-07-05',
    read: 7,
    chart: {
      type: 'bar', caption: 'Two loans, "same" rate — the true cost after fees (Rs 30L, illustrative)',
      x: ['Advertised rate', 'Processing fee', 'Prepay penalty', 'Insurance bundling'],
      series: [{ name: 'Extra cost (Rs 000s)', color: '#f5a623', data: [0, 45, 60, 90] }]
    },
    body: [
      p('When people shop for a loan, they compare interest rates down to the second decimal and treat everything else as fine print. Lenders know this. That is why some of the most profitable charges live in the fine print — and they can easily exceed what a slightly higher rate would have cost.'),
      chartHere,
      h2('The charges that actually matter'),
      ul(
        'Processing fee: a percentage of the loan taken upfront, often negotiable but rarely negotiated',
        'Prepayment / foreclosure penalty: a charge for paying early — brutal on fixed-rate and personal loans',
        'MOD and legal charges: memorandum of deposit and documentation costs on secured loans',
        'Bundled insurance: single-premium cover added to the loan and financed at loan interest for years',
        'Conversion / switch fees: charged to move to a lower rate the lender could have given you anyway'
      ),
      q('Never compare loans on the advertised rate alone. Compare the total you actually repay, fees included. That is the only honest number.'),
      h2('How to protect yourself'),
      p('Ask every lender for the full schedule of charges in writing and compute the effective cost including fees. Negotiate the processing fee — it is more flexible than lenders admit. Refuse bundled insurance you did not ask for; buy protection separately if you need it. And favour floating-rate loans with no foreclosure penalty so you keep the freedom to prepay or refinance later.'),
      p('A loan is a multi-year relationship. The rate is the headline; the fees are where the relationship quietly costs you.')
    ]
  },
  {
    slug: 'credit-score-improve-fast',
    cat: 'loans',
    title: 'How your credit score is actually calculated — and the fastest ways to lift it',
    excerpt: 'Your credit score decides the rate you are offered on every future loan. A few specific habits move it more than anything else.',
    author: 'FinGarage Advisory',
    date: '2026-07-02',
    read: 6,
    chart: {
      type: 'donut', caption: 'What drives a credit score (approximate weighting)',
      series: [
        { name: 'Payment history', color: '#f5a623', value: 35 },
        { name: 'Credit utilisation', color: '#00d09c', value: 30 },
        { name: 'Age of credit', color: '#5367ff', value: 15 },
        { name: 'Credit mix', color: '#8b5cf6', value: 10 },
        { name: 'New enquiries', color: '#eb5b3c', value: 10 }
      ]
    },
    body: [
      p('Your credit score is not a mysterious grade handed down by a bank. It is a fairly mechanical calculation, and once you know what feeds it, improving it stops being guesswork.'),
      chartHere,
      h2('The two levers that matter most'),
      p('Payment history and credit utilisation together drive around two-thirds of your score. That is where to focus.'),
      ul(
        'Never miss a due date. A single late payment can dent your score more than months of good behaviour built it up.',
        'Keep utilisation low. Using a small share of your available credit limit signals control; running your cards near their limit signals stress.'
      ),
      h2('The faster wins'),
      p('Beyond paying on time, a few moves lift the score quicker than most people expect: request higher limits (which lowers utilisation without spending more), keep old cards open to preserve the age of your credit, and space out loan applications so you are not stacking hard enquiries.'),
      q('You do not raise a credit score by borrowing more. You raise it by proving you can handle credit responsibly and predictably.'),
      h2('The long game'),
      p('There is no overnight fix — the score rewards consistency over time. But the direction is fully in your control. Automate your payments, hold utilisation low, check your report yearly for errors, and the number climbs. A higher score is not vanity; it is a lower interest rate on every loan you take for the rest of your life.')
    ]
  },
  {
    slug: 'home-loan-prepayment-strategy',
    cat: 'loans',
    title: 'Home loan prepayment: pay extra early, or invest the difference?',
    excerpt: 'The classic dilemma has a clear answer once you stop comparing rates and start comparing what each rupee does over time.',
    author: 'FinGarage Advisory',
    date: '2026-06-27',
    read: 7,
    chart: {
      type: 'bar', caption: 'One extra EMI per year — interest saved and tenure cut (Rs 50L, 20-yr)',
      x: ['Interest saved (Rs lakh)', 'Years shaved off'],
      series: [{ name: 'Impact', color: '#f5a623', data: [11, 4] }]
    },
    body: [
      p('Should you throw spare money at your home loan or invest it instead? The internet argues about this endlessly, usually by comparing the loan rate to an assumed equity return. That comparison is real but incomplete — it ignores certainty, taxes, and psychology.'),
      h2('The power of early prepayment'),
      p('Home loans are front-loaded: in the early years, most of your EMI is interest. Prepaying then removes principal that would otherwise have accrued interest for the full remaining tenure. Even one extra EMI a year, done consistently, can save lakhs and cut years off the loan.'),
      chartHere,
      h2('The case for investing instead'),
      p('If your after-tax loan rate is modest and you can genuinely earn more in diversified equity over the long run, investing the surplus can build more wealth. The key words are "long run" and "genuinely" — this only works if you actually stay invested through downturns rather than bailing out.'),
      q('Prepaying is a guaranteed, tax-free return equal to your loan rate. Investing is a probable, higher return with risk. Match the choice to your temperament, not just a spreadsheet.'),
      h2('A balanced answer'),
      ul(
        'Prepay aggressively in the early, interest-heavy years when the impact is largest',
        'Keep your emergency fund and insurance intact before prepaying anything',
        'Once the loan is small and late in its tenure, redirect surplus to investing',
        'If a guaranteed, debt-free outcome helps you sleep, that peace of mind has real value'
      ),
      p('There is no single right answer — but "prepay early, invest later" captures most of the benefit of both worlds.')
    ]
  },
  {
    slug: 'personal-loan-vs-credit-card-debt',
    cat: 'loans',
    title: 'Drowning in credit card debt? A personal loan can be the lifeboat',
    excerpt: 'Credit card interest is among the most expensive debt you can hold. Consolidating it into a personal loan often cuts the cost dramatically.',
    author: 'FinGarage Advisory',
    date: '2026-06-23',
    read: 5,
    chart: {
      type: 'bar', caption: 'Annual interest cost on Rs 3 lakh: credit card vs personal loan',
      x: ['Credit card (~40% p.a.)', 'Personal loan (~14% p.a.)'],
      series: [{ name: 'Interest per year (Rs)', color: '#eb5b3c', data: [120000, 42000] }]
    },
    body: [
      p('Credit card revolving debt is one of the most expensive forms of borrowing available to ordinary consumers. Carry a balance and the effective annual cost can run to around 40%. That is a wealth-destroying rate, and it compounds monthly.'),
      chartHere,
      p('The chart shows the gap plainly. On the same Rs 3 lakh balance, moving from card debt to a personal loan can cut your annual interest by more than half — money that goes back into clearing the principal instead of feeding the lender.'),
      h2('When consolidation makes sense'),
      ul(
        'You are carrying a revolving balance and only making minimum payments',
        'A personal loan is available to you at a materially lower rate than the card',
        'You will stop adding new card spending once the balance is moved'
      ),
      q('Consolidation only works if you also stop digging. A lower rate on a balance you keep growing is a slower disaster, not a solution.'),
      h2('Do it right'),
      p('Take a personal loan sized to clear the card fully, then treat the card as a payment tool you clear in full every month — not a borrowing line. Watch the personal loan\'s processing fee and prepayment terms, and if your cash flow improves, prepay the loan to shorten it. The goal is not to shuffle debt around; it is to escape the highest-cost debt first and then work your way out entirely.')
    ]
  },

  /* ------------------------------------------------------------------ FINTECH */
  {
    slug: 'india-fintech-champion',
    cat: 'tech',
    title: 'Why India hasn\'t built a world-class fintech champion yet',
    excerpt: 'India leads the world in digital payments volume — yet a globally dominant fintech giant remains elusive. The reasons are structural, not accidental.',
    author: 'FinGarage Research Desk',
    date: '2026-07-04',
    read: 8,
    chart: {
      type: 'line', caption: 'India digital payments volume (billions of transactions, illustrative)',
      x: ['2019', '2020', '2021', '2022', '2023', '2024', '2025'],
      series: [{ name: 'Transactions (bn)', color: '#0ea5e9', data: [12, 22, 38, 74, 118, 172, 231] }]
    },
    body: [
      p('By sheer volume, India runs one of the most advanced retail payment systems on earth. Real-time digital payments have become the default way hundreds of millions of people transact. And yet, a fintech company of genuinely global scale and profitability — the kind that dominates across borders — has not emerged. The gap between usage and value creation is the puzzle.'),
      chartHere,
      h2('The structural reasons'),
      ul(
        'Payments are near-free by design. A public digital rails system built for inclusion leaves little margin to monetise the transaction itself.',
        'Regulation is deliberately tight. Financial services are heavily supervised, which protects consumers but slows the move-fast playbook.',
        'Monetisation lives adjacent to payments — in lending, insurance distribution, and wealth — which are harder, slower, and more capital-intensive to scale.',
        'Trust and unit economics take years to build in credit, where a single bad cycle can erase a decade of growth.'
      ),
      q('India solved the payment problem so well that it removed the easiest way to make money from payments. Value now has to come from what sits on top of the rails.'),
      h2('Where the champion may actually come from'),
      p('The winner is unlikely to be a pure payments app. It is more likely a company that uses the payments footprint as a top-of-funnel and builds durable, well-underwritten businesses in credit, insurance, and investing on top of it. That is a slower, less glamorous path than a viral wallet — but it is where sustainable profit lives.'),
      p('For consumers, the current landscape is a gift: world-class, near-free payments and a competitive market for financial products. For builders, the lesson is that scale without a business model is a headline, not a company.')
    ]
  },
  {
    slug: 'upi-credit-line-explained',
    cat: 'tech',
    title: 'Credit on UPI: convenient, but understand what you are actually borrowing',
    excerpt: 'Linking a credit line to your everyday payments app is frictionless — which is exactly why it deserves a second look before you switch it on.',
    author: 'FinGarage Advisory',
    date: '2026-06-28',
    read: 5,
    chart: {
      type: 'donut', caption: 'How to think about credit-on-payments spending',
      series: [
        { name: 'Cleared in full monthly', color: '#00d09c', value: 70 },
        { name: 'Occasionally revolved', color: '#f5a623', value: 20 },
        { name: 'Frequently revolved', color: '#eb5b3c', value: 10 }
      ]
    },
    body: [
      p('Payment apps now let you tap a pre-approved credit line for everyday spending as easily as paying from your bank balance. The convenience is real. So is the risk: the easier borrowing becomes, the easier it is to borrow without noticing.'),
      h2('What it actually is'),
      p('A credit line on payments is still credit. It typically offers an interest-free window if you repay in full by the due date — but revolve the balance and you are into interest charges that resemble a credit card. The frictionless interface hides that you have taken a loan.'),
      chartHere,
      p('The healthy zone is the green slice: use the line for convenience and clear it in full every cycle. The moment you are regularly revolving the balance, the tool has stopped saving you money and started costing you.'),
      q('The danger of one-tap credit is not the interest rate. It is that borrowing stops feeling like borrowing.'),
      h2('Use it well'),
      ul(
        'Treat the credit line like a charge card: spend only what you can clear this month',
        'Set the repayment to autopay in full so you never accidentally revolve',
        'Watch how it reports to your credit bureau — missed dues hurt your score like any loan',
        'If you find yourself carrying a balance, pause the line and rebuild the habit'
      ),
      p('Used with discipline, credit-on-payments is a genuine convenience. Used on autopilot, it is a very smooth path into expensive debt. The technology is neutral; the habit is everything.')
    ]
  },
  {
    slug: 'account-aggregator-data-sharing',
    cat: 'tech',
    title: 'The Account Aggregator framework: your financial data, on your terms',
    excerpt: 'A quiet piece of infrastructure is changing how loans and advice get delivered in India. Here is what it does and why it matters to you.',
    author: 'FinGarage Research Desk',
    date: '2026-06-21',
    read: 6,
    chart: {
      type: 'bar', caption: 'Loan approval turnaround: traditional vs consent-based data sharing (illustrative)',
      x: ['Traditional (days)', 'With data sharing (days)'],
      series: [{ name: 'Days to approval', color: '#0ea5e9', data: [7, 1] }]
    },
    body: [
      p('One of the most consequential financial reforms in India is also one of the least visible: a consent-based framework that lets you securely share your own financial data — bank statements, investments, and more — with a lender or adviser you choose, without handing over passwords or paper.'),
      h2('How it changes things'),
      p('Traditionally, getting a loan meant printing statements, collecting documents, and waiting while a lender manually verified everything. With consent-based sharing, you approve a specific, time-bound data pull with a tap. The lender gets verified data instantly, and approvals that took a week can happen in a day.'),
      chartHere,
      h2('The part that protects you'),
      ul(
        'You control exactly what is shared, with whom, and for how long',
        'Consent is granular and revocable — you can withdraw access',
        'The aggregator moves data but cannot read or store your financial details',
        'No more sharing net-banking passwords with third-party apps'
      ),
      q('The shift is subtle but profound: your financial data starts working for you, with your explicit permission, instead of being locked in silos or handed over insecurely.'),
      h2('What it means practically'),
      p('For borrowers, faster and fairer credit decisions based on real cash-flow data rather than thin documentation. For anyone seeking advice, an adviser can see your full picture with your consent and give genuinely tailored guidance. The framework is plumbing — invisible when it works — but it is quietly making financial services faster, safer, and more personalised. When a lender offers this route, it is usually worth taking.')
    ]
  },

  /* ------------------------------------------------------------ EXTRA / MIXED */
  {
    slug: 'debt-funds-role-in-portfolio',
    cat: 'funds',
    title: 'Debt funds after the tax change: still worth holding? Yes — here\'s why',
    excerpt: 'The tax tweak removed the old advantage, and many investors wrote debt funds off entirely. That was an overreaction. Their real job never changed.',
    author: 'FinGarage Research Desk',
    date: '2026-06-18',
    read: 6,
    chart: {
      type: 'bar', caption: 'What each asset is actually for (typical role in a portfolio)',
      x: ['Equity', 'Debt funds', 'Gold', 'Cash'],
      series: [{ name: 'Volatility (relative)', color: '#8b5cf6', data: [90, 25, 55, 5] }]
    },
    body: [
      p('When the tax treatment of debt funds changed, a lot of investors concluded they were now pointless. That misreads what debt funds are for. They were never primarily a tax play — they are the stability layer of a portfolio, and that role is untouched.'),
      h2('Why you hold debt at all'),
      p('Equity builds wealth but swings hard. Debt funds barely move by comparison. Their job is to cushion the portfolio, hold money you may need in a few years, and give you dry powder to rebalance into equity when it falls.'),
      chartHere,
      p('Look at the relative volatility. Debt sits close to cash, far below equity. That calmness is the entire point — it is what lets you take equity risk elsewhere without losing sleep.'),
      q('You do not buy debt funds to get rich. You buy them so the rest of your portfolio can afford to try.'),
      h2('Using them well now'),
      ul(
        'Park money for goals that are one to four years away',
        'Hold your rebalancing reserve so you can buy equity dips without selling at a loss',
        'Match the fund\'s duration to your time horizon to limit interest-rate risk',
        'Compare post-tax returns honestly against FDs for your tax bracket'
      ),
      p('The tax edge is gone; the diversification and stability are not. For most portfolios, a debt allocation remains essential — not exciting, but essential.')
    ]
  },
  {
    slug: 'annuity-vs-swp-retirement-income',
    cat: 'insurance',
    title: 'Retirement income: annuity, SWP, or both?',
    excerpt: 'The choice between a guaranteed annuity and a flexible withdrawal plan shapes your entire retirement. The honest answer is usually a blend.',
    author: 'FinGarage Advisory',
    date: '2026-06-19',
    read: 7,
    chart: {
      type: 'donut', caption: 'A blended retirement income structure (illustrative)',
      series: [
        { name: 'Annuity (guaranteed floor)', color: '#eb5b3c', value: 40 },
        { name: 'SWP from equity/hybrid', color: '#00d09c', value: 45 },
        { name: 'Liquid buffer', color: '#5367ff', value: 15 }
      ]
    },
    body: [
      p('At retirement, the question shifts from "how do I grow money" to "how do I turn a corpus into a paycheque that lasts." Two tools dominate the conversation: an annuity, which pays a guaranteed income for life, and a systematic withdrawal plan (SWP), which draws a chosen amount from your investments.'),
      h2('The trade-off in one line'),
      p('An annuity gives certainty but little flexibility and no inflation punch. An SWP gives flexibility and growth potential but no guarantee — a bad market run early in retirement can hurt. Neither is complete on its own.'),
      chartHere,
      h2('Why a blend usually wins'),
      p('Use an annuity to cover your non-negotiable expenses — the floor you must have no matter what markets do. Use an SWP from a growth-oriented portfolio for everything above that floor, so your income can rise with inflation over a long retirement. Keep a liquid buffer so you never sell investments in a downturn.'),
      q('Guarantee your survival with an annuity; fund your lifestyle with an SWP. Certainty for the essentials, growth for the rest.'),
      h2('Getting the split right'),
      ul(
        'Size the annuity to your essential, must-pay bills',
        'Draw SWP at a sustainable rate so the corpus lasts three decades',
        'Hold one to two years of expenses in liquid assets as a shock absorber',
        'Revisit the mix every few years as health, spending, and markets change'
      ),
      p('There is no single product that solves retirement income. The durable answer is architecture — combining a guaranteed floor with a flexible, growing top-up.')
    ]
  },
  {
    slug: 'small-cap-caution-2026',
    cat: 'markets',
    title: 'Small-caps: the segment that rewards patience and punishes chasing',
    excerpt: 'Small-caps can multiply your money — or halve it fast. How to own them without letting them own your emotions.',
    author: 'FinGarage Research Desk',
    date: '2026-06-16',
    read: 6,
    chart: {
      type: 'bar', caption: 'Small-cap index — biggest drawdowns are brutal but temporary (illustrative)',
      x: ['2018', '2020', '2022', '2024', '2026'],
      series: [{ name: 'Worst drawdown %', color: '#eb5b3c', data: [-30, -42, -20, -15, -22] }]
    },
    body: [
      p('Small-cap stocks are where the biggest winners and the biggest heartbreaks both live. Over long horizons the segment has produced spectacular returns — but the path is violent, with drawdowns that regularly test investors\' resolve.'),
      chartHere,
      p('Notice the depth of the dips. A 40%-plus fall is not an anomaly in small-caps; it is a periodic feature. Investors who buy after a hot run and sell during one of these declines convert a great long-term asset into a personal loss.'),
      h2('How to own small-caps sanely'),
      ul(
        'Cap them at a modest slice of your equity so a bad year cannot derail your plan',
        'Enter through SIPs, never a lump sum after a euphoric rally',
        'Give the allocation a genuine five-to-seven-year runway',
        'Prefer diversified small-cap funds over concentrated single-stock bets'
      ),
      q('Small-caps reward the investor who can sit still through a 40% drawdown. If that is not you, size them so you can.'),
      h2('The temperament test'),
      p('Before adding small-caps, ask honestly whether you would keep your SIP running if the value halved for a year. If yes, a small, disciplined allocation can meaningfully lift long-run returns. If no, keep the exposure tiny — the segment amplifies both returns and behaviour mistakes.')
    ]
  },
  {
    slug: 'digital-gold-vs-sgb',
    cat: 'tech',
    title: 'Digital gold, gold ETFs, or sovereign bonds: which one actually wins?',
    excerpt: 'Apps make buying gold a two-tap affair. Convenient — but not all digital gold is created equal. A clear comparison.',
    author: 'FinGarage Advisory',
    date: '2026-06-15',
    read: 5,
    chart: {
      type: 'bar', caption: 'Cost drag over a long hold (relative, lower is better)',
      x: ['Sovereign Gold Bond', 'Gold ETF', 'Digital gold (app)'],
      series: [{ name: 'Relative cost drag', color: '#0ea5e9', data: [5, 25, 60] }]
    },
    body: [
      p('Payment and investing apps have made buying gold effortless — a couple of taps and you own a fraction of a gram. But the frictionless option is not always the cost-efficient one. Three digital routes to gold differ sharply in what they cost you over time.'),
      chartHere,
      h2('The three routes compared'),
      ul(
        'Sovereign Gold Bonds: track the gold price, pay you extra interest, have no storage cost, and are tax-friendly if held to maturity — the most efficient long-term option.',
        'Gold ETFs and funds: liquid, low-cost, easy to buy and sell on exchange or through an SIP — the flexible middle ground.',
        'App-based "digital gold": convenient for tiny amounts, but often carries spreads, storage fees, and GST that quietly erode returns over long holds.'
      ),
      q('For a long-term gold allocation, the least glamorous option — the sovereign bond — is usually the smartest. Convenience has a price, and in gold it compounds against you.'),
      h2('A simple rule of thumb'),
      p('If you are building a lasting gold allocation, lean on sovereign bonds, using ETFs where you need liquidity or the ability to rebalance. Reserve app-based digital gold for small, short-term buys where the convenience genuinely matters. As always, keep total gold to a sensible slice of the portfolio — the vehicle matters less than the allocation being right in the first place.')
    ]
  }
];

/* Expose for the pages */
if (typeof window !== 'undefined') {
  window.BLOG_POSTS = BLOG_POSTS;
  window.BLOG_CATEGORIES = BLOG_CATEGORIES;
  window.CAT_META = CAT_META;
}
