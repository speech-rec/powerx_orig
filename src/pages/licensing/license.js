
import React from 'react';
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import { selectUserLicenseData, selectUserAllPackages } from "../../redux/licensing/licensing.selector";
import './license.css';
class LicenseScreen extends React.Component{
    constructor(props){
        super(props);

    }
    render(){
        return(
            <div className="app-container"> 
            
            <div className="licenseSubContainer"> 
            <h1>Your License Status</h1>
            <p>
             Package name: {this.props.userPackage.PackageName} <br/>
             Package type: {this.props.userPackage.PackageType} <br/>
             Number or Text files:  {this.props.licenseData.TotalNotes} / {this.props.licenseData.AllowedNotes} <br/>
             Dictation time (secs): {this.props.licenseData.TotalRecordingTime} / {this.props.licenseData.AllowedRecordingTime}<br/>
             License Status: {this.props.userPackage.IsExpired ? "Inactive" : "Active"}</p>
           
            
           
           </div>
        </div>
        );
    }
    
};

const mapStateToProps = createStructuredSelector({
    licenseData: selectUserLicenseData,
    userPackage: selectUserAllPackages
  });

export default connect(mapStateToProps, null)(LicenseScreen);