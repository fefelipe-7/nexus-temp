import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Users, Star, Music, BookOpen, Compass, Zap, Flag,
  Heart, Apple, Droplets, Dumbbell, Activity, Stethoscope, Pill,
  Smile, Brain, Target, CheckSquare, Flame, ClipboardList, Repeat, GitBranch, Award,
  TrendingUp, TrendingDown, DollarSign, BarChart3, CreditCard, Shield, Sparkles,
  Moon, Sun, type LucideIcon,
} from 'lucide-react';
import { useRouter } from '../../app/router/RouterProvider';
import { type ModuleSlug, type SubmoduleType, submodulePath } from '../../app/router/routes';
import { RelationshipsCard } from '../../shared/cards/RelationshipsCard';
import { CommunityBelongingCard } from '../../shared/cards/CommunityBelongingCard';
import { ExperiencesCard } from '../../shared/cards/ExperiencesCard';
import { LeisureHobbiesCard } from '../../shared/cards/LeisureHobbiesCard';
import { LearningsCard } from '../../shared/cards/LearningsCard';
import { PurposeValuesCard } from '../../shared/cards/PurposeValuesCard';
import { DecisionsCard } from '../../shared/cards/DecisionsCard';
import { MilestonesCard } from '../../shared/cards/MilestonesCard';
import { EmotionMoodCard } from '../../shared/cards/EmotionCard';
import { StressAnxietyCard } from '../../shared/cards/StressAnxietyCard';
import { FocusCognitionCard } from '../../shared/cards/FocusCognitionCard';
import { MotivationWillpowerCard } from '../../shared/cards/MotivationWillpowerCard';
import { MentalLoadCard } from '../../shared/cards/MentalLoadCard';
import { SelfAwarenessCard } from '../../shared/cards/SelfAwarenessCard';
import { MentalPracticesCard } from '../../shared/cards/MentalPracticesCard';
import { useNexusAlert } from '../../app/providers/NexusAlertProvider';
import { storage } from '../../lib/storage';
import RelacionamentosPage from './RelacionamentosPage';
import ComunidadePage from './ComunidadePage';

interface SubmoduleMeta {
  title: string;
  desc: string;
  icon: LucideIcon;
  module: ModuleSlug;
}

