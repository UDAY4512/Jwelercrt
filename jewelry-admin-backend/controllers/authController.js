const Admin=require('../models/Admin');
const jwt = require('jsonwebtoken');    


const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '3d',
    });
}

exports.registerAdmin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        const newAdmin=await Admin.create({
            email,
            password
        });
        res.status(201).json({token:generateToken(newAdmin._id)});
    }catch (error) {
        console.error('Error registering admin:', error);
        res.status(500).json({ message: error.message });
    }   
}

exports.loginAdmin=async (req,res)=>{
    const {email,password}=req.body;

    try{
        const existingAdmin=await Admin.findOne({email});
        if(!existingAdmin){
            return res.status(400).json({message:'Invalid email or password'});
        }
 
    const isMatch = await existingAdmin.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
        res.status(200).json({token: generateToken(existingAdmin._id)});
    }
    catch(error){
        res.status(500).json({ message: error.message });
    }
}

exports.getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.adminId).select('-password');
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    res.json({ admin });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update Admin Password
exports.updatePassword = async (req, res) => {
  try {
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await Admin.findByIdAndUpdate(req.adminId, { password: hashedPassword });

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update password', error: err.message });
  }
};