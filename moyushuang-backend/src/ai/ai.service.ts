import { ChatDeepSeek } from '@langchain/deepseek';
import { TavilySearch } from '@langchain/tavily';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BufferMemory } from 'langchain/memory';
import { ConversationChain } from 'langchain/chains';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private llm: ChatDeepSeek;
  private searchTool: TavilySearch;
  private userMemories: Map<number, BufferMemory> = new Map();

  constructor(private configService: ConfigService) {
    this.initializeServices();
  }

  private initializeServices() {
    try {
      this.llm = new ChatDeepSeek({
        apiKey: this.configService.get<string>('DEEPSEEK_API_KEY'),
        model: 'deepseek-chat',
        temperature: 0.8,
        maxTokens: 200,
      });

      this.searchTool = new TavilySearch({
        tavilyApiKey: this.configService.get<string>('TAVILY_API_KEY'),
        maxResults: 3,
        includeAnswer: true,
        searchDepth: 'basic',
      });

      this.logger.log('AI服务初始化成功');
    } catch (error) {
      this.logger.error('AI服务初始化失败:', error);
    }
  }

  private async searchInfo(query: string): Promise<string> {
    try {
      const result = await this.searchTool.invoke({ query });

      if (typeof result === 'string') {
        return result;
      } else if (result && typeof result === 'object' && 'error' in result) {
        this.logger.error('搜索错误:', result.error);
        return '';
      } else {
        return JSON.stringify(result).substring(0, 500);
      }
    } catch (error) {
      this.logger.error('搜索失败:', error);
      return '';
    }
  }

  getUserMemory(userId: number): BufferMemory {
    if (!this.userMemories.has(userId)) {
      const memory = new BufferMemory({
        memoryKey: 'history',
        returnMessages: true,
      });
      this.userMemories.set(userId, memory);
    }
    return this.userMemories.get(userId) as BufferMemory;
  }

  async generateCatMessage(userId: number, event?: string): Promise<string> {
    try {
      const memory = this.getUserMemory(userId);
      const conversationChain = new ConversationChain({
        llm: this.llm,
        memory: memory,
      });

      const count = Math.random();
      let shouldSearch = false;
      let shouldByTime = false;
      let shouldByEvent = false;
      let eventName = ''
      switch (event) {
        case 'drink':
          eventName = '你在喝水'
          break
        case 'eat':
          eventName = '你在吃饭'
          break
        case 'toilet':
          eventName = '你在上厕所'
          break
        case 'play':
          eventName = '你在玩耍'
          break
        case 'touch':
          eventName = '主人抚摸了你'
          break
        case 'click':
          eventName = '主人点击了你'
          break
      }

      if (eventName && (['你在吃饭', '你在喝水', '主人抚摸了你', '你在上厕所', '你在玩耍'].includes(eventName) || count > 0.6)) {
        shouldByEvent = true;
      } else if (count < 0.3) {
        shouldSearch = true;
      } else if (count < 0.6) {
        shouldByTime = true;
      }
      let searchInfo = '';
      if (shouldSearch) {
        const searchQueries = [
          '今天天气',
          '今日新闻热点',
          '有趣的事实',
          '今天是什么节日',
        ];
        const randomQuery = searchQueries[Math.floor(Math.random() * searchQueries.length)];
        searchInfo = await this.searchInfo(randomQuery);
      }

      let timeInfo = '';
      if (shouldByTime) {
        timeInfo = new Date().toLocaleString();
      }

      const prompt = `
        作为一只可爱有点傲娇的桌面宠物猫咪，你的性格应该显得活泼调皮，你喜欢与你的主人互动。

        ${searchInfo ? `最新信息：${searchInfo}\n\n` : ''}

        请生成一句符合当前时间特点的猫咪话语，要求：
        1. 语气可爱、俏皮
        2. 可以包含猫咪的日常行为或想法
        3. 控制在30字以内
        4. 可以使用一些猫咪的语气词如"喵~"、"呜~"等
        5. 你的回应中不应描绘出你的动作，只需要通过你可爱、有些热闹的语言表达出你的情绪
        6. 根据历史记录进行回复
        7. 用本喵来表达自己，不要带主人这种称谓
        ${searchInfo ? '8. 结合最新信息来给出回复' : ''}
        ${timeInfo ? `8. 基于当前时间${timeInfo}，给出符合当前时间的回复，比如太晚了可以回复想睡觉，到饭点可以回复想吃饭了等等` : ''}
        ${shouldByEvent ? `8. 基于事件${eventName}，给出符合事件的回复` : ''}

        直接回复猫咪的话，不要解释。
      `;

      const response = await conversationChain.call({
        input: prompt,
      });
      return response.response;
    } catch (error) {
      this.logger.error('AI服务调用失败:', error);
      const fallbackMessages = [
        '喵~ 主人在干什么呢？',
        '我想吃小鱼干了~',
        '陪我玩一会儿嘛~',
        '今天天气真好呢！',
        '我要睡觉觉了...',
      ];
      return fallbackMessages[Math.floor(Math.random() * fallbackMessages.length)];
    }
  }

  clearUserMemory(userId: number) {
    const memory = this.userMemories.get(userId);
    if (memory) {
      memory.clear();
    }
  }
}
