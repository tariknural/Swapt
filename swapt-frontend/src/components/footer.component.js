import React, {Component} from "react";

export class FooterComponent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="footer mt-5">
                <footer>
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-6 col-md-3 item">
                                <h3>About</h3>
                                <ul>
                                    <li><a href="#">Company</a></li>
                                    <li><a href="#">Team</a></li>
                                    <li><a href="#">Careers</a></li>
                                </ul>
                            </div>
                            <div className="col-sm-9 item text">
                                <h3>Swapt</h3>
                                <p>Designed / Developed for Portfolio of Tarik Nural</p>
                            </div>
                        </div>
                        <p className="copyright">Swapt © 2020</p>
                    </div>
                </footer>
            </div>
        );
    }
}
