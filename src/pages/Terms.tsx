import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function Terms() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
        <Link to="/" className="inline-flex items-center gap-2 text-brand-blue font-semibold hover:underline mb-8">
          <ArrowLeft size={16} /> Voltar para o início
        </Link>
        <h1 className="text-3xl font-black text-gray-900 mb-4">Termos de Serviço</h1>
        <p className="text-sm text-gray-500 mb-8">Última atualização: 27 de Maio de 2026</p>
        
        <div className="prose prose-blue max-w-none text-gray-600 space-y-6">
          <p>Bem-vindo ao HelpDesk System. Ao acessar e utilizar nossa plataforma, você concorda em cumprir e estar vinculado aos seguintes termos de serviço. Caso não concorde com qualquer parte destes termos, você não deve usar nosso serviço.</p>
          
          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Uso do Sistema</h2>
          <p>Nossa plataforma oferece infraestrutura SaaS no formato "Pay as you go". Você é responsável por manter a confidencialidade das suas credenciais de acesso e por todas as atividades que ocorram na sua conta.</p>

          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Faturamento e Pagamentos</h2>
          <p>O plano "Profissional" é cobrado por demanda. A tarifação de R$ 1,99 ocorre exclusivamente no encerramento (status CLOSED) de cada chamado. Não há cobrança para chamados cancelados ou não iniciados.</p>

          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Modificações do Serviço</h2>
          <p>Reservamo-nos o direito de modificar ou descontinuar, temporária ou permanentemente, o serviço (ou qualquer parte dele) com ou sem aviso prévio.</p>
        </div>
      </div>
    </div>
  );
}