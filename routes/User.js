const express = require("express")
const router=express.Router();
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const config = require("config")
const { check,validationResult }=require("express-validator")

const User=require("../models/User")

/** 
 @api {post} /user  for regestration(authentication) of user
 * @apiName postUsers
 * @apiGroup users
 *
 * @apiSuccess {String} Username Username of the user
 * @apiSuccess {String} email email of the user
 * @apiSuccess {number} password password of the user
 * @apiSuccess {String} CreatedBy get the CreatedBy
 * @apiSuccess {integer} CreatedAt get the date of CreatedAt
 * 
 * @apiSuccess jwtoken
 * 
 * @apiError {String} 500
 * @apiError msg:server  server error
; */
router.post("/",[
    check("Username","Name is required") 
        .not()
        .isEmpty(),
    check("email","please include a valid email").isEmail(),
    check(
        "password",
        "please enter a password with 6 or more characters"
    ).isLength({ min:6 ,max:12 }),
    check(
        "CreatedBy",
        "please enter the creater name"
    ).not().isEmpty(),

    
    check("email").custom(async(email) => {
      const user=await User.findOne({ email})
      if (user){
          throw new Error("email is already exist")
      }
      return true
    })

],
async(req,res) => {
    const errors=validationResult(req);
    if (!errors.isEmpty()){
        res.status(400).json({errors: errors.array()})
        return;
    }

    const { Username,email,password }=req.body;

    try{
        const user = new User({
            Username,
            email,
            password
        })
       
        const salt = await bcrypt.genSalt(10);   

        user.password = await bcrypt.hash(password,salt)

        await user.save();
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
