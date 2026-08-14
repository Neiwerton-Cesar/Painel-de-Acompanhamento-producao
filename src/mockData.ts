import { DesfibramentoSector, DescasqueSector, RaloSector, StaffData, OccurrenceItem } from './types';

export const getTodayDateKey = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const initialDesfibramento: DesfibramentoSector = {
  carretasEmProcesso: 23.5,
  carretasProcessadasDia: 8.5,
  metaCarretasDia: 20,
  totalCocosProcessados: 119000,
  variedadeCoco: 'PB-111, PB-121',
  estoqueInteiro: 42500,
  estoqueFurado: 9800,
  unidadeEstoque: 'unidades',
  statusGeral: 'normal',
  ultimaAtualizacao: '13:20',
  dataRegistro: getTodayDateKey(),
};

export const initialDescasque: DescasqueSector = {
  condicaoCoco: 'Padrão / Excelente',
  statusBalanca: 'Operacional',
  totalBalancaKg: 14850,
  totalCaixas: 580,
  statusParada: 'Normal (Em Operação)',
  statusGeral: 'normal',
  ultimaAtualizacao: '13:22',
  dataRegistro: getTodayDateKey(),
};

export const initialRalo: RaloSector = {
  qualidadeCoco: 'Normal',
  statusBalanca: 'Operacional',
  statusParada: 'Normal (Em Operação)',
  statusGeral: 'normal',
  ultimaAtualizacao: '13:25',
  dataRegistro: getTodayDateKey(),
};

export const initialStaff: StaffData = {
  trabalhando: 44,
  faltas: 3,
  ferias: 4,
  postosVagos: 2,
  dataRegistro: getTodayDateKey(),
  setores: [
    { setor: 'Desfibramento', presentes: 14, faltas: 1, ferias: 1, vagos: 1 },
    { setor: 'Descasque', presentes: 20, faltas: 1, ferias: 2, vagos: 1 },
    { setor: 'Ralo', presentes: 10, faltas: 1, ferias: 1, vagos: 0 },
  ],
};

export const initialOccurrences: OccurrenceItem[] = [
  {
    id: 'occ-101',
    timestamp: new Date().toISOString(),
    dataRegistro: getTodayDateKey(),
    hora: '13:10',
    setor: 'Descasque',
    tipo: 'Parada Mecânica',
    titulo: 'Manutenção na esteira alimentadora 02',
    descricao: 'Esteira de alimentação do descasque travou devido a acúmulo de fibras. Equipe de mecânica acionada e atuando na desobstrução.',
    responsavel: 'Carlos Eduardo (Mestre de Produção)',
    turno: 'Turno 2 (14:00 - 22:00)',
    status: 'Ativo',
    duracaoMinutos: 15,
    acaoCorretiva: 'Limpeza de polia e lubrificação das correntes de tração.',
  },
  {
    id: 'occ-102',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    dataRegistro: getTodayDateKey(),
    hora: '12:25',
    setor: 'Ralo',
    tipo: 'Alerta de Qualidade',
    titulo: 'Lote com coco quebradiço identificado',
    descricao: 'Identificado lote de matéria-prima com percentual de coco quebradiço acima de 12%. Velocidade do tambor ajustada para 85%.',
    responsavel: 'Marcos Silveira (Controle de Qualidade)',
    turno: 'Turno 1 (06:00 - 14:00)',
    status: 'Normalizado',
    acaoCorretiva: 'Regulagem de pressão das facas e reteste de granulometria aprovado.',
  },
  {
    id: 'occ-103',
    timestamp: new Date(Date.now() - 110 * 60 * 1000).toISOString(),
    dataRegistro: getTodayDateKey(),
    hora: '11:20',
    setor: 'Desfibramento',
    tipo: 'Registro de Rotina',
    titulo: 'Recebimento de 4 carretas de Coco PB-111 e AVeBr',
    descricao: 'Chegada da frota com variedades PB-111 e AVeBr. Excelente rendimento de fibra e umidade controlada.',
    responsavel: 'Gilberto Ramos (Recebimento)',
    turno: 'Turno 1 (06:00 - 14:00)',
    status: 'Normalizado',
  },
];
