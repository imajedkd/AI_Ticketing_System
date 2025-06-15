require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const shipmentRoutes = require('./routes/shipmentRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const { initializeMockData } = require('./controllers/shipmentController');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve static files from public directory

// Routes
app.use('/api/shipments', shipmentRoutes);
app.use('/api/tickets', ticketRoutes);

// Database sync and server start
const startServer = async () => {
  try {
    // Force sync to recreate tables
    await sequelize.sync({ force: true });
    console.log('Database synced successfully');
    
    // Initialize mock shipment data
    await initializeMockData();
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Admin panel available at http://localhost:${PORT}`);
      console.log(`Tracking page available at http://localhost:${PORT}/track.html`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
  }
};

startServer(); 