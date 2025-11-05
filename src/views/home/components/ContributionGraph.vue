<template>
  <div class="contribution-graph">
    <!-- <h4>年度贡献图</h4> -->
    <div class="graph-container">
      <div class="months-header">
        <div
          class="month"
          v-for="month in months"
          :key="month.name"
          :style="{ gridColumnStart: month.start }"
        >
          {{ month.name }}
        </div>
      </div>
      <div class="days-grid">
        <div class="day-label">Mon</div>
        <div class="day-label">Wed</div>
        <div class="day-label">Fri</div>
        <div
          v-for="day in contributionData"
          :key="day.date"
          class="day-square"
          :class="{ 'snake-part': day.isSnake }"
          :style="{
            backgroundColor: getColor(day),
            gridRowStart: day.dayOfWeek,
            gridColumnStart: day.weekOfYear + 1,
          }"
          :data-tooltip="`${day.count} contributions on ${day.date}`"
        ></div>
      </div>
    </div>
    <div class="legend">
      <span>Less</span>
      <div class="day-square" :style="{ backgroundColor: colors[0] }"></div>
      <div class="day-square" :style="{ backgroundColor: colors[1] }"></div>
      <div class="day-square" :style="{ backgroundColor: colors[2] }"></div>
      <div class="day-square" :style="{ backgroundColor: colors[3] }"></div>
      <div class="day-square" :style="{ backgroundColor: colors[4] }"></div>
      <span>More</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface ContributionDay {
  date: string
  count: number
  dayOfWeek: number
  weekOfYear: number
  isSnake: boolean // 新增：标记是否为小蛇身体的一部分
}

interface MonthHeader {
  name: string
  start: number
}

const contributionData = ref<ContributionDay[]>([])
const months = ref<MonthHeader[]>([])

const colors = [
  'rgba(255, 255, 255, 0.4)', // 接近透明
  'rgba(64, 196, 99, 0.3)', // 浅绿半透明
  'rgba(48, 161, 78, 0.6)', // 中绿半透明
  'rgba(33, 110, 57, 0.8)', // 深绿半透明
  'rgba(33, 110, 57, 1)', // 实色深绿
]

const snakeColors = [
  'rgba(255, 182, 193, 0.9)', // 蛇头
  'rgba(255, 198, 182, 0.83)',
  'rgba(255, 214, 182, 0.76)',
  'rgba(255, 229, 182, 0.7)',
  'rgba(255, 240, 200, 0.63)',
  'rgba(255, 250, 220, 0.56)',
  'rgba(255, 253, 245, 0.5)', // 蛇尾
]

const getColor = (day: ContributionDay): string => {
  if (day.isSnake) {
    const snakePartIndex = snake.value.findIndex(
      (part) => part.x === day.weekOfYear && part.y === day.dayOfWeek,
    )
    if (snakePartIndex !== -1 && snakePartIndex < snakeColors.length) {
      return snakeColors[snakePartIndex]
    }
    return snakeColors[snakeColors.length - 1] // 默认返回最透明的蛇身颜色
  }
  const count = day.count
  if (count === 0) return colors[0]
  if (count < 3) return colors[1]
  if (count < 6) return colors[2]
  if (count < 10) return colors[3]
  return colors[4]
}

const generateData = () => {
  const data: ContributionDay[] = []
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]
  const today = new Date()
  const endDate = new Date(today)
  const startDate = new Date(today)
  startDate.setDate(startDate.getDate() - 365)

  let currentWeek = 0
  const monthHeaders: MonthHeader[] = []
  let lastMonth = -1

  // Find the first Sunday to align the grid
  const dayOffset = startDate.getDay()
  startDate.setDate(startDate.getDate() - dayOffset)

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dayOfWeek = d.getDay() // 0=Sun, 1=Mon, ..., 6=Sat

    if (dayOfWeek === 0) {
      // Start of a new week (Sunday)
      currentWeek++
    }

    if (d.getMonth() !== lastMonth) {
      lastMonth = d.getMonth()
      monthHeaders.push({ name: monthNames[lastMonth], start: currentWeek })
    }

    data.push({
      date: new Date(d.getFullYear(), d.getMonth(), d.getDate()).toLocaleDateString('en-CA'), // 使用 'en-CA' 格式 (YYYY-MM-DD)
      count: 0, // Temporarily set to 0 until API is ready
      dayOfWeek: dayOfWeek + 1, // CSS grid-row starts at 1
      weekOfYear: currentWeek,
      isSnake: false,
    })
  }

  contributionData.value = data
  months.value = monthHeaders
}

const snake = ref<{ x: number; y: number }[]>([]) // 小蛇的身体，存储坐标
const snakeLength = 7 // 小蛇的长度
let gameInterval: number | undefined // 游戏循环的定时器

// --- 小蛇逻辑 ---

// 将 contributionData 转换为一个二维网格以便于访问
const getGrid = (): (ContributionDay | undefined)[][] => {
  const grid: (ContributionDay | undefined)[][] = Array(54)
    .fill(null)
    .map(() => Array(8).fill(undefined))
  contributionData.value.forEach((day) => {
    if (day) {
      grid[day.weekOfYear] = grid[day.weekOfYear] || []
      grid[day.weekOfYear][day.dayOfWeek] = day
    }
  })
  return grid
}

