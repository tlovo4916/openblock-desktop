import PropTypes from 'prop-types';
import React from 'react';
import bindAll from 'lodash.bindall';
import {FormattedMessage} from 'react-intl';

import Modal from 'react-modal';
import Box from '../box/box.jsx';
import styles from './ai-assistant-modal.css';

class AiAssistantModal extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleClose',
            'handleSendMessage',
            'handleInputChange',
            'handleKeyPress',
            'callDeepSeekAPI'
        ]);
        
        this.state = {
            messages: [
                {
                    role: 'assistant',
                    content: '哈喽哇👋！我是小派，一只会编程的小猫咪🐱。有什么我可以帮助你的吗😊？'
                }
            ],
            inputValue: '',
            isLoading: false,
            systemPrompt: '你是一个由数派开发的教育类型的编程助手，名叫"小派",是一只会编程的小猫咪。你的任务是帮助小朋友学习编程,以micropython语法和arduino语法为主，特别是Scratch图形化编程。请用简单易懂的语言回答问题，并且要有耐心和鼓励性。当学生遇到困难时，要给出具体的解决步骤。态度需要和蔼可亲,回答需要简洁明了,适合小学生理解。'
        };
    }

    async callDeepSeekAPI(userMessage) {
        const apiKey = localStorage.getItem('deepseek_api_key') || '';
        const selectedModel = localStorage.getItem('deepseek_model') || 'deepseek-chat';
        const apiUrl = 'https://api.deepseek.com/v1/chat/completions';
        
        if (!apiKey) {
            return '请先在设置中配置DeepSeek API密钥哦～点击右上角的"设置"按钮进行配置。';
        }
        
        const messages = [
            { role: 'system', content: this.state.systemPrompt },
            ...this.state.messages.slice(-10), // 只保留最近10条消息作为上下文
            { role: 'user', content: userMessage }
        ];

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: selectedModel,
                    messages: messages,
                    max_tokens: 1000,
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                throw new Error(`API请求失败: ${response.status}`);
            }

            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error('DeepSeek API调用失败:', error);
            return '抱歉喵，网络无法连接到喵星哦。';
        }
    }

    async handleSendMessage() {
        const message = this.state.inputValue.trim();
        if (!message || this.state.isLoading) return;

        // 添加用户消息
        const newMessages = [...this.state.messages, { role: 'user', content: message }];
        this.setState({
            messages: newMessages,
            inputValue: '',
            isLoading: true
        });

        // 调用API获取回复
        const aiResponse = await this.callDeepSeekAPI(message);
        
        // 添加AI回复
        this.setState({
            messages: [...newMessages, { role: 'assistant', content: aiResponse }],
            isLoading: false
        });
    }

    handleInputChange(event) {
        this.setState({ inputValue: event.target.value });
    }

    handleKeyPress(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            this.handleSendMessage();
        }
    }

    handleClose() {
        this.props.onRequestClose();
    }

    render() {
        return (
            <Modal
                isOpen={this.props.isOpen}
                onRequestClose={this.handleClose}
                className={styles.modal}
                overlayClassName={styles.overlay}
                contentLabel="AI助手"
            >
                <Box className={styles.container}>
                    <div className={styles.header}>
                        <div className={styles.title}>
                            <FormattedMessage
                                defaultMessage="小派助手"
                                description="Title for AI assistant modal"
                                id="gui.aiAssistant.title"
                            />
                        </div>
                        <button
                            className={styles.closeButton}
                            onClick={this.handleClose}
                        >
                            ×
                        </button>
                    </div>
                    
                    <div className={styles.chatContainer}>
                        <div className={styles.messagesContainer}>
                            {this.state.messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`${styles.message} ${
                                        message.role === 'user' ? styles.userMessage : styles.assistantMessage
                                    }`}
                                >
                                    <div className={styles.messageContent}>
                                        {message.content}
                                    </div>
                                </div>
                            ))}
                            {this.state.isLoading && (
                                <div className={`${styles.message} ${styles.assistantMessage}`}>
                                    <div className={styles.messageContent}>
                                        <div className={styles.loadingDots}>
                                            <span>.</span><span>.</span><span>.</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        <div className={styles.inputContainer}>
                            <textarea
                                className={styles.messageInput}
                                value={this.state.inputValue}
                                onChange={this.handleInputChange}
                                onKeyPress={this.handleKeyPress}
                                placeholder="输入你的问题..."
                                rows={2}
                                disabled={this.state.isLoading}
                            />
                            <button
                                className={styles.sendButton}
                                onClick={this.handleSendMessage}
                                disabled={!this.state.inputValue.trim() || this.state.isLoading}
                            >
                                发送
                            </button>
                        </div>
                    </div>
                </Box>
            </Modal>
        );
    }
}

AiAssistantModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onRequestClose: PropTypes.func.isRequired
};

export default AiAssistantModal; 