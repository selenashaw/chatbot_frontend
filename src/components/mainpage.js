import React, { Component } from 'react';
import './mainpage.css';
import Message from './message';
import otherResponses from '../otherResponses.json';

export class mainpage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      Cos126: null,
      Cos226: null
    }
    console.log(this.state);
    console.log("constructor");
  }

  getCOS126 = async() => {
    const response = await fetch("https://raw.githubusercontent.com/selenashaw/chatbot_responses/main/COS126.JSON");
    await response.json().then(result => {
      this.setState({Cos126: result});
    });
  }

  getCOS226 = async() => {
    const response = await fetch("https://raw.githubusercontent.com/selenashaw/chatbot_responses/main/COS226.JSON");
    await response.json().then(result => {
      this.setState({Cos226: result});
    });
  }

  componentDidMount() {
    this.getCOS126();
    this.getCOS226();
  }

  render() {
    return (
      <div className='background'>
        <div className='message-box'>
          <div className='message-header'>
            <div className='message-header-content'>
               Lab TA Chatbot
            </div>
          </div>
          <div className='messages'>
            <Message message="Hi I am chatbot!" bot={true} />
            <Message message="Hi chatbot, nice to meet you!" bot={false} />
            <Message message="Nice to meet you too! What can I help you with? Are you in cos126 or cos226?" bot={true} />
            <Message message="I am making long messages because I need to check the overflow of the page to make sure that a scroll bar works good" bot={false} />
            <Message message="That is very cool I will help you write long text so that we can check the overflow of the page" bot={true} />
            <Message message="I am making long messages because I need to check the overflow of the page to make sure that a scroll bar works good" bot={false} />
            <Message message="That is very cool I will help you write long text so that we can check the overflow of the page" bot={true} />
            <Message message="I am making long messages because I need to check the overflow of the page to make sure that a scroll bar works good" bot={false} />
            <Message message={otherResponses.about} bot={true} />
            <Message message="How does it look?" bot={true} />
          </div>
        </div>
      </div>
    )
  }
}

export default mainpage