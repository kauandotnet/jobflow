const { Op } = require('sequelize')
const { Contract } = require('../model')

const getContractById = (id, profileId) => 
	Contract.findOne({ where: { id, [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }] } })

const getAllNonTerminatedContracts = (profileId) => Contract.findAll({
	where: {
		status: { [Op.ne]: 'terminated' },
		[Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }],
	},
})

module.exports = { getContractById, getAllNonTerminatedContracts }
