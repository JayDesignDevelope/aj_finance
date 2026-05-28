// ===== Register GSAP Plugins =====
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);



// ===== DOM Elements =====
const navbar = document.getElementById('navbar');
const mobileToggle = document.getElementById('mobileToggle');
const mobileMenu = document.getElementById('mobileMenu');
const navSearch = document.getElementById('navSearch');
const searchModal = document.getElementById('searchModal');
const searchOverlay = document.getElementById('searchOverlay');
const searchInput = document.getElementById('searchInput');
const backToTop = document.getElementById('backToTop');
// rotatingText removed — static heading used

// ===== GSAP Defaults =====
gsap.defaults({
    ease: 'power3.out',
    duration: 0.8
});

// ===== Navbar Scroll Effect =====
ScrollTrigger.create({
    start: 'top -10',
    onUpdate: (self) => {
        if (self.scroll() > 10) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        if (self.scroll() > 500) {
            gsap.to(backToTop, { opacity: 1, visibility: 'visible', y: 0, duration: 0.3 });
            backToTop.classList.add('visible');
        } else {
            gsap.to(backToTop, { opacity: 0, visibility: 'hidden', y: 10, duration: 0.3 });
            backToTop.classList.remove('visible');
        }
    }
});

// ===== Mobile Menu Toggle =====
mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
});

// ===== Search Modal =====
navSearch.addEventListener('click', () => {
    searchModal.classList.add('active');
    setTimeout(() => searchInput.focus(), 100);
});

searchOverlay.addEventListener('click', () => {
    searchModal.classList.remove('active');
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        searchModal.classList.remove('active');
    }
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchModal.classList.add('active');
        setTimeout(() => searchInput.focus(), 100);
    }
});

// ===== Back to Top =====
backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== Hero Section GSAP Animation =====
function animateHero() {
    const heroTl = gsap.timeline({ delay: 0.2 });

    heroTl
        .fromTo('.hero-badge',
            { opacity: 0, y: 20, scale: 0.9 },
            { opacity: 1, y: 0, scale: 1, duration: 0.6 }
        )
        .to('.hero-title', { opacity: 1, duration: 0.01 }, '-=0.2')
        .fromTo('.hero-word',
            { opacity: 0, y: 40, rotateX: 40 },
            {
                opacity: 1,
                y: 0,
                rotateX: 0,
                duration: 0.7,
                stagger: 0.1,
                ease: 'back.out(1.4)'
            },
            '-=0.2'
        )
        .to('.hero-highlight', {
            backgroundPosition: '200% center',
            duration: 1.5,
            ease: 'power1.inOut'
        }, '-=0.3')
        .fromTo('.hero-subtitle',
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6 },
            '-=1.0'
        )
        .fromTo('.hero-cta a',
            { opacity: 0, y: 20, scale: 0.9 },
            { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.12, ease: 'back.out(1.5)' },
            '-=0.4'
        )
        .fromTo('.hero-stats',
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6 },
            '-=0.3'
        )
        .fromTo('.hero-visual',
            { opacity: 0, x: 60, scale: 0.95 },
            { opacity: 1, x: 0, scale: 1, duration: 1, ease: 'power3.out' },
            '-=0.8'
        )
        .fromTo('.hiso-badge',
            { opacity: 0, scale: 0.7, y: 10 },
            { opacity: 1, scale: 1, y: 0, duration: 0.5, stagger: 0.18, ease: 'back.out(1.7)' },
            '-=0.4'
        );
}

// ============================================================
// ===== COUNTER ANIMATION — Attention-grabbing countup =====
// ============================================================
function animateCounter(el) {
    const target = Number.parseFloat(el.dataset.target);
    const decimals = Number.parseInt(el.dataset.decimals) || 0;
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const duration = 2;

    // Start: make text green to draw attention
    el.classList.add('counting');

    // Animate with GSAP
    const obj = { val: 0 };
    gsap.to(obj, {
        val: target,
        duration: duration,
        ease: 'power2.out',
        onUpdate: () => {
            el.textContent = prefix + obj.val.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + suffix;
        },
        onComplete: () => {
            el.textContent = prefix + target.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + suffix;
            el.classList.remove('counting');
            // Pop effect at the end
            el.classList.add('pop');
            setTimeout(() => el.classList.remove('pop'), 500);
        }
    });

    // Scale pulse while counting
    gsap.fromTo(el,
        { scale: 0.5, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' }
    );
}

// ===== Also animate the hero stat-numbers with GSAP =====
function animateHeroCounters() {
    document.querySelectorAll('.stat-number').forEach(counter => {
        const target = Number.parseInt(counter.dataset.target);
        const obj = { val: 0 };

        gsap.fromTo(counter,
            { scale: 0.6, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.4)' }
        );

        gsap.to(obj, {
            val: target,
            duration: 2,
            ease: 'power2.out',
            onUpdate: () => {
                counter.textContent = target >= 1000
                    ? Math.round(obj.val).toLocaleString()
                    : Math.round(obj.val);
            },
            onComplete: () => {
                counter.textContent = target >= 1000
                    ? target.toLocaleString()
                    : target;
                gsap.fromTo(counter,
                    { scale: 1 },
                    { scale: 1.15, duration: 0.2, yoyo: true, repeat: 1, ease: 'power2.inOut' }
                );
            }
        });
    });
}

// ===== Number bars fill animation =====
function animateNumberBars() {
    document.querySelectorAll('.number-bar-fill').forEach(bar => {
        const width = bar.dataset.width || 0;
        gsap.to(bar, {
            width: width + '%',
            duration: 1.5,
            ease: 'power2.out',
            delay: 0.5
        });
    });
}

// ============================================================
// ===== GSAP ScrollTrigger Animations =====
// ============================================================

// --- GSAP fade-in for .gsap-fade elements ---
function initGSAPScrollAnimations() {
    // Numbers section cards — staggered (buttery smooth reveal)
    gsap.utils.toArray('.numbers-grid .number-card').forEach((card, i) => {
        ScrollTrigger.create({
            trigger: card,
            start: 'top 88%',
            once: true,
            onEnter: () => {
                gsap.to(card, {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    delay: i * 0.06,
                    ease: 'power2.out',
                    onComplete: () => {
                        // Animate the counter inside this card
                        const counter = card.querySelector('.counter');
                        if (counter) animateCounter(counter);
                    }
                });
            }
        });
    });

    // Numbers section header
    ScrollTrigger.create({
        trigger: '.numbers-section .section-header',
        start: 'top 88%',
        once: true,
        onEnter: () => {
            gsap.to('.numbers-section .section-header', {
                opacity: 1, y: 0, duration: 0.6, ease: 'power2.out'
            });
        }
    });

    // Number bars
    ScrollTrigger.create({
        trigger: '.numbers-grid',
        start: 'top 70%',
        once: true,
        onEnter: animateNumberBars
    });

    // Market section
    gsap.utils.toArray('.market-section .gsap-fade').forEach((el, i) => {
        ScrollTrigger.create({
            trigger: el,
            start: 'top 88%',
            once: true,
            onEnter: () => {
                gsap.to(el, {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    delay: i * 0.05,
                    ease: 'power2.out'
                });
            }
        });
    });

    // Market table rows stagger in
    gsap.utils.toArray('.mt-row:not(.mt-header)').forEach((row) => {
        ScrollTrigger.create({
            trigger: row,
            start: 'top 92%',
            once: true,
            onEnter: () => {
                gsap.fromTo(row,
                    { opacity: 0, x: -15 },
                    { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' }
                );
            }
        });
    });

    // Product cards (clean fade and slide up)
    gsap.utils.toArray('.product-card').forEach((card, i) => {
        ScrollTrigger.create({
            trigger: card,
            start: 'top 88%',
            once: true,
            onEnter: () => {
                gsap.fromTo(card,
                    { opacity: 0, y: 30 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        delay: i * 0.05,
                        ease: 'power2.out'
                    }
                );
            }
        });
    });

    // Feature cards
    gsap.utils.toArray('.feature-card').forEach((card, i) => {
        ScrollTrigger.create({
            trigger: card,
            start: 'top 88%',
            once: true,
            onEnter: () => {
                gsap.fromTo(card,
                    { opacity: 0, y: 30 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        delay: i * 0.05,
                        ease: 'power2.out'
                    }
                );
            }
        });
    });

    // Testimonial cards
    gsap.utils.toArray('.testimonial-card').forEach((card, i) => {
        ScrollTrigger.create({
            trigger: card,
            start: 'top 88%',
            once: true,
            onEnter: () => {
                gsap.fromTo(card,
                    { opacity: 0, y: 30 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        delay: i * 0.07,
                        ease: 'power2.out'
                    }
                );
            }
        });
    });

    // Section headers & form blocks (products, features, sip, app, testimonials, cta)
    gsap.utils.toArray('.section-header.animate-on-scroll, .sip-content.animate-on-scroll, .sip-result.animate-on-scroll, .app-content.animate-on-scroll, .app-visual.animate-on-scroll').forEach(el => {
        ScrollTrigger.create({
            trigger: el,
            start: 'top 88%',
            once: true,
            onEnter: () => {
                gsap.to(el, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' });
                el.classList.add('visible');
            }
        });
    });

    // About content wrap animation
    gsap.from('.about-grid', {
        scrollTrigger: {
            trigger: '.about-grid',
            start: 'top 88%',
            once: true
        },
        y: 25,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out'
    });

    // Eligibility box animation
    gsap.from('.eligibility-box', {
        scrollTrigger: {
            trigger: '.eligibility-box',
            start: 'top 88%',
            once: true
        },
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out'
    });

    // FAQ list animation
    gsap.from('.faq-list', {
        scrollTrigger: {
            trigger: '.faq-list',
            start: 'top 88%',
            once: true
        },
        y: 25,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out'
    });

    // Apply box animation
    gsap.from('.apply-box', {
        scrollTrigger: {
            trigger: '.apply-box',
            start: 'top 88%',
            once: true
        },
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out'
    });

    // CTA Card
    ScrollTrigger.create({
        trigger: '.cta-card',
        start: 'top 85%',
        once: true,
        onEnter: () => {
            gsap.fromTo('.cta-card',
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
            );
            // Mark it visible so original CSS transitions also apply
            document.querySelector('.cta-card').classList.add('visible');
        }
    });

    // Hero stats countup
    ScrollTrigger.create({
        trigger: '.hero-stats',
        start: 'top 90%',
        once: true,
        onEnter: animateHeroCounters
    });

    // SIP section chart
    ScrollTrigger.create({
        trigger: '.sip-section',
        start: 'top 75%',
        once: true,
        onEnter: () => {
            gsap.fromTo('.sip-result',
                { opacity: 0, x: 25 },
                { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' }
            );
        }
    });

    // App phone stack animation
    ScrollTrigger.create({
        trigger: '.app-phone-stack',
        start: 'top 85%',
        once: true,
        onEnter: () => {
            gsap.fromTo('.app-phone-back',
                { opacity: 0, x: -30, rotation: -12 },
                { opacity: 1, x: 0, rotation: -5, duration: 0.6, ease: 'power2.out' }
            );
            gsap.fromTo('.app-phone-front',
                { opacity: 0, x: 30, y: 20 },
                { opacity: 1, x: 0, y: 0, duration: 0.6, delay: 0.1, ease: 'power2.out' }
            );
        }
    });
}

// ============================================================
// ===== Parallax floating cards (GSAP-powered) =====
// ============================================================
document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth - 0.5;
    const mouseY = e.clientY / window.innerHeight - 0.5;

    gsap.utils.toArray('.floating-card').forEach((card, index) => {
        const speed = (index + 1) * 10;
        gsap.to(card, {
            x: mouseX * speed,
            y: mouseY * speed,
            duration: 0.8,
            ease: 'power2.out'
        });
    });
});

// ===== Magnetic hover effect on buttons =====
document.querySelectorAll('.btn-primary, .btn-signup').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
        gsap.to(btn, { scale: 1.05, duration: 0.3, ease: 'power2.out' });
    });
    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { scale: 1, duration: 0.3, ease: 'power2.out' });
    });
});

