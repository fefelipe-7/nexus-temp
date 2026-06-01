import React, { useState } from 'react';
import { HeartHandshake, Users, Star, Target, BookOpen, Clock, Heart, Sparkles, Plus, ArrowRight, MessageCircle, GraduationCap } from 'lucide-react';
import { storage } from '../../lib/storage';
import { useNexusAlert } from '../../app/providers/NexusAlertProvider';
import ComunidadePage from './ComunidadePage';
import RelacionamentosPage from './RelacionamentosPage';

interface RelationsModulePageProps {
  selectedDate: string;
  refreshCount: number;
  triggerRefresh: () => void;
}

export default function RelationsModulePage({ selectedDate, refreshCount, triggerRefresh }: RelationsModulePageProps) {
  const [showComunidade, setShowComunidade] = useState(false);
  const [showRelacionamentos, setShowRelacionamentos] = useState(false);
  const { showAlert } = useNexusAlert();

  if (showComunidade) {
    return <ComunidadePage onBack={() => setShowComunidade(false)} />;
  }

  if (showRelacionamentos) {
    return <RelacionamentosPage onBack={() => setShowRelacionamentos(false)} />;
  }

  const registros = storage.getRegistros();
  const pessoas = storage.getPeople();

  // Calcular métricas
  const energiaMedia = Math.round(
    registros.reduce((acc, r) => acc + ((r.humor || 7) * 10), 0) / (registros.length || 1)
  );
  const totalExperiencias = 6;
  const totalProjetos = 3;

  return (
    <div className="space-y-5 text-ink bg-muted pb-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xs font-bold font-mono text-subtle uppercase tracking-wider">MÓDULO PESSOAL: VIDA</h2>
          <p className="text-xs text-subtle mt-1">Crie metas, progrida, projete e desenhe sua vida pessoal.</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-muted border border-line flex items-center justify-center">
          <HeartHandshake className="w-4 h-4 text-ink" />
        </div>
      </div>

      {/* Seu momento atual */}
      <div className="bg-card border border-line rounded-2xl p-5 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-sm font-bold text-ink">Seu momento atual</h3>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-2">
                <div className="relative w-12 h-12">
                  <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="16" fill="none" stroke="var(--color-muted)" strokeWidth="3" />
                    <circle cx="18" cy="18" r="16" fill="none" stroke="var(--color-ink)" strokeWidth="3" 
                      strokeDasharray={`${energiaMedia} 100`} strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-ink">{energiaMedia}%</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-ink">Energia</div>
                  <div className="text-[10px] text-subtle">Média alta</div>
                </div>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-1.5">
                  <Star className="w-3 h-3 text-ink" />
                  <span className="text-subtle">{totalExperiencias} Experiências</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Target className="w-3 h-3 text-ink" />
                  <span className="text-subtle">{totalProjetos} Projetos</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p className="text-[11px] text-subtle">Pensamentos e projetos levam mais força</p>
        <div className="flex justify-end">
          <button className="text-[11px] font-semibold text-ink flex items-center gap-1 hover:gap-2 transition-all">
            Ver mais <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Module cards row */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
        {[
          { label: 'Integração', icon: HeartHandshake },
          { label: 'Experiência', icon: Star },
          { label: 'Laser', icon: Target },
          { label: 'Aprendizado', icon: BookOpen },
          { label: 'Propósito', icon: Heart },
          { label: 'Devido', icon: Clock },
          { label: 'Núcleo', icon: Target },
          { label: 'Comunidade', icon: Users },
          { label: 'Relacionamentos', icon: HeartHandshake },
        ].map((item, i) => (
          <button key={i} className="shrink-0 bg-card border border-line rounded-xl px-3 py-2.5 flex items-center gap-2 hover:border-ink transition-colors"
            onClick={() => {
              if (item.label === 'Comunidade') setShowComunidade(true);
              else if (item.label === 'Relacionamentos') setShowRelacionamentos(true);
            }}>
            <item.icon className="w-3.5 h-3.5 text-ink" />
            <span className="text-[11px] font-semibold text-ink whitespace-nowrap">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Relações estão sustentando sua energia */}
      <div className="bg-card border border-line rounded-xl p-4 space-y-3">
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-ink">Relações estão sustentando sua energia</h3>
          <p className="text-[11px] text-subtle leading-relaxed">
            Os dias com menos contato social podem aumentar o risco de depressão e diminuir sua motivação.
          </p>
        </div>
        <button className="w-full bg-card border border-line rounded-lg px-4 py-2.5 text-[11px] font-semibold text-ink hover:border-ink transition-colors">
          Ver relações que mais impactam seu bem-estar
        </button>
      </div>

      {/* Mapa da vida */}
      <div className="bg-card border border-line rounded-xl p-4 space-y-3">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-ink">Mapa da vida</h3>
          <p className="text-[11px] text-subtle">Conheça seus padrões e tendências de felicidade ao longo do tempo.</p>
        </div>
        <div className="space-y-2.5">
          {[
            { label: 'Bem-estar', value: 92 },
            { label: 'Comunidade', value: 82 },
            { label: 'Participação', value: 78 },
          ].map((item, i) => (
            <div key={i} className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-subtle font-medium">{item.label}</span>
                <span className="font-bold text-ink">{item.value}%</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-ink rounded-full transition-all" style={{ width: `${item.value}%` }} />
              </div>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-subtle leading-relaxed">
          Conforme você passa por mudanças em suas rotinas, sua participação muda, mas permanece positiva.
        </p>
      </div>

      {/* Comunidade */}
      <div className="bg-card border border-line rounded-xl p-4 space-y-3 cursor-pointer hover:border-ink transition-colors" onClick={() => setShowComunidade(true)}>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-ink">Comunidade</h3>
            <p className="text-[11px] text-subtle">Participação, apoio e interação</p>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-ink">2</div>
            <div className="text-[10px] text-subtle">Média</div>
          </div>
        </div>
        <p className="text-[11px] text-subtle leading-relaxed">
          Seu tempo de participação cresce quando sua participação ativa, não apenas passiva.
        </p>
        <button className="text-[11px] font-semibold text-ink border border-line rounded-lg px-3 py-1.5 hover:border-ink transition-colors">
          Ver mais
        </button>
      </div>

      {/* Experiências */}
      <div className="bg-card border border-line rounded-xl p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-ink">Experiências</h3>
            <div className="flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-ink" />
              <span className="text-lg font-bold text-ink">3</span>
            </div>
          </div>
        </div>
        <p className="text-[11px] text-subtle leading-relaxed">
          Você já teve experiências que lhe deram mais confiança ou inspiração?
        </p>
        <button className="flex items-center gap-1.5 bg-ink hover:bg-ink/90 text-white text-[11px] font-semibold rounded-lg px-3 py-2 transition-colors">
          <Plus className="w-3 h-3" />
          Adicionar experiência
        </button>
      </div>

      {/* Laser e hábitos */}
      <div className="bg-card border border-line rounded-xl p-4 space-y-3">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-ink">Laser e hábitos</h3>
          <p className="text-[11px] text-subtle">Crie hábitos para melhorar sua saúde mental e emocional</p>
        </div>
        <div className="flex gap-3">
          <div className="flex-1 bg-muted rounded-lg p-2.5 border border-line">
            <div className="text-[10px] text-subtle">Hábitos</div>
            <div className="text-sm font-bold text-ink">3</div>
          </div>
          <div className="flex-1 bg-muted rounded-lg p-2.5 border border-line">
            <div className="text-[10px] text-subtle">Média</div>
            <div className="text-sm font-bold text-ink">3</div>
          </div>
        </div>
        <p className="text-[10px] text-subtle leading-relaxed">
          Seu laser parece manter sua energia quando envolve criação ou inovação.
        </p>
      </div>

      {/* Aprendizados */}
      <div className="bg-card border border-line rounded-xl p-4 space-y-3">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-ink">Aprendizados</h3>
        </div>
        <div className="flex gap-3">
          <div className="flex-1 bg-muted rounded-lg p-2.5 border border-line">
            <div className="text-[10px] text-subtle">Tarefas concluídas</div>
            <div className="text-sm font-bold text-ink">2</div>
          </div>
          <div className="flex-1 bg-muted rounded-lg p-2.5 border border-line">
            <div className="text-[10px] text-subtle">Aplicativos</div>
            <div className="text-sm font-bold text-ink">4</div>
          </div>
        </div>
        <p className="text-[10px] text-subtle leading-relaxed">
          As aprendizagens acumuladas, mais parte da sua identidade.
        </p>
        <button className="text-[11px] font-semibold text-ink border border-line rounded-lg px-3 py-1.5 hover:border-ink transition-colors">
          Ver mais aprendizados
        </button>
      </div>

      {/* Propósito e valores */}
      <div className="bg-card border border-line rounded-xl p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-ink">Propósito e valores</h3>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-ink">78%</div>
            <div className="text-[10px] text-subtle">Crescimento</div>
          </div>
        </div>
        <p className="text-[11px] text-subtle leading-relaxed">
          As decisões recentes parecem mais alinhadas com seus valores.
        </p>
        <button className="flex items-center gap-1.5 bg-ink hover:bg-ink/90 text-white text-[11px] font-semibold rounded-lg px-3 py-2 transition-colors">
          <Plus className="w-3 h-3" />
          Definir propósito
        </button>
      </div>

      {/* Decisões */}
      <div className="bg-card border border-line rounded-xl p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-ink">Decisões</h3>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-ink">3</div>
          </div>
        </div>
        <p className="text-[11px] text-subtle leading-relaxed">
          Você decidiu recusar oportunidades para uma busca por mais controle da vida.
        </p>
        <button className="text-[11px] font-semibold text-ink border border-line rounded-lg px-3 py-1.5 hover:border-ink transition-colors">
          Ver mais decisões
        </button>
      </div>

      {/* Marcos */}
      <div className="bg-card border border-line rounded-xl p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-ink">Marcos</h3>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-ink">2</div>
          </div>
        </div>
        <p className="text-[11px] text-subtle leading-relaxed">
          Você passou entre uma fase de reorganização, descobrindo novos caminhos.
        </p>
        <button className="text-[11px] font-semibold text-ink border border-line rounded-lg px-3 py-1.5 hover:border-ink transition-colors">
          Ver mais marcos
        </button>
      </div>

      {/* Linha do tempo recente */}
      <div className="bg-card border border-line rounded-xl p-4 space-y-3">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-ink">Linha do tempo recente</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-muted border border-line flex items-center justify-center shrink-0">
              <MessageCircle className="w-3.5 h-3.5 text-ink" />
            </div>
            <div className="flex-1 space-y-0.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-ink">Conversa importante com amigo</h4>
                <span className="text-[10px] text-subtle">há 1 dia</span>
              </div>
              <p className="text-[11px] text-subtle">Você marcou essa conversa como importante para você.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-muted border border-line flex items-center justify-center shrink-0">
              <GraduationCap className="w-3.5 h-3.5 text-ink" />
            </div>
            <div className="flex-1 space-y-0.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-ink">Começou um novo curso</h4>
                <span className="text-[10px] text-subtle">há 1 semana</span>
              </div>
              <p className="text-[11px] text-subtle">Tenha certeza dos objetivos de aprendizado e evite ser distraído.</p>
            </div>
          </div>
        </div>
        <button className="text-[11px] font-semibold text-ink border border-line rounded-lg px-3 py-1.5 hover:border-ink transition-colors">
          Ver mais atividades
        </button>
      </div>

    </div>
  );
}
