const Ticket = require('../models/Ticket');
const Shipment = require('../models/Shipment');

const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.findAll({
      order: [['created_at', 'DESC']] // Most recent first
    });
    res.json(tickets);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const createTicket = async (req, res) => {
  try {
    const { customer_name, tracking_number, issue_description } = req.body;

    // Check if shipment exists
    const shipment = await Shipment.findByPk(tracking_number);
    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found' });
    }

    // Create ticket
    const ticket = await Ticket.create({
      customer_name,
      tracking_number,
      issue_description,
      status: 'open'
    });

    res.status(201).json(ticket);
  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getAllTickets,
  createTicket
}; 