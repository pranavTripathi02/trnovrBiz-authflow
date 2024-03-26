"use client";

import { api } from "@/trpc/react";
import { useState } from "react";
import Pagination from "./pagination";
import { LoaderCircleIcon } from "lucide-react";

function CategoryList() {
  const mutationUserToCategories =
    api.category.userCategoryToggle.useMutation();
  const userCategories = api.user.getUserCategories.useQuery();
  const {
    data: userCategoriesData,
    isError: userCategoriesError,
    isPending: userCategoriesPending,
  } = userCategories;
  const [page, setPage] = useState(0);
  const query = api.category.get.useQuery({
    offset: page * 6,
  });
  const { isPending, isError, data, error } = query;
  if (isPending || userCategoriesPending) {
    return (
      <div className="my-8">
        <span>Loading...</span>
        <LoaderCircleIcon
          width={48}
          height={48}
          className="mx-auto my-4 animate-spin"
        />
      </div>
    );
  }
  if (isError || userCategoriesError) {
    return <span>Error: {error?.message}</span>;
  }

  const handleCategorySelect = async (categoryId: number) => {
    await mutationUserToCategories.mutateAsync({
      categoryId,
    });
    await userCategories.refetch();
  };

  const { categories, count } = data;
  const lastPage = Math.floor(count / 6);
  return (
    <div className="mt-4">
      {categories.map((category) => {
        const isChecked = userCategoriesData.find(
          (i) => i.categoryId == category.id,
        )
          ? true
          : false;
        return (
          <div key={category.id} className="my-2">
            <label htmlFor={category.name} className="flex w-fit items-center">
              <div>
                <input
                  id={category.name}
                  type="checkbox"
                  className="me-4 size-5 rounded-full accent-neutral-800 backdrop-saturate-50"
                  defaultChecked={isChecked}
                  onChange={(e) => {
                    e.target.checked = !isChecked;
                    void handleCategorySelect(category.id);
                  }}
                />
              </div>
              <p>{category.name}</p>
            </label>
          </div>
        );
      })}
      <Pagination page={page} lastPage={lastPage} setPage={setPage} />
    </div>
  );
}

export default CategoryList;
