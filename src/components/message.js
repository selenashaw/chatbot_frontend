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
            buttonClicked(button, this.props.prompt);
          }}} key={button}>
          {button}
        </div>
      )
      
    }
    return result;
  }

  render() {
    return (
      // Color/alignment should be based on if bot and if person
      <div className={`message-container ${this.props.bot ? "message-bot" : "message-person"}`}>
        {this.props.image ? 
          <img src={this.props.message} className='image' alt="error message"/>
        :
          <>
            <div className='message'>
              {this.props.message}
            </div>
            {this.props.button ? 
              <div className='button-container'>
                {this.setButtons(this.props.button, this.props.buttonClicked)}
              </div>
              : null
            }
          </>
        }
      </div>
    )
  }
}

export default message