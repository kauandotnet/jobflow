const express = require('express')
const adminRoutes = require('./admin')
const balanceRoutes = require('./balances')
const contractRoutes = require('./contracts')
const jobRoutes = require('./jobs')
const routes = express.Router()

routes.use('/admin', adminRoutes)
routes.use('/contracts', contractRoutes)
routes.use('/jobs', jobRoutes)
routes.use('/balances', balanceRoutes)

module.exports = routes