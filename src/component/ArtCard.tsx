import { Card } from "react-bootstrap"

type ArtCardType = {
    src : string,
    title : string,
    createdAt : string
    artWidth : number
    description? : string
}

const ArtCard = (info: ArtCardType) => {
    return (
        <Card style={{width: info.artWidth + "px"}} className="p-0">
            <Card.Img src={info.src}/>
            <Card.Title> {info.title} </Card.Title>
            {
                info.description != undefined &&
                <Card.Body> {info.description}</Card.Body>
            }
            <Card.Footer className="text-end"> {info.createdAt}</Card.Footer>
        </Card>
    )
}

export default ArtCard