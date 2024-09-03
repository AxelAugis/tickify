import { useEffect, useState } from "react";
import { apiUrl } from "@/utils/api";
import Link from "next/link";
import styles from "./Search.module.css";
import Title from "./Title/Title";
import ListItem from "./ListItem/ListItem";

const Search = ({ item }) => {

    const [searchResults, setSearchResults] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    const handleResearch = (e) => {
        const searchTerm = e.target.value;
        const token = localStorage.getItem('token');
        fetch(`${apiUrl}/api/search/get-all?term=${encodeURIComponent(searchTerm)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .then(data => {
                setSearchResults(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    useEffect(() => {
        if (searchResults && ((searchResults.projects && searchResults.projects.length > 0 )|| (searchResults.tickets && searchResults.tickets.length > 0))){
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    }, [searchResults, isOpen]);

    return (
        <div className={`relative flex items-center bg-white/10 backdrop-blur-sm text-sm border border-white rounded-lg`}>
            <input  
                onChange={handleResearch}
                type="search" 
                name="search" 
                placeholder={item.placeholder} 
                className={`py-1.5 px-2 bg-transparent  focus:outline-none focus:bg-transparent placeholder:text-white`}
            />
            <div className={`${styles.dropdownMenu} ${isOpen ? styles.open : ''}`}>
                {
                    searchResults && (
                        <>
                            {searchResults.projects && searchResults.projects.length > 0 && (
                                <div className={`flex flex-col font-inter`}>
                                    <Title  title={"Projets"} />
                                    <ul className="border-y-2 border-neutral-200/30">
                                        {
                                            searchResults.projects.map((project, index) => (
                                                <ListItem key={index} item={project} />
                                            ))
                                        }
                                    </ul>
                                </div>
                            )}
                                        
                            {searchResults.tickets && searchResults.tickets.length > 0 && (
                                <div className={`flex flex-col font-inter`}>
                                    <Title title={"Tickets"} />
                                    <ul className=" border-y-2 border-neutral-200/30">
                                        {
                                            searchResults.tickets.map((ticket, index) => (
                                               <ListItem key={index} item={ticket} />
                                            ))
                                        }
                                    </ul>
                                </div>
                            )}
                        </>
                    )
                }
            </div>
        </div>
    )
}

export default Search;