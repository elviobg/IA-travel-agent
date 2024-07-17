import { Injectable } from '@nestjs/common';
import { OpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { pull } from 'langchain/hub';
import { WikipediaQueryRun } from '@langchain/community/tools/wikipedia_query_run';
import { DuckDuckGoSearch } from '@langchain/community/tools/duckduckgo_search';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { AgentExecutor, createReactAgent } from 'langchain/agents';
import type { PromptTemplate } from '@langchain/core/prompts';
import { VectorStoreRetriever } from '@langchain/core/vectorstores';

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

  async loadData (country: string): Promise<VectorStoreRetriever<Chroma>> {
    console.log('loading pdf data: '+country);
    const loader = new PDFLoader('data/'+country+'.pdf');
    const docs = await loader.load();
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    
    const embeddings = new OpenAIEmbeddings({openAIApiKey: process.env.OPEN_API_KEY});
    const splitDocs = await textSplitter.splitDocuments(docs);
    const vectorStore = new Chroma(embeddings, {
      collectionName: country+'-embeddings',
    });

    await vectorStore.addDocuments(splitDocs);
    const retriever = vectorStore.asRetriever();
    console.log('data loaded');
    return retriever;
  }

  async getRelevantDocs(retriever, query) {
    console.log('Retrieving information on data');
    const relevantDocs = await retriever.invoke(query);
    console.log('information retrieved')
    return relevantDocs;
  }

  async execute(country: string): Promise<string> {
    const question =
      'Vou viajar para Londres em agosto de 2024. Quero que faça para um roteiro de viagem para mim com eventos que irão ocorrer na data da viagem e com o preço de passagem de São Paulo para Londres.';
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

    const retriever = await this.loadData(country);
    const relevantDocs = await this.getRelevantDocs(retriever, question);
    console.log(relevantDocs);
    return result.output;
  }
}
