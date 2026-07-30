import React, { useState, useEffect } from 'react';
import { X, Mail, CheckCircle2, Clock, ExternalLink } from 'lucide-react';

interface EmailLogItem {
  id: string;
  orderId: string;
  to: string;
  subject: string;
  sentAt: string;
  htmlContent: string;
}

interface EmailSimulationModalProps {
  onClose: () => void;
}

export const EmailSimulationModal: React.FC<EmailSimulationModalProps> = ({ onClose }) => {
  const [logs, setLogs] = useState<EmailLogItem[]>([]);
  const [selectedLog, setSelectedLog] = useState<EmailLogItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchEmailLogs = async () => {
      try {
        const res = await fetch('/api/admin/orders');
        const data = await res.json();
        if (res.ok && data.success) {
          const list: EmailLogItem[] = data.emailLog || [];
          setLogs(list);
          if (list.length > 0) setSelectedLog(list[0]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEmailLogs();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden my-8 border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-600 rounded-lg text-white">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Caixa de Entrada de E-mails Disparados</h3>
              <p className="text-xs text-slate-400">Simulador de envio automático de e-mails do planeamos.pt</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-y-auto">
          {/* Email List Sidebar */}
          <div className="md:col-span-1 space-y-3 border-r border-slate-200 pr-0 md:pr-4">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">E-mails Enviados ({logs.length})</h4>

            {isLoading ? (
              <p className="text-xs text-slate-400">A carregar registos...</p>
            ) : logs.length === 0 ? (
              <div className="p-4 bg-slate-50 rounded-xl text-center text-xs text-slate-500 border border-slate-200">
                Ainda não foram efetuados pagamentos para disparar e-mails. Efetue um teste de compra via MB WAY, Multibanco ou PayPal!
              </div>
            ) : (
              logs.map((log) => (
                <div
                  key={log.id}
                  onClick={() => setSelectedLog(log)}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    selectedLog?.id === log.id
                      ? 'border-emerald-600 bg-emerald-50/60 shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400">{log.id}</span>
                    <span className="text-[10px] text-emerald-700 font-semibold flex items-center">
                      <CheckCircle2 className="w-3 h-3 mr-0.5" /> Entregue
                    </span>
                  </div>
                  <h5 className="text-xs font-bold text-slate-900 truncate mt-1">{log.subject}</h5>
                  <p className="text-[11px] text-slate-500 truncate">{log.to}</p>
                </div>
              ))
            )}
          </div>

          {/* Email HTML Preview Pane */}
          <div className="md:col-span-2 space-y-4">
            {selectedLog ? (
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs space-y-1">
                  <div><strong>Para:</strong> {selectedLog.to}</div>
                  <div><strong>Assunto:</strong> {selectedLog.subject}</div>
                  <div><strong>Data de Envio:</strong> {new Date(selectedLog.sentAt).toLocaleString('pt-PT')}</div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 overflow-x-auto">
                  <div dangerouslySetInnerHTML={{ __html: selectedLog.htmlContent }} />
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                Selecione um e-mail da lista à esquerda para visualizar o conteúdo enviado.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
