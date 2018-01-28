const net = require("net");
const fs  = require("fs");
const _  = require('lodash');
var parser = require('http-string-parser');

const challenge = require('./challenge');

if (process.argv.length != 5) {
    console.log("usage: %s <localport> <remotehost> <remoteport>", process.argv[1]);
    process.exit();
}

const db = require('./db');

process.on('uncaughtException', function(err){ // generic error 
  console.log(err);
})

var localport = process.argv[2];
var remotehost = process.argv[3];
var remoteport = process.argv[4];

var server = net.createServer(function (localsocket) {
    var remotesocket = new net.Socket();
    var requesterIp = localsocket.remoteAddress;
    var request = '';
    var _parsedResponse = '';
    var _parsedRequest = '';
    var _parsedIp = '';
    var response = '';

    remotesocket.connect(remoteport, remotehost);
    remotesocket.on('connect', function (data) {
        // todo: check ip address
    });


    localsocket.on('data', async function (data) { // data sent to local
      try{
          request += data.toString();
          let { shouldBlock, parsedRequest, parsedIp } = await challenge.checkRequest(request, requesterIp);
          _parsedRequest = parsedRequest;
          _parsedIp = parsedIp;
          if(shouldBlock === true){
              localsocket.write("blocked");
              localsocket.end();
              db.logRequest({request: parsedRequest, blocked: true, requesterIp, parsedIp});
              request = '';
              return false;
          }


          var flushed = remotesocket.write(data);
          if (!flushed) {
              localsocket.pause();
          }
      }catch(err){
        console.log(err);
      }
    });

    remotesocket.on('data', function(data) {
      try{
      response += data.toString();
          var flushed = localsocket.write(data);
          if (!flushed) {
              response = '';
              remotesocket.pause();
          }else{
              _parsedResponse = challenge.parseResponse(response);
              response = '';
              request = '';
              if(_parsedResponse){
                  db.logRequest({request: _parsedRequest, response: _parsedResponse, requesterIp, parsedIp: _parsedIp, timestamp: new Date()});
              }
          }
      }catch(err){
        console.log(err);
      }
    });

    localsocket.on('drain', function() {
      try{
        remotesocket.resume();
      }catch(err){
        console.log(err);
      }
    });

    remotesocket.on('drain', function() {
      try{
        localsocket.resume();
      }catch(err){
        console.log(err);
      }

    });

    localsocket.on('close', function(had_error) {
        try{
          remotesocket.end();
        }catch(err){
          // console.log(err);
        }
    });

    remotesocket.on('close', function(had_error) {
      try{
        localsocket.end();
      }catch(err){
        // console.log(err);
      }
    });

});

server.listen(localport);

console.log("redirecting connections from 127.0.0.1:%d to %s:%d", localport, remotehost, remoteport);
