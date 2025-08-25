import { Injectable, Inject } from '@nestjs/common';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class ChatroomScheduleService {

  private controlMode: 'auto' | 'manual' = 'auto';
  private manualStatus: boolean = false;

  constructor(
    @Inject(RedisService) private readonly redisService: RedisService,
  ) { }

  /**
   * 获取北京时间
   */
  private getBeijingTime(): Date {
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const beijingTime = new Date(utc + (8 * 3600000)); // 北京时间 UTC+8
    return beijingTime;
  }

  setControlMode(mode: 'auto' | 'manual'): void {
    this.controlMode = mode;
  }

  setManualStatus(status: boolean): void {
    this.manualStatus = status;
  }

  getControlMode(): 'auto' | 'manual' {
    return this.controlMode;
  }

  isChatroomOpen(): boolean {
    if (this.controlMode === 'manual') {
      // 手动控制模式
      return this.manualStatus;
    } else {
      return this.isAutoModeOpen();
    }
  }

  private isAutoModeOpen(): boolean {
    const beijingTime = this.getBeijingTime();
    const currentHour = beijingTime.getHours();
    const currentDay = beijingTime.getDay();

    // 检查是否为工作日（周一到周五）
    const isWeekday = currentDay >= 1 && currentDay <= 5;

    // 检查是否在开放时间内（9:00-18:00）
    const isOpenHours = currentHour >= 9 && currentHour < 18;

    return isWeekday && isOpenHours;
  }

  /**
   * 获取关闭时间戳（毫秒）
   * 返回聊天室关闭的具体时间戳，前端可用于倒计时显示
   */
  getCloseTime(): number | null {
    const isOpen = this.isChatroomOpen();
    const mode = this.controlMode;

    if (!isOpen || mode === 'manual') {
      return null;
    }

    const now = new Date();

    const today = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 10, 0, 0, 0);
    const closeTimestamp = today.getTime();

    return closeTimestamp;
  }
}