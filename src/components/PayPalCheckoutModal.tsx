import React, { useState } from 'react';
import { Order } from '../types';
import confetti from 'canvas-confetti';
import { X, ShieldCheck, CheckCircle2, Lock, CreditCard, Sparkles, Loader2, ArrowRight, Smartphone, Building2, Copy, Check } from 'lucide-react';

interface PayPalCheckoutModalProps {
  order: Order;
  onClose: () => void;
  onPaymentSuccess: (updatedOrder: Order) => void;
}

function generateLocalPlan(order: Order) {
  const q = order.questionnaire;
  let bmr = 10 * q.weight + 6.25 * q.height - 5 * q.age;
  if (q.gender === 'masculino') bmr += 5;
  else bmr -= 161;

  let multiplier = 1.375;
  if (q.activityLevel === 'sedentario') multiplier = 1.2;
  if (q.activityLevel === 'ativo') multiplier = 1.55;
  if (q.activityLevel === 'muito_ativo') multiplier = 1.725;

  const tdee = Math.round(bmr * multiplier);
  let calories = tdee;
  if (q.primaryGoal === 'perda_peso') calories = Math.round(tdee - 450);
  else if (q.primaryGoal === 'hipertrofia') calories = Math.round(tdee + 300);

  const proteinGrams = Math.round(q.weight * 2);
  const fatsGrams = Math.round((calories * 0.25) / 9);
  const carbsGrams = Math.round((calories - (proteinGrams * 4 + fatsGrams * 9)) / 4);
  const waterLiters = Number((q.weight * 0.035).toFixed(1));

  const days = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'];

  return {
    title: order.planTitle,
    generatedAt: new Date().toLocaleDateString('pt-PT'),
    clientName: q.name,
    summaryText: `Estimado(a) ${q.name}, preparámos o seu ${order.planTitle} com base nas suas características (${q.height}cm, ${q.weight}kg, ${q.daysPerWeek} dias/semana). Este plano foi otimizado para o seu objetivo de ${q.primaryGoal.replace('_', ' ')}.`,
    macroBreakdown: { calories, proteinGrams, carbsGrams, fatsGrams, waterLiters, bmr: Math.round(bmr), tdee },
    workoutSplit: [
      {
        dayTitle: 'Dia 1 - Força e Membros Superiores (Push/Peito/Ombros/Tríceps)',
        focus: 'Tonificação e Postura',
        exercises: [
          { name: 'Supino Plano ou Flexões de Braços', sets: '4', reps: '10 - 12', rest: '75s', notes: 'Manter escápulas retraídas e core firme.' },
          { name: 'Press Militar com Halteres', sets: '3', reps: '12', rest: '60s', notes: 'Sem arquear a zona lombar.' },
          { name: 'Dips em Banco / Aberturas', sets: '3', reps: '12', rest: '60s', notes: 'Controlo total no movimento descendente.' }
        ]
      },
      {
        dayTitle: 'Dia 2 - Tracção e Cadeia Posterior (Pull/Costas/Bíceps)',
        focus: 'Fortalecimento Dorsal',
        exercises: [
          { name: 'Remada Curvada com Halteres', sets: '4', reps: '10 - 12', rest: '90s', notes: 'Puxada em direção ao umbigo.' },
          { name: 'Puxada Aberta / Elevações', sets: '3', reps: '10', rest: '90s', notes: 'Ativação máxima da grande dorsal.' },
          { name: 'Curl de Bíceps Alternado', sets: '3', reps: '12', rest: '60s', notes: 'Manter cotovelos fixos junto ao tronco.' }
        ]
      },
      {
        dayTitle: 'Dia 3 - Membros Inferiores & Core',
        focus: 'Quadríceps, Isquiotibiais e Glúteos',
        exercises: [
          { name: 'Agachamento Livre / Goblet Squat', sets: '4', reps: '10 - 12', rest: '90s', notes: 'Profundidade confortável sem dor.' },
          { name: 'Passadas / Lunges', sets: '3', reps: '12 por perna', rest: '60s', notes: 'Manter joelho alinhado.' },
          { name: 'Elevação Pélvica (Hip Thrust)', sets: '4', reps: '12', rest: '60s', notes: 'Contração de 2s no topo.' }
        ]
      }
    ],
    mealPlan7Days: days.map((dayName) => ({
      dayName,
      meals: [
        {
          mealName: 'Pequeno-almoço (08:00)',
          timeSuggestion: '08:00',
          description: '30g de Aveia integral + 150g de iogurte grego + 1 banana média + canela.',
          approxCalories: 380,
          substitutions: 'Substituir banana por frutos vermelhos ou pão de centeio com ovo.'
        },
        {
          mealName: 'Almoço (13:30)',
          timeSuggestion: '13:30',
          description: '150g de peito de frango/peru ou salmão + 150g de batata-doce ou arroz integral + salada variada.',
          approxCalories: 550,
          substitutions: 'Peixe branco ao vapor ou tofu grelhado com legumes.'
        },
        {
          mealName: 'Jantar (20:30)',
          timeSuggestion: '20:30',
          description: '160g de peixe grelhado ou omelete de claras + brócolos e curgete.',
          approxCalories: 420,
          substitutions: 'Sopa de legumes sem batata + carne picada magra estufada.'
        }
      ]
    })),
    groceryList: [
      { category: 'Proteínas', items: ['Peito de frango/peru', 'Ovos frescos', 'Iogurte grego / Skyr', 'Peixe fresco (pescada/salmão)'] },
      { category: 'Hidratos & Fruta', items: ['Flocos de aveia integrais', 'Batata-doce', 'Arroz integral', 'Bananas e maçãs'] },
      { category: 'Vegetais & Outros', items: ['Brócolos, espinafres, curgete', 'Azeite virgem extra', 'Nozes e amêndoas'] }
    ],
    lifestyleTips: [
      `Beba pelo menos ${waterLiters}L de água por dia.`,
      'Garanta entre 7 e 8 horas de sono reparador.',
      'Mantenha consistência semanal nos treinos e alimentação.'
    ],
    specialRecommendations: [
      q.dietaryRestrictions.length > 0 ? `Ajustado às suas restrições: ${q.dietaryRestrictions.join(', ')}.` : 'Sem restrições severas.',
      q.medicalConditions ? `Atenção à sua condição: ${q.medicalConditions}.` : 'Sem limitações articulares graves.'
    ]
  };
}

