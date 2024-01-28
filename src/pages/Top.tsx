import "./Top.scss"
import RotateTech from "../component/Top/TechChan/RotateTech"
import Logo from "../component/Top/Logo/Logo"
import WalkingTech from "../component/Top/TechChan/WalkingTech"
import IdleTech from "../component/Top/TechChan/IdleTech"

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