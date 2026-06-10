import React, { useState } from 'react';
import {
  Heart,
  HeartHandshake,
  Users,
  Star,
  Music,
  BookOpen,
  Compass,
  Zap,
  Flag,
  Sparkles,
  SlidersHorizontal,
  Lightbulb,
  type LucideIcon,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { RelationshipsCard } from '../../../design-system/cards/RelationshipsCard';
import { CommunityBelongingCard } from '../../../design-system/cards/CommunityBelongingCard';
import { ExperiencesCard } from '../../../design-system/cards/ExperiencesCard';
import { LeisureHobbiesCard } from '../../../design-system/cards/LeisureHobbiesCard';
import { LearningsCard } from '../../../design-system/cards/LearningsCard';
import { PurposeValuesCard } from '../../../design-system/cards/PurposeValuesCard';
import { DecisionsCard } from '../../../design-system/cards/DecisionsCard';
import { MilestonesCard } from '../../../design-system/cards/MilestonesCard';
import { storage } from '../../../lib/storage';
import { useNexusAlert } from '../../../app/providers/NexusAlertProvider';
import { useRouter } from '../../../app/router/RouterProvider';
import { submodulePath } from '../../../app/router/routes';

interface LifeModulePageProps {
  selectedDate: string;
  refreshCount: number;
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

const LIFE_NODES = [
  { label: 'Relacionamentos', angle: 0, distance: 50, strength: 'forte', color: '#E06D53', size: 26 },
  { label: 'Comunidade', angle: 45, distance: 68, strength: 'médio', color: '#E8927A', size: 20 },
  { label: 'Experiências', angle: 90, distance: 52, strength: 'forte', color: '#E06D53', size: 26 },
  { label: 'Lazer', angle: 135, distance: 64, strength: 'médio', color: '#E8927A', size: 22 },
  { label: 'Aprendizados', angle: 180, distance: 60, strength: 'médio', color: '#E8927A', size: 22 },
  { label: 'Propósito', angle: 225, distance: 48, strength: 'forte', color: '#E06D53', size: 28 },
  { label: 'Decisões', angle: 270, distance: 72, strength: 'leve', color: '#F0B8A8', size: 18 },
  { label: 'Marcos', angle: 315, distance: 58, strength: 'médio', color: '#E8927A', size: 22 },
];

interface QuickItem {
  icon: LucideIcon;
  title: string;
  sub: string;
}

const QUICK_ITEMS: QuickItem[] = [
  { icon: Heart, title: 'Relacionamentos', sub: 'Registrar interação importante' },
  { icon: Users, title: 'Comunidade', sub: 'Registrar participação em grupo' },
  { icon: Star, title: 'Experiência', sub: 'Registrar experiência vivida' },
  { icon: Music, title: 'Lazer', sub: 'Registrar atividade prazerosa' },
  { icon: BookOpen, title: 'Aprendizado', sub: 'Registrar algo aprendido' },
  { icon: Compass, title: 'Propósito', sub: 'Registrar reflexão pessoal' },
  { icon: Zap, title: 'Decisão', sub: 'Registrar decisão importante' },
  { icon: Flag, title: 'Marco', sub: 'Registrar acontecimento marcante' },
];

const CONNECTIONS = [
  { title: 'Relacionamentos ↔ Humor', insight: 'Interações positivas aparecem associadas a melhores estados emocionais.' },
  { title: 'Experiências ↔ Energia', insight: 'Momentos fora da rotina costumam aumentar sua energia percebida.' },
  { title: 'Lazer ↔ Estresse', insight: 'Mais lazer parece estar associado a menor estresse.' },
  { title: 'Propósito ↔ Motivação', insight: 'Quando suas ações estão alinhadas aos seus valores, a motivação tende a crescer.' },
  { title: 'Aprendizados ↔ Objetivos', insight: 'Períodos de aprendizado intenso aparecem associados a maior progresso pessoal.' },
];

const TIMELINE_EVENTS = [
  { title: 'Conversa importante com amigo próximo', category: 'Relacionamentos', impact: 'positivo', color: '#E06D53' },
  { title: 'Participação em evento social', category: 'Comunidade', impact: 'positivo', color: '#E8927A' },
  { title: 'Nova atividade iniciada', category: 'Experiência', impact: 'crescimento', color: '#E06D53' },
  { title: 'Reflexão sobre propósito', category: 'Propósito', impact: 'clareza', color: '#F0B8A8' },
  { title: 'Decisão profissional importante', category: 'Decisão', impact: 'transformação', color: '#E8927A' },
];

const LIFE_SUB_MAP: Record<string, 'relacionamentos' | 'comunidade' | 'experiencias' | 'lazer' | 'aprendizados' | 'proposito' | 'decisoes' | 'marcos'> = {
  Relacionamentos: 'relacionamentos', Comunidade: 'comunidade', Experiências: 'experiencias',
  Lazer: 'lazer', Aprendizados: 'aprendizados', Propósito: 'proposito', Decisões: 'decisoes', Marcos: 'marcos',
};

export default function LifeModulePage({ selectedDate, refreshCount }: LifeModulePageProps) {
  const { showAlert } = useNexusAlert();
  const { navigate } = useRouter();
  const [reflexaoTexto, setReflexaoTexto] = useState('');

  const registros = storage.getRegistros()
    .sort((a, b) => b.data.localeCompare(a.data));

  const handleQuickRegister = (item: string) => {
    showAlert(`Abrindo fluxo de registro para ${item}...`, 'relacoes');
  };

  const handleSubmodule = (name: string) => {
    const slug = LIFE_SUB_MAP[name];
    if (slug) navigate(submodulePath('relacoes', slug));
  };

  const handleSalvarReflexao = () => {
    if (!reflexaoTexto.trim()) {
      showAlert('Escreva algo antes de registrar.', 'relacoes');
      return;
    }
    const hoje = storage.getRegistroPorData(selectedDate) || { data: selectedDate };
    const reg = { ...hoje };
    reg.diario = (reg.diario ? reg.diario + '\n' : '') + `[Reflexão Vida]: ${reflexaoTexto.trim()}`;
    storage.actualizarRegistro(reg);
    setReflexaoTexto('');
    showAlert('Reflexão registrada!', 'relacoes');
  };

  const cx = 100, cy = 100;

  return (
    <div className="space-y-8 -mx-5 px-5 -mt-6 pt-5 pb-32 text-ink font-sans bg-app">
      {/* ── 1. Header editorial ── */}
      <div className="flex justify-between items-start pt-2">
        <div className="space-y-1 max-w-[78%]">
          <span className="text-caption font-semibold tracking-wider text-subtle uppercase font-mono">MÓDULO</span>
          <h1 className="text-[34px] font-bold text-ink tracking-tight leading-none">Vida</h1>
          <p className="text-body text-subtle mt-1.5 leading-relaxed">
            Relacionamentos, pertencimento, experiências, propósito e trajetória pessoal.
          </p>
        </div>
        <button
          onClick={() => showAlert('Opções de visualização filtradas.', 'relacoes')}
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

      {/* ── 2. Life Overview Card ── */}
      <div className="rounded-sheet border border-life-line p-5 space-y-6 relative overflow-hidden shadow-card bg-life-soft">
        <div className="flex justify-between items-start">
          <div className="space-y-1 max-w-[80%]">
            <h3 className="text-sm font-bold text-ink flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4 text-life" />
              Panorama da sua vida
            </h3>
            <p className="text-caption text-subtle leading-relaxed">
              Seu período recente mostra fortalecimento das relações importantes, mais experiências significativas e maior alinhamento com seus valores.
            </p>
          </div>
          <span className="text-micro uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-life/10 text-life">
            trajetória em evolução
          </span>
        </div>

        {/* Métricas 2x2 */}
        <div className="grid grid-cols-2 gap-3 border-t border-life-line/40 pt-4">
          <div className="space-y-1">
            <span className="text-caption text-subtle font-medium">Relacionamentos</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-ink">8.2</span>
              <span className="text-micro text-faint">/10</span>
            </div>
            <span className="text-micro text-faint block">qualidade percebida</span>
          </div>
          <div className="space-y-1">
            <span className="text-caption text-subtle font-medium">Comunidade</span>
            <div className="text-xl font-bold text-ink">Alta</div>
            <span className="text-micro text-faint block">pertencimento</span>
          </div>
          <div className="space-y-1 border-t border-life-line/20 pt-3">
            <span className="text-caption text-subtle font-medium">Experiências</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-ink">+12</span>
            </div>
            <span className="text-micro text-faint block">momentos relevantes</span>
          </div>
          <div className="space-y-1 border-t border-life-line/20 pt-3">
            <span className="text-caption text-subtle font-medium">Propósito</span>
            <div className="text-xl font-bold text-ink">Alto</div>
            <span className="text-micro text-faint block">alinhamento atual</span>
          </div>
        </div>

        {/* SVG: Mapa da Vida radial */}
        <div className="border-t border-life-line/40 pt-4 flex flex-col items-center">
          <span className="text-caption text-faint uppercase tracking-wider font-semibold mb-3">Mapa da Vida</span>
          <svg viewBox="0 0 200 200" className="w-48 h-48 mx-auto">
            {/* Grid rings */}
            {[0.35, 0.55, 0.75].map((scale, i) => (
              <circle key={i} cx={cx} cy={cy} r={84 * scale} fill="none" stroke="var(--color-life-line)" strokeWidth="0.8" strokeDasharray="3 4" opacity={0.6} />
            ))}
            {/* Connection lines from center */}
            {LIFE_NODES.map((node, i) => {
              const p = polarToCartesian(cx, cy, node.distance, node.angle);
              return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke={node.color} strokeWidth="0.8" opacity={0.25} />;
            })}
            {/* Nodes */}
            {LIFE_NODES.map((node, i) => {
              const p = polarToCartesian(cx, cy, node.distance, node.angle);
              return (
                <g key={i}>
                  <circle cx={p.x} cy={p.y} r={node.size / 2} fill={node.color} fillOpacity={0.12} stroke={node.color} strokeWidth="1.5" />
                  <text x={p.x} y={p.y + 3} textAnchor="middle" className="text-[6px] font-bold fill-current text-ink" fill="var(--color-ink)">
                    {node.label.length > 8 ? node.label.slice(0, 8) + '…' : node.label}
                  </text>
                </g>
              );
            })}
            {/* Center node */}
            <circle cx={cx} cy={cy} r={18} fill="var(--color-life)" fillOpacity={0.15} stroke="var(--color-life)" strokeWidth="2" />
            <text x={cx} y={cy + 3} textAnchor="middle" className="text-[9px] font-bold fill-ink" fill="var(--color-ink)">Vida</text>
          </svg>
        </div>

        {/* Insight */}
        <div className="border-t border-life-line/40 pt-3 text-caption text-subtle leading-relaxed italic text-center">
          “Os relacionamentos continuam sendo o principal fator associado ao seu bem-estar.”
        </div>
      </div>

      {/* ── 3. Quick Capture ── */}
      <div className="space-y-3">
        <div>
          <h2 className="text-lg font-bold text-ink">Registrar algo da sua vida</h2>
          <p className="text-caption text-subtle">Capture momentos, relações, experiências e reflexões importantes.</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {QUICK_ITEMS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={() => handleQuickRegister(item.title)}
                className="bg-card border border-line rounded-xl p-3 text-left relative h-24 flex flex-col justify-between hover:border-life/50 active-tap transition-all cursor-pointer"
              >
                <span className="absolute top-3 right-3 text-xs font-bold text-faint">+</span>
                <div className="w-7 h-7 rounded-full bg-life-soft text-life flex items-center justify-center">
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
      <div className="rounded-sheet border border-life-line bg-life-soft p-5 space-y-3.5">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-life" />
          <span className="text-micro uppercase font-bold tracking-wider text-life font-mono">INSIGHT</span>
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-ink">Relações significativas continuam moldando seu bem-estar</h4>
          <p className="text-caption text-subtle leading-relaxed">
            Os dias com mais interações positivas apresentaram melhor humor, maior motivação e maior sensação de propósito.
          </p>
        </div>
        <button
          onClick={() => showAlert('Explorando conexões...', 'relacoes')}
          className="inline-flex items-center px-4 py-1.5 bg-card hover:bg-life/5 text-life hover:text-life text-caption font-bold rounded-full border border-line active-tap transition-colors cursor-pointer"
        >
          Explorar conexões
        </button>
      </div>

      {/* ── 5. Life Map Section ── */}
      <div className="space-y-5">
        <div>
          <h2 className="text-lg font-bold text-ink">Mapa da Vida</h2>
          <p className="text-caption text-subtle">Cada área abaixo representa um aspecto importante da sua trajetória.</p>
        </div>

        {/* 5.1 Relacionamentos */}
        <RelationshipsCard
          relationshipCount={12}
          activeConnections={5}
          supportAvailable={true}
          insight="As conversas com pessoas próximas continuam associadas aos seus melhores dias."
          badgeLabel="vínculos fortalecidos"
          onClick={() => handleSubmodule('Relacionamentos')}
        />

        {/* 5.2 Comunidade */}
        <CommunityBelongingCard
          belongingScore={82}
          participationScore={67}
          insight="Sua sensação de pertencimento cresce quando participa ativamente de grupos."
          badgeLabel="pertencimento ativo"
          onClick={() => handleSubmodule('Comunidade')}
        />

        {/* Insight break 1 */}
        <div className="rounded-2xl p-4 flex gap-3.5 items-start border border-life-line bg-life-soft/60">
          <div className="w-7 h-7 rounded-full bg-life-soft flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-life" />
          </div>
          <p className="text-caption text-subtle leading-relaxed font-medium italic">
            “Apoio social e motivação continuam aparecendo fortemente conectados.”
          </p>
        </div>

        {/* 5.3 Experiências */}
        <ExperiencesCard
          experienceCount={8}
          memorableMoments={3}
          noveltyLevel={78}
          insight="Experiências fora da rotina tiveram forte impacto positivo na energia mental."
          badgeLabel="memórias em formação"
          onClick={() => handleSubmodule('Experiências')}
        />

        {/* 5.4 Lazer */}
        <LeisureHobbiesCard
          hobbyCount={5}
          leisureHours={14}
          engagementLevel={78}
          insight="Seu lazer está mais consistente do que nos períodos anteriores."
          badgeLabel="interesses ativos"
          onClick={() => handleSubmodule('Lazer')}
        />

        {/* 5.5 Aprendizados */}
        <LearningsCard
          learningMoments={12}
          skillsImproved={4}
          growthLevel={82}
          insight="Você aprende melhor quando conecta teoria com aplicação prática."
          badgeLabel="crescimento ativo"
          onClick={() => handleSubmodule('Aprendizados')}
        />

        {/* Insight break 2 */}
        <div className="rounded-2xl p-4 flex gap-3.5 items-start border border-life-line bg-life-soft/60">
          <div className="w-7 h-7 rounded-full bg-life-soft flex items-center justify-center shrink-0">
            <Lightbulb className="w-4 h-4 text-life" />
          </div>
          <p className="text-caption text-subtle leading-relaxed font-medium italic">
            “Os períodos com mais aprendizado também coincidiram com maior motivação.”
          </p>
        </div>

        {/* 5.6 Propósito */}
        <PurposeValuesCard
          alignmentScore={84}
          clarityLevel={72}
          activeValues={5}
          insight="Suas decisões recentes mostram maior alinhamento com seus valores centrais."
          badgeLabel="alinhamento crescente"
          onClick={() => handleSubmodule('Propósito')}
        />

        {/* 5.7 Decisões */}
        <DecisionsCard
          decisionCount={18}
          satisfactionScore={78}
          insight="As decisões tomadas com mais reflexão geraram maior satisfação posterior."
          badgeLabel="escolhas refletidas"
          onClick={() => handleSubmodule('Decisões')}
        />

        {/* 5.8 Marcos */}
        <MilestonesCard
          milestoneCount={8}
          transitionCount={3}
          insight="O último período marcou uma nova fase de crescimento pessoal."
          badgeLabel="fase de crescimento"
          onClick={() => handleSubmodule('Marcos')}
        />
      </div>

      {/* ── 6. Connections Section ── */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-ink">Conexões da sua vida</h2>
          <p className="text-caption text-subtle">Algumas áreas parecem evoluir juntas.</p>
        </div>
        <div className="space-y-3">
          {CONNECTIONS.map((conn, i) => (
            <div key={i} className="bg-card border border-line rounded-2xl p-4 flex items-center gap-3.5">
              <div className="w-8 h-8 rounded-full bg-life-soft flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-life" />
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
          <p className="text-caption text-subtle">Momentos que contribuíram para sua trajetória recente.</p>
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
            “O que mais influenciou positivamente sua vida nas últimas semanas?”
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
