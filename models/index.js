const Sequelize = require('sequelize'); // Sequelize 모듈 불러오기
const path = require('path'); // path 모듈 가져오기
const fs = require('fs'); // 파일 시스템 모듈 가져오기
const User = require('./user'); // User 모델 불러오기
const Post = require('./post'); // Post 모델 불러오기
const Hashtag = require('./hashtag'); // Hashtag 모델 불러오기
const env = process.env.NODE_ENV || 'development'; // 현재 환경 설정
const config = require('../config/config')[env];  // 환경 설정 파일 불러오기
const db = {};
const sequelize = new Sequelize(
  config.database, config.username, config.password, config,
);

db.sequelize = sequelize;

const basename = path.basename(__filename);
fs
  .readdirSync(__dirname) 
  .filter(file => { 
    return (file.indexOf('.') !== 0) && !file.includes('test') && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file));
    console.log(file, model.name);
    db[model.name] = model;
    model.init(sequelize);
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;