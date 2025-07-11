// Log a message to the console to ensure the script is linked correctly
console.log('JavaScript file is linked correctly.');

// 题库，每题有题目、选项和正确答案下标
const questionBank = [
  {
    question: 'What percentage of the Earth’s surface is covered by water?',
    options: ['About 50%', 'About 71%', 'About 90%', 'About 30%'],
    answer: 1
  },
  {
    question: 'Which is the largest source of fresh water on Earth?',
    options: ['Rivers', 'Lakes', 'Glaciers and ice caps', 'Groundwater'],
    answer: 2
  },
  {
    question: 'What is the main cause of water scarcity in many developing countries?',
    options: ['Too much rain', 'Pollution and lack of infrastructure', 'Too many lakes', 'Cold weather'],
    answer: 1
  },
  {
    question: 'How long can a person typically survive without water?',
    options: ['About 3 days', 'About 3 weeks', 'About 3 hours', 'About 3 months'],
    answer: 0
  },
  {
    question: 'What is the process called when water changes from a liquid to a gas?',
    options: ['Condensation', 'Evaporation', 'Precipitation', 'Infiltration'],
    answer: 1
  }
];

// 获取页面元素
const startBtn = document.getElementById('start-btn');
const startPage = document.getElementById('start-page');
const gamePage = document.getElementById('game-page');
const questionTitle = document.getElementById('question');
const optionElements = document.querySelectorAll('.option');
const submitBtn = document.getElementById('submit-btn');
const scoreBox = document.getElementById('score');
const searchingText = document.getElementById('searching-text');
const finishPage = document.getElementById('finish-page');
const gridContainer = document.getElementById('grid-container');

// 获取按钮
const resetPipesBtn = document.getElementById('reset-pipes-btn');
const startWaterBtn = document.getElementById('start-water-btn');
const submitPipesBtn = document.getElementById('submit-pipes-btn');

const totalQuestions = 5; // 题库数量

// 当前分数和当前题目
let score = 0;
let currentQuestion = null;
let selectedOption = null;
let questionsAnswered = 0;
let hasFinished = false; // 标记是否已经进入完成页面

// 难度选择相关
const difficultyBtns = document.querySelectorAll('.difficulty-btn');
let selectedDifficulty = 'easy'; // 默认难度

// 监听难度按钮点击
difficultyBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // 移除所有按钮的选中状态
    difficultyBtns.forEach(b => b.classList.remove('selected'));
    // 当前按钮选中
    btn.classList.add('selected');
    selectedDifficulty = btn.getAttribute('data-level');
  });
});

// 随机显示一道题
function showRandomQuestion() {
  // 随机选一道题
  const randomIndex = Math.floor(Math.random() * questionBank.length);
  currentQuestion = questionBank[randomIndex];
  // 显示题目
  questionTitle.textContent = `Q: ${currentQuestion.question}`;
  // 显示选项
  optionElements.forEach((el, idx) => {
    el.textContent = currentQuestion.options[idx];
    el.classList.remove('selected');
  });
  selectedOption = null;
  questionsAnswered++;
}

// 选项点击事件
optionElements.forEach((el, idx) => {
  el.addEventListener('click', () => {
    // 取消其他选中
    optionElements.forEach(opt => opt.classList.remove('selected'));
    // 当前选中
    el.classList.add('selected');
    selectedOption = idx;
  });
});

// 点击开始按钮，切换到游戏页面并显示题目
startBtn.addEventListener('click', () => {
  startPage.style.display = 'none';
  gamePage.style.display = 'block';
  score = 0;
  scoreBox.textContent = score;
  showRandomQuestion();
  searchingText.textContent = 'Searching for water resources......';
});