const SUBMODULE_META: Record<string, SubmoduleMeta> = {
  relacionamentos: { title: 'Relacionamentos', desc: 'Vínculos, pessoas importantes e apoio emocional', icon: Users, module: 'relacoes' },
  comunidade: { title: 'Comunidade', desc: 'Grupos, participação e pertencimento social', icon: Heart, module: 'relacoes' },
  experiencias: { title: 'Experiências', desc: 'Momentos marcantes, novidades e descobertas', icon: Star, module: 'relacoes' },
  lazer: { title: 'Lazer', desc: 'Hobbies, interesses e atividades prazerosas', icon: Music, module: 'relacoes' },
  aprendizados: { title: 'Aprendizados', desc: 'Conhecimento, habilidades e crescimento intelectual', icon: BookOpen, module: 'relacoes' },
  proposito: { title: 'Propósito', desc: 'Valores, direção e sentido de vida', icon: Compass, module: 'relacoes' },
  decisoes: { title: 'Decisões', desc: 'Escolhas, caminhos e balanço decisório', icon: Zap, module: 'relacoes' },
  marcos: { title: 'Marcos', desc: 'Eventos importantes e transições de vida', icon: Flag, module: 'relacoes' },
  sono: { title: 'Sono', desc: 'Qualidade do descanso, duração e recuperação noturna', icon: Moon, module: 'saude' },
  nutricao: { title: 'Nutrição', desc: 'Alimentação, equilíbrio nutricional e refeições', icon: Apple, module: 'saude' },
  hidratacao: { title: 'Hidratação', desc: 'Consumo de água e manutenção da hidratação', icon: Droplets, module: 'saude' },
  movimento: { title: 'Movimento', desc: 'Atividade física, treinos e exercícios', icon: Dumbbell, module: 'saude' },
  recuperacao: { title: 'Recuperação', desc: 'Descanso, regeneração e adaptação física', icon: Activity, module: 'saude' },
  biometria: { title: 'Biometria', desc: 'Peso, medidas e composição corporal', icon: Activity, module: 'saude' },
  'saude-clinica': { title: 'Saúde Clínica', desc: 'Exames, sintomas e acompanhamento médico', icon: Stethoscope, module: 'saude' },
  substancias: { title: 'Substâncias', desc: 'Cafeína, álcool, medicamentos e suplementos', icon: Pill, module: 'saude' },
  humor: { title: 'Humor', desc: 'Emoções, estados afetivos e regulação emocional', icon: Smile, module: 'mente' },
  'estresse-ansiedade': { title: 'Estresse & Ansiedade', desc: 'Tensão, preocupação e ativação emocional', icon: Brain, module: 'mente' },
  'foco-cognicao': { title: 'Foco & Cognição', desc: 'Concentração, clareza mental e desempenho cognitivo', icon: Target, module: 'mente' },
  'motivacao-vontade': { title: 'Motivação & Vontade', desc: 'Disposição, impulso e força de vontade', icon: Zap, module: 'mente' },
  'carga-mental': { title: 'Carga Mental', desc: 'Sobrecarga cognitiva, fadiga mental e processamento', icon: Brain, module: 'mente' },
  'journal-diario': { title: 'Journal & Diário', desc: 'Registros pessoais, reflexões e narrativa interna', icon: BookOpen, module: 'mente' },
  autoconhecimento: { title: 'Autoconhecimento', desc: 'Consciência, identidade e percepção de si', icon: Sun, module: 'mente' },
  'praticas-mentais': { title: 'Práticas Mentais', desc: 'Meditação, mindfulness e exercícios mentais', icon: Brain, module: 'mente' },
  foco: { title: 'Foco', desc: 'Concentração, atenção sustentada e mergulho cognitivo', icon: Target, module: 'acao' },
  disciplina: { title: 'Disciplina', desc: 'Compromisso com rotinas e autorregulação', icon: CheckSquare, module: 'acao' },
  fluxo: { title: 'Fluxo', desc: 'Imersão total e alta performance fluida', icon: Zap, module: 'acao' },
  energia: { title: 'Energia', desc: 'Disponibilidade física e mental ao longo do dia', icon: Flame, module: 'acao' },
  prioridades: { title: 'Prioridades', desc: 'Clareza do que é importante e alinhamento com objetivos', icon: ClipboardList, module: 'acao' },
  consistencia: { title: 'Consistência', desc: 'Regularidade das ações e manutenção de hábitos', icon: Repeat, module: 'acao' },
  adaptabilidade: { title: 'Adaptabilidade', desc: 'Flexibilidade para ajustar rotas e lidar com mudanças', icon: GitBranch, module: 'acao' },
  conquistas: { title: 'Conquistas', desc: 'Metas alcançadas e progresso tangível', icon: Award, module: 'acao' },
  renda: { title: 'Renda', desc: 'Fontes de receita e fluxo de entrada financeira', icon: TrendingUp, module: 'financas' },
  'despesas-fixas': { title: 'Despesas Fixas', desc: 'Contas recorrentes e compromissos financeiros regulares', icon: DollarSign, module: 'financas' },
  'despesas-variaveis': { title: 'Despesas Variáveis', desc: 'Gastos discricionários e consumo flexível', icon: TrendingDown, module: 'financas' },
  investimentos: { title: 'Investimentos', desc: 'Carteira, alocação de ativos e rendimento', icon: BarChart3, module: 'financas' },
  dividas: { title: 'Dívidas', desc: 'Passivos, parcelamentos e compromissos pendentes', icon: CreditCard, module: 'financas' },
  objetivos: { title: 'Objetivos', desc: 'Metas financeiras e planejamento patrimonial', icon: Target, module: 'financas' },
  seguranca: { title: 'Segurança', desc: 'Reserva de emergência e proteção financeira', icon: Shield, module: 'financas' },
  abundancia: { title: 'Abundância', desc: 'Prosperidade e satisfação financeira', icon: Sparkles, module: 'financas' },
};

const MODULE_THEME: Record<ModuleSlug, { accent: string; soft: string; line: string; text: string }> = {
  relacoes: { accent: 'text-life', soft: 'bg-life-soft', line: 'border-life-line', text: 'text-life' },
  mente: { accent: 'text-mind', soft: 'bg-mind-soft', line: 'border-mind-line', text: 'text-mind' },
  saude: { accent: 'text-health', soft: 'bg-health-soft', line: 'border-health-line', text: 'text-health' },
  acao: { accent: 'text-action', soft: 'bg-action-soft', line: 'border-action-line', text: 'text-action' },
  financas: { accent: 'text-finance', soft: 'bg-finance-soft', line: 'border-finance-line', text: 'text-finance' },
};

