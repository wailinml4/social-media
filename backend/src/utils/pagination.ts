const normalizePagination = (page: string | number = 1, limit: string | number = 10) => {
  const normalizedPage = Math.max(1, parseInt(String(page), 10) || 1)
  const normalizedLimit = Math.max(1, parseInt(String(limit), 10) || 10)
  return {
    page: normalizedPage,
    limit: normalizedLimit,
    skip: (normalizedPage - 1) * normalizedLimit,
  }
}

export default normalizePagination
