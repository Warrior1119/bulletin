import React from "react";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { connect } from "react-redux";

import SignIn from "../components/auth/SignIn";
import SignUp from "../components/auth/SignUp";
import SignOut from "../components/auth/SignOut";
import Posts from "../components/posts/Posts";
import CreatePost from "../components/posts/CreatePost";
import EditPost from "../components/posts/EditPost";

function App({ accessToken }) {
  let authNav;
  if (accessToken) {
    authNav = (
      <li className="nav-item">
        <Link className="nav-link" to={"/sign-out"}>
          Logout
        </Link>
      </li>
    );
  } else {
    authNav = (
      <React.Fragment>
        <li className="nav-item">
          <Link className="nav-link" to={"/sign-in"}>
            Login
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to={"/sign-up"}>
            Sign up
          </Link>
        </li>
      </React.Fragment>
    );
  }

  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand navbar-dark bg-dark fixed-top">
          <div className="container">
            <Link className="navbar-brand" to={"/"}>
              Bulletin
            </Link>
            <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
              <ul className="navbar-nav ml-auto">{authNav}</ul>
            </div>
          </div>
        </nav>
        <div></div>

        <div className="main container">
          <Switch>
            <Route exact path="/" component={Posts} />
            <Route exact path="/posts/new" component={CreatePost} />
            <Route exact path="/posts/:postId/edit" component={EditPost} />
            <Route path="/sign-in" component={SignIn} />
            <Route path="/sign-up" component={SignUp} />
            <Route path="/sign-out" component={SignOut} />
          </Switch>
        </div>
      </div>
    </Router>
  );
}

function mapStateToProps(state) {
  return {
    accessToken: state.auth.accessToken
  };
}
export default connect(mapStateToProps)(App);
