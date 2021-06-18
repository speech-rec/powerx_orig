import React from 'react';
import './about.css';
const AboutUs = ({imagePath, text}) => {
    return(
        <div className="app-container"> 
        
        <div className="subContainer"> 
        <h1 style={{color: '#4C5470'}}>About Us!</h1>
        <img className="img"src={imagePath} alt="img"/>
        <p>{text}</p>
        
       
       </div>
    </div>
    );
};

export default AboutUs;