import React, { Component } from 'react';
import axios from 'axios';

const headers = { 'x-auth': window.localStorage.getItem('x-auth') };

class TodoForm extends Component{
  constructor(props){
    super(props);
    this.state = {formVal: ''};
  }

  handleChange = (e) => {
    this.setState({formVal: e.target.value})
  }

  handleSubmit = (e) => {
    e.preventDefault();
    axios.post(`/api`, {text: this.state.formVal}, { headers })
      .then(payload => {
        this.setState({formVal : ''})
        this.props.callBack();
      })
      .catch( e => {
        console.log(e);
      });
  }

  render() {
    return(
    <form onSubmit={this.handleSubmit}>
    <div className='form-group'>
      <label className='control-label'><h1>Add a todo:</h1></label>
      <div className='input-group'>
        <input  type='text'
                className='form-control'
                value={this.state.formVal}
                onChange={this.handleChange} />
        <span className='input-group-btn'>
          <button type='submit' className='btn btn-primary'>Add Me!!</button>
        </span>
        </div>
      </div>
    </form>
    )
  }
}

export default TodoForm;
