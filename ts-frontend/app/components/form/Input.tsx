import Image from "next/image";

interface InputProps {
    item: {
        label: {
            htmlFor: string;
            text: string;
        }
        input: {
            type: string;
            id: string;
            name: string;
            placeholder: string;
            isVisible?: boolean;
            onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
            value: string;
            button?: {
                onClick: () => void;
            }
        },
        error: string | null;
    }
}

const Input: React.FC<InputProps> = ({ item }) => {

    const borderStyle = item.error ? "border-1.5 border-red-700" : "border-light/50";

    return (
        <div className={`w-full flex flex-col gap-y-1.5 text-light`}>
            <label htmlFor={item.label.htmlFor} className={`text-lg font-medium`}>{item.label.text}</label>
            {
                item.input.type == "password" ? (
                    <div className={`w-full overflow-hidden flex items-center justify-between bg-light/20 rounded-lg border ${borderStyle} focus-within:ring-2 focus-within:ring-light/50 focus-within:border-transparent`}>
                        <input
                            type={item.input.isVisible ? "text" : "password"}
                            id={item.input.id}
                            name={item.input.name}
                            className={`w-full h-12 py-2 px-4  rounded-lg focus:outline-none focus:ring-none`}
                            placeholder={item.input.placeholder}
                            value={item.input.value}
                            onChange={item.input.onChange}
                        />
                        <button 
                            type="button"
                            onClick={item.input.button?.onClick}
                            className={`w-12 h-12  rounded-lg    flex items-center justify-center`}
                        >
                            <Image
                                src={`/images/icons/eyes/${item.input.isVisible ? "eye-slash" : "eye"}.svg`}
                                alt="eye"
                                width={24}
                                height={24}
                                className={`w-6 h-6`}
                            />
                        </button>
                    </div>
                ) : (
                    <input
                        type={item.input.type}
                        id={item.input.id}
                        name={item.input.name}
                        value={item.input.value}
                        className={`w-full h-12 py-2 px-4 bg-light/20 rounded-lg border ${borderStyle} focus:outline-none focus:ring-2 focus:ring-light/50 focus:border-transparent`}
                        placeholder={item.input.placeholder}
                        onChange={item.input.onChange}
                    />
                )
            }
           {
             item.error && (
                <p className={`text-light font-medium`}>{item.error}</p>
            )
           }
        </div>
    )
}

export default Input;