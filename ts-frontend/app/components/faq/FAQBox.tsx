import Image from "next/image";

interface FAQBoxProps {
    item: {
        title: string;
        onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
        styles: React.CSSProperties;
        contents: string[];
    };
}

const FAQBox: React.FC<FAQBoxProps> = ({ item }) => {
    return (
        <div className={`w-full rounded-lg bg-accent-dark text-accent-green `}>
            <button
                onClick={item.onClick} 
                className={`text-xl w-full flex items-center justify-between cursor-pointer p-5`}
            >
                {item.title}
                <Image 
                    src={`/images/icons/crosses/green-cross.svg`}
                    alt="Une croix verte"
                    width={80}
                    height={80}
                    className={`w-10 h-auto rotate-45 transition-transform`}
                />
            </button>
            <div className={`w-full ${item.styles.content}`}>
                <p className={`w-full px-5 pb-5 text-lg flex flex-col text-light`}>
                  {
                    item.contents.map((content, index) => (
                        <span key={index} className={``}>
                            {content}
                        </span>
                        ))
                  }
                </p>
            </div>
        </div>
    )
}

export default FAQBox;