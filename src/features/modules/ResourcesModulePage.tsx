import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  CreditCard,
  Target,
  Shield,
  Sparkles,
  SlidersHorizontal,
  Lightbulb,
  Wallet,
  type LucideIcon,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { storage } from '../../lib/storage';
import { useNexusAlert } from '../../app/providers/NexusAlertProvider';
import { useRouter } from '../../app/router/RouterProvider';
import { submodulePath } from '../../app/router/routes';

interface ResourcesModulePageProps {
  selectedDate: string;
  refreshCount: number;
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

const RESOURCES_NODES = [
  { label: 'Renda', angle: 0, distance: 48, color: '#9A7D0A' },
  { label: 'Desp. Fixas', angle: 45, distance: 62, color: '#B8962E' },
  { label: 'Desp. Variáveis', angle: 90, distance: 55, color: '#C8A84E' },
  { label: 'Investimentos', angle: 135, distance: 52, color: '#9A7D0A' },
  { label: 'Dívidas', angle: 180, distance: 58, color: '#B8962E' },
  { label: 'Objetivos', angle: 225, distance: 66, color: '#C8A84E' },
  { label: 'Segurança', angle: 270, distance: 70, color: '#B8962E' },
  { label: 'Abundância', angle: 315, distance: 64, color: '#9A7D0A' },
];

interface QuickItem { icon: LucideIcon; title: string; sub: string }

const QUICK_ITEMS: QuickItem[] = [
  { icon: TrendingUp, title: 'Renda', sub: 'Registrar receita recebida' },
  { icon: TrendingDown, title: 'Despesa', sub: 'Registrar gasto realizado' },
  { icon: BarChart3, title: 'Investimento', sub: 'Registrar movimentação' },
  { icon: CreditCard, title: 'Fatura', sub: 'Registrar fatura paga' },
  { icon: Target, title: 'Objetivo', sub: 'Registrar meta financeira' },
  { icon: Shield, title: 'Segurança', sub: 'Registrar reserva' },
  { icon: DollarSign, title: 'Orçamento', sub: 'Registrar ajuste' },
  { icon: Wallet, title: 'Abundância', sub: 'Registrar conquista' },
];

const CONNECTIONS = [
  { title: 'Renda ↔ Investimentos', insight: 'Aumentos de renda têm sido direcionados para ampliar a carteira de investimentos.' },
  { title: 'Despesas ↔ Orçamento', insight: 'Despesas variáveis sobem quando não há um orçamento semanal definido.' },
  { title: 'Dívidas ↔ Segurança', insight: 'A redução de dívidas está diretamente ligada ao aumento da reserva de segurança.' },
  { title: 'Objetivos ↔ Poupança', insight: 'Metas financeiras claras estão associadas a maiores taxas de poupança.' },
  { title: 'Abundância ↔ Bem-estar', insight: 'Períodos com mais abundância financeira coincidem com maior bem-estar geral.' },
];

const TIMELINE_EVENTS = [
  { title: 'Nova fonte de receita iniciada', category: 'Renda', impact: 'crescimento', color: '#9A7D0A' },
  { title: 'Redução significativa de despesas fixas', category: 'Desp. Fixas', impact: 'economia', color: '#B8962E' },
  { title: 'Primeiro aporte em novo investimento', category: 'Investimentos', impact: 'diversificação', color: '#C8A84E' },
  { title: 'Quitação de dívida importante', category: 'Dívidas', impact: 'alívio', color: '#B8962E' },
  { title: 'Meta financeira de curto prazo alcançada', category: 'Objetivos', impact: 'realização', color: '#9A7D0A' },
];

const RESOURCES_SUB_MAP: Record<string, 'renda' | 'despesas-fixas' | 'despesas-variaveis' | 'investimentos' | 'dividas' | 'objetivos' | 'seguranca' | 'abundancia'> = {
  Renda: 'renda', 'Despesas Fixas': 'despesas-fixas', 'Despesas Variáveis': 'despesas-variaveis',
  Investimentos: 'investimentos', Dívidas: 'dividas', Objetivos: 'objetivos', Segurança: 'seguranca', Abundância: 'abundancia',
};

export default function ResourcesModulePage({ selectedDate, refreshCount }: ResourcesModulePageProps) {
  const { showAlert } = useNexusAlert();
  const { navigate } = useRouter();
  const [reflexaoTexto, setReflexaoTexto] = useState('');

  const handleQuickRegister = (item: string) => {
    showAlert(`Abrindo fluxo de registro para ${item}...`, 'recursos');
  };

  const handleSubmodule = (name: string) => {
    const slug = RESOURCES_SUB_MAP[name];
    if (slug) navigate(submodulePath('financas', slug));
  };

  const handleSalvarReflexao = () => {
    if (!reflexaoTexto.trim()) {
      showAlert('Escreva algo antes de registrar.', 'recursos');
      return;
    }
    const hoje = storage.getRegistroPorData(selectedDate) || { data: selectedDate };
    const reg = { ...hoje };
    reg.diario = (reg.diario ? reg.diario + '\n' : '') + `[Reflexão Recursos]: ${reflexaoTexto.trim()}`;
    storage.actualizarRegistro(reg);
    setReflexaoTexto('');
    showAlert('Reflexão registrada!', 'recursos');
  };

  const cx = 100, cy = 100;

  return (
    <div className="space-y-8 -mx-5 px-5 -mt-6 pt-5 pb-32 text-ink font-sans bg-app">
      {/* ── 1. Header editorial ── */}
      <div className="flex justify-between items-start pt-2">
        <div className="space-y-1 max-w-[78%]">
          <span className="text-caption font-semibold tracking-wider text-subtle uppercase font-mono">MÓDULO</span>
          <h1 className="text-[34px] font-bold text-ink tracking-tight leading-none">Finanças</h1>
          <p className="text-body text-subtle mt-1.5 leading-relaxed">
            Renda, despesas, investimentos, dívidas, objetivos financeiros e segurança patrimonial.
          </p>
        </div>
        <button
          onClick={() => showAlert('Opções de visualização filtradas.', 'recursos')}
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

      {/* ── 2. Resources Overview Card ── */}
      <div className="rounded-sheet border border-finance-line p-5 space-y-6 relative overflow-hidden shadow-card bg-finance-soft">
        <div className="flex justify-between items-start">
          <div className="space-y-1 max-w-[80%]">
            <h3 className="text-sm font-bold text-ink flex items-center gap-1.5">
              <Wallet className="w-4 h-4 text-finance" />
              Panorama financeiro
            </h3>
            <p className="text-caption text-subtle leading-relaxed">
              Seu período recente mostra crescimento da renda, redução de despesas discricionárias e avanço consistente nos investimentos.
            </p>
          </div>
          <span className="text-micro uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-finance/10 text-finance">
            saúde financeira
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 border-t border-finance-line/40 pt-4">
          <div className="space-y-1">
            <span className="text-caption text-subtle font-medium">Receita</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-ink">R$ 8.400</span>
            </div>
            <span className="text-micro text-faint block">média mensal</span>
          </div>
          <div className="space-y-1">
            <span className="text-caption text-subtle font-medium">Despesas</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-ink">R$ 5.200</span>
            </div>
            <span className="text-micro text-faint block">total mensal</span>
          </div>
          <div className="space-y-1 border-t border-finance-line/20 pt-3">
            <span className="text-caption text-subtle font-medium">Saldo</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-finance">+R$ 3.200</span>
            </div>
            <span className="text-micro text-faint block">positivo no período</span>
          </div>
          <div className="space-y-1 border-t border-finance-line/20 pt-3">
            <span className="text-caption text-subtle font-medium">Investimentos</span>
            <div className="text-xl font-bold text-ink">Em crescimento</div>
            <span className="text-micro text-faint block">carteira diversificada</span>
          </div>
        </div>

        <div className="border-t border-finance-line/40 pt-4 flex flex-col items-center">
          <span className="text-caption text-faint uppercase tracking-wider font-semibold mb-3">Mapa Financeiro</span>
          <svg viewBox="0 0 200 200" className="w-48 h-48 mx-auto">
            {[0.35, 0.55, 0.75].map((scale, i) => (
              <circle key={i} cx={cx} cy={cy} r={84 * scale} fill="none" stroke="var(--color-finance-line)" strokeWidth="0.8" strokeDasharray="3 4" opacity={0.6} />
            ))}
            {RESOURCES_NODES.map((node, i) => {
              const p = polarToCartesian(cx, cy, node.distance, node.angle);
              return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke={node.color} strokeWidth="0.8" opacity={0.25} />;
            })}
            {RESOURCES_NODES.map((node, i) => {
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
            <circle cx={cx} cy={cy} r={18} fill="var(--color-finance)" fillOpacity={0.15} stroke="var(--color-finance)" strokeWidth="2" />
            <text x={cx} y={cy + 3} textAnchor="middle" className="text-[9px] font-bold fill-ink" fill="var(--color-ink)">Finanças</text>
          </svg>
        </div>

        <div className="border-t border-finance-line/40 pt-3 text-caption text-subtle leading-relaxed italic text-center">
          “A combinação de renda crescente com despesas controladas continua gerando folga financeira.”
        </div>
      </div>

      {/* ── 3. Quick Capture ── */}
      <div className="space-y-3">
        <div>
          <h2 className="text-lg font-bold text-ink">Registrar algo sobre suas finanças</h2>
          <p className="text-caption text-subtle">Capture receitas, despesas, investimentos, metas e movimentações financeiras.</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {QUICK_ITEMS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={() => handleQuickRegister(item.title)}
                className="bg-card border border-line rounded-xl p-3 text-left relative h-24 flex flex-col justify-between hover:border-finance/50 active-tap transition-all cursor-pointer"
              >
                <span className="absolute top-3 right-3 text-xs font-bold text-faint">+</span>
                <div className="w-7 h-7 rounded-full bg-finance-soft text-finance flex items-center justify-center">
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
      <div className="rounded-sheet border border-finance-line bg-finance-soft p-5 space-y-3.5">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-finance" />
          <span className="text-micro uppercase font-bold tracking-wider text-finance font-mono">INSIGHT</span>
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-ink">O controle de despesas variáveis está liberando mais recursos para investir</h4>
          <p className="text-caption text-subtle leading-relaxed">
            A redução de gastos discricionários nas últimas semanas permitiu direcionar mais capital para a carteira de investimentos.
          </p>
        </div>
        <button
          onClick={() => showAlert('Explorando padrões financeiros...', 'recursos')}
          className="inline-flex items-center px-4 py-1.5 bg-card hover:bg-finance/5 text-finance hover:text-finance text-caption font-bold rounded-full border border-line active-tap transition-colors cursor-pointer"
        >
          Explorar finanças
        </button>
      </div>

      {/* ── 5. Resources Map Section ── */}
      <div className="space-y-5">
        <div>
          <h2 className="text-lg font-bold text-ink">Mapa Financeiro</h2>
          <p className="text-caption text-subtle">Cada área abaixo representa um pilar essencial da sua saúde financeira.</p>
        </div>

        {/* 5.1 Renda */}
        <div className="bg-card border border-line rounded-sheet p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-finance-soft border border-finance-line flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-finance" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">Renda</h3>
              <p className="text-caption text-subtle">Fontes de receita, salário, freelances, renda passiva e fluxo de entrada financeira</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1 bg-muted/60 border border-line/60 rounded-xl p-3">
              <span className="text-micro text-faint uppercase font-mono font-bold">Principal</span>
              <div className="text-base font-bold text-ink mt-0.5">R$ 7.200</div>
            </div>
            <div className="flex-1 bg-muted/60 border border-line/60 rounded-xl p-3">
              <span className="text-micro text-faint uppercase font-mono font-bold">Extra</span>
              <div className="text-base font-bold text-ink mt-0.5">R$ 1.200</div>
            </div>
            <div className="flex-1 bg-muted/60 border border-line/60 rounded-xl p-3">
              <span className="text-micro text-faint uppercase font-mono font-bold">Tendência</span>
              <div className="text-base font-bold text-ink mt-0.5">Crescimento</div>
            </div>
          </div>
          <div className="flex justify-center py-1">
            <svg viewBox="0 0 160 40" className="w-full h-10">
              <path d="M15 32 L45 28 L75 18 L105 22 L135 14" fill="none" stroke="var(--color-finance)" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="15" cy="32" r="3" fill="var(--color-finance)" />
              <circle cx="75" cy="18" r="3" fill="var(--color-finance)" />
              <circle cx="135" cy="14" r="3" fill="var(--color-finance)" />
            </svg>
          </div>
          <p className="text-caption text-subtle leading-relaxed italic border-t border-line/40 pt-3">
            “A renda apresenta trajetória consistente de crescimento nos últimos meses.”
          </p>
          <button onClick={() => handleSubmodule('Renda')} className="text-caption font-bold text-finance hover:underline flex items-center gap-1">
            Ver renda <span className="text-base">→</span>
          </button>
        </div>

        {/* 5.2 Despesas Fixas */}
        <div className="bg-card border border-line rounded-sheet p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-finance-soft border border-finance-line flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-finance" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">Despesas Fixas</h3>
              <p className="text-caption text-subtle">Contas recorrentes, assinaturas, aluguel e compromissos financeiros regulares</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1 bg-muted/60 border border-line/60 rounded-xl p-3">
              <span className="text-micro text-faint uppercase font-mono font-bold">Total</span>
              <div className="text-base font-bold text-ink mt-0.5">R$ 3.100</div>
            </div>
            <div className="flex-1 bg-muted/60 border border-line/60 rounded-xl p-3">
              <span className="text-micro text-faint uppercase font-mono font-bold">Relação</span>
              <div className="text-base font-bold text-ink mt-0.5">37%</div>
            </div>
          </div>
          <div className="flex justify-center py-1">
            <svg viewBox="0 0 160 50" className="w-full h-12">
              <rect x="20" y="10" width="120" height="12" rx="6" fill="var(--color-finance-line)" fillOpacity={0.3} />
              <rect x="20" y="10" width="72" height="12" rx="6" fill="var(--color-finance)" fillOpacity={0.5} />
              <text x="56" y="20" textAnchor="middle" className="text-[5px] font-bold fill-white" fill="white">60%</text>
              <text x="80" y="38" textAnchor="middle" className="text-[6px] text-subtle" fill="var(--color-faint)">comprometimento da renda</text>
            </svg>
          </div>
          <p className="text-caption text-subtle leading-relaxed italic border-t border-line/40 pt-3">
            “As despesas fixas permanecem estáveis e dentro de uma faixa saudável da renda.”
          </p>
          <button onClick={() => handleSubmodule('Despesas Fixas')} className="text-caption font-bold text-finance hover:underline flex items-center gap-1">
            Ver despesas fixas <span className="text-base">→</span>
          </button>
        </div>

        {/* 5.3 Despesas Variáveis */}
        <div className="bg-card border border-line rounded-sheet p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-finance-soft border border-finance-line flex items-center justify-center">
              <TrendingDown className="w-4 h-4 text-finance" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">Despesas Variáveis</h3>
              <p className="text-caption text-subtle">Gastos discricionários, alimentação fora, lazer, compras e consumo flexível</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1 bg-muted/60 border border-line/60 rounded-xl p-3">
              <span className="text-micro text-faint uppercase font-mono font-bold">Total</span>
              <div className="text-base font-bold text-ink mt-0.5">R$ 2.100</div>
            </div>
            <div className="flex-1 bg-muted/60 border border-line/60 rounded-xl p-3">
              <span className="text-micro text-faint uppercase font-mono font-bold">Variação</span>
              <div className="text-base font-bold text-ink mt-0.5">-12%</div>
            </div>
          </div>
          <div className="flex justify-center py-1">
            <svg viewBox="0 0 160 50" className="w-full h-12">
              {[20, 48, 76, 104, 132].map((x, i) => (
                <rect key={i} x={x - 8} y={8 + (4 - i) * 6} width="16" height="30 - (4 - i) * 6" rx="3" fill="var(--color-finance)" fillOpacity={0.2 + (4 - i) * 0.15} stroke="var(--color-finance)" strokeWidth="1" />
              ))}
            </svg>
          </div>
          <p className="text-caption text-subtle leading-relaxed italic border-t border-line/40 pt-3">
            “A redução de despesas variáveis nas últimas semanas gerou mais folga no orçamento.”
          </p>
          <button onClick={() => handleSubmodule('Despesas Variáveis')} className="text-caption font-bold text-finance hover:underline flex items-center gap-1">
            Ver despesas variáveis <span className="text-base">→</span>
          </button>
        </div>

        {/* Insight break 1 */}
        <div className="rounded-2xl p-4 flex gap-3.5 items-start border border-finance-line bg-finance-soft/60">
          <div className="w-7 h-7 rounded-full bg-finance-soft flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-finance" />
          </div>
          <p className="text-caption text-subtle leading-relaxed font-medium italic">
            “Renda crescente + despesas controladas = o caminho mais curto para a liberdade financeira.”
          </p>
        </div>

        {/* 5.4 Investimentos */}
        <div className="bg-card border border-line rounded-sheet p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-finance-soft border border-finance-line flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-finance" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">Investimentos</h3>
              <p className="text-caption text-subtle">Carteira, alocação de ativos, rendimento e diversificação patrimonial</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1 bg-muted/60 border border-line/60 rounded-xl p-3">
              <span className="text-micro text-faint uppercase font-mono font-bold">Carteira</span>
              <div className="text-base font-bold text-ink mt-0.5">R$ 24.500</div>
            </div>
            <div className="flex-1 bg-muted/60 border border-line/60 rounded-xl p-3">
              <span className="text-micro text-faint uppercase font-mono font-bold">Retorno</span>
              <div className="text-base font-bold text-ink mt-0.5">+8.2%</div>
            </div>
          </div>
          <div className="flex justify-center gap-3 py-1">
            {[
              { label: 'Renda Fixa', pct: 45, color: '#9A7D0A' },
              { label: 'Ações', pct: 30, color: '#B8962E' },
              { label: 'Fundos', pct: 15, color: '#C8A84E' },
              { label: 'Outros', pct: 10, color: '#D4BC6E' },
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
            “A diversificação da carteira está proporcionando retornos mais estáveis.”
          </p>
          <button onClick={() => handleSubmodule('Investimentos')} className="text-caption font-bold text-finance hover:underline flex items-center gap-1">
            Ver investimentos <span className="text-base">→</span>
          </button>
        </div>

        {/* 5.5 Dívidas */}
        <div className="bg-card border border-line rounded-sheet p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-finance-soft border border-finance-line flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-finance" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">Dívidas</h3>
              <p className="text-caption text-subtle">Passivos, parcelamentos, faturas e compromissos financeiros pendentes</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1 bg-muted/60 border border-line/60 rounded-xl p-3">
              <span className="text-micro text-faint uppercase font-mono font-bold">Total</span>
              <div className="text-base font-bold text-ink mt-0.5">R$ 3.800</div>
            </div>
            <div className="flex-1 bg-muted/60 border border-line/60 rounded-xl p-3">
              <span className="text-micro text-faint uppercase font-mono font-bold">Evolução</span>
              <div className="text-base font-bold text-ink mt-0.5">-22%</div>
            </div>
          </div>
          <div className="flex justify-center py-1">
            <svg viewBox="0 0 160 50" className="w-full h-12">
              <path d="M25 15 L60 15 L60 35 L95 35 L95 20 L130 20" fill="none" stroke="var(--color-finance)" strokeWidth="2.5" strokeLinecap="round" />
              <text x="42" y="12" textAnchor="middle" className="text-[5px] font-bold" fill="var(--color-finance)">R$ 4.800</text>
              <text x="112" y="17" textAnchor="middle" className="text-[5px] font-bold" fill="var(--color-finance)">R$ 3.800</text>
            </svg>
          </div>
          <p className="text-caption text-subtle leading-relaxed italic border-t border-line/40 pt-3">
            “O saldo devedor vem caindo consistentemente nos últimos meses.”
          </p>
          <button onClick={() => handleSubmodule('Dívidas')} className="text-caption font-bold text-finance hover:underline flex items-center gap-1">
            Ver dívidas <span className="text-base">→</span>
          </button>
        </div>

        {/* 5.6 Objetivos */}
        <div className="bg-card border border-line rounded-sheet p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-finance-soft border border-finance-line flex items-center justify-center">
              <Target className="w-4 h-4 text-finance" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">Objetivos Financeiros</h3>
              <p className="text-caption text-subtle">Metas de poupança, conquistas patrimoniais e planejamento financeiro futuro</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1 bg-muted/60 border border-line/60 rounded-xl p-3">
              <span className="text-micro text-faint uppercase font-mono font-bold">Metas</span>
              <div className="text-base font-bold text-ink mt-0.5">4 ativas</div>
            </div>
            <div className="flex-1 bg-muted/60 border border-line/60 rounded-xl p-3">
              <span className="text-micro text-faint uppercase font-mono font-bold">Progresso</span>
              <div className="text-base font-bold text-ink mt-0.5">62%</div>
            </div>
          </div>
          <div className="flex justify-center py-1">
            <svg viewBox="0 0 160 50" className="w-full h-12">
              <circle cx="80" cy="25" r="18" fill="none" stroke="var(--color-finance-line)" strokeWidth="3" />
              <motion.circle cx="80" cy="25" r="18" fill="none" stroke="var(--color-finance)" strokeWidth="3" strokeDasharray={`${62 * 1.13} ${100 * 1.13}`} strokeLinecap="round" transform="rotate(-90 80 25)" />
              <text x="80" y="29" textAnchor="middle" className="text-[9px] font-bold fill-ink" fill="var(--color-ink)">62%</text>
            </svg>
          </div>
          <p className="text-caption text-subtle leading-relaxed italic border-t border-line/40 pt-3">
            “As metas de curto prazo estão mais avançadas que as de longo prazo.”
          </p>
          <button onClick={() => handleSubmodule('Objetivos')} className="text-caption font-bold text-finance hover:underline flex items-center gap-1">
            Ver objetivos <span className="text-base">→</span>
          </button>
        </div>

        {/* Insight break 2 */}
        <div className="rounded-2xl p-4 flex gap-3.5 items-start border border-finance-line bg-finance-soft/60">
          <div className="w-7 h-7 rounded-full bg-finance-soft flex items-center justify-center shrink-0">
            <Lightbulb className="w-4 h-4 text-finance" />
          </div>
          <p className="text-caption text-subtle leading-relaxed font-medium italic">
            “Investir é o que sobra depois que as dívidas diminuem e as metas ficam claras.”
          </p>
        </div>

        {/* 5.7 Segurança */}
        <div className="bg-card border border-line rounded-sheet p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-finance-soft border border-finance-line flex items-center justify-center">
              <Shield className="w-4 h-4 text-finance" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">Segurança Financeira</h3>
              <p className="text-caption text-subtle">Reserva de emergência, proteção patrimonial e planejamento para imprevistos</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1 bg-muted/60 border border-line/60 rounded-xl p-3">
              <span className="text-micro text-faint uppercase font-mono font-bold">Reserva</span>
              <div className="text-base font-bold text-ink mt-0.5">R$ 12.000</div>
            </div>
            <div className="flex-1 bg-muted/60 border border-line/60 rounded-xl p-3">
              <span className="text-micro text-faint uppercase font-mono font-bold">Meses</span>
              <div className="text-base font-bold text-ink mt-0.5">3 meses</div>
            </div>
          </div>
          <div className="flex justify-center py-1">
            <svg viewBox="0 0 160 50" className="w-full h-12">
              {[1, 2, 3, 4, 5, 6].map((m, i) => (
                <rect key={i} x={15 + i * 21} y={30 - Math.min(m, 3) * 6} width="16" height={Math.min(m, 3) * 6 + 2} rx="3" fill={m <= 3 ? 'var(--color-finance)' : 'var(--color-finance-line)'} fillOpacity={m <= 3 ? 0.6 : 0.2} stroke="var(--color-finance)" strokeWidth="1" />
              ))}
              <text x="80" y="46" textAnchor="middle" className="text-[6px] text-subtle" fill="var(--color-faint)">meses de reserva</text>
            </svg>
          </div>
          <p className="text-caption text-subtle leading-relaxed italic border-t border-line/40 pt-3">
            “A reserva de emergência já cobre 3 meses de despesas — meta é chegar a 6.”
          </p>
          <button onClick={() => handleSubmodule('Segurança')} className="text-caption font-bold text-finance hover:underline flex items-center gap-1">
            Ver segurança <span className="text-base">→</span>
          </button>
        </div>

        {/* 5.8 Abundância */}
        <div className="bg-card border border-line rounded-sheet p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-finance-soft border border-finance-line flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-finance" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">Abundância</h3>
              <p className="text-caption text-subtle">Percepção de prosperidade, relação com o dinheiro e satisfação financeira geral</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1 bg-muted/60 border border-line/60 rounded-xl p-3">
              <span className="text-micro text-faint uppercase font-mono font-bold">Satisfação</span>
              <div className="text-base font-bold text-ink mt-0.5">7.4/10</div>
            </div>
            <div className="flex-1 bg-muted/60 border border-line/60 rounded-xl p-3">
              <span className="text-micro text-faint uppercase font-mono font-bold">Tendência</span>
              <div className="text-base font-bold text-ink mt-0.5">Melhorando</div>
            </div>
          </div>
          <div className="flex justify-center py-1">
            <svg viewBox="0 0 160 60" className="w-full h-14">
              <polygon points="80,5 86,20 102,22 90,33 93,50 80,42 67,50 70,33 58,22 74,20" fill="var(--color-finance)" fillOpacity={0.15} stroke="var(--color-finance)" strokeWidth="1.5" />
              <text x="80" y="32" textAnchor="middle" className="text-[10px] font-bold fill-ink" fill="var(--color-ink)">✨</text>
            </svg>
          </div>
          <p className="text-caption text-subtle leading-relaxed italic border-t border-line/40 pt-3">
            “Sua relação com o dinheiro está mais saudável — menos ansiedade, mais planejamento.”
          </p>
          <button onClick={() => handleSubmodule('Abundância')} className="text-caption font-bold text-finance hover:underline flex items-center gap-1">
            Ver abundância <span className="text-base">→</span>
          </button>
        </div>
      </div>

      {/* ── 6. Connections Section ── */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-ink">Conexões financeiras</h2>
          <p className="text-caption text-subtle">Alguns aspectos financeiros parecem evoluir juntos.</p>
        </div>
        <div className="space-y-3">
          {CONNECTIONS.map((conn, i) => (
            <div key={i} className="bg-card border border-line rounded-2xl p-4 flex items-center gap-3.5">
              <div className="w-8 h-8 rounded-full bg-finance-soft flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-finance" />
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
          <h2 className="text-lg font-bold text-ink">Linha do tempo financeira</h2>
          <p className="text-caption text-subtle">Eventos que marcaram sua trajetória financeira nas últimas semanas.</p>
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
            “Qual hábito financeiro está trazendo mais resultados positivos atualmente?”
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
