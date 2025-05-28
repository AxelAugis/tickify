export interface ProfileDropdownProps {
    item: {
        isOpen: boolean;
        onclick: () => void;
        styles: {
            dropdown: string;
            active: string;
        }
    }
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ item }) => {
    return (
        <div className={`min-w-3xs shadow-md absolute right-0 top-[110%] bg-light rounded-lg p-4 transition-all duration-300 ease-in-out ${item.styles.dropdown} ${item.isOpen ? item.styles.active : ""}`}>

        </div>
    )
}

export default ProfileDropdown;