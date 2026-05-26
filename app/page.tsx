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
      } catch (erro) {
        console.error("Erro ao carregar filmes:", erro);
      }
    };
    carregarDados();
  }, []);

  useEffect(() => {
    if (termoBusca.length > 2) {
      const buscarFilmes = async () => {
        try {
          const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=pt-BR&query=${termoBusca}`);
          const data = await res.json();
          setResultadosBusca(data.results || []);
        } catch (erro) {
          console.error("Erro na busca:", erro);
        }
      };
      const delayBusca = setTimeout(() => buscarFilmes(), 500);
      return () => clearTimeout(delayBusca);
    } else {
      setResultadosBusca([]);
    }
  }, [termoBusca]);

  useEffect(() => {
    if (filmeSelecionado) {
      const buscarDetalhes = async () => {
        try {
          const res = await fetch(`https://api.themoviedb.org/3/movie/${filmeSelecionado.id}?api_key=${API_KEY}&language=pt-BR&append_to_response=credits`);
          const data = await res.json();
          setDetalhesFilme(data);
        } catch (erro) {
          console.error("Erro ao buscar detalhes:", erro);
        }
      };
      buscarDetalhes();
    } else {
      setDetalhesFilme(null);
      setMostrarPlayer(false);
    }
  }, [filmeSelecionado]);

  return (
    <main className="min-h-screen bg-[#0f172a] text-white font-sans selection:bg-blue-600 overflow-x-hidden">
      
      {/* NAVEGAÇÃO SUPERIOR */}
      <nav className="fixed w-full z-40 flex items-center justify-between p-3 md:p-6 bg-gradient-to-b from-black/95 via-black/80 to-transparent backdrop-blur-sm">
        <div className="flex items-center gap-2 md:gap-8">
          <h1 
            tabIndex={0}
            className="text-xl md:text-3xl font-extrabold text-blue-500 tracking-wider cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1 transition-all" 
            onClick={() => setTermoBusca('')}
          >
            FLIX<span className="text-white">PLUS</span>
          </h1>
          <div className="hidden lg:flex gap-6 text-sm font-semibold text-gray-300">
            <a href="/" className="hover:text-white transition-colors">Início</a>
            <a href="/canais" className="text-blue-400 hover:text-white transition-colors">TV Ao Vivo</a>
            <a href="#" className="hover:text-white transition-colors">Filmes</a>
          </div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-6">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Buscar..." 
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              className="bg-gray-800/80 border border-gray-700 text-white text-xs md:text-sm rounded-full pl-3 md:pl-4 pr-8 md:pr-10 py-1.5 md:py-2 w-32 md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-inner placeholder-gray-400"
            />
            <span className="absolute right-2 md:right-3 top-1.5 md:top-2 text-gray-400 text-xs md:text-sm">🔍</span>
          </div>
          <a 
            href="/admin" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 md:px-5 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-bold transition-all shadow-lg"
          >
            Admin
          </a>
        </div>
      </nav>

      {/* RENDERIZAÇÃO DA TELA */}
      {!filmeSelecionado && (
        <>
          {resultadosBusca.length > 0 && termoBusca.length > 2 ? (
            <div className="pt-24 md:pt-32 px-4 md:px-16 pb-32 min-h-screen">
              <h2 className="text-xl md:text-3xl font-bold mb-6 md:mb-8 text-gray-100">
                Resultados para: <span className="text-blue-500">&quot;{termoBusca}&quot;</span>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-6">
                {resultadosBusca.map((filme) => (
                  filme.poster_path && (
                    <div 
                      key={filme.id} 
                      onClick={() => setFilmeSelecionado(filme)} 
                      className="cursor-pointer group flex flex-col focus:outline-none transition-all"
                    >
                      <div className="relative overflow-hidden rounded-xl shadow-xl border border-gray-800 mb-2 md:mb-3">
                        <img src={`https://image.tmdb.org/t/p/w500${filme.poster_path}`} alt={filme.title} className="w-full h-auto aspect-[2/3] object-cover" />
                      </div>
                      <h3 className="text-xs md:text-sm font-bold text-gray-300 truncate">{filme.title}</h3>
                    </div>
                  )
                ))}
              </div>
            </div>
          ) : (
            <div className="pt-24 md:pt-0">
              {/* HERO */}
              {filmeDestaque && (
                <div className="relative h-[60vh] md:h-[90vh] w-full bg-cover bg-center flex flex-col justify-end pb-12 md:pb-32 transition-all duration-700" style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${filmeDestaque.backdrop_path})` }}>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a] via-[#0f172a]/80 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/50 to-transparent" />
                  <div className="relative z-10 px-4 md:px-16 max-w-2xl mt-16">
                    <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest mb-2 md:mb-4 inline-block">Destaque</span>
                    <h2 className="text-3xl md:text-6xl font-black mb-2 md:mb-4 drop-shadow-xl leading-tight">{filmeDestaque.title}</h2>
                    <p className="text-sm md:text-lg text-gray-300 mb-4 md:mb-8 drop-shadow-md line-clamp-2 md:line-clamp-3 font-normal">{filmeDestaque.overview}</p>
                    <button onClick={() => setFilmeSelecionado(filmeDestaque)} className="bg-white text-black px-4 md:px-8 py-2 md:py-3.5 rounded-lg md:rounded-xl font-bold text-sm md:text-lg hover:bg-blue-500 hover:text-white transition-all shadow-xl">
                        ℹ️ Detalhes
                    </button>
                  </div>
                </div>
              )}

              {/* CARROSSEIS */}
              <div className="relative z-20 px-4 md:px-16 pb-20 md:pb-32 space-y-8 md:space-y-12 -mt-4 md:-mt-8">
                {filmesEmAlta.length > 0 && (
                  <div>
                    <h3 className="text-lg md:text-2xl font-extrabold mb-3 md:mb-4 text-gray-100">🔥 Tendências</h3>
                    <div className="flex gap-3 md:gap-4 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory px-1">
                      {filmesEmAlta.slice(1).map((filme: any) => (
                        <div key={filme.id} onClick={() => setFilmeSelecionado(filme)} className="flex-none w-32 md:w-48 snap-start cursor-pointer">
                          <img src={`https://image.tmdb.org/t/p/w500${filme.poster_path}`} className="h-48 md:h-72 w-full object-cover rounded-xl"/>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* TELA DE DETALHES E PLAYER (Simplificados para manter o foco) */}
      {filmeSelecionado && !mostrarPlayer && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0f172a] p-4 flex items-center justify-center">
            <button onClick={() => setFilmeSelecionado(null)} className="absolute top-5 right-5 font-bold">FECHAR</button>
            <button onClick={() => setMostrarPlayer(true)} className="bg-blue-600 px-8 py-4 rounded-xl font-bold">ASSISTIR AGORA</button>
        </div>
      )}

      {mostrarPlayer && filmeSelecionado && (
        <div className="fixed inset-0 z-[60] bg-black">
          <button onClick={() => setMostrarPlayer(false)} className="absolute top-5 right-5 z-[70] bg-red-600 px-4 py-2 rounded">SAIR</button>
          <iframe src={`https://superflixapi.best/filme/${filmeSelecionado.id}`} className="w-full h-full" allowFullScreen />
        </div>
      )}
    </main>
  );
}