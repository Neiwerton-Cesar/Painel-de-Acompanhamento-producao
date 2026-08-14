import { 
  db, 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot, 
  collection, 
  query, 
  orderBy, 
  limit, 
  updateDoc 
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
 * Initialize default data in Firestore if documents don't exist yet
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

    // Check if occurrences exist, if not seed initial occurrences
    const occDocSample = doc(db, 'occurrences', initialOccurrences[0].id);
    const occSnap = await getDoc(occDocSample);
    if (!occSnap.exists()) {
      for (const occ of initialOccurrences) {
        await setDoc(doc(db, 'occurrences', occ.id), occ);
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
        // Doc might need initialization
        setDoc(DESFIBRAMENTO_DOC, initialDesfibramento).catch(console.error);
        callback(initialDesfibramento);
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
        setDoc(DESCASQUE_DOC, initialDescasque).catch(console.error);
        callback(initialDescasque);
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
        setDoc(RALO_DOC, initialRalo).catch(console.error);
        callback(initialRalo);
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
        setDoc(STAFF_DOC, initialStaff).catch(console.error);
        callback(initialStaff);
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
  const q = query(OCCURRENCES_COLLECTION, orderBy('timestamp', 'desc'), limit(50));
  
  return onSnapshot(
    q,
    (snapshot) => {
      if (snapshot.empty) {
        // If empty, initialize defaults
        initialOccurrences.forEach((occ) => {
          setDoc(doc(db, 'occurrences', occ.id), occ).catch(console.error);
        });
        callback(initialOccurrences);
      } else {
        const list: OccurrenceItem[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as OccurrenceItem);
        });
        callback(list);
      }
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
  const horaFormatada = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  // 1. Update Sector Document
  if (formData.setor === 'Desfibramento') {
    const updatedDesfib: DesfibramentoSector = {
      ...currentDesfibramento,
      carretasEmProcesso: formData.carretasEmProcesso !== undefined ? formData.carretasEmProcesso : currentDesfibramento.carretasEmProcesso,
      carretasProcessadasDia: formData.carretasProcessadasDia !== undefined ? formData.carretasProcessadasDia : currentDesfibramento.carretasProcessadasDia,
      variedadeCoco: formData.variedadeCoco || currentDesfibramento.variedadeCoco,
      estoqueInteiro: formData.estoqueInteiro !== undefined ? formData.estoqueInteiro : currentDesfibramento.estoqueInteiro,
      estoqueFurado: formData.estoqueFurado !== undefined ? formData.estoqueFurado : currentDesfibramento.estoqueFurado,
      ultimaAtualizacao: horaFormatada,
    };
    await setDoc(DESFIBRAMENTO_DOC, updatedDesfib, { merge: true });
  } else if (formData.setor === 'Descasque') {
    const updatedDescasque: DescasqueSector = {
      ...currentDescasque,
      condicaoCoco: formData.condicaoCoco || currentDescasque.condicaoCoco,
      statusBalanca: formData.statusBalancaDescasque || currentDescasque.statusBalanca,
      statusParada: formData.statusParadaDescasque || currentDescasque.statusParada,
      motivoParada: formData.descricaoOcorrencia || undefined,
      tempoParadaMinutos: formData.tempoParadaMinutos,
      ultimaAtualizacao: horaFormatada,
    };
    await setDoc(DESCASQUE_DOC, updatedDescasque, { merge: true });
  } else if (formData.setor === 'Ralo') {
    const updatedRalo: RaloSector = {
      ...currentRalo,
      qualidadeCoco: formData.qualidadeCoco || currentRalo.qualidadeCoco,
      statusBalanca: formData.statusBalancaRalo || currentRalo.statusBalanca,
      statusParada: formData.statusParadaRalo || currentRalo.statusParada,
      motivoParada: formData.descricaoOcorrencia || undefined,
      tempoParadaMinutos: formData.tempoParadaMinutos,
      ultimaAtualizacao: horaFormatada,
    };
    await setDoc(RALO_DOC, updatedRalo, { merge: true });
  }

  // 2. Update Staff Document
  const updatedStaff: StaffData = {
    ...currentStaff,
    trabalhando: formData.trabalhando,
    faltas: formData.faltas,
    ferias: formData.ferias,
    postosVagos: formData.postosVagos,
    setores: currentStaff.setores?.map((s) => {
      if (s.setor === formData.setor) {
        return {
          ...s,
          presentes: Math.max(1, Math.round(formData.trabalhando * 0.4)),
          faltas: Math.round(formData.faltas * 0.3),
        };
      }
      return s;
    }),
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
    hora: horaFormatada,
    setor: formData.setor,
    tipo: formData.tipoOcorrencia || (isStop ? 'Parada Mecânica' : 'Registro de Rotina'),
    titulo: formData.descricaoOcorrencia ? formData.descricaoOcorrencia.slice(0, 55) : `Registro no setor ${formData.setor}`,
    descricao: formData.descricaoOcorrencia || `Parâmetros operacionais atualizados por ${formData.responsavel}.`,
    responsavel: formData.responsavel,
    turno: formData.turno,
    status: isStop ? 'Ativo' : 'Normalizado',
    duracaoMinutos: formData.tempoParadaMinutos || undefined,
    acaoCorretiva: formData.acaoCorretiva || undefined,
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
 * Reset all Factory data to defaults in Firestore
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
