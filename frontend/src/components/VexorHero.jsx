import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import LoginModal from './LoginModal';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';

const JERSEYS = [
  {
    team:      'Real Madrid',
    ghost:     'REAL MADRID',
    season:    '2024 / 25',
    type:      'Home',
    price:     '৳ 2,400',
    src:       '/images/messi.png',
    bg:        '#1C2B4A',
    panel:     '#111D33',
    chipBg:    '#D4AF37',
    chipText:  '#1C2B4A',
    shadowHex: '#D4AF37',
  },
  {
    team:      'FC Barcelona',
    ghost:     'BARCELONA',
    season:    '2024 / 25',
    type:      'Home',
    price:     '৳ 2,200',
    src:       '/images/model-barcelona.png',
    bg:        '#A31132',
    panel:     '#7A0D24',
    chipBg:    '#003DA5',
    chipText:  '#FFFFFF',
    shadowHex: '#003DA5',
  },
  {
    team:      'Paris SG',
    ghost:     'PARIS',
    season:    '2024 / 25',
    type:      'Home',
    price:     '৳ 2,600',
    src:       '/images/model-psg.png',
    bg:        '#C60B1E',
    panel:     '#9A0818',
    chipBg:    '#001F5F',
    chipText:  '#FFFFFF',
    shadowHex: '#001F5F',
  },
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
  }
}

export default function VexorHero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [showLogin, setShowLogin] = useState(false);

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
        ? (prev + 1) % 3
        : (prev + 2) % 3
    );
    setTimeout(() => setIsAnimating(false), 650);
  }

  const center = activeIndex;
  const right  = (activeIndex + 1) % 3;
  const left   = (activeIndex + 2) % 3;

  function getRole(index) {
    if (index === center) return 'center';
    if (index === right)  return 'right';
    return 'left';
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
          <button 
            onClick={() => setShowLogin(true)}
            style={{ width: '44px', height: '44px', backgroundColor: '#000000', border: 'none', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background-color 200ms', borderRadius: 0, boxShadow: '4px 4px 0px #E5E5E5' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#FF5500'; e.currentTarget.style.boxShadow = '6px 6px 0px #000000'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#000000'; e.currentTarget.style.boxShadow = '4px 4px 0px #E5E5E5'; }}
          >
            <span className="material-symbols-outlined">login</span>
          </button>
        </header>

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
            {String(activeIndex + 1).padStart(2, '0')} / 03
          </span>
          <div style={{ width: '80px', height: '2px', backgroundColor: 'rgba(255,255,255,0.25)', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${((activeIndex + 1) / 3) * 100}%`, backgroundColor: '#FFFFFF', transition: 'width 650ms cubic-bezier(0.4,0,0.2,1)' }} />
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

          <p
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: isMobile ? '0.9rem' : '1.05rem',
              fontWeight: 500,
              color: 'rgba(255,255,255,0.80)',
              marginBottom: isMobile ? '14px' : '20px',
              letterSpacing: '0.04em',
            }}
          >
            From {JERSEYS[activeIndex].price}
          </p>

          {!isMobile && (
            <p
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: '0.78rem',
                color: 'rgba(255,255,255,0.70)',
                lineHeight: 1.65,
                marginBottom: '22px',
                maxWidth: '260px',
              }}
            >
              Authentic kits. Verified replicas. Every stitch, badge, and colorway
              exactly as worn on the pitch. Order today, delivered fast.
            </p>
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

        <div style={{ position: 'absolute', bottom: isMobile ? '1.5rem' : '5rem', right: isMobile ? '1rem' : '2.5rem', zIndex: 60 }}>
          <a
            href="#order"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              fontFamily: "'Bebas Neue', 'Trade Gothic Bold', sans-serif",
              fontSize: isMobile ? 'clamp(22px, 6vw, 36px)' : 'clamp(28px, 4vw, 56px)',
              fontWeight: 400,
              color: '#FFFFFF',
              textDecoration: 'none',
              textTransform: 'uppercase',
              letterSpacing: '-0.01em',
              lineHeight: 1,
              opacity: 0.95,
              borderBottom: '2px solid rgba(255,255,255,0.50)',
              paddingBottom: '4px',
              transition: 'opacity 200ms ease, border-color 200ms ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.borderColor = '#FF5500';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.opacity = '0.95';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.50)';
            }}
          >
            ORDER NOW
            <ArrowUpRight size={isMobile ? 18 : 28} strokeWidth={2.5} />
          </a>
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
