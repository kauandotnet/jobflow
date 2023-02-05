const { getUnpaidJobs, getJob, setJobToPaid } = require('../repositories/jobs')
const { NotFoundException, BadRequestException } = require('../utils/errors')
const {  updateProfileBalance, BALANCE_OPERATION, findProfile } = require('../repositories/profile')
const { sequelize } = require('../model')
const { Transaction } = require('sequelize')


const listUnpaidJobs = async (req, res, next) => {
	try {
		const { id: profileId } = req.profile

		const unpaidJobs = await getUnpaidJobs(profileId)

		if(!unpaidJobs) throw new NotFoundException('No unpaid jobs found')

		res.json(unpaidJobs)
	} catch (error) {
		next(error)
	}
}

const payJob = async (req, res, next) => {
	const dbTransaction = await sequelize.transaction({
		isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED
	})

	try {
		const { id: profileId } = req.profile
		const { job_id: jobId } = req.params

		if(!jobId) throw BadRequestException()

		const job = await getJob(jobId, profileId)

		if(!job) throw new NotFoundException('No job available to pay')

		const { price, Contract: { Client, Contractor }} = job

		const [getClient, getContractor] = await Promise.all([ findProfile(Client.id, dbTransaction), findProfile(Contractor.id, dbTransaction) ])

		if(price > Client.balance) throw new BadRequestException('You cant pay for this job')

		await Promise.all([
			updateProfileBalance(getClient.id, { value: price, operation: BALANCE_OPERATION.D }, dbTransaction),
			updateProfileBalance(getContractor.id, { value: price, operation: BALANCE_OPERATION.C }, dbTransaction),
			setJobToPaid(jobId, dbTransaction)
		])

		await dbTransaction.commit()
		
		res.json(job)
	} catch (error) {
		await dbTransaction.rollback()

		next(error)
	}
}

module.exports = { listUnpaidJobs, payJob }