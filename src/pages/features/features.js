import React from "react";
import "./features.css";
class FeatureScreen extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="app-container">
        <div className="featuresSubContainer">
          <h1 className="headingColor">Available anywhere, anytime</h1>

          <p>
            The software gives you complete freedom to manage your own specific
            workflow and location. You do not get restricted to specific
            stations and desktops. Dictate your notes at any location, your
            office, or working from home or on the go. View them from anywhere
            over the cloud, edit them or print them from anywhere, anytime. Or
            you can dictate at one location and your team member can view and
            print them from another location.
          </p>
          <h1 className="headingColor">AI to Assist you where you work</h1>

          <p>
            The app assists you in whatever field you work in. Are you a lawyer
            and frequently dictate notes in your audio recorder for later
            access? Use Alpha Notes to record your notes in the usual way, with
            the advantage that they are available as typed notes accessible from
            anywhere - your phone, your desktop at work, your laptop at home –
            anywhere. A physician? Record your patient interactions and they
            directly get transcribed and stored in the cloud for you to access
            them later for filing or printing. They can also copy their notes to
            their Electronic Health Record, if required. Concerned about privacy
            and security? The system is HIPAA compliant and only you have access
            to your clinical notes. Radiologists can quickly dictate patient
            reports in the app. They can later review and finalize their reports
            and print them out to give to their patients. They can also simply
            give access to their secure portal to a team member who can review
            and print out the reports while the radiologists concentrate on
            clinical images and dictate their reports.
          </p>
          <h1 className="headingColor">How does it make things simple?</h1>

          <p>
            This app is not just a recognition engine turning speech to text. It
            helps you to concentrate on what you need to dictate and not worry
            about saving your text or trying to print it off from the
            application. You simply select your preferences once, which will be
            saved for all subsequent session. Simply select a new session to
            dictate, finish your document and that’s it! Your dictated text will
            be saved in the cloud for you to access it later for further work or
            for printing. Your login credentials will give you access to your
            secure, dedicated cloud portal where you can edit your transcribed
            text or download and listen to the audio that was earlier spoken or
            print the transcribed text.
          </p>
          <h1 className="headingColor">Editing your file in the portal</h1>

          <p>
            Once you have finished dictating your file, it will be stored in the
            cloud portal. Login to your portal account, select the note from the
            list and edit it in the online editor for any final changes.
          </p>
          <h1 className="headingColor">Printing</h1>
          <p>
            The system not only allows you to print your files at any time, it
            gives to the flexibility to customize the format of the page on
            which the text will be printed. You can upload your custom header
            and footer, and these will be printed for any note that you select
            and print. You can even create a separate account for someone on
            your team to access your portal securely and print out the
            transcribed documents while you concentrate on dictating your notes.
            This workflow will help you quickly dictate separate notes while
            another person exclusively reviews them and prints them out as they
            get completed.
          </p>
          <h1 className="headingColor">Settings</h1>
          <p>
            <ul>
              <li>
                <h4 className="headingColor">Recognition Model:</h4>
                <p>
                  There are two recognition models available that you may select
                  based on your specific need. Transcribe Streaming: Select this
                  for normal dictation. Supports multiple languages Medical
                  Transcribe Streaming: Select this for clinical specific
                  dictation. If this option is selected, you can select the
                  specific clinical dictionary based on your need. The various
                  clinical dictionaries available are for Primary Care,
                  Cardiology, Neurology, Oncology, Radiology and Urology.
                </p>
              </li>

              <li>
                <h4 className="headingColor">Language Selection:</h4>
                <p>
                  If you select normal language dictation model, you may be able
                  to select an available language to dictation. For clinical
                  transcription, only English is available as your language
                  option.
                </p>
              </li>

              <li>
                <h4 className="headingColor">Recognition Model:</h4>
                <p>
                  There are two recognition models available that you may select
                  based on your specific need. Transcribe Streaming: Select this
                  for normal dictation. Supports multiple languages Medical
                  Transcribe Streaming: Select this for clinical specific
                  dictation. If this option is selected, you can select the
                  specific clinical dictionary based on your need. The various
                  clinical dictionaries available are for Primary Care,
                  Cardiology, Neurology, Oncology, Radiology and Urology.
                </p>
              </li>

              <li>
                <h4 className="headingColor">Sampling Rate:</h4>
                <p>
                  This is only for handling some specialized scenarios for
                  recognition. You may leave it at 16000 as your default
                  setting.
                </p>
              </li>

              <li>
                <h4 className="headingColor">Recording Beep Sound:</h4>
                <p>
                  A sound will be played whenever a recording session is started
                  or stopped.
                </p>
              </li>
              <li>
                <h4 className="headingColor">Enable Custom Dictionary:</h4>
                <p>
                  The software have a built-in word repository to fine tune the
                  recognition. This facilitates user you use words like “New
                  Paragraph”, “New Line”, and the punctuation marks during
                  speech.
                </p>
              </li>
              <li>
                <h4 className="headingColor">Enable Auto Punctuation:</h4>
                <p>
                  When this feature is enabled, the system intelligently
                  identifies where a comma or a period may come in based on the
                  pauses that we use when speaking normally. When this feature
                  is not enabled, the user needs to speak out the punctuation
                  like comma and period to be typed out.
                </p>
              </li>
              <li>
                <h4 className="headingColor">Enable Dictaphone:</h4>
                <p>
                  When this is activated, the user can speak out the name of the
                  predefined template that they want to use and the template
                  text will appear in the editor. The user needs to say
                  “Dictaphone” before the name of the template. For example, if
                  the user has a predefined template with the name “Physics”,
                  the text in that template will appear at the cursor in the
                  editor when the user speaks out “Dictaphone Physics”.
                </p>
              </li>
            </ul>
          </p>

          <h1 className="headingColor">Defining a custom template</h1>

          <p>
            The user can define their frequently used custom texts that can be
            reused in the editor.
            <ul>
              <li>
                <p>
                  Simply go to the main menu and select “New Template” button.
                </p>
              </li>
              <li>
                <p>Type the name of the template in the top box.</p>
              </li>
              <li>
                <p>Speak out the text into the editor.</p>
              </li>
              <li>
                <p>Save.</p>
              </li>
            </ul>
          </p>
        </div>
      </div>
    );
  }
}

export default FeatureScreen;
