const { sequelize } = require('../model')
const { getTotalJobsToPay } = require('../repositories/jobs')
const { findProfile, updateProfileBalance, BALANCE_OPERATION } = require('../repositories/profile')
const { BadRequestException, NotFoundException } = require('../utils/errors')

const userDeposit = async (req,res, next) => {
	const dbTransaction = await sequelize.transaction()
	try {
		const { userId } = req.params
		const { amount } = req.body

		if(!userId) throw new BadRequestException('User id is missing.')
	
		const getClient = await findProfile(userId, dbTransaction)
	
		if(!getClient) throw new NotFoundException('Client not found.')
	
		const totalJobsToPay = await getTotalJobsToPay(userId)

		if(!totalJobsToPay) throw new BadRequestException()
	
		const maxDeposit = totalJobsToPay ?? 0 * 0.25

		if(amount > maxDeposit) throw new BadRequestException('The maximum deposit limit has been attained.')
	
		await updateProfileBalance(userId, { value: amount, operation: BALANCE_OPERATION.C }, dbTransaction)
		
		await dbTransaction.commit()
	
		res.json(totalJobsToPay)
	} catch (error) {
		await dbTransaction.rollback()
		next(error)
	}
}

module.exports = { userDeposit }