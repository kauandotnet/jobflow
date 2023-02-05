const express = require('express')
const { listUnpaidJobs, payJob } = require('../controllers/jobs')
const { getProfile } = require('../middleware/getProfile')

const jobRoutes = express.Router()

jobRoutes.get('/unpaid', getProfile, listUnpaidJobs)
jobRoutes.post('/:job_id/pay', getProfile, payJob)

module.exports = jobRoutes