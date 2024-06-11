const express = require ('express');
const cookieParser = require('cookie-parser');//쿠키 정보 읽어오기
const morgan = require('morgan');// 콘솔창
const path = require('path');//경로지정
const session = require('express-session');//세션 관리
const nunjucks = require('nunjucks');//html문법+js
const dotenv = require('dotenv');//.env파일 읽어오기
dotenv.config();//이제부터 process.env로 env파일 읽어올 수 있다.
const pageRouter = require('./routes/page');

const app = express();
app.set('port', process.env.PORT || 8001);
app.set('view engine', 'html');//템플릿엔진을 세팅해줌으로써 서버에서 동적으로 html생성
nunjucks.configure('views', {
    express: app,
    watch: true
})
app.use(morgan('dev'))//콘솔
app.use(express.static(path.join(__dirname, 'public')))//정적파일
app.use(express.json());//바디파서
app.use(express.urlencoded({extended: false}));//바디파서
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave:false,
    saveUninitialized:false,
    secret: process.env.COOKIE_SECRET,
    cookie:{
        httpOnly: true,
        secure:false,
    },
}));

app.use('/', pageRouter);

app.use((req,res,next)=>{
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
})
app.use((err,req,res,next)=>{
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500);
    res.render('error')
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
});