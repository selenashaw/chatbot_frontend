/* Old responses.err_info

    "Great! We will quickly run through the formatting for both compilation and runtime error messages, to start, we will look at a compilation error",
    "file_name.java:3: error: ';' expected\nString hello = \"Hello World\"\n                                ^\n1 error",
    "This error occured when the .java file 'file_name' was compiled. The error message tells us that the error happened on line 3 and that a semi-colon was missing.",
    "In order to help with your error, I need the first line of the error message. So for this example, you would copy the line \"file_name.java:3: error: ';' expected\" and paste it in my text field!",
    "Now that we have covered compilation errors, let's look at a runtime example!",
    "Our code snippet in this example is as follows:\n3: int[] arr = new int[2];\n4: arr[2] = 0;",
    "This code compiles, but when we try to run it, we get the following exception",
    "Exception in thread \"main\" java.lang.ArrayIndexOutOfBoundsException: Index 2 out of bounds for length 2\n    at file_name.main(file_name.java:4)",
    "This error occurred because we made an array called 'arr' that can hold two integers (one at index 0 and one at index 1), however we are trying to store a value in an index that does not exist in the array we created, so Java throws a runtime exception.",
    "The first line of the error tells us what the exception was, the lines that follow help you trace your code to see what line caused it (many times there will be more than one line of tracing), in this case the error occured in 'file_name' at line 4.",
    "In order to help with your error, I again will need the first line of the error message. So for this example, you would copy the line \"Exception in thread \"main\" java.lang.ArrayIndexOutOfBoundsException: Index 2 out of bounds for length 2\" and paste it in my text field!",
    "When I receive your error message, compilation or runtime, I provide some elaboration on the error message and some possible solutions.",
    "Now that we have gone through all of that, let's look at your error message!"

    When you are finished, I would greatly appreciate it if you stuck around and answered my survey questions!
*/


























// print student button click as student message
let key = "which_part_response"+this.state.loop_index;
let newmessage = <Message message={button} bot={false} key={key}/>
this.updateMessages(newmessage);

//update state
this.setState({part:index, part_name:button});
await delay(1000);

which_part_helper = async(part, partIndex) => {
  // set the tests variable based on assignment and part index
  let tests;
  if (this.state.class === "Cos126") {
    tests = this.state.Cos126.assignments[this.state.assignment].parts[partIndex];
  }
  else if (this.state.class === "Cos226") {
    tests = this.state.Cos226.assignments[this.state.assignment].parts[partIndex];
  }

  // build the chatbot message with buttons for each test option
  let nextmessage = otherResponses.which_test.a + part + otherResponses.which_test.b;
  let nextbutton = [];
  for (var parttestindex226 in tests.tests) {
    let btn = [tests.tests[parttestindex226].test_number, parttestindex226];
    nextbutton.push(btn);
  }
  key = "which_test"+this.state.loop_index;
  let nextprompt = <Message message={nextmessage} bot={true} button={nextbutton} key={key} prompt="which_test" buttonClicked={this.buttonClicked}/>
  this.updateMessages(nextprompt);
}


