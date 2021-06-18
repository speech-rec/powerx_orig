import React from 'react';
// import {connect} from 'react-redux';
// import {setNavigationPath} from '../../redux/naviagtor/navigator.action';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCogs, faEnvelopeOpenText,  faMicrophone, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import {Link} from 'react-router-dom';
import './dashboard.css';
const DashBoard = () => {
    
    return(
        

<div className="box">
    <div className="row1">
    
    <div className="box1">
    <Link to='/helpscreen'><FontAwesomeIcon className='icon' style={{width: '100%'}} icon={faQuestionCircle}/>
    <b>NEED HELP?</b> </Link></div>
   
    <div className="box1">
    <Link to='/settingscreen'><FontAwesomeIcon className='icon' style={{width: '100%'}} icon={faCogs}/>
    <b>SETTINGS</b> </Link>
    </div>
</div>
<div  className="row1">
    <div className="box1">
    <Link to='/template'><FontAwesomeIcon className='icon' style={{width: '100%'}} icon={faEnvelopeOpenText}/>
    <b style={{fontSize: "15px"}}>NEW TEMPLATE</b> </Link>
    </div>
    <div className="box1"><Link to='/recorder'><FontAwesomeIcon className='icon' style={{width: '65%'}} icon={faMicrophone}/>
    <b>RECORD</b> </Link></div>

</div>
        

          
        
       
       
       
       
        
       
    
        
       

            
        
    </div>);
};

// const mapDispatchToProps = dispatch => ({
//     setNavigationPath: path => dispatch(setNavigationPath(path))
//   });

// export default connect(null, mapDispatchToProps)(DashBoard);

export default DashBoard;