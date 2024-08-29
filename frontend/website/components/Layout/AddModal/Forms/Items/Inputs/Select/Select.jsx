import { useRef, useState } from "react";
import Option from "./Option/Option";
import styles from "./Select.module.css"

const Select = ({ select }) => {

    const [selectedOption, setSelectedOption] = useState('Choisissez un projet')
    const [optionValue, setOptionValue] = useState(null)

    const dropdownRef = useRef(null);

    const handleDropdown = (option) => {
        const dropdown = dropdownRef.current;
        dropdown.classList.toggle(`${styles.open}`)
        if(option && option.name) {
            setSelectedOption(option.name)
            setOptionValue(option.id)
            select.onChange({ target: { name: select.name, value: option.id } }) 

        }
    }

    return (
        // <select
        //     value={select.value}
        //     onChange={select.onChange}
        //     name={select.name}
        //     id={select.name}
        //     className={`font-medium text-sm w-full rounded-md focus:outline-none border py-1 pl-1`}>
        //         <option value="" disabled selected>Sélectionnez un projet</option>
        //     {
        //         select.options.map(option => (
        //             <option key={option.id} value={option.id}>{option.name}</option>
        //         ))
        //     }
        // </select>
        <div className={`relative font-medium text-sm w-full rounded-md focus:outline-none border py-1 pl-2`}>
            <button 
                type="button"
                onClick={handleDropdown}
                className={`w-full text-start py-1  bg-white/10 hover:bg-white/20 border border-white transition-all rounded-lg`}>
                {selectedOption}
            </button>
            <div ref={dropdownRef} className={`${styles.dropdownMenu}`}>
                {
                    select.options.map((option, index) => {
                        return <Option key={index} option={option} onClick={() => handleDropdown(option)} isFirst={index === 0} />
                    })
                }
            </div>
            <input type="hidden" value={selectedOption} name={select.name} />
        </div>
    )
}

export default Select;