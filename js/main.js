const baseUrl = "http://api.sr.se/api/v2/";
let channels = [];
let audio;

document.addEventListener("DOMContentLoaded", async function () {

    try {
        const response = await fetch(`${baseUrl}channels?size=20&format=json`);
        const json = await response.json();
        channels = json.channels;
        renderChannels();
    } catch (error) {
        alert(error);
    }
});
document.getElementById("searchbutton").addEventListener("click", e => {
    e.preventDefault();
    const channelId = document.getElementById("searchProgram").value;
    fetch(`http://api.sr.se/api/v2/scheduledepisodes?channelid=${channelId}&format=json`)
        .then(res => res.json())
        .then(data => {
            displaySchedule(data);
        })
        .catch(err => alert(err));
});
document.getElementById('mainnavlist').addEventListener("click", function () {
    audio.src = '';
})

function displaySchedule(data) {
    document.getElementById("info").innerHTML = "";
    data.schedule.forEach(schedule => {
        const startTime =new Date(parseInt(schedule.starttimeutc.substr(6)));
        const scheduleHTML = `<h1>${schedule.title}</h1>
                                <h3>${schedule.description}</h3> 
                                <p>${startTime}</p> 
                                <hr style="height:2px;border-width:0;color:red;background-color:blue">`;
        document.getElementById("info").innerHTML += scheduleHTML;
    });
}


function renderChannels() {
    const mainnavlist = document.querySelector("#mainnavlist");
    const searchProgram = document.querySelector("#searchProgram");

    channels.forEach(channel => {
        const {id, name, image} = channel;
        const option = `<option value="${id}">${name}</option>`;
        const li = `<li id="${id}">${name}</li> <img src="${image}" width="25" height="25">`;
        mainnavlist.innerHTML += li;
        searchProgram.innerHTML += option;
    });
    mainnavlist.addEventListener("click", handleChannelClick);

}

function handleChannelClick(event) {
    const channelId = event.target.id;
    const channel = channels.find(c => c.id == channelId);
    if (!channel) return;
    const {id, name, tagline, liveaudio} = channel;
    const searchProgram = document.querySelector("#searchProgram");
    searchProgram.value = id;
    renderInfo(id, name, tagline);
    playAudio(liveaudio.url);
}

async function renderInfo(id, name, tagline) {

    try {
        const response = await fetch(`${baseUrl}playlists/rightnow?channelid=${id}&format=json`);
        const json = await response.json();
        const {previoussong, nextsong} = json.playlist;
        const nextsongDescription = nextsong ? nextsong.description : 'N/A';
        const previoussongDescription = previoussong ? previoussong.description : 'N/A';
        const info = document.querySelector("#info");
        info.innerHTML = `
            <h1>${name}</h1>
            ${tagline}
            <hr>
            <p>Föregående: ${previoussongDescription}</p>
            <p>Kommande: ${nextsongDescription}</p>
        `;
    } catch (error) {
        alert(error);
    }
}

function playAudio(url) {
    audio = new Audio(url);
    audio.play();

}
