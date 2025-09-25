import { type Board, type Dir, SIZE } from './types';

/**
 *  创建一个空棋盘
 * @returns 生成一个空的 2048 游戏棋盘，返回一个 4x4 的二维数组，所有元素初始化为 0
 */

export const createEmptyBoard = (): Board =>
  Array.from({ length: SIZE }, () => Array(SIZE).fill(0));

/**
 * 在给定棋盘中，找出所有空格(值为 0)的位置，并随机返回其中一个坐标
 * 用途：用于在随机位置生成一个新数字（2 或 4）
 * @param b 棋盘
 * @returns 如果有空格，返回一个随机空格的坐标 [行, 列]；如果没有空格，返回 null
 */
export const randomEmptyCell = (b: Board): { board: Board; cell: [number, number] | null } => {
  // 收集所有空格的位置
  const emptyCells: [number, number][] = [];
  // 双重扫描棋盘
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (b[r][c] === 0) {
        emptyCells.push([r, c]);
      }
    }
  }
  if (emptyCells.length === 0) return { board: b, cell: null }; // 没有空格了
  // 随机选择一个空格位置
  const randomIndex = Math.floor(Math.random() * emptyCells.length);

  //   return emptyCells[randomIndex];
  return { board: b, cell: emptyCells[randomIndex] };
};

/**
 * 在棋盘的一个随机空格位置生成一个新数字（2 或 4）
 * @param b 棋盘
 * @return 返回一个新的棋盘对象，原棋盘不变
 */
export const generateNewNumber = (b: Board): { board: Board; newPoints: [number, number] } => {
  const newBoard = b.map((row) => [...row]); // 深拷贝棋盘
  const { cell } = randomEmptyCell(newBoard);
  if (cell) {
    const [r, c] = cell;
    // 90% 概率生成 2，10% 概率生成 4
    newBoard[r][c] = Math.random() < 0.9 ? 2 : 4;
  }
  return { board: newBoard, newPoints: cell ? cell : [-1, -1] };
};

/**
 * 生成开局棋盘，包含两个随机数字
 * @return 返回一个新的棋盘对象，包含两个随机生成的数字
 */
export const initializeBoard = (): Board => {
  let board = createEmptyBoard();
  board = generateNewNumber(board).board;
  board = generateNewNumber(board).board;
  return board;
};

/**
 * 比较两个一维数组是否相等
 */
const arraysEqual = (a: number[], b: number[]): boolean => {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};

/**
 * 将一维数组向左移动并合并相同数字
 */
const slideAndMergeLineLeft = (
  line: number[]
): { line: number[]; merged: boolean; gained: number; mergedCols: number[] } => {
  // 过滤掉所有的 0
  const filtered = line.filter((num) => num !== 0);
  // 合并相同的数字，从左到右遍历，遇到相同的数字就合并，但是只合并一次
  const mergedLine: number[] = [];
  let gained = 0;
  const mergedCols: number[] = []; // ← 新增：记录合并发生在哪些“输出列”
  for (let i = 0; i < filtered.length; i++) {
    if (filtered[i] === filtered[i + 1] && i + 1 < filtered.length) {
      const v = filtered[i] * 2;
      mergedLine.push(v);
      gained += v; // 合并产出的新砖的值即为本次得分
      mergedCols.push(mergedLine.length - 1); // 注意是“输出行”的列索引
      i++; // 跳过下一个数字，因为已经合并过了
    } else {
      mergedLine.push(filtered[i]);
    }
  }
  // 补齐 0 到原来的长度
  while (mergedLine.length < SIZE) {
    mergedLine.push(0);
  }
  // 标明是否合并过
  const merged = !arraysEqual(line, mergedLine);

  return { line: mergedLine, merged, gained, mergedCols };
};

/**
 * 将棋盘向左移动并合并相同数字
 * @param b 棋盘
 * @returns 返回一个新的棋盘对象和一个布尔值，表示是否有任何格子发生了变化
 */
