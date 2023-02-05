const { getUnpaidJobs, getJob, setJobToPaid } = require('../repositories/jobs')
const { NotFoundException, BadRequestException } = require('../utils/errors')
const {  updateProfileBalance, BALANCE_OPERATION } = require('../repositories/profile')


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
	try {
		const { id: profileId } = req.profile
		const { job_id: jobId } = req.params

		if(!jobId) throw BadRequestException()

		const job = await getJob(jobId, profileId)

		if(!job) throw new NotFoundException('No job available to pay')

		const { price, Contract: { Client, Contractor }} = job

		if(price > Client.balance) throw new BadRequestException('You cant pay for this job')

		await Promise.all([
			updateProfileBalance(Client.id, { value: price, operation: BALANCE_OPERATION.D }),
			updateProfileBalance(Contractor.id, { value: price, operation: BALANCE_OPERATION.C }),
			setJobToPaid(jobId)
		])

		res.json(job)
	} catch (error) {
		next(error)
	}
}

module.exports = { listUnpaidJobs, payJob }