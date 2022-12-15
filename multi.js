const cluster = require('cluster')
const os = require('os')
const process = require('process')
const numCPUs = os.cpus().length
const fs = require('fs')
const lineByLine = require('n-readlines')

var input = 'input.csv'
var output = 'output.txt'
var procTime = 'Time taken'
var total = numCPUs

const finalizarWorker = () => {
    total--
    if(total == 0) {
        logStats()
        process.exit(0)
    }
}

const startReader = (index) => {
    console.time(procTime+index)
    const ws = fs.createWriteStream(output, { flags: 'a' })
    const liner = new lineByLine(input)
    let line = ''
    skip(liner, index)
    while (line = liner.next()) {
        line = `${index} - ${processarLinha(line.toString('utf8'))}\n`
        ws.write(line)
        skip(liner, numCPUs-1)
    }
    ws.end(() => {
        console.timeEnd(procTime+index)
        process.exit(0)
    })
}

const skip = (liner, qtd) => {
    for(let i=0; i<qtd; i++) {
        liner.next()
    }
}

const processarLinha = (linha) => {
    let len = linha.length
    let val = linha.startsWith('cdi') ? parseFloat(linha.split(';')[3]) * -100 : 0
    let res = `(${len},${val}) => ${linha}`
    return res
}

const logStats = () => {
    const used = process.memoryUsage().heapUsed / 1024 / 1024
    console.log(`Memory consumed: ${Math.round(used * 100) / 100} MB`)
    console.timeEnd(procTime)
}

if (cluster.isMaster) {
    fs.rmSync(output)
    console.time(procTime)
    for (let i = 0; i < numCPUs; i++) {
        let w = cluster.fork({index: i})
        w.on('exit', () => finalizarWorker())
    }
} else {
    startReader(process.env.index)
}