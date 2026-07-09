import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import LoginModal from './LoginModal';

const JERSEYS = [
  {
    team: 'Argentina',
    ghost: 'ARGENTINA',
    season: '2026',
    type: 'Home',
    src: '/images/messi.png',
    bg: '#43A1D5',
    panel: '#2C7FB3',
    chipBg: '#F6B40E',
    chipText: '#000000',
    shadowHex: '#F6B40E',
    importance: 'Represents the defending World Champions looking to retain their title in North America. Features the iconic three stars celebrating their historic 2022 victory.',
    importantDate: 'June 14, 2026 - MetLife Stadium'
  },
  {
    team: 'Real Madrid',
    ghost: 'REAL MADRID',
    season: '2016 / 17',
    type: 'Home',
    src: '/images/ronaldo.png',
    bg: '#5A458D',
    panel: '#3B2C63',
    chipBg: '#FFFFFF',
    chipText: '#5A458D',
    shadowHex: '#FFFFFF',
    importance: 'Worn during a historic season where the club secured both the La Liga title and the UEFA Champions League. This jersey is immortalized by their dominant run under Zinedine Zidane.',
    importantDate: 'May 14, 2017 - Santiago Bernabéu'
  },
  {
    team: 'Brazil',
    ghost: 'BRAZIL',
    season: '2023',
    type: 'Home',
    src: '/images/neymar.png',
    bg: '#FFDC02',
    panel: '#E5C600',
    chipBg: '#19AE47',
    chipText: '#FFFFFF',
    shadowHex: '#19AE47',
    importance: 'A vibrant return to the classic canary yellow, symbolizing a new era of Brazilian football. It carries the weight of a nation eager to reclaim international glory.',
    importantDate: 'September 8, 2023 - Mangueirão Stadium'
  },
  {
    team: 'France',
    ghost: 'FRANCE',
    season: '2022',
    type: 'Home',
    src: '/images/mbappe.png',
    bg: '#002654',
    panel: '#001530',
    chipBg: '#D4AF37',
    chipText: '#001530',
    shadowHex: '#D4AF37',
    importance: 'The kit worn during their dramatic run to the World Cup Final in Qatar. Known for its elegant deep navy base and metallic gold accents honoring their status as then-defending champions.',
    importantDate: 'December 18, 2022 - Lusail Stadium'
  },
  {
    team: 'Manchester City',
    ghost: 'MAN CITY',
    season: '2025 / 26',
    type: 'Home',
    src: '/images/halland.png',
    bg: '#6CABDD',
    panel: '#5595C8',
    chipBg: '#FFFFFF',
    chipText: '#001838',
    shadowHex: '#FFFFFF',
    importance: "Marks a continuation of domestic dominance with a modern take on the traditional sky blue. The design reflects a tactical evolution under Pep Guardiola's ongoing legacy.",
    importantDate: 'May 24, 2026 - Etihad Stadium'
  }
];

function getRoleStyle(role, isMobile) {
  switch (role) {
    case 'center':
      return {
        left:      '50%',
        bottom:    isMobile ? '18%'  : '0',
        height:    isMobile ? '62%'  : '90%',
        transform: `translateX(-50%) scale(${isMobile ? 1.22 : 1.6})`,
        filter:    'blur(0px)',
        opacity:   1,
        zIndex:    20,
      };
    case 'left':
      return {
        left:      isMobile ? '18%'  : '28%',
        bottom:    isMobile ? '28%'  : '10%',
        height:    isMobile ? '18%'  : '30%',
        transform: 'translateX(-50%) scale(1)',
        filter:    'blur(2px)',
        opacity:   0.80,
        zIndex:    10,
      };
    case 'right':
      return {
        left:      isMobile ? '82%'  : '72%',
        bottom:    isMobile ? '28%'  : '10%',
        height:    isMobile ? '18%'  : '30%',
        transform: 'translateX(-50%) scale(1)',
        filter:    'blur(2px)',
        opacity:   0.80,
        zIndex:    10,
      };
    case 'hidden':
      return {
        left:      '50%',
        bottom:    isMobile ? '28%'  : '10%',
        height:    isMobile ? '18%'  : '30%',
        transform: 'translateX(-50%) scale(0.5)',
        filter:    'blur(4px)',
        opacity:   0,
        zIndex:    0,
      };
  }
}

