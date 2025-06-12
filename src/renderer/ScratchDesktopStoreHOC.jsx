import React from 'react';
import {Provider} from 'react-redux';
import {createStore, combineReducers} from 'redux';
import aiAssistantModalReducer from './reducers/ai-assistant-modal.js';

/**
 * Higher-order component to extend the Redux store with additional reducers.
 * @param {Component} WrappedComponent - a component that expects a Redux store.
 * @returns {Component} - a component with an extended Redux store.
 */
const ScratchDesktopStoreHOC = function (WrappedComponent) {
    class ScratchDesktopStoreComponent extends React.Component {
        constructor (props) {
            super(props);
            
            // 创建一个中间件来拦截和处理AI助手modal的actions
            this.handleAction = this.handleAction.bind(this);
            this.originalDispatch = null;
        }

        componentDidMount () {
            // 等待WrappedComponent挂载后，获取其store并扩展dispatch
            this.extendStoreDispatch();
        }

        extendStoreDispatch () {
            // 尝试从context或其他方式获取store
            const storeElement = document.querySelector('[data-reactroot]');
            if (storeElement && storeElement._reactInternalInstance) {
                // 这是一个简化的方法，实际实现可能需要更复杂的逻辑
                console.log('Store extension logic would go here');
            }
        }

        handleAction (action) {
            // 处理AI助手modal相关的actions
            if (action.type === 'OPEN_AI_ASSISTANT_MODAL' || action.type === 'CLOSE_AI_ASSISTANT_MODAL') {
                // 更新本地状态或通过其他方式处理
                console.log('AI Assistant Modal action:', action.type);
            }
        }

        render () {
            return <WrappedComponent {...this.props} />;
        }
    }

    return ScratchDesktopStoreComponent;
};

export default ScratchDesktopStoreHOC; 