function calculateCGPA() {
  let totalCredits = 0;
  let totalPoints = 0;

  const matCredit = 4; 
  const phyCredit = 3;
  const codeCredit = 3; 
  const chemCredit = 3;
  const engCredit = 3;
  const TamCredit = 1;
  const tamlab = 2;
  const englab = 1;
  const chylab = 2;

  const matGrade = parseFloat(document.getElementById('matGrade').value);
  const phyGrade = parseFloat(document.getElementById('phyGrade').value);
  const codeGrade = parseFloat(document.getElementById('codeGrade').value);
  const chemGrade = parseFloat(document.getElementById('chemGrade').value);
  const engGrade = parseFloat(document.getElementById('engGrade').value);
  const TamGrade = parseFloat(document.getElementById('TamGrade').value);
  const tamGrade = parseFloat(document.getElementById('tamGrade').value);
  const EngGrade = parseFloat(document.getElementById('EngGrade').value);
  const chyGrade = parseFloat(document.getElementById('chyGrade').value);

  if (isNaN(matGrade) || isNaN(phyGrade) || isNaN(codeGrade) || isNaN(chemGrade) || isNaN(engGrade) || isNaN(TamGrade) || isNaN(tamGrade) || isNaN(EngGrade) || isNaN(chyGrade)){
      window.alert('Please enter valid grades for all subjects.')
      return;
  }

  const kadan =  tamlab + englab + chylab;
  const pulli = (tamlab * tamGrade) + (englab * EngGrade) + (chylab * chyGrade);
  totalCredits = matCredit + phyCredit + codeCredit + chemCredit + engCredit + TamCredit  + kadan;
  totalPoints = (matCredit * matGrade) + (phyCredit * phyGrade) + (codeCredit * codeGrade) + (chemCredit * chemGrade) + (engCredit * engGrade) + (TamGrade * TamCredit) + pulli;

  const cgpaSpan = document.getElementById('cgpa');
  const cgpa = (totalPoints / totalCredits).toFixed(2);
  cgpaSpan.textContent = cgpa;
}

function change() {
  window.location.href = "cit.html";
}

const form = document.getElementById('cgpaForm'); 

form.addEventListener('submit', async (event) => {
  event.preventDefault();

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

      if (!response.ok) {
          throw new Error('Failed to submit CGPA data');  
      }

      console.log('CGPA data submitted successfully');
  } catch (error) {
      console.error('Error submitting CGPA data:', error);
  }
});
