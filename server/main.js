import express from 'express';
import path from 'path';

import WebpackDevServer from 'webpack-dev-server';
import webpack from 'webpack';

import morgan from 'morgan'; // HTTP REQUEST LOGGER
import bodyParser from 'body-parser'; // PARSE HTML BODY

import mongoose from 'mongoose';
import session from 'express-session';

//api 라우터 불러와서 사용
import api from './routes';

const app = express();
const port = 3000;

const devPort = 4000;
/* mongodb connection */
const db = mongoose.connection;
db.on('error', console.error);
db.once('open', () => {
    //CONNECTED TO MONGODB SERVER
    console.log('Connected to mongodb server');
});
// mongoose.connect('mongodb://username:password@host:port/database=');
mongoose.connect('mongodb://localhost/DB_MEMO');

/* use session */
app.use(session({
    secret: 'CodeLab1$1$234',
    resave: false,
    saveUninitialized: true
}));

//express.static 미들웨어 함수를 사용하여 static file 제공
app.use('/', express.static(path.join(__dirname, './../public')));

app.use(morgan('dev'));
app.use(bodyParser.json());

app.get('/hello', (req, res)=>{
    return res.send('Hello yongkwan');
})

//api 라우터 불러와서 사용
//http://URL/api/account/signup
app.use('/api', api);

app.listen(port, ()=>{
    console.log('Express is linstening on port :', port );
});



if(process.env.NODE_ENV == 'development') {
    console.log('Server is running on development mode');
    const config = require('../webpack.dev.config');
    const compiler = webpack(config);
    const devServer = new WebpackDevServer(compiler, config.devServer);
    devServer.listen(
        devPort, () => {
            console.log('webpack-dev-server is listening on port', devPort);
        }
    );
}
