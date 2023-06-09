const router = require("express").Router();
const secureUser = require("../config/securepage.config");
const Movie = require("../models/movie.model")
const fs = require('fs');
const cloudinary = require('cloudinary')
const streamifier = require('streamifier');
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        console.log(file.originalname)
        console.log('buffer',file.buffer)
        const splitName = file.originalname.split(".")
        cb(null, `${file.fieldname}-${uniqueSuffix}.${splitName[splitName.length - 1]}`)
    }
})
const upload = multer({ storage: storage })

// const storage =multer.memoryStorage()
// const uploads = multer({storage}).single('posterUrl')

router.get("/", secureUser, async (req, res) => {
  
  try{
    const movies = await Movie.find()
    req.flash('success', 'Flash is back!')
    res.render("movies/dashboard",{movies});
  }catch (e) {
    //
  }

});


router.post("/movie/create", [secureUser, upload.single('posterUrl')], async (req, res) => {
  console.log(req.body)
const imageStream = fs.readFileSync(req.file.path);
console.log("ImageSTREAM:", imageStream)

const cld_upload_stream = cloudinary.v2.uploader.upload_stream(
    {  folder: "My Images" },
    async (error, result) => {
      try{
        console.log(result)
        const actors = req.body.actors.split(";")
        const movie = new Movie({...req.body, posterUrl: result.secure_url, actors: actors})
        await movie.save()
        fs.unlinkSync(req.file.path)
        res.redirect("/");
      }catch(e){
        res.redirect("/");
      }
    });
streamifier.createReadStream(imageStream).pipe(cld_upload_stream)


});

module.exports = router;
