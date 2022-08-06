const gameBase = {
    frames: 1,
    attempts: 6,
    letters: 5,
}


import json from "../../src/dataBase.json" assert {type: 'json'}
const dataBase = json

const keyboardLetters = "abcdefghijklmnopqrstuvwxyz"


function startGame(obj = gameBase) {
    const main = document.querySelector("main")

    const gameRuning = {
        row: 0,
        letter: 0,

        frames: [],
        gameEnd: false,
        gameWin: false,
    }

    for (let i = 0; i < obj.frames; i++) {
        const frame = document.createElement("div")
        frame.classList.add("frame")

        const number = Math.floor(Math.random() * (dataBase.length - 1))
        const randomWord = dataBase[number].normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()

        console.log(`Resposta do quadro ${i + 1}: ${randomWord}`)

        gameRuning.frames.push({
            word: randomWord,
            rows: [],
            enable: true,
            win: false
        })

        for (let j = 0; j < obj.attempts; j++) {
            const row = document.createElement("div")
            row.classList.add("row")

            gameRuning.frames[i].rows.push([])

            for (let k = 0; k < obj.letters; k++) {
                const letter = document.createElement("div")
                letter.classList.add("square")

                gameRuning.frames[i].rows[j].push(letter)

                row.append(letter)
            }

            frame.append(row)
        }

        main.append(frame)
    }

    function markSelected() {
        gameRuning.frames.forEach(frame => {
            frame.rows[gameRuning.row].forEach(letter => {
                letter.classList.remove("selected")
            })

            if (frame.enable) {
                frame.rows[gameRuning.row][gameRuning.letter].classList.add("selected")
            }
        })
    }
    markSelected()

    function markEnable() {
        gameRuning.frames.forEach(frame => {
            frame.rows.forEach((row, index) => {
                if (index > gameRuning.row) {
                    row.forEach(letter => {
                        letter.classList.add("disable")
                    })
                } else if (index < gameRuning.row) {
                    row.forEach(letter => {
                        letter.classList.remove("selected")
                    })
                }
            })

            if (frame.enable) {
                frame.rows[gameRuning.row].forEach(letter => {
                    letter.classList.remove("disable")
                })
            }
        })
    }
    markEnable()

    console.log(gameRuning)



    document.addEventListener("keydown", (e) => {
        const key = e.key.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()

        if (keyboardLetters.indexOf(key) != -1) {
            gameRuning.frames.forEach(frame => {
                if (frame.enable) {
                    frame.rows[gameRuning.row][gameRuning.letter].innerHTML = key
                }
            })

            if (gameRuning.letter < obj.letters - 1) {
                gameRuning.letter++
            }

            markSelected()
        }

        switch (key) {
            case "enter":
                if (gameRuning.gameEnd == false) {

                    let next = false

                    gameRuning.frames.forEach((frame, index) => {
                        let row = frame.rows[gameRuning.row]
                        let x = 0

                        for (let i = 0; i < row.length; i++) {
                            if (row[i].innerHTML == "") {
                                break
                            }

                            x++
                        }

                        if (x == obj.letters) {
                            next = true

                            if (frame.enable) {
                                let y = 0
                                frame.rows[gameRuning.row].forEach((letter, index) => {
                                    if (letter.innerHTML.toLowerCase() == frame.word[index]) {
                                        letter.classList.add("right")
                                        y++
                                    } else if (frame.word.indexOf(letter.innerHTML.toLowerCase()) != -1) {
                                        letter.classList.add("amost")
                                    } else {
                                        letter.classList.add("wrong")
                                    }
                                })

                                if (y == obj.letters) {
                                    frame.enable = false
                                    frame.win = true
                                }
                            }
                        }
                    })

                    if (next) {
                        gameRuning.row < obj.attempts - 1 ? gameRuning.row++ : gameRuning.frames.forEach(frame => frame.enable = false)

                        let framesWon = 0
                        let framesEnable = 0
                        gameRuning.frames.forEach(frame => {
                            if (frame.enable) {
                                framesEnable++
                            }

                            if (frame.win) {
                                framesWon++
                            }
                        })

                        if (framesEnable == 0) {
                            if (framesWon == obj.frames) {
                                gameRuning.gameWin = true

                                let s = gameRuning.frames.reduce((string, frame) => string + frame.word + ", ", "")
                                addTagInHud("Parabens, você acertou a palavra", "h2")
                                addTagInHud(`Tentativas: ${gameRuning.row}`, "p")
                                addTagInHud(`As palavras eram: ${s}`, "p")
                            } else {
                                let s = gameRuning.frames.reduce((string, frame) => string + frame.word + ", ", "")
                                addTagInHud("Que pena, você não conseguiu dessa vez", "h2")
                                addTagInHud(`Tentativas: ${gameRuning.row}`, "p")
                                addTagInHud(`As palavras eram: ${s}`, "p")
                            }
                            gameRuning.gameEnd = true
                            showHud(true)

                        }

                        gameRuning.letter = 0
                        markSelected()
                        markEnable()
                    }
                }
                break

            case "arrowleft":
                gameRuning.letter > 0 ? gameRuning.letter-- : gameRuning.letter
                markSelected()
                break

            case "arrowright":
                gameRuning.letter < obj.letters - 1 ? gameRuning.letter++ : gameRuning.letter
                markSelected()
                break

            case "backspace":
                gameRuning.frames.forEach(frame => {
                    if (frame.enable) {
                        const letter = frame.rows[gameRuning.row][gameRuning.letter]
                        const letterBefore = frame.rows[gameRuning.row][gameRuning.letter - 1]

                        if (letter.innerHTML != "") {
                            letter.innerHTML = ""
                        } else if (letterBefore) {
                            letterBefore.innerHTML = ""
                            gameRuning.letter > 0 ? gameRuning.letter-- : gameRuning.letter
                        }
                    }
                })

                markSelected()
                break
        }
    })

    let show = false
    document.addEventListener("click", (e) => {
        if (gameRuning.gameEnd) {
            showHud(show)
            show = !show
        }
    })
}



function showHud(state) {
    const hud = document.getElementById("container-end")

    if (state) {
        hud.style.display = "flex"
    } else {
        hud.style.display = "none"
    }

}

function addTagInHud(text, tag) {
    const hud = document.getElementById("container-end").querySelector("div")
    const newTag = document.createElement(tag)

    newTag.innerHTML = text
    hud.append(newTag)
}

startGame({ ...gameBase, frames: 1 })