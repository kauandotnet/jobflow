const express = require('express');
const bodyParser = require('body-parser');
const {sequelize} = require('./model')
const {getProfile} = require('./middleware/getProfile');
const { errorHandler } = require('./middleware/errorHandler');
const { NotFoundException } = require('./utils/errors');
const { getAllNonTerminatedContracts, getContractById } = require('./repositories/contracts');

const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize)
app.set('models', sequelize.models)

app.get('/contracts/:id', getProfile , async (req, res, next) =>{
    try {
    const { id } = req.params
    const { id: profileId } = req.profile

    const contract = await getContractById(id, profileId)
   
    if(!contract) throw new NotFoundException('No contract found')
    
    res.json(contract)
    } catch (error) {
        next(error)
    }
})

app.get('/contracts', getProfile , async (req, res, next) =>{
    try {
    const { id: profileId } = req.profile

    const contracts = await getAllNonTerminatedContracts(profileId)
   
    if(!contracts) throw new NotFoundException('No contract found')
    
    res.json(contracts)
  } catch (error) {
        next(error)
    }
})

app.use(() => { 
    throw new NotFoundException()
})

app.use(errorHandler)

module.exports = app;
