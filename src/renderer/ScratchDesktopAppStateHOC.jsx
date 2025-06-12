import {ipcRenderer} from 'electron';
import bindAll from 'lodash.bindall';
import React from 'react';

/**
 * Higher-order component to add desktop logic to AppStateHOC.
 * @param {Component} WrappedComponent - an AppStateHOC-like component to wrap.
 * @returns {Component} - a component similar to AppStateHOC with desktop-specific logic added.
 */
const ScratchDesktopAppStateHOC = function (WrappedComponent) {
    class ScratchDesktopAppStateComponent extends React.Component {
        constructor (props) {
            super(props);
            this.state = {
                telemetryDidOptIn: false
            };
        }
        
        render () {
            const shouldShowTelemetryModal = false;

            return (<WrappedComponent
                isTelemetryEnabled={this.state.telemetryDidOptIn}
                onTelemetryModalOptIn={() => {}}
                onTelemetryModalOptOut={() => {}}
                showTelemetryModal={shouldShowTelemetryModal}

                {...this.props}
            />);
        }
    }

    return ScratchDesktopAppStateComponent;
};

export default ScratchDesktopAppStateHOC;
