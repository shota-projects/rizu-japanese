from _helpers import *
units = []
units.append({
 "id": "g-shopping", "track": "around", "title": "Shopping & prices", "jpTitle": "かいもの",
 "summary": "Browsing, asking prices, understanding numbers, trying things on, paying.",
 "phrases": [
  P("いらっしゃいませ", "irasshaimase", "Welcome! (staff says)", "You'll hear it the moment you walk in. No need to reply; a smile or small nod is perfect."),
  P("見ているだけです", "mite iru dake desu", "I'm just looking.", "In casual speech it shortens to 見てるだけです (miteru dake desu).", kana="みているだけです"),
  P("これはいくらですか", "kore wa ikura desu ka", "How much is this?", "Point at the item. Prices are usually shown, but this is handy at markets."),
  P("百円", "hyaku en", "100 yen", "円 (en) = yen. Japanese counts in units of 10,000 (万, man), so 10,000 yen is 一万円 (ichiman en).", kana="ひゃくえん"),
  P("五百円", "gohyaku en", "500 yen", "Watch the sound changes: 300 is さんびゃく (sanbyaku), 600 is ろっぴゃく (roppyaku).", kana="ごひゃくえん"),
  P("千円", "sen en", "1,000 yen", "The most common banknote.", kana="せんえん"),
  P("三千円", "sanzen en", "3,000 yen", "3,000 softens to さんぜん (sanzen), and 8,000 is はっせん (hassen).", kana="さんぜんえん"),
  P("試着してもいいですか", "shichaku shite mo ii desu ka", "May I try it on?", kana="しちゃくしてもいいですか", grammar="〜てもいいですか = May I…? A very useful pattern."),
  P("これにします", "kore ni shimasu", "I'll take this one.", "Literally \"I'll go with this\". Also works when choosing from a menu."),
  P("カードで払えますか", "kādo de haraemasu ka", "Can I pay by card?", "Most shops take cards, but small restaurants and shrines may be cash only.", kana="カードではらえますか"),
  P("袋は大丈夫です", "fukuro wa daijōbu desu", "I don't need a bag.", "Bags usually cost a few yen now, so cashiers will ask.", kana="ふくろはだいじょうぶです"),
 ],
 "roleplay": {
  "title": "Buying a scarf", "setting": "You spot a lovely scarf in a small boutique.",
  "lines": [
   T("Staff", "いらっしゃいませ。", "Irasshaimase.", "Welcome!"),
   Y("Ask how much the scarf is.", [
     O("すみません、これはいくらですか。", "Sumimasen, kore wa ikura desu ka.", "Excuse me, how much is this?"),
     O("これをください。", "Kore o kudasai.", "This one, please."),
     O("どこですか。", "Doko desu ka.", "Where is it?")]),
   T("Staff", "三千円です。", "Sanzen en desu.", "It's 3,000 yen.", kana="さんぜんえんです。"),
   Y("Ask if you can try it on.", [
     O("試着してもいいですか。", "Shichaku shite mo ii desu ka.", "May I try it on?", kana="しちゃくしてもいいですか。"),
     O("袋は大丈夫です。", "Fukuro wa daijōbu desu.", "I don't need a bag.", kana="ふくろはだいじょうぶです。"),
     O("三千円です。", "Sanzen en desu.", "It's 3,000 yen.", kana="さんぜんえんです。")]),
   T("Staff", "はい、どうぞ。", "Hai, dōzo.", "Sure, go ahead."),
   Y("You love it. Say you'll take it.", [
     O("これにします。カードで払えますか。", "Kore ni shimasu. Kādo de haraemasu ka.", "I'll take it. Can I pay by card?", kana="これにします。カードではらえますか。"),
     O("見ているだけです。", "Mite iru dake desu.", "I'm just looking.", kana="みているだけです。"),
     O("お邪魔しました。", "O-jama shimashita.", "Thanks for having me.", kana="おじゃましました。")]),
   T("Staff", "はい、大丈夫です。袋はご利用ですか？", "Hai, daijōbu desu. Fukuro wa go-riyō desu ka?", "Yes, that's fine. Would you like a bag?", kana="はい、だいじょうぶです。ふくろはごりようですか？", fast=True),
   Y("Say you don't need one.", [
     O("袋は大丈夫です。", "Fukuro wa daijōbu desu.", "I don't need a bag.", kana="ふくろはだいじょうぶです。"),
     O("はい、千円です。", "Hai, sen en desu.", "Yes, 1,000 yen.", kana="はい、せんえんです。"),
     O("もう一度お願いします。", "Mō ichido onegaishimasu.", "One more time, please.", kana="もういちどおねがいします。")]),
  ]},
 "listening": [
  L("千五百円です。", "Sen gohyaku en desu.", "That's 1,500 yen.", ["1,500 yen", "5,000 yen", "150 yen"], "Say you'll pay by card.",
    [O("カードで払えますか。", "Kādo de haraemasu ka.", "Can I pay by card?", kana="カードではらえますか。"), O("試着してもいいですか。", "Shichaku shite mo ii desu ka.", "May I try it on?", kana="しちゃくしてもいいですか。"), O("ただいま。", "Tadaima.", "I'm home.")], kana="せんごひゃくえんです。"),
  L("試着室はあちらです。", "Shichakushitsu wa achira desu.", "The fitting room is over there.", ["The fitting room is over there.", "The register is over here.", "That's sold out."], "Thank them.",
    [O("ありがとうございます。", "Arigatō gozaimasu.", "Thank you."), O("袋は大丈夫です。", "Fukuro wa daijōbu desu.", "I don't need a bag.", kana="ふくろはだいじょうぶです。"), O("二人です。", "Futari desu.", "Two people.", kana="ふたりです。")], kana="しちゃくしつはあちらです。"),
  L("他の色もありますよ。", "Hoka no iro mo arimasu yo.", "We have other colors too.", ["We have other colors too.", "That's the last one.", "It's on sale today."], "Say you'll take this one.",
    [O("これにします。", "Kore ni shimasu.", "I'll take this one."), O("おかえりなさい。", "Okaeri nasai.", "Welcome back."), O("駅はどこですか。", "Eki wa doko desu ka.", "Where is the station?", kana="えきはどこですか。")], kana="ほかのいろもありますよ。"),
 ]})
