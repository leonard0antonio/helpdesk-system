import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
        <Link to="/" className="inline-flex items-center gap-2 text-brand-blue font-semibold hover:underline mb-8">
          <ArrowLeft size={16} /> Voltar para o início
        </Link>
        <h1 className="text-3xl font-black text-gray-900 mb-4">Política de Privacidade</h1>
        <p className="text-sm text-gray-500 mb-8">Última atualização: 27 de Maio de 2026</p>
        
        <div className="prose prose-blue max-w-none text-gray-600 space-y-6">
          <p>A sua privacidade é importante para nós. É política do HelpDesk System respeitar a sua privacidade em relação a qualquer informação que possamos coletar no site e outros sistemas que possuímos e operamos.</p>
          
          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Informações que coletamos</h2>
          <p>Coletamos informações pessoais como nome, e-mail e dados de uso da plataforma (log de criação de chamados, serviços prestados e histórico de atendimento) exclusivamente para viabilizar o uso do sistema.</p>

          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Segurança de Dados e Imagens</h2>
          <p>As senhas são criptografadas (hash) antes de serem salvas no banco de dados. Imagens de perfil são armazenadas de forma segura em serviços de nuvem (Cloudinary). Não compartilhamos suas informações de identificação pessoal publicamente ou com terceiros, exceto quando exigido por lei.</p>

          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Retenção de Dados</h2>
          <p>Apenas retemos as informações coletadas pelo tempo necessário para fornecer o serviço solicitado. Os usuários Administradores e Clientes possuem a autonomia de solicitar a exclusão de suas contas a qualquer momento.</p>
        </div>
      </div>
    </div>
  );
}