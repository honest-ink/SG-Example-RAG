
import React, { useState, useRef } from 'react';
import { ChevronRight, Globe, Shield, TrendingUp, Search, ArrowRight, ExternalLink } from 'lucide-react';
import ChatBot, { ChatBotHandle } from './components/ChatBot';

// Minimalist SG Logo Mark
const LogoMark = ({ className = "h-10" }: { className?: string }) => (
  <div className={`flex items-center justify-center bg-[#0d311b] rounded-lg aspect-square p-2 group-hover:bg-[#1a4a2a] transition-colors ${className}`}>
    <span className="text-[#50b250] font-black text-xl tracking-tighter leading-none select-none">SG</span>
  </div>
);

const App: React.FC = () => {
  const [heroSearch, setHeroSearch] = useState('');
  const chatBotRef = useRef<ChatBotHandle>(null);

  const handleHeroSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim() && chatBotRef.current) {
      chatBotRef.current.openWithQuery(heroSearch);
      setHeroSearch('');
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#0d311b] selection:bg-[#50b250]/20 selection:text-[#0d311b]">
      {/* Navigation / Banner */}
      <nav className="fixed top-0 w-full z-40 px-8 py-5 flex justify-between items-center bg-white/95 backdrop-blur-xl border-b border-slate-100 shadow-sm">
        <div className="flex items-center space-x-6 group cursor-pointer">
          <LogoMark className="h-10 w-10" />
          <div className="h-10 w-[1px] bg-slate-200 hidden sm:block"></div>
          <div className="flex flex-col">
            <span className="text-[10px] tracking-[0.2em] uppercase text-[#50b250] font-black block">Intelligence</span>
            <span className="text-[9px] tracking-[0.1em] uppercase text-slate-400 font-bold block">New Zealand Hub</span>
          </div>
        </div>
        
        <div className="hidden lg:flex items-center space-x-10 text-[11px] font-bold tracking-[0.15em] uppercase text-slate-500">
          {['Investment Opportunities', 'Regulatory Framework', 'Growth Sectors'].map((item) => (
            <a key={item} href="#" className="hover:text-[#0d311b] transition-all relative group py-2">
              {item}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#50b250] transition-all group-hover:w-full" />
            </a>
          ))}
          <button className="flex items-center space-x-2 px-6 py-3 bg-[#0d311b] text-white rounded-xl hover:bg-[#1a4a2a] transition-all font-bold shadow-lg shadow-[#0d311b]/10 group">
            <span>Investor Portal</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative overflow-hidden">
        {/* Full-Screen Hero Background Container - Adjusted mobile flex for top-alignment clearance */}
        <div className="relative w-full h-screen flex items-start md:items-center overflow-hidden">
          {/* Hero Image */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=2000" 
              alt="New Zealand Skyline" 
              className="w-full h-full object-cover scale-105"
            />
            {/* Overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/98 to-white/30" />
          </div>

          {/* Adjusted Padding Top for mobile to clear the fixed nav */}
          <div className="container mx-auto px-8 relative z-10 pt-40 md:pt-20">
            {/* Text Content */}
            <div className="max-w-4xl animate-[fadeIn_1s_ease-out]">
              <h1 className="text-7xl md:text-9xl font-bold tracking-tighter mb-8 leading-[0.85] text-[#0d311b]">
                Navigate <br />
                <span className="text-[#50b250]">
                  <span className="md:hidden">New Zealand</span>
                  <span className="hidden md:inline">NZ Markets.</span>
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-slate-600 font-normal mb-12 max-w-2xl leading-relaxed">
                Unlock high-value investment pathways with New Zealand's leading legal intelligence platform.
              </p>

              {/* INTEGRATED SEARCH BAR */}
              <form onSubmit={handleHeroSearchSubmit} className="relative max-w-2xl group mb-14">
                <div className="absolute -inset-2 bg-gradient-to-r from-[#50b250] to-[#0d311b] rounded-2xl blur-xl opacity-0 group-focus-within:opacity-10 transition duration-700"></div>
                <div className="relative flex items-center bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden p-1.5 transition-all focus-within:border-[#50b250]/30">
                  <div className="pl-4 md:pl-6 text-slate-400 group-focus-within:text-[#50b250] transition-colors">
                    <Search className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <input
                    type="text"
                    placeholder="What do I need to know as a foreign investor..."
                    value={heroSearch}
                    onChange={(e) => setHeroSearch(e.target.value)}
                    className="w-full bg-transparent py-3.5 px-4 md:py-5 md:px-6 text-[#0d311b] placeholder:text-slate-400 focus:outline-none text-base md:text-xl font-medium"
                  />
                  <button 
                    type="submit"
                    className="px-5 py-3.5 md:px-8 md:py-5 bg-[#50b250] hover:bg-[#45a045] text-white rounded-xl transition-all flex items-center space-x-2 shadow-xl hover:shadow-[#50b250]/20 font-bold text-sm md:text-base whitespace-nowrap"
                  >
                    <span>Submit</span>
                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </div>
              </form>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-12 border-t border-slate-200 pt-10 max-w-2xl">
                {[
                  { label: 'Ease of Business', value: '#1 Globally' },
                  { label: 'Sovereign Rating', value: 'AA+ Stable' },
                  { label: 'Innovation Hub', value: 'Top 10' }
                ].map((stat, i) => (
                  <div key={i} className="flex flex-col">
                    <div className="text-3xl font-black text-[#0d311b] tracking-tight">{stat.value}</div>
                    <div className="text-[11px] uppercase tracking-[0.2em] text-slate-400 font-black mt-1.5">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Feature Tiers */}
        <section className="container mx-auto px-8 py-32 relative bg-white">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-bold text-[#0d311b] tracking-tight mb-6">Built for Sophisticated Capital.</h2>
              <p className="text-lg text-slate-500 leading-relaxed">
                SG Intelligence is trained on research by New Zealand's best legal team. Read our latest News and Insights here.
              </p>
            </div>
            <div className="flex space-x-2">
              <div className="w-12 h-[2px] bg-[#50b250]"></div>
              <div className="w-4 h-[2px] bg-slate-200"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { 
                icon: Shield, 
                showBadgeIcon: false,
                title: 'Expanding Horizons', 
                desc: 'Deep analysis of the OIO (Overseas Investment Office) framework and local compliance mandates.',
                image: 'https://raw.githubusercontent.com/honest-ink/SG-Example-RAG/main/ExpandingHorizons.png',
                link: 'https://www.simpsongrierson.com/insights-news/legal-updates/expanding-horizons-2025'
              },
              { 
                icon: TrendingUp, 
                showBadgeIcon: false,
                title: 'Energy Overhaul', 
                desc: "Can government reforms bridge gaps in New Zealand's oil and gas markets by accelerating permitting?",
                image: 'https://github.com/honest-ink/SG-Example-RAG/blob/main/Real%20energy.png?raw=true',
                link: 'https://www.simpsongrierson.com/insights-news/legal-updates/watt-s-up-new-zealand-s-energy-policy-overhaul'
              },
              { 
                icon: Globe, 
                showBadgeIcon: false,
                title: 'Building Liability', 
                desc: "What New Zealand's new construction reforms mean for developers across the country",
                image: 'https://github.com/honest-ink/SG-Example-RAG/blob/main/Building%20Liability%20.png?raw=true',
                link: 'https://www.simpsongrierson.com/insights-news/legal-updates/building-liability-reform-whats-changing-and-who-pays-when-things-go-wrong'
              }
            ].map((card, i) => (
              <div key={i} className="group relative rounded-[2.5rem] bg-slate-50 border border-slate-100 transition-all duration-500 hover:bg-white hover:shadow-[0_40px_80px_-20px_rgba(13,49,27,0.1)] hover:scale-[1.03] overflow-hidden flex flex-col cursor-default">
                {card.image && (
                  <div className="relative h-56 w-full overflow-hidden">
                    <img 
                      src={card.image} 
                      alt={card.title} 
                      className="w-full h-full object-cover transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-50/20 to-transparent"></div>
                  </div>
                )}
                
                <div className="p-12 relative flex-1 flex flex-col">
                  {!card.image && card.icon && (
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                      <card.icon className="w-32 h-32 text-[#0d311b]" />
                    </div>
                  )}
                  
                  {card.icon && card.showBadgeIcon !== false && (
                    <div className="w-14 h-14 rounded-2xl bg-[#50b250]/10 flex items-center justify-center mb-8 border border-[#50b250]/20 shadow-sm">
                      <card.icon className="w-7 h-7 text-[#50b250]" />
                    </div>
                  )}
                  
                  <h3 className="text-2xl font-bold mb-4 text-[#0d311b] mt-auto md:mt-0">{card.title}</h3>
                  <p className="text-slate-500 text-base leading-relaxed mb-8">
                    {card.desc}
                  </p>
                  <a 
                    href={card.link || '#'}
                    target={card.link && card.link !== '#' ? "_blank" : undefined}
                    rel={card.link && card.link !== '#' ? "noopener noreferrer" : undefined}
                    className="mt-auto inline-flex items-center text-[11px] font-black text-[#50b250] uppercase tracking-widest transition-all group-hover:translate-x-2"
                  >
                    Learn More <ChevronRight className="ml-2 w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-24 bg-white">
        <div className="container mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-12">
            <div className="flex flex-col space-y-4">
              <LogoMark className="h-12 w-12" />
              <p className="max-w-xs text-sm text-slate-400 font-medium">
                The leading edge of New Zealand investment law and commercial intelligence.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-16">
              <div>
                <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#0d311b] mb-6">Platform</h4>
                <ul className="space-y-4 text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">
                  <li className="hover:text-[#50b250] cursor-pointer transition-colors">Intelligence API</li>
                  <li className="hover:text-[#50b250] cursor-pointer transition-colors">Market Data</li>
                  <li className="hover:text-[#50b250] cursor-pointer transition-colors">Legal Store</li>
                </ul>
              </div>
              <div>
                <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#0d311b] mb-6">Legal</h4>
                <ul className="space-y-4 text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">
                  <li className="hover:text-[#50b250] cursor-pointer transition-colors">Privacy Policy</li>
                  <li className="hover:text-[#50b250] cursor-pointer transition-colors">Compliance</li>
                  <li className="hover:text-[#50b250] cursor-pointer transition-colors">Terms of Access</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center pt-10 border-t border-slate-50 gap-6">
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">
              © 2025 SG | NZ Intelligence Node SG-01
            </p>
            <div className="flex space-x-12 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300">
              <span className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-[#50b250] rounded-full"></span>
                <span>System Operational</span>
              </span>
              <span>Encrypted Connection</span>
            </div>
          </div>
        </div>
      </footer>

      {/* AI Assistant */}
      <ChatBot ref={chatBotRef} />

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default App;
