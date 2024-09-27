document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/students');
        if (!response.ok) {
            throw new Error('Failed to fetch student data');
        }

        const data = await response.json();
        const tableBody = document.getElementById('studentData');

        tableBody.innerHTML = ''; // Clear existing data

        data.forEach(student => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${student.roll_number}</td>
                <td>${student.username}</td>
                <td>${student.department}</td>
                <td>${student.cgpa}</td>
            `;

            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching student data:', error);
    }
});
