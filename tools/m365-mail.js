#!/usr/bin/env node
const fs = require('fs');

async function main() {
  const args = Object.fromEntries(process.argv.slice(2).map(arg => {
    const m = arg.match(/^--([^=]+)=(.*)$/s);
    return m ? [m[1], m[2]] : [arg.replace(/^--/, ''), true];
  }));

  const required = ['tenantId', 'clientId', 'secretPath', 'mailbox'];
  for (const key of required) {
    if (!args[key]) throw new Error(`Missing --${key}`);
  }
  const top = Number(args.top || 10);
  const secretFile = fs.readFileSync(args.secretPath, 'utf8');
  const secretMatch = secretFile.match(/(?:^|\n)\s*value\s*\r?\n\s*([^\r\n]+)\s*(?:\r?\n|$)/i);
  const secret = (secretMatch ? secretMatch[1] : secretFile.trim());

  const tokenRes = await fetch(`https://login.microsoftonline.com/${args.tenantId}/oauth2/v2.0/token`, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: args.clientId,
      client_secret: secret,
      scope: 'https://graph.microsoft.com/.default',
      grant_type: 'client_credentials'
    })
  });

  const tokenText = await tokenRes.text();
  if (!tokenRes.ok) throw new Error(`Token request failed: ${tokenRes.status} ${tokenText}`);
  const token = JSON.parse(tokenText).access_token;
  if (!token) throw new Error('No access_token in token response');

  const msgUrl = new URL(`https://graph.microsoft.com/v1.0/users/${encodeURIComponent(args.mailbox)}/mailFolders/inbox/messages`);
  msgUrl.searchParams.set('$top', String(top));
  msgUrl.searchParams.set('$select', 'receivedDateTime,from,subject,bodyPreview,isRead,webLink');
  msgUrl.searchParams.set('$orderby', 'receivedDateTime desc');

  const msgRes = await fetch(msgUrl, {
    headers: { authorization: `Bearer ${token}` }
  });
  const msgText = await msgRes.text();
  if (!msgRes.ok) throw new Error(`Graph request failed: ${msgRes.status} ${msgText}`);
  const data = JSON.parse(msgText);

  for (const m of data.value || []) {
    console.log(JSON.stringify({
      received: m.receivedDateTime,
      from: m.from?.emailAddress?.address || '',
      subject: m.subject || '',
      isRead: !!m.isRead,
      preview: m.bodyPreview || '',
      webLink: m.webLink || ''
    }));
  }
}

main().catch(err => {
  console.error(err.message || String(err));
  process.exit(1);
});
