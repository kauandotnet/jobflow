const errorHandler = (error, _req, res, _next) => {
  const isError = error instanceof Error
  const errorStatus = error.statusCode ?? 500
  const errorMessage = errorStatus < 500 ? (isError ? error.message : error) : 'Internal Server Error'

  console.error(error)

  res.status(errorStatus).json({ error: true, message: errorMessage, status: errorStatus })
}

module.exports = { errorHandler }