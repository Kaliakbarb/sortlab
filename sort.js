const canvas = document.getElementById("bars");
const ctx = canvas.getContext("2d");
const N = 70;
let arr = [], timer = null, active = -1;

function* bubble(a) {
  for (let i = 0; i < a.length; i++)
    for (let j = 0; j < a.length - i - 1; j++) {
      if (a[j] > a[j + 1]) [a[j], a[j + 1]] = [a[j + 1], a[j]];
      yield j;
    }
}

function* insertion(a) {
  for (let i = 1; i < a.length; i++) {
    let j = i;
    while (j > 0 && a[j - 1] > a[j]) {
      [a[j - 1], a[j]] = [a[j], a[j - 1]];
      j--;
      yield j;
    }
    yield i;
  }
}

function* selection(a) {
  for (let i = 0; i < a.length; i++) {
    let min = i;
    for (let j = i + 1; j < a.length; j++) {
      if (a[j] < a[min]) min = j;
      yield j;
    }
    [a[i], a[min]] = [a[min], a[i]];
    yield i;
  }
}

const ALGOS = { bubble, insertion, selection };

function shuffle() {
  stop();
  arr = Array.from({ length: N }, (_, i) => i + 1);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  active = -1;
  draw();
}

function stop() {
  clearInterval(timer);
  timer = null;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const w = canvas.width / N;
  arr.forEach((v, i) => {
    ctx.fillStyle = i === active ? "#d33" : "#4a7dbd";
    const h = (v / N) * (canvas.height - 10);
    ctx.fillRect(i * w + 1, canvas.height - h, w - 2, h);
  });
}

document.getElementById("shuffle").addEventListener("click", shuffle);
document.getElementById("sort").addEventListener("click", () => {
  stop();
  const gen = ALGOS[document.getElementById("algo").value](arr);
  timer = setInterval(() => {
    const step = gen.next();
    if (step.done) { stop(); active = -1; }
    else active = step.value;
    draw();
  }, 8);
});

shuffle();
