/**
 * LensScape - Image Search App JavaScript Module
 * Handles UI interaction, search queries, chip selection, and empty state updates.
 */

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------------
    // 1. DOM Element Selections
    // -------------------------------------------------------------------
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const clearBtn = document.getElementById('clear-btn');
    const resultsCount = document.getElementById('results-count');
    const resultsContainer = document.getElementById('results-container');
    const emptyState = document.getElementById('empty-state');
    const categoryChips = document.querySelectorAll('.chip');

    // Mock dataset for local query demonstration
    const MOCK_GALLERY = [
        { id: 1, title: 'Mountain Misty Sunrise', category: 'Nature', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80' },
        { id: 2, title: 'Futuristic Neon Tower', category: 'Cyberpunk', url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=600&q=80' },
        { id: 3, title: 'Modern Glass Facade', category: 'Architecture', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80' },
        { id: 4, title: 'Majestic Snow Leopard', category: 'Wildlife', url: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=600&q=80' },
        { id: 5, title: 'Coastal Wave Drone View', category: 'Drone Visuals', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80' },
        { id: 6, title: 'Abstract Geometry Lines', category: 'Minimalism', url: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=600&q=80' }
    ];

    // -------------------------------------------------------------------
    // 2. Event Handlers & Core Functions
    // -------------------------------------------------------------------

    /**
     * Executes image search based on user input or tag selection
     * @param {string} query 
     */
    function executeSearch(query) {
        const cleanQuery = query.trim().toLowerCase();

        if (!cleanQuery) {
            resetToEmptyState();
            return;
        }

        // Filter mock items
        const matches = MOCK_GALLERY.filter(item => 
            item.title.toLowerCase().includes(cleanQuery) || 
            item.category.toLowerCase().includes(cleanQuery)
        );

        renderResults(matches, cleanQuery);
    }

    /**
     * Render photo grid cards into results container
     */
    function renderResults(items, query) {
        // Clear previous grid items
        resultsContainer.innerHTML = '';

        if (items.length === 0) {
            resultsCount.textContent = `No results found for "${query}"`;
            resultsContainer.appendChild(emptyState);
            emptyState.querySelector('h3').textContent = 'No Matches Found';
            emptyState.querySelector('p').textContent = 'Try adjusting your keywords or clearing filters.';
            return;
        }

        resultsCount.textContent = `Showing ${items.length} result${items.length > 1 ? 's' : ''} for "${query}"`;

        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'image-card';
            card.style.cssText = `
                background: #1e293b;
                border-radius: 12px;
                overflow: hidden;
                border: 1px solid rgba(255,255,255,0.08);
                transition: transform 0.2s ease;
            `;
            card.innerHTML = `
                <div style="height: 180px; overflow: hidden; background: #0f172a;">
                    <img src="${item.url}" alt="${item.title}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='https://placehold.co/600x400/1e293b/f59e0b?text=LensScape+Visual'">
                </div>
                <div style="padding: 1rem;">
                    <span style="font-size: 0.7rem; color: #06b6d4; text-transform: uppercase; font-weight: 600;">${item.category}</span>
                    <h4 style="font-size: 0.95rem; font-weight: 600; color: #f8fafc; margin-top: 0.25rem;">${item.title}</h4>
                </div>
            `;
            resultsContainer.appendChild(card);
        });
    }

    /**
     * Resets view back to initial blank placeholder
     */
    function resetToEmptyState() {
        resultsContainer.innerHTML = '';
        resultsContainer.appendChild(emptyState);
        emptyState.querySelector('h3').textContent = 'Start Exploring LensScape';
        emptyState.querySelector('p').textContent = 'Type a search term above or select a popular category chip to discover high-resolution images.';
        resultsCount.textContent = 'Showing 0 results';
        clearBtn.classList.add('hidden');
    }

    // -------------------------------------------------------------------
    // 3. Setup DOM Event Listeners
    // -------------------------------------------------------------------

    // Search Input Typing Listener (Toggle Clear Button)
    searchInput.addEventListener('input', (e) => {
        if (e.target.value.length > 0) {
            clearBtn.classList.remove('hidden');
        } else {
            clearBtn.classList.add('hidden');
            resetToEmptyState();
        }
    });

    // Clear Search Input Button Event
    clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchInput.focus();
        resetToEmptyState();
    });

    // Form Submit Event Handler
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        executeSearch(searchInput.value);
    });

    // Category Chips Quick Selection
    categoryChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const tagValue = chip.getAttribute('data-tag');
            searchInput.value = tagValue;
            clearBtn.classList.remove('hidden');
            executeSearch(tagValue);
        });
    });

    console.log('LensScape initial JS scaffold bound successfully.');
});