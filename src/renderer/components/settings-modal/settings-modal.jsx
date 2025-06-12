import PropTypes from 'prop-types';
import React from 'react';
import bindAll from 'lodash.bindall';
import {FormattedMessage, injectIntl} from 'react-intl';

import Modal from 'react-modal';
import Box from '../box/box.jsx';
import styles from './settings-modal.css';

class SettingsModal extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleClose',
            'handleApiKeyChange',
            'handleModelChange',
            'handleSave'
        ]);
        
        this.state = {
            apiKey: localStorage.getItem('deepseek_api_key') || '',
            selectedModel: localStorage.getItem('deepseek_model') || 'deepseek-chat'
        };
    }

    handleApiKeyChange(event) {
        this.setState({ apiKey: event.target.value });
    }

    handleModelChange(event) {
        this.setState({ selectedModel: event.target.value });
    }

    handleSave() {
        localStorage.setItem('deepseek_api_key', this.state.apiKey);
        localStorage.setItem('deepseek_model', this.state.selectedModel);
        this.handleClose();
    }

    handleClose() {
        this.props.onClose();
    }

    render() {
        return (
            <Modal
                isOpen={this.props.isOpen}
                onRequestClose={this.handleClose}
                className={styles.modal}
                overlayClassName={styles.overlay}
                contentLabel="设置"
            >
                <Box className={styles.container}>
                    <div className={styles.header}>
                        <div className={styles.title}>
                            <FormattedMessage
                                defaultMessage="AI设置"
                                description="Title for settings modal"
                                id="gui.settings.title"
                            />
                        </div>
                        <button
                            className={styles.closeButton}
                            onClick={this.handleClose}
                        >
                            ×
                        </button>
                    </div>
                    
                    <div className={styles.content}>
                        <div className={styles.section}>
                            <h3 className={styles.sectionTitle}>
                                <FormattedMessage
                                    defaultMessage="AI助手配置"
                                    description="Section title for AI configuration"
                                    id="gui.settings.aiConfig"
                                />
                            </h3>
                            
                            <div className={styles.formGroup}>
                                <label className={styles.label}>
                                    <FormattedMessage
                                        defaultMessage="DeepSeek API密钥"
                                        description="Label for API key input"
                                        id="gui.settings.apiKey"
                                    />
                                </label>
                                <input
                                    type="password"
                                    className={styles.input}
                                    placeholder={this.props.intl.formatMessage({
                                        id: 'gui.settings.apiKeyPlaceholder',
                                        defaultMessage: '请输入你的DeepSeek API密钥...'
                                    })}
                                    value={this.state.apiKey}
                                    onChange={this.handleApiKeyChange}
                                />
                                <small className={styles.hint}>
                                    <FormattedMessage
                                        defaultMessage="API密钥将安全保存在本地，用于与小派助手对话"
                                        description="Hint text for API key"
                                        id="gui.settings.apiKeyHint"
                                    />
                                </small>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>
                                    <FormattedMessage
                                        defaultMessage="AI模型选择"
                                        description="Label for model selection"
                                        id="gui.settings.model"
                                    />
                                </label>
                                <select
                                    className={styles.select}
                                    value={this.state.selectedModel}
                                    onChange={this.handleModelChange}
                                >
                                    <option value="deepseek-chat">
                                        {this.props.intl.formatMessage({
                                            id: 'gui.settings.modelV3',
                                            defaultMessage: 'DeepSeek V3 (推荐)'
                                        })}
                                    </option>
                                    <option value="deepseek-reasoner">
                                        {this.props.intl.formatMessage({
                                            id: 'gui.settings.modelR1',
                                            defaultMessage: 'DeepSeek R1 (推理增强)'
                                        })}
                                    </option>
                                </select>
                                <small className={styles.hint}>
                                    <FormattedMessage
                                        defaultMessage="V3适合日常对话，R1适合复杂推理问题"
                                        description="Hint text for model selection"
                                        id="gui.settings.modelHint"
                                    />
                                </small>
                            </div>
                        </div>

                        <div className={styles.section}>
                            <h3 className={styles.sectionTitle}>
                                <FormattedMessage
                                    defaultMessage="关于小派"
                                    description="Section title for about Supie"
                                    id="gui.settings.aboutSupie"
                                />
                            </h3>
                            <div className={styles.aboutContent}>
                                <p>
                                    <FormattedMessage
                                        defaultMessage="🐱 小派是由数派开发的编程教育助手"
                                        description="About Supie description 1"
                                        id="gui.settings.aboutSupieDesc1"
                                    />
                                </p>
                                <p>
                                    <FormattedMessage
                                        defaultMessage="📚 专注于Scratch图形化编程和MicroPython教学"
                                        description="About Supie description 2"
                                        id="gui.settings.aboutSupieDesc2"
                                    />
                                </p>
                                <p>
                                    <FormattedMessage
                                        defaultMessage="🎯 为小朋友量身定制的学习伙伴"
                                        description="About Supie description 3"
                                        id="gui.settings.aboutSupieDesc3"
                                    />
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className={styles.footer}>
                        <button
                            className={styles.cancelButton}
                            onClick={this.handleClose}
                        >
                            <FormattedMessage
                                defaultMessage="取消"
                                description="Cancel button text"
                                id="gui.settings.cancel"
                            />
                        </button>
                        <button
                            className={styles.saveButton}
                            onClick={this.handleSave}
                        >
                            <FormattedMessage
                                defaultMessage="保存设置"
                                description="Save button text"
                                id="gui.settings.save"
                            />
                        </button>
                    </div>
                </Box>
            </Modal>
        );
    }
}

SettingsModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
};

export default injectIntl(SettingsModal); 