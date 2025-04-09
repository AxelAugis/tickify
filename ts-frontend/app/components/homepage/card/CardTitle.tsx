import React from 'react';
import styles from './Card.module.css';

interface CardTitleProps {
  text: string;
}

const CardTitle: React.FC<CardTitleProps> = ({ text }) => {
    return (
        <h3 className={`relative z-10 text-3xl font-medium text-dark font-ubuntu ${styles.title}`}>
            {text}
        </h3>
    )
}

export default CardTitle;