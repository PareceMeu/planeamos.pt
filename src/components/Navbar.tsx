import React from 'react';
import { Dumbbell, ShieldCheck, UserCheck, LayoutDashboard, Sparkles, Mail } from 'lucide-react';

interface NavbarProps {
  onOpenClientPortal: () => void;
  onOpenAdminPortal: () => void;
  onOpenEmailLog: () => void;
  onSelectCategory: (category: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenClientPortal,
  onOpenAdminPortal,
  onOpenEmailLog,
  onSelectCategory,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onSelectCategory('todos')}>
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
            <Dumbbell className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-1">
              <span className="text-2xl font-black tracking-tight text-slate-900">planeamos</span>
              <span className="text-2xl font-black text-emerald-600">.pt</span>
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Planos de Treino & Dieta
            </p>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          <button
            onClick={() => onSelectCategory('todos')}
            className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-emerald-600 hover:bg-emerald-50/50 rounded-lg transition-colors"
          >
            Início & Planos
          </button>
          <button
            onClick={() => onSelectCategory('combinado')}
            className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-emerald-600 hover:bg-emerald-50/50 rounded-lg transition-colors"
          >
            Treino + Dieta
          </button>
          <button
            onClick={() => onSelectCategory('sociedade')}
            className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-emerald-600 hover:bg-emerald-50/50 rounded-lg transition-colors flex items-center space-x-1"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Planos Sociais 50+ / Sono</span>
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={onOpenClientPortal}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all cursor-pointer"
          >
            <UserCheck className="w-4 h-4 text-emerald-600" />
            <span>Meus Planos</span>
          </button>

          <button
            onClick={onOpenAdminPortal}
            className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 rounded-lg transition-all cursor-pointer"
            title="Painel de Controlo do Treinador"
          >
            <LayoutDashboard className="w-4 h-4 text-blue-600" />
            <span>Gestão / Coach</span>
          </button>

          <button
            onClick={onOpenEmailLog}
            className="inline-flex items-center space-x-1 px-2.5 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 rounded-lg transition-all cursor-pointer"
            title="Ver histórico de e-mails enviados"
          >
            <Mail className="w-4 h-4 text-emerald-600" />
            <span className="hidden lg:inline">Histórico E-mails</span>
          </button>

          <div className="hidden xl:flex items-center space-x-1 text-xs text-slate-600 bg-emerald-50/80 border border-emerald-200/80 px-2.5 py-1.5 rounded-full">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold text-emerald-900">MB WAY • MB • PayPal</span>
          </div>
        </div>
      </div>
    </header>
  );
};
