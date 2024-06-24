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

let playSound = () => new Audio("/disappointment.mp3").play();
let playSound2 = () => new Audio("/hehe~.mp3").play();

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

        const txtarr = ["A professional in Undefined", "Creating solution for absolutely nothing", "Nothing make sense", "Technically good!", "≈70% bug free!", "Tell your friends about this.", "ReferenceError: header.txt Undefined", "Nice to meet you!", "√-1 love you!", "12345678 is a bad password!", "Have a great day!", "There are no real limits, not even the sky!", "!false is actually true!", "It's not a bug, it's a feature!", "If it works, it works.", 'print("Hello World!")', "Created with just 579 lines!", 'Playing hide and seek with a ";"', "How is this working!?", "Time wasted creating this: A lot", "It's either !Yes or No", "If + else = elif", "What a pain!", "Mobile friendly!", "Perfectly balanced!", "EMOTIONAL DAMAGE!", "It's either !No or Yes", "15% coding, 75% debugging, 10% staring into the abyss."]
        $("#titletxt").text(txtarr[Math.floor(Math.random() * txtarr.length)])
        if (window.innerHeight > 1232) {
            if(window.innerHeight > window.innerWidth){
                alert(`Rotate your devices for better experience! \nXoay ngang thiết bị của bạn để có trải nghiệm tốt hơn!`);
            }
        }
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
}, 1000);

async function loadstatus() {
    const Color = { online: '#4b8', idle: '#fa1', dnd: '#f44', offline: '#778' };
    const res = await fetch("https://api.lanyard.rest/v1/users/783652998319833118");
    const statjs = await res.json();
    if (statjs.data.discord_status === 'dnd') {
        $("#status").text("Busy / Not Available")
    }
    if (statjs.data.discord_status === 'offline') {
        $("#status").text("Offline")
    }
    if (statjs.data.discord_status === 'idle') {
        $("#status").text("Not Active")
    }
    $("#statsdot").css("background", `${Color[statjs.data.discord_status]}`)
    if (statjs.data.active_on_discord_desktop === true || (statjs.data.active_on_discord_desktop === true && statjs.data.active_on_discord_mobile === true)) {
        if (statjs.data.discord_status === 'online') {
            $("#status").text("Online")
        }
    }
    if (statjs.data.active_on_discord_desktop === false && statjs.data.active_on_discord_mobile === true && statjs.data.discord_status === 'online') {
        $("#status").text("Online on Mobile")
    }
}

loadstatus()
setInterval(function() {
    loadstatus()
}, 5000)
