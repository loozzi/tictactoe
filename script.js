// Tictactoe game
/** 1. AI engine
 *    - state representation: array 2d
 *    - checking is end game
 *    - detect winner
 *    - validate move
 *    + detect current player (human or machine)
 *    + calc valid move 
 *    - calc status score
 *    + final state score
 *    + not-final state score
 *    - calc best move for machine
 *    + check all movable state -> get best status
 */

/** 2. User interface
 * - render user interface
 *  + table 3x3
 *  + handle when user click to a box
 *  + get coordinates user click box
 *  + convert number to X or O 
 *  + set X or O to the box (X: green, O: red)
 * - checking game is done => show winner and show button play again
 * - Play again: remove all box in table, hide winner and button play again
 * - save history
 */

let data = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
]
let gameIsDone = false


// function create table 3x3 and show them
function createTable(){
    const app = document.getElementById('app')
    const wrapper = document.createElement('div')
    wrapper.classList.add('wrapper')
    for(let i = 0; i < 3; i++){
        let row = document.createElement('div')
        row.classList.add('row')
        row.classList.add(`row-${i}`)
        for(let j = 0; j < 3; j++){
            let button = document.createElement('button')
            button.classList.add('btn')
            button.classList.add(`row-${i}`)
            button.classList.add(`col-${j}`)
            button.textContent = "."
            button.onclick = handleChecked
            row.appendChild(button)
        }
        wrapper.appendChild(row)
    }
    app.appendChild(wrapper)
}

/** function get coordinates box user click in table
 * @param {Element} e: DOM element button
 * @return [Number, Number]: coordinates [x, y]
 */
function getCoordinates(e){
    const classList = e.target.classList
    let x = parseInt(classList[1][4])
    let y = parseInt(classList[2][4])
    return [x, y]
}

/** function set text to box X or O 
 * @param {Number} x: coordinates X
 * @param {Number} y: coordinates Y
 * @param {Number} turn: 1 or 2: human or machine
 */
function setText(x, y, turn){
    const btn = document.querySelector(`.row-${x}.col-${y}`)
    btn.textContent = getChar(turn)
    btn.classList.add(getChar(turn))
}

/** function handle when user checked to the box
 * @param {Element} e: DOM element button in table
 */
function handleChecked(e){
    if(gameIsDone === false){
        const [x, y] = getCoordinates(e)
        if(data[x][y] === 0){
            let turn = getNextPlayer(data)
            setText(x, y, turn)
            data = play(data, x, y, turn)

            const [cx, cy] = computerTurn(data)
            if(cx !== -2 && cy !== -2){
                turn = getNextPlayer(data)
                data = play(data, cx, cy, turn)
                setText(cx, cy, turn)
            }
        } else {
            alert('Box is checked')
        }
    } else {
        const playAg = confirm("Play againt?")
        if(playAg)
            playAgaint()
    }
}

// ======== Play =========
/** function hanlde play again
 * remove all 2D Array: data in table
 * remove winner
 */
function playAgaint(){
    data = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ]
    gameIsDone = false
    for(let i = 0; i < 3; i++){
        for(let j = 0; j < 3; j++){
            const btn = document.querySelector(`.row-${i}.col-${j}`)
            btn.textContent = '.'
            btn.classList.remove('X')
            btn.classList.remove('O')
        }
    }
    const app = document.getElementById('app')
    const statusWrapper = document.getElementsByClassName('status-wrapper')[0]
    app.removeChild(statusWrapper)
}

/** function show winner or draw
 * @param {Array} data: 2D Array: data in table
 * render interface:
 * - winner
 * - button Play Again
 */
function showWinner(data){
    const score = getScoreFinalState(data)
    const app = document.getElementById('app')
    const status = document.createElement('p')
    const btnPlayAgaint = document.createElement('button')
    const statusWrapper = document.createElement('div')
    statusWrapper.classList.add('status-wrapper')
    btnPlayAgaint.classList.add('btn-again')
    btnPlayAgaint.textContent = 'Play Again?'
    btnPlayAgaint.onclick = playAgaint
    status.classList.add('status')
    if(score == 0){
        status.textContent = "Draw"
        status.classList.add('draw')
    } else if(score == 1){
        status.textContent = "X win"
        status.classList.add('x-win')
    } else {
        status.textContent = "O win"
        status.classList.add('o-win')
    }

    statusWrapper.appendChild(status)
    statusWrapper.appendChild(btnPlayAgaint)
    app.appendChild(statusWrapper)
    gameIsDone = true
}

/** convert number -> char to show interface
 * @param {Number} turn: 1 or 2
 * @returns Char: X or O
 */
function getChar(turn){
    if(turn === 1)
        return 'X'
    else if(turn == 2)
        return 'O'
}

/** Play function
 * @param {Array} data: 2D Array: data in table 
 * @param {Number} x: coordinates X
 * @param {Number} y: coordinates Y
 * @param {Number} turn: 1 or 2 - human or machine
 * @returns Array: table after update
 */
function play(data, x, y, turn){
    let dataInput = []
    data.forEach(item => {
        dataInput = [...dataInput, [...item]]
    })
    dataInput[x][y] = turn

    return dataInput
}

