import React from 'react';
import { PlanType } from '../types';
import { Dumbbell, Apple, Zap, HeartPulse, Moon, Baby, Laptop, Activity, Check, ArrowRight, Clock } from 'lucide-react';

interface PlanCardProps {
  plan: PlanType;
  onSelectPlan: (plan: PlanType) => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Zap,
  Dumbbell,
  Apple,
  HeartPulse,
  Moon,
  Baby,
  Laptop,
  Activity,
};

export const PlanCard: React.FC<PlanCardProps> = ({ plan, onSelectPlan }) => {
  const IconComponent = ICON_MAP[plan.iconName] || Zap;

  return (
    <div
      className={`relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white transition-all duration-200 border ${
        plan.isPopular
          ? 'border-emerald-500 shadow-xl shadow-emerald-500/10 ring-2 ring-emerald-500/20'
          : 'border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300'
      }`}
    >
      {/* Optional Card Image Banner */}
      {plan.imageUrl && (
        <div className="relative h-44 w-full overflow-hidden bg-slate-900">
          <img
            src={plan.imageUrl}
            alt={plan.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-90 transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
            <span className="text-xs font-bold tracking-wide uppercase bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/20">
              {plan.category === 'combinado' ? 'Treino + Dieta' : plan.category}
            </span>
          </div>
        </div>
      )}

      {/* Top Badge */}
      {plan.badge && (
        <div className="absolute top-3 right-3 z-10 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
          {plan.badge}
        </div>
      )}

      <div className="p-6 sm:p-7">
        {/* Header Icon & Title */}
        <div className="flex items-start space-x-4 mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${plan.color} text-white shadow-sm shrink-0`}>
            <IconComponent className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 leading-snug">{plan.title}</h3>
            <p className="text-xs font-semibold text-emerald-700 mt-0.5">{plan.subtitle}</p>
          </div>
        </div>

        {/* Pricing */}
        <div className="my-5 p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-baseline justify-between">
          <div>
            <span className="text-3xl font-black text-slate-900">{plan.price.toFixed(2)}€</span>
            {plan.originalPrice && (
              <span className="ml-2 text-sm font-medium text-slate-400 line-through">
                {plan.originalPrice.toFixed(2)}€
              </span>
            )}
            <span className="block text-[11px] text-slate-500 mt-0.5">Pagamento único • Sem subscrição</span>
          </div>
          <div className="flex items-center text-xs font-semibold text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
            <Clock className="w-3.5 h-3.5 text-emerald-600 mr-1" />
            <span>Processamento imediato</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">{plan.description}</p>

        {/* Features list */}
        <div className="space-y-2.5 mb-8">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">O que está incluído:</p>
          {plan.features.map((feat, idx) => (
            <div key={idx} className="flex items-start space-x-2.5 text-xs text-slate-700">
              <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <span className="leading-tight">{feat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Select CTA button */}
      <button
        onClick={() => onSelectPlan(plan)}
        className={`w-full py-3.5 px-5 rounded-xl font-bold text-sm transition-all flex items-center justify-center space-x-2 cursor-pointer ${
          plan.isPopular
            ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20'
            : 'bg-slate-900 hover:bg-slate-800 text-white'
        }`}
      >
        <span>Preencher Questionário & Adquirir</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};
