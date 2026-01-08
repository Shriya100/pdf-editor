// State
let files = [];
let activeFeature = 'merge';

// DOM Elements
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const fileList = document.getElementById('fileList');
const optionsPanel = document.getElementById('optionsPanel');
const optionsTitle = document.getElementById('optionsTitle');
const optionsContent = document.getElementById('optionsContent');
const processBtn = document.getElementById('processBtn');
const btnText = document.getElementById('btnText');
const spinner = document.getElementById('spinner');
const featureBtns = document.querySelectorAll('.feature-btn');

// Feature configurations
const features = {
    merge: {
        title: '🔗 Merge all PDFs into one document',
        btnText: 'Merge PDF',
        options: null
    },
    split: {
        title: '✂️ Split PDF into separate pages',
        btnText: 'Split PDF',
        options: `
            <label class="radio-option">
                <input type="radio" name="split" value="individual" checked>
                <span>Split into individual pages</span>
            </label>
            <label class="radio-option">
                <input type="radio" name="split" value="range">
                <span>Split by page range</span>
            </label>
        `
    },
    compress: {
        title: '📦 Reduce file size while maintaining quality',
        btnText: 'Compress PDF',
        options: `
            <label class="radio-option">
                <input type="radio" name="compress" value="recommended" checked>
                <span>⚡ Recommended compression</span>
            </label>
            <label class="radio-option">
                <input type="radio" name="compress" value="maximum">
                <span>💪 Maximum compression</span>
            </label>
        `
    },
    protect: {
        title: '🔒 Add password protection to your PDF',
        btnText: 'Protect PDF',
        options: '<input type="password" class="option-input" id="passwordInput" placeholder="Enter new password">'
    },
    unlock: {
        title: '🔓 Remove password from PDF',
        btnText: 'Unlock PDF',
        options: '<input type="password" class="option-input" id="passwordInput" placeholder="Enter current password">'
    },
    convert: {
        title: '🖼️ Convert PDF pages to image files',
        btnText: 'Convert to Images',
        options: null
    },
    rotate: {
        title: '🔄 Rotate PDF pages',
        btnText: 'Rotate PDF',
        options: `
            <label class="radio-option">
                <input type="radio" name="rotate" value="90" checked>
                <span>↪️ Rotate 90° clockwise</span>
            </label>
            <label class="radio-option">
                <input type="radio" name="rotate" value="-90">
                <span>↩️ Rotate 90° counter-clockwise</span>
            </label>
            <label class="radio-option">
                <input type="radio" name="rotate" value="180">
                <span>🔄 Rotate 180°</span>
            </label>
        `
    }
};

// Event Listeners
uploadArea.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', handleFileUpload);
processBtn.addEventListener('click', processFiles);

featureBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        featureBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeFeature = btn.dataset.feature;
        updateOptions();
        updateProcessButton();
    });
});

// Drag and drop
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#f9a8d4';
    uploadArea.style.background = 'rgba(255, 255, 255, 0.05)';
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.borderColor = '#c084fc';
    uploadArea.style.background = 'transparent';
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#c084fc';
    uploadArea.style.background = 'transparent';
    
    const droppedFiles = Array.from(e.dataTransfer.files).filter(f => f.type === 'application/pdf');
    addFiles(droppedFiles);
});

// Functions
function handleFileUpload(e) {
    const selectedFiles = Array.from(e.target.files).filter(f => f.type === 'application/pdf');
    addFiles(selectedFiles);
}

function addFiles(newFiles) {
    newFiles.forEach((file, idx) => {
        files.push({
            id: Date.now() + idx,
            file: file,
            name: file.name,
            size: (file.size / 1024 / 1024).toFixed(2)
        });
    });
    
    renderFileList();
    updateOptions();
    updateProcessButton();
}

function renderFileList() {
    if (files.length === 0) {
        fileList.innerHTML = '';
        fileList.style.display = 'none';
        return;
    }
    
    fileList.style.display = 'flex';
    fileList.innerHTML = files.map(file => `
        <div class="file-item">
            <div class="file-info">
                <div class="file-icon">📄</div>
                <div>
                    <div class="file-name">${file.name}</div>
                    <div class="file-size">${file.size} MB</div>
                </div>
            </div>
            <button class="remove-btn" onclick="removeFile(${file.id})">🗑️</button>
        </div>
    `).join('');
}

