from _helpers import *
units = []
units.append({
 "id": "f-home", "track": "family", "title": "Home phrases", "jpTitle": "いえのあいさつ",
 "summary": "Door-to-bedtime house phrases you'll reuse every visit — casual お邪魔します as a familiar guest.",
 "phrases": [
  P("お邪魔します", "o-jama shimasu", "Thank you for having me (as you enter a home)", "Literally \"I'll be in your way\". Say it as you step inside, after taking off your shoes.", kana="おじゃまします"),
  P("お邪魔しました", "o-jama shimashita", "Thank you for having me (as you leave)", "The past-tense version, for when you head home.", kana="おじゃましました"),
  P("ただいま", "tadaima", "I'm home!", "Say it when you come back to the house you're staying in. Even as a guest it's warm and welcome.", grammar="These come in pairs: ただいま ↔ おかえり, 行ってきます ↔ いってらっしゃい."),
  P("おかえりなさい", "okaeri nasai", "Welcome back!", "The reply to ただいま. Family will usually say the casual おかえり."),
  P("行ってきます", "ittekimasu", "I'm heading out (see you later)", "Said when leaving the house, meaning you'll be back.", kana="いってきます"),
  P("いってらっしゃい", "itterasshai", "Have a good day / Take care", "The reply to 行ってきます."),
  P("いただきます", "itadakimasu", "(said before eating)", "A small thank-you before the first bite. Hands together is a nice touch."),
  P("ごちそうさまでした", "gochisōsama deshita", "Thank you for the meal (after eating)", "Say it to whoever cooked. It means a lot to a mom."),
  P("おやすみなさい", "oyasumi nasai", "Good night", "Polite, right for his parents. With Shota or younger cousins, just おやすみ."),
  P("おはようございます", "ohayō gozaimasu", "Good morning", "Polite, right for his parents and grandparents. They may answer with a casual おはよう; you can keep it polite."),
 ],
 "roleplay": {
  "title": "A night at grandma's", "setting": "Another visit to grandma's for dinner and a sleepover — she already knows you.",
  "lines": [
   T("Grandma", "いらっしゃい。どうぞ、上がって。", "Irasshai. Dōzo, agatte.", "Welcome! Come on in.", kana="いらっしゃい。どうぞ、あがって。", note="上がる (agaru) means \"step up\": Japanese homes have a step up from the entryway, where you take off your shoes."),
   Y("Say the right thing as you step inside.", [
     O("お邪魔します。", "O-jama shimasu.", "Thank you for having me.", kana="おじゃまします。"),
     O("おかえりなさい。", "Okaeri nasai.", "Welcome back."),
     O("ごちそうさまでした。", "Gochisōsama deshita.", "Thank you for the meal.")]),
   T("Grandma", "ご飯ができましたよ。", "Gohan ga dekimashita yo.", "Dinner's ready.", kana="ごはんができましたよ。"),
   Y("Before your first bite…", [
     O("いただきます。", "Itadakimasu.", "(said before eating)"),
     O("いってきます。", "Ittekimasu.", "I'm heading out."),
     O("おやすみなさい。", "Oyasumi nasai.", "Good night.")]),
   Y("After the meal…", [
     O("ごちそうさまでした。", "Gochisōsama deshita.", "Thank you for the meal."),
     O("いただきます。", "Itadakimasu.", "(said before eating)"),
     O("ただいま。", "Tadaima.", "I'm home.")]),
   T("Grandma", "もう遅いから、寝ましょうか。", "Mō osoi kara, nemashō ka.", "It's late. Shall we go to bed?", kana="もうおそいから、ねましょうか。"),
   Y("Say good night.", [
     O("おやすみなさい。", "Oyasumi nasai.", "Good night."),
     O("おはようございます。", "Ohayō gozaimasu.", "Good morning."),
     O("お邪魔します。", "O-jama shimasu.", "(said entering a home)", kana="おじゃまします。")]),
   T("Grandma", "おやすみ。", "Oyasumi.", "Good night."),
  ]},
 "listening": [
  L("おかえり！", "Okaeri!", "Welcome back!", ["Welcome back!", "Go home!", "Good night!"], "Answer her.",
    [O("ただいま！", "Tadaima!", "I'm home!"), O("いってらっしゃい。", "Itterasshai.", "Have a good day."), O("お邪魔しました。", "O-jama shimashita.", "Thanks for having me (leaving).", kana="おじゃましました。")]),
  L("どうぞ、上がってください。", "Dōzo, agatte kudasai.", "Please come in.", ["Please come in.", "Please take a seat.", "Please wait outside."], "Step inside and say…",
    [O("お邪魔します。", "O-jama shimasu.", "Thank you for having me.", kana="おじゃまします。"), O("おかえりなさい。", "Okaeri nasai.", "Welcome back."), O("いってきます。", "Ittekimasu.", "I'm heading out.")], kana="どうぞ、あがってください。"),
  L("ご飯ですよ！", "Gohan desu yo!", "Dinner's ready!", ["Dinner's ready!", "Are you hungry?", "Let's eat out tonight."], "Tell her you're coming.",
    [O("はい、今行きます！", "Hai, ima ikimasu!", "Coming!", kana="はい、いまいきます！"), O("おやすみなさい。", "Oyasumi nasai.", "Good night."), O("お邪魔しました。", "O-jama shimashita.", "Thanks for having me (leaving).", kana="おじゃましました。")], kana="ごはんですよ！"),
 ]})
