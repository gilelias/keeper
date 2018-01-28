/**
 * Created by gil on 12/20/16.
 */


import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux';

import requests from './requests';
import challenges from './challenges';



const appReducer  = combineReducers({
    requests,
    challenges,
    routing: routerReducer
});


export default appReducer;
