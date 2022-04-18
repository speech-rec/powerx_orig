const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const request = require('request');
const cors = require('cors');
const multer  = require('multer');
const fs = require('fs');
//const wav = require('wav');
let upload = multer();
if(process.env.NODE_ENV != 'production') require('dotenv').config();

const app = express();
const port = process.env.PORT || 8000;
//  const baseURL = 'http://an.pixcile.com';

const baseURL = 'http://alphenotes-dev.us-east-1.elasticbeanstalk.com';
 
// const baseURL = 'http://localhost:50139';
app.use(cors());
app.get('/getCredentials', (req, res) => {
  console.log('got it');
  const body = {
    accessKey: process.env.REACT_APP_ACCESS_KEY,
    secretKey: process.env.REACT_APP_SECRET_ACCESS_KEY
  };
  
  res.json(body);
});
// var nodemailer = require('nodemailer');
// var pdf = require("pdf-creator-node");
// var fs = require('fs');
// var options = {
//   format: "A4",
//   orientation: "portrait",
//   border: "10mm",
//   // header: {
//   //     height: "45mm"
//   // },
//   // "footer": {
//   //     "height": "28mm",
//   //     "contents": {
//   //     first: 'Cover page',
//   //     2: 'Second page', // Any page number is working. 1-based index
//   //     default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
//   //     last: 'Last Page'
//   // }}
// };
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// API calls
app.post('/saveFile/:userId', upload.any(), function(req, res) {
  let formData = req.body;
  let files = req.files;
  // let path = `audio/${new Date().toISOString().
  //   replace(/T/, '-').
  //   replace(/:/, '-').      // replace T with a space
  //   replace(/\..+/, '')  + req.params.userId}.mp3`;
  let path =  makeid(5) + req.params.userId + ".mp3";
    
  const fd = fs.openSync(path, 'w');
  console.log("File is created.");
      fs.writeFileSync(path, req.files[0].buffer);
      console.log('form data', formData, 'file' , files);
      request({
        url: `${baseURL}/api/api.ashx?methodname=saveFile`,
        method: 'POST',
        formData: {
          'regularField': 'someValue',
          'regularFile': fs.createReadStream(path),
          // 'customBufferFile': {
          //   value: files[0].buffer.toString('utf8'),
          //   options: {
          //     filename: 'myfile.bin'
          //   }
          // }
        }
      }, (respone) => {
        console.log(respone);
        fs.unlink(path, (err) => {
          if (err) {
              console.log(err);
          }
      console.log(path);
          console.log("File is deleted.");
      });
      });
      res.sendStatus(200);
//   fs.open(`audio/${new Date().toString() + req.params.userId}.mp3`, 'w', (err, file) => {
//     if (err) {
//         throw err;
//     }
    
//     else{
      
//     }

   
// });
  
});
function makeid(length) {
  var result           = [];
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result.push(characters.charAt(Math.floor(Math.random() * 
charactersLength)));
 }
 return result.join('');
}
app.get('/login/:email/:password', (req, res) => {
  var url =  `${baseURL}/api/api.ashx?methodname=login&email=${req.params.email}&password=${req.params.password}`;
  
  request(
    { url: url },
    (error, response, body) => {
      if (error || response.statusCode !== 200) {
        return res.status(500).json({ type: 'error', message:  error ? error.message: "" });
      }

      res.json(JSON.parse(body));
    }
  );
 
});

app.get('/register/:name/:email/:password', (req, res) => {
  var url = `${baseURL}/api/api.ashx?methodname=signup&email=${req.params.email}&password=${req.params.password}&name=${req.params.name}`;
  
  request(
    { url: url },
    (error, response, body) => {
      if (error || response.statusCode !== 200) {
        return res.status(500).json({ type: 'error', message: error ? error.message: "" });
      }

      res.send(body);
    }
  );
  
  
});

app.get('/recordRecording/:userId/:recordingTime', (req, res) => {
  var url = `${baseURL}/api/api.ashx?methodname=AddRecordingRecord&userId=${req.params.userId}&recordingTime=${req.params.recordingTime}`;
  
  request(
    { url: url },
    (error, response, body) => {
      if (error || response.statusCode !== 200) {
        return res.status(500).json({ type: 'error', message: error ? error.message: "" });
      }

      res.send(body);
    }
  );
  
  
});


