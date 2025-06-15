const express = require('express');
const router = express.Router();
const { getShipmentByTracking, createShipment, getAllShipments } = require('../controllers/shipmentController');
const { validateTrackingNumber } = require('../middleware/validation');

// GET route for all shipments
router.get('/', getAllShipments);

// GET route for tracking a shipment
router.get('/:trackingNumber', validateTrackingNumber, getShipmentByTracking);

// POST route for creating a new shipment
router.post('/', createShipment);

module.exports = router; 