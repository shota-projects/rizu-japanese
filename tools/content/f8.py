from _helpers import *
units = []
units.append({
 "id": "f-holiday", "track": "family", "title": "New Year & holidays", "jpTitle": "お正月",
 "summary": "A warm visit over New Year or another family holiday: the greeting, a small gift, osechi and mochi, and a real thank-you. You already know them.",
 "phrases": [
  P("あけましておめでとう", "akemashite omedetō", "Happy New Year", "How you greet お父さん and お母さん on New Year's day. Familiar, not a speech.", kana="あけましておめでとう", speaker="Rizu"),
  P("今年もよろしくお願いします", "kotoshi mo yoroshiku onegaishimasu", "Let's have another good year together", "Say it right after the New Year greeting. They may answer 今年もよろしく.", kana="ことしもよろしくおねがいします", speaker="Rizu"),
  P("これ、よかったらどうぞ", "kore, yokattara dōzo", "This is a little something, if you'd like", "Hand the gift over as you say it. No big presentation.", kana="これ、よかったらどうぞ", speaker="Rizu"),
  P("おせち、一緒に食べましょう", "osechi, issho ni tabemashō", "Let's eat the osechi together", "Osechi is the New Year meal in the stacked boxes. Offering to share is the warm move.", kana="おせち、いっしょにたべましょう", speaker="Rizu"),
  P("お餅、おいしいですね", "o-mochi, oishii desu ne", "The mochi is really good", "Say it while you eat. If it's in soup, that's お雑煮.", kana="おもち、おいしいですね", speaker="Rizu"),
  P("今日は呼んでくれて、ありがとうございます", "kyō wa yonde kurete, arigatō gozaimasu", "Thank you for having me today", "A real thank-you for the visit, once you're comfortable, not at the door.", kana="きょうはよんでくれて、ありがとうございます", speaker="Rizu"),
  P("お父さんもお母さんも、元気でいてくださいね", "otōsan mo okāsan mo, genki de ite kudasai ne", "Dad, Mom, please stay well", "You call them お父さん and お母さん. A soft wish, not a formal speech.", kana="おとうさんもおかあさんも、げんきでいてくださいね", speaker="Rizu"),
  P("また来年も来ますね", "mata rainen mo kimasu ne", "I'll come again next year too", "ね invites them to agree. Smile when you say it.", kana="またらいねんもきますね", speaker="Rizu"),
  P("いいお年を", "ii otoshi o", "Have a good rest of the year", "For December, before New Year. On the day itself, switch to あけましておめでとう.", kana="いいおとしを", speaker="Rizu"),
  P("お祝い、おめでとうございます", "o-iwai, omedetō gozaimasu", "Congratulations", "Birthdays and other family holidays. Warm, not stiff.", kana="おいわい、おめでとうございます", speaker="Rizu"),
 ],
 "roleplay": {
  "title": "New Year at their door",
  "setting": "You and Shota arrive for New Year. Mom opens the door. Dad is right behind her. They already know you.",
  "lines": [
   T("Mom", "リズちゃん、あけましておめでとう。", "Rizu-chan, akemashite omedetō.", "Eliz, happy New Year.", kana="リズちゃん、あけましておめでとう。"),
   Y("Greet Mom and wish her a good year.", [
     O("お母さん、あけましておめでとう。今年もよろしくお願いします。", "Okāsan, akemashite omedetō. Kotoshi mo yoroshiku onegaishimasu.", "Mom, happy New Year. Let's have another good year.", kana="おかあさん、あけましておめでとう。ことしもよろしくおねがいします。"),
     O("はじめまして。リズです。", "Hajimemashite. Rizu desu.", "Nice to meet you. I'm Liz."),
     O("いってきます。", "Ittekimasu.", "I'm heading out.")]),
   T("Dad", "おう、来てくれたね。寒いだろ。", "Ō, kite kureta ne. Samui daro.", "Oh, you came. It's cold, huh?", kana="おう、きてくれたね。さむいだろ。"),
   Y("Greet Dad and offer the gift.", [
     O("お父さん、これ、よかったらどうぞ。", "Otōsan, kore, yokattara dōzo.", "Dad, this is a little something, if you'd like.", kana="おとうさん、これ、よかったらどうぞ。"),
     O("駅はどこですか。", "Eki wa doko desu ka.", "Where is the station?", kana="えきはどこですか。"),
     O("お会計お願いします。", "O-kaikei onegaishimasu.", "Check, please.", kana="おかいけいおねがいします。")]),
   T("Mom", "おせち、用意してあるよ。一緒に食べよう。", "Osechi, yōi shite aru yo. Issho ni tabeyō.", "The osechi is ready. Let's eat it together.", kana="おせち、よういしてあるよ。いっしょにたべよう。"),
   Y("Say you'll eat together, and that the mochi looks good.", [
     O("おせち、一緒に食べましょう。お餅もおいしそうですね。", "Osechi, issho ni tabemashō. O-mochi mo oishisō desu ne.", "Let's eat the osechi together. The mochi looks good too.", kana="おせち、いっしょにたべましょう。おもちもおいしそうですね。"),
     O("もう結構です。", "Mō kekkō desu.", "I'm fine, thanks.", kana="もうけっこうです。"),
     O("さようなら。", "Sayōnara.", "Goodbye.")]),
   T("Dad", "また来年も来いよ。", "Mata rainen mo koi yo.", "Come again next year too.", kana="またらいねんもこいよ。"),
   Y("Say you'll come, and thank them for having you.", [
     O("はい、また来年も来ますね。今日は呼んでくれて、ありがとうございます。", "Hai, mata rainen mo kimasu ne. Kyō wa yonde kurete, arigatō gozaimasu.", "Yes, I'll come again next year. Thank you for having me today.", kana="はい、またらいねんもきますね。きょうはよんでくれて、ありがとうございます。"),
     O("はじめまして。", "Hajimemashite.", "Nice to meet you."),
     O("助けてください。", "Tasukete kudasai.", "Please help me.", kana="たすけてください。")]),
  ]},
 "listening": [
  L("あけましておめでとう。今年もよろしくね。", "Akemashite omedetō. Kotoshi mo yoroshiku ne.", "Happy New Year. Let's have another good year.", ["Happy New Year — another good year together.", "Nice to meet you for the first time.", "Good night, see you tomorrow."], "Greet her back.",
    [O("お母さん、あけましておめでとう。今年もよろしくお願いします。", "Okāsan, akemashite omedetō. Kotoshi mo yoroshiku onegaishimasu.", "Mom, happy New Year. Let's have another good year.", kana="おかあさん、あけましておめでとう。ことしもよろしくおねがいします。"), O("いらっしゃいませ。", "Irasshaimase.", "Welcome. (shop greeting)"), O("これにします。", "Kore ni shimasu.", "I'll take this one.")],
    kana="あけましておめでとう。ことしもよろしくね。", speaker="Mom"),
  L("おせち、食べな。", "Osechi, tabena.", "Have some osechi.", ["Have some osechi.", "The train is here.", "Please speak more slowly."], "Say you'll eat together.",
    [O("はい、一緒に食べましょう。", "Hai, issho ni tabemashō.", "Yes, let's eat together.", kana="はい、いっしょにたべましょう。"), O("左です。", "Hidari desu.", "It's on the left.", kana="ひだりです。"), O("お水をください。", "O-mizu o kudasai.", "Water, please.", kana="おみずをください。")],
    kana="おせち、たべな。", speaker="Dad"),
  L("これ、おみやげ？いいの？", "Kore, o-miyage? Ii no?", "Is this a gift? You didn't have to.", ["Is this a gift? You didn't have to.", "Is this the station?", "Are you leaving already?"], "Offer it simply.",
    [O("これ、よかったらどうぞ。", "Kore, yokattara dōzo.", "This is a little something, if you'd like.", kana="これ、よかったらどうぞ。"), O("駅です。", "Eki desu.", "It's a station.", kana="えきです。"), O("いってきます。", "Ittekimasu.", "I'm heading out.")],
    kana="これ、おみやげ？いいの？", speaker="Mom"),
 ]})
