const { Op } = require('sequelize')
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
}
)

const setJobToPaid = (id) => Job.update({ paid: true, paymentDate: new Date() }, { where: { id } })

module.exports = { getTotalJobsToPay, getUnpaidJobs, getJob, setJobToPaid }