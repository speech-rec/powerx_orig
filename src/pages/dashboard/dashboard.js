import React from 'react';
// import {connect} from 'react-redux';
// import {setNavigationPath} from '../../redux/naviagtor/navigator.action';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCogs, faEnvelopeOpenText,  faFileContract,  faListAlt,  faMicrophone, faParagraph, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import {Link} from 'react-router-dom';
import './dashboard.css';
const DashBoard = () => {
    
    return(
        

<div className="dashboardbox">
<div className="row1">
    
    
    <Link className="box1" to='/license'><FontAwesomeIcon className='icon' style={{width: '60%'}} icon={faFileContract}/>
    <b>LICENSE INFORMATION</b> </Link>
   
   
    <Link className="box1" to='/settingscreen'><FontAwesomeIcon className='icon' style={{width: '100%'}} icon={faCogs}/>
    <b>SETTINGS</b> </Link>
   
</div>
<div  className="row1">
   
    <Link className="box1" to='/template'><FontAwesomeIcon className='icon' style={{width: '100%'}} icon={faFileContract}/>
    <b style={{fontSize: "15px"}}>NEW TEMPLATE</b> </Link>
   
   <Link className="box1" to='/recorder'><FontAwesomeIcon className='icon' style={{width: '65%'}} icon={faMicrophone}/>
    <b>RECORD</b> </Link>

</div>
    <div className="row1">
    
   
    <Link className="box1" to='/helpscreen'><FontAwesomeIcon className='icon' style={{width: '100%'}} icon={faQuestionCircle}/>
    <b>NEED HELP?</b> </Link>
   
    
    <Link className="box1" to='/features'><FontAwesomeIcon className='icon' style={{width: '100%'}} icon={faListAlt}/>
    <b>FEATURES</b> </Link>
   
</div>

        

          
        
       
       
       
       
        
       
    
        
       

            
        
    </div>);
};

// const mapDispatchToProps = dispatch => ({
//     setNavigationPath: path => dispatch(setNavigationPath(path))
//   });

// export default connect(null, mapDispatchToProps)(DashBoard);

export default DashBoard;