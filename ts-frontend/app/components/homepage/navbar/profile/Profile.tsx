import Image from "next/image";
import ProfileDropdown, { ProfileDropdownProps } from "./dropdown/ProfileDropdown";

export interface ProfileProps {
    item: {
        isOpen: boolean;
        onclick: () => void;
        dropdown: ProfileDropdownProps["item"];
    };
}

const Profile: React.FC<ProfileProps> = ({ item }) => {
    return (
        <div className={`relative`}>
            <button className={`flex justify-center items-center w-12 h-12 rounded-full bg-accent-dark-green`} onClick={item.onclick}>
                <Image
                    src={"/images/icons/profile.svg"}
                    alt="Profile"
                    width={40}
                    height={40}
                    className={`cursor-pointer min-w-6 min-h-6 max-w-6 max-h-6 `}
                />
            </button>
            <ProfileDropdown item={item.dropdown} />
        </div>

    )
}

export default Profile;