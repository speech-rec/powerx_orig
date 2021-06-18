import React from 'react';

import './form-input.component.style.css';

const FormInput = ({handleChange, label, ...otherProps}) => {
    return(
            <input onChange={handleChange} className='form-input' {...otherProps}/>
            
    );
}

export default FormInput;