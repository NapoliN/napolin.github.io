import "./Top.scss"
import RotateTech from "../component/RotateTech"
import Logo from "../component/Logo"
import WalkingTech from "../component/WalkingTech"
import IdleTech from "../component/IdleTech"

const Top = () => {
    return (
        <div id="top-wrapper">
            <div className="Top">

            </div>
            <Logo />
            <RotateTech />
            <WalkingTech />
            <IdleTech />
            
        </div>


    )
}

export default Top