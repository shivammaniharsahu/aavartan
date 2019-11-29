import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Home from "./Pages/Home/Home";
import Newhome from "./Pages/newhome/newhome";
import Gallery from "./Pages/Gallery/Gallery";
import Events from "./Pages/Components/popupevents/events";
import Teampage from "./Pages/Team/Team";
import Sponspage from "./Pages/Spons/Spons";
import Navbar from "./Pages/Components/Navbar/navbar";
class App extends React.Component {
  state = {
    registeredEvents: [],
    logState: false
  };
  // FIRST TIME(FROM LS) LOG STATE AND REG EVENT
  getFromLS = async () => {
    let database = await window.localStorage.getItem("browserDataAavartan");
    if (database == "undefined") {
      return undefined;
    } else {
      return JSON.parse(database);
    }
  };

  updateREGeventsUpdater = newEvents => {
    this.setState({ registeredEvents: newEvents });
  };

  addEvent = Eventnumber => {
    let oldArray = this.state.registeredEvents;
    oldArray.push(Eventnumber);
    this.setState({ registeredEvents: oldArray });
  };

  logStateChanger = logState => {
    console.log(
      "log state changed from",
      this.state.logState,
      " to ",
      logState
    );
    this.setState({ logState });
  };

  componentWillMount() {
    this.getFromLS().then(database => {
      if (database == undefined) {
        this.setState({
          registeredEvents: [],
          logState: false
        });
      } else {
        this.setState({
          registeredEvents: database.currentUser.events,
          logState: database.loggedIn
        });
      }
    });
  }
  render() {
    return (
      <Router>
        <div>
          <Navbar
            logStateChanger={this.logStateChanger}
            regEventsUpdater={this.updateREGeventsUpdater}
            logState={this.state.logState}
          />
          <Route exact path="/" component={Newhome} />
          <Route exact path="/gallery/" component={Gallery} />

          <Route
            exact
            path="/events/"
            render={props => (
              <Events
                {...props}
                logState={this.state.logState}
                REGevents={this.state.registeredEvents}
                eventAdder={this.addEvent}
              />
            )}
          />
          <Route exact path="/team/" component={Teampage} />
          <Route exact path="/spons/" component={Sponspage} />
          {/* <Route exact path="/webteam/" component={Webteam} /> */}
        </div>
      </Router>
    )
  }
}

export default App;
