from _helpers import *
units = []
units.append({
 "id": "g-help", "track": "around", "title": "Asking for help", "jpTitle": "たすけて",
 "summary": "Lifesavers for when you don't understand: slower, again, in English, write it down.",
 "phrases": [
  P("すみません", "sumimasen", "Excuse me / Sorry", "Gets attention, apologizes, and even says thanks. The most useful word you'll learn."),
  P("わかりません", "wakarimasen", "I don't understand.", "Softer: すみません、わかりません。"),
  P("もう一度お願いします", "mō ichido onegaishimasu", "One more time, please.", "Totally normal to ask. People are happy to repeat.", kana="もういちどおねがいします"),
  P("ゆっくり話してください", "yukkuri hanashite kudasai", "Please speak slowly.", kana="ゆっくりはなしてください", grammar="〜てください = please do ~. ゆっくり = slowly."),
  P("英語を話せますか", "eigo o hanasemasu ka", "Can you speak English?", kana="えいごをはなせますか"),
  P("日本語で何と言いますか", "Nihongo de nan to iimasu ka", "How do you say it in Japanese?", "Point at something or say the English word first.", kana="にほんごでなんといいますか"),
  P("書いてもらえますか", "kaite moraemasu ka", "Could you write it down?", "Great for addresses and names.", kana="かいてもらえますか"),
  P("道に迷いました", "michi ni mayoimashita", "I'm lost.", kana="みちにまよいました"),
  P("助けてください", "tasukete kudasai", "Please help me!", "For emergencies. In Japan, dial 110 for police and 119 for fire or ambulance.", kana="たすけてください"),
  P("わかりました", "wakarimashita", "Got it / I understand.", "Past tense, but it means \"understood\" right now."),
 ],
 "roleplay": {
  "title": "Someone stops you on the street", "setting": "A local asks you something in fast Japanese.",
  "lines": [
   T("Local", "すみません、この辺に郵便局ありますか？", "Sumimasen, kono hen ni yūbinkyoku arimasu ka?", "Excuse me, is there a post office around here?", kana="すみません、このへんにゆうびんきょくありますか？", fast=True),
   Y("Ask them to speak slowly.", [
     O("すみません、ゆっくり話してください。", "Sumimasen, yukkuri hanashite kudasai.", "Sorry, please speak slowly.", kana="すみません、ゆっくりはなしてください。"),
     O("わかりました。", "Wakarimashita.", "Got it."),
     O("助けてください！", "Tasukete kudasai!", "Please help me!", kana="たすけてください！")]),
   T("Local", "ゆう・びん・きょく、ありますか？", "Yū-bin-kyoku, arimasu ka?", "Is there a post office?", kana="ゆう・びん・きょく、ありますか？"),
   Y("You still don't understand. Say so.", [
     O("すみません、わかりません。", "Sumimasen, wakarimasen.", "Sorry, I don't understand."),
     O("はい、二人です。", "Hai, futari desu.", "Yes, two people.", kana="はい、ふたりです。"),
     O("お会計お願いします。", "O-kaikei onegaishimasu.", "Check, please.", kana="おかいけいおねがいします。")]),
   T("Local", "あ、ごめんなさい。Post office？", "A, gomen nasai. Post office?", "Oh, sorry! Post office?"),
   Y("Now you get it. Say you're not from around here.", [
     O("わかりました。すみません、この辺はわかりません。", "Wakarimashita. Sumimasen, kono hen wa wakarimasen.", "Got it. Sorry, I don't know this area.", kana="わかりました。すみません、このへんはわかりません。"),
     O("いってきます。", "Ittekimasu.", "I'm heading out."),
     O("いらっしゃいませ。", "Irasshaimase.", "Welcome!")]),
   T("Local", "いえいえ、ありがとう。", "Ie ie, arigatō.", "No worries, thanks!"),
  ]},
 "listening": [
  L("何かお困りですか？", "Nanika o-komari desu ka?", "Is something wrong? Can I help?", ["Do you need help?", "What are you looking for?", "Are you hungry?"], "Say you're lost.",
    [O("はい、道に迷いました。", "Hai, michi ni mayoimashita.", "Yes, I'm lost.", kana="はい、みちにまよいました。"), O("いただきます。", "Itadakimasu.", "(said before eating)"), O("これにします。", "Kore ni shimasu.", "I'll take this one.")], kana="なにかおこまりですか？"),
  L("ここをまっすぐ行って、二つ目の角を右に曲がって、すぐ左です。", "Koko o massugu itte, futatsu-me no kado o migi ni magatte, sugu hidari desu.", "Go straight, turn right at the second corner, and it's right there on the left.", ["Long directions: straight, right, then left.", "It's closed today.", "Take the train two stops."], "Too fast! Ask them to slow down.",
    [O("ゆっくり話してください。", "Yukkuri hanashite kudasai.", "Please speak slowly.", kana="ゆっくりはなしてください。"), O("わかりました。", "Wakarimashita.", "Got it."), O("お水をください。", "O-mizu o kudasai.", "Water, please.", kana="おみずをください。")], kana="ここをまっすぐいって、ふたつめのかどをみぎにまがって、すぐひだりです。"),
  L("漢字で書きましょうか？", "Kanji de kakimashō ka?", "Shall I write it in kanji?", ["Shall I write it in kanji?", "Can you read this?", "Shall I call a taxi?"], "Ask for romaji instead.",
    [O("ローマ字でお願いします。", "Rōmaji de onegaishimasu.", "In romaji, please.", kana="ローマじでおねがいします。"), O("英語を話せますか。", "Eigo o hanasemasu ka.", "Can you speak English?", kana="えいごをはなせますか。"), O("助けてください。", "Tasukete kudasai.", "Please help me.", kana="たすけてください。")], kana="かんじでかきましょうか？"),
 ]})
