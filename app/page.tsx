'use client';
import React, { useState, useEffect } from 'react';

const API_KEY = "1f812222d8bb5800fb23770e14078538"; 

export default function Home() {
  const [filmes, setFilmes] = useState<any>({ trending: [], action: [], animation: [], national: [] });
  const [filmeDestaque, setFilmeDestaque] = useState<any>(null);
  const [termoBusca, setTermoBusca] = useState('');
  const [resultados, setResultados] = useState<any[]>([]);
  const [filmeSelecionado, setFilmeSelecionado] = useState<any>(null);
  const [mostrarPlayer, setMostrarPlayer] = useState(false);
  const [categoria, setCategoria] = useState('Todos');

  useEffect(() => {
    const fetchData = async () => {
      const endpoints = {
        trending: `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}&language=pt-BR`,
        action: `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=28&language=pt-BR`,
        animation: `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=16&language=pt-BR`,
        national: `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_original_language=pt&language=pt-BR`
      };
      
      const [r1, r2, r3, r4] = await Promise.all([
        fetch(endpoints.trending).then(r => r.json()),
        fetch(endpoints.action).then(r => r.json()),
        fetch(endpoints.animation).then(r => r.json()),
        fetch(endpoints.national).then(r => r.json())
      ]);

      setFilmes({ trending: r1.results, action: r2.results, animation: r3.results, national: r4.results });
      setFilmeDestaque(r1.results[0]);
    };
    fetchData();
  }, []);

  const handleBusca = async (term: string) => {
    setTermoBusca(term);
    if (term.length > 2) {
      const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=pt-BR&query=${term}`);
      const data = await res.json();
      setResultados(data.results);
    }
  };

  // Componente de Linha de Filme para TV
  const MovieRow = ({ title, data }: { title: string, data: any[] }) => (
    <div className="mb-10">
      <h3 className="text-2xl font-bold mb-4 ml-4 uppercase tracking-widest text-orange-500">{title}</h3>
      <div className="flex gap-4 overflow-x-auto px-4 pb-4 snap-x custom-scrollbar">
        {data.map((f: any) => (
          <button 
            key={f.id} 
            onClick={() => setFilmeSelecionado(f)}
            className="flex-none w-36 md:w-56 aspect-[2/3] rounded-xl overflow-hidden transition-all hover:scale-105 focus:scale-110 focus:ring-4 focus:ring-orange-500 outline-none shadow-2xl"
          >
            <img src={`https://image.tmdb.org/t/p/w500${f.poster_path}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white selection:bg-orange-600">
      {/* NAVBAR FUTURISTA */}
      <nav className="fixed w-full z-50 p-6 flex items-center justify-between bg-gradient-to-b from-black/90 to-transparent">
        <h1 className="text-4xl font-black text-orange-600">FLIX<span className="text-white">PLUS</span></h1>
        <div className="flex gap-6 items-center">
            {['Todos', 'Ação', 'Animação', 'Nacional'].map(cat => (
                <button key={cat} onClick={() => setCategoria(cat)} className={`font-bold focus:text-orange-500 outline-none ${categoria === cat ? 'text-white' : 'text-gray-500'}`}>{cat}</button>
            ))}
        </div>
        <input 
            className="bg-black/50 border border-orange-900 rounded-full px-6 py-2 focus:ring-2 focus:ring-orange-500 outline-none" 
            placeholder="🔍 Buscar filme..." 
            onChange={(e) => handleBusca(e.target.value)}
        />
        <a href="/canais" className="bg-orange-600 px-6 py-2 rounded font-bold focus:ring-2 focus:ring-white outline-none">TV Ao Vivo</a>
      </nav>

      {/* SEARCH RESULTS */}
      {termoBusca.length > 2 ? (
         <div className="pt-32 px-10 grid grid-cols-2 md:grid-cols-6 gap-6">
            {resultados.map((f: any) => (
                <button key={f.id} onClick={() => setFilmeSelecionado(f)} className="aspect-[2/3] rounded-xl overflow-hidden focus:ring-4 focus:ring-orange-500 outline-none">
                    <img src={`https://image.tmdb.org/t/p/w500${f.poster_path}`} className="w-full h-full object-cover"/>
                </button>
            ))}
         </div>
      ) : (
        <>
            {/* HERO PRINCIPAL */}
            {filmeDestaque && (
                <div className="relative h-[80vh] flex items-end p-12 bg-cover bg-center" style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${filmeDestaque.backdrop_path})` }}>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent"/>
                    <div className="relative z-10 max-w-xl">
                        <h2 className="text-7xl font-black mb-4 drop-shadow-2xl">{filmeDestaque.title}</h2>
                        <button onClick={() => setFilmeSelecionado(filmeDestaque)} className="bg-white text-black px-10 py-4 rounded font-black text-xl hover:bg-orange-600 hover:text-white transition-all focus:ring-4 focus:ring-orange-300 outline-none">▶ ASSISTIR</button>
                    </div>
                </div>
            )}

            {/* ROWS - Renderização condicional por categoria */}
            <div className="pt-10">
                {(categoria === 'Todos' || categoria === 'Ação') && <MovieRow title="Ação & Adrenalina" data={filmes.action} />}
                {(categoria === 'Todos' || categoria === 'Animação') && <MovieRow title="Animações" data={filmes.animation} />}
                {(categoria === 'Todos' || categoria === 'Nacional') && <MovieRow title="Cinema Nacional" data={filmes.national} />}
                <MovieRow title="Tendências" data={filmes.trending} />
            </div>
        </>
      )}

      {/* MODAL DETALHES */}
      {filmeSelecionado && (
          <div className="fixed inset-0 z-[60] bg-[#0a0a0a] flex items-center justify-center p-10">
             <div className="flex gap-10 max-w-5xl">
                <img src={`https://image.tmdb.org/t/p/w500${filmeSelecionado.poster_path}`} className="w-80 rounded-2xl shadow-[0_0_50px_rgba(234,88,12,0.4)]"/>
                <div className="flex flex-col justify-center">
                    <h2 className="text-6xl font-black mb-4">{filmeSelecionado.title}</h2>
                    <p className="text-lg text-gray-400 mb-8">{filmeSelecionado.overview}</p>
                    <div className="flex gap-4">
                        <button onClick={() => setMostrarPlayer(true)} className="bg-orange-600 px-12 py-4 rounded font-black text-xl focus:ring-4 focus:ring-white outline-none">▶ ASSISTIR AGORA</button>
                        <button onClick={() => setFilmeSelecionado(null)} className="bg-gray-800 px-12 py-4 rounded font-black text-xl">VOLTAR</button>
                    </div>
                </div>
             </div>
          </div>
      )}

      {/* PLAYER */}
      {mostrarPlayer && (
        <div className="fixed inset-0 z-[70] bg-black">
            <button onClick={() => setMostrarPlayer(false)} className="absolute top-5 left-5 z-[80] bg-orange-600 px-6 py-2 rounded font-bold">VOLTAR</button>
            <iframe src={`https://superflixapi.best/filme/${filmeSelecionado.id}`} className="w-full h-full" allowFullScreen />
        </div>
      )}
    </main>
  );
}