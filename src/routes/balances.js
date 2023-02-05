const express = require('express')
const { userDeposit } = require('../controllers/balances')

const balanceRoutes = express.Router()

balanceRoutes.get('/deposit/:userId', userDeposit)

module.exports = balanceRoutes