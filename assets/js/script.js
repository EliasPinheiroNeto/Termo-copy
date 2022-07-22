const gameBase = {
    frames: 1,
    attempts: 6,
    letters: 5,
}


const dataBase = [
    "morro", "pular", "subir", "andar", "nadar", "vasco", "barco", "navio",
]

const keyboardLetters = "abcdefghijklmnopgrstuvwxyz"


function startGame(obj = gameBase) {
    const main = document.querySelector("main")

    const gameRuning = {
        row: 0,
        letter: 0,

        frames: [],
    }

    for (let i = 0; i < obj.frames; i++) {
        const frame = document.createElement("div")
        frame.classList.add("frame")

        const number = Math.floor(Math.random() * (dataBase.length - 1))
        randomWord = dataBase[number]
        console.log(randomWord)

        gameRuning.frames.push({
            word: randomWord,
            rows: []
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

            frame.rows[gameRuning.row][gameRuning.letter].classList.add("selected")
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

            frame.rows[gameRuning.row].forEach(letter => {
                letter.classList.remove("disable")
            })
        })
    }
    markEnable()

    console.log(gameRuning)



    document.addEventListener("keydown", (e) => {
        const key = e.key.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()

        if (keyboardLetters.indexOf(key) != -1) {
            gameRuning.frames.forEach(frame => {
                frame.rows[gameRuning.row][gameRuning.letter].innerHTML = key
            })

            if (gameRuning.letter < obj.letters - 1) {
                gameRuning.letter++
            }

            markSelected()
        }

        switch (key) {
            case "enter":
                let row = gameRuning.frames[0].rows[gameRuning.row]
                let x = 0
                for (let i = 0; i < row.length; i++) {
                    if (row[i].innerHTML == "") {
                        break
                    }

                    x++
                }

                if (x == obj.letters) {
                    gameRuning.frames.forEach(frame => {
                        frame.rows[gameRuning.row].forEach((letter, index) => {
                            console.log(letter.innerHTML.toLowerCase())
                            console.log(frame.word[index])
                            if (letter.innerHTML.toLowerCase() == frame.word[index]) {
                                letter.classList.add("right")
                            } else if (frame.word.indexOf(letter.innerHTML.toLowerCase()) != -1) {
                                letter.classList.add("amost")
                            } else {
                                letter.classList.add("wrong")
                            }
                        })
                    })

                    gameRuning.row < obj.attempts - 1 ? gameRuning.row++ : gameRuning.row
                    gameRuning.letter = 0
                    markSelected()
                    markEnable()
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
                    const letter = frame.rows[gameRuning.row][gameRuning.letter]
                    const letterBefore = frame.rows[gameRuning.row][gameRuning.letter - 1]

                    if (letter.innerHTML != "") {
                        letter.innerHTML = ""
                    } else if (letterBefore) {
                        letterBefore.innerHTML = ""
                        gameRuning.letter > 0 ? gameRuning.letter-- : gameRuning.letter
                    }
                })

                markSelected()
                break
        }
    })
}

startGame({ ...gameBase, frames: 2 })