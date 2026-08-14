import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Activity, 
  Truck, 
  Cpu, 
  RotateCw, 
  Users, 
  Sliders,
  ChevronRight,
  Sparkles,
  Info,
  Wifi
} from 'lucide-react';
import { Header } from './components/Header';
import { SectorCards } from './components/SectorCards';
import { StaffCard } from './components/StaffCard';
import { OccurrencesMural } from './components/OccurrencesMural';
import { NewRecordModal } from './components/NewRecordModal';
import { ResetDayModal } from './components/ResetDayModal';
import { 
  DesfibramentoSector, 
  DescasqueSector, 
  RaloSector, 
  StaffData, 
  OccurrenceItem, 
  ShiftType, 
  SectorType, 
  NewRecordFormData 
} from './types';
import { 
  initialDesfibramento, 
  initialDescasque, 
  initialRalo, 
  initialStaff, 
  initialOccurrences 
} from './mockData';
import { 
  initializeFirestoreDefaults,
  subscribeDesfibramento,
  subscribeDescasque,
  subscribeRalo,
  subscribeStaff,
  subscribeOccurrences,
  saveRecordToFirestore,
  toggleOccurrenceInFirestore,
  resetDailyDataToCleanState,
  resetAllFirestoreData
} from './services/productionService';

export default function App() {
  // Real-time state
  const [desfibramento, setDesfibramento] = useState<DesfibramentoSector>(initialDesfibramento);
  const [descasque, setDescasque] = useState<DescasqueSector>(initialDescasque);
  const [ralo, setRalo] = useState<RaloSector>(initialRalo);
  const [staff, setStaff] = useState<StaffData>(initialStaff);
  const [occurrences, setOccurrences] = useState<OccurrenceItem[]>(initialOccurrences);

  const [activeShift, setActiveShift] = useState<ShiftType>('Turno 2 (14:00 - 22:00)');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isResetDayModalOpen, setIsResetDayModalOpen] = useState<boolean>(false);
  const [modalInitialSector, setModalInitialSector] = useState<SectorType>('Desfibramento');
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string; type: 'success' | 'info' } | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isLiveConnected, setIsLiveConnected] = useState<boolean>(false);

  // Initialize and subscribe to Firestore real-time listeners
  useEffect(() => {
    // Initial schema bootstrap and day check
    initializeFirestoreDefaults();

    // 1. Listen to Desfibramento
    const unsubDesfib = subscribeDesfibramento((data) => {
      setDesfibramento(data);
      setIsLiveConnected(true);
    });

    // 2. Listen to Descasque
    const unsubDescasque = subscribeDescasque((data) => {
      setDescasque(data);
      setIsLiveConnected(true);
    });

    // 3. Listen to Ralo
    const unsubRalo = subscribeRalo((data) => {
      setRalo(data);
      setIsLiveConnected(true);
    });

    // 4. Listen to Staff
    const unsubStaff = subscribeStaff((data) => {
      setStaff(data);
      setIsLiveConnected(true);
    });

    // 5. Listen to Occurrences
    const unsubOccurrences = subscribeOccurrences((data) => {
      setOccurrences(data);
      setIsLiveConnected(true);
    });

    return () => {
      unsubDesfib();
      unsubDescasque();
      unsubRalo();
      unsubStaff();
      unsubOccurrences();
    };
  }, []);

  // Trigger Toast Notification
  const showToast = (title: string, desc: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ title, desc, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Open Modal with specific sector pre-selected
  const handleOpenModal = (sector: SectorType = 'Desfibramento') => {
    setModalInitialSector(sector);
    setIsModalOpen(true);
  };

  // Handle saving new record to Firestore in real-time
  const handleSaveRecord = async (formData: NewRecordFormData) => {
    setIsSaving(true);
    try {
      await saveRecordToFirestore(
        formData,
        staff,
        desfibramento,
        descasque,
        ralo
      );

      showToast(
        'Sincronizado na Nuvem!',
        `Os dados do setor ${formData.setor} foram atualizados para todos os gestores conectados.`,
        'success'
      );
    } catch (error) {
      console.error('Error saving record to Firebase:', error);
      showToast(
        'Erro ao salvar',
        'Não foi possível sincronizar na nuvem. Verifique a conexão.',
        'info'
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle Occurrence Status in Firestore
  const handleToggleOccurrence = async (id: string) => {
    const target = occurrences.find((o) => o.id === id);
    if (!target) return;

    try {
      await toggleOccurrenceInFirestore(target);
      const newStatus = target.status === 'Normalizado' ? 'Ativo' : 'Normalizado';
      showToast(
        newStatus === 'Normalizado' ? 'Ocorrência Normalizada' : 'Ocorrência Reaberta',
        `Status atualizado para toda a equipe em tempo real.`,
        'info'
      );
    } catch (error) {
      console.error('Error updating occurrence:', error);
    }
  };

  // Open Password-Protected Reset Day Modal
  const handleResetDay = () => {
    setIsResetDayModalOpen(true);
  };

  // Confirmed Reset after entering password PCP123
  const handleConfirmResetDay = async () => {
    try {
      setOccurrences([]);
      await resetDailyDataToCleanState();
      showToast('Dia Reiniciado', 'Contadores e mural de ocorrências zerados com sucesso.', 'success');
    } catch (error) {
      console.error('Error resetting day:', error);
      showToast('Erro ao zerar', 'Não foi possível zerar os dados na nuvem.', 'info');
    }
  };

  // Reset to default sample state in Firestore
  const handleResetData = async () => {
    if (window.confirm('Deseja restaurar os dados de demonstração com ocorrências de exemplo?')) {
      try {
        await resetAllFirestoreData();
        showToast('Dados Restaurados', 'Painel redefinido na nuvem para o padrão de demonstração.', 'info');
      } catch (error) {
        console.error('Error resetting data:', error);
      }
    }
  };

  // Status Summary Metrics
  const activeStopsCount = occurrences.filter((o) => o.status !== 'Normalizado' && (o.tipo.includes('Parada') || o.tipo.includes('Alerta'))).length;
  const isLineHealthy = descasque.statusParada === 'Normal (Em Operação)' && ralo.statusParada === 'Normal (Em Operação)';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* 1. TOP STICKY HEADER */}
      <Header
        onOpenNewRecord={() => handleOpenModal('Desfibramento')}
        activeShift={activeShift}
        onChangeShift={setActiveShift}
        onResetData={handleResetData}
        onResetDay={handleResetDay}
      />

      {/* 2. MAIN DASHBOARD CONTENT */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-6">
        
        {/* Plant Status & Real-Time Sync Indicator Bar */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg border ${isLineHealthy ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'}`}>
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white block">
                  Status Operacional: {isLineHealthy ? 'Produção Normalizada' : 'Atenção Operacional'}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-400">
                  <Wifi className="w-2.5 h-2.5" />
                  Multiusuário Ativo
                </span>
              </div>
              <span className="text-slate-400 text-[11px]">
                {isLineHealthy 
                  ? 'Todos os 3 setores principais estão operando dentro dos parâmetros nominais.'
                  : `${activeStopsCount} ocorrência(s) de parada ou alerta registradas no turno.`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800 text-slate-300 font-mono-code">
              Desfibramento: <strong className="text-emerald-400">Ativo</strong>
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800 text-slate-300 font-mono-code">
              Descasque: <strong className={descasque.statusParada === 'Normal (Em Operação)' ? 'text-emerald-400' : 'text-rose-400'}>{descasque.statusParada === 'Normal (Em Operação)' ? 'Ativo' : 'Parada'}</strong>
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800 text-slate-300 font-mono-code">
              Ralo: <strong className={ralo.statusParada === 'Normal (Em Operação)' ? 'text-emerald-400' : 'text-amber-400'}>{ralo.statusParada === 'Normal (Em Operação)' ? 'Ativo' : 'Parada'}</strong>
            </span>
          </div>
        </div>

        {/* 3 SECTOR OVERVIEW CARDS */}
        <section aria-label="Setores Principais">
          <SectorCards
            desfibramento={desfibramento}
            descasque={descasque}
            ralo={ralo}
            onOpenSectorRecord={handleOpenModal}
          />
        </section>

        {/* CONSOLIDATED STAFF CARD */}
        <section aria-label="Quadro de Pessoal">
          <StaffCard 
            staff={staff} 
            onOpenNewRecord={() => handleOpenModal('Desfibramento')} 
          />
        </section>

        {/* RECENT OCCURRENCES MURAL */}
        <section aria-label="Mural de Ocorrências">
          <OccurrencesMural
            occurrences={occurrences}
            onToggleStatus={handleToggleOccurrence}
            onOpenNewRecord={handleOpenModal}
          />
        </section>

      </main>

      {/* 3. MODAL FOR NEW RECORD */}
      <NewRecordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveRecord}
        initialSector={modalInitialSector}
        currentDesfibramento={desfibramento}
        currentDescasque={descasque}
        currentRalo={ralo}
        currentStaff={staff}
        activeShift={activeShift}
      />

      {/* 3.1 MODAL FOR PASSWORD-PROTECTED RESET DAY */}
      <ResetDayModal
        isOpen={isResetDayModalOpen}
        onClose={() => setIsResetDayModalOpen(false)}
        onConfirm={handleConfirmResetDay}
      />

      {/* 4. FLOATING TOAST NOTIFICATION */}
      {toastMessage && (
        <div 
          id="toast-notification"
          className="fixed bottom-5 right-5 z-50 bg-slate-900 border border-emerald-500/40 text-white px-4 py-3 rounded-xl shadow-2xl flex items-start gap-3 max-w-sm animate-in fade-in slide-in-from-bottom-5 duration-200"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold text-slate-100">{toastMessage.title}</h4>
            <p className="text-xs text-slate-400">{toastMessage.desc}</p>
          </div>
        </div>
      )}

      {/* 5. FOOTER */}
      <footer className="border-t border-slate-900 bg-slate-950/90 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">Sistema de Gestão de Produção Industrial</span>
            <span>•</span>
            <span className="text-emerald-400 font-mono-code font-bold">Cloud Firestore Conectado</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono-code text-[11px]">Sincronização Multi-Dispositivo em Tempo Real</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
