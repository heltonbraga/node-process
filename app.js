const cluster = require('cluster')
const os = require('os')
const process = require('process')

const numCPUs = os.cpus().length

if (cluster.isMaster) {
    console.log(`Primary ${process.pid} is running`)
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork()
    }
    cluster.on('exit', (worker, code, signal) => console.log(`worker ${worker.process.pid} died`));
} else {
    console.log(`Worker ${process.pid} started`)
}

