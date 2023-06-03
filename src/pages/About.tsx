import "./About.css"
import { Container,Row,Col } from "react-bootstrap"
import Item from "../component/Item"
import { IconContext } from "react-icons";
import { FaGithub } from "react-icons/fa";

const About = () => {
    return (
        <div className='content mx-auto d-flex align-items-center' id="about">

        <Container className='justify-content-md-center'>
          <Row className='text-center my-3'>
            <h1 className="my-5">NapoliN's Lab</h1>
          </Row>
          <Row className='item-list mx-auto my-3'>
            <Col xs={12} lg={4}>
              <Item 
                title='ArtWorks' 
                href="#artworks"
                />
            </Col>
            <Col xs={12} lg={4}>
              <Item 
              title='Works'  
            href="#works"
            />
            </Col>
            <Col xs={12} lg={4}>
              <Item title='Articles' 
              href="#articles"/>
            </Col>
          </Row>
          <Row className="my-3">
            <div className='px-auto'>
              <h2 className="my-4">Profile</h2>
              <div>
                <p><b>所属</b>: 東京工業大学 情報工学系 修士1年</p>
                <p><b>サークル</b>: デジタル創作同好会traP</p>
                <p><b>研究分野</b>: プログラム解析、抽象解釈、プログラム理論</p>
                <p><b>趣味</b>: 一人旅、ボードゲーム、ドット絵</p>
              </div>
            </div>
          </Row>
          <Row className="my-3">
            <Col>
            <a href="https://github.com/NapoliN" className="discolor-href">
              <IconContext.Provider value={{size: "5em"}}>
              <FaGithub/>
            </IconContext.Provider>
            </a>
            </Col>
          </Row>
        </Container>
        </div>
    )
}

export default About