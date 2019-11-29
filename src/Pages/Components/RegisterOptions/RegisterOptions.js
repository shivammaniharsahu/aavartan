/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
class RegisterOptions extends React.Component {
  checkRegisteration = () => {
    // this.props.isUserLoggedIn &&
    //   this.props.eventList.includes(this.props.eventNo);

    // USER IS NOT LOGGED IN
    if (this.props.isUserLoggedIn !== "wait") {
      let userEvents = [];
      userEvents = this.props.eventList;

      if (
        this.props.isUserLoggedIn &&
        userEvents.includes(this.props.eventNo)
      ) {
        return true;
      } else {
        return false;
      }
    }
  };

  render() {
    return (
      <div>
        {this.checkRegisteration() ? (
          <i className="fa fa-check check_icon">Registered</i>
        ) : (
          <button
            className="button is-white is-small eventRegButton"
            value="13"
            onClick={() => {
              this.props.onClickFunction(this.props.eventNo);
            }}
          >
            Register
          </button>
        )}
      </div>
    );
  }
}

export default RegisterOptions;
