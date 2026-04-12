// ============================================================
// CADASTRO.JS — Salvar, listar e editar pássaros no Firestore
// Também suporta modo offline com localStorage como fallback
// ============================================================

import { db, FIREBASE_CONFIGURED } from './firebase-config.js';

import {
  addDoc, collection, getDocs, getDoc, doc, updateDoc, deleteDoc, serverTimestamp, orderBy, query
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ── Chave para localStorage (modo offline) ─────────────────
const LS_KEY = 'passaros_igarapava';

// ── Helpers localStorage ───────────────────────────────────
function lsGetAll() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); }
  catch { return []; }
}

function lsSave(lista) {
  localStorage.setItem(LS_KEY, JSON.stringify(lista));
}

// ── SALVAR PÁSSARO ─────────────────────────────────────────
export async function salvarPassaro(dados, id = null) {
  if (FIREBASE_CONFIGURED) {
    if (id) {
      await updateDoc(doc(db, 'passaros', id), { ...dados, atualizadoEm: serverTimestamp() });
      return id;
    }
    const ref = await addDoc(collection(db, 'passaros'), {
      ...dados,
      criadoEm: serverTimestamp()
    });
    return ref.id;
  }

  // Fallback: localStorage
  const lista = lsGetAll();
  if (id) {
    const idx = lista.findIndex(p => p.id === id);
    if (idx !== -1) { lista[idx] = { ...lista[idx], ...dados, atualizadoEm: Date.now() }; }
    lsSave(lista);
    return id;
  }
  const novoId = 'local_' + Date.now();
  lista.unshift({ id: novoId, ...dados, criadoEm: Date.now() });
  lsSave(lista);
  return novoId;
}

// ── LISTAR TODOS ───────────────────────────────────────────
export async function listarPassaros() {
  if (FIREBASE_CONFIGURED) {
    const q = query(collection(db, 'passaros'), orderBy('criadoEm', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }
  return lsGetAll();
}

// ── BUSCAR UM PÁSSARO ──────────────────────────────────────
export async function buscarPassaro(id) {
  console.log('[buscarPassaro] id:', id, '| Firebase:', FIREBASE_CONFIGURED);

  if (FIREBASE_CONFIGURED) {
    try {
      const snap = await getDoc(doc(db, 'passaros', id));
      console.log('[buscarPassaro] exists:', snap.exists());
      if (!snap.exists()) return null;
      const dados = { id: snap.id, ...snap.data() };
      console.log('[buscarPassaro] dados:', dados);
      return dados;
    } catch (e) {
      console.error('[buscarPassaro] ERRO Firebase:', e);
      // Fallback: tenta localStorage se Firebase falhar
      const local = lsGetAll().find(p => p.id === id) || null;
      if (local) console.log('[buscarPassaro] encontrado no localStorage (fallback)');
      return local;
    }
  }

  return lsGetAll().find(p => p.id === id) || null;
}

// ── DELETAR PÁSSARO ────────────────────────────────────────
export async function deletarPassaro(id) {
  if (FIREBASE_CONFIGURED) {
    await deleteDoc(doc(db, 'passaros', id));
    return;
  }
  const lista = lsGetAll().filter(p => p.id !== id);
  lsSave(lista);
}
