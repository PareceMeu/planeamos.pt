import React, { useState } from 'react';
import { Order, PlanDocument } from '../types';
import { X, Printer, Mail, Download, Dumbbell, Utensils, ShoppingCart, Sparkles, Activity, CheckSquare, Square, RefreshCw, CheckCircle2, Loader2 } from 'lucide-react';
import { exportPlanToPDF } from '../utils/pdfGenerator';

interface PlanViewModalProps {
  order: Order;
  onClose: () => void;
  onResendEmail?: (orderId: string) => void;
}

export const PlanViewModal: React.FC<PlanViewModalProps> = ({
  order,
  onClose,
  onResendEmail,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'workout' | 'nutrition' | 'grocery' | 'lifestyle'>('overview');
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [checkedGroceryItems, setCheckedGroceryItems] = useState<Record<string, boolean>>({});
  const [isResending, setIsResending] = useState<boolean>(false);
  const [isExportingPDF, setIsExportingPDF] = useState<boolean>(false);
  const [resendSuccessMsg, setResendSuccessMsg] = useState<string>('');

  const doc = order.planDocument;

  if (!doc) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
        <div className="bg-white rounded-2xl p-8 max-w-md text-center space-y-4">
          <Sparkles className="w-12 h-12 text-emerald-600 mx-auto animate-pulse" />
          <h3 className="text-xl font-bold text-slate-900">A Gerar o Seu Plano...</h3>
          <p className="text-xs text-slate-600">O motor inteligente do planeamos.pt está a estruturar as suas rotinas. Por favor aguarde 5 segundos.</p>
        </div>
      </div>
    );
  }

  const toggleGroceryItem = (key: string) => {
    setCheckedGroceryItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleDownloadPDF = async () => {
    setIsExportingPDF(true);
    try {
      await exportPlanToPDF(order);
    } catch (e) {
      console.error('Failed to export PDF:', e);
      window.print();
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setResendSuccessMsg('');
    try {
      const res = await fetch('/api/orders/resend-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.id }),
      });
      const data = await res.json();
      if (data.success) {
        setResendSuccessMsg(`Cópia enviada com sucesso para ${order.questionnaire.email}!`);
        if (onResendEmail) onResendEmail(order.id);
      }
    } catch (e) {
      setResendSuccessMsg('Erro ao reenviar e-mail.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden my-4 sm:my-8 border border-slate-200 flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/20">
                planeamos.pt • Plano Ativo
              </span>
              <span className="text-xs text-slate-400">Fatura: {order.id}</span>
            </div>
            <h2 className="text-xl font-extrabold text-white mt-1">{doc.title}</h2>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownloadPDF}
              disabled={isExportingPDF}
              className="px-3 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 rounded-lg transition-colors flex items-center space-x-1.5 cursor-pointer shadow-sm"
              title="Baixar ficheiro PDF completo"
            >
              {isExportingPDF ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span className="hidden sm:inline">A Gerar PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Guardar PDF</span>
                </>
              )}
            </button>

            <button
              onClick={handleResend}
              disabled={isResending}
              className="px-3 py-2 text-xs font-semibold text-emerald-300 hover:text-emerald-100 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800 rounded-lg transition-colors flex items-center space-x-1 cursor-pointer"
              title="Reenviar por E-mail"
            >
              <Mail className="w-4 h-4" />
              <span className="hidden sm:inline">{isResending ? 'A Enviar...' : 'Reenviar E-mail'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {resendSuccessMsg && (
          <div className="bg-emerald-50 text-emerald-800 text-xs px-6 py-2 border-b border-emerald-200 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{resendSuccessMsg}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="bg-slate-100 px-6 py-2 border-b border-slate-200 flex space-x-1 sm:space-x-2 overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Visão Geral & Macros</span>
          </button>

          <button
            onClick={() => setActiveTab('workout')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'workout'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Dumbbell className="w-4 h-4" />
            <span>Plano de Treino</span>
          </button>

          <button
            onClick={() => setActiveTab('nutrition')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'nutrition'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Utensils className="w-4 h-4" />
            <span>Dieta (7 Dias)</span>
          </button>

          <button
            onClick={() => setActiveTab('grocery')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'grocery'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Lista de Compras</span>
          </button>

          <button
            onClick={() => setActiveTab('lifestyle')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'lifestyle'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Hábitos & Dicas</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Summary Card */}
              <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-slate-900">Estratégia Nutricional para {doc.clientName}</h3>
                  <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                    Gerado a {doc.generatedAt}
                  </span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">{doc.summaryText}</p>
              </div>

              {/* Macros Breakdown Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-900 text-white p-4 rounded-xl text-center">
                  <span className="text-xs text-slate-400 block font-semibold">Meta Calórica</span>
                  <span className="text-2xl font-black text-emerald-400">{doc.macroBreakdown.calories}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">kcal / dia</span>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-center">
                  <span className="text-xs text-slate-500 block font-bold">Proteínas</span>
                  <span className="text-2xl font-black text-slate-900">{doc.macroBreakdown.proteinGrams}g</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">~{(doc.macroBreakdown.proteinGrams * 4)} kcal</span>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-center">
                  <span className="text-xs text-slate-500 block font-bold">Hidratos</span>
                  <span className="text-2xl font-black text-slate-900">{doc.macroBreakdown.carbsGrams}g</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">~{(doc.macroBreakdown.carbsGrams * 4)} kcal</span>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-center">
                  <span className="text-xs text-slate-500 block font-bold">Gorduras</span>
                  <span className="text-2xl font-black text-slate-900">{doc.macroBreakdown.fatsGrams}g</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">~{(doc.macroBreakdown.fatsGrams * 9)} kcal</span>
                </div>
              </div>

              {/* Metabolic Baseline Bar */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
                <div>
                  <span className="font-bold text-slate-900">Taxa Metabólica Basal (TMB):</span> {doc.macroBreakdown.bmr} kcal
                </div>
                <div>
                  <span className="font-bold text-slate-900">Gasto Calórico Total (TDEE):</span> {doc.macroBreakdown.tdee} kcal
                </div>
                <div>
                  <span className="font-bold text-emerald-800">Meta de Hidratação:</span> {doc.macroBreakdown.waterLiters} Litros/dia
                </div>
              </div>
            </div>
          )}

          {/* WORKOUT TAB */}
          {activeTab === 'workout' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900">Plano de Treino Semanal Personalizado</h3>

              <div className="space-y-6">
                {doc.workoutSplit.map((day, idx) => (
                  <div key={idx} className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
                    <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
                      <h4 className="font-bold text-sm sm:text-base">{day.dayTitle}</h4>
                      <span className="text-xs bg-emerald-500 text-slate-950 font-bold px-2.5 py-0.5 rounded-full">
                        Foco: {day.focus}
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                            <th className="p-3">Exercício</th>
                            <th className="p-3">Séries</th>
                            <th className="p-3">Repetições</th>
                            <th className="p-3">Descanso</th>
                            <th className="p-3">Notas de Execução</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {day.exercises.map((ex, exIdx) => (
                            <tr key={exIdx} className="hover:bg-slate-50/80 transition-colors">
                              <td className="p-3 font-bold text-slate-900">{ex.name}</td>
                              <td className="p-3 font-semibold text-emerald-700">{ex.sets}</td>
                              <td className="p-3 font-semibold text-slate-800">{ex.reps}</td>
                              <td className="p-3 text-slate-600">{ex.rest}</td>
                              <td className="p-3 text-slate-500 text-[11px]">{ex.notes || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* NUTRITION TAB */}
          {activeTab === 'nutrition' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">Plano Alimentar de 7 Dias</h3>
                {/* Day selector pills */}
                <div className="flex space-x-1 overflow-x-auto max-w-full">
                  {doc.mealPlan7Days.map((d, dIdx) => (
                    <button
                      key={dIdx}
                      onClick={() => setSelectedDayIndex(dIdx)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap ${
                        selectedDayIndex === dIdx
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {d.dayName.split('-')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Day Meals Details */}
              {doc.mealPlan7Days[selectedDayIndex] && (
                <div className="space-y-4">
                  <div className="bg-emerald-50 border border-emerald-200 px-4 py-2.5 rounded-xl font-bold text-emerald-900 text-xs">
                    Cardápio para: {doc.mealPlan7Days[selectedDayIndex].dayName}
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {doc.mealPlan7Days[selectedDayIndex].meals.map((meal, mIdx) => (
                      <div key={mIdx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                        <div className="flex justify-between items-center">
                          <h4 className="font-bold text-slate-900 text-sm">{meal.mealName}</h4>
                          {meal.approxCalories && (
                            <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                              ~{meal.approxCalories} kcal
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed">{meal.description}</p>
                        {meal.substitutions && (
                          <p className="text-[11px] text-slate-500 italic bg-white p-2 rounded-lg border border-slate-200">
                            💡 <strong>Opção de Substituição:</strong> {meal.substitutions}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* GROCERY LIST TAB */}
          {activeTab === 'grocery' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900">Lista de Compras para o Supermercado</h3>
              <p className="text-xs text-slate-500">Marque os itens à medida que os adiciona ao seu carrinho.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {doc.groceryList.map((cat, cIdx) => (
                  <div key={cIdx} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                    <h4 className="font-bold text-sm text-slate-900 border-b border-slate-200 pb-2 flex items-center justify-between">
                      <span>{cat.category}</span>
                      <span className="text-xs font-normal text-slate-400">({cat.items.length} itens)</span>
                    </h4>

                    <div className="space-y-2">
                      {cat.items.map((item, iIdx) => {
                        const key = `${cIdx}-${iIdx}`;
                        const isChecked = checkedGroceryItems[key];
                        return (
                          <div
                            key={iIdx}
                            onClick={() => toggleGroceryItem(key)}
                            className="flex items-center space-x-2.5 cursor-pointer text-xs text-slate-700 hover:text-slate-900"
                          >
                            {isChecked ? (
                              <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-400 shrink-0" />
                            )}
                            <span className={isChecked ? 'line-through text-slate-400' : 'font-medium'}>
                              {item}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LIFESTYLE TAB */}
          {activeTab === 'lifestyle' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900">Hábitos, Sono & Recomendações Especiais</h3>

              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <h4 className="font-bold text-sm text-slate-900">Dicas para o Dia a Dia:</h4>
                <ul className="space-y-2 text-xs text-slate-700 list-disc pl-5">
                  {doc.lifestyleTips.map((tip, idx) => (
                    <li key={idx} className="leading-relaxed">{tip}</li>
                  ))}
                </ul>
              </div>

              {doc.specialRecommendations && doc.specialRecommendations.length > 0 && (
                <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-3">
                  <h4 className="font-bold text-sm text-emerald-900">Ajustes para Condições/Restrições Indicação Pessoal:</h4>
                  <ul className="space-y-2 text-xs text-emerald-800 list-disc pl-5">
                    {doc.specialRecommendations.map((rec, idx) => (
                      <li key={idx} className="leading-relaxed">{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>planeamos.pt • Todos os direitos reservados</span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
