from _helpers import *
units = []
units.append({
 "id": "g-konbini", "track": "around", "title": "Convenience store & checkout", "jpTitle": "コンビニ",
 "summary": "The quick-fire questions every cashier asks, and how to answer them.",
 "phrases": [
  P("温めますか", "atatamemasu ka", "Shall I heat it up? (cashier asks)", "For bento, onigiri, and so on.", kana="あたためますか"),
  P("はい、お願いします", "hai, onegaishimasu", "Yes, please.", "Your all-purpose yes at the register.", kana="はい、おねがいします"),
  P("いいえ、大丈夫です", "iie, daijōbu desu", "No, I'm fine (no thanks).", "The polite no. 大丈夫です alone also works.", kana="いいえ、だいじょうぶです", grammar="大丈夫です (\"it's fine\") is the softest way to say no thanks."),
  P("お箸はご利用ですか", "o-hashi wa go-riyō desu ka", "Do you need chopsticks? (cashier asks)", kana="おはしはごりようですか"),
  P("袋はご利用ですか", "fukuro wa go-riyō desu ka", "Do you need a bag? (cashier asks)", "Bags cost a few yen.", kana="ふくろはごりようですか"),
  P("ポイントカードはお持ちですか", "pointo kādo wa o-mochi desu ka", "Do you have a points card? (cashier asks)", "Just say いいえ or ないです (nai desu).", kana="ポイントカードはおもちですか"),
  P("Suicaで払います", "Suika de haraimasu", "I'll pay with Suica.", "Suica / PASMO are rechargeable transit cards that work in most shops.", kana="スイカではらいます"),
  P("レシートは大丈夫です", "reshīto wa daijōbu desu", "I don't need the receipt.", kana="レシートはだいじょうぶです"),
  P("充電器はありますか", "jūdenki wa arimasu ka", "Do you have phone chargers?", "Swap in anything: 傘 (kasa, umbrella), 薬 (kusuri, medicine).", kana="じゅうでんきはありますか"),
  P("以上でよろしいですか", "ijō de yoroshii desu ka", "Will that be all? (cashier asks)", "Answer はい (hai).", kana="いじょうでよろしいですか"),
 ],
 "roleplay": {
  "title": "Late-night konbini run", "setting": "It's 11 p.m. You bring a bento and a drink to the register.",
  "lines": [
   T("Cashier", "いらっしゃいませ。お弁当温めますか？", "Irasshaimase. O-bentō atatamemasu ka?", "Welcome! Shall I heat up your bento?", kana="いらっしゃいませ。おべんとうあたためますか？", fast=True),
   Y("Say yes, please.", [
     O("はい、お願いします。", "Hai, onegaishimasu.", "Yes, please.", kana="はい、おねがいします。"),
     O("いただきます。", "Itadakimasu.", "(said before eating)"),
     O("いらっしゃいませ。", "Irasshaimase.", "Welcome!")]),
   T("Cashier", "お箸はご利用ですか？", "O-hashi wa go-riyō desu ka?", "Do you need chopsticks?", kana="おはしはごりようですか？", fast=True),
   Y("Say yes.", [
     O("はい、お願いします。", "Hai, onegaishimasu.", "Yes, please.", kana="はい、おねがいします。"),
     O("お箸です。", "O-hashi desu.", "They're chopsticks.", kana="おはしです。"),
     O("ごちそうさまでした。", "Gochisōsama deshita.", "Thank you for the meal.")]),
   T("Cashier", "ポイントカードはお持ちですか？", "Pointo kādo wa o-mochi desu ka?", "Do you have a points card?", kana="ポイントカードはおもちですか？", fast=True),
   Y("Say no thanks.", [
     O("いいえ、大丈夫です。", "Iie, daijōbu desu.", "No, I'm fine.", kana="いいえ、だいじょうぶです。"),
     O("はい、三千円です。", "Hai, sanzen en desu.", "Yes, 3,000 yen.", kana="はい、さんぜんえんです。"),
     O("もしもし。", "Moshimoshi.", "Hello? (phone)")]),
   T("Cashier", "六百八十円です。", "Roppyaku hachijū en desu.", "That's 680 yen.", kana="ろっぴゃくはちじゅうえんです。"),
   Y("Say you'll pay with Suica.", [
     O("Suicaで払います。", "Suika de haraimasu.", "I'll pay with Suica.", kana="スイカではらいます。"),
     O("持ち帰りでお願いします。", "Mochikaeri de onegaishimasu.", "To go, please.", kana="もちかえりでおねがいします。"),
     O("右です。", "Migi desu.", "It's on the right.", kana="みぎです。")]),
   T("Cashier", "ありがとうございました。", "Arigatō gozaimashita.", "Thank you very much!"),
  ]},
 "listening": [
  L("お弁当温めますか？", "O-bentō atatamemasu ka?", "Shall I heat up your bento?", ["Shall I heat up your bento?", "Do you need a bag?", "Is this a gift?"], "Say yes, please.",
    [O("はい、お願いします。", "Hai, onegaishimasu.", "Yes, please.", kana="はい、おねがいします。"), O("Suicaで払います。", "Suika de haraimasu.", "I'll pay with Suica.", kana="スイカではらいます。"), O("おやすみなさい。", "Oyasumi nasai.", "Good night.")], kana="おべんとうあたためますか？"),
  L("お箸はご利用ですか？", "O-hashi wa go-riyō desu ka?", "Do you need chopsticks?", ["Do you need chopsticks?", "Do you need a receipt?", "Do you need a straw?"], "Say no thanks.",
    [O("いいえ、大丈夫です。", "Iie, daijōbu desu.", "No, I'm fine.", kana="いいえ、だいじょうぶです。"), O("お箸をください。", "O-hashi o kudasai.", "Chopsticks, please.", kana="おはしをください。"), O("はじめまして。", "Hajimemashite.", "Nice to meet you.")], kana="おはしはごりようですか？"),
  L("ポイントカードはお持ちですか？", "Pointo kādo wa o-mochi desu ka?", "Do you have a points card?", ["Do you have a points card?", "Can you pay by card?", "Do you want a new card?"], "Say you don't have one.",
    [O("いいえ、ないです。", "Iie, nai desu.", "No, I don't."), O("はい、お願いします。", "Hai, onegaishimasu.", "Yes, please.", kana="はい、おねがいします。"), O("これにします。", "Kore ni shimasu.", "I'll take this one.")], kana="ポイントカードはおもちですか？"),
 ]})
