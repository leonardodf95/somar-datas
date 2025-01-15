import PropTypes from "prop-types";

const PrintableList = ({ entries, tempoTotal, formataData }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-xl font-semibold text-gray-800 mb-4">Relatório</h2>
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
              {formataData(entry.startDate)} - {formataData(entry.endDate)}
            </span>
            <span className="text-gray-600">
              {entry.years} anos, {entry.months} meses, {entry.days} dias
            </span>
          </li>
        ))}
      </ul>
    )}
    <div className="mt-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Tempo total</h3>
      <p className="text-gray-600">
        {tempoTotal.years} ano(s), {tempoTotal.months} mes(es),{" "}
        {tempoTotal.days} dia(s)
      </p>
    </div>
  </div>
);
PrintableList.propTypes = {
  entries: PropTypes.arrayOf(
    PropTypes.shape({
      local: PropTypes.string.isRequired,
      startDate: PropTypes.string.isRequired,
      endDate: PropTypes.string.isRequired,
      years: PropTypes.number.isRequired,
      months: PropTypes.number.isRequired,
      days: PropTypes.number.isRequired,
    })
  ).isRequired,
  tempoTotal: PropTypes.shape({
    years: PropTypes.number.isRequired,
    months: PropTypes.number.isRequired,
    days: PropTypes.number.isRequired,
  }).isRequired,
  formataData: PropTypes.func.isRequired,
};

export default PrintableList;
