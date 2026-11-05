from _helpers import *
units = []
units.append({
 "id": "f-calls", "track": "family", "title": "Phone & video calls", "jpTitle": "でんわ",
 "summary": "Video calls with family who already know your voice: hellos, glitches, handing off to Shota.",
 "phrases": [
  P("もしもし", "moshimoshi", "Hello? (phone only)", "Only on the phone or a video call, never in person."),
  P("もしもし、リズです", "moshimoshi, Rizu desu", "Hello, it's Liz.", "Say your name right away so they know who it is."),
  P("聞こえますか", "kikoemasu ka", "Can you hear me?", kana="きこえますか"),
  P("よく聞こえません", "yoku kikoemasen", "I can't hear you well.", kana="よくきこえません"),
  P("画面が固まっています", "gamen ga katamatte imasu", "The screen is frozen.", "For video-call glitches.", kana="がめんがかたまっています"),
  P("お元気でしたか", "o-genki deshita ka", "Have you been well?", "Natural when you haven't talked in a while.", kana="おげんきでしたか"),
  P("しょうたさんに代わります", "Shōta-san ni kawarimasu", "I'll put Shota on.", "代わる (kawaru) = to switch, take over.", kana="しょうたさんにかわります"),
  P("お体に気をつけてください", "o-karada ni ki o tsukete kudasai", "Please take care of yourself.", "A caring goodbye, especially to grandparents.", kana="おからだにきをつけてください"),
  P("では、また", "dewa, mata", "Well, talk soon.", "A polite way to wrap up. Casual: じゃあね (jā ne)."),
 ],
 "roleplay": {
  "title": "Video call with grandma", "setting": "Shota's grandmother video-calls. Shota is in the next room.",
  "lines": [
   T("Grandma", "もしもし？", "Moshimoshi?", "Hello?"),
   Y("Answer and say who you are.", [
     O("もしもし、リズです。", "Moshimoshi, Rizu desu.", "Hello, it's Liz."),
     O("いらっしゃいませ。", "Irasshaimase.", "Welcome! (shop greeting)"),
     O("お邪魔します。", "O-jama shimasu.", "(said entering a home)", kana="おじゃまします。")]),
   T("Grandma", "あら、リズちゃん。お元気でしたか？", "Ara, Rizu-chan. O-genki deshita ka?", "Oh, Eliz! Have you been well?", kana="あら、リズちゃん。おげんきでしたか？"),
   Y("Say you're well and ask her back.", [
     O("はい、元気です。おばあさんは？", "Hai, genki desu. Obāsan wa?", "Yes, I'm well. And you?", kana="はい、げんきです。おばあさんは？"),
     O("いいえ、聞こえません。", "Iie, kikoemasen.", "No, I can't hear.", kana="いいえ、きこえません。"),
     O("ごちそうさまでした。", "Gochisōsama deshita.", "Thank you for the meal.")],
     note="Ending with は？ (wa?) is a quick way to say \"and you?\"."),
   T("Grandma", "元気ですよ。…あれ？聞こえる？", "Genki desu yo. …Are? Kikoeru?", "I'm fine. …Huh? Can you hear me?", kana="げんきですよ。…あれ？きこえる？"),
   Y("Say the screen is frozen.", [
     O("すみません、画面が固まっています。", "Sumimasen, gamen ga katamatte imasu.", "Sorry, the screen is frozen.", kana="すみません、がめんがかたまっています。"),
     O("では、また。", "Dewa, mata.", "Well, talk soon."),
     O("ぜひ。", "Zehi.", "I'd love to!")]),
   T("Grandma", "しょうたはいる？", "Shōta wa iru?", "Is Shota there?"),
   Y("Say you'll put him on.", [
     O("はい、しょうたさんに代わります。", "Hai, Shōta-san ni kawarimasu.", "Yes, I'll put Shota on.", kana="はい、しょうたさんにかわります。"),
     O("いいえ、まだ勉強中です。", "Iie, mada benkyō-chū desu.", "No, I'm still learning.", kana="いいえ、まだべんきょうちゅうです。"),
     O("いってらっしゃい。", "Itterasshai.", "Have a good day.")]),
   T("Grandma", "ありがとう。またね。", "Arigatō. Mata ne.", "Thanks. Talk soon."),
   Y("Say a caring goodbye.", [
     O("お体に気をつけてください。では、また。", "O-karada ni ki o tsukete kudasai. Dewa, mata.", "Please take care of yourself. Talk soon.", kana="おからだにきをつけてください。では、また。"),
     O("もしもし。", "Moshimoshi.", "Hello?"),
     O("いただきます。", "Itadakimasu.", "(said before eating)")]),
  ]},
 "listening": [
  L("もしもし、聞こえますか？", "Moshimoshi, kikoemasu ka?", "Hello, can you hear me?", ["Hello, can you hear me?", "Hello, where are you?", "Hello, who is this?"], "Say you can't hear well.",
    [O("すみません、よく聞こえません。", "Sumimasen, yoku kikoemasen.", "Sorry, I can't hear you well.", kana="すみません、よくきこえません。"), O("お土産です。", "O-miyage desu.", "This is a little gift.", kana="おみやげです。"), O("二人です。", "Futari desu.", "Two people.", kana="ふたりです。")], kana="もしもし、きこえますか？"),
  L("声が小さいです。", "Koe ga chiisai desu.", "Your voice is quiet.", ["Your voice is too quiet.", "The screen is small.", "You're speaking too fast."], "Tell her you'll say it again.",
    [O("もう一度言いますね。", "Mō ichido iimasu ne.", "I'll say it again.", kana="もういちどいいますね。"), O("おやすみなさい。", "Oyasumi nasai.", "Good night."), O("これにします。", "Kore ni shimasu.", "I'll take this one.")], kana="こえがちいさいです。"),
  L("しょうたに代わってくれる？", "Shōta ni kawatte kureru?", "Could you put Shota on?", ["Could you put Shota on?", "Is Shota coming?", "Did Shota call?"], "Say yes.",
    [O("はい、しょうたさんに代わります。", "Hai, Shōta-san ni kawarimasu.", "Yes, I'll put Shota on.", kana="はい、しょうたさんにかわります。"), O("いいえ、元気です。", "Iie, genki desu.", "No, I'm well.", kana="いいえ、げんきです。"), O("お会計お願いします。", "O-kaikei onegaishimasu.", "Check, please.", kana="おかいけいおねがいします。")], kana="しょうたにかわってくれる？"),
 ]})
