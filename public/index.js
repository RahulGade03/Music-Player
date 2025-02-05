

let currentFolder = "";

let currentSong = new Audio();

let songs = [];

async function getSongs(folder) {
    const response = await fetch(`${folder}/songs.json`);
    // console.log ("Response : "+response);
    songs = await response.json();
    // console.log(songs);
}

function formatTime(seconds) {
    // Ensure seconds is an integer
    seconds = Math.floor(seconds);

    if (isNaN(seconds) || seconds < 0) {
        return '00:00';
    }

    const minutes = Math.floor(seconds / 60);
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = (seconds % 60).toString().padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}


async function addSongs(songs) {
    for (let song of songs) {
        let name = song.replaceAll("%20", ' ');
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
    await addPlayEvent();
}

const playMusic = (track) => {
    currentSong.src = currentFolder + track;
    currentSong.play();
    document.querySelector('#play').src = 'icons/pause.svg';
    document.querySelector('.songPlayName').innerHTML = `<p>${track}</p>`;
}

async function addPlayEvent() {
    let songList = Array.from(document.querySelector('.songList').getElementsByTagName('li'));
    songList.forEach((li) => {
        li.addEventListener('click', () => {
            let songName = (li.querySelector('.songNameDiv').innerText) + '.mp3';
            playMusic(songName);
        });
    });
}

async function formCards () {
    let folders = await fetch('songs/info.json');
    folders = await folders.json();

    folders.forEach(async (e) => {
        let folderInfo = await fetch(`songs/${e}/info.json`);
        folderInfo = await folderInfo.json();
        // console.log(folderInfo);

        let card = document.createElement('div');
        card.innerHTML = `
                                <img src="icons/playBUTTON.svg" alt="" class="playButton" data-fName = "${e}">
                                <img src="songs/${e}/coverImg.jpg" alt="" class="cardImg">
                                <h3>${folderInfo.name}</h3>
                                <p>${folderInfo.description}</p>`;
        document.querySelector('.cards').append(card);

        card.classList.add("card", "flex", "flex-column", "justify-center", "item-center");
        card.setAttribute('data-fName', e);
        // console.log (card.getAttribute('data-fName'));

        card.addEventListener ('click', async (e) => {
            console.log (`songs/${e.currentTarget.dataset.fname}`);
            currentFolder = `songs/${e.currentTarget.dataset.fname}/`;
            await getSongs (currentFolder);
            document.querySelector('.songList').innerHTML = "";
            await addSongs (songs);
        });
    });
}

document.addEventListener ('click', async (e) => {
    if (e.target.classList.contains('playButton')){
        e.stopPropagation();
        console.log ('play button clicked');
        currentFolder = `songs/${e.target.dataset.fname}/`;
        console.log (currentFolder); 
        await getSongs (currentFolder);
        document.querySelector('.songList').innerHTML = "";
        await addSongs (songs);
        playMusic (songs[0]+'.mp3');
    }

    if (e.target.classList.contains('card') || e.target.closest('.card')){
        if (!e.target.classList.contains('playButton')){
            console.log ('card clicked');
            let fldrName = e.target.closest('.card').dataset.fname;
            console.log (fldrName);
            currentFolder = `songs/${fldrName}/`;
            await getSongs (currentFolder);
            document.querySelector('.songList').innerHTML = "";
            await addSongs(songs);
        }
    }
});

async function main() {
    await formCards();
    // console.log (document.querySelectorAll('.card'));
}

main();


let playButton = document.querySelector('#play');
playButton.addEventListener('click', async () => {
    if (songs.length == 0){
        await getSongs ('songs/Top Hits/');
        document.querySelector('.songList').innerHTML = "";
        await addSongs (songs);
        currentFolder = 'songs/Top Hits/';
        console.log (songs[0]);
        playMusic(songs[0]+'.mp3');
    }
    else if (currentSong.paused && currentSong.src !== '') {
        playButton.src = 'icons/pause.svg';
        currentSong.play();
    } else {
        playButton.src = 'icons/play2.svg';
        currentSong.pause();
    }

    if (currentSong.src === '') {
        let songName = (document.querySelector('.songList').firstElementChild.querySelector('.songNameDiv').innerText) + '.mp3';
        playMusic(songName);
        // console.log(songName);
    }
})

currentSong.addEventListener('timeupdate', () => {
    // console.log(currentSong.currentTime);
    let dur = formatTime(currentSong.duration);
    let time = formatTime(currentSong.currentTime);
    document.querySelector('.duration').innerHTML = `<p>${time}/${dur}</p>`;
    document.querySelector('#circle').style.left = `${currentSong.currentTime / currentSong.duration * 100}%`;
    if (currentSong.ended) {
        playButton.src = 'icons/play2.svg';
    }
})

document.querySelector('.seekBar').addEventListener('click', (e) => {
    circle.style.left = `${(e.offsetX / e.target.clientWidth) * 100}%`;
    let seekTime = (e.offsetX / e.target.clientWidth) * currentSong.duration;
    currentSong.currentTime = seekTime;
});


document.querySelector('.hamburger').addEventListener('click', () => {
    let left = document.querySelector('.left');
    left.style.left = '0px';
    left.style.width = '100vw';
});

document.querySelector('.close').addEventListener('click', () => {
    let left = document.querySelector('.left');
    left.style.left = '-250px';
    left.style.width = '25vw';
})

document.getElementById('previous').addEventListener('click', () => {
    let name = currentSong.src.split('songs/')[1];
    name = name.split('/')[1];
    name = name.replaceAll('%20', ' ');
    name = name.replace ('.mp3', '');
    let prevSong = songs[(songs.indexOf(name) - 1 + songs.length) % songs.length];
    playMusic(prevSong+'.mp3');
});

document.getElementById('next').addEventListener('click', () => {
    let name = currentSong.src.split('songs/')[1];
    name = name.split('/')[1];
    name = name.replaceAll('%20', ' ');
    name = name.replace ('.mp3', '');
    let nextSong = songs[(songs.indexOf(name) + 1) % songs.length];
    playMusic(nextSong+'.mp3');
});