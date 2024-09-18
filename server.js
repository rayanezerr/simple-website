const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

require('dotenv').config();
const dbKey = process.env.MONGODB_URI || process.env.DB_KEY;

mongoose.connect(dbKey)
.then(() => console.log('WEWEWEWEEEEEEEEEEEEEEE'))
.catch(err => console.log('ptit probleme:', err));

const app = express();
app.set('etag', true);
const port = 3100; 
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'homepage.html'));
});

const userSchema = new mongoose.Schema({
    username: {type: String, unique: true},
    email: {type: String, unique: true},
    password: String,
});

const User = mongoose.model('User', userSchema);

app.post('/signup', async (req, res) => {
    const {username, email, password, repeat_password} = req.body;
    const isUsernameExisting = await User.findOne({username});
    const isEmailExisting = await User.findOne({email});
    if (isUsernameExisting) {
        return res.status(400).json({error: 'User with this username already exists'});
    }
    
    if (isEmailExisting) {
        return res.status(400).json({error:'User with this email already exists'});
    }

    console.log('Received data:', {username, email, password, repeat_password});

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
        username,
        email,
        password: hashedPassword,
    })

    await newUser.save();

    return res.status(200).json({ error: 'Registered' });
});


app.post('/login', async (req, res) => {
    const {username, password} = req.body;
    const user = await User.findOne({username});
    if (!user) {
        return res.status(400).json({ error: 'User not found' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
        return res.status(400).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: '1h'});
    return res.status(200).json({ token });
});

const validateToken = (req, res, next) => {
    // Récupère l'en-tête Authorization
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    console.log('Authorization header:', authHeader); // LOG
    
    if (!authHeader) {
        console.log('No Authorization header found'); // LOG
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];
    console.log('Extracted token:', token); // LOG
    
    if (!token) {
        console.log('Token missing after splitting Authorization header'); // LOG
        return res.status(401).json({ error: 'Unauthorized: Invalid token format' });
    }
    
    // Vérifie le token avec jwt.verify
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.log('Token verification error:', err); // LOG
            return res.status(403).json({ error: 'Forbidden: Invalid or expired token' });
        }
        console.log('Token valid, user:', user); // LOG
        req.user = user;
        next();
    });
};

app.get('/play-snake', validateToken, (req, res) => {
    console.log('User is authorized. Sending snake game file.');
    res.sendFile(path.join(__dirname, 'public', 'snake', 'index.html'));
});
