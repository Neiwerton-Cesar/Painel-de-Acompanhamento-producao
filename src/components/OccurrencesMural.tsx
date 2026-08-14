import React, { useState } from 'react';
import { 
  AlertOctagon, 
  Wrench, 
  Zap, 
  AlertTriangle, 
  Scale, 
  CheckCircle2, 
  Clock, 
  User, 
  Filter, 
  Plus, 
  Search, 
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { OccurrenceItem, OccurrenceType, SectorType } from '../types';

interface OccurrencesMuralProps {
  occurrences: OccurrenceItem[];
  onToggleStatus: (id: string) => void;
  onOpenNewRecord: (sector?: SectorType) => void;
}

export const OccurrencesMural: React.FC<OccurrencesMuralProps> = ({
  occurrences,
  onToggleStatus,
  onOpenNewRecord,
}) => {
  const [sectorFilter, setSectorFilter] = useState<string>('TODOS');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('TODOS');

  // Sort chronological (newest first)
  const sortedOccurrences = [...occurrences].sort((a, b) => {
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  // Filtered
  const filtered = sortedOccurrences.filter((item) => {
    const matchesSector = sectorFilter === 'TODOS' || item.setor === sectorFilter;
    const matchesStatus = 
      statusFilter === 'TODOS' || 
      (statusFilter === 'ATIVOS' && item.status !== 'Normalizado') ||
      (statusFilter === 'NORMALIZADOS' && item.status === 'Normalizado');
    const matchesSearch = 
      searchTerm === '' ||
      item.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.responsavel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tipo.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSector && matchesStatus && matchesSearch;
  });

  // Helper for type badges
  const getTypeBadge = (tipo: OccurrenceType) => {
    switch (tipo) {
      case 'Parada Mecânica':
        return {
          icon: Wrench,
          color: 'bg-rose-500/15 text-rose-400 border-rose-500/40',
          dot: 'bg-rose-500',
        };
      case 'Parada Elétrica':
        return {
          icon: Zap,
          color: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
          dot: 'bg-amber-400',
        };
      case 'Alerta de Qualidade':
        return {
          icon: AlertTriangle,
          color: 'bg-purple-500/15 text-purple-300 border-purple-500/40',
          dot: 'bg-purple-400',
        };
      case 'Status da Balança':
        return {
          icon: Scale,
          color: 'bg-blue-500/15 text-blue-300 border-blue-500/40',
          dot: 'bg-blue-400',
        };
      case 'Registro de Rotina':
      default:
        return {
          icon: CheckCircle2,
          color: 'bg-slate-500/15 text-slate-300 border-slate-700',
          dot: 'bg-slate-400',
        };
    }
  };

  return (
    <div 
      id="secao-mural-ocorrencias"
      className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden mt-2"
    >
      {/* Header of Mural */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <AlertOctagon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight font-display">
                Mural de Ocorrências Recentes
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono-code font-bold">
                {filtered.length} registro{filtered.length !== 1 ? 's' : ''}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Histórico cronológico de paradas, alertas técnicos e ocorrências operacionais
            </p>
          </div>
        </div>

        {/* Quick Add Button */}
        <button
          id="btn-add-ocorrencia-mural"
          onClick={() => onOpenNewRecord()}
          className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors shrink-0"
        >
          <Plus className="w-4 h-4 text-emerald-400" />
          <span>Nova Ocorrência</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 my-4">
        
        {/* Sector Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {['TODOS', 'Desfibramento', 'Descasque', 'Ralo', 'Outros'].map((sector) => {
            const isSelected = sectorFilter === sector;
            return (
              <button
                key={sector}
                id={`filter-sector-${sector.toLowerCase()}`}
                onClick={() => setSectorFilter(sector)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'bg-slate-950/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {sector === 'TODOS' ? 'Todos os Setores' : sector}
              </button>
            );
          })}
        </div>

        {/* Search input and Status selector */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-48">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar ocorrência..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500/50"
          >
            <option value="TODOS">Todos Status</option>
            <option value="ATIVOS">Pendentes / Ativos</option>
            <option value="NORMALIZADOS">Normalizados</option>
          </select>
        </div>
      </div>

      {/* Occurrences List Timeline */}
      {filtered.length === 0 ? (
        <div className="text-center py-10 bg-slate-950/40 rounded-xl border border-slate-800/80">
          <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto mb-2 opacity-80" />
          <p className="text-sm font-semibold text-slate-300">Nenhuma ocorrência encontrada</p>
          <p className="text-xs text-slate-500 mt-1">
            Todas as linhas estão operando sem pendências para os filtros selecionados.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => {
            const badge = getTypeBadge(item.tipo);
            const Icon = badge.icon;
            const isResolved = item.status === 'Normalizado';

            return (
              <div
                key={item.id}
                id={`occurrence-card-${item.id}`}
                className={`p-4 rounded-xl border transition-all ${
                  isResolved
                    ? 'bg-slate-950/50 border-slate-800/80 opacity-80 hover:opacity-100'
                    : 'bg-slate-950/90 border-slate-700/80 hover:border-slate-600 shadow-md'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  
                  {/* Left content */}
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg border shrink-0 mt-0.5 ${badge.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-200">
                          {item.setor}
                        </span>
                        <span className="text-slate-600">•</span>
                        <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${badge.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`}></span>
                          {item.tipo}
                        </span>
                        {item.duracaoMinutos && (
                          <span className="text-[11px] font-mono-code text-amber-300 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-900/40">
                            Parada: {item.duracaoMinutos} min
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm font-bold text-white tracking-tight">
                        {item.titulo}
                      </h3>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        {item.descricao}
                      </p>

                      {item.acaoCorretiva && (
                        <div className="mt-2 text-xs bg-slate-900/90 p-2 rounded-lg border border-slate-800 text-slate-400">
                          <span className="font-semibold text-emerald-400">Ação Corretiva: </span>
                          {item.acaoCorretiva}
                        </div>
                      )}

                      {/* Meta Information */}
                      <div className="flex items-center gap-3 pt-1.5 text-[11px] text-slate-500 flex-wrap">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3 text-slate-400" />
                          <span className="text-slate-300 font-medium">{item.responsavel}</span>
                        </span>
                        <span>•</span>
                        <span>{item.turno}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Action / Status */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                    <div className="flex items-center gap-1 font-mono-code text-xs text-slate-400">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>{item.hora || 'Hoje'}</span>
                    </div>

                    <button
                      id={`btn-toggle-occurrence-${item.id}`}
                      onClick={() => onToggleStatus(item.id)}
                      className={`text-xs px-2.5 py-1 rounded-lg border font-semibold flex items-center gap-1.5 transition-all ${
                        isResolved
                          ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30 hover:bg-emerald-900/40'
                          : 'bg-amber-950/40 text-amber-300 border-amber-500/40 hover:bg-emerald-600 hover:text-white'
                      }`}
                      title={isResolved ? 'Marcar como reaberto' : 'Marcar como normalizado/resolvido'}
                    >
                      {isResolved ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Normalizado</span>
                        </>
                      ) : (
                        <>
                          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                          <span>Marcar Resolvido</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
