export function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "O Cliente solicita",
      description: "Abertura de chamados com escolha de serviços e orçamento imediato."
    },
    {
      number: "02",
      title: "O Técnico atua",
      description: "Execução do serviço com liberdade para adicionar peças ou mão de obra extra."
    },
    {
      number: "03",
      title: "O Admin gerencia",
      description: "Visão 360º de todos os chamados, controle da equipe e relatórios."
    }
  ];

  return (
    <section className="py-24 bg-gray-900 text-white px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Como o HelpDesk funciona</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Um fluxo de trabalho desenhado para conectar quem precisa de ajuda com quem sabe resolver o problema.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Linha conectora (visível apenas no desktop) */}
          <div className="hidden md:block absolute top-8 left-[15%] right-[15%] h-0.5 bg-gray-700 -z-10"></div>

          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-brand-blue flex items-center justify-center text-2xl font-black mb-6 shadow-lg shadow-blue-900/50 border-4 border-gray-900">
                {step.number}
              </div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-gray-400 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}