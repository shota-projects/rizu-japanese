from _helpers import *
units = []
units.append({
 "id": "f-gifts", "track": "family", "title": "Gifts, thanks & sorry", "jpTitle": "おみやげ",
 "summary": "Giving a gift the Japanese way, thanking warmly, apologizing gracefully.",
 "phrases": [
  P("お土産です", "o-miyage desu", "This is a little gift (from home / a trip).", "Bringing お土産 when you visit is a big deal. Something from home is perfect.", kana="おみやげです"),
  P("つまらないものですが", "tsumaranai mono desu ga", "It's just a little something…", "Traditional modesty when giving a gift. Many people now prefer ほんの気持ちですが (honno kimochi desu ga, \"just a small token\"), which also works."),
  P("どうぞ", "dōzo", "Here you go / Please (take it)", "Hand the gift over with both hands."),
  P("気に入ってもらえるとうれしいです", "ki ni itte moraeru to ureshii desu", "I hope you like it.", "A warm, modern line to add.", kana="きにいってもらえるとうれしいです"),
  P("お気遣いありがとうございます", "o-kizukai arigatō gozaimasu", "Thank you for being so thoughtful.", "When they do something kind for you.", kana="おきづかいありがとうございます"),
  P("遅れてすみません", "okurete sumimasen", "Sorry I'm late.", "With elders, 遅れて申し訳ありません (mōshiwake arimasen) is even more polite.", kana="おくれてすみません"),
  P("本当にすみません", "hontō ni sumimasen", "I'm really sorry.", "For small accidents, like spilling something.", kana="ほんとうにすみません"),
  P("気にしないでください", "ki ni shinaide kudasai", "Please don't worry about it.", "When someone apologizes to you. They may say the casual 気にしないで.", kana="きにしないでください"),
  P("お世話になりました", "o-sewa ni narimashita", "Thank you for taking care of me.", "Say it at the end of a stay. It's deeply appreciated.", kana="おせわになりました"),
  P("いろいろありがとうございました", "iroiro arigatō gozaimashita", "Thank you for everything.", "Past tense (ました) thanks them for something that's finished, like the visit."),
 ],
 "roleplay": {
  "title": "Visiting with a gift", "setting": "Another visit — you bring a little gift from home, as usual.",
  "lines": [
   T("Mom", "いらっしゃい！", "Irasshai!", "Welcome!"),
   Y("Give her the gift modestly.", [
     O("これ、お土産です。ほんの気持ちですが、どうぞ。", "Kore, o-miyage desu. Honno kimochi desu ga, dōzo.", "This is a little gift. Just a small token, please take it.", kana="これ、おみやげです。ほんのきもちですが、どうぞ。"),
     O("これ、高いです。", "Kore, takai desu.", "This is expensive.", kana="これ、たかいです。"),
     O("いただきます。", "Itadakimasu.", "(said before eating)")]),
   T("Mom", "まあ、気を遣わなくていいのに。ありがとう。", "Mā, ki o tsukawanakute ii noni. Arigatō.", "Oh, you didn't have to! Thank you.", kana="まあ、きをつかわなくていいのに。ありがとう。", note="A polite ritual. She's touched; it doesn't mean she didn't want it."),
   Y("Say you hope she likes it.", [
     O("気に入ってもらえるとうれしいです。", "Ki ni itte moraeru to ureshii desu.", "I hope you like it.", kana="きにいってもらえるとうれしいです。"),
     O("気にしないでください。", "Ki ni shinaide kudasai.", "Please don't worry about it.", kana="きにしないでください。"),
     O("お世話になりました。", "O-sewa ni narimashita.", "Thanks for taking care of me.", kana="おせわになりました。")]),
   T("Mom", "あっ、お茶がこぼれちゃった。", "A, o-cha ga koborechatta.", "Oh! The tea spilled.", kana="あっ、おちゃがこぼれちゃった。", note="Let's say you knocked the cup."),
   Y("Apologize sincerely.", [
     O("本当にすみません！", "Hontō ni sumimasen!", "I'm really sorry!", kana="ほんとうにすみません！"),
     O("どうぞ。", "Dōzo.", "Here you go."),
     O("ぜひ。", "Zehi.", "I'd love to!")]),
   T("Mom", "大丈夫、大丈夫。気にしないで。", "Daijōbu, daijōbu. Ki ni shinaide.", "It's fine, it's fine. Don't worry about it.", kana="だいじょうぶ、だいじょうぶ。きにしないで。"),
   T("Mom", "また来てね。", "Mata kite ne.", "Come again, OK?", kana="またきてね。"),
   Y("Thank her as you leave.", [
     O("いろいろありがとうございました。お邪魔しました。", "Iroiro arigatō gozaimashita. O-jama shimashita.", "Thank you for everything. Thanks for having me.", kana="いろいろありがとうございました。おじゃましました。"),
     O("はじめまして。", "Hajimemashite.", "Nice to meet you."),
     O("いただきます。", "Itadakimasu.", "(said before eating)")]),
  ]},
 "listening": [
  L("気を遣わなくていいのに。", "Ki o tsukawanakute ii noni.", "You didn't have to (go to the trouble).", ["You didn't have to (bring anything).", "Please be careful.", "I don't want it."], "Reply warmly.",
    [O("ほんの気持ちです。", "Honno kimochi desu.", "It's just a small token.", kana="ほんのきもちです。"), O("本当にすみません。", "Hontō ni sumimasen.", "I'm really sorry.", kana="ほんとうにすみません。"), O("もしもし。", "Moshimoshi.", "Hello? (phone)")], kana="きをつかわなくていいのに。"),
  L("気にしないでね。", "Ki ni shinaide ne.", "Don't worry about it, OK?", ["Don't worry about it.", "Please be quiet.", "Did you like it?"], "Thank her.",
    [O("ありがとうございます。", "Arigatō gozaimasu.", "Thank you."), O("つまらないものですが。", "Tsumaranai mono desu ga.", "It's just a little something…"), O("いってきます。", "Ittekimasu.", "I'm heading out.")], kana="きにしないでね。"),
  L("また来てね。", "Mata kite ne.", "Come again, OK?", ["Come again soon.", "See you tomorrow morning.", "Wait a moment."], "Say goodbye politely.",
    [O("はい、お世話になりました。", "Hai, o-sewa ni narimashita.", "Yes, thank you for taking care of me.", kana="はい、おせわになりました。"), O("お邪魔します。", "O-jama shimasu.", "(said entering a home)", kana="おじゃまします。"), O("はじめまして。", "Hajimemashite.", "Nice to meet you.")], kana="またきてね。"),
 ]})
