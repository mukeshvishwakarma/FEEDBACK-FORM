import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "./Edit.css";

const AddFeedback = () => {
  const navigate = useNavigate(); 

  const [feedback, setFeedback] = useState({
    feedback: "",
    date: "",
  });

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFeedback((prevFeedback) => ({
      ...prevFeedback,
      [name]: value,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const newFeedback = {
      feedback: feedback.feedback,
      date: feedback.date,
    };

    
    let result = await fetch("http://localhost:5000/add-feedback", {
      method: "POST", 
      headers: {
        "Content-Type": "application/json",
        authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
      body: JSON.stringify(newFeedback),
    });

    result = await result.json();
    if (result) {
      alert("Feedback added successfully!");
      navigate("/Feedbacklist"); 
    } else {
      alert("Something went wrong!");
    }
  };

  return (
    <div className="Login">
      <h2>Add Feedback</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label id="label" htmlFor="feedback">
            Feedback:
          </label>
          <textarea
            id="feedback"
            name="feedback"
            className="inputBox"
            value={feedback.feedback}
            onChange={handleChange} 
            required
          />
        </div>

        <div>
          <button style={{backgroundColor: "GrayText"}} className="inputBox" type="submit">
            Add Feedback
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddFeedback;
