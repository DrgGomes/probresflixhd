'use client';
import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '../../firebase'; // Certifique-se que o caminho aponta para o seu arquivo de config do firebase

const db = getFirestore(app);

export default function CanaisPage() {
  const [canais, setCanais] = useState<any[]>([]);
  const [canalAtivo, setCanalAtivo] = useState<any>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const buscarCanais = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'canais'));
        const listaCanais = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setCanais(listaCanais);
        if (listaCanais.length > 0) {
          setCanalAtivo(listaCanais[0]);
        }
      } catch (error) {
        console.error("Erro ao buscar canais:", error);
      } finally {
        setCarregando(false);
      }
    };
    
    buscarCanais();
  }, []);

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6 md:p-12 font-sans">
      <h1 className="text-3xl font-black mb-8 border-l-4 border-blue-600 pl-4">Guia de TV Ao Vivo</h1>
      
      {carregando ? (
        <div className="text-center p-20 text-gray-500">Conectando ao servidor de canais...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Menu Lateral de Canais */}
          <div className="md:col-span-1 space-y-2 max-h-[600px] overflow-y-auto pr-2">
            {canais.map((c) => (
              <button 
                key={c.id}
                onClick={() => setCanalAtivo(c)}
                className={`w-full p-4 rounded-xl text-left font-bold transition-all border ${canalAtivo?.id === c.id ? 'bg-blue-600 border-blue-500' : 'bg-gray-800 border-gray-700 hover:bg-gray-700'}`}
              >
                {c.nome || "Canal Sem Nome"}
              </button>
            ))}
          </div>

          {/* Player */}
          <div className="md:col-span-3">
            {canalAtivo ? (
              <>
                <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
                  <iframe 
                    src={canalAtivo.src}
                    className="w-full h-full"
                    allowFullScreen
                    frameBorder="0"
                  />
                </div>
                <h2 className="text-2xl font-bold mt-4 text-white">{canalAtivo.nome}</h2>
              </>
            ) : (
              <p className="text-gray-400">Nenhum canal encontrado. Adicione canais no seu painel Admin!</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}