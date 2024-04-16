let totalCredits = 0;
let totalPoints = 0;

function calculatCGPA() {
    const matCredit = 4; 
    const phyCredit = 4;
    const codeCredit = 4; 
    const chemCredit = 4;
    const engCredit = 4;
    const TamCredit = 1;
    const aptCredit = 1;
    const coreCredit = 4;

    const matGrade = parseFloat(document.getElementById('matGrade').value);
    const phyGrade = parseFloat(document.getElementById('phyGrade').value);
    const codeGrade = parseFloat(document.getElementById('codeGrade').value);
    const chemGrade = parseFloat(document.getElementById('chemGrade').value);
    const engGrade = parseFloat(document.getElementById('engGrade').value);
    const TamGrade = parseFloat(document.getElementById('TamGrade').value);
    const aptGrade = parseFloat(document.getElementById('aptGrade').value);
    const coreGrade = parseFloat(document.getElementById('coreGrade').value);

    if (isNaN(matGrade) || isNaN(phyGrade) || isNaN(codeGrade) || isNaN(chemGrade) || isNaN(engGrade) || isNaN(TamGrade) || isNaN(aptGrade) || isNaN(codeGrade)){
        alert('Please enter valid grades for all subjects.')
        return;
    }

    totalCredits = matCredit + phyCredit + codeCredit + chemCredit + engCredit + TamCredit + aptCredit + coreCredit ;
    totalPoints = (matCredit * matGrade) + (phyCredit * phyGrade) + (codeCredit * codeGrade) + (chemCredit * chemGrade) + (engCredit * engGrade) + (TamGrade * TamCredit) +(aptCredit * aptGrade) + (coreCredit * coreGrade);


    const cgpaSpan = document.getElementById('cgpa');
    const cgpa = (totalPoints / totalCredits).toFixed(3);
    cgpaSpan.textContent = cgpa;
} 
function change(){
    window.location.href = "index.html";
}