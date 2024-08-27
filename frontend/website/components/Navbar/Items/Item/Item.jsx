import Link from 'next/link';

const Item = ({ item, onClick }) => {
    return (
        <Link 
            onClick={onClick}
            href={item.url}
            className={`w-full font-medium text-white bg-transparent hover:bg-white/30 transition-colors px-4 py-2 rounded-lg`}
        >
            {item.label}
        </Link>
    )
}

export default Item;