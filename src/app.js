const express = require('express')
const bodyParser = require('body-parser')
const { sequelize } = require('./model')
const { getProfile } = require('./middleware/getProfile')
const { errorHandler } = require('./middleware/errorHandler')
const { NotFoundException, BadRequestException } = require('./utils/errors')
const { getAllNonTerminatedContracts, getContractById } = require('./repositories/contracts')
const { findProfile, updateProfileBalance, BALANCE_OPERATION } = require('./repositories/profile')
const { getTotalJobsToPay, getUnpaidJobs, setJobToPaid, getJob } = require('./repositories/jobs')

const app = express()
app.use(bodyParser.json())
app.set('sequelize', sequelize)
app.set('models', sequelize.models)

app.get('/contracts/:id', getProfile, async (req, res, next) => {
	try {
		const { id } = req.params
		const { id: profileId } = req.profile

		const contract = await getContractById(id, profileId)

		if (!contract) throw new NotFoundException('No contract found')

		res.json(contract)
	} catch (error) {
		next(error)
	}
})

app.get('/contracts', getProfile, async (req, res, next) => {
	try {
		const { id: profileId } = req.profile

		const contracts = await getAllNonTerminatedContracts(profileId)

		if (!contracts) throw new NotFoundException('No contract found')

		res.json(contracts)
	} catch (error) {
		next(error)
	}
})

app.get('/jobs/unpaid', getProfile, async (req,res, next) => {
	try {
    
		const { id: profileId } = req.profile

		const unpaidJobs = await getUnpaidJobs(profileId)

		if(!unpaidJobs) throw new NotFoundException('No unpaid jobs found')

		res.json(unpaidJobs)
	} catch (error) {
		next(error)
	}
})

app.post('/jobs/:job_id/pay', getProfile, async (req,res, next) => {
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
})

app.post('/balances/deposit/:userId', async (req, res, next) => {
	try {
		const { userId } = req.params
		const { amount } = req.body

		if(!userId) throw new BadRequestException('User id is missing.')
	
		const getClient = await findProfile(userId)
	
		if(!getClient) throw new NotFoundException('Client not found.')
	
		const totalJobsToPay = await getTotalJobsToPay(userId) ?? 0
	
		const maxDeposit = totalJobsToPay * 0.25
	
		if(amount > maxDeposit) throw new BadRequestException('The maximum deposit limit has been attained.')
	
		await updateProfileBalance(userId, { value: amount, operation: BALANCE_OPERATION.C })
	
		res.json(totalJobsToPay)
	} catch (error) {
		next(error)
	}
})

app.use(() => {
	throw new NotFoundException()
})

app.use(errorHandler)

module.exports = app
