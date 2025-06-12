const OPEN_AI_ASSISTANT_MODAL = 'OPEN_AI_ASSISTANT_MODAL';
const CLOSE_AI_ASSISTANT_MODAL = 'CLOSE_AI_ASSISTANT_MODAL';

const initialState = {
    isOpen: false
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
    case OPEN_AI_ASSISTANT_MODAL:
        return {
            ...state,
            isOpen: true
        };
    case CLOSE_AI_ASSISTANT_MODAL:
        return {
            ...state,
            isOpen: false
        };
    default:
        return state;
    }
};

// Action creators
const openAiAssistantModal = () => ({
    type: OPEN_AI_ASSISTANT_MODAL
});

const closeAiAssistantModal = () => ({
    type: CLOSE_AI_ASSISTANT_MODAL
});

export {
    reducer as default,
    initialState as aiAssistantModalInitialState,
    openAiAssistantModal,
    closeAiAssistantModal,
    OPEN_AI_ASSISTANT_MODAL,
    CLOSE_AI_ASSISTANT_MODAL
}; 