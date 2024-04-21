const canvas = document.getElementById('waveCanvas');  
const context = canvas.getContext('2d');  
let audioContext; // 将在这里初始化AudioContext  
// let audioElement; // 将在这里初始化<audio>元素  
let sourceNode; // 将在这里创建MediaElementSourceNode  
let analyserNode; // 将在这里创建AnalyserNode  
  
// 初始化音频和上下文  
function initAudio() {  
//   audioElement = new Audio('./assert/海鸥-逃跑计划.mp3'); // 替换为MP3文件的路径  
//   audioElement.controls = true;  
//   audioElement.autoplay = false; // 不自动播放，等待用户交互  
  
  // 创建AudioContext（确保在用户交互后）  
  if(!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();  
  
  // 创建AnalyserNode以进行音频可视化  
  if(!analyserNode) analyserNode = audioContext.createAnalyser();  
  analyserNode.fftSize = 2048;  
  const bufferLength = analyserNode.frequencyBinCount;  
  const dataArray = new Uint8Array(bufferLength);  
  
  if(!sourceNode) sourceNode = audioContext.createMediaElementSource(doms.audio)
  sourceNode.connect(analyserNode);  
  analyserNode.connect(audioContext.destination);  
  
  // 绘制波形图的函数  
  function draw() {  
    requestAnimationFrame(draw);  
  
    analyserNode.getByteFrequencyData(dataArray);  
    context.fillStyle = 'rgb(0, 0, 0)';  
    context.fillRect(0, 0, canvas.width, canvas.height);  
  
    const barWidth = (canvas.width / bufferLength) * 2.5;  
    let x = 0;  
  
    for(let i = 0; i < bufferLength; i++) {  
      const barHeight = dataArray[i];  
  
      // 绘制条形图  
      context.fillStyle = 'rgb(' + (barHeight+100) + ',50,50)';  
      context.fillRect(x,canvas.height-barHeight/2,barWidth,barHeight/2);  
  
      x += barWidth + 1;  
    }  
  }  
  
  // 开始绘制波形图  
  draw();  
}  
  
// 播放音频的函数  
function playAudio() {  
  if (!audioContext.state === 'running') {  
    audioContext.resume().then(() => {  
      audioElement.play().catch(err => {  
        console.error('播放音频时出错:', err);  
      });  
    }).catch(err => {  
      console.error('恢复AudioContext时出错:', err);  
    });  
  }
}  
  
// 绑定播放按钮的点击事件  
doms.audio.addEventListener('play', () => {  
  initAudio(); // 初始化音频和上下文  
  playAudio(); // 播放音频  
});