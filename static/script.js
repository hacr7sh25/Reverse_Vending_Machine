// Get DOM elements
const uploadInput = document.getElementById('upload');
const fileLabel = document.querySelector('.file-input-label');
const previewImg = document.getElementById('preview');
const previewWrapper = document.getElementById('preview-wrapper');
const statusDiv = document.getElementById('status');
const resultsDiv = document.getElementById('results');
const scanBtn = document.getElementById('scanBtn');
const pointsSpan = document.getElementById('points');
const logList = document.getElementById('log');
const toastContainer = document.getElementById('toastContainer');
const themeToggle = document.getElementById('themeToggle');
const statsDashboard = document.getElementById('statsDashboard');

let totalPoints = 0;
let scanHistory = [];
let darkMode = false;
let statsVisible = false;

// Item point values (you can customize these)
const ITEM_POINTS = {
    'Glass': 10,
    'Metal': 15,
    'Plastic': 8,
    'Paper': 5,
    'Cardboard': 7,
    'default': 5
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadHistory();
    setupDragDrop();
    loadTheme();
    loadStatsVisibility();
    updateStatsDashboard();
});

// ==================== DARK MODE ====================
function toggleDarkMode() {
    darkMode = !darkMode;
    document.body.classList.toggle('dark-mode');
    themeToggle.textContent = darkMode ? '☀️' : '🌙';
    localStorage.setItem('darkMode', darkMode);
    showToast('Dark mode ' + (darkMode ? 'enabled' : 'disabled'), 'info');
}

function loadTheme() {
    const saved = localStorage.getItem('darkMode');
    if (saved === 'true') {
        darkMode = true;
        document.body.classList.add('dark-mode');
        themeToggle.textContent = '☀️';
    }
}

