export type ChatIdParam = { chatId: Event['chatId'] };

type EventParam = ChatIdParam & { eventDate: Event['eventDate'] };

export type GetEventParam = EventParam;

export type CreateEventParam = EventParam;

export type UpdateEventMembersParam = EventParam & { members: Event['members'] };

export type RemoveEventParam = EventParam;

interface EventMember {
  readonly name: string;
}

export interface Event {
  readonly chatId: number;
  readonly eventDate: number;
  readonly active: number;

  members: EventMember[];
}