app.get('/updateSetting/:userId/:language/:speciality/:sampleRate/:isSoundActive/:streamType/:IsCustomDicionaryActive/:IsAutoPunctuationActive/:IsDictaPhoneActive', (req, res) => {
 
  const {userId, language, speciality, sampleRate, isSoundActive, streamType, IsCustomDicionaryActive, IsAutoPunctuationActive, IsDictaPhoneActive} = req.params;
  var url = `${baseURL}/api/api.ashx?methodname=UpdateUserRecordingSettings&userId=${userId}&language=${language}
  &speciality=${speciality}&sampleRate=${sampleRate}&isSoundActive=${isSoundActive}&streamType=${streamType}
  &IsCustomDicionaryActive=${IsCustomDicionaryActive}&IsDictaPhoneActive=${IsDictaPhoneActive}
  &IsAutoPunctuationActive=${IsAutoPunctuationActive}`;
  //console.log(url);
  request(
    { url: url },
    (error, response, body) => {
      console.log(response);
      if (error || response.statusCode !== 200) {
        return res.status(500).json({ type: 'error', message:  error ? error.message: "" });
      }

      res.send(body);
    }
  );
 
  
});

app.post('/sendmail/:recordingName/:recordingText/:userId/:recTime', upload.any(), (req, res) => {
  const {recordingName, recordingText, userId, recTime, doSendEmail, email} = req.body;
  console.log(doSendEmail);
var url = `${baseURL}/api/api.ashx?methodname=sendmail&userId=${userId}&name=${recordingName}&text=${recordingText}&recTime=${recTime}&doSendEmail=${doSendEmail}&email=${email}`
let formData = req.body;
//let files = req.files;
//let path =  makeid(5) + req.params.userId + ".mp3";
  
//const fd = fs.openSync(path, 'w');
//console.log("File is created.");
    //fs.writeFileSync(path, req.files[0].buffer);
    //console.log('form data', formData, 'file' , files);
    request({
      url: url,
      method: 'POST',
      formData: {
        'regularField': 'someValue',
        // 'regularFile': fs.createReadStream(req.files[0]),
        // 'customBufferFile': {
        //   value: files[0].buffer.toString('utf8'),
        //   options: {
        //     filename: 'myfile.bin'
        //   }
        // }
      }
    }, (error, response, body) => {
      console.log(body);
      if (error || response.statusCode !== 200) {
        return res.status(500).json({ type: 'error', message:  error ? error.message: "Oops! something went wrong." });
      }

      
      
      // fs.unlink(path, (err) => {
      //   if (err) {
      //       console.log(err);
      //   }
      //   console.log(path);
      //   console.log("File is deleted.");
        
    //});
    res.send(body);
    console.log("Ok status");
    });
   
    
//   var html = fs.readFileSync('./build/template.html', 'utf8');
//   var document = {
//     html: html,
//     data: {
//         name: recordingName,
//         text: recordingText
//     },
//     path: "./output.pdf"
// };

// pdf.create(document, options)
//     .then(res => {
//         console.log(res);
//         var transporter = nodemailer.createTransport({
//           host: 'smtp-mail.outlook.com',
//           secureConnection: false, // TLS requires secureConnection to be false
//           port: 587, // port for secure SMTP
//           tls: {
//               ciphers:'SSLv3'
//           },
//           auth: {
//             user: '',
//             pass: ''
//           }
//         });
//         var mailOptions = {
//           from: '',
//           to: userEmail,
//           subject: 'Email from Notes App',
//           text: '',
//           attachments: [
//             {   // file on disk as an attachment
//               filename: `${recordingName}.pdf`,
//               path: './output.pdf' // stream this file
//           },
//           ]
//         };
        
//         transporter.sendMail(mailOptions, function(error, info){
//           if (error) {
//             response.json({text: error.message});
//             console.log(error);
//             fs.unlinkSync('./output.pdf');
//           } else {
//             response.json({text: 'Email sent: ' + info.response});
//             console.log('Email sent: ' + info.response);
//             fs.unlinkSync('./output.pdf');
//           }
//         });
        
//     })
//     .catch(error => {
//       response.json({text: error.message});
//         console.error(error);
//         fs.unlinkSync('./output.pdf');
//     });

  // request(
  //   { url: url },
  //   (error, response, body) => {
  //     if (error || response.statusCode !== 200) {
  //       return res.status(500).json({ type: 'error', message:  error ? error.message: "" });
  //     }

  //     res.json(JSON.parse(body));
  //   }
  // );
  
  
});
app.get('/addTemplate/:templateName/:templateText/:userId', (req, res) => {
  const {templateName, templateText, userId} = req.params;
var url = `${baseURL}/api/api.ashx?methodname=AddTemplate&userId=${userId}&templateName=${templateName}&templateText=${templateText}`
  
//   var html = fs.readFileSync('./build/template.html', 'utf8');
//   var document = {
//     html: html,
//     data: {
//         name: recordingName,
//         text: recordingText
//     },
//     path: "./output.pdf"
// };

// pdf.create(document, options)
//     .then(res => {
//         console.log(res);
//         var transporter = nodemailer.createTransport({
//           host: 'smtp-mail.outlook.com',
//           secureConnection: false, // TLS requires secureConnection to be false
//           port: 587, // port for secure SMTP
//           tls: {
//               ciphers:'SSLv3'
//           },
//           auth: {
//             user: '',
//             pass: ''
//           }
//         });
//         var mailOptions = {
//           from: '',
//           to: userEmail,
//           subject: 'Email from Notes App',
//           text: '',
//           attachments: [
//             {   // file on disk as an attachment
//               filename: `${recordingName}.pdf`,
//               path: './output.pdf' // stream this file
//           },
//           ]
//         };
        
//         transporter.sendMail(mailOptions, function(error, info){
//           if (error) {
//             response.json({text: error.message});
//             console.log(error);
//             fs.unlinkSync('./output.pdf');
//           } else {
//             response.json({text: 'Email sent: ' + info.response});
//             console.log('Email sent: ' + info.response);
//             fs.unlinkSync('./output.pdf');
//           }
//         });
        
//     })
//     .catch(error => {
//       response.json({text: error.message});
//         console.error(error);
//         fs.unlinkSync('./output.pdf');
//     });

  request(
    { url: url },
    (error, response, body) => {
      if (error || response.statusCode !== 200) {
        return res.status(500).json({ type: 'error', message:  error ? error.message: "" });
      }

      res.json(JSON.parse(body));
    }
  );
  
  
});
app.get('/GetTemplatesByUserId/:userId', (req, res) => {
  const {userId} = req.params;
var url = `${baseURL}/api/api.ashx?methodname=GetTemplatesByUserId&userId=${userId}`
  

  request(
    { url: url },
    (error, response, body) => {
      if (error || response.statusCode !== 200) {
        return res.status(500).json({ type: 'error', message:  error ? error.message: "" });
      }

      res.json(JSON.parse(body));
    }
  );
  
});
app.get('/GetCustomDictionary/', (req, res) => {
var url = `${baseURL}/api/api.ashx?methodname=GetCustomDictionary`
  

  request(
    { url: url },
    (error, response, body) => {
      if (error || response.statusCode !== 200) {
        return res.status(500).json({ IsError: 'true', message:  error ? error.Message: "Oops! something went wrong." });
      }

      res.json(JSON.parse(body));
    }
  );
  
});
app.get('/GetUserLicenseData/:userId', (req, res) => {
  const {userId} = req.params;
  var url = `${baseURL}/api/api.ashx?methodname=GetUserLicenseData&uID=${userId}`
    
  
    request(
      { url: url },
      (error, response, body) => {
        if (error || response.statusCode !== 200) {
          return res.status(500).json({ IsError: 'true', message:  error ? error.Message: "Oops! something went wrong." });
        }
  
        res.json(JSON.parse(body));
      }
    );
    
  });
if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'build')));
    
  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}


app.listen(port, () => console.log(`Listening on port ${port}`));