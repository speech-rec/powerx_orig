import React from "react";
import "./Help.css";
class HelpScreen extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="app-container">
        <div className="helpSubContainer">
          <h2 className="headingColor">Dictating a Note</h2>

          <p>
            Go to your Note Recording screen and press the Recording button to
            start dictation. (The system will show activity as it processes your
            speech and will replace the estimated text with the actual dictated
            text) Pressing the Cancel button will reset the editor for a new
            note. Pressing the Save button will prompt you for the name of the
            note that will be stored in the cloud in your portal. The saving
            process will also prompt with a checkbox if you want to send the
            dictated text via email. NOTE: Please note that this app by default
            is HIPAA compliant and saves the dictated text to the cloud in a
            secure manner. Use the email option only if you are not sharing any
            secure text or confidential information.
          </p>
          <h2 className="headingColor">
            Editing your dictated file in the portal
          </h2>

          <p>
            Once you have finished dictating your file, it will be stored in the
            cloud portal. Login to your portal account, select the note from the
            list and edit it in the online editor for any final changes.
          </p>
          <h2 className="headingColor">Printing</h2>
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
          <h2 className="headingColor">Defining a custom template</h2>

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
          <h2 className="headingColor">Settings</h2>
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
        </div>
      </div>
    );
  }
}

export default HelpScreen;
