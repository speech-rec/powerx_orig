import React from "react";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import { selectAllPackages } from "../../redux/licensing/licensing.selector";
import {Table} from 'react-bootstrap';

import "./features.css";
class FeatureScreen extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="app-container">
        <div className="featuresSubContainer">
          <h2 className="headingColor">Introduction</h2>
          <p>
            Alpha Notes is an AI based speech recognition app that helps you
            simplify your note taking tasks. The system has advanced recognition
            capabilities that understands the words in their context and
            converts them accurately to text. You may then print them out later
            when you are near your printer or copy them to your other documents.
            </p>
            <br/>
            <p>
            Printing is also customizable where you can use your customized
            header with your logo and have a customized footer for your specific
            needs as well.
            </p>
            <br/>
            <p>
             It can recognize your speech in different languages
            and type them out accurately. It understands Japanese, Korean,
            German, Italian, French and a host of other languages.
            </p>
            <br/>
            <p>
             The system is
            not just limited to simple language recognition. It also understands
            medical terms in different clinical domains that include speech
            recognition in specific clinical areas with their unique words and
            terms. These domains include Radiology, Cardiology, Urology,
            Oncology, or general Primary Care.
            </p>
            <br/>
            <p>
             The software in HIPAA compliant
            and if clinical information is dictated, the user can access it to
            print or copy only from the secure cloud portal. Clinical
            confidentiality is preserved as information is not transmitted in an
            unsecured manner.
            </p>
            <p>
             However, for users who do not have a data
            confidentiality requirement, they can simply email their dictated
            text right from the app interface.
            </p>
            <br/>
            <p>
             The system also has built-in
            intelligence to insert relevant punctuation automatically while you
            concentrate on dictating your content. If you want to have full
            control over the punctuation, you can enable it with a single click
            and you can then “speak out” the punctuation character which will
            then appear within your text.
            </p>
            <br/>
            <p>
             The app also has the functionality to
            save pre-defined “canned” texts that you frequently use and recall
            them instantly from your library of templates to use within your
            speech sessions.
          </p>
          <h2 className="headingColor">Available anywhere, anytime</h2>

          <p>
            The software gives you complete freedom to manage your own specific
            workflow and location. You do not get restricted to specific
            stations and desktops. Dictate your notes at any location, your
            office, or working from home or on the go.
            </p>
            <br/>
            <p>
             View them from anywhere
            over the cloud, edit them or print them from anywhere, anytime. Or
            you can dictate at one location and your team member can view and
            print them from another location.
          </p>
          <h2 className="headingColor">AI to Assist you where you work</h2>

          <p>
            The app assists you in whatever field you work in. Are you a lawyer
            and frequently dictate notes in your audio recorder for later
            access? Use Alpha Notes to record your notes in the usual way, with
            the advantage that they are available as typed notes accessible from
            anywhere - your phone, your desktop at work, your laptop at home –
            anywhere.
            </p>
            <br/>
            <p>
             A physician? Record your patient interactions and they
            directly get transcribed and stored in the cloud for you to access
            them later for filing or printing. They can also copy their notes to
            their Electronic Health Record, if required. Concerned about privacy
            and security? The system is HIPAA compliant and only you have access
            to your clinical notes.
            </p>
            <br/>
            <p>
             Radiologists can quickly dictate patient
            reports in the app. They can later review and finalize their reports
            and print them out to give to their patients. They can also simply
            give access to their secure portal to a team member who can review
            and print out the reports while the radiologists concentrate on
            clinical images and dictate their reports.
          </p>
          <h2 className="headingColor">How does it make things simple?</h2>

          <p>
            This app is not just a recognition engine turning speech to text. It
            helps you to concentrate on what you need to dictate and not worry
            about saving your text or trying to print it off from the
            application. You simply select your preferences once, which will be
            saved for all subsequent session.
            </p>
            <br/>
            <p>
             Simply select a new session to
            dictate, finish your document and that’s it! Your dictated text will
            be saved in the cloud for you to access it later for further work or
            for printing. 
            </p>
            <br/>
            <p>
            Your login credentials will give you access to your
            secure, dedicated cloud portal where you can edit your transcribed
            text or download and listen to the audio that was earlier spoken or
            print the transcribed text.
          </p>
          <h2 className="headingColor">Licensing</h2>

          <p>
            Different licensing options are available based on your needs.
            Depending on the number of notes you need to dictate in a month, you
            can opt for the most appropriate licensing option.
            </p>
            <br/>
            <p>
             Various options are listed below. Contact us for the quote.
            
          </p>
          <div>
          <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Package name</th>
                  <th>Mode (Transcribe / Med Transcribe)</th>
                  <th>Dictation time / month: (sec)</th>
                  <th>Number of Text files</th>
                  <th>License period</th>
                  <th>Text Retention</th>
                  <th>Cost</th>
                </tr>
              </thead>
              <tbody>
                {
                  
                  this.props.allPackages.map((item) => (
                    <tr key={item.Id}>
                      <td >
                      {item.PackageName}
                      </td>
                      <td >
                      {item.oDetail[0].KeyValue}
                      </td>
                      <td >
                      {item.oDetail[1].KeyValue}
                      </td>
                      <td >
                      {item.oDetail[2].KeyValue}
                      </td>
                      <td >
                      {item.oDetail[3].KeyValue}
                      </td>
                      <td >
                      {item.oDetail[4].KeyValue}
                      </td>
                      <td>
                      {item.oDetail[5].KeyValue}
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  allPackages: selectAllPackages,
});

export default connect(mapStateToProps, null)(FeatureScreen);
