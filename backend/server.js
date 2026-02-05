const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const port =5000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/Stick-it')
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.log("Failed to connect to MongoDB:", err));

const userSchema = new mongoose.Schema({
    username: {type: String, required: true},
    email: {type: String, required: true ,unique: true},
    age: {type: Number, required: true},
    password: {type: String, required: true}
});

const User = mongoose.model('User', userSchema)

app.get("/api/hello", (req,res) =>{
    res.json({message: "hello twin"})
})

app.get('/api/users', async (req,res)=>{
    try{
        const users = await User.find();
        res.json(users);
    } catch (error){
        res.status(500).json({ error: error.message})
    }
});

app.put('/api/users/:id', async (req,res)=>{
    try{
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                username: req.body.username,
                email: req.body.email,
                age: req.body.age,
            },
            {new: true}
        );
        if (!updatedUser){
            return res.status(404).json({error: 'User not found'});
        }
        res.json({message: "User updated successfully", user: updatedUser});
    }catch(error){
        res.status(500).json({error: error.message})
    }
})

app.delete('/api/users/:id', async (req,res)=>{
    try{
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser){
            return res(404).json({error: "User not found"})
        }
        res.json({message: "User deleted successfully"});
    }catch(error){
        res.status(500).json({error: error.message})
    }
})

app.get('/api/users/:id', async (req,res)=>{
    try{
        const user= await User.findById(req.params.id);
        if (!user){
            return res.status(404).json({error:'User not found'})
        }
        res.json(user);

    }catch(error){
        res.status(500).json({error: error.message})
    }
})

app.post('/api/users', async (req, res) => {
    try {
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            age: req.body.age,
        });
        const savedUser = await newUser.save();
        res.json(savedUser);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create user'
        })
    }
})

app.post('/api/users/register', async (req,res)=>{
    try{

        const {username, email, age, password} = req.body;
        const alreadyExist = await User.findOne({email});
        if (alreadyExist){
            return res.status(400).json({error: 'Email already in use'})
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            age,
            password: hashedPassword
        });
        const savedUser = await newUser.save();

        const token = jwt.sign({id: savedUser._id, username: savedUser.username}, 
            'your_jwt_secret', 
            {expiresIn: '1h'});

        res.json({
            message: 'User registered successfully',
            token: token,
            user: {
                id: savedUser._id,
                username: savedUser.username,
                email: savedUser.email,
                age: savedUser.age
            }
        })


    }catch(error){
        res.status(500).json({error: 'Failed to register user'})
    }
})


app.post('/api/users/login', async (req,res)=>{
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if (!user){
            return res.status(400).json({error:'Invalid email or password'})
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword){
            return res.status(400).json({error: 'Invalid email or password'})
        }

        const token = jwt.sign({id: user._id, username: user.username}, 'your_jwt_secret', {expiresIn: '1h'});

        res.json({
            message: 'Login successful',
            token: token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                age: user.age
            
        }})

    }catch(error){
        res.status(500).json({error: 'Failed to login'})
    }
})

app.listen(port, () =>{
    console.log(`Server is running on port ${port}`);
})