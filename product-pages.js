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
