const { Profile } = require('../model')

const BALANCE_OPERATION = Object.freeze({
	C: 'CREDIT',
	D: 'DEBIT'
})

const allowedBalanceOperations = Object.values(BALANCE_OPERATION)

const findProfile = (id, transaction = null) => {
	const objCondition = { where: { id } }
	
	if(transaction) Object.assign(objCondition, {transaction, lock: transaction.LOCK.UPDATE})
	
	return Profile.findOne(objCondition) 
}

const updateProfileBalance = (id, {value, operation}, transaction) => {
	if(!allowedBalanceOperations.includes(operation)) throw new Error('Operation not allowed.')

	const balance = operation === BALANCE_OPERATION.C ? Number(value) : - Number(value)

	return Profile.increment({ balance }, { where: { id }, transaction })
}

module.exports = { findProfile, BALANCE_OPERATION, updateProfileBalance }