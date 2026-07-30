import 'dotenv/config';
import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import { QuestionnaireData, PlanDocument, Order } from './src/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// In-memory store for orders and simulated email log
const ordersStore = new Map<string, Order>();
const emailLog: Array<{
  id: string;
  orderId: string;
  to: string;
  subject: string;
  sentAt: string;
  htmlContent: string;
}> = [];

// Initialize Gemini SDK
const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY is not set. Local fallback logic will be used if generation is triggered.');
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Calculate BMR and TDEE helper
function calculateMacros(q: QuestionnaireData): { bmr: number; tdee: number; calories: number; proteinGrams: number; carbsGrams: number; fatsGrams: number; waterLiters: number } {
  let bmr = 10 * q.weight + 6.25 * q.height - 5 * q.age;
  if (q.gender === 'masculino') bmr += 5;
  else bmr -= 161;

  let activityMultiplier = 1.2;
  if (q.activityLevel === 'moderado') activityMultiplier = 1.375;
  if (q.activityLevel === 'ativo') activityMultiplier = 1.55;
  if (q.activityLevel === 'muito_ativo') activityMultiplier = 1.725;

  const tdee = Math.round(bmr * activityMultiplier);
  let targetCalories = tdee;

  if (q.primaryGoal === 'perda_peso') targetCalories = Math.round(tdee * 0.82);
  else if (q.primaryGoal === 'hipertrofia') targetCalories = Math.round(tdee * 1.12);
  else if (q.primaryGoal === 'resistencia_corrida') targetCalories = Math.round(tdee * 1.08);

  const proteinGrams = Math.round(q.weight * (q.primaryGoal === 'hipertrofia' ? 2.0 : 1.8));
  const fatsGrams = Math.round((targetCalories * 0.25) / 9);
  const carbsGrams = Math.round((targetCalories - (proteinGrams * 4 + fatsGrams * 9)) / 4);
  const waterLiters = Number((q.weight * 0.035).toFixed(1));

  return {
    bmr: Math.round(bmr),
    tdee,
    calories: targetCalories,
    proteinGrams,
    carbsGrams,
    fatsGrams,
    waterLiters,
  };
}

