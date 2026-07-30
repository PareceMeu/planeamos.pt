import React, { useState } from 'react';
import { PlanType, QuestionnaireData } from '../types';
import { X, ArrowRight, ArrowLeft, CheckCircle2, User, Activity, Utensils, Dumbbell, ShieldAlert, Sparkles, Loader2 } from 'lucide-react';

interface QuestionnaireModalProps {
  plan: PlanType;
  onClose: () => void;
  onSubmitQuestionnaire: (data: QuestionnaireData) => void;
}

export const QuestionnaireModal: React.FC<QuestionnaireModalProps> = ({
  plan,
  onClose,
  onSubmitQuestionnaire,
}) => {
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [formData, setFormData] = useState<QuestionnaireData>({
    name: '',
    email: 'parecemeu@gmail.com', // Pre-filled with user email for convenience
    phone: '',
    age: 32,
    gender: 'masculino',
    height: 175,
    weight: 75,
    targetWeight: 70,
    activityLevel: 'moderado',
    primaryGoal:
      plan.category === 'sociedade'
        ? plan.id === 'longevidade-senior'
          ? 'saude_longevidade'
          : plan.id === 'produtividade-sono'
          ? 'stress_sono'
          : plan.id === 'pos-parto'
          ? 'pos_parto'
          : plan.id === 'ergonomia-trabalho-remoto'
          ? 'postura_ergonomia'
          : 'resistencia_corrida'
        : 'perda_peso',
    medicalConditions: '',
    dietaryRestrictions: [],
    foodPreferences: '',
    workoutLocation: 'casa',
    equipmentAvailable: ['halteres'],
    daysPerWeek: 4,
    additionalNotes: '',
  });

  const toggleRestriction = (item: string) => {
    setFormData((prev) => {
      const exists = prev.dietaryRestrictions.includes(item);
      return {
        ...prev,
        dietaryRestrictions: exists
          ? prev.dietaryRestrictions.filter((r) => r !== item)
          : [...prev.dietaryRestrictions, item],
      };
    });
  };

  const toggleEquipment = (item: string) => {
    setFormData((prev) => {
      const exists = prev.equipmentAvailable.includes(item);
      return {
        ...prev,
        equipmentAvailable: exists
          ? prev.equipmentAvailable.filter((e) => e !== item)
          : [...prev.equipmentAvailable, item],
      };
    });
  };

  const isStepValid = () => {
    if (step === 1) return formData.name.trim().length >= 2 && formData.email.includes('@');
    if (step === 2) return formData.age > 10 && formData.height > 100 && formData.weight > 30;
    if (step === 3) return formData.daysPerWeek >= 1;
    if (step === 4) return true;
    return true;
  };

  const handleNext = async () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      setIsSubmitting(true);
      try {
        await onSubmitQuestionnaire(formData);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Instant calculation for real-time engagement
  const bmi = (formData.weight / ((formData.height / 100) * (formData.height / 100))).toFixed(1);
  const waterMin = (formData.weight * 0.035).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden my-8 border border-slate-100">
        {/* Top Header */}
        <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/20">
                Questionário de Personalização
              </span>
              <span className="text-xs text-slate-400">Passo {step} de 5</span>
            </div>
            <h3 className="text-lg font-bold text-white mt-1">Plano: {plan.title} ({plan.price.toFixed(2)}€)</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-2">
          <div
            className="bg-emerald-500 h-2 transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* STEP 1: Contact & Identification */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-emerald-600 mb-2">
                <User className="w-6 h-6" />
                <h4 className="text-lg font-bold text-slate-900">1. Contacto e Identificação</h4>
              </div>
              <p className="text-xs text-slate-500">
                Onde devemos enviar o seu plano personalizado e o comprovativo de pagamento?
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nome Completo *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: João Silva"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">E-mail para Envio do Plano *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="exemplo@dominio.pt"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-sm"
                />
                <p className="text-[11px] text-slate-500 mt-1">O seu plano será enviado para este e-mail imediatamente após o pagamento.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Idade *</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Género *</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-sm bg-white"
                  >
                    <option value="masculino">Masculino</option>
                    <option value="feminino">Feminino</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Physical Metrics */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-emerald-600 mb-2">
                <Activity className="w-6 h-6" />
                <h4 className="text-lg font-bold text-slate-900">2. Perfil Físico & Biometria</h4>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Altura (cm) *</label>
                  <input
                    type="number"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: Number(e.target.value) })}
                    placeholder="175"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Peso Atual (kg) *</label>
                  <input
                    type="number"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                    placeholder="75"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Peso Objetivo (kg)</label>
                <input
                  type="number"
                  value={formData.targetWeight || ''}
                  onChange={(e) => setFormData({ ...formData, targetWeight: Number(e.target.value) })}
                  placeholder="70"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nível de Atividade Diária</label>
                <select
                  value={formData.activityLevel}
                  onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value as any })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-sm bg-white"
                >
                  <option value="sedentario">Sedentário (Trabalho sentado, pouco movimento)</option>
                  <option value="moderado">Moderado (Caminhadas diárias, atividade leve)</option>
                  <option value="ativo">Ativo (Exercício 3-4x por semana)</option>
                  <option value="muito_ativo">Muito Ativo (Trabalho físico pesado ou treino diário)</option>
                </select>
              </div>

              {/* Instant Biometrics Preview Box */}
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-900 block">Indicadores Biométricos Calculados:</span>
                  <span className="text-xs text-emerald-700">IMC estimado: <strong>{bmi}</strong> kg/m²</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-900 block">Hidratação Mínima:</span>
                  <span className="text-xs text-emerald-700"><strong>{waterMin} Litros</strong> / dia</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Goals & Training Setup */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-emerald-600 mb-2">
                <Dumbbell className="w-6 h-6" />
                <h4 className="text-lg font-bold text-slate-900">3. Objetivos e Estrutura de Treino</h4>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Objetivo Principal *</label>
                <select
                  value={formData.primaryGoal}
                  onChange={(e) => setFormData({ ...formData, primaryGoal: e.target.value as any })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-sm bg-white"
                >
                  <option value="perda_peso">Perda de Gordura & Definição</option>
                  <option value="hipertrofia">Ganho de Massa Muscular</option>
                  <option value="recomposicao">Recomposição Corporal (Perder gordura e ganhar músculo)</option>
                  <option value="saude_longevidade">Longevidade, Vitalidade & Saúde 50+</option>
                  <option value="stress_sono">Melhoria do Sono, Foco & Redução de Cortisol</option>
                  <option value="pos_parto">Recuperação Pós-Parto & Pavimento Pélvico</option>
                  <option value="postura_ergonomia">Correção Postural & Trabalho Remoto</option>
                  <option value="resistencia_corrida">Preparação para Corrida / Provas</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Local de Treino Principal</label>
                  <select
                    value={formData.workoutLocation}
                    onChange={(e) => setFormData({ ...formData, workoutLocation: e.target.value as any })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-sm bg-white"
                  >
                    <option value="ginasio">Ginásio Comercial</option>
                    <option value="casa">Em Casa</option>
                    <option value="outdoor">Ao Ar Livre / Parque</option>
                    <option value="escritorio">Escritório / Cadeira</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Dias p/ Semana Disponíveis</label>
                  <select
                    value={formData.daysPerWeek}
                    onChange={(e) => setFormData({ ...formData, daysPerWeek: Number(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-sm bg-white"
                  >
                    <option value={2}>2 Dias por semana</option>
                    <option value={3}>3 Dias por semana</option>
                    <option value={4}>4 Dias por semana</option>
                    <option value={5}>5 Dias por semana</option>
                    <option value={6}>6 Dias por semana</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Equipamento que Possui:</label>
                <div className="flex flex-wrap gap-2">
                  {['halteres', 'elasticos', 'barra', 'kettlebell', 'tapete', 'nenhum'].map((eq) => {
                    const isSelected = formData.equipmentAvailable.includes(eq);
                    return (
                      <button
                        key={eq}
                        type="button"
                        onClick={() => toggleEquipment(eq)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {eq === 'nenhum' ? 'Apenas Peso Corporal' : eq}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Nutrition & Health Limitations */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-emerald-600 mb-2">
                <Utensils className="w-6 h-6" />
                <h4 className="text-lg font-bold text-slate-900">4. Nutrição, Alergias & Saúde</h4>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Restrições ou Intolerâncias Alimentares:</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    'sem_lactose',
                    'sem_gluten',
                    'vegetariano',
                    'vegan',
                    'sem_porco',
                    'sem_marisco',
                    'diabetes',
                  ].map((item) => {
                    const isSelected = formData.dietaryRestrictions.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleRestriction(item)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {item.replace('_', ' ')}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Gostos ou Alimentos a Evitar</label>
                <input
                  type="text"
                  value={formData.foodPreferences}
                  onChange={(e) => setFormData({ ...formData, foodPreferences: e.target.value })}
                  placeholder="Ex: Adoro frango e salmão; não aprecio brócolos e coentros."
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                  <span>Condições Médicas, Lesões ou Dores Articulares</span>
                </label>
                <textarea
                  rows={2}
                  value={formData.medicalConditions}
                  onChange={(e) => setFormData({ ...formData, medicalConditions: e.target.value })}
                  placeholder="Ex: Dor na zona lombar ao agachar, hipertensão ligeira..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-sm"
                />
              </div>
            </div>
          )}

          {/* STEP 5: Final Review */}
          {step === 5 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-emerald-600 mb-2">
                <CheckCircle2 className="w-6 h-6" />
                <h4 className="text-lg font-bold text-slate-900">5. Confirmação do Perfil</h4>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs text-slate-700">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="font-bold text-slate-900">Nome:</span>
                  <span>{formData.name}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="font-bold text-slate-900">E-mail:</span>
                  <span className="font-semibold text-emerald-700">{formData.email}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="font-bold text-slate-900">Plano Selecionado:</span>
                  <span className="font-bold text-slate-900">{plan.title} ({plan.price.toFixed(2)}€)</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="font-bold text-slate-900">Perfil Físico:</span>
                  <span>{formData.height}cm / {formData.weight}kg ({formData.age} anos)</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="font-bold text-slate-900">Objetivo:</span>
                  <span className="capitalize">{formData.primaryGoal.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-slate-900">Frequência:</span>
                  <span>{formData.daysPerWeek} dias/semana em ({formData.workoutLocation})</span>
                </div>
              </div>

              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-start space-x-3">
                <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-xs text-emerald-900 leading-relaxed">
                  Tudo pronto! Ao avançar, poderá escolher o seu método de pagamento preferido (<strong>MB WAY</strong>, <strong>Referência Multibanco</strong> ou <strong>PayPal</strong>). Logo após a verificação do pagamento, o seu plano personalizado será gerado e enviado para <strong>{formData.email}</strong>.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-lg transition-colors flex items-center space-x-1 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={handleNext}
            disabled={!isStepValid() || isSubmitting}
            className={`px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center space-x-2 cursor-pointer ${
              isStepValid() && !isSubmitting
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>A carregar Pagamento...</span>
              </>
            ) : (
              <>
                <span>{step === 5 ? 'Avançar para Pagamento (MB WAY / MB / PayPal)' : 'Próximo Passo'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