function removeFile(id) {
    files = files.filter(f => f.id !== id);
    renderFileList();
    updateOptions();
    updateProcessButton();
}

function updateOptions() {
    if (files.length === 0) {
        optionsPanel.style.display = 'none';
        return;
    }
    
    const feature = features[activeFeature];
    if (feature.options) {
        optionsPanel.style.display = 'block';
        optionsTitle.textContent = feature.title;
        optionsContent.innerHTML = feature.options;
    } else {
        optionsPanel.style.display = 'none';
    }
}

function updateProcessButton() {
    if (files.length === 0) {
        processBtn.style.display = 'none';
        return;
    }
    
    processBtn.style.display = 'flex';
    processBtn.dataset.feature = activeFeature;
    btnText.textContent = features[activeFeature].btnText;
}

// Download helper function
function downloadFile(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

async function processFiles() {
    if (files.length === 0) return;
    
    processBtn.disabled = true;
    btnText.textContent = 'Processing...';
    spinner.style.display = 'block';
    
    try {
        // Simulate processing for demo
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Create a simple text file as demo download
        let resultContent = '';
        let filename = 'output.pdf';
        
        switch(activeFeature) {
            case 'merge':
                resultContent = `DEMO: Merged PDF would contain ${files.length} files:\n\n`;
                files.forEach((f, i) => {
                    resultContent += `${i + 1}. ${f.name}\n`;
                });
                filename = 'merged.pdf';
                break;
                
            case 'compress':
                const compressLevel = document.querySelector('input[name="compress"]:checked')?.value || 'recommended';
                resultContent = `DEMO: Compressed PDF (${compressLevel} mode)\n\n`;
                resultContent += `Original: ${files[0].name}\n`;
                resultContent += `Original Size: ${files[0].size} MB\n`;
                resultContent += `Estimated Compressed Size: ${(parseFloat(files[0].size) * 0.6).toFixed(2)} MB`;
                filename = 'compressed.pdf';
                break;
                
            case 'split':
                resultContent = `DEMO: Split ${files[0].name} into individual pages\n\n`;
                resultContent += 'This would generate multiple PDF files, one per page.';
                filename = 'split-pages.zip';
                break;
                
            case 'protect':
                const password = document.getElementById('passwordInput')?.value;
                resultContent = `DEMO: Protected PDF with password\n\n`;
                resultContent += `Original: ${files[0].name}\n`;
                resultContent += `Password: ${password ? '********' : 'Not set'}`;
                filename = 'protected.pdf';
                break;
                
            case 'unlock':
                resultContent = `DEMO: Unlocked PDF\n\n`;
                resultContent += `Original: ${files[0].name}\n`;
                resultContent += 'Password protection removed';
                filename = 'unlocked.pdf';
                break;
                
            case 'convert':
                resultContent = `DEMO: Converted PDF to images\n\n`;
                resultContent += `Original: ${files[0].name}\n`;
                resultContent += 'This would generate JPG/PNG images for each page.';
                filename = 'images.zip';
                break;
                
            case 'rotate':
                const rotation = document.querySelector('input[name="rotate"]:checked')?.value || '90';
                resultContent = `DEMO: Rotated PDF ${rotation}°\n\n`;
                resultContent += `Original: ${files[0].name}\n`;
                resultContent += `Rotation: ${rotation}° ${rotation === '90' ? 'clockwise' : rotation === '-90' ? 'counter-clockwise' : ''}`;
                filename = 'rotated.pdf';
                break;
        }
        
        // Create a blob and download
        const blob = new Blob([resultContent], { type: 'text/plain' });
        downloadFile(blob, filename);
        
        // Show success message
        alert(`✨ ${features[activeFeature].btnText} complete!\n\n⚠️ NOTE: This is a demo version.\n\nTo process real PDFs, you need to:\n1. Add PDF-lib library to index.html\n2. See README.md for integration guide`);
        
    } catch (error) {
        alert('❌ Error processing files: ' + error.message);
    } finally {
        // Reset
        files = [];
        renderFileList();
        updateOptions();
        processBtn.disabled = false;
        btnText.textContent = features[activeFeature].btnText;
        spinner.style.display = 'none';
        processBtn.style.display = 'none';
    }
}