// 生成不同难度的网格和障碍物
function generateGrid(difficulty) {
  // 清空原有内容
  gridContainer.innerHTML = '';

  // 根据难度设置行列和障碍物数量
  let cols = 10, rows = 5, obstacles = 3, cellSize = 100, gap = 20;
  if (difficulty === 'easy') {
    cols = 10; rows = 5; obstacles = 3; cellSize = 100; gap = 20;
  } else if (difficulty === 'medium') {
    cols = 20; rows = 10; obstacles = 7; cellSize = 50; gap = 10;
  } else if (difficulty === 'hard') {
    cols = 30; rows = 15; obstacles = 11; cellSize = 40; gap = 7;
  }

  // 设置 CSS grid 属性和单元格大小
  gridContainer.style.display = 'grid';
  gridContainer.style.gridTemplateColumns = `repeat(${cols}, ${cellSize}px)`;
  gridContainer.style.gridTemplateRows = `repeat(${rows}, ${cellSize}px)`;
  gridContainer.style.gap = `${gap}px`;
  gridContainer.style.justifyContent = 'center';
  gridContainer.style.margin = '40px auto 0 auto';
  gridContainer.style.background = '#FFD84D'; // 黄色背景

  const totalCells = cols * rows;

  // 随机放置障碍物（多种图标）
  const obstacleIcons = ['🪨', '⛰️', '🏭', '🌲'];
  let obstacleIndexes = [];
  while (obstacleIndexes.length < obstacles) {
    const idx = Math.floor(Math.random() * totalCells);
    if (!obstacleIndexes.includes(idx)) {
      obstacleIndexes.push(idx);
    }
  }

  // 让水源和房屋距离更远
  // 先随机一个水源位置
  let waterIdx = Math.floor(Math.random() * totalCells);
  let houseIdx;
  // 保证房屋和水源距离足够远（欧几里得距离大于总行列数的1/2）
  do {
    houseIdx = Math.floor(Math.random() * totalCells);
    const waterRow = Math.floor(waterIdx / cols);
    const waterCol = waterIdx % cols;
    const houseRow = Math.floor(houseIdx / cols);
    const houseCol = houseIdx % cols;
    const distance = Math.sqrt(
      Math.pow(waterRow - houseRow, 2) + Math.pow(waterCol - houseCol, 2)
    );
    // 距离要大于 (cols + rows) / 3，且不能和障碍重叠
    if (
      distance > (cols + rows) / 3 &&
      !obstacleIndexes.includes(houseIdx) &&
      !obstacleIndexes.includes(waterIdx) &&
      houseIdx !== waterIdx
    ) {
      break;
    }
  } while (true);

  // 渲染格子
  for (let i = 0; i < totalCells; i++) {
    const cell = document.createElement('div');
    cell.className = 'grid-cell';
    cell.style.width = `${cellSize}px`;
    cell.style.height = `${cellSize}px`;
    cell.style.fontSize = `${cellSize * 0.6}px`;
    cell.style.background = 'rgba(255,255,255,0.15)';

    if (obstacleIndexes.includes(i)) {
      cell.classList.add('obstacle');
      // 随机选择一个障碍物图标
      const icon = obstacleIcons[Math.floor(Math.random() * obstacleIcons.length)];
      cell.textContent = icon;
    } else if (i === waterIdx) {
      cell.classList.add('water');
      cell.textContent = '💧';
    } else if (i === houseIdx) {
      cell.classList.add('house');
      cell.textContent = '🏠';
    }
    gridContainer.appendChild(cell);
  }
}

// 提交按钮事件（答题页面的“Submit”按钮）
submitBtn.addEventListener('click', () => {
  // 如果没有选择选项，提示玩家
  if (selectedOption === null) {
    alert('Please select an option!');
    return;
  }

  // 判断答案是否正确
  if (selectedOption === currentQuestion.answer) {
    // 答对了，加分并显示彩带
    score += 50;
    scoreBox.textContent = score;
    showConfetti();
    searchingText.textContent = "🎉 Congratulation! You've found a clean water source! Let's send it to the villages that need it!";

    // 2秒后切换到第三页（finishPage）
    setTimeout(() => {
      if (!hasFinished) {
        hasFinished = true;
        gamePage.style.display = 'none'; // 隐藏答题页
        finishPage.style.display = 'flex'; // 显示第三页（管道页）
        startPage.style.display = 'none';  // 隐藏第一页
        generateGrid(selectedDifficulty); // 生成对应难度的网格
        createPipePieces(); // 生成管道图片

        // 用 template literals 设置分数栏内容
        const finishScoreBox = document.querySelector('#finish-page #score-box span');
        if (finishScoreBox) {
          finishScoreBox.textContent = score;
        }
      }
    }, 2000);
  } else {
    // 答错了，扣分并提示
    score -= 10;
    scoreBox.textContent = score;
    searchingText.textContent = "Oops! That's a dirty water source. Let's keep searching!";
    // 2秒后进入下一题
    setTimeout(() => {
      searchingText.textContent = 'Searching for water resources......';
      showRandomQuestion();
    }, 2000);
  }
});

