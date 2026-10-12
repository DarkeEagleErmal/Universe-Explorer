/* =========================================================
   UNIVERSE EXPLORER — CINEMATIC HOMEPAGE
   ========================================================= */

export class Homepage {
  constructor(options = {}) {
    this.root = options.root || document.querySelector('#app');
    this.onExplore = options.onExplore || (() => {});

    this.isVisible = true;
    this.handleKeydown = this.handleKeydown.bind(this);

    if (!this.root) {
      throw new Error('Homepage: elemento #app non trovato.');
    }

    this.render();
    this.bindEvents();
  }

  /* -------------------------------------------------------
     RENDER HOMEPAGE
     ------------------------------------------------------- */

  render() {
    this.root.insertAdjacentHTML('beforeend', `
      <main class="homepage" id="homepage">
        <div class="homepage__vignette" aria-hidden="true"></div>
        <div class="homepage__grid" aria-hidden="true"></div>

        <header class="site-header">
          <a class="site-logo" href="#home" aria-label="Universe Explorer home">
            <span class="site-logo__symbol" aria-hidden="true">
              <svg viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="5" fill="currentColor"/>
                <ellipse cx="24" cy="24" rx="20" ry="8"
                  stroke="currentColor" stroke-width="1.5"
                  transform="rotate(-35 24 24)"/>
                <ellipse cx="24" cy="24" rx="20" ry="8"
                  stroke="currentColor" stroke-width="1.2"
                  transform="rotate(35 24 24)" opacity=".5"/>
              </svg>
            </span>

            <span class="site-logo__text">
              <strong>UNIVERSE</strong>
              <span>EXPLORER</span>
            </span>
          </a>

          <nav class="site-nav" aria-label="Navigazione principale">
            <a class="site-nav__link is-active" href="#home">Home</a>
            <button class="site-nav__link" type="button"
              data-action="explore">Explore</button>
            <a class="site-nav__link" href="#discover">Discover</a>
            <a class="site-nav__link" href="#learn">Learn</a>
          </nav>

          <button class="menu-toggle" type="button"
            aria-label="Apri menu" aria-expanded="false">
            <span></span>
            <span></span>
          </button>
        </header>

        <section class="hero" id="home" aria-labelledby="hero-title">
          <div class="hero__content">
            <div class="hero__eyebrow">
              <span class="hero__eyebrow-line"></span>
              <span>YOUR JOURNEY BEGINS HERE</span>
            </div>

            <h1 class="hero__title" id="hero-title">
              <span>UNIVERSE</span>
              <span class="hero__title-outline">EXPLORER</span>
            </h1>

            <p class="hero__description">
              Un viaggio interattivo nei confini dello spazio conosciuto.
              Esplora pianeti, stelle, buchi neri e galassie con una
              precisione scientifica senza precedenti.
            </p>

            <div class="hero__actions">
              <button class="explore-button" type="button"
                data-action="explore">
                <span class="explore-button__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h13M12 5l7 7-7 7"
                      stroke="currentColor" stroke-width="1.7"
                      stroke-linecap="round"
                      stroke-linejoin="round"/>
                  </svg>
                </span>
                <span>EXPLORE</span>
                <span class="explore-button__shine"></span>
              </button>

              <div class="hero__hint">
                <span class="hero__hint-dot"></span>
                <span>INFINITE POSSIBILITIES</span>
              </div>
            </div>
          </div>

          <div class="hero__coordinates" aria-hidden="true">
            <span>GALACTIC COORDINATES</span>
            <span>RA 17h 45m 40s</span>
            <span>DEC −29° 00′ 28″</span>
          </div>

          <div class="hero__side-label" aria-hidden="true">
            EXPLORE THE UNKNOWN
          </div>

          <div class="hero__scroll" aria-hidden="true">
            <span class="hero__scroll-line"></span>
            <span>SCROLL TO EXPLORE</span>
          </div>
        </section>

        <footer class="site-footer">
          <div class="site-footer__status">
            <span class="status-dot"></span>
            <span>EXPLORATION SYSTEM ONLINE</span>
          </div>

          <div class="site-footer__center">
            A JOURNEY BEYOND THE KNOWN
          </div>

          <div class="site-footer__right">
            <span>UNIVERSE EXPLORER</span>
            <span class="site-footer__version">v1.0</span>
          </div>
        </footer>

        <div class="homepage__loading" aria-hidden="true">
          <span class="homepage__loading-ring"></span>
        </div>
      </main>
    `);

    this.element = this.root.querySelector('#homepage');
    this.menuToggle = this.element.querySelector('.menu-toggle');
    this.navigation = this.element.querySelector('.site-nav');

    this.addHomepageStyles();
  }

