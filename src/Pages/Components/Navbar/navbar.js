/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";

import "./Navbar.css";
import $ from "jquery";
import {Link} from "react-router-dom";
import OTPmodal from "../OTPmodal/OTPmodal";
import ForgotPassword from "../ForgotPassword/forgotPassword";


const initialState = {
  name: "",
  email: "",
  course: "",
  branch: "",
  semester: "",

  password: "",
  city: "",
  contact: "",
  college_name: "",

  confirm_password: "",
  nameError: "",
  emailError: "",
  courseError: "",
  branchError: "",
  semesterError: "",

  passwordError: "",
  cityError: "",
  contactError: "",
  college_nameError: "",

  confirm_passwordError: "", 
};

// const otpstate={
//   otp: "",
//   otpError: ""
// };


class Navbar extends React.Component {
  
  state = initialState;
  state={
    loader_SIGNUP_ON:false,
    loader_LOGIN_ON:false,
    loader_OTP_ON:false,
    showOTPModal:false,
    loggedInPassword:"",
    loggedInMobileNo:"",
    loginError:"",
    loggedInUserDetails:{
      id:"",
      key:undefined,
      name:"",
      events:[]
    }
  }

  closeOTPmodel=()=>{
    this.setState({showOTPModal:false});
  }
  handleChange = event => {
    const isCheckbox = event.target.type === "checkbox";
    this.setState({
      [event.target.name]: isCheckbox
        ? event.target.checked
        : event.target.value
    });
  };

  click_logout=()=>{
    let key = this.state.loggedInUserDetails.key;
    let url ="https://cors-anywhere.herokuapp.com/http://aavartan.nitrr.ac.in:8000/user/rest-auth/logout/";
    fetch(url, {
      method: 'POST', // or 'PUT'
      body: null, // data can be `string` or {object}!
      headers: {
        'Authorization': `Token ${key}`,
      } 
    })
    .then(res => res.json())
    .then(()=>{
      let database={
        loggedIn:false,
        // details of logged in
        currentUser:{
          name:"",
          id:0,
          key:"",
          events:[],
        },
        // key mobileNo value details
        allUsersDetails:{}
      };  

      this.dumpToLS(database).then(()=>{
        

          this.props.logStateChanger(false);
      
        
        this.props.regEventsUpdater([]);  


      })
        
      
    })
    .catch(error => console.error('Error:', error));
  }
  async getUserdetails(key){
    let url ="https://cors-anywhere.herokuapp.com/http://aavartan.nitrr.ac.in:8000/user/get";
    let response = await  fetch(url, {
                            method: 'GET',
                            headers: {
                                'Authorization': `Token ${key}`,
                            }                           
                         });
 
    let data = await response.json()
    return data;
   
  }
  getLoggedInUserEvents = async (key) => {
    let url ="https://cors-anywhere.herokuapp.com/http://aavartan.nitrr.ac.in:8000/user/events";
    let response = await  fetch(url, {
                            method: 'GET',
                            headers: {
                                'Authorization': `Token ${key}`,
                            }                           
                         });
 
    let data = await response.json()
    return data.events;
   
  };
  getFromLS = async () => {
    let database = await window.localStorage.getItem("browserDataAavartan");
    if (database == "undefined"){
      return undefined;
    }else{     
      return(JSON.parse(database))
    }
   
  };
  dumpToLS = async (database) => {        
    await window.localStorage.setItem('browserDataAavartan', JSON.stringify(database));
  }

