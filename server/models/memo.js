import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const Memo = new Schema({
    writer : String,
    contents : String,
    started : [String],
    date : {
        create : {type: Date, default: Date.now},
        edited : {type: Date, default: Date.now}
    },
    is_edited : {type :Boolean, default: false}
});

export default mongoose.model('memo', Memo);
