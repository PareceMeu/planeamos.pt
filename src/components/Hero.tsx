import React from 'react';
import { ShieldCheck, CheckCircle2, Sparkles, ArrowRight, Mail, CreditCard, Star } from 'lucide-react';
import heroImg from '../assets/images/hero_fitness_nutrition_1785445393095.jpg';
import planMockupImg from '../assets/images/plan_preview_mockup_1785445407975.jpg';

interface HeroProps {
  onStartClick: () => void;
  onSelectCategory: (category: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartClick, onSelectCategory }) => {
  return (
    <section className="relative overflow-hidden bg-slate-900 text-white pt-10 pb-16 lg:pt-16 lg:pb-24">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-25">
        <div className="absolute top-12 left-1/4 w-96 h-96 bg-emerald-500 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-teal-500 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Text & Primary CTA */}
          <div className="lg:col-span-7 text-center lg:text-left">
            {/* Eyebrow badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-semibold mb-6">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Plataforma de Planeamento Nutricional & Treino</span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                planeamos.pt
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12]">
              Planos de Treino, Dieta e Estilo de Vida{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                Desenhados para Si
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Preencha os seus dados, escolha o seu método de pagamento preferido (<strong className="text-white">MB WAY, Multibanco ou PayPal</strong>) e receba no seu e-mail um plano 100% personalizado com macronutrientes, rotinas diárias e lista de compras.
            </p>

            {/* CTA Group */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={onStartClick}
                className="w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-base rounded-xl shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center space-x-3 group cursor-pointer"
              >
                <span>Escolher o Meu Plano</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onSelectCategory('sociedade')}
                className="w-full sm:w-auto px-6 py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 font-semibold text-base rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Planos Especiais (Sénior/Sono/Pós-Parto)</span>
              </button>
            </div>

            {/* Key Value Props Bar */}
            <div className="mt-10 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
              <div className="flex items-start space-x-2.5 p-2.5 rounded-lg bg-slate-800/40 border border-slate-800/60">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">100% Personalizado</h4>
                  <p className="text-[10px] text-slate-400">Gostos e restrições</p>
                </div>
              </div>

              <div className="flex items-start space-x-2.5 p-2.5 rounded-lg bg-slate-800/40 border border-slate-800/60">
                <CreditCard className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">MB WAY, MB & PayPal</h4>
                  <p className="text-[10px] text-slate-400">Pagamento 100% Seguro</p>
                </div>
              </div>

              <div className="flex items-start space-x-2.5 p-2.5 rounded-lg bg-slate-800/40 border border-slate-800/60">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">Envio Instantâneo</h4>
                  <p className="text-[10px] text-slate-400">Direto no seu e-mail</p>
                </div>
              </div>

              <div className="flex items-start space-x-2.5 p-2.5 rounded-lg bg-slate-800/40 border border-slate-800/60">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">Foco na Saúde</h4>
                  <p className="text-[10px] text-slate-400">Sem dietas malucas</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Image Feature Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Image Frame */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl bg-slate-800 group">
                <img
                  src={heroImg}
                  alt="Nutrição e Treino Personalizado"
                  referrerPolicy="no-referrer"
                  className="w-full h-[360px] sm:h-[420px] object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/60 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block">Exemplo Real de Refeição & Treino</span>
                    <h4 className="text-sm font-bold text-white">Receitas e Exercícios Calculados</h4>
                  </div>
                  <div className="flex items-center space-x-1 text-amber-400 text-xs font-bold bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>4.9/5</span>
                  </div>
                </div>
              </div>

              {/* Floating Mockup Card */}
              <div className="absolute -bottom-6 -left-4 sm:-left-8 max-w-[240px] sm:max-w-[280px] p-3 rounded-2xl bg-slate-900/95 border border-emerald-500/40 shadow-2xl backdrop-blur-md hidden sm:block">
                <div className="relative rounded-xl overflow-hidden mb-2">
                  <img
                    src={planMockupImg}
                    alt="Documento de Plano Personalizado"
                    referrerPolicy="no-referrer"
                    className="w-full h-28 object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                    Amostra PDF
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">Plano 7 Dias Pronto</span>
                  <span className="text-[10px] text-emerald-400 font-semibold">100% Digital</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
