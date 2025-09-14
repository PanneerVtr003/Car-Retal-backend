const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingCode: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String, required: true },
  pickupDate: { type: Date, required: true },
  returnDate: { type: Date, required: true },
  pickupLocation: { type: String, required: true },
  carModel: { type: String, required: true },
  carId: { type: String, required: true },
  specialRequests: { type: String, default: "" },
  rentalDays: { type: Number, required: true },
  dailyRate: { type: Number, required: true },
  subtotalAmount: { type: Number },
  taxAmount: { type: Number },
  totalAmount: { type: Number, required: true },
  emailSent: { type: Boolean, default: false },
  status: { type: String, enum: ["confirmed", "cancelled", "completed"], default: "confirmed" },
  createdAt: { type: Date, default: Date.now }
});

// Generate a unique booking code before saving
bookingSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await mongoose.model('Booking').countDocuments();
    this.bookingCode = `BR${(count + 1).toString().padStart(6, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);