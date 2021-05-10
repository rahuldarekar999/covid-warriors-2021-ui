import { Link } from 'react-router-dom';
import ListErrors from './ListErrors';
import React from 'react';
import agent from '../agent';
import { connect } from 'react-redux';
import {
  UPDATE_FIELD_AUTH,
  LOGIN,
  LOGIN_PAGE_UNLOADED
} from '../constants/actionTypes';

const mapStateToProps = state => ({ ...state.auth });

const mapDispatchToProps = dispatch => ({
  onChangeEmail: value =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: 'email', value }),
  onChangePassword: value =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: 'password', value }),
  onSubmit: (email, password) =>
    dispatch({ type: LOGIN, payload: agent.Auth.login(email, password) }),
  onUnload: () =>
    dispatch({ type: LOGIN_PAGE_UNLOADED })
});

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      body: ''
    }
    this.changeEmail = ev => this.props.onChangeEmail(ev.target.value);
    this.changePassword = ev => this.props.onChangePassword(ev.target.value);
    this.submitForm = (email, password) => ev => {
      ev.preventDefault();
      this.props.onSubmit(email, password);
    };
  }

  componentWillMount(){
    var that= this;
    Promise.resolve(agent.Auth.gethtml()).then(function (value) {
      console.log("I am value : ", value)
      if (value === null) {
console.log("I am value : ", value)
that.setState({body: value.body});
        // props.showLoading();
        // props.onClickTag(
        //   selTag,
        //   city,
        //   (page) => agent.Articles.byTag(selTag, city.value, page),
        //   agent.Articles.byTag(selTag, city.value)
        // );

        // localStorage.setItem('userMobile', fromMobile);
        // setCity("");
        // setSelTag("BED");
        // setMessage("");
        // setFromMobile("");
        // setToMobile("");
        // setShow(false);
        // setIsSending(false);
        // alert("Request successfully submitted for " + toMob.length + " Numbers");
      }
    }, function (e) {
      // setIsSending(false);
      console.error("Exception occured: ", e); // TypeError: Throwing
      alert("There was an error while sending message, we are sorry for the inconvenience please try after some time.")
    });

  }

  componentWillUnmount() {
    this.props.onUnload();



  }
  createMarkup() {
    return {
       __html: this.state.body    };
 };

  render() {
    const email = this.props.email;
    const password = this.props.password;
    return (
      <div className="auth-page">
{/* <div dangerouslySetInnerHTML={this.createMarkup()}></div> */}
<a href="https://twitter.com/intent/tweet?screen_name=search&ref_src=twsrc%5Etfw" class="twitter-mention-button" data-show-count="false">Tweet to @search</a><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
{/* <iframe src={'https://api.proxycrawl.com/?token=l_Uy3iQMarvqv4nhx9GfCQ&url=https%3A%2F%2Ftwitter.com%2Fsearch%3Fq%3Dverified%20Mumbai%20(oxygen)%20-%22not%20verified%22%20-%22un%20verified%22%20-%22urgent%22%20-%22unverified%22%20-%22needed%22%20-%22required%22%20-%22need%22%20-%22needs%22%20-%22requirement%22%20-%22Any%20verified%20lead%22%20since%3A2021-5-7%26f%3Dlive&format=json'}> */}

{/* </iframe> */}


        {/* <div className="container page">
          <div className="row">

            <div className="col-md-6 offset-md-3 col-xs-12">
              <h1 className="text-xs-center">Sign In</h1>
              <p className="text-xs-center">
                <Link to="/register">
                  Need an account?
                </Link>
              </p>

              <ListErrors errors={this.props.errors} />

              <form onSubmit={this.submitForm(email, password)}>
                <fieldset>

                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={this.changeEmail} />
                  </fieldset>

                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={this.changePassword} />
                  </fieldset>

                  <button
                    className="btn btn-lg btn-primary pull-xs-right"
                    type="submit"
                    disabled={this.props.inProgress}>
                    Sign in
                  </button>

                </fieldset>
              </form>
            </div>

          </div>
        </div> */}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
