const { default: Image } = require("next/image")

const DeleteButton = ({ onClick }) => {
    return (
        <button>
            <Image src="/images/icons/delete.svg" alt="delete" width={20} height={20} />
        </button>
    )
}