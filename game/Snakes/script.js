let gameContainer = document.getElementById('game-container')
let startButton = document.querySelector('button')
let scoreDisplay = document.getElementById('score')
let modal = document.getElementById('game-over-modal')
let finalScoreDisplay = document.getElementById('final-score')
let time = document.getElementById('time')
// 蛇  食物  方向   分数  游戏定时器
let snake, food, direction, score, gameInterval
//判断是否暂停游戏
let isCountiueGame = false
let h1Text = document.querySelector('h1')
//用于控制蛇是否运行改变方向
let allowChangeDirection = true
//用于记录游戏的时间
// 计时器ID
let timerId
//游戏难度控制 主要用于定时器速度 数字越大速度越慢
//游戏初始速度
let gameRate = 300
//游戏目前速度  初始化为初始速度
let intervalGame = gameRate
// 游戏初始难度为0
let difficulty = 0
// 游戏速度递增步长 (毫秒)
let gameRateStep = 10
// 上次难度递增的得分
let lastScore = 0
//  生成奖励定时器
let generateRewardId
//是否结束游戏
let isGameOver = false


// 游戏常量
const GRID_SIZE = 20;
const GRID_WIDTH = gameContainer.offsetWidth / GRID_SIZE;
const GRID_HEIGHT = gameContainer.offsetHeight / GRID_SIZE;
//  游戏胜利数组长度  只要能占据超过一半的格子即可取得胜利
const winlen = GRID_WIDTH * GRID_HEIGHT / 2

//初始化游戏
function startGame() {
    startButton.style.display = 'none'
    scoreDisplay.textContent = '得分: 0'
    snake = [{ x: 200, y: 200 }, { x: 220, y: 200 }, { x: 240, y: 200 }]
    food = getRandomPosition()
    direction = 'left'
    score = 0
    gameInterval = setInterval(update, gameRate)  //开启游戏定时器
    timerId = setInterval(updateTime, 1000)  //每秒更新一次时间
    // setTimeout(generateReward, 5000)
    //随机奖励的位置
    rewardPosition = getRandomPosition()
}

//重新开始游戏
function restartGame() {
    modal.style.display = 'none'  //开始按钮隐藏
    clearInterval(timerId)  //清除时间定时器
    time.innerText = "时间: 00:00"
    isCountiueGame = false
    difficulty = 0
    lastScore = 0
    seconds = 0
    minutes = 0
    score = 0
    intervalGame = gameRate
    startGame()
    openReward = 0
    outRewardTime()
    rewardPosition = getRandomPosition()
}

//分钟数
let minutes = 0
//秒数
let seconds = 0
//奖励计时
let openReward = 0
let closeReward = 0
// 更新游戏时间
function updateTime() {
    seconds += 1
    if (seconds == 60) { //过了60秒 就使分钟加1 秒数清零
        minutes += 1
        seconds = 0
    }
    // 当开启奖励计时的时候 开始计时
    // 当事件达到时 调用奖励函数
    // 生成奖励 同时关闭奖励计时 并清零
    if (isOpenReward == true) {
        openReward++
        console.log(openReward)
        if (openReward == 10) {
            generateReward()
            openReward = 0
        }
    }
    // 当关闭奖励计时的时候 开始计时
    // 当时间达到时 调用关闭奖励事件的函数
    // 同时开启奖励计时 并清零
    if (isOpenReward == false) {
        closeReward++
        console.log(closeReward)
        if (closeReward == 10) {
            outRewardTime()
        }
    }
    time.innerText = `时间: ${formatTime(minutes)}:${formatTime(seconds)}`
}


// 格式化时间 确保显示两位数
function formatTime(time) {
    return time < 10 ? `0${time}` : time
}

//随机生成食物的位置 颜色
function getRandomPosition(color) {
    let foodPosition = {
        x: Math.floor(Math.random() * 20) * 20,
        y: Math.floor(Math.random() * 20) * 20,
        color: color
    }
    //判断食物是否与蛇重叠
    while (isFoodOnSnake(foodPosition)) {
        foodPosition = {
            x: Math.floor(Math.random() * 20) * 20,
            y: Math.floor(Math.random() * 20) * 20,
            color: color
        }
    }
    return foodPosition
}

// 判断食物是否与蛇身重叠
function isFoodOnSnake(position) {
    for (let i = 0; i < snake.length; i++) {
        if (position.x === snake[i].x && position.y === snake[i].y) {
            return true
        }
    }
    return false
}

//  奖励机制
//  是否开启奖励倒计时
let isOpenReward = true
// 获得的奖励
var rewardContent
// 是否添加分数奖励
let isAddScore = false
// 是否添加减速奖励
let isSlow = false
//获得的奖励的位置
var rewardPosition

