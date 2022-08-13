def farmerPick():
    if randint(0, 1) == 1:
        if randint(0, 1) == 1:
            farmer.x = 154
            farmer.y = randint(4, 114)
            farmer.set_velocity(-50 - info.score() / 2, 0)
        else:
            farmer.x = 4
            farmer.y = randint(4, 114)
            farmer.set_velocity(50 + info.score() / 2, 0)
    else:
        if randint(0, 1) == 1:
            farmer.x = randint(4, 154)
            farmer.y = 4
            farmer.set_velocity(0, 50 + info.score() / 2)
        else:
            farmer.x = randint(4, 154)
            farmer.y = 114
            farmer.set_velocity(0, -50 - info.score() / 2)
def keepInBounds(sprite: Sprite):
    global collision
    collision = False
    if sprite.x < 5:
        sprite.x = 4
        collision = True
    if sprite.x > 155:
        sprite.x = 154
        collision = True
    if sprite.y < 5:
        sprite.y = 4
        collision = True
    if sprite.y > 115:
        sprite.y = 114
        collision = True
    return collision
def farmerCheck():
    if keepInBounds(farmer):
        farmerPick()
def makeSprites():
    global chikNPee, farmer
    chikNPee = sprites.create(assets.image("""
        spr_chickN
    """), SpriteKind.player)
    farmer = sprites.create(assets.image("""
        farmer
    """), SpriteKind.enemy)

def on_life_zero():
    if info.score() >= info.high_score():
        game.over(True, effects.confetti)
    else:
        game.over(False, effects.slash)
info.on_life_zero(on_life_zero)

def on_on_overlap(sprite2, otherSprite):
    global numbNuts
    otherSprite.destroy()
    music.ba_ding.play()
    numbNuts += -1
    info.change_score_by(1)
    if info.score() % 30 == 0:
        music.power_up.play()
        info.change_life_by(1)
sprites.on_overlap(SpriteKind.player, SpriteKind.food, on_on_overlap)

def manageDepth(sprite3: Sprite):
    sprite3.z = sprite3.y + sprite3.height / 2
def makeNut():
    global nut
    nut = sprites.create(assets.image("""
        myImage
    """), SpriteKind.food)
    nut.set_position(randint(4, 154), randint(4, 114))
    while nut.overlaps_with(chikNPee):
        nut.set_position(randint(4, 154), randint(4, 114))
    animation.run_image_animation(nut, assets.animation("""
        myAnim1
    """), 150, True)
    manageDepth(nut)
def chikNmove():
    global peeHV, peeVV
    peeHV = controller.dx()
    peeVV = controller.dy()
    chikNPee.set_position(chikNPee.x + peeHV, chikNPee.y + peeVV)
    keepInBounds(chikNPee)

def on_on_overlap2(sprite4, otherSprite2):
    global immune
    if immune == 0:
        immune = 100
        info.change_life_by(-1)
        music.zapped.play()
        animation.run_image_animation(chikNPee, assets.animation("""
            myAnim
        """), 150, True)
sprites.on_overlap(SpriteKind.player, SpriteKind.enemy, on_on_overlap2)

peeVV = 0
peeHV = 0
nut: Sprite = None
numbNuts = 0
chikNPee: Sprite = None
collision = False
farmer: Sprite = None
immune = 0
music.jump_up.play()
game.splash("Guess What?", "By Toño Garcia")
info.set_score(0)
scene.set_background_image(assets.image("""
    Background
"""))
info.set_life(3)
immune = 0
makeSprites()
farmerPick()

def on_forever():
    global immune
    chikNmove()
    manageDepth(chikNPee)
    manageDepth(farmer)
    farmerCheck()
    if immune > 0:
        immune += -1
        if immune == 0:
            animation.run_image_animation(chikNPee, assets.animation("""
                myAnim0
            """), 200, True)
forever(on_forever)

def on_update_interval():
    global numbNuts
    if numbNuts < 5:
        makeNut()
        numbNuts += 1
game.on_update_interval(500, on_update_interval)
