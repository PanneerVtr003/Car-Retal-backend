import express from "express";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb+srv://panneerycse2022_db_user:Lo3FMmxKxezMZMCk@cluster2.0hv1qdo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster2", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error(err));

// Booking schema

const bookingSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    carModel: String,
    pickupDate: Date,
    returnDate: Date,
    location: String,
    requests: String,
    dailyRate: Number,
    rentalDays: Number,
    totalAmount: String,
    bookingId: String,
    createdAt: { type: Date, default: Date.now }
});

const Booking = mongoose.model("Booking", bookingSchema);

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "panneerselvam944393@gmail.com",
    pass: "fnbkuyazuvad oeyq" // App password
  }
});

// POST /api/bookings
app.post("/api/bookings", async (req, res) => {
    try {
        const bookingData = req.body;
        const bookingId = "BK" + Math.floor(100000 + Math.random() * 900000);

        const newBooking = new Booking({ ...bookingData, bookingId });
        await newBooking.save();

        const emailHTML = `
            <h2>Booking Confirmation - ${bookingId}</h2>
            <p>Dear ${bookingData.name},</p>
            <p>Your booking is confirmed!</p>
            <p><strong>Car:</strong> ${bookingData.carModel}</p>
            <p><strong>Pickup:</strong> ${new Date(bookingData.pickupDate).toLocaleDateString()} at ${bookingData.location}</p>
            <p><strong>Return:</strong> ${new Date(bookingData.returnDate).toLocaleDateString()}</p>
            <p><strong>Duration:</strong> ${bookingData.rentalDays} days</p>
            <p><strong>Total:</strong> ${bookingData.totalAmount}</p>
            ${bookingData.requests ? `<p><strong>Special Requests:</strong> ${bookingData.requests}</p>` : ""}
            <p>Thank you,<br/>CarRent Team</p>
        `;

        await transporter.sendMail({
            from: `"CarRent" <panneerselvam944393@gmail.com>`,
            to: bookingData.email,
            subject: `Booking Confirmation - ${bookingId}`,
            html: emailHTML
        });

        res.json({ success: true, bookingId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Booking failed" });
    }
});

// Start server
app.listen(5002, () => console.log("Server running on port 5001"));
