const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const cors = require('cors');

require('dotenv').config();
const dbKey = process.env.MONGODB_URI || process.env.DB_KEY;

mongoose.connect(dbKey)
.then(() => console.log('WEWEWEWEEEEEEEEEEEEEEE'))
.catch(err => console.log('ptit probleme:', err));

const app = express();
const port = 3100; 
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));
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

    const token = jwt.sign({userId: user._id}, 'secretkey');
    return res.status(200).json({ error: 'Connected' });
});