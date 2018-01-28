/**
 * Created by gil on 12/20/16.
 */

import _ from 'lodash';
import { GET_REQUESTS, DELETE_REQUESTS } from '../constants/constants';

export default (state={}, action) => {
    switch (action.type){
        case GET_REQUESTS:
            return action.data;
            break;

        case DELETE_REQUESTS:
            return _.filter(state, s=>_.indexOf(action.ids, s._id)==-1);
            break;


        default:
            return state;
    }
}