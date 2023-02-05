const express = require('express')
const { findBestProfession, listBestClients} = require('../controllers/admin')
const { dateValidator } = require('../middleware/dateValidator')

const adminRoutes = express.Router()

adminRoutes.get('/best-profession', dateValidator, findBestProfession)
adminRoutes.get('/best-clients', dateValidator, listBestClients)

module.exports = adminRoutes