import React, { Component } from 'react';
import './Modal.css';

import Backdrop from './../Backdrop/Backdrop';

class Modal extends Component {
    render() {
        return (
            <div>
                <Backdrop />
                <span className='Close' onClick={this.props.close}>X</span>
                <div style={{height:'350px', textAlign:'center', position:'fixed', backgroundColor:'#fff', zIndex: 500, left: '15%', top: '10%', boxSizing: 'border-box', width: '70%', overflowY: 'scroll'}}>
                    <h2>{this.props.title}</h2>
                    {this.props.content}
                </div>
            </div>
        )
    }
}

export default Modal;