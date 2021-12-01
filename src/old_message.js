import React, { Component } from 'react';
import './message.css';

export class message extends Component {
  constructor(props) {
    super(props)
    this.state = {
      clicked: false
    }
  }

  setButtons(buttons, buttonClicked) {
    let result = [];
    for (const button of buttons) {
      result.push(
        <div className='button' onClick={()=>{
          if(!this.state.clicked) {
            this.setState({clicked : true});
            buttonClicked(button[0], button[1], this.props.prompt);
          }}} key={button[0]}>
          {button[0]}
        </div>
      )
      
    }
    return result;
  }

  render() {
    return (
      // Color/alignment should be based on if bot and if person
      <div className={`message-container ${this.props.bot ? "message-bot" : "message-person"}`}>
        <div className='message'>
          {this.props.message}
        </div>
        {this.props.button ? 
          <div className='button-container'>
            {this.setButtons(this.props.button, this.props.buttonClicked)}
          </div>
          : null
        }
      </div>
    )
  }
}

export default message