from _helpers import *
units = []
units.append({
 "id": "f-meet", "track": "family", "title": "Seeing them again", "jpTitle": "また会えて",
 "summary": "Warm hellos when you walk back into Shota's family home: catching up, offering help, light teasing — not a first meeting.",
 "phrases": [
  P("久しぶりです", "hisashiburi desu", "It's been a while!", "Warm and polite for his parents when you haven't seen them in a bit. Casual with siblings/peers: 久しぶり！", kana="ひさしぶりです"),
  P("また会えてうれしいです", "mata aete ureshii desu", "I'm so happy to see you again.", "Returning-visitor warmth. Skip はじめまして — you already know each other.", kana="またあえてうれしいです"),
  P("お邪魔します", "o-jama shimasu", "Thanks for having me (as you enter)", "Still the right door phrase even when you're a familiar guest. Soften with a smile.", kana="おじゃまします"),
  P("お元気でしたか", "o-genki deshita ka", "Have you been well?", "Natural catch-up after time apart. They may answer casually; you can stay in です/ます.", kana="おげんきでしたか"),
  P("はい、元気です。お父さんは？", "hai, genki desu. otōsan wa?", "Yes, I'm well. And Dad?", "Confirmed: お父さん / お母さん for his parents. Ending with は？ means \"and you / and him?\".", kana="はい、げんきです。おとうさんは？"),
  P("何かお手伝いしましょうか", "nanika o-tetsudai shimashō ka", "Can I help with anything?", "Offer this in the kitchen — they often say 大丈夫, but offering matters.", kana="なにかおてつだいしましょうか"),
  P("しょうた、また寝てるんですか", "Shōta, mata neteru n desu ka", "Is Shota still asleep again?", "Light teasing about Shota. Soften with a laugh; parents usually love it.", kana="しょうた、またねてるんですか"),
  P("アーバインとソウル出身です", "Ābain to Souru shusshin desu", "I'm from Irvine and Seoul.", "Confirmed hometowns. Optional native/Shota check: ソウルで生まれて、アーバインで育ちました (born in Seoul, grew up in Irvine) — not confirmed yet.", kana="アーバインとソウルしゅっしんです"),
  P("今日もよろしくお願いします", "kyō mo yoroshiku onegaishimasu", "Looking forward to today (with you again).", "A returning-visit closer — も (\"again / also\") marks that you're back.", kana="きょうもよろしくおねがいします"),
 ],
 "roleplay": {
  "title": "Back at Mom's door", "setting": "You and Shota arrive again at his parents' place. Mom opens the door — she already knows you well.",
  "lines": [
   T("Mom", "あら、リズちゃん！久しぶり！上がって上がって。", "Ara, Rizu-chan! Hisashiburi! Agatte agatte.", "Oh, Rizu-chan! It's been ages! Come on in.", kana="あら、リズちゃん！ひさしぶり！あがってあがって。", note="Family nickname: リズちゃん (Rizu-chan). Keep answering in polite です/ます."),
   Y("Greet her warmly as a returning guest.", [
     O("お母さん、久しぶりです！また会えてうれしいです。お邪魔します。", "Okāsan, hisashiburi desu! Mata aete ureshii desu. O-jama shimasu.", "Mom, it's been a while! So happy to see you again. Thanks for having me.", kana="おかあさん、ひさしぶりです！またあえてうれしいです。おじゃまします。"),
     O("はじめまして。リズです。", "Hajimemashite. Rizu desu.", "Nice to meet you. I'm Liz. (too formal — you already know her)"),
     O("いってきます。", "Ittekimasu.", "I'm heading out.")],
     note="No はじめまして here. Warm + お邪魔します is perfect."),
   T("Mom", "お元気だった？アーバインは暑かったでしょ。", "O-genki datta? Ābain wa atsukatta desho.", "Have you been well? Irvine must have been hot.", kana="おげんきだった？アーバインはあつかったでしょ。", note="Hometowns confirmed: Irvine + Seoul. She may also mention Seoul."),
   Y("Say you're well and ask about Dad.", [
     O("はい、元気です。お父さんは？", "Hai, genki desu. Otōsan wa?", "Yes, I'm well. And Dad?", kana="はい、げんきです。おとうさんは？"),
     O("いいえ、はじめまして。", "Iie, hajimemashite.", "No, nice to meet you."),
     O("グラフィックデザイナーをしています。", "Gurafikku dezainā o shite imasu.", "I work as a graphic designer.", kana="グラフィックデザイナーをしています。")]),
   T("Mom", "お父さんは元気だよ。…あれ、しょうたは？また寝てるの？", "Otōsan wa genki da yo. …Are, Shōta wa? Mata neteru no?", "Dad's fine. …Wait, where's Shota? Is he still asleep again?", kana="おとうさんはげんきだよ。…あれ、しょうたは？またねてるの？"),
   Y("Tease Shota lightly with her.", [
     O("しょうた、また寝てるんですか。しょうがないですね。", "Shōta, mata neteru n desu ka. Shō ga nai desu ne.", "Is Shota still asleep again? What can you do.", kana="しょうた、またねてるんですか。しょうがないですね。"),
     O("はじめまして。しょうたの母です。", "Hajimemashite. Shōta no haha desu.", "Nice to meet you. I'm Shota's mother.", kana="はじめまして。しょうたのははです。"),
     O("おやすみなさい。", "Oyasumi nasai.", "Good night.")],
     note="Join the teasing — it shows you're comfortable."),
   T("Mom", "今、キッチン手伝ってくれる？", "Ima, kitchin tetsudatte kureru?", "Can you help in the kitchen now?", kana="いま、キッチンてつだってくれる？"),
   Y("Offer to help.", [
     O("はい、何かお手伝いしましょうか。", "Hai, nanika o-tetsudai shimashō ka.", "Yes — can I help with anything?", kana="はい、なにかおてつだいしましょうか。"),
     O("いいえ、まだ勉強中です。", "Iie, mada benkyō-chū desu.", "No, I'm still learning.", kana="いいえ、まだべんきょうちゅうです。"),
     O("お土産です。", "O-miyage desu.", "This is a little gift.", kana="おみやげです。")]),
  ]},
 "listening": [
  L("あら、久しぶり！元気だった？", "Ara, hisashiburi! Genki datta?", "Oh, it's been a while! Have you been well?", ["It's been a while — have you been well?", "Nice to meet you for the first time.", "Are you leaving already?"], "Greet her back warmly.",
    [O("はい、久しぶりです！元気です。", "Hai, hisashiburi desu! Genki desu.", "Yes, it's been a while! I'm well.", kana="はい、ひさしぶりです！げんきです。"), O("はじめまして。", "Hajimemashite.", "Nice to meet you."), O("いってきます。", "Ittekimasu.", "I'm heading out.")], kana="あら、ひさしぶり！げんきだった？"),
  L("何か手伝おうか？", "Nanika tetsudaō ka?", "Want me to help with something?", ["Want me to help?", "Are you hungry?", "Shall we leave?"], "Offer to help instead.",
    [O("私こそ、何かお手伝いしましょうか。", "Watashi koso, nanika o-tetsudai shimashō ka.", "Actually, can I help with anything?", kana="わたしこそ、なにかおてつだいしましょうか。"), O("おやすみなさい。", "Oyasumi nasai.", "Good night."), O("二人です。", "Futari desu.", "Two people.", kana="ふたりです。")], kana="なにかてつだおうか？"),
  L("しょうた、また遅刻だよ。", "Shōta, mata chikoku da yo.", "Shota's late again.", ["Shota's late again.", "Shota cooked dinner.", "Shota already left."], "React with a light tease.",
    [O("しょうがないですね。", "Shō ga nai desu ne.", "What can you do.", kana="しょうがないですね。"), O("はじめまして。", "Hajimemashite.", "Nice to meet you."), O("いただきます。", "Itadakimasu.", "(said before eating)")], kana="しょうた、またちこくだよ。"),
 ]})
