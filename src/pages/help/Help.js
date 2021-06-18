import React from 'react';
import './Help.css';
const HelpScreen = ({userName, imagePath, text}) => {
    return(
        <div className="app-container"> 
        
        <div className="subContainer"> 
        <h1 style={{color: '#4C5470'}}>Hi {userName}!</h1>
        <img className="img"src={imagePath} alt="img"/>
        <p>{text}</p>
        
       
       </div>
    </div>
    );
};

export default HelpScreen;