const SUBS_MODULE: Record<ModuleSlug, SubmoduleType[]> = {
  relacoes: ['relacionamentos', 'comunidade', 'experiencias', 'lazer', 'aprendizados', 'proposito', 'decisoes', 'marcos'],
  saude: ['sono', 'nutricao', 'hidratacao', 'movimento', 'recuperacao', 'biometria', 'saude-clinica', 'substancias'],
  mente: ['humor', 'estresse-ansiedade', 'foco-cognicao', 'motivacao-vontade', 'carga-mental', 'journal-diario', 'autoconhecimento', 'praticas-mentais'],
  acao: ['foco', 'disciplina', 'fluxo', 'energia', 'prioridades', 'consistencia', 'adaptabilidade', 'conquistas'],
  financas: ['renda', 'despesas-fixas', 'despesas-variaveis', 'investimentos', 'dividas', 'objetivos', 'seguranca', 'abundancia'],
};

interface MetricData { label: string; value: string; unit?: string }

const SUBMODULE_METRICS: Record<string, MetricData[]> = {
  sono: [
    { label: 'Qualidade', value: '8.4', unit: '/10' },
    { label: 'Duração', value: '7.2', unit: 'h' },
    { label: 'Regularidade', value: 'Alta' },
    { label: 'Profundidade', value: 'Boa' },
  ],
  nutricao: [
    { label: 'Qualidade', value: 'Boa' },
    { label: 'Refeições', value: 'Regulares' },
    { label: 'Proteínas', value: '30%' },
    { label: 'Calorias', value: '2.100' },
  ],
  hidratacao: [
    { label: 'Média', value: '2.1', unit: 'L' },
    { label: 'Meta', value: '84%' },
    { label: 'Consistência', value: 'Boa' },
  ],
  movimento: [
    { label: 'Frequência', value: '4x', unit: '/sem' },
    { label: 'Consistência', value: 'Alta' },
    { label: 'Duração', value: '45', unit: 'min' },
  ],
  recuperacao: [
    { label: 'Recuperação', value: 'Boa' },
    { label: 'Fadiga', value: 'Moderada' },
    { label: 'Sono REM', value: '2.1', unit: 'h' },
  ],
  biometria: [
    { label: 'Peso', value: 'Estável' },
    { label: 'Tendência', value: 'Gradual' },
    { label: 'Gordura', value: '16%' },
  ],
  'saude-clinica': [
    { label: 'Exames', value: 'Em dia' },
    { label: 'Sintomas', value: 'Estáveis' },
    { label: 'Pressão', value: 'Normal' },
  ],
  substancias: [
    { label: 'Cafeína', value: '2x', unit: '/dia' },
    { label: 'Álcool', value: 'Ocasional' },
    { label: 'Suplementos', value: 'Sim' },
  ],
  foco: [
    { label: 'Média', value: '7.8', unit: '/10' },
    { label: 'Sessões', value: '3-4', unit: '/dia' },
    { label: 'Tendência', value: 'Estável' },
  ],
  disciplina: [
    { label: 'Adesão', value: '84%' },
    { label: 'Sequência', value: '12', unit: 'dias' },
    { label: 'Recuperação', value: 'Rápida' },
  ],
  fluxo: [
    { label: 'Frequência', value: '3x', unit: '/sem' },
    { label: 'Duração', value: '90', unit: 'min' },
    { label: 'Qualidade', value: 'Alta' },
  ],
  energia: [
    { label: 'Manhã', value: 'Alta' },
    { label: 'Tarde', value: 'Moderada' },
    { label: 'Noite', value: 'Baixa' },
  ],
  prioridades: [
    { label: 'Clareza', value: 'Alta' },
    { label: 'Alinhamento', value: '82%' },
    { label: 'Foco', value: 'Bom' },
  ],
  consistencia: [
    { label: 'Sequência', value: '12', unit: 'dias' },
    { label: 'Quedas', value: '2', unit: '/mês' },
    { label: 'Score', value: '78%' },
  ],
  adaptabilidade: [
    { label: 'Resiliência', value: 'Alta' },
    { label: 'Recuperação', value: 'Rápida' },
    { label: 'Flexibilidade', value: 'Boa' },
  ],
  conquistas: [
    { label: 'Realizadas', value: '8' },
    { label: 'Andamento', value: '3' },
    { label: 'Progresso', value: '62%' },
  ],
  renda: [
    { label: 'Principal', value: 'R$ 7.200' },
    { label: 'Extra', value: 'R$ 1.200' },
    { label: 'Tendência', value: 'Crescimento' },
  ],
  'despesas-fixas': [
    { label: 'Total', value: 'R$ 3.100' },
    { label: 'Relação', value: '37%' },
    { label: 'Variação', value: 'Estável' },
  ],
  'despesas-variaveis': [
    { label: 'Total', value: 'R$ 2.100' },
    { label: 'Variação', value: '-12%' },
    { label: 'Categoria', value: 'Alimentação' },
  ],
  investimentos: [
    { label: 'Carteira', value: 'R$ 24.500' },
    { label: 'Retorno', value: '+8.2%' },
    { label: 'Diversificação', value: 'Boa' },
  ],
  dividas: [
    { label: 'Total', value: 'R$ 3.800' },
    { label: 'Evolução', value: '-22%' },
    { label: 'Parcelas', value: '4' },
  ],
  objetivos: [
    { label: 'Metas', value: '4', unit: 'ativas' },
    { label: 'Progresso', value: '62%' },
    { label: 'Curto prazo', value: '87%' },
  ],
  seguranca: [
    { label: 'Reserva', value: 'R$ 12.000' },
    { label: 'Meses', value: '3', unit: 'meses' },
    { label: 'Meta', value: '6', unit: 'meses' },
  ],
  abundancia: [
    { label: 'Satisfação', value: '7.4', unit: '/10' },
    { label: 'Tendência', value: 'Melhorando' },
    { label: 'Score', value: 'Bom' },
  ],
  relacionamentos: [
    { label: 'Vínculos', value: '82%' },
    { label: 'Ativos', value: '5' },
    { label: 'Apoio', value: 'Disponível' },
  ],
  comunidade: [
    { label: 'Pertencimento', value: 'Alta' },
    { label: 'Participação', value: '67%' },
    { label: 'Grupos', value: '3' },
  ],
  experiencias: [
    { label: 'Marcantes', value: '8' },
    { label: 'Novidades', value: '3' },
    { label: 'Impacto', value: 'Alto' },
  ],
  lazer: [
    { label: 'Hobbies', value: '5' },
    { label: 'Horas', value: '14', unit: '/sem' },
    { label: 'Engajamento', value: '78%' },
  ],
  aprendizados: [
    { label: 'Momentos', value: '12' },
    { label: 'Habilidades', value: '4' },
    { label: 'Crescimento', value: '82%' },
  ],
  proposito: [
    { label: 'Alinhamento', value: '84%' },
    { label: 'Clareza', value: '72%' },
    { label: 'Valores', value: '5' },
  ],
  decisoes: [
    { label: 'Decisões', value: '18' },
    { label: 'Satisfação', value: '78%' },
    { label: 'Refletidas', value: '62%' },
  ],
  marcos: [
    { label: 'Marcos', value: '8' },
    { label: 'Transições', value: '3' },
    { label: 'Impacto', value: 'Alto' },
  ],
  humor: [
    { label: 'Média', value: '7.2', unit: '/10' },
    { label: 'Estabilidade', value: 'Moderada' },
    { label: 'Tendência', value: 'Positiva' },
  ],
  'estresse-ansiedade': [
    { label: 'Estresse', value: 'Moderado' },
    { label: 'Ansiedade', value: 'Leve' },
    { label: 'Frequência', value: '2-3x', unit: '/sem' },
  ],
  'foco-cognicao': [
    { label: 'Foco', value: '7.8', unit: '/10' },
    { label: 'Clareza', value: 'Boa' },
    { label: 'Fadiga', value: 'Moderada' },
  ],
  'motivacao-vontade': [
    { label: 'Motivação', value: 'Alta' },
    { label: 'Vontade', value: 'Boa' },
    { label: 'Consistência', value: '72%' },
  ],
  'carga-mental': [
    { label: 'Carga', value: 'Alta' },
    { label: 'Sobrecarga', value: 'Moderada' },
    { label: 'Recuperação', value: 'Lenta' },
  ],
  'journal-diario': [
    { label: 'Frequência', value: '3-4x', unit: '/sem' },
    { label: 'Profundidade', value: 'Boa' },
    { label: 'Clareza', value: 'Alta' },
  ],
  autoconhecimento: [
    { label: 'Consciência', value: 'Alta' },
    { label: 'Clareza', value: '76%' },
    { label: 'Evolução', value: 'Positiva' },
  ],
  'praticas-mentais': [
    { label: 'Frequência', value: '2x', unit: '/sem' },
    { label: 'Duração', value: '15', unit: 'min' },
    { label: 'Consistência', value: 'Moderada' },
  ],
};

