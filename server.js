const express = require('express');
const bodyParser = require('body-parser');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

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

// Serve staff view page
app.get('/staff', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'staff.html'));
});

app.get('/api/students', async (req, res) => {
    try {
        console.log("Attempting to fetch student data from Supabase...");
        const { data, error } = await supabase
            .from('cgpa_data_sem2')
            .select('roll_number, username, department, cgpa');

        if (error) {
            console.error('Error fetching student data:', error.message);
            return res.status(500).json({ error: 'Failed to fetch student data' });
        }

        console.log("Successfully fetched student data:", data);
        res.status(200).json(data);
    } catch (error) {
        console.error('Server error in /api/students route:', error);
        res.status(500).json({ error: 'An error occurred while fetching student data' });
    }
});

app.post('/submit', async (req, res) => {
    try {
        const { username, rollNumber, cgpa } = req.body;

        // Validate roll number format
        const rollNumberPattern = /^\d{12}$/;
        if (!rollNumberPattern.test(rollNumber)) {
            return res.status(400).json({ error: 'Invalid roll number format' });
        }

        // Determine department based on roll number
        let department;
        switch (rollNumber.substr(6, 3)) {
            case '106':
                department = 'ECE';
                break;
            case '104':
                department = 'CSE';
                break;
            case '105':
                department = 'EEE';
                break;
            case '243':
                department = 'AIDS';
                break;
            default:
                department = 'Unknown';
        }
        if (department === 'Unknown') {
            return res.status(400).json({ error: 'Unknown department' });
        }

        const { data: existingData, error: existingError } = await supabase
            .from('cgpa_data_sem2')
            .select('roll_number')
            .eq('roll_number', rollNumber);

        if (existingError) {
            console.error('Error checking existing roll number:', existingError.message);
            return res.status(500).json({ error: 'An error occurred while checking existing roll number' });
        }

        let result;
        if (existingData.length > 0) {
            // Update existing record
            result = await supabase
                .from('cgpa_data_sem2')
                .update({ username, cgpa, department })
                .eq('roll_number', rollNumber);
        } else {
            // Insert new record
            result = await supabase.from('cgpa_data_sem2').insert([
                { username, roll_number: rollNumber, cgpa, department }
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
