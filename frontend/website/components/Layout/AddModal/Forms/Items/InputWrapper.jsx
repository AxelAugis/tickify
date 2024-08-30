import Select from "./Inputs/Select/Select"
import TextArea from "./Inputs/TextArea"
import TextInput from "./Inputs/TextInput"
import Label from "./Label/Label"
import { MuiColorInput } from 'mui-color-input'

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
                        input.disabled && (input.disabled === true || input.options.length === 0) ? null :
                        <>
                            <Label key={input.name} label={input.label} />
                            <Select key={input.name} select={input} />
                        </>
                    )
                case 'color':
                    return (
                        <>
                            <Label key={input.name} label={input.label} />
                            <MuiColorInput format="hex" value={input.value} name={input.name} onChange={input.onChange} />
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