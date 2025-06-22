const AM = require('../model/adminModel')
const bcrypt = require('bcrypt');
const req = require('express/lib/request');
const { status } = require('express/lib/response');
const jwt = require('jasonwebtoken');

exports.createAdmin = async (req,res) =>{
    try {
        const {email, password} = req.body

        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = await AM.create({
            email,
            password:hashedPassword
        });
        res.status(201).json({
            status:'success',
            message:' admin created successfully',
            data:{email:admin.email}
        })
    } catch (error) {
             res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
}


exports.adminLogin = async (req, res) => {
     try {
        const {email,password} = req.body

        const admin = await AM.findOne({email});
        if(!admin){
            return res.status(401).json({
                status: 'fail',
                message:'Invalid email'
            })
        }

        const isMatch = await bcrypt.compare(password, admin.password)
        if (!isMatch) {
            return res.status(401).json({ status: 'fail', message: 'Invalid password' });
        }

         const token = jwt.sign({ id: admin._id, email: admin.email }, 'caratcart');
        
        res.status(200).json({ status: 'success', message: 'Login successful',token:token });
     
    } catch (error) {
                res.status(500).json({ status: 'fail', message: error.message });

     }

}