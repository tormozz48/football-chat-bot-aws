export const en = `
⚽️🗓 Event Info <i>Date: {{eventDate}}</i>

ℹ️ List of members:
{{#each members}}
  {{index}}: <i>{{name}}</i>
{{/each}}

Total: <strong>{{total}}</strong>
`;

export const ru = `
🗓 Информация о событии <i>Дата: {{eventDate}}</i>

ℹ️ Список участников:
{{#each members}}
  {{index}}: <i>{{name}}</i>
{{/each}}

Итого: <strong>{{total}}</strong>
`;