export default function VexorHero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [showLogin, setShowLogin] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const location = useLocation();
  const routerNavigate = useNavigate();
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  useEffect(() => {
    if (location.state?.authWarning) {
      setShowWarning(true);
      // Clear the state so it doesn't trigger on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    JERSEYS.forEach(j => { const img = new Image(); img.src = j.src; });
  }, []);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  function navigate(dir) {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex(prev =>
      dir === 'next'
        ? (prev + 1) % JERSEYS.length
        : (prev + JERSEYS.length - 1) % JERSEYS.length
    );
    setTimeout(() => setIsAnimating(false), 650);
  }

  const center = activeIndex;
  const right  = (activeIndex + 1) % JERSEYS.length;
  const left   = (activeIndex + JERSEYS.length - 1) % JERSEYS.length;

  function getRole(index) {
    if (index === center) return 'center';
    if (index === right)  return 'right';
    if (index === left)   return 'left';
    return 'hidden';
  }

  return (
    <div
      style={{
        backgroundColor: JERSEYS[activeIndex].bg,
        transition: 'background-color 650ms cubic-bezier(0.4, 0, 0.2, 1)',
        fontFamily: "'Barlow', sans-serif",
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
        
        {/* Layer 1: Panel vignette gradient */}
        <div
          style={{
            position: 'absolute', inset: 0, zIndex: 1,
            background: `radial-gradient(ellipse 80% 80% at 50% 100%, ${JERSEYS[activeIndex].panel}CC 0%, transparent 70%)`,
            transition: 'background 650ms cubic-bezier(0.4,0,0.2,1)',
            pointerEvents: 'none',
          }}
        />

        {/* Layer 2: Grain overlay */}
        <div
          style={{
            position: 'absolute', inset: 0, zIndex: 2,
            pointerEvents: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.07'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
            opacity: 0.35,
          }}
        />

        {/* Layer 3: Giant ghost watermark */}
        <div
          style={{
            position: 'absolute', inset: '0 0 auto 0', zIndex: 3,
            top: '12%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            pointerEvents: 'none', userSelect: 'none',
          }}
        >
          <span
            key={activeIndex}
            style={{
              fontFamily: "'Bebas Neue', 'Trade Gothic Bold', sans-serif",
              fontSize: 'clamp(72px, 24vw, 320px)',
              fontWeight: 900,
              color: 'rgba(255,255,255,0.10)',
              lineHeight: 1,
              letterSpacing: '-0.03em',
              whiteSpace: 'nowrap',
              textTransform: 'uppercase',
              animation: 'ghostFadeIn 400ms ease forwards',
            }}
          >
            {JERSEYS[activeIndex].ghost}
          </span>
        </div>

        {/* Layer 4: Carousel */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 4 }}>
          {JERSEYS.map((jersey, i) => {
            const role = getRole(i);
            const style = getRoleStyle(role, isMobile);
            return (
              <div
                key={jersey.team}
                style={{
                  position: 'absolute',
                  aspectRatio: '0.55 / 1',
                  transition: [
                    'transform 650ms cubic-bezier(0.4,0,0.2,1)',
                    'filter 650ms cubic-bezier(0.4,0,0.2,1)',
                    'opacity 650ms cubic-bezier(0.4,0,0.2,1)',
                    'left 650ms cubic-bezier(0.4,0,0.2,1)',
                    'height 650ms cubic-bezier(0.4,0,0.2,1)',
                    'bottom 650ms cubic-bezier(0.4,0,0.2,1)',
                  ].join(', '),
                  willChange: 'transform, filter, opacity, left',
                  ...style,
                }}
              >
                <img
                  src={jersey.src}
                  alt={jersey.team}
                  draggable={false}
                  style={{
                    width: '100%', height: '100%',
                    objectFit: 'contain',
                    objectPosition: 'bottom center',
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Layer 5: Bottom dark gradient */}
        <div
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 5,
            height: '45%',
            background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Header */}
        <header style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 65, height: '80px', backgroundColor: '#FFFFFF', borderBottom: '2px solid #000000', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: isMobile ? '0 1rem' : '0 2rem' }}>
          <img src="/src/assets/horizontal_black.png" alt="Vexor Logo" style={{ height: '40px', objectFit: 'contain' }} />
          {isAuthenticated ? (
            <button 
              onClick={() => routerNavigate('/dashboard')}
              style={{ width: '44px', height: '44px', backgroundColor: '#000000', border: 'none', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background-color 200ms', borderRadius: 0, boxShadow: '4px 4px 0px #E5E5E5' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#FF5500'; e.currentTarget.style.boxShadow = '6px 6px 0px #000000'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#000000'; e.currentTarget.style.boxShadow = '4px 4px 0px #E5E5E5'; }}
              title="Go to Dashboard"
            >
              <span className="material-symbols-outlined">account_circle</span>
            </button>
          ) : (
            <button 
              onClick={() => setShowLogin(true)}
              style={{ width: '44px', height: '44px', backgroundColor: '#000000', border: 'none', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background-color 200ms', borderRadius: 0, boxShadow: '4px 4px 0px #E5E5E5' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#FF5500'; e.currentTarget.style.boxShadow = '6px 6px 0px #000000'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#000000'; e.currentTarget.style.boxShadow = '4px 4px 0px #E5E5E5'; }}
              title="Login"
            >
              <span className="material-symbols-outlined">login</span>
            </button>
          )}
        </header>

        {/* Auth Warning Banner */}
        {showWarning && (
          <div style={{
            position: 'absolute', top: '90px', left: '50%', transform: 'translateX(-50%)', zIndex: 100,
            backgroundColor: '#DC2626', color: '#FFFFFF', padding: '12px 24px',
            fontFamily: "'Bebas Neue', 'Trade Gothic Bold', sans-serif", fontSize: '1.2rem',
            border: '2px solid #000000', boxShadow: '4px 4px 0px #000000',
            display: 'flex', alignItems: 'center', gap: '12px', textTransform: 'uppercase'
          }}>
            <span className="material-symbols-outlined">warning</span>
            Secure Area: Please log in to continue
            <button onClick={() => setShowWarning(false)} style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer', marginLeft: '12px', display: 'flex', alignItems: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>close</span>
            </button>
          </div>
        )}

        <div style={{ position: 'absolute', top: '6rem', right: isMobile ? '1rem' : '2rem', zIndex: 60, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
          <span
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: '0.7rem',
              fontWeight: 800,
              letterSpacing: '0.22em',
              color: '#FFFFFF',
              opacity: 0.6,
              textTransform: 'uppercase',
            }}
          >
            {String(activeIndex + 1).padStart(2, '0')} / {String(JERSEYS.length).padStart(2, '0')}
          </span>
          <div style={{ width: '80px', height: '2px', backgroundColor: 'rgba(255,255,255,0.25)', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${((activeIndex + 1) / JERSEYS.length) * 100}%`, backgroundColor: '#FFFFFF', transition: 'width 650ms cubic-bezier(0.4,0,0.2,1)' }} />
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: isMobile ? '1.5rem' : '5rem', left: isMobile ? '1rem' : '2.5rem', zIndex: 60, maxWidth: '320px' }}>
          <div
            style={{
              display: 'inline-flex', alignItems: 'center',
              backgroundColor: JERSEYS[activeIndex].chipBg,
              color: JERSEYS[activeIndex].chipText,
              padding: '3px 10px',
              fontSize: '0.62rem',
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 800,
              letterSpacing: '0.20em',
              textTransform: 'uppercase',
              marginBottom: '10px',
              borderRadius: 0,
              transition: 'background-color 650ms cubic-bezier(0.4,0,0.2,1), color 650ms',
            }}
          >
            {JERSEYS[activeIndex].season} · {JERSEYS[activeIndex].type}
          </div>

          <p
            style={{
              fontFamily: "'Barlow Condensed', 'Trade Gothic Bold', sans-serif",
              fontWeight: 900,
              fontSize: isMobile ? '1.75rem' : '2.6rem',
              color: '#FFFFFF',
              textTransform: 'uppercase',
              letterSpacing: '-0.01em',
              lineHeight: 1.0,
              margin: '0 0 8px 0',
            }}
            key={activeIndex}
          >
            {JERSEYS[activeIndex].team}
          </p>

          {!isMobile && (
            <div style={{ marginBottom: '22px', maxWidth: '300px' }}>
              <p
                style={{
                  fontFamily: "'Barlow', sans-serif",
                  fontSize: '0.78rem',
                  color: 'rgba(255,255,255,0.70)',
                  lineHeight: 1.65,
                }}
              >
                {JERSEYS[activeIndex].importance}
              </p>
              <p
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginTop: '8px'
                }}
              >
                {JERSEYS[activeIndex].importantDate}
              </p>
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px' }}>
            {['prev', 'next'].map(dir => (
              <button
                key={dir}
                onClick={() => navigate(dir)}
                aria-label={dir === 'prev' ? 'Previous jersey' : 'Next jersey'}
                style={{
                  width:  isMobile ? '44px' : '54px',
                  height: isMobile ? '44px' : '54px',
                  borderRadius: 0,
                  backgroundColor: 'transparent',
                  border: '2px solid rgba(255,255,255,0.85)',
                  color: '#FFFFFF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'transform 150ms ease, box-shadow 150ms ease, background-color 150ms ease',
                  boxShadow: '3px 3px 0px rgba(255,255,255,0.30)',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget;
                  el.style.transform = 'translate(-2px, -2px)';
                  el.style.boxShadow = `5px 5px 0px ${JERSEYS[activeIndex].shadowHex}`;
                  el.style.backgroundColor = 'rgba(255,255,255,0.10)';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget;
                  el.style.transform = 'translate(0,0)';
                  el.style.boxShadow = '3px 3px 0px rgba(255,255,255,0.30)';
                  el.style.backgroundColor = 'transparent';
                }}
              >
                {dir === 'prev'
                  ? <ArrowLeft  size={isMobile ? 20 : 24} strokeWidth={2.5} />
                  : <ArrowRight size={isMobile ? 20 : 24} strokeWidth={2.5} />
                }
              </button>
            ))}
          </div>
        </div>

        {!isMobile && (
          <div
            style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              zIndex: 60,
              height: '36px',
              backgroundColor: 'rgba(0,0,0,0.45)',
              borderTop: '1px solid rgba(255,255,255,0.15)',
              overflow: 'hidden',
              display: 'flex', alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', animation: 'ticker 22s linear infinite', whiteSpace: 'nowrap' }}>
              {[0, 1].map(n => (
                <span
                  key={n}
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 700,
                    fontSize: '0.68rem',
                    letterSpacing: '0.25em',
                    color: 'rgba(255,255,255,0.55)',
                    textTransform: 'uppercase',
                    paddingRight: '2rem',
                  }}
                >
                  AUTHENTIC KITS &nbsp;·&nbsp;
                  REAL MADRID &nbsp;·&nbsp;
                  FC BARCELONA &nbsp;·&nbsp;
                  PARIS SG &nbsp;·&nbsp;
                  FREE DELIVERY &nbsp;·&nbsp;
                  PREMIUM REPLICAS &nbsp;·&nbsp;
                  FAST SHIPPING &nbsp;·&nbsp;
                  ORDER TODAY &nbsp;·&nbsp;
                </span>
              ))}
            </div>
          </div>
        )}

        {isMobile && (
          <div style={{ position: 'absolute', bottom: '8%', left: '50%', transform: 'translateX(-50%)', zIndex: 60, display: 'flex', gap: '8px' }}>
            {JERSEYS.map((_, i) => (
              <div
                key={i}
                style={{
                  width:  i === activeIndex ? '20px' : '6px',
                  height: '6px',
                  backgroundColor: i === activeIndex ? '#FFFFFF' : 'rgba(255,255,255,0.35)',
                  borderRadius: 0,
                  transition: 'width 300ms ease, background-color 300ms ease',
                }}
              />
            ))}
          </div>
        )}
      </div>

      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </div>
  );
}