function generateReward() {
    //  奖励内容
    var rewardArr = ["加分", "减速"];
    var randomIndex = Math.floor(Math.random() * rewardArr.length);
    var randomReward = rewardArr[randomIndex];
    // console.log(randomReward)
    console.log(rewardPosition)
    // rewardPosition = getRandomPosition('#66CC99')
    while (rewardPosition.x == food.x && rewardPosition.y == food.y) {
        rewardPosition = getRandomPosition('#66CC99')
    }
    console.log(rewardPosition)
    if (randomReward == "加分") {

        isAddScore = true
    }
    if (randomReward == "减速") {

        isSlow = true
    }
    isOpenReward = false
}

function outRewardTime() {
    //  清除奖励倒计时清零
    closeReward = 0
    // 打开奖励
    isOpenReward = true
    // 两种奖励选项关闭
    // 相当于清除奖励
    isAddScore = false
    isSlow = false
}


//绘制游戏界面
function draw() {
    gameContainer.innerHTML = ''
    snake.forEach((segament, index) => {
        let snakeSegament = document.createElement('div')
        snakeSegament.style.left = segament.x + 'px'
        snakeSegament.style.top = segament.y + 'px'

        // if (index === 0) {
        //     if (difficulty <= 3) {
        //         snakeSegament.id = 'snakeHead1'
        //     } else if (difficulty >= 4 && difficulty <= 7) {
        //         snakeSegament.id = 'snakeHead2'
        //     } else {
        //         snakeSegament.id = 'snakeHead3'
        //     }

        // } else {
        //     snakeSegament.style.backgroundColor = getRandomSnakeColor()
        // }
        snakeSegament.style.backgroundColor = getRandomSnakeColor()
        snakeSegament.classList.add('snake')
        gameContainer.appendChild(snakeSegament)
    })

    let foodElement = document.createElement('div')
    foodElement.style.left = food.x + 'px'
    foodElement.style.top = food.y + 'px'
    foodElement.style.backgroundColor = food.color
    foodElement.classList.add('food')
    gameContainer.appendChild(foodElement)

    if (isAddScore) {
        let addScoreElement = document.createElement('div')
        addScoreElement.style.left = rewardPosition.x + 'px'
        addScoreElement.style.top = rewardPosition.y + 'px'
        // addScoreElement.style.backgroundColor = '#66CC99'
        addScoreElement.classList.add('addScore')
        gameContainer.appendChild(addScoreElement)
        // isAddScore = false
    }
    if (isSlow) {
        let slowElement = document.createElement('div')
        slowElement.style.left = rewardPosition.x + 'px'
        slowElement.style.top = rewardPosition.y + 'px'
        // slowElement.style.backgroundColor = '#66CCFF'
        slowElement.classList.add('slow')
        gameContainer.appendChild(slowElement)
        // isAddScore = false
    }



}

//随机生成颜色 用于尝试
function getRandomColor() {
    const letters = '0123456789ABCDEF'
    let color = '#'
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
    }
    if (color == '#f0f0f0') { //如果生成棋盘背景颜色 则重新生成
        return getRandomColor()
    }
    return color
}

// 随机食物颜色 
function getRandomFoodColor() {
    const foodcolors = ['red', 'green', 'cyan', 'blue', 'purple', 'pink', 'skyblue', 'limegreen', 'lawngreen', 'deepskyblue', 'pomegranate', 'rose', 'brightorange', 'flameorange', 'goldenrod', 'chartreuse', 'paleturquoise'];
    return foodcolors[Math.floor(Math.random() * foodcolors.length)];
}

//生成蛇颜色 等级提升的时候 改变蛇的颜色
function getRandomSnakeColor() {
    const snakecolors = ['orange', 'crimson', 'gold', 'forestgreen', 'deepskyblue', 'midnightblue', 'orchid', 'coral', 'dodgerblue', 'saddlebrown', 'royalblue'];
    return snakecolors[difficulty]
}

