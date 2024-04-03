import React, { useEffect, useRef, useState } from 'react';
import './agent.scss';

const insertWidgetScriptBefore = (
  srcFile: string,
  insertBeforeElement: HTMLElement
) => {
  const selector = `script[src='${srcFile}']`;

  if (document.querySelectorAll(selector).length > 0) {
    return;
  }

  const script = document.createElement('script');
  script.src = srcFile;
  script.defer = true;

  insertBeforeElement.parentNode?.insertBefore(script, insertBeforeElement);
};

export const Agent = () => {
  const [thread, setThread] = useState<AssistantThread[]>([]);

  const [query, setQuery] = useState('');

  const [agentData, setAgentData] = useState<
    InitAgentEvent['data']['data'] | null
  >(null);

  const messageRef = useRef<HTMLTextAreaElement>(null);

  const threadEndRef = useRef<HTMLDivElement>(null);

  const resetQuery = () => {
    setQuery('');
    messageRef.current?.focus();
  };

  const handleAgentEvents = (
    e: InitAgentEvent | QueryResponseEvent | AssistantResponseEvent
  ) => {
    if (e.data.type === 'nvm-agent:init-agent') {
      setAgentData(e.data.data as InitAgentEvent['data']['data']);
    } else if (
      e.data.type === 'nvm-agent:query-response' ||
      e.data.type === 'nvm-agent:assistant-response'
    ) {
      setThread((prev) => [...prev, e.data.data as AssistantThread]);
    }
  };

  const submitQuery = () => {
    window.postMessage(
      {
        type: 'nvm-agent:query',
        data: {
          query,
          threadId:
            thread.length > 1
              ? thread[thread.length - 1].queryResponse.threadId
              : undefined,
        },
      },
      '*'
    );

    resetQuery();
  };

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    });
  }, [thread]);

  useEffect(() => {
    insertWidgetScriptBefore(
      'https://widgets.staging.nevermined.app/nvm-agent-widget-loader.js',
      document.querySelector('.nvm-agent-widget')!
    );

    window.addEventListener('message', handleAgentEvents, false);
  }, []);

  return (
    <div className="agent-container">
      <div className="widget-container">
        <div
          className="nvm-agent-widget"
          nvm-did="did:nv:f4ea1e76c9155615f771badd0d88e8690f3a2565207591aaf40ea3e61710d18f"
          nvm-layout="horizontal"
        />
      </div>
      <div className="chat-panel">
        <div className="thread-container">
          <ul>
            {thread
              .filter((item) => item.message)
              .map(({ author, message }, index) => (
                <li key={index}>
                  <div className="thread-message">
                    <div className="thread-message-author">
                      {author === 'user' ? 'You' : 'Agent'}
                    </div>
                    <div className="thread-message-response">{message}</div>
                  </div>
                </li>
              ))}
            <div ref={threadEndRef} />
          </ul>
        </div>
        <div
          className={`chat-message chat-message${agentData ? '' : '--disabled'}`}
          onClick={() => {
            messageRef.current?.focus();
          }}
        >
          <textarea
            ref={messageRef}
            disabled={!agentData}
            placeholder={
              agentData
                ? 'Enter your message'
                : 'Login or purchase the assistant'
            }
            onChange={(e) => setQuery(e.currentTarget.value)}
            value={query}
          />
          <button type="button" disabled={!query} onClick={submitQuery}>
            Ask
          </button>
        </div>
      </div>
    </div>
  );
};