// ==================== TOAST NOTIFICATIONS ====================
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span>${message}</span>
    `;
    toastContainer.appendChild(toast);

    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.classList.add('hide');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// ==================== STATISTICS DASHBOARD ====================
function toggleStats() {
    statsVisible = !statsVisible;
    localStorage.setItem('statsVisible', statsVisible);
    if (statsVisible) {
        statsDashboard.classList.add('show');
    } else {
        statsDashboard.classList.remove('show');
    }
}

function loadStatsVisibility() {
    const saved = localStorage.getItem('statsVisible');
    statsVisible = saved === 'true';
    if (statsVisible) {
        statsDashboard.classList.add('show');
    }
}

function updateStatsDashboard() {
    if (scanHistory.length === 0) {
        return;
    }

    const totalScans = scanHistory.length;
    const avgConfidence = (scanHistory.reduce((sum, scan) => sum + parseFloat(scan.confidence), 0) / scanHistory.length).toFixed(1);
    
    // Find most detected item
    const itemCounts = {};
    scanHistory.forEach(scan => {
        itemCounts[scan.class] = (itemCounts[scan.class] || 0) + 1;
    });
    
    const mostDetected = Object.keys(itemCounts).length > 0 
        ? Object.keys(itemCounts).reduce((a, b) => itemCounts[a] > itemCounts[b] ? a : b)
        : '-';
    
    // Points per day (simplified - based on current session)
    const pointsPerDay = totalPoints;

    // Update UI
    document.getElementById('totalScans').textContent = totalScans;
    document.getElementById('avgConfidence').textContent = avgConfidence + '%';
    document.getElementById('mostDetected').textContent = mostDetected;
    document.getElementById('pointsPerDay').textContent = pointsPerDay;

    // Item breakdown
    const breakdownDiv = document.getElementById('itemBreakdown');
    breakdownDiv.innerHTML = '';
    
    const maxCount = Math.max(...Object.values(itemCounts), 1);
    Object.entries(itemCounts).forEach(([item, count]) => {
        const percentage = (count / totalScans * 100).toFixed(0);
        const fillPercentage = (count / maxCount * 100).toFixed(0);
        
        const row = document.createElement('div');
        row.className = 'stat-item-row';
        row.innerHTML = `
            <span style="min-width: 60px;">${item}</span>
            <div class="stat-item-bar">
                <div class="stat-item-fill" style="width: ${fillPercentage}%;"></div>
            </div>
            <span style="min-width: 40px; text-align: right;">${count} (${percentage}%)</span>
        `;
        breakdownDiv.appendChild(row);
    });

    // Show stats if there's data
    if (totalScans > 0 && statsVisible) {
        statsDashboard.classList.add('show');
    }
}

// ==================== DRAG AND DROP ====================
function setupDragDrop() {
    const dragArea = fileLabel;

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dragArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dragArea.addEventListener(eventName, () => {
            dragArea.style.background = '#e6f2ff';
            dragArea.style.borderColor = '#00c6ff';
        });
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dragArea.addEventListener(eventName, () => {
            dragArea.style.background = '#f0f8ff';
            dragArea.style.borderColor = '#4facfe';
        });
    });

    dragArea.addEventListener('drop', handleDrop);
}

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    uploadInput.files = files;
    previewImage();
}

// File input change
uploadInput.addEventListener('change', previewImage);

function previewImage() {
    const file = uploadInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            previewImg.src = e.target.result;
            previewImg.style.display = 'block';
            updateStatus('✅ Image selected. Click "Scan Item" to analyze.', 'success');
            showToast('Image loaded successfully', 'success');
        };
        reader.readAsDataURL(file);
    }
}

// ==================== SCAN FUNCTION ====================
async function scan() {
    const file = uploadInput.files[0];
    if (!file) {
        updateStatus('⚠️ Please select an image first!', 'error');
        showToast('Please select an image first', 'error');
        return;
    }

    // Show loading state with better animation
    scanBtn.disabled = true;
    updateStatus('<div class="loader-dots"><span></span><span></span><span></span></div> Processing your image...', 'loading');
    resultsDiv.classList.remove('show');

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('/scan', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            // Update results
            displayResults(result);
            
            // Update history
            addToHistory(result);
            
            // Update points
            updatePoints(result.class);

            // Update stats
            updateStatsDashboard();
            
            updateStatus('✅ Scan completed successfully!', 'success');
            showToast(`Detected: ${result.class} (${(result.confidence * 100).toFixed(1)}%)`, 'success');
        } else {
            updateStatus('❌ Error: ' + result.error, 'error');
            showToast('Scan failed: ' + result.error, 'error');
        }
    } catch (error) {
        updateStatus('❌ Error: ' + error.message, 'error');
        showToast('Error: ' + error.message, 'error');
        console.error('Scan error:', error);
    } finally {
        scanBtn.disabled = false;
    }
}

function updateStatus(message, className) {
    statusDiv.innerHTML = message;
    statusDiv.className = 'status ' + className;
}

function displayResults(result) {
    document.getElementById('detectedClass').textContent = result.class;
    document.getElementById('confidence').textContent = (result.confidence * 100).toFixed(2) + '%';
    document.getElementById('confidenceFill').style.width = (result.confidence * 100) + '%';
    document.getElementById('procTime').textContent = (result.time * 1000).toFixed(2) + ' ms';
    document.getElementById('inferenceId').textContent = result.inference_id;
    
    resultsDiv.classList.add('show');
}

function updatePoints(itemClass) {
    const points = ITEM_POINTS[itemClass] || ITEM_POINTS['default'];
    totalPoints += points;
    pointsSpan.textContent = totalPoints;
    
    // Save to localStorage
    localStorage.setItem('totalPoints', totalPoints);
}

function addToHistory(result) {
    const timestamp = new Date().toLocaleTimeString();
    const historyEntry = {
        class: result.class,
        confidence: (result.confidence * 100).toFixed(2),
        time: timestamp,
        points: ITEM_POINTS[result.class] || ITEM_POINTS['default']
    };
    
    scanHistory.unshift(historyEntry);
    if (scanHistory.length > 20) {
        scanHistory.pop(); // Keep only last 20 scans
    }
    
    updateHistoryDisplay();
    localStorage.setItem('scanHistory', JSON.stringify(scanHistory));
}

function updateHistoryDisplay() {
    logList.innerHTML = '';
    
    if (scanHistory.length === 0) {
        logList.innerHTML = '<li style="color: #999;">No scans yet</li>';
        return;
    }
    
    scanHistory.forEach(entry => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${entry.class}</strong> (${entry.confidence}%) at ${entry.time} <span style="color: #28a745; font-weight: bold;">+${entry.points} pts</span>`;
        logList.appendChild(li);
    });
}

function loadHistory() {
    const saved = localStorage.getItem('scanHistory');
    if (saved) {
        scanHistory = JSON.parse(saved);
        updateHistoryDisplay();
    }
    
    const savedPoints = localStorage.getItem('totalPoints');
    if (savedPoints) {
        totalPoints = parseInt(savedPoints);
        pointsSpan.textContent = totalPoints;
    }
}

function clearForm() {
    uploadInput.value = '';
    previewImg.src = '';
    previewImg.style.display = 'none';
    updateStatus('Waiting for input...', '');
    resultsDiv.classList.remove('show');
    showToast('Form cleared', 'info');
}

// Optional: Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.code === 'Enter' && uploadInput.files.length > 0) {
        scan();
    }
    if (e.code === 'KeyC' && e.ctrlKey) {
        clearForm();
    }
});
