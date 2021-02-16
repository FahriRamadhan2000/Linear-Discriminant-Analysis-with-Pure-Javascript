// 1D yourArray => this function is to average a 1D array 
const average = (yourArray) => yourArray.reduce((total, num) => total + num) / (yourArray.length)

// value, 1D, 2D, ... D params => this function is to round any (value, array) decimal 
const round = (params, fixedPoint) => {
    const recursive = (parent) => parent.map((child, index) => (Array.isArray(child)) ? recursive(child) : parseFloat((child).toFixed(fixedPoint)))
    if (Array.isArray(params)) { return recursive(params) }
    else { return parseFloat((params).toFixed(fixedPoint)) }
}

let data = {
    total: {
        x: [[2.95, 2.53, 3.57, 3.16, 2.58, 2.16, 3.27], [6.63, 7.79, 5.65, 5.47, 4.46, 6.22, 3.52],],
        y: [1, 1, 1, 1, 2, 2, 2, 2]
    },
}

// 2D yourArray, 1D arrayComparator, value params => this function is to classificate 2D array by 1D array comparator
const classification = (yourArray, arrayComparator, params) => yourArray.map((parent, index) => parent.filter((child, index) => arrayComparator[index] === params))

data = { ...data, alpha: classification(data.total.x, data.total.y, 1), beta: classification(data.total.x, data.total.y, 2), }
console.log('data', data)

// 2D yourArray =>  this function is to build 2D array become covariance matrix (1D array)
const covarianceMatrix = (yourArray) => {
    const matrix = yourArray.map((parent, index) => parent.map((child) => child - average(data.total.x[index])));
    const index0 = [], index1 = [], index2 = [], index3 = []
    for (let i = 0; i < matrix[0].length; i++) {
        index0.push(matrix[0][i] * matrix[0][i])
        index1.push(matrix[0][i] * matrix[1][i])
        index2.push(matrix[1][i] * matrix[0][i])
        index3.push(matrix[1][i] * matrix[1][i])
    }
    return [average(index0), average(index1), average(index2), average(index3),]
}

const c1 = round(covarianceMatrix(data.alpha), 3)
console.log('c1', c1)

const c2 = round(covarianceMatrix(data.beta), 3)
console.log('c2', c2)

// 1D c1 & c2  => this function is to merge between two matrix (1D array)
const mergeMatrix = (c1, c2) => {
    const merge = (index) => ((data.alpha[0].length / data.total.x[0].length) * c1[index]) + ((data.beta[0].length / data.total.x[0].length) * c2[index])
    return [merge(0), merge(1), merge(2), merge(3),]
}

const c = round(mergeMatrix(c1, c2), 3)
console.log('c', c)

// 1D matrix => this function is to build 2x2 inverse matrix from 1D matrix
const inverseMatrix2x2 = (matrix) => {
    const [a, b, c, d] = matrix
    const det = (a * d) - (b * c)
    return [[d * (1 / det), -1 * b * (1 / det)], [-1 * c * (1 / det), a * (1 / det),]]
}

const inverseC = round(inverseMatrix2x2(c), 3)
console.log('inverse c', inverseC)

// a, b 2D matrix => this function is to multiply between two 2D matrix
const multiplyMatrix = (a, b) => {
    const aNumRows = a.length, aNumCols = a[0].length, bNumRows = b.length, bNumCols = b[0].length,
        matrix = new Array(aNumRows);  // initialize array of rows
    for (let r = 0; r < aNumRows; ++r) {
        matrix[r] = new Array(bNumCols); // initialize the current row
        for (let c = 0; c < bNumCols; ++c) {
            matrix[r][c] = 0;              // initialize the current cell
            for (let i = 0; i < aNumCols; ++i) { matrix[r][c] += a[r][i] * b[i][c] }
        }
    }
    return matrix;
}

// 2D matrix => this function is to transpose a 2D matrix
const matrixTranspose = (matrix) => matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));

// value, 1D, 2D, ... D params => this function is to round any (value, array) decimal 
const valueXmatrix = (params, value) => {
    const recursive = (parent) => parent.map((child, index) => (Array.isArray(child)) ? recursive(child) : child * value)
    if (Array.isArray(params)) { return recursive(params) }
    else { return child * value }
}

// this function is to build function discriminant value (f1, f2)
const functionDiscriminant = () => {
    const matrix = []
    for (let i = 0; i < data.total.x.length; i++) {
        matrix[i] = []
        for (let j = 0; j < data.total.x[0].length; j++) {
            const avgDataGroup = i === 0 ? [[average(data.alpha[0]), average(data.alpha[1])]] : [[average(data.beta[0]), average(data.beta[1])]]
            const currentData = [[data.total.x[0][j], data.total.x[1][j]]]
            console.log()
            matrix[i].push(
                eval(
                    (multiplyMatrix(multiplyMatrix(avgDataGroup, inverseC), matrixTranspose(currentData))) +
                    (multiplyMatrix(multiplyMatrix(valueXmatrix(avgDataGroup, ((-1) / 2)), inverseC), matrixTranspose(avgDataGroup))) +
                    (Math.log(i === 0 ? data.alpha[0].length : data.beta[0].length) - Math.log(7))
                )
            )
        }
    }
    return round(matrix, 3)
}

// 2D matrix from function discriminant => this function is to compare two index matrix and create a new group index matrix
const groupRule = (matrix) => {
    const group = [], [f1, f2] = matrix
    for (let i = 0; i < f1.length; i++) { (f1[i] > f2[i]) ? group.push(1) : group.push(2) }
    return [...matrix, group]
}

const result = groupRule(functionDiscriminant())
// index: 0 => f1, 1 => f2, 2 => group
console.log('hasil', result)

// 2D matrix => this function is to create table in HTML
const createTableElement = (matrix) => {
    let row = ''
    matrix.map((parent) => {
        row += `<tr>`
        parent.map((child) => row += `<td>${child}</td>`)
        row += `</tr>`
    })
    return `<table>${row}</table>`
}

const soal = [[...data.total.x[0]], [...data.total.x[1]], [...data.total.y]]
document.querySelector('#data').innerHTML = createTableElement(matrixTranspose(soal))
document.querySelector('#result').innerHTML = createTableElement(matrixTranspose(result))
