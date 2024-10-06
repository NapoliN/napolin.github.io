import { Container, Row, Col, Card } from "react-bootstrap"
import CardHeader from "react-bootstrap/esm/CardHeader"
import Icon from "../assets/icons/icon.png"
import GithubIcon from "../assets/icons/github_icon.png"
import UnityIcon from "../assets/icons/unity_icon.png"
import CsharpIcon from "../assets/icons/csharp_icon.png"
import TSIcon from "../assets/icons/typescript_icon.png"
import VueIcon from "../assets/icons/vue_icon.png"
import ReactIcon from "../assets/icons/react_icon.png"
import PythonIcon from "../assets/icons/python_icon.png"

import "./AboutMe.css"

const AboutMe = () => {
    return (
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
                                <p>ソフトウェア検証に関する研究を行っています。特に静的解析分野における抽象解釈という手法に興味があります。学部の頃は、Webassemblyを対象として、バイナリレベルで抽象化された中間表現から実行時の動的な振る舞いを予測できるか、というテーマで研究を行いました。</p>
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
                                            <Card.Img src={GithubIcon} />
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
    )
}

export default AboutMe