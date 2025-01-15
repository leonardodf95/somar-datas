import { useState } from "react";
import "./App.css";

function App() {
  const [user, setUser] = useState("");
  const [userConfirmed, setUserConfirmed] = useState(false);
  const [local, setLocal] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [entries, setEntries] = useState([]);

  const handleAddEntry = () => {
    if (!local.trim()) {
      alert("O campo local é obrigatório!");
      return;
    }

    if (!startDate || !endDate) {
      alert("As datas são obrigatórias!");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      alert("A data final não pode ser menor que a data inicial!");
      return;
    }

    const { years, months, days } = CalculateDiff(end, start);

    const newEntry = { local, startDate, endDate, years, months, days };
    setEntries([...entries, newEntry]);

    // Limpa os campos
    setLocal("");
    setStartDate("");
    setEndDate("");
  };

  function CalculateDiff(dtFinal, dtInicial) {
    let years = dtFinal.getFullYear() - dtInicial.getFullYear();
    let months = dtFinal.getMonth() - dtInicial.getMonth();
    let days = dtFinal.getDate() - dtInicial.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(dtFinal.getFullYear(), dtFinal.getMonth(), 0);
      days += lastMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    return { years, months, days };
  }

  function formataData(data) {
    return new Intl.DateTimeFormat("pt-BR").format(new Date(data));
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      {/* Input inicial para o usuário */}
      {!userConfirmed ? (
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
            Bem-vindo!
          </h1>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Digite seu nome"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />
          <button
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
            onClick={() => setUserConfirmed(true)}
            disabled={!user.trim()}
          >
            Confirmar
          </button>
        </div>
      ) : (
        <div className="w-full max-w-4xl">
          {/* Título com o nome do usuário */}
          <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">
            Olá, {user}!
          </h1>

          {/* Formulário para adicionar entradas */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Adicionar entrada
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Local"
                value={local}
                onChange={(e) => setLocal(e.target.value)}
              />
              <input
                type="date"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <input
                type="date"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <button
              className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
              onClick={handleAddEntry}
            >
              Gravar
            </button>
          </div>

          {/* Lista de entradas */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center justify-between">
              <span>Entradas</span>
              <button
                className="bg-blue-500 text-sm text-white py-1 px-2 rounded hover:bg-blue-600 h-8"
                onClick={() => window.print()}
              >
                Imprimir
              </button>
            </h2>
            {entries.length === 0 ? (
              <p className="text-gray-600">Nenhuma entrada adicionada ainda.</p>
            ) : (
              <ul className="space-y-4">
                {entries.map((entry, index) => (
                  <li
                    key={index}
                    className="border border-gray-300 p-4 rounded-lg flex flex-col md:flex-row justify-between items-center"
                  >
                    <span className="font-semibold">{entry.local}</span>
                    <span>
                      {formataData(entry.startDate)} -{" "}
                      {formataData(entry.endDate)}
                    </span>
                    <span className="text-gray-600">
                      {entry.years} anos, {entry.months} meses, {entry.days}{" "}
                      dias
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
