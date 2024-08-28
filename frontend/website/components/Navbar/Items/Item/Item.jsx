import Link from 'next/link';

const Item = ({ item, onClick, isFirst }) => {
    return (
        <Link 
            onClick={onClick}
            href={item.url}
            className={`w-full font-medium text-white bg-transparent hover:bg-white/30 transition-colors px-4 py-2 ${isFirst ? 'rounded-t-lg' : '' }`}
        >
            {item.label}
        </Link>
    )
}

export default Item;