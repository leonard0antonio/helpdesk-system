export function Footer() {
  return (
    <footer className="bg-brand-dark py-12 px-6 text-center border-t border-gray-800">
      <div className="flex items-center justify-center gap-2 mb-4">
        <div className="w-6 h-6 rounded-full border-2 border-white border-t-transparent animate-spin-slow"></div>
        <span className="text-xl font-bold text-white">HelpDesk</span>
      </div>
      <p className="text-gray-400 text-sm">
        © {new Date().getFullYear()} HelpDesk System. Desenvolvido para simplificar processos.
      </p>
    </footer>
  );
}