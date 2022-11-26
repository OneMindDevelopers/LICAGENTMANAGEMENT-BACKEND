const express = require("express");
const multer = require("multer");
const router = express.Router();
const XLSX = require("xlsx");
const Items = require("../items/item-model");

const uploadXLSX = async (req, res, next) => {
  try {
    let path = req.file.path;
    console.log("path-->", path)
    var workbook = XLSX.readFile(path);
    var sheet_name_list = workbook.SheetNames;
    let jsonData = XLSX.utils.sheet_to_json(
      workbook.Sheets[sheet_name_list[0]]
    );
    if (jsonData.length === 0) {
      return res.status(400).json({
        success: false,
        message: "xml sheet has no data",
      });
    }

    // console.log("jsonData-->", jsonData);
    const result = jsonData.map(item => ({
        name: item["__EMPTY"], 
        brand: item["__EMPTY_1"],
        category: item["__EMPTY_2"],
        size: item["__EMPTY_3"],
        quantity: item["__EMPTY_4"],
        slno: item["__EMPTY_5"],
    }));
    const items = result.slice(1);
    // console.log("result-->", items)
    
    Items.insertMany(items, function (err, result) {
        if (err) {
            console.log(err);
        };
        // console.log(result);
        res.status(200).send(result);
        // res.status(200).send("Record created successfully.");
        // res.status(201).json({
        //   success: true,
        //   message: savedData.length + " rows added to the database",
        // });
    });
    
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

router.get('/getItems', async(req, res)=> {
    try{
      const items = await getItems();
      res.status(200).send(items);
    }catch(error){
      res.status(500).send(err);
    }
})

const getItems = () => {
  return new Promise((resolve, reject) => {
    Items.find({}, (err, response) => {
      if(err){
        reject(err)
      }else{
        resolve(response);
      }
    })
  })
}

const upload = multer({ storage: storage });

router.post("/upload", upload.single("xlsx"), uploadXLSX);

module.exports = router;