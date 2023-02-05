const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 768

c.fillStyle = 'white'
c.fillRect(0, 0, canvas.width, canvas.height)


const offset = {
    x: -480,
    y: -288
}


const playerOffset = {
    x: 250,
    y: 370
}

const colMap = []
for (let i = 0; i < col.length; i += 70) {
    colMap.push(col.slice(i, 70 + i))
}

class Boundary {
    static width = 48
    static height = 48
    constructor({ position }) {
        this.position = position
        this.width = 48
        this.height = 48
    }
    draw() {
        c.fillStyle = 'rgba(255, 255, 255, 0)'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

const boundaries = []
colMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if(symbol === 1025) {
            boundaries.push(
                new Boundary({
                    position: {
                        x: j * Boundary.width + offset.x,
                        y: i * Boundary.height + offset.y + 20
                    }
                })
            )
        }
    });
});
console.log(boundaries)

const image = new Image()
image.src = 'map2.png'


const overlap = new Image()
overlap.src = 'map3.png'

image.onload = () => {
}

const playerUp = new Image()
playerUp.src = 'playerUp.png'

const playerDown = new Image()
playerDown.src = 'playerDown.png'

const playerLeft = new Image()
playerLeft.src = 'playerLeft.png'

const playerRight = new Image()
playerRight.src = 'playerRight.png'


class Sprite {
    constructor({ position, velocity, image, frames = { max: 1} }) {
        this.position = position
        this.frames = {...frames, val: 0, elapsed: 0}
        this.image = image

        this.image.onload = () => {
            this.width = this.image.width / this.frames.max
            this.height = this.image.height
        }
        this.moving = false
    }
    draw() {
        c.drawImage(
            this.image,
            this.width * this.frames.val,
            0,
            this.image.width / this.frames.max,
            this.image.height,
            this.position.x,
            this.position.y,
            this.image.width / this.frames.max,
            this.image.height
        )
        if(this.moving) {
            if(this.frames.max > 1) {
                this.frames.elapsed++
            }
            if(this.frames.elapsed % 10 === 0) {
                if(this.frames.val < this.frames.max -1) this.frames.val++
                else this.frames.val = 0
            }
        } else {
            this.frames.elapsed = 0
            this.frames.val = 0
        }
    }
}






const overlapBg = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    // velocity,
    image: overlap
})
const bg = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    // velocity,
    image: image
})
const player = new Sprite({
    position: {
        x: playerOffset.x,
        y: playerOffset.y
    },
    // velocity,
    image: playerDown,
    frames: {max: 4}
})

let bgX = -500
let bgY = -300


let lastKey = ''
let lastPlayer = null
const keys = {
    
    ArrowUp : {
        pressed: false
    },
    ArrowDown : {
        pressed: false
    },
    ArrowLeft : {
        pressed: false
    },
    ArrowRight : {
        pressed: false
    },
}

function rectangularCollision({ rect1, rect2 }) {
    return ( true
        && rect1.position.x + rect1.width >= rect2.position.x
        && rect1.position.x <= rect2.position.x + rect2.width
        && rect1.position.y <= rect2.position.y + rect2.height
        && rect1.position.y + rect1.height >= rect2.position.y
    )
}
let step = 0
setInterval(() => {
    step += 1
    if(step > 3)
        step = 0
}, 200);
console.log(player)
const movables = [bg, overlapBg, ...boundaries]
function animate() {
    window.requestAnimationFrame(animate)
    bg.draw()

    boundaries.forEach(boundary => {
        boundary.draw()
    });

    player.draw()
    overlapBg.draw()

    if(keys.ArrowUp.pressed && lastKey == 'ArrowUp') {
        if(checkCollision(0, 3)) {
            player.moving = true
            player.image = playerUp
            movables.forEach((movable) => {
                movable.position.y += 3
            })
        } else {
            player.moving = false
        }
    }
    else if(keys.ArrowDown.pressed && lastKey == 'ArrowDown') {
        if(checkCollision(0, -3)) {
            player.moving = true
            player.image = playerDown
            movables.forEach((movable) => {
                movable.position.y -= 3
            })
        } else {
            player.moving = false
        }
    }
    else if(keys.ArrowLeft.pressed && lastKey == 'ArrowLeft') {
        if(checkCollision(3, 0)) {
            player.moving = true
            player.image = playerLeft
            movables.forEach((movable) => {
                movable.position.x += 3
            })
        } else {
            player.moving = false
        }
    }
    else if(keys.ArrowRight.pressed && lastKey == 'ArrowRight') {
        if(checkCollision(-3, 0)) {
            player.moving = true
            player.image = playerRight
            movables.forEach((movable) => {
                movable.position.x -= 3
            })
        } else {
            player.moving = false
        }
    }
}

function checkCollision (x, y) {
    for (let i = 0; i < boundaries.length; i++) {
        const boundary = boundaries[i];
        if(rectangularCollision({
            rect1: player,
            rect2: {
                ...boundary,
                position: {
                    x: boundary.position.x + x,
                    y: boundary.position.y + y
                }
            }
        })) {
            return false
        }
    }
    return true
}


animate()

window.addEventListener('keydown', (e) => {

    switch(e.key) {
        case 'ArrowUp':
            keys.ArrowUp.pressed = true
            lastKey = 'ArrowUp'
            break
        case 'ArrowDown':
            keys.ArrowDown.pressed = true
            lastKey = 'ArrowDown'
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            lastKey = 'ArrowLeft'
            break
        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            lastKey = 'ArrowRight'
            break
        default:
            player.moving = false
            lastKey = ''
            break
    }
    lastKey = e.key
})
window.addEventListener('keyup', (e) => {

    // console.log(e.key)
    // switch(e.key) {
    //     case 'ArrowUp':
    //         keys.ArrowUp.pressed = false
    //         break
    //     case 'ArrowDown':
    //         keys.ArrowDown.pressed = false
    //         break
    //     case 'ArrowLeft':
    //         keys.ArrowLeft.pressed = false
    //         break
    //     case 'ArrowRight':
    //         keys.ArrowRight.pressed = false
    //         break
    // }
})