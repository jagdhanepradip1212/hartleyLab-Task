const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

const app = express();
app.use(express.json());

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "jagdhanepradip1212@gmail.com",
    pass: "kprh lqqy vitn uqtx", // Replace with your App Password (generated in your Google Account)
  },
});

// POST endpoint for handling form submissions
app.post("/submit-form", (req, res) => {
  const { firstname, email, phone, amount, address } = req.body;

  // Nodemailer email options
  // const mailOptions = {
  //   from: 'your@gmail.com', // Replace with your Gmail address
  //   to: email,
  //   subject: 'Donation Confirmation',
  //   html: `
  //     <p>Dear <strong>${firstname}</strong/>,</p>
  //     <p>Thank you for your generous donation of rupees<b>${amount}</b> to our NGO. Your support is highly appreciated.</p>
  //     <p>Confirmation Details:</p>
  //     <ul>
  //       <li>Email: ${email}</li>
  //       <li>Phone: ${phone}</li>
  //       <li>Address: ${address}</li>
  //     </ul>
  //     <p>We will be in touch with you shortly. If you have any further questions, feel free to contact us.</p>
  //     <p>Thank you again for your contribution.</p>
  //     <p>Best regards,<br>Your NGO Team</p>
  //   `,
  // };

  const mailOptions = {
    from: "your@gmail.com", // Replace with your Gmail address
    to: email,
    subject: "Donation Confirmation",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
        <p style="font-size: 18px; margin-bottom: 10px;">Dear <strong style="color: #007BFF;">${firstname}</strong>,</p>
        <p style="font-size: 16px; margin-bottom: 20px;">Thank you for your generous donation of Rs.<span style="font-weight: bold; color: #28A745;">${amount}</span> to our NGO. Your support is highly appreciated.</p>
        <div style="background-color: #F8F9FA; padding: 10px; border-radius: 5px; margin-bottom: 20px;">
          <p style="font-size: 16px; margin-bottom: 5px; font-weight: bold;">Confirmation Details:</p>
          <ul style="list-style-type: none; padding: 0;">
            <li style="font-size: 14px; margin-bottom: 5px;">Email: ${email}</li>
            <li style="font-size: 14px; margin-bottom: 5px;">Phone: ${phone}</li>
            <li style="font-size: 14px;">Address: ${address}</li>
          </ul>
        </div>
        <p style="font-size: 16px; margin-bottom: 20px;">We will be in touch with you shortly. If you have any further questions, feel free to contact us.</p>
        <p style="font-size: 16px; margin-bottom: 20px;">Thank you again for your contribution.</p>
        <p style="font-size: 14px; font-style: italic; color: #6C757D;">Best regards,<br>Zade Lava Zade Jagva (झाडे लावा झाडे
          जगवा)</p>
      </div>
    `,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    } else {
      console.log("Email sent successfully: " + info.response);
      res.status(200).send("Email sent successfully");
    }
  });
});

const PORT = process.env.PORT || 3003;
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect to MongoDB
// mongoose.connect("mongodb://localhost:27017/image-uploads", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

const URL = `mongodb://localhost:27017/newdbz`;
// MongoDB configuration
mongoose.connect(URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

{
  /**Upcoming events start */
}
// Define a schema for the UpcomingEvent model
const upcomingEventSchema = new mongoose.Schema({
  eventName: String,
  eventDescription: String,
  eventUpDate: Date,
  startTime: String,
  endTime: String,
});

const UpcomingEvent = mongoose.model("UpcomingEvent", upcomingEventSchema);

app.get("/api/getUpcomingEvents", async (req, res) => {
  try {
    // Fetch upcoming events from the database
    const upcomingEvents = await UpcomingEvent.find();

    // Send the upcoming events as the response
    res.json(upcomingEvents);
  } catch (error) {
    console.error("Error fetching upcoming events:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Endpoint to handle adding upcoming events
app.post("/addUpcomingEvent", async (req, res) => {
  try {
    // Extract data from the request body
    const { eventName, eventDescription, eventUpDate, startTime, endTime } =
      req.body;

    // Create a new UpcomingEvent document
    const newEvent = new UpcomingEvent({
      eventName,
      eventDescription,
      eventUpDate,
      startTime,
      endTime,
    });

    // Save the new event to the database
    await newEvent.save();

    res.status(201).json({ message: "Upcoming event added successfully!" });
  } catch (error) {
    console.error("Error adding upcoming event:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

{
  /**end Upcoming Events */
}

// Define the User schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("User", userSchema);

//for create admin username and password
// const user = new User({
//   username: "pradip",
//   password: bcrypt.hashSync("123456", 10),
// });
// console.log(user.password);

// user
//   .save()
//   .then(() => {
//     console.log("User added successfully");
//   })
//   .catch((err) => {
//     console.error("Error adding user:", err);
//   });

// Login route
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate username and password against the database
    const user = await User.findOne({ username });
    console.log("User from database:", user);

    const trimmedPassword = password.trim();
    if (!user || !bcrypt.compareSync(trimmedPassword, user.password)) {
      console.error("Invalid username or passworddd");
      return res.status(401).json({ error: "Invalid username or password" });
    }

    console.log("Stored Password:", user.password);
    console.log("Provided Password:", password);

    // Generate a JWT
    const token = jwt.sign({ username: "testuser" }, "your_key", {
      expiresIn: "600", // Set the expiration time for the token
    });

    res.json({ token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Define the Image model
const imageSchema = new mongoose.Schema({
  name: String,
  path: String,
  activityName: String,
  caption: String,
  // description: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Image = mongoose.model("Image", imageSchema);

const activitySchema = new mongoose.Schema({
  name: String,
  date: String,
  caption: String,
  description: String,
  category: String,
  thumbnail: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Image",
  },
  imageIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Image" }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Activity = mongoose.model("Activity", activitySchema);

const contactInfoSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
});

const ContactInfo = mongoose.model("contactInfo", contactInfoSchema);

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: function (req, file, cb) {
    console.log(file, "ffiiiilllllee");
    const date = new Date();
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();
    const fileName = `${file.originalname}-${day}${month}${year}-${path.extname(
      file.originalname
    )}`;

    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

// Add this route after your existing /upload route
app.get("/images", async (req, res) => {
  try {
    // Fetch all images from the database
    const images = await Image.find();

    // Map the images to include a 'url' property
    const imageArray = images.map((image) => ({
      name: image.name,
      path: image.path,
      caption: image.caption,
      activityId: image.activityId,
      activityName: image.activityName,
      description: image.description,
      createdAt: image.createdAt,
      url: `/uploads/${image.path}`,
    }));

    res.status(200).json(imageArray);
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Set up a route to handle image uploads
app.post("/upload", upload.array("image", 5), async (req, res) => {
  try {
    const {
      activityId,
      activityName,
      event_caption,
      event_description,
      category,
      thumbnail_img_index,
      captions,
      // descriptions,
    } = req.body;
    console.log(activityId, "actiId");
    let objectIdActivityId;
    try {
      objectIdActivityId = new mongoose.Types.ObjectId(activityId);
    } catch (error) {
      console.error("Error creating ObjectId for activityId:", error);
      console.error("Invalid activityId:", activityId);
      return res.status(400).json({ error: "Invalid activityId" });
    }

    const files = req.files;
    // const imageArray = [];
    // const captions = req.body.captions;

    if (!activityId) {
      return res.status(400).json({ error: "ActivityId is required" });
    }

    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No images uploaded" });
    }

    const imageArray = files.map((file, index) => {
      const { filename, path } = file;
      const caption = captions[index] || "";
      const ActivityName = activityName || "";
      // const caption = req.body.captions ? req.body.captions : "";
      // const description = descriptions[index] || "";

      return new Image({
        name: filename,
        path: path,
        activityName: ActivityName,
        caption: caption,
        // description: description,
      });
    });
    console.log(thumbnail_img_index, event_caption, event_description, "ab");
    let imageIds = (await Image.insertMany(imageArray)).map((doc) => doc._id);
    console.log(
      {
        thumbnail: imageIds[thumbnail_img_index],
        caption: event_caption,
        description: event_description,
      },
      "abcde"
    );
    let query = {
      $push: { imageIds: { $each: imageIds } },
      $set: {
        ...(thumbnail_img_index
          ? { thumbnail: imageIds[thumbnail_img_index] }
          : {}),
        activityName: activityName,
        caption: event_caption,
        description: event_description,
        category,
      },
    };
    Activity.findByIdAndUpdate(activityId, query, { new: true })
      .then((updatedEvent) => {
        console.log("Event updated successfully:", updatedEvent);
      })
      .catch((error) => {
        console.error("Error updating event:", error);
      });

    res.status(201).json({
      message: "Image, caption uploaded successfully",
    });
  } catch (error) {
    console.error("Error uploading images:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Get Activities
app.get("/activities", async (req, res) => {
  try {
    const activities = await Activity.find()
      .populate("imageIds")
      .populate("thumbnail");
    console.log("activite", activities.length);
    res.status(200).json(activities);
  } catch (error) {
    console.error("Error fetching activities:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/activities/latest", async (req, res) => {
  try {
    const activities = await Activity.aggregate([
      {
        $lookup: {
          from: "images",
          localField: "thumbnail",
          foreignField: "_id",
          as: "thumbnail",
        },
      },
      {
        $unwind: "$thumbnail", // Unwind the array produced by the $lookup stage
      },
      {
        $sort: { _id: -1 }, // Sort by activityId in descending order
      },
      {
        $group: {
          _id: "$category",
          activities: { $push: "$$ROOT" }, // Push each document into the activities array
        },
      },
    ]);

    res.status(200).json(activities);
  } catch (error) {
    console.error("Error fetching activities:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/activity/:id", async (req, res) => {
  try {
    const activity = await Activity.findById({ _id: req.params.id })
      .populate("imageIds")
      .populate("thumbnail");
    res.status(200).json(activity);
  } catch (error) {
    console.error("Error creating activity:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Create a new activity
app.post("/activities", async (req, res) => {
  try {
    const {
      name,
      date,
      event_description: description,
      event_caption: caption,
      category,
    } = req.body;
    if (!name || !date) {
      return res.status(400).json({ error: "Both name and date are required" });
    }
    const newActivity = new Activity({
      name,
      date,
      caption,
      description,
      category,
    });
    await newActivity.save();
    res.status(201).json({ message: "Activity created successfully" });
  } catch (error) {
    console.error("Error creating activity:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const newContactInfo = new ContactInfo({ name, email, message });
    await newContactInfo.save();
    // Send confirmation email to the user
    const mailOptions = {
      from: "your@gmail.com", // Replace with your Gmail address
      to: email,
      subject: "Contact Information Received",
      html: `
        <p>Dear <strong>${name}</strong>,</p>
        <p>Thank you for reaching out to us. We have received your contact information and will get back to you as soon as possible.</p>
        <p>Your Message:</p>
        <p>${message}</p>
        <p>Best regards,<br>Your NGO Team (झाडे लावा झाडे जगवा)</p>
      `,
    };

    // Send the confirmation email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
      } else {
        console.log("Confirmation Email sent successfully: " + info.response);
        res
          .status(201)
          .json({ message: "Contact information saved successfully" });
      }
    });
    res.status(201).json({ message: "Contact information saved successfully" });
  } catch (error) {
    console.error("Error saving contact information:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
