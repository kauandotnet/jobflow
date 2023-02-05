const express = require('express')
const bodyParser = require('body-parser')
const { sequelize } = require('./model')
const { getProfile } = require('./middleware/getProfile')
const { errorHandler } = require('./middleware/errorHandler')
const { NotFoundException, BadRequestException } = require('./utils/errors')
const { getAllNonTerminatedContracts, getContractById } = require('./repositories/contracts')
const { findProfile, updateProfileBalance, BALANCE_OPERATION } = require('./repositories/profile')
const { getTotalJobsToPay } = require('./repositories/jobs')


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
