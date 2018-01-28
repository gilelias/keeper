/**
 * Created by gil on 12/20/16.
 */

import axios from 'axios';
import _ from 'lodash';

import { GET_CHALLENGES, DELETE_CHALLENGES, CREATE_CHALLENGE } from '../constants/constants';

export const getChallenges = () => {
    return function(dispatch) {
        return axios.get(`/challenges`)
            .then(json => dispatch({
                type: GET_CHALLENGES,
                data: json.data
            }));
    }
};

export const deleteChallenges = (ids) => {
    return function(dispatch) {
        return axios.put(`/challenge`, { ids })
            .then(json => dispatch({
                type: DELETE_CHALLENGES,
                ids,
                data: json.data
            }));
    }
};

export const createChallenge = (challenge) => {
    return function(dispatch) {
        return axios.post(`/challenge`, challenge)
            .then(json => dispatch({
                type: CREATE_CHALLENGE,
                challenge,
                data: json.data
            }));
    }
};