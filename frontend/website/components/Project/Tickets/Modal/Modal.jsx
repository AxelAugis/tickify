import Details from "./Details/Details";

const Modal = ({ ticket, modalStyle, handleModal, refreshData }) => {
    return (
        <div 
            className={`w-full h-full fixed top-0 left-0 z-50 bg-black/50  flex justify-center items-center
                        transition-all duration-500 ease-in-out transform
                        ${
                            modalStyle ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
                          }
                        `}>
            {
                ticket && (
                    <Details handleModal={handleModal} ticket={ticket} refreshData={refreshData} />
                )
            }

        </div>
    )
}

export default Modal;