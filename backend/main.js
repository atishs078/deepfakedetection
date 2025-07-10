const mongoose = require ('mongoose')
const express = require ('express')
const cors = require('cors')
const path = require('path')
const app = express()
const bodyParser = require('body-parser')
const videoRoutes = require('./routes/videoRoutes')
const authRoutes = require('./routes/AuthRouter')
const port = 5000
const connectDb =async()=>{
    try {
        await mongoose.connect("mongodb://localhost:27017/DeepFake_Detection?directConnection=true")
        console.log("Connected To Database")
    } catch (error) {
        console.error("error While Connecting Database", error)
    }
}
connectDb()
app.use(cors())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(bodyParser.json())
app.use('/api/video', videoRoutes)
app.use('/api/auth', authRoutes)
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
