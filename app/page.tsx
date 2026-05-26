'use client';
import React, { useState, useEffect } from 'react';

const API_KEY = "1f812222d8bb5800fb23770e14078538"; 

export default function Home() {
  const [filmesEmAlta, setFilmesEmAlta] = useState<any[]>([]);
  const [filmesAcao, setFilmesAcao] = useState<any[]>([]);
  const [filmesFiccao, setFilmesFiccao] = useState<any[]>([]);
  const [filmeDestaque, setFilmeDestaque] = useState<any>(null);
  
  // Estados de Busca
  const [termoBusca, setTermoBusca] = useState('');
  const [resultadosBusca, setResultadosBusca] = useState<any[]>([]);

  // Estados da Nova Tela de Detalhes e Player
  const [filmeSelecionado, setFilmeSelecionado] = useState<any>(null); // Filme que o usuário clicou
  const [detalhesFilme, setDetalhesFilme] = useState<any>(null); // Dados completos (duração, diretor, etc)
  const [mostrarPlayer, setMostrarPlayer] = useState(false); // Ativa o iframe do Superflix

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

  // Sempre que clica num filme, busca os detalhes avançados (Duração, Cast, Nota)
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
    <main className="min-h-screen bg-[#0f172a] text-white font-sans selection:bg-blue-600">
      
      {/* MENU NAVEGAÇÃO SUPERIOR */}
      <nav className="fixed w-full z-40 flex items-center justify-between p-4 md:p-6 bg-gradient-to-b from-black/95 via-black/60 to-transparent backdrop-blur-sm">
        <div className="flex items-center gap-4 md:gap-8">
          <h1 className="text-2xl md:text-3xl font-extrabold text-blue-500 tracking-wider cursor-pointer hover:scale-105 transition-transform duration-300" onClick={() => setTermoBusca('')}>
            FLIX<span className="text-white">PLUS</span>
          </h1>
          <div className="hidden lg:flex gap-6 text-sm font-semibold text-gray-300">
            <a href="#" onClick={() => setTermoBusca('')} className="hover:text-white transition-colors">Início</a>
            <a href="#" className="hover:text-white transition-colors">Séries</a>
            <a href="#" className="hover:text-white transition-colors">Filmes</a>
          </div>
        </div>
        
        <div className="flex items-center gap-3 md:gap-6">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Pesquisar filme..." 
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              className="bg-gray-800/80 border border-gray-700 text-white text-sm rounded-full pl-4 pr-10 py-2 w-40 md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-inner placeholder-gray-400"
            />
            <span className="absolute right-3 top-2 text-gray-400 text-sm">🔍</span>
          </div>
          <a href="/admin" className="hidden md:block bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-sm font-bold transition-all shadow-lg hover:shadow-blue-500/20">
            Admin
          </a>
        </div>
      </nav>

      {/* RENDERIZAÇÃO DA TELA DE BUSCA OU INICIAL (APENAS SE NENHUM FILME ESTIVER SELECIONADO) */}
      {!filmeSelecionado && (
        <>
          {resultadosBusca.length > 0 && termoBusca.length > 2 ? (
            <div className="pt-32 px-6 md:px-16 pb-32 min-h-screen">
              <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-100">
                Resultados para: <span className="text-blue-500">&quot;{termoBusca}&quot;</span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {resultadosBusca.map((filme) => (
                  filme.poster_path && (
                    <div key={filme.id} onClick={() => setFilmeSelecionado(filme)} className="cursor-pointer group flex flex-col">
                      <div className="relative overflow-hidden rounded-xl shadow-xl border border-gray-800 group-hover:border-blue-500 transition-all duration-300 group-hover:scale-105 transform mb-3">
                        <img src={`https://image.tmdb.org/t/p/w500${filme.poster_path}`} alt={filme.title} className="w-full h-auto aspect-[2/3] object-cover" />
                      </div>
                      <h3 className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors truncate">{filme.title}</h3>
                      <p className="text-xs text-gray-500">{filme.release_date ? filme.release_date.substring(0, 4) : 'N/D'}</p>
                    </div>
                  )
                ))}
              </div>
            </div>
          ) : (
            <div className={termoBusca.length > 0 ? "opacity-30 pointer-events-none transition-opacity" : "transition-opacity"}>
              {/* HERO */}
              {filmeDestaque && (
                <div className="relative h-[80vh] md:h-[90vh] w-full bg-cover bg-center flex flex-col justify-end pb-24 md:pb-32 transition-all duration-700" style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${filmeDestaque.backdrop_path})` }}>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a] via-[#0f172a]/70 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/40 to-transparent" />
                  <div className="relative z-10 px-6 md:px-16 max-w-2xl">
                    <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 inline-block">Destaque da Semana</span>
                    <h2 className="text-4xl md:text-6xl font-black mb-4 drop-shadow-xl leading-tight">{filmeDestaque.title}</h2>
                    <p className="text-base md:text-lg text-gray-300 mb-8 drop-shadow-md line-clamp-3 font-normal">{filmeDestaque.overview}</p>
                    <div className="flex gap-4">
                      <button onClick={() => setFilmeSelecionado(filmeDestaque)} className="bg-white text-black px-8 py-3.5 rounded-xl font-bold text-lg hover:bg-blue-500 hover:text-white transition-all shadow-xl">
                        ℹ️ Mais Informações
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {/* CARROSSEIS */}
              <div className="relative z-20 px-6 md:px-16 pb-32 space-y-12 -mt-4 md:-mt-8">
                {/* Em Alta */}
                {filmesEmAlta.length > 0 && (
                  <div>
                    <h3 className="text-xl md:text-2xl font-extrabold mb-4 text-gray-100 flex items-center gap-2">🔥 Tendências Globais</h3>
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory">
                      {filmesEmAlta.slice(1).map((filme) => (
                        <div key={filme.id} onClick={() => setFilmeSelecionado(filme)} className="flex-none w-40 md:w-48 snap-start cursor-pointer group">
                          <div className="relative overflow-hidden rounded-2xl shadow-xl border border-gray-800 group-hover:border-blue-500 transition-all duration-300 group-hover:scale-105 transform">
                            <img src={`https://image.tmdb.org/t/p/w500${filme.poster_path}`} className="h-60 md:h-72 w-full object-cover"/>
                          </div>
                          <p className="mt-2 text-sm font-semibold truncate text-gray-400 group-hover:text-white">{filme.title}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {/* Ação */}
                {filmesAcao.length > 0 && (
                  <div>
                    <h3 className="text-xl md:text-2xl font-extrabold mb-4 text-gray-100">🔫 Pura Adrenalina (Ação)</h3>
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x">
                      {filmesAcao.map((filme) => (
                        <div key={filme.id} onClick={() => setFilmeSelecionado(filme)} className="flex-none w-40 md:w-48 snap-start cursor-pointer group">
                          <div className="relative overflow-hidden rounded-2xl shadow-xl border border-gray-800 group-hover:border-blue-500 transition-all duration-300 group-hover:scale-105 transform">
                            <img src={`https://image.tmdb.org/t/p/w500${filme.poster_path}`} className="h-60 md:h-72 w-full object-cover"/>
                          </div>
                          <p className="mt-2 text-sm font-semibold truncate text-gray-400 group-hover:text-white">{filme.title}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {/* Ficção */}
                {filmesFiccao.length > 0 && (
                  <div>
                    <h3 className="text-xl md:text-2xl font-extrabold mb-4 text-gray-100">🛸 Outros Mundos (Ficção)</h3>
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x">
                      {filmesFiccao.map((filme) => (
                        <div key={filme.id} onClick={() => setFilmeSelecionado(filme)} className="flex-none w-40 md:w-48 snap-start cursor-pointer group">
                          <div className="relative overflow-hidden rounded-2xl shadow-xl border border-gray-800 group-hover:border-blue-500 transition-all duration-300 group-hover:scale-105 transform">
                            <img src={`https://image.tmdb.org/t/p/w500${filme.poster_path}`} className="h-60 md:h-72 w-full object-cover"/>
                          </div>
                          <p className="mt-2 text-sm font-semibold truncate text-gray-400 group-hover:text-white">{filme.title}</p>
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

      {/* ==========================================
          NOVA TELA DE DETALHES ESTILO TMDB
          ========================================== */}
      {filmeSelecionado && !mostrarPlayer && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0f172a] animate-fadeIn">
          {/* Fundo Desfocado da Capa */}
          <div 
            className="absolute top-0 left-0 w-full h-[70vh] bg-cover bg-center opacity-20"
            style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${filmeSelecionado.backdrop_path})` }}
          />
          <div className="absolute top-0 left-0 w-full h-[70vh] bg-gradient-to-b from-[#0f172a]/50 via-[#0f172a]/90 to-[#0f172a]" />

          <div className="relative z-10 min-h-screen p-6 md:p-12 flex flex-col">
            
            {/* Botão de Voltar */}
            <div className="w-full max-w-6xl mx-auto mb-8 flex justify-end pt-16">
              <button onClick={() => setFilmeSelecionado(null)} className="text-gray-400 hover:text-white font-bold text-lg transition-colors flex items-center gap-2">
                ✕ Voltar ao Catálogo
              </button>
            </div>

            {/* Carregamento ou Dados */}
            {detalhesFilme ? (
              <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row gap-10">
                
                {/* Poster Lateral (Esquerda) */}
                <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0 mx-auto md:mx-0">
                  <img 
                    src={`https://image.tmdb.org/t/p/w500${detalhesFilme.poster_path}`} 
                    alt={detalhesFilme.title} 
                    className="w-full rounded-2xl shadow-2xl border border-gray-800"
                  />
                </div>

                {/* Informações (Direita) */}
                <div className="w-full md:w-2/3 lg:w-3/4 flex flex-col justify-center">
                  
                  {/* Título e Ano */}
                  <h2 className="text-4xl md:text-5xl font-black mb-2 drop-shadow-lg text-white">
                    {detalhesFilme.title} <span className="font-light text-gray-400">({detalhesFilme.release_date?.substring(0,4)})</span>
                  </h2>
                  
                  {/* Classificação, Gênero e Duração */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 mb-6 font-medium">
                    <span className="border border-gray-500 px-2 py-0.5 rounded text-xs">BR</span>
                    <span>{detalhesFilme.release_date?.split('-').reverse().join('/')}</span>
                    <span className="hidden md:inline">•</span>
                    <span>{detalhesFilme.genres?.map((g: any) => g.name).join(', ')}</span>
                    <span className="hidden md:inline">•</span>
                    <span>{Math.floor(detalhesFilme.runtime / 60)}h {detalhesFilme.runtime % 60}m</span>
                  </div>

                  {/* Nota e Botão de Ação */}
                  <div className="flex items-center gap-6 mb-8">
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-900 rounded-full h-16 w-16 flex items-center justify-center border-4 border-green-500 shadow-lg">
                        <span className="text-white font-bold text-xl">{Math.round(detalhesFilme.vote_average * 10)}%</span>
                      </div>
                      <span className="text-sm font-bold w-16 leading-tight text-gray-300">Avaliação Geral</span>
                    </div>

                    <button 
                      onClick={() => setMostrarPlayer(true)} 
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-blue-500/30 shadow-lg flex items-center gap-3 hover:scale-105"
                    >
                      <span className="text-2xl">▶</span> Assistir Filme
                    </button>
                  </div>

                  {/* Sinopse */}
                  <h3 className="text-xl font-bold mb-3 text-gray-200">Sinopse</h3>
                  <p className="text-gray-400 mb-8 leading-relaxed text-lg max-w-4xl">
                    {detalhesFilme.overview || "Nenhuma sinopse disponível em português para este título."}
                  </p>

                  {/* Equipe Principal (Diretor) */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-4 border-t border-gray-800 max-w-4xl">
                    {detalhesFilme.credits?.crew?.filter((c: any) => c.job === 'Director').slice(0, 2).map((dir: any) => (
                      <div key={dir.id}>
                        <p className="font-bold text-white text-lg">{dir.name}</p>
                        <p className="text-sm text-gray-500 font-medium">Diretor</p>
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL DO PLAYER DE CINEMA (CORRIGIDO PARA /filme/)
          ========================================== */}
      {mostrarPlayer && filmeSelecionado && (
        <div className="fixed inset-0 z-[60] bg-black flex flex-col items-center justify-center animate-fadeIn">
          {/* Barra Superior do Player */}
          <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center bg-gradient-to-b from-black to-transparent z-[70] pointer-events-none">
            <h4 className="text-2xl font-black text-white drop-shadow-md">
              <span className="text-blue-500">A Assistir:</span> {filmeSelecionado.title}
            </h4>
            <button 
              onClick={() => setMostrarPlayer(false)}
              className="bg-gray-800/80 hover:bg-red-600 text-white font-bold px-6 py-2 rounded-xl transition-all border border-gray-700 pointer-events-auto backdrop-blur"
            >
              ✕ Fechar Cinema
            </button>
          </div>

          {/* Player da Superflix (Endpoint Corrigido: /filme/ em vez de /api/filme/) */}
          <iframe 
            src={`https://superflixapi.best/filme/${filmeSelecionado.id}`}
            className="w-full h-full"
            allowFullScreen
            scrolling="no"
            frameBorder="0"
          />
        </div>
      )}

    </main>
  );
}