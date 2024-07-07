(window.setScroll = () => document.body.style.setProperty('--yval', (scrollY / 2) / innerHeight))();
['scroll', 'resize'].forEach(i => addEventListener(i, setScroll));
let bg = document.querySelector('#bg');
addEventListener('touchstart', () => bg.style.setProperty('--times', '0'));
addEventListener('mousemove', ({
    clientX,
    clientY
}) => {
    bg.style.setProperty('--x', `${90 * (clientX - innerWidth / 2) / innerWidth}px`);
    bg.style.setProperty('--y', `${90 * (clientY - innerHeight / 2) / innerHeight}px`);
});

$(window).scroll(function () {
    let scroll = $(window).scrollTop(),
        h = $(document).height(),
        w = $(window).height();
    let percent = (scroll <= 74) ? 4 : (scroll / (h - w)) * 100;
    let factopac = (scroll <= 10) ? .35 : 0;
    $('#progressbar').css('height', `${percent}%`);
    $('.factcontainer').css('opacity', `${factopac}`);
});

setInterval(function () {
    const d = spacetime.now('asia/saigon')
    const client = spacetime.now()
    if (d.d.getHours() <= 9) {
        var hrs = '0' + d.d.getHours() + ':'
    } else {
        var hrs = d.d.getHours() + ':'
    }
    if (d.d.getMinutes() <= 9) {
        var min = '0' + d.d.getMinutes() + ':'
    } else {
        var min = d.d.getMinutes() + ':'
    }
    if (d.d.getSeconds() <= 9) {
        var sec = '0' + d.d.getSeconds()
    } else {
        var sec = d.d.getSeconds()
    }
    if ((d.d.getHours() - client.d.getHours()) === 0) {
        var difftime = '(Same time)'
    } else {
        var difftime = `(Offset by ${Math.abs(client.d.getHours() - d.d.getHours())} hours)`
    }
    $("#time").text(hrs + min + sec + ' ' + difftime);
}, 1000);

async function loadstatus() {
    const Color = { online: '#4b8', idle: '#fa1', dnd: '#f44', offline: '#778' };
    const res = await fetch("https://api.lanyard.rest/v1/users/783652998319833118");
    const statjs = await res.json();
    if (statjs.data.discord_status === 'dnd') {
        $("#status").text("Busy / Not Available")
        $("#status2").text("Busy / Not Available")
    }
    if (statjs.data.discord_status === 'offline') {
        $("#status").text("Offline")
        $("#status2").text("Offline")
    }
    if (statjs.data.discord_status === 'idle') {
        $("#status").text("Not Active")
        $("#status2").text("Not Active")
    }
    $("#statsdot").css("background", `${Color[statjs.data.discord_status]}`)
    $("#statsdot2").css("background", `${Color[statjs.data.discord_status]}`)
    if ((statjs.data.active_on_discord_desktop === true || (statjs.data.active_on_discord_desktop === true && statjs.data.active_on_discord_mobile === true)) && statjs.data.discord_status === 'online' && statjs.data.listening_to_spotify === false) {
        $("#status").text("Online")
        $("#status2").text("Online")
    }
    if (statjs.data.active_on_discord_desktop === false && statjs.data.active_on_discord_mobile === true && statjs.data.discord_status === 'online' && statjs.data.listening_to_spotify === false) {
        $("#status").text("Online on Mobile")
        $("#status2").text("Online on Mobile")
    }
    if (statjs.data.listening_to_spotify === true && statjs.data.discord_status === 'online') {
        if ((statjs.data.active_on_discord_desktop === true || (statjs.data.active_on_discord_desktop === true && statjs.data.active_on_discord_mobile === true)) && statjs.data.discord_status === 'online') {
            $("#status").text("Online & Listening to Spotify")
            $("#status2").text("Online & Listening to Spotify")
        }
        if (statjs.data.active_on_discord_desktop === false && statjs.data.active_on_discord_mobile === true && statjs.data.discord_status === 'online') {
            $("#status").text("Listening to Spotify")
            $("#status2").text("Listening to Spotify")
        }
        $(".spotifyname").css("grid-area", '2 / 2 / 3 / 4')
        $(".songart").css("grid-area", '2 / 1 / 3 / 2')
        $(".songart").css("display", 'block')
        $(".spotifyname").css("display", 'block')
    }else{
        $(".spotifyname").css("grid-area", '')
        $(".songart").css("grid-area", '')
        $(".songart").css("display", 'none')
        $(".spotifyname").css("display", 'none')
    }
}

