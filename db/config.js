const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const mongoURI = process.env.MONGO_URI;

async function connectDB() {
  try {
    await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('--------connect to mongoDB---------');
  } catch (error) {
    console.error(error.message);
  }
}

module.exports = connectDB;
