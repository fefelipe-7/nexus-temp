import React from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { SleepWizard, MealWizard, WorkoutWizard, ExpenseWizard, MoodWizard, JournalWizard, TaskWizard, HabitWizard } from '../../features/register';
import { WIZARD_MAP } from './routes';

interface WizardPageProps {
  selectedDate: string;
  refreshCount: number;
  onSaveSuccess: () => void;
}

export function WizardPage({ selectedDate, onSaveSuccess }: WizardPageProps) {
  const { wizard: wizardSlug } = useParams<{ wizard: string }>();
  const navigate = useNavigate();

  if (!wizardSlug) return <Navigate to="/home" />;

  const resolved = WIZARD_MAP[wizardSlug];
  if (!resolved) return <Navigate to="/home" />;

  const onClose = () => navigate('/home');
  const wizardProps = { selectedDate, onClose, onSaveSuccess };

  switch (resolved) {
    case 'sono': return <SleepWizard {...wizardProps} />;
    case 'refeicao': return <MealWizard {...wizardProps} />;
    case 'treino': return <WorkoutWizard {...wizardProps} />;
    case 'gasto': return <ExpenseWizard {...wizardProps} />;
    case 'humor': return <MoodWizard {...wizardProps} />;
    case 'journal': return <JournalWizard {...wizardProps} />;
    case 'tarefa': return <TaskWizard {...wizardProps} />;
    case 'habito': return <HabitWizard {...wizardProps} />;
    default: return <Navigate to="/home" />;
  }
}
