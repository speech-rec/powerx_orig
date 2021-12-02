
import React from 'react';
import './Help.css';
class HelpScreen extends React.Component{
    constructor(props){
        super(props);

    }
    render(){
        return(
            <div className="app-container"> 
            
            <div className="helpSubContainer"> 
           
            <h1 style={{color: 'rgb(0,120,212)'}}>Hi {this.props.userName}!</h1>
            <img className="img"src={this.props.imagePath} alt="img"/>
            <p>Alpha Notes is an AI based speech recognition app that helps you simplify your note taking tasks. The system has advanced recognition capabilities that understands the words in their context and converts them accurately to text. You may then print them out later when you are near your printer or copy them to your other documents.
Printing is also customizable where you can use your customized header with your logo and have a customized footer for your specific needs as well.
It can recognize your speech in different languages and type them out accurately. It understands Japanese, Korean, German, Italian, French and a host of other languages.
The system is not just limited to simple language recognition. It also understands medical terms in different clinical domains that include speech recognition in specific clinical areas with their unique words and terms. These domains include Radiology, Cardiology, Urology, Oncology, or general Primary Care.
The software in HIPAA compliant and if clinical information is dictated, the user can access it to print or copy only from the secure cloud portal. Clinical confidentiality is preserved as information is not transmitted in an unsecured manner. 
However, for users who do not have a data confidentiality requirement, they can simply email their dictated text right from the app interface.
The system also has built-in intelligence to insert relevant punctuation automatically while you concentrate on dictating your content. If you want to have full control over the punctuation, you can enable it with a single click and you can then “speak out” the punctuation character which will then appear within your text.
The app also has the functionality to save pre-defined “canned” texts that you frequently use and recall them instantly from your library of templates to use within your speech sessions.
</p>
            
           
           </div>
        </div>
        );
    }
    
};



export default HelpScreen;