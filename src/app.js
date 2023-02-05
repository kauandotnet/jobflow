const express = require('express')
const bodyParser = require('body-parser')
const { sequelize } = require('./model')
const { errorHandler } = require('./middleware/errorHandler')
const { NotFoundException } = require('./utils/errors')
const routes = require('./routes')

const app = express()
app.use(bodyParser.json())
app.set('sequelize', sequelize)
app.set('models', sequelize.models)

app.use(routes)

app.use(() => {
	throw new NotFoundException()
})

app.use(errorHandler)

module.exports = app
