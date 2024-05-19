const express = require("express");
const multer = require("multer");
const cors = require("cors");
const docxtopdf = require('docx-pdf');
const path = require("path");
const app = express();
const port =  3000;

app.use(cors());

// setting up the file storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
const upload = multer({ storage: storage })

app.post('/convertfile', upload.single('file'), (req, res, next) => {
    try {
        if(!req.file){
            return res.status(400).json({
                message: "No file uploaded"
            })
        }
        // defining output file path
        let outputpath = path.join(__dirname,"files",`${req.file.originalname}.pdf`)
        docxtopdf(req.file.path, outputpath, (err,result) => {
            if(err){
              console.log(err);
              return res.status(500).json({
                message: "Error convering docx to pdf",
              })
            }
            res.download(outputpath,()=>{
                console.log('file downloaded');
            })
          });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message:"Internal server error",
        })
    }
  })

app.listen(port,()=>{
    console.log(`server running on port no ${port}`);
})