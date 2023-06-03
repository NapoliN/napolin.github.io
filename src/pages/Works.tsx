import "./Works.css"
import { Container, Row } from "react-bootstrap"
import ImgSplashRoyal from "../assets/works/splashroyal.png"

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
                    <p>2021年冬、部内ハッカソンイベントで制作したターン制陣取りゲーム。</p>
                    <p>開発期間：1週間</p>
                    <p>開発人数：4人（プログラマ3名、デザイナー1名）</p>
                    <p>使用技術：C#、Unity(Photon)</p>
                    <p><a href="https://unityroom.com/games/splashloyale">Link</a></p>
                    <p><a href="https://trap.jp/post/1459/">Blog</a></p>
                </div>
            </Row>
        </Container>
    )
}

export default Works