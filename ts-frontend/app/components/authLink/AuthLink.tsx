import Link from "next/link";

export interface AuthLinkProps {
    item: {
        url: string;
        label: string;
    }
}

const AuthLink: React.FC<AuthLinkProps> = ({ item }) => {
    return (
        <Link 
            href={item.url}
            className="text-xl font-bold text-accent-dark font-cabin py-2 px-4 hover:bg-accent-dark hover:text-accent-green rounded-lg transition duration-300 ease-in-out"
        >
            {item.label}
        </Link>
    )
}

export default AuthLink;