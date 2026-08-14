export type SectorType = 'Desfibramento' | 'Descasque' | 'Ralo' | 'Outros';

export const COCONUT_VARIETIES = [
  'PB-111',
  'PB-113',
  'PB-121',
  'PB-123',
  'PB-132',
  'PB-141',
  'AVeBr',
  'AVB',
] as const;

export type CoconutVariety = typeof COCONUT_VARIETIES[number] | string;

export type ScaleStatus = 'Operacional' | 'Calibração Pendente' | 'Em Manutenção' | 'Inoperante';

export type StopStatus = 
  | 'Normal (Em Operação)' 
  | 'Parada Mecânica' 
  | 'Parada Elétrica' 
  | 'Troca de Facas / Limpeza' 
  | 'Falta de Insumo'
  | 'Falta de Insumo/coco'
  | 'Aguardando Operação';

export type RaloQuality = 'Normal' | 'Quebradiço' | 'Queimado' | 'Misto';

export type DescasqueCondition = 'Padrão / Excelente' | 'Muito Seco' | 'Fibroso' | 'Verde / Úmido' | 'Desfibrado Regular';

export type ShiftType = 'Turno 1 (06:00 - 14:00)' | 'Turno 2 (14:00 - 22:00)' | 'Turno 3 (22:00 - 06:00)';

export type OccurrenceType = 
  | 'Parada Mecânica' 
  | 'Parada Elétrica' 
  | 'Falta de Insumo/coco'
  | 'Alerta de Qualidade' 
  | 'Status da Balança' 
  | 'Ajuste Operacional' 
  | 'Segurança do Trabalho'
  | 'Registro de Rotina';

export interface DesfibramentoSector {
  carretasEmProcesso: number;
  carretasProcessadasDia: number;
  metaCarretasDia: number;
  totalCocosProcessados?: number; // Total de cocos processados em unidades
  variedadeCoco: string; // E.g. "PB-111" or "PB-111, PB-121"
  estoqueInteiro: number; // em unidades
  estoqueFurado: number;
  unidadeEstoque: 'milheiros' | 'unidades' | 'toneladas';
  statusGeral: 'normal' | 'alerta' | 'parado';
  ultimaAtualizacao: string;
  dataRegistro?: string; // YYYY-MM-DD
}

export interface DescasqueSector {
  condicaoCoco: DescasqueCondition;
  statusBalanca: ScaleStatus;
  totalBalancaKg?: number; // Total da balança em Kg
  totalCaixas?: number; // Total de caixas
  statusParada: StopStatus;
  motivoParada?: string;
  tempoParadaMinutos?: number;
  statusGeral: 'normal' | 'alerta' | 'parado';
  ultimaAtualizacao: string;
  dataRegistro?: string;
}

export interface RaloSector {
  qualidadeCoco: RaloQuality;
  statusBalanca: ScaleStatus;
  statusParada: StopStatus;
  motivoParada?: string;
  tempoParadaMinutos?: number;
  statusGeral: 'normal' | 'alerta' | 'parado';
  ultimaAtualizacao: string;
  dataRegistro?: string;
}

export interface SectorStaff {
  setor: 'Desfibramento' | 'Descasque' | 'Ralo';
  presentes: number;
  faltas: number;
  ferias: number;
  vagos: number;
}

export interface StaffData {
  trabalhando: number;
  faltas: number;
  ferias: number;
  postosVagos: number;
  dataRegistro?: string;
  setores?: SectorStaff[];
}

export interface OccurrenceItem {
  id: string;
  timestamp: string;
  dataRegistro?: string; // YYYY-MM-DD
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
  totalCocosProcessados?: number;
  variedadeCoco?: string; // e.g. "PB-111, PB-121"
  estoqueInteiro?: number;
  estoqueFurado?: number;
  unidadeEstoque?: 'milheiros' | 'unidades' | 'toneladas';

  // Descasque
  condicaoCoco?: DescasqueCondition;
  statusBalancaDescasque?: ScaleStatus;
  totalBalancaKg?: number;
  totalCaixas?: number;
  statusParadaDescasque?: StopStatus;

  // Ralo
  qualidadeCoco?: RaloQuality;
  statusBalancaRalo?: ScaleStatus;
  statusParadaRalo?: StopStatus;

  // Quadro de Pessoal Consolidado
  trabalhando: number;
  faltas: number;
  ferias: number;
  postosVagos: number;
  setoresStaff?: SectorStaff[];

  // Ocorrência
  temOcorrencia: boolean;
  tipoOcorrencia?: OccurrenceType;
  descricaoOcorrencia?: string;
  tempoParadaMinutos?: number;
  responsavel: string;
  turno: ShiftType;
  acaoCorretiva?: string;
}
