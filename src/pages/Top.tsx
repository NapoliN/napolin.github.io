import "./Top.scss"
import "./AboutMe.css"

import Logo from "../component/Top/Logo/Logo"
import RotateTech from "../component/Top/TechChan/RotateTech"
import WalkingTech from "../component/Top/TechChan/WalkingTech"
import IdleTech from "../component/Top/TechChan/IdleTech"
import CardHeader from "react-bootstrap/esm/CardHeader"
import Icon from "../assets/icons/icon.png"
import GithubIcon from "../assets/icons/github_icon.png"
import UnityIcon from "../assets/icons/unity_icon.png"
import CsharpIcon from "../assets/icons/csharp_icon.png"
import TSIcon from "../assets/icons/typescript_icon.png"
import VueIcon from "../assets/icons/vue_icon.png"
import ReactIcon from "../assets/icons/react_icon.png"
import PythonIcon from "../assets/icons/python_icon.png"
import XIcon from "../assets/icons/x_icon.png"
import PixivIcon from "../assets/icons/pixiv_icon.png"
import InstagramIcon from "../assets/icons/instagram_icon.png"
import { Col, Container, Row, Card, Button } from "react-bootstrap"

import Ikandemind from "../assets/works/ikandemind.png"
import EasySummarizer from "../assets/works/easy_summarizer.png"
import SplashLoyal from "../assets/works/splashroyal.png"

