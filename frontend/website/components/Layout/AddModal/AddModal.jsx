import { useEffect } from "react";
import FormProject from "./Forms/Project/FormProject";
import FormTicket from "./Forms/Ticket/FormTicket";

const AddModal = ({ context, modalStyle, handleModal, refreshProjects, projects }) => {


    const renderForm = () => {
        switch(context) {
            case 'project': 
              return <FormProject handleModal={handleModal} refreshProjects={refreshProjects} />;  
            case 'ticket':
                return <FormTicket handleModal={handleModal}  projects={projects} />;
        }
    }

    return (
        <div 
            className={`w-full h-full fixed top-0 left-0 z-50 bg-black/50  flex justify-center items-center transition-all duration-500 ease-in-out transform ${ modalStyle ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
        >
            {renderForm()}
        </div>
    )
}

export default AddModal;