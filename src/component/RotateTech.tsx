import { ReactElement } from "react"
import "./RotateTech.scss"

const RotateTech = () => {
    const count = 656
    const list : Array<ReactElement> = []
    for(let i = 0; i<count; i++){
        list.push(<div className={`rotate-tech-${i}`}></div>)
    }
        
    return (
        <div className="rotate-tech-position">
            <div className="rotate-tech">
                {list}
            </div>
        </div>
    )
}

export default RotateTech