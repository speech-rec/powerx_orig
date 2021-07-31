import {fromUtf8, toUtf8} from '@aws-sdk/util-utf8-node';
import {toast} from 'react-toastify';
import {NoiseKW} from './constants';
import 'react-toastify/dist/ReactToastify.css';
const marshaller        = require("@aws-sdk/eventstream-marshaller");
const audioUtils        = require('./audioUtils');  // for encoding audio data as PCM
const crypto            = require('crypto'); // tot sign our pre-signed URL
const v4                = require('./aws-signature-v4'); // to generate our pre-signed URL
const mic               = require('microphone-stream'); // collect microphone input as a stream of raw bytes
const eventStreamMarshaller = new marshaller.EventStreamMarshaller(toUtf8, fromUtf8);
const dotenv = require('dotenv');
dotenv.config();
var $ = require( "jquery" );
// our converter between binary event streams messages and JSON
// const eventStreamMarshaller = new marshaller.EventStreamMarshaller(util_utf8_node.toUtf8, util_utf8_node.fromUtf8);
// our global variables for managing state
let languageCode = "en-US";
let region;
let sampleRate;
let inputSampleRate;
let transcription = "";
let socket;
let micStream;
let socketError = false;
let transcribeException = false;
let specialty = "PRIMARYCARE";
let type = "DICTATION";
let rec;
var prevTranscript = ""
var audioChunks = [];
var recTime = 0.0;
// check to see if the browser allows mic access
if (!window.navigator && window.navigator.mediaDevices && window.navigator.mediaDevices.getUserMedia) {
    // Use our helper method to show an error on the page
    showError('We support the latest versions of Chrome, Firefox, Safari, and Edge. Update your browser and try your request again.');
    toast("No Audio recording device found.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        type: 'error'
        });
    // maintain enabled/distabled state for the start and stop buttons
    
}

export const startRecording = (lastValue, sampleRate, inputSpecialty, language) => {
    console.log("started");
    transcription = lastValue;
// $('#error').hide(); // hide any existing errors
// toggleStartStop(true); // disable start and enable stop button

// set the language and region from the dropdowns
// setLanguage();
// setRegion();
inputSampleRate = sampleRate;
// type = inputType;
specialty = inputSpecialty;
languageCode = language;
// first we get the microphone input from the browser (as a promise)...
try{
    window.navigator && window.navigator.mediaDevices && window.navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true
    })
    // ...then we convert the mic stream to binary event stream messages when the promise resolves 
    .then(streamAudioToWebSocket) 
    .catch(function (error) {
        toast('Oops! something went wrong.', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            type: 'error'
            
            });
        console.log(error);
        showError('There was an error streaming your audio to Amazon Transcribe. Please try again.');
        // toggleStartStop(false);
    });

}catch(e){
    toast(e.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        type: 'error'
        
        });
    console.log(e.message);
}
}

export const createAudio = (recordingName, recordingText, userId, successCallback) => {
    if(rec.state == "inactive"){
        let blob = new Blob(audioChunks, {type: 'audio/mpeg-3'});
        // var recordedAudio = document.getElementById("recordedAudio");
        // recordedAudio.src = URL.createObjectURL(blob);
        // recordedAudio.controls = true;
        // recordedAudio.autoplay = true;
        // recordedAudio.hidden = false;
        //console.log(blob);
        var formData = new FormData()
        formData.append('file', blob);
        formData.append("userId", userId);
        formData.append("recordingText", encodeURI(recordingText));
        formData.append("recordingName", recordingName);
  $.ajax({
    // url: `${process.env.REACT_APP_BASE_URL}/sendmail/${recordingName}/${encodeURI(recordingText)}/${userId}`,
    url: `${process.env.REACT_APP_BASE_URL}/sendmail/0/0/0`,
    type: "POST",
    data:formData,
    processData: false,
    contentType: false,
    success: function(data) {
            //console.log("response: ", JSON.parse(data));
            audioChunks = [];
            successCallback(JSON.parse(data));
    }
  });
  
    }
}

