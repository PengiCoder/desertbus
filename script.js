document.addEventListener('DOMContentLoaded', () => {
    const checklistItems = document.querySelectorAll('.title-item');

    // Load saved state from localStorage
    const savedState = JSON.parse(localStorage.getItem('titleChecklist')) || {};

    checklistItems.forEach(item => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        const title = item.dataset.title; // Get the title from the data-title attribute

        // Set initial state from saved data
        if (savedState[title]) {
            checkbox.checked = true;
            item.classList.add('completed');
        }

        // Toggle completion on checkbox click
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                item.classList.add('completed');
                savedState[title] = true;
            } else {
                item.classList.remove('completed');
                delete savedState[title]; // Remove from savedState if unchecked
            }
            localStorage.setItem('titleChecklist', JSON.stringify(savedState));
        });

        // Toggle description visibility on item click (but not on checkbox click)
        item.addEventListener('click', (event) => {
            // Check if the click target is the checkbox or label.
            // If it is, we let the checkbox handler manage the state.
            if (event.target !== checkbox && event.target.tagName.toLowerCase() !== 'label') {
                item.classList.toggle('expanded');
            }
        });
    });
});