// ===== Ticker pause on hover =====
const ticker = document.getElementById('ticker');
if (ticker) {
    ticker.addEventListener('mouseenter', () => {
        ticker.style.animationPlayState = 'paused';
    });
    ticker.addEventListener('mouseleave', () => {
        ticker.style.animationPlayState = 'running';
    });
}

// ===== SIP Calculator =====
const sipAmount = document.getElementById('sipAmount');
const sipAmountRange = document.getElementById('sipAmountRange');
const sipReturn = document.getElementById('sipReturn');
const sipReturnRange = document.getElementById('sipReturnRange');
const sipYears = document.getElementById('sipYears');
const sipYearsRange = document.getElementById('sipYearsRange');
const sipTotalValue = document.getElementById('sipTotalValue');
const sipInvested = document.getElementById('sipInvested');
const sipReturns = document.getElementById('sipReturns');

function formatCurrency(value) {
    if (value >= 10000000) {
        return '₹' + (value / 10000000).toFixed(1) + 'Cr';
    } else if (value >= 100000) {
        return '₹' + (value / 100000).toFixed(1) + 'L';
    } else if (value >= 1000) {
        return '₹' + (value / 1000).toFixed(1) + 'K';
    }
    return '₹' + value.toFixed(0);
}

function calculateSIP() {
    const P = Number.parseFloat(sipAmount.value) || 5000;
    const r = (Number.parseFloat(sipReturn.value) || 12) / 100 / 12;
    const n = (Number.parseFloat(sipYears.value) || 10) * 12;

    const totalInvested = P * n;
    const futureValue = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    const estimatedReturns = futureValue - totalInvested;

    // Animate the value change
    gsap.to(sipTotalValue, {
        duration: 0.3,
        ease: 'power1.out',
        onUpdate: function() {
            sipTotalValue.textContent = formatCurrency(futureValue);
        }
    });
    sipInvested.textContent = formatCurrency(totalInvested);
    sipReturns.textContent = formatCurrency(estimatedReturns);

    drawSIPChart(totalInvested, estimatedReturns);
    updateRangeBackgrounds();
}

function drawSIPChart(invested, returns) {
    const canvas = document.getElementById('sipChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const size = 220;
    canvas.width = size * 2;
    canvas.height = size * 2;
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
    ctx.scale(2, 2);

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = 85;
    const lineWidth = 28;
    const total = invested + returns;
    const investedAngle = (invested / total) * Math.PI * 2;
    const returnsAngle = (returns / total) * Math.PI * 2;

    ctx.clearRect(0, 0, size, size);

    // Returns arc (green)
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, -Math.PI / 2 + investedAngle, -Math.PI / 2 + investedAngle + returnsAngle);
    ctx.strokeStyle = '#00d09c';
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Invested arc (blue)
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, -Math.PI / 2, -Math.PI / 2 + investedAngle);
    ctx.strokeStyle = '#5367ff';
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.stroke();
}

function updateRangeBackgrounds() {
    const ranges = [
        { el: sipAmountRange, min: 100, max: 100000 },
        { el: sipReturnRange, min: 1, max: 30 },
        { el: sipYearsRange, min: 1, max: 40 }
    ];

    ranges.forEach(({ el, min, max }) => {
        const val = Number.parseFloat(el.value);
        const pct = ((val - min) / (max - min)) * 100;
        el.style.background = `linear-gradient(to right, #00d09c 0%, #00d09c ${pct}%, #e0e0e0 ${pct}%, #e0e0e0 100%)`;
    });
}

// Sync inputs with range sliders
sipAmount.addEventListener('input', () => {
    sipAmountRange.value = sipAmount.value;
    calculateSIP();
});
sipAmountRange.addEventListener('input', () => {
    sipAmount.value = sipAmountRange.value;
    calculateSIP();
});

sipReturn.addEventListener('input', () => {
    sipReturnRange.value = sipReturn.value;
    calculateSIP();
});
sipReturnRange.addEventListener('input', () => {
    sipReturn.value = sipReturnRange.value;
    calculateSIP();
});

sipYears.addEventListener('input', () => {
    sipYearsRange.value = sipYears.value;
    calculateSIP();
});
sipYearsRange.addEventListener('input', () => {
    sipYears.value = sipYearsRange.value;
    calculateSIP();
});

