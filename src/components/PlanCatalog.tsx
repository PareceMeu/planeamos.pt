import React, { useState } from 'react';
import { PlanType, PlanCategory } from '../types';
import { CATALOG_PLANS } from '../data/plans';
import { PlanCard } from './PlanCard';
import { Sparkles, Layers, Dumbbell, HeartPulse } from 'lucide-react';

interface PlanCatalogProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onSelectPlan: (plan: PlanType) => void;
}

export const PlanCatalog: React.FC<PlanCatalogProps> = ({
  selectedCategory,
  onSelectCategory,
  onSelectPlan,
}) => {
  const filteredPlans = CATALOG_PLANS.filter((p) => {
    if (selectedCategory === 'todos') return true;
    if (selectedCategory === 'sociedade') return p.category === 'sociedade';
    if (selectedCategory === 'combinado') return p.category === 'combinado';
    if (selectedCategory === 'treino_dieta') return p.category === 'treino' || p.category === 'dieta';
    return true;
  });

  return (
    <section id="planos-catalog" className="py-16 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            Catálogo de Soluções Personalizadas
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            Escolha o Plano Ideal para os Seus Objetivos
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Cada plano é totalmente gerado com inteligência nutricional e adaptado ao seu estilo de vida após o preenchimento do questionário.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          <button
            onClick={() => onSelectCategory('todos')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center space-x-2 cursor-pointer ${
              selectedCategory === 'todos'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Todos os Planos ({CATALOG_PLANS.length})</span>
          </button>

          <button
            onClick={() => onSelectCategory('combinado')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center space-x-2 cursor-pointer ${
              selectedCategory === 'combinado'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <Dumbbell className="w-4 h-4 text-emerald-400" />
            <span>Transformação 360 (Treino + Dieta)</span>
          </button>

          <button
            onClick={() => onSelectCategory('treino_dieta')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center space-x-2 cursor-pointer ${
              selectedCategory === 'treino_dieta'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <HeartPulse className="w-4 h-4 text-blue-500" />
            <span>Treino ou Dieta Individual</span>
          </button>

          <button
            onClick={() => onSelectCategory('sociedade')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center space-x-2 cursor-pointer ${
              selectedCategory === 'sociedade'
                ? 'bg-purple-700 text-white shadow-sm'
                : 'bg-white text-purple-900 hover:bg-purple-50 border border-purple-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Planos Sociais (Sénior 50+, Sono, Pós-Parto, Work)</span>
          </button>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPlans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} onSelectPlan={onSelectPlan} />
          ))}
        </div>
      </div>
    </section>
  );
};
