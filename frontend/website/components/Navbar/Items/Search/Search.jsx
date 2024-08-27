import Image from "next/image";

const Search = ({ item }) => {
    return (
        <form className={`flex items-center bg-white/10 backdrop-blur-sm text-sm border border-white rounded-lg`}>
            <input type="search" name="search" placeholder={item.placeholder} className={`py-1.5 px-2 bg-transparent  focus:outline-none focus:bg-transparent placeholder:text-white`} />
            <button type="submit" className={`h-full px-2 border-l border-white/50`}>
                <Image
                    src={item.icon.src}
                    alt={item.icon.alt}
                    width={item.icon.width}
                    height={item.icon.height}
                />
            </button>
        </form>
    )
}

export default Search;