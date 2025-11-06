const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin'); // Adjust path based on your structure
const bcrypt = require('bcryptjs'); // For password hashing

// ✅ GET ALL ADMINS
router.get('/getadmins', async (req, res) => {
  try {
    const admins = await Admin.find().select('-password -otp'); // Exclude password and OTP
    res.status(200).json(admins);
  } catch (error) {
    console.error('Error fetching admins:', error);
    res.status(500).json({ 
      error: 'Failed to fetch admins',
      details: error.message 
    });
  }
});

// ✅ GET SINGLE ADMIN BY ID
router.get('/getadmin/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findById(id).select('-password -otp'); // Exclude password and OTP
    
    if (!admin) {
      return res.status(404).json({ 
        error: 'Admin not found',
        message: 'Admin with this ID does not exist' 
      });
    }

    res.status(200).json(admin);
  } catch (error) {
    console.error('Error fetching admin:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        error: 'Invalid admin ID',
        message: 'The provided ID is not valid' 
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to fetch admin',
      details: error.message 
    });
  }
});

// ✅ ADD NEW ADMIN
router.post('/addadmin', async (req, res) => {
  try {
    const { name, email, password, about, phone, address, billingpostcode, profilepic } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ 
        error: 'Validation error',
        message: 'Name, email, and password are required' 
      });
    }

    // Check if admin with same email already exists
    const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
    if (existingAdmin) {
      return res.status(409).json({ 
        error: 'Email already exists',
        message: 'An admin with this email already exists' 
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new admin
    const newAdmin = new Admin({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      about: about || '',
      phone: phone || '',
      address: address || '',
      billingpostcode: billingpostcode || '',
      admin: true, // Set admin flag to true
      profilepic: profilepic || '/avatar.png',
      timestamp: new Date()
    });

    const savedAdmin = await newAdmin.save();

    // Return admin without password
    const adminResponse = savedAdmin.toObject();
    delete adminResponse.password;
    delete adminResponse.otp;

    res.status(201).json({
      message: 'Admin added successfully',
      data: adminResponse
    });
  } catch (error) {
    console.error('Error adding admin:', error);
    res.status(500).json({ 
      error: 'Failed to add admin',
      details: error.message 
    });
  }
});

// ✅ UPDATE ADMIN
router.put('/updateadmin/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, about, phone, address, billingpostcode, profilepic } = req.body;

    // Find admin
    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ 
        error: 'Admin not found',
        message: 'Admin with this ID does not exist' 
      });
    }

    // Check if email is being updated and if it already exists (excluding current admin)
    if (email && email.toLowerCase() !== admin.email) {
      const existingAdmin = await Admin.findOne({ 
        email: email.toLowerCase(),
        _id: { $ne: id } // Exclude current admin
      });
      
      if (existingAdmin) {
        return res.status(409).json({ 
          error: 'Email already exists',
          message: 'An admin with this email already exists' 
        });
      }
    }

    // Update fields
    const updateData = {};
    if (name) updateData.name = name.trim();
    if (email) updateData.email = email.toLowerCase().trim();
    if (about !== undefined) updateData.about = about;
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;
    if (billingpostcode !== undefined) updateData.billingpostcode = billingpostcode;
    if (profilepic !== undefined) updateData.profilepic = profilepic;

    // Hash password if provided
    if (password && password.trim().length > 0) {
      const saltRounds = 10;
      updateData.password = await bcrypt.hash(password, saltRounds);
    }

    // Update admin
    const updatedAdmin = await Admin.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password -otp');

    res.status(200).json({
      message: 'Admin updated successfully',
      data: updatedAdmin
    });
  } catch (error) {
    console.error('Error updating admin:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        error: 'Invalid admin ID',
        message: 'The provided ID is not valid' 
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to update admin',
      details: error.message 
    });
  }
});

// ✅ DELETE ADMIN
router.delete('/deleteadmin/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete admin
    const admin = await Admin.findByIdAndDelete(id);

    if (!admin) {
      return res.status(404).json({ 
        error: 'Admin not found',
        message: 'Admin with this ID does not exist' 
      });
    }

    res.status(200).json({
      message: 'Admin deleted successfully',
      data: { id: admin._id, name: admin.name, email: admin.email }
    });
  } catch (error) {
    console.error('Error deleting admin:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        error: 'Invalid admin ID',
        message: 'The provided ID is not valid' 
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to delete admin',
      details: error.message 
    });
  }
});

module.exports = router;

