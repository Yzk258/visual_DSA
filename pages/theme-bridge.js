(function () {
    const THEME_KEY = 'dsa-theme';
    const DEFAULT_THEME = 'ocean';
    const REDUCED_MOTION_QUERY = window.matchMedia('(prefers-reduced-motion: reduce)');
    const clickFxLayer = document.createElement('div');

    function normalizeTheme(theme) {
        return ['ocean', 'graphite', 'sand'].includes(theme) ? theme : DEFAULT_THEME;
    }

    function getPagesRootHref(targetFile) {
        const marker = '/pages/';
        const pathname = window.location.pathname.replace(/\\/g, '/');
        const markerIndex = pathname.lastIndexOf(marker);

        if (markerIndex === -1) {
            return `./${targetFile}`;
        }

        const tail = pathname.slice(markerIndex + marker.length);
        const depth = tail.split('/').filter(Boolean).length;

        if (depth <= 1) {
            return `./${targetFile}`;
        }

        return `${'../'.repeat(depth - 1)}${targetFile}`;
    }

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', normalizeTheme(theme));
    }

    function getHomeHref() {
        const marker = '/pages/';
        const pathname = window.location.pathname.replace(/\\/g, '/');
        const markerIndex = pathname.lastIndexOf(marker);

        if (markerIndex === -1) {
            return '../index.html';
        }

        const tail = pathname.slice(markerIndex + marker.length);
        const depth = tail.split('/').filter(Boolean).length;
        return `${'../'.repeat(depth)}index.html`;
    }

    function spawnClickFx(x, y) {
        if (REDUCED_MOTION_QUERY.matches) {
            return;
        }

        const core = document.createElement('span');
        core.className = 'sub-click-fx-core';
        core.style.left = `${x}px`;
        core.style.top = `${y}px`;

        const ring = document.createElement('span');
        ring.className = 'sub-click-fx-ring';
        ring.style.left = `${x}px`;
        ring.style.top = `${y}px`;

        clickFxLayer.appendChild(core);
        clickFxLayer.appendChild(ring);

        const particleCount = 7;
        const spread = 34 + Math.random() * 14;

        for (let index = 0; index < particleCount; index += 1) {
            const angle = (Math.PI * 2 * index) / particleCount + (Math.random() - 0.5) * 0.26;
            const distance = spread + Math.random() * 20;
            const particle = document.createElement('span');

            particle.className = 'sub-click-fx-particle';
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            particle.style.setProperty('--tx', `${Math.cos(angle) * distance}px`);
            particle.style.setProperty('--ty', `${Math.sin(angle) * distance}px`);
            particle.style.setProperty('--size', `${3 + Math.random() * 3}px`);
            particle.style.setProperty('--delay', `${Math.random() * 40}ms`);

            clickFxLayer.appendChild(particle);
            particle.addEventListener('animationend', () => particle.remove(), { once: true });
        }

        [core, ring].forEach((node) => {
            node.addEventListener('animationend', () => node.remove(), { once: true });
        });
    }

    function setupClickFx() {
        clickFxLayer.className = 'sub-click-fx-layer';
        clickFxLayer.setAttribute('aria-hidden', 'true');
        document.body.appendChild(clickFxLayer);

        document.addEventListener('pointerdown', (event) => {
            if (event.button !== 0) {
                return;
            }

            spawnClickFx(event.clientX, event.clientY);
        });
    }

    function createSubpageNav() {
        const nav = document.createElement('header');
        nav.className = 'subpage-nav';

        const brand = document.createElement('a');
        brand.className = 'subpage-nav__brand';
        brand.href = `${getHomeHref()}?skipIntro=1`;

        const brandIcon = document.createElement('i');
        brandIcon.className = 'fas fa-map-signs';

        const brandText = document.createElement('span');
        brandText.textContent = 'Visual DSA Lab';

        brand.appendChild(brandIcon);
        brand.appendChild(brandText);

        const context = document.createElement('div');
        context.className = 'subpage-nav__context';

        const eyebrow = document.createElement('span');
        eyebrow.className = 'subpage-nav__eyebrow';
        eyebrow.textContent = 'Subpage Explorer';

        const title = document.createElement('strong');
        title.className = 'subpage-nav__title';
        title.textContent = document.title.replace(/\s*\|\s*Visualizer\s*$/i, '') || 'Visual DSA';

        context.appendChild(eyebrow);
        context.appendChild(title);

        const links = document.createElement('nav');
        links.className = 'subpage-nav__links';

        const guideLink = document.createElement('a');
        guideLink.className = 'subpage-nav__link';
        guideLink.href = getPagesRootHref('home.html');
        guideLink.innerHTML = '<i class="fas fa-map-signs"></i><span>导览</span>';

        const docsLink = document.createElement('a');
        docsLink.className = 'subpage-nav__link';
        docsLink.href = getPagesRootHref('docs.html');
        docsLink.innerHTML = '<i class="fas fa-book"></i><span>文档</span>';

        const returnLink = document.createElement('a');
        returnLink.className = 'subpage-nav__link subpage-nav__link--primary';
        returnLink.href = `${getHomeHref()}?skipIntro=1`;
        returnLink.innerHTML = '<i class="fas fa-arrow-left"></i><span>返回主页</span>';

        links.appendChild(guideLink);
        links.appendChild(docsLink);
        links.appendChild(returnLink);

        nav.appendChild(brand);
        nav.appendChild(context);
        nav.appendChild(links);

        document.body.prepend(nav);
    }

    function createEnterOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'page-launch-overlay';
        overlay.setAttribute('aria-hidden', 'true');

        const frame = document.createElement('div');
        frame.className = 'page-launch-overlay__frame';

        const title = document.createElement('div');
        title.className = 'page-launch-overlay__title';

        const eyebrow = document.createElement('span');
        eyebrow.className = 'page-launch-overlay__eyebrow';
        eyebrow.textContent = 'Module Open';

        const heading = document.createElement('strong');
        heading.className = 'page-launch-overlay__heading';
        heading.textContent = document.title.replace(/\s*\|\s*Visualizer\s*$/i, '') || 'Visual DSA';

        const line = document.createElement('span');
        line.className = 'page-launch-overlay__line';

        const meter = document.createElement('span');
        meter.className = 'page-launch-overlay__meter';

        title.appendChild(eyebrow);
        title.appendChild(heading);
        title.appendChild(line);
        title.appendChild(meter);

        frame.appendChild(title);
        overlay.appendChild(frame);
        document.body.appendChild(overlay);

        requestAnimationFrame(() => {
            overlay.classList.add('is-visible');
        });

        window.setTimeout(() => {
            overlay.classList.add('is-hiding');
            window.setTimeout(() => overlay.remove(), 720);
        }, 920);
    }

    function initSubpage() {
        if (!document.body) {
            return;
        }

        createSubpageNav();
        setupClickFx();

        if (!REDUCED_MOTION_QUERY.matches) {
            createEnterOverlay();
        }
    }

    applyTheme(localStorage.getItem(THEME_KEY) || DEFAULT_THEME);

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSubpage, { once: true });
    } else {
        initSubpage();
    }

    window.addEventListener('message', (event) => {
        if (!event || !event.data || event.data.type !== 'dsa-theme') {
            return;
        }
        applyTheme(event.data.theme);
    });
})();
