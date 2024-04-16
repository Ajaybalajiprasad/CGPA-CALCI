const express = require('express');
const bodyParser = require('body-parser');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 6969;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Supabase setup
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/submit', async (req, res) => {
    try {
        const { username, rollNumber, cgpa } = req.body;

        // Validate roll number format
        const rollNumberPattern = /^\d{12}$/;
        if (!rollNumberPattern.test(rollNumber)) {
            return res.status(400).json({ error: 'Invalid roll number format' });
        }

        // Check if the roll number already exists in the database
        const { data: existingData, error: existingError } = await supabase
            .from('cgpa_data')
            .select('roll_number')
            .eq('roll_number', rollNumber);

        if (existingError) {
            console.error('Error checking existing roll number:', existingError.message);
            return res.status(500).json({ error: 'An error occurred while checking existing roll number' });
        }

        let result;
        if (existingData.length > 0) {
            // Update the existing record
            console.log(`${rollNumber} already exists, updating record...`)
            result = await supabase
                .from('cgpa_data')
                .upsert(
                    { username, roll_number: rollNumber, cgpa },
                    { onConflict: ['roll_number'] }
                );
        } else {
            // Insert a new record
            console.log(`${rollNumber} does not exist, inserting new record...`)
            result = await supabase.from('cgpa_data').insert([
                { username, roll_number: rollNumber, cgpa }
            ]);
        }

        if (result.error) {
            console.error('Error submitting CGPA data:', result.error.message);
            return res.status(500).json({ error: 'An error occurred while submitting CGPA data' });
        }

        // Send success response
        res.status(200).json({ message: 'CGPA data submitted successfully', data: result.data });
    } catch (error) {
        console.error('Error inserting CGPA data:', error);
        res.status(500).json({ error: 'An error occurred while submitting CGPA data' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
