let grid = document.querySelector("#videos")
let player = {}
let videos = []

async function main() {
    let time = 300

    let storageData = localStorage.getItem("brid") || null
    let storageTime = localStorage.getItem("time") || time

    let nowTime = new Date().getTime() / 1000
    let timeDelta = nowTime - storageTime;
    
    if(timeDelta < time) {
        let data = JSON.parse(storageData)
        videos = data.Video
        player = data.Player
    }
    else{
        let response = await fetch("https://services.brid.tv/services/get/latest/26456/0/1/25/0.json");
        let data = await response.json()
        
        videos = data.Video
        player = data.Player
        
        localStorage.setItem("brid", JSON.stringify(data))
        localStorage.setItem("time", JSON.stringify(new Date().getTime() / 1000))
    }

    let id = window.location.search.split("=").pop()  // ?id=1270176  => ["?id", 1270176]  => 1270176

    if(id && Number.isInteger(Number(id)))
        $bp("player", {...player, video : id})

    videos.forEach(video => createCard(video)) // prođe kroz sve videe i za svaki kreira karticu
  
}


function createCard(video) {
    const {snapshots, name, id, duration  } = video

    let rest = Number(duration)

    let h = 0, m = 0, s = 0
    
    if(rest >= 3600 ){
        h = Math.floor(rest / 3600)
        rest -= h * 3600;
    }
    
    if(rest >= 60){
        m = Math.floor(rest / 60)  // ako je rest 164, rest/60 = 2.nešto,  Math.floor(2.nešto) => 2
        rest = rest - m * 60;           // rest = 164 - 2 * 60 = 164 - 120 = 44
    }
    
    s = rest;  // s = 44
    
    if(h < 10){
        h = "0" + h
    }

    if(m < 10){
        m = "0" + m
    }

    if(s < 10){
        s = "0" + s
    }

    let elem = document.createElement("div");

    elem.innerHTML = `
        <img onclick="play(${id})" src="${snapshots.sd}">

        <h2 onclick="play(${id})" >${name}</h2>

        <p>${h ? h : "00"}:${m ? m : "00"}:${s ? s : ""} </p>

    `
    grid.appendChild(elem);


}

function play(id) {

    window.location.href = window.location.href.split("?").shift() + `?id=${id}`;

}


main()