const initializeSnake = () => {
  const emptyCells = contributionData.value.filter((day) => day.count === 0)
  if (emptyCells.length === 0) return

  const startCell = emptyCells[Math.floor(Math.random() * emptyCells.length)]
  const startPos = { x: startCell.weekOfYear, y: startCell.dayOfWeek }

  snake.value = [startPos]
  startCell.isSnake = true
}

const moveSnake = () => {
  if (snake.value.length === 0) return

  const head = snake.value[0]
  const grid = getGrid()

  const possibleMoves: { x: number; y: number }[] = []
  const directions = [
    { x: 0, y: 1 },
    { x: 0, y: -1 },
    { x: 1, y: 0 },
    { x: -1, y: 0 },
  ]

  for (const dir of directions) {
    const nextX = head.x + dir.x
    const nextY = head.y + dir.y

    // 检查边界和是否为空格子
    if (nextX > 0 && nextX < 54 && nextY > 0 && nextY < 8) {
      const nextCell = grid[nextX] && grid[nextX][nextY]
      if (
        nextCell &&
        nextCell.count === 0 &&
        !snake.value.some((p) => p.x === nextX && p.y === nextY)
      ) {
        possibleMoves.push({ x: nextX, y: nextY })
      }
    }
  }

  if (possibleMoves.length > 0) {
    const nextMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)]

    // 移动蛇
    snake.value.unshift(nextMove)
    const newHeadCell = grid[nextMove.x][nextMove.y]
    if (newHeadCell) newHeadCell.isSnake = true

    // 如果蛇变长了，则移除尾巴
    if (snake.value.length > snakeLength) {
      const tail = snake.value.pop()
      if (tail) {
        const oldTailCell = grid[tail.x][tail.y]
        if (oldTailCell) oldTailCell.isSnake = false
      }
    }
  } else {
    // 如果无路可走，重置小蛇
    snake.value.forEach((part) => {
      const cell = grid[part.x][part.y]
      if (cell) cell.isSnake = false
    })
    initializeSnake()
  }
}

onMounted(() => {
  generateData()
  initializeSnake()
  gameInterval = window.setInterval(moveSnake, 300)
})

onUnmounted(() => {
  if (gameInterval) {
    clearInterval(gameInterval)
  }
})
</script>

<style lang="scss" scoped>
.contribution-graph {
  border-radius: 6px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  container-type: inline-size;
  display: flex;
  flex-direction: column;

  // 基于容器宽度的响应式单位 (cqw = container query width)
  // 计算：容器宽度 / (53列 + 标签宽度 + 间距) ≈ 1.5cqw
  --cell-size: clamp(8px, 1.3cqw, 25px);
  --cell-gap: clamp(3px, 0.5cqw, 6px);
  --label-width: clamp(20px, 3cqw, 40px);
  --font-size-small: clamp(8px, 1cqw, 13px);
  --font-size-medium: clamp(9px, 1.1cqw, 14px);

  h4 {
    font-size: 14px;
    margin: 0 0 10px 0;
    color: #444;
    font-weight: 600;
  }

  .graph-container {
    display: block;
    position: relative;
    width: 100%;
  }

  .months-header {
    display: grid;
    grid-template-columns: repeat(53, var(--cell-size));
    grid-gap: var(--cell-gap);
    margin-bottom: 5px;
    padding-left: var(--label-width);
    font-size: var(--font-size-small);
    color: #555;
    .month {
      grid-column-end: span 4;
    }
  }

  .days-grid {
    display: grid;
    grid-template-columns: var(--label-width) repeat(53, var(--cell-size));
    grid-template-rows: repeat(7, var(--cell-size));
    grid-auto-flow: column;
    grid-gap: var(--cell-gap);

    .day-label {
      font-size: var(--font-size-small);
      color: #555;
      grid-column: 1;
      text-align: left;
      display: flex;
      align-items: center;
      &:nth-child(1) {
        grid-row: 2;
      }
      &:nth-child(2) {
        grid-row: 4;
      }
      &:nth-child(3) {
        grid-row: 6;
      }
    }

    .day-square {
      width: var(--cell-size);
      height: var(--cell-size);
      border: 1px solid rgba(255, 255, 255, 0.1);
      background-color: rgba(255, 255, 255, 0.15);
      border-radius: 2px;
      position: relative;

      &:hover::after {
        content: attr(data-tooltip);
        position: absolute;
        bottom: 120%;
        left: 50%;
        transform: translateX(-50%);
        background-color: #333;
        color: #fff;
        padding: 5px 8px;
        border-radius: 4px;
        font-size: var(--font-size-medium);
        white-space: nowrap;
        z-index: 10;
      }
    }
  }

  .legend {
    margin-top: 10px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    font-size: var(--font-size-medium);
    color: #555;

    span {
      margin: 0 5px;
    }
    .day-square {
      width: var(--cell-size);
      height: var(--cell-size);
      background-color: #ebedf0;
      border-radius: 2px;
      margin: 0 2px;
    }
  }
}
</style>
