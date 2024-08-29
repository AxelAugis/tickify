import Link from 'next/link';

const Option = ({ option, onClick, isFirst }) => {
    return (
        <button 
            type='button'
            onClick={onClick}
            className={`w-full text-start font-medium text-primary-light-text bg-transparent hover:bg-black/10 transition-colors px-4 py-2 ${isFirst ? 'rounded-t-lg' : '' }`}
        >
            {option.name}
        </button>
    )
}

export default Option;