// 路由表
import { lazy } from 'react';
// import type { RouteObject } from 'react-router-dom';

export type Meta = { title?: string; icon?: string; hidden?: boolean };
export type AppRouteObject = {
  path?: string;
  index?: true;
  element?: React.ReactNode;
  children?: AppRouteObject[];
  meta?: Meta;
};

const Home = lazy(() => import('@/pages/Home'));
const TicTacToe = lazy(() => import('@/pages/TicTacToe'));
const Game2048 = lazy(() => import('@/pages/Game2048'));
const GreedySnake = lazy(() => import('@/pages/GreedySnake'));

export const routes: AppRouteObject[] = [
  {
    path: '/',
    element: <Home />,
    meta: { title: '首页' },
  },
  {
    path: '/games',
    children: [
      {
        path: 'tictactoe',
        element: <TicTacToe />,
        meta: { title: '井字棋' },
      },
      {
        path: '2048',
        element: <Game2048 />,
        meta: { title: '2048' },
      },
      {
        path: 'greedysnake',
        element: <GreedySnake />,
        meta: { title: '贪吃蛇' },
      },
    ],
  },
  { path: '*', element: <div className="p-10">404 Not Found</div> },
];

// 给首页生成“游戏列表”用：把 /games 下的展示项导出成一份扁平数组
export const gameEntries = (routes.find((r) => r.path === '/games')?.children ?? [])
  .filter((r) => !(r as AppRouteObject).meta?.hidden)
  .map((r) => {
    const rr = r as AppRouteObject;
    const { index, path, meta } = rr;
    const base = '/games';
    // rr.index 说明是 index 路由；否则把子 path 去掉可能的前导斜杠再拼上
    const full = index ? base : `${base}/${String(path ?? '').replace(/^\/+/, '')}`;

    return {
      path: full,
      title: meta?.title || '未命名',
    };
  });