// Initial calculation
calculateSIP();

// ============================================================
// ===== INIT ON PAGE LOAD =====
// ============================================================
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
    buildIsoCity();
    animateHero();
    initGSAPScrollAnimations();
});

// =====================================================================
// ===== TOOLS HUB — GSAP scroll animations =====
// =====================================================================
gsap.utils.toArray('.gsap-tool-card').forEach((card, i) => {
    ScrollTrigger.create({
        trigger: card,
        start: 'top 88%',
        once: true,
        onEnter: () => {
            gsap.fromTo(card,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.55, delay: i * 0.07, ease: 'power2.out' }
            );
        }
    });
    gsap.set(card, { opacity: 0, y: 30 });
});

// =====================================================================
// ===== TOOL OVERLAY SYSTEM =====
// =====================================================================
const toolBackdrop = document.getElementById('toolBackdrop');
const toolSheet = document.getElementById('toolSheet');
const toolCloseBtn = document.getElementById('toolCloseBtn');
let currentTool = null;
let toolsInitialized = {};

const TOOL_META = {
    emi: {
        title: 'EMI Calculator',
        sub: 'Calculate your monthly loan repayment',
        iconBg: 'linear-gradient(135deg,#e8f9f4,#ccf2e5)',
        iconSvg: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="#00d09c" stroke-width="2"/><path d="M3 9h18" stroke="#00d09c" stroke-width="2"/><path d="M8 2v4M16 2v4" stroke="#00d09c" stroke-width="2" stroke-linecap="round"/><path d="M8 13h8M8 17h5" stroke="#00d09c" stroke-width="2" stroke-linecap="round"/></svg>'
    },
    cibil: {
        title: 'CIBIL Score Guide',
        sub: 'Understand and improve your credit score',
        iconBg: 'linear-gradient(135deg,#fff8e8,#ffefc2)',
        iconSvg: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 2L15 8H21L16 12L18 19L12 15L6 19L8 12L3 8H9L12 2Z" stroke="#f5a623" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    },
    eligibility: {
        title: 'Eligibility Checker',
        sub: 'Find your estimated loan eligibility instantly',
        iconBg: 'linear-gradient(135deg,#eef0ff,#dde1ff)',
        iconSvg: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M9 11l3 3L22 4" stroke="#5367ff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="#5367ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    },
    sip: {
        title: 'SIP Calculator',
        sub: 'Plan your monthly investments and returns',
        iconBg: 'linear-gradient(135deg,#f3eeff,#e4d9ff)',
        iconSvg: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 17L9 11L13 15L21 7" stroke="#8b5cf6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M17 7H21V11" stroke="#8b5cf6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    },
    balance: {
        title: 'Balance Transfer Calculator',
        sub: 'See how much you save with a lower interest rate',
        iconBg: 'linear-gradient(135deg,#fef0ec,#fdddd4)',
        iconSvg: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M17 1l4 4-4 4" stroke="#eb5b3c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 11V9a4 4 0 014-4h14" stroke="#eb5b3c" stroke-width="2" stroke-linecap="round"/><path d="M7 23l-4-4 4-4" stroke="#eb5b3c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 13v2a4 4 0 01-4 4H3" stroke="#eb5b3c" stroke-width="2" stroke-linecap="round"/></svg>'
    },
    compare: {
        title: 'Loan Comparison Tool',
        sub: 'Compare interest rates across top banks',
        iconBg: 'linear-gradient(135deg,#e8f9f4,#ccf2e5)',
        iconSvg: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1" stroke="#00b386" stroke-width="2"/><rect x="14" y="3" width="7" height="7" rx="1" stroke="#00b386" stroke-width="2"/><rect x="3" y="14" width="7" height="7" rx="1" stroke="#00b386" stroke-width="2"/><rect x="14" y="14" width="7" height="7" rx="1" stroke="#00b386" stroke-width="2"/></svg>'
    }
};

function openTool(id) {
    if (!TOOL_META[id]) return;
    currentTool = id;

    // Set header content
    const meta = TOOL_META[id];
    const iconEl = document.getElementById('toolSheetIcon');
    iconEl.style.background = meta.iconBg;
    iconEl.innerHTML = meta.iconSvg;
    document.getElementById('toolSheetTitle').textContent = meta.title;
    document.getElementById('toolSheetSub').textContent = meta.sub;

    // Show correct panel
    document.querySelectorAll('.tool-panel').forEach(p => p.classList.remove('active'));
    const panel = document.getElementById('panel-' + id);
    if (panel) panel.classList.add('active');

    // Activate backdrop
    toolBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';

    // GSAP slide-up animation
    gsap.fromTo(toolSheet,
        { y: '100%' },
        { y: '0%', duration: 0.5, ease: 'power3.out' }
    );

    // Animate panel contents
    gsap.fromTo(panel ? panel.querySelectorAll('.tool-input-group, .emi-result-cards, .tool-result-col, .cibil-gauge-col, .cibil-info-col, .el-toggle-wrap, .el-result-box, .el-breakdown, .bt-comparison, .bt-savings-box, .compare-controls, .compare-table-wrap') : [],
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.06, ease: 'power2.out', delay: 0.3 }
    );

    // Initialize tool on first open
    if (!toolsInitialized[id]) {
        toolsInitialized[id] = true;
        setTimeout(() => initTool(id), 50);
    } else {
        // Redraw charts if reopened
        if (id === 'emi') calcEMI();
        if (id === 'sip') calcSIPTool();
        if (id === 'compare') calcComparison();
    }

    // Scroll sheet to top
    const body = document.querySelector('.tool-sheet-body');
    if (body) body.scrollTop = 0;
}

function closeTool() {
    gsap.to(toolSheet, {
        y: '100%',
        duration: 0.4,
        ease: 'power3.in',
        onComplete: () => {
            toolBackdrop.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

toolCloseBtn.addEventListener('click', closeTool);
toolBackdrop.addEventListener('click', closeTool);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && currentTool) closeTool(); });

function initTool(id) {
    if (id === 'emi') initEMI();
    if (id === 'cibil') initCIBIL();
    if (id === 'eligibility') initEligibilityTool();
    if (id === 'sip') initSIPTool();
    if (id === 'balance') initBalanceTransfer();
    if (id === 'compare') initComparison();
}

// =====================================================================
// ===== SHARED HELPERS =====
// =====================================================================
function fmtCur(val) {
    if (val >= 10000000) return '₹' + (val / 10000000).toFixed(2) + ' Cr';
    if (val >= 100000) return '₹' + (val / 100000).toFixed(2) + 'L';
    if (val >= 1000) return '₹' + Math.round(val).toLocaleString('en-IN');
    return '₹' + val.toFixed(0);
}
function fmtInr(val) { return '₹' + Math.round(val).toLocaleString('en-IN'); }

function calcEMIFormula(P, annualRate, years) {
    const r = annualRate / 100 / 12;
    const n = years * 12;
    if (r === 0) return P / n;
    return P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
}

function updateToolRange(rangeEl, pct) {
    rangeEl.style.background = `linear-gradient(to right, #00d09c 0%, #00d09c ${pct}%, #e0e0e0 ${pct}%, #e0e0e0 100%)`;
}

function syncRange(inputEl, rangeEl, min, max, callback) {
    inputEl.addEventListener('input', () => { rangeEl.value = inputEl.value; updateToolRange(rangeEl, ((inputEl.value - min) / (max - min)) * 100); callback(); });
    rangeEl.addEventListener('input', () => { inputEl.value = rangeEl.value; updateToolRange(rangeEl, ((rangeEl.value - min) / (max - min)) * 100); callback(); });
}

function drawDonut(canvasId, seg1, seg2, color1, color2) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const size = 200;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    const cx = size / 2, cy = size / 2, r = 78, lw = 24;
    const total = seg1 + seg2;
    const a1 = (seg1 / total) * Math.PI * 2;
    ctx.clearRect(0, 0, size, size);
    // Background ring
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = '#f0f0f0'; ctx.lineWidth = lw; ctx.stroke();
    // Segment 1
    ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + a1);
    ctx.strokeStyle = color1; ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.stroke();
    // Segment 2
    ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI / 2 + a1, -Math.PI / 2 + Math.PI * 2);
    ctx.strokeStyle = color2; ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.stroke();
}

