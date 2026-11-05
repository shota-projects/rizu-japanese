from _helpers import *
units = []
units.append({
 "id": "f-family", "track": "family", "title": "Family words", "jpTitle": "かぞく",
 "summary": "Talking about family you already know: お父さん / お母さん for his, 父 / 母 for yours, and your younger brother.",
 "phrases": [
  P("お父さん", "otōsan", "(his / your) father; Dad", "Confirmed: call his dad お父さん. Japanese lifts up other people's family (お〜さん) and stays modest about your own (父, 母).", kana="おとうさん", grammar="Honorific お〜さん for his parents; modest 父 / 母 for yours."),
  P("お母さん", "okāsan", "(his / your) mother; Mom", "Confirmed: call his mom お母さん face to face.", kana="おかあさん"),
  P("父", "chichi", "my father (when talking to others)", "The modest word for your own dad. Use it when telling his family about your dad: 父は… (chichi wa…).", kana="ちち"),
  P("母", "haha", "my mother (when talking to others)", "Your own mom, to others. Even Shota's mom calls herself しょうたの母.", kana="はは"),
  P("おじいさん", "ojiisan", "grandfather", "Families often say the warmer おじいちゃん (ojiichan). It's fine to use it if they do."),
  P("おばあさん", "obāsan", "grandmother", "Likewise おばあちゃん (obāchan). Careful: おばさん (obasan, short 'a') means aunt."),
  P("ご両親はお元気ですか", "go-ryōshin wa o-genki desu ka", "How are your parents?", "You'll hear this about your own parents. ご両親 is the polite word for someone else's parents.", kana="ごりょうしんはおげんきですか"),
  P("父も母も元気です", "chichi mo haha mo genki desu", "My dad and mom are both well.", "Answer with 父 and 母, the modest words for your own parents.", kana="ちちもははもげんきです", grammar="A も B も = both A and B."),
  P("弟が一人います", "otōto ga hitori imasu", "I have one younger brother.", "Confirmed. Modest 弟 for your own younger brother. They may ask 弟さんは元気？", kana="おとうとがひとりいます"),
  P("この方はどなたですか", "kono kata wa donata desu ka", "Who is this person?", "Perfect for the family photo album. Polite 方 (kata) + どなた.", kana="このかたはどなたですか"),
 ],
 "roleplay": {
  "title": "Photo album with Shota's dad", "setting": "After dinner, Shota's dad brings out the family photo album.",
  "lines": [
   T("Dad", "これは、しょうたのおばあちゃんです。", "Kore wa, Shōta no obāchan desu.", "This is Shota's grandma."),
   Y("Ask if she's well.", [
     O("おばあさんはお元気ですか。", "Obāsan wa o-genki desu ka.", "Is his grandmother well?", kana="おばあさんはおげんきですか。"),
     O("母は元気です。", "Haha wa genki desu.", "My mother is well.", kana="ははははげんきです。"),
     O("おばあさんです。", "Obāsan desu.", "It's a grandmother.")]),
   T("Dad", "はい、元気ですよ。もう九十歳です。", "Hai, genki desu yo. Mō kyūjussai desu.", "Yes, she's doing well. She's already 90.", kana="はい、げんきですよ。もうきゅうじゅっさいです。"),
   T("Dad", "リズちゃんに兄弟はいるの？", "Rizu-chan ni kyōdai wa iru no?", "Do you have any brothers or sisters, Eliz?", kana="リズちゃんにきょうだいはいるの？"),
   Y("Say you have one younger brother.", [
     O("はい、弟が一人います。", "Hai, otōto ga hitori imasu.", "Yes, I have one younger brother.", kana="はい、おとうとがひとりいます。"),
     O("はい、姉が一人います。", "Hai, ane ga hitori imasu.", "Yes, I have one older sister.", kana="はい、あねがひとりいます。"),
     O("はい、母です。", "Hai, haha desu.", "Yes, it's my mother.", kana="はい、ははです。")],
     note="Confirmed: one younger brother (弟). 姉 would be older sister — wrong here."),
   T("Dad", "弟さんは元気？", "Otōto-san wa genki?", "Is your younger brother well?", kana="おとうとさんはげんき？"),
   Y("Say yes, he's well.", [
     O("うん、元気です。", "Un, genki desu.", "Yeah, he's well.", kana="うん、げんきです。"),
     O("はい、姉が一人います。", "Hai, ane ga hitori imasu.", "Yes, I have one older sister.", kana="はい、あねがひとりいます。"),
     O("いいえ、大丈夫です。", "Iie, daijōbu desu.", "No, I'm fine.", kana="いいえ、だいじょうぶです。")],
     note="With Dad, a soft うん、元気です is warm and natural."),
   T("Dad", "ご両親はお元気ですか？", "Go-ryōshin wa o-genki desu ka?", "How are your parents?", kana="ごりょうしんはおげんきですか？"),
   Y("Say they're both well, the modest way.", [
     O("はい、父も母も元気です。", "Hai, chichi mo haha mo genki desu.", "Yes, my dad and mom are both well.", kana="はい、ちちもははもげんきです。"),
     O("はい、お父さんもお母さんも元気です。", "Hai, otōsan mo okāsan mo genki desu.", "Yes, (honored) Father and Mother are well.", kana="はい、おとうさんもおかあさんもげんきです。"),
     O("いいえ、元気です。", "Iie, genki desu.", "No, they're well.", kana="いいえ、げんきです。")],
     note="Talking about your own parents to his dad, 父 and 母 are right."),
   T("Dad", "それはよかった。", "Sore wa yokatta.", "That's good to hear."),
  ]},
 "listening": [
  L("ご両親はお元気ですか？", "Go-ryōshin wa o-genki desu ka?", "How are your parents?", ["How are your parents?", "Where do your parents live?", "Are you tired?"], "Answer the modest way.",
    [O("はい、父も母も元気です。", "Hai, chichi mo haha mo genki desu.", "Yes, my dad and mom are both well.", kana="はい、ちちもははもげんきです。"), O("はい、お父さんもお母さんも元気です。", "Hai, otōsan mo okāsan mo genki desu.", "Yes, (honored) Father and Mother are well.", kana="はい、おとうさんもおかあさんもげんきです。"), O("一人っ子です。", "Hitorikko desu.", "I'm an only child.", kana="ひとりっこです。")], kana="ごりょうしんはおげんきですか？"),
  L("弟さんは元気？", "Otōto-san wa genki?", "Is your younger brother well?", ["Is your younger brother well?", "Is your older sister well?", "Are your parents well?"], "Say yes, he's well.",
    [O("うん、元気です。", "Un, genki desu.", "Yeah, he's well.", kana="うん、げんきです。"), O("はい、姉が一人います。", "Hai, ane ga hitori imasu.", "Yes, I have one older sister.", kana="はい、あねがひとりいます。"), O("おじいさんです。", "Ojiisan desu.", "It's a grandfather.")], kana="おとうとさんはげんき？"),
  L("おばあちゃんは九十歳です。", "Obāchan wa kyūjussai desu.", "Grandma is 90.", ["Grandma is 90.", "Grandma is in the kitchen.", "Grandma is asleep."], "React warmly.",
    [O("すごいですね！", "Sugoi desu ne!", "Wow, that's amazing!"), O("ごちそうさまでした。", "Gochisōsama deshita.", "Thank you for the meal."), O("お邪魔します。", "O-jama shimasu.", "(said entering a home)", kana="おじゃまします。")], kana="おばあちゃんはきゅうじゅっさいです。"),
 ]})
