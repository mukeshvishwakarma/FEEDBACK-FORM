import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import "./Edit.css";

const EditFeedback = () => {
  const { id } = useParams(); // Get the feedback ID from the URL
  const navigate = useNavigate(); // Use useNavigate instead of useHistory

  const [feedback, setFeedback] = useState({
    feedback: "",
    date: "",
  });

  // Fetch the feedback data when the page loads
  useEffect(() => {
    const getFeedback = async () => {
      let result = await fetch(`http://localhost:5000/feedbacks/${id}`, {
        headers: {
          authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
      });
      result = await result.json();
      setFeedback(result); // Assuming result contains the feedback data
    };

    getFeedback();
  }, [id]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFeedback((prevFeedback) => ({
      ...prevFeedback,
      [name]: value,
    }));
  };

  // Handle form submission to update feedback
  const handleUpdate = async (e) => {
    e.preventDefault();

    const updatedFeedback = {
      feedback: feedback.feedback,
      date: feedback.date,
    };

    let result = await fetch(`http://localhost:5000/feedbacks/${id}`, {
      method: "PUT", 
      headers: {
        "Content-Type": "application/json",
        authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
      body: JSON.stringify(updatedFeedback),
    });

    result = await result.json();
    if (result) {
      alert("Feedback updated successfully!");
      navigate("/Feedbacklist"); // Redirect to the feedback list page using navigate
    } else {
      alert("Something went wrong!");
    }
  };

  return (
    <div className="Login">
      <h2>Edit Feedback</h2>
      <form onSubmit={handleUpdate}>
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
          <label id="label" htmlFor="date">
            Date:
          </label>

          <input
            id="date"
            className="inputBox"
            name="date"
            type="date"
            value={feedback.date ? new Date(feedback.date).toISOString().slice(0, 10) : ''}
            onChange={handleChange}
            required
          />
        </div>
        

        <div>
          <input
            style={{ width: "316px", marginTop:"10px" }}
            className="inputBox"
            type="button"
            value="Update Feedback"
            onClick={handleUpdate}
          />
        </div>
      </form>
    </div>
  );
};

export default EditFeedback;