// =====================================================================
// ===== EMI CALCULATOR =====
// =====================================================================
function initEMI() {
    syncRange(document.getElementById('emiAmount'), document.getElementById('emiAmountRange'), 50000, 10000000, calcEMI);
    syncRange(document.getElementById('emiRate'), document.getElementById('emiRateRange'), 6, 30, calcEMI);
    syncRange(document.getElementById('emiTenure'), document.getElementById('emiTenureRange'), 1, 30, calcEMI);
    // Set initial range backgrounds
    updateToolRange(document.getElementById('emiAmountRange'), ((500000 - 50000) / (10000000 - 50000)) * 100);
    updateToolRange(document.getElementById('emiRateRange'), ((12 - 6) / (30 - 6)) * 100);
    updateToolRange(document.getElementById('emiTenureRange'), ((5 - 1) / (30 - 1)) * 100);
    calcEMI();
}

function calcEMI() {
    const P = parseFloat(document.getElementById('emiAmount').value) || 500000;
    const rate = parseFloat(document.getElementById('emiRate').value) || 12;
    const years = parseFloat(document.getElementById('emiTenure').value) || 5;
    const emi = calcEMIFormula(P, rate, years);
    const totalPayment = emi * years * 12;
    const totalInterest = totalPayment - P;

    const emiFmt = fmtInr(emi);
    document.getElementById('emiMonthly').textContent = emiFmt;
    document.getElementById('emiChartCenter').textContent = emiFmt;
    document.getElementById('emiTotalInterest').textContent = fmtCur(totalInterest);
    document.getElementById('emiTotalPayment').textContent = fmtCur(totalPayment);
    document.getElementById('emiLegPrincipal').textContent = fmtCur(P);
    document.getElementById('emiLegInterest').textContent = fmtCur(totalInterest);

    drawDonut('emiToolChart', P, totalInterest, '#5367ff', '#00d09c');
    buildAmortTable(P, rate, years, emi);
}

function buildAmortTable(P, annualRate, years, emi) {
    const tbody = document.getElementById('emiAmortBody');
    if (!tbody) return;
    const r = annualRate / 100 / 12;
    let balance = P;
    let rows = '';
    for (let yr = 1; yr <= years; yr++) {
        let yearPrincipal = 0, yearInterest = 0;
        for (let m = 0; m < 12; m++) {
            if (balance <= 0) break;
            const intPart = balance * r;
            const prinPart = Math.min(emi - intPart, balance);
            yearInterest += intPart;
            yearPrincipal += prinPart;
            balance -= prinPart;
        }
        rows += `<tr><td>Yr ${yr}</td><td>${fmtCur(yearPrincipal)}</td><td>${fmtCur(yearInterest)}</td><td>${fmtCur(Math.max(0, balance))}</td></tr>`;
    }
    tbody.innerHTML = rows;
}

// =====================================================================
// ===== CIBIL SCORE =====
// =====================================================================
function initCIBIL() {
    const slider = document.getElementById('cibilSlider');
    slider.addEventListener('input', () => {
        updateToolRange(slider, ((slider.value - 300) / (900 - 300)) * 100);
        updateCIBIL(parseInt(slider.value));
    });
    updateToolRange(slider, ((750 - 300) / (900 - 300)) * 100);
    updateCIBIL(750);
}

function updateCIBIL(score) {
    document.getElementById('cibilScoreNum').textContent = score;
    const path = document.getElementById('cibilGaugeFill');
    // Arc length for full semicircle ≈ 267. Map 300-900 → 0-267
    const pct = (score - 300) / 600;
    const dashOffset = 267 * (1 - pct);
    gsap.to(path, { attr: { 'stroke-dashoffset': dashOffset }, duration: 0.5, ease: 'power2.out' });

    let label, desc, approval, rate, badgeBg, borderColor;
    if (score < 550) {
        label = 'Poor'; desc = 'Your score needs significant improvement. Most lenders may decline loan applications or offer very high interest rates.';
        approval = 'Low approval chances'; rate = 'Rates may exceed 18% p.a.';
        badgeBg = '#fdecea'; borderColor = '#e53935';
    } else if (score < 650) {
        label = 'Fair'; desc = 'Your score is fair. Some lenders may approve loans but at higher rates. Focus on improving payment history.';
        approval = 'Moderate approval chances'; rate = 'Rates typically 15%–18% p.a.';
        badgeBg = '#fff8e8'; borderColor = '#f5a623';
    } else if (score < 750) {
        label = 'Good'; desc = 'Good score! Most banks will consider your application. You can negotiate for better interest rates.';
        approval = 'Good approval chances'; rate = 'Rates from 12%–15% p.a.';
        badgeBg = '#fffde7'; borderColor = '#ffd700';
    } else if (score < 800) {
        label = 'Very Good'; desc = 'Very good credit score! Banks will readily approve your loan with competitive interest rates.';
        approval = 'High approval chances'; rate = 'Best rates from 10.49% p.a.';
        badgeBg = '#e8f9f4'; borderColor = '#00d09c';
    } else {
        label = 'Excellent'; desc = 'Excellent credit score! You qualify for the best loan products with the lowest interest rates available.';
        approval = 'Very high approval chances'; rate = 'Best rates from 10.49% p.a.';
        badgeBg = '#e8f9f4'; borderColor = '#00b386';
    }

    const badge = document.getElementById('cibilBadge');
    badge.textContent = label;
    badge.style.background = badgeBg;
    badge.style.color = borderColor;

    document.getElementById('cibilDesc').textContent = desc;
    document.getElementById('cibilApproval').textContent = approval;
    document.getElementById('cibilRate').textContent = rate;
    document.getElementById('cibilImpactCard').style.borderLeftColor = borderColor;
}

// =====================================================================
// ===== ELIGIBILITY CHECKER (TOOL OVERLAY VERSION) =====
// =====================================================================
let employmentType = 'salaried';

function setEmployment(type) {
    employmentType = type;
    document.getElementById('elSalariedBtn').classList.toggle('active', type === 'salaried');
    document.getElementById('elSelfBtn').classList.toggle('active', type === 'self');
    document.getElementById('elIncomeLabel').textContent = type === 'salaried' ? 'Monthly Salary (₹)' : 'Monthly Net Income (₹)';
    calcEligibilityTool();
}

function initEligibilityTool() {
    syncRange(document.getElementById('elToolIncome'), document.getElementById('elIncomeRange'), 10000, 500000, calcEligibilityTool);
    syncRange(document.getElementById('elToolEMI'), document.getElementById('elEMIRange'), 0, 200000, calcEligibilityTool);
    updateToolRange(document.getElementById('elIncomeRange'), ((50000 - 10000) / (500000 - 10000)) * 100);
    updateToolRange(document.getElementById('elEMIRange'), 0);
    calcEligibilityTool();
}

function calcEligibilityTool() {
    const income = parseFloat(document.getElementById('elToolIncome').value) || 0;
    const existingEMI = parseFloat(document.getElementById('elToolEMI').value) || 0;
    const loanType = document.getElementById('elToolLoanType').value;

    const rateMap = { personal: 10.49, business: 14, home: 8.35, lap: 9.5, professional: 10.75 };
    const tenureMap = { personal: 5, business: 4, home: 20, lap: 15, professional: 5 };
    const rate = rateMap[loanType] || 10.49;
    const tenure = tenureMap[loanType] || 5;

    const disposable = Math.max(0, income - existingEMI);
    const maxEMI = disposable * 0.5;
    const r = rate / 100 / 12;
    const n = tenure * 12;
    let eligible = 0;
    if (maxEMI > 0 && r > 0) {
        eligible = maxEMI * (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n));
    }

    const pct = Math.min(100, (eligible / 5000000) * 100);

    gsap.to({}, {
        duration: 0.6,
        ease: 'power2.out',
        onUpdate: function() {}
    });

    document.getElementById('elToolResult').textContent = eligible > 0 ? fmtInr(eligible) : 'Not Eligible';
    document.getElementById('elToolSub').textContent = `Based on ${(rate).toFixed(2)}% rate · ${tenure} yr tenure`;
    document.getElementById('elProgressFill').style.width = pct + '%';

    document.getElementById('elBdIncome').textContent = fmtInr(income);
    document.getElementById('elBdEMI').textContent = fmtInr(existingEMI);
    document.getElementById('elBdDisposable').textContent = fmtInr(disposable);
    document.getElementById('elBdCapacity').textContent = fmtInr(maxEMI);
    document.getElementById('elBdRate').textContent = rate.toFixed(2) + '% p.a.';
}

