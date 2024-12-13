import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

const Feedbacklist = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [user, setUser] = useState(null); // State to store user data
  const navigate = useNavigate();

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    try {
      let result = await fetch("http://localhost:5000/feedbacks", {
        headers: {
          authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
      });

      result = await result.json();
      if (result.feedbacks) {
        setFeedbacks(result.feedbacks);
        setUser(result.user); // Store user data
      } else {
        console.error("No feedbacks found in response:", result);
      }
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const deletefeedbacks = async (id) => {
    try {
      let result = await fetch(`http://localhost:5000/feedbacks/${id}`, {
        method: "delete",
        headers: {
          authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
      });
      result = await result.json();
      if (result) {
        alert("Feedback deleted successfully!");
        getProducts();
      }
    } catch (error) {
      console.error("Error deleting feedback:", error);
    }
  };

  const singleitemfeedbacks = async (id) => {
    try {
      let result = await fetch(`http://localhost:5000/feedbacks/${id}`, {
        method: "get",
        headers: {
          authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
      });
      result = await result.json();
      console.log("Single feedback:", result);
    } catch (error) {
      console.error("Error fetching single feedback:", error);
    }
  };

  return (
    <div className="Feedbacklist">
      <h1>Admin Feedback Dashboard</h1>
      <p style={{ marginLeft: "-700px" }}>
        <Link to="/Addfeedback">Add Feedback</Link>
      </p>
      <ul>
        <li style={{ width: "30px" }}>ID</li>
        <li>Feedback</li>
        <li>Date</li>
        <li>Actions</li>
      </ul>
      {feedbacks.length > 0 ? (
        feedbacks.map((item, index) => (
          <ul key={item._id}>
            <li style={{ width: "30px" }}>{index + 1}</li>
            <li style={{ textTransform: "capitalize" }}>{item.feedback}</li>
            <li>
              {item.date ? new Date(item.date).toISOString().slice(0, 10) : ""}
            </li>
            <li>
              {user?.admin === "admin" ? ( // Check if the user is an admin
                <>
                  <button onClick={() => deletefeedbacks(item._id)}>
                    Delete
                  </button>
                  &nbsp;&nbsp;
                  <Link to={`/feedbacks/edit/${item._id}`}>
                    <button>Edit</button>
                  </Link>
                  &nbsp;&nbsp;
                  <button onClick={() => singleitemfeedbacks(item._id)}>
                    View
                  </button>
                </>
              ) : (
                "Restricted"
              )}
            </li>
          </ul>
        ))
      ) : (
        <h1>NO MATCH FOUND</h1>
      )}
      <p className="nav-right1">
        <Link onClick={logout} to="/">
          Logout{" "}
        </Link>
      </p>
    </div>
  );
};

export default Feedbacklist;
