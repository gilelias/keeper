/**
 * Created by gil on 12/20/16.
 */
var parser = require('http-string-parser');
const db = require('./db');
const _ = require('lodash');
const ip = require('./ip');


class Challenge{
    parseRequest(request){
        let httpParsed = parser.parseRequest(request);
        if(httpParsed && _.has(httpParsed, 'uri')){
            return httpParsed;
        }

        return request;
    }


    parseResponse(response){
        let httpParsed = parser.parseResponse(response);
        if(httpParsed && _.get(httpParsed, 'protocolVersion')){
            _.set(httpParsed, 'body', null);
            delete httpParsed.body; // we dont want to save that
            return httpParsed;
        }

        return null; // response;
    }

    async challenge(params){
        let challenges = await db.getChallenges();
        return _.some(challenges, c=>{
            if(_.get(params, c.field)){ //field exists lets test it
                var patt=new RegExp(c.test);
                console.log(_.get(params, c.field), patt)
                return patt.test(_.get(params, c.field));
            }
        })
    }

    async checkRequest(request, requesterIp){
        let parsedRequest = this.parseRequest(request);
        let parsedIp = null; // await ip.getUserLocationByIP(requesterIp);
        return {
            request,
            parsedRequest,
            parsedIp,
            shouldBlock: await this.challenge({ request: parsedRequest, parsedIp})
        };
    }
}


module.exports = new Challenge();
