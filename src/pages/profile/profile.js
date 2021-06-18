import React from 'react';
import { createStructuredSelector } from 'reselect';
import {selectCurrentUser} from '../../redux/user/user.selectors';
import {connect} from 'react-redux';
import './profile.css';
const Profile = ({currentUser}) => {
    const {email, displayName, password, profileURL} = currentUser;
    return(
        <div className="app-container"> 
        
        <div className="subContainer"> 
        {/* <img className="img"src={profileURL} alt="img"/> */}
        <h1 style={{color: '#4C5470'}}>{displayName}</h1>
        <p>Email: {email}</p>
        {/* <p>Password: {password}</p> */}
        
       
       </div>
    </div>
    
    );
};

const mapStateToProps = createStructuredSelector({
    currentUser: selectCurrentUser,
});

export default connect(mapStateToProps, null)(Profile);