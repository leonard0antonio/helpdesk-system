import { Clock, Wrench, ShieldCheck } from 'lucide-react';

export function Features() {
  const featureList = [
    {
      title: "Atendimento Ágil",
      description: "Clientes abrem chamados em segundos, selecionam os serviços necessários e recebem a estimativa de valor instantaneamente.",
      icon: <Clock size={28} />,
      colorClass: "bg-blue-100 text-brand-blue"
    },
    {
      title: "Controle Técnico",
      description: "Técnicos possuem um painel dedicado para gerenciar os chamados atribuídos, mudar status e adicionar serviços extras.",
      icon: <Wrench size={28} />,
      colorClass: "bg-indigo-100 text-indigo-600"
    },
    {
      title: "Gestão Centralizada",
      description: "Administradores têm visão global do negócio. Gestão completa de carteira de clientes, equipe técnica e catálogo.",
      icon: <ShieldCheck size={28} />,
      colorClass: "bg-teal-100 text-teal-600"
    }
  ];

  return (
    <section className="py-20 bg-white px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Feito para simplificar o seu dia a dia</h2>
          <p className="text-gray-500">Recursos poderosos desenhados para clientes, técnicos e administradores.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featureList.map((feature, index) => (
            <div key={index} className="bg-gray-50 p-8 rounded-2xl border border-gray-100 hover:border-brand-blue/30 hover:shadow-lg transition-all group">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${feature.colorClass}`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-500 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}