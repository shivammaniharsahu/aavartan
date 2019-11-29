/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
class OTPmodal extends React.Component {
  state = {
    otpError: "",
    otp: "",
    otpLoading: false
  };
  handleChange = event => {
    const isCheckbox = event.target.type === "checkbox";
    this.setState({
      [event.target.name]: isCheckbox
        ? event.target.checked
        : event.target.value
    });
  };
  //   click_otp = () => {
  //     let modal_login = document.getElementById("modal_otp");
  //     modal_login.style.display = "block";
  //   };
  //   remove_otp = () => {
  //     let modal_login = document.getElementById("modal_otp");
  //     modal_login.style.display = "none";
  //   };
  verifyOTP = async () => {
    // LOADER ON
    this.setState({ otpLoading: true });
    let url = `https://cors-anywhere.herokuapp.com/http://aavartan.nitrr.ac.in:8000/user/verify/?otp=${this.state.otp}`;
    let response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Token ${this.props.Userkey}`
      }
    });

    return response.json();
  };
  optValidate = event => {
    event.preventDefault();
    if (this.state.otp.length == 6) {
      this.setState({ otpError: "" });

      this.verifyOTP().then(dataFromOTPValidation => {
        // OTP loader off
        this.setState({ otpLoading: false });
        // dataFromOTPValidation  | steps according to data received
        if (dataFromOTPValidation.detail == "Invalid token.") {
          this.setState({ otpError: "OTP entered did not match" });
        } else if (dataFromOTPValidation.message == "OTP verification failed") {
          this.setState({
            otpError: "OTP verification failed,Check your internet connection"
          });
        } else {
          this.setState({ otpError: "OTP was Valid" });
          setTimeout(() => {
            this.props.closeFunction();
          }, 1500);
        }
      });
    } else {
      this.setState({ otpError: "Please Enter a valid OTP" });
    }
  };

  render() {
    return (
      <div className="columns is-mobile is-vcentered">
        <div className="has-text-centered">
          <div
            className="modal is-vcentered"
            id="modal_otp"
            style={{ display: "block" }}
          >
            <div className="modal-background"></div>

            <div className="modal-card is-vcentered">
              <header className="modal-card-head">
                <p className="modal-card-title">
                  <button
                    className="delete"
                    aria-label="close"
                    onClick={this.props.closeFunction}
                  ></button>
                </p>
              </header>
              <section className="modal-card-body">
                <form
                  method="post"
                  action=""
                  className="registeration-form"
                  onSubmit={this.optValidate}
                >
                  <div class="field">
                    <div class="control">
                      <input
                        className="input is-vcentered "
                        type="text"
                        placeholder="Enter otp here"
                        value={this.state.otp}
                        name="otp"
                        onChange={this.handleChange}
                      />
                      <div className="error_class">
                        {this.state.otpError}
                      </div>
                    </div>
                  </div>

                  <button className="submit" type="submit">
                    Submit
                    {this.state.otpLoading ? (
                      <div class="button is-loading">Loading</div>
                    ) : (
                      ""
                    )}
                  </button>
                </form>
              </section>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default OTPmodal;
