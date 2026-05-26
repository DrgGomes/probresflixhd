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

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const resAlta = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}&language=pt-BR`);
        const dataAlta = await resAlta.json();
        setFilmesEmAlta(dataAlta.results || []);
        setFilmeDestaque(dataAlta.results ? dataAlta.results[0] : null);

        const resAcao = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=pt-BR&with_genres=28`);
        const dataAcao = await resAcao.json();
        setFilmesAcao(dataAcao.results || []);

        const resFiccao = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=pt-BR&with_genres=878`);
        const dataFiccao = await resFiccao.json();
        setFilmesFiccao(dataFiccao.results || []);
      } catch (erro) { console.error("Erro ao carregar:", erro); }
    };
    carregarDados();
  }, []);

  // Busca e Detalhes mantêm lógica anterior...
  useEffect(() => {
    if (termoBusca.length > 2) {
      const buscar = async () => {
        const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=pt-BR&query=${termoBusca}`);
        const data = await res.json();
        setResultadosBusca(data.results || []);
      };
      const delay = setTimeout(buscar, 500);
      return () => clearTimeout(delay);
    } else { setResultadosBusca([]); }
  }, [termoBusca]);

  useEffect(() => {
    if (filmeSelecionado) {
      fetch(`https://api.themoviedb.org/3/movie/${filmeSelecionado.id}?api_key=${API_KEY}&language=pt-BR&append_to_response=credits`)
        .then(res => res.json())
        .then(data => setDetalhesFilme(data));
    } else { setDetalhesFilme(null); setMostrarPlayer(false); }
  }, [filmeSelecionado]);

  return (
    <main className="min-h-screen bg-[#111111] text-white font-sans selection:bg-orange-600">
      
      {/* NAVBAR */}
      <nav className="fixed w-full z-40 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-8">
          <h1 tabIndex={0} className="text-3xl font-black text-orange-600 cursor-pointer focus:ring-2 focus:ring-orange-500 outline-none" onClick={() => window.location.href = '/'}>
            FLIX<span className="text-white">PLUS</span>
          </h1>
          <div className="hidden lg:flex gap-6 text-sm font-bold text-gray-300">
            <a href="/" className="hover:text-orange-500 transition-colors">Início</a>
            <a href="/canais" className="hover:text-orange-500 transition-colors">TV Ao Vivo</a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <input 
            type="text" placeholder="Buscar..." value={termoBusca} onChange={(e) => setTermoBusca(e.target.value)}
            className="bg-black/50 border border-gray-700 text-sm rounded-lg px-4 py-2 w-40 md:w-64 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <a href="/admin" className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-lg font-bold text-sm transition-all focus:ring-4 focus:ring-white">Admin</a>
        </div>
      </nav>

      {/* HERO (Netflix Style) */}
      {!filmeSelecionado && filmeDestaque && termoBusca.length < 3 && (
        <div className="relative h-[85vh] w-full flex items-center justify-start px-12" style={{ backgroundImage: `linear-gradient(to right, #111111 10%, transparent 90%), url(https://image.tmdb.org/t/p/original${filmeDestaque.backdrop_path})`, backgroundSize: 'cover' }}>
          <div className="max-w-2xl mt-20">
            <h2 className="text-6xl font-black mb-4">{filmeDestaque.title}</h2>
            <p className="text-lg text-gray-300 mb-6 line-clamp-3">{filmeDestaque.overview}</p>
            <div className="flex gap-4">
              <button onClick={() => setFilmeSelecionado(filmeDestaque)} tabIndex={0} className="bg-white text-black px-10 py-3 rounded font-bold text-lg hover:bg-gray-200 focus:ring-4 focus:ring-orange-500 outline-none">▶ Assistir</button>
              <button tabIndex={0} className="bg-gray-700/80 px-10 py-3 rounded font-bold text-lg hover:bg-gray-600 focus:ring-4 focus:ring-orange-500 outline-none">ℹ️ Mais Info</button>
            </div>
          </div>
        </div>
      )}

      {/* CARROSSEIS (Smart TV Focus Effects) */}
      {!filmeSelecionado && (
        <div className="px-4 md:px-12 pb-20 -mt-20 relative z-20 space-y-10">
          {[ {t: "Tendências", d: filmesEmAlta}, {t: "Ação", d: filmesAcao}, {t: "Ficção", d: filmesFiccao} ].map((cat, i) => (
            <div key={i}>
              <h3 className="text-2xl font-bold mb-4 ml-2">{cat.t}</h3>
              <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
                {cat.d.slice(0, 10).map((f: any) => (
                  <div key={f.id} onClick={() => setFilmeSelecionado(f)} tabIndex={0} className="flex-none w-40 md:w-56 cursor-pointer transform hover:scale-105 focus:scale-105 focus:ring-4 focus:ring-orange-500 outline-none rounded-lg transition-all">
                    <img src={`https://image.tmdb.org/t/p/w500${f.poster_path}`} className="w-full h-auto rounded-lg shadow-2xl"/>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DETALHES (Estilo Modal Premium) */}
      {filmeSelecionado && !mostrarPlayer && (
        <div className="fixed inset-0 z-50 bg-[#111111] overflow-y-auto p-4 md:p-16 flex flex-col md:flex-row gap-10">
          <button onClick={() => setFilmeSelecionado(null)} className="absolute top-10 right-10 z-[60] bg-orange-600 px-6 py-2 rounded-full font-bold">FECHAR</button>
          <div className="w-full md:w-1/3">
             <img src={`https://image.tmdb.org/t/p/w500${filmeSelecionado.poster_path}`} className="w-full rounded-xl"/>
          </div>
          <div className="flex-1 flex flex-col justify-center">
             <h2 className="text-5xl font-black mb-4">{detalhesFilme?.title || filmeSelecionado.title}</h2>
             <p className="text-lg text-gray-400 mb-8 max-w-2xl">{detalhesFilme?.overview}</p>
             <button onClick={() => setMostrarPlayer(true)} className="bg-orange-600 w-full md:w-64 py-4 rounded font-black text-xl hover:bg-orange-700 transition-all outline-none focus:ring-4 focus:ring-white">▶ ASSISTIR FILME</button>
          </div>
        </div>
      )}

      {/* PLAYER */}
      {mostrarPlayer && filmeSelecionado && (
        <div className="fixed inset-0 z-[60] bg-black">
          <button onClick={() => setMostrarPlayer(false)} className="absolute top-5 left-5 z-[70] bg-orange-600 px-6 py-2 rounded font-bold">VOLTAR</button>
          <iframe src={`https://embedflix.in/filme/${filmeSelecionado.id}`} className="w-full h-full" allowFullScreen />
        </div>
      )}
    </main>
  );
}