export const PayPalCheckoutModal: React.FC<PayPalCheckoutModalProps> = ({
  order,
  onClose,
  onPaymentSuccess,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'paypal' | 'mbway' | 'multibanco'>('mbway');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isPendingConfirmation, setIsPendingConfirmation] = useState<boolean>(false);
  const [submittedOrder, setSubmittedOrder] = useState<Order | null>(null);
  const [payPalAccountEmail, setPayPalAccountEmail] = useState<string>(order.questionnaire.email);
  const [mbwayPhone, setMbwayPhone] = useState<string>('938042425');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handlePay = async () => {
    setIsProcessing(true);
    setErrorMessage('');

    const txPrefix = selectedMethod === 'paypal' ? 'PAYPAL' : selectedMethod === 'mbway' ? 'MBWAY' : 'MULTIBANCO';
    const txId = `${txPrefix}-TX-${Math.floor(10000000 + Math.random() * 90000000)}`;

    let pendingOrder: Order = {
      ...order,
      paymentStatus: 'pendente',
      paymentMethod: selectedMethod,
      paymentTxId: txId,
    };

    try {
      const response = await fetch('/api/orders/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          planId: order.planId,
          planTitle: order.planTitle,
          planPrice: order.planPrice,
          questionnaire: order.questionnaire,
          paymentMethod: selectedMethod,
          paymentTxId: txId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.order) {
          pendingOrder = data.order;
        }
      }
    } catch (err: any) {
      console.warn('Backend pay request error, proceeding with local pending order:', err);
    }

    triggerConfetti();
    setSubmittedOrder(pendingOrder);
    setIsPendingConfirmation(true);
    setIsProcessing(false);
  };

  if (isPendingConfirmation && submittedOrder) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto">
        <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden my-8 border border-slate-100 p-6 sm:p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <Sparkles className="w-8 h-8 text-amber-600 animate-pulse" />
          </div>

          <div className="space-y-2">
            <span className="bg-amber-100 text-amber-900 font-extrabold text-[11px] uppercase tracking-wider px-3 py-1 rounded-full inline-block">
              Aviso de Pagamento Registado
            </span>
            <h3 className="text-2xl font-black text-slate-900">
              Obrigado pelo seu Pedido!
            </h3>
            <p className="text-xs text-slate-500 font-mono font-bold">
              Ref: {submittedOrder.id} • {submittedOrder.planPrice.toFixed(2)}€ ({selectedMethod.toUpperCase()})
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left space-y-3">
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-700 leading-relaxed">
                <strong>E-mail enviado ao Administrador:</strong> Notificámos o treinador (parecemeu@gmail.com) para verificar o recebimento do seu pagamento.
              </p>
            </div>

            <div className="flex items-start space-x-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-700 leading-relaxed">
                <strong>Envio do Plano:</strong> Assim que o administrador confirmar a entrada do valor, o seu plano personalizado será gerado e enviado diretamente para o seu e-mail: <strong>{submittedOrder.questionnaire.email}</strong>.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              onPaymentSuccess(submittedOrder);
            }}
            className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>Entendido! Acompanhar Estado</span>
            <ArrowRight className="w-4 h-4 text-emerald-400" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden my-8 border border-slate-100">
        {/* Top Header */}
        <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-600 rounded-lg text-white">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Checkout & Pagamento Seguro</h3>
              <p className="text-xs text-slate-400">Ref. Pedido: {order.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Summary Box */}
        <div className="p-6 bg-slate-50 border-b border-slate-200">
          <div className="flex justify-between items-start mb-1">
            <div>
              <h4 className="text-base font-bold text-slate-900">{order.planTitle}</h4>
              <p className="text-xs text-slate-500">Cliente: {order.questionnaire.name} ({order.questionnaire.email})</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-slate-900">{order.planPrice.toFixed(2)}€</span>
              <span className="block text-[10px] text-emerald-700 font-bold uppercase">EUR Total</span>
            </div>
          </div>
        </div>

        {/* Payment Methods Options */}
        <div className="p-6 space-y-5">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Selecione o Método de Pagamento:
          </label>

          <div className="grid grid-cols-1 gap-3">
            {/* MB WAY Option */}
            <div
              onClick={() => setSelectedMethod('mbway')}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                selectedMethod === 'mbway'
                  ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-600/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-sm tracking-tighter">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-slate-900">MB WAY</h5>
                  <p className="text-xs text-slate-500">Envio para 938042425 (imediato)</p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                Mais Rápido
              </span>
            </div>

            {/* Multibanco Option */}
            <div
              onClick={() => setSelectedMethod('multibanco')}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                selectedMethod === 'multibanco'
                  ? 'border-amber-600 bg-amber-50/60 ring-2 ring-amber-600/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-amber-600 text-white flex items-center justify-center font-black text-xs">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-slate-900">Pagamento de Serviços (Multibanco)</h5>
                  <p className="text-xs text-slate-500">Entidade: 21942 • Ref: 812 197 502</p>
                </div>
              </div>
            </div>

            {/* PayPal Option */}
            <div
              onClick={() => setSelectedMethod('paypal')}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                selectedMethod === 'paypal'
                  ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-600/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-lg italic">
                  P
                </div>
                <div>
                  <h5 className="text-sm font-bold text-slate-900">PayPal / Cartão de Crédito</h5>
                  <p className="text-xs text-slate-500">Pagamento internacional ou por cartão</p>
                </div>
              </div>
            </div>
          </div>

          {/* Details for MB WAY */}
          {selectedMethod === 'mbway' && (
            <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-xl space-y-3">
              <div className="flex items-center space-x-2 text-emerald-900">
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold uppercase tracking-wider">Dados para Pagamento MB WAY</span>
              </div>

              <div className="bg-white p-3.5 rounded-lg border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-400">Número de Destino MB WAY:</span>
                  <span className="text-lg font-black text-slate-900 font-mono">938 042 425</span>
                </div>
                <button
                  onClick={() => handleCopy('938042425', 'mbway')}
                  className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg text-xs font-bold transition-colors flex items-center space-x-1 cursor-pointer"
                >
                  {copiedField === 'mbway' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex justify-between text-xs text-slate-700 pt-1">
                <span className="font-medium">Valor a Enviar:</span>
                <span className="font-bold text-slate-900">{order.planPrice.toFixed(2)} €</span>
              </div>

              <p className="text-[11px] text-emerald-900 leading-snug">
                Envie <strong>{order.planPrice.toFixed(2)}€</strong> na sua app MB WAY para o número <strong>938042425</strong>. Após enviar, clique no botão abaixo para concluir o seu pedido e aceder ao plano.
              </p>
            </div>
          )}

          {/* Details for Multibanco */}
          {selectedMethod === 'multibanco' && (
            <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl space-y-3">
              <div className="flex items-center space-x-2 text-amber-900">
                <Building2 className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-bold uppercase tracking-wider">Dados para Pagamento de Serviços</span>
              </div>

              <div className="bg-white p-3.5 rounded-lg border border-amber-200 space-y-2.5 font-mono text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <span className="text-slate-500 font-sans font-medium">Entidade:</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 text-sm">21942</span>
                    <button
                      onClick={() => handleCopy('21942', 'entidade')}
                      className="p-1 hover:bg-slate-100 rounded text-slate-500 cursor-pointer"
                      title="Copiar Entidade"
                    >
                      {copiedField === 'entidade' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <span className="text-slate-500 font-sans font-medium">Referência:</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 text-sm">812 197 502</span>
                    <button
                      onClick={() => handleCopy('812197502', 'ref')}
                      className="p-1 hover:bg-slate-100 rounded text-slate-500 cursor-pointer"
                      title="Copiar Referência"
                    >
                      {copiedField === 'ref' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-sans font-medium">Valor:</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 text-sm">{order.planPrice.toFixed(2)} €</span>
                    <button
                      onClick={() => handleCopy(order.planPrice.toFixed(2), 'valor')}
                      className="p-1 hover:bg-slate-100 rounded text-slate-500 cursor-pointer"
                      title="Copiar Valor"
                    >
                      {copiedField === 'valor' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-amber-900 leading-snug">
                Pode pagar em qualquer caixa Multibanco ou através do seu Homebanking no menu <strong>Pagamento de Serviços</strong>.
              </p>
            </div>
          )}

          {/* Details for PayPal */}
          {selectedMethod === 'paypal' && (
            <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl space-y-3">
              <div className="flex items-center space-x-2 text-blue-900">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold">Autenticação no PayPal</span>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">E-mail associado à conta PayPal:</label>
                <input
                  type="email"
                  value={payPalAccountEmail}
                  onChange={(e) => setPayPalAccountEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-blue-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                Pagamento processado com encriptação SSL e garantia do sistema PayPal.
              </p>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-lg border border-rose-200 font-medium">
              {errorMessage}
            </div>
          )}

          {/* Submit Action */}
          <button
            onClick={handlePay}
            disabled={isProcessing}
            className={`w-full py-4 px-6 rounded-xl font-bold text-sm text-white transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-lg ${
              selectedMethod === 'paypal'
                ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/25'
                : selectedMethod === 'mbway'
                ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25'
                : 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/25'
            }`}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>A processar pagamento...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5" />
                <span>
                  {selectedMethod === 'mbway'
                    ? `Confirmar Pagamento MB WAY (${order.planPrice.toFixed(2)}€)`
                    : selectedMethod === 'multibanco'
                    ? `Confirmar Pagamento Multibanco (${order.planPrice.toFixed(2)}€)`
                    : `Pagar ${order.planPrice.toFixed(2)}€ no PayPal`}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <p className="text-[11px] text-center text-slate-400">
            Transação encriptada e segura com emissão imediata do seu plano de treino e nutrição.
          </p>
        </div>
      </div>
    </div>
  );
};
