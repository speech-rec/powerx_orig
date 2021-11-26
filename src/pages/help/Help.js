
import React from 'react';
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import { selectUserLicenseData, selectUserAllPackages } from "../../redux/licensing/licensing.selector";
import './Help.css';
class HelpScreen extends React.Component{
    constructor(props){
        super(props);

    }
    render(){
        return(
            <div className="app-container"> 
            
            <div className="subContainer2"> 
            <h1>Package details:</h1>
            <p>
             Package name: {this.props.userPackage.PackageName} <br/>
             Package type: {this.props.userPackage.PackageType} <br/>
             Number or Text files: {this.props.licenseData.AllowedNotes} / {this.props.licenseData.TotalNotes} <br/>
             Dictation time (secs): {this.props.licenseData.AllowedRecordingTime} / {this.props.licenseData.TotalRecordingTime} <br/>
             Expiry Status: {this.props.userPackage.IsExpired ? "Yes" : "No"}</p>
            <h1 style={{color: 'rgb(0,120,212)'}}>Hi {this.props.userName}!</h1>
            <img className="img"src={this.props.imagePath} alt="img"/>
            <p>{this.props.text}</p>
            
           
           </div>
        </div>
        );
    }
    
};

const mapStateToProps = createStructuredSelector({
    licenseData: selectUserLicenseData,
    userPackage: selectUserAllPackages
  });

export default connect(mapStateToProps, null)(HelpScreen);