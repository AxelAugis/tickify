import Image from "next/image";
import styles from "./Avatar.module.css";
import { useRef } from "react";
import Item from "../Item/Item";

const Avatar = ({ avatar }) => {

    const dropdownRef = useRef(null);

    const handleDropdown = () => {
        dropdownRef.current.classList.toggle(`${styles.open}`);
    }

    return (
        <div className={`relative flex justify-center items-center text-base w-12 h-12 p-2 rounded-full`}>
            <button onClick={handleDropdown}>
                <Image
                    src={avatar.icon.src}
                    alt={avatar.icon.alt}
                    width={avatar.icon.width}
                    height={avatar.icon.height}
                />
            </button>
            <div ref={dropdownRef} className={`${styles.dropdownMenu}`}>
                {
                    avatar.dropdownItems.map((item, index) => {
                        return <Item key={index} item={item} onClick={handleDropdown} />
                    })
                }
            </div>
        </div>
    );
}

export default Avatar;