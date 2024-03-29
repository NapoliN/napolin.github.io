import "./Works.css"
import { Container, Row } from "react-bootstrap"
import ImgSplashRoyal from "../assets/works/splashroyal.png"
import ImgIkanDemind from "../assets/works/ikandemind.png"
import ImgMeshibu from "../assets/works/meshibu.png"
import ImgEasySummarizer from "../assets/works/easysummarizer.png"

const Works = () => {
    return (
        <Container className="content" id="works">
            <Row>
                <h1>Works</h1>
            </Row>
            <Row>
                <h3 className="my-3">Splash Royal</h3>
                <img src={ImgSplashRoyal}/>
                <div className="my-3">
                    <h4>About</h4>
                    <p>2021年冬、部内ハッカソンイベントで制作。<br/>テーマ「draw」にあわせ、某天堂のイカのゲーム風に色を塗るターン制陣取りゲームを開発。<br/>開発での担当はプログラマ兼TA。</p>
                    <p>開発期間：1週間</p>
                    <p>開発人数：4人（プログラマ3名、デザイナー1名）</p>
                    <p>使用技術：C#、Unity(Photon)</p>
                    <p><a href="https://unityroom.com/games/splashloyale">Link</a></p>
                    <p><a href="https://trap.jp/post/1459/">Blog</a></p>
                </div>
            </Row>
            <Row>
                <h3 className="my-3">イカンデミンドコントロール</h3>
                <img src={ImgIkanDemind} />
                <div className="my-3">
                    <h4>About</h4>
                    <p>2023年春、部内ハッカソンイベントで制作し、最優秀賞を受賞。<br/>Vampire Survivors / Mad Rat Deadから着想を得て、シューティング×音ゲーを開発。<br/>開発での担当はプログラマ兼TA兼グラフィック。</p>
                    <p>開発期間：2日</p>
                    <p>開発人数：5人（プログラマ3名、サウンド担当1名、グラフィック担当兼プログラマ1名）</p>
                    <p>使用技術：C#、Unity</p>
                    <p><a href="https://napolin.github.io/IkanDemindControl/">Link</a></p>
                    <p><a href="https://trap.jp/post/1903/">Blog</a></p>
                </div>
            </Row>
            <Row>
                <h3 className="my-3">飯ぶ</h3>
                <img src={ImgMeshibu} />
                <div className="my-3">
                    <h4>About</h4>
                    <p>自分が行ったことのある飲食店を紹介するサイト。大岡山地区版と全国版を作りました。</p>
                    <p>フロントエンドの勉強＋Github Actionsのテストを兼ねて作成。</p>
                    <p>使用技術：Vue</p>
                    <p><a href="https://napolin.github.io/meshi/#/trip">Link</a></p>
                </div>
            </Row>
            <Row>
                <h3 className="my-3">EasySummarizer</h3>
                <img src={ImgEasySummarizer}/>
                <div className="my-3">
                    <h4>About</h4>
                    <p>大学主催のイベント「学生コンテスト-chatGPTを使い倒せ！」にて開発し、プレゼン賞を受賞。</p>
                    <p>pdfの資料をベースとして、pptx形式のスライドを自動生成するツール。バックエンドにてOpenAI(chatGPT)を利用。</p>
                    <p>３人チームで開発し、開発ではチームリーダー/企画/フロントエンドを担当した。</p>
                </div>
            </Row>
        </Container>
    )
}

export default Works