// 简单的 confetti 效果（彩带动画，适合初学者）
function showConfetti() {
  for (let i = 0; i < 30; i++) {
    const confetti = document.createElement('div');
    confetti.textContent = '🎊';
    confetti.style.position = 'fixed';
    confetti.style.left = `${Math.random() * 100}vw`;
    confetti.style.top = '-40px';
    confetti.style.fontSize = '2rem';
    confetti.style.pointerEvents = 'none';
    confetti.style.transition = 'top 1.5s linear';
    document.body.appendChild(confetti);

    // 让彩带下落
    setTimeout(() => {
      confetti.style.top = `${60 + Math.random() * 30}vh`;
    }, 10);

    // 1.6秒后移除
    setTimeout(() => {
      confetti.remove();
    }, 1600);
  }
}

// === 管道拖拽部分（初学者友好）===

// 1. 创建管道容器和管道图片
// 放大管道图片
function createPipePieces() {
  const pipeContainer = document.getElementById('pipe-container');
  pipeContainer.innerHTML = '';

  // 生成 pipe1.png 到 pipe10.png，每个图片更大
  for (let i = 1; i <= 10; i++) {
    const pipeDiv = document.createElement('div');
    pipeDiv.className = 'pipe-piece';
    pipeDiv.setAttribute('draggable', 'true');
    pipeDiv.setAttribute('data-type', `pipe${i}`);

    const img = document.createElement('img');
    img.src = `img/pipe${i}.png`;
    img.alt = `pipe${i}`;
    img.style.width = '50px';
    img.style.height = '50px';

    pipeDiv.appendChild(img);
    pipeContainer.appendChild(pipeDiv);
  }

  // 绑定拖拽事件
  const pipePieces = document.querySelectorAll('.pipe-piece');
  pipePieces.forEach(pipe => {
    pipe.addEventListener('dragstart', (e) => {
      draggedPipeType = pipe.getAttribute('data-type');
      draggedPipeImg = pipe.querySelector('img').src;
    });
  });
}

// 2. 拖拽逻辑保持不变
let draggedPipeType = null;
let draggedPipeImg = null;

gridContainer.addEventListener('dragover', (e) => {
  e.preventDefault();
});

gridContainer.addEventListener('drop', (e) => {
  const target = document.elementFromPoint(e.clientX, e.clientY);
  if (target && target.classList.contains('grid-cell')) {
    target.textContent = '';
    target.innerHTML = '';
    if (draggedPipeImg) {
      const img = document.createElement('img');
      img.src = draggedPipeImg;
      img.alt = draggedPipeType;
      img.style.width = '50px';
      img.style.height = '50px';
      target.appendChild(img);
      target.setAttribute('data-pipe', draggedPipeType);
    }
  }
});

// === Start供水按钮功能 ===
let lastAddScore = 0; // 记录上次加的分数，便于reset时扣除

startWaterBtn.addEventListener('click', () => {
  // 播放水流音效
  const audio = new Audio('running-stream-water-sound-239612.mp3');
  audio.play();
  window.currentAudio = audio; // 方便reset时关闭

  // 找到所有格子
  const cells = Array.from(gridContainer.querySelectorAll('.grid-cell'));
  // 找到水源和房屋的位置
  const waterIdx = cells.findIndex(cell => cell.classList.contains('water'));
  const houseIdx = cells.findIndex(cell => cell.classList.contains('house'));

  // 1. 先将所有已放置管道的格子背景变为蓝色
  cells.forEach(cell => {
    if (cell.querySelector('img')) {
      cell.style.background = '#2E9DF7';
    }
  });

  // 2. 检查是否所有蓝色格子连通了水源和房屋
  function isConnected() {
    const cols = gridContainer.style.gridTemplateColumns.split(' ').length;
    const total = cells.length;
    const visited = new Array(total).fill(false);
    const queue = [];
    queue.push(waterIdx);
    visited[waterIdx] = true;

    while (queue.length > 0) {
      const idx = queue.shift();
      if (idx === houseIdx) return true;
      const neighbors = [];
      if (idx - cols >= 0) neighbors.push(idx - cols);
      if (idx + cols < total) neighbors.push(idx + cols);
      if (idx % cols !== 0) neighbors.push(idx - 1);
      if ((idx + 1) % cols !== 0) neighbors.push(idx + 1);

      neighbors.forEach(nIdx => {
        if (!visited[nIdx]) {
          if (
            cells[nIdx].querySelector('img') ||
            cells[nIdx].classList.contains('house')
          ) {
            visited[nIdx] = true;
            queue.push(nIdx);
          }
        }
      });
    }
    return false;
  }

  // 3. 判断连通并加分
  lastAddScore = 0; // 重置
  if (isConnected()) {
    if (selectedDifficulty === 'easy') {
      lastAddScore = 50;
    } else if (selectedDifficulty === 'medium') {
      lastAddScore = 100;
    } else if (selectedDifficulty === 'hard') {
      lastAddScore = 150;
    }
    score += lastAddScore;

    // 更新分数栏
    const scoreBox = document.querySelectorAll('#finish-page #score-box span')[0];
    if (scoreBox) {
      scoreBox.textContent = score;
    }
    alert(`Success! +${lastAddScore} points!`);
  } else {
    alert('The pipes are not connected from the water source to the village!');
  }
});

