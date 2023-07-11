import { Container,Row,Col } from "react-bootstrap"
import ArtCard from "../component/ArtCard"

import ArtDorothy from "../assets/artwork/dorothy.png"
import ArtSakura from "../assets/artwork/sakura.gif"
import ArtShrineInForest from "../assets/artwork/graphicchance.png"
import ArtMiku from "../assets/artwork/mikumiku.png"
import ArtN from "../assets/artwork/nikke-n.png"
import ArtRapunzel from "../assets/artwork/rapunzel.gif"
import ArtIkanDemind from "../assets/artwork/IkanDemind.png"
import ArtTateishi from "../assets/artwork/tateishi.png"

const ArtWorks = () => {
    return (
        <Container className='content my-5' id="artworks">
        <Row>
          <h1>Artworks</h1>
        </Row>
        <Row className='d-flex align-items-center'>
        <Col>
          <ArtCard 
            src={ArtTateishi}
            title='立石公園'
            createdAt='2023/7/11'
            artWidth={320}
            description="素材撮影：長野県諏訪市 立石公園"
            />
          </Col>
          <Col>
          <ArtCard 
            src={ArtIkanDemind}
            title='イカンデミンドコントロール'
            createdAt='2023/6/17'
            artWidth={256}
            />
          </Col>
          <Col>
          <ArtCard 
            src={ArtDorothy}
            title='NIKKE ドロシー'
            createdAt='2023/6/3'
            artWidth={256}
            />
          </Col>
          <Col>
          <ArtCard
            src={ArtSakura}
            title='桜分水'
            createdAt='2023/5/5'
            artWidth={320}
            description='素材撮影：新潟県燕市 分水駅'
          />
          </Col>
          <Col>
          <ArtCard
            src={ArtShrineInForest}
            title='木漏れ日'
            createdAt='2023/5/23'
            artWidth={240}
            description='部内イベント Graphic Chance!
                          素材撮影：大分県宇佐市 宇佐神宮'
          />
          </Col>
          <Col>
          <ArtCard
            src={ArtMiku}
            title='みっくみく'
            createdAt='2023/5/26'
            artWidth={256}
          />
          </Col>
          <Col>
          <ArtCard 
            src={ArtN}
            title='NIKKE クリスマスN'
            createdAt='2023/2/19'
            artWidth={256}
          />
          </Col>
          <Col>
            <ArtCard
              src={ArtRapunzel}
              title='NIKKE ラプンツェル'
              createdAt='2023/4/14'
              artWidth={256}
            />
          </Col>
        </Row>
      </Container>
    )
}

export default ArtWorks