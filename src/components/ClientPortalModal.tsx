import React, { useState, useEffect } from 'react';
import { Order } from '../types';
import { X, Search, UserCheck, Eye, Mail, ShieldCheck, Clock, ArrowRight } from 'lucide-react';

interface ClientPortalModalProps {
  onClose: () => void;
  onOpenOrderPlan: (order: Order) => void;
}

export const ClientPortalModal: React.FC<ClientPortalModalProps> = ({
  onClose,
  onOpenOrderPlan,
}) => {
  const [emailInput, setEmailInput] = useState<string>('parecemeu@gmail.com');
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const fetchOrders = async (email: string) => {
    if (!email.trim()) return;
    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch(`/api/orders/search/email?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setOrders(data.orders || []);
        setHasSearched(true);
      } else {
        setOrders([]);
        setHasSearched(true);
      }
    } catch (e) {
      setOrders([]);
      setHasSearched(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders('parecemeu@gmail.com');
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders(emailInput);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden my-8 border border-slate-100">
        {/* Top Header */}
        <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-600 rounded-lg text-white">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Área do Cliente • Meus Planos</h3>
              <p className="text-xs text-slate-400">Aceda a todos os seus planos e faturas no planeamos.pt</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Email Search Bar */}
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Insira o seu e-mail para procurar..."
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer shrink-0"
            >
              {isLoading ? 'A procurar...' : 'Procurar'}
            </button>
          </form>

          {errorMsg && (
            <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-lg border border-rose-200 font-medium">
              {errorMsg}
            </div>
          )}

          {/* Orders Results */}
          <div className="space-y-4 max-h-[50vh] overflow-y-auto">
            {orders.length === 0 && hasSearched && !isLoading && (
              <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
                <p className="text-sm font-semibold text-slate-700">Nenhum plano encontrado para este e-mail.</p>
                <p className="text-xs text-slate-500 mt-1">Introduza o e-mail que indicou ao realizar o seu pedido no site.</p>
              </div>
            )}

            {orders.map((ord) => (
              <div
                key={ord.id}
                className="p-5 bg-white border border-slate-200 hover:border-emerald-500 rounded-2xl shadow-xs transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-slate-500">{ord.id}</span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                        ord.paymentStatus === 'pago'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ord.paymentStatus === 'pendente'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {ord.paymentStatus === 'pago'
                        ? '✓ Pago & Libertado'
                        : ord.paymentStatus === 'pendente'
                        ? '⏳ Aguarda Confirmação do Administrador'
                        : 'Rejeitado'}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mt-1">{ord.planTitle}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Adquirido a {new Date(ord.createdAt).toLocaleDateString('pt-PT')} • {ord.planPrice.toFixed(2)}€ ({ord.paymentMethod.toUpperCase()})
                  </p>
                  {ord.paymentStatus === 'pendente' && (
                    <p className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg mt-2">
                      Aviso enviado para o administrador (parecemeu@gmail.com). O seu plano será ativado assim que a transferência for verificada.
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  {ord.paymentStatus === 'pago' && ord.planDocument ? (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenOrderPlan(ord);
                      }}
                      className="w-full sm:w-auto px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <Eye className="w-4 h-4 text-emerald-400" />
                      <span>Ver Plano & PDF</span>
                    </button>
                  ) : (
                    <div className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-2 rounded-xl flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Em Verificação</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
