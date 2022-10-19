
const express = require('express');
const router = express.Router();
const pool = require('../database');


router.get('/perfil', (req, res)=>{
    res.render('movies/fotoPerfil');
});

router.post('/movies', (req,res)=>{
    console.log(req.file)
res.send('Uploaded')
});

router.get('/signUp', (req, res)=>{
    res.render('partials/form');
});
router.post('/signUp', async (req, res)=>{
            const {title ,url, description}= req.body;
            const newMovie ={
                title,
                url,
                description
            };
          await pool.query('INSERT INTO movies set ? ', [newMovie]);
    console.log(newMovie)
});
router.get('/movies', async (req, res)=>{
   const links=  await pool.query('SELECT * FROM movies');
   res.render('movies/add', {links})
})

module.exports = router;