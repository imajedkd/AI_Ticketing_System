const { body, param, validationResult } = require('express-validator');

const validateTicketCreation = [
  body('customer_name')
    .trim()
    .notEmpty()
    .withMessage('Customer name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Customer name must be between 2 and 100 characters'),
  
  body('tracking_number')
    .trim()
    .notEmpty()
    .withMessage('Tracking number is required')
    .matches(/^[A-Za-z0-9-]+$/)
    .withMessage('Invalid tracking number format'),
  
  body('issue_description')
    .trim()
    .notEmpty()
    .withMessage('Issue description is required')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Issue description must be between 10 and 1000 characters'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const validateTrackingNumber = [
  param('trackingNumber')
    .trim()
    .notEmpty()
    .withMessage('Tracking number is required')
    .matches(/^[A-Za-z0-9-]+$/)
    .withMessage('Invalid tracking number format'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = {
  validateTicketCreation,
  validateTrackingNumber
}; 