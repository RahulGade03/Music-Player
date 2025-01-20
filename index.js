// Construct the URL to the 'songs' folder
const songsFolderURL = 'public/songs/';

let currentSong = new Audio();

async function getSongs() {
    // const response = await fetch(songsFolderURL);
    // const text = await response.text();
    // let div = document.createElement('div');
    // div.innerHTML = text;
    // let links = div.getElementsByTagName('a');
    // let songs = [];
    // for (let link of links) {
    //     if (link.href.endsWith('.mp3')) {
    //         songs.push(link.href);
    //     }
    // }
    // return songs;

    const response = await fetch('public/songs.json');
    const songs = await response.json();
    return songs.map(song => `public/songs/${song}`);
}

function formatTime(seconds) {
    // Ensure seconds is an integer
    seconds = Math.floor(seconds);
  
    const minutes = Math.floor(seconds / 60);
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = (seconds % 60).toString().padStart(2, '0');
    
    return `${formattedMinutes}:${formattedSeconds}`;
  }
  

async function addSongs (songs) {
    for (let song of songs) {
        let name = song.split('songs/')[1];
        name = name.replaceAll("%20", ' ');
        name = name.replace('.mp3', '');

        let li = document.createElement('li');
        li.innerHTML = `
        <div class="li-div flex justify-center item-center">
            <div class="iconDiv flex justify-center item-center">
                <img src="icons/musicIcon.svg" alt="">
            </div>
            <div class="songNameDiv">${name}</div>
            <div class="playDiv flex justify-center item-center">
                <img src="icons/playBUTTON.svg" alt="" class="playBtn">
            </div>
        </div>`

        document.querySelector('.songList').appendChild(li);
    }
}

const playMusic = (track) => {
    currentSong.src = songsFolderURL + track;
    currentSong.play();
    document.querySelector('#play').src = 'icons/pause.svg';
    document.querySelector('.songPlayName').innerHTML = `<p>${track}</p>`;
}

async function addPlayEvent () {
    let songList = Array.from(document.querySelector('.songList').getElementsByTagName('li'));
    songList.forEach ((li) => {
        li.addEventListener ('click', () => {
            let songName = (li.querySelector('.songNameDiv').innerText) + '.mp3';
            playMusic (songName);
        });
    });
}

async function main() {
    let songs = await getSongs();
    console.log(songs);

    await addSongs (songs);

    await addPlayEvent ();
}

main();

let playButton = document.querySelector('#play');
playButton.addEventListener('click', () => {
    if (currentSong.paused && currentSong.src !== '') {
        playButton.src = 'icons/pause.svg';
        currentSong.play();
    } else {
        playButton.src = 'icons/play2.svg';
        currentSong.pause();
    }

    if (currentSong.src === '') {
        let songName = (document.querySelector('.songList').firstElementChild.querySelector('.songNameDiv').innerText) + '.mp3';
        playMusic (songName);
    }
})

currentSong.addEventListener('timeupdate', () => {
    // console.log(currentSong.currentTime);
    let dur = formatTime(currentSong.duration);
    let time = formatTime(currentSong.currentTime);
    document.querySelector('.duration').innerHTML = `<p>${time}/${dur}</p>`;
    document.querySelector('#circle').style.left = `${currentSong.currentTime/currentSong.duration*100}%`;
    if (currentSong.ended){
        playButton.src = 'icons/play2.svg';
    }
})

document.querySelector('.seekBar').addEventListener('click', (e) => {
    circle.style.left = `${(e.offsetX / e.target.clientWidth) * 100}%`;
    let seekTime = (e.offsetX / e.target.clientWidth) * currentSong.duration;
    currentSong.currentTime = seekTime;
});


document.querySelector('.hamburger').addEventListener('click',() => {
    let left = document.querySelector('.left');
    left.style.left = '0px';
    left.style.width = '100vw';
    left.style.zIndex = '1';
});