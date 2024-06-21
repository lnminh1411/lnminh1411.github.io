/*Credit to AutumnVN for the background code! (https://chino.pages.dev/)*/
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

let playSound = () => new Audio("/disappointment.mp3")
    .play();
let playSound2 = () => new Audio("/hehe~.mp3")
    .play();

$(window)
    .scroll(function () {
        let scroll = $(window)
            .scrollTop(),
            h = $(document)
            .height(),
            w = $(window)
            .height();
        if (scroll <= 10) {
            percent = 10
            factopac = .35
        } else {
            percent = (scroll / (h - w)) * 100
            if (scroll > 10) {
                factopac = 0
            }
        }
        $('#progressbar').css('height', `${percent}%`);
        $('.factcontainer').css('opacity', `${factopac}`);
    });

$(document)
    .ready(function () {
        async function loadfacts() {
            const res = await fetch('./facts.json');
            const factsjs = await res.json();
            const random = Math.floor(Math.random() * factsjs.facts.length);
            $("#fact").text(factsjs.facts[random].fact);
          }
        loadfacts()
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
    if ((d.d.getMinutes() - client.d.getMinutes()) === 0) {
        var difftime = '(Same time)'
    } else {
        var difftime = `(Offset by ${client.d.getHours() - d.d.getHours()} hours)`
    }
    $("#time").text(hrs + min + sec + ' ' + difftime);
    async function loadstatus() {
        const Color = { online: '#4b8', idle: '#fa1', dnd: '#f44', offline: '#778' };
        const res = await fetch("https://api.lanyard.rest/v1/users/783652998319833118");
        const statjs = await res.json();
        $("#statsdot").css("background", `${Color[statjs.data.discord_status]}`)
        if (statjs.data.discord_status === 'dnd') {
            $("#status").text("Busy")
        }
        if (statjs.data.discord_status === 'online') {
            $("#status").text("Online")
        }
        if (statjs.data.discord_status === 'idle') {
            $("#status").text("AFK")
        }
        if (statjs.data.discord_status === 'offline') {
            $("#status").text("Offline")
        }
    }
    loadstatus()
}, 1000)