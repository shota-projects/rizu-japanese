from _helpers import *
units = []
units.append({
 "id": "g-food", "track": "around", "title": "Restaurants & cafés", "jpTitle": "レストラン・カフェ",
 "summary": "Getting a table, ordering, eating in or taking out, paying.",
 "phrases": [
  P("何名様ですか", "nan-mei sama desu ka", "How many people? (staff asks)", "You'll hear this at the door. Holding up fingers works too.", kana="なんめいさまですか"),
  P("二人です", "futari desu", "Two people.", "One person is 一人 (hitori). Three is 三人 (san-nin).", kana="ふたりです"),
  P("メニューをお願いします", "menyū o onegaishimasu", "The menu, please.", kana="メニューをおねがいします", grammar="[thing] をお願いします = [thing], please. Works almost everywhere."),
  P("おすすめは何ですか", "osusume wa nan desu ka", "What do you recommend?", kana="おすすめはなんですか"),
  P("これをください", "kore o kudasai", "This one, please.", "Point at the menu. Perfect when you can't read it."),
  P("コーヒーを一つお願いします", "kōhī o hitotsu onegaishimasu", "One coffee, please.", "Counting: 一つ (hitotsu) one, 二つ (futatsu) two, 三つ (mittsu) three.", kana="コーヒーをひとつおねがいします"),
  P("お水をください", "o-mizu o kudasai", "Water, please.", "Water is usually free and refilled.", kana="おみずをください"),
  P("店内でお召し上がりですか", "tennai de o-meshiagari desu ka", "For here? (staff asks)", "Very formal staff speech. Recognize it; you don't need to say it.", kana="てんないでおめしあがりですか"),
  P("持ち帰りでお願いします", "mochikaeri de onegaishimasu", "To go, please.", "For here is 店内で (tennai de).", kana="もちかえりでおねがいします"),
  P("お会計お願いします", "o-kaikei onegaishimasu", "The check, please.", "At most places you pay at the register by the door, not at the table.", kana="おかいけいおねがいします"),
 ],
 "roleplay": {
  "title": "Coffee for two", "setting": "You and Shota walk into a café in Tokyo.",
  "lines": [
   T("Staff", "いらっしゃいませ。何名様ですか？", "Irasshaimase. Nan-mei sama desu ka?", "Welcome! How many people?", kana="いらっしゃいませ。なんめいさまですか？"),
   Y("Say two people.", [
     O("二人です。", "Futari desu.", "Two people.", kana="ふたりです。"),
     O("一つです。", "Hitotsu desu.", "One (thing).", kana="ひとつです。"),
     O("お会計お願いします。", "O-kaikei onegaishimasu.", "Check, please.", kana="おかいけいおねがいします。")],
     note="People are counted with 人 (nin): 一人, 二人. Things use つ."),
   T("Staff", "ご注文はお決まりですか？", "Go-chūmon wa o-kimari desu ka?", "Are you ready to order?", kana="ごちゅうもんはおきまりですか？"),
   Y("Order one coffee.", [
     O("コーヒーを一つお願いします。", "Kōhī o hitotsu onegaishimasu.", "One coffee, please.", kana="コーヒーをひとつおねがいします。"),
     O("お水です。", "O-mizu desu.", "It's water.", kana="おみずです。"),
     O("見ているだけです。", "Mite iru dake desu.", "I'm just looking.", kana="みているだけです。")]),
   T("Staff", "店内でお召し上がりですか？", "Tennai de o-meshiagari desu ka?", "For here?", kana="てんないでおめしあがりですか？", fast=True),
   Y("Say it's to go.", [
     O("いいえ、持ち帰りでお願いします。", "Iie, mochikaeri de onegaishimasu.", "No, to go, please.", kana="いいえ、もちかえりでおねがいします。"),
     O("はい、二人です。", "Hai, futari desu.", "Yes, two people.", kana="はい、ふたりです。"),
     O("いただきます。", "Itadakimasu.", "(said before eating)")]),
   T("Staff", "四百五十円です。", "Yonhyaku gojū en desu.", "That's 450 yen.", kana="よんひゃくごじゅうえんです。"),
   Y("Thank them.", [
     O("ありがとうございます。", "Arigatō gozaimasu.", "Thank you."),
     O("おやすみなさい。", "Oyasumi nasai.", "Good night."),
     O("ただいま。", "Tadaima.", "I'm home.")]),
  ]},
 "listening": [
  L("店内でお召し上がりですか？", "Tennai de o-meshiagari desu ka?", "For here?", ["Will you eat here?", "Is this your first time?", "Do you have a reservation?"], "Say to go.",
    [O("持ち帰りでお願いします。", "Mochikaeri de onegaishimasu.", "To go, please.", kana="もちかえりでおねがいします。"), O("二人です。", "Futari desu.", "Two people.", kana="ふたりです。"), O("お水をください。", "O-mizu o kudasai.", "Water, please.", kana="おみずをください。")], kana="てんないでおめしあがりですか？"),
  L("ご注文はお決まりですか？", "Go-chūmon wa o-kimari desu ka?", "Are you ready to order?", ["Are you ready to order?", "Is everything OK?", "Would you like the check?"], "Ask what they recommend.",
    [O("おすすめは何ですか。", "Osusume wa nan desu ka.", "What do you recommend?", kana="おすすめはなんですか。"), O("持ち帰りです。", "Mochikaeri desu.", "To go."), O("ごちそうさまでした。", "Gochisōsama deshita.", "Thank you for the meal.")], kana="ごちゅうもんはおきまりですか？"),
  L("お飲み物はいかがですか？", "O-nomimono wa ikaga desu ka?", "Would you like something to drink?", ["Would you like a drink?", "How was the food?", "Would you like dessert?"], "Order a coffee.",
    [O("コーヒーを一つお願いします。", "Kōhī o hitotsu onegaishimasu.", "One coffee, please.", kana="コーヒーをひとつおねがいします。"), O("もうおなかいっぱいです。", "Mō onaka ippai desu.", "I'm already full."), O("右です。", "Migi desu.", "It's on the right.", kana="みぎです。")], kana="おのみものはいかがですか？"),
 ]})
