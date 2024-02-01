import { Card, Col, Container, Row } from "react-bootstrap";

import Ikandemind from "../assets/works/ikandemind.png"
import EasySummarizer from "../assets/works/easy_summarizer.png"
import SplashLoyal from "../assets/works/splashroyal.png"

const Project = () => {
    return (
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
                                <Card.Img src={Ikandemind} height="100%" style={{width:"50%"}}/>
                                <div>
                                    <Container>
                                        <Row>
                                            <Col>
                                                <p>2023年6月サークル内ハッカソンにて製作。</p>
                                                <p>ハクスラの爽快感にリズム要素を加えた新感覚音ゲーを目指しました。</p>
                                                <p><span className="fw-bold">使用技術:</span> Unity(C#)</p>
                                                <p><span className="fw-bold">担当範囲:</span> チームリーダー・プログラマ・グラフィッカ</p>
                                                <p><span className="fw-bold">製作期間:</span> 30時間</p>
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
                                <Card.Img src={EasySummarizer} height="100%" style={{width:"50%"}}/>
                                <div>
                                    <Container>
                                        <Row>
                                            <Col>
                                                <p>2021年12月、サークル内のハッカソン(pixiv社協賛)にて製作。デザイン賞受賞。</p>
                                                <p>色塗りをテーマとした2人制ターン制陣取りゲーム。</p>
                                                <p><span className="fw-bold">使用技術:</span> Unity(C#) フレームワークとしてPhoton</p>
                                                <p><span className="fw-bold">担当範囲:</span> チームリーダー・プログラマ(統括)</p>
                                                <p><span className="fw-bold">製作期間:</span> 1週間</p>
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
                                <Card.Img src={SplashLoyal} height="100%" style={{width:"50%"}}/>
                                <div>
                                    <Container>
                                        <Row>
                                            <Col>
                                                <p>2023年9月、東工大情報理工学院主催「chatGPTを使い倒せ！」コンテストにて開発し、プレゼン賞を受賞。</p>
                                                <p>pdf資料を入力とすることで、pdfを要約したpptxファイルを出力・表示してくれるアプリ。</p>
                                                <p><span className="fw-bold">使用技術:</span> TypeScript(Vue), Python</p>
                                                <p><span className="fw-bold">担当範囲:</span> チームリーダー・プログラマ(フロントエンド)</p>
                                                <p><span className="fw-bold">製作期間:</span> 約3週間</p>
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
    );
}

export default Project;