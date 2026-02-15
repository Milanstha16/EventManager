document.addEventListener("DOMContentLoaded", () => {

    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
        window.location.href = "login.html";
    }

    const eventForm = document.getElementById("eventForm");
    const eventList = document.getElementById("eventList");

    // Load events from localStorage
    let events = JSON.parse(localStorage.getItem("events")) || [];

    // Detect readonly mode
    const urlParams = new URLSearchParams(window.location.search);
    const viewMode = urlParams.get("view"); // 'readonly' or null

    // Hide form in readonly mode
    if (viewMode === "readonly" && eventForm) {
        eventForm.style.display = "none";
    }

    // Save events to localStorage
    function saveEvents() {
        localStorage.setItem("events", JSON.stringify(events));
    }

    // Get event status based on date
    function getStatus(date) {
        const today = new Date().toISOString().split("T")[0];
        if (date > today) return "upcoming";
        if (date === today) return "ongoing";
        return "completed";
    }

    // Render events list
    function renderEvents() {
        eventList.innerHTML = "";

        const search = document.getElementById("searchInput")?.value.toLowerCase() || "";
        const filterCategory = document.getElementById("filterCategory")?.value || "all";
        const filterStatus = document.getElementById("filterStatus")?.value || "all";

        events.forEach(event => {
            const status = getStatus(event.date);

            // Filter events
            if (
                event.title.toLowerCase().includes(search) &&
                (filterCategory === "all" || event.category === filterCategory) &&
                (filterStatus === "all" || status === filterStatus)
            ) {
                // Create card
                const card = document.createElement("div");
                card.className = "event-card";

                card.innerHTML = `
                    <h3>${event.title}</h3>
                    <p><strong>Date:</strong> ${event.date}</p>
                    <p><strong>Category:</strong> ${event.category}</p>
                    <p><strong>Status:</strong> ${status}</p>
                    <p>${event.description}</p>
                    <div class="event-actions">
                        <button class="edit-btn">Edit</button>
                        <button class="delete-btn">Delete</button>
                    </div>
                `;

                // Append first
                eventList.appendChild(card);

                if (viewMode === "readonly") {
                    // Hide buttons in readonly
                    card.querySelectorAll(".edit-btn, .delete-btn").forEach(btn => btn.style.display = "none");
                } else {
                    // Attach event listeners
                    const editBtn = card.querySelector(".edit-btn");
                    const deleteBtn = card.querySelector(".delete-btn");

                    editBtn.addEventListener("click", () => editEvent(event.id));
                    deleteBtn.addEventListener("click", () => deleteEvent(event.id));
                }
            }
        });
    }

    // Add or update event
    if (eventForm) {
        eventForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const id = document.getElementById("eventId").value;
            const title = document.getElementById("title").value.trim();
            const date = document.getElementById("date").value;
            const category = document.getElementById("category").value;
            const description = document.getElementById("description").value.trim();

            // Simple validation
            if (title.length < 3) {
                document.getElementById("eventError").textContent = "Title must be at least 3 characters.";
                return;
            }

            if (id) {
                // Update existing event
                const index = events.findIndex(e => e.id == id);
                events[index] = { ...events[index], title, date, category, description };
            } else {
                // Add new event
                events.push({ id: Date.now(), title, date, category, description });
            }

            saveEvents();
            eventForm.reset();
            document.getElementById("eventId").value = "";
            document.getElementById("eventError").textContent = "";
            renderEvents();
        });
    }

    // Delete event
    function deleteEvent(id) {
        if (confirm("Are you sure you want to delete this event?")) {
            events = events.filter(e => e.id !== id);
            saveEvents();
            renderEvents();
        }
    }

    // Edit event
    function editEvent(id) {
        const event = events.find(e => e.id === id);
        if (!event) return;

        document.getElementById("eventId").value = event.id;
        document.getElementById("title").value = event.title;
        document.getElementById("date").value = event.date;
        document.getElementById("category").value = event.category;
        document.getElementById("description").value = event.description;

        // Scroll to top for form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Filters
    const searchInput = document.getElementById("searchInput");
    const filterCategory = document.getElementById("filterCategory");
    const filterStatus = document.getElementById("filterStatus");

    searchInput?.addEventListener("input", renderEvents);
    filterCategory?.addEventListener("change", renderEvents);
    filterStatus?.addEventListener("change", renderEvents);

    // Initial render
    renderEvents();
});
