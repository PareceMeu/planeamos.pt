export type PlanCategory = 'treino' | 'dieta' | 'combinado' | 'sociedade';

export interface PlanType {
  id: string;
  title: string;
  subtitle: string;
  category: PlanCategory;
  price: number;
  originalPrice?: number;
  badge?: string;
  isPopular?: boolean;
  description: string;
  features: string[];
  estimatedDays: number;
  iconName: string;
  color: string;
  imageUrl?: string;
}

export interface QuestionnaireData {
  name: string;
  email: string;
  phone?: string;
  age: number;
  gender: 'masculino' | 'feminino' | 'outro';
  height: number; // in cm
  weight: number; // in kg
  targetWeight?: number; // in kg
  activityLevel: 'sedentario' | 'moderado' | 'ativo' | 'muito_ativo';
  primaryGoal: 'perda_peso' | 'hipertrofia' | 'recomposicao' | 'saude_longevidade' | 'postura_ergonomia' | 'pos_parto' | 'resistencia_corrida' | 'stress_sono';
  medicalConditions: string;
  dietaryRestrictions: string[]; // e.g. 'sem_lactose', 'sem_gluten', 'vegetariano', 'vegan', 'sem_porco'
  foodPreferences: string; // foods liked or disliked
  workoutLocation: 'ginasio' | 'casa' | 'outdoor' | 'escritorio';
  equipmentAvailable: string[]; // e.g. 'halteres', 'elasticos', 'barra', 'nenhum'
  daysPerWeek: number;
  additionalNotes?: string;
}

export interface MacroBreakdown {
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
  waterLiters: number;
  bmr: number;
  tdee: number;
}

export interface ExerciseItem {
  name: string;
  sets: string;
  reps: string;
  rest: string;
  notes?: string;
  targetMuscles?: string;
}

export interface WorkoutDay {
  dayTitle: string; // e.g., "Dia 1 - Peito e Tríceps"
  focus: string;
  exercises: ExerciseItem[];
}

export interface MealItem {
  mealName: string; // e.g. "Pequeno-almoço"
  timeSuggestion?: string;
  description: string;
  approxCalories?: number;
  substitutions?: string;
}

export interface DayMealPlan {
  dayName: string; // e.g. "Segunda-feira"
  meals: MealItem[];
}

export interface PlanDocument {
  title: string;
  generatedAt: string;
  clientName: string;
  summaryText: string;
  macroBreakdown: MacroBreakdown;
  workoutSplit: WorkoutDay[];
  mealPlan7Days: DayMealPlan[];
  groceryList: {
    category: string;
    items: string[];
  }[];
  lifestyleTips: string[];
  specialRecommendations: string[];
}

export interface Order {
  id: string; // invoice PLN-XXXXX
  planId: string;
  planTitle: string;
  planPrice: number;
  questionnaire: QuestionnaireData;
  paymentStatus: 'pendente' | 'pago' | 'reembolsado' | 'rejeitado';
  paymentMethod: 'paypal' | 'mbway' | 'multibanco';
  paymentTxId?: string;
  createdAt: string;
  planDocument?: PlanDocument;
  emailSentStatus: 'nao_enviado' | 'enviado' | 'falha';
  emailSentAt?: string;
}
