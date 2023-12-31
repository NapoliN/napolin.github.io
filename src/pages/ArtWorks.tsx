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
import ArtInari from "../assets/artwork/inari.png"
import ArtEnoshgima from "../assets/artwork/enoshima.png"
import ArtTateyama from "../assets/artwork/tateyama.png"
import ArtAkeome2024 from "../assets/artwork/akeome2024.png"

const ArtWorks = () => {
    return (
        <Container className='content my-5' id="artworks">
        <Row>
          <h1>Artworks</h1>
        </Row>
        <Row className='d-flex align-items-center'>
        <Col>
          <ArtCard
            src = {ArtAkeome2024}
            title="年賀状2024"
            createdAt="2024/1/1"
            artWidth={320}
          />
          </Col>
        <Col>
          <ArtCard
            src = {ArtInari}
            title="雪の京都"
            createdAt="2023/11/5"
            description="素材撮影：京都府京都市 伏見稲荷大社"
            artWidth={320}
          />
          </Col>
        <Col>
          <ArtCard 
            src={ArtTateishi}
            title='諏訪湖'
            createdAt='2023/7/11'
            artWidth={320}
            description="素材撮影：長野県諏訪市 立石公園"
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
            src={ArtEnoshgima}
            title="江の島デート"
            createdAt="2023/9/22"
            artWidth={240}
            description="素材撮影：神奈川県藤沢市　江ノ島"
          />
          </Col>
          <Col>
          <ArtCard
            src={ArtTateyama}
            title="陽炎"
            createdAt="2023/8/16"
            artWidth={256}
            description="素材撮影：千葉県館山市"
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