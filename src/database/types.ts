export type ChatIdParam = { chatId: Event['chatId'] };

export type EventParam = ChatIdParam & { eventDate: Event['eventDate'] };

export type GetEventParam = EventParam;

export type CreateEventParam = EventParam;

export type UpdateEventMembersParam = EventParam & { members: Event['members'] };

export type DeactivateEventParam = EventParam;

export type RemoveEventParam = EventParam;

export interface EventMember {
  readonly name: string;
}

export interface Event {
  readonly chatId: number;
  readonly eventDate: number;
  readonly active: number;

  members: EventMember[];
}
