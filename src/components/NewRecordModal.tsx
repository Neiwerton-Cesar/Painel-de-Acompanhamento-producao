import React, { useState } from 'react';
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
  Info
} from 'lucide-react';
import { 
  SectorType, 
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
  StaffData
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
  const [carretasEmProcesso, setCarretasEmProcesso] = useState<number>(currentDesfibramento.carretasEmProcesso);
  const [carretasProcessadasDia, setCarretasProcessadasDia] = useState<number>(currentDesfibramento.carretasProcessadasDia);
  const [variedadeCoco, setVariedadeCoco] = useState<CoconutVariety>(currentDesfibramento.variedadeCoco);
  const [estoqueInteiro, setEstoqueInteiro] = useState<number>(currentDesfibramento.estoqueInteiro);
  const [estoqueFurado, setEstoqueFurado] = useState<number>(currentDesfibramento.estoqueFurado);

  // Descasque fields
  const [condicaoCoco, setCondicaoCoco] = useState<DescasqueCondition>(currentDescasque.condicaoCoco);
  const [statusBalancaDescasque, setStatusBalancaDescasque] = useState<ScaleStatus>(currentDescasque.statusBalanca);
  const [statusParadaDescasque, setStatusParadaDescasque] = useState<StopStatus>(currentDescasque.statusParada);

  // Ralo fields
  const [qualidadeCoco, setQualidadeCoco] = useState<RaloQuality>(currentRalo.qualidadeCoco);
  const [statusBalancaRalo, setStatusBalancaRalo] = useState<ScaleStatus>(currentRalo.statusBalanca);
  const [statusParadaRalo, setStatusParadaRalo] = useState<StopStatus>(currentRalo.statusParada);

  // Staff (Quadro de Pessoal - Always Included)
  const [trabalhando, setTrabalhando] = useState<number>(currentStaff.trabalhando);
  const [faltas, setFaltas] = useState<number>(currentStaff.faltas);
  const [ferias, setFerias] = useState<number>(currentStaff.ferias);
  const [postosVagos, setPostosVagos] = useState<number>(currentStaff.postosVagos);

  // Occurrence (Always Included)
  const [temOcorrencia, setTemOcorrencia] = useState<boolean>(false);
  const [tipoOcorrencia, setTipoOcorrencia] = useState<OccurrenceType>('Parada Mecânica');
  const [tituloOcorrencia, setTituloOcorrencia] = useState<string>('');
  const [descricaoOcorrencia, setDescricaoOcorrencia] = useState<string>('');
  const [tempoParadaMinutos, setTempoParadaMinutos] = useState<number>(0);
  const [responsavel, setResponsavel] = useState<string>('Operador Líder do Turno');
  const [turno, setTurno] = useState<ShiftType>(activeShift);
  const [acaoCorretiva, setAcaoCorretiva] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const recordData: NewRecordFormData = {
      setor: selectedSector,
      subSetorOutros: selectedSector === 'Outros' ? subSetorOutros : undefined,
      
      // Desfibramento
      carretasEmProcesso,
      carretasProcessadasDia,
      variedadeCoco,
      estoqueInteiro,
      estoqueFurado,
      unidadeEstoque: 'unidades',

      // Descasque
      condicaoCoco,
      statusBalancaDescasque,
      statusParadaDescasque,

      // Ralo
      qualidadeCoco,
      statusBalancaRalo,
      statusParadaRalo,

      // Quadro de Pessoal
      trabalhando: Number(trabalhando) || 0,
      faltas: Number(faltas) || 0,
      ferias: Number(ferias) || 0,
      postosVagos: Number(postosVagos) || 0,

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
              <p className="text-xs text-slate-400">Atualize os parâmetros operacionais da fábrica em tempo real</p>
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
          
          {/* 1. SECTOR SELECTION (Qual o seu setor?) */}
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
                    <input
                      type="number"
                      min="0"
                      value={carretasEmProcesso}
                      onChange={(e) => setCarretasEmProcesso(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono-code focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Total de Carretas Processadas no Dia
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={carretasProcessadasDia}
                      onChange={(e) => setCarretasProcessadasDia(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-emerald-400 font-mono-code focus:outline-none focus:border-emerald-500 font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Variedade do Coco
                  </label>
                  <select
                    value={variedadeCoco}
                    onChange={(e) => setVariedadeCoco(e.target.value as CoconutVariety)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Anão Verde">Anão Verde (Alta umidade / Fibra clara)</option>
                    <option value="Gigante do Brasil">Gigante do Brasil (Maior volume / Fibra longa)</option>
                    <option value="Híbrido">Híbrido (Padrão industrial regular)</option>
                    <option value="Misto Industrial">Misto Industrial</option>
                    <option value="Outro">Outra Variedade</option>
                  </select>
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
                      <option value="Falta de Insumo">Falta de Insumo / Coco</option>
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


          {/* 3. QUADRO DE PESSOAL (SEMPRE INCLUÍDO) */}
          <div className="bg-slate-950/80 border border-slate-800/90 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <label className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-400" />
                <span>3. Quadro de Pessoal (Atualização Geral)</span>
              </label>
              <span className="text-[11px] text-slate-500">Obrigatório em todo registro</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <label className="text-xs font-semibold text-emerald-400 block mb-1">
                  Trabalhando:
                </label>
                <input
                  type="number"
                  min="0"
                  value={trabalhando}
                  onChange={(e) => setTrabalhando(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-sm font-mono-code text-white font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <label className="text-xs font-semibold text-rose-400 block mb-1">
                  Faltas:
                </label>
                <input
                  type="number"
                  min="0"
                  value={faltas}
                  onChange={(e) => setFaltas(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-sm font-mono-code text-rose-400 font-bold focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <label className="text-xs font-semibold text-amber-400 block mb-1">
                  Férias:
                </label>
                <input
                  type="number"
                  min="0"
                  value={ferias}
                  onChange={(e) => setFerias(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-sm font-mono-code text-amber-300 font-bold focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Postos Vagos:
                </label>
                <input
                  type="number"
                  min="0"
                  value={postosVagos}
                  onChange={(e) => setPostosVagos(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-sm font-mono-code text-slate-200 font-bold focus:outline-none focus:border-slate-500"
                />
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
