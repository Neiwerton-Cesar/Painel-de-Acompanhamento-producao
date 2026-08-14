import React from 'react';
import { Users, UserCheck, UserX, Sun, UserMinus, ShieldAlert, ArrowRight } from 'lucide-react';
import { StaffData } from '../types';

interface StaffCardProps {
  staff: StaffData;
  onOpenNewRecord: () => void;
}

export const StaffCard: React.FC<StaffCardProps> = ({ staff, onOpenNewRecord }) => {
  const totalEfetivoPrevisto = staff.trabalhando + staff.faltas + staff.ferias + staff.postosVagos;
  const taxaPresenca = totalEfetivoPrevisto > 0 
    ? Math.round((staff.trabalhando / (staff.trabalhando + staff.faltas)) * 100) 
    : 0;

  return (
    <div 
      id="card-quadro-de-pessoal"
      className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight font-display">
                Quadro de Pessoal
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono-code font-semibold">
                Efetivo Total: {totalEfetivoPrevisto} colab.
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Acompanhamento de assiduidade e postos de trabalho no turno
            </p>
          </div>
        </div>

        {/* Presence Rate Metric */}
        <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-800 px-3.5 py-2 rounded-xl">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Taxa de Presença</span>
            <span className="text-lg font-bold text-emerald-400 font-mono-code">
              {taxaPresenca}%
            </span>
          </div>
          <div className="w-12 bg-slate-800 h-2 rounded-full overflow-hidden">
            <div 
              style={{ width: `${taxaPresenca}%` }}
              className={`h-full ${taxaPresenca >= 90 ? 'bg-emerald-500' : taxaPresenca >= 75 ? 'bg-amber-500' : 'bg-rose-500'}`}
            />
          </div>
        </div>
      </div>

      {/* 4 Core Pillars Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 my-4">
        
        {/* 1. Total Trabalhando */}
        <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 flex items-center justify-between transition-all hover:bg-emerald-950/30">
          <div>
            <span className="text-xs font-medium text-emerald-300/80 block">Trabalhando (Presentes)</span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono-code mt-1 block">
              {staff.trabalhando}
            </span>
            <span className="text-[11px] text-emerald-500 font-medium">Em atividade</span>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        {/* 2. Faltas */}
        <div className="bg-rose-950/20 border border-rose-500/30 rounded-xl p-4 flex items-center justify-between transition-all hover:bg-rose-950/30">
          <div>
            <span className="text-xs font-medium text-rose-300/80 block">Faltas (Ausências)</span>
            <span className="text-2xl sm:text-3xl font-black text-rose-400 font-mono-code mt-1 block">
              {staff.faltas}
            </span>
            <span className="text-[11px] text-rose-500 font-medium">Não justificadas</span>
          </div>
          <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400">
            <UserX className="w-6 h-6" />
          </div>
        </div>

        {/* 3. Férias */}
        <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-4 flex items-center justify-between transition-all hover:bg-amber-950/30">
          <div>
            <span className="text-xs font-medium text-amber-300/80 block">Férias</span>
            <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono-code mt-1 block">
              {staff.ferias}
            </span>
            <span className="text-[11px] text-amber-500 font-medium">Afastamento regular</span>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
            <Sun className="w-6 h-6" />
          </div>
        </div>

        {/* 4. Postos Vagos */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex items-center justify-between transition-all hover:border-slate-700">
          <div>
            <span className="text-xs font-medium text-slate-400 block">Postos Vagos</span>
            <span className="text-2xl sm:text-3xl font-black text-slate-300 font-mono-code mt-1 block">
              {staff.postosVagos}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">Necessidade de reposição</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-800 text-slate-400">
            <UserMinus className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Sector Breakdown if available */}
      {staff.setores && staff.setores.length > 0 && (
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 mt-2">
          <span className="text-xs font-semibold text-slate-400 block mb-2.5 uppercase tracking-wider">
            Distribuição por Linha e Setor
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {staff.setores.map((s) => (
              <div key={s.setor} className="bg-slate-900/90 border border-slate-800/80 p-2.5 rounded-lg">
                <div className="font-bold text-slate-200 text-xs truncate mb-1">{s.setor}</div>
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span>Presentes:</span>
                  <span className="font-bold text-emerald-400 font-mono-code">{s.presentes}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span>Faltas:</span>
                  <span className={`font-bold font-mono-code ${s.faltas > 0 ? 'text-rose-400' : 'text-slate-500'}`}>
                    {s.faltas}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
