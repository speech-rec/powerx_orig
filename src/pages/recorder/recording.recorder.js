import React from "react";
import { selectCurrentUser, selectReceiverEmail } from "../../redux/user/user.selectors";
import { setReceiverEmail } from "../../redux/user/user.action";
import {
  selectAllTemplates,
  selectSelectedTemplate,
} from "../../redux/template/template.selectors";
import { selectCurrentSetting } from "../../redux/aws/aws.selectors";
import { selectAllKeyWords, selectPunctuationKeywords } from '../../redux/customDictionary/dictionary.selectors';
import { setSelectedTemplate } from "../../redux/template/template.action";
import { setUserLicenseData } from "../../redux/licensing/licensing.action";
import { selectUserLicenseData } from "../../redux/licensing/licensing.selector";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import ResultBox from "../../components/transcribeResult/resultBox.transcribeResult";
import { startRecording, stopRecording, createAudio } from "../../aws/main";
import startFile from '../../sounds/start.wav';
import stopFile from '../../sounds/stop.wav';
import {log} from '../../aws/main';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone,
  faMicrophoneSlash,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import $ from "jquery";
import "./recording.recorder.css";
const axios = require('axios').default;
class Recorder extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      recordingText: "",
      recordingName: "",
      email: '',
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
      PunctuationKeyWords: [],
      isDisabled: true
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
  const {receiverEmail} = this.props;
  if(receiverEmail != null && receiverEmail != ''){
    this.setState({
      email: receiverEmail
    })
  }
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
                var transcript = this.state.recordingText;
                var {IsAutoPunctuationActive, IsCustomDicionaryActive, IsDictaPhoneActive, keyWords, PunctuationKeyWords} = this.state;

               
               if(IsCustomDicionaryActive){
                   console.log(transcript);
                  if(keyWords.length >=1){
                      var filterTranscribe = "";
                     
                      keyWords.forEach(kw => {
                          // if(transcript.includes("new paragraph")){
                          //     console.log(transcript.replace("new paragraph", "\n\n"))
                          // }
                          if(kw.KeyValue.includes('\\n')){
                              kw.KeyValue = kw.KeyValue.replaceAll("\\n", "\n");
                              var regEx = new RegExp(' ' + kw.KeyName + '\\.', "ig");

                              //console.log(transcript.trim().match(regEx), "c1");
                              transcript = transcript.replace(regEx, ' ' + kw.KeyValue + '.');
                              transcript = transcript.replace(regEx, ' ' + kw.KeyValue + '.');
                              regEx = new RegExp(kw.KeyName + '\\.', "ig");
                              // console.log(transcript.match(regEx), "c2");
                              transcript = transcript.replace(regEx, kw.KeyValue);
                              // console.log(transcript.match(regEx), "c2");
                              transcript = transcript.replace(regEx, kw.KeyValue);

                              regEx = new RegExp(kw.KeyName + ' ', "ig");
                              //console.log(transcript.match(regEx), "c3");
                              transcript = transcript.replace(regEx, kw.KeyValue + ' ');
                              //console.log(transcript.match(regEx), "c3");
                              transcript = transcript.replace(regEx, kw.KeyValue + ' ');
                              regEx = new RegExp(' ' + kw.KeyName + ' ', "ig");
                         // console.log(transcript.match(regEx), "c4");
                              transcript = transcript.replace(regEx, ' ' + kw.KeyValue + ' ');
                         // console.log(transcript.match(regEx), "c4");
                              transcript = transcript.replace(regEx, ' ' + kw.KeyValue + ' ');
                              regEx = new RegExp(' ' + kw.KeyName, "ig");
                              // console.log(transcript.match(regEx), "c2");
                              transcript = transcript.replace(regEx, kw.KeyValue);
                              // console.log(transcript.match(regEx), "c2");
                              transcript = transcript.replace(regEx, ' ' + kw.KeyValue);
                          }
                          else{
                              var regEx = new RegExp(' ' + kw.KeyName + '\\.', "ig");
                              //console.log(transcript.match(regEx), "c1");
                              transcript = transcript.replace(regEx, ' ' + kw.KeyValue);
                              transcript = transcript.replace(regEx, ' ' + kw.KeyValue);
                              regEx = new RegExp(kw.KeyName + '\\.', "ig");
                              // console.log(transcript.match(regEx), "c2");
                              transcript = transcript.replace(regEx, kw.KeyValue);
                              transcript = transcript.replace(regEx, kw.KeyValue);

                              var regEx = new RegExp(kw.KeyName + ' ', "ig");
                              //console.log(transcript.match(regEx), "c3");
                              transcript = transcript.replace(regEx, kw.KeyValue + ' ');
                              transcript = transcript.replace(regEx, kw.KeyValue + ' ');
                              regEx = new RegExp(' ' + kw.KeyName + ' ', "ig");
                          //console.log(transcript.match(regEx), "c4");
                              transcript = transcript.replace(regEx, ' ' + kw.KeyValue + ' ');
                              transcript = transcript.replace(regEx, ' ' + kw.KeyValue + ' ');
                              regEx = new RegExp(' ' + kw.KeyName, "ig");
                              // console.log(transcript.match(regEx), "c2");
                              transcript = transcript.replace(regEx, kw.KeyValue);
                              transcript = transcript.replace(regEx, ' ' + kw.KeyValue);
                          }
                        
                          
                      });
                  }
                  
               }
               
               if(IsDictaPhoneActive){
                  while(transcript.toLowerCase().includes('dictaphone')){
                      var templateName = transcript.match(new RegExp('dictaphone' + '\\s(\\w+)', "ig"));
                      if(templateName != '' && templateName != null){
                          templateName = templateName[1];
                          log('templateName: '+ templateName);
                      
                      var templateText = this.getTemplateText(templateName);
                      log('templateText: '+ templateText);
                      if(templateText == null || templateText == '' || templateText == ' '){
                          break;
                      }
                      var regEx = new RegExp('dictaphone ' + templateName, "ig");
                      transcript = transcript.replace(regEx, templateText);
                      
                      }else{
                          break;
                      }
                       
                  } 
               }


                this.setState({
                  isProcessing: false,
                  recordingText: transcript
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
          const { licenseData } = this.props;
          if(licenseData != null){
            if(licenseData.IsPackageExpired == false){
              if(licenseData.TotalRecordingTime < licenseData.AllowedRecordingTime){
                if(licenseData.TotalNotes < licenseData.AllowedNotes){
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
                }else{
                  toast("you have reached your maximum number of recording limit.", {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: false,
                    progress: undefined,
                    type: "info",
                  });
                  this.setState({ toggleRecording: false, isProcessing: false, isRecording: false
                  });
                }
                
              }else{
                toast("you have reached your maximum recording time limit.", {
                  position: "top-right",
                  autoClose: 2000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: false,
                  draggable: false,
                  progress: undefined,
                  type: "info",
                });
                this.setState({ toggleRecording: false, isProcessing: false, isRecording: false
                });
              }
            }else{
              toast("your assigned package has expired.", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                type: "info",
              });
              this.setState({ toggleRecording: false, isProcessing: false, isRecording: false
              });
            }
          }else{
            toast("you have no package assigned.", {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: false,
              progress: undefined,
              type: "info",
            });
            this.setState({ toggleRecording: false, isProcessing: false, isRecording: false
            });
          }
          
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
    var recTime = this.state.recTime;
    if(recTime > 0){
      const { id } = this.props.currentUser;
      const { recTime } = this.state;
       fetch(`/recordRecording/${id}/${recTime}`)
          .then((res) => res.json())
          .then((result) => {
            log(result);
            if (result.IsError == true) {
              toast(result.ErrorMessage, {
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
              const { setUserLicenseData } = this.props;
              setUserLicenseData(result);
              stopRecording(() => {
                this.setState({ isRecording: false, recordingText: '', toggleRecording: false, isProcessing: false, recordingName: '', recTime: 0.0 });
              });
            }
            
          })
          .catch((error) => {
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
            
          });
    }
    
    
    
    
    
  }

  updateTextState = (text, recTime) => {
    var transcript = this.state.recordingText + text;
    var {IsAutoPunctuationActive, IsCustomDicionaryActive, IsDictaPhoneActive, keyWords, PunctuationKeyWords} = this.state;

              
               if(IsCustomDicionaryActive){
                   console.log(transcript);
                  if(keyWords.length >=1){
                      var filterTranscribe = "";
                     
                      keyWords.forEach(kw => {
                          // if(transcript.includes("new paragraph")){
                          //     console.log(transcript.replace("new paragraph", "\n\n"))
                          // }
                          if(kw.KeyValue.includes('\\n')){
                              kw.KeyValue = kw.KeyValue.replaceAll("\\n", "\n");
                              var regEx = new RegExp(' ' + kw.KeyName + '\\.', "ig");

                              //console.log(transcript.trim().match(regEx), "c1");
                              transcript = transcript.replace(regEx, ' ' + kw.KeyValue + '.');
                              transcript = transcript.replace(regEx, ' ' + kw.KeyValue + '.');
                              regEx = new RegExp(kw.KeyName + '\\.', "ig");
                              // console.log(transcript.match(regEx), "c2");
                              transcript = transcript.replace(regEx, kw.KeyValue);
                              // console.log(transcript.match(regEx), "c2");
                              transcript = transcript.replace(regEx, kw.KeyValue);

                              regEx = new RegExp(kw.KeyName + ' ', "ig");
                              //console.log(transcript.match(regEx), "c3");
                              transcript = transcript.replace(regEx, kw.KeyValue + ' ');
                              //console.log(transcript.match(regEx), "c3");
                              transcript = transcript.replace(regEx, kw.KeyValue + ' ');
                              regEx = new RegExp(' ' + kw.KeyName + ' ', "ig");
                         // console.log(transcript.match(regEx), "c4");
                              transcript = transcript.replace(regEx, ' ' + kw.KeyValue + ' ');
                         // console.log(transcript.match(regEx), "c4");
                              transcript = transcript.replace(regEx, ' ' + kw.KeyValue + ' ');
                              regEx = new RegExp(' ' + kw.KeyName, "ig");
                              // console.log(transcript.match(regEx), "c2");
                              transcript = transcript.replace(regEx, kw.KeyValue);
                              // console.log(transcript.match(regEx), "c2");
                              transcript = transcript.replace(regEx, ' ' + kw.KeyValue);
                          }
                          else{
                              var regEx = new RegExp(' ' + kw.KeyName + '\\.', "ig");
                              //console.log(transcript.match(regEx), "c1");
                              transcript = transcript.replace(regEx, ' ' + kw.KeyValue);
                              transcript = transcript.replace(regEx, ' ' + kw.KeyValue);
                              regEx = new RegExp(kw.KeyName + '\\.', "ig");
                              // console.log(transcript.match(regEx), "c2");
                              transcript = transcript.replace(regEx, kw.KeyValue);
                              transcript = transcript.replace(regEx, kw.KeyValue);

                              var regEx = new RegExp(kw.KeyName + ' ', "ig");
                              //console.log(transcript.match(regEx), "c3");
                              transcript = transcript.replace(regEx, kw.KeyValue + ' ');
                              transcript = transcript.replace(regEx, kw.KeyValue + ' ');
                              regEx = new RegExp(' ' + kw.KeyName + ' ', "ig");
                          //console.log(transcript.match(regEx), "c4");
                              transcript = transcript.replace(regEx, ' ' + kw.KeyValue + ' ');
                              transcript = transcript.replace(regEx, ' ' + kw.KeyValue + ' ');
                              regEx = new RegExp(' ' + kw.KeyName, "ig");
                              // console.log(transcript.match(regEx), "c2");
                              transcript = transcript.replace(regEx, kw.KeyValue);
                              transcript = transcript.replace(regEx, ' ' + kw.KeyValue);
                          }
                        
                          
                      });
                  }
                  
               }
               
               if(IsDictaPhoneActive){
                  while(transcript.toLowerCase().includes('dictaphone')){
                      var templateName = transcript.match(new RegExp('dictaphone' + '\\s(\\w+)', "ig"));
                      if(templateName != '' && templateName != null){
                          templateName = templateName[1];
                          log('templateName: '+ templateName);
                      
                      var templateText = this.getTemplateText(templateName);
                      log('templateText: '+ templateText);
                      if(templateText == null || templateText == '' || templateText == ' '){
                          break;
                      }
                      var regEx = new RegExp('dictaphone ' + templateName, "ig");
                      transcript = transcript.replace(regEx, templateText);
                      
                      }else{
                          break;
                      }
                       
                  } 
               }
    this.setState({
      recordingText: transcript,
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
      const { recordingText, recordingName, recTime, isDisabled, email } = this.state;
      if(!(!!recordingName) && isDisabled == true){
        toast("Kindly provide either name or check the checkbox", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          type: "error",
        });
        return;
      }
      else if(isDisabled == false){
        if(!(!!email)){
          toast("Kindly provide receiver email", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            type: "error",
          });
          return;
        }
      }
      if (!!recordingText && (!!recordingName || isDisabled == false)) {
        toast("Submitting.....", {
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
        createAudio(recordingName, recordingText, id, recTime, !(!!isDisabled), email, (response) => {
          var result = response;
          log(result);
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
          const { setUserLicenseData } = this.props;
          setUserLicenseData(result.oRecord);
          setReceiverEmail(email);
          this.setState({
            recordingName: "",
            recordingText: "",
            isRecording: false,
            showPopUp: false,
            recTime: 0.0,
            isDisabled: true
          });
        });
        
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

  checkBoxClick = (event) => {
    
    this.setState({
      isDisabled: !event.target.checked
    })
  }
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
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                <input type='checkbox' onChange={this.checkBoxClick}/>
                <label>Send this file as email</label>
                </div>
                
                <div>
                  
                  
                  <input
                  type="text"
                  value={this.state.email}
                  name="email"
                  onChange={this.handleChange}
                  placeholder="enter receiver email"
                  className="in-box"
                  id='email'
                  disabled={this.state.isDisabled}
                />
                  </div>
                <button onClick={this.sendMail} className="button">
                  Submit
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
  punctuationKeywords: selectPunctuationKeywords,
  licenseData: selectUserLicenseData,
  receiverEmail: selectReceiverEmail
});

const mapDispatchToProps = (dispatch) => ({
  setSelectedTemplate: (id) => dispatch(setSelectedTemplate(id)),
  setUserLicenseData: (licenseData) => dispatch(setUserLicenseData(licenseData)),
  setReceiverEmail: (email) => dispatch(setReceiverEmail(email)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Recorder);
