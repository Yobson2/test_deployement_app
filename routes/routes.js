const express = require('express');
const router = express.Router();
const session=require('express-session');
const User = require('../models/users');
const multer = require('multer');
const fs=require('fs')

// Configuration de l'upload d'image (dossier de destination)
let storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "./uploads");
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
});

let upload = multer({
    storage: storage
}).single('image'); // image: nom de mon champ de fichier

//Get all users route
router.get('/', async (req, res) => {
    try {
        const users = await User.find().exec();
        // console.log(users);
        res.render('index', { users:users });
    } catch (err) {
        res.json({ message: err.message, type: 'danger' });
    }
});


router.get('/add', (req, res) => {
    res.render('add_users');
});

// Route pour insérer un utilisateur dans la base de données
router.post('/add', upload, (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        image: req.file.filename
    });

    user.save()
        .then(() => {
            req.session.message = {
                type: 'success',
                message: "User added successfully!"
            };
            res.redirect('/');
        })
        .catch(err => {
            res.json({ message: err.message, type: 'danger' });
        });
});

//edite users

router.get('/edit/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const users = await User.findById(id).exec();
        if (!users) {
            // Aucun utilisateur trouvé avec cet ID
            return res.json({ message: 'Utilisateur non trouvé', type: 'danger' });
        }
        res.render('edit_users', {
            title: "Modifier l'utilisateur",
            users: users
        });
    } catch (err) {
        res.json({ message: err.message, type: 'danger' });
    }
});
router.post('/update/:id', upload, async (req, res) => {
    const id = req.params.id;
    let new_image = '';

    if (req.file) {
        new_image = req.file.filename;
        try {
            if (fs.existsSync('./uploads/' + req.body.old_image)) {
                fs.unlinkSync('./uploads/' + req.body.old_image);
            } else {
                console.log('Le fichier à supprimer n\'existe pas.');
            }
        } catch (err) {
            console.log('err', err);
        }
    } else {
        new_image = req.body.old_image;
    }
    
    // Les autres informations à mettre à jour

    try {
        await User.findByIdAndUpdate(id, {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            image: new_image
        });
        req.session.message = {
            type: 'success',
            message: "User updated successfully!"
        };
        res.redirect("/");
    } catch (err) {
        res.json({ message: err.message, type: 'danger' });
    }
});

//Delete user
router.get('/delete/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const result = await User.findByIdAndDelete(id);
        if (result && result.image !== "") {
            try {
                fs.unlinkSync('./uploads/' + result.image);
            } catch (error) {
                console.log(error);
            }
        }
        req.session.message = {
            type: 'info',
            message: "User deleted successfully!"
        };
        res.redirect('/');
    } catch (err) {
        res.json({ message: err.message });
    }
});


module.exports = router;
