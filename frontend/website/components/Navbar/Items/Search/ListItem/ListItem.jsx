import Link from "next/link";

const ListItem = ({ item }) => {
    return (
        <li className="flex items-center gap-4 py-2 px-4  bg-white/10 hover:bg-white/30 transition-colors">
            <Link 
                href={item.url} 
                className=" flex justify-between items-center w-full font-inter font-medium "
            >
                <span>{item.name ? item.name : item.title ? item.title : ''}</span>
            </Link>
        </li>
    )
}

export default ListItem;