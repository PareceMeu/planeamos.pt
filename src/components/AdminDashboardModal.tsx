import React, { useState, useEffect } from 'react';
import { Order } from '../types';
import { X, LayoutDashboard, DollarSign, Users, Mail, RefreshCw, Eye, CheckCircle2, AlertTriangle, Check, Loader2, XCircle } from 'lucide-react';

interface AdminDashboardModalProps {
  onClose: () => void;
  onOpenOrderPlan: (order: Order) => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  onClose,
  onOpenOrderPlan,
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState<string>('');

  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      if (res.ok && data.success) {
        setOrders(data.orders || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleConfirmPayment = async (orderId: string) => {
    setConfirmingId(orderId);
    setActionMsg('');
    try {
      const res = await fetch('/api/admin/confirm-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });
      const data = await res.json();
      if (data.success) {
        setActionMsg(`🎉 ${data.message}`);
        loadAdminData();
      }
    } catch (e) {
      setActionMsg('Erro ao confirmar pagamento.');
    } finally {
      setConfirmingId(null);
    }
  };

  const handleRejectPayment = async (orderId: string) => {
    setRejectingId(orderId);
    setActionMsg('');
    try {
      const res = await fetch('/api/admin/reject-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });
      const data = await res.json();
      if (data.success) {
        setActionMsg(`Pedido ${orderId} marcado como rejeitado.`);
        loadAdminData();
      }
    } catch (e) {
      setActionMsg('Erro ao rejeitar pedido.');
    } finally {
      setRejectingId(null);
    }
  };

  const handleResend = async (orderId: string) => {
    try {
      const res = await fetch('/api/orders/resend-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });
      const data = await res.json();
      if (data.success) {
        setActionMsg(`E-mail enviado novamente para o pedido ${orderId}`);
        loadAdminData();
      }
    } catch (e) {
      setActionMsg('Erro ao enviar e-mail.');
    }
  };

  const pendingOrders = orders.filter((o) => o.paymentStatus === 'pendente');
  const paidOrders = orders.filter((o) => o.paymentStatus === 'pago');

  const totalRevenue = paidOrders.reduce((sum, o) => sum + o.planPrice, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden my-8 border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-lg text-white">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Painel do Administrador (parecemeu@gmail.com)</h3>
              <p className="text-xs text-slate-400">Validação de Pagamentos MB WAY / Multibanco / PayPal e Envio de Planos</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {actionMsg && (
            <div className="p-4 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-xl border border-emerald-200 flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{actionMsg}</span>
            </div>
          )}

          {/* Pending Payments Alert Section */}
          <div className="bg-amber-50 border-2 border-amber-300/80 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <h4 className="font-extrabold text-amber-900 text-sm uppercase tracking-wide">
                  Pagamentos a Aguardar Validação do Administrador ({pendingOrders.length})
                </h4>
              </div>
              <button
                onClick={loadAdminData}
                className="text-xs font-semibold text-amber-800 hover:text-amber-950 flex items-center space-x-1 bg-amber-100 px-2.5 py-1 rounded-lg"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Atualizar Lista</span>
              </button>
            </div>

            <p className="text-xs text-amber-800 leading-relaxed mb-4">
              O comprador submeteu o pedido e recebeu a confirmação. O plano <strong>NÃO</strong> é libertado até clicar no botão abaixo para confirmar o recebimento na conta bancária/PayPal.
            </p>

            {pendingOrders.length === 0 ? (
              <div className="bg-white/80 p-4 rounded-xl border border-amber-200 text-center text-xs text-slate-600 font-medium">
                ✅ Não há nenhum pagamento pendente de validação neste momento.
              </div>
            ) : (
              <div className="space-y-3">
                {pendingOrders.map((ord) => (
                  <div key={ord.id} className="bg-white p-4 rounded-xl border border-amber-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-xs">{ord.id}</span>
                        <span className="font-extrabold text-slate-900 text-sm">{ord.questionnaire.name}</span>
                        <span className="text-xs text-slate-500">({ord.questionnaire.email})</span>
                      </div>
                      <p className="text-xs text-slate-700">
                        <strong>Plano:</strong> {ord.planTitle} — <strong className="text-emerald-700 font-black">{ord.planPrice.toFixed(2)}€</strong> via <span className="uppercase text-slate-900 font-bold">{ord.paymentMethod}</span> (Ref: {ord.paymentTxId || 'Sem TxID'})
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Registado em: {new Date(ord.createdAt).toLocaleString('pt-PT')}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        onClick={() => handleConfirmPayment(ord.id)}
                        disabled={confirmingId === ord.id}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                      >
                        {confirmingId === ord.id ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-white" />
                            <span>A Gerar Plano & Enviar...</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4 text-white" />
                            <span>Confirmar Pagamento e Enviar Plano</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleRejectPayment(ord.id)}
                        disabled={rejectingId === ord.id}
                        className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-xs rounded-xl border border-red-200 flex items-center space-x-1 cursor-pointer"
                      >
                        <XCircle className="w-4 h-4 text-red-600" />
                        <span>Rejeitar</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center space-x-4">
              <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-500 font-bold block uppercase">Faturação Confirmada</span>
                <span className="text-2xl font-black text-slate-900">{totalRevenue.toFixed(2)}€</span>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center space-x-4">
              <div className="p-3 bg-blue-100 text-blue-700 rounded-xl">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-500 font-bold block uppercase">Total de Pedidos</span>
                <span className="text-2xl font-black text-slate-900">{orders.length}</span>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center space-x-4">
              <div className="p-3 bg-indigo-100 text-indigo-700 rounded-xl">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-500 font-bold block uppercase">E-mails aos Clientes</span>
                <span className="text-2xl font-black text-slate-900">
                  {orders.filter((o) => o.emailSentStatus === 'enviado').length}
                </span>
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
            <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Todos os Pedidos do Sistema</h4>
              <button
                onClick={loadAdminData}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center space-x-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Atualizar</span>
              </button>
            </div>

            {isLoading ? (
              <div className="p-8 text-center text-xs text-slate-500">A carregar dados do servidor...</div>
            ) : orders.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">Nenhum pedido registado ainda.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                      <th className="p-3">Ref Fatura</th>
                      <th className="p-3">Cliente</th>
                      <th className="p-3">Plano</th>
                      <th className="p-3">Valor</th>
                      <th className="p-3">Estado do Pagamento</th>
                      <th className="p-3">E-mail</th>
                      <th className="p-3 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-50/80">
                        <td className="p-3 font-mono font-bold text-slate-700">{ord.id}</td>
                        <td className="p-3">
                          <span className="font-bold text-slate-900 block">{ord.questionnaire.name}</span>
                          <span className="text-[10px] text-slate-500">{ord.questionnaire.email}</span>
                        </td>
                        <td className="p-3 font-semibold text-slate-800">{ord.planTitle}</td>
                        <td className="p-3 font-bold text-slate-900">{ord.planPrice.toFixed(2)}€</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              ord.paymentStatus === 'pago'
                                ? 'bg-emerald-100 text-emerald-800'
                                : ord.paymentStatus === 'pendente'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {ord.paymentStatus === 'pendente' ? 'Aguarda Confirmação' : ord.paymentStatus}
                          </span>
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              ord.emailSentStatus === 'enviado'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {ord.emailSentStatus}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-1">
                          {ord.paymentStatus === 'pendente' && (
                            <button
                              onClick={() => handleConfirmPayment(ord.id)}
                              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold text-[10px]"
                            >
                              Confirmar
                            </button>
                          )}

                          {ord.planDocument && (
                            <button
                              onClick={() => {
                                onClose();
                                onOpenOrderPlan(ord);
                              }}
                              className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-[10px] inline-flex items-center space-x-1"
                            >
                              <Eye className="w-3 h-3 text-emerald-400" />
                              <span>Ver</span>
                            </button>
                          )}

                          {ord.paymentStatus === 'pago' && (
                            <button
                              onClick={() => handleResend(ord.id)}
                              className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg font-bold text-[10px] inline-flex items-center space-x-1"
                            >
                              <Mail className="w-3 h-3" />
                              <span>Reenviar</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

