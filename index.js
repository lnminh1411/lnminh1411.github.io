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
        $('#progressbar')
            .css('height', `${percent}%`);
        $('.factcontainer')
            .css('opacity', `${factopac}`);
    });

$(document)
    .ready(function () {
        async function loadfacts() {
            const res = await fetch('./facts.json');
            const names = await res.json();
            const random = Math.floor(Math.random() * names.facts.length);
            $("#fact").text(names.facts[random].fact);
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
    $("#time")
        .text(hrs + min + sec + ' ' + difftime);
}, 1000)