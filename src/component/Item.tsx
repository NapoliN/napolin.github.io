import "./Item.css"

type IndexItem = {
    title : string
    href : string
}

const Item = (info: IndexItem) => {

    
    return (
        <a href={info.href} className="item-link">
            <div className="box mx-auto my-2">
                <div className="box-title">
                    <p className="m-auto">{info.title}</p>
                </div>
            </div>
        </a>
    )
}

export default Item