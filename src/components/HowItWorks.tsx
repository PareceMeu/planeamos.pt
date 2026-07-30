import React from 'react';
import { ClipboardList, CreditCard, Sparkles, Send, ShieldCheck } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Escolha o seu Plano',
      desc: 'Selecione entre Treino, Nutrição, Transformação 360 ou os nossos Planos Sociais Especiais (Sénior 50+, Sono, Pós-Parto).',
      icon: Sparkles,
      color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=600&q=80',
    },
    {
      num: '02',
      title: 'Preencha o Questionário',
      desc: 'Indique a sua idade, peso, altura, restrições alimentares, rotina, gostos e preferências de exercício.',
      icon: ClipboardList,
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=600&q=80',
    },
    {
      num: '03',
      title: 'Pagamento Seguro',
      desc: 'Conclua com toda a segurança via MB WAY, Multibanco ou PayPal com proteção do comprador.',
      icon: CreditCard,
      color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=600&q=80',
    },
    {
      num: '04',
      title: 'Criação & Envio por E-mail',
      desc: 'O nosso motor inteligente processa o seu plano de 7 dias e envia o documento para o seu e-mail em segundos.',
      icon: Send,
      color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
    },
  ];

  return (
    <section className="py-16 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            Simplicidade & Eficiência
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-3 tracking-tight">
            Como Funciona o planeamos.pt?
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            Um processo automatizado e intuitivo pensado para que obtenha a sua rotina personalizada sem complicações.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((step, idx) => {
            const IconComp = step.icon;
            return (
              <div key={idx} className="relative bg-slate-50 rounded-2xl overflow-hidden border border-slate-200/80 hover:shadow-lg transition-all flex flex-col justify-between">
                <div>
                  <div className="relative h-36 w-full overflow-hidden bg-slate-900">
                    <img
                      src={step.image}
                      alt={step.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover opacity-85 hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 text-2xl font-black text-white drop-shadow-md">
                      {step.num}
                    </span>
                    <div className={`absolute top-3 right-3 p-2 rounded-xl border shadow-sm ${step.color}`}>
                      <IconComp className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-base font-bold text-slate-900 mb-1.5">{step.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Security callout */}
        <div className="mt-12 bg-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-slate-800">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl shrink-0">
              <ShieldCheck className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">Métodos de Pagamento Seguros & Convenientes</h4>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                Aceitamos <strong>MB WAY</strong>, <strong>Referência Multibanco</strong> e <strong>PayPal</strong>. Todas as transações são encriptadas de ponta a ponta com máxima segurança.
              </p>
            </div>
          </div>
          <div className="text-center md:text-right shrink-0">
            <span className="inline-block bg-emerald-500/20 border border-emerald-500/30 px-4 py-2 rounded-xl text-xs font-bold text-emerald-300">
              ✓ MB WAY • Multibanco • PayPal
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
