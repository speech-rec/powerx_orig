import React from "react";
import { selectCurrentUser } from "../../redux/user/user.selectors";
import {
  selectAllTemplates,
  selectSelectedTemplate,
} from "../../redux/template/template.selectors";
import { selectCurrentSetting } from "../../redux/aws/aws.selectors";
import { setSelectedTemplate } from "../../redux/template/template.action";
import {setTemplates} from '../../redux/template/template.action';
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";

import ResultBox from "../../components/transcribeResult/resultBox.transcribeResult";
import CustomButton from "../../components/custom-button/custom-button.component";
import {Languages} from '../../aws/constants';
import startFile from '../../sounds/start.wav';
import stopFile from '../../sounds/stop.wav';
import { startRecording, stopRecording } from "../../aws/main2";
import Popup from "reactjs-popup";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faMicrophone,
  faMicrophoneSlash,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import $ from "jquery";
import "./template.pages.css";
import FormInput from "../../components/form-input/form-input.compoent";
const axios = require('axios').default;
class Template extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      templateText: "",
      templateName: "",
      isRecording: false,
      isSaved: false,
      toggleRecording: false,
      isSoundActive: false
    };
  }

//   static getDerivedStateFromProps (nextProps, prevState) {
//       console.log('should go here' ,nextProps);
//       return {templateText: nextProps.templateText};
//     }
componentDidMount (){
  const { sampleRate, language, speciality, isSoundActive } = this.props.awsSetting;

  this.setState({
      isSoundActive: isSoundActive
  }, () => {
    console.log("is sound active: ",this.state.isSoundActive);
    
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
  handleClick = (event) => {
    event.preventDefault();
    console.log(this.props.awsSetting);
    const { sampleRate, speciality } = this.props.awsSetting;
    const language = this.props.awsSetting.language;
    console.log(language);
    try {
      
      this.setState({ 
        toggleRecording: !this.state.toggleRecording
      });
      if(!this.state.isRecording)
        this.setState({isRecording: true});
      if (this.state.toggleRecording) {
        console.log($("#resultBox").val());
        if (!!$("#resultBox").val()) {
          this.setState({
            templateText: $("#resultBox").val(),
          }, () => {
            
          });
        }
        this.playSound("start");
        stopRecording();
        toast("Stopped Recording", {
          position: "top-right-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          type: "info",
        });
      } else {
        this.playSound("stop");
        startRecording($("#resultBox").val(), sampleRate, speciality, language);
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
      console.log(e.message);
    }
  };

  cancelRecording = event => {
    event.preventDefault();
    console.log(this.state.toggleRecording);
    if(this.state.toggleRecording){
      this.playSound("start");
    }
    this.setState({ isRecording: false, templateText: '', toggleRecording: false });
   
    stopRecording();
  }

  saveRecording = event => {
    if(this.state.toggleRecording){
      this.playSound("start");
    }
    stopRecording();
    this.setState({
        templateText: $("#resultBox").val(),
        toggleRecording: false,

      }, () => {
        const {templateText, templateName} = this.state;
       
        if(!(!!templateText)){
          
       
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
            return;
        }
        if(!(!!templateName)){
            toast("Kindly Provide templateName.", {
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
        this.SaveTemplate(event);
      });
      
      
    
    
  }
  handleChange = (event) => {
    // console.log('handle change');
    event.preventDefault();
    const { value, name } = event.target;
    this.setState({ [name]: value });
    
    // if (name == "template") {
    //   const { allTemplates } = this.props;
    //   const selectedTemplate = allTemplates.find(
    //     (template) => template.Id == value
    //   );
    //   if(selectedTemplate != null)
    //     this.setState({ templateText: selectedTemplate.TemplateText});
    //   else
    //   this.setState({ templateText: '' });
    // }
  };
  SaveTemplate = (event) => {
    event.preventDefault();
    const url = process.env.REACT_APP_BASE_URL;
    try {
      const { templateText, templateName } = this.state;

      if (!!templateName && !!templateText) {
        toast("Saving template…", {
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
        axios.get(`${url}/addTemplate/${encodeURIComponent(templateName)}/${encodeURIComponent(templateText)}/${id}`).then((response) =>  {
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
            try{
                console.log('yes');
                fetch(`/GetTemplatesByUserId/${id}`).then(res => res.json()).then((result) => {
                  console.log(result);
                      const {setTemplates} = this.props;
                      setTemplates(result);
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
                      this.setState({
                        templateName: "",
                        templateText: "",
                        isRecording: false
                      });
                      
                  }).catch((e) => {
                      
                    toast("Oops! Somethig went wrong while updating templates. probably you need to re login to get updated templates.", {
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
              catch(e){
                toast("Oops! Somethig went wrong while updating templates. probably you need to re login to get updated templates.", {
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
            
          }
          
        }).catch((error) => {
          console.log(error);
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
        //   this.setState({
        //     templateName: "",
        //     templateText: "",
        //     isRecording: false
        //   });
        });;
        
        // fetch(`/sendmail/${encodeURIComponent(templateName)}/${encodeURIComponent(templateText)}/${id}`)
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
        //       templateName: "",
        //       templateText: "",
        //     });
        //   })
        //   .catch((error) => {
        //     console.log(error);
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
        //       templateName: "",
        //       templateText: "",
        //     });
        //   });
        // fetch(`http://notesapp.kapreonline.com/api/api.ashx?methodname=sendmail&userId=${this.props.currentUser.id}&name=${templateName}&text=${templateText}&email=${this.props.currentUser.email}`, headers).then(res => res.json()).then((result) => {
        //     alert(result.text);
        // }).catch((error) => {
        //     console.log(error);
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
      console.log(e.message);
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
        {/* disabled={!this.state.isRecording && !!this.state.templateText ? false: true} */}

        <div className="main-container flex-column-100">
          <div className="flex-center margin-lr-10">
            {/* <select
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
            </select> */}
            <input type="text" name="templateName" onChange={this.handleChange} value={this.state.templateName} className="customDropdown" />

          </div>
          <div className="flex-column-100">
          <ResultBox
              value={this.state.templateText}
              handleChange={this.handleChange}
              name="templateText"
              id="resultBox"
            />
            <audio hidden={true} id="sound" src="../"></audio>
          <div className="wrapper">
            <div className="button1" hidden={this.state.isRecording ? false : true} onClick={this.cancelRecording}>
              <div className="customIcon">
                {/* <FontAwesomeIcon icon={faTimes} textAnchor="Cancel"/> */}
                <p style={{fontWeight:"bold", color: "#4C5470"}}>Cancel</p>
              </div>
            </div>
            <div className="button2" onClick={this.handleClick}>
              <div className="icon2">
                <FontAwesomeIcon
                  icon={this.state.toggleRecording ? faMicrophoneSlash : faMicrophone}
                className="fa-lg" style={{color: "#4C5470"}}/>
              </div>
            </div>
            <div className="button1" hidden={this.state.isRecording ? false : true} onClick={this.saveRecording}>
              <div className="customIcon">
                {/* <FontAwesomeIcon icon={faCheck} /> */}
                <p style={{fontWeight:"bold", color: "#4C5470"}}>Submit</p>
              </div>
            </div>
          </div>
          </div>

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
                  value={this.state.templateName}
                  name="templateName"
                  onChange={this.handleChange}
                  placeholder="enter recording name"
                  className="in-box"
                />

                <button onClick={this.sendMail} className="button">
                  SUBMIT
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
});

const mapDispatchToProps = (dispatch) => ({
  setSelectedTemplate: (id) => dispatch(setSelectedTemplate(id)),
  setTemplates: templates => dispatch(setTemplates(templates))
});

export default connect(mapStateToProps, mapDispatchToProps)(Template);
