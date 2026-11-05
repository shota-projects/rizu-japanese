from _helpers import *
units = []
units.append({
 "id": "f-dinner", "track": "family", "title": "At the dinner table", "jpTitle": "ごはんのじかん",
 "summary": "Kitchen-table talk with family who already know your tastes: compliments, seconds, gentle likes/dislikes.",
 "phrases": [
  P("とてもおいしいです", "totemo oishii desu", "It's really delicious.", "Say it early and say it often."),
  P("これは何ですか", "kore wa nan desu ka", "What is this?", "Asking about a dish shows interest. Families love explaining their food.", kana="これはなんですか"),
  P("お母さんの料理、大好きです", "okāsan no ryōri, daisuki desu", "I love your cooking (said to his mom).", "Here お母さん means Shota's mom, so you can say it straight to her.", kana="おかあさんのりょうり、だいすきです"),
  P("もう少しいかがですか", "mō sukoshi ikaga desu ka", "Would you like a little more? (host offers)", "You'll also hear the casual おかわりは？ (okawari wa?, \"seconds?\").", kana="もうすこしいかがですか"),
  P("はい、いただきます", "hai, itadakimasu", "Yes, I'd love some.", "いただきます also means \"I'll gratefully accept\"."),
  P("少しだけお願いします", "sukoshi dake onegaishimasu", "Just a little, please.", "A graceful middle ground.", kana="すこしだけおねがいします"),
  P("もうおなかいっぱいです", "mō onaka ippai desu", "I'm already full.", "Soften it: ありがとうございます。でも、もうおなかいっぱいです。"),
  P("お魚が好きです", "o-sakana ga suki desu", "I like fish.", "Swap in what you like: お肉 (o-niku, meat), 野菜 (yasai, vegetables).", kana="おさかながすきです", grammar="好き takes が, not を: [thing] が好きです."),
  P("辛いものはちょっと苦手です", "karai mono wa chotto nigate desu", "I'm not great with spicy food.", "ちょっと苦手 is the gentle way to say you don't like something. Avoid 嫌い (kirai, \"hate\") at the table.", kana="からいものはちょっとにがてです", grammar="ちょっと (a little) softens almost anything."),
  P("作り方を教えてください", "tsukurikata o oshiete kudasai", "Please teach me how to make it.", "One of the nicest compliments you can give a cook.", kana="つくりかたをおしえてください"),
 ],
 "roleplay": {
  "title": "Dinner with Shota's mom", "setting": "Back at Mom's table — she's made a big home-cooked dinner again.",
  "lines": [
   T("Mom", "たくさん食べてね。", "Takusan tabete ne.", "Eat lots, OK?", kana="たくさんたべてね。", note="Mom speaks casually to you because she's older and you're like family. You still answer politely."),
   Y("Before eating…", [
     O("ありがとうございます。いただきます。", "Arigatō gozaimasu. Itadakimasu.", "Thank you. (said before eating)"),
     O("ごちそうさまでした。", "Gochisōsama deshita.", "Thank you for the meal (after)."),
     O("もうおなかいっぱいです。", "Mō onaka ippai desu.", "I'm already full.")]),
   T("Mom", "どう？お口に合う？", "Dō? O-kuchi ni au?", "How is it? Do you like it?", kana="どう？おくちにあう？", note="お口に合う literally means \"does it suit your mouth?\""),
   Y("Tell her it's delicious.", [
     O("はい、とてもおいしいです！", "Hai, totemo oishii desu!", "Yes, it's really delicious!"),
     O("これは何ですか。", "Kore wa nan desu ka.", "What is this?", kana="これはなんですか。"),
     O("はい、苦手です。", "Hai, nigate desu.", "Yes, I don't like it.", kana="はい、にがてです。")]),
   T("Mom", "もう少しいかがですか？", "Mō sukoshi ikaga desu ka?", "Would you like a little more?", kana="もうすこしいかがですか？"),
   Y("You're full. Decline kindly.", [
     O("ありがとうございます。でも、もうおなかいっぱいです。", "Arigatō gozaimasu. Demo, mō onaka ippai desu.", "Thank you, but I'm already full."),
     O("いいえ、嫌いです。", "Iie, kirai desu.", "No, I hate it.", kana="いいえ、きらいです。"),
     O("はい、いただきます。", "Hai, itadakimasu.", "Yes, I'd love some.")]),
   T("Mom", "あら、そう？じゃあ、デザートは別腹ね。", "Ara, sō? Jā, dezāto wa betsubara ne.", "Oh really? Well, dessert goes in a separate stomach!", kana="あら、そう？じゃあ、デザートはべつばらね。", note="別腹 (betsubara), \"separate stomach\", is a favorite joke about always having room for dessert."),
   Y("Thank her for the meal.", [
     O("ごちそうさまでした。", "Gochisōsama deshita.", "Thank you for the meal."),
     O("いただきます。", "Itadakimasu.", "(said before eating)"),
     O("お邪魔します。", "O-jama shimasu.", "(said entering a home)", kana="おじゃまします。")]),
  ]},
 "listening": [
  L("お口に合いますか？", "O-kuchi ni aimasu ka?", "Is it to your taste?", ["Do you like the taste?", "Is your mouth OK?", "Is it too hot?"], "Tell her you like it.",
    [O("はい、とてもおいしいです。", "Hai, totemo oishii desu.", "Yes, it's really delicious."), O("いいえ、苦手です。", "Iie, nigate desu.", "No, I don't like it.", kana="いいえ、にがてです。"), O("お邪魔します。", "O-jama shimasu.", "(said entering a home)", kana="おじゃまします。")], kana="おくちにあいますか？"),
  L("おかわりは？", "Okawari wa?", "Seconds?", ["Would you like seconds?", "Where's the bathroom?", "Did you cook this?"], "Accept a little more.",
    [O("少しだけお願いします。", "Sukoshi dake onegaishimasu.", "Just a little, please.", kana="すこしだけおねがいします。"), O("おかえりなさい。", "Okaeri nasai.", "Welcome back."), O("これは何ですか。", "Kore wa nan desu ka.", "What is this?", kana="これはなんですか。")]),
  L("苦手なものはありますか？", "Nigate na mono wa arimasu ka?", "Is there anything you don't eat?", ["Is there anything you don't like to eat?", "What's your favorite food?", "Are you good at cooking?"], "Answer gently.",
    [O("辛いものはちょっと苦手です。", "Karai mono wa chotto nigate desu.", "I'm not great with spicy food.", kana="からいものはちょっとにがてです。"), O("とてもおいしいです。", "Totemo oishii desu.", "It's really delicious."), O("いってらっしゃい。", "Itterasshai.", "Have a good day.")], kana="にがてなものはありますか？"),
 ]})
