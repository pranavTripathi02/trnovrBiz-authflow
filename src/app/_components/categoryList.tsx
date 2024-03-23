"use client";

import { api } from "@/trpc/react";
import { useState } from "react";
import Pagination from "./pagination";
import { LoaderCircleIcon } from "lucide-react";

function CategoryList() {
  const [page, setPage] = useState(0);
  const query = api.category.get.useQuery({
    offset: page * 6,
  });
  const { isPending, isError, data, error } = query;
  if (isPending) {
    return (
      <div className="animate-spin">
        <LoaderCircleIcon width={48} height={48} className="mx-auto my-8" />
      </div>
    );
  }
  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  const mutation = api.category.userCategoryToggle.useMutation();
  const handleCategorySelect = async (categoryId: number) => {
    await mutation.mutateAsync({
      categoryId,
    });
  };

  const { categories, count } = data;
  const lastPage = Math.floor(count / 6);
  return (
    <div className="mt-4">
      {categories.map((category) => {
        console.log(category);
        return (
          <div key={category.id} className="my-2">
            <div role="button">
              <label
                htmlFor={category.name}
                className="flex w-full cursor-pointer items-center"
              >
                <div className="mr-3 grid place-items-center">
                  <div className="inline-flex items-center">
                    <label
                      className="relative flex cursor-pointer items-center rounded-full p-0"
                      htmlFor={category.name}
                    >
                      <input
                        id={category.name}
                        type="checkbox"
                        className="before:content[''] border-blue-gray-200 before:bg-blue-gray-500 peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border bg-neutral-300 transition-all before:absolute before:left-2/4 before:top-2/4 before:block before:h-12 before:w-12 before:-translate-x-2/4 before:-translate-y-2/4 before:rounded-full before:opacity-0 before:transition-opacity checked:border-gray-900 checked:bg-gray-900 checked:before:bg-gray-900 hover:before:opacity-0"
                        onChange={() => handleCategorySelect(category.id)}
                      />
                      <span className="pointer-events-none absolute left-2/4 top-2/4 -translate-x-2/4 -translate-y-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3.5 w-3.5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          stroke="currentColor"
                          strokeWidth="1"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clip-rule="evenodd"
                          ></path>
                        </svg>
                      </span>
                    </label>
                  </div>
                </div>
                <p className="">{category.name}</p>
              </label>
            </div>
          </div>
        );
      })}
      <Pagination page={page} lastPage={lastPage} setPage={setPage} />
    </div>
  );
}

export default CategoryList;
