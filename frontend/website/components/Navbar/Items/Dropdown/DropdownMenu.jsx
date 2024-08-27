import { useRef } from "react";
import styles from "./DropdownMenu.module.css";
import Item from "../Item/Item";

const DropdownMenu = ({ items, label }) => {

    const handleDropdown = () => {
        const dropdown = dropdownRef.current;
        dropdown.classList.toggle(`${styles.open}`)
    }

    const dropdownRef = useRef(null);
    return (
        <div className={`relative text-base rounded-lg `}>
            <button 
                onClick={handleDropdown}
                className={` text-center py-1.5 px-8 bg-white/10 hover:bg-white/20 border border-white transition-all rounded-lg`}>
                {label}
            </button>
            <div ref={dropdownRef} className={`${styles.dropdownMenu}`}>
                {
                    items.map((item, index) => {
                        return <Item key={index} item={item} onClick={handleDropdown} />
                    })
                }
            </div>
        </div>
    )
}

export default DropdownMenu;