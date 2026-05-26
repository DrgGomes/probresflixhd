'use client';
import React, { useState, useEffect } from 'react';
import { auth, app } from '../../firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';

const db = getFirestore(app);

export default function AdminPanel() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [logado, setLogado] = useState(false);
  
  // Estados para Canais
  const [nomeCanal, setNomeCanal] = useState('');
  const [urlIframe, setUrlIframe] = useState('');
  const [listaCanais, setListaCanais] = useState<any[]>([]);

  // Carrega lista de canais existentes
  const carregarCanais = async () => {
    const querySnapshot = await getDocs(collection(db, 'canais'));
    setListaCanais(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const fazerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, senha);
      setLogado(true);
      carregarCanais();
    } catch { alert("Erro ao logar"); }
  };

  const adicionarCanal = async () => {
    if (!nomeCanal || !urlIframe) return alert("Preencha tudo!");
    try {
      await addDoc(collection(db, 'canais'), { nome: nomeCanal, src: urlIframe });
      alert("Canal adicionado!");
      setNomeCanal(''); setUrlIframe('');
      carregarCanais(); // Atualiza a lista na tela
    } catch { alert("Erro ao salvar"); }
  };

  const deletarCanal = async (id: string) => {
    await deleteDoc(doc(db, 'canais', id));
    carregarCanais();
  };

  if (logado) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white p-6 md:p-12">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-black">Painel de Gestão: Canais</h1>
          <button onClick={() => signOut(auth).then(() => setLogado(false))} className="bg-red-600 px-6 py-2 rounded-lg font-bold">Sair</button>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Formulário */}
          <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
            <h2 className="text-xl font-bold mb-4">Adicionar Novo Canal</h2>
            <input className="w-full p-3 mb-4 bg-gray-800 rounded border border-gray-700" placeholder="Nome (Ex: Globo)" value={nomeCanal} onChange={(e) => setNomeCanal(e.target.value)} />
            <input className="w-full p-3 mb-4 bg-gray-800 rounded border border-gray-700" placeholder="Link do Iframe (src)" value={urlIframe} onChange={(e) => setUrlIframe(e.target.value)} />
            <button onClick={adicionarCanal} className="w-full bg-blue-600 p-4 rounded-xl font-bold hover:bg-blue-700">Salvar no Site</button>
          </div>

          {/* Lista Atual */}
          <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
            <h2 className="text-xl font-bold mb-4">Canais Cadastrados ({listaCanais.length})</h2>
            <div className="space-y-2">
              {listaCanais.map(c => (
                <div key={c.id} className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                  <span>{c.nome}</span>
                  <button onClick={() => deletarCanal(c.id)} className="text-red-500 font-bold hover:underline">Remover</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
      <form onSubmit={fazerLogin} className="bg-gray-900 p-8 rounded-2xl w-96 border border-gray-800">
        <h2 className="text-2xl font-bold mb-6 text-center">Login Admin</h2>
        <input type="email" placeholder="Email" className="w-full p-3 mb-4 bg-gray-800 rounded" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Senha" className="w-full p-3 mb-4 bg-gray-800 rounded" onChange={(e) => setSenha(e.target.value)} />
        <button className="w-full bg-blue-600 p-3 rounded font-bold">Entrar</button>
      </form>
    </div>
  );
}