const gameBase = {
    frames: 1,
    attempts: 6,
    letters: 5,
}


const dataBase = [
    "morro", "pular", "subir", "andar", "nadar", "vasco", "barco", "navio",
]


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

        gameRuning.frames.push([])

        for (let j = 0; j < obj.attempts; j++) {
            const row = document.createElement("div")
            row.classList.add("row")

            gameRuning.frames[i].push([])

            for (let k = 0; k < obj.letters; k++) {
                const letter = document.createElement("div")
                letter.classList.add("square")

                gameRuning.frames[i][j].push(letter)

                row.append(letter)
            }

            frame.append(row)
        }

        main.append(frame)
    }

    console.log(gameRuning)

    document.addEventListener("keydown", (e) => {
        gameRuning.frames.forEach(frame => {
            frame[gameRuning.row][gameRuning.letter].innerHTML = e.key
        })

        if (gameRuning.letter < obj.letters - 1) {
            gameRuning.letter++
        }
    })
}

startGame()