  /* -------------------------------------------------------
     HOMEPAGE STYLES
     ------------------------------------------------------- */

  addHomepageStyles() {
    if (document.querySelector('#homepage-styles')) return;

    const style = document.createElement('style');
    style.id = 'homepage-styles';

    style.textContent = `
      .homepage {
        position: absolute;
        inset: 0;
        z-index: 5;
        min-height: 100vh;
        overflow: hidden;
        color: #f4f8ff;
        font-family: "Exo 2", sans-serif;
        background:
          radial-gradient(ellipse at 72% 40%,
            rgba(42, 68, 153, .18), transparent 40%),
          radial-gradient(ellipse at 82% 70%,
            rgba(103, 45, 178, .16), transparent 38%),
          linear-gradient(90deg,
            rgba(2, 4, 11, .9) 0%,
            rgba(2, 4, 11, .64) 46%,
            rgba(2, 4, 11, .1) 100%);
        transition: opacity .9s ease, visibility .9s ease;
      }

      .homepage.is-hidden {
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
      }

      .homepage__vignette {
        position: absolute;
        inset: 0;
        pointer-events: none;
        background:
          linear-gradient(180deg,
            rgba(2, 4, 11, .62), transparent 25%,
            transparent 72%, rgba(2, 4, 11, .8)),
          linear-gradient(90deg,
            rgba(2, 4, 11, .45), transparent 75%);
      }

      .homepage__grid {
        position: absolute;
        inset: 0;
        pointer-events: none;
        opacity: .13;
        background-image:
          linear-gradient(rgba(90, 145, 230, .12) 1px,
            transparent 1px),
          linear-gradient(90deg,
            rgba(90, 145, 230, .12) 1px, transparent 1px);
        background-size: 80px 80px;
        mask-image: linear-gradient(transparent, black 20%, transparent);
      }

      .site-header {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        z-index: 3;
        min-height: 92px;
        padding: 22px clamp(22px, 5vw, 84px);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 32px;
        border-bottom: 1px solid rgba(133, 177, 255, .12);
      }

      .site-logo {
        display: inline-flex;
        align-items: center;
        gap: 12px;
        color: #fff;
        text-decoration: none;
      }

      .site-logo__symbol {
        display: block;
        width: 42px;
        height: 42px;
        color: #66baff;
        filter: drop-shadow(0 0 9px rgba(65, 165, 255, .5));
      }

      .site-logo__symbol svg {
        width: 100%;
        height: 100%;
      }

      .site-logo__text {
        display: flex;
        flex-direction: column;
        font-family: "Orbitron", sans-serif;
        font-size: .7rem;
        line-height: 1.65;
        letter-spacing: .16em;
      }

      .site-logo__text strong {
        font-weight: 700;
      }

      .site-logo__text span {
        color: #83bfff;
        font-size: .61rem;
        letter-spacing: .29em;
      }

      .site-nav {
        display: flex;
        align-items: center;
        gap: clamp(18px, 3vw, 48px);
      }

      .site-nav__link {
        position: relative;
        padding: 8px 0;
        color: rgba(224, 235, 255, .7);
        background: transparent;
        border: 0;
        font-family: "Orbitron", sans-serif;
        font-size: .67rem;
        letter-spacing: .12em;
        text-transform: uppercase;
        text-decoration: none;
        cursor: pointer;
        transition: color .25s ease;
      }

      .site-nav__link::after {
        content: "";
        position: absolute;
        left: 0;
        bottom: 0;
        width: 0;
        height: 1px;
        background: #63baff;
        box-shadow: 0 0 10px #348cff;
        transition: width .25s ease;
      }

      .site-nav__link:hover,
      .site-nav__link.is-active {
        color: #fff;
      }

      .site-nav__link:hover::after,
      .site-nav__link.is-active::after {
        width: 100%;
      }

      .menu-toggle {
        display: none;
        width: 42px;
        height: 42px;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 6px;
        border: 1px solid rgba(112, 169, 255, .3);
        background: rgba(8, 16, 36, .7);
        cursor: pointer;
      }

      .menu-toggle span {
        width: 18px;
        height: 1px;
        background: #b9d9ff;
      }

      .hero {
        position: relative;
        display: flex;
        align-items: center;
        min-height: 100vh;
        padding: 135px clamp(22px, 9vw, 150px) 125px;
      }

      .hero__content {
        position: relative;
        z-index: 2;
        width: min(100%, 860px);
        animation: hero-arrive 1.2s cubic-bezier(.2,.7,.2,1) both;
      }

      .hero__eyebrow {
        display: flex;
        align-items: center;
        gap: 14px;
        margin-bottom: 30px;
        color: #80c6ff;
        font-family: "Orbitron", sans-serif;
        font-size: .7rem;
        letter-spacing: .24em;
      }

      .hero__eyebrow-line {
        width: 42px;
        height: 1px;
        background: #54aaff;
        box-shadow: 0 0 12px #288cff;
      }

      .hero__title {
        display: flex;
        flex-direction: column;
        margin: 0 0 25px;
        font-family: "Orbitron", sans-serif;
        font-size: clamp(3rem, 8.4vw, 8.5rem);
        font-weight: 800;
        letter-spacing: -.055em;
        line-height: .98;
        text-shadow: 0 5px 45px rgba(0, 0, 0, .38);
      }

      .hero__title > span {
        white-space: nowrap;
      }

      .hero__title-outline {
        color: transparent;
        -webkit-text-stroke: 1px rgba(168, 204, 255, .92);
        text-shadow: 0 0 35px rgba(52, 133, 255, .13);
      }

      .hero__description {
        max-width: 560px;
        margin: 0 0 35px;
        color: rgba(219, 230, 250, .78);
        font-size: clamp(.95rem, 1.3vw, 1.1rem);
        font-weight: 300;
        line-height: 1.9;
      }

      .hero__actions {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 26px;
      }

      .explore-button {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 17px;
        min-width: 200px;
        min-height: 58px;
        padding: 15px 24px;
        overflow: hidden;
        border: 1px solid rgba(127, 196, 255, .8);
        border-radius: 2px;
        color: #fff;
        background: linear-gradient(110deg,
          rgba(22, 104, 226, .95),
          rgba(88, 71, 210, .92));
        box-shadow:
          0 0 24px rgba(39, 113, 255, .2),
          inset 0 1px rgba(255, 255, 255, .2);
        font-family: "Orbitron", sans-serif;
        font-size: .75rem;
        font-weight: 600;
        letter-spacing: .17em;
        cursor: pointer;
        transition: transform .3s ease, box-shadow .3s ease;
      }

      .explore-button:hover {
        transform: translateY(-3px);
        box-shadow:
          0 0 30px rgba(39, 113, 255, .4),
          0 0 60px rgba(83, 72, 255, .16);
      }

      .explore-button__icon {
        display: grid;
        place-items: center;
        width: 24px;
        height: 24px;
      }

      .explore-button__icon svg {
        width: 100%;
        height: 100%;
      }

      .explore-button__shine {
        position: absolute;
        top: -50%;
        left: -70%;
        width: 35%;
        height: 200%;
        transform: rotate(25deg);
        background: rgba(255, 255, 255, .16);
        transition: left .7s ease;
      }

      .explore-button:hover .explore-button__shine {
        left: 130%;
      }

      .hero__hint {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        color: rgba(190, 208, 239, .63);
        font-family: "Orbitron", sans-serif;
        font-size: .58rem;
        letter-spacing: .13em;
      }

      .hero__hint-dot,
      .status-dot {
        width: 6px;
        height: 6px;
        flex: 0 0 auto;
        border-radius: 50%;
        background: #69c6ff;
        box-shadow: 0 0 12px rgba(65, 165, 255, .8);
      }

      .hero__coordinates {
        position: absolute;
        right: clamp(22px, 5vw, 84px);
        bottom: 145px;
        display: flex;
        flex-direction: column;
        gap: 6px;
        color: rgba(173, 197, 232, .55);
        font-family: "Orbitron", sans-serif;
        font-size: .56rem;
        letter-spacing: .11em;
        text-align: right;
      }

      .hero__coordinates span:first-child {
        margin-bottom: 5px;
        color: #7ebaff;
      }

      .hero__side-label {
        position: absolute;
        top: 50%;
        right: 24px;
        color: rgba(156, 190, 237, .42);
        font-family: "Orbitron", sans-serif;
        font-size: .54rem;
        letter-spacing: .28em;
        writing-mode: vertical-rl;
        transform: translateY(-50%);
      }

      .hero__scroll {
        position: absolute;
        left: clamp(22px, 5vw, 84px);
        bottom: 45px;
        display: flex;
        align-items: center;
        gap: 14px;
        color: rgba(188, 209, 241, .54);
        font-family: "Orbitron", sans-serif;
        font-size: .55rem;
        letter-spacing: .18em;
      }

      .hero__scroll-line {
        position: relative;
        display: block;
        width: 36px;
        height: 1px;
        overflow: hidden;
        background: rgba(122, 179, 255, .35);
      }

      .hero__scroll-line::after {
        content: "";
        position: absolute;
        inset: 0;
        background: #79c5ff;
        animation: scroll-line 2s ease-in-out infinite;
      }

      .site-footer {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 3;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
        min-height: 65px;
        padding: 15px clamp(22px, 5vw, 84px);
        border-top: 1px solid rgba(133, 177, 255, .12);
        background: rgba(2, 4, 11, .22);
        color: rgba(173, 197, 232, .52);
        font-family: "Orbitron", sans-serif;
        font-size: .53rem;
        letter-spacing: .12em;
      }

      .site-footer__status,
      .site-footer__right {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .site-footer__center {
        text-align: center;
      }

      .site-footer__version {
        color: #77bfff;
      }

      @keyframes hero-arrive {
        from {
          opacity: 0;
          transform: translateY(24px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes scroll-line {
        0% { transform: translateX(-100%); }
        50%, 100% { transform: translateX(100%); }
      }

      @media (max-width: 900px) {
        .site-header {
          min-height: 78px;
        }

        .site-nav {
          gap: 20px;
        }

        .site-nav__link {
          font-size: .59rem;
        }

        .hero {
          padding-left: 7vw;
          padding-right: 7vw;
        }

        .hero__coordinates {
          bottom: 115px;
        }

        .site-footer__center {
          display: none;
        }
      }

      @media (max-width: 650px) {
        .site-header {
          min-height: 72px;
          padding: 15px 22px;
        }

        .site-logo__symbol {
          width: 36px;
          height: 36px;
        }

        .menu-toggle {
          display: flex;
        }

        .site-nav {
          position: absolute;
          top: calc(100% + 1px);
          left: 0;
          right: 0;
          display: none;
          align-items: stretch;
          gap: 0;
          padding: 10px 22px 20px;
          border-bottom: 1px solid rgba(133, 177, 255, .2);
          background: rgba(3, 7, 18, .97);
          backdrop-filter: blur(18px);
        }

        .site-nav.is-open {
          display: flex;
          flex-direction: column;
        }

        .site-nav__link {
          padding: 15px 0;
          text-align: left;
          font-size: .7rem;
        }

        .site-nav__link::after {
          bottom: 7px;
        }

        .hero {
          min-height: 100svh;
          align-items: center;
          padding: 125px 22px 155px;
        }

        .hero__eyebrow {
          gap: 10px;
          margin-bottom: 24px;
          font-size: .55rem;
          letter-spacing: .16em;
        }

        .hero__eyebrow-line {
          width: 25px;
        }

        .hero__title {
          font-size: clamp(2.55rem, 12vw, 5rem);
          letter-spacing: -.06em;
        }

        .hero__description {
          max-width: 440px;
          font-size: .94rem;
          line-height: 1.75;
        }

        .hero__actions {
          align-items: flex-start;
          flex-direction: column;
          gap: 18px;
        }

        .explore-button {
          min-width: 185px;
          min-height: 54px;
        }

        .hero__coordinates,
        .hero__side-label {
          display: none;
        }

        .hero__scroll {
          bottom: 82px;
          left: 22px;
        }

        .site-footer {
          min-height: 56px;
          padding: 12px 22px;
          font-size: .47rem;
        }

        .site-footer__right {
          gap: 6px;
        }
      }

      @media (max-width: 380px) {
        .hero__title {
          font-size: 2.3rem;
        }

        .hero__description {
          font-size: .88rem;
        }

        .site-footer__status {
          font-size: .42rem;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .hero__content {
          animation: none;
        }

        .hero__scroll-line::after {
          animation: none;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /* -------------------------------------------------------
     EVENT BINDING
     ------------------------------------------------------- */

  bindEvents() {
    this.element.addEventListener('click', (event) => {
      const action = event.target.closest('[data-action]');

      if (action?.dataset.action === 'explore') {
        this.explore();
      }

      const anchor = event.target.closest('a[href^="#"]');

      if (anchor) {
        const href = anchor.getAttribute('href');

        if (href === '#discover' || href === '#learn') {
          event.preventDefault();

          this.showNotice(
            href === '#discover'
              ? 'La sezione Discover sarà disponibile in una prossima fase.'
              : 'La sezione Learn sarà disponibile in una prossima fase.'
          );
        }
      }
    });

    this.menuToggle.addEventListener('click', () => {
      const open = this.navigation.classList.toggle('is-open');

      this.menuToggle.setAttribute(
        'aria-expanded',
        String(open)
      );

      this.menuToggle.setAttribute(
        'aria-label',
        open ? 'Chiudi menu' : 'Apri menu'
      );
    });

    document.addEventListener('keydown', this.handleKeydown);
  }

  handleKeydown(event) {
    if (event.key === 'Escape') {
      this.navigation.classList.remove('is-open');
      this.menuToggle.setAttribute('aria-expanded', 'false');
    }
  }

  /* -------------------------------------------------------
     EXPLORE ACTION
     ------------------------------------------------------- */

  explore() {
    if (!this.isVisible) return;

    this.isVisible = false;
    this.element.classList.add('is-hidden');

    this.onExplore();

    window.dispatchEvent(
      new CustomEvent('universe:explore')
    );
  }

  /* -------------------------------------------------------
     NOTIFICATIONS
     ------------------------------------------------------- */

  showNotice(message) {
    let notice = this.element.querySelector('.homepage-notice');

    if (!notice) {
      notice = document.createElement('div');
      notice.className = 'homepage-notice';

      Object.assign(notice.style, {
        position: 'absolute',
        left: '50%',
        bottom: '90px',
        zIndex: '10',
        maxWidth: 'calc(100% - 40px)',
        padding: '14px 20px',
        transform: 'translateX(-50%)',
        border: '1px solid rgba(112,169,255,.4)',
        background: 'rgba(5,12,30,.95)',
        color: '#dcecff',
        fontSize: '13px',
        textAlign: 'center',
        boxShadow: '0 0 30px rgba(40,120,255,.15)'
      });

      this.element.appendChild(notice);
    }

    notice.textContent = message;
    notice.hidden = false;

    clearTimeout(this.noticeTimeout);

    this.noticeTimeout = setTimeout(() => {
      notice.hidden = true;
    }, 3500);
  }

  /* -------------------------------------------------------
     PUBLIC API
     ------------------------------------------------------- */

  show() {
    this.isVisible = true;
    this.element.classList.remove('is-hidden');
  }

  hide() {
    this.isVisible = false;
    this.element.classList.add('is-hidden');
  }

  destroy() {
    clearTimeout(this.noticeTimeout);
    document.removeEventListener('keydown', this.handleKeydown);
    this.element?.remove();
  }
}

export default Homepage;