export const moveBoardLeft = (
  b: Board
): { board: Board; moved: boolean; gained: number; merges: Array<{ r: number; c: number }> } => {
  const newBoard: Board = [];
  let anyMoved = false;
  let totalGained = 0;
  const merges: Array<{ r: number; c: number }> = [];
  for (let r = 0; r < SIZE; r++) {
    const { line: newLine, merged, gained, mergedCols } = slideAndMergeLineLeft(b[r]);
    newBoard.push(newLine);
    if (merged) anyMoved = true;
    totalGained += gained;
    // 把本行的合并列，映射成“整盘绝对坐标”
    for (const c of mergedCols) merges.push({ r, c });
  }

  return { board: newBoard, moved: anyMoved, gained: totalGained, merges };
};

export const hasMovesAvailable = (b: Board): boolean => {
  // 检查是否有空格
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (b[r][c] === 0) return true;
    }
  }
  // 检查水平和垂直方向是否有相邻相同的数字
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE - 1; c++) {
      if (b[r][c] === b[r][c + 1]) return true; // 水平相邻
      if (b[c][r] === b[c + 1][r]) return true; // 垂直相邻
    }
  }
  return false;
};

/**
 * 转置棋盘矩阵（行列互换）
 * @param b 棋盘
 * @returns 返回一个新的转置后的棋盘对象
 */
export const transposeBoard = (b: Board): Board => {
  const newBoard: Board = createEmptyBoard();
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      newBoard[c][r] = b[r][c];
    }
  }
  return newBoard;
};

/**
 * 将棋盘的每一行反转（左右翻转）
 * @param b 棋盘
 * @returns 返回一个新的反转后的棋盘对象
 */
export const reversRows = (b: Board): Board => {
  return b.map((row) => [...row].reverse());
};

/**
 * 辅助：坐标转换
 */
function transposeCoord(rc: { r: number; c: number }): { r: number; c: number } {
  return { r: rc.c, c: rc.r };
}
function reverseRowCoord(rc: { r: number; c: number }): { r: number; c: number } {
  return { r: rc.r, c: SIZE - 1 - rc.c };
}

/**
 * 将棋盘向指定方向移动并合并相同数字
 * @param b
 * @param Dir
 * @returns
 */
export const moveBoard = (
  b: Board,
  Dir: Dir
): { board: Board; moved: boolean; gained: number; merges: Array<{ r: number; c: number }> } => {
  switch (Dir) {
    case 'left':
      return moveBoardLeft(b);
    case 'right': {
      const reversed = reversRows(b);
      const { board: movedBoard, moved, gained, merges } = moveBoardLeft(reversed);
      return { board: reversRows(movedBoard), moved, gained, merges: merges.map(reverseRowCoord) };
    }
    case 'up': {
      const transposed = transposeBoard(b);
      const { board: movedBoard, moved, gained, merges } = moveBoardLeft(transposed);
      return {
        board: transposeBoard(movedBoard),
        moved,
        gained,
        merges: merges.map(transposeCoord),
      };
    }
    case 'down': {
      const transposed = transposeBoard(b);
      const reversed = reversRows(transposed);
      const { board: movedBoard, moved, gained, merges } = moveBoardLeft(reversed);
      return {
        board: transposeBoard(reversRows(movedBoard)),
        moved,
        gained,
        merges: merges.map((rc) => reverseRowCoord(transposeCoord(rc))),
      };
    }
    default:
      return { board: b, moved: false, gained: 0, merges: [] };
  }
};

/**使用localStorage存储和读取bestScore */
const LS_BEST = '2048_BEST_SCORE';
/**
 *
 * @returns 获取本地存储中的最高分数
 */
export const getBestScore = (): number => {
  const v = localStorage.getItem(LS_BEST);
  return v ? parseInt(v) : 0;
};
/**
 * 设置本地存储中的最高分数（如果当前分数更高）
 * @param score 当前分数
 */
export const saveBestScore = (score: number) => {
  const best = getBestScore();
  if (score > best) {
    localStorage.setItem(LS_BEST, score.toString());
  }
};
