import React from 'react';
import CardTitle from './CardTitle';
import styles from './Card.module.css';

export interface CardProps {
    title: string;
    height?: string;
    content: string;
}


const Card: React.FC<CardProps> = ({ title, height, content }) => {

    const cardHeight = height ? height : 'h-fit lg:h-4/5 2xl:h-3/4';
    return (
        <div className={`heroCard ${cardHeight} ${styles.card} lg:w-1/3 2xl:w-1/4 rounded-lg bg-light pt-16 flex lg:flex-col gap-y-8 px-8 items-center hover:-translate-y-2 translate-y-10 lg:opacity-0 transition duration-300 ease-in-out cursor-pointer`}>
            <CardTitle text={title}/>
            <p className="text-xl  text-center font-bold text-accent-dark font-cabin  rounded-lg transition duration-300 ease-in-out">
                {content}
            </p>
        </div>
    );
}

export default Card;