function farmerPick () {
    if (randint(0, 1) == 1) {
        if (randint(0, 1) == 1) {
            farmer.x = 154
            farmer.y = randint(4, 114)
            farmer.setVelocity(-50 - info.score() / 2, 0)
        } else {
            farmer.x = 4
            farmer.y = randint(4, 114)
            farmer.setVelocity(50 + info.score() / 2, 0)
        }
    } else {
        if (randint(0, 1) == 1) {
            farmer.x = randint(4, 154)
            farmer.y = 4
            farmer.setVelocity(0, 50 + info.score() / 2)
        } else {
            farmer.x = randint(4, 154)
            farmer.y = 114
            farmer.setVelocity(0, -50 - info.score() / 2)
        }
    }
}
function keepInBounds (sprite: Sprite) {
    collision = false
    if (sprite.x < 5) {
        sprite.x = 4
        collision = true
    }
    if (sprite.x > 155) {
        sprite.x = 154
        collision = true
    }
    if (sprite.y < 5) {
        sprite.y = 4
        collision = true
    }
    if (sprite.y > 115) {
        sprite.y = 114
        collision = true
    }
    return collision
}
function farmerCheck () {
    if (keepInBounds(farmer)) {
        farmerPick()
    }
}
function makeSprites () {
    chikNPee = sprites.create(assets.image`spr_chickN`, SpriteKind.Player)
    farmer = sprites.create(assets.image`farmer`, SpriteKind.Enemy)
}
info.onLifeZero(function () {
    if (info.score() >= info.highScore()) {
        game.over(true, effects.confetti)
    } else {
        game.over(false, effects.slash)
    }
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Food, function (sprite, otherSprite) {
    otherSprite.destroy()
    music.baDing.play()
    numbNuts += -1
    info.changeScoreBy(1)
    if (info.score() % 30 == 0) {
        music.powerUp.play()
        info.changeLifeBy(1)
    }
})
function manageDepth (sprite: Sprite) {
    sprite.z = sprite.y + sprite.height / 2
}
function makeNut () {
    nut = sprites.create(assets.image`myImage`, SpriteKind.Food)
    nut.setPosition(randint(4, 154), randint(4, 114))
    while (nut.overlapsWith(chikNPee)) {
        nut.setPosition(randint(4, 154), randint(4, 114))
    }
    animation.runImageAnimation(
    nut,
    assets.animation`myAnim1`,
    150,
    true
    )
    manageDepth(nut)
}
function chikNmove () {
    peeHV = controller.dx()
    peeVV = controller.dy()
    chikNPee.setPosition(chikNPee.x + peeHV, chikNPee.y + peeVV)
    keepInBounds(chikNPee)
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (sprite, otherSprite) {
    if (immune == 0) {
        immune = 100
        info.changeLifeBy(-1)
        music.zapped.play()
        animation.runImageAnimation(
        chikNPee,
        assets.animation`myAnim`,
        150,
        true
        )
    }
})
let peeVV = 0
let peeHV = 0
let nut: Sprite = null
let numbNuts = 0
let chikNPee: Sprite = null
let collision = false
let farmer: Sprite = null
let immune = 0
music.jumpUp.play()
game.splash("Guess What?", "By Toño Garcia")
info.setScore(0)
scene.setBackgroundImage(assets.image`Background`)
info.setLife(3)
immune = 0
makeSprites()
farmerPick()
forever(function () {
    chikNmove()
    manageDepth(chikNPee)
    manageDepth(farmer)
    farmerCheck()
    if (immune > 0) {
        immune += -1
        if (immune == 0) {
            animation.runImageAnimation(
            chikNPee,
            assets.animation`myAnim0`,
            200,
            true
            )
        }
    }
})
game.onUpdateInterval(500, function () {
    if (numbNuts < 5) {
        makeNut()
        numbNuts += 1
    }
})
