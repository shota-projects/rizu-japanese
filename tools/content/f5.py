from _helpers import *
units = []
units.append({
 "id": "f-chat", "track": "family", "title": "Small talk with family", "jpTitle": "おしゃべり",
 "summary": "Catch-up chat: weather, hobbies, job, how you met, travel wishes — all personal details confirmed with Shota.",
 "phrases": [
  P("今日は暑いですね", "kyō wa atsui desu ne", "It's hot today, isn't it?", "Weather plus ね is the classic way to open a chat.", kana="きょうはあついですね", grammar="ね at the end invites agreement, like \"isn't it?\"."),
  P("寒くなりましたね", "samuku narimashita ne", "It's gotten cold, hasn't it?", "Great in autumn and winter.", kana="さむくなりましたね"),
  P("そうですね", "sō desu ne", "Yes, it really is. / Hmm, let me see…", "The all-purpose agreeing reply. Also buys you time to think."),
  P("買い物と料理と映画を見るのが好きです", "kaimono to ryōri to eiga o miru no ga suki desu", "I like shopping, cooking, and watching movies.", "Confirmed hobbies. Swap order freely; 〜のが好きです = like doing ~.", kana="かいものとりょうりとえいがをみるのがすきです"),
  P("仕事で会いました", "shigoto de aimashita", "We met at work.", "Confirmed. Also natural: 職場で会いました / 仕事で知り合いました.", kana="しごとであいました"),
  P("付き合って二年になります", "tsukiatte ni-nen ni narimasu", "We've been together for two years.", "Confirmed with Shota.", kana="つきあってにねんになります"),
  P("グラフィックデザイナーをしています", "gurafikku dezainā o shite imasu", "I work as a graphic designer.", "Confirmed. Softer than グラフィックデザイナーです with elders.", kana="グラフィックデザイナーをしています"),
  P("週末は何をしますか", "shūmatsu wa nani o shimasu ka", "What do you do on weekends?", "A friendly question to ask back.", kana="しゅうまつはなにをしますか"),
  P("日本のいろんなところに行きたいです", "Nihon no iron'na tokoro ni ikitai desu", "I want to go to all sorts of places in Japan.", "Confirmed. Swap in a place with 〜にも行ってみたい: 京都 / 大阪 / 奈良 / 北海道 / 沖縄 / 広島…", kana="にほんのいろんなところにいきたいです", grammar="〜てみたい = want to try doing ~. 〜にも行ってみたいです = I'd also love to visit ~."),
  P("ぜひ", "zehi", "I'd love to! / By all means", "A happy yes to an invitation: ぜひ！ or ぜひお願いします。"),
 ],
 "roleplay": {
  "title": "Chatting with Shota's mom & dad", "setting": "Living-room tea. Mom and Dad are casual; you keep light です/ます.",
  "lines": [
   T("Dad", "今日は暑いね。", "Kyō wa atsui ne.", "Hot today, huh?", kana="きょうはあついね。", note="Dad uses casual speech (no です). Answering in です/ます is still right for you."),
   Y("Agree politely.", [
     O("そうですね。本当に暑いですね。", "Sō desu ne. Hontō ni atsui desu ne.", "It really is. So hot.", kana="そうですね。ほんとうにあついですね。"),
     O("うん、暑い。", "Un, atsui.", "Yeah, hot. (too casual)", kana="うん、あつい。"),
     O("寒くなりましたね。", "Samuku narimashita ne.", "It's gotten cold.", kana="さむくなりましたね。")]),
   T("Mom", "リズちゃん、趣味は何？", "Rizu-chan, shumi wa nani?", "Rizu-chan, what's your hobby?", kana="リズちゃん、しゅみはなに？"),
   Y("Say you like shopping, cooking, and movies.", [
     O("買い物と料理と映画を見るのが好きです。", "Kaimono to ryōri to eiga o miru no ga suki desu.", "I like shopping, cooking, and watching movies.", kana="かいものとりょうりとえいがをみるのがすきです。"),
     O("趣味は絵を描くことです。", "Shumi wa e o kaku koto desu.", "My hobby is drawing.", kana="しゅみはえをかくことです。"),
     O("ぜひ。", "Zehi.", "I'd love to!")]),
   T("Mom", "料理するの？一緒に作ろうか。最近何かいい映画見た？", "Ryōri suru no? Issho ni tsukurō ka. Saikin nanika ii eiga mita?", "You cook? Want to make something together? Seen any good movies lately?", kana="りょうりするの？いっしょにつくろうか。さいきんなにかいいえいがみた？"),
   Y("Say you'd love to cook together / react warmly.", [
     O("ぜひ！一緒に作りたいです。", "Zehi! Issho ni tsukuritai desu.", "I'd love to! I want to cook together.", kana="ぜひ！いっしょにつくりたいです。"),
     O("仕事で会いました。", "Shigoto de aimashita.", "We met at work.", kana="しごとであいました。"),
     O("お邪魔しました。", "O-jama shimashita.", "Thanks for having me (leaving).", kana="おじゃましました。")]),
   T("Dad", "二人はどこで会ったの？", "Futari wa doko de atta no?", "Where did you two meet?", kana="ふたりはどこであったの？"),
   Y("Say you met at work.", [
     O("仕事で会いました。", "Shigoto de aimashita.", "We met at work.", kana="しごとであいました。"),
     O("友達の紹介で会いました。", "Tomodachi no shōkai de aimashita.", "We met through a friend.", kana="ともだちのしょうかいであいました。"),
     O("アメリカから来ました。", "Amerika kara kimashita.", "I'm from the US.", kana="アメリカからきました。")],
     note="Confirmed: at work. 職場で会いました is also fine."),
   T("Dad", "お仕事は何？", "O-shigoto wa nani?", "What do you do for work?", kana="おしごとはなに？"),
   Y("Say you're a graphic designer.", [
     O("グラフィックデザイナーをしています。", "Gurafikku dezainā o shite imasu.", "I work as a graphic designer.", kana="グラフィックデザイナーをしています。"),
     O("ぜひ。", "Zehi.", "I'd love to!"),
     O("父も母も元気です。", "Chichi mo haha mo genki desu.", "My parents are both well.", kana="ちちもははもげんきです。")]),
   T("Dad", "次はどこ行きたい？", "Tsugi wa doko ikitai?", "Where do you want to go next?", kana="つぎはどこいきたい？"),
   Y("Say you want to see lots of Japan — pick a place too.", [
     O("日本のいろんなところに行きたいです。大阪にも行ってみたいです。", "Nihon no iron'na tokoro ni ikitai desu. Ōsaka ni mo itte mitai desu.", "I want to go all over Japan. I'd love to visit Osaka too.", kana="にほんのいろんなところにいきたいです。おおさかにもいってみたいです。"),
     O("いいえ、大丈夫です。", "Iie, daijōbu desu.", "No, I'm fine.", kana="いいえ、だいじょうぶです。"),
     O("お邪魔しました。", "O-jama shimashita.", "Thanks for having me (leaving).", kana="おじゃましました。")],
     note="Swap 大阪 for 京都 / 奈良 / 北海道 / 沖縄 / 広島… Pattern: 〜にも行ってみたいです."),
  ]},
 "listening": [
  L("雨が降りそうですね。", "Ame ga furisō desu ne.", "Looks like it's going to rain.", ["Looks like it's going to rain.", "It rained yesterday.", "Do you like rain?"], "Agree.",
    [O("そうですね。", "Sō desu ne.", "Yes, it does."), O("ぜひ。", "Zehi.", "I'd love to!"), O("いただきます。", "Itadakimasu.", "(said before eating)")], kana="あめがふりそうですね。"),
  L("二人はどこで会ったんですか？", "Futari wa doko de attan desu ka?", "Where did you two meet?", ["Where did you two meet?", "When are you two leaving?", "Where are you two going?"], "Say you met at work.",
    [O("仕事で会いました。", "Shigoto de aimashita.", "We met at work.", kana="しごとであいました。"), O("付き合って二年になります。", "Tsukiatte ni-nen ni narimasu.", "We've been together two years.", kana="つきあってにねんになります。"), O("京都に行きます。", "Kyōto ni ikimasu.", "I'm going to Kyoto.", kana="きょうとにいきます。")], kana="ふたりはどこであったんですか？"),
  L("次はどこ行きたい？", "Tsugi wa doko ikitai?", "Where do you want to go next?", ["Where do you want to go next?", "Where did you go last time?", "When are you leaving?"], "Say you want to visit lots of places.",
    [O("日本のいろんなところに行きたいです。", "Nihon no iron'na tokoro ni ikitai desu.", "I want to go to all sorts of places in Japan.", kana="にほんのいろんなところにいきたいです。"), O("すみません、わかりません。", "Sumimasen, wakarimasen.", "Sorry, I don't understand."), O("おやすみなさい。", "Oyasumi nasai.", "Good night.")], kana="つぎはどこいきたい？"),
  L("リズちゃん、料理するの？", "Rizu-chan, ryōri suru no?", "Rizu-chan, do you cook?", ["Rizu-chan, do you cook?", "Rizu-chan, do you draw?", "Rizu-chan, are you leaving?"], "Say you'd love to cook together.",
    [O("はい、好きです。ぜひ一緒に作りたいです。", "Hai, suki desu. Zehi issho ni tsukuritai desu.", "Yes, I like it. I'd love to cook together.", kana="はい、すきです。ぜひいっしょにつくりたいです。"), O("趣味は絵を描くことです。", "Shumi wa e o kaku koto desu.", "My hobby is drawing.", kana="しゅみはえをかくことです。"), O("おやすみなさい。", "Oyasumi nasai.", "Good night.")], kana="リズちゃん、りょうりするの？"),
 ]})