const SUBMODULE_INSIGHTS: Record<string, string> = {
  relacionamentos: 'Conversas com pessoas próximas continuam associadas aos seus melhores dias.',
  comunidade: 'Sua sensação de pertencimento cresce quando participa ativamente de grupos.',
  experiencias: 'Experiências fora da rotina tiveram forte impacto positivo na energia mental.',
  lazer: 'Seu lazer está mais consistente do que nos períodos anteriores.',
  aprendizados: 'Você aprende melhor quando conecta teoria com aplicação prática.',
  proposito: 'Suas decisões recentes mostram maior alinhamento com seus valores centrais.',
  decisoes: 'As decisões tomadas com mais reflexão geraram maior satisfação posterior.',
  marcos: 'O último período marcou uma nova fase de crescimento pessoal.',
  sono: 'A qualidade do sono continua sendo o principal fator associado à melhora dos demais indicadores de saúde.',
  nutricao: 'Sua alimentação foi mais equilibrada nos períodos com maior energia diária.',
  hidratacao: 'Os dias mais hidratados apresentaram menor sensação de fadiga.',
  movimento: 'A prática regular de atividade física está associada a maior disposição e bem-estar.',
  recuperacao: 'Períodos de recuperação adequada precederam seus melhores desempenhos físicos.',
  biometria: 'As mudanças corporais recentes ocorreram de forma gradual e consistente.',
  'saude-clinica': 'Os registros clínicos mostram estabilidade geral dos indicadores monitorados.',
  substancias: 'O consumo próximo ao horário de dormir continua afetando a qualidade do sono.',
  humor: 'Seu humor é mais estável quando combinado com boas noites de sono.',
  'estresse-ansiedade': 'O estresse diminui significativamente em dias com pausas programadas.',
  'foco-cognicao': 'Sessões curtas e frequentes de foco geram mais resultado que longas exaustivas.',
  'motivacao-vontade': 'A motivação aparece mais forte quando conectada a um propósito claro.',
  'carga-mental': 'A carga mental reduz quando você externaliza tarefas e compromissos.',
  'journal-diario': 'Escrever regularmente ajuda a organizar pensamentos e reduzir ansiedade.',
  autoconhecimento: 'A prática de auto-observação fortalece sua capacidade de escolha.',
  'praticas-mentais': 'Práticas consistentes de mindfulness reduzem a reatividade emocional.',
  foco: 'Seu foco é maior nas primeiras horas do dia e após uma boa noite de sono.',
  disciplina: 'A disciplina está mais forte quando associada a rotinas matinais consistentes.',
  fluxo: 'O estado de fluxo aparece com mais frequência em tarefas criativas e desafiadoras.',
  energia: 'Sua energia é significativamente maior pela manhã — esse é seu horário de ouro.',
  prioridades: 'Quando as prioridades estão claras, a execução flui com menos atrito.',
  consistencia: 'Manter a consistência por mais de 10 dias seguidos gera um efeito de aceleração.',
  adaptabilidade: 'Sua capacidade de ajustar plano rapidamente minimizou o impacto de imprevistos.',
  conquistas: 'Cada conquista recente foi precedida por um período de consistência acima da média.',
  renda: 'A renda apresenta trajetória consistente de crescimento nos últimos meses.',
  'despesas-fixas': 'As despesas fixas permanecem estáveis e dentro de uma faixa saudável da renda.',
  'despesas-variaveis': 'A redução de despesas variáveis gerou mais folga no orçamento.',
  investimentos: 'A diversificação da carteira está proporcionando retornos mais estáveis.',
  dividas: 'O saldo devedor vem caindo consistentemente nos últimos meses.',
  objetivos: 'As metas de curto prazo estão mais avançadas que as de longo prazo.',
  seguranca: 'A reserva de emergência já cobre 3 meses de despesas.',
  abundancia: 'Sua relação com o dinheiro está mais saudável — menos ansiedade, mais planejamento.',
};

