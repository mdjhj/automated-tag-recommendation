import React, { useState } from "react";
import { useSelector } from "react-redux";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // ES6
import "./index.css";
import Editor from "react-quill/lib/toolbar";
import axios from "axios";
import Modal from "react-modal";
import { TagsInput } from "react-tag-input-component";
import { selectUser } from "../../feature/userSlice";
import { useHistory } from "react-router-dom";
// import CloseButton from 'react-bootstrap/CloseButton';
import Slider from 'react-rangeslider';
//import 'react-rangeslider/lib/index.css';
// import ChipsArray from "./TagsInput";

function Index() {
  const user = useSelector(selectUser);
  var toolbarOptions = [
    ["bold", "italic", "underline", "strike"], // toggled buttons
    ["blockquote", "code-block"],

    [{ header: 1 }, { header: 2 }], // custom button values
    [{ list: "ordered" }, { list: "bullet" }],
    [{ script: "sub" }, { script: "super" }], // superscript/subscript
    [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
    [{ direction: "rtl" }], // text direction

    [{ size: ["small", false, "large", "huge"] }], // custom dropdown
    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ font: [] }],
    [{ align: [] }],

    ["clean"], // remove formatting button
  ];
  Editor.modules = {
    syntax: false,
    toolbar: toolbarOptions,
    clipboard: {
      // toggle to add extra line breaks when pasting HTML:
      matchVisual: false,
    },
  };
  /*
   * Quill editor formats
   * See https://quilljs.com/docs/formats/
   */
  Editor.formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
  ];

  /*
   * PropType validation
   */

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tagInput, setTagInput] = useState([]);
  const history = useHistory();

  const [tags, setTags] = useState([]);
  // const question = [];
  // question.push(title);
  // question.push(body.replace(/(<([^>]+)>)/gi, ""));

  const question = (title + ' ' + body).replace(/(<([^>]+)>)/gi, "");
  //console.log(question)

  const handleQuill = (value) => {
    setBody(value);
  };

  const fetchTags = async () => {
    let response = await fetch('/api/getRecommendedTags', {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        question
      })
    })
    response = await response.json();
    console.log(response);
    setTags(response);
    setHideFeedback(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (title !== "" && body !== "") {
      const bodyJSON = {
        title: title,
        body: body,
        tag: JSON.stringify(tagInput),
        user: user,
      };
      await axios
        .post("/api/question", bodyJSON)
        .then((res) => {
          // console.log(res.data);
          alert("Question added successfully");
          history.push("/");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const [FeedbackModalIsOpen, setFeedbackModalIsOpen] = React.useState(false);
  Modal.setAppElement('body')
  const [hideFeedback, setHideFeedback] = React.useState(true);
  const [feedbackValue, setFeedbackValue] = useState(10);

  const handleFeedbackValue = (value) => {
    setFeedbackValue(value);
  };

  const modalStyle = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      backgroundColor: "rgba(0,0,0,0.85)"
    },
    content: {
      position: "absolute",
      top: "10rem",
      left: "10rem",
      right: "10rem",
      bottom: "10rem",
      backgroundColor: "white",
      borderRadius: "1rem",
      padding: "1.5rem"
    }
  };

  return (
    <div id="main" className="add-question">
      <div className="add-question-container">
        <div className="head-title">
          <h1>Ask a public question</h1>
        </div>
        <div className="question-container">
          <div className="question-options">
            <div className="question-option">
              <div className="title">
                <h3>Title</h3>
                <small>
                  Be specific and imagine you’re asking a question to another
                  person
                </small>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  type="text"
                  placeholder="e.g Is there an R function for finding teh index of an element in a vector?"
                />
              </div>
            </div>
            <div className="question-option">
              <div className="title">
                <h3>Body</h3>
                <small>
                  Include all the information someone would need to answer your
                  question
                </small>
                <ReactQuill
                  value={body}
                  onChange={handleQuill}
                  modules={Editor.modules}
                  className="react-quill"
                  theme="snow"
                />
              </div>
            </div>
            <div className="question-option">
              <div className="title">
                <div className="tags-header">
                  <div className="tags-title">
                    <h3>Tags</h3>
                    <small>
                      Add up to 5 tags to describe what your question is about
                    </small>
                  </div>
                  <div className="tags-recommendation">
                    <button
                      id="submit"
                      onClick={fetchTags}
                    >
                      Recommend Tags
                    </button>
                  </div>
                </div>
                <div className="tag-container">
                  <div className="show-tags">
                    {
                      tags.map((tag) => {
                        return <PredictedTag
                          key={tag}
                          tag={tag}
                        />
                      })
                    }
                  </div>
                  <div className={`show-feedback ${hideFeedback ? "hide-feedback" : ""}`}>
                    <p onClick={() => setFeedbackModalIsOpen(true)}>Give us Feedback on our Recommendations!</p>
                    <Modal isOpen={FeedbackModalIsOpen} style={modalStyle} onRequestClose={() => setFeedbackModalIsOpen(false)}>
                      <button onClick={() => setFeedbackModalIsOpen(false)} className="close-button">
                        ✘
                      </button>
                      <div className="feedback-modal">
                        <div className="feedback-top">
                          <h1>Feedback</h1>
                          <p>
                            Please provide us your valuable feedback on our recommended tags.
                          </p>
                          <p>
                            You can select any value starting from 0 to 100 to rate how accurate our recommendation system is.
                          </p>
                        </div>
                        <div className="slider">
                          <Slider
                            min={0}
                            max={100}
                            value={feedbackValue}
                            onChange={handleFeedbackValue}
                          />
                        </div>
                        <div className="feedback-value">{feedbackValue}%</div>
                        <button onClick={() => setFeedbackModalIsOpen(false)} className="submit-button">Submit</button>
                      </div>
                    </Modal>
                  </div>
                </div>

                <TagsInput
                  value={tagInput}
                  onChange={setTagInput}
                  name="fruits"
                  placeHolder="Press Enter to add new tag"
                />

                {/* <ChipsArray /> */}
              </div>
            </div>
          </div>
        </div>

        <button onClick={handleSubmit} className="button">
          Add your question
        </button>
      </div>
    </div>
  );
}

export default Index;

// PREDICTED TAG COMPONENT
const PredictedTag = ({ tag }) => {
  return (
    <div className="predicted-tag">
      {tag}
    </div>
  )
}
