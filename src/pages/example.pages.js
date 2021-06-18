import { ReactMic } from 'react-mic';
import React from 'react';
import {client} from '../aws/utils';
export default class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      record: false,
      transcribeStream: null
    }
  }
  componentDidMount(){
      console.log("client", client);
    // const transcribeStream = client
    // .createStreamingClient({
    //     region: "eu-west-1",
    //     sampleRate: 16000,
    //     languageCode: "en-US",
    // })
    // // enums for returning the event names which the stream will emit
    // .on(StreamingClient.EVENTS.OPEN, () => console.log(`transcribe connection opened`))
    // .on(StreamingClient.EVENTS.ERROR, console.error)
    // .on(StreamingClient.EVENTS.CLOSE, () => console.log(`transcribe connection closed`))
    // .on(StreamingClient.EVENTS.DATA, (data) => {
    //     const results = data.Transcript.Results
 
    //     if (!results || results.length === 0) {
    //         return
    //     }
 
    //     const result = results[0]
    //     const final = !result.IsPartial
    //     const prefix = final ? "recognized" : "recognizing"
    //     const text = result.Alternatives[0].Transcript
    //     console.log(`${prefix} text: ${text}`)
    // });
    // this.setState({transcribeStream: transcribeStream});
  }
  startRecording = () => {
    this.setState({ record: true });
    
  }
 
  stopRecording = () => {
    this.setState({ record: false });
  }
 
  onData(recordedBlob) {
      
    console.log('chunk of real-time data is: ', recordedBlob);
    
  }
 
  onStop(recordedBlob) {
    console.log('recordedBlob is: ', recordedBlob);
  }
 
  render() {
    return (
      <div>
        <ReactMic
          record={this.state.record}
          className="sound-wave"
          onStop={this.onStop}
          onData={this.onData}
          strokeColor="#000000"
          backgroundColor="#FF4081" />
        <button onClick={this.startRecording} type="button">Start</button>
        <button onClick={this.stopRecording} type="button">Stop</button>
      </div>
    );
  }
}