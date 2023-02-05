class BaseErrorException extends Error {
	constructor(message, cause) {
		super(message)

		this.message = message
		this.cause = cause
	}
}

class InternalServerErrorException extends BaseErrorException {
	constructor(message, cause) {
		super(message, cause)

		this.statusCode = 500
	}
}

class BadRequestException extends BaseErrorException {
	constructor(message, cause) {
		super(message, cause)

		this.statusCode = 400
	}
}

class NotFoundException extends BaseErrorException {
	constructor(message, cause) {
		super(message, cause)

		this.statusCode = 404
	}
}

module.exports = {
	InternalServerErrorException,
	BadRequestException,
	NotFoundException,
}