// === Recreate（重置）按钮功能 ===
resetPipesBtn.addEventListener('click', () => {
  const cells = gridContainer.querySelectorAll('.grid-cell');
  // 先将所有有管道的格子变蓝
  cells.forEach(cell => {
    if (cell.querySelector('img')) {
      cell.style.background = '#2E9DF7';
    }
  });
  // 再延迟一点时间变回黄色并清除管道
  setTimeout(() => {
    cells.forEach(cell => {
      if (
        !cell.classList.contains('obstacle') &&
        !cell.classList.contains('water') &&
        !cell.classList.contains('house')
      ) {
        cell.textContent = '';
        cell.innerHTML = '';
        cell.removeAttribute('data-pipe');
        cell.style.color = '';
        cell.style.fontWeight = '';
        cell.style.background = 'rgba(255,255,255,0.15)'; // 恢复初始背景
      }
    });
  }, 300);

  // 停止音乐
  if (window.currentAudio) {
    window.currentAudio.pause();
    window.currentAudio.currentTime = 0;
  }

  // 扣除上次加的分数
  if (lastAddScore > 0) {
    score -= lastAddScore;
    lastAddScore = 0;
    const scoreBox = document.querySelectorAll('#finish-page #score-box span')[0];
    if (scoreBox) {
      scoreBox.textContent = score;
    }
  }
});

// === Submit按钮功能：只要放置了管道就加分 ===
submitPipesBtn.addEventListener('click', () => {
  // 关闭背景音乐
  if (window.currentAudio) {
    window.currentAudio.pause();
    window.currentAudio.currentTime = 0;
  }

  // 检查是否有管道被放置
  const cells = gridContainer.querySelectorAll('.grid-cell');
  let hasPipe = false;
  cells.forEach(cell => {
    // 检查格子里是否有img标签（即有管道）
    if (cell.querySelector('img')) {
      hasPipe = true;
    }
  });

  // 只要有管道就加分
  if (hasPipe) {
    let bonus = 0;
    if (selectedDifficulty === 'easy') {
      bonus = 50;
    } else if (selectedDifficulty === 'medium') {
      bonus = 100;
    } else if (selectedDifficulty === 'hard') {
      bonus = 150;
    }
    score += bonus;
    lastAddScore = bonus; // 记录本次加分，方便reset时扣除

    // 更新分数栏（右上角）
    const scoreBox = document.querySelectorAll('#finish-page #score-box span')[0];
    if (scoreBox) {
      scoreBox.textContent = score;
    }

    alert(`Great job! +${bonus} points for placing pipes!`);
    // 跳转到最后一页（假设有 showSuccessPage 函数）
    finishPage.style.display = 'none';
    showSuccessPage();
  } else {
    alert('Please place at least one pipe on the grid before submitting!');
    return;
  }
});

