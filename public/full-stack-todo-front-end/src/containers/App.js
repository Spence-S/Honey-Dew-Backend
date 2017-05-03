import React, { Component } from 'react';
import axios from 'axios';


import TodoForm from './TodoForm';
import TodoListItem from './TodoListItem';
import EditableTodo from './EditableTodo';

const headers = { 'x-auth': window.localStorage.getItem('x-auth') };

class App extends Component {
  constructor(props){
    super(props);
    this.state = {todos: []};
  }

componentWillMount(){


    axios.get(`/api`, { headers })
      .then(
        todos => {
          this.setState({todos: todos.data.todos});
        }
      ).catch(
        err => {
          console.log('there was an error', err);
        }
      );
  }

  refreshState = () => {
    axios.get(`/api`, { headers })
      .then(
        todos => {
          this.setState({todos: todos.data.todos});
        }
      ).catch(
        err => {
          console.log('there was an error', err);
        }
      );
  }



  render() {
    return (
      <div>
        <TodoForm callBack={this.refreshState}/>
        <ul className='list-group'>
        {this.state.todos.map( todo => {
          return(
              <TodoListItem
                key={todo._id}
                item={todo.text}
                id={todo._id}
                callBack={this.refreshState}
              />
            )
          }
        )
      }
      </ul>
      </div>
    )
  }
}

export default App;
