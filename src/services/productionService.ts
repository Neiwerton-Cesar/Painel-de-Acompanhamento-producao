import { 
  db, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs,
  onSnapshot, 
  collection, 
  query, 
  orderBy, 
  limit, 
  updateDoc,
  deleteDoc,
  writeBatch
} from '../lib/firebase';
import { 
  DesfibramentoSector, 
  DescasqueSector, 
  RaloSector, 
  StaffData, 
  OccurrenceItem, 
  NewRecordFormData 
} from '../types';
import { 
  getTodayDateKey,
  initialDesfibramento, 
  initialDescasque, 
  initialRalo, 
  initialStaff, 
  initialOccurrences 
} from '../mockData';

// Collection and Document references
const DESFIBRAMENTO_DOC = doc(db, 'sectors', 'desfibramento');
const DESCASQUE_DOC = doc(db, 'sectors', 'descasque');
const RALO_DOC = doc(db, 'sectors', 'ralo');
const STAFF_DOC = doc(db, 'staff', 'current');
const OCCURRENCES_COLLECTION = collection(db, 'occurrences');

/**
 * Returns a clean state for a new production day
 */
export function getCleanDayDesfibramento(): DesfibramentoSector {
  return {
    carretasEmProcesso: 0,
    carretasProcessadasDia: 0,
    metaCarretasDia: 20,
    totalCocosProcessados: 0,
    variedadeCoco: 'PB-111',
    estoqueInteiro: 0,
    estoqueFurado: 0,
    unidadeEstoque: 'unidades',
    statusGeral: 'normal',
    ultimaAtualizacao: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    dataRegistro: getTodayDateKey(),
  };
}

export function getCleanDayDescasque(): DescasqueSector {
  return {
    condicaoCoco: 'Padrão / Excelente',
    statusBalanca: 'Operacional',
    totalBalancaKg: 0,
    totalCaixas: 0,
    statusParada: 'Normal (Em Operação)',
    motivoParada: '',
    tempoParadaMinutos: 0,
    statusGeral: 'normal',
    ultimaAtualizacao: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    dataRegistro: getTodayDateKey(),
  };
}

export function getCleanDayRalo(): RaloSector {
  return {
    qualidadeCoco: 'Normal',
    statusBalanca: 'Operacional',
    statusParada: 'Normal (Em Operação)',
    motivoParada: '',
    tempoParadaMinutos: 0,
    statusGeral: 'normal',
    ultimaAtualizacao: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    dataRegistro: getTodayDateKey(),
  };
}

export function getCleanDayStaff(): StaffData {
  return {
    trabalhando: 45,
    faltas: 0,
    ferias: 0,
    postosVagos: 0,
    dataRegistro: getTodayDateKey(),
    setores: [
      { setor: 'Desfibramento', presentes: 15, faltas: 0, ferias: 0, vagos: 0 },
      { setor: 'Descasque', presentes: 20, faltas: 0, ferias: 0, vagos: 0 },
      { setor: 'Ralo', presentes: 10, faltas: 0, ferias: 0, vagos: 0 },
    ],
  };
}

/**
 * Initialize default collections and documents if they do not exist in Firestore yet.
 * NEVER resets or overwrites existing data automatically.
 */
