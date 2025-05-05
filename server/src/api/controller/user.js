import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { validationResult } from 'express-validator';
import { getDate, sendVerificationEmail } from '../../services/email.js';
import * as model from '../model/user.js';
import * as validator from '../validators/validators.js';

dotenv.config();

const salt = bcrypt.genSaltSync(10);

const signup = async (req, res) => {
  await Promise.all(validator.validateSignup.map((validation) => validation.run(req)));
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const newUser = {
    firstName: req.body.firstName.charAt(0).toUpperCase() + req.body.firstName.slice(1),
    lastName: req.body.lastName.charAt(0).toUpperCase() + req.body.lastName.slice(1),
    email: req.body.email.toLowerCase(),
    createdAt: getDate(),
    updatedAt: getDate(),
    verified: false,
    hashedPassword: bcrypt.hashSync(req.body.password, salt),
  };

  try {
    const result = await model.signup(
      newUser.firstName,
      newUser.lastName,
      newUser.email,
      newUser.createdAt,
      newUser.updatedAt,
      newUser.verified,
      newUser.hashedPassword,
    );
    const info = await sendVerificationEmail(result[0], res);

    return res.status(201).json({
      status: 'PENDING',
      message: `Klicke auf den Link in der E-Mail, die wir an ${req.body.email} gesendet haben.`,
      info,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const verifyUser = async (req, res) => {
  const { userId, verificationToken } = req.params; // Ensure the parameter names match the route
  // const currentUrl = process.env.CURRENT_URL;
  try {
    const userVerification = await model.getUserVerification(userId);
    if (userVerification.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    const currentDate = new Date().toISOString();
    if (userVerification[0].expires_at < currentDate) {
      await model.deleteUserVerification(userId);
      return res.status(401).json({ message: 'Verification link expired' });
    }
    const tokenMatch = bcrypt.compareSync(
      verificationToken,
      userVerification[0].verification_token,
    ); // Compare the plain token with the hashed token
    if (!tokenMatch) {
      return res.status(401).json({ message: 'Invalid Token' });
    }
    await model.verifyUser(userId);
    await model.deleteUserVerification(userId);
    return res.status(200).redirect('http://localhost:8080/login');
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const signin = async (req, res) => {
  await Promise.all(validator.validateSignin.map((validation) => validation.run(req)));
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const user = {
    email: req.body.email.toLowerCase(),
    password: req.body.password,
  };

  try {
    const result = await model.signin(user.email);

    if (result.length === 0) {
      return res.status(401).json({ message: 'Email is incorrect' });
    }
    if (!result[0].verified) {
      return res.status(401).json({ message: 'User not verified' });
    }
    const passwordMatch = bcrypt.compareSync(user.password, result[0].password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid Password' });
    }
    return res.status(200).json({ message: 'User logged in', user: result[0] });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const signout = (req, res) => {
  res.status(200).json({ message: 'User logged out' });
};
const delAccount = async (req, res) => {
  const { userId } = req.params;
  await model.delAccount(userId);
  return res.status(200).end();
};

const updatePassword = async (req, res) => {
  await Promise.all(validator.validateUpdatePassword.map((validation) => validation.run(req)));
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const user = {
    userId: Number(req.params.userId),
    password: req.body.oldPassword,
    newPassword: req.body.newPassword,
    confirmPassword: req.body.confirmPassword,
  };

  try {
    const result = await model.getUserById(user.userId);
    if (result.length === 0) {
      return res.status(401).json({ message: 'User not found' });
    }
    if (!result[0].verified) {
      return res.status(401).json({ message: 'User not verified' });
    }
    const passwordMatch = bcrypt.compareSync(user.password, result[0].password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid Password' });
    }
    const hashedPassword = bcrypt.hashSync(user.newPassword, salt);
    const updatedUser = await model.updatePassword(user.userId, hashedPassword);
    return res.status(200).json({ message: 'Password updated', user: updatedUser });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateName = async (req, res) => {
  await Promise.all(validator.validateUpdateName.map((validation) => validation.run(req)));
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const user = {
    userId: Number(req.params.userId),
    firstName: req.body.newFirstName,
    lastName: req.body.newLastName,
    password: req.body.password,
  };

  try {
    const result = await model.getUserById(user.userId);
    if (result.length === 0) {
      return res.status(401).json({ message: 'User not found' });
    }
    if (!result[0].verified) {
      return res.status(401).json({ message: 'User not verified' });
    }
    const passwordMatch = bcrypt.compareSync(user.password, result[0].password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid Password' });
    }
    if (user.firstName === result[0].first_name && user.lastName === result[0].last_name) {
      return res.status(401).json({ message: 'New name is the same as the old one' });
    }
    const updatedUser = await model.updateName(user.userId, user.firstName, user.lastName);
    return res.status(200).json({ message: 'Name updated', user: updatedUser });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export { signup, signin, signout, updatePassword, updateName, verifyUser, delAccount };
