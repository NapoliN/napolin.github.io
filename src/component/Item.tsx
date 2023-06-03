import "./Item.css"

type IndexItem = {
    title : string
    href : string
}

const Item = (info: IndexItem) => {

    
    return (
        <a href={info.href}>
            <div className="box m-auto">
                <div className="box-title">
                <p>{info.title}</p>
                </div>
            </div>
        </a>
    )
}

export default Item