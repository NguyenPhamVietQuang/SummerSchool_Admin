export const sendResponseDetail = (attributes: any) => {
  return {
    data: {
      id: attributes?.id,
      attributes,
    },
    meta: {}
  }
}

export const sendResponsePagination = (data, page: number, pageSize: number, total: number) => {
  const pageCount = Math.ceil(total / pageSize)
  return {
    data,
    meta: {
      pagination: {
        page,
        pageSize,
        pageCount,
        total
      }
    }
  }
}