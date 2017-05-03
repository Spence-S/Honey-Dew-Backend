import React,{ Component } from 'react';
import axios from 'axios';
import EditableTodo from './EditableTodo';

const headers = { 'x-auth': window.localStorage.getItem('x-auth') };

class TodoListItem extends Component{
  constructor(props){
    super(props);
    this.state={editable: false};
  }

  handleClick = () => {
    axios.delete(`/api/${this.props.id}`, { headers })
      .then( (payload) => {
        this.props.callBack();
      })
      .catch( (e) => {
        console.log('there was an error', e)
      });
  }

  handleEditClick = () => {
    this.setState({editable:!this.state.editable});
  }

  render(){
      return(
        <div>
        {this.state.editable ?
          <EditableTodo
            text={this.props.item}
            todoListItemView={this.handleEditClick}
            id={this.props.id}
            refreshState={this.props.callBack}/>
          :
            <li className='list-group-item'>
              {this.props.item}
            <button className='btn btn-success btn-xs pull-right'
                    style={{marginLeft: 10}}>
                    <span className="glyphicon glyphicon-ok" aria-hidden="true">
                    </span></button>
            <button className='btn btn-danger btn-xs pull-right'
                    onClick={this.handleClick}
                    style={{marginLeft: 10}}>
                    <span className="glyphicon glyphicon-remove" aria-hidden="true">
                    </span></button>
            <button className='btn btn-link btn-xs pull-right'
                    onClick={this.handleEditClick}>Edit</button>
            </li>}
          </div>
      );
  }
}

export default TodoListItem;
