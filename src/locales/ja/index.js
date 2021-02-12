export default {
  title: 'サンプルゲーム',
  name: {
    libra: 'リブラ',
    amili: 'アミリ',
    flog: 'カエル',
    torrent: 'トレント',
    bat: 'コウモリ',
    snake: 'ヘビ',
    signal: '信号',
    penguin: 'ペンギン',
    minePenguin: '炭鉱ペンギン',
    fallTorrent: '秋トレント',
    pumpkin: 'カボチャ',
    ghost: '幽霊'
  },
  place: {
    home: '部屋',
    forest1: '森1',
    forest2: '森2',
    forest3: '森3',
    forest4: '森4',
    stomach: '胃',
    cave1: '洞窟1',
    cave2: '洞窟2',
    cave3: '洞窟3',
    base: '基地',
    ice1: '氷1',
    ice2: '氷2',
    ice3: '氷3',
    ice4: '氷4',
    dark: '暗闇',
    crossing: '交差点',
    heart: '心臓',
    fall1: '秋1',
    fall2: '秋2',
    coalmine1: '炭鉱1',
    coalmine2: '炭鉱2',
    coalmine3: '炭鉱3',
    hospital1: '病院1',
    hospital2: '病院2',
    mansion1: '豪邸1',
    mansion2: '豪邸2',
    mansion3: '豪邸3',
    cemetery: '墓',
    brain: '脳'
  },
  quest: {
    torrentFlog: {
      title: '生きることに必死な二人'
    },
    clover: {
      title: '不幸な四つ葉のクローバー',
      desc: 'カエルはプレゼントに送るための四つ葉のクローバーを探している'
    },
    snakeFlog: {
      title: 'ヘビとカエルの天秤'
    },
    curse: {
      title: '呪いのかけ方'
    },
    eel: {
      title: 'ウミノケ'
    },
    pityPenguin: {
      title: '気の毒な男'
    },
    liveForEveryone: {
      title: '人のために生きるペンギン'
    },
    matsutake: {
      title: '夢の高級キノコ'
    },
    painter: {
      title: '炭坑の絵描き'
    },
    appreciation: {
      title: 'お屋敷の子ども'
    },
    beauty: {
      title: '不老不死の薬'
    },
    enlightenment: {
      title: '悟り'
    },
    forever: {
      title: 'ずっと一緒に居て下さい'
    }
  },
  ui: {
    place: '場所',
    client: '依頼主',
    questStart: '『#{title}』を開始',
    questComplete: '『#{title}』を完了'
  },
  events: {
    libra: {
      exclamation: '！',
      question: '？',
      silence: '………。'
    },
    gameOver: {
      amili1: ['リブラ、目覚めた？', 'もう怖くないよ'],
      amili2: ['しばらくこうしてよっか']
    },
    forest2Kajitsu: {
      walk: [
        'はじめまして。',
        '私はカジツと申します。',
        '私からこのゲームについて簡単に説明させて頂きます。',
        '基本操作ですが、マップ上を左クリックするとそちらへ移動します。',
        'まずは私のところまで歩いて来て下さい。'
      ],
      talk: [
        '大丈夫ですね。',
        'では次に私に話しかけてみて下さい。',
        'もう少し近付いて、私を左クリックすれば話しかけられます。'
      ],
      apple: [
        '大丈夫ですね。',
        'ではあちらを見て下さい。',
        'あそこに落ちているリンゴを拾ってみて下さい。',
        '近付いて左クリックを押し続けると掴みます。',
        'そのままかばんウィンドウへドラッグ＆ドロップすると拾う事ができます。',
        '拾ったら私のところへ戻って来て下さい。'
      ],
      completed: [
        '拾えたようですね。',
        '基本的な操作はこんなところです。',
        '詳しい説明は画面右下のシステムウィンドウで確認できます。',
        'ところで、',
        '今日のあなたは、恋人へリンゴを持って帰るためにこの森へ来ました。',
        'あなたの部屋は森を抜けて北へ進んだ先にあります。',
        'さあ、彼女が待っていますよ。',
        '私はこれで失礼します。'
      ]
    },
    home: {
      welcomeback: 'おかえり、リブラ！',
      giveApple: ['リンゴを渡す', 'なんでもない'],
      noApple: 'ないじゃん',
      gaveApple: ['ありがとう！', '今日はどうしたい？'],
      reward: ['散歩がしたい', '一緒に寝たい'],
      requestApple: {
        a: ['リブラ、またお腹が減ったわ。', 'またリンゴ持ってきて！'],
        b: ['ん～', 'またリンゴ食べたいなぁ', 'リブラ、持ってきてくれるよね？']
      }
    },
    itemReactions: {
      lily: ['あ、部屋に百合の花飾ったんだ～？', 'えへへ。']
    },
    torrentFlog: {
      start1: [
        'あー、困りました…。',
        '実は私が先日捕まえたカブトムシが逃げ出してしまったのです。'
      ],
      options1: ['それは困りましたね', '大切なものだったんですか？'],
      start2: [
        'ええ、ただのカブトムシではありません。',
        'この地では非常に珍しいヘラクレスという黄金色のカブトムシなのです。',
        'あのカブトムシを探しださなければ私は嘘つきになってしまうのです。'
      ],
      options2: ['嘘つきに？', '何故ですか？'],
      start3: [
        'はい。あれは先週のことでした。',
        '私は友人のカエル殿と話をしていたのです。',
        '「ところでカエル殿、この森には黄金色のカブトムシが住んでいるのですが、ご存知ですかな？」',
        '「…ううむ、トレントさんや、そりゃあとんだ嘘でございますな。そんなものがこの世に居るものですか」',
        '「いえいえ、嘘なんかじゃあ御座いませんよ。ほんとうに居るのです」',
        '「そうんなことを言って私をからかおうったってそうはいきませんよトレントさん。」',
        '「もしほんとうにそのようなカブトムシが居るのでしたらさっそく連れてきてくだあさいよ」',
        '「からかおうなんてつもりはちっとも御座いませんよ。」',
        '「ですが黄金色のものは大変珍しいものでして、そう容易く連れてくるのはかないませんのです」',
        '「そんなら信じるには至りませんな。このままじゃあトレントさんは大ぼら吹きになっちまいますよ？」',
        '「なんとかしてその黄金色のカブトムシを私のところへ持ってきてくだあさい」',
        'そんなわけで私は慌ててヘラクレスを探しました。',
        'そして先日ついにそれ見つけたのです。',
        'しかし、カエル殿と約束した今日、ヘラクレスの姿がどうにも見当たらなくなってしまいました。',
        'はあ困りました…。このままでは私は大ぼら吹きになってしまいます…。',
        'そこでお願いなのですが、もしヘラクレスを見かけたら、どうか私の元へ持ってきて頂きたいのです。',
        'お礼はします。どうかお願いします。'
      ],
      started: [
        'ヘラクレスを見かけたら、どうか私の元へ持ってきて頂きたいのです。',
        'お礼はします。どうかお願いします。'
      ],
      found: [
        'おお！ヘラクレスを持ってきて下さったのですね？',
        'ではそのヘラクレスをこのエリアの南に住むカエル殿のところへ持って行ってくれませんか？',
        '私は長い距離を歩くのが苦手でして…。'
      ],
      options3: ['カエルはあなたを騙していました', 'カエルにヘラクレスを届けました'],
      report: [
        'そうですか。',
        '残念なことですが、生きていればあそういう偽りも必要な時があります。',
        'カエル殿も、私も、生きるのに必死なんです。',
        'ですから、カエル殿の行いばかり責めるのは酷だとは思いませんか？'
      ],
      options4: ['あなたの言うとおり仕方ない', '生きる為でも人を騙してはいけない'],
      end1: [
        'そうですか。これで私の疑いは晴れましたね。',
        'どうもありがとうございました。これはお礼です。'
      ],
      end2: [
        'そうですか、どう考えるかは人それぞれですね。',
        'さあ、これはお礼です。この度は大変助かりました。では。'
      ],
      end3: [
        'そうですか。では、そう答えたあなたには正直に白状しましょう。',
        '実は、この度の話は何もかも嘘なのです。',
        '高価なヘラクレスを手に入れるため、私とカエル殿の共謀であなたを騙しました。',
        '本当に申し訳ありません。',
        'ですが、私も生きるのに必死なんです。',
        'お詫びにこれをお受け取り下さい。では。'
      ],
      completed: '皆、生きるのに必死なんです。',
      flog: {
        greeting: 'こんにちはお嬢さん。',
        give1: [
          'こんにちはお嬢さん。',
          'え？トレントさんから預かり物？',
          'やあやあ！それはヘラクレスじゃあありませんか！',
          'さあ、それを早くこちらへ下さいな！'
        ],
        options1: ['ヘラクレスを渡す', '渡さない'],
        give2: ['まあまあそんなこと仰らずに！'],
        log1: 'ヘラクレスを渡した',
        log2: 'ヘラクレスを奪われた',
        give3: [
          'おお、これがヘラクレス…！',
          'こいつを売れば私も食に苦しみやしませんねえ、ケケケ',
          'トレントさんはお人よしだあ。'
        ],
        options2: ['最初から売るつもりで？', 'トレントを騙したの？'],
        give4: [
          'お嬢さん。',
          '私はヘラクレスを手に入れた。トレントさんは疑いを晴らした。',
          'ただそれだけのことじゃあないですか。',
          'なあにもおかしなことはしておりません。',
          'ですがこの話はトレントさんには内緒でお願いしますよ。それじゃあ。'
        ]
      }
    },
    clover: {
      flog1: ['ボクね、大好きな子に四つ葉のクローバーを渡したいんだ！キミ、一緒に探すのを手伝ってくれないかい？'],
      flog2: {
        options: ['クローバーを譲る', '「プレゼントなら自分で探すべきだよ」'],
        log: 'クローバーをあげた',
        end1: [
          'ありがとう！',
          'これはお礼のリンゴだよ。'
        ],
        end2: [
          '…！',
          '確かにお姉ちゃんの言うとおりだね。',
          'ボク、自分で探すことにするよ！',
          'これ、お礼に貰ってくれ。'
        ]
      },
      flog3: ['この間はありがとう！'],
      torrent: [
        '「四つ葉のクローバーが幸せ」なんて誰が決めたんでしょうね。',
        'もしもクローバーの葉は4枚なのが普通で、3枚が珍しいとすると、きっと「幸せの三つ葉のクローバー」なんて言われていたでしょう。',
        'ところで、珍しいものというのは、縁起が良いとされるか忌み嫌われるかのどちらかです。',
        'しかし、縁起が良いとされるはずの四つ葉のクローバーも見つけらると必ず引っこ抜かれてしまいます。',
        '「幸せ」とか言っておきながら四つ葉のクローバー当人からすると不幸極まりないのです。',
        '世間から浮いた存在というものは、どのような形であれ最後には淘汰されるようにできているのでしょうか…？'
      ]
    },
    snakeFlog: {
      start: [
        '物の価値というのはさまざまな状況によって変わるが、最終的にその価値を決めるのは他ならぬ自分だ。',
        'この洞窟の水晶からは宝石を採取できるんだが、あるときコウモリの野郎がその宝石を持っていたんだ。',
        'だからおれは言った。',
        '「なあコウモリさん、いつも羽虫ばかり食べていて胃が退屈してるんじゃあないかい？」',
        '「どうだ、その口にくわえた宝石をおれにくれてみろ。きっといいものを食わせてやるぜ」',
        'コウモリの野郎は「そりゃあいい。早速捕ってきてくれ。おいらは新鮮な肉が食いてえな」と言った。',
        'だからおれは洞窟の外でカエルを捕まえてきてやったんだ。',
        'するとどうだ。奴はおもしろくなさそうな顔をしやがった。',
        '「やい、ヘビめ。おいらを馬鹿にしてるのか？宝石とカエル一匹じゃあいくらなんでも釣り合わんじゃあないか」',
        '「おいらだって宝石の価値くらい知っているんだぞ」',
        '「この宝石でおいらの仲間たちを腹いっぱいに出来るくらいの価値はあるはずだろう？」',
        'コウモリの野郎はそう抜かしやがった。だからおれは言ってやったさ。',
        '「ああ。確かにお前さんの言うとおり宝石ってのはそれくらいの価値があるなあ」',
        '「でもあんた、その宝石をどうやって金や食べ物に換えるつもりだ？」',
        '「換えられないんじゃあ世間で価値のある宝石ったってお前さんにとってはただの石ころに過ぎないじゃないか」',
        '「ところがこのカエルの肉はどうだ？お前さんじゃあ滅多にありつけないご馳走じゃあないのかい？」',
        '「つまりだ。おれは石ころをご馳走に換えてやろうと言っているんだ」',
        '「それでもおもしろくねえって言うんなら交換は諦めてこのカエルはおれが今から食べるとしよう」',
        'するとコウモリの野郎は慌てて言った。',
        '「わ、分かった！よーく分かったよ！こんな石ころはいくらでもくれてやる。さあ、早くその肉をおいらにくれ」と。',
        'それ以来やつは毎日宝石をくわえてきた。仲間たちも腹いっぱいにさせたいんだとよ。',
        'そいつとその仲間は日に日に体が丸くなっていった。',
        '宝石一つもくわえて飛べなくなるほど太ったころに、おれは奴らを一匹残らず美味しく頂いたさ。',
        'つまりだ。砂漠で喉の渇きで死にかけている奴の前にコップ一杯の水と札束を差し出してみろという話さ。',
        '世間一般の価値がいつも通用するわけじゃあない。',
        'そういうわけで、あんたも宝石を持ってきたらこのリンゴと交換してやるぜ。'
      ],
      started: [
        'そういうわけで、あんたも宝石を持ってきたらこのリンゴと交換してやるぜ。',
        'そうだな、この洞窟で捕れる4色の宝石をそれぞれ2つずつ集めてきてくれ。',
        '宝石は水晶を破壊すれば出てくることがある。',
        '水晶を破壊するには銃を手に入れて撃つといい。'
      ],
      options: ['宝石を2つづつ渡す', '渡さない'],
      complete1: 'お、持ってきたか。有り難く頂くよ。',
      logs: ['サファイヤを2個あげた', 'エメラルドを2個あげた', 'アメジストを2個あげた', 'ルビーを2個あげた'],
      complete2: 'ほら、約束してたリンゴだ。',
      completed: 'よう。もう用は済んだはずだぜ。'
    },
    strawDoll: {
      start: [
        'なぁあんた、この藁人形見てくれよ。',
        'これ、森で拾って持って帰って来たんだが、',
        '後からやっぱり気味悪いからってんで捨てて来たんだ。',
        'だけどな、次の日起きてみると捨てて来たはずのこれが家にあったんだ。',
        '何回捨ててきても必ずうちへ戻って来るんだ。',
        '気味悪いだろ？'
      ],
      options: ['気味悪いですね', '私が引き取ります'],
      answer1: ['あぁ。'],
      answer2_1: [
        '本当か？それは助かるな。',
        'じゃあ早速持って行ってくれ。'
      ],
      answer2_2: [
        'でも捨てないでくれよ。',
        'また俺のところに戻ってきたらかなわんからな。'
      ],
      received: ['気味悪いよな、藁人形って…。'],
      disposed: [
        'おい姉ちゃん、例の藁人形、また俺のところへ戻って来たぞ。',
        '貰ったんならちゃんと持っていてくれよ…。'
      ]
    },
    curse: {
      start1: [
        '何度でも言うさ。呪いなんてもんこの世には存在しねえ。',
        'いいや、ある。賭けたっていい。',
        '証明のしようがないんじゃあ賭けすら成立しないじゃないか。'
      ],
      start2: [
        'ん？',
        'なあ、あんた、その持っている人形…、',
        'それは藁人形じゃあないか。',
        'へえ、よく呪いの儀式だかに使うやつか。',
        '丁度良い。その藁人形を使って試してみようじゃないか。',
        'お、おおそうだな。ぜひそれで俺を呪ってみろ。',
        '俺の身に何か起きたらお前の勝ちだ。',
        'なああんた。そういうわけだ。',
        '今から森に行ってその人形で俺に呪いをかけてきてくれ。',
        'やってきたら報告しに来てくれ。そうしたらお礼を出す。',
        '森の北の方のエリアにリンゴのなる木があるだろ？',
        'そこにいるトレントが詳しいから彼を頼ってくれ。',
        '頼んだぞ。'
      ],
      started1: [
        '森の北の方のエリアにリンゴのなる木があるだろ？',
        'そこにいるトレントが詳しいから彼を頼ってくれ。',
        '頼んだぞ。'
      ],
      started2: [
        '…ふん、呪いの人形だなんて馬鹿馬鹿しいな。'
      ],
      executed: [
        'ああ、あんたはこの前の…。',
        '実は儀式のことなんだが、あれはやっぱり中止だ。',
        'どういうわけか、あいつ、突然病を患ってぽっくり逝っちまったんだ。',
        'だから呪いの儀式はしなくていい。',
        'やっぱりあいつの言うとおり呪いなんてもんはないのかもな。',
        'そりゃあ生きてりゃ突然病気になったりもする。',
        'それを全部呪いだ祟りだーなんて得体のしれないものに責任を押し付けてちゃいかんな。'
      ],
      noticeOptions: ['儀式をしてきた', '儀式はしなかった'],
      answer1_1: [
        'そうか、この先どうなるか楽しみだな。',
        'ほら、これはお礼だ。'
      ],
      answer1_2: [
        'そうか…。',
        'ん？どうした？',
        'いいや…。'
      ],
      answer2_1: [
        'なんだ？やらなかったのか。',
        'そうかそうか、やらなかったのか！',
        'まあ、賭けにはならんかったが、とりあえずこれはお礼だ。'
      ],
      answer2_2: [
        'ん？なんでやらなかったのにお礼なんだ？',
        'いや…、まあ細かい事は気にするな。',
        'じゃ、じゃあな譲さん。'
      ],
      noticedDid1: [
        'どうなるか楽しみだな。',
        '…。'
      ],
      noticedDid2: [
        'ああ、譲ちゃん、どうやら賭けは俺の負けのようだ。',
        'あれからどうにも体調が悪くて仕方ねえんだ。',
        '病気なんて滅多にしない俺が突然意味も無くこれだ。',
        'さすがに何かあるのかもしれねえな。',
        'ほらな、言った通りだろ。賭けは俺の勝ちさ。'
      ],
      completed: [
        'まあ何にせよ、誰かに恨まれない生き方を目指すのが一番ってこったな。'
      ]
    },
    curser: {
      start: [
        '呪いのかけ方ですか？',
        '簡単ですよ。呪いをかけたい相手に「貴方に呪いをかけた」と知らせればよいのです。',
        '呪いの儀式なんてものをやる必要はありません。',
        '信じられませんか？',
        '「病は気から」と言う言葉がありますよね。',
        'これ、ただのことわざではないんです。',
        '3匹のヘビがグルになってある兎に暗示をかけたことがあります。',
        'こんな話です。',
        '兎に最初に会ったヘビは言いました。',
        '「やあ、兎さん。調子はどうだい？」',
        '「これはヘビさん！お陰様で私はとても元気ですよ！」',
        '「そうかい？どうやら顔色が優れないように見えますよ？」',
        '「え？そうですか？」',
        '2匹目に会ったヘビも言いました。',
        '「やあ、兎さん。おや、顔色が悪いね。大丈夫かい？」',
        '「え？そうですかねぇ…？」',
        '最後に3匹目に会ったヘビが聞きました。',
        '「やあ兎さん。調子はどうだい？」',
        '「うーん…。実はちょっと具合が悪いんです…。」',
        '確かに元気だったはずの兎が、他人の言葉だけで「自分は具合が悪い」と錯覚してしまったのです。',
        'このように、暗示というのは案外単純なものなんです。',
        '儀式はせずに相手に「呪いをかけた」とだけ伝えてみてはどうでしょう？',
        'まあ、どうしても実際に呪いの儀式をしたいのであれば、',
        '呪いの人形を持って来てくれればお手伝いしますよ。',
        'おすすめはしませんが。'
      ],
      options: ['呪いの儀式をする', '呪いの儀式はしない'],
      failed: ['おや、呪いの人形がなければ儀式は出来ませんよ？'],
      exec1: [
        '分かりました。',
        'では、始めます。',
        '呪いの人形を貸して下さい。'
      ],
      exec2: [
        '儀式は終わりました…。',
        'では…。'
      ],
      cancel: ['では。'],
      greet: ['調子はどうですか？'],
      options2: ['元気です', '呪いの儀式をしたい']
    },
    eel: {
      start1: [
        'なあニンゲンのお嬢さんや、ワシは今日漁に行って来たんだが、困ったことにウミノケを釣ってしまったんだ。',
        'すまんがこれをアントン先生のところへ持っていって供養してもらってくれないか？'
      ],
      startOptions1: ['ウミノケ？', 'いやです'],
      start2: [
        'ウミノケを知らんか。',
        'あれは数年前のことだ。漁で普段見たことのねえ魚が釣れたんだ。',
        '黒くて蛇みたいなにょろにょろした形で少々気味が悪かったよ。',
        '家に帰って試しに食ってみたんだが、やけに脂が乗っていてそりゃあ美味かった。',
        'あまりに美味いもんで、焼いたり刺身にしたりしてその日のうちに一匹丸々平らげたよ。',
        'しかし、あとからどうにも腹が痛くて吐き気もして仕方なくなったんだ。',
        'まあただの食当たりかとも思ったんだが、',
        '今度は皮膚が青紫色になったり、体が金縛りのようになったり、呼吸がし辛くなったりとそりゃあ酷いことになった。',
        'こりゃあいくらなんでも様子がおかしいってんで慌ててアントン先生という方に相談しに行ったんだ。',
        '事情を話すとアントン先生はこう聞いてきた。',
        '「あんた、その魚はどんな姿をしていました？」',
        '「ええと、蛇のような姿でまっ黒でした」',
        '「あんたなあ、そりゃあきっとウミノケですよ」',
        '「な、なんですかそれは？」',
        '「ウミノケってのは海の妖怪で、魚なんかじゃあないですよ」',
        '「そんなもんを食っちまっては呪われても当然ということです」',
        'ワシは顔が真っ青になりましたよ。',
        '「そ、そんな！ど、どうすれば？」',
        '「まあ慌てなさんな。ちゃんと祓ってやります」',
        'そうしてワシは祓ってもらった後すっかり楽になったんです。',
        'でも、もしまた漁であの妖怪が釣れたらと思いゾッとして聞きました。',
        '「また、ウミノケが釣れたらどうしましょう先生？」',
        '「ああ、そんときは必ずウチへ持ってきなさい。ちゃあんと供養しますからね」',
        'それからというもの、ウミノケを釣ってしまう度に先生のとこへ持って行ってるんだ。',
        'で、最初に言った通り今日もヤツが釣れてしまったんだ。',
        'だから、悪いがお嬢さん、お礼を出すからアントン先生のとこへ持って行ってくれねえか？'
      ],
      startOptions2: ['いいですよ', 'いやです'],
      answer1: ['たのんだぞ。'],
      lost: ['おいおい、ちゃんと持って行ってくれよ。'],
      answer2: ['そうか。'],
      start3: ['悪いがお嬢さん、お礼を出すからアントン先生のとこへ持って行ってくれねえか？'],
      end1: [
        '供養は終わったようだな。御苦労さん。',
        'お礼を持って行ってくれ。じゃあな。'
      ],
      endOptions: ['うな重と手紙を渡す', '手紙のみを渡す'],
      log1: 'アントンの手紙を渡した',
      log2: 'うな重を渡した',
      end2: [
        'アントン先生…。正直驚いよ…。',
        'まあ、確かにあんな美味いんじゃあ仕方ねえかもな…。',
        'しかし、無知というのは損なもんだなあ。',
        'ワシが無知ゆえに腹を下し、妖怪の話なんぞに騙され、その後も美味いものをずっと食い損ねていただなんてよ。',
        '今は怒りよりも自分の無知を恥じているよ。',
        'とにかく、今回はありがとうな。これを貰ってくれ。じゃあな。'
      ],
      completed1: ['この前は助かったよ。'],
      completed2: ['世の中無知なやつほど損をしていくのかなぁ…。']
    },
    anton: {
      start1: [
        'おや、ニンゲンのお嬢さん。今日はどうしました？'
      ],
      startOptions1: ['ウミノケを渡す', 'なんでもない'],
      giveLog: 'ウミノケを渡した',
      start2: [
        'おや、これはウナギじゃあないですか。',
        'もしかしてこれを譲ってくれるのですか？'
      ],
      startOptions2: ['え、ウミノケでは？', 'ウナギ？？'],
      start3: [
        'えっ？',
        'あっ！ああ、なるほど…あなたはあの方の使いで…',
        'ええと…。',
        '…正直に白状します。',
        '実はこの魚、ウナギと言うとても美味しい魚なんです。',
        '私はこれが大好物でして。',
        'あなたにお使いを頼んだであろう彼には嘘を吐いたんです。',
        'ウミノケなんて妖怪はおりません。',
        'ウナギの血液にはイクシオトキシンという毒がありますからね。',
        '彼が話した症状はまさにその毒によるもので、決して呪いなどではありません。',
        'しかし、ウナギの毒も火に通せばすっかり無害なのです。',
        '彼はきっと刺身で食べてしまったのでしょう。',
        'あの時、私には悪い考えが浮かんでしまいました…。',
        '私は、「それは海ノ怪であるから食べずに持って来い」と嘘を…。',
        '結果として滅多に味わえない至高の魚を彼は私に持って来るようになったのです。',
        'ああ、どうかそんな目で見ないでください。',
        '彼には申し訳ないながら、人を騙してでも食べたい味なのですよ…。',
        'どうか内密にお願いします。'
      ],
      startOptions3: ['代わりに調理したウナギを食べさせて', '正直に謝った方がいい'],
      answer1_1: ['分かりました。'],
      answer1_2: [
        '出来ました。お持ち下さい。',
        'では。'
      ],
      answer2_1: [
        'そうですね。確かにそうするべきです。',
        'ちょっと待っていて下さい。'
      ],
      answer2_2: [
        '出来ました。調理したウナギと、こちらは謝罪の手紙です。',
        'どうかこれを彼に届けてください。'
      ],
      solved: ['では。']
    },
    liveForEveryone: {
      start: [
        '私にはその人の「欲しいもの」や「してほしいこと」が見えます。',
        'ほんとうですよ。',
        'あなたは今リンゴが欲しいのではないですか？',
        '当たっていますね？',
        '天から授かったこの能力で、私は誰かのために生きることを誓っていたのです。',
        'これまで私は、その人の望みが私に叶えられる場合、いつも見返りを求めずに叶えてきました。',
        'いいえ。見返りを求めていないつもりだったのです。',
        '先日、ある旅のお方とすれ違ったのですが、彼は喉が渇いていたらしく飲み物を望んでいたのです。',
        'ですから私はお茶の入った水筒を差し上げたのです。',
        'するとそのお方は水筒のお茶を飲み干し、無言で去って行ってしまったのです。',
        '私はお礼の一言を言わなかった彼に疑問を感じたのです。',
        'そのとき気付いてしまったのです。',
        '私はお礼を見返りにお茶を差し上げていたのではないかと。',
        'そのお方の喉の渇きを潤せたときに私の使命は果たせていたはずなのです。',
        'なのに私の心は無意識にお礼を待っていたのです。',
        'このような心をもって「誰かのため」などという生き方は務まりません。',
        '私は「誰かのため」がどういうものなのか、ここ数日考えていました。',
        '例えば、己の命と引き換えに誰かの命を救ったとしたら、それは「誰かのため」といえるでしょうか？',
        'もしかしたらそれは、死後も残る栄誉という見返りを求めた行動といえるのかもしれません。',
        '「全ての行いは己のためのもの」、今の未熟な私にはどう転んでもその結論に至ってしまうのです。',
        '私はまた一から修行を積み直すつもりです。',
        'ほんとうの「誰かのため」の生き方が何たるかを悟らねばなりません。',
        'ここまで聞いてくださってありがとうございました。',
        'さあ、これはほんのお礼です。'
      ],
      options: ['ありがとう', '見返りのために話を聞いたのではない'],
      answer1: [
        'いいえ、こちらこそありがとう。またどこかでお会いしましょう。では。'
      ],
      answer2: [
        'ふふ。そうですね。ではこれは長話に時間を取らせてしまったお詫びということにしましょう。',
        'それでは、またどこかで。'
      ],
      completed: ['日々、修行あるのみです。']
    },
    pityPenguin: {
      greet: ['何か用ですか？'],
      options: ['手紙とクチナシを渡す', '手紙のみを渡す', 'なんでもない'],
      log1: '時音の手紙を渡した',
      log2: 'クチナシを渡した',
      solve1: [
        'これは…。',
        '僕は、もう彼女とは…会えないんですね…。'
      ],
      reactions: ['怨んでいないんですか？', 'そんな女は忘れましょう'],
      answer1: [
        '怨んでなんていませんよ。',
        '僕は彼女を愛していたんですから。'
      ],
      answer2: [
        '僕は彼女を愛していました。'
      ],
      solve2: [
        '騙す気だったかなんて関係ありません。',
        '持って行かれたお金が惜しいとも思いません。',
        '彼女ともう会えないのがただ悲しいだけです。',
        'でも、そんなことを言っていたって仕方がありませんね…。',
        '少しずつ気持ちを切り替えていくことにします。',
        'この度はありがとうございました。これをお持ち下さい。'
      ],
      solve3: [
        'これは…。',
        'これは、彼女が書いたものではありませんね…？',
        '…。',
        'はあ、僕は何をずっとくよくよしていたんだ…。',
        '友にまでここまで心配させてしまって…。',
        '本当は騙されていた事に心のどこかで気付いていたんだ。',
        'どうしてもそれを認めたくなかっただけなんです。',
        'もう彼女とは…会えないんですね…。',
        'でも、もう大丈夫です。',
        '僕には心配してくれる友人もいますしね。',
        'この度はありがとうございました。これをお持ち下さい。'
      ],
      solved: [
        '僕は、もう大丈夫です。'
      ]
    },
    pityPenguinFriend: {
      start1: [
        '北の穴にはハチという男が住んでいたんだが、',
        'こいつがまあ～、いつまで経っても女に恵まれない奴でな。',
        '天涯孤独と開き直って独り寂しく暮らしてたんだわ。',
        'しかし、数ヶ月前のことなんだが、あいつの元に一人の女が訪れたらしい。',
        'それがたいそう美しい女だったらしく、そんな者が自分などに何の用だと思って用件を聞くと、',
        '「時音と申します。突然で不審とお思いかもしれませんがどうか聞いてください」',
        '「この度用事でこの地を訪れました。そして表であなたをお見かけし、私の心は一目で貴方の虜となりました」',
        'なんて言い出したらしい。',
        '挙句の果てには今すぐめとってくれと家に上がり込もうとしたそうだ。',
        'もちろんそんなうまい話はこの世にないさ。',
        'いくらハチといえど疑ったそうだ。',
        '「そんな口から出まかせで僕を騙そうだなんて気分が良くないなあ」',
        '「きっと家に上げたら夜中に僕が寝た隙に何もかも盗り去ってしまうんだろう？」',
        'そう言うと女は、「そんなつもりはありません！なんなら私の足首と部屋の柱を紐で繋いでくれたって構いません！」',
        'と抜かしたそうだ。',
        'そこまで言うんならとハチはそいつを部屋に上げて本当に紐で足首と柱を繋いだらしい。',
        'すると女はニコニコと嬉しそうにハチを見るばかりで、ハチもすっかり混乱してしまった。',
        'そんなハチだったが、その晩にはちゃっかりその女と夜を共にしたわけだ。',
        'そうなってしまうともう大変さ。',
        '今まで女縁の無かったハチは一晩ですっかりその女にぞっこんだ。',
        '「ほんとうにボクと結婚してくれるのかい？」',
        '「何度でも申し上げます。私はあなたのものです」',
        '相変わらず女はニコニコ嬉しそうな顔だ。',
        '「でも貴女は用事でここに訪れていたんだろう？一度帰ってご家族に挨拶をせねばならんよ」',
        '「分かりました。確かに両親も心配していると思うので、一度挨拶に帰ります」',
        '早速帰る準備を始めた女にハチは札の束を差し出した。',
        '「これは往復の旅の費用と、ご実家への支度金だよ」',
        '女の実家の方に相手が貧しい男と思われてはいけないと考え、支度金はかなり渡したそうだ。',
        '「必ず戻ってきます」',
        'そうして一度実家へ帰っていった女だが、いつまで待てど戻ってくる気配が無い。',
        'ハチは街の外れでずぅっと帰りを待っているが、やっぱり戻ってくるわけはねえ。',
        '最初はちゃんと怪しいと思って疑ってたのに、',
        'たった一晩でこれだ。',
        '男ってのはなんでこうも馬鹿なんだろうな？',
        '「悪い女に騙されたんだ、諦めろ」と誰が声をかけても聞きやしねえ。',
        'なんと、未だにずぅっと待っているんだ、あいつは。',
        '俺はその姿が気の毒でならねえ。何とか諦めさせてやりたいのさ。',
        'そこで思いついたんだ。',
        'あの女のフリをして手紙を出して、結婚はできないとハッキリ伝えれば諦めるんじゃないかってな。',
        'でもただ手紙を出しても疑わしい。',
        'そこでクチナシの花を添えようと思うんだ。',
        'その女が住む地にはクチナシが沢山咲いていると話していたらしいんだ。',
        'それを添えればさすがに信じるだろう。',
        'どうだ、姉ちゃん。ひとつ協力してくれないか？'
      ],
      start2: [
        '森に行ってクチナシを一輪採ってきほしいんだ。',
        'それまでに手紙は用意しておく。'
      ],
      options: ['クチナシを渡す', 'なんでもない'],
      found1: [
        'よし、よくやった。',
        'じゃあこの手紙と一緒に渡してきてくれ。'
      ],
      found2: [
        'ハチはこの北へ抜けた先だ。',
        '手紙とクチナシを渡してきてくれ。'
      ],
      lost: [
        'おいおい、手紙なくさないでくれよ。'
      ],
      solved: ['届けてきてくれたようだな。あんたのおかげで助かったよ。'],
      completed: ['女に騙されるのは恥ずかしい事なんかじゃあないさ。']
    },
    dark: {
      kajitsu1: ['それが懐かしいですか？'],
      kajitsu2: ['ここがどこだか思い出しましたか？'],
      kajitsu3: [
        '思い出せませんか…。',
        'あなたがこの世界に来て一ヶ月ほど経ちました。',
        'だけどあなたは何故ここへ来たのかを忘れている。'
      ],
      kajitsu4: ['このままではアミリさんが危ないですよ。'],
      kajitsu5: ['私はこの先で待っています。必ず来てください。']
    },
    crossing: {
      start1: ['思い出しましたか？'],
      start2: ['そうです。貴方はここで死んだのです。'],
      start3: [
        'ですがこの世界は死後の世界と言うわけではありません。',
        'この世界はアミリさんの心の中です。',
        '一緒に事故に遭ったアミリさんは、現在昏睡状態に陥っています。',
        '貴方は霊体としてアミリさんの心の中に入ってしまったのです。'
      ],
      start4: ['こちらへ来て下さい。']
    },
    heart: {
      start1: ['アミリさんの心臓です。'],
      start2: [
        'アミリさんは生きています。',
        'しかし、ここに貴方が居るばかりにアミリさんは目を覚ませずにいるのです。'
      ],
      start3: [
        'アミリさんが目覚めるためには貴方がここから出ていかなければいけません。',
        'ここを出ると貴方は成仏し、天国へ行きます。',
        'ここから出て行く方法は単純です。',
        'ここから強く出たい、と願うだけです。',
        'しかし、今の貴方にはそれだけの決意がありません。',
        '躊躇いがあります。'
      ],
      start4: [
        'そうですね…、',
        '交差点から北へ向かって下さい。',
        'アミリさんの脳内に辿りつきます。',
        'そこにヒントがあるでしょう。'
      ]
    },
    enlightenment: {
      start1: [
        'なあ、あんた。',
        '俺は見ての通り死んでいる。',
        'つまらん人生だったさ。',
        '子どもの頃はそりゃあ冴えない男で、モテた事なんて一度もなかった。',
        'だから俺は、いい仕事をして、結婚して見返してやろうと頑張ったんだ。',
        'そうしたら体を悪くして呆気なく逝っちまったんだ。',
        'くだらん人生だろう？',
        '俺は何のために生まれてきたんだろうな？',
        'そんな気持ちだから俺は成仏できずにいるんだ。',
        'なあ。俺は女の子と手もつないだ事もなく死んだんだ。',
        '惨めだろう？',
        'こんな俺を可哀想に思ってくれるなら俺の願いを一つ聞いてほしい。',
        'あ、あんたの体を俺の好きなように触らせてくれ。',
        'そ、そうれば俺はきっと成仏できるんだ！',
        'どうか頼む！'
      ],
      options: ['嫌だ', 'いいよ'],
      answer1: ['そうか…。死んでもモテないんだな…、俺は…。'],
      answer2: [
        'ほ、本当か！？',
        'じゃ、じゃあいくぞ…。',
        '………。',
        '…あれ？',
        '…触れない。',
        'まあ、俺幽霊だもんな。',
        '………。'
      ],
      complete: [
        'ああ。なんだか今全てに諦めがついたよ。',
        '悟りを開いた気分さ。',
        'おお。このままあの世へ行けそうだ。',
        '………。',
        'なあ。俺の人生はつまらなかったが、',
        '俺は確かにここで生きていたんだ。',
        '惨めな俺がここにいた事をどうか覚えていておくれ。',
        'さようなら'
      ]
    },
    matsutake: {
      start: [
        'この炭坑の外の森には松茸という高級なキノコが生えているらしい。',
        'しかし見ての通り俺達はこういう身分だ。',
        '高級な食べ物なんて一生食えずに死んでゆくのさ。',
        '俺はここの労働者たちの中でもかなり歳を食っている身だ。',
        'ここでの寿命を考えればもう5年も経てば働けなくなって、捨てられて、そのまま野垂れ死ぬのさ。',
        'あんまりにも惨めだろう？',
        'だがもう絶望することにも飽きたさ。',
        'わめいたってどうにもならん。',
        'なあ姉ちゃん。',
        '一つわがままを言うと俺は死ぬ前に一度でいいから美味いもんを食いたい。',
        '松茸を一つ俺のために採って来てくれないか？',
        'ただでとは言わない。',
        'このリンゴ、さっき見張りからくすねたんだ。',
        '松茸とは釣り合わんだろうが、俺にはこれが限界だ。',
        'どうか俺の最後のわがままを叶えてくれ。'
      ],
      started: ['松茸を1個だ。どうか頼んだぞ。'],
      options: ['松茸を1個渡す', '渡さない'],
      log: '松茸を1個あげた',
      complete: [
        'おお！これが松茸か！',
        'じゃあさっそくいただこう。',
        '………。',
        'う、美味い！！！',
        '美味いぞ！！！',
        'この香りは…！',
        '貴族になった気分だあああーーー！！！',
        '………。',
        'ふぅ。',
        '高級とはいえたかがキノコだろ、と思っていたが、',
        '予想以上に美味かったぞ。',
        '仲間の一人は、',
        '「高級だから美味いと錯覚してるだけで実際大したことない」',
        'などと言っていたが、',
        'あいつはただの貧乏舌の馬鹿舌だったようだな。',
        'とにかく、こんな美味いものを食えたんだ。もう俺の人生に悔いわないぜ。',
        'ありがとうよ。',
        '約束のお礼だ。'
      ],
      completed: ['あんな美味いものを食えたんだ。もう俺の人生に悔いわないぜ。']
    },
    painter: {
      start: [
        'ご存知の通りここはタコ部屋労働のようなところです。',
        '僕はここへ連れてこられる前、絵描きをしていました。',
        '絵を描くのは好きだったんですが、商売としてはうまくいきませんでした。',
        'もともと家が貧しかったのもあって生活は少し苦しかったんです。',
        '一時期はヤケになって自分の絵をビリビリに破り捨ててしまったことだってありました。',
        'それでも何とか生活を続けてきました。',
        'そんなある日、母親が体調を崩して寝込んでしまいました。',
        'すぐに病院へ連れて行こうとしましたが、母は医療費を気にしてか断りました。',
        '「こんなのは寝ていれば治る。私は大丈夫だから、アンタは仕事続けなさい」と。',
        '確かに病院へ通えるだけのお金はありませんでした。',
        '僕はただの風邪かなんかだと思う事にして、母の言うとおり絵を描き続けました。',
        'しかし、母は日に日にやつれていき、ついには声を出すのもやっとという状態になっていたのです。',
        '僕はただただ不甲斐無いばかりで、いつにも増して必死に絵を描きましたが、やはり売れる事はありません。',
        'やむなく僕は高利貸しから医療費を借りたのです。',
        'そうして母を入院させました。',
        'お金のことを心配する母には「ついに絵が評価されて売れ始めた」と嘘を吐きました。',
        '母は心底嬉しそうな顔をしていました。',
        '………。',
        '…やがて母は亡くなってしまいました。',
        '母が使っていた箪笥を整理しようと開けると、中には沢山の紙片が入っていました。',
        '…僕が昔ヤケになってビリビリに破って捨てたはずの絵でした。',
        '母はいつも言っていました。',
        '「アンタの夢が叶う事が、私の夢だから、諦めずに続けなさい」と。',
        '僕は今も時間を見つけては絵を描き続けています。',
        'でも僕は一生働いてもここから出しては貰えないでしょう。',
        'そこでお願いです。この絵を代わりに売って来て貰えないでしょうか？'
      ],
      talked: ['お願いです。この絵を代わりに売って来て貰えないでしょうか？'],
      options: ['いいですよ', 'いやです'],
      answer1: [
        'ありがとうございます！',
        '秋の森を抜けた先にお屋敷があります。',
        'そこへ持って行ってみて下さい。',
        'では、よろしくお願いします。'
      ],
      answer2: ['…そうですか。'],
      started: [
        '秋の森を抜けた先にお屋敷があります。',
        'そこへ持って行ってみて下さい。'
      ],
      lost: ['ちょっと。ちゃんと持って行って下さいよ。'],
      complete: [
        'え！？僕の絵が売れたんですか！？',
        'やった！！',
        'よかった…。',
        '…ああ、…よかった。',
        '…うう、すみません。',
        '嬉しくて、つい涙が…。',
        'お金はあなたが全額貰って下さい。',
        'この度は本当にありがとうございました。'
      ],
      completed: ['本当にありがとうございました。']
    },
    collector: {
      start: [
        '俺は絵画を集めるのが趣味なんだ。',
        'いい絵があったら俺のところへ持ってきてくれ。',
        '高く買ってやる。'
      ],
      options: ['この絵を買ってほしい', 'なんでもない'],
      solve1: ['見せてみろ。'],
      log: '『恋』を渡した',
      solve2: [
        'ふむ。悪くないな。',
        'よし、買ってやろう。',
        'ほらよ。'
      ],
      solved: ['この前の絵描きによろしく言っておいてくれ。']
    },
    child: {
      start: [
        'ねえ、お姉ちゃん。',
        '森の奥の炭鉱で働いてるおじちゃんたちのこと知ってる？',
        '毎日ずうっと働いてるんだよ。',
        'それでね、僕たちの生活はそのおじちゃんたちのおかげなんだって。',
        'だから僕ね、おじちゃんたちにお礼言いに行こうと思ったんだけど、',
        'ママが行っちゃいけないって言うんだ。',
        'だからねお姉ちゃん、',
        '代わりに「いつもありがとう」って伝えてきてほしいんだ。'
      ],
      options: ['いいよ', 'やだ'],
      answer1: [
        'ほんとに！？',
        'じゃあさ、この絵も持って行ってね！',
        '頑張ってるおじちゃんたちを描いたんだ！',
        '喜んでくれるかなぁ？',
        'じゃ！頼んだよ！'
      ],
      answer2: ['いじわる。'],
      started: ['僕の絵、炭鉱のおじちゃんたちにちゃんと届けてね！'],
      lost: ['ちょっと！ちゃんと持って行ってよ！'],
      complete1: [
        'あ、お姉ちゃん！',
        '絵を渡してきてくれたんだね！',
        'ありがとう！これ、お礼だよ！'
      ],
      complete2: ['じゃあね！'],
      completed: ['この前はありがとう！']
    },
    miner: {
      greet: ['あ？なんか用かい？'],
      options: ['絵を渡す', 'なんでもない'],
      log: '『頑張る炭坑夫』を渡した',
      solve: [
        'お屋敷のガキがお礼だって？',
        'ケッ、イイ御身分だぜ。',
        '絵なんて貰ったって俺たちの腹は膨れねえんだよ。',
        '…ん？',
        'お、この絵を収めてるフレームは中々高く売れそうだな。',
        'よしよし、久しぶりに腹いっぱい食えそうだ。',
        '姉ちゃん、ガキにまた描いてくれるよう頼んどいてくれよ。',
        'じゃあな。'
      ],
      regain: {
        options1: ['さっき前の絵、自分が買い取る', 'なんでもない'],
        start: [
          'あんたが買い取るって？',
          'まあいいだろう。',
          'じゃあ宝石を4種類集めてこい。',
          'それと交換だ。'
        ],
        options2: ['宝石4種を渡す', 'なんでもない'],
        logs: [
          'サファイヤを1個あげた',
          'エメラルドを1個あげた',
          'アメジストを1個あげた',
          'ルビーを1個あげた'
        ],
        complete: [
          'よし、持ってきたな。',
          'ありがとうよ。',
          'じゃあな。'
        ]
      }
    },
    lady1: {
      start: [
        '女の魅力は「美しさ」よ。',
        'そして、この世で一番美しいのは私。',
        'そう、隣の部屋の性悪女よりもね。',
        'でもね、私にも時が経てば老いが来るの。',
        'そうしたらやがて若い女たちに負けてしまうわ。',
        'そんなの御免よ。',
        '私は大金持ちなんだから、いつまでも一番であるべきだわ。',
        'そこで調べさせたの。',
        '外の森を西に抜けた先に今は使われていない病院があるのを知ってる？',
        'その病院では、どうやら不老不死の薬が開発されていたらしいの。',
        '今も病院のどこかに隠されているという噂よ。',
        'だからあなた、それを探してきてちょうだい。',
        'お礼はたっぷりとあげるわ。'
      ],
      started: [
        '病院では、どうやら不老不死の薬が開発されていたらしいの。',
        '今も病院のどこかに隠されているという噂よ。',
        'だからあなた、それを探してきてちょうだい。',
        'お礼はたっぷりとあげるわ。'
      ],
      options: ['不老不死の薬を1個渡す', '渡さない'],
      log: '不老不死の薬を1個あげた',
      solve1: [
        'これが不老不死の薬ね！？',
        'さっそく使ってみるわ。',
        '………。'
      ],
      solve2: [
        '！！',
        'お肌のつやがいつにも増して良くなった気がするわ！',
        'この若さが永遠に続くのね！！',
        'あなた、よくやったわ！',
        'これはお礼よ！'
      ],
      solved: [
        'あなた、よくやったわ！',
        '私は永遠の一番よ！'
      ]
    },
    lady2: {
      greet: ['隣の部屋の勘違い女、気に入らないわ。'],
      start: [
        '隣の部屋の勘違い女、不老不死の薬とやらを手に入れたらしいの。',
        'あー、気に入らないわ。',
        'ねえ、あなた、',
        'あの女を殺してきてちょうだい。',
        '不老不死だなんて言ったって、',
        '鉄砲なんかで殺されてしまえばそれまででしょう？',
        '馬鹿な女ね。'
      ],
      started: [
        '何よその顔は？',
        'さっさと行きなさいよ。',
        '私は、あの女があなたにあげたお礼よりも、',
        'あなたがもっと欲しがっているものをお礼としてあげるわ。'
      ],
      complete1: [
        'よくやったわ。',
        'お礼をあげるわ。'
      ],
      complete2: [
        '永遠の若さなんてものはありえないのよ。',
        '私たちは有限だからこそ美しいのに。',
        'それに気付かないなんて哀れな女ね。'
      ],
      completed: ['うるさいのが消えてせいせいしたわ。']
    },
    forever: {
      ghost: {
        start: [
          'あなた、私が見えるんですね！？',
          'ああ、では是非お願いしたい事があります。',
          '私の話を聞いて頂けますでしょうか？'
        ],
        options: ['はい', 'いいえ'],
        answer1: [
          'よかった。',
          '私は見ての通り死んでいます。',
          '生きていた頃はこの病院に入院していました。',
          'その頃、私の夫は毎日お見舞いに来て、私の手を握ってくれていたのです。',
          '私は不治の病にかかっていて、長く生きられない事を夫も私も分かっていました。',
          'でも夫はいつだって「ずっとそばに居るよ」と私を励ましてくれていたんです。',
          'しかし、やがて病状は悪化し、いよいよ自分の死が目前に迫りました。',
          '私はもう怖くてたまりません。',
          '私の手を握る夫にこう聞きました。',
          '「…ずっと、…そばに居てくれますか？」と。',
          '夫は「約束するよ」と答えてくれました。',
          'それを聞くと私はとても安心したのです。',
          '私が死んだのはその晩のことでした。',
          'それから気付いた時には私はこの姿で病院を彷徨っていました。',
          '私は天国には行かなかったのです。',
          '夫が居なかったからです。',
          'ずっとそばに居ると約束したはずの夫が居ないんです。',
          '約束を忘れてしまったのでしょうか？',
          '私はここでずっと待っているというのに…。',
          'そこでお願いです。',
          '夫を私の元へ連れて来て下さい。',
          '夫はトレントです。',
          '病院の外の森で暮らしているはずです。',
          'ですが、まだ生きています。',
          '生きていては私と一緒に天国へ行く事はできません。',
          'わかりますね？',
          'あなただけが頼りなんです。',
          'では、よろしくお願いします。'
        ],
        answer2: ['そうですか…。'],
        started: [
          '夫はトレントです。',
          '夫は病院の外の森で暮らしているはずです。',
          'ですが、まだ生きています。',
          '生きていては私と一緒に天国へ行く事はできません。',
          'わかりますね？',
          'あなただけが頼りなんです。',
          'では、よろしくお願いします。'
        ],
        complete1: [
          'あ！あなたは！',
          'ありがとうございました。',
          '夫をこちらへ連れて来てくれたんですね。',
          '夫は先に天国へ行ったようなので私ももう行きます。',
          'これはお礼です。'
        ],
        complete2: [
          '本当に、どうもありがとうございました。',
          'では、さようなら。'
        ]
      },
      torrent: {
        greet: [
          '私は昔、妻を亡くしました…。',
          'でも今では私も前向きに頑張っています。'
        ],
        start1: [
          'え？',
          '私の妻の幽霊に会ったって？',
          '悪い冗談はやめてくださいよ。',
          '…え？',
          '私に妻の元へ行くように頼まれたって？',
          'ちょ、ちょっと待って下さい。',
          '私は、御覧の通りまだ生きているんですよ？',
          '………。',
          'か、勘弁して下さい。',
          '私はまだ死にたくありません。',
          '別の方と再婚をして長生きをしたいんです。'
        ],
        start2: ['…とにかく、そんなおっかない事は言わないでください。']
      }
    },
    brain: {
      message: 'アミリさんの頭の中は、アミリさんでいっぱいですね。',
      kajitsu1: [
        'どうです？ショックですか？',
        '人間というのはそういうものです。',
        '残念ながら、この世界に貴方の居場所はありません。'
      ],
      kajitsu2: [
        'これで決心はつきましたね？',
        '今の貴方ならこの世界を出ていくことが出来るでしょう。'
      ],
      kajitsu3: [
        '心臓の部屋で待っています。',
        '準備が出来たら来てください。'
      ],
      kajitsu4: [
        'ここから出て行き、アミリさんを解放してあげましょう。'
      ]
    }
  }
}
