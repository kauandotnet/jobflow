const { getContractById, getAllNonTerminatedContracts } = require('../repositories/contracts')
const { NotFoundException } = require('../utils/errors')

const getContract = async (req, res, next) => {
	try {
		const { id } = req.params
		const { id: profileId } = req.profile

		const contract = await getContractById(id, profileId)

		if (!contract) throw new NotFoundException('No contract found')

		res.json(contract)
	} catch (error) {
		next(error)
	}
}

const listContracts = async (req, res, next) => {
	try {
		const { id: profileId } = req.profile

		const contracts = await getAllNonTerminatedContracts(profileId)

		if (!contracts) throw new NotFoundException('No contract found')

		res.json(contracts)
	} catch (error) {
		next(error)
	}
}

module.exports = { getContract, listContracts }