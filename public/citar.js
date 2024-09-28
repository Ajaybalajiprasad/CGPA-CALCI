function calculateCGPA() {
    let totalCredits = 0;
    let totalPoints = 0;

    // Credits for each subject
    let EieCredit = 3;
    let CaCredit = 4;
    let EgCredit = 4;
    let engCredit = 2;
    let TamCredit = 1;
    let MatCredit = 4;
    let CaLabCredit = 1;
    let EplCredit = 2;
    let PhyCredit = 3;
    let EngLabCredit = 2;

    // Get roll number to determine department
    const department = document.getElementById('department').value;

    // Check if the department is CSE
    if (department === 'CSE' || department === 'AIDS') {
        CaCredit = 3;
        CaLabCredit = 2;
    }

    // Get grades entered by the user
    const EieGrade = parseFloat(document.getElementById('EieGrade').value);
    const CaGrade = parseFloat(document.getElementById('CaGrade').value);
    const CaLabGrade = parseFloat(document.getElementById('CaLabGrade').value);
    const EgGrade = parseFloat(document.getElementById('EgGrade').value);
    const TamGrade = parseFloat(document.getElementById('tamGrade').value);
    const EplGrade = parseFloat(document.getElementById('EplGrade').value);
    const EngLabGrade = parseFloat(document.getElementById('engLabGrade').value);
    const EngGrade = parseFloat(document.getElementById('EngGrade').value);
    const MatGrade = parseFloat(document.getElementById('MatGrade').value);
    const PhyGrade = parseFloat(document.getElementById('PhyGrade').value);

    // Check if any grade is invalid
    if (isNaN(MatGrade) || isNaN(PhyGrade) || isNaN(EieGrade) || isNaN(CaGrade) || isNaN(EngGrade) || isNaN(TamGrade) || isNaN(CaLabGrade) || isNaN(EplGrade) || isNaN(EngLabGrade) || isNaN(EgGrade)) {
        window.alert('Please enter valid grades for all subjects.');
        return;
    }

    // Calculate total credits and points
    totalCredits = EieCredit + CaCredit + EgCredit + engCredit + TamCredit + MatCredit + CaLabCredit + EplCredit + PhyCredit + EngLabCredit;
    totalPoints = (EieCredit * EieGrade) + (CaCredit * CaGrade) + (CaLabCredit * CaLabGrade) + (EgCredit * EgGrade) + (TamCredit * TamGrade) + (EplCredit * EplGrade) + (EngLabCredit * EngLabGrade) + (engCredit * EngGrade) + (MatCredit * MatGrade) + (PhyCredit * PhyGrade);

    // Calculate CGPA
    const cgpa = (totalPoints / totalCredits).toFixed(2);

    // Display the CGPA
    const cgpaSpan = document.getElementById('cgpa');
    cgpaSpan.textContent = cgpa;
}

function change() {
    window.location.href = "cit.html";
}

const form = document.getElementById('cgpaForm');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const rollNumber = document.getElementById('rollNumber').value;

    if (rollNumber.substr(0, 6) !== '213223') {
        window.alert('Enter valid roll number!');
        return;
    }

    // Calculate CGPA before submitting the form
    calculateCGPA();

    // Now retrieve the calculated CGPA
    const formData = {
        username: document.getElementById('username').value,
        rollNumber: document.getElementById('rollNumber').value,
        cgpa: parseFloat(document.getElementById('cgpa').textContent)
    };

    try {
        const response = await fetch('/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (data.error && data.error === 'Unknown department') {
            window.alert('Enter valid roll number!');
        } else if (!response.ok) {
            throw new Error('Failed to submit CGPA data');
        } else {
            window.alert(`Hey ${formData.username}, your CGPA has been submitted to the HOD successfully!`);
            console.log('CGPA data submitted successfully');
        }
    } catch (error) {
        console.error('Error submitting CGPA data:', error);
    }
});