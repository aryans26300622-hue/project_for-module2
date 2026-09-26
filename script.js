/**
 * LensScape - Image Search App JavaScript Module
 * Part 2: Fetch & Render
 * Catches the search, fetches real results from the Wikimedia Commons API,
 * and renders one card per result into the results grid.
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

    // -------------------------------------------------------------------
    // 2. Core Functions: catch -> fetch -> render
    // -------------------------------------------------------------------

    /**
     * Entry point for every search (typed query OR a category chip click).
     * Ignores empty input; otherwise fetches and renders real results.
     * @param {string} rawQuery
     */
    async function executeSearch(rawQuery) {
        const query = rawQuery.trim();

        if (!query) {                  // Ignore empty searches — no API call
            resetToEmptyState();
            return;
        }

        const items = await fetchImages(query);
        renderResults(items, query);
    }

    /**
     * Requests matching images from the Wikimedia Commons API.
     * @param {string} query
     * @returns {Promise<Array>} list of Commons "page" objects
     */
    async function fetchImages(query) {
        const url =
            'https://commons.wikimedia.org/w/api.php?action=query&generator=search' +
            '&gsrsearch=' + encodeURIComponent(query) +
            '&gsrnamespace=6&gsrlimit=12&prop=imageinfo&iiprop=url&iiurlwidth=400' +
            '&format=json&origin=*';

        const response = await fetch(url);                  // 1. ask the API
        if (!response.ok) {                                  // 2. did it work?
            throw new Error(`Wikimedia request failed: ${response.status}`);
        }
        const data = await response.json();                  // 3. read the JSON

        if (!data.query || !data.query.pages) return [];     // no matches at all
        return Object.values(data.query.pages);
    }

    /**
     * Render one card per result into the results grid.
     * Enhancement: each card is a link that opens the full-resolution
     * original image in a new tab.
     * @param {Array} items
     * @param {string} query
     */
    function renderResults(items, query) {
        resultsContainer.innerHTML = '';    // clear previous grid items

        if (items.length === 0) {
            resultsCount.textContent = `No results found for "${query}"`;
            resultsContainer.appendChild(emptyState);
            emptyState.querySelector('h3').textContent = 'No Matches Found';
            emptyState.querySelector('p').textContent = 'Try adjusting your keywords or pick another category.';
            return;
        }

        resultsCount.textContent = `Showing ${items.length} result${items.length > 1 ? 's' : ''} for "${query}"`;

        items.forEach((item) => {
            const info = item.imageinfo && item.imageinfo[0];
            if (!info) return;   // skip any page the API returned with no image data

            const cleanTitle = item.title
                .replace(/^File:/, '')
                .replace(/\.[a-zA-Z0-9]+$/, '');

            // The card itself is an <a> tag, so the whole card opens the
            // full-resolution original in a new tab.
            const card = document.createElement('a');
            card.className = 'image-card';
            card.href = info.url;
            card.target = '_blank';
            card.rel = 'noopener noreferrer';

            const thumbWrap = document.createElement('div');
            thumbWrap.className = 'card-thumb';

            const img = document.createElement('img');
            img.src = info.thumburl || info.url;
            img.alt = cleanTitle;
            img.loading = 'lazy';
            img.onerror = function () {
                this.src = 'https://placehold.co/600x400/1e293b/f59e0b?text=LensScape+Visual';
            };
            thumbWrap.appendChild(img);

            const body = document.createElement('div');
            body.className = 'card-body';

            const badge = document.createElement('span');
            badge.className = 'card-badge';
            badge.textContent = 'Commons';

            const title = document.createElement('h4');
            title.className = 'card-title';
            title.textContent = cleanTitle;

            body.appendChild(badge);
            body.appendChild(title);

            card.appendChild(thumbWrap);
            card.appendChild(body);
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
    // 3. DOM Event Listeners
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

    // Form Submit Event Handler — catch the search
    searchForm.addEventListener('submit', (event) => {
        event.preventDefault();             // stop the page from reloading
        executeSearch(searchInput.value);   // read query, fetch, render
    });

    // Category Chips Quick Selection
    categoryChips.forEach((chip) => {
        chip.addEventListener('click', () => {
            const tagValue = chip.getAttribute('data-tag');
            searchInput.value = tagValue;
            clearBtn.classList.remove('hidden');
            executeSearch(tagValue);
        });
    });

    console.log('LensScape wired to the Wikimedia Commons API.');
});
