import Dots from "../animations/Dots";



const dots = {
    color: 'bg-light',
    size: 'h-3 w-3',
}

const funnyLoadingSentences: string [] = [
    "9 chefs de projets sur 10 confondent “urgent” et “important”. Le dixième est en burn-out.",
    "Profitez de ce moment de calme. Quelqu’un d’autre s'occupe de ruiner votre ticket.",
    "N'oubliez pas de respirer, c'est important.",
    "Les scientifiques ont découvert que les nouveaux chefs de projet se nourissent de deadlines.",
]

const randomSentence = funnyLoadingSentences[Math.floor(Math.random() * funnyLoadingSentences.length)];


const ScreenLoader = () => {
    return (
        <div className={`w-screen h-screen flex flex-col items-center justify-center gap-y-10 bg-gradient-to-br from-accent-green from-10% to-accent-dark`}>
            <div className="text-center text-light mb-4">
                <p className="text-xl">{randomSentence}</p>
            </div>
            <Dots item={dots} />
        </div>
    )
}

export default ScreenLoader;