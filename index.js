//Before you read this code:
//Don't waste your time trying to understand it.
//It's not worth it!

function rickroll() {
  window.open("https://youtu.be/p7YXXieghto", "_blank");
}

function loadtooltip() {
  const t = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  [...t].map((t) => new bootstrap.Tooltip(t));
}

function togglesound() {
  0 == soundplayed
    ? (sound.play(),
      (sound.volume = 0.3),
      (soundtoggle = !0),
      (soundplayed = !0),
      $("span.sound i").attr("class", "bi bi-volume-up-fill"))
    : (1 == soundtoggle
        ? ((sound.volume = 0),
          $("span.sound i").attr("class", "bi bi-volume-mute-fill"))
        : ((sound.volume = 0.3),
          $("span.sound i").attr("class", "bi bi-volume-up-fill")),
      (soundtoggle = !soundtoggle));
}

function bang() {
  let t = new Audio("./flashbang.mp3");
  t.play(),
    $(".flashbang").css("display", "block"),
    $(".flashbang").css("animation", "flash 7s");
}

function flashbang() {
  switch (angermeter) {
    case 1:
    case 2:
    case 3:
    case 4:
      bang(),
        setTimeout(function () {
          $(".flashbang").css("display", "none");
          let t = {
            1: "Haven't learnt your lesson huh?",
            2: "Really?",
            3: "Stop it!",
            4: "Fine have your Light mode...",
          };
          $(".lightmode").attr("data-bs-title", t[angermeter]),
            loadtooltip(),
            angermeter++;
        }, 7e3);
      break;
    case 5:
      bang(),
        setTimeout(function () {
          $(".flashbang").css("display", "none"),
            $(".lightmode").attr("data-bs-title", "Lights attract bugs!"),
            loadtooltip(),
            rickroll(),
            $("#change")
              .attr("class", "bi bi-ban")
              .attr("onclick", "rickroll()");
        }, 2e3);
  }
}

async function loadstatus() {
  const t = spacetime.now("UTC+7"),
    e = { online: "#4b8", idle: "#fa1", dnd: "#f44", offline: "#778" },
    o = await fetch("https://api.lanyard.rest/v1/users/783652998319833118"),
    a = await o.json(),
    n = a.data.discord_status,
    s = t.d.getHours(),
    i = {
      dnd: s >= 22 || s <= 6 ? "Sleeping" : "Busy / Not Available",
      offline: s >= 22 || s <= 6 ? "Sleeping" : "Offline",
      idle: s >= 22 || s <= 6 ? "Sleeping" : "Not Active",
      online: "Online",
      mobile: "Online on Mobile",
      spotify: "Listening to Spotify",
    },
    l =
      "online" === n &&
      !a.data.active_on_discord_desktop &&
      a.data.active_on_discord_mobile;
  $("#status").text(l ? i.mobile : i[n]),
    $("#statsdot").css("background", e[n]),
    a.data.listening_to_spotify && "online" === n
      ? ($("#status").text(i.spotify),
        $(".spotifyname").css({
          "grid-area": "2 / 2 / 3 / 4",
          display: "block",
        }),
        $(".songart").css({ "grid-area": "2 / 1 / 3 / 2", display: "block" }))
      : $(".spotifyname, .songart").css({ "grid-area": "", display: "none" });
}

async function loadspotify() {
  const t = await fetch("https://api.lanyard.rest/v1/users/783652998319833118"),
    e = await t.json(),
    { listening_to_spotify: o, discord_status: a, spotify: n } = e.data;
  if (o && "online" === a) {
    $(".art").attr("src", n.album_art_url),
      $("#name").text(n.song),
      $("#artist").text(n.artist),
      $(".nameastat").css("padding-right", "2vw");
    const t = spacetime.now("asia/saigon"),
      { start: e, end: o } = n.timestamps,
      a = ((t.epoch - e) / (o - e)) * 100,
      s = (((o - e) % 6e4) / 1e3).toFixed(),
      i = (((t.epoch - e) % 6e4) / 1e3).toFixed(),
      l = Math.floor((o - e) / 6e4),
      r = Math.floor((t.epoch - e) / 6e4),
      d = (t, e) => {
        const o = t < 10 ? `0${t}` : t;
        return 60 === t ? [0, e + 1] : [o, e];
      },
      [c, u] = d(i, r),
      [h, g] = d(s, l);
    $("#timestampleft").text(l >= 100 ? `${g}m` : `${g}:${h}`),
      t.epoch > o
        ? $("#timestamp").text("--")
        : ($("#timestamp").text(r >= 100 ? `${u}m` : `${u}:${c}`),
          $("#songprogress").css("width", `${a}%`));
  } else $(".nameastat").css("padding-right", "");
}

$(window).on("scroll", function () {
  let t = $(window).scrollTop(),
    e = $(document).height(),
    o = $(window).height(),
    a = (t / (e - o)) * 100 < 4 ? 4 : (t / (e - o)) * 100,
    n = t <= 10 ? 0.35 : 0;
  $("#progressbar").css("height", `${a}%`),
    $("#arrow").css("opacity", `${n}`),
    t >= 10
      ? ($(".scrolllink").attr("href", "javascript:void(0)"),
        $(".scrolllink").attr("title", ""))
      : ($(".scrolllink").attr("href", "#aboutmesectionscroll"),
        $(".scrolllink").attr("title", "Scroll down!"));
});

let sound = new Audio("./Expendable.mp3");
sound.addEventListener(
  "ended",
  function () {
    (this.currentTime = 0), this.play();
  },
  !1
);
let soundplayed = !1,
  soundtoggle = !1,
  angermeter = 1;
setInterval(() => {
  const t = spacetime.now("UTC+7"),
    e = spacetime.now(),
    o = (t) => (t <= 9 ? "0" : "") + t,
    a = o(t.d.getHours()),
    n = o(t.d.getMinutes()),
    s = o(t.d.getSeconds()),
    i = t.d.getHours() - e.d.getHours(),
    l = 0 === i ? "(Same time)" : `(Offset by ${Math.abs(i)} hours)`,
    r = t.d.getHours() % 12 || 12,
    d = o(r),
    c = t.d.getHours() < 12 ? "AM" : "PM";
  $("#time").text(`${a}:${n}:${s} || ${d}:${n}:${s} ${c} ${l}`);
}, 1e3);

const txtarr = [
  "Creating solution for absolutely nothing",
  "Nothing makes sense",
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

$("#titletxt").text(txtarr[Math.floor(Math.random() * txtarr.length)]),
  window.innerHeight > 1232 &&
    window.innerHeight > window.innerWidth &&
    alert(
      "Use landscape mode for better experience!\nXoay ngang thiết bị của bạn để có trải nghiệm tốt hơn!"
    ),
  window.innerWidth <= 527 &&
    alert(
      'Get a better phone! Haiyaa I can\'t code stuffs for such a small phone!\nMua điện thoại mới đi! Cũ quá rồi bạn ơi:) mình ko lập trình cho điện thoại này được!\n\nIf continue, visual glitches are expected!\nNếu tiếp tục truy cập thì sẽ nhìn thấy vài lỗi "nho nhỏ" thôi:)'
    ),
  loadtooltip(),
  loadstatus(),
  setInterval(function () {
    loadstatus(),
      console.log(
        "%cMate, what are you doing here? Get out and don't paste anything here! (Unless ofc you know what you're doing, in that case, don't blame me if anything happen :) )",
        "color:cyan; font-size:25px"
      );
  }, 1e3),
  setInterval(function () {
    loadspotify();
  }, 500);
