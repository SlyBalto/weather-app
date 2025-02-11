import React from 'react';
import 'tailwindcss/tailwind.css';

const InfoBox = ({ title, info, image }) => {
    return (
        <div className="flex flex-col space-y-4">
            <h3 className="inner-box-1">{title}</h3>
            <img className='h-10' src={image} alt="placeholder" />
            <h3 className="inner-box-1">{info}</h3>
        </div>
    );
};

export default InfoBox;