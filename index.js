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
            3: "Damn.. Stop it!",
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
          $(".flashbang, #sleeper").css("display", "none"),
            $("body").css("background", "#aaa"),
            $("#titletxt")
              .text("Is this enough light for you?")
              .css({ color: "#000", opacity: "1" }),
            $(".lightmode").attr("data-bs-title", "Protect your eyes!"),
            loadtooltip(),
            rickroll(),
            $("#change")
              .attr("class", "bi bi-ban")
              .attr("onclick", "rickroll()");
        }, 2e3);
  }
}

async function fetchUserStatus(t) {
  const e = await fetch(`https://api.lanyard.rest/v1/users/${t}`);
  return await e.json();
}

function updateStatus(t, e, o) {
  const a = e.d.getHours(),
    s = {
      dnd: a >= 22 || a <= 6 ? "Sleeping" : "Busy / Not Available",
      offline: a >= 22 || a <= 6 ? "Sleeping" : "Offline",
      idle: a >= 22 || a <= 6 ? "Sleeping" : "Not Active",
      online: "Online",
      mobile: "Online on Mobile",
      spotify: "Listening to Spotify",
    },
    n = t.data.discord_status,
    i =
      "online" === n &&
      !t.data.active_on_discord_desktop &&
      t.data.active_on_discord_mobile;
  $("#status").text(i ? s.mobile : s[n]),
    $("#statsdot").css("background", o[n]),
    t.data.listening_to_spotify && "online" === n
      ? ($("#status").text(s.spotify),
        $(".spotifyname").css({
          "grid-area": "2 / 2 / 3 / 4",
          display: "block",
        }),
        $(".songart").css({ "grid-area": "2 / 1 / 3 / 2", display: "block" }))
      : $(".spotifyname, .songart").css({ "grid-area": "", display: "none" });
}

async function loadstatus() {
  const t = spacetime.now("UTC+7"),
    e = { online: "#4b8", idle: "#fa1", dnd: "#f44", offline: "#778" },
    o = "783652998319833118",
    a = "1243939761614356544",
    s = await fetchUserStatus(o),
    n = s.data.discord_status;
  if ("offline" === n) {
    const o = await fetchUserStatus(a);
    updateStatus("offline" === o ? s : o, t, e);
  } else updateStatus(s, t, e);
}

async function loadspotify() {
  const t = await fetch("https://api.lanyard.rest/v1/users/783652998319833118"),
    e = await t.json(),
    { listening_to_spotify: o, discord_status: a, spotify: s } = e.data;
  if (o && "online" === a) {
    $(".art").attr("src", s.album_art_url),
      $("#name").text(s.song),
      $("#artist").text(s.artist),
      $(".nameastat").css("padding-right", "2vw");
    const t = spacetime.now("asia/saigon"),
      { start: e, end: o } = s.timestamps,
      a = ((t.epoch - e) / (o - e)) * 100,
      n = (((o - e) % 6e4) / 1e3).toFixed(),
      i = (((t.epoch - e) % 6e4) / 1e3).toFixed(),
      l = Math.floor((o - e) / 6e4),
      r = Math.floor((t.epoch - e) / 6e4),
      d = (t, e) => {
        const o = t < 10 ? `0${t}` : t;
        return 60 === t ? [0, e + 1] : [o, e];
      },
      [c, u] = d(i, r),
      [h, g] = d(n, l);
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
    s = t <= 10 ? 0.35 : 0;
  $("#progressbar").css("height", `${a}%`),
    $("#arrow").css("opacity", `${s}`),
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
    s = o(t.d.getMinutes()),
    n = o(t.d.getSeconds()),
    i = t.d.getHours() - e.d.getHours(),
    l = 0 === i ? "(Same time)" : `(Offset by ${Math.abs(i)} hours)`,
    r = t.d.getHours() % 12 || 12,
    d = o(r),
    c = t.d.getHours() < 12 ? "AM" : "PM";
  $("#time").text(`${a}:${s}:${n} || ${d}:${s}:${n} ${c} ${l}`);
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

$("body").scrollHeight > $("body").clientHeight
  ? $("#progressbar").css("display", "block")
  : $("#progressbar").css("display", "none"),
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