  loginREQ = async (loginData)=>{
    let url = 'https://cors-anywhere.herokuapp.com/http://aavartan.nitrr.ac.in:8000/user/rest-auth/login/';     
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(loginData),
      headers:{
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(response => {
      // LOADER OFF
      this.setState({
        loginError:"",
        loader_LOGIN_ON:false,
      });

      // CHECKING CREDENTIALS
      if(response.key===undefined){
        this.setState({loginError:"Unable to log in with provided credentials."})
        
      }else{
        // LOG IN WAS SUCCESSFUL  GET DETAILS  THEN ==>  SAVE IN LS And STATE|  UPDATE LAYOUT OF NAV
        // closes login modal 
        this.remove_login();
        // SAVE IN LS
// ********************************************  
        // FIND OUT DETAILS OF USER AND HIS/HER EVENTS
        this.getLoggedInUserEvents(response.key).then((registeredEvents)=>{
          this.getUserdetails(response.key).then(data=>{
            // GOT DETAILS 
            // PUT IN STATE OF NAVBAR I.E THIS FILE
            this.setState({
              loggedInUserDetails:{
                id:data.id,
                key:response.key,
                name:data.name,
                events:registeredEvents
              }
            })
            
            //CHANGE IN STATE OF EVENTS.JS
            
              this.props.logStateChanger(true);
           
            this.props.regEventsUpdater(registeredEvents); 
    

            // PUT IN LS
            let database = this.getFromLS();
            if(database===undefined){
              database={
                loggedIn:true,
                // details of logged in
                currentUser:{
                  name:data.name,
                  id:data.id,
                  key:response.key,
                  events:registeredEvents,
                },
                // key mobileNo value details
                allUsersDetails:{}
              };
            }else{
              database.loggedIn = true;
              database.currentUser = {
                name:data.name,
                id:data.id,
                key:response.key,
                events:registeredEvents,
              };
            }
            this.dumpToLS(database);
          })
        })        
// ********************************************
        // UPDATE LAYOUT OF NAV
        // this.getUserdetails(response.key).then(data=>{
        //   console.log(data,"from NAV");
        // })
      }
    })
    // ERROR OTHER THAN WRONG PASSWORD
    .catch(error => {
      console.error('Error:REg', error)
      this.setState({
        loginError:"Server Error",
        loader_LOGIN_ON:false,
      });
    });

  }
  // LOGIN FROM LOGIN BUTTON
  submit_LOGIN = event =>{
    event.preventDefault();
    this.setState({
      loginError:"",
      loader_LOGIN_ON:true,
    });
    let  dataLogin = {username:this.state.loggedInMobileNo,password:this.state.loggedInPassword};   
    // SENDING REQUEST TO GET LOGGED IN
    this.loginREQ(dataLogin)    
  }


  validate = () => {
   
    let nameError = "";
    let emailError = "";
    let courseError = "";
    let branchError = "";
    let semesterError = "";

    let passwordError = "";
    let confirm_passwordError = "";
    let cityError = "";
    let contactError= "";
    let college_nameError = "";


    if (!this.state.name) {
      nameError = "Name cannot be blank";
    }
    if (!this.state.city) {
      cityError = "City name cannot be blank";
    }
    if (!this.state.contact) {
      contactError = "Contact cannot be blank";
    }
    else if (this.state.contact.length<10) {
      contactError = "Enter valid contact no.";
    }
    if (!this.state.course) {
      courseError = "Select the course";
    }
    if (!this.state.branch) {
      branchError = "Select the branch";
    }
    if (!this.state.semester) {
      semesterError = "Select the semester";
    }

    if (!this.state.college_name) {
      college_nameError = "College Name cannot be blank";
    }

    if (!this.state.password) {
      passwordError = "Password cannot be blank";
    }
    if (this.state.password !== this.state.confirm_password) {
      confirm_passwordError = "Password does not match";
    }
    let pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
    if (!pattern.test(this.state.email)) {
      emailError = "Invalid email";
    }

    if (emailError || nameError || passwordError || confirm_passwordError || cityError || college_nameError || contactError || courseError || branchError ||semesterError ) {
      this.setState({ emailError, nameError, passwordError ,confirm_passwordError ,cityError ,college_nameError,contactError ,courseError ,branchError ,semesterError });
      return false;
    }

    return true;
  };
 
  handleSubmit = event => {
    event.preventDefault();    
    const isValid = this.validate();
    if (isValid) {
      // loader on
      this.setState({loader_SIGNUP_ON:true});
      let data = {password: this.state.password,name: this.state.name ,email: this.state.email ,contact: parseInt(this.state.contact) ,college: this.state.college_name ,branch: this.state.branch ,course: this.state.course ,sem : (this.state.semester) ,city :this.state.city };
      var url = 'https://cors-anywhere.herokuapp.com/http://aavartan.nitrr.ac.in:8000/user/';
      fetch(url, {
        method: 'POST', // or 'PUT'
        body: JSON.stringify(data), // data can be `string` or {object}!
        headers:{
          'Content-Type': 'application/json'
        }
      })
      .then(res => res.json())
      .then(response => {
        if(Array.isArray(response.contact)){
          // loader off        
          this.setState({loader_SIGNUP_ON:false},()=>{
            alert("This phone number is already registered. Login to register for events.")
          });
          
        }else if(Array.isArray(response.email)){
          // loader off        
          this.setState({loader_SIGNUP_ON:false},()=>{
            alert("This email is already registered. Login to register for events.")
          });
          
        }else{
          // SUCCESSFUL REGISTRATION
           // closes reg modal        
           this.remove();
           // loader off        
           this.setState({loader_SIGNUP_ON:false});

           // GET USER LOGGED IN 
           let  dataLogin = {username:this.state.contact,password:this.state.password};
           this.loginREQ(dataLogin);

           //SHOW OTP DIALOG
           this.setState({showOTPModal:true})

           // VERY IMP AFTER LOG IN FROM SIGNUP WE'LL SET SATTE OF SIGNUP TO NULL
           this.setState(initialState);

        }
      })
      .catch(error => {
        console.error('Error:REg', error)
        this.setState({
          loginError:"Server Error",
          loader_SIGNUP_ON:false,
        });
      }); 
      
    }};

  showRegisterModal = () => {
    let modal=document.getElementById("modal");
    modal.style.display = "block";
  };
   remove = () => {
    let modal=document.getElementById("modal");
    modal.style.display = "none";
  };
  //on login click modal form show
   click_login = () => {
    let modal_login=document.getElementById("modal_login");
    modal_login.style.display = "block";
  };
   remove_login = () => {
    let modal_login=document.getElementById("modal_login");
    modal_login.style.display = "none";
  };
  //on login click modal form show
   click_contact = () => {
    let modal_login=document.getElementById("modal_contact");
    modal_login.style.display = "block";
  };
   remove_contact = () => {
    let modal_login=document.getElementById("modal_contact");
    modal_login.style.display = "none";
  };
  //on otp click modal form show

  click_forgot_pass = () => {
    let modal_login=document.getElementById("modal_forgot_pass");
    modal_login.style.display = "block";
  };
   remove_forgot_pass = () => {
    let modal_login=document.getElementById("modal_forgot_pass");
    modal_login.style.display = "none";
  };
   pass = () => {
    var pass1 =document.getElementById("password");
    var pass2 =document.getElementById("confirm_password");
    if (pass1.value==pass2.value){
      return true;
    }
    else{
      return false;
    }
  }

  componentDidMount() {

    $(document).ready(function() {

      // Check for click events on the navbar burger icon
      $(".navbar-burger").click(function() {
    
          // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
          $(".navbar-burger").toggleClass("is-active");
          $(".navbar-menu").toggleClass("is-active");
    
      });

    $(".navbar-menu").click(function() {

      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      $(".navbar-burger").toggleClass("is-active");
      $(".navbar-menu").toggleClass("is-active");

  });
});
};
  render() {

    if(this.state.loggedInUserDetails.key==undefined && this.props.logState){ 
      this.getFromLS().then((database)=>{
        this.setState({
          loggedInUserDetails:{
            id:database.currentUser.id,
            key:database.currentUser.key,
            name:database.currentUser.name,
            events:database.currentUser.events
          }
        })
      })
      
    }
            //on register click modal form show

    return (
      <div className="Navbar is-transparent">
        
        <nav className="navbar" role="navigation" aria-label="main navigation">
          <div className="navbar-brand">
            <Link className="navbar-item" to="/">
         
              <img src="/images/23.png" alt="navfdsfd" />
            </Link>

            <a
              role="button"
              className="navbar-burger burger"
              aria-label="menu"
              aria-expanded="false"
              data-target="navbarBasicExample"
            >
              <span aria-hidden="true" />
              <span aria-hidden="true" />
              <span aria-hidden="true" />
            </a>
          </div>

          <div id="navbarBasicExample" className="navbar-menu">
            <div className="navbar-end borderXwidth">
            <a
                className="navbar-item nav-item-tabs is-active is-size-4 is-size-4-mobile"
                href="/"
              >
                Home
              </a>
              <a
                className="navbar-item nav-item-tabs is-size-4 is-size-4-mobile"
                href="http://technocracy.nitrr.ac.in/vigyaan/" target="_blank" rel="noopener noreferrer" 
              >
                Vigyaan
              </a>
              <Link
                className="navbar-item nav-item-tabs is-size-4 is-size-4-mobile"
                to="/events/"
              >
                Events
              </Link>
              <Link
                className="navbar-item nav-item-tabs is-size-4 is-size-4-mobile"
                to="/gallery/"
              >
                Gallery
              </Link>
              <Link
                className="navbar-item nav-item-tabs is-size-4 is-size-4-mobile"
                to="/spons/"
              >
                Spons
              </Link>
              <Link
                className="navbar-item nav-item-tabs is-size-4 is-size-4-mobile"
                to="/team/"
              >
                Team
              </Link>
              {/* <Link
                className="navbar-item nav-item-tabs is-size-4 is-size-4-mobile"
                to="/webteam/"
              >
                Web Team
              </Link> */}
              <div className="navbar-item">
                <div className="buttons is-centered">
                  <a className="button is-primary is-pulled-left" onClick={this.click_contact}>Contact</a>
                  {this.props.logState?
                  <div>
                      <a className="button is-primary is-pulled-left" onClick={this.click_logout}>Log Out</a>
                      <a className="button is-primary is-pulled-left" >{this.state.loggedInUserDetails.name}</a>
                  </div>
                  :
                    <div>
                        <a className="button is-primary is-pulled-left" onClick={this.showRegisterModal}>
                            <strong>Register</strong>
                        </a>
                        <a className="button is-primary is-pulled-left" onClick={this.click_login}>Log in</a>
                    </div>
                  }
                  
                  
                  
                </div>
              </div>
            </div>
          </div>
        </nav>


        <div className="columns is-mobile is-centered">
       <div className="has-text-centered">
      
      <div className="modal" id="modal">
          <div className="modal-background"></div>
      
            <div className="modal-card">
              <header className="modal-card-head">
              <p className="modal-card-title"><button className="delete" aria-label="close" onClick={this.remove}></button></p>
              
              </header>
              <section className="modal-card-body">
              <h1 className="headerfont">Register Here</h1>
                <br/>
                <br/>
              <form method="post" action="" className="registeration-form"  onSubmit={this.handleSubmit}>
                 <div className="field">
                <div className="control">
                  <input className="input is-vcentered " id="name" name="name" type="text" placeholder="Name" value={this.state.name}
            onChange={this.handleChange}
          />
          <div className="error_class">
            {this.state.nameError}
          </div>
                </div>
              </div>
              
              <div className="field">
                <div className="control">
                  <input className="input" type="text" id="college_name" name="college_name" placeholder="College Name"  value={this.state.college_name}
            onChange={this.handleChange}
          />
          <div className="error_class">
            {this.state.college_nameError}
          </div>
                </div>
              </div>
              <div className="field">
                <div className="control">
                  <input className="input" type="text" id="city" name="city" placeholder="City"  value={this.state.city}
            onChange={this.handleChange}
          />
          <div className="error_class">
            {this.state.cityError}
          </div>
                </div>
              </div>
                
                <div className="select">
                <select id="course" name="course" value={this.state.course}
            onChange={this.handleChange}>
                <option className="main_option" value="Course">Course</option>
                    <option value="B.Tech">B.Tech</option>
                    <option value="B.Arch">B.Arch</option>
                    <option value="M.Tech">M.Tech</option>
                    <option value="M.C.A">M.C.A</option>
                    <option value="PhD">PhD</option>
                    
                </select>
                <div className="error_class">
            {this.state.courseError}
          </div>
                </div>
                <br/>
                <br/>
                <br/>
                <div className="select">
                <select id="branch" name="branch" value={this.state.branch}
            onChange={this.handleChange}>
                <option className="main_option" value="Branch">Branch</option>
                    <option value="Bio Medical">Bio Medical</option>
                    <option value="Bio Technology">Bio Technology</option>
                    <option value="Chemical">Chemical</option>
                    <option value="Civil">Civil</option>
                    <option value="Computer Science">CSE</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Electronics & Telecommunication">ETC</option>
                    <option value="Information Technology">IT</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Metallurgy">Metallurgy</option>
                    <option value="Mining">Mining</option>
                    
                </select>
                <div className="error_class">
            {this.state.branchError}
          </div>
                </div>
                <br/>
                <br/>
                <br/>
                <div className="select">
                <select id="semester" name="semester" value={this.state.semester}
            onChange={this.handleChange}>>
                <option className="main_option" name="semester" value="Semester">Semester</option>
                    <option value="1">I</option>
                    <option value="2">II</option>
                    <option value="3">III</option>
                    <option value="4">IV</option>
                    <option value="5">V</option>
                    <option value="6">VI</option>
                    <option value="7">VII</option>
                    <option value="8">VIII</option>
                    <option value="9">IX</option>
                    <option value="10">X</option>
                </select>
                <div className="error_class">
            {this.state.semesterError}
          </div>
                </div>
                <br/>
                <br/>
                <br/>                
                <div className="field">
                <div className="control">
                  <input className="input" type="number" id="contact" name="contact" placeholder="Contact No." value={this.state.contact}
            onChange={this.handleChange}
          />
          <div className="error_class">
            {this.state.contactError}
          </div>
                </div>
              </div>
              <div className="field">
                <div className="control">
                  <input className="input" type="email" id="email" name="email" placeholder="Email" value={this.state.email}
            onChange={this.handleChange}
          />
          <div className="error_class">
            {this.state.emailError}
          </div>
                </div>
              </div>
              <div className="field">
                <div className="control">
                  <input className="input" type="password" id="password" name="password" placeholder="Password" value={this.state.password}
            onChange={this.handleChange}
          />
          <div className="error_class">
            {this.state.passwordError}
          </div>
                </div>
              </div>
              <div className="field">
                <div className="control">
                  <input className="input" type="password"id="confirm_password" name="confirm_password" placeholder="Confirm Password" value={this.state.confirm_password}
            onChange={this.handleChange}
          />
          <div className="error_class">
            {this.state.confirm_passwordError}
          </div>
                </div>
              </div>

               <button className="submit" type="submit">Submit
                  {this.state.loader_SIGNUP_ON?<div className="button is-loading">Loading</div>:""}
               </button>

                
               </form>
              </section>
        
            </div>
      
      </div>
      </div>
      </div>
      <div className="columns is-mobile is-vcentered">
       <div className="has-text-centered">
      
      <div className="modal is-vcentered" id="modal_login">
          <div className="modal-background"></div>
      
            <div className="modal-card is-vcentered">
              <header className="modal-card-head">
              <p className="modal-card-title">
              <button className="delete" aria-label="close" onClick={this.remove_login}></button>
              </p>
              
              </header>
              <section className="modal-card-body">
              <h1 className="headerfont">Login Here</h1>
              <form method="post" action="" className="registeration-form"   onSubmit={this.submit_LOGIN}>
                 <div className="field">
                <div className="control">
                  <input className="input is-vcentered " type="text" placeholder="Mobile No." required name="loggedInMobileNo" onChange={this.handleChange} value={this.state.loggedInMobileNo}/>
                </div>
              </div>
              
              <div className="field">
                <div className="control">
                  <input className="input" type="password" placeholder="Password" required name="loggedInPassword" onChange={this.handleChange} value={this.state.loggedInPassword}/>
                </div>
              </div>
              <div className="field">
                <h3 className="error_class">{this.state.loginError}</h3>
              </div>
              
              <button className="submit" type="submit">Submit
                  {this.state.loader_LOGIN_ON?<div className="button is-loading">Loading</div>:""}
               </button>
              <a style={{marginTop:'5%',color:'white'}} href="#" onClick={()=>{this.remove_login();this.click_forgot_pass();}}>Forgot Password</a>
                 
               </form>
              </section>
        
            </div>
      
      </div>
      </div>
      </div>

   
            <ForgotPassword remove_forgot_pass={this.remove_forgot_pass}/>
        






      {this.state.showOTPModal ? (
          <OTPmodal
            closeFunction={this.closeOTPmodel}
            Userkey={this.state.loggedInUserDetails.key}
          />
        ) : (
          ""
        )}
<div className="columns is-mobile is-vcentered">
  <div className="has-text-centered">
    <div className="modal is-vcentered" id="modal_contact">
      <div className="modal-background"></div>

      <div className="modal-card is-vcentered">
        <header className="modal-card-head">
          <p className="modal-card-title">
            <button
              className="delete"
              aria-label="close"
              onClick={this.remove_contact}
            ></button>
          </p>
        </header>
        <section className="modal-card-body">
          <h2 style={{ color: "white" }}>Aavartan</h2>
          <p style={{ color: "white" }}>
            Be a part of the awesome tech fest of NIT Raipur
            <br />
            <br />
            Feel free to contact here
          </p>
          <br />

          <h2 style={{ color: "white" }}>--- Contact ---</h2>
          <br />

          <p style={{ color: "white" }}>Aditya Swarnkar</p>
          <p style={{ color: "white" }}>aditya.01swarnkar@gmail.com</p>
          <p style={{ color: "white" }}>+91 73890 97623</p>
          <br />
          <p style={{ color: "white" }}>Ayush Mishra</p>
          <p style={{ color: "white" }}>ayumishra26@gmail.com</p>
          <p style={{ color: "white" }}>+91 72238 88440</p>
          <br />
          <h2 style={{ color: "white" }}>Address</h2>
          <p style={{ color: "white" }}>
            National Institute of Technology Raipur, G.E. Road, Raipur,
            Chhatisgarh
          </p>
          <br />
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3718.5490831480774!2d81.60284041501637!3d21.249722185879104!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a28dde213f66723%3A0x21543965c50c43c7!2sNational+Institute+of+Technology%2C+Raipur!5e0!3m2!1sen!2sin!4v1562933883639!5m2!1sen!2sin"
            
            style={{
              border: "5px solid white",
              height: "auto",
              width: "100%",
              marginTop: "5%"
            }}
            
          ></iframe>
          {/* <p style={{color:'white'}}><i ></i></p><h4 style={{color:'white',display:'inline',fontSize:'13px'}}><i className="fa fa-envelope" style={{marginRight:'5%'}}></i>aditya.01swarnkar@gmail.com</h4><br/>
                                        <p style={{color:'white'}}><i style={{fontSize:'25px'}}></i></p><h4  style={{color:'white',display:'inline',fontSize:'13px'}}><i className="fa fa-phone" style={{marginRight:'5%'}}></i>+91 73890 97623</h4></div>
                                        <p style={{color:'white'}}><i className="fa fa-address-card" style={{fontSize:'25px'}}></i></p><div style={{textAlign:'left',marginTop:'-10%',marginLeft:'15%',paddingBottom:'4%'}}><h4 style={{color:'white',display:'inline',fontSize:'13px'}}><i className="fa fa-user-o" style={{marginRight:'5%'}}></i>Ayush Mishra</h4><br/>
                                        <p style={{color:'white'}}><i ></i></p><h4 style={{color:'white',display:'inline',fontSize:'13px'}}><i className="fa fa-envelope" style={{marginRight:'5%'}}></i>ayumishra26@gmail.com</h4><br/>
                                        <p style={{color:'white'}}><i style={{fontSize:'25px'}}></i></p><h4  style={{color:'white',display:'inline',fontSize:'13px'}}><i className="fa fa-phone" style={{marginRight:'5%'}}></i>+91 72238 88440</h4></div> */}
        </section>
      </div>
    </div>
  </div>
</div>;

      </div>
    );
  }
}

export default Navbar;