// =====================================================================
// ===== SIP CALCULATOR (TOOL OVERLAY VERSION) =====
// =====================================================================
function initSIPTool() {
    syncRange(document.getElementById('sipToolAmount'), document.getElementById('sipToolAmountRange'), 500, 100000, calcSIPTool);
    syncRange(document.getElementById('sipToolRate'), document.getElementById('sipToolRateRange'), 4, 30, calcSIPTool);
    syncRange(document.getElementById('sipToolYears'), document.getElementById('sipToolYearsRange'), 1, 40, calcSIPTool);
    updateToolRange(document.getElementById('sipToolAmountRange'), ((5000 - 500) / (100000 - 500)) * 100);
    updateToolRange(document.getElementById('sipToolRateRange'), ((12 - 4) / (30 - 4)) * 100);
    updateToolRange(document.getElementById('sipToolYearsRange'), ((10 - 1) / (40 - 1)) * 100);
    calcSIPTool();
}

function calcSIPTool() {
    const P = parseFloat(document.getElementById('sipToolAmount').value) || 5000;
    const rate = parseFloat(document.getElementById('sipToolRate').value) || 12;
    const years = parseFloat(document.getElementById('sipToolYears').value) || 10;
    const r = rate / 100 / 12;
    const n = years * 12;
    const fv = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    const invested = P * n;
    const returns = fv - invested;
    const gainPct = (returns / invested) * 100;
    const barW = Math.min(100, gainPct / 3);

    document.getElementById('sipToolInvested').textContent = fmtCur(invested);
    document.getElementById('sipToolReturns').textContent = fmtCur(returns);
    document.getElementById('sipToolTotal').textContent = fmtCur(fv);
    document.getElementById('sipChartCenter').textContent = fmtCur(fv);
    document.getElementById('sipLegInvested').textContent = fmtCur(invested);
    document.getElementById('sipLegReturns').textContent = fmtCur(returns);
    document.getElementById('sipWealthPct').textContent = '+' + Math.round(gainPct) + '%';
    document.getElementById('sipWealthFill').style.width = barW + '%';

    drawDonut('sipToolChart', invested, returns, '#8b5cf6', '#00d09c');
}

// =====================================================================
// ===== BALANCE TRANSFER CALCULATOR =====
// =====================================================================
function initBalanceTransfer() {
    syncRange(document.getElementById('btAmount'), document.getElementById('btAmountRange'), 50000, 10000000, calcBalanceTransfer);
    syncRange(document.getElementById('btTenure'), document.getElementById('btTenureRange'), 1, 30, calcBalanceTransfer);
    syncRange(document.getElementById('btCurrentRate'), document.getElementById('btCurrentRateRange'), 6, 36, calcBalanceTransfer);
    syncRange(document.getElementById('btNewRate'), document.getElementById('btNewRateRange'), 6, 30, calcBalanceTransfer);
    updateToolRange(document.getElementById('btAmountRange'), ((1000000 - 50000) / (10000000 - 50000)) * 100);
    updateToolRange(document.getElementById('btTenureRange'), ((10 - 1) / (30 - 1)) * 100);
    updateToolRange(document.getElementById('btCurrentRateRange'), ((14 - 6) / (36 - 6)) * 100);
    updateToolRange(document.getElementById('btNewRateRange'), ((10.5 - 6) / (30 - 6)) * 100);
    calcBalanceTransfer();
}

function calcBalanceTransfer() {
    const P = parseFloat(document.getElementById('btAmount').value) || 1000000;
    const years = parseFloat(document.getElementById('btTenure').value) || 10;
    const oldRate = parseFloat(document.getElementById('btCurrentRate').value) || 14;
    const newRate = parseFloat(document.getElementById('btNewRate').value) || 10.5;

    const oldEMI = calcEMIFormula(P, oldRate, years);
    const newEMI = calcEMIFormula(P, newRate, years);
    const oldTotal = oldEMI * years * 12;
    const newTotal = newEMI * years * 12;
    const oldInterest = oldTotal - P;
    const newInterest = newTotal - P;
    const monthlySaving = oldEMI - newEMI;
    const totalSaving = oldInterest - newInterest;

    document.getElementById('btOldEMI').textContent = fmtInr(oldEMI);
    document.getElementById('btNewEMI').textContent = fmtInr(newEMI);
    document.getElementById('btOldInterest').textContent = fmtCur(oldInterest);
    document.getElementById('btNewInterest').textContent = fmtCur(newInterest);
    document.getElementById('btOldTotal').textContent = fmtCur(oldTotal);
    document.getElementById('btNewTotal').textContent = fmtCur(newTotal);
    document.getElementById('btOldRateTag').textContent = oldRate.toFixed(1) + '% p.a.';
    document.getElementById('btNewRateTag').textContent = newRate.toFixed(1) + '% p.a.';
    document.getElementById('btMonthlySaving').textContent = monthlySaving > 0 ? fmtInr(monthlySaving) : '—';
    document.getElementById('btTotalSaving').textContent = totalSaving > 0 ? fmtCur(totalSaving) : '—';
}

// =====================================================================
// ===== LOAN COMPARISON TOOL =====
// =====================================================================
const BANK_RATES = {
    personal: [
        { bank: 'Axis Bank', rate: 10.49 },
        { bank: 'HDFC Bank', rate: 10.75 },
        { bank: 'ICICI Bank', rate: 10.85 },
        { bank: 'SBI', rate: 11.15 },
        { bank: 'Kotak Bank', rate: 10.99 },
        { bank: 'Bajaj Finserv', rate: 13.0 },
    ],
    home: [
        { bank: 'HDFC Bank', rate: 8.35 },
        { bank: 'LIC HFL', rate: 8.45 },
        { bank: 'SBI', rate: 8.50 },
        { bank: 'Axis Bank', rate: 8.70 },
        { bank: 'ICICI Bank', rate: 8.75 },
        { bank: 'Kotak Bank', rate: 8.85 },
    ],
    business: [
        { bank: 'HDFC Bank', rate: 14.0 },
        { bank: 'Bajaj Finserv', rate: 14.5 },
        { bank: 'IDFC First', rate: 14.5 },
        { bank: 'Tata Capital', rate: 15.0 },
        { bank: 'Lendingkart', rate: 16.0 },
        { bank: 'FlexiLoans', rate: 18.0 },
    ],
    lap: [
        { bank: 'SBI', rate: 9.15 },
        { bank: 'HDFC Bank', rate: 9.50 },
        { bank: 'ICICI Bank', rate: 9.60 },
        { bank: 'Axis Bank', rate: 9.75 },
        { bank: 'Bajaj Finserv', rate: 10.0 },
        { bank: 'Kotak Bank', rate: 10.25 },
    ]
};

function initComparison() {
    calcComparison();
}

function calcComparison() {
    const loanType = document.getElementById('cmpLoanType').value;
    const P = parseFloat(document.getElementById('cmpAmount').value) || 1000000;
    const years = parseFloat(document.getElementById('cmpTenure').value) || 5;
    const banks = BANK_RATES[loanType] || BANK_RATES.personal;
    const sorted = [...banks].sort((a, b) => a.rate - b.rate);

    const tbody = document.getElementById('compareBody');
    tbody.innerHTML = '';
    sorted.forEach((b, i) => {
        const emi = calcEMIFormula(P, b.rate, years);
        const totalPayment = emi * years * 12;
        const totalInterest = totalPayment - P;
        const isBest = i === 0;
        const row = document.createElement('tr');
        if (isBest) row.classList.add('cmp-best');
        row.innerHTML = `
            <td><span class="cmp-bank">${b.bank}</span>${isBest ? '<span class="cmp-badge">Best Rate</span>' : ''}</td>
            <td><span class="cmp-rate">${b.rate.toFixed(2)}%</span></td>
            <td><strong>${fmtInr(emi)}</strong></td>
            <td>${fmtCur(totalInterest)}</td>
            <td>${fmtCur(totalPayment)}</td>
            <td><button class="cmp-apply" onclick="closeTool(); document.getElementById('apply').scrollIntoView({behavior:'smooth'})">Apply</button></td>
        `;
        tbody.appendChild(row);
        gsap.fromTo(row, { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.3, delay: i * 0.05, ease: 'power2.out' });
    });
}

