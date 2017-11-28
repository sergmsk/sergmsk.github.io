(function(){
const ruler = document.querySelector('#ruler');
const total = document.querySelector('#sum');

const num1 = randomInt(6, 9);
const sum = randomInt(11, 14); 
const num2 = sum - num1;
let midPoint; //центр стрелки для инпута, считаем в drawArrow()

document.querySelector('#num1top').innerHTML = num1;
document.querySelector('#num2top').innerHTML = num2;

const canvas = document.getElementById('canvas');
if (!canvas.getContext) alert("no canvas");
const ctx = canvas.getContext('2d');
canvas.width = 875;
canvas.height = 166;

ctx.strokeStyle = ctx.fillStyle = "red";

const zeroX = 35.5,
      zeroY = 102,
      segment = 39;


action();

document.querySelector('#next').addEventListener('click', () => {
    location.reload();
});

function action(){
    step1();
}

function step1(){
    drawArrow(0,num1);
    insertInput('num1', ruler);
    checkInput('num1', num1, step2);
}

function step2() {
    drawArrow(num1, sum);
    insertInput('num2', ruler);
    checkInput('num2', num2, step3);
}

function step3() {
 total.innerHTML = '';
    insertInput('sumtotal', total);
    checkInput('sumtotal', sum);
}

function drawArrow(start, end) {
    // https://developer.mozilla.org/docs/Web/API/Canvas_API/Tutorial/
    // Начальная, конечная, контрольная точка для дуги
    const fromx = zeroX + start * segment,
        fromy = zeroY,
        tox = zeroX + end * segment,
        toy = zeroY,
        qX = fromx + (end - start) / 2 * segment,
        qY = zeroY - (end - start) / 2 * segment;
    // Дуга
    ctx.beginPath();
    ctx.moveTo(fromx, fromy);
    ctx.quadraticCurveTo(qX, qY, tox, toy);
    ctx.stroke();
    // Стрелка
    var ang = findAngle(qX, qY, tox, toy);
    drawArrowhead(tox, toy, ang, 20, 20);
    // Центральная точка
    midPoint = getQuadraticCurvePoint(fromx, fromy, qX, qY, tox, toy);
    // Угол от контрольной точки для стрелки
    function findAngle(qx, qy, tox, toy) {
        return Math.atan2((toy - qy), (tox - qx));
    }
    // Стрелка
    function drawArrowhead(locx, locy, angle, sizex, sizey) {
        var hx = sizex;
        var hy = sizey / 2;
        ctx.save();
        ctx.translate((locx), (locy));
        ctx.rotate(angle);
        ctx.translate(-hx, -hy);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(sizex, hy);
        ctx.rotate(-angle);
        ctx.lineTo(-0.8 * sizex, 1.3 * hy);
        ctx.stroke();
        ctx.restore();
    }
    // Расчет центральной точки дуги
    function _getQBezierValue(t, p1, p2, p3) {
        var iT = 1 - t;
        return iT * iT * p1 + 2 * iT * t * p2 + t * t * p3;
    }
    function getQuadraticCurvePoint(startX, startY, cpX, cpY, endX, endY) {
        return {
            x: _getQBezierValue(0.5, startX, cpX, endX),
            y: _getQBezierValue(0.5, startY, cpY, endY)
        };
    }
}

function insertInput(id, parent) {
    let inputArea = document.createElement('input');
    inputArea.setAttribute('id', id);
    let style = `top:${midPoint.y - 40}px; left: ${midPoint.x - 10}px;`;
    inputArea.setAttribute('style', style);
    parent.appendChild(inputArea);
    return inputArea;
}

function checkInput(inputId, num, next) {
    let input = document.querySelector(`#${inputId}`);
    let numTop = document.querySelector(`#${inputId}top`);
    input.addEventListener('input', ()=>{
        if(input.value != num) {
            input.style.color = 'red';
            if (numTop) {
                numTop.style.background = 'orange';
            }
        } else {
            replaceBySpan(input, document.querySelector(`#${inputId}`).parentElement);
            if (numTop) {
                numTop.style.background = 'none';
            }
            if (next) next();
        }
    });
}

function replaceBySpan(input) {
    let newSpan = document.createElement('span'),
        parent = input.parentElement;

    newSpan.innerHTML = input.value;
    newSpan.setAttribute('id', input.id);
    newSpan.style.border = 'none';
    newSpan.style.top = input.style.top;
    newSpan.style.left = input.style.left;
    parent.removeChild(input);
    parent.appendChild(newSpan);
}

function randomInt(min, max) {
    var rand = min + Math.random() * (max + 1 - min);
    rand = Math.floor(rand);
    return rand;
}
})();     
