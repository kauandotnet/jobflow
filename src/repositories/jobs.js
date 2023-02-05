const { Op, fn, col, literal } = require('sequelize')
const { Job, Contract, Profile } = require('../model')

const getTotalJobsToPay = (ClientId) => Job.sum('price', {
	where: {paid: {[Op.not]: true}}, include: {
		model: Contract,
		required: true,
		where: {ClientId, status: {[Op.ne]: 'terminated'}}
	}})

const getUnpaidJobs = (profileId) => Job.findAll({
	where: {
		paid: {
			[Op.is]: null}, paymentDate: {[Op.is]: null}  
	},
	include: {
		model: Contract,
		as: 'Contract',
		where: {
			status: {
				[Op.eq]: 'in_progress',
			},
			[Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }],
		},
	},
})

const getJob = (id, profileId) => Job.findOne({ 
	where: { id, paid: {
		[Op.is]: null}, paymentDate: {[Op.is]: null}  }, include: {
		model: Contract,
		required: true,
		where: {
			[Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }]
		},
		include: [{
			model: Profile,
			as: 'Client',
			required: true,
		},
		{
			model: Profile,
			as: 'Contractor',
			required: true,
		},
		]
	}
})

const setJobToPaid = (id, transaction) => Job.update({ paid: true, paymentDate: new Date() },  {  where: { id }, transaction })

const getBestProfession = (start, end) => Job.findOne({
	subQuery: false,
	attributes: [
		'Contract->Contractor.profession',
		[fn('MAX', col('price')), 'total']
	],
	include: [{
		model: Contract,
		required: true,
		attributes: [],
		include: [{
			model: Profile,
			required: true,
			as: 'Contractor',
			attributes: []
		}]
	}],
	where: {
		paid: true,
		paymentDate: {
			[Op.between]: [start, end]
		}
	},
	group: 'profession',
	raw: true,
	order: [[fn('MAX', col('price')), 'DESC']]
})

const getBestClients = (start, end, limit = 1) => Job.findAll({
	subQuery: false,
	attributes: [
		'Contract.Client.id',
		[literal('firstName || \' \' || lastName'), 'fullName'],
		[fn('SUM', col('price')), 'paid']
	],
	include: [{
		model: Contract,
		required: true,
		attributes: [],
		include: [{
			model: Profile,
			required: true,
			as: 'Client',
			attributes: []
		}]
	}],
	where: {
		paid: true,
		paymentDate: {
			[Op.between]: [start, end]
		}
	},
	group: 'Contract.Client.id',
	raw: true,
	order: [[fn('SUM', col('price')), 'DESC']],
	limit
})

module.exports = { getTotalJobsToPay, getUnpaidJobs, getJob, setJobToPaid, getBestProfession, getBestClients }