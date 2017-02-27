import express from 'express';
import Account from '../models/account';

const accRouter = express.Router();

/*
    회원가입 구현 : POST /api/account/signup
    BODY SAMPLE: { "username": "test", "password": "test" }
    ERROR CODES:
        1: BAD USERNAME
        2: BAD PASSWORD
        3: USERNAM EXISTS
*/
accRouter.post('/singup', (req,res)=>{

    //Check username format
    let usernameRegex = /^[a-z0-9]+$/;
    if(!usernameRegex.test(req.body.username)){
        return rest.status(400).json({
            error : "wrong username",
            code : 1
        });
    }

    //Check password length
    if(req.body.password.length < 4 || typeof req.body.password !== 'string'){
        return res.status(400).json({
            error : "wrong password",
            code : 2
        });
    }

    //check user existnace
    Account.findOne({username : req.body.username} , (err, exists)=>{
        if(err) throw err;
        if(exists){
            return res.status(409).json({
                error : "username exsist",
                code: 3
            })
        }

        //create account
        let account = new Account({
            username : req.body.username,
            password : req.body.password
        });

        account.password = account.generateHash(account.password);

        //save in the database
        account.save(err =>{
            if(err) throw err;
            return res.json({success: true});
        })
    });

});

/*
    로그인 구현: POST /api/account/signin
    BODY SAMPLE: { "username": "test", "password": "test" }
    ERROR CODES:
        1: LOGIN FAILED
*/
accRouter.post('/singin', (req,res)=>{

    //check password
    if(typeof req.body.password !== "string") {
        return res.status(401).json({
            error: "login failed",
            code: 1
        });
    }

    // find user by username
    Account.findOne({ username: req.body.username}, (err, account) => {
        if(err) throw err;

        // check account exsist and check passwrod is vaild
        if(!account || !account.validateHash(req.body.password)) {
            return res.status(401).json({
                error: "login failed",
                code: 1
            });
        }

        // alert session
        let session = req.session;
        session.loginInfo = {
            _id: account._id,
            username: account.username
        };

        // RETURN SUCCESS
        return res.json({
            success: true
        });
    });
});

/*
    세션 확인 구현
    GET CURRENT USER INFO GET /api/account/getInfo
*/
accRouter.get('/getinfo', (req,res)=>{
    if(typeof req.session.loginInfo === "undefined"){
        return res.status(401).json({
            error:1
        });
    }

    res.json({info: req.session.loginInfo});
});
/*
    로그아웃 구현
    LOGOUT: POST /api/account/logout
*/
accRouter.post('/logout', (req,res)=>{
    req.session.destroy(err => { if(err) throw err; });
    return res.json({ sucess: true });
});

export default accRouter;
