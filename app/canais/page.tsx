'use client';
import React, { useState } from 'react';

const canaisData = [
  { nome: "Globo", cat: "TV Aberta", url: "https://embedcanaisdetv.com/embed/globo" },
  { nome: "SBT", cat: "TV Aberta", url: "https://embedcanaisdetv.com/embed/sbt" },
  { nome: "Band", cat: "TV Aberta", url: "https://embedcanaisdetv.com/embed/band" },
  { nome: "SporTV", cat: "Esportes", url: "https://embedcanaisdetv.com/embed/sportv" },
  { nome: "ESPN", cat: "Esportes", url: "https://embedcanaisdetv.com/embed/espn" },
  { nome: "Cartoon", cat: "Infantil", url: "https://embedcanaisdetv.com/embed/cartoon" },
];

export default function CanaisPage() {
  const [canalAtivo, setCanalAtivo] = useState(canaisData[0]);

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6 md:p-12">
      <h1 className="text-3xl font-black mb-8">Canais de TV</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Lista de Canais */}
        <div className="md:col-span-1 space-y-4">
          {canaisData.map((canal, idx) => (
            <button 
              key={idx}
              onClick={() => setCanalAtivo(canal)}
              className={`w-full p-4 rounded-xl text-left font-bold transition-all ${canalAtivo.nome === canal.nome ? 'bg-blue-600' : 'bg-gray-800 hover:bg-gray-700'}`}
            >
              {canal.nome} <span className="text-[10px] bg-black/30 px-2 py-0.5 rounded-full block">{canal.cat}</span>
            </button>
          ))}
        </div>

        {/* Player de TV */}
        <div className="md:col-span-3">
          <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
            <iframe 
              src={canalAtivo.url}
              className="w-full h-full"
              allowFullScreen
            />
          </div>
          <h2 className="text-2xl font-bold mt-4">{canalAtivo.nome}</h2>
        </div>
      </div>
    </div>
  );
}