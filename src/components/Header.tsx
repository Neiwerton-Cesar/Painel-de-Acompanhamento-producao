import React, { useState, useEffect } from 'react';
import { Plus, Activity, Factory, Clock, Calendar, RefreshCw, Trash2, RotateCcw } from 'lucide-react';
import { ShiftType } from '../types';

interface HeaderProps {
  onOpenNewRecord: () => void;
  activeShift: ShiftType;
  onChangeShift: (shift: ShiftType) => void;
  onResetData: () => void;
  onResetDay: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNewRecord,
  activeShift,
  onChangeShift,
  onResetData,
  onResetDay,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [formattedDate, setFormattedDate] = useState<string>('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      
      // Date in Portuguese: e.g. "Sexta-feira, 14 de Agosto de 2026"
      const dateStr = now.toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
      // Capitalize first letter of weekday
      const capitalizedDate = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
      setFormattedDate(capitalizedDate);

      // Time: e.g. "13:26:45"
      const timeStr = now.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setCurrentTime(timeStr);
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
          
          {/* Brand & Title */}
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shrink-0 shadow-inner">
              <Factory className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-white font-display">
                  Painel de Acompanhamento de Produção
                </h1>
                <div className="flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/80 border border-emerald-500/30 text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Tempo Real
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono-code font-bold bg-blue-950/80 border border-blue-500/30 text-blue-300" title="Sincronizado entre todos os celulares e computadores">
                    <Activity className="w-3 h-3 text-blue-400" />
                    Nuvem Ativa
                  </span>
                </div>
              </div>
              
              {/* Subtitle / Date */}
              <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-400 mt-0.5 flex-wrap">
                <span className="flex items-center gap-1.5 bg-slate-950/60 px-2 py-0.5 rounded border border-slate-800 text-slate-300">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-semibold text-white">{formattedDate || 'Carregando data...'}</span>
                </span>
                <span className="text-slate-600 hidden sm:inline">•</span>
                <span className="flex items-center gap-1 font-mono-code text-slate-400 text-xs">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>{currentTime || '00:00:00'}</span>
                </span>
                <span className="text-[11px] text-amber-400/90 font-medium hidden lg:inline">
                  (Dados e ocorrências isolados por dia)
                </span>
              </div>
            </div>
          </div>

          {/* Action Area */}
          <div className="flex items-center justify-between sm:justify-end gap-2.5 flex-wrap">
            {/* Shift Selector */}
            <div className="flex items-center bg-slate-950/80 border border-slate-800 rounded-lg p-1 text-xs">
              <span className="px-2 text-slate-400 text-xs font-medium hidden xl:inline">Turno:</span>
              {(['Turno 1 (06:00 - 14:00)', 'Turno 2 (14:00 - 22:00)', 'Turno 3 (22:00 - 06:00)'] as ShiftType[]).map((shift, idx) => {
                const isSelected = activeShift === shift;
                const label = `T${idx + 1}`;
                return (
                  <button
                    key={shift}
                    id={`shift-btn-${idx + 1}`}
                    onClick={() => onChangeShift(shift)}
                    title={shift}
                    className={`px-2.5 py-1 rounded font-semibold transition-all ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Zerar Dia Manualmente */}
            <button
              id="btn-zerar-dia"
              onClick={onResetDay}
              title="Zerar dados de produção e ocorrências do dia para iniciar novo dia limpo"
              className="flex items-center gap-1 px-2.5 py-2 rounded-lg bg-slate-950 border border-amber-500/30 text-amber-400 hover:text-amber-300 hover:bg-amber-950/30 text-xs font-semibold transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Zerar Dia</span>
            </button>

            {/* Primary Action: + Novo Registro */}
            <button
              id="btn-novo-registro-header"
              onClick={onOpenNewRecord}
              className="flex items-center gap-2 px-4 py-2 sm:py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm sm:text-base rounded-xl transition-all duration-200 shadow-md shadow-emerald-950/50 hover:shadow-emerald-500/20 active:scale-95"
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
              <span>+ Novo Registro</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
