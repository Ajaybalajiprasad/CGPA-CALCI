document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Fetch student data when the page loads
        const response = await fetch('/api/students');
        if (!response.ok) {
            throw new Error('Failed to fetch student data');
        }

        const data = await response.json();
        studentData = data; // Store the fetched data in the global variable for sorting and searching
        displayStudentData(studentData); // Display the fetched data

        // Add event listeners for sorting and searching
        document.getElementById('sortButton').addEventListener('click', sortStudentData);
        document.getElementById('searchInput').addEventListener('input', filterStudentData);
    } catch (error) {
        console.error('Error fetching student data:', error);
    }
});

// Global variable to hold student data
let studentData = [];

// Function to display student data in the table
function displayStudentData(data) {
    const tableBody = document.getElementById('studentData');
    tableBody.innerHTML = ''; // Clear existing data

    data.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.roll_number}</td>
            <td>${student.username}</td>
            <td>${student.department}</td>
            <td>${student.cgpa.toFixed(2)}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Function to sort student data based on user selection
function sortStudentData() {
    const sortValue = document.getElementById('sortSelect').value;
    let sortedData = [...studentData]; // Copy the data for sorting

    switch (sortValue) {
        case 'cgpa-asc':
            sortedData.sort((a, b) => a.cgpa - b.cgpa);
            break;
        case 'cgpa-desc':
            sortedData.sort((a, b) => b.cgpa - a.cgpa);
            break;
        case 'name-asc':
            sortedData.sort((a, b) => a.username.localeCompare(b.username));
            break;
        case 'name-desc':
            sortedData.sort((a, b) => b.username.localeCompare(a.username));
            break;
        case 'department-asc':
            sortedData.sort((a, b) => a.department.localeCompare(b.department));
            break;
        case 'department-desc':
            sortedData.sort((a, b) => b.department.localeCompare(a.department));
            break;
    }

    displayStudentData(sortedData); // Display the sorted data
}

// Function to filter student data based on search input
function filterStudentData() {
    const searchValue = document.getElementById('searchInput').value.toLowerCase();
    const filteredData = studentData.filter(student =>
        student.username.toLowerCase().includes(searchValue) ||
        student.roll_number.includes(searchValue)
    );
    displayStudentData(filteredData); // Display the filtered data
}
