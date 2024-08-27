import Link from 'next/link';
const Logo = ({ link }) => {
    return (
        <Link 
            href={link.url}
            className={`text-3xl font-poppins font-medium`}
        >
            {link.label}
        </Link>
    )
}

export default Logo;