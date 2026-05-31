import React from 'react';

export function ProfilePage() {
  return (
    <div className="space-y-6 pt-4 text-center animate-fade-in text-[#20201D]">
      <div className="flex flex-col items-center space-y-3.5">
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
            alt="Alex Profile Image"
            referrerPolicy="no-referrer"
            className="w-24 h-24 rounded-full border-2 border-[#6D5DD3] p-1 object-cover"
          />
          <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white animate-pulse" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Alex Ferreira</h2>
          <p className="text-xs text-[#77736B] font-medium mt-0.5">Membro Nexus v2 Intel</p>
        </div>
      </div>
      <div className="bg-white border border-[#E3E0D8]/80 rounded-[24px] p-5 text-left max-w-sm mx-auto space-y-4">
        <div>
          <h3 className="text-[10px] font-mono font-bold text-[#77736B] uppercase tracking-wider mb-2">
            ESTATÍSTICAS DA CONEXÃO
          </h3>
          <div className="space-y-2.5 text-xs font-medium">
            <div className="flex justify-between border-b border-nexus-soft pb-2 text-[#20201D]">
              <span className="text-[#77736B]">Armazenamento</span>
              <span>Local Encrypt (100% Offline)</span>
            </div>
            <div className="flex justify-between border-b border-nexus-soft pb-2 text-[#20201D]">
              <span className="text-[#77736B]">Módulos Ativos</span>
              <span>5 / 5 Ativados</span>
            </div>
            <div className="flex justify-between text-[#20201D]">
              <span className="text-[#77736B]">Sincronização</span>
              <span>Completa</span>
            </div>
          </div>
        </div>
        <div className="bg-[#F7F6F1] border border-[#E3E0D8] p-3.5 rounded-[16px] text-[11px] leading-relaxed text-[#77736B] italic text-center">
          &ldquo;Seu espaço de autoaprendizado está ativo. Parâmetros adicionais de perfil serão estruturados nos próximos passos de evolução.&rdquo;
        </div>
      </div>
    </div>
  );
}
