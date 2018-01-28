/**
 * Created by gil on 12/20/16.
 */
const path = require('path');
const express = require('express')
const bodyParser = require('body-parser');
const db = require('./db');

const { PANEL_PORT } = require('./config');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());




// challenge
app.get('/challenges', async function(req, res){
    let results = await db.getChallenges();
    res.json(results);
});

app.post('/challenge', async function(req, res){
    let results = await db.insertChallengeRole(req.body);
    res.json(results);
});

app.put('/challenge', async function(req, res){
    if(req.body.ids && req.body.ids.length){
        let results = await db.deleteChallenge(req.body.ids);
        res.json(results);
    }else{
        
    }
});



//requests
app.get('/requests', async function(req, res){
    let results = await db.getRequests(req.query).catch(console.log);
    res.json(results);
});

app.put('/requests', async function(req, res){
    let results = await db.deleteRequests(req.body.ids).catch(console.log);
    res.json(results);
});


app.use(express.static(path.resolve(__dirname, '../build')));

app.use(function(req, res){
    res.sendFile(path.resolve(__dirname, '../build/index.html'));
});



app.listen(PANEL_PORT);