function showSuccessPage() {
  // 检查页面是否已存在，避免重复创建
  let successPage = document.getElementById('success-page');
  if (!successPage) {
    // 创建成功页面容器
    successPage = document.createElement('div');
    successPage.id = 'success-page';
    successPage.style.position = 'fixed';
    successPage.style.top = '0';
    successPage.style.left = '0';
    successPage.style.width = '100vw';
    successPage.style.height = '100vh';
    successPage.style.background = '#2E9DF7';
    successPage.style.zIndex = '9999';
    successPage.style.display = 'flex';
    successPage.style.flexDirection = 'column';
    successPage.style.alignItems = 'center';
    successPage.style.justifyContent = 'center';

    // logo
    const logo = document.createElement('img');
    logo.src = 'img/cw_logo_horizontal.png';
    logo.alt = 'Charity: water logo';
    logo.style.position = 'fixed';
    logo.style.top = '32px';
    logo.style.left = '32px';
    logo.style.height = '38px';
    logo.style.width = 'auto';
    logo.style.zIndex = '10000';
    successPage.appendChild(logo);

    // 感谢文字
    const msg = document.createElement('div');
    msg.textContent = 'Thank you for successfully delivering the water to the villages in need!';
    msg.style.color = '#FFD84D';
    msg.style.fontSize = '2.2rem';
    msg.style.fontWeight = 'bold';
    msg.style.marginTop = '120px';
    msg.style.textAlign = 'center';
    msg.style.textShadow = '1px 1px 8px #222';
    successPage.appendChild(msg);

    // charity: water 链接提示
    const joinDiv = document.createElement('div');
    joinDiv.style.background = '#FFD84D';
    joinDiv.style.color = '#2E9DF7';
    joinDiv.style.fontSize = '1.4rem';
    joinDiv.style.fontWeight = 'bold';
    joinDiv.style.padding = '18px 32px';
    joinDiv.style.borderRadius = '12px';
    joinDiv.style.marginTop = '32px';
    joinDiv.style.textAlign = 'center';
    joinDiv.innerHTML = `Click the link to learn more about <a href="https://www.charitywater.org/" target="_blank" style="color:#2E9DF7;text-decoration:underline;font-weight:bold;">charity: Water!</a>`;
    successPage.appendChild(joinDiv);

    // 按钮区
    const btnDiv = document.createElement('div');
    btnDiv.style.display = 'flex';
    btnDiv.style.gap = '32px';
    btnDiv.style.marginTop = '40px';

    // End Game 按钮
    const endBtn = document.createElement('button');
    endBtn.textContent = 'End Game';
    endBtn.style.background = '#FFC907';
    endBtn.style.color = '#2E9DF7';
    endBtn.style.fontSize = '1.3rem';
    endBtn.style.fontWeight = 'bold';
    endBtn.style.padding = '12px 36px';
    endBtn.style.border = 'none';
    endBtn.style.borderRadius = '10px';
    endBtn.style.cursor = 'pointer';
    endBtn.style.transition = 'all 0.2s';
    endBtn.onmousedown = () => endBtn.style.transform = 'scale(1.12)';
    endBtn.onmouseup = () => endBtn.style.transform = 'scale(1)';
    endBtn.onmouseleave = () => endBtn.style.transform = 'scale(1)';
    endBtn.onclick = () => {
      // 结束游戏，关闭页面（部分浏览器可能不允许关闭）
      window.close();
      // 如果关闭失败，则隐藏页面
      successPage.style.display = 'none';
    };

    // Restart 按钮
    const restartBtn = document.createElement('button');
    restartBtn.textContent = 'Restart';
    restartBtn.style.background = '#FFC907';
    restartBtn.style.color = '#2E9DF7';
    restartBtn.style.fontSize = '1.3rem';
    restartBtn.style.fontWeight = 'bold';
    restartBtn.style.padding = '12px 36px';
    restartBtn.style.border = 'none';
    restartBtn.style.borderRadius = '10px';
    restartBtn.style.cursor = 'pointer';
    restartBtn.style.transition = 'all 0.2s';
    restartBtn.onmousedown = () => restartBtn.style.transform = 'scale(1.12)';
    restartBtn.onmouseup = () => restartBtn.style.transform = 'scale(1)';
    restartBtn.onmouseleave = () => restartBtn.style.transform = 'scale(1)';
    restartBtn.onclick = () => {
      // 返回首页
      successPage.style.display = 'none';
      startPage.style.display = 'flex';
      // 可选：重置分数
      score = 0;
      const scoreBox = document.querySelectorAll('#finish-page #score-box span')[0];
      if (scoreBox) {
        scoreBox.textContent = score;
      }
      hasFinished = false;
    };

    btnDiv.appendChild(endBtn);
    btnDiv.appendChild(restartBtn);
    successPage.appendChild(btnDiv);

    document.body.appendChild(successPage);
  } else {
    successPage.style.display = 'flex';
  }
}
