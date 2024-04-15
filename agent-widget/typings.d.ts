type InitAgentEvent = MessageEvent<{
  type: 'nvm-agent:init-agent';
  data: {
    accessToken: string;
    neverminedProxyUri: string;
    openAiAssistantId: string;
    did: string;
  };
}>;

type QueryResponseEvent = MessageEvent<{
  type: 'nvm-agent:query-response';
  data: AssistantThread;
}>;

type AssistantResponseEvent = MessageEvent<{
  type: 'nvm-agent:assistant-response';
  data: AssistantThread;
}>;

type StatusEvent = MessageEvent<{ type: 'nvm-agent:status'; data: string | 'top-up' }>;

type AgentQueryResponse = {
  assistantId: string;
  threadId: string;
  messageId: string;
  response: string;
  runId: string;
  runStatus: string;
  tokensUsed: number;
  creditsUsed: number;
};

type AssistantThread = {
  author: 'user' | 'assistant';
  message: string;
  date: Date;
  messageType: 'query' | 'response';
  messageStatus: 'loading' | 'finished' | 'failed';
  queryResponse: AgentQueryResponse;
};
