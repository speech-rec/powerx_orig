import logo from './logo.svg';
import './App.css';
import React from 'react';
import {Route, Switch, Redirect} from 'react-router-dom';
import {log} from './aws/main';
// import {startRecording, stopRecording} from './aws/main';
// import SignInPage from './pages/signin/signin.pages';
// import SignUpPage from './pages/signup/signup.pages';
import {selectCurrentUser} from './redux/user/user.selectors';
import {logoutUser, setPreviousUserCredential} from './redux/user/user.action';
import {selectAllTemplates} from './redux/template/template.selectors';
import {setTemplates} from './redux/template/template.action';
import {setDictionary} from './redux/customDictionary/dictionary.action';
import {setUserPackages, setUserLicenseData} from './redux/licensing/licensing.action';
import {createStructuredSelector} from 'reselect';
import {connect} from 'react-redux';

import {BASE_URL} from './constants/urls.constants';

import Recorder from './pages/recorder/recording.recorder';
import DashBoard from './pages/dashboard/dashboard';
import SignInPage from './pages/signin/signin.pages';
import SignUpPage from './pages/signup/signup.pages';
import HelpScreen from './pages/help/Help';
import AboutUs from './pages/aboutUs/about';
import Template from './pages/template/template.pages';
import Header from './components/header/header.component';
import HelpImage from './images/help.png';
import SettingsPage from './pages/settings/settings';
import LicensePage from './pages/licensing/license';
import FeaturesPage from './pages/features/features';
import ProfilePage from './pages/profile/profile';
import AboutImage from './images/abut.png'
class App extends React.Component {
  componentDidMount(){
    const {currentUser, templates} = this.props;

    log(currentUser);
    log(templates == null);
    log(currentUser == null);
    if(templates != null && currentUser != null){
      try{
        log('yes');
        const {setTemplates, setDictionary, setUserPackages, setUserLicenseData} = this.props;
        fetch(`${BASE_URL}GetTemplatesByUserId&userId=${currentUser.id}`).then(res => res.json()).then((result) => {
              
              log(result);
              setTemplates(result);
              
          }).catch((e) => {
              
              log(e);
          });
          fetch(`${BASE_URL}GetCustomDictionary`).then(res => res.json()).then((result) => {
         
              
            setDictionary(result);
            
        }).catch((e) => {
            
            log(e);
        });
        fetch(`${BASE_URL}GetUserLicenseData&uID=${currentUser.id}`).then(res => res.json()).then((result) => {
         
              
          setUserPackages(result);
                        if(result != null){
                            setUserLicenseData(result.oRecord);
                        }
          
      }).catch((e) => {
          
          log(e);
      });
      }
      catch(e){
        console.error(e.message);
      }
    }
  }
  
  componentWillUnmount(){
    var {setPreviousUserCredential } = this.props;
    var currentUser = this.props.currentUser;
    this.props.logoutUser(undefined);
    console.log(currentUser);
    setPreviousUserCredential({"email": currentUser.email, "password": currentUser.password});
  }
  render(){
    return (
      <div className="app-container">
        <Header />
        <Switch>

          <Route exact path='/' render={() => (<Redirect to='/dashboard' />)} />
          <Route exact path='/recorder' render={() => !!this.props.currentUser ? (<Recorder />): (<Redirect to='/signin' />)} />
          <Route exact path='/signup' render={() => !!this.props.currentUser ? (<Redirect to='/dashboard' />): (<SignUpPage />)} />
          <Route exact path='/dashboard' render={() => !!this.props.currentUser ? (<DashBoard />): (<Redirect to='/signin' />)} />
          <Route exact path='/signin' render={() => !!this.props.currentUser ? (<Redirect to='/dashboard' />): (<SignInPage />)} />
          <Route exact path='/helpscreen' render={() => !!this.props.currentUser ? (<HelpScreen imagePath={HelpImage} userName={this.props.currentUser.displayName} text='' />) : (<Redirect to='/signin' />)} />
          <Route exact path='/aboutus' render={() => !!this.props.currentUser ? (<AboutUs imagePath={AboutImage} text='Wanna know more about us? Have a meeting. Visit our website or contact us fo any query.'/>) : (<Redirect to='/signin' />)} />
          {/* <Route exact path='/profile' render={() => !!this.props.currentUser ? (<ProfilePage />) : (<Redirect to='/signin' />)} /> */}
          <Route exact path = '/settingscreen' render={() => !!this.props.currentUser ? (<SettingsPage />) : (<Redirect to='/signin' />)}/>
          <Route exact path = '/template' render={() => !!this.props.currentUser ? (<Template />) : (<Redirect to='/signin' />)}/>
          <Route exact path = '/license' render={() => !!this.props.currentUser ? (<LicensePage />) : (<Redirect to='/signin' />)}/>
          <Route exact path = '/features' render={() => !!this.props.currentUser ? (<FeaturesPage />) : (<Redirect to='/signin' />)}/>
          {/* <Route exact path='/signin' render={() => (<SignInPage />)}/>
          <Route exact path='/signup' render={() => (<SignUpPage />)}/>
          <Route exact path='/' render={() => (<Dashboard />)}/> */}
        </Switch>
        
      </div>
    );
  }
  
}

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
  templates: selectAllTemplates
});

const mapDispatchToProps = dispatch => ({
  setTemplates: templates => dispatch(setTemplates(templates)),
  setDictionary: dictionary => dispatch(setDictionary(dictionary)),
  logoutUser: data => dispatch(logoutUser(data)),
  setPreviousUserCredential: credential => dispatch(setPreviousUserCredential(credential)),
  setUserPackages: userPackages => dispatch(setUserPackages(userPackages)),
  setUserLicenseData: licenseData => dispatch(setUserLicenseData(licenseData))
});
export default connect(mapStateToProps, mapDispatchToProps)(App);
