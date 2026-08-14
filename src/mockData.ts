import { DesfibramentoSector, DescasqueSector, RaloSector, StaffData, OccurrenceItem } from './types';

export const initialDesfibramento: DesfibramentoSector = {
  carretasEmProcesso: 3,
  carretasProcessadasDia: 14,
  metaCarretasDia: 20,
  variedadeCoco: 'Anão Verde',
  estoqueInteiro: 42500,
  estoqueFurado: 9800,
  unidadeEstoque: 'unidades',
  statusGeral: 'normal',
  ultimaAtualizacao: '13:20',
};

export const initialDescasque: DescasqueSector = {
  condicaoCoco: 'Padrão / Excelente',
  statusBalanca: 'Operacional',
  statusParada: 'Normal (Em Operação)',
  statusGeral: 'normal',
  ultimaAtualizacao: '13:22',
};

export const initialRalo: RaloSector = {
  qualidadeCoco: 'Normal',
  statusBalanca: 'Operacional',
  statusParada: 'Normal (Em Operação)',
  statusGeral: 'normal',
  ultimaAtualizacao: '13:25',
};

export const initialStaff: StaffData = {
  trabalhando: 48,
  faltas: 3,
  ferias: 4,
  postosVagos: 2,
  setores: [
    { setor: 'Desfibramento', presentes: 14, faltas: 1, ferias: 1, vagos: 1 },
    { setor: 'Descasque', presentes: 20, faltas: 1, ferias: 2, vagos: 1 },
    { setor: 'Ralo', presentes: 10, faltas: 1, ferias: 1, vagos: 0 },
    { setor: 'Outros', presentes: 4, faltas: 0, ferias: 0, vagos: 0 },
  ],
};

export const initialOccurrences: OccurrenceItem[] = [
  {
    id: 'occ-101',
    timestamp: new Date().toISOString(),
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
    hora: '11:20',
    setor: 'Desfibramento',
    tipo: 'Registro de Rotina',
    titulo: 'Recebimento de 4 carretas de Coco Verde',
    descricao: 'Chegada da frota da Fazenda São Bento. Variedade Anão Verde com excelente rendimento de fibra e umidade controlada.',
    responsavel: 'Gilberto Ramos (Recebimento)',
    turno: 'Turno 1 (06:00 - 14:00)',
    status: 'Normalizado',
  },
  {
    id: 'occ-104',
    timestamp: new Date(Date.now() - 210 * 60 * 1000).toISOString(),
    hora: '09:30',
    setor: 'Ralo',
    tipo: 'Status da Balança',
    titulo: 'Aferição e Calibração da Balança 01',
    descricao: 'Balança de pesagem contínua aferida com pesos-padrão de 50kg. Erro dentro da tolerância de ±0,02%.',
    responsavel: 'Técnico Metrologia Souza',
    turno: 'Turno 1 (06:00 - 14:00)',
    status: 'Normalizado',
    acaoCorretiva: 'Certificado de verificação diária emitido.',
  },
];
