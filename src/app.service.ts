import { Injectable } from '@nestjs/common';
import { OpenAI } from '@langchain/openai';
import { pull } from 'langchain/hub';
import { WikipediaQueryRun } from '@langchain/community/tools/wikipedia_query_run';
import { DuckDuckGoSearch } from '@langchain/community/tools/duckduckgo_search';
import { AgentExecutor, createReactAgent } from 'langchain/agents';
import type { PromptTemplate } from '@langchain/core/prompts';
@Injectable()
export class AppService {
  async initChatGPT() {
    return new OpenAI({
      model: 'gpt-3.5-turbo',
      temperature: 0,
      openAIApiKey: process.env.OPEN_API_KEY,
    });
  }

  initTools() {
    const wikipedia = new WikipediaQueryRun({
      topKResults: 1,
      maxDocContentLength: 100,
    });

    const duckduckGoSearch = new DuckDuckGoSearch({ maxResults: 10 });
    return [wikipedia, duckduckGoSearch];
  }

  async initAgent(llm: OpenAI, verbose = false): Promise<AgentExecutor> {
    const tools = this.initTools();
    const prompt = await pull<PromptTemplate>('hwchase17/react');
    const agent = await createReactAgent({
      llm,
      tools,
      prompt,
    });

    const agentExecutor = new AgentExecutor({
      agent,
      tools,
      returnIntermediateSteps: true,
      verbose,
    });

    return agentExecutor;
  }

  async execute(question: string): Promise<string> {
    const llm = await this.initChatGPT();
    const agentExecutor = await this.initAgent(llm);
    const result = await agentExecutor.invoke({
      input: question,
      verbose: true,
    });

    const steps = result.intermediateSteps;
    const logs = steps.map((step) => {
      return {
        tool: step.action.tool,
        toolInput: step.action.toolInput,
        log: step.action.log,
        obs: step.observation,
      };
    });
    console.log(logs);
    return result.output;
  }
}
