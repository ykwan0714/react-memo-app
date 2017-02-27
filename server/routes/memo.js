import express from 'express';
import Memo from '../models/memo';
import mongoose from 'mongoose';

const memoRouter = express.Router();

/*
    메모 작성: POST /api/memo
    BODY SAMPLE: { contents: "sample "}
    ERROR CODES
        1: not logged in
        2: empty contents
*/
memoRouter.post('/',(req,res)=>{
    //check login status
    if(typeof req.session.loginInfo === 'undefined'){
        return res.status(403).json({
            error: 'not logged in',
            code : 1
        });
    }

    //check contents vaild
    if(typeof req.body.contents === ""){
        return res.status(400).json({
            error : 'empty contents',
            code : 2
        });
    }

    //create memo
    let memo = new Memo({
        writer: req.session.loginInfo.username,
        contents : req.body.contents
    });

    //save in database
    memo.save(err=>{
        if(err) throw err;
        return res.json({success:true});
    })
});

/*
    메모 읽기: GET /api/memo
*/
memoRouter.get('/',(req,res)=>{
    //id 기준으로 내림차순, 6개 제한
    Memo.find().sort({"id": -1}).limit(6)
    .exec((err, memos)=>{
        if(err) throw err;
        return res.json(memos);
    });
});

/*
    메모 수정: PUT /api/memo/:id
    BODY SAMPLE: { id : "test", contents: "sample "}
    ERROR CODES
        1: invalid id,
        2: empty contents
        3: not logged in
        4: no resource
        5: permsssion failed
*/

memoRouter.put('/:id',(req,res)=>{
    //check memo id vailid
    if(!mongoose.Types.ObjectId.isValid(req.params.id)){
        return res.status(400).json({
            error : 'invalid id',
            code : 1
        })
    }

    //check contents vailid
    if(typeof req.body.contents !== 'string' || req.body.contents === ""){
        return res.status(400).json({
            error: 'empty contents',
            code: 2
        });
    }

    //check login status
    if(typeof req.session.loginInfo === 'undefined') {
       return res.status(403).json({
           error: 'not logged in',
           code: 3
       });
   }

   //find memo
   Memo.findById(req.params.id, (err, memo)=>{
      if(err) throw err;

      //if memo does not exist
      if(!memo){
          return res.status(404).json({
              error: 'no resource',
              code: 4
          });
      }

      //exist, check writer
      if(memo.writer != req.session.loginInfo.username){
          return res.status(403).json({
              error: 'permission failure',
              code : 5
          });
      }

      //modify and save in database
      memo.contents = req.body.contents;
      memo.date.edited = new Date();
      memo.is_edited = true;

      memo.save((err,memo)=>{
        if(err) throw err;
        return res.json({
            success : true,
            memo
        })
      });
   });

});
memoRouter.delete('/',(req,res)=>{

});

export default memoRouter;
