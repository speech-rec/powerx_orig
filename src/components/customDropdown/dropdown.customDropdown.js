import React from 'react';
import './dropdown.customDropdown.css';

const CustomDropDown = ({handleChange, type, options, selectedSetting , ...otherProps}) => {
    console.log(selectedSetting);
    return(
        <select placeholder='SELECT SAMPLE RATE' className='in-box' onChange={handleChange} {...otherProps} value={selectedSetting}>
            {type == "json" ? Object.keys(options).map((key) => <option key={key} value={options[key]}>{key} </option>) : 
            options.map((value) => <option key={value} value={value}>{value}</option>)
            }
        </select>
    );
}

export default CustomDropDown;