// =====================================================================
// ===== Prevent form submission on enter in SIP calculator =====
document.querySelectorAll('.sip-input-wrap input').forEach(input => {
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            input.blur();
        }
    });
});

// ===== Mobile menu close on link click =====
document.querySelectorAll('.mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
    });
});

// ===== Smooth scroll for anchor links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== Index card sparkline draw animation =====
gsap.utils.toArray('.index-sparkline polyline').forEach(line => {
    ScrollTrigger.create({
        trigger: line.closest('.index-card'),
        start: 'top 85%',
        once: true,
        onEnter: () => {
            const length = line.getTotalLength();
            gsap.fromTo(line,
                { strokeDasharray: length, strokeDashoffset: length },
                { strokeDashoffset: 0, duration: 1.5, ease: 'power2.out' }
            );
        }
    });
});

// ===== Eligibility Checker Logic =====
const eligibilityForm = document.getElementById('eligibilityForm');
const eligibilityResult = document.getElementById('eligibilityResult');
const eligibilityAmount = document.getElementById('eligibilityAmount');

if (eligibilityForm) {
    eligibilityForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const salary = parseFloat(document.getElementById('elSalary').value) || 0;
        const existingEMI = parseFloat(document.getElementById('elExistingEMI').value) || 0;
        const loanType = document.getElementById('elLoanType').value;

        if (!loanType || salary <= 0) {
            alert('Please fill in all required fields.');
            return;
        }

        let multiplier;
        switch (loanType) {
            case 'home':
            case 'lap':
                multiplier = 60;
                break;
            case 'business':
            case 'working':
                multiplier = 36;
                break;
            default:
                multiplier = 24;
        }

        const disposable = Math.max(0, salary - existingEMI);
        const eligible = disposable * 0.5 * multiplier;

        if (eligible <= 0) {
            eligibilityAmount.textContent = 'Not Eligible';
        } else {
            eligibilityAmount.textContent = '₹' + Math.round(eligible).toLocaleString('en-IN');
        }

        eligibilityResult.style.display = 'block';
        gsap.fromTo(eligibilityResult,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
        );

        // Smooth scroll to result
        const offsetPosition = eligibilityResult.getBoundingClientRect().top + window.pageYOffset - 120;
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    });
}

// ===== FAQ Accordion Logic =====
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all other items
        faqItems.forEach(otherItem => {
            if (otherItem !== item && otherItem.classList.contains('active')) {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-answer').style.maxHeight = '0px';
            }
        });

        // Toggle active state on current item
        item.classList.toggle('active');
        if (item.classList.contains('active')) {
            answer.style.maxHeight = answer.scrollHeight + 'px';
        } else {
            answer.style.maxHeight = '0px';
        }
    });
});

// ===== Loan Application Logic =====
const applyForm = document.getElementById('applyForm');
const applySuccess = document.getElementById('applySuccess');

if (applyForm) {
    applyForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('appName').value.trim();
        const phone = document.getElementById('appPhone').value.trim();
        const loanType = document.getElementById('appLoanType').value;
        const city = document.getElementById('appCity').value.trim();
        const income = parseFloat(document.getElementById('appIncome').value) || 0;
        const consent = document.getElementById('appConsent').checked;

        if (!name || !phone || !loanType || !city || !income || !consent) {
            alert('Please fill in all required fields and provide consent.');
            return;
        }

        if (!/^[6-9][0-9]{9}$/.test(phone)) {
            alert('Please enter a valid 10-digit Indian mobile number.');
            return;
        }

        // Simulate submission success
        applyForm.style.display = 'none';
        applySuccess.style.display = 'block';
        gsap.fromTo(applySuccess,
            { opacity: 0, scale: 0.9 },
            { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.5)' }
        );

        // Smooth scroll to success message
        const offsetPosition = applySuccess.getBoundingClientRect().top + window.pageYOffset - 120;
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    });
}


