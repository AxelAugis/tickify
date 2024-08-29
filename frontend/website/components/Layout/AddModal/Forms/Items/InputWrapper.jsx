import Select from "./Inputs/Select/Select"
import TextArea from "./Inputs/TextArea"
import TextInput from "./Inputs/TextInput"
import Label from "./Label/Label"

const InputWrapper = ({ input }) => {

    const renderInputs = (input) => {
            switch(input.type) {
                case 'text':
                    return( 
                        <>
                            <Label key={input.name} label={input.label} />
                            <TextInput key={input.name} input={input} />
                        </>
                    )
                    
                case 'textarea':
                    return (
                        <>
                            <Label key={input.name} label={input.label} />
                            <TextArea key={input.name} input={input} />
                        </>
                    )
                case 'select': 
                    return (
                        <>
                            <Label key={input.name} label={input.label} />
                            <Select key={input.name} select={input} />
                        </>
                    )
                default:
                    return null
            }
    }

    return (
        <div className={`w-full flex flex-col gap-y-1`}>
            {renderInputs(input)}
        </div>
    )
}

export default InputWrapper;