//跟新游戏状态
function update() {
    //获取蛇头的位置
    let head = snake[0]

    //根据移动方向更新蛇头的位置
    switch (direction) {
        case "up":
            head = { x: head.x, y: head.y - 20 }
            break
        case "down":
            head = { x: head.x, y: head.y + 20 }
            break
        case "left":
            head = { x: head.x - 20, y: head.y }
            break
        case "right":
            head = { x: head.x + 20, y: head.y }
            break
    }
    allowChangeDirection = true  //允许再次改变方向

    //将新的蛇头插入到数组的开头
    snake.unshift(head)

    //检查是否吃到食物
    if (head.x === food.x && head.y === food.y) {
        //增加得分
        score += 10
        scoreDisplay.textContent = '得分: ' + score
        //生成新的事物
        food = getRandomPosition(getRandomFoodColor())
    } else if (head.x === rewardPosition.x && head.y === rewardPosition.y && isAddScore == true) {
        //增加得分
        score += 30
        scoreDisplay.textContent = '得分: ' + score
        outRewardTime()
    } else if (head.x === rewardPosition.x && head.y === rewardPosition.y && isSlow == true) {
        //减慢蛇的移动速度
        intervalGame += 10
        clearInterval(gameInterval)
        gameInterval = setInterval(update, intervalGame)
        outRewardTime()
    } else {
        //如果没有吃到食物 则移除蛇尾 保持长度不变
        snake.pop()
    }

    // 检查当前得分是否达到递增条件
    //  每增加100分就增加1游戏难度
    //  速度降到200就不会降了
    if (score % 100 == 0 && score > lastScore && intervalGame > 200) {
        //增加难度等级
        if (difficulty < 10) {  //最高等级为10级
            difficulty += 1
        }
        lastScore = score
        //根据难度调整游戏速度
        intervalGame = gameRate - difficulty * gameRateStep
        clearInterval(gameInterval)
        gameInterval = setInterval(update, intervalGame)
    }


    //检查游戏结束条件
    if (snake.length >= winlen && collision()) {  //当满足游戏胜利条件后 撞到自己身体就会结束游戏
        isGameOver = true
        clearInterval(gameInterval)  //停止游戏循环
        clearInterval(timerId)  //清除时间定时器
        finalScoreDisplay.textContent = score  //显示最终得分
        let winText = document.createElement('p')
        winText.textContent = "恭喜你 获胜了"
        finalScoreDisplay.appendChild(winText)
        modal.style.display = 'block'  //显示游戏结束弹窗
    } else if (head.x < 0 || head.y < 0 || head.x >= 400 || head.y >= 400 || collision()) {
        clearInterval(gameInterval)  //停止游戏循环
        clearInterval(timerId)  //清除时间定时器
        finalScoreDisplay.textContent = score  //显示最终得分
        modal.style.display = 'block'  //显示游戏结束弹窗
        isGameOver = true
    }

    draw()  //重新绘制游戏界面
}



//检查是否与自身碰撞
function collision() {
    let head = snake[0]

    //检查蛇头是否与蛇身任何一部分重叠
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true
        }
    }
    return false
}

//定义一个对象来存储不同按键对应的移动方向
const directonMap = {
    'w': 'up',
    'a': 'left',
    's': 'down',
    'd': 'right',
    'W': 'up',
    'A': 'left',
    'S': 'down',
    'D': 'right',
    'ArrowUp': 'up',
    'ArrowLeft': 'left',
    'ArrowDown': 'down',
    'ArrowRight': 'right'
}

// 获取相反的方向
function oppositeDirection(dir) {
    switch (dir) {
        case 'up':
            return 'down';
        case 'down':
            return 'up';
        case 'left':
            return 'right';
        case 'right':
            return 'left';
        default:
            return '';
    }
}

// 监听键盘按下事件
document.addEventListener('keydown', event => {

    const key = event.key
    if (directonMap.hasOwnProperty(key)) {  //判断按键是否再 directonMap 中
        if (!allowChangeDirection) {  //如果不允许改变方向 则直接返回 不执行后续操作
            return
        }
        event.preventDefault()  //阻止行为
        const newDirection = directonMap[key]
        if (isValidDirection(newDirection)) {
            if (newDirection !== oppositeDirection(direction)) {
                direction = newDirection
                allowChangeDirection = false
                //调用改变方向的方法
                // changeDirection(direction)
            }

        }
    } else if (event.keyCode === 32) {  //点击空格的时候暂停游戏 再次点击的时候继续游戏
        if (isGameOver) {  //当游戏结束的时候 不在监听空格事件
            return
        }

        if (isCountiueGame) {  //为真时开始游戏
            gameInterval = setInterval(update, intervalGame)  //继续游戏
            timerId = setInterval(updateTime, 1000)  //继续计时
            h1Text.textContent = "贪吃蛇小游戏"
        } else {  //为假时暂停游戏
            clearInterval(timerId)  //停止计时
            clearInterval(gameInterval)  //停止游戏循环
            h1Text.textContent = "游戏暂停"
        }
        //每次取反值 确保空格可重复使用
        isCountiueGame = !isCountiueGame

    }
})

//判断方向是否有效
function isValidDirection(newDirection) {
    if ((direction === 'up' || direction === 'down') && (newDirection === 'left' || newDirection === 'right')) {
        return true
    } else if ((direction === 'left' || direction === 'right') && (newDirection === 'up' || newDirection === 'down')) {
        return true
    }
    return false
}

//改变方向的方法  用于验证
function changeDirection(newDirection) {

    console.log('改变的方向为: ' + newDirection)
}

// 在蛇游戏结束后显示的模态框中，点击关闭按钮时刷新页面
const closeModalButton = document.querySelector('.close');
closeModalButton.addEventListener('click', function () {
    location.reload(); // 刷新页面
});
