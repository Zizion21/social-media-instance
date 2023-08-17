const multer = require('multer');
const path = require('path');
const fs = require('fs');

function createRoute (username) {
    const directory = path.join(__dirname, '..', '..', 'public', 'uploads', username, 'profile');
    fs.mkdirSync(directory, {recursive: true});
    return directory;
}
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const filePath = createRoute(req.user.username);
        cb(null, filePath)
    },
    filename: (req, file, cb)=> {
        const ext = path.extname(file.originalname);
        const fileName = String(new Date().getTime() + ext);
        cb(null, fileName)
    }
});

const uploadImage = multer({storage});
module.exports = {
    uploadImage,
}