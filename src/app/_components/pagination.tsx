import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { type SetStateAction } from "react";

function Pagination({
  page,
  lastPage,
  setPage,
}: {
  page: number;
  lastPage: number;
  setPage: React.Dispatch<SetStateAction<number>>;
}) {
  return (
    <div className="mt-8 flex justify-between space-x-2 text-neutral-500 lg:px-12">
      <button
        disabled={page == 0}
        onClick={() => setPage(0)}
        title="First page"
      >
        <ChevronsLeft height={18} width={18} aria-label="first-page" />
      </button>
      <button
        disabled={page == 0}
        onClick={() => page > 0 && setPage((prev) => prev - 1)}
        title="Previous"
      >
        <ChevronLeft height={18} width={18} aria-label="previous-page" />
      </button>
      {page > 3 && <span>...</span>}
      {page > 2 && (
        <button onClick={() => page > 2 && setPage(page - 3)}>
          {page - 2}
        </button>
      )}
      {page > 1 && (
        <button onClick={() => page > 1 && setPage(page - 2)}>
          {page - 1}
        </button>
      )}
      {page > 0 && (
        <button onClick={() => page > 0 && setPage(page - 1)}>{page}</button>
      )}
      {/* 3 behind */}
      <span className="text-black">{page + 1}</span>
      {/* 3 ahead */}
      {page < lastPage && (
        <button onClick={() => page < lastPage && setPage(page + 1)}>
          {page + 2}
        </button>
      )}
      {page < lastPage - 1 && (
        <button onClick={() => page < lastPage - 1 && setPage(page + 2)}>
          {page + 3}
        </button>
      )}
      {page < lastPage - 2 && (
        <button onClick={() => page < lastPage - 2 && setPage(page + 3)}>
          {page + 4}
        </button>
      )}
      {page < lastPage - 3 && <span>...</span>}
      <button
        disabled={page == lastPage}
        onClick={() => page < lastPage && setPage((prev) => prev + 1)}
        title="Next"
      >
        <ChevronRight height={18} width={18} aria-label="next-page" />
      </button>
      <button
        disabled={page == lastPage}
        onClick={() => setPage(lastPage)}
        title="Last page"
      >
        <ChevronsRight height={18} width={18} aria-label="last-page" />
      </button>
    </div>
  );
}

export default Pagination;
