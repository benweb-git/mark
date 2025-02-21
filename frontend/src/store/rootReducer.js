import { combineReducers } from '@reduxjs/toolkit'; // or 'redux'
import authReducer from './reducers/authReducer';
import homeReducer from './reducers/homeReducer';
import socialReducer from './reducers/socialReducer';
import coinReducer from './reducers/coinReducer';
import networkReducer from './reducers/networkReducer';
import participantReducer  from './reducers/participantReducer';
import contactReducer from './reducers/contactReducer';



const rootReducer = combineReducers({
    auth: authReducer,
    home:homeReducer,
    social:socialReducer,
    coin:coinReducer,
    participant:participantReducer,
    network:networkReducer,
    contact:contactReducer,
});

export default rootReducer;
