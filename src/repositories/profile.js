const { Profile } = require('../model')

const BALANCE_OPERATION = Object.freeze({
	C: 'CREDIT',
	D: 'DEBIT'
})

const allowedBalanceOperations = Object.values(BALANCE_OPERATION)

const findProfile = (id) => Profile.findOne({ where: { id } }) 

const updateProfileBalance = (id, {value, operation}) => {
	if(!allowedBalanceOperations.includes(operation)) throw new Error('Operation not allowed.')

	const balance = operation === BALANCE_OPERATION.C ? Number(value) : - Number(value)

	return Profile.increment({ balance }, {where: { id }})
}

module.exports = { findProfile, BALANCE_OPERATION, updateProfileBalance }