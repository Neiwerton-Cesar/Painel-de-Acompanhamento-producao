import React, { useState, useEffect } from 'react';
import { 
  X, 
  Truck, 
  Cpu, 
  RotateCw, 
  MoreHorizontal, 
  Users, 
  AlertOctagon, 
  Check, 
  Scale, 
  Layers, 
  Package, 
  Clock, 
  User, 
  Wrench, 
  Zap, 
  Sparkles,
  Save,
  CheckCircle2,
  Info,
  Plus
} from 'lucide-react';
import { 
  SectorType, 
  COCONUT_VARIETIES, 
  CoconutVariety, 
  ScaleStatus, 
  StopStatus, 
  RaloQuality, 
  DescasqueCondition, 
  ShiftType, 
  OccurrenceType,
  NewRecordFormData,
  DesfibramentoSector,
  DescasqueSector,
  RaloSector,
  StaffData,
  SectorStaff
} from '../types';

interface NewRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: NewRecordFormData) => void;
  initialSector?: SectorType;
  currentDesfibramento: DesfibramentoSector;
  currentDescasque: DescasqueSector;
  currentRalo: RaloSector;
  currentStaff: StaffData;
  activeShift: ShiftType;
}

export const NewRecordModal: React.FC<NewRecordModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialSector = 'Desfibramento',
  currentDesfibramento,
  currentDescasque,
  currentRalo,
  currentStaff,
  activeShift,
}) => {
  // Form State
  const [selectedSector, setSelectedSector] = useState<SectorType>(initialSector);
  const [subSetorOutros, setSubSetorOutros] = useState<string>('Caldeira / Utilidades');

  // Desfibramento fields
  const [carretasEmProcesso, setCarretasEmProcesso] = useState<string>(
    currentDesfibramento.carretasEmProcesso !== undefined 
      ? String(currentDesfibramento.carretasEmProcesso).replace('.', ',') 
      : '23,5'
  );
  const [carretasProcessadasDia, setCarretasProcessadasDia] = useState<string>(
    currentDesfibramento.carretasProcessadasDia !== undefined 
      ? String(currentDesfibramento.carretasProcessadasDia).replace('.', ',') 
      : '8,5'
  );
  const [totalCocosProcessados, setTotalCocosProcessados] = useState<number>(
    currentDesfibramento.totalCocosProcessados ?? 119000
  );
  
  // Helper for parsing fractional inputs with comma or dot
  const parseFractional = (val: string | number): number => {
    if (typeof val === 'number') return isNaN(val) ? 0 : val;
    if (!val) return 0;
    const normalized = String(val).trim().replace(',', '.');
    const num = parseFloat(normalized);
    return isNaN(num) ? 0 : num;
  };
  
  // Multi-variety selection
  const parseInitialVarieties = (varStr?: string): string[] => {
    if (!varStr) return ['PB-111'];
    return varStr.split(',').map((s) => s.trim()).filter(Boolean);
  };
  const [selectedVarieties, setSelectedVarieties] = useState<string[]>(
    parseInitialVarieties(currentDesfibramento.variedadeCoco)
  );
  const [customVarietyInput, setCustomVarietyInput] = useState<string>('');

  const [estoqueInteiro, setEstoqueInteiro] = useState<number>(currentDesfibramento.estoqueInteiro);
  const [estoqueFurado, setEstoqueFurado] = useState<number>(currentDesfibramento.estoqueFurado);

  // Descasque fields
  const [condicaoCoco, setCondicaoCoco] = useState<DescasqueCondition>(currentDescasque.condicaoCoco);
  const [statusBalancaDescasque, setStatusBalancaDescasque] = useState<ScaleStatus>(currentDescasque.statusBalanca);
  const [totalBalancaKg, setTotalBalancaKg] = useState<number>(currentDescasque.totalBalancaKg ?? 14850);
  const [totalCaixas, setTotalCaixas] = useState<number>(currentDescasque.totalCaixas ?? 580);
  const [statusParadaDescasque, setStatusParadaDescasque] = useState<StopStatus>(currentDescasque.statusParada);

  // Ralo fields
  const [qualidadeCoco, setQualidadeCoco] = useState<RaloQuality>(currentRalo.qualidadeCoco);
  const [statusBalancaRalo, setStatusBalancaRalo] = useState<ScaleStatus>(currentRalo.statusBalanca);
  const [statusParadaRalo, setStatusParadaRalo] = useState<StopStatus>(currentRalo.statusParada);

  // Staff by Sector (Desfibramento, Descasque, Ralo)
  const defaultStaffData = {
    desfib: { setor: 'Desfibramento' as const, presentes: 14, faltas: 1, ferias: 1, vagos: 1 },
    descasque: { setor: 'Descasque' as const, presentes: 20, faltas: 1, ferias: 2, vagos: 1 },
    ralo: { setor: 'Ralo' as const, presentes: 10, faltas: 1, ferias: 1, vagos: 0 },
  };

  const [staffDesfib, setStaffDesfib] = useState<SectorStaff>(defaultStaffData.desfib);
  const [staffDescasque, setStaffDescasque] = useState<SectorStaff>(defaultStaffData.descasque);
  const [staffRalo, setStaffRalo] = useState<SectorStaff>(defaultStaffData.ralo);

  // Occurrence (Always Included)
  const [temOcorrencia, setTemOcorrencia] = useState<boolean>(false);
  const [tipoOcorrencia, setTipoOcorrencia] = useState<OccurrenceType>('Parada Mecânica');
  const [tituloOcorrencia, setTituloOcorrencia] = useState<string>('');
  const [descricaoOcorrencia, setDescricaoOcorrencia] = useState<string>('');
  const [tempoParadaMinutos, setTempoParadaMinutos] = useState<number>(0);
  const [responsavel, setResponsavel] = useState<string>('Operador Líder do Turno');
  const [turno, setTurno] = useState<ShiftType>(activeShift);
  const [acaoCorretiva, setAcaoCorretiva] = useState<string>('');

  // Sync state on open
  useEffect(() => {
    if (isOpen) {
      setSelectedSector(initialSector);
      setCarretasEmProcesso(
        currentDesfibramento.carretasEmProcesso !== undefined 
          ? String(currentDesfibramento.carretasEmProcesso).replace('.', ',') 
          : '0'
      );
      setCarretasProcessadasDia(
        currentDesfibramento.carretasProcessadasDia !== undefined 
          ? String(currentDesfibramento.carretasProcessadasDia).replace('.', ',') 
          : '0'
      );
      setTotalCocosProcessados(currentDesfibramento.totalCocosProcessados ?? 119000);
      setSelectedVarieties(parseInitialVarieties(currentDesfibramento.variedadeCoco));
      setEstoqueInteiro(currentDesfibramento.estoqueInteiro);
      setEstoqueFurado(currentDesfibramento.estoqueFurado);
      setCondicaoCoco(currentDescasque.condicaoCoco);
      setStatusBalancaDescasque(currentDescasque.statusBalanca);
      setTotalBalancaKg(currentDescasque.totalBalancaKg ?? 14850);
      setTotalCaixas(currentDescasque.totalCaixas ?? 580);
      setStatusParadaDescasque(currentDescasque.statusParada);
      setQualidadeCoco(currentRalo.qualidadeCoco);
      setStatusBalancaRalo(currentRalo.statusBalanca);
      setStatusParadaRalo(currentRalo.statusParada);

      // Initialize Staff by 3 sectors
      const desfibFound = currentStaff.setores?.find((s) => s.setor === 'Desfibramento');
      const descasqueFound = currentStaff.setores?.find((s) => s.setor === 'Descasque');
      const raloFound = currentStaff.setores?.find((s) => s.setor === 'Ralo');

      setStaffDesfib(desfibFound ? { ...desfibFound } : defaultStaffData.desfib);
      setStaffDescasque(descasqueFound ? { ...descasqueFound } : defaultStaffData.descasque);
      setStaffRalo(raloFound ? { ...raloFound } : defaultStaffData.ralo);

      setTurno(activeShift);
    }
  }, [isOpen, initialSector, currentDesfibramento, currentDescasque, currentRalo, currentStaff, activeShift]);

  if (!isOpen) return null;

  // Live Consolidated Calculations
  const totalTrabalhando = staffDesfib.presentes + staffDescasque.presentes + staffRalo.presentes;
  const totalFaltas = staffDesfib.faltas + staffDescasque.faltas + staffRalo.faltas;
  const totalFerias = staffDesfib.ferias + staffDescasque.ferias + staffRalo.ferias;
  const totalPostosVagos = staffDesfib.vagos + staffDescasque.vagos + staffRalo.vagos;
  const totalEfetivo = totalTrabalhando + totalFaltas + totalFerias + totalPostosVagos;
  const totalEscalados = totalTrabalhando + totalFaltas;
  const taxaPresenca = totalEscalados > 0 ? Math.round((totalTrabalhando / totalEscalados) * 100) : 100;

  const toggleVariety = (varietyName: string) => {
    if (selectedVarieties.includes(varietyName)) {
      // If only 1 left, don't leave empty if clicked again or allow toggle
      const filtered = selectedVarieties.filter((v) => v !== varietyName);
      setSelectedVarieties(filtered.length > 0 ? filtered : [varietyName]);
    } else {
      setSelectedVarieties([...selectedVarieties, varietyName]);
    }
  };

  const handleAddCustomVariety = () => {
    const trimmed = customVarietyInput.trim();
    if (trimmed && !selectedVarieties.includes(trimmed)) {
      setSelectedVarieties([...selectedVarieties, trimmed]);
      setCustomVarietyInput('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalVarietyString = selectedVarieties.length > 0 
      ? selectedVarieties.join(', ') 
      : 'PB-111';

    const recordData: NewRecordFormData = {
      setor: selectedSector,
      subSetorOutros: selectedSector === 'Outros' ? subSetorOutros : undefined,
      
      // Desfibramento
      carretasEmProcesso: parseFractional(carretasEmProcesso),
      carretasProcessadasDia: parseFractional(carretasProcessadasDia),
      totalCocosProcessados: Number(totalCocosProcessados) || 0,
      variedadeCoco: finalVarietyString,
      estoqueInteiro,
      estoqueFurado,
      unidadeEstoque: 'unidades',

      // Descasque
      condicaoCoco,
      statusBalancaDescasque,
      totalBalancaKg: Number(totalBalancaKg) || 0,
      totalCaixas: Number(totalCaixas) || 0,
      statusParadaDescasque,

      // Ralo
      qualidadeCoco,
      statusBalancaRalo,
      statusParadaRalo,

      // Quadro de Pessoal Consolidado
      trabalhando: totalTrabalhando,
      faltas: totalFaltas,
      ferias: totalFerias,
      postosVagos: totalPostosVagos,
      setoresStaff: [staffDesfib, staffDescasque, staffRalo],

      // Ocorrência
      temOcorrencia: temOcorrencia || statusParadaDescasque.includes('Parada') || statusParadaRalo.includes('Parada'),
      tipoOcorrencia: temOcorrencia ? tipoOcorrencia : (
        selectedSector === 'Descasque' && statusParadaDescasque.includes('Elétrica') ? 'Parada Elétrica' :
        selectedSector === 'Descasque' && statusParadaDescasque.includes('Mecânica') ? 'Parada Mecânica' :
        selectedSector === 'Ralo' && statusParadaRalo.includes('Elétrica') ? 'Parada Elétrica' :
        selectedSector === 'Ralo' && statusParadaRalo.includes('Mecânica') ? 'Parada Mecânica' :
        'Registro de Rotina'
      ),
      descricaoOcorrencia: descricaoOcorrencia || (
        tituloOcorrencia ? tituloOcorrencia : `Registro de acompanhamento e medição no setor ${selectedSector}`
      ),
      tempoParadaMinutos: Number(tempoParadaMinutos) || 0,
      responsavel: responsavel || 'Operador Responsável',
      turno,
      acaoCorretiva,
    };

    onSave(recordData);
    onClose();
  };

  const sectorsList: { id: SectorType; label: string; icon: React.FC<{ className?: string }>; desc: string }[] = [
    { id: 'Desfibramento', label: 'Desfibramento', icon: Truck, desc: 'Pátio, carretas e estoque' },
    { id: 'Descasque', label: 'Descasque', icon: Cpu, desc: 'Condição, balança e paradas' },
    { id: 'Ralo', label: 'Ralo', icon: RotateCw, desc: 'Qualidade, moagem e pesagem' },
    { id: 'Outros', label: 'Outros Setores', icon: MoreHorizontal, desc: 'Caldeira, Utilidades, Geral' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div 
        id="modal-novo-registro"
        className="bg-slate-900 border border-slate-700/80 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="px-5 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Save className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-display">Novo Registro de Produção</h2>
              <p className="text-xs text-slate-400">Atualize os parâmetros operacionais do dia em tempo real</p>
            </div>
          </div>
          <button
            id="btn-close-modal"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body (Scrollable Form) */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1">
          
          {/* 1. SECTOR SELECTION */}
          <div className="space-y-2.5">
            <label className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              1. Qual o seu setor?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {sectorsList.map((item) => {
                const isSelected = selectedSector === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    id={`btn-select-sector-${item.id.toLowerCase()}`}
                    onClick={() => setSelectedSector(item.id)}
                    className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-md shadow-emerald-950/40 ring-1 ring-emerald-500'
                        : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 p-0.5 rounded-full bg-emerald-500 text-slate-950">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                    <Icon className={`w-5 h-5 mb-1.5 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-slate-100">{item.label}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">{item.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>


          {/* 2. DYNAMIC SECTOR FIELDS */}
          <div className="bg-slate-950/80 border border-slate-800/90 rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono-code">
                Campos Específicos: {selectedSector}
              </span>
              <span className="text-[11px] text-slate-500">Preencha os indicadores de medição</span>
            </div>

            {/* SECTOR A: DESFIBRAMENTO */}
            {selectedSector === 'Desfibramento' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Carretas em Processo (No Pátio)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="decimal"
                        value={carretasEmProcesso}
                        onChange={(e) => setCarretasEmProcesso(e.target.value)}
                        placeholder="Ex: 23,5"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono-code focus:outline-none focus:border-emerald-500 font-bold"
                      />
                      <span className="absolute right-3 top-2.5 text-xs text-slate-500 font-mono-code">carretas</span>
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1 block">Permite números fracionados (ex: 23,5)</span>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Total de Carretas Processadas no Dia
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="decimal"
                        value={carretasProcessadasDia}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCarretasProcessadasDia(val);
                        }}
                        placeholder="Ex: 8,5"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-emerald-400 font-mono-code focus:outline-none focus:border-emerald-500 font-bold"
                      />
                      <span className="absolute right-3 top-2.5 text-xs text-slate-500 font-mono-code">carretas</span>
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1 block">Permite números fracionados (ex: 8,5)</span>
                  </div>
                </div>

                {/* Total de Cocos Processados (Unidades) */}
                <div className="bg-slate-900/90 border border-emerald-500/30 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5 text-emerald-400" />
                      Total de Cocos Processados (Unidades):
                    </label>
                    <span className="text-[11px] font-mono-code text-slate-400">
                      {parseFractional(carretasProcessadasDia) > 0 && totalCocosProcessados > 0
                        ? `~${Math.round(totalCocosProcessados / (parseFractional(carretasProcessadasDia) || 1)).toLocaleString('pt-BR')} un/carreta` 
                        : ''}
                    </span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={totalCocosProcessados}
                    onChange={(e) => setTotalCocosProcessados(Math.max(0, parseInt(e.target.value) || 0))}
                    placeholder="Ex: 119000"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono-code font-bold focus:outline-none focus:border-emerald-500"
                  />
                  <p className="text-[11px] text-slate-400">
                    Total consolidado em unidades de coco processadas pelo setor de Desfibramento no dia.
                  </p>
                </div>

                {/* MULTI-VARIETY COCONUT SELECTOR */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                    <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-emerald-400" />
                      Variedade do Coco (Selecione uma ou mais variedades):
                    </label>
                    <span className="text-[11px] text-emerald-400 font-mono-code font-bold">
                      {selectedVarieties.length} selecionada(s)
                    </span>
                  </div>

                  {/* Variety interactive chips (PB-111, PB-113, PB-121, PB-123, PB-132, PB-141, AVeBr, AVB) */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {COCONUT_VARIETIES.map((variety) => {
                      const isSelected = selectedVarieties.includes(variety);
                      return (
                        <button
                          key={variety}
                          type="button"
                          id={`chip-variety-${variety.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                          onClick={() => toggleVariety(variety)}
                          className={`py-2 px-2.5 rounded-lg text-xs font-mono-code font-bold border transition-all flex items-center justify-between ${
                            isSelected
                              ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-sm shadow-emerald-950 ring-1 ring-emerald-500/50'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                          }`}
                        >
                          <span>{variety}</span>
                          {isSelected ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-slate-800"></span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Active Selected Summary and Quick Select Options */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/80 text-xs">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] text-slate-400">Variedades ativas:</span>
                      {selectedVarieties.map((v) => (
                        <span 
                          key={v}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-[11px] font-mono-code font-semibold"
                        >
                          {v}
                          <button
                            type="button"
                            onClick={() => toggleVariety(v)}
                            className="hover:text-rose-400"
                            title={`Remover ${v}`}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-1 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setSelectedVarieties([...COCONUT_VARIETIES])}
                        className="text-slate-400 hover:text-emerald-400 underline underline-offset-2"
                      >
                        Todas
                      </button>
                      <span className="text-slate-700">•</span>
                      <button
                        type="button"
                        onClick={() => setSelectedVarieties(['PB-111'])}
                        className="text-slate-400 hover:text-amber-400 underline underline-offset-2"
                      >
                        Apenas PB-111
                      </button>
                    </div>
                  </div>

                  {/* Option to add custom variety if needed */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Outra variedade específica..."
                      value={customVarietyInput}
                      onChange={(e) => setCustomVarietyInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCustomVariety();
                        }
                      }}
                      className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 flex-1 font-mono-code"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomVariety}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Adicionar</span>
                    </button>
                  </div>
                </div>

                {/* Estoque Inteiro x Furado */}
                <div>
                  <span className="text-xs font-semibold text-slate-300 block mb-1">
                    Estoque de Coco (Inteiro x Furado) - em unidades
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-lg">
                      <label className="text-[11px] text-slate-400 block mb-1 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                        Coco Inteiro (unidades):
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={estoqueInteiro}
                        onChange={(e) => setEstoqueInteiro(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-sm font-mono-code text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-lg">
                      <label className="text-[11px] text-slate-400 block mb-1 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                        Coco Furado (unidades):
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={estoqueFurado}
                        onChange={(e) => setEstoqueFurado(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-sm font-mono-code text-amber-300 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}


            {/* SECTOR B: DESCASQUE */}
            {selectedSector === 'Descasque' && (
              <div className="space-y-4">
                {/* Registros da Balança (Kg e Caixas) */}
                <div className="bg-slate-950/90 border border-blue-500/30 rounded-xl p-3.5 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-bold text-blue-300 flex items-center gap-1.5">
                      <Scale className="w-3.5 h-3.5 text-blue-400" />
                      Registros da Balança do Descasque
                    </span>
                    <span className="text-[11px] font-mono-code text-slate-400">
                      {totalCaixas > 0 ? `${(totalBalancaKg / totalCaixas).toFixed(1)} kg/caixa (méd.)` : ''}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-lg">
                      <label className="text-xs font-semibold text-blue-300 block mb-1">
                        Total da Balança (Kg):
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={totalBalancaKg}
                        onChange={(e) => setTotalBalancaKg(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-sm font-mono-code text-white font-bold focus:outline-none focus:border-blue-500"
                        placeholder="Ex: 14850"
                      />
                    </div>

                    <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-lg">
                      <label className="text-xs font-semibold text-blue-300 block mb-1">
                        Total de Caixas:
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={totalCaixas}
                        onChange={(e) => setTotalCaixas(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-sm font-mono-code text-blue-300 font-bold focus:outline-none focus:border-blue-500"
                        placeholder="Ex: 580"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Condição do Coco
                  </label>
                  <select
                    value={condicaoCoco}
                    onChange={(e) => setCondicaoCoco(e.target.value as DescasqueCondition)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Padrão / Excelente">Padrão / Excelente (Fácil descasque, sem perdas)</option>
                    <option value="Muito Seco">Muito Seco (Casca aderente)</option>
                    <option value="Fibroso">Fibroso (Necessita maior esforço de corte)</option>
                    <option value="Verde / Úmido">Verde / Úmido (Alta umidade residual)</option>
                    <option value="Desfibrado Regular">Desfibrado Regular</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Status da Balança
                    </label>
                    <select
                      value={statusBalancaDescasque}
                      onChange={(e) => setStatusBalancaDescasque(e.target.value as ScaleStatus)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Operacional">Operacional (Calibrada)</option>
                      <option value="Calibração Pendente">Calibração Pendente</option>
                      <option value="Em Manutenção">Em Manutenção Preventiva</option>
                      <option value="Inoperante">Inoperante / Parada</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Status de Paradas
                    </label>
                    <select
                      value={statusParadaDescasque}
                      onChange={(e) => setStatusParadaDescasque(e.target.value as StopStatus)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 font-semibold"
                    >
                      <option value="Normal (Em Operação)">Normal (Em Operação)</option>
                      <option value="Parada Mecânica">Parada Mecânica (Esteira/Lâminas)</option>
                      <option value="Parada Elétrica">Parada Elétrica (Inversor/Motor)</option>
                      <option value="Falta de Insumo/coco">Falta de Insumo/coco</option>
                      <option value="Aguardando Operação">Aguardando Operação</option>
                    </select>
                  </div>
                </div>
              </div>
            )}


            {/* SECTOR C: RALO */}
            {selectedSector === 'Ralo' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Qualidade do Coco (Normal / Quebradiço / Queimado)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Normal', 'Quebradiço', 'Queimado'] as RaloQuality[]).map((qual) => {
                      const isSelected = qualidadeCoco === qual;
                      return (
                        <button
                          key={qual}
                          type="button"
                          onClick={() => setQualidadeCoco(qual)}
                          className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                            isSelected
                              ? qual === 'Normal'
                                ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                                : qual === 'Quebradiço'
                                ? 'bg-amber-500 text-slate-950 border-amber-400'
                                : 'bg-rose-500 text-white border-rose-400'
                              : 'bg-slate-900 text-slate-400 border-slate-700 hover:border-slate-600'
                          }`}
                        >
                          {qual}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Status da Balança
                    </label>
                    <select
                      value={statusBalancaRalo}
                      onChange={(e) => setStatusBalancaRalo(e.target.value as ScaleStatus)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Operacional">Operacional</option>
                      <option value="Em Manutenção">Em Manutenção</option>
                      <option value="Inoperante">Inoperante / Travada</option>
                      <option value="Calibração Pendente">Calibração Pendente</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Status de Paradas
                    </label>
                    <select
                      value={statusParadaRalo}
                      onChange={(e) => setStatusParadaRalo(e.target.value as StopStatus)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 font-semibold"
                    >
                      <option value="Normal (Em Operação)">Normal (Em Operação)</option>
                      <option value="Parada Mecânica">Parada Mecânica (Troca de Facas / Rolo)</option>
                      <option value="Parada Elétrica">Parada Elétrica</option>
                      <option value="Troca de Facas / Limpeza">Troca de Facas / Limpeza</option>
                      <option value="Falta de Insumo/coco">Falta de Insumo/coco</option>
                      <option value="Aguardando Operação">Aguardando Operação</option>
                    </select>
                  </div>
                </div>
              </div>
            )}


            {/* SECTOR D: OUTROS */}
            {selectedSector === 'Outros' && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Identificação do Setor / Área
                  </label>
                  <input
                    type="text"
                    value={subSetorOutros}
                    onChange={(e) => setSubSetorOutros(e.target.value)}
                    placeholder="Ex: Caldeira, Secagem, Ensaque, Expedição..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            )}

          </div>


          {/* 3. QUADRO DE PESSOAL (CONSOLIDADO DOS 3 SETORES) */}
          <div className="bg-slate-950/80 border border-slate-800/90 rounded-xl p-4 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
              <div>
                <label className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span>3. Quadro de Pessoal (Consolidado dos 3 Setores)</span>
                </label>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Informe o efetivo individual por setor (Desfibramento, Descasque e Ralo)
                </p>
              </div>

              {/* Live Consolidated Badge */}
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-mono-code">
                <span className="text-slate-400 font-sans">Efetivo Total:</span>
                <strong className="text-blue-400">{totalEfetivo} colab.</strong>
                <span className="text-slate-600">|</span>
                <span className="text-slate-400 font-sans">Presença:</span>
                <strong className={`font-bold ${taxaPresenca >= 90 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {taxaPresenca}%
                </strong>
              </div>
            </div>

            {/* Consolidated 4 Stat Mini Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="bg-emerald-950/20 border border-emerald-500/20 p-2.5 rounded-lg">
                <span className="text-[10px] text-emerald-400 font-semibold uppercase block">Trabalhando Total</span>
                <span className="text-lg font-black text-emerald-300 font-mono-code">{totalTrabalhando}</span>
              </div>
              <div className="bg-rose-950/20 border border-rose-500/20 p-2.5 rounded-lg">
                <span className="text-[10px] text-rose-400 font-semibold uppercase block">Faltas Total</span>
                <span className="text-lg font-black text-rose-300 font-mono-code">{totalFaltas}</span>
              </div>
              <div className="bg-amber-950/20 border border-amber-500/20 p-2.5 rounded-lg">
                <span className="text-[10px] text-amber-400 font-semibold uppercase block">Férias Total</span>
                <span className="text-lg font-black text-amber-300 font-mono-code">{totalFerias}</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg">
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Postos Vagos</span>
                <span className="text-lg font-black text-slate-200 font-mono-code">{totalPostosVagos}</span>
              </div>
            </div>

            {/* 3 Sectors Input Cards */}
            <div className="space-y-3 pt-1">
              {/* 1. Desfibramento */}
              <div className="bg-slate-900/90 border border-emerald-500/30 rounded-xl p-3 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded bg-emerald-500/10 text-emerald-400">
                      <Truck className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-emerald-300 font-display">1. Setor Desfibramento</span>
                  </div>
                  <span className="text-[11px] font-mono-code text-slate-400">
                    Efetivo: <strong className="text-slate-200">{staffDesfib.presentes + staffDesfib.faltas + staffDesfib.ferias + staffDesfib.vagos}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <label className="text-[10px] font-semibold text-emerald-400 block mb-0.5">Presentes</label>
                    <input
                      type="number"
                      min="0"
                      value={staffDesfib.presentes}
                      onChange={(e) => setStaffDesfib({ ...staffDesfib, presentes: Math.max(0, parseInt(e.target.value) || 0) })}
                      className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs font-mono-code text-white font-bold focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-rose-400 block mb-0.5">Faltas</label>
                    <input
                      type="number"
                      min="0"
                      value={staffDesfib.faltas}
                      onChange={(e) => setStaffDesfib({ ...staffDesfib, faltas: Math.max(0, parseInt(e.target.value) || 0) })}
                      className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs font-mono-code text-rose-400 font-bold focus:outline-none focus:border-rose-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-amber-400 block mb-0.5">Férias</label>
                    <input
                      type="number"
                      min="0"
                      value={staffDesfib.ferias}
                      onChange={(e) => setStaffDesfib({ ...staffDesfib, ferias: Math.max(0, parseInt(e.target.value) || 0) })}
                      className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs font-mono-code text-amber-300 font-bold focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-400 block mb-0.5">Vagos</label>
                    <input
                      type="number"
                      min="0"
                      value={staffDesfib.vagos}
                      onChange={(e) => setStaffDesfib({ ...staffDesfib, vagos: Math.max(0, parseInt(e.target.value) || 0) })}
                      className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs font-mono-code text-slate-200 font-bold focus:outline-none focus:border-slate-500"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Descasque */}
              <div className="bg-slate-900/90 border border-blue-500/30 rounded-xl p-3 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded bg-blue-500/10 text-blue-400">
                      <Cpu className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-blue-300 font-display">2. Setor Descasque</span>
                  </div>
                  <span className="text-[11px] font-mono-code text-slate-400">
                    Efetivo: <strong className="text-slate-200">{staffDescasque.presentes + staffDescasque.faltas + staffDescasque.ferias + staffDescasque.vagos}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <label className="text-[10px] font-semibold text-emerald-400 block mb-0.5">Presentes</label>
                    <input
                      type="number"
                      min="0"
                      value={staffDescasque.presentes}
                      onChange={(e) => setStaffDescasque({ ...staffDescasque, presentes: Math.max(0, parseInt(e.target.value) || 0) })}
                      className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs font-mono-code text-white font-bold focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-rose-400 block mb-0.5">Faltas</label>
                    <input
                      type="number"
                      min="0"
                      value={staffDescasque.faltas}
                      onChange={(e) => setStaffDescasque({ ...staffDescasque, faltas: Math.max(0, parseInt(e.target.value) || 0) })}
                      className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs font-mono-code text-rose-400 font-bold focus:outline-none focus:border-rose-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-amber-400 block mb-0.5">Férias</label>
                    <input
                      type="number"
                      min="0"
                      value={staffDescasque.ferias}
                      onChange={(e) => setStaffDescasque({ ...staffDescasque, ferias: Math.max(0, parseInt(e.target.value) || 0) })}
                      className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs font-mono-code text-amber-300 font-bold focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-400 block mb-0.5">Vagos</label>
                    <input
                      type="number"
                      min="0"
                      value={staffDescasque.vagos}
                      onChange={(e) => setStaffDescasque({ ...staffDescasque, vagos: Math.max(0, parseInt(e.target.value) || 0) })}
                      className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs font-mono-code text-slate-200 font-bold focus:outline-none focus:border-slate-500"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Ralo */}
              <div className="bg-slate-900/90 border border-amber-500/30 rounded-xl p-3 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded bg-amber-500/10 text-amber-400">
                      <RotateCw className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-amber-300 font-display">3. Setor Ralo</span>
                  </div>
                  <span className="text-[11px] font-mono-code text-slate-400">
                    Efetivo: <strong className="text-slate-200">{staffRalo.presentes + staffRalo.faltas + staffRalo.ferias + staffRalo.vagos}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <label className="text-[10px] font-semibold text-emerald-400 block mb-0.5">Presentes</label>
                    <input
                      type="number"
                      min="0"
                      value={staffRalo.presentes}
                      onChange={(e) => setStaffRalo({ ...staffRalo, presentes: Math.max(0, parseInt(e.target.value) || 0) })}
                      className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs font-mono-code text-white font-bold focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-rose-400 block mb-0.5">Faltas</label>
                    <input
                      type="number"
                      min="0"
                      value={staffRalo.faltas}
                      onChange={(e) => setStaffRalo({ ...staffRalo, faltas: Math.max(0, parseInt(e.target.value) || 0) })}
                      className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs font-mono-code text-rose-400 font-bold focus:outline-none focus:border-rose-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-amber-400 block mb-0.5">Férias</label>
                    <input
                      type="number"
                      min="0"
                      value={staffRalo.ferias}
                      onChange={(e) => setStaffRalo({ ...staffRalo, ferias: Math.max(0, parseInt(e.target.value) || 0) })}
                      className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs font-mono-code text-amber-300 font-bold focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-400 block mb-0.5">Vagos</label>
                    <input
                      type="number"
                      min="0"
                      value={staffRalo.vagos}
                      onChange={(e) => setStaffRalo({ ...staffRalo, vagos: Math.max(0, parseInt(e.target.value) || 0) })}
                      className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs font-mono-code text-slate-200 font-bold focus:outline-none focus:border-slate-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>


          {/* 4. OCORRÊNCIAS / PARADAS (SEMPRE INCLUÍDO) */}
          <div className="bg-slate-950/80 border border-slate-800/90 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <label className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-amber-400" />
                <span>4. Registro de Ocorrência / Parada</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={temOcorrencia}
                  onChange={(e) => setTemOcorrencia(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500 w-4 h-4"
                />
                <span className="font-semibold">Possui ocorrência detalhada?</span>
              </label>
            </div>

            {temOcorrencia && (
              <div className="space-y-3.5 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Tipo de Ocorrência
                    </label>
                    <select
                      value={tipoOcorrencia}
                      onChange={(e) => setTipoOcorrencia(e.target.value as OccurrenceType)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Parada Mecânica">Parada Mecânica</option>
                      <option value="Parada Elétrica">Parada Elétrica</option>
                      <option value="Falta de Insumo/coco">Falta de Insumo/coco</option>
                      <option value="Alerta de Qualidade">Alerta de Qualidade</option>
                      <option value="Status da Balança">Status da Balança</option>
                      <option value="Ajuste Operacional">Ajuste Operacional</option>
                      <option value="Segurança do Trabalho">Segurança do Trabalho</option>
                      <option value="Registro de Rotina">Registro de Rotina</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Tempo de Parada Estimado (minutos)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={tempoParadaMinutos}
                      onChange={(e) => setTempoParadaMinutos(parseInt(e.target.value) || 0)}
                      placeholder="Ex: 25"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-amber-300 font-mono-code focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Título / Resumo da Ocorrência
                  </label>
                  <input
                    type="text"
                    value={tituloOcorrencia}
                    onChange={(e) => setTituloOcorrencia(e.target.value)}
                    placeholder="Ex: Quebra do rolamento do ralo 01"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Descrição Detalhada / Motivo
                  </label>
                  <textarea
                    rows={2}
                    value={descricaoOcorrencia}
                    onChange={(e) => setDescricaoOcorrencia(e.target.value)}
                    placeholder="Detalhes sobre a falha, equipamento envolvido ou diagnóstico..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Ação Corretiva / Providências Tomadas (Opcional)
                  </label>
                  <input
                    type="text"
                    value={acaoCorretiva}
                    onChange={(e) => setAcaoCorretiva(e.target.value)}
                    placeholder="Ex: Peça substituída pelo plantonista, teste efetuado."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            )}

            {/* Responsável e Turno */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Responsável pelo Registro / Operador
                </label>
                <input
                  type="text"
                  value={responsavel}
                  onChange={(e) => setResponsavel(e.target.value)}
                  placeholder="Nome do operador ou mestre de turno"
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Turno
                </label>
                <select
                  value={turno}
                  onChange={(e) => setTurno(e.target.value as ShiftType)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Turno 1 (06:00 - 14:00)">Turno 1 (06:00 - 14:00)</option>
                  <option value="Turno 2 (14:00 - 22:00)">Turno 2 (14:00 - 22:00)</option>
                  <option value="Turno 3 (22:00 - 06:00)">Turno 3 (22:00 - 06:00)</option>
                </select>
              </div>
            </div>
          </div>


          {/* Modal Footer Actions */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-semibold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              id="btn-salvar-registro"
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all shadow-md shadow-emerald-950/60 active:scale-95 flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
              <span>Salvar Registro</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
