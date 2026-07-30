import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PlanCatalog } from './components/PlanCatalog';
import { HowItWorks } from './components/HowItWorks';
import { QuestionnaireModal } from './components/QuestionnaireModal';
import { PayPalCheckoutModal } from './components/PayPalCheckoutModal';
import { PlanViewModal } from './components/PlanViewModal';
import { ClientPortalModal } from './components/ClientPortalModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { EmailSimulationModal } from './components/EmailSimulationModal';
import { PlanType, QuestionnaireData, Order } from './types';
import { CATALOG_PLANS } from './data/plans';
import { ShieldCheck, Dumbbell, Sparkles, HeartPulse, CheckCircle2, Mail, Lock } from 'lucide-react';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');

  // Modals state
  const [activeQuestionnairePlan, setActiveQuestionnairePlan] = useState<PlanType | null>(null);
  const [activeCheckoutOrder, setActiveCheckoutOrder] = useState<Order | null>(null);
  const [activeViewingOrder, setActiveViewingOrder] = useState<Order | null>(null);

  const [isClientPortalOpen, setIsClientPortalOpen] = useState<boolean>(false);
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState<boolean>(false);
  const [isEmailLogOpen, setIsEmailLogOpen] = useState<boolean>(false);

  // Step 1: User selects a plan from catalog -> Open Questionnaire Modal
  const handleSelectPlan = (plan: PlanType) => {
    setActiveQuestionnairePlan(plan);
  };

  // Step 2: User submits Questionnaire -> Call backend to create Order -> Open PayPal Checkout Modal
  const handleSubmitQuestionnaire = async (formData: QuestionnaireData) => {
    if (!activeQuestionnairePlan) return;

    try {
      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: activeQuestionnairePlan.id,
          planTitle: activeQuestionnairePlan.title,
          planPrice: activeQuestionnairePlan.price,
          questionnaire: formData,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.order) {
          setActiveQuestionnairePlan(null);
          setActiveCheckoutOrder(data.order);
          return;
        }
      }
    } catch (e) {
      console.warn('Backend unavailable, proceeding with seamless order checkout:', e);
    }

    // Seamless Order Fallback so user is never blocked
    const fallbackOrder: Order = {
      id: `PLN-${Math.floor(100000 + Math.random() * 900000)}`,
      planId: activeQuestionnairePlan.id,
      planTitle: activeQuestionnairePlan.title,
      planPrice: activeQuestionnairePlan.price,
      questionnaire: formData,
      paymentStatus: 'pendente',
      paymentMethod: 'paypal',
      createdAt: new Date().toISOString(),
      emailSentStatus: 'nao_enviado',
    };
    setActiveQuestionnairePlan(null);
    setActiveCheckoutOrder(fallbackOrder);
  };

  // Step 3: User submits payment -> Payment callback -> If paid show Plan, if pending open Client Portal
  const handlePaymentSuccess = (updatedOrder: Order) => {
    setActiveCheckoutOrder(null);
    if (updatedOrder.paymentStatus === 'pago' && updatedOrder.planDocument) {
      setActiveViewingOrder(updatedOrder);
    } else {
      setIsClientPortalOpen(true);
    }
  };

  const scrollToCatalog = () => {
    const el = document.getElementById('planos-catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white text-xs py-2 px-4 text-center font-medium flex items-center justify-center space-x-2">
        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
        <span>
          <strong>planeamos.pt</strong> — Planos de Treino & Dieta Personalizados com Pagamento Seguro via <strong>MB WAY, Multibanco e PayPal</strong>!
        </span>
      </div>

      {/* Navbar */}
      <Navbar
        onOpenClientPortal={() => setIsClientPortalOpen(true)}
        onOpenAdminPortal={() => setIsAdminPortalOpen(true)}
        onOpenEmailLog={() => setIsEmailLogOpen(true)}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          scrollToCatalog();
        }}
      />

      {/* Main Content */}
      <main className="grow">
        {/* Hero Banner */}
        <Hero
          onStartClick={scrollToCatalog}
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            scrollToCatalog();
          }}
        />

        {/* How It Works Section */}
        <HowItWorks />

        {/* Plan Catalog Grid */}
        <PlanCatalog
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onSelectPlan={handleSelectPlan}
        />

        {/* Social Proof & Value Banner */}
        <section className="py-16 bg-slate-900 text-white border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
            <h2 className="text-3xl font-extrabold tracking-tight">
              Investir na Sua Saúde Nunca Foi Tão Simples
            </h2>
            <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
              Centenas de pessoas em Portugal já transformaram os seus hábitos, ganharam energia e melhoraram a composição corporal com os nossos planos personalizados.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
              <div className="flex items-center space-x-2 bg-slate-800/80 px-4 py-2.5 rounded-xl border border-slate-700 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Zero Fidelização</span>
              </div>
              <div className="flex items-center space-x-2 bg-slate-800/80 px-4 py-2.5 rounded-xl border border-slate-700 text-xs">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>MB WAY • Multibanco • PayPal</span>
              </div>
              <div className="flex items-center space-x-2 bg-slate-800/80 px-4 py-2.5 rounded-xl border border-slate-700 text-xs">
                <Mail className="w-4 h-4 text-emerald-400" />
                <span>Envio para o seu E-mail</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 text-xs py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <Dumbbell className="w-4 h-4" />
            </div>
            <span className="text-base font-black text-white">planeamos.pt</span>
          </div>

          <p className="text-center sm:text-left text-slate-500">
            © {new Date().getFullYear()} planeamos.pt. Soluções personalizadas de treino, nutrição e hábitos para Portugal.
          </p>

          <div className="flex items-center space-x-4">
            <button onClick={() => setIsClientPortalOpen(true)} className="hover:text-white transition-colors cursor-pointer">
              Meus Planos
            </button>
            <button onClick={() => setIsEmailLogOpen(true)} className="hover:text-white transition-colors cursor-pointer">
              Histórico E-mail
            </button>
            <button onClick={() => setIsAdminPortalOpen(true)} className="hover:text-white transition-colors cursor-pointer">
              Área do Treinador
            </button>
          </div>
        </div>
      </footer>

      {/* MODALS */}

      {/* 1. Questionnaire Modal */}
      {activeQuestionnairePlan && (
        <QuestionnaireModal
          plan={activeQuestionnairePlan}
          onClose={() => setActiveQuestionnairePlan(null)}
          onSubmitQuestionnaire={handleSubmitQuestionnaire}
        />
      )}

      {/* 2. PayPal Checkout Modal */}
      {activeCheckoutOrder && (
        <PayPalCheckoutModal
          order={activeCheckoutOrder}
          onClose={() => setActiveCheckoutOrder(null)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {/* 3. Generated Plan Document View Modal */}
      {activeViewingOrder && (
        <PlanViewModal
          order={activeViewingOrder}
          onClose={() => setActiveViewingOrder(null)}
        />
      )}

      {/* 4. Client Portal Modal */}
      {isClientPortalOpen && (
        <ClientPortalModal
          onClose={() => setIsClientPortalOpen(false)}
          onOpenOrderPlan={(order) => setActiveViewingOrder(order)}
        />
      )}

      {/* 5. Admin/Coach Dashboard Modal */}
      {isAdminPortalOpen && (
        <AdminDashboardModal
          onClose={() => setIsAdminPortalOpen(false)}
          onOpenOrderPlan={(order) => setActiveViewingOrder(order)}
        />
      )}

      {/* 6. Email Delivery Log Modal */}
      {isEmailLogOpen && (
        <EmailSimulationModal onClose={() => setIsEmailLogOpen(false)} />
      )}
    </div>
  );
}