async function loadspotify() {
    const res = await fetch("https://api.lanyard.rest/v1/users/783652998319833118");
    const json = await res.json();
    if (json.data.listening_to_spotify === true && json.data.discord_status === 'online') {
        $(".art").attr("src", `${json.data.spotify.album_art_url}`)
        $("#name").text(`${json.data.spotify.song}`)
        $("#artist").text(`${json.data.spotify.artist}`)
        $(".nameastat").css("padding-right", '2vw')
        const d = spacetime.now('asia/saigon')
        const lengthsec = (((json.data.spotify.timestamps.end - json.data.spotify.timestamps.start) % 60000) / 1000).toFixed(0)
        const currentsec = (((d.epoch - json.data.spotify.timestamps.start) % 60000) / 1000).toFixed(0)
        const lengthmin = Math.floor((json.data.spotify.timestamps.end - json.data.spotify.timestamps.start) / 60000);
        const currentmin = Math.floor((d.epoch - json.data.spotify.timestamps.start) / 60000);
        if (currentsec < 10) {
            currentsectimed = '0' + currentsec
        }else{
            currentsectimed = currentsec
        }
        if (lengthsec < 10) {
            lengthsectimed = '0' + lengthsec
        }else{
            lengthsectimed = lengthsec
        }
        if (currentsec == 60) {
            currentsectimed = '00'
            currentmintimed = currentmin + 1
        }else{
            currentmintimed = currentmin
        }
        if (lengthsec == 60) {
            lengthsectimed = '00'
            lengthmintimed = lengthmin + 1
        }else{
            lengthmintimed = lengthmin
        }
        $("#timestamp").text(`${currentmintimed}:${currentsectimed} / ${lengthmintimed}:${lengthsectimed}`)
    }else{
        $(".nameastat").css("padding-right", '')
    }
}

async function loadfacts() {
    const res = await fetch('./facts.json');
    const factsjs = await res.json();
    const random = Math.floor(Math.random() * factsjs.facts.length);
    $("#fact").text(factsjs.facts[random].fact);
}

const txtarr = ["A professional in Undefined", "Creating solution for absolutely nothing", "Nothing make sense", "Technically good!", "≈70% bug free!", "Tell your friends about this.", "ReferenceError: header.txt Undefined", "Nice to meet you!", "√-1 love you!", "12345678 is a bad password!", "Have a great day!", "There are no real limits, not even the sky!", "!false is actually true!", "It's not a bug, it's a feature!", "If it works, it works.", 'print("Hello World!")', "Created with 851 lines!", 'Playing hide and seek with a ";"', "How is this working!?", "Time wasted creating this: A lot", "It's either !Yes or No", "If + else = elif", "What a pain!", "Mobile friendly!", "Perfectly balanced!", "EMOTIONAL DAMAGE!", "It's either !No or Yes", "15% coding, 75% debugging, 10% staring into the abyss.", "Built with galvanized square steel!", "Built with eco-friendly wood veneer!"]
$("#titletxt").text(txtarr[Math.floor(Math.random() * txtarr.length)])
if (window.innerHeight > 1232 && (window.innerHeight > window.innerWidth)) {
    alert(`Use landscape mode for better experience! \nXoay ngang thiết bị của bạn để có trải nghiệm tốt hơn!`);
}

loadfacts()
loadstatus()
setInterval(function() {
    loadstatus()
}, 5000)
setInterval(function() {
    loadspotify()
}, 1000)
