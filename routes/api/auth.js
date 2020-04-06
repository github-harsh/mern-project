const express   = require('express');
const router    = express.Router();
const auth      = require('../../middleware/auth');
const jwt       = require('jsonwebtoken');
const config    = require('config');
const bcrypt    = require('bcryptjs');
const {check, validationResult} = require('express-validator');


const User = require('../../models/User');

router.get(
    '/',
    auth,  // Whenever we want to use middleware, we add it as a second parameter  
    async (req, res) => {
        try {
            // We get req.user here because we set it in the middleware
            const user = await User.findById(req.user.id).select('-password');
            res.json(user);
        } catch (err) {
            console.err(err.message);
            res.status(500).send('Server error');
        }   
});



// @route  POST api/users
// @desc   Authenticate User
// @access Public (no token required)
router.post(
    '/', 
    [
        check('email','Please include valid email').isEmail(),
        check('password', 'Password is required').exists()
    ],
async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }  

    // These are the details the user has entered
    const {email, password} = req.body;

    try {
        // This user will contain the encrypted password from the database
        let user = await(User.findOne({ email }));
        // Check if user exists
        if(!user){
            return res
                .status(400)
                .json({errors: [{msg: 'Invalid credentials'}] });
        }

        // Here the database password and the user entered password will be compared
        const isMatch = await bcrypt.compare(password, user.password); // password - entered by user, user.password - from database

        if(!isMatch){
            return res
                .status(400)
                .json({errors: [{msg: 'Invalid credentials s'}] });
        }

        const payload = {
            user : {
                id: user.id,  // user.id comes after we hash the password
            }
        }

        jwt.sign(
            payload, 
            config.get('jwtSecret'),
            {expiresIn: 360000},
            (err, token) => {
                if(err) throw err;
                res.json({token});
            });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');        
    }


});



module.exports = router;