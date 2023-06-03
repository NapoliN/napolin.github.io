import "./Item.css"

const Item = ({title} : {title: string}) => {

    
    return (
        <a href="#artwork">
            <div className="box m-auto">
                <div className="box-title">
                <p>{title}</p>
                </div>
            </div>
        </a>
    )
}

export default Item