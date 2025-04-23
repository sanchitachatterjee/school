const mysql = require('mysql2');
const express = require('express')
const dotenv = require('dotenv')
dotenv.config()
const mysqldb = mysql.createConnection({
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: 'school'
});

mysqldb.connect(() => console.log("Mysql is connected"));

const app = express()
app.use(express.urlencoded({ extended: true }))
app.post('/addschools', async (req, res) => {
  const name = req.body.name
  const address = req.body.address
  const lat = req.body.latitude
  const lon = req.body.longitude

  if (!name || !address || !lat || !lon) {
    res.status(400).json({ message: "Please fill all the details" })
    return;
  }
  const latitude = parseFloat(lat)
  const longitude = parseFloat(lon)
  let sql = "Insert Into schools (Name,Address,Latitude,Longitude) Values (?,?,?,?)";
  mysqldb.query(sql, [name, address, latitude, longitude], (err, result) => {
    if (err)
      throw err;
    res.send("<h2>Your data is inserted</h2> <a href='http://127.0.0.1:5500/index.html'>List Schools</a>")
    res.status(201).json({ message: "School data is inserted" })
  })

})

app.get('/listschools', (req, res) => {
  const ulat = parseFloat(req.query.ulatitude)
  const ulong = parseFloat(req.query.ulongitude)
  if (!ulat || !ulong) {
    res.status(400).json({ message: "Please fill all the details" })
    return;
  }
  let sql2 = "Select *, ABS(Latitude - ?)+ ABS(Longitude -?) as dist from schools order by dist"
  mysqldb.query(sql2, [ulat, ulong], (err, result) => {
    if (err)
      throw err;
    res.json(result);
  })
})
app.listen(3002, () => { console.log("Server is running at 3002") })