// Generate fallback plan document if Gemini API key is missing or errors out
function buildFallbackPlanDocument(q: QuestionnaireData, planTitle: string): PlanDocument {
  const macros = calculateMacros(q);
  const dateStr = new Date().toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' });

  return {
    title: `${planTitle} Personalizado - planeamos.pt`,
    generatedAt: dateStr,
    clientName: q.name,
    summaryText: `Este plano foi rigorosamente desenhado para ${q.name}, com base no objetivo de ${q.primaryGoal.replace('_', ' ')}. Considerámos a sua altura de ${q.height}cm, peso de ${q.weight}kg e nível de atividade. A estratégia visa resultados sustentáveis, mantendo a saúde física e mental em primeiro lugar.`,
    macroBreakdown: macros,
    workoutSplit: [
      {
        dayTitle: 'Dia 1 - Força e Estrutura Superior (Push/Peito/Ombros)',
        focus: 'Hipertrofia e Estabilidade Articular',
        exercises: [
          { name: 'Supino Reto ou Flexões de Braço', sets: '4', reps: '10 - 12', rest: '90s', notes: 'Manter escápulas retraídas e controlo na descida.' },
          { name: 'Desenvolvimento com Halteres/Garrafas', sets: '3', reps: '12', rest: '60s', notes: 'Ativar o core sem arquivar a zona lumbar.' },
          { name: 'Elevações Laterais', sets: '3', reps: '15', rest: '45s', notes: 'Movimento controlado, foco no deltoide médio.' },
          { name: 'Extensão de Tríceps', sets: '3', reps: '12', rest: '60s', notes: 'Cotovelos fixos junto ao tronco.' }
        ]
      },
      {
        dayTitle: 'Dia 2 - Tracção e Cadeia Posterior (Pull/Costas/Bíceps)',
        focus: 'Postura, Escápulas e Músculos Posteriores',
        exercises: [
          { name: 'Remada Curvada com Halteres/Barra', sets: '4', reps: '10 - 12', rest: '90s', notes: 'Coluna neutra, puxar em direção ao umbigo.' },
          { name: 'Puxada Aberta ou Elevação na Barra Fixa', sets: '3', reps: '10', rest: '90s', notes: 'Foco em esmagar o dorsal na fase concêntrica.' },
          { name: 'Face Pulls / Posterior de Ombro', sets: '3', reps: '15', rest: '45s', notes: 'Essencial para correção postural no trabalho no computador.' },
          { name: 'Curl de Bíceps com Halteres', sets: '3', reps: '12', rest: '60s', notes: 'Sem balançar o corpo.' }
        ]
      },
      {
        dayTitle: 'Dia 3 - Membros Inferiores e Estabilidade do Core',
        focus: 'Quadrícep, Isquiotibiais e Glúteos',
        exercises: [
          { name: 'Agachamento Livre / Goblet Squat', sets: '4', reps: '10 - 12', rest: '90s', notes: 'Joelhos a acompanhar a ponta dos pés.' },
          { name: 'Lunge Passado / Afundos', sets: '3', reps: '12 por perna', rest: '60s', notes: 'Tronco ligeiramente inclinado à frente.' },
          { name: 'Elevação Pélvica / Hip Thrust', sets: '4', reps: '12', rest: '60s', notes: 'Contração de 2 segundos no topo do movimento.' },
          { name: 'Prancha Abdominal Ventral', sets: '3', reps: '45 segundos', rest: '45s', notes: 'Glúteos e abdómen em máxima tensão.' }
        ]
      }
    ],
    mealPlan7Days: [
      {
        dayName: 'Segunda-feira',
        meals: [
          {
            mealName: 'Pequeno-almoço (08:00)',
            timeSuggestion: '08:00',
            description: '35g de Aveia em flocos cozida com 150ml de bebida de amêndoa sem açúcar + 1 iogurte Skyr natural + 100g de frutos vermelhos e canela.',
            approxCalories: 380,
            substitutions: 'Substituir frutos vermelhos por 1 banana pequena ou iogurte por 2 ovos mexidos.'
          },
          {
            mealName: 'Lanche da Manhã (11:00)',
            timeSuggestion: '11:00',
            description: '1 maçã Bravo de Esmolfe com casca + 15g de amêndoas com pele ao natural.',
            approxCalories: 170,
            substitutions: '2 tortitas de milho integral com 1 fatia de queijo fresco magro.'
          },
          {
            mealName: 'Almoço (13:30)',
            timeSuggestion: '13:30',
            description: '160g de peito de frango grelhado com orégãos + 150g de batata-doce assada às rodelas + salada abundante de alface, tomate e pepino temperada com 1 colher de chá de azeite extra virgem.',
            approxCalories: 520,
            substitutions: '160g de bife de peru ou tofu grelhado marinada em alho e limão.'
          },
          {
            mealName: 'Lanche da Tarde (17:00)',
            timeSuggestion: '17:00',
            description: '1 fatia de pão de centeio integral com 40g de queijo cottage / fresco e ervas + 1 chá verde sem açúcar.',
            approxCalories: 220,
            substitutions: 'Batido proteico com 25g de whey/proteína vegetal e 200ml de água/bebida vegetal.'
          },
          {
            mealName: 'Jantar (20:30)',
            timeSuggestion: '20:30',
            description: '170g de lombos de pescada ao vapor com alho e coentros + 150g de brócolos e cenoura ao vapor + sopa rica de legumes (sem batata).',
            approxCalories: 410,
            substitutions: '160g de filete de peito de frango ou perca do Nilo grelhada.'
          }
        ]
      },
      {
        dayName: 'Terça-feira',
        meals: [
          {
            mealName: 'Pequeno-almoço (08:00)',
            timeSuggestion: '08:00',
            description: 'Panquecas fit: 1 ovo inteiro + 2 claras + 30g de farinha de aveia esmagada com 1/2 banana. Servir com canela polvilhada.',
            approxCalories: 360,
            substitutions: '2 fatias de pão de massa mãe tostado com 1 ovo escalfado e abacate (20g).'
          },
          {
            mealName: 'Lanche da Manhã (11:00)',
            timeSuggestion: '11:00',
            description: '1 iogurte grego ligeiro (125g) + 1 colher de sobremesa de sementes de chia.',
            approxCalories: 150,
            substitutions: '1 pera Rocha + 3 nozes inteiras.'
          },
          {
            mealName: 'Almoço (13:30)',
            timeSuggestion: '13:30',
            description: '160g de lombo de salmão grelhado com sementes de sésamo + 120g de arroz basmati integral + prato fundo de espinafres salteados em alho.',
            approxCalories: 580,
            substitutions: 'Atum ao natural (1 lata e meia) misturado com quinoa cozida e legumes quentes.'
          },
          {
            mealName: 'Lanche da Tarde (17:00)',
            timeSuggestion: '17:00',
            description: '2 tortitas de arroz integral com 1 colher de chá de manteiga de amendoim 100% pura + 1 kiwi.',
            approxCalories: 210,
            substitutions: '1 pudim proteico (150g) sem açúcares adicionados.'
          },
          {
            mealName: 'Jantar (20:30)',
            timeSuggestion: '20:30',
            description: 'Omelete de 3 claras e 1 ovo com cogumelos frescos, tomate cherry e orégãos + salada de rúcula e pimento vermelho com vinagrete leve.',
            approxCalories: 380,
            substitutions: '150g de carne de vaca magra moída estufada em tomate e curgete.'
          }
        ]
      },
      {
        dayName: 'Quarta-feira',
        meals: [
          {
            mealName: 'Pequeno-almoço (08:00)',
            timeSuggestion: '08:00',
            description: '150g de queijo fresco magro ou cottage + 1 fatia de pão de centeio + 1 clementina / laranja fresca.',
            approxCalories: 340,
            substitutions: 'Batido de 1 iogurte fluido proteico + 1/2 chávena de frutos vermelhos + 20g de aveia.'
          },
          {
            mealName: 'Lanche da Manhã (11:00)',
            timeSuggestion: '11:00',
            description: '1 kiwi amarelo + 10 caju ao natural sem sal.',
            approxCalories: 160,
            substitutions: '1 fatia de fiambre de peru com baixo teor de sal + 1 cenoura crua em palitos.'
          },
          {
            mealName: 'Almoço (13:30)',
            timeSuggestion: '13:30',
            description: '170g de bife de peru na frigideira com azeite, alho e louro + 140g de massa integral ou espelta + curgete e pimento assado.',
            approxCalories: 540,
            substitutions: '170g de peito de frango assado no forno com ervas aromáticas.'
          },
          {
            mealName: 'Lanche da Tarde (17:00)',
            timeSuggestion: '17:00',
            description: '1 iogurte Skyr de aromas (0% gordura) + 15g de sementes de abóbora tostadas.',
            approxCalories: 190,
            substitutions: '1 banana pequena + 1 fatia fina de queijo limiano magro.'
          },
          {
            mealName: 'Jantar (20:30)',
            timeSuggestion: '20:30',
            description: '160g de corvina ou dourada assada no forno com tomate, cebola e pimentos + couve-flor e couve de Bruxelas ao vapor.',
            approxCalories: 400,
            substitutions: '160g de lombo de bacalhau cozido com grão-de-bico (80g) e couve portuguesa.'
          }
        ]
      },
      {
        dayName: 'Quinta-feira',
        meals: [
          {
            mealName: 'Pequeno-almoço (08:00)',
            timeSuggestion: '08:00',
            description: 'Papa de Aveia Proteica: 40g de aveia em flocos cozida em água + 1 scoop de proteína de baunilha/chocolate misturada no final + framboesas frescas.',
            approxCalories: 390,
            substitutions: '2 ovos mexidos com 1 fatia de pão de aveia tostado e tomate às rodelas.'
          },
          {
            mealName: 'Lanche da Manhã (11:00)',
            timeSuggestion: '11:00',
            description: '1 punhado de mirtilos frescos (80g) + 15g de avelãs torradas sem sal.',
            approxCalories: 170,
            substitutions: '1 maçã Fuji + 1 queijinho fresco individual magro.'
          },
          {
            mealName: 'Almoço (13:30)',
            timeSuggestion: '13:30',
            description: 'Salada Quente de Atum: 2 latas de atum em água escorrido + 130g de feijão frade ou grão cozido + tomate, pimento, salsa fresca e 1 colher de chá de azeite.',
            approxCalories: 490,
            substitutions: '160g de tiras de peito de frango salteadas com cuscuz e vegetais.'
          },
          {
            mealName: 'Lanche da Tarde (17:00)',
            timeSuggestion: '17:00',
            description: '1 fatia de pão de mistura integral com 30g de pasta de abacate e flor de sal + chá de cidreira.',
            approxCalories: 230,
            substitutions: '1 iogurte grego ligeiro com canela e 1 rendilha de noz.'
          },
          {
            mealName: 'Jantar (20:30)',
            timeSuggestion: '20:30',
            description: '160g de perca do Nilo ou robalo grelhado com sumo de limão + puré de couve-flor e abóbora assada com orégãos.',
            approxCalories: 390,
            substitutions: '160g de peito de frango estufado com cogumelos e molho leve de tomate.'
          }
        ]
      },
      {
        dayName: 'Sexta-feira',
        meals: [
          {
            mealName: 'Pequeno-almoço (08:00)',
            timeSuggestion: '08:00',
            description: '2 fatias de pão de centeio integral com 50g de peito de peru em fatias e queijo fresco barrado + 1 café ou chá.',
            approxCalories: 370,
            substitutions: 'Bowl de 150g iogurte Skyr com granola sem açúcar (30g) e morangos.'
          },
          {
            mealName: 'Lanche da Manhã (11:00)',
            timeSuggestion: '11:00',
            description: '1 ameixa fresca ou fatia de melão + 12 amêndoas sem pele.',
            approxCalories: 150,
            substitutions: '2 tortitas de milho com queijo cottage.'
          },
          {
            mealName: 'Almoço (13:30)',
            timeSuggestion: '13:30',
            description: 'Stir-fry de Frango com Vegetais: 160g de peito de frango em tiras salteado com brócolos, pimentos, rebentos de soja e 120g de arroz selvagem/integral.',
            approxCalories: 530,
            substitutions: '160g de tiras de perca ou lulas grelhadas com batata cozida (150g).'
          },
          {
            mealName: 'Lanche da Tarde (17:00)',
            timeSuggestion: '17:00',
            description: '1 batido proteico com 200ml de bebida de aveia sem açúcar + 1 banana média esmagada com canela.',
            approxCalories: 260,
            substitutions: '1 iogurte natural sem açúcar + 1 fatia de pão de centeio com fiambre de peru.'
          },
          {
            mealName: 'Jantar (20:30)',
            timeSuggestion: '20:30',
            description: 'Hambúrguer de Frango/Peru caseiro (170g) no prato + 150g de batata-doce assada em palitos no forno + salada verde variada.',
            approxCalories: 450,
            substitutions: 'Omelete de legumes com espinafres, tomate e 160g de camarão cozido/grelhado.'
          }
        ]
      },
      {
        dayName: 'Sábado',
        meals: [
          {
            mealName: 'Pequeno-almoço (09:00)',
            timeSuggestion: '09:00',
            description: 'Ovos Benedict Saudáveis: 2 ovos escalfados sobre 1 fatia de pão de massa mãe tostado com espinafres salteados e 20g de abacate.',
            approxCalories: 400,
            substitutions: 'Papas de aveia de forno com maçã ralada, canela e nozes.'
          },
          {
            mealName: 'Lanche da Manhã (11:30)',
            timeSuggestion: '11:30',
            description: '1 fatia de ananás/abacaxi fresco + 10g de sementes de girassol.',
            approxCalories: 140,
            substitutions: '1 iogurte Skyr de fruta sem açúcar.'
          },
          {
            mealName: 'Almoço (13:30)',
            timeSuggestion: '13:30',
            description: '170g de lombo de bacalhau assado no forno com alho, azeite ligeiro, couve portuguesa cozida e 140g de batata nova assada com pele.',
            approxCalories: 560,
            substitutions: '170g de bife de vaca magro (alcatra/vazia) grelhado com arroz basmati e salada.'
          },
          {
            mealName: 'Lanche da Tarde (17:30)',
            timeSuggestion: '17:30',
            description: '2 tortitas de arroz com 30g de queijo cottage + 1 punhado de uvas sem grainha.',
            approxCalories: 200,
            substitutions: '1 xícara de tremoços lavados (sem excesso de sal) + 1 chá frio natural.'
          },
          {
            mealName: 'Jantar (20:30)',
            timeSuggestion: '20:30',
            description: '170g de peito de frango recheado com espinafres e queijo magro assado + jardineira leve de legumes (curgete, cenoura, feijão verde).',
            approxCalories: 420,
            substitutions: '170g de peixe grelhado (dourada ou robalo) com salada mista.'
          }
        ]
      },
      {
        dayName: 'Domingo',
        meals: [
          {
            mealName: 'Pequeno-almoço (09:00)',
            timeSuggestion: '09:00',
            description: 'Waffles ou Panquecas Proteicas: 35g de aveia + 1 ovo + 1 scoop proteína whey + 100g de frutos vermelhos frescos por cima.',
            approxCalories: 410,
            substitutions: '2 fatias de pão de centeio com queijo fresco e compota 100% fruta sem açúcar.'
          },
          {
            mealName: 'Lanche da Manhã (11:30)',
            timeSuggestion: '11:30',
            description: '1 iogurte grego ligeiro com 1 colher de café de mel e canela.',
            approxCalories: 160,
            substitutions: '1 pêssego ou nectarina + 10 amêndoas.'
          },
          {
            mealName: 'Almoço (13:30)',
            timeSuggestion: '13:30',
            description: 'Feijoada ou Cuscuz de Frango Saudável: 160g de peito de frango cozinhado em estufado leve de feijão encarnado, tomate, cenoura e pimentos + salada de pepino.',
            approxCalories: 540,
            substitutions: '170g de lombo de salmão ou peixe assado com batata-doce e legumes.'
          },
          {
            mealName: 'Lanche da Tarde (17:30)',
            timeSuggestion: '17:30',
            description: '1 maçã assada no forno com canela e 1 fatia de pão de centeio com queijo magro.',
            approxCalories: 210,
            substitutions: '1 batido proteico com bebida vegetal de amêndoa.'
          },
          {
            mealName: 'Jantar (20:30)',
            timeSuggestion: '20:30',
            description: 'Creme aveludado de legumes (abóbora, curgete, alho-francês) com topping de 150g de tiras de frango ou peixe desfiado + 1 ovo cozido.',
            approxCalories: 380,
            substitutions: 'Omelete de 3 claras com atum ao natural e salada de alface e tomate.'
          }
        ]
      }
    ],
    groceryList: [
      {
        category: 'Proteínas & Lacticínios',
        items: ['Peito de frango / peru (1kg)', 'Peixe fresco (pescada, salmão, bacalhau)', 'Ovos inteiros classe M/L (12 un)', 'Iogurte grego ligeiro / Skyr', 'Queijo fresco magro ou cottage']
      },
      {
        category: 'Hidratos & Cereais',
        items: ['Flocos de aveia integrais (500g)', 'Batata-doce ou batata comum', 'Arroz integral / basmati', 'Pão de centeio ou massa mãe integral']
      },
      {
        category: 'Hortofrutícolas & Frutos Secos',
        items: ['Bananas, maçãs e frutos vermelhos', 'Brócolos, espinafres e curgetes', 'Salada mista, tomate e pepino', 'Nozes e amêndoas ao natural']
      },
      {
        category: 'Gorduras Saudáveis & Outros',
        items: ['Azeite Virgem Extra português', 'Canela em pó', 'Sementes de chia ou linhaça', 'Ervas aromáticas (orégãos, tomilho)']
      }
    ],
    lifestyleTips: [
      `Beba pelo menos ${macros.waterLiters}L de água diariamente para otimizar o metabolismo e a digestão.`,
      'Garanta entre 7 e 8 horas de sono de qualidade por noite para permitir reparação muscular e equilíbrio do cortisol.',
      'Evite ecrãs luminosos 45 minutos antes de deitar e mantenha o quarto fresco e escuro.',
      'Mantenha uma cadência constante nos treinos: a consistência ao longo das semanas supera qualquer esforço isolado.'
    ],
    specialRecommendations: [
      q.dietaryRestrictions.length > 0 ? `Respeitamos escrupulosamente as suas restrições: ${q.dietaryRestrictions.join(', ')}.` : 'Sem restrições severas detetadas no seu questionário.',
      q.medicalConditions ? `Condição médica/lesão assinalada (${q.medicalConditions}): execute todos os movimentos sem dor; se sentir desconforto, reduza a amplitude.` : 'Sem limitações articulares graves registadas.'
    ]
  };
}

