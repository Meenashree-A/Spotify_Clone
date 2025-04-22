// Selecting elements
const songItems = document.querySelectorAll('.song-item .playListPlay');
const masterPlay = document.getElementById('masterPlay');
const seekBar = document.getElementById('seek');
const currentStart = document.getElementById('current-start');
const currentEnd = document.getElementById('current-end');
const volSeek = document.getElementById('vol-seek');
const volIcon = document.getElementById('vol-icon');

// Master audio player
let audio = new Audio();
let currentSongIndex = -1;

// Song data (modify paths as needed)
const songs = [
    { src: "songs/SS/Ennadi-Maayavi-Nee-MassTamilan.com.mp3", title: "Ennadi", artist: "Sid Sriram" },
    { src: "songs/SS/Kadhaippoma-MassTamilan.io.mp3", title: "Kadhaipoma", artist: "Sid Sriram" },
    { src: "songs/SS/Kesariya-MassTamilan.dev.mp3", title: "Kesariya", artist: "Sid Sriram" },
    { src: "songs/SS/Maruvaarthai-Unplugged-Masstamilan.com.mp3", title: "Maruvarthai", artist: "Sid Sriram" },
    { src: "songs/SS/Vazhithunaiye.mp3", title: "Vazhithunaiye", artist: "Sid Sriram" }
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
