const fs = require('fs')
const lineByLine = require('n-readlines')

var input = 'input.csv'
var output = 'output.txt'
var procTime = 'Time taken'

const processarLinha = (linha, callback) => {
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

fs.rmSync(output)
console.time(procTime)
const ws = fs.createWriteStream(output, { flags: 'a' })
const liner = new lineByLine(input)
let line = ''
while (line = liner.next()) {
    line = `${processarLinha(line.toString('utf8'))}\n`
    ws.write(line)
}
ws.end(() => logStats())
