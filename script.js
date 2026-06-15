const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener("resize", resize);
resize();

const trainImg = new Image();
trainImg.src = "assets/jeep2.png";

const treeImg = new Image();
treeImg.src = "assets/trees.png";

const mountainImg = new Image();
mountainImg.src = "assets/mountains.png";

const points = [];

for (let x = 0; x < 6000; x += 100) {
    points.push({
        x: x,
        y: 300
           + Math.sin(x / 900) * 35
           + Math.sin(x / 250) * 10
    });
}

let progress = 0;
let speed = 0;
let maxSpeed = 0.15;

let touchDirection = 0;

canvas.addEventListener("touchstart", (e) => {
    e.preventDefault();

    const touchX = e.touches[0].clientX;

    if (touchX < canvas.width / 2) {
        touchDirection = -1;
    } else {
        touchDirection = 1;
    }
});

canvas.addEventListener("touchmove", (e) => {
    e.preventDefault();

    const touchX = e.touches[0].clientX;

    if (touchX < canvas.width / 2) {
        touchDirection = -1;
    } else {
        touchDirection = 1;
    }
});

canvas.addEventListener("touchend", () => {
    touchDirection = 0;
});

function getPoint(t) {
    const i = Math.floor(t);
    const f = t - i;

    const a = points[Math.max(0, Math.min(i, points.length - 1))];
    const b = points[Math.max(0, Math.min(i + 1, points.length - 1))];

    return {
        x: a.x + (b.x - a.x) * f,
        y: a.y + (b.y - a.y) * f
    };
}

function updateMovement() {
    const acceleration = 0.002;
    const friction = 0.985;

    if (touchDirection === 1) {
        speed += acceleration;
    }

    if (touchDirection === -1) {
        speed -= acceleration;
    }

    speed *= friction;

    if (speed > maxSpeed) speed = maxSpeed;
    if (speed < -maxSpeed) speed = -maxSpeed;

    progress += speed;

    if (progress < 0) {
        progress = 0;
        speed = 0;
    }

    if (progress > points.length - 2) {
        progress = points.length - 2;
        speed = 0;
    }
}

function draw() {
    updateMovement();

    const p = getPoint(progress);
    const next = getPoint(progress + 0.1);

    const angle = Math.atan2(
        next.y - p.y,
        next.x - p.x
    );

    const camX = p.x - canvas.width / 2;
    const camY = p.y - canvas.height / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(
        mountainImg,
        -camX * 0.2,
        50
    );

    ctx.drawImage(
        mountainImg,
        800 - camX * 0.2,
        50
    );

    ctx.drawImage(
        treeImg,
        -camX * 0.5,
        180
    );

    ctx.drawImage(
        treeImg,
        512 - camX * 0.5,
        180
    );

    ctx.drawImage(
        treeImg,
        1024 - camX * 0.5,
        180
    );

    ctx.save();
    ctx.translate(-camX, -camY);

    ctx.beginPath();

    for (let i = 0; i < points.length; i++) {
        if (i === 0) {
            ctx.moveTo(points[i].x, points[i].y);
        } else {
            ctx.lineTo(points[i].x, points[i].y);
        }
    }

    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.save();

    ctx.translate(p.x, p.y);
    ctx.rotate(angle);

    ctx.drawImage(
        trainImg,
        -60,
        -50,
        120,
        60
    );

    ctx.restore();
    ctx.restore();

    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText(
        "Touch left ← | → Touch right",
        20,
        30
    );

    requestAnimationFrame(draw);
}

draw();