import React, { useState } from 'react';
import { ArrowLeft, MessageCircle, Calendar, Heart, AlertTriangle, Phone, Mail, Users, UserCheck, TrendingUp, BarChart3 } from 'lucide-react';

interface RelacionamentosPageProps {
  onBack: () => void;
}

export default function RelacionamentosPage({ onBack }: RelacionamentosPageProps) {
  const [intenção, setIntenção] = useState('');
  const [showIntenção, setShowIntenção] = useState(false);

  return (
    <div className="space-y-5 text-ink bg-muted pb-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-card rounded-lg transition-colors cursor-pointer">
            <ArrowLeft className="w-5 h-5 text-ink" />
          </button>
          <div>
            <h2 className="text-sm font-bold text-ink">Relacionamentos</h2>
            <p className="text-[11px] text-subtle">Vínculos, pessoas importantes, apoio emocional e impacto das relações no seu estado interno.</p>
          </div>
        </div>
        <span className="text-[10px] font-mono font-bold text-subtle bg-muted border border-line px-2.5 py-1 rounded-full whitespace-nowrap">
          Últimos 30 dias
        </span>
      </div>

      {/* Qualidade dos vínculos */}
      <div className="bg-card border border-line rounded-xl p-5 space-y-4">
        <div className="space-y-1">
          <div className="text-[10px] font-mono font-bold text-subtle uppercase tracking-wider">Pulso dos vínculos</div>
          <h3 className="text-sm font-bold text-ink">Qualidade dos vínculos</h3>
        </div>
        <div className="flex items-center gap-5">
          <div className="text-3xl font-bold font-mono text-ink">82%</div>
          <div className="flex-1 grid grid-cols-4 gap-2">
            {[
              { val: '4', label: 'conversas' },
              { val: '3', label: 'atividades' },
              { val: '1', label: 'apoio' },
              { val: '12%', label: 'emocionais' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="text-xs font-bold text-ink">{item.val}</div>
                <div className="text-[9px] text-subtle">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Interaction type circles */}
        <div className="flex items-center gap-2">
          {['bg-ink', 'bg-subtle', 'bg-ink/60', 'bg-faint', 'bg-ink/40', 'bg-stone'].map((color, i) => (
            <div key={i} className={`w-6 h-6 rounded-full ${color} border border-line`} />
          ))}
        </div>
        
        <p className="text-[11px] text-subtle leading-relaxed">
          Conversas leves e encontros presenciais foram os sinais mais positivos do período.
        </p>
        <button className="text-[11px] font-semibold text-ink border border-line rounded-lg px-3 py-1.5 hover:border-ink transition-colors">
          Pouco dos vínculos
        </button>
      </div>

      {/* Registrar relação */}
      <div className="bg-card border border-line rounded-xl p-4 space-y-3">
        <h3 className="text-sm font-bold text-ink">Registrar relação</h3>
        <p className="text-[10px] text-subtle">Capturar interações importantes antes que elas se esqueçam.</p>
        <div className="grid grid-cols-2 gap-2.5">
          {[
            { label: 'Conversa', desc: 'enviada por você', icon: MessageCircle },
            { label: 'Encontro', desc: 'encontro virtual', icon: Users },
            { label: 'Apoio', desc: 'recebido ou oferecido', icon: Heart },
            { label: 'Conflito', desc: 'tendência ao conflito afetivo', icon: AlertTriangle },
          ].map((item, i) => (
            <button key={i} className="bg-muted border border-line rounded-lg p-3 text-left hover:border-ink transition-colors cursor-pointer space-y-1.5">
              <item.icon className="w-4 h-4 text-ink" />
              <div className="text-xs font-bold text-ink">{item.label}</div>
              <div className="text-[10px] text-subtle">{item.desc}</div>
            </button>
          ))}
        </div>
        <div className="space-y-1.5 pt-1">
          <div className="text-[10px] font-mono font-bold text-subtle uppercase">Pessoa</div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Nome / Grupo / Situação"
              className="flex-1 text-xs border border-line rounded-lg p-2.5 bg-card text-ink focus:outline-hidden focus:border-ink placeholder-subtle"
            />
            <button className="bg-ink hover:bg-ink/90 text-white text-[10px] font-semibold rounded-lg px-3 py-2 transition-colors whitespace-nowrap">
              Adicionar pessoa
            </button>
          </div>
        </div>
      </div>

      {/* Pessoas que elevam sua energia */}
      <div className="bg-card border border-line rounded-xl p-4 space-y-3">
        <h3 className="text-sm font-bold text-ink">Algumas pessoas elevam sua energia com consistência</h3>
        <p className="text-[11px] text-subtle leading-relaxed">
          Nos registros recentes, conversas com pessoas próximas aparecem associadas à mais calma, humor positivo e sensação de segurança.
        </p>
        <div className="flex items-center gap-4">
          {[
            { name: 'Ana', color: 'bg-health' },
            { name: 'Lia', color: 'bg-accent' },
            { name: 'João', color: 'bg-subtle' },
            { name: 'Pedro', color: 'bg-finance' },
          ].map((person, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className={`w-10 h-10 rounded-full ${person.color} border-2 border-card flex items-center justify-center`}>
                <span className="text-xs font-bold text-white">{person.name[0]}</span>
              </div>
              <span className="text-[10px] text-subtle">{person.name}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-2 pt-1">
          <span className="text-[10px] font-semibold text-ink bg-muted border border-line rounded-md px-2 py-1">Mais apoiadores</span>
          <span className="text-[10px] font-semibold text-ink bg-muted border border-line rounded-md px-2 py-1">Mais apoiado</span>
        </div>
        <button className="text-[11px] font-semibold text-ink border border-line rounded-lg px-3 py-1.5 hover:border-ink transition-colors">
          Ver pessoas com maior impacto
        </button>
      </div>

      {/* Mapa de apoio emocional */}
      <div className="bg-card border border-line rounded-xl p-4 space-y-3">
        <h3 className="text-sm font-bold text-ink">Mapa de apoio emocional</h3>
        <p className="text-[11px] text-subtle">Uma leitura de quem aparece como fonte de presença e escuta na realidade.</p>
        
        {/* Circular diagram */}
        <div className="flex justify-center py-3">
          <svg viewBox="0 0 200 200" className="w-44 h-44">
            {/* Connection lines */}
            <line x1="100" y1="40" x2="160" y2="100" stroke="var(--color-line)" strokeWidth="1.5" />
            <line x1="100" y1="40" x2="40" y2="100" stroke="var(--color-line)" strokeWidth="1.5" />
            <line x1="100" y1="40" x2="100" y2="160" stroke="var(--color-line)" strokeWidth="1.5" />
            <line x1="160" y1="100" x2="100" y2="160" stroke="var(--color-line)" strokeWidth="1.5" />
            <line x1="40" y1="100" x2="100" y2="160" stroke="var(--color-line)" strokeWidth="1.5" />
            <line x1="40" y1="100" x2="160" y2="100" stroke="var(--color-line)" strokeWidth="1.5" />
            {/* Nodes */}
            <circle cx="100" cy="40" r="18" fill="var(--color-ink)" />
            <text x="100" y="44" textAnchor="middle" className="text-[10px] font-bold" fill="white">Ana</text>
            <circle cx="160" cy="100" r="18" fill="var(--color-accent)" />
            <text x="160" y="104" textAnchor="middle" className="text-[10px] font-bold" fill="white">Lia</text>
            <circle cx="40" cy="100" r="18" fill="var(--color-subtle)" />
            <text x="40" y="104" textAnchor="middle" className="text-[10px] font-bold" fill="white">João</text>
            <circle cx="100" cy="160" r="18" fill="var(--color-finance)" />
            <text x="100" y="164" textAnchor="middle" className="text-[10px] font-bold" fill="white">Pedro</text>
          </svg>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="text-[10px] text-subtle flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-ink" /> Muito presente Ana
          </span>
          <span className="text-[10px] text-subtle flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-subtle" /> Mais apoiar João
          </span>
        </div>
        <p className="text-[10px] text-subtle leading-relaxed">
          Seu apoio emocional está concentrado em poucas pessoas, mas com boa qualidade.
        </p>
      </div>

      {/* Impacto no humor */}
      <div className="bg-card border border-line rounded-xl p-4 space-y-3">
        <h3 className="text-sm font-bold text-ink">Impacto no humor</h3>
        <div className="space-y-3">
          {[
            { name: 'Ana', desc: 'aparece próxima', interactions: 3, dot: 'bg-health' },
            { name: 'João', desc: 'aparece com frequência em registros de escuta e orientação', interactions: 3, dot: 'bg-health' },
            { name: 'Pedro', desc: 'aparece com frequência em registros de escuta e orientação', interactions: 2, dot: 'bg-finance' },
          ].map((person, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-muted border border-line flex items-center justify-center shrink-0">
                <span className="text-[10px] font-bold text-ink">{person.name[0]}</span>
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-ink">{person.name}</span>
                  <span className={`w-1.5 h-1.5 rounded-full ${person.dot}`} />
                  <span className="text-[10px] text-subtle">{person.interactions} interações</span>
                </div>
                <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-ink rounded-full" style={{ width: `${(person.interactions / 3) * 100}%` }} />
                </div>
                <p className="text-[10px] text-subtle truncate">{person.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Frequência social */}
      <div className="bg-card border border-line rounded-xl p-4 space-y-3">
        <h3 className="text-sm font-bold text-ink">Frequência social</h3>
        <p className="text-[11px] text-subtle">Quantas interações relevantes apareceram nos seus registros?</p>
        
        <div className="flex items-center gap-4">
          {[
            { label: 'Interagir', count: 4 },
            { label: 'Compartilhar', count: 3 },
            { label: 'Ouvir', count: 2 },
            { label: 'Apoiar', count: 1 },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-full bg-muted border border-line flex items-center justify-center">
                <span className="text-xs font-bold text-ink">{item.count}</span>
              </div>
              <span className="text-[9px] text-subtle">{item.label}</span>
            </div>
          ))}
        </div>

        <p className="text-[10px] text-subtle leading-relaxed">
          Você teve mais contato social no dia da semana, com maior impacto emocional.
        </p>
        
        <div className="flex gap-2">
          {['presença', 'mensagens', 'ligação'].map((type, i) => (
            <button key={i} className={`text-[10px] font-semibold rounded-lg px-3 py-1.5 border transition-colors ${
              i === 2 ? 'bg-ink text-white border-ink' : 'bg-card text-ink border-line hover:border-ink'
            }`}>
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Isolamento e ansiedade */}
      <div className="bg-card border border-line rounded-xl p-4 space-y-3">
        <h3 className="text-sm font-bold text-ink">Isolamento e ansiedade</h3>
        <p className="text-[11px] text-subtle">Uma das maiores crises é o sentimento social e registros de ansiedade.</p>
        
        {/* Simple line chart */}
        <div className="bg-muted rounded-lg p-3 border border-line">
          <svg viewBox="0 0 300 100" className="w-full h-20">
            {/* Correlação leve line */}
            <polyline points="10,80 60,65 120,55 180,45 240,35 290,25" fill="none" stroke="var(--color-ink)" strokeWidth="2" strokeLinecap="round" />
            {/* Ansiedade line */}
            <polyline points="10,85 60,75 120,70 180,60 240,50 290,40" fill="none" stroke="var(--color-subtle)" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4" />
            {/* Labels */}
            <text x="10" y="95" className="text-[8px]" fill="var(--color-subtle)">jan</text>
            <text x="60" y="95" className="text-[8px]" fill="var(--color-subtle)">fev</text>
            <text x="120" y="95" className="text-[8px]" fill="var(--color-subtle)">mar</text>
            <text x="180" y="95" className="text-[8px]" fill="var(--color-subtle)">abr</text>
            <text x="240" y="95" className="text-[8px]" fill="var(--color-subtle)">mai</text>
            <text x="290" y="95" className="text-[8px]" fill="var(--color-subtle)">jun</text>
          </svg>
          <div className="flex gap-4 pt-2">
            <span className="text-[9px] text-subtle flex items-center gap-1">
              <span className="w-4 h-0.5 bg-ink rounded" /> Correlação leve
            </span>
            <span className="text-[9px] text-subtle flex items-center gap-1">
              <span className="w-4 h-0.5 bg-subtle rounded border-dashed" style={{ borderTop: '1px dashed var(--color-subtle)' }} /> Ansiedade
            </span>
          </div>
        </div>
        
        <p className="text-[10px] text-subtle leading-relaxed">
          Nas dias com menos contato social, seus registros indicam mais inquietação, mas o padrão ainda não mostrou risco.
        </p>
        <button className="text-[11px] font-semibold text-ink border border-line rounded-lg px-3 py-1.5 hover:border-ink transition-colors">
          Ver registros relacionados
        </button>
      </div>

      {/* Histórico recente */}
      <div className="bg-card border border-line rounded-xl p-4 space-y-3">
        <h3 className="text-sm font-bold text-ink">Histórico recente</h3>
        <div className="space-y-3">
          {[
            { title: 'Conversa importante com Ana', badge: 'estável', time: '15 min atrás', desc: 'Você mencionou como uma conversa leve e acolhedora.', icon: MessageCircle },
            { title: 'Encontro com amigos', badge: 'ativo', time: '1h atrás', desc: 'Encontro com 4 amigos. Registrado como socialmente positivo.', icon: Users },
            { title: 'Discussão com Pedro', badge: 'conflito', time: '1d atrás', desc: 'Interação marcada como emocionalmente carregada.', icon: AlertTriangle },
            { title: 'Ligação com a mãe', badge: 'apoio', time: '2d atrás', desc: 'Associada à sensação de segurança.', icon: Phone },
            { title: 'Mensagem para João', badge: 'apoio', time: '3d atrás', desc: 'Pequeno contato, mas com impacto positivo.', icon: Mail },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-muted border border-line flex items-center justify-center shrink-0">
                <item.icon className="w-3.5 h-3.5 text-ink" />
              </div>
              <div className="flex-1 space-y-0.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-ink">{item.title}</h4>
                  <span className="text-[10px] text-subtle">{item.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono font-bold text-subtle bg-muted border border-line px-1.5 py-0.5 rounded uppercase">{item.badge}</span>
                </div>
                <p className="text-[10px] text-subtle">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA: Pergunta de vínculo */}
      <div className="bg-ink rounded-xl p-5 space-y-3">
        <div className="space-y-2">
          <div className="text-[10px] font-mono font-bold text-white/60 uppercase tracking-wider">Pergunta de vínculo</div>
          <h3 className="text-sm font-bold text-white">Qual relação você gostaria de nutrir melhor nos próximos dias?</h3>
        </div>
        <input
          type="text"
          value={intenção}
          onChange={(e) => setIntenção(e.target.value)}
          placeholder="Escreva sua intenção rápida..."
          className="w-full text-xs border border-white/20 rounded-lg p-2.5 bg-white/10 text-white placeholder-white/50 focus:outline-hidden focus:border-white/40"
        />
        <div className="flex gap-2">
          <button className="flex-1 bg-white text-ink text-[11px] font-semibold rounded-lg px-4 py-2.5 hover:bg-white/90 transition-colors">
            Registrar intenção
          </button>
          <button
            onClick={() => setShowIntenção(false)}
            className="text-[11px] font-semibold text-white/60 border border-white/20 rounded-lg px-4 py-2.5 hover:border-white/40 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>

    </div>
  );
}
