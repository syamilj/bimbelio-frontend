'use client';

import { useProvider } from '../../provider';
import Row from './row';

/**
 * MessageList — thin wrapper that renders message rows.
 * Scrolling & stick-to-bottom are handled by the parent <Conversation> component.
 */
export default function MessageList() {
  const {
    messageData,
    useMessages: { isLoadingMessages },
    useMessagesEdit: { isLoadingMessagesEdit },
  } = useProvider();

  const isStreaming = isLoadingMessages || isLoadingMessagesEdit;

  return (
    <>
      {messageData.map((msg, index) => (
        <Row
          key={`${msg.id}-${index}`}
          message={msg}
          index={index}
          isLast={index === messageData.length - 1}
          isStreaming={isStreaming}
        />
      ))}
    </>
  );
}
