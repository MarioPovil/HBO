const express = require('express');
const morgan = require('morgan');
const multer = require('multer');
const path = require('path');
const {engine} = require('express-handlebars');
const flash = require('connect-flash');
const session = require('express-session');
const MySQLStore = require('express-mysql-session');
const {database}= require('./keys');
const passport = require('passport')
const { v4: uuidv4 } = require('uuid');
const bodyparser = require('body-parser')
// initializations
const app = express();

//settings
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', engine({
    defaultLayout: 'main',
    LayoutsDir: path.join(app.get('views'), 'layouts'),
    PartialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars.js')
}))
app.set('view engine', '.hbs')

const storage = multer.diskStorage({
    destination: path.join(__dirname,'public/uploads'),
    filename: (req,file,cb)=>{
        cb(null, uuidv4() + path.extname(file.originalname).toLowerCase()); //uuid creara un nombre aleatorio, y lo juntaremos con su extension con path
    }
});
 
//Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
/// multer middleware
app.use(multer({
    storage,
    dest: path.join(__dirname,'public/uploads'), //Creacion de la carpeta donde se guardaran las imagenes
    limits: {fileSize:1000000}, //Imagenes con limite de 1Mb
    fileFilter: (req, file, cb)=>{
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname));
        if(mimetype && extname) { 
            return cb(null, true);
        } 
        cb(`Error: Archivo debe ser un tipo de imagen valida : ${filetypes}`)
    }
}).single('image'));
/// body parser middleware
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({
    extended: true
}))
 
//Routes
app.use(require('./routes'))
app.use('/links', require('./routes/index'));
// Public
app.use(express.static(path.join(__dirname, 'public')));
//Start server
app.listen(app.get('port'), ()=>{
    console.log('Server On Port', app.get('port'));
})