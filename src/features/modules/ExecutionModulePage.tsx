import React, { useState } from 'react';
import {
  Target,
  CheckSquare,
  Zap,
  Flame,
  ClipboardList,
  Repeat,
  GitBranch,
  Award,
  Sparkles,
  SlidersHorizontal,
  Lightbulb,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { storage } from '../../lib/storage';
import { useNexusAlert } from '../../app/providers/NexusAlertProvider';

interface ExecutionModulePageProps {
  selectedDate: string;
  refreshCount: number;
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

const EXECUTION_NODES = [
  { label: 'Foco', angle: 0, distance: 48, color: '#0969DA' },
  { label: 'Disciplina', angle: 45, distance: 62, color: '#3B82F6' },
  { label: 'Fluxo', angle: 90, distance: 55, color: '#60A5FA' },
  { label: 'Energia', angle: 135, distance: 52, color: '#0969DA' },
  { label: 'Prioridades', angle: 180, distance: 58, color: '#3B82F6' },
  { label: 'Consistência', angle: 225, distance: 66, color: '#60A5FA' },
  { label: 'Adaptabilidade', angle: 270, distance: 70, color: '#3B82F6' },
  { label: 'Conquistas', angle: 315, distance: 64, color: '#0969DA' },
];

interface QuickItem { icon: LucideIcon; title: string; sub: string }

const QUICK_ITEMS: QuickItem[] = [
  { icon: Target, title: 'Foco', sub: 'Registrar sessão de foco' },
  { icon: CheckSquare, title: 'Tarefa', sub: 'Registrar tarefa concluída' },
  { icon: Zap, title: 'Fluxo', sub: 'Registrar estado de fluxo' },
  { icon: Flame, title: 'Energia', sub: 'Registrar nível de energia' },
  { icon: ClipboardList, title: 'Prioridade', sub: 'Registrar prioridade do dia' },
  { icon: Repeat, title: 'Consistência', sub: 'Registrar sequência de hábito' },
  { icon: GitBranch, title: 'Adaptação', sub: 'Registrar mudança de rota' },
  { icon: Award, title: 'Conquista', sub: 'Registrar conquista' },
];

const CONNECTIONS = [
  { title: 'Foco ↔ Produtividade', insight: 'Sessões mais longas de foco aparecem associadas a maior entrega diária.' },
  { title: 'Energia ↔ Prioridades', insight: 'Quando a energia está alta, as prioridades mais difíceis são atacadas primeiro.' },
  { title: 'Consistência ↔ Progresso', insight: 'Pequenas ações diárias geram mais progresso do que grandes esforços isolados.' },
  { title: 'Disciplina ↔ Resultados', insight: 'Dias com mais disciplina tendem a produzir resultados mais previsíveis.' },
  { title: 'Adaptabilidade ↔ Resolução', insight: 'A capacidade de ajustar a rota rapidamente reduz o impacto de imprevistos.' },
];

const TIMELINE_EVENTS = [
  { title: 'Semana de foco intenso em projeto prioritário', category: 'Foco', impact: 'produtivo', color: '#0969DA' },
  { title: 'Sequência de 7 dias de hábito consistente', category: 'Disciplina', impact: 'consistência', color: '#3B82F6' },
  { title: 'Estado de fluxo prolongado em atividade criativa', category: 'Fluxo', impact: 'imersão', color: '#60A5FA' },
  { title: 'Reorganização completa de prioridades', category: 'Prioridades', impact: 'reestruturação', color: '#3B82F6' },
  { title: 'Conquista de meta importante de carreira', category: 'Conquistas', impact: 'realização', color: '#0969DA' },
];

export default function ExecutionModulePage({ selectedDate, refreshCount }: ExecutionModulePageProps) {
  const { showAlert } = useNexusAlert();
  const [reflexaoTexto, setReflexaoTexto] = useState('');

  const handleQuickRegister = (item: string) => {
    showAlert(`Abrindo fluxo de registro para ${item}...`, 'acao');
  };

  const handleSubmodule = (name: string) => {
    showAlert(`Navegando para ${name}...`, 'acao');
  };

  const handleSalvarReflexao = () => {
    if (!reflexaoTexto.trim()) {
      showAlert('Escreva algo antes de registrar.', 'acao');
      return;
    }
    const hoje = storage.getRegistroPorData(selectedDate) || { data: selectedDate };
    const reg = { ...hoje };
    reg.diario = (reg.diario ? reg.diario + '\n' : '') + `[Reflexão Ação]: ${reflexaoTexto.trim()}`;
    storage.actualizarRegistro(reg);
    setReflexaoTexto('');
    showAlert('Reflexão registrada!', 'acao');
  };

  const cx = 100, cy = 100;

  return (
    <div className="space-y-8 -mx-5 px-5 -mt-6 pt-5 pb-32 text-ink font-sans bg-app">
      {/* ── 1. Header editorial ── */}
      <div className="flex justify-between items-start pt-2">
        <div className="space-y-1 max-w-[78%]">
          <span className="text-caption font-semibold tracking-wider text-subtle uppercase font-mono">MÓDULO</span>
          <h1 className="text-[34px] font-bold text-ink tracking-tight leading-none">Ação</h1>
          <p className="text-body text-subtle mt-1.5 leading-relaxed">
            Foco, disciplina, fluxo, energia, prioridades e execução consistente de projetos.
          </p>
        </div>
        <button
          onClick={() => showAlert('Opções de visualização filtradas.', 'acao')}
          className="w-10 h-10 rounded-full bg-card border border-line flex items-center justify-center shadow-xs active-tap text-ink transition-colors cursor-pointer"
        >
          <SlidersHorizontal className="w-4 h-4 stroke-[1.5]" />
        </button>
      </div>
      <div>
        <span className="inline-flex items-center px-3.5 py-1 rounded-full text-caption font-semibold bg-muted text-subtle border border-line/50">
          Últimos 30 dias
        </span>
      </div>

      {/* ── 2. Execution Overview Card ── */}
      <div className="rounded-sheet border border-action-line p-5 space-y-6 relative overflow-hidden shadow-card bg-action-soft">
        <div className="flex justify-between items-start">
          <div className="space-y-1 max-w-[80%]">
            <h3 className="text-sm font-bold text-ink flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-action" />
              Panorama da sua execução
            </h3>
            <p className="text-caption text-subtle leading-relaxed">
              Seu período recente mostra aumento da consistência, maior tempo em estado de fluxo e avanço significativo nas prioridades definidas.
            </p>
          </div>
          <span className="text-micro uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-action/10 text-action">
            execução em ritmo
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 border-t border-action-line/40 pt-4">
          <div className="space-y-1">
            <span className="text-caption text-subtle font-medium">Foco</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-ink">7.8</span>
              <span className="text-micro text-faint">/10</span>
            </div>
            <span className="text-micro text-faint block">horas de foco/dia</span>
          </div>
          <div className="space-y-1">
            <span className="text-caption text-subtle font-medium">Consistência</span>
            <div className="text-xl font-bold text-ink">Alta</div>
            <span className="text-micro text-faint block">sequência de hábitos</span>
          </div>
          <div className="space-y-1 border-t border-action-line/20 pt-3">
            <span className="text-caption text-subtle font-medium">Conquistas</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-ink">+8</span>
            </div>
            <span className="text-micro text-faint block">metas avançadas</span>
          </div>
          <div className="space-y-1 border-t border-action-line/20 pt-3">
            <span className="text-caption text-subtle font-medium">Energia</span>
            <div className="text-xl font-bold text-ink">Boa</div>
            <span className="text-micro text-faint block">disponibilidade diária</span>
          </div>
        </div>

        <div className="border-t border-action-line/40 pt-4 flex flex-col items-center">
          <span className="text-caption text-faint uppercase tracking-wider font-semibold mb-3">Mapa da Execução</span>
          <svg viewBox="0 0 200 200" className="w-48 h-48 mx-auto">
            {[0.35, 0.55, 0.75].map((scale, i) => (
              <circle key={i} cx={cx} cy={cy} r={84 * scale} fill="none" stroke="var(--color-action-line)" strokeWidth="0.8" strokeDasharray="3 4" opacity={0.6} />
            ))}
            {EXECUTION_NODES.map((node, i) => {
              const p = polarToCartesian(cx, cy, node.distance, node.angle);
              return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke={node.color} strokeWidth="0.8" opacity={0.25} />;
            })}
            {EXECUTION_NODES.map((node, i) => {
              const p = polarToCartesian(cx, cy, node.distance, node.angle);
              return (
                <g key={i}>
                  <circle cx={p.x} cy={p.y} r={11} fill={node.color} fillOpacity={0.12} stroke={node.color} strokeWidth="1.5" />
                  <text x={p.x} y={p.y + 3} textAnchor="middle" className="text-[6px] font-bold fill-ink" fill="var(--color-ink)">
                    {node.label.length > 7 ? node.label.slice(0, 7) + '…' : node.label}
                  </text>
                </g>
              );
            })}
            <circle cx={cx} cy={cy} r={18} fill="var(--color-action)" fillOpacity={0.15} stroke="var(--color-action)" strokeWidth="2" />
            <text x={cx} y={cy + 3} textAnchor="middle" className="text-[9px] font-bold fill-ink" fill="var(--color-ink)">Ação</text>
          </svg>
        </div>

        <div className="border-t border-action-line/40 pt-3 text-caption text-subtle leading-relaxed italic text-center">
          “A consistência dos hábitos diários continua sendo o principal motor do seu progresso.”
        </div>
      </div>

      {/* ── 3. Quick Capture ── */}
      <div className="space-y-3">
        <div>
          <h2 className="text-lg font-bold text-ink">Registrar algo da sua execução</h2>
          <p className="text-caption text-subtle">Capture tarefas, estados de fluxo, energia, hábitos e conquistas importantes.</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {QUICK_ITEMS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={() => handleQuickRegister(item.title)}
                className="bg-card border border-line rounded-xl p-3 text-left relative h-24 flex flex-col justify-between hover:border-action/50 active-tap transition-all cursor-pointer"
              >
                <span className="absolute top-3 right-3 text-xs font-bold text-faint">+</span>
                <div className="w-7 h-7 rounded-full bg-action-soft text-action flex items-center justify-center">
                  <Icon className="w-4 h-4 stroke-[2]" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-caption font-bold text-ink leading-tight">{item.title}</h4>
                  <p className="text-micro text-faint truncate">{item.sub}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 4. Featured Insight ── */}
      <div className="rounded-sheet border border-action-line bg-action-soft p-5 space-y-3.5">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-action" />
          <span className="text-micro uppercase font-bold tracking-wider text-action font-mono">INSIGHT</span>
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-ink">A consistência está gerando mais resultados que a intensidade</h4>
          <p className="text-caption text-subtle leading-relaxed">
            Os dias com pequenas ações consistentes geraram mais progresso acumulado do que os dias de esforço isolado intenso.
          </p>
        </div>
        <button
          onClick={() => showAlert('Explorando padrões de consistência...', 'acao')}
          className="inline-flex items-center px-4 py-1.5 bg-card hover:bg-action/5 text-action hover:text-action text-caption font-bold rounded-full border border-line active-tap transition-colors cursor-pointer"
        >
          Explorar padrões
        </button>
      </div>

      {/* ── 5. Execution Map Section ── */}
      <div className="space-y-5">
        <div>
          <h2 className="text-lg font-bold text-ink">Mapa da Execução</h2>
          <p className="text-caption text-subtle">Cada área abaixo representa um pilar essencial da sua capacidade de execução.</p>
        </div>

        {/* 5.1 Foco */}
        <div className="bg-card border border-line rounded-sheet p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-action-soft border border-action-line flex items-center justify-center">
              <Target className="w-4 h-4 text-action" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">Foco</h3>
              <p className="text-caption text-subtle">Capacidade de concentração, tempo de atenção sustentada e qualidade do mergulho cognitivo</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1 bg-muted/60 border border-line/60 rounded-xl p-3">
              <span className="text-micro text-faint uppercase font-mono font-bold">Média</span>
              <div className="text-base font-bold text-ink mt-0.5">7.8/10</div>
            </div>
            <div className="flex-1 bg-muted/60 border border-line/60 rounded-xl p-3">
              <span className="text-micro text-faint uppercase font-mono font-bold">Sessões</span>
              <div className="text-base font-bold text-ink mt-0.5">3-4/dia</div>
            </div>
            <div className="flex-1 bg-muted/60 border border-line/60 rounded-xl p-3">
              <span className="text-micro text-faint uppercase font-mono font-bold">Tendência</span>
              <div className="text-base font-bold text-ink mt-0.5">Estável</div>
            </div>
          </div>
          <div className="flex justify-center py-1">
            <svg viewBox="0 0 160 40" className="w-full h-10">
              <line x1="10" y1="20" x2="150" y2="20" stroke="var(--color-action-line)" strokeWidth="1.5" strokeDasharray="4 4" />
              {[20, 45, 70, 95, 120, 140].map((x, i) => (
                <g key={i}>
                  <circle cx={x} cy={20} r={i === 1 || i === 4 ? 7 : 5} fill={i === 1 || i === 4 ? 'var(--color-action)' : 'var(--color-action-line)'} fillOpacity={i === 1 || i === 4 ? 0.3 : 0.5} stroke="var(--color-action)" strokeWidth="1" />
                  <circle cx={x} cy={20} r={2} fill="var(--color-action)" />
                </g>
              ))}
              <text x="80" y="36" textAnchor="middle" className="text-[6px] text-subtle" fill="var(--color-subtle)">sessões mais longas</text>
            </svg>
          </div>
          <p className="text-caption text-subtle leading-relaxed italic border-t border-line/40 pt-3">
            “Seu foco é maior nas primeiras horas do dia e após uma boa noite de sono.”
          </p>
          <button onClick={() => handleSubmodule('Foco')} className="text-caption font-bold text-action hover:underline flex items-center gap-1">
            Ver foco <span className="text-base">→</span>
          </button>
        </div>

        {/* 5.2 Disciplina */}
        <div className="bg-card border border-line rounded-sheet p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-action-soft border border-action-line flex items-center justify-center">
              <CheckSquare className="w-4 h-4 text-action" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">Disciplina</h3>
              <p className="text-caption text-subtle">Compromisso com rotinas, cumprimento de compromissos e autorregulação</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1 bg-muted/60 border border-line/60 rounded-xl p-3">
              <span className="text-micro text-faint uppercase font-mono font-bold">Adesão</span>
              <div className="text-base font-bold text-ink mt-0.5">84%</div>
            </div>
            <div className="flex-1 bg-muted/60 border border-line/60 rounded-xl p-3">
              <span className="text-micro text-faint uppercase font-mono font-bold">Sequência</span>
              <div className="text-base font-bold text-ink mt-0.5">12 dias</div>
            </div>
          </div>
          <div className="flex justify-center py-1">
            <svg viewBox="0 0 160 50" className="w-full h-12">
              {[15, 35, 55, 75, 95, 115, 135].map((x, i) => (
                <rect key={i} x={x - 5} y={10 + (i % 3) * 10} width="8" height="30 - (i % 3) * 10" rx="2" fill="var(--color-action)" fillOpacity={0.15 + (1 - i / 7) * 0.3} stroke="var(--color-action)" strokeWidth="1" />
              ))}
            </svg>
          </div>
          <p className="text-caption text-subtle leading-relaxed italic border-t border-line/40 pt-3">
            “A disciplina está mais forte quando associada a rotinas matinais consistentes.”
          </p>
          <button onClick={() => handleSubmodule('Disciplina')} className="text-caption font-bold text-action hover:underline flex items-center gap-1">
            Ver disciplina <span className="text-base">→</span>
          </button>
        </div>

        {/* 5.3 Fluxo */}
        <div className="bg-card border border-line rounded-sheet p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-action-soft border border-action-line flex items-center justify-center">
              <Zap className="w-4 h-4 text-action" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">Fluxo</h3>
              <p className="text-caption text-subtle">Estado de imersão total, perda da noção do tempo e alta performance fluida</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1 bg-muted/60 border border-line/60 rounded-xl p-3">
              <span className="text-micro text-faint uppercase font-mono font-bold">Frequência</span>
              <div className="text-base font-bold text-ink mt-0.5">3x/sem</div>
            </div>
            <div className="flex-1 bg-muted/60 border border-line/60 rounded-xl p-3">
              <span className="text-micro text-faint uppercase font-mono font-bold">Duração</span>
              <div className="text-base font-bold text-ink mt-0.5">~90min</div>
            </div>
          </div>
          <div className="flex justify-center py-1">
            <svg viewBox="0 0 160 50" className="w-full h-12">
              <motion.path
                d="M10 35 C30 15, 50 40, 70 25 C90 10, 110 35, 130 20 C140 12, 150 18, 155 22"
                fill="none" stroke="var(--color-action)" strokeWidth="3" strokeLinecap="round"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ repeat: Infinity, duration: 4 }}
              />
            </svg>
          </div>
          <p className="text-caption text-subtle leading-relaxed italic border-t border-line/40 pt-3">
            “O estado de fluxo aparece com mais frequência em tarefas criativas e desafiadoras.”
          </p>
          <button onClick={() => handleSubmodule('Fluxo')} className="text-caption font-bold text-action hover:underline flex items-center gap-1">
            Ver fluxo <span className="text-base">→</span>
          </button>
        </div>

        {/* Insight break 1 */}
        <div className="rounded-2xl p-4 flex gap-3.5 items-start border border-action-line bg-action-soft/60">
          <div className="w-7 h-7 rounded-full bg-action-soft flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-action" />
          </div>
          <p className="text-caption text-subtle leading-relaxed font-medium italic">
            “Foco, disciplina e fluxo formam o tripé da sua execução de alta performance.”
          </p>
        </div>

        {/* 5.4 Energia */}
        <div className="bg-card border border-line rounded-sheet p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-action-soft border border-action-line flex items-center justify-center">
              <Flame className="w-4 h-4 text-action" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">Energia</h3>
              <p className="text-caption text-subtle">Disponibilidade física e mental, níveis de energia ao longo do dia e gerenciamento de ritmo</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1 bg-muted/60 border border-line/60 rounded-xl p-3">
              <span className="text-micro text-faint uppercase font-mono font-bold">Manhã</span>
              <div className="text-base font-bold text-ink mt-0.5">Alta</div>
            </div>
            <div className="flex-1 bg-muted/60 border border-line/60 rounded-xl p-3">
              <span className="text-micro text-faint uppercase font-mono font-bold">Tarde</span>
              <div className="text-base font-bold text-ink mt-0.5">Moderada</div>
            </div>
            <div className="flex-1 bg-muted/60 border border-line/60 rounded-xl p-3">
              <span className="text-micro text-faint uppercase font-mono font-bold">Noite</span>
              <div className="text-base font-bold text-ink mt-0.5">Baixa</div>
            </div>
          </div>
          <div className="flex justify-center py-1">
            <svg viewBox="0 0 160 50" className="w-full h-12">
              <path d="M15 40 C40 15, 65 38, 80 35 C95 32, 110 42, 130 38 C140 36, 150 40, 155 42" fill="none" stroke="var(--color-action)" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="40" cy="18" r="3" fill="var(--color-action)" />
              <circle cx="80" cy="35" r="3" fill="var(--color-action)" />
              <circle cx="130" cy="38" r="3" fill="var(--color-action-line)" />
            </svg>
          </div>
          <p className="text-caption text-subtle leading-relaxed italic border-t border-line/40 pt-3">
            “Sua energia é significativamente maior pela manhã — esse é seu horário de ouro.”
          </p>
          <button onClick={() => handleSubmodule('Energia')} className="text-caption font-bold text-action hover:underline flex items-center gap-1">
            Ver energia <span className="text-base">→</span>
          </button>
        </div>

        {/* 5.5 Prioridades */}
        <div className="bg-card border border-line rounded-sheet p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-action-soft border border-action-line flex items-center justify-center">
              <ClipboardList className="w-4 h-4 text-action" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">Prioridades</h3>
              <p className="text-caption text-subtle">Clareza do que é importante, capacidade de escolha e alinhamento com objetivos maiores</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1 bg-muted/60 border border-line/60 rounded-xl p-3">
              <span className="text-micro text-faint uppercase font-mono font-bold">Clareza</span>
              <div className="text-base font-bold text-ink mt-0.5">Alta</div>
            </div>
            <div className="flex-1 bg-muted/60 border border-line/60 rounded-xl p-3">
              <span className="text-micro text-faint uppercase font-mono font-bold">Alinhamento</span>
              <div className="text-base font-bold text-ink mt-0.5">82%</div>
            </div>
          </div>
          <div className="flex justify-center py-1">
            <svg viewBox="0 0 160 50" className="w-full h-12">
              <rect x="20" y="8" width="120" height="8" rx="4" fill="var(--color-action-line)" fillOpacity={0.3} />
              <rect x="20" y="8" width="98" height="8" rx="4" fill="var(--color-action)" fillOpacity={0.6} />
              <rect x="20" y="22" width="120" height="8" rx="4" fill="var(--color-action-line)" fillOpacity={0.3} />
              <rect x="20" y="22" width="72" height="8" rx="4" fill="var(--color-action)" fillOpacity={0.4} />
              <rect x="20" y="36" width="120" height="8" rx="4" fill="var(--color-action-line)" fillOpacity={0.3} />
              <rect x="20" y="36" width="48" height="8" rx="4" fill="var(--color-action)" fillOpacity={0.25} />
            </svg>
          </div>
          <p className="text-caption text-subtle leading-relaxed italic border-t border-line/40 pt-3">
            “Quando as prioridades estão claras, a execução flui com menos atrito.”
          </p>
          <button onClick={() => handleSubmodule('Prioridades')} className="text-caption font-bold text-action hover:underline flex items-center gap-1">
            Ver prioridades <span className="text-base">→</span>
          </button>
        </div>

        {/* 5.6 Consistência */}
        <div className="bg-card border border-line rounded-sheet p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-action-soft border border-action-line flex items-center justify-center">
              <Repeat className="w-4 h-4 text-action" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">Consistência</h3>
              <p className="text-caption text-subtle">Regularidade das ações, manutenção de hábitos e resiliência ao longo do tempo</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1 bg-muted/60 border border-line/60 rounded-xl p-3">
              <span className="text-micro text-faint uppercase font-mono font-bold">Sequência</span>
              <div className="text-base font-bold text-ink mt-0.5">12 dias</div>
            </div>
            <div className="flex-1 bg-muted/60 border border-line/60 rounded-xl p-3">
              <span className="text-micro text-faint uppercase font-mono font-bold">Quedas</span>
              <div className="text-base font-bold text-ink mt-0.5">2/mês</div>
            </div>
          </div>
          <div className="flex justify-center py-1">
            <svg viewBox="0 0 160 50" className="w-full h-12">
              {[8, 28, 48, 68, 88, 108, 128, 148].map((x, i) => (
                <circle key={i} cx={x} cy={i % 3 === 0 ? 30 : 20} r="4" fill={i <= 5 ? 'var(--color-action)' : 'var(--color-action-line)'} fillOpacity={i <= 5 ? 0.7 : 0.3} stroke="var(--color-action)" strokeWidth="1" />
              ))}
              <line x1="12" y1="30" x2="28" y2="20" stroke="var(--color-action-line)" strokeWidth="1" />
              <line x1="28" y1="20" x2="48" y2="30" stroke="var(--color-action-line)" strokeWidth="1" />
              <line x1="48" y1="30" x2="68" y2="20" stroke="var(--color-action-line)" strokeWidth="1" />
              <line x1="68" y1="20" x2="88" y2="20" stroke="var(--color-action-line)" strokeWidth="1" />
              <line x1="88" y1="20" x2="108" y2="30" stroke="var(--color-action-line)" strokeWidth="1" />
            </svg>
          </div>
          <p className="text-caption text-subtle leading-relaxed italic border-t border-line/40 pt-3">
            “Manter a consistência por mais de 10 dias seguidos gera um efeito de aceleração.”
          </p>
          <button onClick={() => handleSubmodule('Consistência')} className="text-caption font-bold text-action hover:underline flex items-center gap-1">
            Ver consistência <span className="text-base">→</span>
          </button>
        </div>

        {/* Insight break 2 */}
        <div className="rounded-2xl p-4 flex gap-3.5 items-start border border-action-line bg-action-soft/60">
          <div className="w-7 h-7 rounded-full bg-action-soft flex items-center justify-center shrink-0">
            <Lightbulb className="w-4 h-4 text-action" />
          </div>
          <p className="text-caption text-subtle leading-relaxed font-medium italic">
            “Prioridades claras + energia alta = execução de elite. O segredo está em combinar os pilares certos.”
          </p>
        </div>

        {/* 5.7 Adaptabilidade */}
        <div className="bg-card border border-line rounded-sheet p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-action-soft border border-action-line flex items-center justify-center">
              <GitBranch className="w-4 h-4 text-action" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">Adaptabilidade</h3>
              <p className="text-caption text-subtle">Flexibilidade para ajustar rotas, lidar com imprevistos e aprender com desvios</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1 bg-muted/60 border border-line/60 rounded-xl p-3">
              <span className="text-micro text-faint uppercase font-mono font-bold">Resiliência</span>
              <div className="text-base font-bold text-ink mt-0.5">Alta</div>
            </div>
            <div className="flex-1 bg-muted/60 border border-line/60 rounded-xl p-3">
              <span className="text-micro text-faint uppercase font-mono font-bold">Recuperação</span>
              <div className="text-base font-bold text-ink mt-0.5">Rápida</div>
            </div>
          </div>
          <div className="flex justify-center py-1">
            <svg viewBox="0 0 160 50" className="w-full h-12">
              <path d="M10 40 L40 40 L40 20 L70 20 L70 35 L100 35 L100 15 L130 15" fill="none" stroke="var(--color-action)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="130" cy="15" r="4" fill="var(--color-action)" />
            </svg>
          </div>
          <p className="text-caption text-subtle leading-relaxed italic border-t border-line/40 pt-3">
            “Sua capacidade de ajustar plano rapidamente minimizou o impacto de imprevistos recentes.”
          </p>
          <button onClick={() => handleSubmodule('Adaptabilidade')} className="text-caption font-bold text-action hover:underline flex items-center gap-1">
            Ver adaptabilidade <span className="text-base">→</span>
          </button>
        </div>

        {/* 5.8 Conquistas */}
        <div className="bg-card border border-line rounded-sheet p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-action-soft border border-action-line flex items-center justify-center">
              <Award className="w-4 h-4 text-action" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">Conquistas</h3>
              <p className="text-caption text-subtle">Metas alcançadas, marcos importantes e progresso tangível em direção aos objetivos</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1 bg-muted/60 border border-line/60 rounded-xl p-3">
              <span className="text-micro text-faint uppercase font-mono font-bold">Realizadas</span>
              <div className="text-base font-bold text-ink mt-0.5">8</div>
            </div>
            <div className="flex-1 bg-muted/60 border border-line/60 rounded-xl p-3">
              <span className="text-micro text-faint uppercase font-mono font-bold">Em andamento</span>
              <div className="text-base font-bold text-ink mt-0.5">3</div>
            </div>
          </div>
          <div className="flex justify-center py-1">
            <svg viewBox="0 0 160 60" className="w-full h-14">
              <polygon points="80,5 86,20 102,22 90,33 93,50 80,42 67,50 70,33 58,22 74,20" fill="var(--color-action)" fillOpacity={0.15} stroke="var(--color-action)" strokeWidth="1.5" />
              {[30, 60, 100, 130].map((x, i) => (
                <polygon key={i} points={`${x},${15 + i * 8} ${x + 4},${20 + i * 8} ${x + 10},${21 + i * 8} ${x + 6},${27 + i * 8} ${x + 7},${34 + i * 8} ${x},${29 + i * 8} ${x - 7},${34 + i * 8} ${x - 6},${27 + i * 8} ${x - 10},${21 + i * 8} ${x - 4},${20 + i * 8}`} fill="var(--color-action)" fillOpacity={0.5 - i * 0.1} />
              ))}
            </svg>
          </div>
          <p className="text-caption text-subtle leading-relaxed italic border-t border-line/40 pt-3">
            “Cada conquista recente foi precedida por um período de consistência acima da média.”
          </p>
          <button onClick={() => handleSubmodule('Conquistas')} className="text-caption font-bold text-action hover:underline flex items-center gap-1">
            Ver conquistas <span className="text-base">→</span>
          </button>
        </div>
      </div>

      {/* ── 6. Connections Section ── */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-ink">Conexões da sua execução</h2>
          <p className="text-caption text-subtle">Alguns pilares da execução parecem evoluir juntos.</p>
        </div>
        <div className="space-y-3">
          {CONNECTIONS.map((conn, i) => (
            <div key={i} className="bg-card border border-line rounded-2xl p-4 flex items-center gap-3.5">
              <div className="w-8 h-8 rounded-full bg-action-soft flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-action" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <h4 className="text-caption font-bold text-ink">{conn.title}</h4>
                <p className="text-micro text-subtle leading-relaxed">{conn.insight}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 7. Recent Timeline ── */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-ink">Linha do tempo recente</h2>
          <p className="text-caption text-subtle">Eventos que marcaram sua trajetória de execução nas últimas semanas.</p>
        </div>
        <div className="relative pl-6 space-y-4 border-l border-line">
          {TIMELINE_EVENTS.map((event, i) => (
            <div key={i} className="relative">
              <div className="absolute -left-[30px] top-1.5 w-4 h-4 rounded-full border-4 border-app" style={{ backgroundColor: event.color }} />
              <div className="bg-card border border-line rounded-2xl p-3.5 space-y-1">
                <div className="flex justify-between items-start">
                  <span className="text-micro text-faint uppercase tracking-wider font-semibold">{event.category}</span>
                  <span className="text-micro text-subtle font-medium font-mono capitalize">{event.impact}</span>
                </div>
                <h4 className="text-caption font-bold text-ink">{event.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 8. Reflection Card ── */}
      <div className="rounded-[28px] p-6 space-y-5 shadow-md relative overflow-hidden bg-ink-deep">
        <div className="space-y-1 relative z-10">
          <span className="text-micro uppercase font-bold tracking-wider text-faint font-mono">REFLEXÃO</span>
          <h3 className="text-base font-bold text-white leading-snug">Pergunta para refletir</h3>
          <p className="text-body text-white/80 leading-relaxed font-serif italic pt-1">
            “O que está funcionando melhor na sua rotina de execução atual?”
          </p>
        </div>
        <div className="space-y-3 relative z-10">
          <textarea
            value={reflexaoTexto}
            onChange={(e) => setReflexaoTexto(e.target.value)}
            placeholder="Escreva uma percepção rápida..."
            rows={3}
            className="w-full text-caption bg-white/10 text-white border border-white/20 rounded-xl p-3 placeholder-white/50 focus:outline-hidden focus:border-white/50 focus:ring-1 focus:ring-white/25 resize-none leading-relaxed"
          />
          <button
            onClick={handleSalvarReflexao}
            className="w-full bg-white/10 hover:bg-white/20 text-white text-caption font-bold py-3 px-4 rounded-xl border border-white/20 transition-colors active-tap cursor-pointer"
          >
            Registrar reflexão
          </button>
        </div>
      </div>
    </div>
  );
}
