export interface IMessage {
  readonly chatId: number;
  readonly lang: string;
  readonly text: string;
  readonly fullText: string;
  readonly command: string;
  readonly name: string;
}
