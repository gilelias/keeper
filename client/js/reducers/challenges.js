/**
 * Created by gil on 12/20/16.
 */

import _ from 'lodash';
import { GET_CHALLENGES, DELETE_CHALLENGES, CREATE_CHALLENGE } from '../constants/constants';

export default (state={}, action) => {
    switch (action.type){
        case GET_CHALLENGES:
            return action.data;
            break;

        case DELETE_CHALLENGES:
            return _.filter(state, s=>_.indexOf(action.ids, s._id)==-1);
            break;

        case CREATE_CHALLENGE:
            return state.concat(action.data.ops);
            break;


        default:
            return state;
    }
}