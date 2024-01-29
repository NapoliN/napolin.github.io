import "./About.css"
import { Container,Row,Col } from "react-bootstrap"
import Item from "../component/Item"
import { IconContext } from "react-icons";
import { FaGithub } from "react-icons/fa";

// ロゴの上にテキストを表示するコンポーネント
const LogoWithText = (text: string) => (
  <div className='logo-with-text'>
    <img src="/logo192.png" alt="logo" className="logo"/>
    <h1 className='logo-text'>{text}</h1>
  </div>
)


// about page component
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
                <p>北海道出身。大学入学を機に上京。所属したサークルでの活動を通じて、様々な活動に手を出す。</p>
                <p>競技プログラミングやイラスト、ゲーム開発、作曲など様々な分野に触れたが、今は主にドット絵イラストの制作にハマっている。</p>
              </div>
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