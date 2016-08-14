import React from 'react'
import ReactDOM from "react-dom";
import { createStore,bindActionCreators } from 'redux';
import { Provider,connect } from 'react-redux';
import CommentList from './parts/CommentList.jsx'
require("babel-polyfill");




/* Actionsの実装 */

// Action名の定義
const SEND = 'SEND';
const DEL = 'DEL';
// Action Creators
function send(value) {
  // Action
  return {
    type: SEND,
    value,
    te:true
  };
}

function del(value) {
  // Action
  return {
    type: DEL,
    value,
    te: false,
  };
}

/* Reducersの実装 */

function formReducer(state, action) {

  const { value, te } = state;
      
  switch (action.type) {
    case 'SEND':
      return Object.assign({}, state, {
        value: action.value,
        te: action.te,
      });
    case 'DEL':
      return Object.assign({}, state, {
        te: action.te,
      });

    default:
      return state;
  }
}


function formn(state, action) {

  const { value, te } = state;
      
  switch (action.type) {
    case 'SEND':
      return Object.assign({}, state, {
        value: action.value,
      });
    default:
      return state;
  }
}

/* Storeの実装 */

const initialState = {
  value: null,
  te: true
};
const store = createStore(formReducer, initialState);

//store.dispatch(send("hhh"));



/* Viwの実装 */

// Veiw (Container Components)
class FormApp extends React.Component {
  render() {
    return (
      <div>
        <FormInput handleClick={this.props.onClick} del={this.props.onval} />
        <FormDisplay data={this.props.value} flag={this.props.te}/>
      </div>
    );
  }
}
FormApp.propTypes = {
  onClick: React.PropTypes.func.isRequired,
  value: React.PropTypes.string,
};

// Veiw (Presentational Components)
class FormInput extends React.Component {
  send(e) {
    e.preventDefault();
    this.props.handleClick(this.myInput.value.trim());
    this.myInput.value = '';
    return;
  }
  del(e) {
    e.preventDefault();
    this.props.del();

    return;
  }  
  render() {

    return (
      <form>
        <input type="text" ref={(ref) => (this.myInput = ref)} defaultValue="" />
        <button onClick={(event) => this.send(event)}>Send</button>
        <button onClick={(event) => this.del(event)}>del</button>
      </form>
    );
  }
}
FormInput.propTypes = {
  handleClick: React.PropTypes.func.isRequired,
};

// Veiw (Presentational Components)
class FormDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {f: true};
  }

  stay(){
  
    this.setState({f:!this.state.f?true:false});

    console.log(flag)
  }
  render() {
    let btnstyle = {
      textDecoration: this.state.f?"none":"line-through"
    };

    return (
      <div onClick={this.stay.bind(this)} style={btnstyle}>{this.props.data}</div>
    );
  }
}
FormDisplay.propTypes = {
  data: React.PropTypes.string,
};

// Connect to Redux
function mapStateToProps(state) {
 
  return {
    value: state.value,
    te:state.te,
    b:66
  };
}
function mapDispatchToProps(dispatch) {
  return {
    onClick:(value) => dispatch(send(value)),
    onval:(value) => dispatch(del(value)),
  };
}
const AppContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(FormApp);



// Rendering
ReactDOM.render(
  <Provider store={store}>
    <AppContainer />
  </Provider>,
  document.getElementById('container')
);