'use client';
import React, { useState, useEffect } from 'react';

const API_KEY = "1f812222d8bb5800fb23770e14078538"; 

export default function Home() {
  const [filmesEmAlta, setFilmesEmAlta] = useState<any[]>([]);
  const [filmeDestaque, setFilmeDestaque] = useState<any>(null);
  const [filmeSelecionado, setFilmeSelecionado] = useState<any>(null);
  const [mostrarPlayer, setMostrarPlayer] = useState(false);

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}&language=pt-BR`)
      .then(res => res.json())
      .then(data => {
        setFilmesEmAlta(data.results);
        setFilmeDestaque(data.results[0]);
      });
  }, []);

  return (
    <main className="min-h-screen bg-[#111111] text-white selection:bg-orange-600">
      
      {/* NAVBAR */}
      <nav className="fixed w-full z-40 flex items-center gap-10 p-6 bg-gradient-to-b from-black to-transparent">
        <h1 className="text-4xl font-black text-orange-600">FLIX<span className="text-white">PLUS</span></h1>
        <div className="flex gap-6 font-bold">
           <a href="/" className="focus:text-orange-500 outline-none">Filmes</a>
           <a href="/canais" className="focus:text-orange-500 outline-none">TV Ao Vivo</a>
        </div>
      </nav>

      {/* HERO NETFLIX STYLE */}
      {filmeDestaque && (
        <div className="relative h-[85vh] w-full flex items-end p-12 bg-cover bg-center" style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${filmeDestaque.backdrop_path})` }}>
          <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent" />
          <div className="relative z-10 max-w-2xl mb-10">
            <h2 className="text-7xl font-black mb-4">{filmeDestaque.title}</h2>
            <p className="text-xl text-gray-200 mb-6 line-clamp-3">{filmeDestaque.overview}</p>
            <button onClick={() => setFilmeSelecionado(filmeDestaque)} className="bg-white text-black px-12 py-4 rounded font-black text-xl hover:bg-gray-200 focus:ring-4 focus:ring-orange-500 outline-none transition-all">
              ▶ Assistir
            </button>
          </div>
        </div>
      )}

      {/* CARROSSEIS HORIZONTAIS (Foco Otimizado para TV) */}
      <div className="px-12 -mt-20 relative z-20 space-y-12">
        <div>
          <h3 className="text-2xl font-bold mb-6">Em Alta</h3>
          <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide">
            {filmesEmAlta.map((f: any) => (
              <button 
                key={f.id} 
                onClick={() => setFilmeSelecionado(f)}
                className="flex-none w-48 md:w-64 transform transition-all focus:scale-110 focus:ring-4 focus:ring-orange-500 outline-none rounded-lg overflow-hidden"
              >
                <img src={`https://image.tmdb.org/t/p/w500${f.poster_path}`} className="w-full h-full object-cover"/>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MODAL DETALHES E PLAYER */}
      {filmeSelecionado && (
        <div className="fixed inset-0 z-50 bg-[#111111] flex flex-col items-center justify-center p-12">
           <button onClick={() => setFilmeSelecionado(null)} className="absolute top-10 right-10 text-white font-bold text-2xl">✕</button>
           {!mostrarPlayer ? (
             <div className="flex flex-col md:flex-row gap-10 max-w-5xl">
                <img src={`https://image.tmdb.org/t/p/w500${filmeSelecionado.poster_path}`} className="w-80 rounded-lg"/>
                <div>
                   <h2 className="text-6xl font-black mb-4">{filmeSelecionado.title}</h2>
                   <p className="text-xl text-gray-400 mb-8">{filmeSelecionado.overview}</p>
                   <button onClick={() => setMostrarPlayer(true)} className="bg-orange-600 px-12 py-4 rounded font-black text-2xl hover:bg-orange-700 focus:ring-4 focus:ring-white outline-none">▶ ASSISTIR</button>
                </div>
             </div>
           ) : (
             <div className="w-full h-full">
                <button onClick={() => setMostrarPlayer(false)} className="bg-orange-600 px-6 py-2 mb-4 rounded font-bold">VOLTAR</button>
                <iframe src={`https://superflixapi.best/filme/${filmeSelecionado.id}`} className="w-full h-full" allowFullScreen />
             </div>
           )}
        </div>
      )}
    </main>
  );
}