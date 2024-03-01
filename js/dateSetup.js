document.addEventListener('DOMContentLoaded', function() {
    
    const endDateInput = document.getElementById('endDate');
    const startDateInput = document.getElementById('startDate');

    const today = new Date();
    const lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);

    endDateInput.valueAsDate = today;
    startDateInput.valueAsDate = lastWeek;
});