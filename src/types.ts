export type SectorType = 'Desfibramento' | 'Descasque' | 'Ralo' | 'Outros';

export type CoconutVariety = 'Anão Verde' | 'Gigante do Brasil' | 'Híbrido' | 'Misto Industrial' | 'Outro';

export type ScaleStatus = 'Operacional' | 'Calibração Pendente' | 'Em Manutenção' | 'Inoperante';

export type StopStatus = 
  | 'Normal (Em Operação)' 
  | 'Parada Mecânica' 
  | 'Parada Elétrica' 
  | 'Troca de Facas / Limpeza' 
  | 'Falta de Insumo'
  | 'Aguardando Operação';

export type RaloQuality = 'Normal' | 'Quebradiço' | 'Queimado' | 'Misto';

export type DescasqueCondition = 'Padrão / Excelente' | 'Muito Seco' | 'Fibroso' | 'Verde / Úmido' | 'Desfibrado Regular';

export type ShiftType = 'Turno 1 (06:00 - 14:00)' | 'Turno 2 (14:00 - 22:00)' | 'Turno 3 (22:00 - 06:00)';

export type OccurrenceType = 
  | 'Parada Mecânica' 
  | 'Parada Elétrica' 
  | 'Alerta de Qualidade' 
  | 'Status da Balança' 
  | 'Ajuste Operacional' 
  | 'Segurança do Trabalho'
  | 'Registro de Rotina';

export interface DesfibramentoSector {
  carretasEmProcesso: number;
  carretasProcessadasDia: number;
  metaCarretasDia: number;
  variedadeCoco: CoconutVariety;
  estoqueInteiro: number; // e.g. em cocos ou milheiros
  estoqueFurado: number;
  unidadeEstoque: 'milheiros' | 'unidades' | 'toneladas';
  statusGeral: 'normal' | 'alerta' | 'parado';
  ultimaAtualizacao: string;
}

export interface DescasqueSector {
  condicaoCoco: DescasqueCondition;
  statusBalanca: ScaleStatus;
  statusParada: StopStatus;
  motivoParada?: string;
  tempoParadaMinutos?: number;
  statusGeral: 'normal' | 'alerta' | 'parado';
  ultimaAtualizacao: string;
}

export interface RaloSector {
  qualidadeCoco: RaloQuality;
  statusBalanca: ScaleStatus;
  statusParada: StopStatus;
  motivoParada?: string;
  tempoParadaMinutos?: number;
  statusGeral: 'normal' | 'alerta' | 'parado';
  ultimaAtualizacao: string;
}

export interface StaffData {
  trabalhando: number;
  faltas: number;
  ferias: number;
  postosVagos: number;
  setores?: {
    setor: SectorType;
    presentes: number;
    faltas: number;
    ferias: number;
    vagos: number;
  }[];
}

export interface OccurrenceItem {
  id: string;
  timestamp: string;
  hora: string;
  setor: SectorType;
  tipo: OccurrenceType;
  titulo: string;
  descricao: string;
  responsavel: string;
  turno: ShiftType;
  status: 'Ativo' | 'Em Análise' | 'Normalizado';
  duracaoMinutos?: number;
  acaoCorretiva?: string;
}

export interface NewRecordFormData {
  setor: SectorType;
  subSetorOutros?: string;
  
  // Desfibramento
  carretasEmProcesso?: number;
  carretasProcessadasDia?: number;
  variedadeCoco?: CoconutVariety;
  estoqueInteiro?: number;
  estoqueFurado?: number;
  unidadeEstoque?: 'milheiros' | 'unidades' | 'toneladas';

  // Descasque
  condicaoCoco?: DescasqueCondition;
  statusBalancaDescasque?: ScaleStatus;
  statusParadaDescasque?: StopStatus;

  // Ralo
  qualidadeCoco?: RaloQuality;
  statusBalancaRalo?: ScaleStatus;
  statusParadaRalo?: StopStatus;

  // Quadro de Pessoal
  trabalhando: number;
  faltas: number;
  ferias: number;
  postosVagos: number;

  // Ocorrência
  temOcorrencia: boolean;
  tipoOcorrencia?: OccurrenceType;
  descricaoOcorrencia?: string;
  tempoParadaMinutos?: number;
  responsavel: string;
  turno: ShiftType;
  acaoCorretiva?: string;
}
