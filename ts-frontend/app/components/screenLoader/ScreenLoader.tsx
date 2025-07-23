import Dots from "../animations/Dots";



const dots = {
    color: 'bg-light',
    size: 'h-3 w-3',
}

const ScreenLoader = () => {
    return (
        <div data-testid="screen-loader" className={`w-screen h-screen flex flex-col items-center justify-center gap-y-10 bg-gradient-to-br from-accent-green from-10% to-accent-dark z-[300]`}>
            <div className="text-center text-light mb-4">
            </div>
            <Dots item={dots} />
        </div>
    )
}

export default ScreenLoader;