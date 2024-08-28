'use client';
import Avatar from "./Items/Avatar/Avatar";
import DropdownMenu from "./Items/Dropdown/DropdownMenu"
import Logo from "./Items/Logo/Logo"
import Search from "./Items/Search/Search";

const Navbar = ({ items }) => {

    const renderleftItems = () => {
        return items.leftItems.map((item, index) => {
           switch(item.type) {
            case 'logo':
                return <Logo key={index} link={item} />
            case 'dropdown': 
                return <DropdownMenu key={index} items={item.dropdownItems} label={item.label} />
            default: 
                return null;
           }
        })
    }

    const renderRightItems = () => {
        return items.rightItems.map((item, index) => {
            switch(item.type) {
                case 'search':
                    return <Search key={index} item={item} />
                case 'avatar':
                    return <Avatar key={index} avatar={item} />
                default:
                    return null;
            }
        })
    }
    return (
        <nav className={`w-full flex items-center justify-between sticky top-0 left-0 z-50 bg-black/20 backdrop-blur-md px-8 py-3.5 text-primary-light-text text-white`}>
            <div className={`flex gap-x-8`}>
                {renderleftItems()}
            </div>
            <div className={`flex items-center gap-x-4`}>
                {renderRightItems()}
            </div>
        </nav>
    )
}

export default Navbar;