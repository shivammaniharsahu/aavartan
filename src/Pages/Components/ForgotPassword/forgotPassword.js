import React, { Component } from "react";

class forgotPassword extends Component {
  state = {
    Loading: false,
    message: "",
    emailIsValid: true,
    email: ""
  };
  handleChange = event => {
    const isCheckbox = event.target.type == "checkbox";
    this.setState({
      [event.target.name]: isCheckbox
        ? event.target.checked
        : event.target.value
    });
  };
  changePassword = () => {
    
    this.setState({ Loading: true });
    let emailObject = {
      email: this.state.email
    };
    let url = `https://cors-anywhere.herokuapp.com/http://aavartan.nitrr.ac.in:8000/user/rest-auth/password/reset/`;
    fetch(url, {
      method: "POST",
      body: JSON.stringify(emailObject),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(response => {
        this.setState({
          Loading: false,
          message: `Password reset e-mail has been sent to ${this.state.email}`
        });
        //   this.setState({message:response})
      })
      .catch(error => {
        this.setState({ Loading: false });
        console.error("Error:REg", error);
        this.setState({
          message: "Server Error",
          Loading: false
        });
      });
  };
  emailValidation = event => {
    event.preventDefault();
    let pattern = new RegExp(
      /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
    );
    if (!pattern.test(this.state.email)) {
      this.setState({ message: "Please Enter a valid email" });
    } else {
      this.changePassword();
    }
  };
  render() {
    return (
      <div className="columns is-mobile is-vcentered">
        <div className="has-text-centered">
          <div className="modal is-vcentered" id="modal_forgot_pass">
            <div className="modal-background"></div>

            <div className="modal-card is-vcentered">
              <header className="modal-card-head">
                <p className="modal-card-title">
                  <button
                    className="delete"
                    aria-label="close"
                    onClick={this.props.remove_forgot_pass}
                  ></button>
                </p>
              </header>
              <section className="modal-card-body">
                <h1 className="headerfont">email verify</h1>
                <br />
                <br />
                <form
                  method="post"
                  action=""
                  className="registeration-form"
                  onSubmit={this.emailValidation}
                >
                  <div className="field">
                    <div className="control">
                      <input
                        className="input is-vcentered "
                        type="email"
                        placeholder="Email"
                        required
                        name="email"
                        value={this.state.email}
                        onChange={this.handleChange}
                      />
                    </div>
                  </div>

                  <button className="submit" type="submit">
                    Submit
                    {this.state.Loading ? (
                      <div className="button is-loading">Loading</div>
                    ) : (
                      ""
                    )}
                  </button>
                  <h3 className="error_class">{this.state.message}</h3>
                </form>
              </section>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default forgotPassword;
