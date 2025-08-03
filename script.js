document.addEventListener('DOMContentLoaded', () => {
    const uncompletedList = document.getElementById('uncompleted-checklist');
    const completedList = document.getElementById('completed-checklist');
    const allTitles = document.querySelectorAll('.title-item'); // Get all title items initially
    const progressBarFill = document.getElementById('progress-bar-fill');
    const progressPercentage = document.getElementById('progress-percentage');

    const totalTitles = allTitles.length;
    let completedCount = 0;

    // Load saved state from localStorage
    const savedState = JSON.parse(localStorage.getItem('titleChecklist')) || {};

    const updateProgressBar = () => {
        const percentage = totalTitles === 0 ? 0 : Math.round((completedCount / totalTitles) * 100);
        progressBarFill.style.width = `${percentage}%`;
        progressPercentage.textContent = `${percentage}%`;
    };

    const moveTitleItem = (item, isCompleted) => {
        if (isCompleted) {
            completedList.appendChild(item);
            item.classList.add('completed');
            item.querySelector('input[type="checkbox"]').checked = true;
        } else {
            // To ensure they return to their original order in the uncompleted list,
            // we should re-insert them based on their initial index or use a sorted append.
            // For simplicity, we'll just append to the uncompleted list,
            // which means newly uncompleted items will go to the bottom of that list.
            // If strict initial order is needed, a more complex sorting logic would be required.
            uncompletedList.appendChild(item);
            item.classList.remove('completed');
            item.querySelector('input[type="checkbox"]').checked = false;
        }
    };

    allTitles.forEach(item => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        const title = item.dataset.title; // Get the title from the data-title attribute

        // Set initial state from saved data
        if (savedState[title]) {
            completedCount++;
            moveTitleItem(item, true); // Move to completed list immediately if saved as completed
        } else {
            moveTitleItem(item, false); // Ensure it's in the uncompleted list
        }

        // Add event listener for checkbox change
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                completedCount++;
                savedState[title] = true;
                moveTitleItem(item, true);
            } else {
                completedCount--;
                delete savedState[title]; // Remove from savedState if unchecked
                moveTitleItem(item, false);
            }
            localStorage.setItem('titleChecklist', JSON.stringify(savedState));
            updateProgressBar(); // Update progress bar on every change
        });
    });

    // Initial progress bar update after all items are processed
    updateProgressBar();
});
