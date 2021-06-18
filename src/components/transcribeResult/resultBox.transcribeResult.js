import React from 'react';

import './resultBox.transcribeResult.css';
const ResultBox = ({handleChange, value, ...otherProps}) => {
    return(
         <div className="result-box-wrapper flex-column-100">
        <textarea style={{height: "-webkit-fill-available"}} rows={15} className='resultBox' value={value} onChange={handleChange}  {...otherProps}/>
        
        </div>
    );
};

export default ResultBox;