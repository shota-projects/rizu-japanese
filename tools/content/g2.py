from _helpers import *
units = []
units.append({
 "id": "g-trains", "track": "around", "title": "Directions & trains", "jpTitle": "みちとでんしゃ",
 "summary": "Asking where things are, understanding left / right / straight, catching the right train.",
 "phrases": [
  P("トイレはどこですか", "toire wa doko desu ka", "Where is the restroom?", "Swap in any place: 駅 (eki), the station.", grammar="[place] はどこですか = Where is [place]?"),
  P("駅はどこですか", "eki wa doko desu ka", "Where is the station?", kana="えきはどこですか"),
  P("この近くにコンビニはありますか", "kono chikaku ni konbini wa arimasu ka", "Is there a convenience store near here?", kana="このちかくにコンビニはありますか"),
  P("まっすぐです", "massugu desu", "It's straight ahead.", "You'll hear these in answers. Watch their hands too."),
  P("右です", "migi desu", "It's on the right.", kana="みぎです"),
  P("左です", "hidari desu", "It's on the left.", kana="ひだりです"),
  P("ここから遠いですか", "koko kara tōi desu ka", "Is it far from here?", kana="ここからとおいですか"),
  P("歩いて五分ぐらいです", "aruite go-fun gurai desu", "About five minutes on foot.", "ぐらい = about. 十分 (juppun) is ten minutes.", kana="あるいてごふんぐらいです"),
  P("新宿行きは何番線ですか", "Shinjuku-iki wa nan-bansen desu ka", "Which platform for trains to Shinjuku?", "〜行き (iki) = bound for ~. 番線 (bansen) = platform number.", kana="しんじゅくいきはなんばんせんですか"),
  P("この電車は渋谷に止まりますか", "kono densha wa Shibuya ni tomarimasu ka", "Does this train stop at Shibuya?", "Express trains skip stations, so it's worth asking.", kana="このでんしゃはしぶやにとまりますか"),
  P("乗り換えはどこですか", "norikae wa doko desu ka", "Where do I transfer?", kana="のりかえはどこですか"),
 ],
 "roleplay": {
  "title": "Looking for the station", "setting": "You're lost near Shibuya, heading for Shinjuku, and stop a friendly passer-by.",
  "lines": [
   Y("Get their attention and ask where the station is.", [
     O("すみません、駅はどこですか。", "Sumimasen, eki wa doko desu ka.", "Excuse me, where is the station?", kana="すみません、えきはどこですか。"),
     O("いらっしゃいませ。", "Irasshaimase.", "Welcome! (shop greeting)"),
     O("駅です。", "Eki desu.", "It's a station.", kana="えきです。")]),
   T("Passer-by", "駅ですか？あそこの信号を右に曲がって、まっすぐです。", "Eki desu ka? Asoko no shingō o migi ni magatte, massugu desu.", "The station? Turn right at that traffic light, then go straight.", kana="えきですか？あそこのしんごうをみぎにまがって、まっすぐです。", fast=True),
   Y("Ask if it's far.", [
     O("ここから遠いですか。", "Koko kara tōi desu ka.", "Is it far from here?", kana="ここからとおいですか。"),
     O("左です。", "Hidari desu.", "It's on the left.", kana="ひだりです。"),
     O("お水をください。", "O-mizu o kudasai.", "Water, please.", kana="おみずをください。")]),
   T("Passer-by", "いいえ、歩いて五分ぐらいです。", "Iie, aruite go-fun gurai desu.", "No, about five minutes on foot.", kana="いいえ、あるいてごふんぐらいです。"),
   Y("Thank them.", [
     O("ありがとうございます。", "Arigatō gozaimasu.", "Thank you very much."),
     O("つまらないものですが。", "Tsumaranai mono desu ga.", "It's just a little something…"),
     O("もしもし。", "Moshimoshi.", "Hello? (phone)")]),
   Y("At the station, ask a staff member which platform goes to Shinjuku.", [
     O("新宿行きは何番線ですか。", "Shinjuku-iki wa nan-bansen desu ka.", "Which platform for Shinjuku?", kana="しんじゅくいきはなんばんせんですか。"),
     O("新宿はおいしいです。", "Shinjuku wa oishii desu.", "Shinjuku is delicious.", kana="しんじゅくはおいしいです。"),
     O("乗り換えです。", "Norikae desu.", "It's a transfer.", kana="のりかえです。")]),
   T("Staff", "三番線です。", "San-bansen desu.", "Platform 3.", kana="さんばんせんです。"),
  ]},
 "listening": [
  L("三番線です。", "San-bansen desu.", "It's platform 3.", ["Platform 3.", "3 minutes.", "3 stops."], "Thank them.",
    [O("ありがとうございます。", "Arigatō gozaimasu.", "Thank you."), O("持ち帰りでお願いします。", "Mochikaeri de onegaishimasu.", "To go, please.", kana="もちかえりでおねがいします。"), O("いってらっしゃい。", "Itterasshai.", "Have a good day.")], kana="さんばんせんです。"),
  L("次の駅で乗り換えてください。", "Tsugi no eki de norikaete kudasai.", "Please transfer at the next station.", ["Transfer at the next station.", "Get off at the last stop.", "This train doesn't stop here."], "Check you understood.",
    [O("次の駅ですね。わかりました。", "Tsugi no eki desu ne. Wakarimashita.", "The next station, right? Got it.", kana="つぎのえきですね。わかりました。"), O("歩いて五分です。", "Aruite go-fun desu.", "Five minutes on foot.", kana="あるいてごふんです。"), O("これにします。", "Kore ni shimasu.", "I'll take this one.")], kana="つぎのえきでのりかえてください。"),
  L("あの信号を左に曲がってください。", "Ano shingō o hidari ni magatte kudasai.", "Turn left at that traffic light.", ["Turn left at the light.", "Turn right at the light.", "Go straight past the light."], "Which way do you go?",
    [O("左ですね。", "Hidari desu ne.", "Left, right?", kana="ひだりですね。"), O("右ですね。", "Migi desu ne.", "Right, yes?", kana="みぎですね。"), O("まっすぐですね。", "Massugu desu ne.", "Straight, right?")], kana="あのしんごうをひだりにまがってください。"),
 ]})
