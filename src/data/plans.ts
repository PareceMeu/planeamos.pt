import { PlanType } from '../types';

export const CATALOG_PLANS: PlanType[] = [
  {
    id: 'transformacao-360',
    title: 'Plano Transformação 360',
    subtitle: 'Treino + Dieta Integrados',
    category: 'combinado',
    price: 29.99,
    originalPrice: 49.99,
    badge: 'Mais Escolhido 🔥',
    isPopular: true,
    description: 'A solução completa para reconfigurar a sua composição corporal. Combina plano alimentar à medida com treino estruturado para máxima eficiência.',
    features: [
      'Plano Alimentar de 7 Dias Personalizado',
      'Cálculo Exato de Calorias e Macronutrientes',
      'Plano de Treino para Ginásio ou Casa',
      'Lista de Compras Semanal Categorizada',
      'Guia de Suplementação Bálida e Segura',
      'Suporte para Restrições Alimentares (Sem Glúten, Lactose, Vegan, etc.)',
      'Entrega Automática e Acesso Permanente em PDF'
    ],
    estimatedDays: 1,
    iconName: 'Zap',
    color: 'from-amber-500 to-emerald-600',
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'plano-treino',
    title: 'Plano de Treino Personalizado',
    subtitle: 'Foco na Performance e Composição Física',
    category: 'treino',
    price: 19.99,
    originalPrice: 29.99,
    badge: 'Recomendado',
    description: 'Focado nos seus objetivos de ganho de massa, definição ou perda de gordura, com rotinas ajustadas ao seu local de treino e equipamentos.',
    features: [
      'Divisão Semanal de Treinos (Ex: Push/Pull/Legs, Fullbody)',
      'Séries, Repetições, RPE e Tempos de Descanso',
      'Ajustado a Ginásio, Casa ou Outdoor',
      'Vídeos/Instruções de Execução Correta',
      'Ajustes para Lesões ou Limitações Articulares'
    ],
    estimatedDays: 1,
    iconName: 'Dumbbell',
    color: 'from-blue-600 to-indigo-600',
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'plano-dieta',
    title: 'Plano de Nutrição & Dieta',
    subtitle: 'Alimentação Equilibrada sem Dietas Malucas',
    category: 'dieta',
    price: 19.99,
    originalPrice: 29.99,
    description: 'Estratégia nutricional desenhada para os seus gostos, sem alimentos proibidos. Melhore a energia diária e alcance o peso ideal.',
    features: [
      'Cardápio de 7 Dias Variado e Saboroso',
      'Grama por Grama: Substituições Flexíveis',
      'Ajustado a Alergias e Intolerâncias',
      'Lista de Compras Prática para Supermercado',
      'Dicas para Refeições Fora de Casa'
    ],
    estimatedDays: 1,
    iconName: 'Apple',
    color: 'from-emerald-500 to-teal-700',
    imageUrl: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'longevidade-senior',
    title: 'Plano Longevidade & Saúde Sénior 50+',
    subtitle: 'Vitalidade, Mobilidade e Força Articular',
    category: 'sociedade',
    price: 24.99,
    originalPrice: 39.99,
    badge: 'Inovação Social 🌟',
    description: 'Especialmente criado para adultos e seniores que procuram preservar a densidade óssea, massa muscular, equilíbrio e vitalidade diária.',
    features: [
      'Exercícios Baixo Impacto para Preservação Articular',
      'Fortalecimento de Fémur, Coluna e Equilíbrio',
      'Dieta Rica em Proteína, Cálcio, Vitamina D e Antioxidantes',
      'Protocolos Anti-inflamatórios Nutricionais',
      'Instruções de Segurança e Progressão Suave'
    ],
    estimatedDays: 1,
    iconName: 'HeartPulse',
    color: 'from-rose-500 to-pink-600',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'produtividade-sono',
    title: 'Plano Sono, Foco & Anti-Burnout',
    subtitle: 'Otimização Biológica para Profissionais',
    category: 'sociedade',
    price: 24.99,
    originalPrice: 34.99,
    badge: 'Gestão de Stress',
    description: 'Para quem sofre de exaustão mental, insónias ou neblina cerebral. Protocolo biológico de nutrição, ritmo circadiano e rotinas de descompressão.',
    features: [
      'Protocolo de Higiene de Sono Circadiana',
      'Nutrição para Foco Cognitivo e Redução do Cortisol',
      'Rotinas Matinais de Luz e Ativação Metabólica',
      'Estratégia de Gestão de Cafeína e Suplementação Noturna',
      'Exercícios de Respiração e Micro-Regulação Sensorial'
    ],
    estimatedDays: 1,
    iconName: 'Moon',
    color: 'from-purple-600 to-indigo-800',
    imageUrl: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'pos-parto',
    title: 'Plano Pós-Parto & Maternidade Ativa',
    subtitle: 'Recuperação Segura do Pavimento Pélvico',
    category: 'sociedade',
    price: 24.99,
    originalPrice: 39.99,
    badge: 'Saúde Feminina',
    description: 'Desenvolvido para recém-mães com foco na reabilitação abdominal, correção de diástase, sustentação pélvica e nutrição durante a amamentação.',
    features: [
      'Reabilitação de Diástase Abdominal e Solo Pélvico',
      'Nutrição Adequada para Amamentação e Energia',
      'Treinos Curtos de 15 a 20 min para Fazer em Casa',
      'Cuidados com Postura na Amamentação e Colo',
      'Acompanhamento Gradual por Fases Pós-Parto'
    ],
    estimatedDays: 1,
    iconName: 'Baby',
    color: 'from-pink-500 to-rose-400',
    imageUrl: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'ergonomia-trabalho-remoto',
    title: 'Plano Ergonómico & Postural (Workplace)',
    subtitle: 'Alívio de Dores de Costas e Pescoço',
    category: 'sociedade',
    price: 14.99,
    originalPrice: 24.99,
    badge: 'Trabalho Remoto',
    description: 'Ideal para quem passa +6 horas sentado à frente do computador. Elimine dores lombares, tensão cervical e rigidez nas ancas.',
    features: [
      'Micro-pausas de 3 Minutos na Cadeira',
      'Exercícios de Descompressão Vertebral e Escapular',
      'Nutrição Anti-Inatividade e Hidratação Escalonada',
      'Checklist de Ergonomia do Posto de Trabalho',
      'Rotina Express de Mobilidade ao Final do Dia'
    ],
    estimatedDays: 1,
    iconName: 'Laptop',
    color: 'from-cyan-600 to-blue-600',
    imageUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'preparacao-corrida',
    title: 'Plano Preparação Corrida & Maratona',
    subtitle: 'Construção de Resistência & Pace',
    category: 'sociedade',
    price: 24.99,
    originalPrice: 39.99,
    badge: 'Atletas & Corredores',
    description: 'Planeamento de rodagens, treinos de séries e ritmo para provas de 5k, 10k, 21k ou 42k, acompanhado de estratégia de hidratação e carb-loading.',
    features: [
      'Planificação de Quilometrajes e Zonas de Frequência Cardíaca',
      'Fortalecimento Específico de Pés, Tornozelos e Glúteos',
      'Nutrição Peri-Treino e Estratégia de Géis/Eletrólitos',
      'Recuperação Muscular e Prevenção de Canelites/Fascite',
      'Estratégia de Ritmo para o Dia da Prova'
    ],
    estimatedDays: 1,
    iconName: 'Activity',
    color: 'from-orange-500 to-amber-600',
    imageUrl: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=800&q=80'
  }
];
