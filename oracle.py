# Rug math oracle - mirrors engine.js float ops exactly (math.floor(x+0.5) == JS Math.round for positive magnitudes).
import json, math

def round1(x):
    return math.floor(x * 10 + 0.5) / 10

STANDARDS = [[120,180],[140,200],[160,230],[170,240],[200,300],[240,340],[300,400]]

def room_rug(roomL, roomW, border):
    if not (roomL > 0 and roomW > 0): return {"error": "room size must be positive"}
    if not (border >= 0): return {"error": "border must not be negative"}
    maxL = round1(roomL - 2 * border); maxW = round1(roomW - 2 * border)
    if not (maxL > 0 and maxW > 0): return {"error": "border eats the whole room"}
    best = None
    for a, b in STANDARDS:
        fits = (a <= maxL and b <= maxW) or (a <= maxW and b <= maxL)
        if fits and (best is None or a * b > best[0] * best[1]):
            best = [a, b]
    if best is None:
        return {"maxL": maxL, "maxW": maxW, "size": None, "actual": None, "verdict": "no standard size fits - go custom or round"}
    actual = round1((max(roomL, roomW) - max(best[0], best[1])) / 2)
    return {"maxL": maxL, "maxW": maxW, "size": best, "actual": actual, "verdict": "largest standard that fits: %d x %d cm" % (best[0], best[1])}

def dining_rug(tableL, tableW, pullout):
    if not (tableL > 0 and tableW > 0): return {"error": "table size must be positive"}
    if not (pullout >= 0): return {"error": "pull-out must not be negative"}
    return {"minL": round1(tableL + 2 * pullout), "minW": round1(tableW + 2 * pullout)}

def sofa_rule(sofaL, rugL):
    if not (sofaL > 0): return {"error": "sofa length must be positive"}
    if not (rugL > 0): return {"error": "rug length must be positive"}
    if rugL < sofaL:
        return {"fits": False, "ext": None, "verdict": "too short by %g cm - front legs off the rug" % round1(sofaL - rugL)}
    ext = round1((rugL - sofaL) / 2)
    return {"fits": True, "ext": ext, "verdict": "front legs on, extends %g cm past each arm" % ext}

cases = []
def rr(*a): cases.append({"tool": "room", "args": list(a), "expect": room_rug(*a)})
def dr(*a): cases.append({"tool": "dining", "args": list(a), "expect": dining_rug(*a)})
def sr(*a): cases.append({"tool": "sofa", "args": list(a), "expect": sofa_rule(*a)})

# room: happy
rr(420, 340, 45)        # defaults -> max 330x250, best 200x300, actual 60
rr(500, 400, 60)        # big room 60 border -> 380x280, 240x340 fits rotated (340<=380,240<=280) yes; 300x400: 400>380 no -> 240x340
rr(360, 300, 45)        # 270x210 -> 160x230? 230>210; rotated 230<=270,160<=210 yes -> 160x230
rr(300, 300, 30)        # 240x240 -> 170x240? rotated 240<=240,170<=240 yes -> 170x240
rr(250, 220, 40)        # 170x140 -> 120x180? 180>170; rotated 180>140 no -> none? 120x180: 180<=140? no; none fits -> custom
rr(150, 150, 45)        # tiny, none
rr(600, 500, 45)        # 510x410 -> 300x400
rr(455, 355, 52.5)      # decimals: 350x250 -> 240x340? 340<=350,240<=250 yes
rr(390, 310, 50)        # 290x210 -> 170x240 rotated? 240<=290,170<=210 yes
# room: errors
rr(0, 340, 45)
rr(-420, 340, 45)
rr(420, 0, 45)
rr(420, 340, -10)
rr(80, 80, 45)          # border eats room
rr(90, 90, 45)          # maxL 0 -> eats

# dining: happy
dr(180, 90, 60)         # defaults -> 300x210
dr(140, 80, 60)         # 260x200
dr(200, 100, 75)        # 350x250
dr(160, 160, 60)        # square
dr(120, 70, 0)          # no pull-out
dr(175.5, 88.5, 62.5)   # decimals
# dining: errors
dr(0, 90, 60)
dr(180, -90, 60)
dr(180, 90, -5)

# sofa: happy
sr(220, 240)            # extends 10
sr(220, 160)            # too short by 60
sr(220, 220)            # exactly, extends 0
sr(180, 300)            # extends 60
sr(250.5, 240.5)        # short by 10
sr(200, 240.5)          # decimals ext 20.3? (240.5-200)/2=20.25->round 20.3? floor(202.5+0.5)=203 -> 20.3
# sofa: errors
sr(0, 240)
sr(-220, 240)
sr(220, 0)
sr(220, -10)

with open("expected.json", "w") as f:
    json.dump(cases, f, indent=1)
print(len(cases), "cases written")