// helper function for buttonClicked, handles when which_test prompt is received
  // This function updates the state to include the part of the assignment the student
  // is working on, then it sends a message to the student with all of the test
  // number options available for that part of the assignment
  which_part_helper = async(button, index) => {
    // print student button click as student message
    let key = "which_part_response"+this.state.loop_index;
    let newmessage = <Message message={button} bot={false} key={key}/>
    this.updateMessages(newmessage);

    //update state
    this.setState({part:index, part_name:button});
    await delay(1000);

    // set the tests variable based on assignment and part index
    let tests;
    if (this.state.class === "Cos126") {
      tests = this.state.Cos126.assignments[this.state.assignment].parts[index];
    }
    else if (this.state.class === "Cos226") {
      tests = this.state.Cos226.assignments[this.state.assignment].parts[index];
    }

    // build the chatbot message with buttons for each test option
    let nextmessage = otherResponses.which_test.a + button + otherResponses.which_test.b;
    let nextbutton = [];
    for (var parttestindex226 in tests.tests) {
      let btn = [tests.tests[parttestindex226].test_number, parttestindex226];
      nextbutton.push(btn);
    }
    key = "which_test"+this.state.loop_index;
    let nextprompt = <Message message={nextmessage} bot={true} button={nextbutton} key={key} prompt="which_test" buttonClicked={this.buttonClicked}/>
    this.updateMessages(nextprompt);
  }


  // let key = "which_part_response"+this.state.loop_index;
  //   let newmessage = <Message message={button} bot={false} key={key}/>
  //   this.updateMessages(newmessage);
  //   this.setState({part:index, part_name:button});
  //   await delay(1000);

  //   if (this.state.class === "Cos126") {
  //     let tests = this.state.Cos126.assignments[this.state.assignment].parts[index];
  //     let nextmessage = otherResponses.which_test.a + button + otherResponses.which_test.b;
  //     let nextbutton = [];
  //     for (var testindex126 in tests.tests) {
  //       let btn = [tests.tests[testindex126].test_number, testindex126];
  //       nextbutton.push(btn);
  //     }
  //     let key = "which_test"+this.state.loop_index;
  //     let nextprompt = <Message message={nextmessage} bot={true} button={nextbutton} key={key} prompt="which_test" buttonClicked={this.buttonClicked}/>
  //     this.updateMessages(nextprompt);
  //   }
  //   else if (this.state.class === "Cos226") {
  //     let tests = this.state.Cos226.assignments[this.state.assignment].parts[index];
  //     let nextmessage = otherResponses.which_test.a + button + otherResponses.which_test.b;
  //     let nextbutton = [];
  //     for (var parttestindex226 in tests.tests) {
  //       let btn = [tests.tests[parttestindex226].test_number, parttestindex226];
  //       nextbutton.push(btn);
  //     }
  //     let key = "which_test"+this.state.loop_index;
  //     let nextprompt = <Message message={nextmessage} bot={true} button={nextbutton} key={key} prompt="which_test" buttonClicked={this.buttonClicked}/>
  //     this.updateMessages(nextprompt);
  //   }



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



  survey_helper = async(number, stu_or_ta, response) => {
    let resp_key;
    let buttons;
    let newmess;
    let q_key;

    if(number === 1 && stu_or_ta === "Student") {
      resp_key = "survey_s1_resp";
      buttons = otherResponses.survey.yes_no;
      newmess = otherResponses.survey.s_debug;
      q_key = "survey_s2";
    }
    else if(number === 2 && stu_or_ta === "Student") {
      resp_key = "survey_s2_resp";
      buttons = otherResponses.survey.yes_no;
      newmess = otherResponses.survey.s_oh_ta_1;
      q_key = "survey_s3";
    }
    else if(number === 3 && stu_or_ta === "Student") {
      resp_key = "survey_s3_resp";
      buttons = otherResponses.survey.yes_no;
      newmess = otherResponses.survey.s_oh_ta_2;
      q_key = "survey_s4";
    }
    else if(number === 4 && stu_or_ta === "Student") {
      resp_key = "survey_s4_resp";
      buttons = [otherResponses.survey.yes_no[1]];
      newmess = otherResponses.survey.s_ans_feed;
      q_key = "survey_s5";
    }
    // else if(number === 1 && stu_or_ta === "Lab TA") {
    //   resp_key = "survey_ta1_resp";
    //   buttons = otherResponses.survey.ta_stu_response;
    //   newmess = otherResponses.survey.ta_stu;
    //   q_key = "survey_ta2";
    // }
    // else if(number === 2 && stu_or_ta === "Lab TA") {
    //   resp_key = "survey_ta2_resp";
    //   buttons = otherResponses.survey.ta_stu_response;
    //   newmess = otherResponses.survey.ta_stu;
    //   q_key = "survey_ta3";
    // }

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
        number: response
    }}));

    let newmessage = <Message message={newmess} bot={true} button={buttons} buttonClicked={this.buttonClicked} key={qkey} prompt={q_key}/>
    this.updateMessages(newmessage);
    console.log(this.state.survey);
  }