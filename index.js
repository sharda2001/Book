const express=require("express")
const connectDB=require("./config/db");

const app=express()

connectDB();


app.use(express.json({ extended:false }))  


app.use("/user",require("./routes/User"))
app.use("/auth",require("./routes/auth"))
app.use("/book",require("./routes/Books"))

const PORT=process.env.PORT || 3000

app.listen(PORT,() => console.log(`server started on post ${PORT}`))
