import React, { useState } from 'react';
import {
  Moon,
  Apple,
  Droplets,
  Dumbbell,
  Heart,
  Activity,
  Stethoscope,
  Pill,
  Sparkles,
  SlidersHorizontal,
  Lightbulb,
  type LucideIcon,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { storage } from '../../../lib/storage';
import { useNexusAlert } from '../../../app/providers/NexusAlertProvider';
import { useRouter } from '../../../app/router/RouterProvider';
import { submodulePath } from '../../../app/router/routes';

interface HealthModulePageProps {
  selectedDate: string;
  refreshCount: number;
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

const HEALTH_NODES = [
  { label: 'Sono', angle: 0, distance: 48, color: '#6D5DD3' },
  { label: 'Nutrição', angle: 45, distance: 62, color: '#2DA44E' },
  { label: 'Hidratação', angle: 90, distance: 55, color: '#2396F3' },
  { label: 'Movimento', angle: 135, distance: 52, color: '#2DA44E' },
  { label: 'Recuperação', angle: 180, distance: 58, color: '#6D5DD3' },
  { label: 'Biometria', angle: 225, distance: 66, color: '#2396F3' },
  { label: 'Clínica', angle: 270, distance: 70, color: '#2DA44E' },
  { label: 'Substâncias', angle: 315, distance: 64, color: '#6D5DD3' },
];

interface QuickItem { icon: LucideIcon; title: string; sub: string }

const QUICK_ITEMS: QuickItem[] = [
  { icon: Moon, title: 'Sono', sub: 'Registrar noite de sono' },
  { icon: Apple, title: 'Nutrição', sub: 'Registrar alimentação' },
  { icon: Droplets, title: 'Hidratação', sub: 'Registrar consumo de água' },
  { icon: Dumbbell, title: 'Movimento', sub: 'Registrar atividade física' },
  { icon: Heart, title: 'Recuperação', sub: 'Registrar recuperação física' },
  { icon: Activity, title: 'Biometria', sub: 'Registrar medida corporal' },
  { icon: Stethoscope, title: 'Saúde Clínica', sub: 'Registrar sintoma ou exame' },
  { icon: Pill, title: 'Substâncias', sub: 'Registrar consumo' },
];

const CONNECTIONS = [
  { title: 'Sono ↔ Energia', insight: 'Melhores noites costumam ser seguidas por níveis mais altos de energia.' },
  { title: 'Nutrição ↔ Recuperação', insight: 'Alimentação equilibrada aparece associada a melhor recuperação física.' },
  { title: 'Hidratação ↔ Fadiga', insight: 'Maior hidratação tende a coincidir com menor sensação de cansaço.' },
  { title: 'Movimento ↔ Humor', insight: 'Dias mais ativos costumam apresentar melhor estado emocional.' },
  { title: 'Substâncias ↔ Sono', insight: 'Alguns padrões de consumo parecem influenciar diretamente a qualidade do descanso.' },
];

const TIMELINE_EVENTS = [
  { title: 'Semana com sono consistente', category: 'Sono', impact: 'positivo', color: '#6D5DD3' },
  { title: 'Melhora da alimentação', category: 'Nutrição', impact: 'positivo', color: '#2DA44E' },
  { title: 'Retorno aos treinos', category: 'Movimento', impact: 'crescimento', color: '#2DA44E' },
  { title: 'Período de recuperação elevada', category: 'Recuperação', impact: 'melhora', color: '#6D5DD3' },
  { title: 'Novo exame realizado', category: 'Saúde Clínica', impact: 'acompanhamento', color: '#2396F3' },
];

const HEALTH_SUB_MAP: Record<string, 'sono' | 'nutricao' | 'hidratacao' | 'movimento' | 'recuperacao' | 'biometria' | 'saude-clinica' | 'substancias'> = {
  Sono: 'sono', Nutrição: 'nutricao', Hidratação: 'hidratacao', Movimento: 'movimento',
  Recuperação: 'recuperacao', Biometria: 'biometria', 'Saúde Clínica': 'saude-clinica', Substâncias: 'substancias',
};

export default function HealthModulePage({ selectedDate, refreshCount }: HealthModulePageProps) {
  const { showAlert } = useNexusAlert();
  const { navigate } = useRouter();
  const [reflexaoTexto, setReflexaoTexto] = useState('');

  const handleQuickRegister = (item: string) => {
    showAlert(`Abrindo fluxo de registro para ${item}...`, 'saude');
  };

  const handleSubmodule = (name: string) => {
    const slug = HEALTH_SUB_MAP[name];
    if (slug) navigate(submodulePath('saude', slug));
  };

  const handleSalvarReflexao = () => {
    if (!reflexaoTexto.trim()) {
      showAlert('Escreva algo antes de registrar.', 'saude');
      return;
    }
    const hoje = storage.getRegistroPorData(selectedDate) || { data: selectedDate };
    const reg = { ...hoje };
    reg.diario = (reg.diario ? reg.diario + '\n' : '') + `[Reflexão Saúde]: ${reflexaoTexto.trim()}`;
    storage.actualizarRegistro(reg);
    setReflexaoTexto('');
    showAlert('Reflexão registrada!', 'saude');
  };

  const cx = 100, cy = 100;

  return (
    <div className="space-y-8 -mx-5 px-5 -mt-6 pt-5 pb-32 text-ink font-sans bg-app">
      {/* ── 1. Header editorial ── */}
      <div className="flex justify-between items-start pt-2">
        <div className="space-y-1 max-w-[78%]">
          <span className="text-caption font-semibold tracking-wider text-subtle uppercase font-mono">MÓDULO</span>
          <h1 className="text-[34px] font-bold text-ink tracking-tight leading-none">Saúde</h1>
          <p className="text-body text-subtle mt-1.5 leading-relaxed">
            Sono, alimentação, hidratação, movimento, recuperação e equilíbrio fisiológico.
          </p>
        </div>
        <button
          onClick={() => showAlert('Opções de visualização filtradas.', 'saude')}
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

      {/* ── 2. Health Overview Card ── */}
      <div className="rounded-sheet border border-health-line p-5 space-y-6 relative overflow-hidden shadow-card bg-health-soft">
        <div className="flex justify-between items-start">
          <div className="space-y-1 max-w-[80%]">
            <h3 className="text-sm font-bold text-ink flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-health" />
              Panorama da sua saúde
            </h3>
            <p className="text-caption text-subtle leading-relaxed">
              Seu estado recente indica melhora da recuperação, maior consistência dos hábitos e evolução gradual dos indicadores físicos.
            </p>
          </div>
          <span className="text-micro uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-health/10 text-health">
            equilíbrio em evolução
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 border-t border-health-line/40 pt-4">
          <div className="space-y-1">
            <span className="text-caption text-subtle font-medium">Sono</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-ink">8.4</span>
              <span className="text-micro text-faint">/10</span>
            </div>
            <span className="text-micro text-faint block">qualidade média</span>
          </div>
          <div className="space-y-1">
            <span className="text-caption text-subtle font-medium">Movimento</span>
            <div className="text-xl font-bold text-ink">Alta</div>
            <span className="text-micro text-faint block">atividade física</span>
          </div>
          <div className="space-y-1 border-t border-health-line/20 pt-3">
            <span className="text-caption text-subtle font-medium">Recuperação</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-health">+12%</span>
            </div>
            <span className="text-micro text-faint block">evolução recente</span>
          </div>
          <div className="space-y-1 border-t border-health-line/20 pt-3">
            <span className="text-caption text-subtle font-medium">Saúde Geral</span>
            <div className="text-xl font-bold text-ink">Boa</div>
            <span className="text-micro text-faint block">estado atual</span>
          </div>
        </div>

        <div className="border-t border-health-line/40 pt-4 flex flex-col items-center">
          <span className="text-caption text-faint uppercase tracking-wider font-semibold mb-3">Mapa da Saúde</span>
          <svg viewBox="0 0 200 200" className="w-48 h-48 mx-auto">
            {[0.35, 0.55, 0.75].map((scale, i) => (
              <circle key={i} cx={cx} cy={cy} r={84 * scale} fill="none" stroke="var(--color-health-line)" strokeWidth="0.8" strokeDasharray="3 4" opacity={0.6} />
            ))}
            {HEALTH_NODES.map((node, i) => {
              const p = polarToCartesian(cx, cy, node.distance, node.angle);
              return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke={node.color} strokeWidth="0.8" opacity={0.25} />;
            })}
            {HEALTH_NODES.map((node, i) => {
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
            <circle cx={cx} cy={cy} r={18} fill="var(--color-health)" fillOpacity={0.15} stroke="var(--color-health)" strokeWidth="2" />
            <text x={cx} y={cy + 3} textAnchor="middle" className="text-[9px] font-bold fill-ink" fill="var(--color-ink)">Saúde</text>
          </svg>
        </div>

        <div className="border-t border-health-line/40 pt-3 text-caption text-subtle leading-relaxed italic text-center">
          “A qualidade do sono continua sendo o principal fator associado à melhora dos demais indicadores de saúde.”
        </div>
      </div>

      {/* ── 3. Quick Capture ── */}
      <div className="space-y-3">
        <div>
          <h2 className="text-lg font-bold text-ink">Registrar algo sobre sua saúde</h2>
          <p className="text-caption text-subtle">Capture hábitos, medições, sintomas, atividades e observações importantes.</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {QUICK_ITEMS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={() => handleQuickRegister(item.title)}
                className="bg-card border border-line rounded-xl p-3 text-left relative h-24 flex flex-col justify-between hover:border-health/50 active-tap transition-all cursor-pointer"
              >
                <span className="absolute top-3 right-3 text-xs font-bold text-faint">+</span>
                <div className="w-7 h-7 rounded-full bg-health-soft text-health flex items-center justify-center">
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
      <div className="rounded-sheet border border-health-line bg-health-soft p-5 space-y-3.5">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-health" />
          <span className="text-micro uppercase font-bold tracking-wider text-health font-mono">INSIGHT</span>
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-ink">Seu sono continua influenciando praticamente toda a sua saúde</h4>
          <p className="text-caption text-subtle leading-relaxed">
            Os dias com melhor recuperação do sono apresentaram maior energia, melhor humor, menor fadiga e maior consistência dos hábitos.
          </p>
        </div>
        <button
          onClick={() => showAlert('Explorando relações do sono...', 'saude')}
          className="inline-flex items-center px-4 py-1.5 bg-card hover:bg-health/5 text-health hover:text-health text-caption font-bold rounded-full border border-line active-tap transition-colors cursor-pointer"
        >
          Explorar relações
        </button>
      </div>

      {/* ── 5. Health Map Section ── */}
      <div className="space-y-5">
        <div>
          <h2 className="text-lg font-bold text-ink">Mapa da Saúde</h2>
          <p className="text-caption text-subtle">Cada área abaixo representa um sistema importante para sua saúde física.</p>
        </div>

        {/* 5.1 Sono */}
        <div className="bg-card border border-line rounded-sheet p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-health-soft border border-health-line flex items-center justify-center">
              <Moon className="w-4 h-4 text-health" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">Sono</h3>
              <p className="text-caption text-subtle">Qualidade do descanso, duração, regularidade e recuperação noturna</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1 bg-muted/60 border border-line/60 rounded-xl p-3">
              <span className="text-micro text-faint uppercase font-mono font-bold">Qualidade</span>
              <div className="text-base font-bold text-ink mt-0.5">8.4/10</div>
            </div>
            <div className="flex-1 bg-muted/60 border border-line/60 rounded-xl p-3">
              <span className="text-micro text-faint uppercase font-mono font-bold">Horas</span>
              <div className="text-base font-bold text-ink mt-0.5">7.2h</div>
            </div>
            <div className="flex-1 bg-muted/60 border border-line/60 rounded-xl p-3">
              <span className="text-micro text-faint uppercase font-mono font-bold">Regularidade</span>
              <div className="text-base font-bold text-ink mt-0.5">Alta</div>
            </div>
          </div>
          <div className="flex justify-center py-1">
            <svg viewBox="0 0 160 40" className="w-full h-10">
              <line x1="10" y1="20" x2="150" y2="20" stroke="var(--color-health-line)" strokeWidth="1.5" strokeDasharray="4 4" />
              {[20, 45, 70, 95, 120, 140].map((x, i) => (
                <g key={i}>
                  <circle cx={x} cy={20} r={i === 2 || i === 3 ? 7 : 5} fill={i === 2 || i === 3 ? 'var(--color-health)' : 'var(--color-health-line)'} fillOpacity={i === 2 || i === 3 ? 0.3 : 0.5} stroke="var(--color-health)" strokeWidth="1" />
                  <circle cx={x} cy={20} r={2} fill="var(--color-health)" />
                </g>
              ))}
              <text x="80" y="36" textAnchor="middle" className="text-[6px] text-subtle" fill="var(--color-subtle)">noites mais restauradoras</text>
            </svg>
          </div>
          <p className="text-caption text-subtle leading-relaxed italic border-t border-line/40 pt-3">
            “Seu sono mais consistente coincidiu com melhores níveis de energia e humor.”
          </p>
          <button onClick={() => handleSubmodule('Sono')} className="text-caption font-bold text-health hover:underline flex items-center gap-1">
            Ver sono <span className="text-base">→</span>
          </button>
        </div>

        {/* 5.2 Nutrição */}
        <div className="bg-card border border-line rounded-sheet p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-health-soft border border-health-line flex items-center justify-center">
              <Apple className="w-4 h-4 text-health" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">Nutrição</h3>
              <p className="text-caption text-subtle">Qualidade alimentar, equilíbrio nutricional e consistência das refeições</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1 bg-muted/60 border border-line/60 rounded-xl p-3">
              <span className="text-micro text-faint uppercase font-mono font-bold">Qualidade</span>
              <div className="text-base font-bold text-ink mt-0.5">Boa</div>
            </div>
            <div className="flex-1 bg-muted/60 border border-line/60 rounded-xl p-3">
              <span className="text-micro text-faint uppercase font-mono font-bold">Refeições</span>
              <div className="text-base font-bold text-ink mt-0.5">Regulares</div>
            </div>
          </div>
          <div className="flex justify-center gap-3 py-1">
            {[
              { label: 'Prot', pct: 30, color: '#2DA44E' },
              { label: 'Carb', pct: 40, color: '#6D5DD3' },
              { label: 'Gord', pct: 25, color: '#2396F3' },
              { label: 'Fibr', pct: 5, color: '#E8927A' },
            ].map((a, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 rounded-full" style={{ backgroundColor: a.color, opacity: 0.2, border: `2px solid ${a.color}` }}>
                  <div className="w-full h-full rounded-full flex items-center justify-center text-[8px] font-bold" style={{ color: a.color }}>{a.pct}%</div>
                </div>
                <span className="text-micro text-faint">{a.label}</span>
              </div>
            ))}
          </div>
          <p className="text-caption text-subtle leading-relaxed italic border-t border-line/40 pt-3">
            “Sua alimentação foi mais equilibrada nos períodos com maior energia diária.”
          </p>
          <button onClick={() => handleSubmodule('Nutrição')} className="text-caption font-bold text-health hover:underline flex items-center gap-1">
            Ver nutrição <span className="text-base">→</span>
          </button>
        </div>

        {/* 5.3 Hidratação */}
        <div className="bg-card border border-line rounded-sheet p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-health-soft border border-health-line flex items-center justify-center">
              <Droplets className="w-4 h-4 text-health" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">Hidratação</h3>
              <p className="text-caption text-subtle">Consumo de líquidos e manutenção da hidratação corporal</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1 bg-muted/60 border border-line/60 rounded-xl p-3">
              <span className="text-micro text-faint uppercase font-mono font-bold">Média</span>
              <div className="text-base font-bold text-ink mt-0.5">2.1L/dia</div>
            </div>
            <div className="flex-1 bg-muted/60 border border-line/60 rounded-xl p-3">
              <span className="text-micro text-faint uppercase font-mono font-bold">Meta</span>
              <div className="text-base font-bold text-ink mt-0.5">84%</div>
            </div>
          </div>
          <div className="flex justify-center py-1">
            <svg viewBox="0 0 160 60" className="w-full h-14">
              <rect x="15" y="25" width="22" height="30" rx="4" fill="var(--color-health)" fillOpacity={0.08} stroke="var(--color-health)" strokeWidth="1.5" />
              <rect x="15" y="25" width="22" height="22" rx="4" fill="var(--color-health)" fillOpacity={0.35} />
              <rect x="48" y="15" width="22" height="40" rx="4" fill="var(--color-health)" fillOpacity={0.08} stroke="var(--color-health)" strokeWidth="1.5" />
              <rect x="48" y="15" width="22" height="38" rx="4" fill="var(--color-health)" fillOpacity={0.5} />
              <rect x="81" y="30" width="22" height="25" rx="4" fill="var(--color-health)" fillOpacity={0.08} stroke="var(--color-health)" strokeWidth="1.5" />
              <rect x="81" y="30" width="22" height="18" rx="4" fill="var(--color-health)" fillOpacity={0.25} />
              <rect x="114" y="20" width="22" height="35" rx="4" fill="var(--color-health)" fillOpacity={0.08} stroke="var(--color-health)" strokeWidth="1.5" />
              <rect x="114" y="20" width="22" height="32" rx="4" fill="var(--color-health)" fillOpacity={0.45} />
            </svg>
          </div>
          <p className="text-caption text-subtle leading-relaxed italic border-t border-line/40 pt-3">
            “Os dias mais hidratados apresentaram menor sensação de fadiga.”
          </p>
          <button onClick={() => handleSubmodule('Hidratação')} className="text-caption font-bold text-health hover:underline flex items-center gap-1">
            Ver hidratação <span className="text-base">→</span>
          </button>
        </div>

        {/* Insight break 1 */}
        <div className="rounded-2xl p-4 flex gap-3.5 items-start border border-health-line bg-health-soft/60">
          <div className="w-7 h-7 rounded-full bg-health-soft flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-health" />
          </div>
          <p className="text-caption text-subtle leading-relaxed font-medium italic">
            “Sono, alimentação e hidratação continuam formando a principal base da sua energia diária.”
          </p>
        </div>

        {/* 5.4 Movimento */}
        <div className="bg-card border border-line rounded-sheet p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-health-soft border border-health-line flex items-center justify-center">
              <Dumbbell className="w-4 h-4 text-health" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">Movimento e treino</h3>
              <p className="text-caption text-subtle">Atividade física, exercícios estruturados e movimentação cotidiana</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1 bg-muted/60 border border-line/60 rounded-xl p-3">
              <span className="text-micro text-faint uppercase font-mono font-bold">Frequência</span>
              <div className="text-base font-bold text-ink mt-0.5">4x/sem</div>
            </div>
            <div className="flex-1 bg-muted/60 border border-line/60 rounded-xl p-3">
              <span className="text-micro text-faint uppercase font-mono font-bold">Consistência</span>
              <div className="text-base font-bold text-ink mt-0.5">Alta</div>
            </div>
          </div>
          <div className="flex justify-center py-1">
            <svg viewBox="0 0 160 50" className="w-full h-12">
              <motion.path
                d="M10 35 C30 15, 50 40, 70 25 C90 10, 110 35, 130 20 C140 12, 150 18, 155 22"
                fill="none" stroke="var(--color-health)" strokeWidth="3" strokeLinecap="round"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ repeat: Infinity, duration: 4 }}
              />
            </svg>
          </div>
          <p className="text-caption text-subtle leading-relaxed italic border-t border-line/40 pt-3">
            “A prática regular de atividade física está associada a maior disposição e bem-estar.”
          </p>
          <button onClick={() => handleSubmodule('Movimento')} className="text-caption font-bold text-health hover:underline flex items-center gap-1">
            Ver movimento <span className="text-base">→</span>
          </button>
        </div>

        {/* 5.5 Recuperação */}
        <div className="bg-card border border-line rounded-sheet p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-health-soft border border-health-line flex items-center justify-center">
              <Heart className="w-4 h-4 text-health" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">Recuperação</h3>
              <p className="text-caption text-subtle">Capacidade do corpo de restaurar energia e se adaptar às demandas físicas</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1 bg-muted/60 border border-line/60 rounded-xl p-3">
              <span className="text-micro text-faint uppercase font-mono font-bold">Recuperação</span>
              <div className="text-base font-bold text-ink mt-0.5">Boa</div>
            </div>
            <div className="flex-1 bg-muted/60 border border-line/60 rounded-xl p-3">
              <span className="text-micro text-faint uppercase font-mono font-bold">Fadiga</span>
              <div className="text-base font-bold text-ink mt-0.5">Moderada</div>
            </div>
          </div>
          <div className="flex justify-center py-1">
            <svg viewBox="0 0 160 50" className="w-full h-12">
              <motion.path
                d="M10 25 C30 10, 50 40, 70 25 C90 10, 110 40, 130 25 C140 18, 150 20, 155 25"
                fill="none" stroke="var(--color-health)" strokeWidth="3" strokeLinecap="round"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 5 }}
              />
            </svg>
          </div>
          <p className="text-caption text-subtle leading-relaxed italic border-t border-line/40 pt-3">
            “Períodos de recuperação adequada precederam seus melhores desempenhos físicos.”
          </p>
          <button onClick={() => handleSubmodule('Recuperação')} className="text-caption font-bold text-health hover:underline flex items-center gap-1">
            Ver recuperação <span className="text-base">→</span>
          </button>
        </div>

        {/* 5.6 Biometria */}
        <div className="bg-card border border-line rounded-sheet p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-health-soft border border-health-line flex items-center justify-center">
              <Activity className="w-4 h-4 text-health" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">Corpo e biometria</h3>
              <p className="text-caption text-subtle">Peso, composição corporal, medidas físicas e evolução corporal</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1 bg-muted/60 border border-line/60 rounded-xl p-3">
              <span className="text-micro text-faint uppercase font-mono font-bold">Peso</span>
              <div className="text-base font-bold text-ink mt-0.5">Estável</div>
            </div>
            <div className="flex-1 bg-muted/60 border border-line/60 rounded-xl p-3">
              <span className="text-micro text-faint uppercase font-mono font-bold">Tendência</span>
              <div className="text-base font-bold text-ink mt-0.5">Gradual</div>
            </div>
          </div>
          <div className="flex justify-center py-1">
            <svg viewBox="0 0 160 50" className="w-full h-12">
              <path d="M15 38 L40 35 L65 28 L90 32 L115 26 L140 22" fill="none" stroke="var(--color-health)" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="15" cy="38" r="3" fill="var(--color-health)" />
              <circle cx="65" cy="28" r="3" fill="var(--color-health)" />
              <circle cx="115" cy="26" r="3" fill="var(--color-health)" />
            </svg>
          </div>
          <p className="text-caption text-subtle leading-relaxed italic border-t border-line/40 pt-3">
            “As mudanças corporais recentes ocorreram de forma gradual e consistente.”
          </p>
          <button onClick={() => handleSubmodule('Biometria')} className="text-caption font-bold text-health hover:underline flex items-center gap-1">
            Ver biometria <span className="text-base">→</span>
          </button>
        </div>

        {/* Insight break 2 */}
        <div className="rounded-2xl p-4 flex gap-3.5 items-start border border-health-line bg-health-soft/60">
          <div className="w-7 h-7 rounded-full bg-health-soft flex items-center justify-center shrink-0">
            <Lightbulb className="w-4 h-4 text-health" />
          </div>
          <p className="text-caption text-subtle leading-relaxed font-medium italic">
            “Os períodos de maior recuperação também coincidiram com melhor desempenho físico e evolução corporal.”
          </p>
        </div>

        {/* 5.7 Saúde Clínica */}
        <div className="bg-card border border-line rounded-sheet p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-health-soft border border-health-line flex items-center justify-center">
              <Stethoscope className="w-4 h-4 text-health" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">Saúde clínica</h3>
              <p className="text-caption text-subtle">Sintomas, exames, condições de saúde e acompanhamento clínico</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1 bg-muted/60 border border-line/60 rounded-xl p-3">
              <span className="text-micro text-faint uppercase font-mono font-bold">Exames</span>
              <div className="text-base font-bold text-ink mt-0.5">Em dia</div>
            </div>
            <div className="flex-1 bg-muted/60 border border-line/60 rounded-xl p-3">
              <span className="text-micro text-faint uppercase font-mono font-bold">Sintomas</span>
              <div className="text-base font-bold text-ink mt-0.5">Estáveis</div>
            </div>
          </div>
          <div className="flex justify-center gap-3 py-1">
            {['Pressão', 'Glicose', 'Colest.', 'Coração'].map((label, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className={`w-3 h-3 rounded-full ${i < 3 ? 'bg-health' : 'bg-health-soft border border-health-line'}`} />
                <span className="text-micro text-faint">{label}</span>
              </div>
            ))}
          </div>
          <p className="text-caption text-subtle leading-relaxed italic border-t border-line/40 pt-3">
            “Os registros clínicos mostram estabilidade geral dos indicadores monitorados.”
          </p>
          <button onClick={() => handleSubmodule('Saúde Clínica')} className="text-caption font-bold text-health hover:underline flex items-center gap-1">
            Ver saúde clínica <span className="text-base">→</span>
          </button>
        </div>

        {/* 5.8 Substâncias */}
        <div className="bg-card border border-line rounded-sheet p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-health-soft border border-health-line flex items-center justify-center">
              <Pill className="w-4 h-4 text-health" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">Substâncias</h3>
              <p className="text-caption text-subtle">Consumo de cafeína, álcool, medicamentos, suplementos e outras substâncias</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1 bg-muted/60 border border-line/60 rounded-xl p-3">
              <span className="text-micro text-faint uppercase font-mono font-bold">Cafeína</span>
              <div className="text-base font-bold text-ink mt-0.5">2x/dia</div>
            </div>
            <div className="flex-1 bg-muted/60 border border-line/60 rounded-xl p-3">
              <span className="text-micro text-faint uppercase font-mono font-bold">Álcool</span>
              <div className="text-base font-bold text-ink mt-0.5">Ocasional</div>
            </div>
          </div>
          <div className="flex justify-center py-1">
            <svg viewBox="0 0 160 50" className="w-full h-12">
              <circle cx="40" cy="25" r="8" fill="var(--color-health)" fillOpacity={0.12} stroke="var(--color-health)" strokeWidth="1.5" />
              <text x="40" y="28" textAnchor="middle" className="text-[5px] font-bold" fill="var(--color-health)">Café</text>
              <line x1="48" y1="25" x2="72" y2="25" stroke="var(--color-health-line)" strokeWidth="1.5" />
              <circle cx="80" cy="18" r="8" fill="var(--color-health)" fillOpacity={0.12} stroke="var(--color-health)" strokeWidth="1.5" />
              <text x="80" y="21" textAnchor="middle" className="text-[5px] font-bold" fill="var(--color-health)">Sono</text>
              <line x1="88" y1="18" x2="105" y2="30" stroke="var(--color-health-line)" strokeWidth="1.5" strokeDasharray="3 2" />
              <circle cx="112" cy="35" r="7" fill="var(--color-health-line)" fillOpacity={0.3} stroke="var(--color-health-line)" strokeWidth="1" />
              <text x="112" y="38" textAnchor="middle" className="text-[5px] font-bold" fill="var(--color-faint)">Energia</text>
            </svg>
          </div>
          <p className="text-caption text-subtle leading-relaxed italic border-t border-line/40 pt-3">
            “O consumo de cafeína próximo ao horário de dormir continua associado à redução da qualidade do sono.”
          </p>
          <button onClick={() => handleSubmodule('Substâncias')} className="text-caption font-bold text-health hover:underline flex items-center gap-1">
            Ver substâncias <span className="text-base">→</span>
          </button>
        </div>
      </div>

      {/* ── 6. Connections Section ── */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-ink">Conexões da sua saúde</h2>
          <p className="text-caption text-subtle">Alguns aspectos do seu corpo parecem evoluir juntos.</p>
        </div>
        <div className="space-y-3">
          {CONNECTIONS.map((conn, i) => (
            <div key={i} className="bg-card border border-line rounded-2xl p-4 flex items-center gap-3.5">
              <div className="w-8 h-8 rounded-full bg-health-soft flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-health" />
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
          <p className="text-caption text-subtle">Eventos que influenciaram sua saúde nas últimas semanas.</p>
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
            “Qual hábito teve o maior impacto positivo na sua saúde recentemente?”
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