const SUBMODULE_REFLECTIONS: Record<string, string> = {
  relacionamentos: 'Qual relação você gostaria de nutrir melhor nos próximos dias?',
  comunidade: 'Em qual grupo você gostaria de estar mais presente?',
  experiencias: 'Que experiência nova você gostaria de viver em breve?',
  lazer: 'Que hobby você quer retomar ou descobrir?',
  aprendizados: 'Qual habilidade você gostaria de desenvolver agora?',
  proposito: 'Suas ações atuais estão alinhadas com o que é mais importante para você?',
  decisoes: 'Qual decisão importante você está adiando?',
  marcos: 'Qual será seu próximo marco importante?',
  sono: 'O que mais atrapalha a qualidade do seu sono?',
  nutricao: 'Qual mudança alimentar traria mais energia para seu dia?',
  hidratacao: 'Em que momento do dia você mais esquece de beber água?',
  movimento: 'Que tipo de atividade física te dá mais prazer?',
  recuperacao: 'Como você pode melhorar sua recuperação entre os treinos?',
  biometria: 'Qual medida corporal reflete melhor sua evolução?',
  'saude-clinica': 'Qual exame ou consulta você está adiando?',
  substancias: 'Qual substância tem mais impacto negativo no seu bem-estar?',
  humor: 'O que mais influencia seu humor positivamente?',
  'estresse-ansiedade': 'Qual situação tem gerado mais estresse ultimamente?',
  'foco-cognicao': 'O que mais atrapalha sua concentração?',
  'motivacao-vontade': 'O que te motiva a levantar e fazer o que precisa ser feito?',
  'carga-mental': 'O que você pode delegar ou eliminar hoje?',
  'journal-diario': 'O que você quer registrar sobre seu dia de hoje?',
  autoconhecimento: 'O que você descobriu sobre si mesmo recentemente?',
  'praticas-mentais': 'Que prática mental poderia trazer mais calma ao seu dia?',
  foco: 'O que mais atrapalha seu foco durante o dia?',
  disciplina: 'Qual hábito você quer tornar automático?',
  fluxo: 'Em qual atividade você perde a noção do tempo?',
  energia: 'O que mais drena sua energia ao longo do dia?',
  prioridades: 'Qual é a coisa mais importante que você precisa fazer agora?',
  consistencia: 'O que te faz quebrar a sequência de hábitos?',
  adaptabilidade: 'Como você lida com mudanças inesperadas?',
  conquistas: 'Qual foi sua maior conquista recente?',
  renda: 'Como você pode diversificar suas fontes de renda?',
  'despesas-fixas': 'Qual despesa fixa poderia ser reduzida ou eliminada?',
  'despesas-variaveis': 'Onde você está gastando mais do que gostaria?',
  investimentos: 'Seu dinheiro está trabalhando para você?',
  dividas: 'Qual dívida você quer quitar primeiro?',
  objetivos: 'Qual objetivo financeiro é mais importante para você agora?',
  seguranca: 'Sua reserva de emergência está adequada?',
  abundancia: 'O que significa abundância financeira para você?',
};

