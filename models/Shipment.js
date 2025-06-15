const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Shipment = sequelize.define('Shipment', {
  tracking_number: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
    unique: true,
    defaultValue: () => `SHIP${Date.now().toString().slice(-6)}${Math.random().toString(36).slice(-4).toUpperCase()}`
  },
  status: {
    type: DataTypes.ENUM,
    values: [
      'pending',
      'picked_up',
      'in_transit',
      'out_for_delivery',
      'delivered',
      'failed_delivery',
      'returned',
      'exception'
    ],
    allowNull: false,
    defaultValue: 'pending'
  },
  current_location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  origin_address: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  destination_address: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  delivery_estimate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  actual_delivery: {
    type: DataTypes.DATE,
    allowNull: true
  },
  package_type: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'package'
  },
  weight: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  dimensions: {
    type: DataTypes.JSON,
    allowNull: true
  },
  shipping_service: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'standard'
  },
  signature_required: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  tracking_history: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: []
  },
  special_instructions: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  customer_reference: {
    type: DataTypes.STRING,
    allowNull: true
  },
  estimated_cost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  }
}, {
  timestamps: true,
  hooks: {
    beforeUpdate: (shipment) => {
      // Add status change to tracking history
      if (shipment.changed('status') || shipment.changed('current_location')) {
        const newHistory = {
          timestamp: new Date(),
          status: shipment.status,
          location: shipment.current_location,
          description: `Shipment ${shipment.status} at ${shipment.current_location}`
        };
        
        shipment.tracking_history = [
          newHistory,
          ...(shipment.tracking_history || [])
        ];
      }
    }
  }
});

module.exports = Shipment; 