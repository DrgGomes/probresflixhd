'use client';
import React, { useState, useEffect } from 'react';

const API_KEY = "1f812222d8bb5800fb23770e14078538"; 

export default function Home() {
  const [filmesEmAlta, setFilmesEmAlta] = useState<any[]>([]);
  const [filmesAcao, setFilmesAcao] = useState<any[]>([]);
  const [filmesFiccao, setFilmesFiccao] = useState<any[]>([]);
  const [filmeDestaque, setFilmeDestaque] = useState<any>(null);
  
  const [termoBusca, setTermoBusca] = useState('');
  const [resultadosBusca, setResultadosBusca] = useState<any[]>([]);
  const [filmeSelecionado, setFilmeSelecionado] = useState<any>(null);
  const [detalhesFilme, setDetalhesFilme] = useState<any>(null);
  const [mostrarPlayer, setMostrarPlayer] = useState(false);

  // Lógica de Busca (Com verificação de segurança para não quebrar)
  const isSearching = termoBusca.length > 2;

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [resAlta, resAcao, resFiccao] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}&language=pt-BR`),
          fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=pt-BR&with_genres=28`),
          fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=pt-BR&with_genres=878`)
        ]);
        const dataAlta = await resAlta.json();
        const dataAcao = await resAcao.json();
        const dataFiccao = await resFiccao.json();
        
        setFilmesEmAlta(dataAlta.results || []);
        setFilmeDestaque(dataAlta.results ? dataAlta.results[0] : null);
        setFilmesAcao(dataAcao.results || []);
        setFilmesFiccao(dataFiccao.results || []);
      } catch (erro) { console.error("Erro:", erro); }
    };
    carregarDados();
  }, []);

  useEffect(() => {
    if (isSearching) {
      const buscar = async () => {
        const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=pt-BR&query=${termoBusca}`);
        const data = await res.json();
        setResultadosBusca(data.results || []);
      };
      const delay = setTimeout(buscar, 500);
      return () => clearTimeout(delay);
    }
  }, [termoBusca, isSearching]);

  useEffect(() => {
    if (filmeSelecionado) {
      fetch(`https://api.themoviedb.org/3/movie/${filmeSelecionado.id}?api_key=${API_KEY}&language=pt-BR&append_to_response=credits`)
        .then(res => res.json())
        .then(data => setDetalhesFilme(data));
    }
  }, [filmeSelecionado]);

  return (
    <main className="min-h-screen bg-[#111111] text-white font-sans selection:bg-orange-600">
      
      {/* NAVBAR */}
      <nav className="fixed w-full z-40 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
        <h1 tabIndex={0} className="text-3xl font-black text-orange-600 cursor-pointer focus:ring-2 focus:ring-orange-500 outline-none" onClick={() => { setTermoBusca(''); setFilmeSelecionado(null); }}>
          FLIX<span className="text-white">PLUS</span>
        </h1>
        <div className="flex items-center gap-4">
          <input 
            type="text" placeholder="Buscar filmes..." value={termoBusca} onChange={(e) => setTermoBusca(e.target.value)}
            className="bg-black/50 border border-gray-700 text-sm rounded-lg px-4 py-2 w-40 md:w-64 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <a href="/canais" className="hidden md:block font-bold text-sm hover:text-orange-500">TV Ao Vivo</a>
          <a href="/admin" className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-lg font-bold text-sm">Admin</a>
        </div>
      </nav>

      {/* RENDERIZAÇÃO PRINCIPAL */}
      {!filmeSelecionado && (
        <>
          {isSearching ? (
             <div className="pt-32 px-12 min-h-screen">
                <h2 className="text-2xl font-bold mb-6">Resultados para: {termoBusca}</h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                  {(resultadosBusca || []).map((f: any) => f.poster_path && (
                    <div key={f.id} onClick={() => setFilmeSelecionado(f)} className="cursor-pointer hover:scale-105 transition-all">
                      <img src={`https://image.tmdb.org/t/p/w500${f.poster_path}`} className="rounded-lg shadow-lg"/>
                    </div>
                  ))}
                </div>
             </div>
          ) : (
            <div className="space-y-10">
              {/* HERO */}
              {filmeDestaque && (
                <div className="relative h-[80vh] w-full flex items-center px-12" style={{ backgroundImage: `linear-gradient(to right, #111111 10%, transparent 90%), url(https://image.tmdb.org/t/p/original${filmeDestaque.backdrop_path})`, backgroundSize: 'cover' }}>
                  <div className="max-w-2xl mt-20">
                    <h2 className="text-6xl font-black mb-4">{filmeDestaque.title}</h2>
                    <button onClick={() => setFilmeSelecionado(filmeDestaque)} className="bg-white text-black px-10 py-3 rounded font-bold hover:bg-gray-200">▶ Assistir</button>
                  </div>
                </div>
              )}
              {/* CARROSSEIS */}
              <div className="px-12 pb-20 space-y-10">
                {[ {t: "Tendências", d: filmesEmAlta}, {t: "Ação", d: filmesAcao}, {t: "Ficção", d: filmesFiccao} ].map((cat, i) => (
                  <div key={i}>
                    <h3 className="text-2xl font-bold mb-4">{cat.t}</h3>
                    <div className="flex gap-4 overflow-x-auto">
                      {(cat.d || []).slice(0, 10).map((f: any) => (
                        <div key={f.id} onClick={() => setFilmeSelecionado(f)} className="flex-none w-40 md:w-56 cursor-pointer hover:scale-105 transition-all">
                          <img src={`https://image.tmdb.org/t/p/w500${f.poster_path}`} className="rounded-lg shadow-2xl"/>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* MODAL DETALHES */}
      {filmeSelecionado && !mostrarPlayer && (
        <div className="fixed inset-0 z-50 bg-[#111111] p-10 flex flex-col md:flex-row gap-10">
          <button onClick={() => setFilmeSelecionado(null)} className="absolute top-10 right-10 bg-orange-600 px-6 py-2 rounded-full font-bold">FECHAR</button>
          <img src={`https://image.tmdb.org/t/p/w500${filmeSelecionado.poster_path}`} className="w-80 rounded-xl"/>
          <div className="flex-1">
             <h2 className="text-5xl font-black mb-4">{detalhesFilme?.title || filmeSelecionado.title}</h2>
             <p className="text-lg text-gray-400 mb-8">{detalhesFilme?.overview}</p>
             <button onClick={() => setMostrarPlayer(true)} className="bg-orange-600 w-full md:w-64 py-4 rounded font-black text-xl hover:bg-orange-700">▶ ASSISTIR FILME</button>
          </div>
        </div>
      )}

      {/* PLAYER (CORRIGIDO PARA SUPERFLIX) */}
      {mostrarPlayer && filmeSelecionado && (
        <div className="fixed inset-0 z-[60] bg-black">
          <button onClick={() => setMostrarPlayer(false)} className="absolute top-5 left-5 z-[70] bg-orange-600 px-6 py-2 rounded font-bold">VOLTAR</button>
          <iframe src={`https://superflixapi.best/filme/${filmeSelecionado.id}`} className="w-full h-full" allowFullScreen />
        </div>
      )}
    </main>
  );
}