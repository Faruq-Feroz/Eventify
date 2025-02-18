require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("\u274C MONGO_URI is missing in .env file");
  process.exit(1);
}

// CORS Configuration
app.use(cors({
  origin: ["https://your-frontend-url.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

// Middleware
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Debugging Middleware for Requests
app.use((req, res, next) => {
  console.log(`\u2705 ${req.method} Request to ${req.url}`);
  next();
});

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("\u2705 MongoDB Connected Successfully"))
  .catch((err) => {
    console.error("\u274C MongoDB Connection Error:", err.message);
    process.exit(1);
  });

// Event Schema & Model
const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  event_date: String,
  time: String,
  location: String,
  organizer: String,
  max_attendees: Number,
  category: String,
  image_url: String,
  is_archived: { type: Boolean, default: false },
  is_favorite: { type: Boolean, default: false },
});
const Event = mongoose.model("Event", eventSchema);

// Multer Storage Setup
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Routes
app.get("/", (req, res) => {
  res.send("Eventify API is running...");
});

// Fetch all events
app.get("/api/events", async (req, res) => {
  try {
    const events = await Event.find().exec();
    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// Fetch a single event by ID
app.get("/api/events/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).exec();
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json(event);
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({ error: "Failed to fetch the event" });
  }
});

// Create a new event
app.post("/api/events", upload.single("image"), async (req, res) => {
  try {
    const { title, description, event_date, time, location, organizer, max_attendees, category } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;
    const newEvent = new Event({ title, description, event_date, time, location, organizer, max_attendees, category, image_url });
    await newEvent.save();
    res.status(201).json({ message: "Event created successfully", event: newEvent });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ error: "Failed to create event" });
  }
});

// Archive an event
app.put("/api/events/:id/archive", async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, { is_archived: true }, { new: true }).exec();
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json({ message: "Event archived", event });
  } catch (error) {
    console.error("Error archiving event:", error);
    res.status(500).json({ error: "Failed to archive event" });
  }
});

// Toggle favorite status for an event
app.put("/api/events/:id/favorite", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).exec();
    if (!event) return res.status(404).json({ error: "Event not found" });
    
    event.is_favorite = !event.is_favorite;
    await event.save();
    
    res.json({ 
      message: `Event ${event.is_favorite ? 'marked as favorite' : 'removed from favorites'}`, 
      event 
    });
  } catch (error) {
    console.error("Error updating favorite status:", error);
    res.status(500).json({ error: "Failed to update favorite status" });
  }
});

// Delete an event
app.delete("/api/events/:id", async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id).exec();
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json({ message: "Event deleted successfully." });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ error: "Failed to delete event." });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`\u2728 Server running on http://localhost:${PORT}`);
});
