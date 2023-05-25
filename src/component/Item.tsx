import "./Item.css"

const Item = ({title} : {title: string}) => {
    return (
        <div className="box">
            <div className="box-title">
            <p>{title}</p>
            </div>
        </div>
    )
}

export default Item