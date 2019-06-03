import { KnownBlock, MessageAttachment } from 'kaomoji/node_modules/@slack/types';

export interface ResponseMessage {
  text: string;
  response_type?: 'ephemeral' | 'in_channel';
  replace_original?: boolean;
  delete_original?: boolean;
  blocks?: KnownBlock[];
  attachments?: MessageAttachment[];
  thread_ts?: string;
  mrkdwn?: boolean;
}
