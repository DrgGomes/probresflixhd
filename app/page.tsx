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
      
      {/* NAVEGAÇÃO SUPERIOR - Otimizada para Mobile */}
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
            <a href="#" onClick={() => setTermoBusca('')} className="hover:text-white transition-colors focus:text-white focus:outline-none">Início</a>
            <a href="#" className="hover:text-white transition-colors focus:text-white focus:outline-none">Séries</a>
            <a href="#" className="hover:text-white transition-colors focus:text-white focus:outline-none">Filmes</a>
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
            tabIndex={0}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 md:px-5 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-bold transition-all shadow-lg focus:outline-none focus:ring-4 focus:ring-white"
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
                      tabIndex={0}
                      className="cursor-pointer group flex flex-col focus:outline-none focus:ring-4 focus:ring-blue-500 focus:scale-105 rounded-xl transition-all"
                    >
                      <div className="relative overflow-hidden rounded-xl shadow-xl border border-gray-800 mb-2 md:mb-3">
                        <img src={`https://image.tmdb.org/t/p/w500${filme.poster_path}`} alt={filme.title} className="w-full h-auto aspect-[2/3] object-cover" />
                      </div>
                      <h3 className="text-xs md:text-sm font-bold text-gray-300 group-focus:text-white truncate">{filme.title}</h3>
                    </div>
                  )
                ))}
              </div>
            </div>
          ) : (
            <div className={termoBusca.length > 0 ? "opacity-30 pointer-events-none transition-opacity" : "transition-opacity"}>
              
              {/* HERO (Adaptado para Mobile) */}
              {filmeDestaque && (
                <div className="relative h-[60vh] md:h-[90vh] w-full bg-cover bg-center flex flex-col justify-end pb-12 md:pb-32 transition-all duration-700" style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${filmeDestaque.backdrop_path})` }}>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a] via-[#0f172a]/80 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/50 to-transparent" />
                  <div className="relative z-10 px-4 md:px-16 max-w-2xl mt-16">
                    <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest mb-2 md:mb-4 inline-block">Destaque</span>
                    <h2 className="text-3xl md:text-6xl font-black mb-2 md:mb-4 drop-shadow-xl leading-tight">{filmeDestaque.title}</h2>
                    <p className="text-sm md:text-lg text-gray-300 mb-4 md:mb-8 drop-shadow-md line-clamp-2 md:line-clamp-3 font-normal">{filmeDestaque.overview}</p>
                    <div className="flex gap-2 md:gap-4">
                      <button 
                        tabIndex={0}
                        onClick={() => setFilmeSelecionado(filmeDestaque)} 
                        className="bg-white text-black px-4 md:px-8 py-2 md:py-3.5 rounded-lg md:rounded-xl font-bold text-sm md:text-lg hover:bg-blue-500 hover:text-white transition-all shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-500"
                      >
                        ℹ️ Detalhes
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* CARROSSEIS (Com foco para Smart TV) */}
              <div className="relative z-20 px-4 md:px-16 pb-20 md:pb-32 space-y-8 md:space-y-12 -mt-4 md:-mt-8">
                
                {[
                  { titulo: "🔥 Tendências Globais", dados: filmesEmAlta.slice(1) },
                  { titulo: "🔫 Pura Adrenalina", dados: filmesAcao },
                  { titulo: "🛸 Outros Mundos", dados: filmesFiccao }
                ].map((categoria, index) => (
                  categoria.dados.length > 0 && (
                    <div key={index}>
                      <h3 className="text-lg md:text-2xl font-extrabold mb-3 md:mb-4 text-gray-100">{categoria.titulo}</h3>
                      {/* Container scrollável com padding invisível para não cortar sombras */}
                      <div className="flex gap-3 md:gap-4 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory px-1">
                        {categoria.dados.map((filme: any) => (
                          <div 
                            key={filme.id} 
                            onClick={() => setFilmeSelecionado(filme)} 
                            tabIndex={0}
                            className="flex-none w-32 md:w-48 snap-start cursor-pointer group focus:outline-none focus:scale-105 transition-transform"
                          >
                            <div className="relative overflow-hidden rounded-xl md:rounded-2xl shadow-xl border border-gray-800 group-focus:border-blue-500 group-focus:ring-4 group-focus:ring-blue-500 transition-all duration-300">
                              <img src={`https://image.tmdb.org/t/p/w500${filme.poster_path}`} className="h-48 md:h-72 w-full object-cover"/>
                            </div>
                            <p className="mt-1 md:mt-2 text-xs md:text-sm font-semibold truncate text-gray-400 group-focus:text-white">{filme.title}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* TELA DE DETALHES ESTILO TMDB (Responsiva) */}
      {filmeSelecionado && !mostrarPlayer && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0f172a] animate-fadeIn">
          <div className="absolute top-0 left-0 w-full h-[50vh] md:h-[70vh] bg-cover bg-center opacity-20" style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${filmeSelecionado.backdrop_path})` }} />
          <div className="absolute top-0 left-0 w-full h-[50vh] md:h-[70vh] bg-gradient-to-b from-[#0f172a]/50 via-[#0f172a]/90 to-[#0f172a]" />

          <div className="relative z-10 min-h-screen p-4 md:p-12 flex flex-col">
            <div className="w-full max-w-6xl mx-auto mb-4 md:mb-8 flex justify-end pt-4 md:pt-16">
              <button 
                tabIndex={0}
                onClick={() => setFilmeSelecionado(null)} 
                className="bg-gray-800/80 p-2 md:p-0 md:bg-transparent rounded-full md:rounded-none text-white md:text-gray-400 hover:text-white font-bold text-sm md:text-lg flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-white"
              >
                ✕ <span className="hidden md:inline">Voltar ao Catálogo</span>
              </button>
            </div>

            {detalhesFilme ? (
              <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row gap-6 md:gap-10">
                
                {/* Poster Lateral (Esquerda) */}
                <div className="w-3/5 sm:w-1/2 md:w-1/3 lg:w-1/4 flex-shrink-0 mx-auto md:mx-0">
                  <img src={`https://image.tmdb.org/t/p/w500${detalhesFilme.poster_path}`} className="w-full rounded-2xl shadow-2xl border border-gray-800" />
                </div>

                {/* Informações (Direita) */}
                <div className="w-full md:w-2/3 lg:w-3/4 flex flex-col justify-center text-center md:text-left">
                  
                  <h2 className="text-3xl md:text-5xl font-black mb-2 drop-shadow-lg text-white">
                    {detalhesFilme.title} <span className="font-light text-gray-400 block md:inline text-xl md:text-5xl">({detalhesFilme.release_date?.substring(0,4)})</span>
                  </h2>
                  
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 md:gap-4 text-xs md:text-sm text-gray-300 mb-4 md:mb-6 font-medium">
                    <span className="border border-gray-500 px-2 py-0.5 rounded">BR</span>
                    <span>{detalhesFilme.release_date?.split('-').reverse().join('/')}</span>
                    <span className="hidden md:inline">•</span>
                    <span>{detalhesFilme.genres?.map((g: any) => g.name).join(', ')}</span>
                    <span className="hidden md:inline">•</span>
                    <span>{Math.floor(detalhesFilme.runtime / 60)}h {detalhesFilme.runtime % 60}m</span>
                  </div>

                  <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 mb-6 md:mb-8">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="bg-gray-900 rounded-full h-12 w-12 md:h-16 md:w-16 flex items-center justify-center border-[3px] md:border-4 border-green-500 shadow-lg">
                        <span className="text-white font-bold text-sm md:text-xl">{Math.round(detalhesFilme.vote_average * 10)}%</span>
                      </div>
                      <span className="text-xs md:text-sm font-bold w-16 leading-tight text-gray-300 text-left">Avaliação Geral</span>
                    </div>

                    <button 
                      tabIndex={0}
                      onClick={() => setMostrarPlayer(true)} 
                      className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold text-base md:text-lg transition-all shadow-blue-500/30 shadow-lg flex items-center justify-center gap-3 focus:outline-none focus:ring-4 focus:ring-white"
                    >
                      <span className="text-xl md:text-2xl">▶</span> Assistir Filme
                    </button>
                  </div>

                  <h3 className="text-lg md:text-xl font-bold mb-2 text-gray-200">Sinopse</h3>
                  <p className="text-gray-400 mb-6 md:mb-8 leading-relaxed text-sm md:text-lg max-w-4xl text-left">
                    {detalhesFilme.overview || "Nenhuma sinopse disponível em português para este título."}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="animate-spin h-8 w-8 md:h-12 md:w-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PLAYER DE CINEMA (Ecrã Inteiro Absoluto no Mobile) */}
      {mostrarPlayer && filmeSelecionado && (
        <div className="fixed inset-0 z-[60] bg-black flex flex-col animate-fadeIn">
          <div className="absolute top-0 left-0 w-full p-2 md:p-6 flex justify-between items-center bg-gradient-to-b from-black/90 to-transparent z-[70] pointer-events-none">
            <h4 className="text-sm md:text-2xl font-black text-white drop-shadow-md truncate max-w-[60%]">
              <span className="text-blue-500 hidden md:inline">A Assistir:</span> {filmeSelecionado.title}
            </h4>
            <button 
              tabIndex={0}
              onClick={() => setMostrarPlayer(false)}
              className="bg-gray-800/80 md:bg-gray-800/50 hover:bg-red-600 text-white font-bold px-3 md:px-6 py-1.5 md:py-2 rounded-lg md:rounded-xl transition-all border border-gray-700 pointer-events-auto backdrop-blur text-xs md:text-base focus:outline-none focus:ring-2 focus:ring-white"
            >
              ✕ <span className="hidden md:inline">Fechar</span>
            </button>
          </div>

          {/* Player com URL da Superflix */}
          <iframe 
            src={`https://superflixapi.best/filme/${filmeSelecionado.id}`}
            className="w-full h-full pt-12 md:pt-0"
            allowFullScreen
            scrolling="no"
            frameBorder="0"
          />
        </div>
      )}

    </main>
  );
}