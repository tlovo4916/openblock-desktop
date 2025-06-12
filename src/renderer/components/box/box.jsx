import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

const Box = props => {
    const {
        className,
        children,
        ...componentProps
    } = props;
    
    return (
        <div
            className={classNames(className)}
            {...componentProps}
        >
            {children}
        </div>
    );
};

Box.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
};

export default Box; 