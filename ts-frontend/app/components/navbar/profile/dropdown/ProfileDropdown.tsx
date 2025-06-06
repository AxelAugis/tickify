import ProfileDropdownElement, { ProfileDropdownElementProps } from "./element/ProfileDropdownElement";

export interface ProfileDropdownProps {
    item: {
        isOpen: boolean;
        onclick: () => void;
        styles: {
            dropdown: string;
            active: string;
        }
        elements: ProfileDropdownElementProps["item"][];
    },
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ item }) => {
    return (
        <div className={`min-w-3xs shadow-md absolute right-0 top-[110%] bg-light rounded-lg  transition-all duration-300 ease-in-out cursor-pointer ${item.styles.dropdown} ${item.isOpen ? item.styles.active : ""}`}>
            {
                item.elements.map((element, index) => (
                   <ProfileDropdownElement key={index} item={element} lastIndex={index === item.elements.length - 1} firstIndex={index === 0} />
                ))
            }
        </div>
    )
}

export default ProfileDropdown;