export const stopRecording = () => {
    
            // console.log("mic closed");
            // const audioContext = new AudioContext();
            // audioContext.close();
        
    try{
        console.log("stoping");
        if(rec.state != "inactive")
        {
            rec.stop();
        }
    // socket.close();
        if (socket && socket.readyState ===  socket.OPEN) {
            
            micStream.stop();
            socket.close();
            console.log("closing method");
            // Send an empty frame so that Transcribe initiates a closure of the WebSocket after submitting all transcripts
            // let emptyMessage = getAudioEventMessage(Buffer.from(new Buffer.from([])));
            // let emptyBuffer = eventStreamMarshaller.marshall(emptyMessage);
            
            // socket.send(emptyBuffer);
        }
    }catch(e){
        toast(e.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            type: 'error'
            
            });
        console.log(e.message);
    }
    // toggleStartStop(false);
}
// $('#start-button').on('click',
    
// );

let streamAudioToWebSocket =  (userMediaStream) => {
    
    //let's get the mic input from the browser, via the microphone-stream module
    try{
        micStream = new mic();

    micStream.on("format", function(data) {
        inputSampleRate = data.sampleRate;
    });

    micStream.setStream(userMediaStream);
    
    // Pre-signed URLs are a way to authenticate a request (or WebSocket connection, in this case)
    // via Query Parameters. Learn more: https://docs.aws.amazon.com/AmazonS3/latest/API/sigv4-query-string-auth.html
    let url = createPresignedUrl();
    
    // console.log(createPresignedUrl());
    //open up our WebSocket connection
    socket = new WebSocket(url);
    socket.binaryType = "arraybuffer";
    let sampleRate = 0;
    rec = new MediaRecorder(userMediaStream);
    rec.start();
    rec.ondataavailable = e => {
       audioChunks.push(e.data);
       
    }
    // when we get audio data from the mic, send it to the WebSocket if possible
    socket.onopen = function() {
        micStream.on('data', function(rawAudioChunk) {
            // the audio stream is raw audio bytes. Transcribe expects PCM with additional metadata, encoded as binary
            let binary = convertAudioToBinaryMessage(rawAudioChunk);
            
            if (socket.readyState === socket.OPEN)
                socket.send(binary);
        }
    )};

    // handle messages, errors, and close events
    wireSocketEvents();
    }catch(e){
        toast(e.message, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            type: 'error'
            
            });
        console.log(e.message);
    }
}

function setLanguage(language) {
    languageCode = language;
    
}

function setRegion() {
    region = "us-east-1";
}

function wireSocketEvents() {
    // handle inbound messages from Amazon Transcribe
    try{
        socket.onmessage = function (message) {
            //convert the binary event stream message to JSON
            let messageWrapper = eventStreamMarshaller.unmarshall(Buffer(message.data));
            let messageBody = JSON.parse(String.fromCharCode.apply(String, messageWrapper.body));
            if (messageWrapper.headers[":message-type"].value === "event") {
                handleEventStreamMessage(messageBody);
            }
            else {
                transcribeException = true;
                toast(messageBody.Message, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: false,
                    progress: undefined,
                    type: 'error'
                    
                    });
                console.log(messageBody.Message);
                
                // toggleStartStop();
            }
        };
    
        socket.onerror = function () {
            socketError = true;
            toast('WebSocket connection error. Try again.', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                type: 'error'
                
                });
            
            // toggleStartStop();
        };
        
        socket.onclose = function (closeEvent) {
            micStream.stop();
            console.log("mic closed");
            
            // the close event immediately follows the error event; only handle one.
            if (!socketError && !transcribeException) {
                if (closeEvent.code != 1000) {
                    // showError('</i><strong>Streaming Exception</strong><br>' + closeEvent.reason);
                }
                // toggleStartStop();
            }
        };
    }catch(e){
        toast(e.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            type: 'error'
            
            });
        console.log(e.message);
    }
}

