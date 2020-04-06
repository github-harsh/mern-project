const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
// Import the auth middleware
const auth = require('../../middleware/auth');

// Import the models
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route   GET api/profile/me
// @desc    Get current user profile details
// @access  Private because we will be sending a token to get a user profile as he will be logged in for that  
router.get(
    '/',
    auth,
    async (req, res) => {
        try {
            
            // We are finding the profile which has the same id as the req.user.id
            // populate function takes 2 parameters. First from where we want to get data and second what 
            // fields we want to get from the first parameter.
            const profile = (await Profile.findOne({ user: req.user.id}).populate('user', ['name', 'avatar']));
            if(!profile){
                return res.status(400).send('No profile found');    
            }

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
});

// @route   POST api/profile
// @desc    Create user profile 
// @access  Private because we will be sending a token to get a user profile as he will be logged in for that  
router.post(
    '/',
    [
        auth,
        [
            check('status', 'Status is required')
            .not()
            .isEmpty(),
            check('skills', 'Skills is required')
            .not()
            .isEmpty()
        ]
    ],
    async (req,res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() })
        }

        const{
            company,
            website,
            location,
            bio,
            status,
            githubusername,
            skills,
            youtube,
            facebook,
            twitter,
            instagram,
            linkedin
        } = req.body;

        // Build profile object
        const profileFields = {};
        profileFields.user = req.user.id; 
        if(company)         profileFields.company        = req.company;
        if(website)         profileFields.website        = req.website;
        if(location)        profileFields.locaiton       = req.location;
        if(bio)             profileFields.bio            = req.bio;
        if(status)          profileFields.status         = req.status;
        if(githubusername)  profileFields.githubusername = req.githubusername;
        if(skills) {
            profileFields.skills = skills.split(',').map(skill => skill.trim());
        }

        // Build social object
        const social = {};
        if(youtube)   profileFields.social.youtube   = youtube;
        if(twitter)   profileFields.social.twitter   = twitter;
        if(facebook)  profileFields.social.facebook  = facebook;
        if(linkedin)  profileFields.social.linkedin  = linkedin;
        if(instagram) profileFields.social.instagram = instagram;

        try {
            let profile = await Profile.findOne({ user: req.user.id });
            if(profile){
                // Update
                profile = await Profile.findOneAndUpdate(
                    { user: req.user.id },
                    { $set: profileFields },
                    { new: true }
                );
                return res.json(profile);
            }

            // Create new profile
            profile = new Profile(profileFields);
            profile.save();
            res.json(profile);
            
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Invalid request')
        }
    }
);

module.exports = router;