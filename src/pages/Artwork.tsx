import { Col, Container, Row, Card, Button } from "react-bootstrap"

import ArtInari from "../assets/artwork/inari.png"
import ArtAkeome2024 from "../assets/artwork/akeome2024.png"
import ArtTomioka from "../assets/artwork/tomioka.png"
import ArtComitia24sp from "../assets/artwork/comitia24sp.png"

const Artwork = () => {
    return (
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
                                <img src={ArtTomioka} />
                                <Card.Footer>
                                    <p className="text-end mb-0">2024.1.21</p>
                                </Card.Footer>
                            </Card>
                        </Col>
                        <Col className="d-flex justify-content-center">
                            <Card style={{ width: "360px" }}>
                                <img src={ArtAkeome2024} />
                                <Card.Footer>
                                    <p className="text-end mb-0">2024.1.1</p>
                                </Card.Footer>
                            </Card>
                        </Col>
                        <Col className="d-flex justify-content-center">
                            <Card style={{ width: "360px" }}>
                                <img src={ArtInari} style={{ height: "480px" }} />
                                <Card.Footer>
                                    <p className="text-end mb-0">2023.11.5</p>
                                </Card.Footer>
                            </Card>
                        </Col>
                        <Col className="d-flex justify-content-center">
                            <Card style={{width: "360px"}}>
                                <img src={ArtComitia24sp}/>
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
    )
}

export default Artwork