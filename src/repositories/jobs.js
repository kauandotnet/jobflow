const { Op } = require('sequelize')
const { Job, Contract } = require('../model')

const getTotalJobsToPay = (ClientId) => Job.sum('price', {where: {paid: {[Op.not]: true}}, include: {
	model: Contract,
	required: true,
	where: {ClientId, status: {[Op.ne]: 'terminated'}}
}})

module.exports = {getTotalJobsToPay}