const Shipment = require('../models/Shipment');

// Mock data for shipments with enhanced information
const mockShipments = [
  {
    tracking_number: 'SHIP123456',
    status: 'in_transit',
    current_location: 'New York Distribution Center, NY',
    origin_address: '123 Sender St, Los Angeles, CA 90001',
    destination_address: '456 Receiver Ave, Boston, MA 02101',
    delivery_estimate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    package_type: 'Large Box',
    weight: 5.2,
    dimensions: { length: 30, width: 20, height: 15, unit: 'cm' },
    shipping_service: 'Express',
    signature_required: true,
    special_instructions: 'Please handle with care - Fragile items',
    customer_reference: 'ORD-789',
    estimated_cost: 45.99,
    tracking_history: [
      {
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        status: 'in_transit',
        location: 'New York Distribution Center, NY',
        description: 'Package arrived at distribution center'
      },
      {
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
        status: 'in_transit',
        location: 'Chicago Sorting Facility, IL',
        description: 'Package departed sorting facility'
      },
      {
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        status: 'picked_up',
        location: 'Los Angeles, CA',
        description: 'Package picked up by courier'
      }
    ]
  },
  {
    tracking_number: 'SHIP789012',
    status: 'out_for_delivery',
    current_location: 'Los Angeles Local Delivery, CA',
    origin_address: '789 Sender Ave, Miami, FL 33101',
    destination_address: '321 Receiver Blvd, Los Angeles, CA 90001',
    delivery_estimate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    package_type: 'Small Box',
    weight: 2.1,
    dimensions: { length: 15, width: 10, height: 10, unit: 'cm' },
    shipping_service: 'Standard',
    signature_required: false,
    special_instructions: null,
    customer_reference: 'ORD-456',
    estimated_cost: 25.50,
    tracking_history: [
      {
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        status: 'out_for_delivery',
        location: 'Los Angeles Local Delivery, CA',
        description: 'Package is out for delivery'
      },
      {
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        status: 'in_transit',
        location: 'Los Angeles Distribution Center, CA',
        description: 'Package arrived at local facility'
      },
      {
        timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
        status: 'picked_up',
        location: 'Miami, FL',
        description: 'Package picked up by courier'
      }
    ]
  }
];

const getAllShipments = async (req, res) => {
  try {
    const shipments = await Shipment.findAll({
      order: [['createdAt', 'DESC']] // Most recent first
    });
    res.json(shipments);
  } catch (error) {
    console.error('Error fetching shipments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const createShipment = async (req, res) => {
  try {
    const shipmentData = req.body;
    
    // Create the shipment
    const shipment = await Shipment.create(shipmentData);
    
    res.status(201).json(shipment);
  } catch (error) {
    console.error('Error creating shipment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getShipmentByTracking = async (req, res) => {
  try {
    const { trackingNumber } = req.params;
    
    // First check the database
    let shipment = await Shipment.findByPk(trackingNumber);
    
    // If not in database, check mock data
    if (!shipment) {
      const mockShipment = mockShipments.find(s => s.tracking_number === trackingNumber);
      if (mockShipment) {
        try {
          // Store mock data in database
          shipment = await Shipment.create(mockShipment);
        } catch (error) {
          console.error('Error creating mock shipment:', error);
          // If creation fails, just return the mock data
          return res.json(mockShipment);
        }
      }
    }

    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found' });
    }

    res.json(shipment);
  } catch (error) {
    console.error('Error fetching shipment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Initialize mock data
const initializeMockData = async () => {
  try {
    console.log('Initializing mock shipment data...');
    for (const mockShipment of mockShipments) {
      try {
        await Shipment.findOrCreate({
          where: { tracking_number: mockShipment.tracking_number },
          defaults: mockShipment
        });
        console.log(`Created/found shipment: ${mockShipment.tracking_number}`);
      } catch (error) {
        console.error(`Error creating shipment ${mockShipment.tracking_number}:`, error);
      }
    }
    console.log('Mock shipment data initialization completed');
  } catch (error) {
    console.error('Error initializing mock data:', error);
  }
};

module.exports = {
  getAllShipments,
  getShipmentByTracking,
  createShipment,
  initializeMockData
}; 