const VIDA_SHARED_CARD_MAP: Record<string, { card: React.ComponentType<any>; props: Record<string, any> }> = {
  relacionamentos: { card: RelationshipsCard, props: { relationshipCount: 12, activeConnections: 5, supportAvailable: true, badgeLabel: 'vínculos fortalecidos' } },
  comunidade: { card: CommunityBelongingCard, props: { belongingScore: 82, participationScore: 67, badgeLabel: 'pertencimento ativo' } },
  experiencias: { card: ExperiencesCard, props: { experienceCount: 8, memorableMoments: 3, noveltyLevel: 78, badgeLabel: 'memórias em formação' } },
  lazer: { card: LeisureHobbiesCard, props: { hobbyCount: 5, leisureHours: 14, engagementLevel: 78, badgeLabel: 'interesses ativos' } },
  aprendizados: { card: LearningsCard, props: { learningMoments: 12, skillsImproved: 4, growthLevel: 82, badgeLabel: 'crescimento ativo' } },
  proposito: { card: PurposeValuesCard, props: { alignmentScore: 84, clarityLevel: 72, activeValues: 5, badgeLabel: 'alinhamento crescente' } },
  decisoes: { card: DecisionsCard, props: { decisionCount: 18, satisfactionScore: 78, badgeLabel: 'escolhas refletidas' } },
  marcos: { card: MilestonesCard, props: { milestoneCount: 8, transitionCount: 3, badgeLabel: 'fase de crescimento' } },
};

