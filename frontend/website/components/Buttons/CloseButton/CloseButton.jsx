import Image from 'next/image'

const CloseButton = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            type="button"
            className={`p-1.5 flex justify-center items-center rounded-full bg-transparent hover:bg-neutral-200 backdrop-blur-md transition-colors `}
        >
            <Image
                src={'/images/icons/cross.svg'}
                alt='close'
                width={24}
                height={24}
                className={`w-4 h-4`}
            />
        </button>
    )
}

export default CloseButton