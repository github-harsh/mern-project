const express   = require('express');
const router    = express.Router();
const gravatar  = require('gravatar');
const bcrypt    = require('bcryptjs');
const jwt       = require('jsonwebtoken');
const config    = require('config');
const {check, validationResult} = require('express-validator');

// Importing the User model
const User = require('../../models/User');


// @route  POST api/user
// @desc   Authenticate User and get token
// @access Public (no token required)
router.post('/', [
    check('name', 'Name is required')
      .not()
      .isEmpty(),
    check('email','Please include valid email').isEmail(),
    check(
        'password', 
        'Please enter password with minimum 6 characters'
    ).isLength({min: 6})
],
async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }  

    // Extracting data from request body and storing in individual variables
    const {name, email, password} = req.body;

    try {
        // Get user
        let user = await(User.findOne({ email }));
        // Check if user exists
        if(user){
            return res.status(400).json({errors: [{msg: 'User already exists'}] });
        }

        // s - default size, r - rating, d - default

        const avatar = gravatar.url(email, {
            s: "200",
            r: "pg",
            d: "mm"
        });

        // Create User object
        user = new User({
            name,
            email,
            avatar,
            password
        });

        // Create a variable to do the hashing with
        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);

        await user.save();

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