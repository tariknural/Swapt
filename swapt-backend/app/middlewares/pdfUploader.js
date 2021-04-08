const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

let DIR = './files/verifications/';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // profile picture directory
        if(file.fieldname === 'profile_verification') {
            DIR = './files/verifications/profile';
        }
        // accommodation picture directory
        else if(file.fieldname === 'accommodation_verification') {
            DIR = './files/verifications/accommodation';
        }
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, uuidv4() + '-' + fileName)
    }
});

let pdfUploader = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "application/pdf") {
            cb(null, true);
        } else {
            cb(null, false);
            // set validation error on req so controller can check it
            req.fileValidationError = 'Only .pdf format allowed!';
        }
    }
});

module.exports = pdfUploader;