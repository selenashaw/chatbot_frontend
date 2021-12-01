import React, { Component } from 'react';
import './mainpage.css';
import Message from './message';
import responses from '../responses.json';
import axios from 'axios';

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

export class mainpage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      text_allow: false,
      try_again: false,
      Errors: null,
      messages:[],
      loop_index: 0,
      queries:[],
      missing: [],
      err_msg: "",
      category:""
    }

    this.buttonClicked = this.buttonClicked.bind(this);
  }

  getErrors = async() => {
    const response = await fetch("https://raw.githubusercontent.com/selenashaw/chatbot_responses/main/Errors.JSON");
    await response.json().then(result => {
      this.setState({Errors: result});
    });
  };

  updateMessages(message) {
    let temp = this.state.messages;
    let newmessages=[...temp, message];
    this.setState({messages: newmessages});
  }

  sendToDB() {
      let body={queries:this.state.queries};
      axios.post('https://labtabackendcb.herokuapp.com/log/', body)
      .then((response) => {
        let logid = response.data._id;
        console.log(this.state.missing);
        console.log(this.state.missing!==[]);
        if(this.state.missing!==[]) {
          for(const str of this.state.missing){
            let mbody={err_msg:str, logId:logid};
            axios.post('https://labtabackendcb.herokuapp.com/missing/', mbody)
            .then((res)=>{
              console.log(res);
            });
          }
        }
      });
    
  }

  formatString(input) {
    let splitted = input.split(":");
    let runsplit = splitted[0].split(" ");
    if (runsplit[0] === "Exception") {
      let formatted = runsplit[4];
      return {"category": formatted, "type": "runtime"};
    }
    else {
      let formatted = splitted[splitted.length - 1].trim();
      return {"category": formatted, "type": "compilation"};
    }
  }

  // https://stackoverflow.com/questions/47809282/submit-a-form-when-enter-is-pressed-in-a-textarea-in-react
  // source for getting enter key pressed
  onEnterPress = async(e) => {
    if(this.state.text_allow) {
      if(e.keyCode === 13 && e.shiftKey === false) {
        e.preventDefault();
        let text = e.target.value;
        this.setState({err_msg: text});
        let text_key = "text_"+this.state.loop_index;
        let message = <Message message={text} bot={false} key={text_key} />
        this.updateMessages(message);
        let vals = this.formatString(text);
        let str = vals.category;
        e.target.value = "";
        this.setState({text_allow:false});
        await delay(1000);


        let help = this.state.Errors.general.filter(item => item.category === str);
        // if it is not in the responses
        if (help.length === 0) {
          //check if it is a specific error
          let checkingparsed = this.state.Errors.parsed.filter(item => str.includes(item.key))
          if (checkingparsed.length !==0) {
            this.setState({try_again:false});
            this.setState({category: checkingparsed[0].category});
            let text_bot_key = "bot_res"+this.state.loop_index;
            message = <Message message={responses.err_parse_res1} bot={true} key={text_bot_key} />
            this.updateMessages(message);
            await delay(1000);

            text_bot_key = "bot_category"+this.state.loop_index;
            message = <Message message={checkingparsed[0].category} bot={true} key={text_bot_key} />
            this.updateMessages(message);
            await delay(2000);

            text_bot_key="bot_res2"+this.state.loop_index;
            message=<Message message={responses.err_parse_res2} bot={true} key={text_bot_key}/>
            this.updateMessages(message);
            await delay(1000);

            text_bot_key = "bot_ans"+this.state.loop_index;
            message = <Message message={checkingparsed[0].response} bot={true} key={text_bot_key} />
            this.updateMessages(message);
            await delay(5000);

            text_bot_key = "helpful_q"+this.state.loop_index;
            message = <Message message={responses.examine_res} bot={true} key={text_bot_key} prompt="helpful" button={responses.buttons.yes_no} buttonClicked={this.buttonClicked}/>
            this.updateMessages(message);
          }
          // if they havent tried already
          else if (!this.state.try_again && checkingparsed.length ===0) {
            this.setState({try_again: true});
            let text_bot_key_bad = "bot_res"+this.state.loop_index;
            message = <Message message={responses.err_res_bad_temp} bot={true} key={text_bot_key_bad} buttons={responses.try_format} prompt={"try_or_format"}/>
            this.updateMessages(message);
            this.setState({text_allow:true});
          }
          else {
            let missingarr=this.state.missing;
            missingarr.push(text);
            this.setState({try_again:false});
            let text_bot_key = "dont_have"+this.state.loop_index;
            message = <Message message={responses.dont_have} bot={true} key={text_bot_key} prompt="another" button={responses.buttons.yes_no} buttonClicked={this.buttonClicked}/>
            this.updateMessages(message);
            await delay(1000);

          }
        }
        // if it is in the responses
        else {
          this.setState({try_again:false});
          this.setState({category:help[0].category});
          let text_bot_key = "bot_res"+this.state.loop_index;
          message = <Message message={responses.err_res} bot={true} key={text_bot_key} />
          this.updateMessages(message);
          await delay(1000);
          text_bot_key = "bot_ans"+this.state.loop_index;

          message = <Message message={help[0].response} bot={true} key={text_bot_key} />
          this.updateMessages(message);
          await delay(5000);
          text_bot_key = "helpful_q"+this.state.loop_index;
          message = <Message message={responses.examine_res} bot={true} key={text_bot_key} prompt="helpful" button={responses.buttons.yes_no} buttonClicked={this.buttonClicked}/>
          this.updateMessages(message);

        }


        this.setState({loop_index: this.state.loop_index+1});
      }
    }
  }

  // This function handles responses from the user and controls the flow of the chatbot
  buttonClicked = async(button, prompt) => {
    // I do not log if they use the format or not
    if (prompt === "format") {
      let key = "format_response";
      let newmessage = <Message message={button} bot={false} key={key}/>;
      this.updateMessages(newmessage);
      await delay(1000);

      // If they want to review error message format, loop through all of the err_info strings and print them as the bot
      if (button === "Yes") {
        let err_info = responses.err_info;
        for (let i = 0; i<err_info.length - 1; i++) {
          let key = "err_info_"+i;
          let newmessage = <Message message={err_info[i]} bot={true} key={key}/>;
          this.updateMessages(newmessage);
          await delay(3000);
        } 
        let key = "which_err"+this.state.loop_index;
        let newmessage = <Message message={err_info[err_info.length-1]} bot={true} key={key} prompt={key} />;
        this.updateMessages(newmessage);
        this.setState({text_allow:true});
      }

      // If they dont want to review the format, ask them which error message they have received
      else {
        let key = "which_err"+this.state.loop_index;
        let newmessage = <Message message={responses.which_err} bot={true} key={key} prompt={key} />;
        this.updateMessages(newmessage);
        this.setState({text_allow:true});

      }
    }

    else if (prompt === "helpful") {
      let key = "helpful_r"+this.state.loop_index;
      let newmessage = <Message message={button} bot={false} key={key}/>;
      this.updateMessages(newmessage);
      await delay(1000);

      // update log
      let obj = {
        "err_msg":this.state.err_msg,
        "category":this.state.category,
        helpful:button
      };
      this.setState({err_msg:"",category:""});
      let queries = this.state.queries;
      queries.push(obj);
      this.setState({queries: queries});


      key = "helpful_ans"+this.state.loop_index;
      if (button === "Yes") {
        let newmessage = <Message message={responses.helpful_true} bot={true} key={key} prompt="another" button={responses.buttons.yes_no} buttonClicked={this.buttonClicked}/>
        this.updateMessages(newmessage);
      }
      else {
        let newmessage = <Message message={responses.helpful_false} bot={true} key={key} prompt="another" button={responses.buttons.yes_no} buttonClicked={this.buttonClicked}/>
        this.updateMessages(newmessage);
      }
    }

    else if (prompt === "another") {
      let key = "another_r"+this.state.loop_index;
      let newmessage = <Message message={button} bot={false} key={key}/>;
      this.updateMessages(newmessage);
      await delay(1000);

      if (button==="Yes") {
        let key = "which_err"+this.state.loop_index;
        let newmessage = <Message message={responses.which_err} bot={true} key={key} prompt={key} />;
        this.updateMessages(newmessage);
        this.setState({text_allow:true});
      }
      else {
        let newmessage = <Message message={responses.goodbye} bot={true} key="goodbye" />;
        this.updateMessages(newmessage);
        await delay(2000);
        newmessage = <Message message={responses.goodbye2} bot={true} key="goodbye2" />;
        this.updateMessages(newmessage);
        this.sendToDB();
      }
    }


    // Realistically, The code should never reach this part, but just in case
    else {
      let message = "uh oh, I seem to have gotten lost in my code! please take a screenshot of our messages and email it to selenas@princeton.edu";
      let newmessage = <Message message={message} bot={true} key='bad_prompt' prompt="bad_prompt"/>
      this.updateMessages(newmessage);
    }
  };

  componentDidMount() {
    this.getErrors();
    this.setState({messages:[
      <Message message={responses.intro} bot={true} buttonClicked={this.buttonClicked} key="intro" prompt="intro"/>, 
      <Message message={responses.format} bot={true} button={responses.buttons.yes_no} buttonClicked={this.buttonClicked} key="format" prompt="format"/>
    ]});
  };


  componentDidUpdate () {
    this.scrollToBottom();
  };


  // Source: https://stackoverflow.com/questions/37620694/how-to-scroll-to-bottom-in-react
  scrollToBottom = () => {
    this.messagesEndRef.scrollIntoView({behavior: 'smooth'});
  };

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
            {this.state.messages}
            <div ref={messagesEndRef => {this.messagesEndRef = messagesEndRef;}}/>
          </div>
          <div className='textfield'>
            <textarea name='text-input' className='text-box' placeholder="When prompted, paste the first line of your error message here!" onKeyDown={this.onEnterPress}/>
          </div>
        </div>
      </div>
    )
  }
}

export default mainpage