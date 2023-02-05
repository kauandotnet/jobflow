const { getBestProfession, getBestClients } = require('../repositories/jobs')

const findBestProfession = async (req, res, next) => {
	try {
		const { start, end } = req.query

		const bestProfession = await getBestProfession(start, end)

		console.log('entrei', bestProfession)
  
		res.json(bestProfession)
	} catch (error) {
		next(error)
	}
}

const listBestClients = async (req, res, next) => {
	try {
		const { start, end, limit } = req.query
  
		const parseLimit = Number.isInteger(limit) ? limit : 1
  
		const bestClients = await getBestClients(start, end, parseLimit)
  
		res.json(bestClients)
	} catch (error) {
		next(error)
	}
}

module.exports = { findBestProfession, listBestClients }