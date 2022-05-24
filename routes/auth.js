const express = require("express")
const router=express.Router();
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const config = require("config")
const { check,validationResult }=require("express-validator")
const auth=require("../middleware/auth");
const User = require("../models/User");


/** 
 @api {get} /auth  for login(authorization) of user
 * @apiName getUsers
 * @apiGroup auth
 *
 * @apiSuccess {String}  email of the user
 * @apiSuccess {integer}  password of the user
 * 
 * @apiSuccess jwtoken
 * 
 * @apiError {String} 500
 * @apiError msg:server error
; */
router.get("/",auth,async(req,res) => {
    try {
        const user = await User.findById(req.user.id).select("-password")
        res.json(user);                 
        res.json(user);                 
    }catch(err){
        console.error(err.message);
        res.status(500).send("Server Error")
    }
});



/** 
 @api {post} /auth  for login(authorigation) of user
 * @apiName postUsers
 * @apiGroup auth
 *
 * @apiSuccess {String}  email email of the user
 * @apiSuccess {integer}  password password of the user
 * 
 * @apiSuccess jwtoken
 * 
 * @apiError {String} 400
 * @apiError msg:Client client side error(Bad request)
; */
router.post("/",[

    check("email","please include a valid email").isEmail(),
    check(
        "password",
        "password is required"
    ).exists()

],
async(req,res) => {
    const errors=validationResult(req);
    if (!errors.isEmpty()){
        res.status(400).json({errors: errors.array()})
        return;
    }

    const { email,password }=req.body;

    try{
        const user = await User.findOne({ email })

        if(!user) {        
            res.status(400).json({ errors: [ { msg: "Invalid credentials" }]});
            return;
        }
       
        const isMatch = await bcrypt.compare(password,user.password)

        if (!isMatch) {
           res.status(400).json({ errors: [ { msg: "Invalid credentials" }]});
           return;
        }

        const payload = {
            user: {
                id:user.id
            }
        }

        jwt.sign( 
            payload, 
            config.get("jwtSecret"),
            { expiresIn:360000},
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            } )

    }catch(err){
        console.error(err.message);
        res.status(500).send("server error");
        
    }   
})

module.exports=router;
