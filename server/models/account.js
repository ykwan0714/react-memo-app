import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Account = new Schema({
    username : String,
    password : String,
    created : {type: Date, default: Date.now}
});

//genrate hash
Account.methods.generateHash = function(password){
    return bcrypt.hashSync(password, 8);
}

//compares the password
Account.methods.validateHash = function(password){
    return bcrypt.compareSync(password, this.password); //this bind에러 때문에 arrow func 사용 x
}

//모델화 할 때 첫번째 인수는 collection 명(실제 만들어 지는건 복수형으로 만들어 진다)
export default mongoose.model('account', Account);
