import React, { Component } from "react";
import CountryCommentService from "../services/countryComment.service"
import AuthService from "../services/auth.service";

export class CountryComments extends Component {
    constructor(props) {
        super(props);

        const userSession = AuthService.getUserSession();
        let currentUser = undefined;
        if (userSession) {
            currentUser = userSession.activeUser;
        }

        this.state = {
            countryId: this.props.countryId,
            currentInformation: this.props.currentInformation,
            commentBox: null,
            comments: [],
            predecessors: [],
            reply: "",
            currentUser: currentUser
        }

        

        this.openCommentBox = this.openCommentBox.bind(this);
        this.updateReply = this.updateReply.bind(this);
        this.reply = this.reply.bind(this);
    }

    componentDidMount() {
        CountryCommentService.getAllCountryComments(this.state.countryId).then(
            response => {
                this.setState({
                    comments: response.data
                })
            },
            error => {
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                this.setState({
                    loading: false,
                    message: resMessage
                });
            }
        )
    }

    componentDidUpdate(oldProps) {
        const newProps = this.props
        if(oldProps.currentInformation !== newProps.currentInformation) {
          this.setState({
              currentInformation: newProps.currentInformation
           })
        }
      }

    openCommentBox(id) {
        this.setState({
            commentBox: id
        })
    }

    updateReply(e) {
        this.setState({
            reply: e.target.value
        })
    }

    reply(id){
        CountryCommentService.saveComment(this.state.reply, id ? this.state.predecessors[id] : [], this.state.countryId, 
            this.state.currentInformation)
        .then(response => {
            let copyOfCommentsInState = this.state.comments;
            copyOfCommentsInState[this.state.currentInformation] = response.data;
            this.setState({
                comments: copyOfCommentsInState,
                commentBox: null
            })},
            error => {
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                this.setState({
                    loading: false,
                    message: resMessage
            });
        });
    }

    renderComments(predecessors, comments){
        let commentJSX = [];
        if (!comments) {return}
        for (let i = 0; i < comments.length; i++) {
            let date = new Date(comments[i].time);
            let dateString = date.getDate().toString().padStart(2, '0') + "."
                + (date.getMonth()+1).toString().padStart(2, '0') + "."
                + date.getFullYear().toString().padStart(4, '0') + " "
                + date.getHours().toString().padStart(2, '0') + ":"
                + date.getMinutes().toString().padStart(2, '0');

            let predecessorsCopy = [...predecessors];
            predecessorsCopy.push(comments[i]._id);

            this.state.predecessors[comments[i]._id] = predecessorsCopy;
            if (comments[i]){
                commentJSX.push(
                <div key={i} className="media"> <img className="mr-3 rounded-circle" alt="Bootstrap Media Preview" src={comments[i].profilePicture} />
                    <div className="media-body">
                        <div className="row">
                            <div className="col-sm-8"> 
                                        <h5>{comments[i].userName}</h5>
                                        <span>{dateString}</span>
                            </div>
                            <div className="col-sm-4">
                                <div className="float-right">
                                    {(predecessors.length < 4)
                                        ? <button className="btn btn-secondary" onClick={() => this.openCommentBox(comments[i]._id)}>Reply</button>
                                        : ""
                                    }
                                </div>
                            </div>
                        </div> <p>{comments[i].comment}</p>
                        <div>
                            {this.state.commentBox === comments[i]._id
                            ?
                            <div>
                                <div className="form-group">
                                    <textarea className="form-control" onChange={this.updateReply}></textarea>
                                </div>
                                <div className="form-group">
                                    <button className="btn btn-primary" onClick={() => this.reply(comments[i]._id)}>Post</button>
                                </div>
                            </div>
                            :
                            "" }
                        </div>
                        {this.renderComments(predecessorsCopy, comments[i].answers)}
                    </div>
                </div>)
            }
        }
        return commentJSX;
    }

    render() {  
        return (
            <div key={this.props.currentInformation}>
            
                <div className="row">
                    <div className="col-sm-12">
                        <h5 className="mb-4">Comment to this article</h5>
                    {this.renderComments([], this.state.comments[this.state.currentInformation] ? this.state.comments[this.state.currentInformation].comments : [])}
                    </div>
                </div>

                <div>
                    <div className="form-group">
                        <textarea className="form-control" onChange={this.updateReply}></textarea>
                    </div>
                    <div className="form-group">
                        <button className="btn btn-primary" onClick={() => this.reply()}>Post</button>
                    </div>
                </div>
            </div> 
        );
    }
}

export default CountryComments;
