const express = require('express')
const { getContract, listContracts } = require('../controllers/contracts')
const { getProfile } = require('../middleware/getProfile')

const contractRoutes = express.Router()

contractRoutes.get('/:id', getProfile, getContract)
contractRoutes.get('/', getProfile, listContracts)

module.exports = contractRoutes