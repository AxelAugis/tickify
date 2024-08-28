import Empty from "./Empty/Empty";
import Resume from "./Resume/Resume";
import Status from "./Status/Status";

const Wrapper = ({ tickets, status, handleModal }) => {
    return (
        <>
            <div className={`w-full h-fit py-4 flex flex-col items-center gap-y-4 px-2 bg-white/20 backdrop-blur-md rounded-md`}>
                <div className="w-full flex justify-between items-center ">
                    <Status status={status} />
                </div>
                {
                    tickets.length > 0 ? (
                        tickets.map(ticket => (
                            <Resume ticket={ticket} key={ticket.id} handleModal={handleModal} />
                        ))
                    ) : (
                        <Empty />
                    )
                }
            </div>
        </>
    )
}

export default Wrapper;