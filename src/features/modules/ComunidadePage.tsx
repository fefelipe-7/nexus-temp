import React, { useState } from 'react';
import { ArrowLeft, Users, MessageCircle, Calendar, BookOpen, UserCheck, Target, Plus } from 'lucide-react';

interface ComunidadePageProps {
  onBack: () => void;
}

export default function ComunidadePage({ onBack }: ComunidadePageProps) {
  const [intenção, setIntenção] = useState('');

  return (
    <div className="space-y-5 text-ink bg-muted pb-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-2 hover:bg-card rounded-lg transition-colors cursor-pointer">
          <ArrowLeft className="w-5 h-5 text-ink" />
        </button>
        <div className="flex-1">
          <h2 className="text-sm font-bold text-ink">Comunidade</h2>
          <p className="text-[11px] text-subtle">Grupos, atividades, participação e engajamento</p>
        </div>
      </div>

      {/* Nível de pertencimento */}
      <div className="bg-card border border-line rounded-xl p-5 space-y-4">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-ink">Nível de pertencimento</h3>
          <p className="text-[11px] text-subtle">Seu nível de pertencimento aparece aqui. Quanto mais alto, maior sua participação.</p>
        </div>
        
        {/* Progress circles */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {[1, 2, 3, 4, 5].map((level) => (
              <div key={level} className="flex flex-col items-center gap-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${
                  level <= 4 ? 'bg-ink text-white' : 'bg-muted border border-line text-subtle'
                }`}>
                  {level}
                </div>
                <span className="text-[9px] text-subtle">{level * 10}%</span>
              </div>
            ))}
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-ink">4/5</div>
            <div className="text-[10px] text-subtle">Médio</div>
          </div>
        </div>

        <button className="w-full bg-ink hover:bg-ink/90 text-white text-[11px] font-semibold rounded-lg px-4 py-2.5 transition-colors">
          Participar agora
        </button>
      </div>

      {/* Registro da comunidade */}
      <div className="bg-card border border-line rounded-xl p-4 space-y-3">
        <h3 className="text-sm font-bold text-ink">Registro da comunidade</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted rounded-lg p-3 border border-line space-y-1">
            <div className="text-[10px] text-subtle font-medium">Grupo</div>
            <div className="text-xs font-bold text-ink">Pertencimento</div>
            <div className="text-[10px] text-subtle">Distribuição</div>
          </div>
          <div className="bg-muted rounded-lg p-3 border border-line space-y-1">
            <div className="text-[10px] text-subtle font-medium">Participação</div>
            <div className="text-xs font-bold text-ink">Apoio coletivo</div>
            <div className="text-[10px] text-subtle">Responsabilidade compartilhada</div>
          </div>
        </div>
      </div>

      {/* Participação em grupos */}
      <div className="bg-card border border-line rounded-xl p-4 space-y-3">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-ink">Participação em grupos</h3>
          <div className="text-xs text-subtle">5 participações</div>
        </div>
        
        {/* Timeline */}
        <div className="flex items-center justify-between bg-muted rounded-lg p-3 border border-line">
          {['2023-09', '2023-10', '2023-11', '2024-01', '2024-02'].map((date, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${i < 4 ? 'bg-ink' : 'bg-muted border border-line'}`} />
              <span className="text-[9px] text-subtle">{date}</span>
            </div>
          ))}
        </div>

        <p className="text-[11px] text-subtle">Quando você se conecta, sua motivação muda?</p>
        
        <div className="space-y-2">
          <div className="bg-muted rounded-lg p-2.5 border border-line">
            <div className="text-[10px] text-subtle">Participação em grupos de aprendizado</div>
            <div className="w-full h-1.5 bg-card rounded-full overflow-hidden mt-1.5">
              <div className="h-full bg-ink rounded-full" style={{ width: '60%' }} />
            </div>
          </div>
          <div className="bg-muted rounded-lg p-2.5 border border-line">
            <div className="text-[10px] text-subtle">Participação em grupos de apoio</div>
            <div className="w-full h-1.5 bg-card rounded-full overflow-hidden mt-1.5">
              <div className="h-full bg-ink rounded-full" style={{ width: '40%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Comunidade e motivação */}
      <div className="bg-card border border-line rounded-xl p-4 space-y-3">
        <h3 className="text-sm font-bold text-ink">Comunidade e motivação</h3>
        <p className="text-[11px] text-subtle">Quando você se conecta, sua motivação muda?</p>
        <div className="flex gap-2">
          <button className="flex-1 bg-ink text-white text-[10px] font-semibold rounded-lg px-3 py-2 transition-colors">
            Grupos de aprendizado
          </button>
          <button className="flex-1 bg-ink text-white text-[10px] font-semibold rounded-lg px-3 py-2 transition-colors">
            Grupos de apoio
          </button>
        </div>
      </div>

      {/* Apoio social disponível */}
      <div className="bg-card border border-line rounded-xl p-4 space-y-3">
        <h3 className="text-sm font-bold text-ink">Apoio social disponível</h3>
        <div className="flex items-center justify-around">
          {[1, 2, 1].map((count, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-full bg-muted border border-line flex items-center justify-center">
                <span className="text-sm font-bold text-ink">{count}</span>
              </div>
              <span className="text-[9px] text-subtle">
                {i === 0 ? 'Ativos' : i === 1 ? 'Oferecendo' : 'Recebendo'}
              </span>
            </div>
          ))}
        </div>
        <div className="bg-muted rounded-lg p-2.5 border border-line space-y-1">
          <div className="text-[10px] text-subtle font-medium">Sede de apoio coletivo</div>
          <div className="flex gap-1">
            {[40, 30, 20, 10].map((val, i) => (
              <div key={i} className="flex-1 h-1.5 bg-card rounded-full overflow-hidden">
                <div className="h-full bg-ink rounded-full" style={{ width: `${val}%` }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Conexão no longo do tempo */}
      <div className="bg-card border border-line rounded-xl p-4 space-y-3">
        <h3 className="text-sm font-bold text-ink">Conexão no longo do tempo</h3>
        <div className="bg-muted rounded-lg p-3 border border-line">
          <div className="flex items-center justify-between">
            {[2023, 2023.5, 2024].map((year, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${i < 2 ? 'bg-ink' : 'bg-muted border border-line'}`} />
                <span className="text-[9px] text-subtle">{Math.floor(year)}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-[10px] text-subtle leading-relaxed">
          A conexão com outros membros após o grupo é mais forte quando há interação contínua.
        </p>
      </div>

      {/* Distância e isolamento */}
      <div className="bg-card border border-line rounded-xl p-4 space-y-3">
        <h3 className="text-sm font-bold text-ink">Distância e isolamento</h3>
        <div className="text-xs text-subtle">6 pessoas participaram em grupos</div>
        <div className="grid grid-cols-6 gap-2 bg-muted rounded-lg p-3 border border-line">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className={`rounded-full bg-card border border-line ${
              i < 3 ? 'w-6 h-6' : i < 6 ? 'w-5 h-5' : 'w-4 h-4'
            }`} />
          ))}
        </div>
        <p className="text-[10px] text-subtle leading-relaxed">
          Neste grupo, não há muitos membros que sejam próximos ou que tenham contato frequente.
        </p>
      </div>

      {/* Histórico recente */}
      <div className="bg-card border border-line rounded-xl p-4 space-y-3">
        <h3 className="text-sm font-bold text-ink">Histórico recente</h3>
        <div className="space-y-3">
          {[
            { title: 'Encontros com amigos próximos', time: 'há 1 dia', icon: Users },
            { title: 'Auto de curso', time: 'há 2 dias', icon: BookOpen },
            { title: 'Conversas em grupo online', time: 'há 3 dias', icon: MessageCircle },
            { title: 'Atmosfera em família', time: 'há 7 dias', icon: UserCheck },
            { title: 'Seminário em grupos', time: 'há 1 semana', icon: Calendar },
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
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Banner */}
      <div className="bg-ink rounded-xl p-5 space-y-3">
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-white">Em qual grupo você gostaria de estar mais presente nos próximos dias?</h3>
          <p className="text-[11px] text-white/70">Escreva uma intenção para se juntar ao grupo</p>
        </div>
        <input
          type="text"
          value={intenção}
          onChange={(e) => setIntenção(e.target.value)}
          placeholder="Sua intenção..."
          className="w-full text-xs border border-white/20 rounded-lg p-2.5 bg-white/10 text-white placeholder-white/50 focus:outline-hidden focus:border-white/40"
        />
        <button className="w-full bg-white text-ink text-[11px] font-semibold rounded-lg px-4 py-2.5 hover:bg-white/90 transition-colors">
          Registrar intenção
        </button>
      </div>

    </div>
  );
}
