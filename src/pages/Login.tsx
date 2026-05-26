import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { signIn } = useContext(AuthContext);
  const navigate = useNavigate();

  // Função que lida com o envio do formulário
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await signIn({ email, password });
      navigate("/chamados"); // Redireciona para o Dashboard em caso de sucesso
    } catch (err: any) {
      // Captura o erro da API (ex: senha incorreta) e exibe na tela
      setError(
        err.response?.data?.error || "Erro ao realizar login. Tente novamente.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Container principal ocupando a tela toda
    <div className="flex min-h-screen bg-brand-light">
      {/* Lado Esquerdo: Imagem/Pattern (Oculto no mobile) */}
      {/* Crie um arquivo genérico de fundo azul ou use a imagem das ondas */}
      <div
        className="hidden md:flex w-1/2 bg-brand-blue"
        style={{
          backgroundImage: "url('/bg-login.jpg.jpg')",
          backgroundSize: "cover",
        }}
      ></div>

      {/* Lado Direito: Formulário */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 md:p-12">
        <div className="w-full max-w-md bg-white rounded-xl shadow-sm p-8 border border-gray-100">
          <div className="flex justify-center mb-8 items-center gap-2">
            {/* Simulação do Logo */}
            <div className="w-8 h-8 rounded-full border-4 border-brand-blue border-t-transparent animate-spin-slow"></div>
            <h1 className="text-2xl font-bold text-brand-blue">HelpDesk</h1>
          </div>

          <h2 className="text-lg font-semibold mb-1 text-gray-800">
            Acesse o portal
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Entre usando seu e-mail e senha cadastrados
          </p>

          {/* Exibição de Erro */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemplo@mail.com"
                required
                className="w-full border-b border-gray-300 focus:border-brand-blue focus:outline-none py-2 text-sm transition-colors bg-transparent"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                required
                className="w-full border-b border-gray-300 focus:border-brand-blue focus:outline-none py-2 text-sm transition-colors bg-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand-dark text-white rounded-md py-3 mt-4 hover:bg-gray-800 transition-colors disabled:opacity-70 font-medium"
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>

        {/* Card para Clientes (Criar conta) */}
        <div className="w-full max-w-md bg-white rounded-xl shadow-sm p-6 mt-6 border border-gray-100 text-center">
          <p className="text-sm font-semibold text-gray-800 mb-1">
            Ainda não tem uma conta?
          </p>
          <p className="text-xs text-gray-500 mb-4">Cadastre agora mesmo</p>
          <Link
            to="/register"
            className="block w-full bg-gray-100 text-gray-700 rounded-md py-2 hover:bg-gray-200 transition-colors font-medium text-sm"
          >
            Criar conta
          </Link>
        </div>
      </div>
    </div>
  );
}
