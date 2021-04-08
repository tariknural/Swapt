const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

let DIR = './public/pictures';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // profile picture directory
        if(file.fieldname === 'profile_picture') {
            DIR = './public/pictures/profile';
        }
        // accommodation picture directory
        else if(file.fieldname === 'accommodation_pictures') {
            DIR = './public/pictures/accommodation';
        }
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, uuidv4() + '-' + fileName)
    }
});

let pictureUploader = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            // set validation error on req so controller can check it
            req.fileValidationError = 'Only .png, .jpg and .jpeg format allowed!';
        }
    }
});

module.exports = pictureUploader;