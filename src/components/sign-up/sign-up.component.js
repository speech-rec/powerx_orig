import React from 'react'


import {setCurrentuser} from '../../redux/user/user.action';
import {setSetting} from '../../redux/aws/aws.action';
import {Link} from 'react-router-dom';
import { connect } from 'react-redux';
import {log} from '../../aws/main';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './sign-up.style.css';

class SignUp extends React.Component{
    constructor(){
        super();
        this.state = {
            displayName: '',
            email: '',
            password: '',
            studentClass: '',
            rePassword: ''
        }
    }

    componentWillUnmount(){
        this.setState({
            displayName: '',
            email: '',
            password: '',
            studentClass: '',
            rePassword: ''
        });
    }
    handleSubmit = async event => {
        event.preventDefault();
        const {displayName, email, password, rePassword} = this.state;
        if(password != rePassword){
            toast('Password mis-matched. Kindly re-enter password correctly', {
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
            
        }else{
            toast('Registering User', {
                position: "bottom-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                type: 'info'
                
                });
            
            // if(password !== confirmPassword){
            //     alert('password donot match');
            //     return;
            // }
            try{
                fetch(`/register/${displayName}/${email}/${password}`).then(res => res.json()).then((result) => {
                 
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
                    }
                    else if(result.IsActive == false){
                        this.setState({
                            displayName: '',
                            email: '',
                            password: '',
                            rePassword: ''
                        });
                        toast(result.ErrorMessage, {
                            position: "bottom-center",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: false,
                            draggable: false,
                            progress: undefined,
                            type: 'success'
                            
                            });
                    }
                    else{
                        const {setCurrentuser, setSetting, setNavigationPath} = this.props;
                        setCurrentuser({
                                    id: result.id,
                                    email: email,
                                    displayName: displayName,
                                    password: password,
                                    profileURL: result.ProfileURL
                                });
                                setSetting({
                                    language: result.oSettings.Language,
                                    speciality: result.oSettings.Speciality,
                                    sampleRate: result.oSettings.SampleRate,
                                    isSoundActive: result.oSettings.IsSoundActive,
                                    IsCustomDicionaryActive: result.oSettings.IsCustomDicionaryActive
                                });
                                setNavigationPath(null);
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
                    log(e.message);
                });
                // fetch(`http://notesapp.kapreonline.com/api/api.ashx?methodname=signup&email=${email}&password=${password}&name=${displayName}&class=${studentClass}`)
                // .then(res => res.json()).then((result) => {
                //     this.props.setCurrentuser({
                //         id: result,
                //         email: email,
                //         displayName: displayName,
                //         studentClass: studentClass
                //     })
                // });
                // this.setState({
                //     displayName: '',
                //     email: '',
                //     password: '',
                //     studentClass: ''
                // });
    
    
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
                log('error while signup: ', error.message);
            }
        }
        
    }

    handleChange = event => {
        const {name, value} = event.target;
        this.setState({
            [name]: value
        });

    }
    render(){
        const {displayName, email, password, rePassword} = this.state;
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
        <div className="login-form"> 
        
       
            <form autoComplete='off' onSubmit={this.handleSubmit}>
                
                <input type="text" required name='displayName' value={displayName} onChange={this.handleChange} placeholder=" Name" className="in-box"/>
                <input type="email" required autoComplete='off' name='email' value={email} placeholder="Email" onChange={this.handleChange} className="in-box"/>
                <input type="password" required name='password' value={password} placeholder="Password" onChange={this.handleChange} className="in-box"/>
                <input type="password" required name='rePassword' value={rePassword} placeholder="Retype Password" onChange={this.handleChange} className="in-box"/>
                <input type='submit' placeholder='submit'  className='button'/>
                {/* //<button onClick={this.handleSubmit} class="button">Register</button> */}
            </form>
            <p>Already have an account?</p>
            <Link className='signlink' to='signin'>
                Sign In
            </Link>
        </div>
    </div>
          </div>      
        );
    
}};
const mapDispatchToProps = dispatch => ({
    setCurrentuser: user => dispatch(setCurrentuser(user)),
    setSetting: settings => dispatch(setSetting(settings))
  });

export default connect(null, mapDispatchToProps)(SignUp);