// Generate personalized plan using Gemini API
async function generateGeminiPlan(questionnaire: QuestionnaireData, planTitle: string): Promise<PlanDocument> {
  const ai = getGenAI();
  if (!ai) {
    return buildFallbackPlanDocument(questionnaire, planTitle);
  }

  const prompt = `
És o especialista chefe de nutrição, treino e fisiologia do site planeamos.pt (Portugal).
Cria um plano de treino, nutrição e estilo de vida 100% personalizado em Português de Portugal para o seguinte cliente:

NOME: ${questionnaire.name}
IDADE: ${questionnaire.age} anos
GÉNERO: ${questionnaire.gender}
ALTURA: ${questionnaire.height} cm
PESO ACTUAL: ${questionnaire.weight} kg
PESO OBJETIVO: ${questionnaire.targetWeight || 'Manutenção/Recomposição'} kg
NÍVEL DE ATIVIDADE: ${questionnaire.activityLevel}
OBJETIVO PRINCIPAL: ${questionnaire.primaryGoal}
CONDIÇÕES MÉDICAS/LESÕES: ${questionnaire.medicalConditions || 'Nenhuma'}
RESTRIÇÕES ALIMENTARES: ${questionnaire.dietaryRestrictions.join(', ') || 'Nenhuma'}
GOSTOS/PREFERÊNCIAS ALIMENTARES: ${questionnaire.foodPreferences || 'Variado'}
LOCAL DE TREINO: ${questionnaire.workoutLocation}
EQUIPAMENTO DISPONÍVEL: ${questionnaire.equipmentAvailable.join(', ') || 'Nenhum'}
DIAS DISPONÍVEIS/SEMANA: ${questionnaire.daysPerWeek} dias
NOTAS ADICIONAIS: ${questionnaire.additionalNotes || 'Nenhuma'}

TÍTULO DO PLANO CONTRATADO: ${planTitle}

A resposta DEVE ser um objeto JSON estrito com exatamente os seguintes campos:
- title: string
- generatedAt: string
- clientName: string
- summaryText: string (3 a 4 parágrafos encorajadores e altamente personalizados em Português de Portugal)
- macroBreakdown: { calories: number, proteinGrams: number, carbsGrams: number, fatsGrams: number, waterLiters: number, bmr: number, tdee: number }
- workoutSplit: array de objetos { dayTitle: string, focus: string, exercises: [{ name: string, sets: string, reps: string, rest: string, notes: string }] } (Adaptado aos dias por semana e local de treino do cliente)
- mealPlan7Days: array de 7 objetos { dayName: string, meals: [{ mealName: string, timeSuggestion: string, description: string, approxCalories: number, substitutions: string }] }
IMPORTANTE: CADA UM DOS 7 DIAS EM mealPlan7Days (Segunda-feira a Domingo) TEM DE TER REFEIÇÕES COMPLETAMENTE DIFERENTES, VARIADAS E PERSONALIZADAS. NUNCA REPITAS O MESMO CARDÁPIO NOS 7 DIAS.
- groceryList: array de objetos { category: string, items: string[] }
- lifestyleTips: array de strings com dicas práticas
- specialRecommendations: array de strings adaptadas às limitations/alergias
`;

  try {
    const geminiPromise = ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: 'És o gerador de planos de treino e nutrição do planeamos.pt. Responde APENAS em JSON válido conforme a estrutura pedida. Garante cardápios 100% variados e diferentes para cada um dos 7 dias da semana.',
        responseMimeType: 'application/json',
      },
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Gemini API timeout')), 20000)
    );

    const response = await Promise.race([geminiPromise, timeoutPromise]);

    const text = response.text;
    if (!text) {
      throw new Error('Gemini returned empty response');
    }

    const parsed = JSON.parse(text) as PlanDocument;
    return parsed;
  } catch (err) {
    console.error('Error or timeout generating plan with Gemini, falling back to local synthesizer:', err);
    return buildFallbackPlanDocument(questionnaire, planTitle);
  }
}

