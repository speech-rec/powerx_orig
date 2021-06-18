import React from 'react';
import CustomDropDown from '../../components/customDropdown/dropdown.customDropdown';
import CustomButton from '../../components/custom-button/custom-button.component';
import ToggleButton from 'react-toggle-button';
import {SampleRates, Languages, Specialities} from '../../aws/constants';
import {connect} from 'react-redux';
import {setSetting} from '../../redux/aws/aws.action';
import {selectCurrentSetting} from '../../redux/aws/aws.selectors';
import {selectCurrentUser} from '../../redux/user/user.selectors';
import { createStructuredSelector } from 'reselect';
import {withRouter} from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "react-toastify/dist/ReactToastify.css";
import "./settings.css";
import { faCheck } from '@fortawesome/free-solid-svg-icons';

class SettingPage extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            sampleRate: '16000',
            language: 'en-US',
            speciality: 'PRIMARYCARE',
            isSoundActive: false
        }
    }
    componentDidMount(){
        const { sampleRate, language, speciality, isSoundActive } = this.props.awsSetting;

        this.setState({
            sampleRate: sampleRate,
            language: language.split("\n")[0],
            speciality: speciality,
            isSoundActive: isSoundActive
        });
        console.log(language);
    }
    handleChange = event => {
        // console.log('handle change');
        const {value, name} = event.target;
        this.setState({[name]: value});
        console.log(value);
       
    };
    handleClick = event => {
        const {setSetting, history} = this.props;
        const {sampleRate, language, speciality, isSoundActive} = this.state;
        const { id } = this.props.currentUser;
        try{
            fetch(`/updateSetting/${id}/${language}/${speciality}/${sampleRate}/${isSoundActive}`).then(res => res.json()).then((result) => {
                console.log(result);
                
                const {setSetting} = this.props;
                
                        setSetting({
                            language: language,
                            speciality: speciality,
                            sampleRate: sampleRate ,
                            isSoundActive: isSoundActive
                        });
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
                console.log(e.message);
            });

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
            console.log('error while signup: ', error.message);
        }
        setSetting({
            sampleRate: sampleRate,
            language: language,
            speciality: speciality,
            isSoundActive: isSoundActive
        });
        history.push('/dashboard');

    }
    render(){
        return(
            <div className="app-container">
                <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable={false}
          pauseOnHover
          type="info"
        />
        <div className="Signin-form"> 
        <CustomDropDown type='json' value={this.state.language} selectedSetting={this.state.language} options={Languages} name='language' handleChange={this.handleChange} />
                    <CustomDropDown  type='array' value={this.state.speciality} selectedSetting={this.state.speciality} options={Specialities} name='speciality' handleChange={this.handleChange} />
                    <CustomDropDown type='array' value={this.state.sampleRate} selectedSetting={this.state.sampleRate} options={SampleRates} name='sampleRate' handleChange={this.handleChange} />
                  <div className="toggleDiv">
                  <p>Recording Beep Sound</p>
                  <ToggleButton
  inactiveLabel={''}
  activeLabel={''}
  colors={{
    activeThumb: {
      base: 'rgb(250,250,250)',
    },
    inactiveThumb: {
      base: 'rgb(62,130,247)',
    },
    active: {
      base: 'rgb(207,221,245)',
      hover: 'rgb(177, 191, 215)',
    },
    inactive: {
      base: 'rgb(65,66,68)',
      hover: 'rgb(95,96,98)',
    }
  }}
//   trackStyle={styles.trackStyle}
//   thumbStyle={styles.thumbStyle}
 
   
  value={this.state.isSoundActive}
  onToggle={(value) => {
    this.setState({
      isSoundActive: !value,
    });
  }} />
                  </div>
                    <CustomButton  type='button' onClick={this.handleClick} className='button'>
                    SAVE
                </CustomButton>
        </div>
</div>
        );
    }
    
}
const mapStateToProps = createStructuredSelector({
    awsSetting: selectCurrentSetting,
    currentUser: selectCurrentUser,
  });

const mapDispatchToProps = dispatch => ({
    setSetting: settings => dispatch(setSetting(settings))
  });
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SettingPage));