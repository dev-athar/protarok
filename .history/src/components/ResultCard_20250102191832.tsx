interface Result {
  id: number;
  scamProfileName: string;
  platform: string;
  bankDetails: string;
  paymentPlatform: string;
  scamAmount: number;
  dateOfScam: string;
  scamProfileUrl: string;
}

interface ResultCardProps {
  result: Result;
  onResultClick: (id: number) => void;
}

const ResultCard = ({ result, onResultClick }) => {
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div
      className="bg-white shadow-md rounded-lg p-4 cursor-pointer hover:shadow-lg transition flex flex-col justify-between"
      onClick={() => onResultClick(result.id)}
    >
      <h3 className="text-lg font-bold text-gray-800 mb-2">
        {result.scamProfileName}
      </h3>
      <p className="text-sm text-gray-600">{result.platform}</p>
      <p className="text-sm text-red-500 font-bold">Tk {result.scamAmount}</p>
      <p className="text-sm text-gray-600">{formatDate(result.dateOfScam)}</p>
      <p className="text-sm text-gray-600">
        {result.paymentPlatform}: {result.bankDetails}
      </p>
      <a
        href={result.scamProfileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 underline text-sm mt-2 inline-block"
      >
        {result.scamProfileUrl}
      </a>
    </div>
  );
};

export default ResultCard;
