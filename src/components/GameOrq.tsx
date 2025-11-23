import {Section1} from "./game";


export default function CanvasGameSection() {
    return (
        <Section1 next={()=> console.log("a")} badKey={() => console.log("b")} />
    )
}