// ===================================================================
// ===== ISOMETRIC CITY HERO =========================================
// ===================================================================
function buildIsoCity() {
  const svgEl = document.getElementById('heroIsoSvg');
  if (!svgEl || svgEl.dataset.built) return;
  svgEl.dataset.built = '1';

  // ── Coordinate system ──────────────────────────────────────────
  const s = 30, sx = s * Math.cos(Math.PI / 6), sy = s * 0.5;
  const ox = 300, oy = 265; // isometric origin (front of ground plane)

  function iso(x, y, z) {
    return { x: ox + x * sx - y * sx, y: oy + x * sy + y * sy - z * s };
  }
  function pt(p) { return p.x.toFixed(1) + ',' + p.y.toFixed(1); }

  function pathFace(pts, fill, stroke, sw) {
    const d = 'M ' + pts.map(pt).join(' L ') + ' Z';
    const s_attr = stroke ? ` stroke="${stroke}" stroke-width="${sw || 0.5}"` : '';
    return `<path d="${d}" fill="${fill}"${s_attr}/>`;
  }

  function lerp2(A, B, t) {
    return { x: A.x + (B.x - A.x) * t, y: A.y + (B.y - A.y) * t };
  }

  // Bilinear interpolation on a quad face
  function bl(A, B, C, D, u, v) {
    const ab = lerp2(A, B, u), dc = lerp2(D, C, u);
    return lerp2(ab, dc, v);
  }

  // Window grid on a parallelogram face
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

  // Draw one isometric building box
  function building(gx, gy, w, d, h, col, id) {
    const tfl = iso(gx, gy, h),     tfr = iso(gx + w, gy, h);
    const tbr = iso(gx + w, gy + d, h), tbl = iso(gx, gy + d, h);
    const bfl = iso(gx, gy, 0),     bfr = iso(gx + w, gy, 0);
    const bbr = iso(gx + w, gy + d, 0), bbl = iso(gx, gy + d, 0);
    const { top, left, right, wl, wr } = col;
    const winR = Math.max(1, Math.round(h * 1.6));
    const winC = Math.max(1, Math.round(w));
    let g = `<g class="iso-bld" data-id="${id}">`;
    g += pathFace([tfl, tbl, bbl, bfl], left, '#00000018', 0.5);
    g += pathFace([tfr, tbr, bbr, bfr], right, '#00000018', 0.5);
    g += pathFace([tfl, tfr, tbr, tbl], top, '#ffffff28', 0.5);
    if (h >= 2) {
      g += makeWindows(tfr, tbr, bbr, bfr, winR, winC, wr);
      g += makeWindows(tfl, tbl, bbl, bfl, winR, Math.max(1, Math.round(d)), wl);
    }
    g += '</g>';
    return g;
  }

  // Simple tree at grid coords
  function tree(gx, gy) {
    const b = iso(gx, gy, 0), m = iso(gx, gy, 1.4);
    const cx = b.x, trunkY = b.y;
    return `<g class="iso-tree">
      <rect x="${(cx-2.5).toFixed(1)}" y="${(m.y).toFixed(1)}" width="5" height="${(trunkY - m.y).toFixed(1)}" fill="#92400e" rx="1"/>
      <polygon points="${cx},${(m.y-14).toFixed(1)} ${(cx-11).toFixed(1)},${(m.y+2).toFixed(1)} ${(cx+11).toFixed(1)},${(m.y+2).toFixed(1)}" fill="#059669"/>
      <polygon points="${cx},${(m.y-8).toFixed(1)} ${(cx-8).toFixed(1)},${(m.y+5).toFixed(1)} ${(cx+8).toFixed(1)},${(m.y+5).toFixed(1)}" fill="#10b981"/>
    </g>`;
  }

  // ── Scene elements ──────────────────────────────────────────────
  // Color palettes: {top, left, right, wl(window-left), wr(window-right)}
  const C = {
    teal:   { top:'#00d09c', left:'#005f43', right:'#00845f', wl:'#6ee7b7aa', wr:'#a7f3d0aa' },
    blue:   { top:'#818cf8', left:'#1e3a8a', right:'#2563eb', wl:'#bfdbfeaa', wr:'#dbeafeaa' },
    red:    { top:'#fca5a5', left:'#991b1b', right:'#b91c1c', wl:'#fecacaaa', wr:'#fee2e2aa' },
    purple: { top:'#c4b5fd', left:'#5b21b6', right:'#7c3aed', wl:'#ddd6feaa', wr:'#ede9feaa' },
    gold:   { top:'#fde68a', left:'#92400e', right:'#d97706', wl:'#fef3c7aa', wr:'#fefce8aa' },
    green:  { top:'#6ee7b7', left:'#047857', right:'#059669', wl:'#a7f3d0aa', wr:'#d1fae5aa' },
  };

  // Painter's order: back to front (highest gy first, then higher gx first)
  const buildings = [
    [-3, 5, 1.5, 1.5, 2.5, C.purple, 'edu'],
    [ 1, 5, 1.5, 1.5, 2.8, C.gold,   'lap'],
    [-1, 4, 1,   1,   1.8, C.green,  'sm1'],
    [-4, 2, 1.5, 1.5, 3.8, C.blue,   'per'],
    [ 2, 2, 1.5, 1.5, 3.2, C.red,    'biz'],
    [-1, 0, 2,   2,   6,   C.teal,   'home'],
  ];

  // Ground tiles
  let groundHTML = '';
  for (let x = -5; x < 5; x++) {
    for (let y = 0; y < 8; y++) {
      const a = iso(x,y,0), b = iso(x+1,y,0), c = iso(x+1,y+1,0), d = iso(x,y+1,0);
      const shade = (x + y) % 2 === 0 ? '#e8f9f4' : '#f0fdf8';
      groundHTML += pathFace([a,b,c,d], shade, '#c8e8da', 0.4);
    }
  }

  // Road strip between buildings
  const ra = iso(-1, 0, 0.02), rb = iso(2, 0, 0.02);
  const rc = iso(2, 4, 0.02),  rd = iso(-1, 4, 0.02);
  const roadHTML = pathFace([ra,rb,rc,rd], '#d4ede6', 'none');

  // Buildings
  let bHTML = '';
  buildings.forEach(([gx,gy,w,d,h,col,id]) => { bHTML += building(gx,gy,w,d,h,col,id); });

  // Trees
  const treesHTML = [
    tree(-3, 1), tree(3, 1), tree(-3, 3), tree(3, 3), tree(0, 3.5)
  ].join('');

  // Floating dot particles (animated via GSAP)
  const pData = [
    { id:'isoP1', cx:425, cy:85,  r:5.5, fill:'#f5a623' },
    { id:'isoP2', cx:465, cy:130, r:3.5, fill:'#00d09c' },
    { id:'isoP3', cx:100, cy:100, r:4.5, fill:'#5367ff' },
    { id:'isoP4', cx:395, cy:195, r:3,   fill:'#eb5b3c' },
    { id:'isoP5', cx:85,  cy:175, r:4,   fill:'#8b5cf6' },
    { id:'isoP6', cx:480, cy:60,  r:3,   fill:'#f5a623' },
    { id:'isoP7', cx:120, cy:230, r:3,   fill:'#00d09c' },
  ];
  const particlesHTML = pData.map(p =>
    `<circle id="${p.id}" cx="${p.x||p.cx}" cy="${p.y||p.cy}" r="${p.r}" fill="${p.fill}" opacity="0.65" class="iso-particle"/>`
  ).join('');

  // Decorative dashed connector lines (from main building top to badges)
  const mainTopR = iso(1, 0, 6); // top-front-right of main
  const connHTML = `
    <line x1="${mainTopR.x.toFixed(1)}" y1="${mainTopR.y.toFixed(1)}" x2="430" y2="88" stroke="#00d09c" stroke-width="1.2" stroke-dasharray="4,4" opacity="0.35" class="iso-conn"/>
    <line x1="${mainTopR.x.toFixed(1)}" y1="${mainTopR.y.toFixed(1)}" x2="418" y2="192" stroke="#eb5b3c" stroke-width="1" stroke-dasharray="4,4" opacity="0.3" class="iso-conn"/>
  `;

  // SVG defs (gradients + shadow filter)
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

  // ── GSAP Animations ─────────────────────────────────────────────
  if (typeof gsap === 'undefined') return;

  // Buildings rise-up entrance (staggered)
  const blds = svgEl.querySelectorAll('.iso-bld');
  gsap.set(blds, { opacity: 0, y: 24 });
  gsap.to(blds, {
    opacity: 1, y: 0,
    duration: 0.72, stagger: 0.1,
    ease: 'back.out(1.3)', delay: 0.55
  });

  // Trees gentle sway
  svgEl.querySelectorAll('.iso-tree').forEach((t, i) => {
    gsap.to(t, {
      y: -4, duration: 2.2 + i * 0.3,
      ease: 'sine.inOut', yoyo: true, repeat: -1,
      delay: i * 0.25
    });
  });

  // Particles float upward and reset
  pData.forEach((p, i) => {
    const el = svgEl.getElementById ? svgEl.getElementById(p.id) : document.getElementById(p.id);
    if (!el) return;
    gsap.to(el, {
      attr: { cy: (p.cy - 18) },
      opacity: 0,
      duration: 2.4 + i * 0.35,
      ease: 'power1.inOut',
      repeat: -1,
      delay: i * 0.55,
      repeatDelay: 0.3,
      onRepeat() { gsap.set(el, { attr: { cy: p.cy }, opacity: 0.65 }); }
    });
  });

  // Connector line draw-on
  svgEl.querySelectorAll('.iso-conn').forEach(l => {
    const len = l.getTotalLength ? l.getTotalLength() : 120;
    gsap.fromTo(l,
      { strokeDasharray: len, strokeDashoffset: len },
      { strokeDashoffset: 0, duration: 1.4, ease: 'power2.out', delay: 1.0 }
    );
  });

  // Badges continuous float (in animateHero they do entrance; here add the looping bob)
  gsap.to('.hiso-badge', {
    y: '-=9', duration: 2.1,
    ease: 'sine.inOut', yoyo: true, repeat: -1,
    stagger: { each: 0.55, from: 'start' },
    delay: 1.8
  });
}

// ===================================================================
// ===== LOAN RATE COMPARISON — TAB SWITCHING =========================
// ===================================================================
(function initRateTabs() {
  const tabs = document.querySelectorAll('.rate-tab');
  const panels = document.querySelectorAll('.rate-tab-panel');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panel = document.querySelector(`.rate-tab-panel[data-panel="${target}"]`);
      if (panel) {
        panel.classList.add('active');
        // Animate rows in
        if (typeof gsap !== 'undefined') {
          gsap.fromTo(panel.querySelectorAll('.mt-row:not(.mt-header)'),
            { opacity: 0, x: -12 },
            { opacity: 1, x: 0, duration: 0.35, stagger: 0.05, ease: 'power2.out' }
          );
        }
      }
    });
  });
})();

// ===================================================================
// ===== FINANCIAL SERVICES — CONSULTATION MODAL =====================
// ===================================================================
const CONSULT_ICONS = {
  'Wealth Advisory':          { bg:'#e8faf4', emoji:'📈' },
  'Insurance Advisory':       { bg:'#eef0ff', emoji:'🛡️' },
  'Tax Planning Guidance':    { bg:'#fff8ed', emoji:'📋' },
  'Credit Score Improvement': { bg:'#fce8e4', emoji:'⭐' },
  'Financial Planning':       { bg:'#f0ebff', emoji:'🏡' },
};