const MENTE_SHARED_CARD_MAP: Record<string, { card: React.ComponentType<any>; props: Record<string, any> }> = {
  humor: { card: EmotionMoodCard, props: { moodScore: 72, stabilityLevel: 'moderada', badgeLabel: 'estado emocional' } },
  'estresse-ansiedade': { card: StressAnxietyCard, props: { stressLevel: 58, anxietyLevel: 42, badgeLabel: 'tensão controlada' } },
  'foco-cognicao': { card: FocusCognitionCard, props: { focusScore: 78, mentalClarity: 72, badgeLabel: 'cognição ativa' } },
  'motivacao-vontade': { card: MotivationWillpowerCard, props: { motivationLevel: 82, willpowerScore: 68, badgeLabel: 'disposição alta' } },
  'carga-mental': { card: MentalLoadCard, props: { mentalLoad: 74, overwhelmLevel: 'moderada', badgeLabel: 'carga elevada' } },
  'journal-diario': { card: MentalLoadCard, props: { journalFrequency: '3-4x/sem', depthLevel: 'reflexivo', badgeLabel: 'registro ativo' } },
  autoconhecimento: { card: SelfAwarenessCard, props: { awarenessScore: 76, clarityLevel: 72, badgeLabel: 'consciência ativa' } },
  'praticas-mentais': { card: MentalPracticesCard, props: { practiceFrequency: '2x/sem', consistencyLevel: 'moderada', badgeLabel: 'prática consistente' } },
};

