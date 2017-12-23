enchant(); // ライブラリーの初期化

window.onload = function () {
    var game = new Game(320, 568); // 画面サイズ(Canvas)を作成  
    game.fps = 30; // フレームレートの設定。30fpsに設定



    // 画像データをあらかじめ読み込ませる
    game.preload("./images/ball.png", "./images/blockRED.png", "./images/blockYELLOW.png", "./images/btnkatamuki_OFF.png", "./images/btnkatamuki_ON.png"
        , "./images/btnClose_ON.png", "./images/btnSwitch_ON.png", "./images/btnStart_ON.png", "./images/btnTittle_ON.png"
        , "./images/btnPouse_ON.png", "./images/btnPouse_OFF.png", "./images/btnRanking_ON.png", "./images/btnRetry_ON.png", "./images/btnSend_ON.png", "./images/btnSaikai_ON.png", "./images/btnRule_ON.png"
        , "./images/btnClose_OFF.png", "./images/btnSwitch_OFF.png", "./images/btnStart_OFF.png", "./images/btnTittle_OFF.png", "./images/btnSound_ON.png", "./images/btnSound_OFF.png"
        , "./images/btnRule_OFF.png", "./images/btnRanking_OFF.png", "./images/btnRetry_OFF.png", "./images/btnSend_OFF.png", "./images/btnSaikai_OFF.png"
        , "./images/GameBack.png", "./images/GameBackSP.png", "./images/lblGo.png", "./images/lblReady.png", "./images/lblRanking.png", "./images/lblWeeklyRanking.png", "./images/lblMonthlyRanking.png"
        , "./images/line.png", "./images/logo1.png", "./images/pad.png", "./images/padSP.png", "./images/Logo.png", "./images/RankBack.png", "./images/SP.png"
        , "./images/pad2.png", "./images/sakana.png", "./images/Score1.png", "./images/Score2.gif", "./images/Tittle.png", "./images/pouse.png", "./images/ManualBack.png", "./images/loading.gif");
    const block_red = "./images/blockRED.png";
    const block_yellow = "./images/blockYELLOW.png";

    //BGM
    game.preload(['./sound/cat.mp3', './sound/blueglass.mp3', './sound/endCall.mp3', './sound/tittleCall.mp3', './sound/retryCall.mp3'
        , './sound/happyCall.mp3', './sound/ruleCall.mp3', './sound/title_BGM.mp3', './sound/ReadyGo.mp3', './sound/Bgm_Title.mp3', './sound/cancel1.mp3', './sound/cancel2.mp3'
        , './sound/50combo.mp3', './sound/100combo.mp3', './sound/150combo.mp3', './sound/bar.mp3', './sound/block.mp3', './sound/zannen.mp3', './sound/zenkeshi.mp3']);

    //mobile backendのAPキーとCLキー
    const ApKey = "";
    const ClKey = "";


    //ソースのバージョン
    const version = 0.1;
    //ゲームの制限時間
    const limitTime = 60;
    // スコアのローカルストレージ
    const localStorageScore = 'MonyancoScore';
    // 名前のローカルストレージ
    const localStorageName = 'MonyancoName';
    // 背景色
    const BackGroundColor = '#ffefd5';
    // フレームカウント
    var frmCount = 0;
    // ブロックの総数を入れるカウンタ変数
    var blockCount = 0;
    // ブロックを格納する配列
    var block = new Array();
    // 消したブロックの総数を入れる変数
    var blockDelCount = 0;
    // コンボカウント
    var combo = 0;
    // ベストスコア
    var bestScore = 0;
    // 加速度切り替えボタンフラグ
    var AcceFlg = false;
    // サウンド切り替えボタンフラグ
    var SoundFlg = true;
    // ゲーム開始フラグ
    var GameStart = false;
    // アイテム発生ブロックの個数
    var ItemBlockCount = 0;
    //ランキング設定の配列
    var rankArraySet = new Array();
    //デイリーランキングの配列
    var rankDairyArrayGet = new Array();
    //自身のデイリーランキング
    var myDairyRank = 0;
    //マンスリーランキングの配列
    var rankMonthlyArrayGet = new Array();
    //自身のマンスリーランキング
    var myMonthlyRank = 0;
    // 表示するランキング(0:デイリー、1:マンスリー)
    var RankingKbn = 0;
    //アクセルログ送信フラグ
    var AccessLogSendFlg = false;
    //リトライフラグ
    var RetryFlg = false;
    //スキル発動フラグ
    var SkillFlg = false;
    //スタートクリックフラグ
    var StartClick = false;
    //反射フラグ
    var ReflectionFlg = true;



    // スマホの画面のサイズとゲームの画面のサイズを合わせるため
    var scale_h = window.innerHeight / 568;
    var scale_w = window.innerWidth / 320;
    if (scale_h >= scale_w) {
        game.scale = scale_w;
    } else {
        game.scale = scale_h;
    }

    //enchant.js ロード画面処理
    var loadScene = new Scene();
    game.loadingScene = loadScene;
    loadScene.addEventListener('progress', function (e) {
        var loadImg = new Sprite(100, 100);
        loadImg.image = game.assets['./images/loading.gif'];
        loadImg.x = (game.width - loadImg.width) / 2; // X座標
        loadImg.y = (game.height - loadImg.height) / 2;// Y座標   
        loadScene.addChild(loadImg);
    });
    loadScene.addEventListener('load', function (e) {
        var core = enchant.Core.instance;
        core.removeScene(core.loadingScene);
        core.dispatchEvent(e);
    });


    setTimeout(function () {
        //iPhone,iPad,iPod Touch,Androidの場合のみ、スプラッシュを処理
        if (navigator.userAgent.indexOf('iPhone') > 0 || navigator.userAgent.indexOf('iPad') > 0 || navigator.userAgent.indexOf('iPod') > 0 || navigator.userAgent.indexOf('Android') > 0) {
            navigator.splashscreen.hide();
        }


        // データの読み込みが完了したら処理  
        game.onload = function () {

            /**
            * タイトルシーン
            *
            * タイトルシーンを作り、返す関数です。
            */
            var createStartScene = function () {

                //AccessLog();
                //VersionCheck();
                RetryFlg = false;
                StartClick = true;


                if (SoundFlg) {
                    var titlecall = game.assets['./sound/tittleCall.mp3'].clone();
                    if (SoundFlg) { titlecall.play(); }

                    //                    var title_BGM = game.assets['./sound/title_BGM.mp3'].clone();
                    var title_BGM = game.assets['./sound/Bgm_Title.mp3'].clone();
                    if (SoundFlg) { title_BGM.play(); }

                }


                var scene = new Scene();                                // 新しいシーンを作る
                scene.backgroundColor = BackGroundColor;//背景色


                // 背景画像設定
                var startImage = new Sprite(320, 480);                  // スプライトを作る                        
                startImage.image = game.assets['./images/Tittle.png'];     // スタート画像を設定

                scene.addChild(startImage);                             // シーンに追加
                startImage.x = (game.width - startImage.width) / 2; // X座標
                startImage.y = (game.height - startImage.height) / 2;// Y座標        


                // Logo画像設定
                var logoImage = new Sprite(300, 110);                  // スプライトを作る                        
                logoImage.image = game.assets['./images/Logo.png'];     // スタート画像を設定
                scene.addChild(logoImage);                             // シーンに追加
                logoImage.x = (game.width - logoImage.width) / 2; // X座標
                logoImage.y = 70; // Y座標

                // ヴァージョン表示
                var versionLabel = new Label("");
                versionLabel.text = "Ver. " + version;
                versionLabel.font = "10px Nikumaru";
                versionLabel.color = "black";
                versionLabel.x = 240; // X座標
                versionLabel.y = 180; // Y座標
                scene.addChild(versionLabel);


                // startボタン設定
                var start = new Sprite(130, 50);                  // スプライトを作る                        
                start.image = game.assets['./images/btnStart_ON.png'];     // START画像を設定     
                scene.addChild(start);                                  // シーンに追加
                start.x = (game.width - start.width) / 2;                                           // 横位置調整
                start.y = 200;                                           // 縦位置調整

                // サウンド画像
                var SoundImage = new Sprite(130, 50);                  // スプライトを作る                        

                if (SoundFlg == false) {
                    SoundImage.image = game.assets['./images/btnSound_OFF.png'];     // 画像を設定
                } else {
                    SoundImage.image = game.assets['./images/btnSound_ON.png'];
                }

                scene.addChild(SoundImage);                             // シーンに追加
                SoundImage.x = 0;
                SoundImage.y = game.height - SoundImage.height;


                // サウンド画像にタッチイベントを設定
                SoundImage.addEventListener(Event.TOUCH_END, function (e) {

                    if (SoundFlg == false) {
                        SoundFlg = true;
                        SoundImage.image = game.assets['./images/btnSound_ON.png'];     // 画像を設定
                        title_BGM.play();
                    } else {
                        SoundFlg = false;
                        SoundImage.image = game.assets['./images/btnSound_OFF.png'];
                        title_BGM.stop();
                    }

                });

                // 加速度センタ画像
                var AcceImage = new Sprite(130, 50);                  // スプライトを作る                        

                if (AcceFlg == false) {
                    AcceImage.image = game.assets['./images/btnkatamuki_OFF.png'];     // 加速度センタ画像を設定
                } else {
                    AcceImage.image = game.assets['./images/btnkatamuki_ON.png'];
                }

                scene.addChild(AcceImage);                             // シーンに追加
                AcceImage.x = game.width - AcceImage.width;
                AcceImage.y = game.height - AcceImage.height;

                // 加速度センタ画像にタッチイベントを設定
                AcceImage.addEventListener(Event.TOUCH_END, function (e) {

                    if (AcceFlg == false) {
                        AcceFlg = true;
                        AcceImage.image = game.assets['./images/btnkatamuki_ON.png'];     // 加速度センタ画像を設定
                    } else {
                        AcceFlg = false;
                        AcceImage.image = game.assets['./images/btnkatamuki_OFF.png'];
                    }

                });
                // 遊び方ボタン
                var RuleBtn = new Sprite(130, 50);                  // スプライトを作る                        
                RuleBtn.image = game.assets['./images/btnRule_ON.png'];     // 画像を設定     
                scene.addChild(RuleBtn);                                  // シーンに追加
                RuleBtn.x = game.width - RuleBtn.width;                                          // 横位置調整
                RuleBtn.y = AcceImage.y - RuleBtn.height;;                                          // 縦位置調整

                RuleBtn.addEventListener(Event.TOUCH_START, function (e) {
                    RuleBtn.image = game.assets['./images/btnRule_OFF.png'];
                });
                RuleBtn.addEventListener(Event.TOUCH_END, function (e) {
                    RuleBtn.image = game.assets['./images/btnRule_ON.png'];
                    if (SoundFlg) {
                        var rulecall = game.assets['./sound/ruleCall.mp3'].clone();
                        if (SoundFlg) { rulecall.play(); }
                    }

                    game.pushScene(createManualScene());
                });

                // スタートボタンにタッチイベントを設定
                start.addEventListener(Event.TOUCH_START, function (e) {
                    start.image = game.assets['./images/btnStart_OFF.png'];
                });
                start.addEventListener(Event.TOUCH_END, function (e) {

                    if (StartClick) {
                        title_BGM.stop();
                        // 現在表示しているシーンをゲームシーンに置き換える
                        game.replaceScene(createGameScene(AcceFlg, SoundFlg));
                    } else { showAlert('最新バージョンに\r\nアップデートしてください。', 'エラー'); }
                    start.image = game.assets['./images/btnStart_ON.png'];
                });

                //BGMループ
                scene.addEventListener(Event.ENTER_FRAME, function () {
                    if (SoundFlg) { title_BGM.play(); }
                });



                // タイトルシーンを返します。
                return scene;

            };


            /**
            * ゲームシーン
            *
            * ゲームシーンを作り、返す関数です。
            */
            var createGameScene = function (AcceFlg, SoundFlg) {

                // 新しいシーンを作る
                var scene = new Scene();
                scene.backgroundColor = BackGroundColor;

                GameStart = false;
                SkillFlg = false;

                combo = 0; //コンボカウント初期化

                if (SoundFlg) {
                    var BGM = game.assets['./sound/blueglass.mp3'].clone();
                    var CAT = game.assets['./sound/cat.mp3'].clone();
                    var ReadyGo_sound = game.assets['./sound/ReadyGo.mp3'].clone();
                    var bar_sound = game.assets['./sound/bar.mp3'].clone();
                    var block_sound = game.assets['./sound/block.mp3'].clone();
                    var zenkeshi_sound = game.assets['./sound/zenkeshi.mp3'].clone();
                }

                //背景画像
                var GameBackImage = new Sprite(320, 568);
                GameBackImage.image = game.assets["./images/GameBack.png"];
                GameBackImage.x = (game.width - GameBackImage.width) / 2; // X座標
                GameBackImage.y = (game.height - GameBackImage.height) / 2; // Y座標 
                scene.addChild(GameBackImage);


                scene.score = 0;  // スコアを入れる変数を用意する
                // スコアを表示するラベルを作成
                var scoreLabel = new Label("すこあ：0");
                scoreLabel.font = "20px Nikumaru";
                scoreLabel.color = "green";
                scoreLabel.x = 30; // X座標
                scoreLabel.y = 60; // Y座標
                scene.addChild(scoreLabel);


                //ローカルストレージから最高スコア取得
                //localStorage.removeItem(localStorageScore); //スコア初期化
                bestScore = localStorage[localStorageScore];
                if (bestScore == null) {
                    bestScore = 0;
                }

                //3桁区切り
                var IntBest = new String(bestScore);
                while (IntBest != (IntBest = IntBest.replace(/(\d)((\d\d\d)+\b)/, '$1,$2')));

                // ベストスコアを表示するラベルを作成
                var bestScoreLabel = new Label("べすと：" + IntBest);
                bestScoreLabel.font = "20px Nikumaru";
                bestScoreLabel.color = "red";
                bestScoreLabel.x = 30; // X座標
                bestScoreLabel.y = scoreLabel.y - 20; // Y座標
                scene.addChild(bestScoreLabel);

                //タイマー機能
                var time = limitTime;
                var timeLabel = new Label("たいむ：" + time);
                timeLabel.font = "20px Nikumaru";
                timeLabel.color = "green";
                timeLabel.x = 180; // X座標
                timeLabel.y = scoreLabel.y; // Y座標
                scene.addChild(timeLabel);


                // 時間のプラスマイナス
                var timePlusMinusLabel = new Label("");
                timePlusMinusLabel.font = "15px Nikumaru";
                timePlusMinusLabel.color = "red";
                timePlusMinusLabel.x = 285; // X座標
                timePlusMinusLabel.y = scoreLabel.y - 5; // Y座標
                scene.addChild(timePlusMinusLabel);
                timePlusMinusLabel.frame = 0;
                timePlusMinusLabel.addEventListener(enchant.Event.ENTER_FRAME, function () {

                    var progress = parseInt(timePlusMinusLabel.frame / game.fps, 10);
                    if (timePlusMinusLabel.text != "") {
                        var progress = parseInt(timePlusMinusLabel.frame / game.fps, 10);

                        //1秒経過後消す
                        if (progress >= 1) {
                            timePlusMinusLabel.text = "";
                            timePlusMinusLabel.frame = 0;
                        }
                        else { timePlusMinusLabel.frame += 1; }
                    }
                });

                // pouseボタン設定
                var pouse = new Sprite(130, 50);                  // スプライトを作る                        
                pouse.image = game.assets['./images/btnPouse_ON.png'];     // 画像を設定     
                scene.addChild(pouse);                                  // シーンに追加
                pouse.x = game.width - 130;                                       // 横位置調整
                pouse.y = 0; // Y座標
                pouse.scaleX = 0.5;
                pouse.scaleY = 0.5;

                // ポーズにタッチイベントを設定
                pouse.addEventListener(Event.TOUCH_START, function (e) {
                    pouse.image = game.assets['./images/btnPouse_OFF.png'];
                });
                pouse.addEventListener(Event.TOUCH_END, function (e) {

                    if (SoundFlg) { BGM.stop() }
                    pouse.image = game.assets['./images/btnPouse_ON.png'];
                    game.pushScene(createPauseScene());

                });


                // 上部のラインを設定
                var TopLine = new Sprite(180, 2);
                TopLine.image = game.assets["./images/line.png"];
                TopLine.x = (game.width - 180) / 2; // X座標
                TopLine.y = scoreLabel.y + 30; // Y座標            
                TopLine.scaleX = game.width / 180;
                scene.addChild(TopLine);


                // コンボメッセージ
                var comboLabel = new Label("　　 Combo!!");
                comboLabel.font = "40px Nikumaru";
                comboLabel.color = "red";
                comboLabel.x = (game.width - comboLabel._boundWidth) / 2; // X座標
                comboLabel.y = game.height - 150; // Y座標
                scene.addChild(comboLabel);
                comboLabel.text = "";

                // パドルの設定
                var pad = new Sprite(90, 42);
                //pad.image = game.assets["./images/pad.png"];
                //↑一時的にコメントアウト iwai 2016/07/08
                //↓一時的に追加　　　　　 iwai 2016/07/08
                pad.image = game.assets["./images/pad2.png"];
                pad.x = (game.width - 90) / 2; // X座標
                pad.y = game.height - 100; // Y座標
                scene.addChild(pad);
                pad.frame = 0;
                pad.addEventListener(enchant.Event.ENTER_FRAME, function () {

                    if (SkillFlg) {
                        var progress = parseInt(pad.frame / game.fps, 10);

                        //3秒経過後戻す
                        if (progress >= 3) {
                            pad.frame = 0;
                            pad.image = game.assets["./images/pad2.png"];
                            GameBackImage.image = game.assets["./images/GameBack.png"]
                            SkillFlg = false;
                        }
                        else { pad.frame += 1; }
                    }
                });


                // ボールの設定
                var ball = new Sprite(37, 37);
                ball.image = game.assets["./images/ball.png"];
                ball.x = pad.x + (pad.width / 2) - (ball.width / 2);  // X座標
                ball.y = pad.y - ball.height; // Y座標
                ball.dx = 2; // X方向の移動量
                ball.dy = 3; // Y方向の移動量
                ball.speed = 3;  // ★★ボールの速さ
                scene.addChild(ball);

                // 右下の魚の設定
                var sakana = new Sprite(43, 33);
                sakana.image = game.assets["./images/sakana.png"];
                sakana.x = 2; // X座標
                sakana.y = game.height - 45; // Y座標
                scene.addChild(sakana);

                //取得した魚の数
                var sakanaCount = 0
                var sakanaCountView = new Label("×" + sakanaCount);
                sakanaCountView.font = "20px Nikumaru";
                sakanaCountView.color = "green";
                sakanaCountView.x = 45; // X座標
                sakanaCountView.y = game.height - 30; // Y座標
                scene.addChild(sakanaCountView);



                // ブロックを描く
                blockCount = 0; // ブロックの総数を示すカウンタを0にする
                ItemBlockCount = 0;

                for (var y = 0; y < 8; y++) {
                    for (var x = 0; x < 7; x++) {
                        block[blockCount] = new Sprite(40, 15);
                        block[blockCount].image = random_block();
                        block[blockCount].x = (x * 45) + ((game.width - (7 * 45)));  // X座標
                        block[blockCount].y = (y * 30) + scoreLabel.y + 70; // Y座標
                        scene.addChild(block[blockCount]);
                        blockCount = blockCount + 1; // ブロックの総数を示すカウンタを増やす
                    }
                }

                blockDelCount = blockCount; // 消すブロックの総数を変数に入れる


                // READY
                var READY = new Sprite(410, 135);
                READY.image = game.assets["./images/lblReady.png"];
                READY.x = (game.width - 410) / 2; // X座標
                READY.y = (game.height - 77) / 2; // Y座標
                scene.addChild(READY);
                READY.onenterframe = function () {
                    this.rotate(1);
                };

                // GO
                var GO = new Sprite(256, 135);
                GO.image = game.assets["./images/lblGo.png"];
                GO.x = (game.width - 256) / 2; // X座標
                GO.y = (game.height - 98) / 2; // Y座標
                scene.addChild(GO);
                GO.opacity = 0.0;  // ※ 透過


                frmCount = 0;


                // フレームイベントが発生したら処理
                scene.addEventListener(Event.ENTER_FRAME, function () {

                    movePaddle(); // パドルを移動させる

                    if (!GameStart) {
                        if (RetryFlg == false) { //リトライじゃないときのみ音が鳴る
                            if (SoundFlg) { ReadyGo_sound.play(); }
                        }

                        if (frmCount == 0) {
                            READY.tl.fadeOut((game.fps * 1.5));
                        }
                        if (READY.opacity <= 0.0 && GO.opacity == 0.0) {
                            GO.opacity = 1.0; //表示
                            GO.tl.fadeOut((game.fps * 1));
                            GameStart = true;
                            ReflectionFlg = true;
                        }
                    }

                    frmCount++;

                    //タイマースタート
                    if (GameStart) {
                        GameStart = true;
                        if (SoundFlg) { BGM.play(); }
                        //if((game.frame % game.fps) == 0){
                        if (Math.floor(game.frame % game.fps) == 0) {
                            time--;
                            if (time <= 0) { time = 0; }
                            timeLabel.text = "たいむ：" + time;

                            //のこり10秒
                            if (time <= 10) {
                                timeLabel.color = "Red";
                                timeLabel.text = "たいむ： " + time;

                                //タイムアップ
                                if (time <= 0) {
                                    if (SoundFlg) { BGM.stop(); }
                                    timeLabel.color = "Yellow";
                                    timeLabel.text = "しゅーりょー";
                                    GameStart = false;
                                    //タイムアップ画面呼び出し
                                    game.pushScene(createTimeUpScene(scene.score, bestScore));
                                }
                            }
                        }

                        moveBall();   // ボールを移動させる
                        hitCheck_paddle_ball();  // パドルとボールの接触判定
                        hitCheck_block_ball(); // ボールとブロックの接触判定

                    }


                    // ------------ ■ボールを移動させる -----------------
                    function moveBall() {
                        ball.x = ball.x + ball.dx * ball.speed;  // ★★★X方向の移動量を加算
                        //ball.x = ball.x + ball.dx * 1;  // ★★★X方向の移動量を加算
                        ball.y = ball.y + ball.dy * ball.speed;  // ★★★Y方向の移動量を加算


                        // 画面外かどうか調べる
                        if ((ball.x < 0) || (ball.x > (scene.width - ball.width))) {
                            if (ReflectionFlg) {
                                ball.dx = -ball.dx;

                                //画面内に戻ってくるまで反転させない
                                if ((ball.x < 0) || (ball.x > (scene.width - ball.width))) {
                                    ReflectionFlg = false;
                                }
                            }
                        } else {
                            ReflectionFlg = true;
                        }

                        if (ball.y <= TopLine.y + 5) { ball.dy = -ball.dy; }


                        // ボールが下まで行ったらゲームオーバー
                        if (ball.y > game.height) {
                            retry();
                        }

                    }

                    // ------------ ■リトライ -----------------
                    function retry() {

                        //ボール
                        ball.x = pad.x + (pad.width / 2) - (ball.width / 2);  // X座標
                        ball.y = pad.y - ball.height; // Y座標
                        ball.speed = 3;  // ★★ボールの速さ
                        ball.image = game.assets["./images/ball.png"];

                        //コンボテキスト
                        combo = 0; //コンボカウント初期化
                        comboLabel.text = "";

                        //時間
                        timePlusMinusLabel.text = "-10";
                        time = time - 10; //10秒マイナス
                        //のこり10秒以下
                        if (time <= 10) {
                            if (time <= 0) { time = 0; }
                            timeLabel.text = "たいむ： " + time;
                        } else {
                            timeLabel.text = "たいむ：" + time;
                        }

                        if (SoundFlg) { CAT.play(); }
                    }

                    // ------------ ■パドルを移動させる -----------------
                    function movePaddle() {

                        var n = 0;

                        //加速度センサあり
                        if (AcceFlg == true) {
                            n = game.input.analogX / 4;
                        } else {
                            n = 0;
                        }
                        if (game.input.left) { n = -6; }  // ★★★パドルを左に移動
                        if (game.input.right) { n = 6; }  // ★★パドルを右に移動
                        pad.x = pad.x + n; // パドルを左に移動
                        if (pad.x < 0) { pad.x = 0; }  // 左端かどうか調べる
                        if (pad.x > (scene.width - pad.width)) { pad.x = scene.width - pad.width; }  // 右端かどうか調べる

                        if (GameStart == false) {
                            ball.x = pad.x + (pad.width / 2) - (ball.width / 2);  // X座標
                        }
                    }
                    // ------------ ■パドルとボールの接触判定を行う -----------------
                    function hitCheck_paddle_ball() {
                        if (pad.intersect(ball)) {
                            ball.dy = -ball.dy;  // 接触した場合はボールのY方向の移動量を逆にする
                            //ball.dx = Math.random()*1.5 -1.5;
                            ball.y = pad.y - ball.height - 1; // うまく跳ね返るように調整
                            //↓2016.09.01 iwai 反射テスト
                            //ball.dx = ((ball.x + ball.width / 2 - (pad.x + pad.width / 2)) / 25) * 3;

                            //ボールとパドルの位置の差分を計算
                            var padCenter = pad.x + (pad.width / 2);
                            var ballCenter = ball.x + (ball.width / 2);
                            var diff = padCenter - ballCenter

                            //差分が10px以内であれば角度をつけない
                            //差分が30px以内であれば少し角度をつける
                            //差分が30px以上であれば大きく角度をつける
                            if (diff <= 10 && diff >= -10) { ball.dx = 0; }
                            else if (diff >= 0 && diff <= 30) { ball.dx = -1; }
                            else if (diff <= 0 && diff >= -30) { ball.dx = 1; }
                            else if (diff > 0) { ball.dx = -2; }
                            else if (diff < 0) { ball.dx = 2; }

                            // ★★★一回跳ね返すごとに移動速度を速くする。8倍まで。
                            ball.speed = ball.speed + 0.1;
                            if (ball.speed >= 8) { ball.speed = 8; }
                            if (SoundFlg) { bar_sound.play(); }
                        }
                    }


                    // ------------ ■ブロックとボールの接触判定を行う -----------------
                    function hitCheck_block_ball() {
                        //アイテムの総数分つループ
                        for (var i = 0; i < blockCount; i++) {
                            //if(SoundFlg){block_sound.play();}
                            //接触判定
                            //if (ball.intersect(block[i])){
                            if (block[i].within(ball, ((block[i].width + ball.width) / 2))) {
                                //コンボカウントを増やす
                                combo = combo + 1;
                                comboLabel.text = combo + " こんぼ!!";

                                //スキル発動中は貫通
                                if (SkillFlg == false) {
                                    ball.dy = -ball.dy; // 通常のボールが接触した場合はボールのY方向の移動量を逆にする
                                    //ブロックとパドルの位置の差分を計算
                                    var blockCenter = block[i].x + (block[i].width / 2);
                                    var ballCenter = ball.x + (ball.width / 2);
                                    var diff = blockCenter - ballCenter

                                    //差分が10px以内であれば角度をつけない
                                    //差分が30px以内であれば少し角度をつける
                                    //差分が30px以上であれば大きく角度をつける
                                    if (diff <= 5 && diff >= -5) { ball.dx = 0; }
                                    else if (diff >= 0 && diff <= 10) { ball.dx = -0.5; }
                                    else if (diff <= 0 && diff >= -10) { ball.dx = 0.5; }
                                    else if (diff > 0) { ball.dx = -1; }
                                    else if (diff < 0) { ball.dx = 1; }
                                }

                                var y = block[i].y;
                                block[i].y = -9999;  // 見えない場所に移動
                                blockDelCount = blockDelCount - 1; // 総ブロック数から1を引く
                                //
                                blockimage = block[i]._image._css.replace("url(", "");
                                blockimage = blockimage.replace(")", "");
                                switch (blockimage) {
                                    case block_yellow:
                                        //アイテム出現
                                        new items(block[i].x, y);
                                        scene.score = scene.score + 10; // スコアを加算(10点)
                                        break;
                                    case block_red:
                                        scene.score = scene.score + 10; // スコアを加算(10点)
                                        break;

                                    default:
                                        break;
                                }
                                if (blockDelCount <= 0) {  // 全部消した

                                    if (SoundFlg) { zenkeshi_sound.play(); }
                                    // ブロックを再描画
                                    block.length = 0;
                                    ItemBlockCount = 0;
                                    blockCount = 0; // ブロックの総数を示すカウンタを0にする
                                    // ボールの設定を縦横の数だけ繰り返し生成
                                    for (var y = 0; y < 8; y++) {
                                        for (var x = 0; x < 7; x++) {
                                            block[blockCount] = new Sprite(40, 15);
                                            block[blockCount].image = random_block();
                                            block[blockCount].x = (x * 45) + ((game.width - (7 * 45)));  // X座標
                                            block[blockCount].y = (y * 20) + scoreLabel.y + 70; // Y座標
                                            scene.addChild(block[blockCount]);
                                            blockCount = blockCount + 1; // ブロックの総数を示すカウンタを増やす
                                        }
                                    }
                                    blockDelCount = blockCount; // 消すブロックの総数を変数に入れる
                                    scene.score = scene.score + 500; // スコアを加算(500点)

                                }
                                //コンボ数
                                if (combo == 50) {

                                    if (SoundFlg) {
                                        var combo_sound = game.assets['./sound/50combo.mp3'].clone();
                                        combo_sound.play();
                                    }

                                } else if (combo == 100) {

                                    if (SoundFlg) {
                                        var combo_sound = game.assets['./sound/100combo.mp3'].clone();
                                        combo_sound.play();
                                    }

                                } else if (combo == 150) {

                                    if (SoundFlg) {
                                        var combo_sound = game.assets['./sound/150combo.mp3'].clone();
                                        combo_sound.play();
                                    }

                                }

                            }
                        }
                        //3桁区切り
                        var IntScore = new String(scene.score);
                        while (IntScore != (IntScore = IntScore.replace(/(\d)((\d\d\d)+\b)/, '$1,$2')));
                        scoreLabel.text = "すこあ：" + IntScore;
                    }


                });
                // ------------ ■タッチイベント -----------------
                scene.addEventListener("touchmove", function (e) {
                    pad.x = e.x - (pad.width / 2);
                    //ゲーム開始前
                    if (GameStart == false) {
                        ball.x = pad.x + (pad.width / 2) - (ball.width / 2);  // 常にボールはパドルの上へ
                    }
                });


                // ------------ ■アイテムを移動させる -----------------
                var items = Class.create(Sprite, { //アイテムの定義
                    initialize: function (x, y) {
                        Sprite.call(this, 43, 33);
                        this.image = game.assets["./images/sakana.png"];
                        this.x = x; this.y = y; this.frame = 1;
                        this.addEventListener('enterframe', function () { //アイテムを毎フレーム動かす
                            this.y += 4; //移動速度
                            if (this.y >= scene.height) {
                                this.remove();
                            }
                            if (this.intersect(pad)) { //あたり判定
                                scene.score = scene.score + 100;  // スコアを加算(100点)
                                this.remove();

                                //右下のカウント加算
                                sakanaCount += 1
                                sakanaCountView.text = "×" + sakanaCount
                                if (sakanaCount % 5 == 0) {
                                    if (SkillFlg == false) { SkillFlg = true; game.pushScene(createSkillScene()) };
                                    pad.image = game.assets["./images/padSP.png"];
                                    GameBackImage.image = game.assets["./images/GameBackSP.png"]
                                }
                            }
                        });
                        scene.addChild(this);
                    },
                    remove: function () { scene.removeChild(this); delete this; }
                });

                // ゲームシーンを返す
                return scene;

            };

            /**
            * ゲームオーバーシーン
            *
            * ゲームオーバーシーンを作り、返す関数です。
            * createGameoverScore(※) ※にスコアを入れると画面にスコアが表示されます
            * ※は任意の名前でOKで、カンマ区切りで複数設定できます。
            */
            var createGameoverScene = function (resultScore, bestScore) {

                var scene = new Scene();                                   // 新しいシーンを作る
                scene.backgroundColor = BackGroundColor;//背景色

                //背景画像
                var GameBackImage = new Sprite(320, 568);
                GameBackImage.image = game.assets["./images/GameBack.png"];
                GameBackImage.x = (game.width - GameBackImage.width) / 2; // X座標
                GameBackImage.y = (game.height - GameBackImage.height) / 2; // Y座標 
                scene.addChild(GameBackImage);


                GameStart = false;

                //3桁区切り
                var IntScore = new String(resultScore);
                while (IntScore != (IntScore = IntScore.replace(/(\d)((\d\d\d)+\b)/, '$1,$2')));

                // スコアラベル設定
                var scorelabel = new Label("すこあ：" + IntScore);           // ラベルを作る スコアを代入
                scorelabel.color = 'red';                                      // 文字を黒に
                scorelabel.x = 30; // X座標
                scorelabel.y = 20; // Y座標
                scorelabel.font = '30px Nikumaru';                            // フォント設定
                scene.addChild(scorelabel);                                     // シーンに追加

                //ローカルストレージから名前を取得
                var userName = localStorage[localStorageName];
                if (userName == null) {
                    userName = "名前を入力してください";
                }

                //名前入力
                var input = new Entity();
                input.width = 150;
                input.height = 30;
                input.x = 30; // X座標
                input.y = 50;// Y座標
                input._element = document.createElement('input');
                input._element.setAttribute("name", "myText");
                input._element.setAttribute("type", "text");
                input._element.setAttribute("value", userName);
                scene.addChild(input);

                // 名前入力にタッチイベントを設定
                input.addEventListener(Event.TOUCH_START, function (e) {
                    if (input._element.value == "名前を入力してください") {
                        //名前の入力箇所をブランクに
                        input._element.setAttribute("value", "");
                    }
                });

                // スコア送信ボタン設定
                var sendScoreBtn = new Sprite(130, 50);                  // スプライトを作る                        
                sendScoreBtn.image = game.assets['./images/btnSend_ON.png'];     // START画像を設定     
                scene.addChild(sendScoreBtn);                                  // シーンに追加
                sendScoreBtn.x = 30;
                sendScoreBtn.y = input.y + 40;
                var sendFlg = false; //送信したらtrueにする
                sendScoreBtn.addEventListener(Event.TOUCH_START, function (e) {
                    sendScoreBtn.image = game.assets['./images/btnSend_OFF.png'];
                });
                sendScoreBtn.addEventListener(Event.TOUCH_END, function (e) {
                    sendScoreBtn.image = game.assets['./images/btnSend_ON.png'];
                    if (input._element.value == "" || input._element.value == "名前を入力してください") {
                        showAlert('名前を入力してください', '入力エラー');
                    } else {

                        //アクセスログを送信していれば、スコアの送信が可能
                        if (AccessLogSendFlg) {
                            // スコア送信                
                            sendScore(input._element.value, resultScore);
                            sendScoreBtn.x = 99999;  //送信ボタンを2度押しできないようにする

                            //名前をローカルに保存
                            localStorage.setItem(localStorageName, input._element.value);

                            sendFlg = true;
                        } else {
                            showAlert('スコア送信エラー', 'エラー');
                        }
                    }
                });

                //ランキングの取得(データの取得にタイムラグがあるため、事前に取得しておく)
                //getRanking(0, false);
                //getRanking(1, false);

                // ランキングボタン設定
                var rankListBtn = new Sprite(130, 50);                  // スプライトを作る                        
                rankListBtn.image = game.assets['./images/btnRanking_ON.png'];     // 画像を設定     
                scene.addChild(rankListBtn);                                  // シーンに追加
                rankListBtn.x = sendScoreBtn.width + 40;
                rankListBtn.y = input.y + 40;

                // ランキング表示ラベルにタッチイベントを設定
                rankListBtn.addEventListener(Event.TOUCH_START, function (e) {
                    rankListBtn.image = game.assets['./images/btnRanking_OFF.png'];
                });
                rankListBtn.addEventListener(Event.TOUCH_END, function (e) {
                    rankListBtn.image = game.assets['./images/btnRanking_ON.png'];
                    game.pushScene(createRanking());
                });


                //最高スコア更新
                if (resultScore > bestScore) {


                    // 喜んでいる猫
                    var scoreImage = new Sprite(260, 210);                  // スプライトを作る                        
                    scoreImage.image = game.assets['./images/Score2.gif'];     // 画像を設定

                    scene.addChild(scoreImage);                             // シーンに追加
                    scoreImage.x = (game.width - scoreImage.width) / 2; // X座標
                    scoreImage.y = 300; // Y座標

                    //スコアをローカルに保存
                    localStorage.setItem(localStorageScore, resultScore);

                    if (SoundFlg) {
                        var Happycall = game.assets['./sound/happyCall.mp3'].clone();
                        if (SoundFlg) { Happycall.play(); }
                    }

                } else {

                    if (SoundFlg) {
                        var Zannencall = game.assets['./sound/zannen.mp3'].clone();
                        if (SoundFlg) { Zannencall.play(); }
                    }

                    // 後ろを向いている猫
                    var scoreImage = new Sprite(220, 220);                  // スプライトを作る                        
                    scoreImage.image = game.assets['./images/Score1.png'];     // 画像を設定

                    scene.addChild(scoreImage);                             // シーンに追加
                    scoreImage.x = (game.width - scoreImage.width) / 2 + 20; // X座標
                    scoreImage.y = 300; // Y座標
                }


                // タイトルボタン設定
                var tittleBtn = new Sprite(130, 50);                  // スプライトを作る                        
                tittleBtn.image = game.assets['./images/btnTittle_ON.png'];     // START画像を設定     
                scene.addChild(tittleBtn);                                  // シーンに追加
                tittleBtn.x = sendScoreBtn.x;                                           // 横位置調整
                tittleBtn.y = 150;                          // 縦位置調整
                // リトライラベルにタッチイベントを設定
                tittleBtn.addEventListener(Event.TOUCH_START, function (e) {
                    tittleBtn.image = game.assets['./images/btnTittle_OFF.png'];
                });
                tittleBtn.addEventListener(Event.TOUCH_END, function (e) {
                    tittleBtn.image = game.assets['./images/btnTittle_ON.png'];
                    // 現在表示しているシーンをタイトルシーンに置き換える
                    game.replaceScene(createStartScene());
                });

                // リトライボタン設定
                var RetryBtn = new Sprite(130, 50);                  // スプライトを作る                        
                RetryBtn.image = game.assets['./images/btnRetry_ON.png'];     // 画像を設定     
                scene.addChild(RetryBtn);                                  // シーンに追加
                RetryBtn.x = tittleBtn.width + 40;
                RetryBtn.y = 150;

                // リトライボタンにタッチイベントを設定
                RetryBtn.addEventListener(Event.TOUCH_START, function (e) {
                    RetryBtn.image = game.assets['./images/btnRetry_OFF.png'];
                });
                RetryBtn.addEventListener(Event.TOUCH_END, function (e) {
                    RetryBtn.image = game.assets['./images/btnRetry_ON.png'];
                    if (SoundFlg) {
                        var retrycall = game.assets['./sound/retryCall.mp3'].clone();
                        if (SoundFlg) { retrycall.play(); }
                    }

                    RetryFlg = true;
                    game.replaceScene(createGameScene(AcceFlg, SoundFlg));
                });

                return scene;
            };


            /**
            * マニュアル画面
            */
            var createManualScene = function () {

                var scene = new Scene();
                scene.backgroundColor = BackGroundColor;

                //背景画像
                //var GameBackImage = new Sprite(320, 568);
                //var GameBackImage = new Sprite(339, 612);
                var GameBackImage = new Sprite(678, 1224);
                GameBackImage.image = game.assets["./images/ManualBack.png"];

                GameBackImage.scaleX = 0.5;
                GameBackImage.scaleY = 0.5;

                GameBackImage.x = (game.width - GameBackImage.width) / 2; // X座標
                GameBackImage.y = (game.height - GameBackImage.height) / 2; // Y座標 
                scene.addChild(GameBackImage);

                // 閉じるボタン
                var CloseImage = new Sprite(130, 50);                  // スプライトを作る                        
                CloseImage.image = game.assets['./images/btnClose_ON.png'];     // 画像を設定

                scene.addChild(CloseImage);                             // シーンに追加
                CloseImage.x = (game.width - CloseImage.width) / 2; // X座標
                CloseImage.y = 510; // Y座標

                CloseImage.addEventListener(Event.TOUCH_START, function (e) {
                    CloseImage.image = game.assets['./images/btnClose_OFF.png'];
                });
                CloseImage.addEventListener(Event.TOUCH_END, function (e) {
                    CloseImage.image = game.assets['./images/btnClose_ON.png'];
                    game.popScene();
                });


                return scene;

            };

            /**
            * ポーズ画面
            */
            var createPauseScene = function () {
                var scene = new Scene();
                scene.backgroundColor = 'rgba(241,206,143, 0.8)';

                // 休んでいる猫
                var pouseImage = new Sprite(260, 280);                  // スプライトを作る                        
                pouseImage.image = game.assets['./images/pouse.png'];     // 画像を設定

                scene.addChild(pouseImage);                             // シーンに追加
                pouseImage.x = (game.width - pouseImage.width) / 2; // X座標
                pouseImage.y = 70; // Y座標


                // タイトルボタン設定
                var tittleBtn = new Sprite(130, 50);                  // スプライトを作る                        
                tittleBtn.image = game.assets['./images/btnTittle_ON.png'];     // START画像を設定     
                scene.addChild(tittleBtn);                                  // シーンに追加
                tittleBtn.x = 30;                                           // 横位置調整
                tittleBtn.y = 370;                          // 縦位置調整
                // タッチイベントを設定
                tittleBtn.addEventListener(Event.TOUCH_START, function (e) {
                    tittleBtn.image = game.assets['./images/btnTittle_OFF.png'];
                });
                tittleBtn.addEventListener(Event.TOUCH_END, function (e) {
                    tittleBtn.image = game.assets['./images/btnTittle_ON.png'];
                    // 現在表示しているシーンをタイトルシーンに置き換える
                    GameStart = false;
                    game.popScene();
                    game.replaceScene(createStartScene());
                });

                // リトライボタン設定
                var RetryBtn = new Sprite(130, 50);                  // スプライトを作る                        
                RetryBtn.image = game.assets['./images/btnRetry_ON.png'];     // 画像を設定     
                scene.addChild(RetryBtn);                                  // シーンに追加
                RetryBtn.x = tittleBtn.width + 40;
                RetryBtn.y = 370;

                // リトライボタンにタッチイベントを設定
                RetryBtn.addEventListener(Event.TOUCH_START, function (e) {
                    RetryBtn.image = game.assets['./images/btnRetry_OFF.png'];
                });
                RetryBtn.addEventListener(Event.TOUCH_END, function (e) {
                    RetryBtn.image = game.assets['./images/btnRetry_ON.png'];
                    if (SoundFlg) {
                        var retryCall = game.assets['./sound/retryCall.mp3'].clone();
                        if (SoundFlg) { retryCall.play(); }
                    }

                    RetryFlg = true;
                    GameStart = false;
                    game.popScene();
                    game.replaceScene(createGameScene(AcceFlg, SoundFlg));
                });


                // 閉じるボタン
                var CloseImage = new Sprite(130, 50);                  // スプライトを作る                        
                CloseImage.image = game.assets['./images/btnClose_ON.png'];     // 画像を設定

                scene.addChild(CloseImage);                             // シーンに追加
                CloseImage.x = (game.width - CloseImage.width) / 2; // X座標
                CloseImage.y = 450; // Y座標

                CloseImage.addEventListener(Event.TOUCH_START, function (e) {
                    CloseImage.image = game.assets['./images/btnClose_OFF.png'];
                });
                CloseImage.addEventListener(Event.TOUCH_END, function (e) {
                    CloseImage.image = game.assets['./images/btnClose_ON.png'];
                    game.popScene();
                });

                return scene;

            };

            /**
            * スキル発動画面
            */
            var createSkillScene = function () {
                var scene = new Scene();

                //        		var label = new Label("すきる発動");
                var label = new Label("にゃー！！");

                label.color = "Green";
                label.font = "40px Nikumaru";
                label.x = (game.width - label._boundWidth) / 2; // X座標
                label.y = 200; // Y座標 
                scene.addChild(label);
                scene.backgroundColor = 'rgba(0,0,0, 0.5)';

                // 
                //                var padImage = new Sprite(90,42);                  // スプライトを作る                        
                var padImage = new Sprite(320, 230);                  // スプライトを作る                        
                //                padImage.image = game.assets['./images/padSP.png'];     // 画像を設定
                padImage.image = game.assets['./images/SP.png'];     // 画像を設定
                padImage.x = (game.width - padImage.width) / 2; // X座標
                padImage.y = game.height; // Y座標
                scene.addChild(padImage);                             // シーンに追加

                //        		//スキル発動時背景画像
                //                var GameBackSpImage = new Sprite(320, 568);
                //    		    GameBackSpImage.image = game.assets["./images/GameBackSP.png"];
                //                GameBackSpImage.x = (game.width - GameBackSpImage.width) /2; // X座標
                //                GameBackSpImage.y = (game.height - GameBackSpImage.height) / 2; // Y座標 
                //        	    scene.addChild(GameBackSpImage);

                time = 0;
                scene.addEventListener(enchant.Event.ENTER_FRAME, function () {
                    var progress = parseInt(time / game.fps, 8);
                    padImage.y -= 8;
                    //2秒経過後に消える
                    if (progress >= 2) {
                        game.popScene();
                    } else { time += 1; }
                });

                return scene;

            };

            /**
            * タイムアップ画面
            */
            var createTimeUpScene = function (resultScore, bestScore) {
                var scene = new Scene();

                if (SoundFlg) {
                    var endcall = game.assets['./sound/endCall.mp3'].clone();
                    if (SoundFlg) { endcall.play(); }
                }

                var label = new Label("しゅーりょー");

                label.color = "Yellow";
                label.font = "40px Nikumaru";
                label.x = (game.width - label._boundWidth) / 2; // X座標
                label.y = 200; // Y座標 
                scene.addChild(label);
                scene.backgroundColor = 'rgba(0,0,0, 0.2)';
                time = 0;
                scene.addEventListener(enchant.Event.ENTER_FRAME, function () {
                    var progress = parseInt(time / game.fps, 10);

                    //2秒経過後に移動
                    if (progress >= 2) {
                        //スコア画面呼び出し
                        game.popScene();
                        game.replaceScene(createGameoverScene(resultScore, bestScore));
                    } else { time += 1; }
                });

                return scene;

            };

            /**
            * ランキング画面
            */
            var createRanking = function () {
                var scene = new Scene();

                scene.backgroundColor = 'rgba(256,256,256, 0.9)';

                // 背景画像
                var RankBack = new Sprite(320, 410);
                RankBack.image = game.assets["./images/RankBack.png"];
                RankBack.x = (game.width - RankBack.width) / 2; // X座標
                RankBack.y = (game.height - RankBack.height) / 2; // Y座標
                scene.addChild(RankBack);

                // ランキング
                var ranking = new Sprite(328, 68);
                ranking.image = game.assets["./images/lblWeeklyRanking.png"];
                ranking.x = (game.width - ranking.width) / 2; // X座標
                ranking.y = 120; // Y座標
                scene.addChild(ranking);

                //初期画面として、デイリーランキングを表示
                RankingKbn = 0;
                var Cnt = 0;
                for (i = 0; i < rankDairyArrayGet.length; i++) {
                    for (j = 0; j < rankDairyArrayGet[i].length; j++) {
                        rankArraySet[Cnt] = new Label(rankDairyArrayGet[i][j]);

                        switch (j) {
                            case 0:
                                //順位
                                rankArraySet[Cnt].x = 10;  // X座標
                                rankArraySet[Cnt].font = "30px Nikumaru";
                                rankArraySet[Cnt].width = 30;
                                rankArraySet[Cnt].textAlign = "right";
                                rankArraySet[Cnt].y = (i * 32) + 170; // Y座標
                                break;
                            case 1:
                                //名前
                                rankArraySet[Cnt].x = 50;  // X座標
                                rankArraySet[Cnt].font = "15px sans-serif";
                                rankArraySet[Cnt].width = 150;
                                rankArraySet[Cnt].y = rankArraySet[Cnt - 1].y + 12 // Y座標
                                break;
                            case 2:
                                //スコア
                                rankArraySet[Cnt].x = 200;  // X座標
                                rankArraySet[Cnt].font = "25px Nikumaru";
                                rankArraySet[Cnt].width = 100;
                                rankArraySet[Cnt].textAlign = "right";
                                rankArraySet[Cnt].y = (i * 32) + 170; // Y座標
                        }

                        //1,2,3位は色を変える
                        switch (i) {
                            case 0:
                                rankArraySet[Cnt].color = "#e6b422"; //金色
                                break;
                            case 1:
                                rankArraySet[Cnt].color = "#8F9294"; //銀色
                                break;
                            case 2:
                                rankArraySet[Cnt].color = "#8C4841"; //銅色
                                break;
                        }

                        //自身のスコアは色を変える
                        if (myDairyRank == i + 1) {
                            rankArraySet[Cnt].color = "#0000FF"; //青
                        }

                        scene.addChild(rankArraySet[Cnt]);



                        Cnt += 1;
                    }

                }

                // 閉じるボタン
                var CloseImage = new Sprite(130, 50);                  // スプライトを作る                        
                CloseImage.image = game.assets['./images/btnClose_ON.png'];     // 画像を設定
                scene.addChild(CloseImage);                             // シーンに追加
                CloseImage.x = (game.width - CloseImage.width) / 2; // X座標
                CloseImage.y = 480; // Y座標

                CloseImage.addEventListener(Event.TOUCH_START, function (e) {
                    CloseImage.image = game.assets['./images/btnClose_OFF.png'];
                });
                CloseImage.addEventListener(Event.TOUCH_END, function (e) {
                    CloseImage.image = game.assets['./images/btnClose_ON.png'];
                    //画面を閉じる
                    game.popScene();
                });

                // 表示切替ボタン
                var SwitchImage = new Sprite(90, 90);                  // スプライトを作る 
                SwitchImage.image = game.assets['./images/btnSwitch_ON.png'];
                scene.addChild(SwitchImage);                             // シーンに追加
                SwitchImage.x = game.width - SwitchImage.width;
                SwitchImage.y = 0;

                SwitchImage.addEventListener(Event.TOUCH_START, function (e) {
                    SwitchImage.image = game.assets['./images/btnSwitch_OFF.png'];
                });
                SwitchImage.addEventListener(Event.TOUCH_END, function (e) {
                    SwitchImage.image = game.assets['./images/btnSwitch_ON.png'];
                    if (RankingKbn == 0) {
                        //デイリー　⇒　マンスリーに切り替え
                        RankingKbn = 1;
                        ranking.image = game.assets['./images/lblMonthlyRanking.png'];

                        //表示されているランキングの削除
                        var DelCnt = 0;
                        for (i = 0; i < rankDairyArrayGet.length; i++) {
                            for (j = 0; j < rankDairyArrayGet[i].length; j++) {
                                scene.removeChild(rankArraySet[DelCnt]);
                                DelCnt += 1;
                            }
                        }

                        //マンスリーランキングの表示
                        var Cnt = 0;
                        for (i = 0; i < rankMonthlyArrayGet.length; i++) {
                            for (j = 0; j < rankMonthlyArrayGet[i].length; j++) {
                                rankArraySet[Cnt] = new Label(rankMonthlyArrayGet[i][j]);

                                switch (j) {
                                    case 0:
                                        //順位
                                        rankArraySet[Cnt].x = 10;  // X座標
                                        rankArraySet[Cnt].font = "30px Nikumaru";
                                        rankArraySet[Cnt].width = 30;
                                        rankArraySet[Cnt].textAlign = "right";
                                        rankArraySet[Cnt].y = (i * 32) + 170; // Y座標
                                        break;
                                    case 1:
                                        //名前
                                        rankArraySet[Cnt].x = 50;  // X座標
                                        rankArraySet[Cnt].font = "15px sans-serif";
                                        rankArraySet[Cnt].width = 150;
                                        rankArraySet[Cnt].y = rankArraySet[Cnt - 1].y + 12 // Y座標
                                        break;
                                    case 2:
                                        //スコア
                                        rankArraySet[Cnt].x = 200;  // X座標
                                        rankArraySet[Cnt].font = "25px Nikumaru";
                                        rankArraySet[Cnt].width = 100;
                                        rankArraySet[Cnt].textAlign = "right";
                                        rankArraySet[Cnt].y = (i * 32) + 170; // Y座標
                                }

                                //1,2,3位は色を変える
                                switch (i) {
                                    case 0:
                                        rankArraySet[Cnt].color = "#e6b422"; //金色
                                        break;
                                    case 1:
                                        rankArraySet[Cnt].color = "#8F9294"; //銀色
                                        break;
                                    case 2:
                                        rankArraySet[Cnt].color = "#8C4841"; //銅色
                                        break;
                                }

                                //自身のスコアは色を変える
                                if (myMonthlyRank == i + 1) {
                                    rankArraySet[Cnt].color = "#0000FF"; //青
                                }

                                scene.addChild(rankArraySet[Cnt]);
                                Cnt += 1;
                            }

                        }

                    } else {
                        //マンスリー　⇒　デイリーに切り替え
                        RankingKbn = 0;
                        ranking.image = game.assets['./images/lblWeeklyRanking.png'];

                        //表示されているランキングの削除
                        var DelCnt = 0;
                        for (i = 0; i < rankMonthlyArrayGet.length; i++) {
                            for (j = 0; j < rankMonthlyArrayGet[i].length; j++) {
                                scene.removeChild(rankArraySet[DelCnt]);
                                DelCnt += 1;
                            }
                        }

                        //デイリーランキングの表示
                        var Cnt = 0;
                        for (i = 0; i < rankDairyArrayGet.length; i++) {
                            for (j = 0; j < rankDairyArrayGet[i].length; j++) {
                                rankArraySet[Cnt] = new Label(rankDairyArrayGet[i][j]);

                                switch (j) {
                                    case 0:
                                        //順位
                                        rankArraySet[Cnt].x = 10;  // X座標
                                        rankArraySet[Cnt].font = "30px Nikumaru";
                                        rankArraySet[Cnt].width = 30;
                                        rankArraySet[Cnt].textAlign = "right";
                                        rankArraySet[Cnt].y = (i * 32) + 170; // Y座標
                                        break;
                                    case 1:
                                        //名前
                                        rankArraySet[Cnt].x = 50;  // X座標
                                        rankArraySet[Cnt].font = "15px sans-serif";
                                        rankArraySet[Cnt].width = 150;
                                        rankArraySet[Cnt].y = rankArraySet[Cnt - 1].y + 12 // Y座標
                                        break;
                                    case 2:
                                        //スコア
                                        rankArraySet[Cnt].x = 200;  // X座標
                                        rankArraySet[Cnt].font = "25px Nikumaru";
                                        rankArraySet[Cnt].width = 100;
                                        rankArraySet[Cnt].textAlign = "right";
                                        rankArraySet[Cnt].y = (i * 32) + 170; // Y座標
                                }

                                //1,2,3位は色を変える
                                switch (i) {
                                    case 0:
                                        rankArraySet[Cnt].color = "#e6b422"; //金色
                                        break;
                                    case 1:
                                        rankArraySet[Cnt].color = "#8F9294"; //銀色
                                        break;
                                    case 2:
                                        rankArraySet[Cnt].color = "#8C4841"; //銅色
                                        break;
                                }

                                //自身のスコアは色を変える
                                if (myDairyRank == i + 1) {
                                    rankArraySet[Cnt].color = "#0000FF"; //青
                                }

                                scene.addChild(rankArraySet[Cnt]);



                                Cnt += 1;
                            }

                        }
                    }

                });

                return scene;

            };



            // ゲームの_rootSceneをスタートシーンに置き換える
            game.replaceScene(createStartScene());


        };
        // 傾きセンサーを設定(Android/iOS共通)
        window.addEventListener("deviceorientation", function (evt) {
            game.input.analogX = evt.gamma;  // 横方向の傾斜角度
            //game.input.analogY = evt.beta;  // 縦方向の傾斜角度    
        }, false);



        // ゲーム処理開始
        previewCenter(game);   // 中央寄せ
        game.start();


        function previewCenter(game) {
            var left = (window.innerWidth - (game.width * game.scale)) / 2;
            var top = (window.innerHeight - (game.height * game.scale)) / 2;
            $('#enchant-stage').css({
                "position": "absolute",
                "left": left + "px",
                "top": top + "px",
            });
            game._pageX = left;
            game._pageY = top;
        }


        //ランダムにブロックの色を決める
        function random_block() {
            var color = "";
            //乱数を発生させる
            rnd = Math.floor(Math.random() * 4);
            switch (rnd) {
                case 0:
                    //アイテム発生のブロックは10個まで
                    if (ItemBlockCount < 10) {
                        color = game.assets[block_yellow];
                        ItemBlockCount += 1;
                        break;
                    }
                default:
                    color = game.assets[block_red];
                    break;
            }

            return color;

        }

        //アクセスログ
        function AccessLog() {


            //デバイスIDの取得
            monaca.getDeviceId(function (id) {

                var self = this;
                self.ncmb = new NCMB(ApKey, ClKey);    // mobile backendの初期化

                // [1]AccessLog（クラス）を生成
                var AccessLog = self.ncmb.DataStore("AccessLogClass");

                // [2]ブラウザ情報をセット
                var AccessLogData = new AccessLog({ userAgent: navigator.userAgent, DeviceID: id });

                // [3]送信処理
                AccessLogData.save()
                    .then(function (saved) {
                        AccessLogSendFlg = true;
                    })
                    .catch(function (err) {
                        console.log(err);
                    });

            });
        }

        //ヴァージョン確認
        function VersionCheck() {


            var self = this;
            self.ncmb = new NCMB(ApKey, ClKey);    // mobile backendの初期化

            var mBaasVersion;
            //スコア情報を取得するため、クラスを作成
            var GameVersion = self.ncmb.DataStore("MasterClass");
            GameVersion.equalTo("id", "1")
                .fetchAll()
                .then(function (results) {
                    for (var i = 0; i < results.length; i++) {
                        var object = results[i];

                        mBaasVersion = object.get("version");
                    }

                    //バージョン確認
                    if (version == mBaasVersion) {
                        StartClick = true;
                    } else {
                        showAlert('最新バージョンに\r\nアップデートしてください。', 'エラー');
                    }

                })
                .catch(function (err) {
                    console.log(err);
                });


        }


        //スコア送信
        function sendScore(name, score) {


            //デバイスIDの取得
            monaca.getDeviceId(function (id) {

                var self = this;
                self.ncmb = new NCMB(ApKey, ClKey);    // mobile backendの初期化

                // [1]Score（クラス）を生成
                var Score = self.ncmb.DataStore("ScoreClass");

                // [2]インスタンス生成、名前とスコアとデバイスIDをセット
                var scoreData = new Score({ name: name, score: score, DeviceID: id });

                // [3]送信処理
                scoreData.save()
                    .then(function (saved) {
                        //ランキング再取得
                        getRanking(0, true, name, score);
                        getRanking(1, true, name, score);

                        showAlert('スコア送信完了！', 'スコア送信');
                    })
                    .catch(function (err) {
                        console.log(err);
                    });

            });

        }

        //ランキングの取得(引数1 kbn=0:デイリーランキングの取得 ,kbn=1:マンスリーランキングの取得 ,)
        function getRanking(kbn, sendFlg, myName, myScore) {


            var self = this;
            self.ncmb = new NCMB(ApKey, ClKey);    // mobile backendの初期化

            //スコア情報を取得するため、クラスを作成
            var Score = self.ncmb.DataStore("ScoreClass");


            if (kbn == 0) {
                //デイリー
                myDairyRank = 0;

                var startDate = moment().startOf("day");    // 本日(from)
                var endDate = moment().endOf("day");        // 本日(to)



            } else {
                //マンスリー
                myMonthlyRank = 0;

                var startDate = moment().startOf("month");    // 今月(from)
                var endDate = moment().endOf("month");        // 今月(to)
            }




            //順位はスコアの高さ、作成日が古い順に取得	
            Score.greaterThanOrEqualTo("createDate", { "__type": "Date", "iso": startDate.toISOString() })
                .lessThanOrEqualTo("createDate", { "__type": "Date", "iso": endDate.toISOString() })
                .order("score", true).order("createDate", false)
                .include("name")
                .limit(5)
                .fetchAll()
                .then(function (results) {

                    // 取得した内容をコンソールに表示
                    if (results.length > 0) {
                        for (i = 0; i < results.length; i++) {
                            var score = results[i],
                                rank = i + 1,
                                value = parseInt(score.score),
                                displayName = "NO NAME";

                            //スコアの最大値(これ以上表示すると、画面がずれます)
                            if (value > 999999) { value = 999999; }

                            // ユーザーが正しく取得できていれば、ユーザー名を変数に格納
                            if (score.name !== undefined) {
                                displayName = score.name;
                            }



                            if (kbn == 0) {
                                //デイリー

                                rankDairyArrayGet[i] = new Array();

                                //順位,名前,スコアの順で格納
                                rankDairyArrayGet[i][0] = rank;
                                rankDairyArrayGet[i][1] = displayName.substr(0, 10);

                                var IntScore = new String(value);
                                while (IntScore != (IntScore = IntScore.replace(/(\d)((\d\d\d)+\b)/, '$1,$2')));
                                rankDairyArrayGet[i][2] = IntScore;

                                //自身のスコアがランキング入りしたことを設定
                                if (sendFlg == true && myName == displayName && myScore == value && myDairyRank == 0) {
                                    myDairyRank = rank;
                                }


                            } else {
                                //マンスリー

                                rankMonthlyArrayGet[i] = new Array();

                                //順位,名前,スコアの順で格納
                                rankMonthlyArrayGet[i][0] = rank;
                                rankMonthlyArrayGet[i][1] = displayName.substr(0, 10);

                                var IntScore = new String(value);
                                while (IntScore != (IntScore = IntScore.replace(/(\d)((\d\d\d)+\b)/, '$1,$2')));
                                rankMonthlyArrayGet[i][2] = IntScore;

                                //自身のスコアがランキング入りしたことを設定
                                if (sendFlg == true && myName == displayName && myScore == value && myMonthlyRank == 0) {
                                    myMonthlyRank = rank;
                                }


                            }



                        }
                    }

                })
                .catch(function (err) {
                    console.log(err);
                });


        }

        //メッセージの表示
        function showAlert(message, title) {
            if (navigator.notification) {
                //PhoneGap利用可
                navigator.notification.alert(message, null, title, 'OK');
            } else {
                alert(title ? (title + ": " + message) : message);
            }
        }

    }, 2000); //←2秒
}
