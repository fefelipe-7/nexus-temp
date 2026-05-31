import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  Heart, Activity, Moon, Droplet, Smile, Brain, BookOpen, Compass, 
  Zap, CheckSquare, Target, Wallet, TrendingDown, TrendingUp, Coins, 
  MessageSquare, HeartHandshake, Sparkles, LucideIcon 
} from 'lucide-react';
import { Alert, AlertIcon, AlertTitle } from '../shared/ui/Alert';

// Módulo e submódulo suportados para customização de cores/ícones
export type NexusModule = 'saude' | 'mente' | 'acao' | 'recursos' | 'relacoes' | 'sistema';
export type NexusSubModule = 
  | 'treino' | 'exercicio' | 'sono' | 'agua' | 'hidratacao' | 'nutricao' | 'refeicao' | 'alimentacao'
  | 'humor' | 'diario' | 'foco' | 'meditacao'
  | 'tarefa' | 'todo' | 'habito' | 'projeto'
  | 'gasto' | 'receita'
  | 'conversa' | 'conexao'
  | 'geral' | '';

interface AlertConfig {
  variant: 'primary' | 'success' | 'destructive' | 'info' | 'warning' | 'secondary' | 'mono';
  icon: LucideIcon;
  title: string;
}

// Mapeamento preciso de modulo e submulo para as variantes e ícones do alert-1
export function getAlertConfig(modulo: NexusModule, submodulo: NexusSubModule): AlertConfig {
  switch (modulo) {
    case 'saude':
      if (submodulo === 'sono') {
        return { variant: 'info', icon: Moon, title: 'Saúde • Sono' };
      }
      if (submodulo === 'agua' || submodulo === 'hidratacao') {
        return { variant: 'primary', icon: Droplet, title: 'Saúde • Hidratação' };
      }
      return { variant: 'success', icon: Activity, title: 'Saúde • Exercício físico' };

    case 'mente':
      if (submodulo === 'humor') {
        return { variant: 'warning', icon: Smile, title: 'Mente • Equilíbrio Emocional' };
      }
      if (submodulo === 'diario') {
        return { variant: 'info', icon: BookOpen, title: 'Mente • Linhas de Reflexão' };
      }
      if (submodulo === 'foco' || submodulo === 'meditacao') {
        return { variant: 'info', icon: Compass, title: 'Mente • Consistência Operacional' };
      }
      return { variant: 'info', icon: Brain, title: 'Mente • Alinhamento' };

    case 'acao':
      if (submodulo === 'tarefa' || submodulo === 'todo') {
        return { variant: 'primary', icon: CheckSquare, title: 'Ação • Fluxo de Tarefas' };
      }
      return { variant: 'primary', icon: Target, title: 'Ação • Metas & Hábitos' };

    case 'recursos':
      if (submodulo === 'gasto') {
        return { variant: 'destructive', icon: TrendingDown, title: 'Recursos • Controle Financeiro' };
      }
      if (submodulo === 'receita') {
        return { variant: 'success', icon: TrendingUp, title: 'Recursos • Entrada Financeira' };
      }
      return { variant: 'warning', icon: Wallet, title: 'Recursos • Orçamento' };

    case 'relacoes':
      if (submodulo === 'conversa') {
        return { variant: 'info', icon: MessageSquare, title: 'Relações • Diálogo Ativo' };
      }
      return { variant: 'destructive', icon: Heart, title: 'Relações • Conexão Humana' };

    case 'sistema':
    default:
      return { variant: 'mono', icon: Sparkles, title: 'Nexus Intel' };
  }
}

interface AlertContextType {
  showAlert: (msg: string, modulo: NexusModule, submodulo?: NexusSubModule) => void;
  hideAlert: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function useNexusAlert() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useNexusAlert deve ser utilizado dentro de um NexusAlertProvider');
  }
  return context;
}

interface ProviderProps {
  children: ReactNode;
}

export function NexusAlertProvider({ children }: ProviderProps) {
  const [alert, setAlert] = useState<{
    msg: string;
    modulo: NexusModule;
    submodulo: NexusSubModule;
    id: number;
  } | null>(null);

  const showAlert = (msg: string, modulo: NexusModule, submodulo: NexusSubModule = '') => {
    setAlert({
      msg,
      modulo,
      submodulo,
      id: Date.now() // Força novas animações se disparado consecutivamente
    });

    // Auto dismiss após 3 segundos
    const currentId = Date.now();
    setTimeout(() => {
      setAlert(current => {
        if (current && Math.abs(current.id - currentId) < 100) {
          return null;
        }
        return current;
      });
    }, 3200);
  };

  const hideAlert = () => setAlert(null);

  const config = alert ? getAlertConfig(alert.modulo, alert.submodulo) : null;
  const ActiveIcon = config?.icon;

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      
      {/* Container de Alertas Flutuante responsivo, perfeitamente emoldurado no simulador */}
      <div className="absolute top-[72px] left-4 right-4 z-[9999] pointer-events-none">
        <AnimatePresence mode="wait">
          {alert && config && ActiveIcon && (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: -12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ type: 'spring', damping: 18, stiffness: 300 }}
              className="pointer-events-auto shadow-md rounded-lg overflow-hidden border border-[#E3E0D8]/40"
            >
              <Alert 
                variant={config.variant} 
                appearance="light" 
                close={true} 
                onClose={hideAlert}
                size="sm"
              >
                <AlertIcon>
                  <ActiveIcon />
                </AlertIcon>
                <div className="text-left flex-1 min-w-0">
                  <span className="text-[9.5px] font-mono leading-none tracking-wider text-[#77736B] uppercase block mb-0.5">
                    {config.title}
                  </span>
                  <AlertTitle className="text-[12px] font-bold leading-normal text-[#20201D] break-words">
                    {alert.msg}
                  </AlertTitle>
                </div>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AlertContext.Provider>
  );
}
