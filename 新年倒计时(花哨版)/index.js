//获取用来防止文字的div
let days = document.getElementById('days')
let hours = document.getElementById('hours')
let minutes = document.getElementById('minutes')
let seconds = document.getElementById('seconds')

// 获取真正显示刻度值的上层的圆环的div
let dd = document.getElementById('dd')
let hh = document.getElementById('hh')
let mm = document.getElementById('mm')
let ss = document.getElementById('ss')

// 获取小圆球div
let day_dot = document.getElementById('day_dot')
let hr_dot = document.getElementById('hr_dot')
let min_dot = document.getElementById('min_dot')
let sec_dot = document.getElementById('sec_dot')

//显示背景文字
var x = document.getElementById('newYear')
x.innerHTML = new Date().getFullYear() + 1 + '<br><span>Happy New Year</span>'

// 显示圆环内部的文字
// 倒计时停止时间点
currentYear = new Date().getFullYear() + 1
let endDate = '01/01/' + currentYear + ' 00:00:00'
console.log(endDate)

// 加定时器
let xx = setInterval(() => {
    // 倒计时终止时间戳
    let end = new Date(endDate).getTime()
    // console.log(end)

    // 现在的时间戳
    let now = new Date().getTime()
    // console.log(now)

    // 计算距离终点时间的毫秒数
    let distance = end - now
    // console.log(distance)

    if (distance < 0) {
        clearInterval(xx)
        document.getElementById("time").style.display = 'none'
        document.getElementById('newYear').style.display = 'block'

        document.querySelector('body').classList.toggle('newyear')

        // 随机生成泡泡
        const bubleCreate = () => {
            // 获取body元素
            const body = document.body
            // 创建泡泡元素
            const buble = document.createElement('paopao')
            // 设置泡泡半径
            let r = Math.random() * 5 + 25  //半径大小为25-35
            // 设置泡泡的宽高
            buble.style.width = r + 'px'
            buble.style.height = r + 'px'
            // 设置泡泡的随机起点
            buble.style.left = Math.random() * innerWidth - 100 + 'px'
            // 为body添加buble元素
            body.append(buble)
            // 3.8s清除一次泡泡
            setTimeout(() => {
                buble.remove()
            }, 3800)
        }
        // 每300ms生成一个泡泡
        setInterval(() => {
            bubleCreate()
        }, 300)
    }

    //从间隔时间中分别提出 天 时 分 秒
    let d = Math.floor(distance / (1000 * 60 * 60 * 24))  //天
    // console.log(d)
    let h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))  //时
    // console.log(h)
    let m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))  //分
    // console.log(m)
    let s = Math.floor((distance % (1000 * 60)) / 1000)  //秒
    // console.log(s)

    //然后需要放到圆环里面 并追加样式
    days.innerHTML = d + '<br><span>天</span>'
    hours.innerHTML = h + '<br><span>时</span>'
    minutes.innerHTML = m + '<br><span>分</span>'
    seconds.innerHTML = s + '<br><span>秒</span>'

    // 设置根据具体的占比应该偏移的刻度
    const oneRound = 440  //圆环一周的长度 这个数字根据目前元的半径为70得到的
    dd.style.strokeDashoffset = oneRound - oneRound * (d / 365)
    hh.style.strokeDashoffset = oneRound - oneRound * (h / 24)
    mm.style.strokeDashoffset = oneRound - oneRound * (m / 60)
    ss.style.strokeDashoffset = oneRound - oneRound * (s / 60)

    //小圆球应该调整到圆环的末端 现在是起始位置
    // 一圈360度 根据对应的值计算角度
    day_dot.style.transform = `rotateZ(${d * (360 / 365)}deg)`
    hr_dot.style.transform = `rotateZ(${h * (360 / 24)}deg)`
    min_dot.style.transform = `rotateZ(${m * (360 / 60)}deg)`
    sec_dot.style.transform = `rotateZ(${s * (360 / 60)}deg)`
})



