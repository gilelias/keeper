import axios from 'axios';
import _ from 'lodash';


import { GET_REQUESTS, DELETE_REQUESTS } from '../constants/constants';

export const getRequests = () => {
    return function(dispatch) {
        return axios.get(`/requests?limit=100`)
            .then(json => dispatch({
                type: GET_REQUESTS,
                data: json.data
            }));
    }
};

export const deleteRequests = (ids) => {
    return function(dispatch) {
        return axios.put(`/requests`, { ids })
            .then(json => dispatch({
                type: DELETE_REQUESTS,
                ids,
                data: json.data
            }));
    }
};
