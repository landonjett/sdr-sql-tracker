document.getElementById('calculate').addEventListener('click', function() {
    const goal = parseInt(document.getElementById('goal').value);
    const currentSQLs = parseInt(document.getElementById('currentSQLs').value);
    const outOfOfficeDays = parseInt(document.getElementById('outOfOfficeDays').value) || 0;

    if (!goal || !currentSQLs) {
        alert('Please enter both your goal and current SQLs.');
        return;
    }

    if (outOfOfficeDays < 0) {
        alert('Out of Office Days cannot be negative.');
        return;
    }

    const today = new Date();
    const currentDay = today.getDate();
    const totalDays = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

    let workingDaysLeft = 0;
    for (let day = currentDay; day <= totalDays; day++) {
        let testDate = new Date(today.getFullYear(), today.getMonth(), day);
        if (testDate.getDay() !== 0 && testDate.getDay() !== 6) { // 0: Sunday, 6: Saturday
            workingDaysLeft++;
        }
    }

    workingDaysLeft -= outOfOfficeDays;
    if (workingDaysLeft < 0) {
        alert('Your Out of Office Days exceed the working days left in the month. Please adjust.');
        workingDaysLeft = 0;
    }

    const dailyPace = currentSQLs / currentDay;
    const projectedEndOfMonthSQLs = dailyPace * totalDays;
    const projectionPercentage = ((projectedEndOfMonthSQLs / goal) * 100).toFixed(2);

    document.getElementById('progressText').innerText = `Based on your current pace, you are on track to achieve ${projectionPercentage}% of your goal by month end.`;
    document.getElementById('workingDaysLeft').innerText = `Working days left (excluding out of office): ${workingDaysLeft}`;

    let requiredSQLsPerDay = (goal - currentSQLs) / workingDaysLeft;
    requiredSQLsPerDay = requiredSQLsPerDay > 0 ? requiredSQLsPerDay : 0; // Ensure non-negative

    document.getElementById('requiredSQLsPerDay').innerText = `Required SQLs per day to meet goal: ${requiredSQLsPerDay.toFixed(2)}`;

    // Update the chart to reflect the projection
    const ctx = document.getElementById('progressChart').getContext('2d');
    if (window.myChart) {
        window.myChart.destroy(); // Destroy the old chart instance if it exists
    }
    window.myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Projected', 'Goal'],
            datasets: [{
                label: 'SQL Projection',
                data: [projectedEndOfMonthSQLs, goal - projectedEndOfMonthSQLs],
                backgroundColor: [
                    '#d0bdf4', // Change this to your custom color for projected
                    '#a0d2eb'  // Change this to your custom color for goal
                ],
                borderColor: [
                    '#d0bdf4', // Change this to your custom color for projected
                    '#a0d2eb'  // Change this to your custom color for goal
                ],
                borderWidth: 1
            }]
        },
        options: {
            aspectRatio: 1.3, // Adjust aspect ratio to make the chart slightly smaller
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
});
