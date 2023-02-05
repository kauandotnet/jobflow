const { BadRequestException } = require('../utils/errors')

const dateValidator = async (req, _res, next) => {
	try {
		const { start, end } = req.query
		if(!start || !end) throw new BadRequestException('Date is missing.')
		const dateCondition = /^\d{4}-\d{2}-\d{2}$/
		if(!dateCondition.test(start) || !dateCondition.test(end)) throw new BadRequestException('Invalid Date format.')

		next()
	} catch (error) {
		next(error)
	}
}

module.exports = { dateValidator }