const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const User = require("./models/user");
const Post = require("./models/post");

const app = express()

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'video/mp4': 'mp4'
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("Invalid mime type");
        if(isValid) {
            error = null;
        }
        if(isValid == 'mp4'){
            cb(null, "backend/videos");
        } else {
            cb(null, "backend/images");
        }
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLocaleLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + '-' + Date.now() + '.' + ext);
    }
});

mongoose.connect(
    "mongodb+srv://adminusername:adminpassword@cluster0.aez2l.mongodb.net/amarcodedb",
    { useNewUrlParser: true })
    .then(() => {
        console.log('Mongodb Atlas Connected!')
    })
    .catch(() => {
        console.log('Db Connection Failed!')
    });

app.use(bodyParser.json());
app.use(cors());
app.use("/images", express.static(path.join("backend/images")));
app.use("/videos", express.static(path.join("backend/videos")));

app.post("/api/user/signup", cors(), (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hashedPassword => {

            const user = User({
                email: req.body.email,
                password: hashedPassword
            });
            console.log(user);
            user.save()
                .then(result => {
                    res.status(201).json({
                        message: 'User created with bcypt!',
                        result: result
                    })
                })
                .catch(err => {
                    res.status(500).json({
                        error: err
                    })
                });
        });
});

app.post("/api/user/login", cors(), (req, res, next) =>{
    let fetchedUser;
    User.findOne({ email: req.body.email })
        .then(userExists => {
            if(!userExists){
                return res.status(401).json({
                    message: "User does not exit!"
                });
            }
            console.log(userExists);
            fetchedUser = userExists;
            return bcrypt.compare(req.body.password, userExists.password);
        })
        .then(compareResult => {
            if(!compareResult){
                return res.status(401).json({
                    message: "Password does not match!"
                });
            }
            const token = jwt.sign(
                { email: fetchedUser.email, userId: fetchedUser._id }, 
                'jwt_secret_key',
                { expiresIn: "1h"}
            );
            res.status(200).json({
                token: token
            });
        })
        .catch(err => {
            return res.status(401).json({
                message: "User authentication failed!",
                error: err
            });
        });
});

app.get("/api/posts", (req, res, next) => {
    Post.find()
        .then(documentsFromMongoDB => {
            res.status(200).json({
                message: 'Posts fetched successfully!',
                posts: documentsFromMongoDB
            });
        });
});

const upload = multer ({storage: storage});
const uploadMultiple = upload.fields([{name: 'image', maxCount: 1}, {name: 'video', maxCount: 1}]);

app.post("/api/posts", 
    /*multer({storage: storage}).single("image")*/
    uploadMultiple, (req, res, next) => {
    
    console.log(req.files.image[0]);

    const url = req.protocol + '://' + req.get("host"); 
    const addedPost = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.files.image[0].filename,
        videoPath: url + "/videos/" + req.files.video[0].filename
    });

    addedPost.save()
        .then(createdPost => {
            res.status(201).json({ 
                message: "Post saved to mongodb successfully!",
                post: {
                    ...createdPost,
                    id: createdPost._id,
                }
            });
        })
        .catch( errorFromMongoDb => {
            res.status(401).json({ error: errorFromMongoDb });
        });
});

app.delete("/api/posts/:id", (req, res, next) => {
    Post.deleteOne({_id: req.params.id})
        .then(result => {
            res.status(200).json({message: 'Post deleted!'});
        });
});

module.exports = app;