export async function initializeFirestoreDefaults(): Promise<void> {
  try {
    const desfibSnap = await getDoc(DESFIBRAMENTO_DOC);
    if (!desfibSnap.exists()) {
      await setDoc(DESFIBRAMENTO_DOC, initialDesfibramento);
    }

    const descasqueSnap = await getDoc(DESCASQUE_DOC);
    if (!descasqueSnap.exists()) {
      await setDoc(DESCASQUE_DOC, initialDescasque);
    }

    const raloSnap = await getDoc(RALO_DOC);
    if (!raloSnap.exists()) {
      await setDoc(RALO_DOC, initialRalo);
    }

    const staffSnap = await getDoc(STAFF_DOC);
    if (!staffSnap.exists()) {
      await setDoc(STAFF_DOC, initialStaff);
    }

    // Check if initial sample occurrences exist only if collection is empty
    const occDocSample = doc(db, 'occurrences', initialOccurrences[0].id);
    const occSnap = await getDoc(occDocSample);
    if (!occSnap.exists()) {
      // Check if any occurrence exists before adding samples
      const occQuerySnap = await getDocs(query(OCCURRENCES_COLLECTION, limit(1)));
      if (occQuerySnap.empty) {
        for (const occ of initialOccurrences) {
          await setDoc(doc(db, 'occurrences', occ.id), occ);
        }
      }
    }
  } catch (error) {
    console.warn('Firestore initialization notice:', error);
  }
}

/**
 * Subscribe to Desfibramento Sector updates in real-time
 */
export function subscribeDesfibramento(callback: (data: DesfibramentoSector) => void) {
  return onSnapshot(
    DESFIBRAMENTO_DOC,
    (snap) => {
      if (snap.exists()) {
        callback(snap.data() as DesfibramentoSector);
      } else {
        const initial = initialDesfibramento;
        setDoc(DESFIBRAMENTO_DOC, initial).catch(console.error);
        callback(initial);
      }
    },
    (err) => {
      console.error('Error listening to Desfibramento:', err);
    }
  );
}

/**
 * Subscribe to Descasque Sector updates in real-time
 */
export function subscribeDescasque(callback: (data: DescasqueSector) => void) {
  return onSnapshot(
    DESCASQUE_DOC,
    (snap) => {
      if (snap.exists()) {
        callback(snap.data() as DescasqueSector);
      } else {
        const initial = initialDescasque;
        setDoc(DESCASQUE_DOC, initial).catch(console.error);
        callback(initial);
      }
    },
    (err) => {
      console.error('Error listening to Descasque:', err);
    }
  );
}

/**
 * Subscribe to Ralo Sector updates in real-time
 */
export function subscribeRalo(callback: (data: RaloSector) => void) {
  return onSnapshot(
    RALO_DOC,
    (snap) => {
      if (snap.exists()) {
        callback(snap.data() as RaloSector);
      } else {
        const initial = initialRalo;
        setDoc(RALO_DOC, initial).catch(console.error);
        callback(initial);
      }
    },
    (err) => {
      console.error('Error listening to Ralo:', err);
    }
  );
}

/**
 * Subscribe to Staff updates in real-time
 */
export function subscribeStaff(callback: (data: StaffData) => void) {
  return onSnapshot(
    STAFF_DOC,
    (snap) => {
      if (snap.exists()) {
        callback(snap.data() as StaffData);
      } else {
        const initial = initialStaff;
        setDoc(STAFF_DOC, initial).catch(console.error);
        callback(initial);
      }
    },
    (err) => {
      console.error('Error listening to Staff:', err);
    }
  );
}

/**
 * Subscribe to Occurrences Mural in real-time
 */
export function subscribeOccurrences(callback: (data: OccurrenceItem[]) => void) {
  const q = query(OCCURRENCES_COLLECTION, orderBy('timestamp', 'desc'), limit(100));
  
  return onSnapshot(
    q,
    (snapshot) => {
      const list: OccurrenceItem[] = [];
      snapshot.forEach((docSnap) => {
        list.push(docSnap.data() as OccurrenceItem);
      });
      callback(list);
    },
    (err) => {
      console.error('Error listening to Occurrences:', err);
    }
  );
}

/**
 * Save new production record and broadcast to all connected devices in real time
 */
