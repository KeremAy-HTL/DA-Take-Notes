import { body } from 'express-validator';
import * as model from '../model/user.js';

const htlwienwestRegex = /@htlwienwest\.at$/i;

const validateSignup = [
  body('firstName')
    .trim()
    .isString()
    .isLength({ min: 3 })
    .withMessage('First name must be at least 3 characters long'),
  body('lastName')
    .trim()
    .isString()
    .isLength({ min: 3 })
    .withMessage('Last name must be at least 3 characters long'),
  body('email')
    .trim()
    .isString()
    .isEmail()
    .withMessage('Invalid email format')
    .custom(async (value) => {
      const emailExists = await model.emailExists(value.toLowerCase());
      if (emailExists.length > 0) {
        throw new Error('Email already exists');
      }
    })
    .custom((value) => {
      if (!htlwienwestRegex.test(value)) {
        throw new Error('Email must be a @htlwienwest.at address');
      }
      return true;
    })
    .custom((value) => {
      if (value.toLowerCase().includes('admin')) {
        throw new Error('Email must not contain the word "admin"');
      }
      return true;
    }),
  body('password')
    .trim()
    .isString()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  body('confirmPassword')
    .trim()
    .isString()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
];

const validateSignin = [
  body('email').trim().isString().isEmail()
    .withMessage('Invalid email format'),
  body('password')
    .trim()
    .isString()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
];

const validateUpdatePassword = [
  body('oldPassword')
    .trim()
    .isString()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  body('newPassword')
    .trim()
    .isString()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  body('confirmPassword')
    .trim()
    .isString()
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
];

const validateUpdateName = [
  body('newFirstName')
    .trim()
    .isString()
    .isLength({ min: 3 })
    .withMessage('First name must be at least 3 characters long'),
  body('newLastName')
    .trim()
    .isString()
    .isLength({ min: 3 })
    .withMessage('Last name must be at least 3 characters long'),
  body('password')
    .trim()
    .isString()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
];

export { validateSignup, validateSignin, validateUpdatePassword, validateUpdateName };
