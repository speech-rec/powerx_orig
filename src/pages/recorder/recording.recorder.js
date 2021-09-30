import React from "react";
import { selectCurrentUser } from "../../redux/user/user.selectors";
import {
  selectAllTemplates,
  selectSelectedTemplate,
} from "../../redux/template/template.selectors";
import { selectCurrentSetting } from "../../redux/aws/aws.selectors";
import { selectAllKeyWords, selectPunctuationKeywords } from '../../redux/customDictionary/dictionary.selectors';
import { setSelectedTemplate } from "../../redux/template/template.action";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import ResultBox from "../../components/transcribeResult/resultBox.transcribeResult";
import CustomButton from "../../components/custom-button/custom-button.component";
import {Languages} from '../../aws/constants';
import { startRecording, stopRecording, createAudio } from "../../aws/main";
import startFile from '../../sounds/start.wav';
import stopFile from '../../sounds/stop.wav';
import Popup from "reactjs-popup";
import {log} from '../../aws/main';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faCircle,
  faDotCircle,
  faMicrophone,
  faMicrophoneSlash,
  faPaperPlane,
  faPlay,
  faStop,
  faTimes,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import $ from "jquery";
import "./recording.recorder.css";
import FormInput from "../../components/form-input/form-input.compoent";
const axios = require('axios').default;
class Recorder extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      recordingText: "",
      recordingName: "",
      templates: [{Id: '0', TemplateText: ''}],
      isRecording: false,
      showPopUp: false,
      isSaved: false,
      toggleRecording: false,
      showKeyboard: false,
      isSoundActive: false,
      isProcessing: false,
      recTime: 0.0,
      keyWords: [],
      IsCustomDicionaryActive: false,
      IsAutoPunctuationActive: false,
      IsDictaPhoneActive: false,
      PunctuationKeyWords: []
    };
  }

//   static getDerivedStateFromProps (nextProps, prevState) {
//       log('should go here' ,nextProps);
//       return {recordingText: nextProps.recordingText};
//     }

componentWillUnmount (){
  stopRecording(() => {

  });
}

