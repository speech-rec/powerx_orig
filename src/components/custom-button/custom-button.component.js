import React from 'react';

import './custom-button.style.css';
import Colors from '../../constants/colors.constants';
const CustomButton = ({children, isGoogleSignin, inverted, ...otherprops}) => {
    return(
        <button {...otherprops} className='button'>
            {children}
        </button>
    );
}

export default CustomButton;