export default function SubmodulePage({ selectedDate }: { selectedDate: string }) {
  const { navigate, moduleSlug, submoduleType } = useRouter();
  const { showAlert } = useNexusAlert();
  const [reflectionText, setReflectionText] = useState('');

  const meta = submoduleType ? SUBMODULE_META[submoduleType] : null;
  const theme = moduleSlug ? MODULE_THEME[moduleSlug] : MODULE_THEME.relacoes;
  const metrics = submoduleType ? SUBMODULE_METRICS[submoduleType] || [] : [];
  const insight = submoduleType ? SUBMODULE_INSIGHTS[submoduleType] || '' : '';
  const reflection = submoduleType ? SUBMODULE_REFLECTIONS[submoduleType] || '' : '';

  if (!meta || !submoduleType) {
    return (
      <div className="p-5 space-y-4 text-ink bg-app min-h-screen">
        <button onClick={() => navigate('/modules')} className="flex items-center gap-2 text-subtle hover:text-ink transition-colors cursor-pointer">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>
        <p className="text-subtle">Submódulo não encontrado.</p>
      </div>
    );
  }

  const Icon = meta.icon;
  const moduleSubs = moduleSlug ? SUBS_MODULE[moduleSlug] || [] : [];
  const currentIdx = submoduleType ? moduleSubs.indexOf(submoduleType) : -1;
  const prevSub = currentIdx > 0 ? moduleSubs[currentIdx - 1] : null;
  const nextSub = currentIdx >= 0 && currentIdx < moduleSubs.length - 1 ? moduleSubs[currentIdx + 1] : null;

  const handleSaveReflection = () => {
    if (!reflectionText.trim()) {
      showAlert('Escreva algo antes de registrar.', meta.module);
      return;
    }
    const hoje = storage.getRegistroPorData(selectedDate) || { data: selectedDate };
    const reg = { ...hoje };
    reg.diario = (reg.diario ? reg.diario + '\n' : '') + `[${meta.title}]: ${reflectionText.trim()}`;
    storage.actualizarRegistro(reg);
    setReflectionText('');
    showAlert('Reflexão registrada!', meta.module);
  };

  if (submoduleType === 'relacionamentos') {
    return <RelacionamentosPage onBack={() => navigate('/modules')} />;
  }

  if (submoduleType === 'comunidade') {
    return <ComunidadePage onBack={() => navigate('/modules')} />;
  }

  const sharedCard = VIDA_SHARED_CARD_MAP[submoduleType] || MENTE_SHARED_CARD_MAP[submoduleType];

  return (
    <div className="space-y-6 -mx-5 px-5 -mt-6 pt-5 pb-32 text-ink font-sans bg-app">
      {/* Header */}
      <div className="flex items-center gap-3 pt-2">
        <button onClick={() => navigate('/modules')} className="p-2 -ml-2 hover:bg-card rounded-lg transition-colors cursor-pointer">
          <ArrowLeft className="w-5 h-5 text-ink" />
        </button>
        <div className={`w-9 h-9 rounded-xl ${theme.soft} border ${theme.line} flex items-center justify-center`}>
          <Icon className={`w-4 h-4 ${theme.text}`} />
        </div>
        <div className="space-y-0.5">
          <span className="text-caption text-subtle font-medium">{meta.title}</span>
          <p className="text-micro text-faint">{meta.desc}</p>
        </div>
      </div>

      {/* Shared card expanded (Vida/Mente) */}
      {sharedCard && (
        <div className="scale-[1.02] origin-top">
          <sharedCard.card
            {...sharedCard.props}
            insight={insight}
            onClick={() => showAlert(`Explorando ${meta.title}...`, meta.module)}
          />
        </div>
      )}

      {/* Metrics grid (for non Vida/Mente, or as extra detail) */}
      {!sharedCard && metrics.length > 0 && (
        <div className="bg-card border border-line rounded-sheet p-5 space-y-4">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-xl ${theme.soft} border ${theme.line} flex items-center justify-center`}>
              <Icon className={`w-4 h-4 ${theme.text}`} />
            </div>
            <h3 className="text-sm font-bold text-ink">Visão geral</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {metrics.map((m, i) => (
              <div key={i} className="bg-muted/60 border border-line/60 rounded-xl p-3">
                <span className="text-micro text-faint uppercase font-mono font-bold">{m.label}</span>
                <div className="text-base font-bold text-ink mt-0.5">
                  {m.value}
                  {m.unit && <span className="text-caption text-faint font-mono ml-0.5">{m.unit}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Shared card for Saúde/Ação/Finanças submodules that don't have a card — render inline metric in card format */}
      {!sharedCard && (
        <>
          <div className={`rounded-sheet border ${theme.line} ${theme.soft} p-5 space-y-3.5`}>
            <div className="flex items-center gap-2">
              <Icon className={`w-4 h-4 ${theme.text}`} />
              <span className="text-micro uppercase font-bold tracking-wider text-subtle font-mono">INSIGHT</span>
            </div>
            <p className="text-caption text-subtle leading-relaxed italic">
              {insight}
            </p>
          </div>

          {/* Quick capture area */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-ink">Registrar algo</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Anotar', sub: 'Registrar observação' },
                { label: 'Medir', sub: 'Registrar novo valor' },
                { label: 'Refletir', sub: 'Escrever percepção' },
                { label: 'Compartilhar', sub: 'Enviar para alguém' },
              ].map((item, idx) => (
                <button key={idx} onClick={() => showAlert(`Abrindo ${item.label}...`, meta.module)} className="bg-card border border-line rounded-xl p-3 text-left h-20 flex flex-col justify-between hover:border-ink/30 active-tap transition-all cursor-pointer">
                  <div className={`w-6 h-6 rounded-full ${theme.soft} flex items-center justify-center`}>
                    <Icon className={`w-3.5 h-3.5 ${theme.text}`} />
                  </div>
                  <div>
                    <h4 className="text-caption font-bold text-ink">{item.label}</h4>
                    <p className="text-micro text-faint">{item.sub}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Navigation between submodules */}
      <div className="flex items-center justify-between gap-3">
        {prevSub ? (
          <button onClick={() => navigate(submodulePath(meta.module, prevSub))} className="flex items-center gap-1.5 text-caption text-subtle hover:text-ink transition-colors cursor-pointer">
            <ArrowLeft className="w-3.5 h-3.5" />
            {SUBMODULE_META[prevSub]?.title || ''}
          </button>
        ) : <div />}
        {nextSub ? (
          <button onClick={() => navigate(submodulePath(meta.module, nextSub))} className="flex items-center gap-1.5 text-caption text-subtle hover:text-ink transition-colors cursor-pointer">
            {SUBMODULE_META[nextSub]?.title || ''}
            <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
          </button>
        ) : <div />}
      </div>

      {/* Reflection */}
      <div className="rounded-[28px] p-6 space-y-4 shadow-md relative overflow-hidden bg-ink-deep">
        <div className="space-y-1 relative z-10">
          <span className="text-micro uppercase font-bold tracking-wider text-faint font-mono">REFLEXÃO</span>
          <p className="text-body text-white/80 leading-relaxed font-serif italic pt-1">
            {reflection}
          </p>
        </div>
        <div className="space-y-3 relative z-10">
          <textarea
            value={reflectionText}
            onChange={(e) => setReflectionText(e.target.value)}
            placeholder="Escreva sua reflexão..."
            rows={3}
            className="w-full text-caption bg-white/10 text-white border border-white/20 rounded-xl p-3 placeholder-white/50 focus:outline-hidden focus:border-white/50 focus:ring-1 focus:ring-white/25 resize-none leading-relaxed"
          />
          <button onClick={handleSaveReflection} className="w-full bg-white/10 hover:bg-white/20 text-white text-caption font-bold py-3 px-4 rounded-xl border border-white/20 transition-colors active-tap cursor-pointer">
            Registrar reflexão
          </button>
        </div>
      </div>
    </div>
  );
}
