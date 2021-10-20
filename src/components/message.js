import React, { Component } from 'react';
import './message.css';

export class message extends Component {

  render() {
    return (
      // Color/alignment should be based on if bot and if person
      <div className={`message-container ${this.props.bot ? "message-bot" : "message-person"}`}>
        <div className='message'>
          {this.props.message}
        </div>
      </div>
    )
  }
}

export default message