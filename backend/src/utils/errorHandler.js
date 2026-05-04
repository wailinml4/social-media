const errorHandler = (error, req, res, _next) => {
  const statusCode = error.statusCode || 500
  const message = error.message || 'Internal server error'

  console.error(error)
  void _next
  return res.status(statusCode).json({ success: false, message: message })
}

export default errorHandler
