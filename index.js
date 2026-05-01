document.addEventListener('DOMContentLoaded', () => {
    const THEME_KEY = 'dsa-theme';
    const DEFAULT_THEME = 'ocean';
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const skipIntro = new URLSearchParams(window.location.search).get('skipIntro') === '1';

    const introOverlay = document.getElementById('intro-overlay');
    const navItems = document.querySelectorAll('.nav-menu li[data-page]');
    const topMenuNavItems = document.querySelectorAll('.top-menu [data-page]');
    const themeSelect = document.getElementById('theme-select');
    const clickFxLayer = document.createElement('div');
    const pageTransitionOverlay = document.createElement('div');

    clickFxLayer.className = 'click-fx-layer';
    clickFxLayer.setAttribute('aria-hidden', 'true');
    document.body.appendChild(clickFxLayer);

    pageTransitionOverlay.className = 'page-transition-overlay';
    pageTransitionOverlay.setAttribute('aria-hidden', 'true');
    document.body.appendChild(pageTransitionOverlay);

    const spawnClickFx = (x, y) => {
        if (prefersReducedMotion) {
            return;
        }

        const core = document.createElement('span');
        core.className = 'click-fx-core';
        core.style.left = `${x}px`;
        core.style.top = `${y}px`;

        const ring = document.createElement('span');
        ring.className = 'click-fx-ring';
        ring.style.left = `${x}px`;
        ring.style.top = `${y}px`;

        clickFxLayer.appendChild(core);
        clickFxLayer.appendChild(ring);

        const particleCount = 8;
        const spread = 42 + Math.random() * 16;

        for (let index = 0; index < particleCount; index += 1) {
            const angle = (Math.PI * 2 * index) / particleCount + (Math.random() - 0.5) * 0.3;
            const distance = spread + Math.random() * 24;
            const particle = document.createElement('span');

            particle.className = 'click-fx-particle';
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            particle.style.setProperty('--tx', `${Math.cos(angle) * distance}px`);
            particle.style.setProperty('--ty', `${Math.sin(angle) * distance}px`);
            particle.style.setProperty('--size', `${4 + Math.random() * 3}px`);
            particle.style.setProperty('--delay', `${Math.random() * 45}ms`);

            clickFxLayer.appendChild(particle);

            particle.addEventListener('animationend', () => particle.remove(), { once: true });
        }

        [core, ring].forEach(node => {
            node.addEventListener('animationend', () => node.remove(), { once: true });
        });
    };

    const navigateTo = (targetPage) => {
        if (!targetPage) {
            return;
        }

        pageTransitionOverlay.classList.add('is-visible');

        window.setTimeout(() => {
            window.location.href = targetPage;
        }, prefersReducedMotion ? 0 : 180);
    };

    document.addEventListener('pointerdown', (event) => {
        if (event.button !== 0) {
            return;
        }

        spawnClickFx(event.clientX, event.clientY);
    });

    const normalizeTheme = (theme) => ['ocean', 'graphite', 'sand'].includes(theme) ? theme : DEFAULT_THEME;

    const applyTheme = (theme, persist = true) => {
        const normalized = normalizeTheme(theme);
        document.documentElement.setAttribute('data-theme', normalized);

        if (themeSelect && themeSelect.value !== normalized) {
            themeSelect.value = normalized;
        }

        if (persist) {
            localStorage.setItem(THEME_KEY, normalized);
        }
    };

    const todayDateNode = document.getElementById('today-date');
    if (todayDateNode) {
        const now = new Date();
        todayDateNode.innerHTML = `<i class="far fa-calendar"></i> ${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    }

    const savedTheme = normalizeTheme(localStorage.getItem(THEME_KEY) || DEFAULT_THEME);
    applyTheme(savedTheme, false);

    if (themeSelect) {
        themeSelect.addEventListener('change', () => {
            applyTheme(themeSelect.value, true);
        });
    }

    if (introOverlay) {
        if (skipIntro) {
            introOverlay.remove();
            window.history.replaceState({}, '', `${window.location.pathname}${window.location.hash}`);
        } else {
            const introDuration = prefersReducedMotion ? 350 : 2500;

            setTimeout(() => {
                introOverlay.classList.add('is-hidden');
                introOverlay.setAttribute('aria-hidden', 'true');

                // 动画结束后移除节点，避免遮挡与重排。
                setTimeout(() => {
                    introOverlay.remove();
                }, 720);
            }, introDuration);
        }
    }

    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const targetPage = this.getAttribute('data-page');
            navigateTo(targetPage);
        });
    });

    topMenuNavItems.forEach(item => {
        item.addEventListener('click', function(event) {
            event.preventDefault();
            const targetPage = this.getAttribute('data-page');
            navigateTo(targetPage);
        });
    });
});