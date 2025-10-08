document.addEventListener('DOMContentLoaded', () => {

    
    const COLORS = [
        { name: 'blue', hex: '#00a3e0', bg: '#e6f5fd' },
        { name: 'pink', hex: '#d93a8d', bg: '#ffeff7' },
        { name: 'yellow', hex: '#f2c100', bg: '#faf8f0' },
    ];

    
    const root = document.documentElement;
    const loader = document.getElementById('loader');
    const umbrellaImage = document.getElementById('umbrella-image');
    const logoImage = document.getElementById('logo-image');
    const colorSwatchesContainer = document.getElementById('color-swatches');
    const uploadButton = document.getElementById('upload-button');
    const logoInput = document.getElementById('logo-input');


    let currentColor = COLORS[0];
    let currentLogoUrl = null;

    
    const setButtonState = (isUploading) => {
        if (isUploading) {
            uploadButton.innerHTML = `
                <img src="assets/loader.svg" class="button-icon" style="animation: spin-ease 1.5s ease-in-out infinite;" alt="Uploading...">
                <span>UPLOADING...</span>
            `;
            uploadButton.disabled = true;
        } else {
            uploadButton.innerHTML = `
                <img src="assets/upload.svg" class="button-icon" alt="Upload">
                <span>UPLOAD LOGO</span>
            `;
            uploadButton.disabled = false;
        }
    };

    
    const setMainLoaderState = (isLoading) => {
        if (isLoading) {
            loader.classList.remove('hidden');
            umbrellaImage.classList.add('hidden');
            logoImage.classList.add('hidden');
        } else {
            loader.classList.add('hidden');
            umbrellaImage.classList.remove('hidden');
            if (currentLogoUrl) {
                logoImage.classList.remove('hidden');
            }
        }
    };

    /**
     * Updates the UI theme based on the selected color.
     * @param {object} color - The color object from the COLORS array.
     */
    const setTheme = (color) => {
        root.style.setProperty('--theme-bg', color.bg);
        root.style.setProperty('--theme-button', color.hex);
    };

    
    const handleColorChange = (color) => {
        if (color.name === currentColor.name) return;

        currentColor = color;
        setMainLoaderState(true);

        setTimeout(() => {
            setTheme(color);
            umbrellaImage.src = `assets/${color.name}Umbrella.png`;
            
            umbrellaImage.onload = () => {
                setMainLoaderState(false);
                umbrellaImage.classList.add('fade-in');
                if (currentLogoUrl) logoImage.classList.add('fade-in');
            };
        }, 1500);

        document.querySelector('.swatch.active').classList.remove('active');
        document.querySelector(`.swatch[data-color="${color.name}"]`).classList.add('active');
    };

    
    const handleLogoUpload = (event) => {
        const file = event.target.files[0];
        if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
            setMainLoaderState(true);
            setButtonState(true);

            setTimeout(() => {
                currentLogoUrl = URL.createObjectURL(file);
                logoImage.src = currentLogoUrl;

                setMainLoaderState(false);
                setButtonState(false);
                umbrellaImage.classList.add('fade-in');
                logoImage.classList.add('fade-in');
            }, 2000);
        } else {
            alert('Please upload a valid .png or .jpg file.');
        }
        event.target.value = null;
    };

    // Color Swatch Creation
    COLORS.forEach((color, index) => {
        const swatch = document.createElement('button');
        swatch.className = 'swatch';
        swatch.style.backgroundColor = color.hex;
        swatch.dataset.color = color.name;
        if (index === 0) {
            swatch.classList.add('active');
        }
        swatch.addEventListener('click', () => handleColorChange(color));
        colorSwatchesContainer.appendChild(swatch);
    });

    setTheme(currentColor);
    setButtonState(false); 

    
    uploadButton.addEventListener('click', () => logoInput.click());
    logoInput.addEventListener('change', handleLogoUpload);
});