import React, { Component } from 'react'

export default class InputMessage extends Component {
    constructor (props) {
        super(props);

        /**
         * Initialize a new ref to hold the input message
         */
        this.input = React.createRef();
    }

    /**
     * Called anytime the enter key is pressed, or if the "Send" button is clicked
     */
    sendMessage () {
        this.props.onSend && this.props.onSend(this.input.current.value);
        this.input.current.value = '';
    }

    /**
     * Event listener
     */
    sendMessageIfEnter (e) {
        if (e.keyCode === 13) {
            this.sendMessage();
        }
    }

    render () {
        const sendMessage = this.sendMessage.bind(this);
        const sendMessageIfEnter = this.sendMessageIfEnter.bind(this);

        return (
            <div className='send-message'>
                <input className='message-input' type='text' ref={this.input} onKeyDown={sendMessageIfEnter} />
                <button className='btn btn-primary' onClick={sendMessage}>
                    Send
                </button>
            </div>
        );
    }
}