/** function get player turn
 * @param {Array} data: 2D Array: data in table 
 * @returns Number: 1 or 2
 */
function getNextPlayer(data){
    let dataInput = []
    data.forEach(item => {
        dataInput = [...dataInput, [...item]]
    })
    let player1 = 0
    let player2 = 0
    for(let i = 0; i < 3; i++){
        for(let j = 0; j < 3; j++){
            if(dataInput[i][j] === 1)
                player1++
            else if(dataInput[i][j] === 2)
                player2++
        }
    }
    return (player1 === player2)?1:2
}

// ========== AI Engine ============
/** Get winner or draw
 * @param {Array} data: 2D Array: data in table 
 * @returns Number: 1 - X win,  2 - O win, 0: Draw
 */
function getScoreFinalState(data){
    let dataInput = []
    data.forEach(item => {
        dataInput = [...dataInput, [...item]]
    })
    // check rows
    for(let i = 0; i < 3; i++)
        if(dataInput[i][0] === dataInput[i][1] 
            && dataInput[i][0] === dataInput[i][2] 
            && dataInput[i][0] != 0
        ) return dataInput[i][0]

    // check cols
    for(let i = 0; i < 3; i++)
        if(dataInput[0][i] === dataInput[1][i] 
            && dataInput[0][i] === dataInput[2][i] 
            && dataInput[0][i] != 0
        ) return dataInput[0][i]

    if(dataInput[0][0] === dataInput[1][1] 
        && dataInput[1][1] == dataInput[2][2]
        && dataInput[0][0] != 0
    ) return dataInput[0][0]

    if(dataInput[0][2] === dataInput[1][1] 
        && dataInput[1][1] == dataInput[2][0]
        && dataInput[0][2] != 0
    ) return dataInput[0][2]
    
    return 0
}

/** Game done?
 * @param {Array} data: 2D Array: data in table 
 * @returns Boolen: true or false
 */
function isFinalState(data){
    let dataInput = []
    data.forEach(item => {
        dataInput = [...dataInput, [...item]]
    })
    // check rows
    for(let i = 0; i < 3; i++)
        if(dataInput[i][0] === dataInput[i][1] 
            && dataInput[i][0] === dataInput[i][2] 
            && dataInput[i][0] != 0
        ) return true

    // check cols
    for(let i = 0; i < 3; i++)
        if(dataInput[0][i] === dataInput[1][i] 
            && dataInput[0][i] === dataInput[2][i] 
            && dataInput[0][i] != 0
        ) return true

    if(dataInput[0][0] === dataInput[1][1] 
        && dataInput[1][1] == dataInput[2][2]
        && dataInput[0][0] != 0
    ) return true

    if(dataInput[0][2] === dataInput[1][1] 
        && dataInput[1][1] == dataInput[2][0]
        && dataInput[0][2] != 0
    ) return true
    
    for(let i = 0; i < 3; i++)
        for(let j = 0; j < 3; j++)
            if(dataInput[i][j] == 0)
                return false

    return true
}

/** Take all possible statas
 * @param {Array} data: 2D Array: data in table 
 * @returns Array: 3D Array
 */
function getNextState(data){
    let dataInput = []
    data.forEach(item => {
        dataInput = [...dataInput, [...item]]
    })
    let turn = getNextPlayer(dataInput)
    let states = []
    for(let i = 0; i < 3; i++){
        for(let j = 0; j < 3; j++){
            if(dataInput[i][j] == 0){
                const state = play(dataInput, i, j, turn)
                states.push(state)
            }
        }
    }

    return states
}

/** Get score for state
 * @param {Array} data: 2D Array: data in table 
 * @returns [Number, Array]: [score, best state for machine]
 */
function getScore(data){
    let dataInput = []
    data.forEach(item => {
        dataInput = [...dataInput, [...item]]
    })
    if(isFinalState(dataInput)){
        return [getScoreFinalState(dataInput), dataInput]
    }
    let turn = getNextPlayer(dataInput)
    let states = getNextState(dataInput)
    // console.log(states)
    let bestScore = -10
    let bestState = []
    states.forEach(state => {
        [score, newState] = getScore(state)
        if(turn == 1){
            if(bestScore < score || bestScore == -10){
                bestScore = score
                bestState = state
            }
        } else {
            if(bestScore > score || bestScore == -10){
                bestScore = score
                bestState = state
            }
        }
    })

    return [bestScore, bestState]
}

/** Get machine coordinates
 * @param {Array} data: 2D Array: data in table 
 * @returns [Number, Number]: coordinates [x, y]
 */
function computerTurn(data){
    let dataInput = []
    data.forEach(item => {
        dataInput = [...dataInput, [...item]]
    })
    const [score, state] = getScore(dataInput)
    if(isFinalState(dataInput)){
        showWinner(dataInput)
        return [-2, -2]
    }
    for(let i = 0; i < 3; i++){
        for(let j = 0; j < 3; j++){
            if(data[i][j] != state[i][j]){
                return [i, j]
            }
        }
    }
    return [-1, -1]
}


createTable()