import React, { Component } from 'react';
import './mainpage.css';
import Message from './message';
import otherResponses from '../otherResponses.json';

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

export class mainpage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      Cos126: null,
      Cos226: null,
      messages:[],
      class: null,
      assignment: null,
      part: null,
      part_name: null,
      loop_index: 0,
      survey_bool: false,
      stu_or_ta: null,
      log_id: null,
      log: {questions:[]},
      survey: {}
    }

    this.buttonClicked = this.buttonClicked.bind(this);
  }

  getCOS126 = async() => {
    const response = await fetch("https://raw.githubusercontent.com/selenashaw/chatbot_responses/main/COS126.JSON");
    await response.json().then(result => {
      this.setState({Cos126: result});
    });
  };

  getCOS226 = async() => {
    const response = await fetch("https://raw.githubusercontent.com/selenashaw/chatbot_responses/main/COS226.JSON");
    await response.json().then(result => {
      this.setState({Cos226: result});
    });
  };

  updateMessages(message) {
    let temp = this.state.messages;
    let newmessages=[...temp, message];
    this.setState({messages: newmessages});
  }

  which_assignment_helper = async(assignment, assignmentIndex) => {
    if (this.state.class === "Cos126") {
      let tests = this.state.Cos126.assignments[assignmentIndex];
      if (tests.hasOwnProperty("tests")) {
        let nextmessage = otherResponses.which_test.a + assignment + otherResponses.which_test.b;
        let nextbutton = [];
        for (var testindex in tests.tests) {
          let btn = [tests.tests[testindex].test_number, testindex];
          nextbutton.push(btn);
        }
        let key = "which_test"+this.state.loop_index;
        let nextprompt = <Message message={nextmessage} bot={true} button={nextbutton} key={key} prompt="which_test" buttonClicked={this.buttonClicked}/>
        this.updateMessages(nextprompt);
      }
      else {
        let nextmessage = otherResponses.which_part.a + assignment + otherResponses.which_part.b;
        let nextbutton = [];
        for (var partindex in tests.parts) {
          let btn = [tests.parts[partindex].part_name, partindex];
          nextbutton.push(btn);
        }
        let key = "which_part"+this.state.loop_index;
        let nextprompt = <Message message={nextmessage} bot={true} button={nextbutton} key={key} prompt="which_part" buttonClicked={this.buttonClicked}/>
        this.updateMessages(nextprompt);
      }
    }
    else if (this.state.class === "Cos226") {
      let tests = this.state.Cos226.assignments[assignmentIndex];
      if (tests.hasOwnProperty("tests")) {
        let nextmessage = otherResponses.which_test.a + assignment + otherResponses.which_test.b;
        let nextbutton = [];
        for (var testindex226 in tests.tests) {
          let btn = [tests.tests[testindex226].test_number, testindex226];
          nextbutton.push(btn);
        }
        let key = "which_test"+this.state.loop_index;
        let nextprompt = <Message message={nextmessage} bot={true} button={nextbutton} key={key} prompt="which_test" buttonClicked={this.buttonClicked}/>
        this.updateMessages(nextprompt);
      }
      else {
        let nextmessage = otherResponses.which_part.a + assignment + otherResponses.which_part.b;
        let nextbutton = [];
        for (var partindex226 in tests.parts) {
          let btn = [tests.parts[partindex226].part_name, partindex226];
          nextbutton.push(btn);
        }
        let key = "which_part"+this.state.loop_index;
        let nextprompt = <Message message={nextmessage} bot={true} button={nextbutton} key={key} prompt="which_part" buttonClicked={this.buttonClicked}/>
        this.updateMessages(nextprompt);
      }
    }
  }


  which_part_helper = async(part, partIndex) => {
    // set the tests variable based on assignment and part index
    let tests;
    if (this.state.class === "Cos126") {
      // if (this.state.part !== null){
        tests = this.state.Cos126.assignments[this.state.assignment].parts[partIndex];
      // }
      // else {
        // tests = this.state.Cos126.assignments[this.state.assignment].tests;
      // }
    }
    else if (this.state.class === "Cos226") {
      // if (this.state.part !== null){
        tests = this.state.Cos226.assignments[this.state.assignment].parts[partIndex];
      // }
      // else {
      //   tests = this.state.Cos226.assignments[this.state.assignment].tests;
      // }
    }
  
    // build the chatbot message with buttons for each test option
    let nextmessage;
    if (this.state.loop_index === 0) {
      nextmessage = otherResponses.which_test.a + part + otherResponses.which_test.b;
    }
    else {
      nextmessage = otherResponses.loop_which_test.a + part + otherResponses.loop_which_test.b;
    }
    let nextbutton = [];
    for (var parttestindex226 in tests.tests) {
      let btn = [tests.tests[parttestindex226].test_number, parttestindex226];
      nextbutton.push(btn);
    }
    let key = "which_test"+this.state.loop_index;
    let nextprompt = <Message message={nextmessage} bot={true} button={nextbutton} key={key} prompt="which_test" buttonClicked={this.buttonClicked}/>
    this.updateMessages(nextprompt);
  }

  // helper function for buttonClicked, handles when which_test prompt is received
  //
  // This function updates the log to include the test the student is looking at,
  // sends messages to the student with hints about that particular test
  // then after a few seconds it asks the student if they want to ask another 
  // question (about the same or different assignment part) or move on to the survey
  which_test_helper = async(button, index) => {
    // print student button click as student message
    let key = "which_test_response"+this.state.loop_index;
    let newmessage = <Message message={button} bot={false} key={key}/>

    // update logs
    this.updateMessages(newmessage);
    let q = {
      "err_or_tf": "tf",
      "part": this.state.part_name,
      "tf_test": button
    };
    let newquestions = this.state.log.questions;
    // if the question has already been asked to not add it to the log
    if (!newquestions.some(e => (e.tf_test === q.tf_test) && (e.part === q.part))){
      newquestions.push(q);
      this.setState(prevState => ({
        log: {
          ...prevState.log,
          questions: newquestions
        }
      }));
    }
    
    await delay(1000);

    // the following block of code sets the tests and loopprompt variables, depending
    // on the class and if the assignment the student is looking at has parts
    let tests;
    let loopprompt;
    if (this.state.class === "Cos126") {
      if (this.state.part !== null) {
        tests = this.state.Cos126.assignments[this.state.assignment].parts[this.state.part].tests[index];
        let key = "loop"+this.state.loop_index;
        loopprompt = <Message message={otherResponses.loop.text} bot={true} button={otherResponses.loop.buttons_part} key={key} prompt="loop" buttonClicked={this.buttonClicked}/>
      }
      else {
        tests = this.state.Cos126.assignments[this.state.assignment].tests[index];
        let key = "loop"+this.state.loop_index;
        loopprompt = <Message message={otherResponses.loop.text} bot={true} button={otherResponses.loop.buttons_test} key={key} prompt="loop" buttonClicked={this.buttonClicked}/>
      }
    }
    else if (this.state.class === "Cos226") {
      if (this.state.part !== null) {
        tests = this.state.Cos226.assignments[this.state.assignment].parts[this.state.part].tests[index];
        let key = "loop"+this.state.loop_index;
        loopprompt = <Message message={otherResponses.loop.text} bot={true} button={otherResponses.loop.buttons_part} key={key} prompt="loop" buttonClicked={this.buttonClicked}/>
      }
      else {
        tests = this.state.Cos226.assignments[this.state.assignment].tests[index];
        let key = "loop"+this.state.loop_index;
        loopprompt = <Message message={otherResponses.loop.text} bot={true} button={otherResponses.loop.buttons_test} key={key} prompt="loop" buttonClicked={this.buttonClicked}/>
      }
    }

    // writes the response that repeats the test number back to the student
    let nextmessage = otherResponses.test_hint.a + button + '.';
    key = "test_hint_a"+this.state.loop_index;
    let nextprompt = <Message message={nextmessage} bot={true} key={key} prompt="test_hint_a"/>
    this.updateMessages(nextprompt);
    await delay(1000);

    // writes the response that includes the test description 
    nextmessage = otherResponses.test_hint.b + tests.description;
    key = "test_hint_b"+this.state.loop_index;
    nextprompt = <Message message={nextmessage} bot={true} key={key} prompt="test_hint_b"/>
    this.updateMessages(nextprompt);
    await delay(1000);

    // writes the response that includes the hint/details about the test
    nextmessage = otherResponses.test_hint.c + tests.hint;
    key = "test_hint_c"+this.state.loop_index;
    nextprompt = <Message message={nextmessage} bot={true} key={key} prompt="test_hint_c"/>
    this.updateMessages(nextprompt);

    // waits a few second then asks the student if they need more help or are ready
    // to take the survey
    await delay(5000);
    this.updateMessages(loopprompt);
    let updateloop = this.state.loop_index + 1;
    this.setState({loop_index: updateloop});
  }

  survey_helper = async(number, stu_or_ta, response) => {
    let resp_key;
    let buttons;
    let newmess;
    let q_key;
    let label;

    if(number === 1 && stu_or_ta === "Student") {
      resp_key = "survey_s1_resp";
      buttons = otherResponses.survey.yes_no;
      newmess = otherResponses.survey.s_debug;
      q_key = "survey_s2";
      label = "s_understand";
    }
    else if(number === 2 && stu_or_ta === "Student") {
      resp_key = "survey_s2_resp";
      buttons = otherResponses.survey.yes_no;
      newmess = otherResponses.survey.s_oh_ta_1;
      q_key = "survey_s3";
      label="s_debug";
    }
    else if(number === 3 && stu_or_ta === "Student") {
      resp_key = "survey_s3_resp";
      buttons = otherResponses.survey.yes_no;
      newmess = otherResponses.survey.s_oh_ta_2;
      q_key = "survey_s4";
      label="s_oh_ta_1";
    }
    else if(number === 4 && stu_or_ta === "Student") {
      resp_key = "survey_s4_resp";
      buttons = [otherResponses.survey.yes_no[1]];
      newmess = otherResponses.survey.s_ans_feed;
      q_key = "survey_s5";
      label="s_oh_ta_1";
    }
    else if(number === 5 && stu_or_ta === "Student") {
      resp_key = "survey_s5_resp";
      buttons = [otherResponses.survey.yes_no[1]];
      newmess = otherResponses.survey.s_bot_feed;
      q_key = "survey_s6";
      label="s_ans_feed";
    }
    else if(number === 2 && stu_or_ta === "Lab TA") {
      resp_key = "survey_ta2_resp";
      buttons = otherResponses.survey.yes_no;
      newmess = otherResponses.survey.ta_stu;
      q_key = "survey_ta3";
      label = "ta_stu_help";
    }
    else if(number === 3 && stu_or_ta === "Lab TA") {
      resp_key = "survey_ta3_resp";
      buttons = [otherResponses.survey.yes_no[1]];
      newmess = otherResponses.survey.ta_stu;
      q_key = "survey_ta4";
      label = "ta_help"
    }

    let message = <Message message={response} bot={false} key={resp_key} />
    this.updateMessages(message);
    await delay(1000);

    // let r = {
    //   "q": number,
    //   "response": button
    // };
    // let updatesurvey = this.state.survey;
    // updatesurvey.push(r);
    // this.setState({survey: updatesurvey});
    this.setState(prevState => ({
      survey: {
        ...prevState.survey,
        [label]: response
    }}));


    let newmessage = <Message message={newmess} bot={true} button={buttons} buttonClicked={this.buttonClicked} key={q_key} prompt={q_key}/>
    this.updateMessages(newmessage);
    console.log(this.state.survey);
  }

  // This function handles responses from the user and controls the flow of the chatbot
  buttonClicked = async(button, index, prompt) => {
    // if the prompt is 'which_class', then the user has given an answer to the 
    // class that they are in, so we need to update the state and respond to
    // the user with the next step (which assignment)
    if (prompt === "which_class") {
      let key = "which_class_response"+this.state.loop_index;
      let newmessage = <Message message={button} bot={false} key={key}/>
      this.updateMessages(newmessage);
      this.setState(prevState => ({
        log: {
          ...prevState.log,
          class: button
        }
      }));
      this.setState({class:button});
      await delay(1000);
      if (button === "Cos126") {
        let nextmessage = otherResponses.which_assignment.a + button + otherResponses.which_assignment.b;
        let assignments = this.state.Cos126.assignments;
        let nextbutton = [];
        for (var assignment126 in assignments) {
          let btn = [assignments[assignment126].name, assignment126];
          nextbutton.push(btn);
        }
        //   if(assignments[assignment126].hasOwnProperty(assignments[assignment126].name))
        //   console.log(assignment126);
        //   console.log(assignments[assignment126])
        //   for (var assignmentname126 in assignments[assignment126]) { //loops over one thing
        //     if (assignments[assignment126].hasOwnProperty(assignmentname126)) {
        //       let btn = [assignmentname126, assignment126];
        //       nextbutton.push(btn);
        //     }
        //   }
        // }
        // for (var assignment126 in assignments) {
        //   if (assignments.hasOwnProperty(assignment126)) {
        //     nextbutton.push(assignment126);
        //   }
        // }
        let key = "which_assignment"+this.state.loop_index;
        let nextprompt = <Message message={nextmessage} bot={true} button={nextbutton} key={key} prompt="which_assignment" buttonClicked={this.buttonClicked}/>
        this.updateMessages(nextprompt);
      }
      else if (button === "Cos226") {
        let nextmessage = otherResponses.which_assignment.a + button + otherResponses.which_assignment.b;
        let assignments = this.state.Cos226.assignments;
        let nextbutton = [];
        for (var assignment226 in assignments) {
          let btn = [assignments[assignment226].name, assignment226];
          nextbutton.push(btn);
        }
        // for (var assignment226 in assignments) {
        //   for (var assignmentname226 in assignments[assignment226]) { //loops over one thing
        //     if (assignments[assignment226].hasOwnProperty(assignmentname226)) {
        //       let btn = [assignmentname226, assignment226];
        //       nextbutton.push(btn);
        //     }
        //   }
        // }
        // for (var assignment226 in assignments) {
        //   if (assignments.hasOwnProperty(assignment226)) {
        //     nextbutton.push(assignment226);
        //   }
        // }
        let key = "which_assignment"+this.state.loop_index;
        let nextprompt = <Message message={nextmessage} bot={true} button={nextbutton} key={key} prompt="which_assignment" buttonClicked={this.buttonClicked}/>
        this.updateMessages(nextprompt);
      }
    }
    //TODO: update comment for this and for the helper
    // if the prompt is 'which_assignment', then the user has told the chatbot 
    // which assignment they are working on, so the chatbot updates the state
    // in response and either offers the student the parts of the assignment
    // or the tests available for the assignment 
    else if (prompt === "which_assignment") {
      let key = "which_assignment_response"+this.state.loop_index;
      let newmessage = <Message message={button} bot={false} key={key}/>
      this.updateMessages(newmessage);
      this.setState(prevState => ({
        log: {
          ...prevState.log,
          assignment: button
        }
      }));
      this.setState({assignment:index});
      await delay(1000);

      this.which_assignment_helper(button, index);
      // if (this.state.class === "Cos126") {
      //   let tests = this.state.Cos126.assignments[index];
      //   if (tests.hasOwnProperty("tests")) {
      //     let nextmessage = otherResponses.which_test.a + button + otherResponses.which_test.b;
      //     let nextbutton = [];
      //     for (var testindex in tests.tests) {
      //       let btn = [tests.tests[testindex].test_number, testindex];
      //       nextbutton.push(btn);
      //     }
      //     // for (var testindex in tests.tests) {
      //     //   for (var testname126 in tests.tests[testindex]){ //loops over one thing
      //     //     if(tests.tests[testindex].hasOwnProperty(testname126)) {
      //     //       let btn= [testname126, testindex]
      //     //       nextbutton.push(btn);
      //     //     }
      //     //   }
      //     // }
      //     let key = "which_test"+this.state.loop_index;
      //     let nextprompt = <Message message={nextmessage} bot={true} button={nextbutton} key={key} prompt="which_test" buttonClicked={this.buttonClicked}/>
      //     this.updateMessages(nextprompt);
      //   }
      //   else {
      //     let nextmessage = otherResponses.which_part.a + button + otherResponses.which_part.b;
      //     let nextbutton = [];
      //     for (var partindex in tests.parts) {
      //       let btn = [tests.parts[partindex].part_name, partindex];
      //       nextbutton.push(btn);
      //     }
      //     // for (var partindex in tests.parts) {
      //     //   for (var partname126 in tests.parts[partindex]){ //loops over one thing
      //     //     if(tests.parts[partindex].hasOwnProperty(partname126)) {
      //     //       let btn= [partname126, partindex]
      //     //       nextbutton.push(btn);
      //     //     }
      //     //   }
      //     // }
      //     let key = "which_part"+this.state.loop_index;
      //     let nextprompt = <Message message={nextmessage} bot={true} button={nextbutton} key={key} prompt="which_part" buttonClicked={this.buttonClicked}/>
      //     this.updateMessages(nextprompt);
      //   }
      // }
      // else if (this.state.class === "Cos226") {
      //   let tests = this.state.Cos226.assignments[index];
      //   if (tests.hasOwnProperty("tests")) {
      //     let nextmessage = otherResponses.which_test.a + button + otherResponses.which_test.b;
      //     let nextbutton = [];
      //     for (var testindex226 in tests.tests) {
      //       let btn = [tests.tests[testindex226].test_number, testindex226];
      //       nextbutton.push(btn);
      //     }
      //     // for (var testindex226 in tests.tests) {
      //     //   for (var testname226 in tests.tests[testindex226]){ //loops over one thing
      //     //     if(tests.tests[testindex226].hasOwnProperty(testname226)) {
      //     //       let btn= [testname226, testindex]
      //     //       nextbutton.push(btn);
      //     //     }
      //     //   }
      //     // }
      //     let key = "which_test"+this.state.loop_index;
      //     let nextprompt = <Message message={nextmessage} bot={true} button={nextbutton} key={key} prompt="which_test" buttonClicked={this.buttonClicked}/>
      //     this.updateMessages(nextprompt);
      //   }
      //   else {
      //     let nextmessage = otherResponses.which_part.a + button + otherResponses.which_part.b;
      //     let nextbutton = [];
      //     for (var partindex226 in tests.parts) {
      //       let btn = [tests.parts[partindex226].part_name, partindex226];
      //       nextbutton.push(btn);
      //     }
      //     // for (var partindex226 in tests.parts) {
      //     //   for (var partname226 in tests.parts[partindex226]){ //loops over one thing
      //     //     if(tests.parts[partindex226].hasOwnProperty(partname226)) {
      //     //       let btn= [partname226, partindex226]
      //     //       nextbutton.push(btn);
      //     //     }
      //     //   }
      //     // }
      //     let key = "which_part"+this.state.loop_index;
      //     let nextprompt = <Message message={nextmessage} bot={true} button={nextbutton} key={key} prompt="which_part" buttonClicked={this.buttonClicked}/>
      //     this.updateMessages(nextprompt);
      //   }
      // }
    }
    // if the prompt is 'which_part' calls the which_part_helper 
    else if (prompt === "which_part") {
      // print student button click as student message
      let key = "which_part_response"+this.state.loop_index;
      let newmessage = <Message message={button} bot={false} key={key}/>
      this.updateMessages(newmessage);

      //update state
      this.setState({part:index, part_name:button});
      await delay(1000);

      this.which_part_helper(button, index);
    }
    // if the prompt is 'which_test' calls the which_test_helper.
    else if (prompt === "which_test") {
      this.which_test_helper(button, index);
    }
    // if the prompt is 'loop' then the user has told the chatbot if they want to 
    // ask another question or move on to the survey. If it is the prior, the chatbot
    // will give options for a part or test to select, if it is the latter then the
    // chatbot will ask the first survey question.
    else if (prompt === "loop"){
      let key = "loop_which_test"+this.state.loop_index;
      let message = <Message message={button} bot={false} key={key} />
      this.updateMessages(message);
      await delay(1000);
      // The user has another question about the same part
      if (index === 0 && this.state.part !== null) {
        this.which_part_helper(this.state.part_name, this.state.part);
      }

      // The user has a question about a different part or different test for no part
      else if ((index === 1 && this.state.part != null) || (index === 0 && this.state.part === null)){
        this.setState({part:null, part_name:null});
        this.which_assignment_helper(this.state.log.assignment, this.state.assignment);
      }

      // The user is ready to go on to the survey
      else {
        // if the button is survey, store the log and give the first survey question
        // TODO: STORE THE LOG, then set log_id to be the result
        this.setState({survey_bool:true});
        let q1 = <Message message={otherResponses.survey.status} button={otherResponses.survey.status_response} bot={true} key={"survey"} prompt={"survey"} buttonClicked={this.buttonClicked}/>
        this.updateMessages(q1);
      }
    }

    // the following conditions are for the survey
    else if (prompt === "survey") {
      let message = <Message message={button} bot={false} key={"survey_resp"} />
      this.updateMessages(message);
      await delay(1000);

      this.setState({stu_or_ta: button});

      if (button === "Student") {
        let newmessage = <Message message={otherResponses.survey.s_understand} bot={true} button={otherResponses.survey.yes_no} buttonClicked={this.buttonClicked} key="survey_s1" prompt="survey_s1"/>
        this.updateMessages(newmessage);
      }
      else {
        let newmessage = <Message message={otherResponses.survey.ta_stu} bot={true} button={otherResponses.survey.ta_stu_response} buttonClicked={this.buttonClicked} key="survey_ta1" prompt="survey_ta1"/>
        this.updateMessages(newmessage);
      }
    }

    else if (prompt === "survey_s1") {
      this.survey_helper(1, "Student", button);
    }
    else if (prompt === "survey_s2") {
      this.survey_helper(2, "Student", button);
    }
    else if (prompt === "survey_s3") {
      this.survey_helper(3, "Student", button);
    }
    else if (prompt === "survey_s4") {
      this.survey_helper(4, "Student", button);
    }
    else if (prompt === "survey_s5") {
      this.survey_helper(5, "Student", button);
    }
    // The last survey response has been received, the bot thanks the student
    else if (prompt === "survey_s6") {
      let message = <Message message={button} bot={false} key="survey_s6_resp" />
      this.updateMessages(message);
      await delay(1000);

      this.setState(prevState => ({
        survey: {
          ...prevState.survey,
          "s_bot_feed": button
      }}));

      let newmessage = <Message message={otherResponses.survey.s_thanks} bot={true} key="thanks"/>
      this.updateMessages(newmessage);

      // TODO: send survey then do something to mark survey as sent so it doesnt send when closes!!
    }

    else if (prompt === "survey_ta1") {
      let message = <Message message={button} bot={false} key="survey_ta1_resp" />
      this.updateMessages(message);
      await delay(1000);

      this.setState(prevState => ({
        survey: {
          ...prevState.survey,
          "ta_stu": button
      }}));

      if(index === 2){ // the ta answered "none, just looking"
        let newmessage = <Message message={otherResponses.survey.ta_help} bot={true} button={otherResponses.survey.yes_no} buttonClicked={this.buttonClicked} key="survey_ta3" prompt="survey_ta3"/>
        this.updateMessages(newmessage);
      }
      else {
        let newmessage = <Message message={otherResponses.survey.ta_stu_help} bot={true} button={otherResponses.survey.yes_no} buttonClicked={this.buttonClicked} key="survey_ta2" prompt="survey_ta2"/>
        this.updateMessages(newmessage);
      }
    }
    else if (prompt === "survey_ta2") {
      this.survey_helper(2, "Student", button);
    }
    else if (prompt === "survey_ta3") {
      this.survey_helper(3, "Student", button);
    }
    else if (prompt === "survey_ta4") {
      this.survey_helper(4, "Student", button);
    }
    // The last survey response has been received, the bot thanks the ta
    else if (prompt === "survey_ta5") {
      let message = <Message message={button} bot={false} key="survey_ta4_resp" />
      this.updateMessages(message);
      await delay(1000);

      this.setState(prevState => ({
        survey: {
          ...prevState.survey,
          "ta_feed": button
      }}));

      let newmessage = <Message message={otherResponses.survey.ta_thanks} bot={true} key="thanks"/>
      this.updateMessages(newmessage);

      // TODO: send survey then do something to mark survey as sent so it doesnt send when closes!!
    }

    // Realistically, The code should never reach this part, but just in case
    else {
      let message = "uh oh, I seem to have gotten lost in my code! please take a screenshot of our messages and email it to selenas@princeton.edu";
      let newmessage = <Message message={message} bot={true} key='bad_prompt' prompt="bad_prompt"/>
      this.updateMessages(newmessage);
    }
  };

  componentDidMount() {
    this.getCOS126();
    this.getCOS226();
    this.setState({messages:[
      <Message message={otherResponses.intro} bot={true} buttonClicked={this.buttonClicked} key="intro" prompt="intro"/>, 
      <Message message={otherResponses.which_class.text} bot={true} button={otherResponses.which_class.buttons} buttonClicked={this.buttonClicked} key="which_class" prompt="which_class"/>
    ]})
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
            <textarea name='text-input' className='text-box'/>
          </div>
        </div>
      </div>
    )
  }
}

export default mainpage