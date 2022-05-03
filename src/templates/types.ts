import { Languages, Actions, ActionStatuses, ActionResults } from '../types';

type LangBundle = Record<Languages, string[]>;

export interface Template<A extends Actions, S extends ActionStatuses> {
  readonly action: A;
  readonly status: S;
  readonly bundle: LangBundle;
  readonly beforeApply?: (data: ActionResults[A]['body']) => any;
}
