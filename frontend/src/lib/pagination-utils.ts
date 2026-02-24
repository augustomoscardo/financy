import type { PaginationInfo } from "@/types";

export function getPageNumbers(
  pagination: PaginationInfo,
): Array<number | "..."> {
  const { currentPage, totalPages } = pagination;
  const pages: Array<number | "..."> = [];
  const maxPagesToShow = 5;

  if (totalPages <= maxPagesToShow) {
    for (let page = 1; page <= totalPages; page += 1) {
      pages.push(page);
    }
    return pages;
  }

  if (currentPage <= 3) {
    pages.push(1, 2, 3, 4, "...", totalPages);
    return pages;
  }

  if (currentPage >= totalPages - 2) {
    pages.push(1, "...");
    for (let page = totalPages - 3; page <= totalPages; page += 1) {
      pages.push(page);
    }
    return pages;
  }

  pages.push(
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  );

  return pages;
}

export function getPaginationRange(pagination: PaginationInfo): string {
  const { currentPage, itemsPerPage, totalItems } = pagination;

  if (totalItems === 0) {
    return "0";
  }

  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, totalItems);

  return `${start} a ${end}`;
}
