import React from 'react';
import { 
  Truck, 
  Layers, 
  Scale, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Cpu, 
  Wrench, 
  Zap, 
  Package, 
  CircleDot, 
  RotateCw,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { DesfibramentoSector, DescasqueSector, RaloSector, ScaleStatus, StopStatus } from '../types';

interface SectorCardsProps {
  desfibramento: DesfibramentoSector;
  descasque: DescasqueSector;
  ralo: RaloSector;
  onOpenSectorRecord: (sector: 'Desfibramento' | 'Descasque' | 'Ralo') => void;
}

export const SectorCards: React.FC<SectorCardsProps> = ({
  desfibramento,
  descasque,
  ralo,
  onOpenSectorRecord,
}) => {
  // Helper for scale status styling
  const getScaleBadge = (status: ScaleStatus) => {
    switch (status) {
      case 'Operacional':
        return {
          label: 'Operacional',
          color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          dot: 'bg-emerald-400',
          icon: CheckCircle2,
        };
      case 'Calibração Pendente':
        return {
          label: 'Calibração Pendente',
          color: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          dot: 'bg-amber-400',
          icon: AlertTriangle,
        };
      case 'Em Manutenção':
        return {
          label: 'Em Manutenção',
          color: 'bg-amber-500/10 text-amber-300 border-amber-500/40',
          dot: 'bg-amber-400',
          icon: Wrench,
        };
      case 'Inoperante':
      default:
        return {
          label: 'Inoperante / Parada',
          color: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
          dot: 'bg-rose-400',
          icon: XCircle,
        };
    }
  };

  // Helper for stop status styling
  const getStopStatusBadge = (status: StopStatus) => {
    if (status === 'Normal (Em Operação)') {
      return {
        label: 'Em Operação Normal',
        color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
        dot: 'bg-emerald-400 animate-pulse',
        icon: CheckCircle2,
        type: 'normal',
      };
    } else if (status === 'Parada Mecânica') {
      return {
        label: 'Parada Mecânica',
        color: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        dot: 'bg-rose-500 animate-ping',
        icon: Wrench,
        type: 'mecanica',
      };
    } else if (status === 'Parada Elétrica') {
      return {
        label: 'Parada Elétrica',
        color: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        dot: 'bg-amber-400 animate-ping',
        icon: Zap,
        type: 'eletrica',
      };
    } else {
      return {
        label: status,
        color: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
        dot: 'bg-amber-400',
        icon: AlertTriangle,
        type: 'alerta',
      };
    }
  };

  // Helper for coconut quality in Ralo
  const getQualityBadge = (qual: string) => {
    switch (qual) {
      case 'Normal':
        return {
          label: 'Normal (Padrão)',
          color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        };
      case 'Quebradiço':
        return {
          label: 'Quebradiço (Atenção)',
          color: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
        };
      case 'Queimado':
        return {
          label: 'Queimado (Crítico)',
          color: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        };
      case 'Misto':
      default:
        return {
          label: 'Misto / Regular',
          color: 'bg-blue-500/15 text-blue-300 border-blue-500/40',
        };
    }
  };

  // Stock ratio calculation for Desfibramento
  const totalEstoque = (desfibramento.estoqueInteiro || 0) + (desfibramento.estoqueFurado || 0);
  const percentInteiro = totalEstoque > 0 ? Math.round((desfibramento.estoqueInteiro / totalEstoque) * 100) : 0;
  const percentFurado = totalEstoque > 0 ? 100 - percentInteiro : 0;

  const descasqueScale = getScaleBadge(descasque.statusBalanca);
  const descasqueStop = getStopStatusBadge(descasque.statusParada);

  const raloScale = getScaleBadge(ralo.statusBalanca);
  const raloStop = getStopStatusBadge(ralo.statusParada);
  const raloQuality = getQualityBadge(ralo.qualidadeCoco);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      
      {/* ---------------- CARD 1: DESFIBRAMENTO ---------------- */}
      <div 
        id="card-setor-desfibramento"
        className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between relative overflow-hidden group hover:border-slate-700 transition-all duration-200"
      >
        {/* Top Header */}
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-400 font-mono-code">Setor 01</span>
                <h2 className="text-lg font-bold text-white tracking-tight font-display">Desfibramento</h2>
              </div>
            </div>
            <button
              id="btn-quick-record-desfibramento"
              onClick={() => onOpenSectorRecord('Desfibramento')}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 flex items-center gap-1 transition-colors"
              title="Registrar atualização no Desfibramento"
            >
              <span>Registrar</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Core Metrics Grid */}
          <div className="grid grid-cols-2 gap-3 my-4">
            
            {/* Carretas em Processo */}
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5 flex flex-col justify-between">
              <span className="text-xs font-medium text-slate-400">Carretas em Processo</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-white font-mono-code">
                  {typeof desfibramento.carretasEmProcesso === 'number' 
                    ? desfibramento.carretasEmProcesso.toLocaleString('pt-BR', { maximumFractionDigits: 2 }) 
                    : desfibramento.carretasEmProcesso}
                </span>
                <span className="text-xs text-emerald-400 font-medium">no pátio</span>
              </div>
            </div>

            {/* Total Carretas Dia */}
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5 flex flex-col justify-between">
              <span className="text-xs font-medium text-slate-400">Processadas no Dia</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-emerald-400 font-mono-code">
                  {typeof desfibramento.carretasProcessadasDia === 'number' 
                    ? desfibramento.carretasProcessadasDia.toLocaleString('pt-BR', { maximumFractionDigits: 2 }) 
                    : desfibramento.carretasProcessadasDia}
                </span>
                <span className="text-xs text-slate-500 font-medium">/ {desfibramento.metaCarretasDia} meta</span>
              </div>
            </div>

          </div>

          {/* Total de Cocos Processados (Unidades) */}
          <div className="mb-4 bg-slate-950/80 border border-emerald-500/30 rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-emerald-400" />
                Total de Cocos Processados
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">Produção acumulada no dia</span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-white font-mono-code">
                {(desfibramento.totalCocosProcessados ?? 119000).toLocaleString('pt-BR')}
              </span>
              <span className="text-xs text-emerald-400 font-bold ml-1.5">un</span>
            </div>
          </div>

          {/* Variedade do Coco */}
          <div className="mb-4 bg-slate-950/40 border border-slate-800/60 rounded-xl p-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
              <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-slate-500" />
                Variedade do Coco:
              </span>
              <div className="flex flex-wrap items-center gap-1">
                {(desfibramento.variedadeCoco || 'PB-111').split(',').map((v) => (
                  <span 
                    key={v.trim()} 
                    className="text-xs font-mono-code font-bold px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                  >
                    {v.trim()}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Estoque de Coco: Inteiro x Furado */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-slate-400" />
                Estoque de Coco (Inteiro x Furado)
              </span>
              <span className="text-[11px] font-mono-code text-slate-500">
                Total: {totalEstoque.toLocaleString('pt-BR')} un
              </span>
            </div>

            {/* Visual Ratio Bar */}
            <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden flex mb-2.5">
              <div 
                style={{ width: `${percentInteiro}%` }} 
                className="bg-emerald-500 transition-all duration-500" 
                title={`Inteiro: ${percentInteiro}%`}
              />
              <div 
                style={{ width: `${percentFurado}%` }} 
                className="bg-amber-500 transition-all duration-500" 
                title={`Furado: ${percentFurado}%`}
              />
            </div>

            {/* Quantities Legend */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center justify-between bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="text-slate-400 text-[11px]">Inteiro:</span>
                </div>
                <span className="font-bold text-white font-mono-code">
                  {desfibramento.estoqueInteiro.toLocaleString('pt-BR')}
                </span>
              </div>

              <div className="flex items-center justify-between bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  <span className="text-slate-400 text-[11px]">Furado:</span>
                </div>
                <span className="font-bold text-amber-300 font-mono-code">
                  {desfibramento.estoqueFurado.toLocaleString('pt-BR')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
          <span>Pátio de Alimentação</span>
          <span className="font-mono-code">Atualizado às {desfibramento.ultimaAtualizacao || '13:00'}</span>
        </div>
      </div>


      {/* ---------------- CARD 2: DESCASQUE ---------------- */}
      <div 
        id="card-setor-descasque"
        className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between relative overflow-hidden group hover:border-slate-700 transition-all duration-200"
      >
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase text-blue-400 font-mono-code">Setor 02</span>
                <h2 className="text-lg font-bold text-white tracking-tight font-display">Descasque</h2>
              </div>
            </div>
            <button
              id="btn-quick-record-descasque"
              onClick={() => onOpenSectorRecord('Descasque')}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 flex items-center gap-1 transition-colors"
              title="Registrar atualização no Descasque"
            >
              <span>Registrar</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Registros da Balança (Total em Kg & Total de Caixas) */}
          <div className="grid grid-cols-2 gap-3 my-4">
            {/* Total em Kg */}
            <div className="bg-slate-950/80 border border-blue-500/30 rounded-xl p-3.5 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-blue-300 flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-blue-400" />
                  Total da Balança
                </span>
                <span className="text-[10px] uppercase font-mono-code font-bold px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-500/20">
                  Kg
                </span>
              </div>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-white font-mono-code">
                  {(descasque.totalBalancaKg ?? 14850).toLocaleString('pt-BR')}
                </span>
                <span className="text-xs text-blue-400 font-semibold">kg</span>
              </div>
            </div>

            {/* Total de Caixas */}
            <div className="bg-slate-950/80 border border-blue-500/30 rounded-xl p-3.5 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-blue-300 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-blue-400" />
                  Total de Caixas
                </span>
                <span className="text-[10px] uppercase font-mono-code font-bold px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-500/20">
                  cx
                </span>
              </div>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-blue-300 font-mono-code">
                  {(descasque.totalCaixas ?? 580).toLocaleString('pt-BR')}
                </span>
                <span className="text-xs text-slate-400 font-medium">caixas</span>
              </div>
            </div>
          </div>

          {/* Condição do Coco */}
          <div className="mb-4 bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5">
            <span className="text-xs font-medium text-slate-400 block mb-1.5">Condição do Coco</span>
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-white tracking-tight">
                {descasque.condicaoCoco}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 font-medium">
                Linha 01 à 04
              </span>
            </div>
          </div>

          {/* Status da Balança */}
          <div className="mb-4 bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-slate-400" />
                Status da Balança:
              </span>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${descasqueScale.color}`}>
                <span className={`w-2 h-2 rounded-full ${descasqueScale.dot}`}></span>
                {descasqueScale.label}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Pesagem contínua de amêndoa.
            </p>
          </div>

          {/* Status de Paradas (Mecânica / Elétrica / Normal) */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5">
            <span className="text-xs font-medium text-slate-400 block mb-2">
              Status de Paradas (Mecânica / Elétrica)
            </span>
            
            <div className={`p-3 rounded-lg border flex items-center justify-between ${descasqueStop.color}`}>
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${descasqueStop.dot}`}></span>
                <span className="text-sm font-bold">{descasqueStop.label}</span>
              </div>
              {descasqueStop.type === 'normal' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : descasqueStop.type === 'mecanica' ? (
                <Wrench className="w-5 h-5 text-rose-400 animate-bounce" />
              ) : (
                <Zap className="w-5 h-5 text-amber-400" />
              )}
            </div>

            {descasque.motivoParada && descasqueStop.type !== 'normal' && (
              <p className="text-xs text-rose-300/90 mt-2 bg-rose-950/30 p-2 rounded border border-rose-900/40 font-mono-code">
                Motivo: {descasque.motivoParada}
              </p>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
          <span>Linha de Descasque Manual e Auto</span>
          <span className="font-mono-code">Atualizado às {descasque.ultimaAtualizacao || '13:00'}</span>
        </div>
      </div>


      {/* ---------------- CARD 3: RALO ---------------- */}
      <div 
        id="card-setor-ralo"
        className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between relative overflow-hidden group hover:border-slate-700 transition-all duration-200"
      >
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <RotateCw className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase text-amber-400 font-mono-code">Setor 03</span>
                <h2 className="text-lg font-bold text-white tracking-tight font-display">Ralo</h2>
              </div>
            </div>
            <button
              id="btn-quick-record-ralo"
              onClick={() => onOpenSectorRecord('Ralo')}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 flex items-center gap-1 transition-colors"
              title="Registrar atualização no Ralo"
            >
              <span>Registrar</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Qualidade do Coco (Normal / Quebradiço / Queimado) */}
          <div className="my-4 bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-slate-400" />
                Qualidade do Coco:
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${raloQuality.color}`}>
                {raloQuality.label}
              </span>
            </div>
            <div className="flex gap-1.5 mt-2">
              {(['Normal', 'Quebradiço', 'Queimado'] as const).map((q) => {
                const isActive = ralo.qualidadeCoco === q;
                return (
                  <span
                    key={q}
                    className={`flex-1 text-center text-[10px] py-1 rounded font-semibold transition-all ${
                      isActive
                        ? q === 'Normal'
                          ? 'bg-emerald-500 text-slate-950'
                          : q === 'Quebradiço'
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-rose-500 text-white'
                        : 'bg-slate-900 text-slate-500 border border-slate-800'
                    }`}
                  >
                    {q}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Status da Balança */}
          <div className="mb-4 bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-slate-400" />
                Status da Balança:
              </span>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${raloScale.color}`}>
                <span className={`w-2 h-2 rounded-full ${raloScale.dot}`}></span>
                {raloScale.label}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Transportador aéreo de corrente.
            </p>
          </div>

          {/* Status de Paradas */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5">
            <span className="text-xs font-medium text-slate-400 block mb-2">
              Status de Paradas (Mecânica / Elétrica)
            </span>
            
            <div className={`p-3 rounded-lg border flex items-center justify-between ${raloStop.color}`}>
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${raloStop.dot}`}></span>
                <span className="text-sm font-bold">{raloStop.label}</span>
              </div>
              {raloStop.type === 'normal' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : raloStop.type === 'mecanica' ? (
                <Wrench className="w-5 h-5 text-rose-400 animate-bounce" />
              ) : (
                <Zap className="w-5 h-5 text-amber-400" />
              )}
            </div>

            {ralo.motivoParada && raloStop.type !== 'normal' && (
              <p className="text-xs text-rose-300/90 mt-2 bg-rose-950/30 p-2 rounded border border-rose-900/40 font-mono-code">
                Motivo: {ralo.motivoParada}
              </p>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
          <span>Despeliculamento de améndoa</span>
          <span className="font-mono-code">Atualizado às {ralo.ultimaAtualizacao || '13:00'}</span>
        </div>
      </div>

    </div>
  );
};
