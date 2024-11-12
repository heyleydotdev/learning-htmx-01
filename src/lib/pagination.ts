/* eslint-disable @typescript-eslint/no-explicit-any */

export type CreatePaginationArgs = {
  currentPage: number
  totalItems: number
  pageSize: number
  surroundBy: number
}

export type CreatePagination = (args: CreatePaginationArgs) => {
  currentPage: number
  firstPage: number
  lastPage: number
  firstVisiblePage: number
  lastVisiblePage: number
  visiblePages: number[]
  allPages: number[]
  hasPrevious: boolean
  hasNext: boolean
  hasLess: boolean
  hasMore: boolean
  itemsOffset: number
  pageSize: number
  isFirstPage: boolean
  isLastPage: boolean
}

export const createPagination: CreatePagination = ({ currentPage, totalItems, pageSize, surroundBy }) => {
  const totalPages = Math.ceil(totalItems / pageSize)
  const firstPage = 1
  const lastPage = totalPages
  const allPages = createRange(firstPage, lastPage)

  currentPage = pageExists(currentPage, totalPages) ? currentPage : 1

  const visiblePages = movePages(createRange(currentPage - surroundBy, currentPage + surroundBy), totalPages)
  const firstVisiblePage = firstItem(visiblePages)!
  const lastVisiblePage = lastItem(visiblePages)!

  const hasPrevious = currentPage > firstPage
  const hasNext = currentPage < lastPage

  const hasLess = firstVisiblePage > firstPage
  const hasMore = lastVisiblePage < lastPage

  const itemsOffset = currentPage > 1 ? (currentPage - 1) * pageSize : 0

  const isFirstPage = currentPage === firstPage
  const isLastPage = currentPage === lastPage

  return {
    currentPage,
    firstPage,
    lastPage,
    firstVisiblePage,
    lastVisiblePage,
    visiblePages,
    allPages,
    hasPrevious,
    hasNext,
    hasLess,
    hasMore,
    itemsOffset,
    pageSize,
    isFirstPage,
    isLastPage,
  }
}

const pageExists = (pageNumber: number, totalPages: number): boolean => pageNumber > 0 && pageNumber <= totalPages

const movePageRange = (range: number[], moveBy: number): number[] => range.map((item) => item + moveBy)

const movePagesRight = (pages: number[], totalPages: number): number[] => {
  if (totalPages === 0) {
    return pages
  }

  if (!pageExists(firstItem(pages)!, totalPages)) {
    return movePagesRight(movePageRange(pages, 1), totalPages)
  }

  return pages
}

const movePagesLeft = (pages: number[], totalPages: number): number[] => {
  if (totalPages === 0) {
    return pages
  }

  if (!pageExists(lastItem(pages)!, totalPages)) {
    return movePagesLeft(movePageRange(pages, -1), totalPages)
  }

  return pages
}

const movePages = (pages: number[], totalPages: number): number[] => {
  return movePagesLeft(movePagesRight(pages, totalPages), totalPages).filter((page) => pageExists(page, totalPages))
}

const createRange = (from: number, to: number): number[] => {
  const range: number[] = []

  for (let i = from; i <= to; i++) {
    range.push(i)
  }

  return range
}

const firstItem = <TItem = any>(items: TItem[]): TItem | undefined => items[0]
const lastItem = <TItem = any>(items: TItem[]): TItem | undefined => items[items.length - 1]