let handleEventStreamMessage = function (messageJson) {
    try{
        let results = messageJson.Transcript.Results;

        if (results.length > 0) {
        if (results[0].Alternatives.length > 0) {
            let transcript = results[0].Alternatives[0].Transcript;

            // fix encoding for accented characters
            transcript = decodeURIComponent(escape(transcript));
            //if(NoiseKW[transcript] != null)
            const kw = NoiseKW.find((word) => {
                return word == transcript;
            });
             if(kw == undefined || kw == null){
                //$('#resultBox').val(transcription + transcript + "\n");
                
                //$('#resultBox').trigger("change");
                console.log('transcript: ', transcript);
                // console.log("previousTranscript:", prevTranscript);
                // if(transcript != prevTranscript){
                //     console.log(false);
                //     $('#resultBox').val($('#resultBox').val() + transcript.replace(prevTranscript, "") + " ");
                // }else{
                //     console.log(true);
                // }
                
                // prevTranscript = transcript;
                
                // if this transcript segment is final, add it to the overall transcription
                //return;
                //console.log(results[0]);
                //console.log(results[0].Alternatives[0]);
                if (!results[0].IsPartial) {
                    //scroll the textarea down
                    recTime += results[0].EndTime - results[0].StartTime;
                    console.log("recTime: ", recTime);
                    $('#resultBox').val($('#resultBox').val() + transcript + " ");
                    $('#resultBox').scrollTop($('#resultBox')[0].scrollHeight);
                   
                    // transcription += transcript + "\n";
                }
               
             }
            // update the textarea with the latest result
            
           
        }
    }
}catch(e){
    toast(e.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        type: 'error'
        
        });
    console.log(e.message);
}
}


let closeSocket = function () {
    if (socket.readyState === socket.OPEN) {
        micStream.stop();

        // Send an empty frame so that Transcribe initiates a closure of the WebSocket after submitting all transcripts
        let emptyMessage = getAudioEventMessage(Buffer.from(new Buffer.from([])));
        let emptyBuffer = eventStreamMarshaller.marshall(emptyMessage);
        socket.send(emptyBuffer);
    }
}

// $('#stop-button').click(function () {
//     closeSocket();
//     toggleStartStop();
// });

// $('#reset-button').click(function (){
//     $('#resultBox').val('');
//     transcription = '';
// });



function showError(message) {
    // $('#error').html(message);
    // $('#error').show();
}

export function convertAudioToBinaryMessage(audioChunk) {
    try{
        let raw = mic.toRaw(audioChunk);

    if (raw == null)
        return;
    
    // downsample and convert the raw audio bytes to PCM
    let downsampledBuffer = audioUtils.downsampleBuffer(raw, inputSampleRate, sampleRate);
    let pcmEncodedBuffer = audioUtils.pcmEncode(downsampledBuffer);

    // add the right JSON headers and structure to the message
    let audioEventMessage = getAudioEventMessage(Buffer.from(pcmEncodedBuffer));

    //convert the JSON object + headers into a binary event stream message
    let binary = eventStreamMarshaller.marshall(audioEventMessage);

    return binary;
    }catch(e){
        toast(e.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            type: 'error'
            
            });
        console.log(e.message);
    }
}

function getAudioEventMessage(buffer) {
    // wrap the audio data in a JSON envelope
    return {
        headers: {
            ':message-type': {
                type: 'string',
                value: 'event'
            },
            ':event-type': {
                type: 'string',
                value: 'AudioEvent'
            }
        },
        body: buffer
    };
}

function createPresignedUrl() {
    let endpoint = "transcribestreaming." + "us-east-1" + ".amazonaws.com:8443";
    // fetch('/getCredentials').then(res => res.json()).then(result => {
    //    console.log(result);
    // });
    // get a preauthenticated URL that we can use to establish our WebSocket
    return v4.createPresignedURL(
        'GET',
        endpoint,
        '/medical-stream-transcription-websocket',
        'transcribe',
        crypto.createHash('sha256').update('', 'utf8').digest('hex'), {
            'key': process.env.REACT_APP_ACCESS_KEY,
            'secret': process.env.REACT_APP_SECRET_ACCESS_KEY,
            'protocol': 'wss',
            'expires': 300,
            'region': 'us-east-1',
            'query': `language-code=${languageCode}&media-encoding=pcm&sample-rate=${inputSampleRate}`,
            'specialty': specialty,
            'type': type
        }
    );
}
