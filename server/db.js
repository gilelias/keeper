const _ = require('lodash');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const { MONGO_DB_URL } = require('./config');


class DB{
    constructor(){
        var _this = this;
        MongoClient.connect(MONGO_DB_URL, function(err, db) {
            if(err){
                console.log(err);
            }else{
                console.log("Connected correctly to server");
                _this.db = db;
            }
        });

        this.challenges = null;
        this.clearChallengesCache = _.debounce(()=>{
          this.challenges = null;
        }, 30000);
        this.challengesTimeout = null;
    }

    closeDb(){
        this.db.close();
    }

    logRequest({request, response, requesterIp, parsedIp, timestamp = new Date(), blocked = false}){
        let db = this.db;
        if(!db) throw('db not connected');

        var collection = db.collection('requests');
        return new Promise((resolve, reject)=>{
            collection.insertMany([{
                request,
                response,
                requesterIp,
                blocked,
                parsedIp,
                timestamp
            }], function(err, result) {
                if(err) return reject(err);
                return resolve(result)
            });
        })
    }

    getRequests(limit=10, skip=0){
        let db = this.db;
        if(!db) throw('db not connected');
        limit = parseInt(limit);
        if(!_.isNumber(limit)) limit = 0;

        skip = parseInt(skip);
        if(!_.isNumber(skip)) skip = 0;

        var collection = db.collection('requests');
        return new Promise((resolve, reject)=>{
            collection.find({}, {limit, skip}).toArray(function(err, result) {
                if(err) return reject(err);
                return resolve(result)
            });
        })
    }

    deleteRequests(ids){
        let db = this.db;
        var collection = db.collection('requests');
        return new Promise((resolve, reject)=>{
            if(!db) return reject('db not connected');
            if(!ids || !_.isArray(ids) || ids.length==0) resolve(false);

            collection.deleteMany({ $or: _.map(ids, id=>{return {_id: new ObjectID(id)}}) }, function(err, result) {
                if(err) return reject(err);
                return resolve(result)
            });
        })
    }


    insertChallengeRole({ field, test, type=1 }){
        let db = this.db;
        if(!db) throw('db not connected');
        var collection = db.collection('challenges');
        var _this = this;

        return new Promise((resolve, reject)=>{
            collection.insertMany([{
                field,
                test,
                type,
            }], function(err, result) {
                if(err) return reject(err);
                _this.challenges = null;
                return resolve(result)
            });
        })
    }

    deleteChallenge(ids){
        let db = this.db;
        if(!db) throw('db not connected');
        if(!ids || !_.isArray(ids) || ids.length==0) return false;
        var collection = db.collection('challenges');
        var _this = this;
        return new Promise((resolve, reject)=>{
            collection.deleteMany({ $or: _.map(ids, id=>{return {_id: new ObjectID(id)}}) }, function(err, result) {
                if(err) return reject(err);
                _this.challenges = null;
                return resolve(result)
            });
        })
    }

    getChallenges(){
        if(this.challenges) return this.challenges;

        let db = this.db;
        if(!db) throw('db not connected');
        var collection = db.collection('challenges');
        var _this = this;
        return new Promise((resolve, reject)=>{
            collection.find({}).toArray(function(err, docs){
                if(err) return reject(err);
                _this.challenges = docs;
                _this.clearChallengesCache();
                return resolve(docs)
            })

        })
    }
}

module.exports = new DB();
