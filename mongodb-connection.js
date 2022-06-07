const mongoose = require('mongoose')

const connection_string = process.env.DATABASE_CONNECTION_STRING || 'mongodb://localhost/NodeJS-Express-Template'

async function main () {
  try {
    await mongoose.connect(connection_string)
    console.log('We are connected to mongodb')
  } catch (err) {
    console.error(err)
  }
}

main()
