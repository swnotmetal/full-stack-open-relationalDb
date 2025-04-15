require('dotenv').config()

module.exports ={
    DATABASE_URL : process.env.DB_URL,
    PORT: process.env.PORT || 3008,
    SECRET: process.env.SECRET
}