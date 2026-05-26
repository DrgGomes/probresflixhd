'use client';
import React, { useState, useEffect } from 'react';

// ==========================================
// CHAVE DA API DO TMDB
// ==========================================
const API_KEY = "1f812222d8bb5800fb23770e14078538"; 

export default function Home() {
  const [filmesEmAlta, setFilmesEmAlta] = useState<any[]>([]);
  const [filmesAcao, setFilmesAcao] = useState<any[]>([]);
  const [filmesFiccao, setFilmesFiccao] = useState<any[]>([]);
  const [filmeDestaque, setFilmeDestaque] = useState<any>(null);
  const [filmeAtivoNoPlayer, setFilmeAtivoNoPlayer] = useState<any>(null);

  // ==========================================
  // NOVOS ESTADOS PARA A BUSCA
  // ==========================================
  const [termoBusca, setTermoBusca] = useState('');
  const [resultadosBusca, setResultadosBusca] = useState<any[]>([]);

  // Carrega os carrosséis da página inicial
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

  // Faz a busca inteligente no TMDB enquanto o utilizador digita
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

      // Pequeno delay (500ms) para não pesquisar a cada letra única digitada
      const delayBusca = setTimeout(() => {
        buscarFilmes();
      }, 500);

      return () => clearTimeout(delayBusca);
    } else {
      setResultadosBusca([]); // Limpa a busca se apagar o texto
    }
  }, [termoBusca]);

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
        
        {/* BARRA DE BUSCA E BOTÃO ADMIN */}
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

          <a 
            href="/admin" 
            className="hidden md:block bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-sm font-bold transition-all shadow-lg hover:shadow-blue-500/20"
          >
            Admin
          </a>
        </div>
      </nav>

      {/* RENDERIZAÇÃO CONDICIONAL: TELA DE BUSCA OU TELA INICIAL */}
      {resultadosBusca.length > 0 && termoBusca.length > 2 ? (
        
        /* ==========================================
           TELA DE RESULTADOS DA BUSCA
           ========================================== */
        <div className="pt-32 px-6 md:px-16 pb-32 min-h-screen">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-100">
            Resultados para: <span className="text-blue-500">"{termoBusca}"</span>
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {resultadosBusca.map((filme) => (
              filme.poster_path && (
                <div 
                  key={filme.id}
                  onClick={() => setFilmeAtivoNoPlayer(filme)}
                  className="cursor-pointer group flex flex-col"
                >
                  <div className="relative overflow-hidden rounded-xl shadow-xl border border-gray-800 group-hover:border-blue-500 transition-all duration-300 group-hover:scale-105 transform mb-3">
                    <img 
                      src={`https://image.tmdb.org/t/p/w500${filme.poster_path}`} 
                      alt={filme.title} 
                      className="w-full h-auto aspect-[2/3] object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="bg-blue-600 text-white p-4 rounded-full text-2xl shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">▶</span>
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors truncate">{filme.title}</h3>
                  <p className="text-xs text-gray-500">{filme.release_date ? filme.release_date.substring(0, 4) : 'N/D'}</p>
                </div>
              )
            ))}
          </div>
        </div>

      ) : (

        /* ==========================================
           TELA INICIAL PADRÃO (HERO E CARROSSEIS)
           ========================================== */
        <div className={termoBusca.length > 0 ? "opacity-30 pointer-events-none transition-opacity" : "transition-opacity"}>
          {/* BANNER PRINCIPAL (HERO) */}
          {filmeDestaque && (
            <div 
              className="relative h-[80vh] md:h-[90vh] w-full bg-cover bg-center flex flex-col justify-end pb-24 md:pb-32 transition-all duration-700"
              style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${filmeDestaque.backdrop_path})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a] via-[#0f172a]/70 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/40 to-transparent" />
              
              <div className="relative z-10 px-6 md:px-16 max-w-2xl">
                <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 inline-block">
                  Destaque da Semana
                </span>
                <h2 className="text-4xl md:text-6xl font-black mb-4 drop-shadow-xl leading-tight">
                  {filmeDestaque.title}
                </h2>
                <p className="text-base md:text-lg text-gray-300 mb-8 drop-shadow-md line-clamp-3 font-normal">
                  {filmeDestaque.overview}
                </p>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setFilmeAtivoNoPlayer(filmeDestaque)}
                    className="bg-white text-black px-8 py-3.5 rounded-xl font-bold text-lg hover:bg-blue-500 hover:text-white transition-all duration-300 flex items-center gap-2 shadow-xl transform hover:-translate-y-0.5"
                  >
                    ▶ Assistir
                  </button>
                  <button className="bg-gray-800/80 backdrop-blur text-white px-8 py-3.5 rounded-xl font-bold text-lg hover:bg-gray-700 transition-all border border-gray-700 shadow-xl">
                    + Minha Lista
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* FILEIRAS DE FILMES */}
          <div className="relative z-20 px-6 md:px-16 pb-32 space-y-12 -mt-4 md:-mt-8">
            
            {filmesEmAlta.length > 0 && (
              <div>
                <h3 className="text-xl md:text-2xl font-extrabold mb-4 text-gray-100 tracking-wide flex items-center gap-2">🔥 Tendências Globais</h3>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory">
                  {filmesEmAlta.slice(1).map((filme) => (
                    <div key={filme.id} onClick={() => setFilmeAtivoNoPlayer(filme)} className="flex-none w-40 md:w-48 snap-start cursor-pointer group">
                      <div className="relative overflow-hidden rounded-2xl shadow-xl border border-gray-800 group-hover:border-blue-500 transition-all duration-300 group-hover:scale-105 transform">
                        <img src={`https://image.tmdb.org/t/p/w500${filme.poster_path}`} alt={filme.title} className="h-60 md:h-72 w-full object-cover"/>
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <span className="bg-blue-600 text-white p-3 rounded-full text-xl shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">▶</span>
                        </div>
                      </div>
                      <p className="mt-2 text-sm font-semibold truncate text-gray-400 group-hover:text-white transition-colors">{filme.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {filmesAcao.length > 0 && (
              <div>
                <h3 className="text-xl md:text-2xl font-extrabold mb-4 text-gray-100 tracking-wide">🔫 Pura Adrenalina (Ação)</h3>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x">
                  {filmesAcao.map((filme) => (
                    <div key={filme.id} onClick={() => setFilmeAtivoNoPlayer(filme)} className="flex-none w-40 md:w-48 snap-start cursor-pointer group">
                      <div className="relative overflow-hidden rounded-2xl shadow-xl border border-gray-800 group-hover:border-blue-500 transition-all duration-300 group-hover:scale-105 transform">
                        <img src={`https://image.tmdb.org/t/p/w500${filme.poster_path}`} alt={filme.title} className="h-60 md:h-72 w-full object-cover"/>
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <span className="bg-blue-600 text-white p-3 rounded-full text-xl">▶</span>
                        </div>
                      </div>
                      <p className="mt-2 text-sm font-semibold truncate text-gray-400 group-hover:text-white">{filme.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {filmesFiccao.length > 0 && (
              <div>
                <h3 className="text-xl md:text-2xl font-extrabold mb-4 text-gray-100 tracking-wide">🛸 Outros Mundos (Ficção)</h3>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x">
                  {filmesFiccao.map((filme) => (
                    <div key={filme.id} onClick={() => setFilmeAtivoNoPlayer(filme)} className="flex-none w-40 md:w-48 snap-start cursor-pointer group">
                      <div className="relative overflow-hidden rounded-2xl shadow-xl border border-gray-800 group-hover:border-blue-500 transition-all duration-300 group-hover:scale-105 transform">
                        <img src={`https://image.tmdb.org/t/p/w500${filme.poster_path}`} alt={filme.title} className="h-60 md:h-72 w-full object-cover"/>
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <span className="bg-blue-600 text-white p-3 rounded-full text-xl">▶</span>
                        </div>
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

      {/* ==========================================
          MODAL DO PLAYER DE CINEMA (SUPERFLIX API)
          ========================================== */}
      {filmeAtivoNoPlayer && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 transition-all duration-300">
          <div className="w-full max-w-5xl flex items-center justify-between mb-4 px-2">
            <h4 className="text-xl md:text-2xl font-black text-white truncate max-w-[70%]">
              A Assistir: <span className="text-blue-400 font-bold">{filmeAtivoNoPlayer.title}</span>
            </h4>
            <button 
              onClick={() => setFilmeAtivoNoPlayer(null)}
              className="bg-white/10 hover:bg-red-600 text-white font-bold px-4 py-2 rounded-xl transition-all duration-200 border border-white/10"
            >
              ✕ Fechar Cinema
            </button>
          </div>
          <div className="w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800 relative group">
            <iframe 
              src={`https://superflixapi.best/api/filme/${filmeAtivoNoPlayer.id}`}
              className="w-full h-full"
              allowFullScreen
              scrolling="no"
              frameBorder="0"
            />
          </div>
          <div className="w-full max-w-5xl mt-4 px-2 hidden md:block">
            <p className="text-gray-400 text-sm line-clamp-2"><span className="text-gray-200 font-bold">Sinopse:</span> {filmeAtivoNoPlayer.overview}</p>
          </div>
        </div>
      )}

    </main>
  );
}