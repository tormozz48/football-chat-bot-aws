export type ChatIdParam = { chatId: number };

export type EventParam = ChatIdParam & { eventDate: number };

export type GetEventParam = EventParam;

export type CreateEventParam = EventParam;

export type DeactivateEventParam = EventParam;

export interface EventMember {
  readonly name: string;
}

export interface Event {
  readonly chatId: number;
  readonly date: number;
  readonly active: number;

  readonly members: EventMember[];
}
