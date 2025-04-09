import React from 'react';
import CardTitle from './CardTitle';
import styles from './Card.module.css';

interface CardProps {
    title: string;
    height?: string;
}


const Card: React.FC<CardProps> = ({ title, height }) => {

    const cardHeight = height ? height : 'h-3/4';
    return (
        <div className={`heroCard ${cardHeight} ${styles.card} 2xl:w-1/4 rounded-lg bg-light pt-16 flex flex-col items-center hover:-translate-y-2 translate-y-10 opacity-0 transition duration-300 ease-in-out cursor-pointer`}>
            <CardTitle text={title}/>
        </div>
    );
}

export default Card;