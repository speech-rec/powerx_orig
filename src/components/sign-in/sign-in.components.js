import React from 'react';

import './sign-in.style.css';


import {setCurrentuser} from '../../redux/user/user.action';
import {selectUserCredential} from '../../redux/user/user.selectors';
import {setTemplates, setSelectedTemplate} from '../../redux/template/template.action';
import {setNavigationPath} from '../../redux/naviagtor/navigator.action';
import {setSetting} from '../../redux/aws/aws.action';
import {setPunctuationKeyWords, setDictionary} from '../../redux/customDictionary/dictionary.action';
import {setPackages, setUserPackages, setUserLicenseData} from '../../redux/licensing/licensing.action';
import { connect } from 'react-redux';
import {createStructuredSelector} from 'reselect';
import {log} from '../../aws/main';
import {Link} from 'react-router-dom';

import {BASE_URL} from '../../constants/urls.constants'

import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


class SignIn extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            email: '',
            password: ''
        }
    };
    componentDidMount(){
        var {previousUserCredential} = this.props;
        console.log(previousUserCredential);
        if(previousUserCredential != null){
            this.setState({
                email: previousUserCredential.email,
                password: ''
            });
        }
    }
    handleSubmit = async e =>{
        e.preventDefault();
        const {email, password} = this.state;
        if(!(!!email)){
            toast('Kindly Provide Email', {
                position: "bottom-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                type: 'error'
                
                });
                return;
        }
        if(!(!!password)){
            toast('Kindly Provide Password', {
                position: "bottom-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                type: 'error'
                
                });
                return;
        }
        
        toast('Signing In', {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            type: 'info'
            
            });
        
        try{
            log(email, password);
            fetch(`${BASE_URL}login&email=${email}&password=${password}`).then(res => res.json()).then((result) => {
               
                if(result.IsError == true){
                    toast(result.ErrorMessage, {
                        position: "bottom-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: false,
                        progress: undefined,
                        type: 'error'
                        
                        });
                }else{
                    const {setTemplates, setCurrentuser, setSetting, setPunctuationKeyWords, setDictionary, setPackages, setUserPackages, setUserLicenseData} = this.props;
                    if(result.id != 0 && result.id != undefined){
                        
                            
                        setCurrentuser(
                            {
                                email: this.state.email,
                                displayName: result.userName,
                                id: result.id,
                                studentClass: null,
                                password: result.password,
                                profileURL: result.ProfileURL
                            }
                           
                        
                        );
                        setTemplates(result.oTemplates);
                        setSetting({
                            language: result.oSettings.Language.replace("\n", "").trim(),
                            speciality: result.oSettings.Speciality,
                            sampleRate: result.oSettings.SampleRate,
                            isSoundActive: result.oSettings.IsSoundActive,
                            streamType: result.oSettings.StreamType.replace("\n", "").trim(),
                            IsCustomDicionaryActive: result.oSettings.IsCustomDicionaryActive,
                            IsAutoPunctuationActive: result.oSettings.IsAutoPunctuationActive,
                            IsDictaPhoneActive: result.oSettings.IsDictaPhoneActive
                        });
                        setPunctuationKeyWords(result.oPunctuationKeyWords);
                        setDictionary(result.oDictionary);
                        setPackages(result.oPackages);
                        setUserPackages(result.oUserPackage);
                        if(result.oUserPackage != null){
                            setUserLicenseData(result.oUserPackage.oRecord);
                        }
                        // setNavigationPath('/signin');
                    }else{
                        toast('Invalid login credentials', {
                            position: "bottom-center",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: false,
                            draggable: false,
                            progress: undefined,
                            type: 'error'
                            
                            });
                    }
                }
                
                    
                }).catch((e) => {
                    toast('Oops! something went wrong.', {
                        position: "bottom-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: false,
                        progress: undefined,
                        type: 'error'
                        
                        });
                    log(e);
                });;
           
        }catch(error){
            toast('Oops! something went wrong.', {
                position: "bottom-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                type: 'error'
                
                });
            log(error.message);
        }
        
    }

    handleChange = event =>{
        const {value, name} = event.target;
        this.setState({[name]: value});
    }
    render(){
        
        return(
            <div>
                <ToastContainer
position="bottom-center"
autoClose={5000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick
rtl={false}
pauseOnFocusLoss
draggable={false}
pauseOnHover
type='info'
/>
<div className="container">
        <div className="Signin-form"> 
        
       
            <form autoComplete='off'>
                
                
                <input type="email" value={this.state.email} name='email' onChange={this.handleChange} placeholder="Email" className="in-box"/>
                <input type="password" value={this.state.password} name='password' onChange={this.handleChange} placeholder="Password" className="in-box"/>
                <a href="http://an.pixcile.com/ForgetPassword.aspx" style={{display: 'flex', justifyContent: 'flex-end', color: '#464646', width: '90%'}} >Forgot Password?</a>
               
                <button onClick={this.handleSubmit} className="button">Sign In</button>
            </form>
            <p>Don't have an account?</p>
            <Link className='signup' to='/signup'>
            Register
            </Link>
            
        </div>
</div>
</div>
          
        );
    
}}

const mapStateToProps = createStructuredSelector({
    previousUserCredential: selectUserCredential,
});

const mapDispatchToProps = dispatch => ({
    setCurrentuser: user => dispatch(setCurrentuser(user)),
    setTemplates: templates => dispatch(setTemplates(templates)),
    setSelectedTemplate: templateId => dispatch(setSelectedTemplate(templateId)),
    setNavigationPath: path => dispatch(setNavigationPath(path)),
    setSetting: settings => dispatch(setSetting(settings)),
    setPunctuationKeyWords: keywords => dispatch(setPunctuationKeyWords(keywords)),
    setDictionary: dictionary => dispatch(setDictionary(dictionary)),
    setPackages: packages => dispatch(setPackages(packages)),
    setUserPackages: userPackages => dispatch(setUserPackages(userPackages)),
    setUserLicenseData: licenseData => dispatch(setUserLicenseData(licenseData))
  });

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);