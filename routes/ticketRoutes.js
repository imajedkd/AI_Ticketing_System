const express = require('express');
const router = express.Router();
const { createTicket, getAllTickets } = require('../controllers/ticketController');
const { validateTicketCreation } = require('../middleware/validation');

router.get('/', getAllTickets);
router.post('/', validateTicketCreation, createTicket);

module.exports = router; 