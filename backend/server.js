require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const authenticateToken = require('./middleware/auth');
const { HfInference } = require('@huggingface/inference');
const hf = new HfInference(process.env.HUGGINGFACE_API_TOKEN);
const Note = require('./models/Notes');
const Sticker = require('./models/Stickers');
const app = express();
const port =5000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/Stick-it')
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.log("Failed to connect to MongoDB:", err));




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

// Protected route - only logged-in users can create notes
app.post('/api/notes', authenticateToken, async (req, res) => {
    try {
        const newNote = new Note({
            title: req.body.title,
            content: req.body.content, 
            author_id: req.user.id,
            category: req.body.category,
        });
        
        const savedNote = await newNote.save();
        res.json(savedNote);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create note' });
    }
});


app.post('/api/notes/:id/generate-sticker', authenticateToken, async (req, res) => {
    try {
        // Fetch the note
        const note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }

        // Create the prompt
        const prompt = `Create 3 fun, short sticker variations of this note. Each sticker should have a title (max 5 words) and content (max 15 words).

Original Note:
Title: ${note.title}
Content: ${note.content}

Return ONLY a JSON array in this exact format (no other text):
[
  {"title": "Sticker 1", "content": "Content 1"},
  {"title": "Sticker 2", "content": "Content 2"},
  {"title": "Sticker 3", "content": "Content 3"}
]`;

        // ✅ NEW: Use chatCompletion instead of textGeneration
        const response = await hf.chatCompletion({
            model: 'Qwen/Qwen2.5-Coder-32B-Instruct',
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ],
            max_tokens: 500,
            temperature: 0.7
        });

        // Parse the AI response
        let stickers;
        try {
            const aiText = response.choices[0].message.content;
            const jsonMatch = aiText.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                stickers = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error('No valid JSON found in the response');
            }
        } catch (parseError) {
            console.error('AI Response:', response.choices[0].message.content);
            return res.status(500).json({ 
                error: 'AI generated invalid format',
                aiResponse: response.choices[0].message.content 
            });
        }

        // Save stickers to database
        const createdStickers = await Sticker.insertMany(
            stickers.map(s => ({
                title: s.title,
                content: s.content,
                note_id: note._id,
                author_id: req.user.id,
                is_public: false
            }))
        );

        // Send response
        res.json({
            success: true,
            stickers: createdStickers
        });

    } catch (error) {
        console.error('Error generating stickers:', error);
        res.status(500).json({ 
            error: 'Failed to generate stickers',
            details: error.message 
        });
    }
});


app.get('/api/notes', authenticateToken, async (req, res) => {
    try {
        const notes = await Note.find({ author_id: req.user.id });
        res.json(notes);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch notes' });
    }
});

app.put('/api/notes/:id', authenticateToken, async (req, res) => {
    try {
        const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedNote) {
            return res.status(404).json({ error: 'Note not found or unauthorized' });
        }
        res.json({message:'Note updated'});
    } catch (error) {
        res.status(500).json({ error: 'Failed to update note' });
    }
});

app.delete('/api/notes/:id', authenticateToken, async (req, res) => {
    try {
        const deletedNote = await Note.findOneAndDelete({ _id: req.params.id, author_id: req.user.id });
        if (!deletedNote) {
            return res.status(404).json({ error: 'Note not found or unauthorized' });
        }
        res.json({ message: 'Note deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete note' });
    }
});

app.get('/api/stickers', authenticateToken, async (req, res) => {
    try {
        const stickers = await Sticker.find({ author_id: new mongoose.Types.ObjectId(req.user.id) });
        res.json(stickers);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch stickers' });
    }
});

app.post('/api/stickers', authenticateToken, async (req, res) => {
    console.log('POST /api/stickers - body:', req.body);
    
    try {
        // Don't convert note_id/author_id - use as-is or make optional
        const newSticker = new Sticker({
            title: req.body.title || "Untitled",           // ✅ Fix empty
            content: req.body.content || "No content",     // ✅ Fix empty  
            note_id: req.body.note_id ? new mongoose.Types.ObjectId() : null,  // ✅ Fake valid ID
            author_id: new mongoose.Types.ObjectId(req.user.id)    // ✅ Convert token ID
        });
        
        const savedSticker = await newSticker.save();
        res.json(savedSticker);
    } catch (error) {
        console.log('SAVE ERROR:', error);
        res.status(500).json({ error: 'Failed to create sticker' });
    }
});



app.delete('/api/stickers/:id', authenticateToken, async (req, res) => {
    try {
        const deletedSticker = await Sticker.findOneAndDelete({ _id: req.params.id, author_id: req.user.id });

        if (!deletedSticker) {
            return res.status(404).json({ error: 'Sticker not found or unauthorized' });
        }

        res.json({ message: 'Sticker deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete sticker' });
    }
});

app.listen(port, () =>{
    console.log(`Server is running on port ${port}`);
})