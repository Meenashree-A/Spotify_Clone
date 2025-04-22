// Selecting elements
const songItems = document.querySelectorAll('.song-item .playListPlay');
const masterPlay = document.getElementById('masterPlay');
const seekBar = document.getElementById('seek');
const currentStart = document.getElementById('current-start');
const currentEnd = document.getElementById('current-end');
const volSeek = document.getElementById('vol-seek');
const volIcon = document.getElementById('vol-icon');
const shuffleBtn = document.getElementById('shuffle');
const forwardBtn = document.getElementById('forward');
const backwardBtn = document.getElementById('back');

// Master audio player
let audio = new Audio();
let currentSongIndex = -1;
let isShuffle = false;

// Song data (modify paths as needed)
const songs = [
    { src: "https://spotify-clone-meena.s3.ap-south-1.amazonaws.com/songs/AR/Aaruyire.mp3", title: "Aruyire", artist: "A.R.Rahman" },
    { src: "https://spotify-clone-meena.s3.ap-south-1.amazonaws.com/songs/AR/Kannalane-Enadhu.mp3", title: "Kannalane", artist: "A.R.Rahman" },
    { src: "https://spotify-clone-meena.s3.ap-south-1.amazonaws.com/songs/AR/Nenjukkule.mp3", title: "Nenujukula", artist: "A.R.Rahman" },
    { src: "https://spotify-clone-meena.s3.ap-south-1.amazonaws.com/songs/AR/New+York+Nagaram.mp3", title: "NewYork", artist: "A.R.Rahman" },
    { src: "https://spotify-clone-meena.s3.ap-south-1.amazonaws.com/songs/AR/Sahana-Saral-Thoo.mp3", title: "Sahana saral", artist: "A.R.Rahman" }
];

// Set default volume
audio.volume = 0.5;
volSeek.value = 50;

// Format time (mm:ss)
function formatTime(seconds) {
    let min = Math.floor(seconds / 60);
    let sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

// Play selected song
function playSong(index) {
    if (currentSongIndex === index) {
        if (audio.paused) {
            audio.play();
            masterPlay.classList.replace("fa-play", "fa-pause");
        } else {
            audio.pause();
            masterPlay.classList.replace("fa-pause", "fa-play");
        }
        return;
    }

    currentSongIndex = index;
    audio.src = songs[index].src;
    audio.play();
    masterPlay.classList.replace("fa-play", "fa-pause");

    // Reset progress bar
    seekBar.value = 0;
    currentStart.innerText = "0:00";
    currentEnd.innerText = "0:00"; // Reset until metadata loads

    // Update song info
    document.querySelector('.content h1').innerText = songs[index].title;
    document.querySelector('.content p').innerText = songs[index].artist;
}

// Add event listeners to play buttons
songItems.forEach((btn, index) => {
    btn.addEventListener('click', () => playSong(index));
});

// Master play button
masterPlay.addEventListener('click', () => {
    if (currentSongIndex === -1) {
        playSong(0); // Play first song if none selected
    } else {
        if (audio.paused) {
            audio.play();
            masterPlay.classList.replace("fa-play", "fa-pause");
        } else {
            audio.pause();
            masterPlay.classList.replace("fa-pause", "fa-play");
        }
    }
});

// Update progress bar
audio.addEventListener('timeupdate', () => {
    let progress = (audio.currentTime / audio.duration) * 100;
    seekBar.value = progress;
    currentStart.innerText = formatTime(audio.currentTime);
});

// Ensure duration updates properly
audio.addEventListener('loadedmetadata', () => {
    currentEnd.innerText = formatTime(audio.duration);
});

// Seek functionality
seekBar.addEventListener('input', () => {
    audio.currentTime = (seekBar.value / 100) * audio.duration;
});

// Volume control
volSeek.addEventListener('input', () => {
    let volume = volSeek.value / 100;
    audio.volume = volume;
    volIcon.className = volume === 0 ? "fa-solid fa-volume-mute" :
                        volume < 0.5 ? "fa-solid fa-volume-low" : "fa-solid fa-volume-high";
});

// ** Forward Button (Shuffle Mode Supported) **
forwardBtn.addEventListener('click', () => {
    let nextIndex = isShuffle ? getRandomIndex() : (currentSongIndex + 1) % songs.length;
    playSong(nextIndex);
});

// ** Backward Button (Shuffle Mode Supported) **
backwardBtn.addEventListener('click', () => {
    if (audio.currentTime > 5) {
        audio.currentTime = 0; // Restart current song if more than 5 seconds played
    } else {
        let prevIndex = isShuffle ? getRandomIndex() : (currentSongIndex - 1 + songs.length) % songs.length;
        playSong(prevIndex);
    }
});

// ** Shuffle Button **
shuffleBtn.addEventListener('click', () => {
    isShuffle = !isShuffle;
    shuffleBtn.classList.toggle("active", isShuffle);
});

// ** Play next song automatically (Shuffle Mode Supported) **
audio.addEventListener('ended', () => {
    let nextIndex = isShuffle ? getRandomIndex() : (currentSongIndex + 1) % songs.length;
    playSong(nextIndex);
});

// ** Function to Get Random Song Index Different from Current **
function getRandomIndex() {
    if (songs.length === 1) return currentSongIndex;
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * songs.length);
    } while (randomIndex === currentSongIndex);
    return randomIndex;
}
