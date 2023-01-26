/* Handle csv files upload to start data import process using multer as middleware and node fs package.
There are two types of data : journeys and stations, an uploaded file will be name either journeys.csv or stations.csv based on param in the request uri.
File content is from field 'file' from request form-data. */
const multer = require("multer");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let dir = `./csv/`; // file path for csv files
    //check if file path exists or create the directory
    fs.access(dir, function (error) {
      if (error) {
        fs.mkdir(dir, (error) => cb(error, dir));
      } else {
        cb(null, dir);
      }
    });
  },
  filename: function (req, file, cb) {
    const uploadType = req.params.uploadType;
    let csvName = uploadType + ".csv";
    cb(null, csvName);
  },
});

const uploadFile = multer({ storage: storage });

const uploadCsv = (request, response) => {
  const file = request.file;
  if (!file) {
    response.status(400).json({
      success: false,
      message:"Upload not complete!"
    });
  }
  response.status(201).json({
    success: true,
    fileName: file.filename,
  });
};

module.exports = { uploadCsv, uploadFile };
