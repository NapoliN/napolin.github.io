
import './App.css'

import Container from "react-bootstrap/Container"
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Item from './component/Item'
import ArtCard from './component/ArtCard';

import ArtDorothy from "./assets/artwork/dorothy.png"
import ArtSakura from "./assets/artwork/sakura.gif"
import ArtShrineInForest from "./assets/artwork/graphicchance.png"
import ArtMiku from "./assets/artwork/mikumiku.png"
import ArtN from "./assets/artwork/nikke-n.png"


const App = () => {

  return (
    <div className='app'>
      <div className='content mx-auto d-flex align-items-center'>

      <Container className='justify-content-md-center '>
        <Row className='text-center'>
          <h1>NapoliN's Lab</h1>
        </Row>
        <Row className='justify-content-md-center my-5'>
          <Col className='mx-auto'>
            <Item title='ArtWorks' />
          </Col>
          <Col className='mx-auto'>
            <Item title='Works' />
          </Col>
          <Col>
            <Item title='Articles' />
          </Col>
        </Row>
        <Row>
          <div className='px-auto'>
            <h2>Profile</h2>
            <div className="profile">
              <li><b>所属</b>: 東京工業大学 情報工学系 修士1年</li>
              <li><b>サークル</b>: デジタル創作同好会 traP</li>
              <li><b>研究分野</b>: プログラム解析、抽象解釈、プログラム理論</li>
              <li><b>趣味</b>: 旅行、ボードゲーム、ドット絵</li>
            </div>
          </div>

        </Row>
      </Container>
      </div>
      <Container className='content-artwork my-5' id="artwork">
        <Row>
          <h1>Artwork</h1>
        </Row>
        <Row className='d-flex align-items-center'>
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
          />
          </Col>
          <Col>
          <ArtCard
            src={ArtShrineInForest}
            title='木漏れ日'
            createdAt='2023/5/23'
            artWidth={240}
            description='部内イベント Graphic Chance!'
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
        </Row>
      </Container>
    </div>
  )
}

export default App