export async function saveRecordToFirestore(
  formData: NewRecordFormData,
  currentStaff: StaffData,
  currentDesfibramento: DesfibramentoSector,
  currentDescasque: DescasqueSector,
  currentRalo: RaloSector
): Promise<void> {
  const now = new Date();
  const today = getTodayDateKey();
  const horaFormatada = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  // 1. Update Sector Document
  if (formData.setor === 'Desfibramento') {
    const updatedDesfib: DesfibramentoSector = {
      ...currentDesfibramento,
      carretasEmProcesso: formData.carretasEmProcesso !== undefined ? Number(formData.carretasEmProcesso) : currentDesfibramento.carretasEmProcesso,
      carretasProcessadasDia: formData.carretasProcessadasDia !== undefined ? Number(formData.carretasProcessadasDia) : currentDesfibramento.carretasProcessadasDia,
      totalCocosProcessados: formData.totalCocosProcessados !== undefined ? Number(formData.totalCocosProcessados) : (currentDesfibramento.totalCocosProcessados || 0),
      variedadeCoco: formData.variedadeCoco || currentDesfibramento.variedadeCoco || 'PB-111',
      estoqueInteiro: formData.estoqueInteiro !== undefined ? formData.estoqueInteiro : currentDesfibramento.estoqueInteiro,
      estoqueFurado: formData.estoqueFurado !== undefined ? formData.estoqueFurado : currentDesfibramento.estoqueFurado,
      ultimaAtualizacao: horaFormatada,
      dataRegistro: today,
    };
    await setDoc(DESFIBRAMENTO_DOC, updatedDesfib, { merge: true });
  } else if (formData.setor === 'Descasque') {
    const updatedDescasque: DescasqueSector = {
      ...currentDescasque,
      condicaoCoco: formData.condicaoCoco || currentDescasque.condicaoCoco,
      statusBalanca: formData.statusBalancaDescasque || currentDescasque.statusBalanca,
      totalBalancaKg: formData.totalBalancaKg !== undefined ? Number(formData.totalBalancaKg) || 0 : (currentDescasque.totalBalancaKg || 0),
      totalCaixas: formData.totalCaixas !== undefined ? Number(formData.totalCaixas) || 0 : (currentDescasque.totalCaixas || 0),
      statusParada: formData.statusParadaDescasque || currentDescasque.statusParada,
      motivoParada: formData.descricaoOcorrencia || '',
      tempoParadaMinutos: Number(formData.tempoParadaMinutos) || 0,
      ultimaAtualizacao: horaFormatada,
      dataRegistro: today,
    };
    await setDoc(DESCASQUE_DOC, updatedDescasque, { merge: true });
  } else if (formData.setor === 'Ralo') {
    const updatedRalo: RaloSector = {
      ...currentRalo,
      qualidadeCoco: formData.qualidadeCoco || currentRalo.qualidadeCoco,
      statusBalanca: formData.statusBalancaRalo || currentRalo.statusBalanca,
      statusParada: formData.statusParadaRalo || currentRalo.statusParada,
      motivoParada: formData.descricaoOcorrencia || '',
      tempoParadaMinutos: Number(formData.tempoParadaMinutos) || 0,
      ultimaAtualizacao: horaFormatada,
      dataRegistro: today,
    };
    await setDoc(RALO_DOC, updatedRalo, { merge: true });
  }

  // 2. Update Staff Document (Consolidating the 3 sectors: Desfibramento, Descasque, Ralo)
  let finalSetores = formData.setoresStaff;
  if (!finalSetores || finalSetores.length === 0) {
    const existing = currentStaff.setores || [];
    finalSetores = [
      existing.find((s) => s.setor === 'Desfibramento') || { setor: 'Desfibramento', presentes: 14, faltas: 1, ferias: 1, vagos: 1 },
      existing.find((s) => s.setor === 'Descasque') || { setor: 'Descasque', presentes: 20, faltas: 1, ferias: 2, vagos: 1 },
      existing.find((s) => s.setor === 'Ralo') || { setor: 'Ralo', presentes: 10, faltas: 1, ferias: 1, vagos: 0 },
    ];
  }

  // Filter out any 'Outros' or foreign sectors from staff consolidation
  const validSetores = finalSetores.filter((s) => ['Desfibramento', 'Descasque', 'Ralo'].includes(s.setor));

  const totalTrabalhando = validSetores.reduce((acc, s) => acc + (Number(s.presentes) || 0), 0);
  const totalFaltas = validSetores.reduce((acc, s) => acc + (Number(s.faltas) || 0), 0);
  const totalFerias = validSetores.reduce((acc, s) => acc + (Number(s.ferias) || 0), 0);
  const totalPostosVagos = validSetores.reduce((acc, s) => acc + (Number(s.vagos) || 0), 0);

  const updatedStaff: StaffData = {
    ...currentStaff,
    trabalhando: totalTrabalhando,
    faltas: totalFaltas,
    ferias: totalFerias,
    postosVagos: totalPostosVagos,
    dataRegistro: today,
    setores: validSetores,
  };
  await setDoc(STAFF_DOC, updatedStaff, { merge: true });

  // 3. Add to Occurrences Collection
  const isStop = 
    (formData.setor === 'Descasque' && formData.statusParadaDescasque?.includes('Parada')) ||
    (formData.setor === 'Ralo' && formData.statusParadaRalo?.includes('Parada')) ||
    formData.temOcorrencia;

  const newOccId = `occ-${Date.now()}`;
  const newOcc: OccurrenceItem = {
    id: newOccId,
    timestamp: now.toISOString(),
    dataRegistro: today,
    hora: horaFormatada,
    setor: formData.setor,
    tipo: formData.tipoOcorrencia || (isStop ? 'Parada Mecânica' : 'Registro de Rotina'),
    titulo: formData.descricaoOcorrencia ? formData.descricaoOcorrencia.slice(0, 55) : `Registro no setor ${formData.setor}`,
    descricao: formData.descricaoOcorrencia || `Parâmetros operacionais atualizados por ${formData.responsavel}.`,
    responsavel: formData.responsavel || 'Operador',
    turno: formData.turno,
    status: isStop ? 'Ativo' : 'Normalizado',
    duracaoMinutos: Number(formData.tempoParadaMinutos) || 0,
    acaoCorretiva: formData.acaoCorretiva || '',
  };

  await setDoc(doc(db, 'occurrences', newOccId), newOcc);
}

