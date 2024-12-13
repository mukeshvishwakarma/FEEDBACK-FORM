const express = require("express");
require("./db/config.js");
const cors = require("cors");
const User = require("./db/User.js");
const Feedback = require("./db/Feedback.js");
const app = express();
app.use(cors());
app.use(express.json());
const Jwt = require("jsonwebtoken");
const jwtkey = "e-com";
const bcrypt = require("bcryptjs");

app.post("/register", async (req, res) => {
  try {
    const { email, password,rememberMe,username } = req.body;
    console.log("req.body", req.body)
    let existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).send({ result: "Username already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let user = new User({
      ...req.body,
      password: hashedPassword,
      cpassword: hashedPassword,
      admin: rememberMe,
    });

    let result = await user.save();

    result = result.toObject();
    delete result.password;

    Jwt.sign(
      { userId: result._id },
      jwtkey,
      { expiresIn: "2h" },
      (error, token) => {
        if (error) {
          return res.status(500).send({
            result: "Something went wrong, please try after some time",
          });
        }

        res.send({ user: result, auth: token });
      }
    );
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).send({ result: "Internal Server Error" });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (username && password) {
    try {
      let user = await User.findOne({ username }).select("-cpassword");
      // console.log("....user....", user);
      if (user) {
        // console.log("user.password", password, user.password);
        const isMatch = await bcrypt.compare(password, user.password);
        // console.log("....isMatch....", isMatch);
        user = user.toObject();
        delete user.password;
        if (isMatch) {
          Jwt.sign(
            { userId: user._id },
            jwtkey,
            { expiresIn: "2h" },
            (error, token) => {
              if (error) {
                return res.status(500).send({
                  result: "Something went wrong, Please try again later",
                });
              }
              res.send({ user, auth: token });
            }
          );
        } else {
          return res.status(400).send({ result: "Invalid credentials" });
        }
      } else {
        return res.status(404).send({ result: "No User Found" });
      }
    } catch (err) {
      return res
        .status(500)
        .send({ result: "Server error, please try again later" });
    }
  } else {
    return res
      .status(400)
      .send({ result: "Please provide both email and password" });
  }
});

app.post("/add-feedback", authenticate, async (req, res) => {
  try {
    const { feedback } = req.body;
    const userId = req.userId;

    if (!feedback) {
      return res.status(400).send({ result: "Feedback text is required" });
    }

    let feedbackDoc = new Feedback({
      feedback,
      userId,
    });

    let result = await feedbackDoc.save();

    result = await result.populate("userId");

    res.send(result);
  } catch (error) {
    res.status(500).send({ result: "An error occurred", error });
  }
});

app.get("/feedbacks", authenticate, async (req, res) => {
    try {
      
      let feedbacks = await Feedback.find();
  
      const userId = req.userId; 
      let user = await User.findOne({ _id: userId }).select("-cpassword");
  
      if (feedbacks.length > 0) {
      
        res.send({ feedbacks, user })
      } else {
        res.send({ message: "No feedbacks found" });
      }
    } catch (err) {
      console.error("Error fetching feedbacks: ", err);
      res.status(500).send({ message: "Server Error" });
    }
  });
  

  app.get("/feedbacks/:id", authenticate, async (req, res) => {
    let result = await Feedback.findOne({ _id: req.params.id });
    if (result) {
      res.send(result);
    } else {
      res.send("NO RESULT FOUND");
    }
  });

  app.put("/feedbacks/:id", authenticate, async (req, res) => {
    let result = await Feedback.updateOne(
      { _id: req.params.id },
      {
        $set: req.body,
      }
    );
    if (result) {
      res.send(result);
    }
  });

  app.delete("/feedbacks/:id", authenticate, async (req, res) => {
    console.log("req.params.id", req.params.id)
    const result = await Feedback.deleteOne({ _id: req.params.id });
    res.send(result);
  });

function authenticate(req, res, next) {
  const token = req.headers["authorization"];
//   console.log("...token..", token);
  if (!token) {
    return res.status(403).send({ result: "Access Denied, No Token Provided" });
  }

  try {
    const tokenStr = token.split(" ")[1]
    const decoded = Jwt.verify(tokenStr, jwtkey);
    // console.log("...decoded..", decoded);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(400).send({ result: "Invalid Token" });
  }
}



app.listen(5000);
