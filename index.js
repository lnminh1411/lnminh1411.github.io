$(window).on("scroll", function () {
  let scroll = $(window).scrollTop(),
    h = $(document).height(),
    w = $(window).height();
  let percent = (scroll / (h - w)) * 100 < 4 ? 4 : (scroll / (h - w)) * 100;
  let scrollopac = scroll <= 10 ? 0.35 : 0;
  $("#progressbar").css("height", `${percent}%`);
  $("#arrow").css("opacity", `${scrollopac}`);
  if (scroll >= 10) {
    $(".scrolllink").attr("href", "javascript:void(0)");
    $(".scrolllink").attr("title", "");
  } else {
    $(".scrolllink").attr("href", "#aboutmesectionscroll");
    $(".scrolllink").attr("title", "Scroll down!");
  }
});

function rickroll() {
  window.open("https://youtu.be/p7YXXieghto", "_blank");
}

function loadtooltip() {
  const tooltipTriggerList = document.querySelectorAll(
    '[data-bs-toggle="tooltip"]'
  );
  const tooltipList = [...tooltipTriggerList].map(
    (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
  );
}

let sound = new Audio("./Expendable.mp3");
sound.addEventListener(
  "ended",
  function () {
    this.currentTime = 0;
    this.play();
  },
  false
);
let soundplayed = false;
let soundtoggle = false;
function togglesound() {
  if (soundplayed == false) {
    sound.play();
    sound.volume = 0.2;
    soundtoggle = true;
    soundplayed = true;
  } else {
    if (soundtoggle == true) {
      sound.volume = 0.0;
    } else {
      sound.volume = 0.2;
    }
    soundtoggle = !soundtoggle;
  }
}

let angermeter = 1;
function bang() {
  let bang = new Audio("./flashbang.mp3");
  bang.play();
  $(".flashbang").css("display", "block");
  $(".flashbang").css("animation", "flash 7s");
}
function flashbang() {
  if (angermeter == 1) {
    bang();
    setTimeout(function () {
      $(".flashbang").css("display", "none");
      $(".lightmode").attr("data-bs-title", "Haven't learnt your lesson huh?");
      loadtooltip();
      angermeter = 2;
    }, 7000);
  }
  if (angermeter == 2) {
    bang();
    setTimeout(function () {
      $(".flashbang").css("display", "none");
      $(".lightmode").attr("data-bs-title", "Really?");
      loadtooltip();
      angermeter = 3;
    }, 7000);
  }
  if (angermeter == 3) {
    bang();
    setTimeout(function () {
      $(".flashbang").css("display", "none");
      $(".lightmode").attr("data-bs-title", "Stop it!");
      loadtooltip();
      angermeter = 4;
    }, 7000);
  }
  if (angermeter == 4) {
    bang();
    setTimeout(function () {
      $(".flashbang").css("display", "none");
      $(".lightmode").attr("data-bs-title", "Fine have your light mode...");
      loadtooltip();
      angermeter = 5;
    }, 7000);
  }
  if (angermeter == 5) {
    bang();
    setTimeout(function () {
      $(".flashbang").css("display", "none");
      $(".lightmode").attr("data-bs-title", "Lights attract bugs!");
      loadtooltip();
      rickroll();
      $("#change").attr("class", "bi bi-ban");
      $("#change").attr("onclick", "rickroll()");
    }, 2000);
  }
}

setInterval(function () {
  const d = spacetime.now("UTC+7");
  const client = spacetime.now();
  let hrs = (d.d.getHours() <= 9 ? "0" : "") + d.d.getHours() + ":";
  let min = (d.d.getMinutes() <= 9 ? "0" : "") + d.d.getMinutes() + ":";
  let sec = (d.d.getSeconds() <= 9 ? "0" : "") + d.d.getSeconds();
  let difftime =
    d.d.getHours() - client.d.getHours() === 0
      ? "(Same time)"
      : `(Offset by ${Math.abs(client.d.getHours() - d.d.getHours())} hours)`;
  let hrs12 =
    ((d.d.getHours() <= 12
      ? d.d.getHours() === 12
        ? d.d.getHours()
        : d.d.getHours()
      : d.d.getHours()) -
      12 <=
    9
      ? "0"
      : "") +
    ((d.d.getHours() <= 12
      ? d.d.getHours() === 12
        ? d.d.getHours()
        : d.d.getHours()
      : d.d.getHours()) -
      12) +
    ":";
  let midday =
    d.d.getHours() <= 12 ? (d.d.getHours() === 12 ? "PM" : "AM") : "PM";
  $("#time").text(
    hrs +
      min +
      sec +
      " || " +
      hrs12 +
      min +
      sec +
      " " +
      midday +
      "  " +
      difftime
  );
}, 1000);

async function loadstatus() {
  const d = spacetime.now("asia/saigon");
  const Color = {
    online: "#4b8",
    idle: "#fa1",
    dnd: "#f44",
    offline: "#778",
  };
  const res = await fetch(
    "https://api.lanyard.rest/v1/users/783652998319833118"
  );
  const statjs = await res.json();
  if (statjs.data.discord_status === "dnd") {
    if (d.d.getHours() >= 22) {
      $("#status").text("Sleeping");
    } else {
      $("#status").text("Busy / Not Available");
    }
  }
  if (statjs.data.discord_status === "offline") {
    if (d.d.getHours() >= 22) {
      $("#status").text("Sleeping");
    } else {
      $("#status").text("Offline");
    }
  }
  if (statjs.data.discord_status === "idle") {
    if (d.d.getHours() >= 22) {
      $("#status").text("Sleeping");
    } else {
      $("#status").text("Not Active");
    }
  }
  $("#statsdot").css("background", `${Color[statjs.data.discord_status]}`);
  if (
    statjs.data.active_on_discord_desktop === true &&
    statjs.data.discord_status === "online"
  ) {
    $("#status").text("Online");
  }
  if (
    statjs.data.active_on_discord_desktop === false &&
    statjs.data.active_on_discord_mobile === true &&
    statjs.data.discord_status === "online"
  ) {
    $("#status").text("Online on Mobile");
  }
  if (
    statjs.data.listening_to_spotify === true &&
    statjs.data.discord_status === "online"
  ) {
    $("#status").text("Listening to Spotify");
    $(".spotifyname").css("grid-area", "2 / 2 / 3 / 4");
    $(".songart").css("grid-area", "2 / 1 / 3 / 2");
    $(".songart").css("display", "block");
    $(".spotifyname").css("display", "block");
  } else {
    $(".spotifyname").css("grid-area", "");
    $(".songart").css("grid-area", "");
    $(".songart").css("display", "none");
    $(".spotifyname").css("display", "none");
  }
}

async function loadspotify() {
  const res = await fetch(
    "https://api.lanyard.rest/v1/users/783652998319833118"
  );
  const json = await res.json();
  if (
    json.data.listening_to_spotify === true &&
    json.data.discord_status === "online"
  ) {
    $(".art").attr("src", `${json.data.spotify.album_art_url}`);
    $("#name").text(`${json.data.spotify.song}`);
    $("#artist").text(`${json.data.spotify.artist}`);
    $(".nameastat").css("padding-right", "2vw");
    const d = spacetime.now("asia/saigon");
    const progress =
      ((d.epoch - json.data.spotify.timestamps.start) /
        (json.data.spotify.timestamps.end -
          json.data.spotify.timestamps.start)) *
      100;
    const lengthsec = (
      ((json.data.spotify.timestamps.end - json.data.spotify.timestamps.start) %
        60000) /
      1000
    ).toFixed(0);
    const currentsec = (
      ((d.epoch - json.data.spotify.timestamps.start) % 60000) /
      1000
    ).toFixed(0);
    const lengthmin = Math.floor(
      (json.data.spotify.timestamps.end - json.data.spotify.timestamps.start) /
        60000
    );
    const currentmin = Math.floor(
      (d.epoch - json.data.spotify.timestamps.start) / 60000
    );
    if (currentsec < 10) {
      currentsectimed = "0" + currentsec;
    } else {
      currentsectimed = currentsec;
    }
    if (lengthsec < 10) {
      lengthsectimed = "0" + lengthsec;
    } else {
      lengthsectimed = lengthsec;
    }
    if (currentsec == 60) {
      currentsectimed = "00";
      currentmintimed = currentmin + 1;
    } else {
      currentmintimed = currentmin;
    }
    if (lengthsec == 60) {
      lengthsectimed = "00";
      lengthmintimed = lengthmin + 1;
    } else {
      lengthmintimed = lengthmin;
    }
    if (lengthmin >= 100) {
      $("#timestampleft").text(`${lengthmintimed}m`);
    } else {
      $("#timestampleft").text(`${lengthmintimed}:${lengthsectimed}`);
    }
    if (d.epoch > json.data.spotify.timestamps.end) {
      $("#timestamp").text(`--`);
    } else {
      if (currentmin >= 100) {
        $("#timestamp").text(`${currentmintimed}m`);
      } else {
        $("#timestamp").text(`${currentmintimed}:${currentsectimed}`);
      }
      $("#songprogress").css("width", `${progress}%`);
    }
  } else {
    $(".nameastat").css("padding-right", "");
  }
}

const txtarr = [
  "Creating solution for absolutely nothing",
  "Nothing make sense",
  "Technically good!",
  "≈70% bug free!",
  "Tell your friends about this.",
  "Nice to meet you!",
  "√-1 love you!",
  "12345678 is a bad password!",
  "Have a great day!",
  "There are no real limits, not even the sky!",
  "!false is actually true!",
  "It's not a bug, it's a feature!",
  "If it works, it works.",
  'helloworld("print")',
  'Playing hide and seek with a ";"',
  "How is this working!?",
  "Time wasted creating this: A lot",
  "It's either !Yes or No",
  "If + else = elif",
  "What a pain!",
  "Mobile friendly!",
  "Perfectly balanced!",
  "EMOTIONAL DAMAGE!",
  "Reinforced with galvanized square steel!",
  "＼（〇_ｏ）／",
  "（づ￣3￣）づ╭❤️～",
  "¯\\_(ツ)_/¯",
  "5!=120",
];
$("#titletxt").text(txtarr[Math.floor(Math.random() * txtarr.length)]);
if (window.innerHeight > 1232 && window.innerHeight > window.innerWidth) {
  alert(
    `Use landscape mode for better experience!\nXoay ngang thiết bị của bạn để có trải nghiệm tốt hơn!`
  );
}

if (window.innerWidth <= 527) {
  alert(
    `Get a better phone! Haiyaa I can't code stuffs for such a small phone!\nMua điện thoại mới đi! Cũ quá rồi bạn ơi:) mình ko lập trình cho điện thoại này được!\n\nIf continue, visual glitches are expected!\nNếu tiếp tục truy cập thì sẽ nhìn thấy vài lỗi "nho nhỏ" thôi:)`
  );
}

loadtooltip();
loadstatus();
setInterval(function () {
  loadstatus();
  console.log(
    "%cMate, what are you doing here? Get out and don't paste anything here! (Unless ofc you know what you're doing, in that case, don't blame me if anything happen :) )",
    "color:cyan; font-size:25px"
  );
}, 5000);
setInterval(function () {
  loadspotify();
}, 500);