componentDidMount (){
  const { sampleRate, language, speciality, isSoundActive, IsCustomDicionaryActive, IsAutoPunctuationActive, IsDictaPhoneActive } = this.props.awsSetting;
  const  keywords  = this.props.allKeyWords;
  const punctuationKeyWords = this.props.punctuationKeywords;
  log(keywords);
  log(punctuationKeyWords);
  this.setState({
      isSoundActive: isSoundActive,
      keyWords: keywords,
      IsCustomDicionaryActive: IsCustomDicionaryActive,
      IsAutoPunctuationActive: IsAutoPunctuationActive,
      IsDictaPhoneActive: IsDictaPhoneActive,
      PunctuationKeyWords: punctuationKeyWords
  }, () => {
    log("is sound active: " + this.state.isSoundActive);
    log("is custom dictionary active: " + this.state.IsCustomDicionaryActive);
    log("is auto punctuation active: " + this.state.IsAutoPunctuationActive);
    log("is dicta phone active: " + this.state.IsDictaPhoneActive);
  });
  
}

 playSound = (type) => {
if(this.state.isSoundActive){
  var sound = document.getElementById("sound");
  
  switch(type){
    case "start":
      sound.src = startFile;
      break;
    case "stop":
      sound.src = stopFile;
      break;
  }
  sound.autoplay = true;
}
 }
  togglePopUp = (event) => {
    this.setState({ showPopUp: !this.state.showPopUp });
  };
  handleClick = (event) => {
    event.preventDefault();
    if(!this.state.isProcessing){
      log(this.props.awsSetting);
      const { sampleRate, speciality, streamType } = this.props.awsSetting;
      const language = this.props.awsSetting.language;
      log(language);
      try {
        
        this.setState({ toggleRecording: !this.state.toggleRecording,
        });
        if(!this.state.isRecording)
          this.setState({isRecording: true});
        if (this.state.toggleRecording) {
          log("stopping recording", $("#resultBox").val());
          this.playSound("start");
          toast("Processing", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            type: "info",
          });
          // if (!!$("#resultBox").val()) {
          //   this.setState({
          //     recordingText: $("#resultBox").val(),
          //   });
          // }
          this.setState({
            isProcessing: true,
          }, () => {
            setTimeout(() => {
              
              stopRecording(() => {
                log(this.state.recordingText);
                this.setState({
                  isProcessing: false
                }, () => {
                  //log(this.state.recordingText);
                });
              });
            }, 5000);
           
          });
         
          // toast("Stopped Recording", {
          //   position: "top-right",
          //   autoClose: 2000,
          //   hideProgressBar: false,
          //   closeOnClick: true,
          //   pauseOnHover: false,
          //   draggable: false,
          //   progress: undefined,
          //   type: "info",
          // });
        } else {
          this.playSound("stop");
          log(this.state.keyWords);
          startRecording(this.state.recordingText, sampleRate, speciality, language.split("\n")[0], streamType, this.state.keyWords, this.updateTextState, this.getTemplateText, this.state.IsCustomDicionaryActive, this.state.IsAutoPunctuationActive, this.state.IsDictaPhoneActive, this.state.PunctuationKeyWords);
          toast("Recording Audio", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            type: "info",
          });
        }
      } catch (e) {
        toast("Oops! something went wrong.", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          type: "error",
        });
        log(e.message);
      }
    }else{
      toast("Processing...", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        type: "info",
      });
    }
    
  };

  cancelRecording = event => {
    event.preventDefault();
    log(event.target.value);
    if(this.state.toggleRecording){
      this.playSound("start");
    }
    stopRecording(() => {
      this.setState({ isRecording: false, recordingText: '', toggleRecording: false, isProcessing: false, recordingName: '', recTime: 0.0 });
    });
    
    
    
    
  }

  updateTextState = (text, recTime) => {
    this.setState({
      recordingText: this.state.recordingText + text,
      recTime: this.state.recTime + recTime
    });
    log(this.state.recTime);
  }

  getTemplateText = (templateName) => {
    const { allTemplates } = this.props;
      const selectedTemplate = allTemplates.find(
        (template) => template.TemplateName.toLowerCase() == templateName.toLowerCase()
      );
      
      return selectedTemplate != null ? selectedTemplate.TemplateText : '';
    
  }

  stopProcesssing = () => {
    this.setState({
      isProcessing: false
    });
  }

  saveRecording = event => {
    if(this.state.toggleRecording){
      this.playSound("start");
    }
    toast("Processing...", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      type: "info",
    });
    
    this.setState({
      isProcessing: true
    }, () => {
      setTimeout(() => {
        
        stopRecording(() => {
          this.setState({
            toggleRecording: false,
            isRecording: false,
            isProcessing: false
          }, () => {
            const {recordingText} = this.state;
           
            if(!!recordingText){
              this.setState({ showPopUp: true, isProcessing: false},  () => {
                document.getElementById("recordingName").focus();
              });
                return;
            }else{
              toast("Kindly record some text before saving it.", {
                  position: "top-right",
                  autoClose: 2000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: false,
                  draggable: false,
                  progress: undefined,
                  type: "error",
                });
                
            }
          });
        });
         
      }, 5000);
      
    });
    // setTimeout(() => {
      
    // }, 5000);
    
      
    
    
    
      
      
    
    
  }
  handleChange = (event) => {
    // log('handle change');
    event.preventDefault();
    const { value, name } = event.target;
    this.setState({ [name]: value });
    
    if (name == "template") {
      const { allTemplates } = this.props;
      const selectedTemplate = allTemplates.find(
        (template) => template.Id == value
      );
      if(selectedTemplate != null)
        this.setState({ recordingText: $("#resultBox").val() + " " + selectedTemplate.TemplateText});
      // else
      // this.setState({ recordingText: '' });
    }
  };


  addPunctuation = (event) => {
    event.preventDefault();
    log(event.target.attributes.getNamedItem("data-value").value);
    var data_value = event.target.attributes.getNamedItem("data-value").value;
    const { value, name, innerHTML } = event.target;
    log(innerHTML);
    var element = document.getElementById("resultBox");
    var startPos = element.selectionStart;
    var endPos = element.selectionEnd;
    
    if(data_value == "newLine")
    {
      element.value = element.value.substring(0, startPos)
      + "\n"
      + element.value.substring(endPos, element.value.length);
    }else{
      element.value = element.value.substring(0, startPos)
    + `${data_value}`
    + element.value.substring(endPos, element.value.length);
    }
    log($("#resultBox").val());
    this.setState({
      recordingText: $("#resultBox").val(),
    }, () => {
      
    });
    //element.focus();
    element.selectionStart = endPos+1;
    element.selectionEnd = endPos+1;
  }
  toggleKeyboard = () => {
    var element = document.getElementById("resultBox");
    log(element.selectionStart);
    element.focus();
    element.s = element.selectionStart;
    
    //if(!(this.state.showKeyboard)){
      
      
      //           element.setAttribute('readonly', 'readonly'); // Force keyboard to hide on input field.
      // element.setAttribute('disabled', 'true'); // Force keyboard to hide on textarea field.
      // setTimeout(function() {
      //     element.blur();  //actually close the keyboard
      //     // Remove readonly attribute after keyboard is hidden.
      //     element.removeAttribute('readonly');
      //     element.removeAttribute('disabled');
      // }, 100);
    //}
    // this.setState({
    //   showKeyboard: !this.state.showKeyboard
    // }, () => {
    //   log("key borad is allowed");
     
    //   element.focus();
    // });
    
  }
 
  sendMail = (event) => {
    event.preventDefault();
    const url = process.env.REACT_APP_BASE_URL;
    try {
      const { recordingText, recordingName, recTime } = this.state;

      if (!!recordingName && !!recordingText) {
        toast("Saving file…", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          type: "info",
        });
        const { id } = this.props.currentUser;
        createAudio(recordingName, recordingText, id, recTime, (response) => {
          var result = response;
          //log(result);
        if (result.type == "error") {
          
            toast(result.text, {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: false,
              progress: undefined,
              type: "error",
            });
          } else {
            //log(result.text);
            toast(result.text, {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: false,
              progress: undefined,
              type: "success",
            });
          }
          this.setState({
            recordingName: "",
            recordingText: "",
            isRecording: false,
            showPopUp: false,
            recTime: 0.0
          });
        });
        
        return;
        axios.get(`${url}/sendmail/${encodeURIComponent(recordingName)}/${encodeURIComponent(recordingText)}/${id}`).then((response) =>  {
        var result = response.data;  
        if (result.type == "error") {
          
            toast(result.text, {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: false,
              progress: undefined,
              type: "error",
            });
          } else {
            createAudio(this.props.currentUser.id);
            toast(result.text, {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: false,
              progress: undefined,
              type: "success",
            });
          }
          this.setState({
            recordingName: "",
            recordingText: "",
            isRecording: false,
            showPopUp: false
          });
        }).catch((error) => {
          log(error);
          toast(error.message, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            type: "error",
          });
          this.setState({
            recordingName: "",
            recordingText: "",
            isRecording: false
          });
        });;
        
        // fetch(`/sendmail/${encodeURIComponent(recordingName)}/${encodeURIComponent(recordingText)}/${id}`)
        //   .then((res) => res.json())
        //   .then((result) => {
        //     if (result.type == "error") {
        //       toast(result.text, {
        //         position: "top-right",
        //         autoClose: 2000,
        //         hideProgressBar: false,
        //         closeOnClick: true,
        //         pauseOnHover: false,
        //         draggable: false,
        //         progress: undefined,
        //         type: "error",
        //       });
        //     } else {
        //       toast(result.text, {
        //         position: "top-right",
        //         autoClose: 3000,
        //         hideProgressBar: false,
        //         closeOnClick: true,
        //         pauseOnHover: false,
        //         draggable: false,
        //         progress: undefined,
        //         type: "success",
        //       });
        //     }
        //     this.setState({
        //       recordingName: "",
        //       recordingText: "",
        //     });
        //   })
        //   .catch((error) => {
        //     log(error);
        //     toast(error.message, {
        //       position: "top-right",
        //       autoClose: 2000,
        //       hideProgressBar: false,
        //       closeOnClick: true,
        //       pauseOnHover: false,
        //       draggable: false,
        //       progress: undefined,
        //       type: "error",
        //     });
        //     this.setState({
        //       recordingName: "",
        //       recordingText: "",
        //     });
        //   });
        // fetch(`http://notesapp.kapreonline.com/api/api.ashx?methodname=sendmail&userId=${this.props.currentUser.id}&name=${recordingName}&text=${recordingText}&email=${this.props.currentUser.email}`, headers).then(res => res.json()).then((result) => {
        //     alert(result.text);
        // }).catch((error) => {
        //     log(error);
        // });
      } else {
        toast("kindly provide name or record some audio", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          type: "warning",
        });
      }
    } catch (e) {
      toast(e.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        type: "error",
      });
      log(e.message);
    }
  };

  render() {
    return (
      <div className="recording-container flex-column-100">
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
        {/* disabled={!this.state.isRecording && !!this.state.recordingText ? false: true} */}

        <div className="main-container flex-column-100">
          <div className="flex-center margin-lr-10">
            <select
              placeholder="SELECT TEMPLATE"
              name="template"
              className="customDropdown"
              onChange={this.handleChange}
            >
              <option key='0' value='0'>SELECT TEMPLATE</option>
              {this.props.allTemplates != null ? (
                this.props.allTemplates.map((template) => (
                  <option key={template.Id} value={template.Id}>
                    {template.TemplateName}
                  </option>
                ))
              ) : (
                <option></option>
              )}
            </select>

          </div>
          <div className="flex-column-100">
          <ResultBox
              value={this.state.recordingText}
              handleChange={this.handleChange}
              name="recordingText"
              id="resultBox"
              onFocus={this.abc}
            />
            
              <div className="result-box-wrapper flex-column-100" style={{display: "flex", flexDirection: "column", justifyContent: "flex-end", height: "10%"}}>
              <div style={{display: "flex", flexDirection: "row", marginTop: "1%"}}>
              <div className="punctuation" name="fullStop" onClick={this.addPunctuation}>
              <div className="punctuationIcon">
                {/* <FontAwesomeIcon icon="fa fa-comma" textAnchor="."/> */}
                <p style={{fontWeight:"bold", color: "rgb(0,120,212)"}} data-value=".">.</p>
              </div>
            </div>
            <div className="punctuation" name="comma" onClick={this.addPunctuation}>
              <div className="punctuationIcon">
                {/* <FontAwesomeIcon icon={faCircle} textAnchor="."/> */}
                <p style={{fontWeight:"bold", color: "rgb(0,120,212)"}} data-value=",">,</p>
              </div>
            </div>
            <div className="punctuation" name="semiCollon" onClick={this.addPunctuation}>
              <div className="punctuationIcon">
                {/* <FontAwesomeIcon icon={faCircle} textAnchor="."/> */}
                <p style={{fontWeight:"bold", color: "rgb(0,120,212)"}} data-value=";">;</p>
              </div>
            </div>
            <div className="punctuation" name="collon" onClick={this.addPunctuation}>
              <div className="punctuationIcon">
                {/* <FontAwesomeIcon icon={faCircle} textAnchor="."/> */}
                <p style={{fontWeight:"bold", color: "rgb(0,120,212)"}} data-value=":">:</p>
              </div>
            </div>
            <div className="punctuation" name="atTheRate" onClick={this.addPunctuation}>
              <div className="punctuationIcon">
                {/* <FontAwesomeIcon icon={faCircle} textAnchor="."/> */}
                <p style={{fontWeight:"bold", color: "rgb(0,120,212)"}} data-value="@">@</p>
              </div>
            </div>
            <div className="punctuation" name="exclamationSign" onClick={this.addPunctuation}>
              <div className="punctuationIcon">
                {/* <FontAwesomeIcon icon={faCircle} textAnchor="."/> */}
                <p style={{fontWeight:"bold", color: "rgb(0,120,212)"}} data-value="!">!</p>
              </div>
            </div>
            <div className="punctuation" name="lineBreak" onClick={this.addPunctuation}>
              <div className="punctuationIcon">
                {/* <FontAwesomeIcon icon={faCircle} textAnchor="."/> */}
                <p style={{fontWeight:"bold", color: "rgb(0,120,212)"}} data-value="newLine">\n</p>
              </div>
            </div>
              </div>
             
              </div>
            
            
           {/* <audio id="recordedAudio" hidden={true}></audio> */}
            
            {/* <input type="text" id="abc" onFocus={this.abc} /> */}
            {/* <button onClick={this.toggleKeyboard}>show keyboard</button> */}
            
          <div className="wrapper">
            <div className="button1" hidden={this.state.isRecording ? false : true} onClick={this.cancelRecording}>
              <div className="customIcon">
                {/* <FontAwesomeIcon icon={faTimes} textAnchor="Cancel"/> */}
                <p style={{fontWeight:"bold", color: "rgb(0,120,212)"}}>Cancel</p>
              </div>
            </div>
            <div className="button2" onClick={this.handleClick} style={this.state.isProcessing ? {background: "grey", cursor: "no-drop"} : {background: "#fff", cursor: "pointer"}}>
              <div className="icon2">
                <FontAwesomeIcon
                  icon={this.state.toggleRecording ? faMicrophoneSlash : faMicrophone}
                className="fa-lg" style={{color: "rgb(0,120,212)"}}/>
              </div>
            </div>
            <div className="button1" hidden={this.state.isRecording ? false : true} onClick={this.saveRecording}>
              <div className="customIcon">
                {/* <FontAwesomeIcon icon={faCheck} /> */}
                <p style={{fontWeight:"bold", color: "rgb(0,120,212)"}}>Save</p>
              </div>
            </div>
          </div>
          </div>
<audio hidden={true} id="sound" src="../"></audio>
          {/* <div className='btns'> */}

          {/* <CustomButton onClick={this.handleClick}>
                {!this.state.isRecording ? 'START ' : 'STOP '}<FontAwesomeIcon icon={this.state.isRecording ? faMicrophoneSlash : faMicrophone}/>
                </CustomButton>
                <CustomButton  type='button' onClick={this.togglePopUp}>
                    SEND<FontAwesomeIcon icon={faPaperPlane} style={{marginLeft: '3px'}}/>
                </CustomButton> */}
          {/* </div> */}
        </div>

        {this.state.showPopUp ? (
          <div className="container">
            <div className="Signin-form">
              <span className="close" onClick={this.togglePopUp}>
              <FontAwesomeIcon icon={faTimesCircle} />
              </span>

              <form autoComplete="off">
                <input
                  type="text"
                  value={this.state.recordingName}
                  name="recordingName"
                  onChange={this.handleChange}
                  placeholder="enter recording name"
                  className="in-box"
                  id='recordingName'
                />

                <button onClick={this.sendMail} className="button">
                  Save
                </button>
              </form>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
  allTemplates: selectAllTemplates,
  selectedTemplate: selectSelectedTemplate,
  awsSetting: selectCurrentSetting,
  allKeyWords: selectAllKeyWords,
  punctuationKeywords: selectPunctuationKeywords
});

const mapDispatchToProps = (dispatch) => ({
  setSelectedTemplate: (id) => dispatch(setSelectedTemplate(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Recorder);
