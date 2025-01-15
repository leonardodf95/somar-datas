import { useEffect, useState } from "react";
import "./App.css";
import PrintableList from "./entradas.jsx";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.addVirtualFileSystem(pdfFonts);

function App() {
  const [user, setUser] = useState("");
  const [userConfirmed, setUserConfirmed] = useState(false);
  const [local, setLocal] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [entries, setEntries] = useState([]);
  const [tempoTotal, setTempoTotal] = useState({
    years: 0,
    months: 0,
    days: 0,
  });

  const generatePDF = () => {
    const content = [
      { text: "Relatório de Entradas", style: "header" },
      { text: " " }, // Espaço vazio
      //USUÁRIO
      { text: `Usuário: ${user}`, style: "total" },
      { text: " " }, // Espaço vazio
      {
        table: {
          headerRows: 1,
          widths: ["*", "auto", "auto", "auto"],
          body: [
            [
              { text: "Local", style: "tableHeader" },
              { text: "Data Inicial", style: "tableHeader" },
              { text: "Data Final", style: "tableHeader" },
              { text: "Período", style: "tableHeader" },
            ],
            ...entries.map((entry) => [
              entry.local,
              formataData(entry.startDate),
              formataData(entry.endDate),
              `${entry.years} anos, ${entry.months} meses, ${entry.days} dias`,
            ]),
          ],
        },
        layout: "lightHorizontalLines",
      },
      { text: " " }, // Espaço vazio
      {
        text: `Tempo Total: ${tempoTotal.years} ano(s), ${tempoTotal.months} mês(es), ${tempoTotal.days} dia(s)`,
        style: "total",
      },
    ];

    const docDefinition = {
      content: content,
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          alignment: "center",
          margin: [0, 0, 0, 10],
        },
        tableHeader: {
          bold: true,
          fontSize: 12,
          color: "black",
        },
        total: {
          bold: true,
          fontSize: 14,
          margin: [0, 10, 0, 0],
        },
      },
    };

    pdfMake.createPdf(docDefinition).open(); // Abre o PDF em uma nova aba
  };

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
    return new Intl.DateTimeFormat("pt-BR").format(
      new Date(`${data}T12:00:00`)
    );
  }

  function somarTempoTotal() {
    let total = { years: 0, months: 0, days: 0 };
    entries.forEach((entry) => {
      total.years += entry.years;
      total.months += entry.months;
      total.days += entry.days;
    });
    if (total.days >= 30) {
      total.months += Math.floor(total.days / 30);
      total.days = total.days % 30;
    }
    if (total.months >= 12) {
      total.years += Math.floor(total.months / 12);
      total.months = total.months % 12;
    }
    setTempoTotal(total);
  }

  useEffect(() => {
    somarTempoTotal();
  }, [entries]);

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
                onClick={generatePDF}
              >
                Imprimir
              </button>
            </h2>
            <PrintableList
              entries={entries}
              tempoTotal={tempoTotal}
              formataData={formataData}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
