export const en = `
❌ <strong>{{name}}</strong> canceled his participation ❌

ℹ️ List of members:
{{#each members}}
  {{index}}: <i>{{name}}</i>
{{/each}}

Total: <strong>{{total}}</strong>
`;

export const ru = `
❌ <strong>{{name}}</strong> отменил свое участие в событии ❌

ℹ️ Список участников:
{{#each members}}
  {{index}}: <i>{{name}}</i>
{{/each}}

Итого: <strong>{{total}}</strong>
`;
