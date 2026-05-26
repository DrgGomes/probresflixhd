'use client';
import React, { useState } from 'react';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';

export default function AdminPanel() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [logado, setLogado] = useState(false);

  const fazerLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, senha);
      setLogado(true);
      setErro('');
    } catch (error) {
      setErro('E-mail ou senha incorretos! Tente novamente.');
    }
  };

  const fazerLogout = async () => {
    await signOut(auth);
    setLogado(false);
  };

  // TELA DO PAINEL (O QUE VOCÊ VÊ APÓS LOGAR)
  if (logado) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white p-10 font-sans">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-800">
            <h1 className="text-3xl font-extrabold text-blue-500 tracking-wider">
              FLIX<span className="text-white">PLUS</span>{' '}
              <span className="text-gray-500 text-xl font-medium">
                | Painel Admin
              </span>
            </h1>
            <button
              onClick={fazerLogout}
              className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg font-bold transition-all shadow-lg"
            >
              Sair
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-xl">
              <h2 className="text-xl font-bold mb-2">Bem-vindo, Chefe! 🎬</h2>
              <p className="text-gray-400 text-sm">
                O seu sistema de streaming está operacional. O que deseja gerir
                hoje?
              </p>
            </div>
            {/* Aqui adicionaremos os botões de adicionar filmes e gerir utilizadores depois */}
          </div>
        </div>
      </div>
    );
  }

  // TELA DE LOGIN (O QUE OS INVASORES VEEM)
  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 font-sans">
      <form
        onSubmit={fazerLogin}
        className="bg-gray-900 p-10 rounded-3xl border border-gray-800 w-full max-w-md shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-blue-600"></div>
        <h2 className="text-3xl font-extrabold text-center text-white mb-2">
          Acesso Restrito
        </h2>
        <p className="text-center text-gray-400 mb-8 text-sm">
          Insira as suas credenciais para continuar.
        </p>

        {erro && (
          <div className="bg-red-500/10 text-red-500 p-3 rounded-lg mb-6 text-center border border-red-500/20 text-sm font-bold">
            {erro}
          </div>
        )}

        <div className="space-y-5">
          <div>
            <label className="block text-gray-400 mb-2 text-sm font-semibold">
              E-mail Administrativo
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0f172a] text-white p-3.5 rounded-xl border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all"
              placeholder="admin@flixplus.com"
              required
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-2 text-sm font-semibold">
              Palavra-passe
            </label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full bg-[#0f172a] text-white p-3.5 rounded-xl border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-blue-500/20 mt-4"
          >
            Entrar no Painel
          </button>
        </div>
      </form>
    </div>
  );
}
