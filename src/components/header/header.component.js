import React from 'react';
import {useLocation, Link} from 'react-router-dom';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import {selectPreviousPath} from '../../redux/naviagtor/navigator.selectors';
import {setTemplates, setSelectedTemplate} from '../../redux/template/template.action';
import {setCurrentuser, logoutUser, setPreviousUserCredential} from '../../redux/user/user.action';
import {setNavigationPath} from '../../redux/naviagtor/navigator.action';
import {log} from '../../aws/main';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSignOutAlt, faCogs } from '@fortawesome/free-solid-svg-icons';

import './header.style.css';

const Header = ({ currentUser, setCurrentuser, setTemplates, setSelectedTemplate, title, logoutUser, setPreviousUserCredential }) => {
    const location = useLocation();
    const signOut = () => {
        try {
            // setCurrentuser(null);
            // setTemplates(null);
            // setSelectedTemplate(0);
    logoutUser(undefined);
    setPreviousUserCredential({"email": currentUser.email, "password": ""});
         } catch (error) {
             log('error', error.response, error)                        
         }
    };
    return (
        <div className='header'>
            <h2 className='titleText'>
            ALPHA NOTES
            </h2>
            <div className='options'>
                
                <div className='title2' style={location.pathname.toLowerCase().includes('recorder') || 
                location.pathname.toLowerCase().includes('template')
                || location.pathname.toLowerCase().includes('settingscreen')
                || location.pathname.toLowerCase().includes('helpscreen') ? {width: '50%', height: '100%'} : {width: 0, height: 0}}>
                    {location.pathname.toLowerCase().includes('recorder') ||
                    location.pathname.toLowerCase().includes('template') ? <Link to='/settingscreen'>
                    SETTINGS <br/>
                     <FontAwesomeIcon icon={faCogs} style={{marginRight: '3px'}}/>
                    </Link> : location.pathname.toLowerCase().includes('helpscreen') ||
                    location.pathname.toLowerCase().includes('license') ||
                    location.pathname.toLowerCase().includes('features') ||
                    location.pathname.toLowerCase().includes('settingscreen') ? <Link to='/dashboard'>
                    BACK <br/>
                     <FontAwesomeIcon icon={faArrowLeft} style={{marginRight: '3px'}}/>
                    </Link> : 
                    
                    <div></div>}
                </div>
                {currentUser ? 
                <div className='option' onClick={signOut}>
                    SIGN OUT<br />
                    <FontAwesomeIcon icon={faSignOutAlt} style={{marginRight: '3px'}}/>
                </div> :

                <div></div>
                }
            </div>
           

        </div>
    );
}

const mapStateToProps = createStructuredSelector({
    currentUser: selectCurrentUser,
    previousPath: selectPreviousPath
});

const mapDispatchToProps = dispatch => ({
    setCurrentuser: user => dispatch(setCurrentuser(user)),
    setTemplates: templates => dispatch(setTemplates(templates)),
    setSelectedTemplate: id => dispatch(setSelectedTemplate(id)),
    setNavigationPath: path => dispatch(setNavigationPath(path)),
    logoutUser: data => dispatch(logoutUser(data)),
    setPreviousUserCredential: credential => dispatch(setPreviousUserCredential(credential))
  });

export default connect(mapStateToProps, mapDispatchToProps)(Header);