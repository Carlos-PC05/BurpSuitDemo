const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/message', (req, res) => {
    const { message } = req.body;
    
    // Simulate some backend processing delay
    setTimeout(() => {
        if (!message) {
            return res.status(400).json({ status: 'error', message: 'Message is required' });
        }
        
        // NO BACKEND VALIDATION HAPPENS HERE!
        // This is where the vulnerability lives that allows Burp Suite to bypass the 
        // frontend validation.
        
        console.log(`Received message completely bypassing any length restrictions: ${message}`);
        
        res.status(200).json({
            status: 'success',
            message: 'Message successfully processed by the server!',
            receivedText: message
        });
    }, 500); // 500ms delay to feel realistic
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Ready for Burp Suite demonstration!`);
});