/**
 * Toggle Occurrence status in Firestore
 */
export async function toggleOccurrenceInFirestore(occurrence: OccurrenceItem): Promise<void> {
  const newStatus = occurrence.status === 'Normalizado' ? 'Ativo' : 'Normalizado';
  const occRef = doc(db, 'occurrences', occurrence.id);
  await updateDoc(occRef, {
    status: newStatus,
  });
}

/**
 * Reset all Factory data to a brand new clean day state in Firestore
 */
export async function resetDailyDataToCleanState(): Promise<void> {
  await setDoc(DESFIBRAMENTO_DOC, getCleanDayDesfibramento());
  await setDoc(DESCASQUE_DOC, getCleanDayDescasque());
  await setDoc(RALO_DOC, getCleanDayRalo());
  await setDoc(STAFF_DOC, getCleanDayStaff());

  // Clear all occurrences from the live occurrences collection
  try {
    const occurrencesSnap = await getDocs(OCCURRENCES_COLLECTION);
    if (!occurrencesSnap.empty) {
      const batch = writeBatch(db);
      occurrencesSnap.forEach((docSnap) => {
        batch.delete(docSnap.ref);
      });
      await batch.commit();
    }
  } catch (error) {
    console.error('Error clearing occurrences on reset day:', error);
  }
}

/**
 * Reset all Factory data to sample initial state
 */
export async function resetAllFirestoreData(): Promise<void> {
  await setDoc(DESFIBRAMENTO_DOC, initialDesfibramento);
  await setDoc(DESCASQUE_DOC, initialDescasque);
  await setDoc(RALO_DOC, initialRalo);
  await setDoc(STAFF_DOC, initialStaff);
  
  for (const occ of initialOccurrences) {
    await setDoc(doc(db, 'occurrences', occ.id), occ);
  }
}
