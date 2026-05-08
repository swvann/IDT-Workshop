import coursesData from './data.js';

// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const keywordTagsContainer = document.getElementById('keywordTags');
const courseGrid = document.getElementById('courseGrid');
const resultsCount = document.getElementById('resultsCount');
const compareDrawer = document.getElementById('compareDrawer');
const compareCount = document.getElementById('compareCount');
const clearCompareBtn = document.getElementById('clearCompareBtn');
const compareBtn = document.getElementById('compareBtn');
const compareModal = document.getElementById('compareModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const comparisonGrid = document.getElementById('comparisonGrid');
const suggestionBanner = document.getElementById('suggestionBanner');
const suggestionText = document.getElementById('suggestionText');

// State
let activeKeywords = new Set();
let searchQuery = '';
let compareList = new Set(); // Stores course IDs

// Initialize
function init() {
    renderKeywordTags();
    renderCourses(coursesData);
    setupEventListeners();
}

// Render Keywords from Data
function renderKeywordTags() {
    const allTags = new Set();
    coursesData.forEach(course => {
        course.tags.forEach(tag => allTags.add(tag));
    });

    keywordTagsContainer.innerHTML = '';
    Array.from(allTags).sort().forEach(tag => {
        const tagEl = document.createElement('span');
        tagEl.className = 'tag';
        tagEl.textContent = tag;
        tagEl.dataset.tag = tag;
        keywordTagsContainer.appendChild(tagEl);
    });
}

// Render Course Cards
function renderCourses(courses) {
    courseGrid.innerHTML = '';
    resultsCount.textContent = `Showing ${courses.length} course${courses.length !== 1 ? 's' : ''}`;

    if (courses.length === 0) {
        courseGrid.innerHTML = '<p style="color: var(--text-secondary); grid-column: 1 / -1;">No courses found matching your criteria.</p>';
        return;
    }

    courses.forEach(course => {
        const isSelected = compareList.has(course.id);
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-header">
                <span class="badge badge-level-${course.level.toLowerCase()}">${course.level}</span>
            </div>
            <h3 class="card-title">${course.title}</h3>
            <div class="card-meta">
                <span><i class="icon">👩‍🏫</i> ${course.instructor}</span>
                <span><i class="icon">⏱️</i> ${course.workload} hrs/wk</span>
            </div>
            <p class="card-desc">${course.description}</p>
            <div class="card-tags">
                ${course.tags.slice(0, 3).map(tag => `<span class="card-tag">${tag}</span>`).join('')}
                ${course.tags.length > 3 ? `<span class="card-tag">+${course.tags.length - 3}</span>` : ''}
            </div>
            <button class="btn-compare-add ${isSelected ? 'selected' : ''}" data-id="${course.id}">
                ${isSelected ? 'Remove from Compare' : 'Add to Compare'}
            </button>
        `;
        courseGrid.appendChild(card);
    });
}

// Filter Logic
function filterCourses() {
    let filtered = coursesData;

    // Filter by search query
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(course => 
            course.title.toLowerCase().includes(query) ||
            course.description.toLowerCase().includes(query) ||
            course.coreTopics.some(topic => topic.toLowerCase().includes(query))
        );
    }

    // Filter by active keywords (Must have ALL selected keywords to show up)
    if (activeKeywords.size > 0) {
        filtered = filtered.filter(course => {
            let hasAll = true;
            activeKeywords.forEach(keyword => {
                if (!course.tags.includes(keyword)) hasAll = false;
            });
            return hasAll;
        });
    }

    renderCourses(filtered);
}

// Handle Compare State
function toggleCompare(courseId) {
    if (compareList.has(courseId)) {
        compareList.delete(courseId);
    } else {
        if (compareList.size >= 3) {
            alert('You can only compare up to 3 courses at a time.');
            return;
        }
        compareList.add(courseId);
    }
    
    updateCompareUI();
    renderCourses(coursesData); // Re-render to update button states, maintaining current filters is better but this is simpler for prototype
    filterCourses(); // To apply current filters to re-rendered cards
}

function updateCompareUI() {
    compareCount.textContent = compareList.size;
    
    if (compareList.size > 0) {
        compareDrawer.classList.add('visible');
        compareBtn.disabled = compareList.size < 2; // Need at least 2 to compare
    } else {
        compareDrawer.classList.remove('visible');
    }
}

// Suggestion Engine Logic
function calculateBestFit() {
    if (compareList.size < 2) return null;

    let bestCourse = null;
    let maxScore = -1;

    // The score is calculated based on how many tags match the active filter keywords or search query
    const searchTerms = searchQuery.toLowerCase().split(' ').filter(t => t.length > 2);

    Array.from(compareList).forEach(id => {
        const course = coursesData.find(c => c.id === id);
        let score = 0;

        // Match tags with active keywords
        course.tags.forEach(tag => {
            if (activeKeywords.has(tag)) score += 2;
        });

        // Match description/topics with search terms
        searchTerms.forEach(term => {
            if (course.description.toLowerCase().includes(term)) score += 1;
            course.coreTopics.forEach(topic => {
                if (topic.toLowerCase().includes(term)) score += 1;
            });
        });

        if (score > maxScore) {
            maxScore = score;
            bestCourse = course;
        }
    });

    // If score is 0, just return the first one as a default fallback, or null if we don't want to suggest unless there's a reason
    return maxScore > 0 ? bestCourse : null;
}

// Render Comparison Modal
function renderComparison() {
    comparisonGrid.innerHTML = '';
    const selectedCourses = Array.from(compareList).map(id => coursesData.find(c => c.id === id));
    
    const bestFit = calculateBestFit();

    if (bestFit) {
        suggestionBanner.classList.remove('hidden');
        suggestionText.innerHTML = `Based on your interests, <strong>${bestFit.title}</strong> is the strongest match for you.`;
    } else {
        suggestionBanner.classList.add('hidden');
    }

    selectedCourses.forEach(course => {
        const isRecommended = bestFit && bestFit.id === course.id;
        
        const col = document.createElement('div');
        col.className = `compare-col ${isRecommended ? 'recommended' : ''}`;
        
        col.innerHTML = `
            ${isRecommended ? '<div class="badge badge-best-fit" style="margin-bottom: 1rem;">Recommended</div>' : ''}
            <h3 style="margin-bottom: 0.5rem;">${course.title}</h3>
            <p style="color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 1.5rem;">${course.instructor}</p>
            
            <div class="compare-section">
                <h4>Overview</h4>
                <p>${course.level} Level</p>
                <p>${course.credits} Credits</p>
                <p>${course.workload} Hours/Week</p>
            </div>
            
            <div class="compare-section">
                <h4>Prerequisites</h4>
                <p>${course.prerequisites}</p>
            </div>
            
            <div class="compare-section">
                <h4>Core Topics</h4>
                <ul>
                    ${course.coreTopics.map(topic => `<li>${topic}</li>`).join('')}
                </ul>
            </div>
            
            <div class="compare-section">
                <h4>Keywords</h4>
                <div class="card-tags" style="margin-bottom:0;">
                    ${course.tags.map(tag => `<span class="card-tag">${tag}</span>`).join('')}
                </div>
            </div>
        `;
        comparisonGrid.appendChild(col);
    });
}

// Event Listeners
function setupEventListeners() {
    // Search input
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        filterCourses();
    });

    // Search button (optional since input event handles real-time, but good for UX)
    searchBtn.addEventListener('click', () => {
        searchQuery = searchInput.value;
        filterCourses();
    });

    // Keyword Tags delegation
    keywordTagsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('tag')) {
            const tag = e.target.dataset.tag;
            if (activeKeywords.has(tag)) {
                activeKeywords.delete(tag);
                e.target.classList.remove('active');
            } else {
                activeKeywords.add(tag);
                e.target.classList.add('active');
            }
            filterCourses();
        }
    });

    // Course Grid Delegation (Add to Compare)
    courseGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-compare-add')) {
            const courseId = e.target.dataset.id;
            toggleCompare(courseId);
        }
    });

    // Clear Compare
    clearCompareBtn.addEventListener('click', () => {
        compareList.clear();
        updateCompareUI();
        filterCourses();
    });

    // Open Compare Modal
    compareBtn.addEventListener('click', () => {
        renderComparison();
        compareModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    });

    // Close Compare Modal
    closeModalBtn.addEventListener('click', () => {
        compareModal.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    // Close on overlay click
    compareModal.addEventListener('click', (e) => {
        if (e.target === compareModal) {
            compareModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Run
init();
