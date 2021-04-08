import React, {Component} from 'react'
import ReactPaginate from "react-paginate";
import AccommodationListingCountryComponent from "../components/accommodation-listing-country.component";

const Message = ({ content, name, isCurrentUser }) => (
    <div className={'message' + (isCurrentUser ? ' message-self' : '')}>
        <div className='message-username'>{name}</div>
        <div className='message-text'>{content}</div>
    </div>
);

export default class Messages extends Component {
    constructor (props) {
        super(props);

        /**
         * messageWindow is used for auto-scrolling the window
         */
        this.messageWindow = React.createRef();
    }

    componentDidUpdate () {
        /**
         * To change the scrollTop attribute to auto-scroll the message window to the bottom
         */
        const messageWindow = this.messageWindow.current;
        messageWindow.scrollTop = messageWindow.scrollHeight - messageWindow.clientHeight;
    }

    render () {
        const { messages = [], username } = this.props;

        return (
            <div className="message-container" ref={this.messageWindow}>
                {messages.map((msg, i) => {
                    return <Message key={i} content={msg.message} name={msg.fromName} isCurrentUser={username === msg.fromName} />
                })}
            </div>
        );
    }
}