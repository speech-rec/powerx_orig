import React from 'react';
import CustomDropDown from '../../components/customDropdown/dropdown.customDropdown';
import CustomButton from '../../components/custom-button/custom-button.component';
import ToggleButton from 'react-toggle-button';
import {SampleRates, Languages, Specialities, StreamTypes} from '../../aws/constants';
import {connect} from 'react-redux';
import {setSetting} from '../../redux/aws/aws.action';
import {selectCurrentSetting} from '../../redux/aws/aws.selectors';
import {selectCurrentUser} from '../../redux/user/user.selectors';
import { createStructuredSelector } from 'reselect';
import {withRouter} from 'react-router-dom';
import {log} from '../../aws/main';

import {BASE_URL} from '../../constants/urls.constants';

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
            streamType: 'stream-transcription-websocket',
            isSoundActive: false,
            isDisabled: false,
            languages: [],
            IsCustomDicionaryActive: false,
            IsAutoPunctuationActive: false,
            IsDictaPhoneActive: false
        }
    }
    componentDidMount(){
        const { sampleRate, language, speciality, isSoundActive, streamType, IsCustomDicionaryActive, IsAutoPunctuationActive, IsDictaPhoneActive } = this.props.awsSetting;

        this.setState({
            sampleRate: streamType == 'stream-transcription-websocket' ? sampleRate : 16000,
            language: streamType == 'stream-transcription-websocket' ? language : 'en-US',
            speciality: speciality,
            isSoundActive: isSoundActive,
            streamType: streamType,
            languages: streamType == 'stream-transcription-websocket' ? Languages: {
              'US English': 'en-US',
              'British English': 'en-GB'
            },
            isDisabled: streamType == 'stream-transcription-websocket' ? false : true,
            IsCustomDicionaryActive: IsCustomDicionaryActive,
            IsAutoPunctuationActive: IsAutoPunctuationActive,
            IsDictaPhoneActive: IsDictaPhoneActive
        });
        log(language);
    }
    handleChange = event => {
        // log('handle change');
        const {value, name} = event.target;
        this.setState({[name]: value});
        if(name == "streamType"){
          if(value == "medical-stream-transcription-websocket"){
            this.setState({
              isDisabled: true,
              sampleRate: 16000,
              language: 'en-US',
              languages: {
                'US English': 'en-US',
                // 'British English': 'en-GB'
              }
            });
          }else{
            this.setState({
              isDisabled: false,
              sampleRate: 16000,
              languages: Languages,
              speciality: 'PRIMARYCARE'
            });
          }
        }
        log(value);
       
    };
    handleClick = event => {
        const {setSetting, history} = this.props;
        const {sampleRate, language, speciality, isSoundActive, streamType, IsCustomDicionaryActive, IsAutoPunctuationActive, IsDictaPhoneActive} = this.state;
        const { id } = this.props.currentUser;
        try{
            fetch(`${BASE_URL}UpdateUserRecordingSettings&userId=${id}&language=${language}
            &speciality=${speciality}&sampleRate=${sampleRate}&isSoundActive=${isSoundActive}&streamType=${streamType}
            &IsCustomDicionaryActive=${IsCustomDicionaryActive}&IsAutoPunctuationActive=${IsAutoPunctuationActive}
            &IsDictaPhoneActive=${IsDictaPhoneActive}`).then(res => res.json()).then((result) => {
                log(result);
                
                const {setSetting} = this.props;
                
                        setSetting({
                            language: language,
                            speciality: speciality,
                            sampleRate: sampleRate ,
                            isSoundActive: isSoundActive,
                            streamType: streamType,
                            IsCustomDicionaryActive: IsCustomDicionaryActive,
                            IsAutoPunctuationActive: IsAutoPunctuationActive,
                            IsDictaPhoneActive: IsDictaPhoneActive
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
                log(e.message);
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
            log('error while signup: ', error.message);
        }
        setSetting({
            sampleRate: sampleRate,
            language: language,
            speciality: speciality,
            isSoundActive: isSoundActive,
            streamType: streamType,
            IsCustomDicionaryActive: IsCustomDicionaryActive,
            IsAutoPunctuationActive: IsAutoPunctuationActive,
            IsDictaPhoneActive: IsDictaPhoneActive
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
       <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%'}}>
       <div className="settings-form"> 
        <CustomDropDown type='json' value={this.state.streamType} disabled={false} selectedSetting={this.state.streamType} options={StreamTypes} name='streamType' handleChange={this.handleChange} />
        <CustomDropDown type='json' value={this.state.language} disabled={this.state.isDisabled} selectedSetting={this.state.language} options={this.state.languages} name='language' handleChange={this.handleChange} />
                    <CustomDropDown  type='array' value={this.state.speciality} disabled={!this.state.isDisabled} selectedSetting={this.state.speciality} options={Specialities} name='speciality' handleChange={this.handleChange} />
                    <CustomDropDown type='array' value={this.state.sampleRate} disabled={this.state.isDisabled} selectedSetting={this.state.sampleRate} options={SampleRates} name='sampleRate' handleChange={this.handleChange} />
                  <div className="toggleDiv">
                  <p>Recording Beep Sound</p>
                  <ToggleButton
  inactiveLabel={'InActive'}
  activeLabel={'Active'}
  trackStyle={{width:'70px'}}
  thumbAnimateRange={[1, 51]}
  activeLabelStyle={{ width:'40px', color: "rgb(207,221,245)", marginLeft: "2%" }} 
  inactiveLabelStyle={{ width:'40px', color: "rgb(65,66,68)" }}
  colors={{
    activeThumb: {
      base: 'rgb(62,130,247)',
    },
    inactiveThumb: {
      base: 'rgb(250,250,250)',
    },
    active: {
      base: 'rgb(65,66,68)',
      hover: 'rgb(95,96,98)',
      
    },
    inactive: {
      base: 'rgb(207,221,245)',
      hover: 'rgb(177, 191, 215)',
    },
   
    
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
                  <div className="toggleDiv">
                  <p>Enable Custom Dictionary</p>
                  <ToggleButton
 inactiveLabel={'InActive'}
 activeLabel={'Active'}
 trackStyle={{width:'70px'}}
 thumbAnimateRange={[1, 51]}
 activeLabelStyle={{ width:'40px', color: "rgb(207,221,245)", marginLeft: "2%" }} 
 inactiveLabelStyle={{ width:'40px', color: "rgb(65,66,68)" }}
 colors={{
   activeThumb: {
     base: 'rgb(62,130,247)',
   },
   inactiveThumb: {
     base: 'rgb(250,250,250)',
   },
   active: {
     base: 'rgb(65,66,68)',
     hover: 'rgb(95,96,98)',
     
   },
   inactive: {
     base: 'rgb(207,221,245)',
     hover: 'rgb(177, 191, 215)',
   },
  
   
 }}
//   trackStyle={styles.trackStyle}
//   thumbStyle={styles.thumbStyle}
 
   
  value={this.state.IsCustomDicionaryActive}
  onToggle={(value) => {
    this.setState({
      IsCustomDicionaryActive: !value,
    });
  }} />
                  </div>
                  <div className="toggleDiv">
                  <p>Enable Auto Punctuation</p>
                  <ToggleButton
  inactiveLabel={'InActive'}
  activeLabel={'Active'}
  trackStyle={{width:'70px'}}
  thumbAnimateRange={[1, 51]}
  activeLabelStyle={{ width:'40px', color: "rgb(207,221,245)", marginLeft: "2%" }} 
  inactiveLabelStyle={{ width:'40px', color: "rgb(65,66,68)" }}
  colors={{
    activeThumb: {
      base: 'rgb(62,130,247)',
    },
    inactiveThumb: {
      base: 'rgb(250,250,250)',
    },
    active: {
      base: 'rgb(65,66,68)',
      hover: 'rgb(95,96,98)',
      
    },
    inactive: {
      base: 'rgb(207,221,245)',
      hover: 'rgb(177, 191, 215)',
    },
   
    
  }}
//   trackStyle={styles.trackStyle}
//   thumbStyle={styles.thumbStyle}
 
   
  value={this.state.IsAutoPunctuationActive}
  onToggle={(value) => {
    this.setState({
      IsAutoPunctuationActive: !value,
    });
  }} />
                  </div>
                  <div className="toggleDiv">
                  <p>Enable Dictaphone</p>
                  <ToggleButton
  inactiveLabel={'InActive'}
  activeLabel={'Active'}
  trackStyle={{width:'70px'}}
  thumbAnimateRange={[1, 51]}
  activeLabelStyle={{ width:'40px', color: "rgb(207,221,245)", marginLeft: "2%" }} 
  inactiveLabelStyle={{ width:'40px', color: "rgb(65,66,68)" }}
  colors={{
    activeThumb: {
      base: 'rgb(62,130,247)',
    },
    inactiveThumb: {
      base: 'rgb(250,250,250)',
    },
    active: {
      base: 'rgb(65,66,68)',
      hover: 'rgb(95,96,98)',
      
    },
    inactive: {
      base: 'rgb(207,221,245)',
      hover: 'rgb(177, 191, 215)',
    },
   
    
  }}
//   trackStyle={styles.trackStyle}
//   thumbStyle={styles.thumbStyle}
 
   
  value={this.state.IsDictaPhoneActive}
  onToggle={(value) => {
    this.setState({
      IsDictaPhoneActive: !value,
    });
  }} />
                  </div>
                   
                    <CustomButton  type='button' onClick={this.handleClick} className='button'>
                    SAVE
                </CustomButton>
        </div>
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