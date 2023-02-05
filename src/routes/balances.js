const express = require('express')
const { userDeposit } = require('../controllers/balances')

const balanceRoutes = express.Router()

balanceRoutes.post('/deposit/:userId', userDeposit)

module.exports = balanceRoutes