function openConsultation(service) {
  const backdrop = document.getElementById('consultBackdrop');
  const modal    = document.getElementById('consultModal');
  const title    = document.getElementById('consultTitle');
  const sub      = document.getElementById('consultSub');
  const iconWrap = document.getElementById('consultIconWrap');
  const form     = document.getElementById('consultForm');
  const success  = document.getElementById('consultSuccess');

  // Reset state
  form.style.display = 'flex';
  success.style.display = 'none';
  form.reset();

  // Set content
  const meta = CONSULT_ICONS[service] || { bg:'#e8faf4', emoji:'💼' };
  iconWrap.style.background = meta.bg;
  iconWrap.textContent = meta.emoji;
  title.textContent = service;
  sub.textContent = 'Book a free call — our expert will guide you personally';

  // Show
  backdrop.classList.add('active');
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeConsultation() {
  document.getElementById('consultBackdrop').classList.remove('active');
  document.getElementById('consultModal').classList.remove('active');
  document.body.style.overflow = '';
}

document.getElementById('consultClose')?.addEventListener('click', closeConsultation);
document.getElementById('consultBackdrop')?.addEventListener('click', closeConsultation);

document.getElementById('consultForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const name  = document.getElementById('cName').value.trim();
  const phone = document.getElementById('cPhone').value.trim();
  const time  = document.getElementById('cTime').value;
  if (!name || !/^[6-9][0-9]{9}$/.test(phone)) {
    alert('Please enter a valid name and 10-digit mobile number.');
    return;
  }
  // Show success
  this.style.display = 'none';
  const success = document.getElementById('consultSuccess');
  success.style.display = 'block';
  if (typeof gsap !== 'undefined') {
    gsap.fromTo(success, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.5)' });
  }
  // Auto-close after 3s
  setTimeout(closeConsultation, 3000);
});

// Financial Services cards scroll animation
gsap.utils.toArray('.fsc-card').forEach((card, i) => {
  gsap.set(card, { opacity: 0, y: 30 });
  ScrollTrigger.create({
    trigger: card,
    start: 'top 88%',
    once: true,
    onEnter: () => gsap.to(card, { opacity: 1, y: 0, duration: 0.55, delay: (i % 3) * 0.09, ease: 'power2.out' })
  });
});

// ===================================================================
// ===== TYPOGRAPHIC GSAP ANIMATIONS — gradient color-wipe ===========
// ===================================================================
function initTypoAnimations() {

  // ── Keyword → gradient map ──────────────────────────────────────
  // Three distinct gradient families matching the brand palette
  const KW = {
    // teal → blue  (primary brand action)
    'Trust':       'linear-gradient(90deg,#00d09c,#5367ff)',
    'Trusted':     'linear-gradient(90deg,#00d09c,#5367ff)',
    'Rate':        'linear-gradient(90deg,#00d09c,#5367ff)',
    'Rates':       'linear-gradient(90deg,#00d09c,#5367ff)',
    'Simple':      'linear-gradient(90deg,#00d09c,#5367ff)',
    'Easy':        'linear-gradient(90deg,#00d09c,#5367ff)',
    'Easily':      'linear-gradient(90deg,#00d09c,#5367ff)',
    'Guidance':    'linear-gradient(90deg,#00d09c,#5367ff)',
    'Customers':   'linear-gradient(90deg,#00d09c,#5367ff)',
    'Say':         'linear-gradient(90deg,#00d09c,#5367ff)',
    'AJ':          'linear-gradient(90deg,#00d09c,#5367ff)',
    'Comparison':  'linear-gradient(90deg,#00d09c,#5367ff)',
    'Smarter':     'linear-gradient(90deg,#00d09c,#5367ff)',
    // blue → purple (service / product words)
    'Finance':     'linear-gradient(90deg,#5367ff,#8b5cf6)',
    'Financial':   'linear-gradient(90deg,#5367ff,#8b5cf6)',
    'Decisions':   'linear-gradient(90deg,#5367ff,#8b5cf6)',
    'Eligibility': 'linear-gradient(90deg,#5367ff,#8b5cf6)',
    'EMI':         'linear-gradient(90deg,#5367ff,#8b5cf6)',
    'Beyond':      'linear-gradient(90deg,#8b5cf6,#5367ff)',
    'Full':        'linear-gradient(90deg,#8b5cf6,#5367ff)',
    // gold → coral (value / priority words)
    'Security':    'linear-gradient(90deg,#f5a623,#eb5b3c)',
    'Priority':    'linear-gradient(90deg,#f5a623,#eb5b3c)',
    'Free':        'linear-gradient(90deg,#f5a623,#eb5b3c)',
  };

  // ── Build word spans with gradient overlay for keywords ─────────
  function splitIntoWords(el, isTitle) {
    const raw    = el.textContent.trim();
    const tokens = raw.split(/(\s+)/);

    el.innerHTML = tokens.map(tok => {
      if (/^\s+$/.test(tok)) return ' ';
      const bare = tok.replace(/[^a-zA-Z0-9]/g, '');
      const grad = isTitle ? KW[bare] : null;

      if (grad) {
        // Single span — gradient applied via inline style by GSAP after slide lands
        return `<span class="txt-word"><span class="txt-inner is-kw" data-grad="${grad}">${tok}</span></span>`;
      }
      return `<span class="txt-word"><span class="txt-inner">${tok}</span></span>`;
    }).join('');

    return {
      inners:   Array.from(el.querySelectorAll('.txt-inner')),
      kwInners: Array.from(el.querySelectorAll('.txt-inner.is-kw')),
    };
  }

  // ── Section titles ───────────────────────────────────────────────
  const titleSelectors = [
    '.numbers-section .section-title',
    '.market-section .section-title',
    '.fin-services-section .section-title',
    '.products-section .section-title',
    '.tools-section .section-title',
    '.sip-section .section-title',
    '.eligibility-section .section-title',
    '.features-section .section-title',
    '.faq-section .section-title',
    '.apply-section .section-title',
    '.testimonials-section .section-title',
    '.about-section .section-title',
    '.cta-section h2',
  ].join(', ');

  document.querySelectorAll(titleSelectors).forEach(el => {
    const header = el.closest('.section-header, .cta-card');
    if (header) gsap.set(header, { opacity: 1, y: 0 });

    const { inners, kwInners } = splitIntoWords(el, true);
    gsap.set(inners, { y: '108%' });

    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter() {
        const slideDur   = 0.68;
        const slideStag  = 0.072;

        const tl = gsap.timeline();

        // 1) All words slide up in normal text color
        tl.to(inners, {
          y: '0%',
          duration: slideDur,
          stagger: slideStag,
          ease: 'power3.out',
        });

        if (kwInners.length) {
          // 2) After slide lands: apply gradient text + hide via clipPath
          tl.call(() => {
            kwInners.forEach(kw => {
              const grad = kw.dataset.grad;
              kw.style.background     = grad;
              kw.style.backgroundSize = '100% 100%';
              kw.style.webkitBackgroundClip = 'text';
              kw.style.backgroundClip       = 'text';
              kw.style.webkitTextFillColor  = 'transparent';
              gsap.set(kw, { clipPath: 'inset(0 100% 0 0 round 2px)' });
            });
          });

          // 3) Wipe gradient in left → right
          tl.to(kwInners, {
            clipPath: 'inset(0 0% 0 0 round 2px)',
            duration: 0.55,
            stagger: 0.12,
            ease: 'power2.inOut',
          }, '<0.02');

        }
      }
    });
  });

  // ── Section subtitles — word-by-word fade + lift ─────────────────
  const subSelectors = [
    '.numbers-section .section-subtitle',
    '.market-section .section-subtitle',
    '.fin-services-section .section-subtitle',
    '.products-section .section-subtitle',
    '.tools-section .section-subtitle',
    '.sip-section .section-subtitle',
    '.eligibility-section .section-subtitle',
    '.features-section .section-subtitle',
    '.faq-section .section-subtitle',
    '.apply-section .section-subtitle',
    '.testimonials-section .section-subtitle',
    '.about-section .section-subtitle',
    '.cta-section p',
  ].join(', ');

  document.querySelectorAll(subSelectors).forEach(el => {
    const { inners } = splitIntoWords(el, false);
    gsap.set(inners, { opacity: 0, y: 14 });

    ScrollTrigger.create({
      trigger: el,
      start: 'top 91%',
      once: true,
      onEnter() {
        gsap.to(inners, {
          opacity: 1,
          y: 0,
          duration: 0.38,
          stagger: 0.026,
          ease: 'power2.out',
          delay: 0.22,
        });
      }
    });
  });
}

// Call on load
window.addEventListener('load', initTypoAnimations, { once: true });
