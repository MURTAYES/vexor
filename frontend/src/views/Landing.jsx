import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen bg-surface-light font-body overflow-x-hidden selection:bg-vexor-orange selection:text-white flex flex-col">
      {/* Navigation */}
      <nav className="border-b-2 border-vexor-black bg-surface-light sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-vexor-black flex items-center justify-center group-hover:bg-vexor-orange transition-colors">
              <span className="material-symbols-outlined text-white text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>speed</span>
            </div>
            <div>
              <h1 className="font-headline text-3xl font-bold italic text-primary uppercase leading-none group-hover:text-vexor-orange transition-colors">VEXOR</h1>
              <p className="font-body text-[10px] font-bold text-secondary uppercase tracking-[0.2em] leading-none mt-1">PERFORMANCE OPS</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/login" className="font-headline text-lg italic uppercase font-bold text-secondary hover:text-vexor-black transition-colors">
              System Login
            </Link>
            <Link 
              to="/login"
              className="bg-vexor-orange text-white px-8 py-3 font-headline text-lg italic uppercase font-bold border-2 border-transparent hover:border-vexor-black hover:shadow-[4px_4px_0px_#000000] transition-all hover:-translate-y-1"
            >
              Access Terminal
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-32 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-block bg-surface-neutral border border-border-muted px-4 py-2 font-body text-sm font-bold uppercase tracking-wider text-vexor-black">
              <span className="inline-block w-2 h-2 bg-vexor-orange rounded-full mr-2 animate-pulse"></span>
              Vexor System v1.0.0
            </div>
            
            <h1 className="font-headline text-6xl lg:text-8xl font-bold italic uppercase leading-[0.9] tracking-tighter text-vexor-black">
              DOMINATE <br />
              <span className="text-transparent" style={{ WebkitTextStroke: '2px #FF5500' }}>RETAIL</span><br />
              OPERATIONS
            </h1>
            
            <p className="font-body text-xl lg:text-2xl text-secondary max-w-lg border-l-4 border-vexor-orange pl-6 py-2">
              The ruthless, high-performance ERP built exclusively for premium football jersey retailers. Absolute control, zero compromise.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link 
                to="/login"
                className="bg-vexor-black text-white px-10 py-5 font-headline text-2xl italic uppercase font-bold border-2 border-vexor-black hover:bg-vexor-orange hover:border-vexor-orange transition-colors flex items-center gap-3 shadow-[6px_6px_0px_#E5E5E5] hover:shadow-[6px_6px_0px_#000000]"
              >
                Launch Ops
                <span className="material-symbols-outlined">rocket_launch</span>
              </Link>
            </div>
          </div>

          <div className="relative">
            {/* Decorative background grid */}
            <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 gap-4 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '32px 32px' }}></div>
            
            {/* Feature Cards Showcase */}
            <div className="relative z-10 grid gap-6">
              <div className="brutal-card p-6 transform rotate-2 hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-vexor-orange flex items-center justify-center">
                    <span className="material-symbols-outlined text-white">inventory_2</span>
                  </div>
                  <h3 className="font-headline text-2xl font-bold italic uppercase">Atomic Inventory</h3>
                </div>
                <p className="font-body text-secondary">Real-time stock decrements with conflict resolution. Never oversell a jersey again.</p>
              </div>

              <div className="brutal-card p-6 transform -translate-x-8 -rotate-1 hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-vexor-black flex items-center justify-center">
                    <span className="material-symbols-outlined text-white">receipt_long</span>
                  </div>
                  <h3 className="font-headline text-2xl font-bold italic uppercase">One-Click Invoicing</h3>
                </div>
                <p className="font-body text-secondary">Generate and email professional PDF invoices instantly at the point of sale.</p>
              </div>

              <div className="brutal-card p-6 transform translate-x-4 rotate-1 hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-surface-neutral border-2 border-vexor-black flex items-center justify-center">
                    <span className="material-symbols-outlined text-vexor-black">bolt</span>
                  </div>
                  <h3 className="font-headline text-2xl font-bold italic uppercase">Lightning Fast</h3>
                </div>
                <p className="font-body text-secondary">Brutalist UI designed for speed. Fewer clicks, more conversions, maximum throughput.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Ticker Tape */}
        <div className="border-y-2 border-vexor-black bg-vexor-orange overflow-hidden py-3">
          <div className="flex whitespace-nowrap animate-[scroll_20s_linear_infinite]">
            <div className="flex items-center gap-8 font-headline text-xl italic uppercase font-bold text-white px-4">
              <span>+++ VEXOR V1.0.0</span>
              <span className="material-symbols-outlined">bolt</span>
              <span>NO DOWNTIME</span>
              <span className="material-symbols-outlined">bolt</span>
              <span>MAXIMUM THROUGHPUT</span>
              <span className="material-symbols-outlined">bolt</span>
              <span>+++ VEXOR V1.0.0</span>
              <span className="material-symbols-outlined">bolt</span>
              <span>NO DOWNTIME</span>
              <span className="material-symbols-outlined">bolt</span>
              <span>MAXIMUM THROUGHPUT</span>
              <span className="material-symbols-outlined">bolt</span>
              <span>+++ VEXOR V1.0.0</span>
              <span className="material-symbols-outlined">bolt</span>
              <span>NO DOWNTIME</span>
              <span className="material-symbols-outlined">bolt</span>
              <span>MAXIMUM THROUGHPUT</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t-2 border-border-muted bg-surface-light py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3 opacity-50 grayscale">
            <div className="w-8 h-8 bg-vexor-black flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>speed</span>
            </div>
            <div>
              <h1 className="font-headline text-xl font-bold italic text-primary uppercase leading-none">VEXOR</h1>
            </div>
          </div>
          <p className="font-body text-sm font-bold uppercase text-secondary tracking-widest">
            © {new Date().getFullYear()} Vexor Systems. All systems operational.
          </p>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}} />
    </div>
  );
};

export default Landing;
