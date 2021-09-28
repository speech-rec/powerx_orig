import React from 'react';

import './sign-in.style.css';


import {setCurrentuser} from '../../redux/user/user.action';
import {setTemplates, setSelectedTemplate} from '../../redux/template/template.action';
import {setNavigationPath} from '../../redux/naviagtor/navigator.action';
import {setSetting} from '../../redux/aws/aws.action';
import {setPunctuationKeyWords} from '../../redux/customDictionary/dictionary.action';
import { connect } from 'react-redux';
import {log} from '../../aws/main';
import {Link} from 'react-router-dom';

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
            fetch(`/login/${email}/${password}`).then(res => res.json()).then((result) => {
               
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
                    const {setTemplates, setCurrentuser, setSetting, setPunctuationKeyWords} = this.props;
                    if(result.id != 0 && result.id != undefined){
                        fetch(`/GetTemplatesByUserId/${result.id}`).then(res => res.json()).then((templates) => {
                            log(templates);
                                
                                setTemplates(templates);
                                
                            }).catch((e) => {
                                
                                log(e);
                            });;
                            
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

                        setSetting({
                            language: result.oSettings.Language,
                            speciality: result.oSettings.Speciality,
                            sampleRate: result.oSettings.SampleRate,
                            isSoundActive: result.oSettings.IsSoundActive,
                            streamType: result.oSettings.StreamType,
                            IsCustomDicionaryActive: result.oSettings.IsCustomDicionaryActive,
                            IsAutoPunctuationActive: result.oSettings.IsAutoPunctuationActive,
                            IsDictaPhoneActive: result.oSettings.IsDictaPhoneActive
                        });
                        setPunctuationKeyWords(result.oPunctuationKeyWords);
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
            // fetch(`http://notesapp.kapreonline.com/api/api.ashx?methodname=login&email=${email}&password=${password}`, headers
            // ).then(res => res.json()).then((result) => {
            //     if(result.id != 0){
            //         const {setCurrentuser} = this.props;
            //         setCurrentuser(
            //             {
            //                 email: this.state.email,
            //                 displayName: result.userName,
            //                 id: result.id,
            //                 studentClass: null
            //             }
            //         );
            //     }
                
            // }).catch((e) => alert(e));
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
                <a href="http://alphanotes.kapreonline.com/ForgetPassword.aspx" style={{display: 'flex', justifyContent: 'flex-end', color: '#464646', width: '90%'}} >Forget Password?</a>
               
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

const mapDispatchToProps = dispatch => ({
    setCurrentuser: user => dispatch(setCurrentuser(user)),
    setTemplates: templates => dispatch(setTemplates(templates)),
    setSelectedTemplate: templateId => dispatch(setSelectedTemplate(templateId)),
    setNavigationPath: path => dispatch(setNavigationPath(path)),
    setSetting: settings => dispatch(setSetting(settings)),
    setPunctuationKeyWords: keywords => dispatch(setPunctuationKeyWords(keywords))
  });

export default connect(null, mapDispatchToProps)(SignIn);