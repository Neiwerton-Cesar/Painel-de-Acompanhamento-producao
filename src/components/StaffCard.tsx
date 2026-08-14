import React from 'react';
import { Users, UserCheck, UserX, Sun, UserMinus, Truck, Cpu, RotateCw } from 'lucide-react';
import { StaffData, SectorStaff } from '../types';

interface StaffCardProps {
  staff: StaffData;
  onOpenNewRecord: () => void;
}

export const StaffCard: React.FC<StaffCardProps> = ({ staff, onOpenNewRecord }) => {
  const validSectors = ['Desfibramento', 'Descasque', 'Ralo'] as const;

  // Extract each of the 3 sectors with fallback values
  const defaultSectorData: Record<'Desfibramento' | 'Descasque' | 'Ralo', SectorStaff> = {
    Desfibramento: { setor: 'Desfibramento', presentes: 14, faltas: 1, ferias: 1, vagos: 1 },
    Descasque: { setor: 'Descasque', presentes: 20, faltas: 1, ferias: 2, vagos: 1 },
    Ralo: { setor: 'Ralo', presentes: 10, faltas: 1, ferias: 1, vagos: 0 },
  };

  const getSectorData = (setorName: 'Desfibramento' | 'Descasque' | 'Ralo'): SectorStaff => {
    const found = staff.setores?.find((s) => s.setor === setorName);
    if (found) {
      return {
        setor: setorName,
        presentes: Number(found.presentes) || 0,
        faltas: Number(found.faltas) || 0,
        ferias: Number(found.ferias) || 0,
        vagos: Number(found.vagos) || 0,
      };
    }
    return defaultSectorData[setorName];
  };

  const sectorDesfib = getSectorData('Desfibramento');
  const sectorDescasque = getSectorData('Descasque');
  const sectorRalo = getSectorData('Ralo');

  // Consolidated across strictly the 3 sectors (Desfibramento, Descasque, Ralo)
  const totalTrabalhando = sectorDesfib.presentes + sectorDescasque.presentes + sectorRalo.presentes;
  const totalFaltas = sectorDesfib.faltas + sectorDescasque.faltas + sectorRalo.faltas;
  const totalFerias = sectorDesfib.ferias + sectorDescasque.ferias + sectorRalo.ferias;
  const totalPostosVagos = sectorDesfib.vagos + sectorDescasque.vagos + sectorRalo.vagos;

  const totalEfetivo = totalTrabalhando + totalFaltas + totalFerias + totalPostosVagos;

  // Taxa de Presença Global (Presentes / (Presentes + Faltas))
  const totalEscalados = totalTrabalhando + totalFaltas;
  const taxaPresenca = totalEscalados > 0 
    ? Math.round((totalTrabalhando / totalEscalados) * 100) 
    : 100;

  const sectorsDisplay = [
    {
      data: sectorDesfib,
      name: 'Desfibramento',
      icon: Truck,
      color: 'text-emerald-400',
      bgLight: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300',
      barColor: 'bg-emerald-500',
    },
    {
      data: sectorDescasque,
      name: 'Descasque',
      icon: Cpu,
      color: 'text-blue-400',
      bgLight: 'bg-blue-500/10 border-blue-500/20 text-blue-300',
      barColor: 'bg-blue-500',
    },
    {
      data: sectorRalo,
      name: 'Ralo',
      icon: RotateCw,
      color: 'text-amber-400',
      bgLight: 'bg-amber-500/10 border-amber-500/20 text-amber-300',
      barColor: 'bg-amber-500',
    },
  ];

  return (
    <div 
      id="card-quadro-de-pessoal"
      className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden space-y-5"
    >
      {/* Header with Title, Total Staff & Attendance Rate */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-bold text-white tracking-tight font-display">
                Quadro de Pessoal
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-950/80 text-blue-300 border border-blue-500/30 font-mono-code font-bold">
                Efetivo Total: {totalEfetivo} colab. (3 Setores)
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Consolidado dos setores Desfibramento, Descasque e Ralo
            </p>
          </div>
        </div>

        {/* Presence Rate Metric */}
        <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-800 px-3.5 py-2 rounded-xl">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Taxa de Presença Geral</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-emerald-400 font-mono-code">
                {taxaPresenca}%
              </span>
              <span className="text-[11px] text-slate-400 font-mono-code">
                ({totalTrabalhando}/{totalEscalados})
              </span>
            </div>
          </div>
          <div className="w-14 bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div 
              style={{ width: `${taxaPresenca}%` }}
              className={`h-full transition-all duration-500 ${
                taxaPresenca >= 90 ? 'bg-emerald-500' : taxaPresenca >= 75 ? 'bg-amber-500' : 'bg-rose-500'
              }`}
            />
          </div>
        </div>
      </div>

      {/* 4 Core Pillars Grid (Consolidado dos 3 setores) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* 1. Total Trabalhando (Presentes) */}
        <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 flex items-center justify-between transition-all hover:bg-emerald-950/30">
          <div>
            <span className="text-xs font-semibold text-emerald-300/90 block">Trabalhando (Presentes)</span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono-code mt-1 block">
              {totalTrabalhando}
            </span>
            <span className="text-[11px] text-emerald-500/90 font-medium">Soma dos 3 setores</span>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        {/* 2. Faltas (Ausências) */}
        <div className="bg-rose-950/20 border border-rose-500/30 rounded-xl p-4 flex items-center justify-between transition-all hover:bg-rose-950/30">
          <div>
            <span className="text-xs font-semibold text-rose-300/90 block">Faltas (Ausências)</span>
            <span className="text-2xl sm:text-3xl font-black text-rose-400 font-mono-code mt-1 block">
              {totalFaltas}
            </span>
            <span className="text-[11px] text-rose-500/90 font-medium">Soma dos 3 setores</span>
          </div>
          <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400">
            <UserX className="w-6 h-6" />
          </div>
        </div>

        {/* 3. Férias */}
        <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-4 flex items-center justify-between transition-all hover:bg-amber-950/30">
          <div>
            <span className="text-xs font-semibold text-amber-300/90 block">Férias</span>
            <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono-code mt-1 block">
              {totalFerias}
            </span>
            <span className="text-[11px] text-amber-500/90 font-medium">Afastamento regular</span>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
            <Sun className="w-6 h-6" />
          </div>
        </div>

        {/* 4. Postos Vagos */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex items-center justify-between transition-all hover:border-slate-700">
          <div>
            <span className="text-xs font-semibold text-slate-300 block">Postos Vagos</span>
            <span className="text-2xl sm:text-3xl font-black text-slate-200 font-mono-code mt-1 block">
              {totalPostosVagos}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">Necessidade de reposição</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-800 text-slate-400">
            <UserMinus className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* DISTRIBUIÇÃO POR LINHA E SETOR (Individual nos 3 setores: Desfibramento, Descasque e Ralo) */}
      <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            Distribuição por Linha e Setor (Individual)
          </span>
          <span className="text-[11px] text-slate-500 font-medium">
            Desfibramento • Descasque • Ralo
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {sectorsDisplay.map((item) => {
            const Icon = item.icon;
            const setorEscalados = item.data.presentes + item.data.faltas;
            const setorEfetivo = item.data.presentes + item.data.faltas + item.data.ferias + item.data.vagos;
            const setorTaxa = setorEscalados > 0 
              ? Math.round((item.data.presentes / setorEscalados) * 100) 
              : 100;

            return (
              <div 
                key={item.name} 
                id={`quadro-setor-${item.name.toLowerCase()}`}
                className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-3 transition-all hover:border-slate-700"
              >
                {/* Sector Title & Rate */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${item.bgLight}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-sm text-white font-display">{item.name}</span>
                  </div>
                  <span className={`text-xs font-mono-code font-bold px-2 py-0.5 rounded-md border ${
                    setorTaxa >= 90 
                      ? 'bg-emerald-950/80 border-emerald-500/30 text-emerald-400' 
                      : setorTaxa >= 75 
                      ? 'bg-amber-950/80 border-amber-500/30 text-amber-400' 
                      : 'bg-rose-950/80 border-rose-500/30 text-rose-400'
                  }`}>
                    {setorTaxa}% pres.
                  </span>
                </div>

                {/* Individual Totals: Presentes x Faltas */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-950/80 border border-slate-800/80 rounded-lg p-2.5">
                    <span className="text-[10px] text-emerald-400 uppercase tracking-wider block font-semibold">
                      Presentes
                    </span>
                    <span className="text-xl font-bold font-mono-code text-emerald-300 block mt-0.5">
                      {item.data.presentes}
                    </span>
                  </div>

                  <div className="bg-slate-950/80 border border-slate-800/80 rounded-lg p-2.5">
                    <span className="text-[10px] text-rose-400 uppercase tracking-wider block font-semibold">
                      Faltas
                    </span>
                    <span className={`text-xl font-bold font-mono-code block mt-0.5 ${item.data.faltas > 0 ? 'text-rose-400' : 'text-slate-500'}`}>
                      {item.data.faltas}
                    </span>
                  </div>
                </div>

                {/* Sub details: Efetivo, Férias e Vagos */}
                <div className="pt-2 border-t border-slate-800/70 flex items-center justify-between text-[11px] text-slate-400 font-mono-code">
                  <span>Efetivo: <strong className="text-slate-200">{setorEfetivo}</strong></span>
                  <span>Férias: <strong className="text-amber-300">{item.data.ferias}</strong></span>
                  <span>Vagos: <strong className="text-slate-300">{item.data.vagos}</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
