const audioFile = document.querySelector('#uploadfile');
const track = new Audio()

audioFile.addEventListener('input', function(){

    const audioFileSrc = URL.createObjectURL(this.files[0])

    track.src = audioFileSrc;

    track.play()
    
    const audioContext = new AudioContext()
    const analyzer = audioContext.createAnalyser()
    const source = audioContext.createMediaElementSource(track)


    source.connect(analyzer).connect(audioContext.destination)

    analyzer.fftSize = 128;

    const bufferLength = analyzer.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    
    const canvas = document.querySelector('#canvas')
    let canvasContext = canvas.getContext('2d')

    let canvasWidth = canvas.width = 300 
    let canvasHeight = canvas.height = 400

    let button = document.getElementById('button');

    function draw() {
        const drawVisual = requestAnimationFrame(draw)
        analyzer.getByteTimeDomainData(dataArray)
        // canvasContext.fillStyle = 'rgb(200, 200, 200)'
        // canvasContext.fillRect(0, 0, canvasWidth, canvasHeight)
        canvasContext.clearRect(0, 0, canvasWidth, canvasHeight)
        canvasContext.lineWidth = 5;
        canvasContext.strokeStyle = 'white';
        canvasContext.beginPath();
        const sliceWidth = canvasWidth / bufferLength;
        let x = 0; 
        for(let a=0, b=0; a<Math.PI*2, b<dataArray.length; a+=0.1, b++){
            canvasContext.lineTo(canvasWidth / 2 + 100*Math.cos(a), (canvasHeight/2 + 100*Math.sin(a) / (dataArray[b]/128.0)));
            
        }
        canvasContext.stroke();
    }

    draw()

})





const canvasbg = document.querySelector('#canvas1');
const ctx = canvasbg.getContext('2d');
// console.log(ctx)
canvasbg.width = window.innerWidth;
canvasbg.height = window.innerHeight;
const particlesArray = [];
let hue = 0;

window.addEventListener('resize', function(){
    canvasbg.width = window.innerWidth;
    canvasbg.height = window.innerHeight;
})

const mouse = {
    x: undefined,
    y: undefined,
}

canvasbg.addEventListener('click', function(event){
    mouse.x = event.x;
    mouse.y = event.y;
    init()
})

canvasbg.addEventListener('mousemove', function(event){
    console.log(event)
    mouse.x = event.x;
    mouse.y = event.y;
    for(let i=0; i<2; i++){
        particlesArray.push(new Particle)
    }
})

class Particle {
    constructor(size = 5){
        this.x = mouse.x;
        this.y = mouse.y;
        // this.x = Math.random() * canvasbg.width;
        // this.y = Math.random() * canvasbg.height;
        this.size = Math.random() * size + 1;
        // this.stroke = Math.random() * 10 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.color = 'hsl(' + hue + ', 100%,' + '50%)';
    }

    update(){
        this.x += this.speedX;
        this.y += this.speedY;
        if(this.size > 0.2) this.size -= 0.05

    }

    draw(){
        ctx.fillStyle = this.color;
        // ctx.strokeStyle = this.strokeColor;
        ctx.lineWidth = this.stroke;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
        ctx.stroke()
        ctx.fill();
    }
}

function init(){
    for(let i=0; i<30; i++){
        particlesArray.push(new Particle(15));
    }
}

function handleParticles() {
    for(let i=0; i<particlesArray.length; i++){
        particlesArray[i].update();
        particlesArray[i].draw();
        for(let j=i; j < particlesArray.length; j++){
            dx = particlesArray[i].x - particlesArray[j].x;
            dy = particlesArray[i].y - particlesArray[j].y;
            const distance = Math.sqrt(dx*dx + dy*dy);  
            if(distance < 30){
                ctx.beginPath();
                ctx.strokeStyle = particlesArray[i].color
                ctx.lineWidth = particlesArray[i].size / 10
                ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                ctx.stroke();
            } 
        }
        if(particlesArray[i].size <= 0.3){
            particlesArray.splice(i, 1);
            i--;
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, canvasbg.width, canvasbg.height)
    // ctx.fillStyle = 'rgba(0,0,0,0.02)';
    // ctx.fillRect(0, 0, canvasbg.width, canvasbg.height);
    handleParticles()
    hue+=2;
    requestAnimationFrame(animate);
}

animate();




