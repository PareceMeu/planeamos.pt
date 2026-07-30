import html2pdf from 'html2pdf.js';
import { Order, PlanDocument } from '../types';

export async function exportPlanToPDF(order: Order): Promise<void> {
  const doc = order.planDocument;
  if (!doc) return;

  const container = document.createElement('div');
  container.className = 'pdf-export-container';
  container.style.padding = '30px';
  container.style.fontFamily = 'Arial, sans-serif';
  container.style.color = '#0f172a';
  container.style.backgroundColor = '#ffffff';
  container.style.maxWidth = '800px';
  container.style.margin = '0 auto';

  const workoutsHtml = doc.workoutSplit && doc.workoutSplit.length > 0
    ? doc.workoutSplit.map((w, idx) => `
        <div style="margin-bottom: 20px; page-break-inside: avoid; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; background: #f8fafc;">
          <h4 style="margin: 0 0 5px 0; color: #047857; font-size: 16px;">${w.dayTitle} — ${w.focus}</h4>
          <table style="width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px;">
            <thead>
              <tr style="background: #1e293b; color: #ffffff; text-align: left;">
                <th style="padding: 8px;">Exercício</th>
                <th style="padding: 8px;">Séries</th>
                <th style="padding: 8px;">Reps</th>
                <th style="padding: 8px;">Descanso</th>
                <th style="padding: 8px;">Notas</th>
              </tr>
            </thead>
            <tbody>
              ${w.exercises.map(ex => `
                <tr style="border-bottom: 1px solid #e2e8f0;">
                  <td style="padding: 8px; font-weight: bold;">${ex.name}</td>
                  <td style="padding: 8px;">${ex.sets}</td>
                  <td style="padding: 8px;">${ex.reps}</td>
                  <td style="padding: 8px;">${ex.rest}</td>
                  <td style="padding: 8px; color: #64748b;">${ex.notes || '-'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `).join('')
    : '<p>Sem rotina de treino especificada.</p>';

  const mealsHtml = doc.mealPlan7Days && doc.mealPlan7Days.length > 0
    ? doc.mealPlan7Days.map((day) => `
        <div style="margin-bottom: 20px; page-break-inside: avoid; border: 1px solid #059669; border-radius: 8px; padding: 15px; background: #f0fdf4;">
          <h4 style="margin: 0 0 10px 0; color: #065f46; font-size: 16px; font-weight: bold;">📅 ${day.dayName}</h4>
          ${day.meals.map(m => `
            <div style="margin-bottom: 10px; padding-bottom: 8px; border-bottom: 1px dashed #a7f3d0;">
              <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 13px; color: #064e3b;">
                <span>• ${m.mealName} ${m.timeSuggestion ? `(${m.timeSuggestion})` : ''}</span>
                ${m.approxCalories ? `<span style="color: #047857;">~${m.approxCalories} kcal</span>` : ''}
              </div>
              <p style="margin: 4px 0 2px 12px; font-size: 12px; color: #1e293b;">${m.description}</p>
              ${m.substitutions ? `<p style="margin: 0 0 0 12px; font-size: 11px; color: #047857; font-style: italic;"><strong>Substituições:</strong> ${m.substitutions}</p>` : ''}
            </div>
          `).join('')}
        </div>
      `).join('')
    : '<p>Sem plano de refeições especificado.</p>';

  const groceryHtml = doc.groceryList && doc.groceryList.length > 0
    ? doc.groceryList.map(cat => `
        <div style="margin-bottom: 12px;">
          <strong style="color: #047857; font-size: 13px;">${cat.category}:</strong>
          <ul style="margin: 4px 0 8px 20px; padding: 0; font-size: 12px; color: #334155;">
            ${cat.items.map(item => `<li>${item}</li>`).join('')}
          </ul>
        </div>
      `).join('')
    : '<p>Sem lista de compras.</p>';

  container.innerHTML = `
    <div style="border-bottom: 2px solid #10b981; padding-bottom: 15px; margin-bottom: 20px;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h1 style="margin: 0; font-size: 24px; color: #0f172a; font-weight: 900;">planeamos.pt</h1>
          <p style="margin: 2px 0 0 0; font-size: 13px; color: #059669; font-weight: bold;">Plano Personalizado de Treino & Nutrição</p>
        </div>
        <div style="text-align: right; font-size: 11px; color: #64748b;">
          <p style="margin:0;">Ref: <strong>${order.id}</strong></p>
          <p style="margin:0;">Data: ${new Date().toLocaleDateString('pt-PT')}</p>
          <p style="margin:0;">Cliente: <strong>${doc.clientName}</strong></p>
        </div>
      </div>
    </div>

    <div style="background: #f1f5f9; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
      <h3 style="margin: 0 0 8px 0; font-size: 15px; color: #1e293b;">Resumo do Seu Plano</h3>
      <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #334155;">${doc.summaryText}</p>
    </div>

    <div style="display: flex; gap: 10px; margin-bottom: 25px;">
      <div style="flex: 1; background: #ecfdf5; border: 1px solid #a7f3d0; padding: 10px; border-radius: 8px; text-align: center;">
        <span style="font-size: 10px; color: #047857; text-transform: uppercase; font-weight: bold;">Calorias Diárias</span>
        <h2 style="margin: 4px 0 0 0; font-size: 20px; color: #065f46; font-weight: 800;">${doc.macroBreakdown?.calories || 2000} kcal</h2>
      </div>
      <div style="flex: 1; background: #eff6ff; border: 1px solid #bfdbfe; padding: 10px; border-radius: 8px; text-align: center;">
        <span style="font-size: 10px; color: #1d4ed8; text-transform: uppercase; font-weight: bold;">Proteína</span>
        <h2 style="margin: 4px 0 0 0; font-size: 20px; color: #1e40af; font-weight: 800;">${doc.macroBreakdown?.proteinGrams || 140}g</h2>
      </div>
      <div style="flex: 1; background: #fef3c7; border: 1px solid #fde68a; padding: 10px; border-radius: 8px; text-align: center;">
        <span style="font-size: 10px; color: #b45309; text-transform: uppercase; font-weight: bold;">Hidratos</span>
        <h2 style="margin: 4px 0 0 0; font-size: 20px; color: #92400e; font-weight: 800;">${doc.macroBreakdown?.carbsGrams || 200}g</h2>
      </div>
      <div style="flex: 1; background: #fdf2f8; border: 1px solid #fbcfe8; padding: 10px; border-radius: 8px; text-align: center;">
        <span style="font-size: 10px; color: #be185d; text-transform: uppercase; font-weight: bold;">Gorduras</span>
        <h2 style="margin: 4px 0 0 0; font-size: 20px; color: #9d174d; font-weight: 800;">${doc.macroBreakdown?.fatsGrams || 65}g</h2>
      </div>
    </div>

    <div style="margin-bottom: 25px;">
      <h3 style="color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 5px; font-size: 18px;">🏋️ Rotina de Treino</h3>
      ${workoutsHtml}
    </div>

    <div style="margin-bottom: 25px; page-break-before: always;">
      <h3 style="color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 5px; font-size: 18px;">🥗 Plano Alimentar Personalizado (7 Dias Variados)</h3>
      ${mealsHtml}
    </div>

    <div style="margin-bottom: 25px;">
      <h3 style="color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 5px; font-size: 18px;">🛒 Lista de Compras Recomendada</h3>
      ${groceryHtml}
    </div>

    ${doc.lifestyleTips && doc.lifestyleTips.length > 0 ? `
      <div style="margin-bottom: 20px; background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0;">
        <h4 style="margin: 0 0 8px 0; color: #047857;">💡 Hábitos & Recomendações</h4>
        <ul style="margin: 0 0 0 20px; padding: 0; font-size: 12px; color: #334155;">
          ${doc.lifestyleTips.map(tip => `<li style="margin-bottom: 4px;">${tip}</li>`).join('')}
        </ul>
      </div>
    ` : ''}

    <div style="margin-top: 30px; border-top: 1px solid #cbd5e1; pt: 15px; text-align: center; font-size: 10px; color: #94a3b8;">
      <p>documento gerado por planeamos.pt • Apoio ao Cliente: suporte@planeamos.pt</p>
    </div>
  `;

  document.body.appendChild(container);

  const opt = {
    margin: 10,
    filename: `Plano_${doc.clientName.replace(/\s+/g, '_')}_${order.id}.pdf`,
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, logging: false },
    jsPDF: { unit: 'mm' as const, format: 'a4', orientation: 'portrait' as const }
  };

  try {
    // Attempt html2pdf conversion
    await html2pdf().set(opt).from(container).save();
  } catch (err) {
    console.error('html2pdf error, falling back to print window:', err);
    // Fallback: Open clean printable window
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Plano ${doc.clientName} - planeamos.pt</title>
            <style>
              body { font-family: sans-serif; padding: 20px; color: #1e293b; }
              @media print {
                body { padding: 0; }
              }
            </style>
          </head>
          <body>
            ${container.innerHTML}
            <script>
              window.onload = function() {
                window.print();
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  } finally {
    document.body.removeChild(container);
  }
}
