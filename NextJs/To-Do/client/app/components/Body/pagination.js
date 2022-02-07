import Left from "../../public/left.svg";
import Right from "../../public/right.svg";

const Pagination = ({ currentPage, total, rowsPerPage, changePage }) => {
  const totalPages = Math.ceil(total / rowsPerPage);
  const start = total ? currentPage * rowsPerPage + 1 : 0;
  const end = total
    ? start + rowsPerPage - 1 < total
      ? start + rowsPerPage - 1
      : total
    : 0;

  const hasNext = currentPage < totalPages - 1;
  const hasPrevious = currentPage - 1 >= 0;

  return (
    <div className="flex items-center space-x-2 text-xs">
      <button
        className="p-1 text-gray-50 rounded-full bg-indigo-600 disabled:bg-opacity-70 disabled:cursor-not-allowed"
        disabled={!total || !hasPrevious}
        onClick={() => changePage(currentPage - 1)}
      >
        <Left className="h-4 w-4" />
      </button>
      <p className="font-bold">
        {start} - {end} of {total}
      </p>
      <button
        className="p-1 text-gray-50 rounded-full bg-indigo-600 disabled:bg-opacity-70 disabled:cursor-not-allowed"
        disabled={!total || !hasNext}
        onClick={() => changePage(currentPage + 1)}
      >
        <Right className="h-4 w-4" />
      </button>
    </div>
  );
};

export default Pagination;
