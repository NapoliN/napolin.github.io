
import './App.css'

import Container from "react-bootstrap/Container"
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Item from './component/Item'

const App = () => {

  return (
    <>
      <h1>NapoliN's Lab</h1>
      <div>
        <Container>
          <Row>
            <Col>
              <Item title='ArtWorks' />
            </Col>
            <Col>
              <Item title='Works'/>
            </Col>
            <Col>
              <Item title='Articles' />
            </Col>
          </Row>
          <Row>
            <div>
              <h2>Profile</h2>
              <div className="profile">
                <li><b>所属</b>: 東京工業大学 情報工学系 修士1年</li>
                <li><b>サークル</b>: デジタル創作同好会 traP</li>
                <li><b>研究分野</b>: プログラム解析、抽象解釈、プログラム理論</li>  
                <li><b>趣味</b>: 旅行、ボードゲーム、お絵描き(ドット絵)</li>              
              </div>
            </div>

          </Row>
        </Container>
      </div>
    </>
  )
}

export default App