const Top = () => {
    return (
        <div>
            <div id="top-wrapper" className="content">
                <div className="top-background">
                </div>
                <Logo />
                <RotateTech />
                <WalkingTech />
                <IdleTech />
            </div>
            <div className="content" id="aboutme">
                <div className="d-flex justify-content-start">
                    <div>
                        <div className="mt-5 my-3 section">
                            <div className="py-3">
                                <p className="fs-1 mb-0 px-5 text-end text-white">About Me</p>
                            </div>
                        </div>

                    </div>
                </div>
                <Container className="h-100">
                    <Row className="mt-10">
                        <Col lg="6">
                            <Card className="m-2 profile-card">
                                <CardHeader>
                                    <p className="fs-2">Profile</p>
                                </CardHeader>
                                <Card.Body>
                                    <Container>
                                        <Row>
                                            <Col xs="4">
                                                <Card.Img src={Icon} />
                                            </Col>
                                            <Col>
                                                <p><span className="fw-bold">FROM:</span> 北海道札幌市</p>
                                                <p><span className="fw-bold">UNIV:</span> 東京科学大学理工学系 情報理工学院 情報工学系 修士2年</p>
                                                <p><span className="fw-bold">COMMENT:</span> お絵かき楽しい</p>
                                                <p className="d-flex align-items-center">
                                                    <span className="fw-bold">CONTACT:</span>
                                                    <Container>
                                                        <Row>
                                                            <Col xs="2" className="p-1">
                                                                <a href="https://www.pixiv.net/users/19193422" target="_blank">
                                                                    <Card.Img src={PixivIcon} />
                                                                </a>
                                                            </Col>
                                                            <Col xs="2" className="p-1">
                                                                <a href="https://www.instagram.com/yuzu.sak/" target="_blank">
                                                                    <Card.Img src={InstagramIcon} />
                                                                </a>
                                                            </Col>
                                                        </Row>
                                                    </Container>
                                                </p>
                                            </Col>
                                        </Row>
                                    </Container>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col lg="6">
                            <Card className="m-2 profile-card">
                                <CardHeader>
                                    <p className="fs-2">Research</p>
                                </CardHeader>
                                <Card.Body>
                                    <p>ソフトウェア検証に関する研究を行っています。特に静的解析分野における抽象解釈という手法に興味があります。学部の頃は、Webassemblyを対象として、バイナリレベルで抽象化された中間表現から実行時の動的な振る舞いを予測できるか、というテーマで研究を行いました。現在は、正規表現のReDoS脆弱性に関して研究を進めています。</p>
                                    <p><span className="fw-bold">Other Expertise:</span> Lambda Calculuis, Model Checking, Garbage Collection, Taint Analysis</p>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col lg="6">
                            <Card className="m-2 profile-card">
                                <CardHeader>
                                    <p className="fs-2">Skill</p>
                                </CardHeader>
                                <Card.Body>
                                    <Container>
                                        <Row>
                                            <Col xs="4">
                                                <a href="https://github.com/NapoliN" target="_blank"><Card.Img src={GithubIcon} /></a>
                                            </Col>
                                            <Col>
                                                <Container>
                                                    <Row>
                                                        <Col>
                                                            <p className="fw-bold">Unity (C#)</p>
                                                            <p className="fw-bold">Typescript (Vue, React)</p>
                                                            <p className="fw-bold">Python</p>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col xs="2">
                                                            <Card.Img src={UnityIcon} />
                                                        </Col>
                                                        <Col xs="2">
                                                            <Card.Img src={CsharpIcon} />
                                                        </Col>
                                                        <Col xs="2">
                                                            <Card.Img src={TSIcon} />
                                                        </Col>
                                                        <Col xs="2">
                                                            <Card.Img src={VueIcon} />
                                                        </Col>
                                                        <Col xs="2">
                                                            <Card.Img src={ReactIcon} />
                                                        </Col>
                                                        <Col xs="2">
                                                            <Card.Img src={PythonIcon} />
                                                        </Col>
                                                    </Row>
                                                </Container>
                                            </Col>
                                        </Row>
                                    </Container>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col lg="6">
                            <Card className="m-2 profile-card">
                                <CardHeader>
                                    <p className="fs-2">Hobby</p>
                                </CardHeader>
                                <Card.Body>
                                    <p><span className="fw-bold">イラスト:</span> pixelartを描いてます。</p>
                                    <p><span className="fw-bold">ボードゲーム:</span> ユーロゲームメイン。プレイヤー兼コレクターです。</p>
                                    <p><span className="fw-bold">旅行:</span> 写真撮って温泉入って地酒を呑むことが幸せです。</p>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
            <div className="content" id="artwork">
                <div className="d-flex justify-content-end">
                    <div>
                        <div className="mt-5 my-3 section">
                            <div className="py-3">
                                <p className="fs-1 mb-0 px-5 text-white">Artwork</p>
                            </div>
                        </div>
                        <div className="my-3">
                            <p className="px-5">風景×女の子をテーマにして、日常を描きたいと思っています。旅行先で撮った写真を題材にすることが多いです。</p>
                        </div>
                    </div>
                </div>
                <div style={{ minHeight: "70vh" }} className="d-flex align-items-center">
                    <Container>
                        <Row>
                            <Col className="d-flex justify-content-center">
                                <Card style={{ width: "360px" }}>
                                    <Card.Footer>
                                        <p className="text-end mb-0">2024.1.21</p>
                                    </Card.Footer>
                                </Card>
                            </Col>
                            <Col className="d-flex justify-content-center">
                                <Card style={{ width: "360px" }}>
                                    <Card.Footer>
                                        <p className="text-end mb-0">2024.1.1</p>
                                    </Card.Footer>
                                </Card>
                            </Col>
                            <Col className="d-flex justify-content-center">
                                <Card style={{ width: "360px" }}>
                                    <Card.Footer>
                                        <p className="text-end mb-0">2023.11.5</p>
                                    </Card.Footer>
                                </Card>
                            </Col>
                            <Col className="d-flex justify-content-center">
                                <Card style={{ width: "360px" }}>
                                    <Card.Footer>
                                        <p className="text-end mb-0">2024.4.29</p>
                                    </Card.Footer>
                                </Card>
                            </Col>
                        </Row>
                        <Row className="my-4">
                            <Col className="d-flex justify-content-end">
                                <Button variant="outline-primary">もっと見る(準備中)</Button>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </div>
            <div className="content" id="Photo">
                <div className="d-flex justify-content-end">
                    <div>
                        <div className="mt-5 my-3 section">
                            <div className="py-3">
                                <p className="fs-1 mb-0 px-5 text-white">Photo</p>
                            </div>
                        </div>
                        <div className="my-3">
                            <p className="px-5">旅行先で写真をたくさん撮ってます。使用機はCanon EOS Kiss M2です。</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="content" id="project">
                <div className="d-flex justify-content-start">
                    <div>
                        <div className="mt-5 my-3 section">
                            <div className="py-3">
                                <p className="fs-1 mb-0 px-5 text-end text-white">Project</p>
                            </div>
                        </div>
                    </div>
                </div>
                <Container>
                    <Row>
                        <Col md="6">
                            <Card>
                                <Card.Header>
                                    <p className="fs-2">イカンデミンドコントロール</p>
                                </Card.Header>
                                <div className="d-flex align-items-center">
                                    <Card.Img src={Ikandemind} height="100%" style={{ width: "50%" }} />
                                    <div>
                                        <Container>
                                            <Row>
                                                <Col>
                                                    <p>
                                                        2023年6月サークル内ハッカソンにて製作。
                                                        ハクスラの爽快感にリズム要素を加えた新感覚音ゲーを目指しました。
                                                    </p>
                                                    <p>
                                                        <span className="fw-bold">使用技術:</span> Unity(C#)<br />
                                                        <span className="fw-bold">担当範囲:</span> チームリーダー・プログラマ・グラフィッカ<br />
                                                        <span className="fw-bold">製作期間:</span> 30時間<br />
                                                    </p>
                                                </Col>
                                            </Row>
                                        </Container>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                        <Col md="6">
                            <Card>
                                <Card.Header>
                                    <p className="fs-2">Splash Loyal</p>
                                </Card.Header>
                                <div className="d-flex align-items-center">
                                    <Card.Img src={SplashLoyal} height="100%" style={{ width: "50%" }} />
                                    <div>
                                        <Container>
                                            <Row>
                                                <Col>
                                                    <p>
                                                        2021年12月、サークル内のハッカソン(pixiv社協賛)にて製作。デザイン賞受賞。<br />
                                                        色塗りをテーマとした2人制ターン制陣取りゲーム。
                                                    </p>
                                                    <p>
                                                        <span className="fw-bold">使用技術:</span> Unity(C#) フレームワークとしてPhoton <br />
                                                        <span className="fw-bold">担当範囲:</span> チームリーダー・プログラマ(統括)<br />
                                                        <span className="fw-bold">製作期間:</span> 1週間
                                                    </p>
                                                </Col>
                                            </Row>
                                        </Container>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                        <Col md="6">
                            <Card>
                                <Card.Header>
                                    <p className="fs-2">Easy Summarizer</p>
                                </Card.Header>
                                <div className="d-flex align-items-center">
                                    <Card.Img src={EasySummarizer} height="100%" style={{ width: "50%" }} />
                                    <div>
                                        <Container>
                                            <Row>
                                                <Col>
                                                    <p>
                                                        2023年9月、東工大情報理工学院主催「chatGPTを使い倒せ！」コンテストにて開発し、プレゼン賞を受賞。
                                                        pdf資料を入力とすることで、pdfを要約したpptxファイルを出力・表示してくれるアプリ。
                                                    </p>
                                                    <p>
                                                        <span className="fw-bold">使用技術:</span> TypeScript(Vue), Python<br />
                                                        <span className="fw-bold">担当範囲:</span> チームリーダー・プログラマ(フロントエンド)<br />
                                                        <span className="fw-bold">製作期間:</span> 約3週間
                                                    </p>
                                                </Col>
                                            </Row>
                                        </Container>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    )
}

export default Top