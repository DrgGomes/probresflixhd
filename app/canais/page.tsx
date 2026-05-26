'use client';
import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '../../firebase';

const db = getFirestore(app);

export default function CanaisPage() {
  const [canais, setCanais] = useState<any[]>([]);
  const [canalAtivo, setCanalAtivo] = useState<any>(null);

  useEffect(() => {
    const buscarCanais = async () => {
      const snapshot = await getDocs(collection(db, 'canais'));
      const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCanais(lista);
      if (lista.length > 0) setCanalAtivo(lista[0]);
    };
    buscarCanais();
  }, []);

  return (
    <div className="min-h-screen bg-[#111111] text-white p-6 md:p-10">
      {/* Botão Voltar focado para TV */}
      <a 
        href="/" 
        className="inline-block mb-6 bg-gray-800 px-6 py-2 rounded-lg font-bold hover:bg-orange-600 transition-colors focus:ring-4 focus:ring-orange-500 outline-none"
      >
        ← Voltar ao Início
      </a>

      <h1 className="text-4xl font-black mb-8 text-orange-500">Guia de TV</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Lista de Canais - Foco otimizado para D-Pad */}
        <div className="lg:col-span-1 space-y-3 h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
          {canais.map((c) => (
            <button 
              key={c.id}
              onClick={() => setCanalAtivo(c)}
              className={`w-full p-4 rounded-xl text-left font-bold transition-all focus:scale-105 focus:ring-4 focus:ring-orange-500 outline-none ${canalAtivo?.id === c.id ? 'bg-orange-600' : 'bg-[#1a1a1a] hover:bg-[#222]'}`}
            >
              {c.nome}
            </button>
          ))}
        </div>

        {/* Player */}
        <div className="lg:col-span-3">
          {canalAtivo ? (
            <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800 focus:ring-4 focus:ring-orange-500">
              <iframe 
                src={canalAtivo.src}
                className="w-full h-full"
                allowFullScreen
                title="Player de TV"
              />
            </div>
          ) : (
            <div className="h-96 flex items-center justify-center border-2 border-dashed border-gray-800 rounded-2xl">
              <p>Selecione um canal na lista.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}