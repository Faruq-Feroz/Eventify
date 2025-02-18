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
  console.error("❌ MONGO_URI is missing in .env file");
  process.exit(1);
}

// Middleware
app.use(express.json());
app.use(cors({ origin: "*" }));
app.use("/uploads", express.static("uploads"));

// Connect to MongoDB with better error handling
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  });

// Event Schema & Model
const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  event_date: { type: Date, required: true },
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
  res.send("✅ Eventify API is running...");
});

// Upcoming events route
app.get("/api/events/upcoming", async (req, res) => {
  try {
    const today = new Date();
    const upcomingEvents = await Event.find({
      event_date: { $gte: today },
    }).sort({ event_date: 1 });

    res.json(upcomingEvents);
  } catch (error) {
    res.status(500).json({ error: "❌ Failed to fetch upcoming events" });
  }
});

// Archived events route
app.get("/api/events/archived", async (req, res) => {
  try {
    const archivedEvents = await Event.find({ is_archived: true });
    res.json(archivedEvents);
  } catch (error) {
    res.status(500).json({ error: "❌ Failed to fetch archived events" });
  }
});

// Favorite events route
app.get("/api/events/favorites", async (req, res) => {
  try {
    const favoriteEvents = await Event.find({ is_favorite: true });
    res.json(favoriteEvents);
  } catch (error) {
    res.status(500).json({ error: "❌ Failed to fetch favorite events" });
  }
});

// List all events
app.get("/api/events", async (req, res) => {
  try {
    const events = await Event.find().sort({ event_date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: "❌ Failed to fetch events" });
  }
});

// Fetch a single event by ID
app.get("/api/events/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "❌ Event not found" });
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: "❌ Failed to fetch the event" });
  }
});

// Create a new event
app.post("/api/events", upload.single("image"), async (req, res) => {
  try {
    const { title, description, event_date, time, location, organizer, max_attendees, category } = req.body;
    if (!title || !event_date) {
      return res.status(400).json({ error: "❌ Title and event date are required" });
    }

    const image_url = req.file ? `/uploads/${req.file.filename}` : null;
    const newEvent = new Event({
      title,
      description,
      event_date: new Date(event_date),
      time,
      location,
      organizer,
      max_attendees,
      category,
      image_url,
    });

    await newEvent.save();
    res.status(201).json({ message: "✅ Event created successfully", event: newEvent });
  } catch (error) {
    res.status(500).json({ error: "❌ Failed to create event" });
  }
});

// Archive an event
app.put("/api/events/:id/archive", async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, { is_archived: true }, { new: true });
    if (!event) return res.status(404).json({ error: "❌ Event not found" });
    res.json({ message: "✅ Event archived", event });
  } catch (error) {
    res.status(500).json({ error: "❌ Failed to archive event" });
  }
});

// Toggle favorite status
app.put("/api/events/:id/favorite", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "❌ Event not found" });

    event.is_favorite = !event.is_favorite;
    await event.save();

    res.json({ message: `✅ Event ${event.is_favorite ? "marked as favorite" : "removed from favorites"}`, event });
  } catch (error) {
    res.status(500).json({ error: "❌ Failed to update favorite status" });
  }
});

// Delete an event
app.delete("/api/events/:id", async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ error: "❌ Event not found" });

    res.json({ message: "✅ Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "❌ Failed to delete event" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
