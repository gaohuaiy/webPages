/**
 * 解析歌词字符串
 * 得到一个歌词对象的数组
 * 每个歌词对象:
 * {time:开始时间,words:歌词内容}
 */
function parseLrc(){
    let lineStr = lrc.split('\n');
    return lineStr.map(item=>{
        let arr = item.substring("1").split("]")
        return {
            time: parseTime(arr[0]),
            words: arr[1]
        }
    })

}

/**
 * 将时间字符串转为数字（秒）
 * @param {*} timeStr 时间字符串
 * @returns 
 */
function parseTime(timeStr){
    var parts = timeStr.split(":")
    return +parts[0] * 60 + +parts[1];
}

var lrcData = parseLrc()  
var doms = {
    audio: document.querySelector('audio'),
    ul: document.querySelector(".container ul"),
    container: document.querySelector(".container")
}
/**
 * 计算出当前应该展示的LrcData数组中的下标
 */
function findIndex(){
    let currentTime = doms.audio.currentTime;
    return (lrcData.findIndex(item=>{
        return currentTime<item.time
    }) || lrcData.length)-1
}
/**
 * 创建歌词元素 li
 */
function createLrcElements(){
    //文档片段
    let frag = document.createDocumentFragment()
    lrcData.forEach(item=>{
        let li = document.createElement('li')
        li.textContent = item.words
        frag.appendChild(li)
    })
    doms.ul.append(frag)
}

createLrcElements()
//容器高度
let containerHeight = doms.container.clientHeight;
let liHeight = doms.ul.children[0].clientHeight;
let maxHeight = doms.ul.clientHeight - containerHeight;

/**
 * 设置歌词偏移量
 */
function setOffset(){
    let index = findIndex()
    // 偏移量  =  歌词高度 - container 容器高度的一半
    let offset = liHeight*index+liHeight/2 - containerHeight/2;
    if(offset<0) offset = 0;
    if(offset>maxHeight)  offset = maxHeight;
    doms.ul.style.transform = `translateY(-${offset}px)`
    //去除掉原来的高亮
    let li = doms.ul.querySelector('.active')
    if(li){
        li.classList.remove('active')
    }
    //设置高亮
    doms.ul.children[index].classList.add("active");
    return offset;
}

// 在播放器时间变化监听函数中调用setOffset函数
doms.audio.addEventListener('timeupdate',setOffset)
