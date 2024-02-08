document.addEventListener('DOMContentLoaded', () => {
    const studentNameInput = document.getElementById('studentName');
    const clockInButton = document.getElementById('clockInButton');
    const clockOutButton = document.getElementById('clockOutButton');
    const timerDisplay = document.getElementById('timerDisplay');
    const historyLogContainer = document.getElementById('historyLog');
    let clockTimer = null;
    let startTime = null;

    function clockIn() {
        const studentName = studentNameInput.value.trim();
        if (!studentName) {
            alert("Please enter your name.");
            return;
        }
        startTime = new Date();
        localStorage.setItem(studentName + "_in", startTime.toISOString());
        clockInButton.disabled = true; // Disable clock in button after use
        clockOutButton.disabled = false; // Enable clock out button
        updateTimerDisplay(true);
    }

    function clockOut() {
        const studentName = studentNameInput.value.trim();
        if (!studentName) {
            alert("Please enter your name again to clock out.");
            return;
        }
        const endTime = new Date();
        const clockInTime = localStorage.getItem(studentName + "_in");
        if (!clockInTime) {
            alert("You need to clock in before clocking out.");
            return;
        }
        const duration = endTime - new Date(clockInTime);
        const minutes = Math.round(duration / 60000); // Convert duration from milliseconds to minutes
        updateHistory(studentName, new Date(clockInTime), endTime, minutes);
        localStorage.removeItem(studentName + "_in"); // Clear the clock-in time
        updateTimerDisplay(false); // Stop the timer
        studentNameInput.value = ''; // Clear the name from the input field for the next user
        clockInButton.disabled = false; // Enable clock in button again
        clockOutButton.disabled = true; // Disable clock out button until next clock in
    }

    function updateTimerDisplay(start) {
        if (start) {
            clearInterval(clockTimer); // Clear any existing timer
            clockTimer = setInterval(() => {
                const elapsed = new Date(new Date() - startTime);
                const hours = elapsed.getUTCHours().toString().padStart(2, '0');
                const minutes = elapsed.getMinutes().toString().padStart(2, '0');
                const seconds = elapsed.getSeconds().toString().padStart(2, '0');
                timerDisplay.textContent = `${hours}:${minutes}:${seconds}`;
            }, 1000);
        } else {
            clearInterval(clockTimer);
            timerDisplay.textContent = "00:00:00";
        }
    }

    function updateHistory(name, inTime, outTime, duration) {
        const entry = document.createElement('div');
        entry.textContent = `${name}, Time Out: ${inTime.toLocaleString()}, Time In: ${outTime.toLocaleString()}, Duration: ${duration} minutes.`;
        historyLogContainer.appendChild(entry);
    }

    clockInButton.addEventListener('click', clockIn);
    clockOutButton.addEventListener('click', clockOut);
});
