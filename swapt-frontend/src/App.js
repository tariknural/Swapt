import React, {Component} from "react";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

/**
 * Import Components
 */
import { HeaderComponent } from "./components/header.component";
import { FooterComponent } from "./components/footer.component";

/**
 * Import views for routing
 */

import { HomeView } from "./views/home.view";
import { ListingView } from "./views/listing.view";
import { LoginView } from "./views/login.view";
import { RegisterView } from "./views/register.view";
import { ProfileView } from "./views/profile.view";
import { UserSetupView } from "./views/usersetup.view";
import { CountryView } from "./views/country.view";
import { CountrySelectionView } from "./views/countrySelection.view";
import {AccommodationDetailView} from "./views/accommodation-detail.view";
import AuthService from "./services/auth.service";
import { ChatView } from "./views/chat.view";
import { ChatListView } from "./views/chatList.view";

/**
 * Import websocket for chat
 */
import { startWebsocketConnection } from './websocket'

class App extends Component {
    constructor(props) {
        super(props);

        const userSession = AuthService.getUserSession();
        let activeUser = '';

        if (userSession) {
            activeUser = userSession.activeUser;
        }

        // define routing table
        this.state = {
            activeUser: activeUser,
            routes:[
                { component: HomeView, path: ["/", "/home"], exact: true},
                { component: ListingView, path: "/listing", exact: true},
                { component: LoginView, path: "/login", exact: true},
                { component: RegisterView, path: "/register", exact: true},
                { component: UserSetupView, path: "/user_setup", exact: true},
                { component: ProfileView, path: "/profile", exact: true},
                { component: CountrySelectionView, path: "/country", exact: true},
                { component: CountryView, path: "/country/:id", exact: false},
                { component: AccommodationDetailView, path: "/accommodation/:id"},
                { component: AccommodationDetailView, path: "/accommodation/:id"},
                { component: ChatView, path: "/chat/:id"},
                { component: ChatListView, path: "/chatList", exact: true}
            ]
        };

        startWebsocketConnection();
    }

    render() {
        return (
            <Router>
                <div>
                    <HeaderComponent activeUser={this.state.activeUser} />

                    <Switch>
                        {this.state.routes.map((route, i) => (<Route key={i} {...route}/>) )}
                    </Switch>

                    <FooterComponent />
                </div>
            </Router>
        );
    }
}

export default App;
