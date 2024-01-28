import { ReactElement } from "react";
import "./Logo.scss"

const Logo = () => {
    const dotCount = 655;
    const list : Array<ReactElement> = []
    for(let i = 0; i<dotCount; i++){
        list.push(<div className={`logo-${i}`}></div>)
    }
        
    return (
        <div className="logo-position">
            <div className="logo">
                {list}
            </div>
        </div>
    )
}

export default Logo