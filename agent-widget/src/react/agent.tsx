import React, { useEffect, useMemo, useRef, useState } from 'react';
import './agent.scss';
import { Modal } from './modal/modal';
import { useSearchParams } from '../../node_modules/react-router-dom/dist/index';

const getHtmlCode = (
  did: string
) => `<div class="nvm-agent-widget" nvm-layout="horizontal" nvm-did="${did}"></div>
<script defer src="https://widgets.testing.nevermined.app/nvm-agent-widget-loader.js"></script>`;

const InjectScript = React.memo(({ script }: { script: string }) => {
  const divRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (divRef.current === null) {
      return;
    }

    const doc = document.createRange().createContextualFragment(script);
    divRef.current.innerHTML = '';
    divRef.current.appendChild(doc);
  }, [script]);

  return <div ref={divRef} />;
});

export const Agent = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [did, setDid] = useState(searchParams.get('did'));

  const [thread, setThread] = useState<AssistantThread[]>([]);

  const [query, setQuery] = useState('');

  const [isHtmlCodeEnabled] = useState(true);

  const [agentData, setAgentData] = useState<
    InitAgentEvent['data']['data'] | null
  >(null);

  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);

  const [mustTopUp, setMustTopUp] = useState(false);

  const [showHtmlCodeModal, setShowHtmlCodeModal] = useState(false);

  const [textareaWidgetHtmlCode, setTextareaWidgetHtmlCode] = useState('');

  const [widgetHtmlCode, setWidgetHtmlCode] = useState('');

  const messageRef = useRef<HTMLTextAreaElement>(null);

  const threadEndRef = useRef<HTMLDivElement>(null);

  const loadWidget = () => {
    setAgentData(null);

    setMustTopUp(false);

    setShowHtmlCodeModal(false);

    setThread([]);

    if (isHtmlCodeEnabled) {
      setSearchParams({ html: encodeURIComponent(textareaWidgetHtmlCode) });
    } else if (did) {
      setSearchParams({ did });
    }
  };

  const resetQuery = () => {
    setQuery('');
    messageRef.current?.focus();
  };

  const handleAgentEvents = (
    e:
      | InitAgentEvent
      | QueryResponseEvent
      | AssistantResponseEvent
      | StatusEvent
  ) => {
    switch (e.data.type) {
      case 'nvm-agent:init-agent': {
        setAgentData(e.data.data as InitAgentEvent['data']['data']);
        break;
      }
      case 'nvm-agent:query-response': {
        const response = e.data.data as AssistantThread;

        setThread((prev) => {
          const lastMessage = prev.at(-1);

          if (lastMessage?.messageType === 'query') {
            prev.pop();
          }

          return [...prev, response];
        });

        if (response.messageStatus === 'failed') {
          setIsWaitingForResponse(false);
        }
        break;
      }
      case 'nvm-agent:assistant-response': {
        const response = e.data.data as AssistantThread;
        setThread((prev) => [...prev, response]);
        setIsWaitingForResponse(false);
        break;
      }
      case 'nvm-agent:status': {
        if (e.data.data === 'top-up') {
          setMustTopUp(true);
        }
        break;
      }
    }
  };

  const submitQuery = () => {
    setIsWaitingForResponse(true);

    window.postMessage(
      {
        type: 'nvm-agent:query',
        data: {
          query,
          threadId: thread.at(-1)?.queryResponse?.threadId,
        },
      },
      '*'
    );

    resetQuery();
  };

  const isQueryingDisabled = useMemo(
    () => !agentData || isWaitingForResponse || mustTopUp,
    [agentData, isWaitingForResponse, mustTopUp]
  );

  const textAreaPlaceholder = useMemo(() => {
    if (!agentData) {
      return 'Login or purchase the assistant';
    }

    if (!mustTopUp && isWaitingForResponse) {
      return 'Waiting for the response...';
    }

    if (mustTopUp) {
      return 'Top up to continue';
    }

    return 'Enter your message';
  }, [agentData, isWaitingForResponse, mustTopUp]);

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    });
  }, [thread]);

  useEffect(() => {
    const did = searchParams.get('did');
    const encodedHtml = searchParams.get('html');

    if (encodedHtml) {
      const decodedHtml = decodeURIComponent(encodedHtml);

      setWidgetHtmlCode(decodedHtml);
      setTextareaWidgetHtmlCode(decodedHtml);
      return;
    }

    if (did) {
      const decodedDid = decodeURIComponent(did);
      const htmlCode = getHtmlCode(decodedDid);

      setWidgetHtmlCode(htmlCode);
      setTextareaWidgetHtmlCode(htmlCode);
    }
  }, [searchParams]);

  useEffect(() => {
    window.addEventListener('message', handleAgentEvents, false);
  }, []);

  return (
    <>
      <div className="agent-container">
        <div className="widget-container">
          <InjectScript script={widgetHtmlCode} />
          <div>
            <div className="options">
              {[
                'did:nv:df3356137935deb24f3eb5607c1d16b7324548a3e1271ab5f80bbace424b7717',
                'did:nv:ea1f90bbd03f5c88f2db09591b3319bfc382932d6cd1b165278a1c5a78551345',
                isHtmlCodeEnabled && 'html',
              ]
                .filter(Boolean)
                .map((option, index) =>
                  option === 'html' ? (
                    <button
                      key={index}
                      type="submit"
                      onClick={() => setShowHtmlCodeModal((prev) => !prev)}
                    >
                      HTML
                    </button>
                  ) : (
                    <button
                      key={index}
                      type="submit"
                      onClick={() => setSearchParams({ did: option as string })}
                    >
                      {++index}
                    </button>
                  )
                )}
            </div>
          </div>
        </div>
        <div className="chat-panel">
          <div className="thread-container">
            <ul>
              {thread
                .filter((item) => item.message)
                .map(({ author, message, queryResponse }, index) => (
                  <li key={index}>
                    <div className="thread-message">
                      <div className="thread-message-author">
                        {author === 'user' ? 'You' : 'Agent'}
                      </div>
                      <div className="thread-message-response">
                        {message}
                        {queryResponse?.creditsUsed > 0 && (
                          <div className="tooltip" tabIndex={0}>
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 14 14"
                              xmlns="http://www.w3.org/2000/svg"
                              className="info-icon"
                            >
                              <path
                                d="M6.99976 0.33252C10.6822 0.33252 13.6674 3.31775 13.6674 7.00024C13.6674 10.6827 10.6822 13.6679 6.99976 13.6679C3.31726 13.6679 0.332031 10.6827 0.332031 7.00024C0.332031 3.31775 3.31726 0.33252 6.99976 0.33252ZM6.99722 5.83291C6.65529 5.83311 6.37369 6.09071 6.33542 6.42224L6.33096 6.50004L6.33336 10.1678L6.33789 10.2455C6.37663 10.577 6.65856 10.8342 7.00049 10.834C7.34236 10.8338 7.62396 10.5762 7.66229 10.2446L7.66669 10.1668L7.66429 6.49917L7.65976 6.42137C7.62103 6.08984 7.33909 5.83271 6.99722 5.83291ZM7.00002 3.33321C6.53922 3.33321 6.16569 3.70676 6.16569 4.16756C6.16569 4.62835 6.53922 5.00191 7.00002 5.00191C7.46082 5.00191 7.83436 4.62835 7.83436 4.16756C7.83436 3.70676 7.46082 3.33321 7.00002 3.33321Z"
                                fill="#763eff"
                              />
                            </svg>
                            <span className="tooltip-text">
                              Credits used: {queryResponse.creditsUsed}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              {mustTopUp && <div className="top-up">Top up to continue</div>}
              <div ref={threadEndRef} />
            </ul>
          </div>
          <div
            className={`chat-message chat-message${isQueryingDisabled ? '--disabled' : ''}`}
            onClick={() => {
              messageRef.current?.focus();
            }}
          >
            <textarea
              ref={messageRef}
              disabled={isQueryingDisabled}
              placeholder={textAreaPlaceholder}
              onChange={(e) => setQuery(e.currentTarget.value)}
              value={query}
            />
            <button
              type="button"
              disabled={isQueryingDisabled || !query}
              onClick={submitQuery}
            >
              Ask
            </button>
          </div>
        </div>
      </div>
      {showHtmlCodeModal && (
        <Modal
          onCloseClick={() => {
            setShowHtmlCodeModal(false);
          }}
        >
          <div className="textarea-content">
            <textarea
              value={textareaWidgetHtmlCode}
              onChange={(e) => setTextareaWidgetHtmlCode(e.currentTarget.value)}
              tabIndex={0}
              autoFocus
            ></textarea>
            <button
              type="submit"
              onClick={() => {
                loadWidget();
              }}
              disabled={!textareaWidgetHtmlCode}
            >
              Save
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};