// API Routes

// Create Order
app.post('/api/orders/create', (req, res) => {
  try {
    const { planId, planTitle, planPrice, questionnaire } = req.body;
    if (!planId || !questionnaire || !questionnaire.email) {
      return res.status(400).json({ error: 'Dados incompletos do pedido' });
    }

    const orderId = `PLN-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: Order = {
      id: orderId,
      planId,
      planTitle,
      planPrice,
      questionnaire,
      paymentStatus: 'pendente',
      paymentMethod: 'paypal',
      createdAt: new Date().toISOString(),
      emailSentStatus: 'nao_enviado',
    };

    ordersStore.set(orderId, newOrder);
    res.json({ success: true, order: newOrder });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Erro ao criar pedido' });
  }
});

// Process Payment Intent (Submits payment proof & notifies Admin parecemeu@gmail.com)
app.post('/api/orders/pay', async (req, res) => {
  try {
    const { orderId, paymentMethod, paymentTxId, questionnaire, planTitle, planPrice, planId } = req.body;
    let order = ordersStore.get(orderId);

    if (!order) {
      if (questionnaire && questionnaire.email) {
        order = {
          id: orderId || `PLN-${Math.floor(100000 + Math.random() * 900000)}`,
          planId: planId || 'custom',
          planTitle: planTitle || 'Plano Personalizado',
          planPrice: planPrice || 29.99,
          questionnaire,
          paymentStatus: 'pendente',
          paymentMethod: paymentMethod || 'mbway',
          createdAt: new Date().toISOString(),
          emailSentStatus: 'nao_enviado',
        };
        ordersStore.set(order.id, order);
      } else {
        return res.status(404).json({ error: 'Pedido não encontrado' });
      }
    }

    // Set status as 'pendente' (Awaiting Admin Confirmation)
    order.paymentStatus = 'pendente';
    order.paymentMethod = paymentMethod || 'mbway';
    order.paymentTxId = paymentTxId || `TX-${Date.now()}`;

    // Send Admin Notification Email to parecemeu@gmail.com
    const adminEmail = 'parecemeu@gmail.com';
    const sentAt = new Date().toISOString();

    const adminEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1e293b; border: 1px solid #cbd5e1; border-radius: 12px; background: #ffffff;">
        <div style="background-color: #0f172a; padding: 16px; border-radius: 8px; text-align: center; color: white;">
          <h2 style="margin: 0; font-size: 20px; color: #10b981;">planeamos.pt — AVISO DE NOVO PAGAMENTO</h2>
          <p style="margin: 4px 0 0 0; font-size: 13px; color: #94a3b8;">Ref. Encomenda: <strong>${order.id}</strong></p>
        </div>
        
        <p style="margin-top: 20px; font-size: 15px;">Atenção Administrador (parecemeu@gmail.com),</p>
        <p style="line-height: 1.6;">Foi registada uma nova intenção de pagamento no site planeamos.pt que aguarda a sua verificação bancária/PayPal:</p>
        
        <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; margin: 20px 0; font-size: 14px;">
          <p style="margin: 0 0 8px 0;"><strong>Cliente:</strong> ${order.questionnaire.name} (${order.questionnaire.email})</p>
          <p style="margin: 0 0 8px 0;"><strong>Telefone:</strong> ${order.questionnaire.phone || 'Não especificado'}</p>
          <p style="margin: 0 0 8px 0;"><strong>Plano Adquirido:</strong> ${order.planTitle}</p>
          <p style="margin: 0 0 8px 0;"><strong>Valor a Receber:</strong> <span style="font-size: 16px; font-weight: bold; color: #047857;">${order.planPrice.toFixed(2)}€</span></p>
          <p style="margin: 0 0 8px 0;"><strong>Método Escolhido:</strong> ${order.paymentMethod.toUpperCase()}</p>
          <p style="margin: 0;"><strong>Ref / TxID:</strong> ${order.paymentTxId}</p>
        </div>

        <p style="line-height: 1.6; font-size: 14px;"><strong>O plano NÃO foi enviado ao comprador ainda.</strong> Por favor, verifique a sua conta bancária / MB WAY / PayPal. Após validar o recebimento do dinheiro, aceda ao Painel do Administrador em <strong>planeamos.pt</strong> e clique em <strong>"Confirmar Pagamento e Enviar Plano"</strong>.</p>

        <div style="text-align: center; margin: 25px 0;">
          <a href="${process.env.APP_URL || 'http://localhost:3000'}?adminConfirm=${order.id}" style="background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Abrir Painel & Confirmar Pagamento</a>
        </div>
      </div>
    `;

    emailLog.unshift({
      id: `EML-ADM-${Date.now()}`,
      orderId: order.id,
      to: adminEmail,
      subject: `[NOVA ENCOMENDA] Aviso de Pagamento ${order.id} - ${order.questionnaire.name} (${order.planPrice.toFixed(2)}€)`,
      sentAt,
      htmlContent: adminEmailContent,
    });

    ordersStore.set(orderId, order);

    res.json({
      success: true,
      order,
      message: 'Aviso de pagamento registado. O administrador (parecemeu@gmail.com) foi notificado para confirmar o pagamento antes do plano ser libertado.',
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Erro ao processar intenção de pagamento' });
  }
});

// Admin Endpoint: Confirm Payment and Generate + Dispatch Plan to Client
app.post('/api/admin/confirm-payment', async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = ordersStore.get(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    if (order.paymentStatus === 'pago' && order.planDocument) {
      return res.json({ success: true, order, message: 'Este pagamento já tinha sido confirmado anteriormente.' });
    }

    // Mark order as PAID
    order.paymentStatus = 'pago';

    // Generate personalized plan via Gemini (or fallback synthesizer)
    console.log(`[ADMIN CONFIRMATION] Generating plan for order ${orderId} (${order.questionnaire.name})...`);
    order.planDocument = await generateGeminiPlan(order.questionnaire, order.planTitle);

    // Send Buyer Email
    const emailTo = order.questionnaire.email;
    const sentAt = new Date().toISOString();
    order.emailSentStatus = 'enviado';
    order.emailSentAt = sentAt;

    const buyerEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1e293b; border: 1px solid #e2e8f0; border-radius: 12px;">
        <div style="background-color: #059669; padding: 16px; border-radius: 8px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 24px;">planeamos.pt</h1>
          <p style="margin: 4px 0 0 0; font-size: 14px;">Pagamento Confirmado! O seu plano está pronto!</p>
        </div>
        <p style="margin-top: 20px; font-size: 16px;">Olá <strong>${order.questionnaire.name}</strong>,</p>
        <p style="line-height: 1.6;">Confirmamos a receção e validação do seu pagamento para o <strong>${order.planTitle}</strong> via ${order.paymentMethod.toUpperCase()} (Ref: ${order.paymentTxId}).</p>
        
        <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #0f172a;">Resumo do seu Perfil Nutricional & Metabólico</h3>
          <ul style="padding-left: 20px; line-height: 1.8;">
            <li><strong>Meta Calórica Diária:</strong> ${order.planDocument.macroBreakdown.calories} kcal</li>
            <li><strong>Proteínas:</strong> ${order.planDocument.macroBreakdown.proteinGrams}g</li>
            <li><strong>Hidratos de Carbono:</strong> ${order.planDocument.macroBreakdown.carbsGrams}g</li>
            <li><strong>Gorduras Saudáveis:</strong> ${order.planDocument.macroBreakdown.fatsGrams}g</li>
            <li><strong>Hidratação Mínima:</strong> ${order.planDocument.macroBreakdown.waterLiters} Litros/dia</li>
          </ul>
        </div>

        <p style="line-height: 1.6;">Pode aceder ao seu plano interativo completo com 7 dias variados e descarregar o PDF a qualquer momento em <strong>planeamos.pt</strong> na "Área do Cliente" introduzindo o seu e-mail: <strong>${emailTo}</strong>.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.APP_URL || 'http://localhost:3000'}?orderId=${order.id}" style="background-color: #059669; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Ver e Guardar o Meu Plano no planeamos.pt</a>
        </div>

        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="font-size: 12px; color: #64748b; text-align: center;">planeamos.pt — Soluções Personalizadas de Saúde, Nutrição e Treino em Portugal.</p>
      </div>
    `;

    emailLog.unshift({
      id: `EML-CLI-${Date.now()}`,
      orderId: order.id,
      to: emailTo,
      subject: `[planeamos.pt] Pagamento Confirmado! O seu ${order.planTitle} está pronto 🎉`,
      sentAt,
      htmlContent: buyerEmailContent,
    });

    ordersStore.set(orderId, order);

    res.json({
      success: true,
      order,
      message: `Pagamento do pedido ${order.id} confirmado com sucesso! O plano foi gerado e enviado por e-mail para ${emailTo}.`,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Erro ao confirmar pagamento' });
  }
});

// Admin Endpoint: Reject Payment
app.post('/api/admin/reject-payment', (req, res) => {
  try {
    const { orderId } = req.body;
    const order = ordersStore.get(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    order.paymentStatus = 'rejeitado';
    ordersStore.set(orderId, order);

    res.json({ success: true, order, message: `Pedido ${orderId} marcado como rejeitado.` });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Erro ao rejeitar pedido' });
  }
});

// Fetch Order by ID
app.get('/api/orders/:id', (req, res) => {
  const order = ordersStore.get(req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Pedido não encontrado' });
  }
  res.json({ success: true, order });
});

// Fetch Orders by Email
app.get('/api/orders/search/email', (req, res) => {
  const email = (req.query.email as string || '').trim().toLowerCase();
  if (!email) {
    return res.status(400).json({ error: 'E-mail é obrigatório' });
  }

  const matches: Order[] = [];
  ordersStore.forEach((ord) => {
    if (ord.questionnaire.email.toLowerCase() === email) {
      matches.push(ord);
    }
  });

  res.json({ success: true, orders: matches });
});

// Fetch All Orders for Admin
app.get('/api/admin/orders', (req, res) => {
  const allOrders = Array.from(ordersStore.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  res.json({ success: true, orders: allOrders, emailLog });
});

// Trigger Manual Email Re-send
app.post('/api/orders/resend-email', (req, res) => {
  const { orderId } = req.body;
  const order = ordersStore.get(orderId);
  if (!order) {
    return res.status(404).json({ error: 'Pedido não encontrado' });
  }

  order.emailSentStatus = 'enviado';
  order.emailSentAt = new Date().toISOString();
  ordersStore.set(orderId, order);

  res.json({ success: true, message: `E-mail reenviado para ${order.questionnaire.email}` });
});

// Vite & Static file serving setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server planeamos.pt running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
