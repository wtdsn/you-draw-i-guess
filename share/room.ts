export enum statusE {
  // 未开始
  waitingJoin,
  waitingStart,

  // 开始
  newRound,  // 新回合
  skipRound, // 跳过回合
  choosing, // 选择中
  drawing,  // 绘画中
}