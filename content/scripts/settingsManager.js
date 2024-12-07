document.addEventListener('DOMContentLoaded', function() {
    // Load defaults from JSON file
    fetch('hora64/configuredWebsite/content/jsonLists/defaultSettings.json')
        .then(response => response.json())
        .then(defaultSettings => {
            // Load and apply color settings, wallpaper, favicon, and cursor
            const savedColor = loadFromLocalStorage('colorSettings') || defaultSettings.windowColor;
            applyColor(parseColor(savedColor), false);

            const savedWallpaper = loadFromLocalStorage('selectedWallpaper') || defaultSettings.wallpaper;
            applyWallpaper(savedWallpaper);

            const savedFavicon = loadFromLocalStorage('selectedFavicon') || defaultSettings.favicon;
            applyFavicon(savedFavicon);

            const savedCursor = loadFromLocalStorage('selectedCursor') || defaultSettings.cursor;
            applyCursor(savedCursor);

            // Load and apply startup sound settings and volume
            const savedStartupSound = loadFromLocalStorage('startupSound') || defaultSettings.startup.sound;
            applyStartupSound(savedStartupSound);

            const savedVolume = loadFromLocalStorage('startupSoundVolume') || defaultSettings.startup.volume;
            applyStartupVolume(savedVolume, false);

            // Play the startup sound immediately
            playStartupSound();

            // Set a delay before attempting to play the sound again
            setTimeout(playStartupSound, 3000);
        })
        .catch(error => console.error('Failed to load default settings:', error));
});

// Cooldown functions
const colorCooldown = cooldown(100); // Set cooldown duration to 200ms
const volumeCooldown = cooldown(200);

// Application functions
function applyColor({ red, green, blue }, useCooldown = true) {
    if (!colorCooldown(useCooldown)) return;
    const rgbColor = `rgb(${red}, ${green}, ${blue})`;
    document.documentElement.style.setProperty('--title-color', rgbColor);
    saveToLocalStorage('colorSettings', rgbColor);
    console.log('Color applied:', rgbColor);
}

function applyWallpaper(selectedWallpaper) {
    document.body.style.backgroundImage = `url(${selectedWallpaper})`;
    saveToLocalStorage('selectedWallpaper', selectedWallpaper);
}

function applyFavicon(selectedFavicon) {
    document.getElementById('dynamicFavicon').setAttribute('href', selectedFavicon);
    saveToLocalStorage('selectedFavicon', selectedFavicon);
}

function applyCursor(selectedCursor) {
    document.documentElement.style.cursor = `url(${selectedCursor}), auto`;
    saveToLocalStorage('selectedCursor', selectedCursor);
    console.log('Cursor applied:', selectedCursor);
}

function applyStartupSound(selectedSound) {
    document.getElementById('startup').setAttribute('src', selectedSound);
    saveToLocalStorage('startupSound', selectedSound);
}

function applyStartupVolume(volume, useCooldown = true) {
    if (!volumeCooldown(useCooldown)) return;
    document.getElementById('startup').volume = volume;
    saveToLocalStorage('startupSoundVolume', volume);
    console.log('Volume applied:', volume);
}

function playStartupSound() {
    document.getElementById('startup')?.play()
        .then(() => console.log('Startup sound played successfully'))
        .catch(error => console.error('Failed to play startup sound:', error));
}

function applySliderColor() {
    const red = parseInt(document.getElementById('red-slider').value, 10);
    const green = parseInt(document.getElementById('green-slider').value, 10);
    const blue = parseInt(document.getElementById('blue-slider').value, 10);
    const rgbColor = { red, green, blue };
    applyColor(rgbColor);
}

function parseColor(rgbString) {
    const rgbValues = rgbString.match(/\d+/g);
    if (rgbValues) {
        return {
            red: parseInt(rgbValues[0], 10),
            green: parseInt(rgbValues[1], 10),
            blue: parseInt(rgbValues[2], 10)
        };
    }
    return null;
}

// Utility functions
function loadFromLocalStorage(key) {
    return localStorage.getItem(key);
}

function saveToLocalStorage(key, value) {
    localStorage.setItem(key, value);
}

function cooldown(duration) {
    let lastExecution = 0;
    return function (useCooldown) {
        if (!useCooldown) return true;
        const now = Date.now();
        if (now - lastExecution < duration) return false;
        lastExecution = now;
        return true;
    };
}
