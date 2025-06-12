import {combineReducers} from 'redux';
import aiAssistantModalReducer from './reducers/ai-assistant-modal.js';

// 创建一个额外的reducer来扩展openblock-gui的store
const additionalReducers = combineReducers({
    aiAssistantModal: aiAssistantModalReducer
});

export default additionalReducers; 