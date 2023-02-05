const app = require('./app')
const cluster = require('cluster')
const numCPUs = require('os').cpus().length

const onWorkerError = (code, signal) => console.error(code, signal)
if (cluster.isMaster && numCPUs > 1) {
	for (let i = 0; i < numCPUs; i++) {
		const worker = cluster.fork()
		worker.on('error', onWorkerError)
	}

	cluster.on('exit', () => {
		const newWorker = cluster.fork()
		newWorker.on('error', onWorkerError)
		console.error('new worker: ', newWorker.process.pid)
	})
	cluster.on('exit', console.error)
} else {
	init()
}

async function init() {
	try {
		app.listen(3001, () => {
			console.log('Express App Listening on Port 3001')
		})
	} catch (error) {
		console.error(`An error occurred: ${JSON.stringify(error)}`)
		process.exit(1)
	}
}

