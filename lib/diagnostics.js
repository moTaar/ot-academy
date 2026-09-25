'use strict';
// Connection report: calls the Content Server REST endpoints the trainer relies
// on, as the signed-in learner, and shows exactly what came back. Nothing is
// inferred — each row is either what the server returned or the failing call
// with its HTTP status and Content Server's error text.

const { describeFailure } = require('./cs-api');

const norm = (s) => String(s || '').trim().replace(/\s+/g, ' ').toLowerCase();
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

async function diagnose(api, { sandboxName }) {
  const rows = [];
  // optional: a module that many servers don't have (a failure there is not a problem)
  const add = (area, r, detail, extra = {}) => rows.push({
    area, ok: !!r.ok, endpoint: r.endpoint || null, detail: r.ok ? detail : describeFailure(r), ...extra,
  });

  const me = await api.me();
  rows.push({ area: 'Your account', ok: true, endpoint: '/api/v1/auth', detail: `${me.name} · user ID ${me.id}${me.privilege_system_admin_rights === true ? ' · System Administration rights' : ''}` });

  const info = await api.serverInfo();
  add('Server version', { endpoint: '/api/v1/serverinfo', ...info }, info.version ? `Content Server ${info.version}` : 'Content Server does not report its version');

  const ent = await api.volume(141);
  add('Enterprise Workspace', ent, ent.ok && `“${ent.node.name}” · ID ${ent.node.id}`, { node: ent.ok ? { id: ent.node.id, container: true } : undefined });

  const pers = await api.volume(142);
  add('Personal Workspace', pers, pers.ok && `“${pers.node.name}” · ID ${pers.node.id}`, { node: pers.ok ? { id: pers.node.id, container: true } : undefined });

  if (pers.ok) {
    const kids = await api.children(pers.node.id);
    add('Browse your Personal Workspace', kids, kids.ok && `${plural(kids.nodes.length, 'item', 'items')}${kids.truncated ? ' (more than I read)' : ''}, hidden ones included`);
    if (kids.ok) {
      const sb = kids.nodes.find((n) => norm(n.name) === norm(sandboxName) && Number(n.type) === 0);
      rows.push({
        area: `Training folder “${sandboxName}”`, ok: true, endpoint: kids.endpoint,
        detail: sb ? `Found in your Personal Workspace · ID ${sb.id}` : 'Not in your Personal Workspace yet — creating it is your first mission',
        node: sb ? { id: sb.id, container: true } : undefined,
      });
    }
    const perms = await api.permissions(pers.node.id);
    add('Permissions', perms, perms.ok && `${plural(perms.entries.length, 'entry', 'entries')} on your Personal Workspace`, { endpoint: `/api/v2/nodes/${pers.node.id}/permissions` });
  }

  const groups = await api.myGroups();
  add('Your groups', { endpoint: '/api/v2/members/memberof', ...groups }, groups.ok && (groups.groups.length ? groups.groups.slice(0, 6).map((g) => g.name).join(', ') + (groups.groups.length > 6 ? ', …' : '') : 'You are in no groups'));

  const fav = await api.favorites();
  add('Favorites', { endpoint: '/api/v2/members/favorites', ...fav }, fav.ok && plural(fav.ids.size, 'favorite', 'favorites'));

  const asg = await api.assignments();
  add('Assignments', { endpoint: '/api/v2/members/assignments', ...asg }, asg.ok && plural(asg.count, 'assignment', 'assignments'));

  const wf = await api.workflowsInitiated();
  add('Workflows you started', { endpoint: '/api/v2/workflows/status', ...wf }, wf.ok && `${plural(wf.count, 'workflow', 'workflows')}${wf.unread.length ? ` (the server wouldn't list: ${wf.unread.join(', ')})` : ''}`);

  const bin = await api.recycleBin();
  add('Recycle Bin', { endpoint: '/api/v2/volumes/recyclebin/nodes', ...bin }, bin.ok && `${plural(bin.items.length, 'item', 'items')} you deleted`);

  const cats = await api.volume(133);
  add('Categories volume', cats, cats.ok && `“${cats.node.name}” · ID ${cats.node.id}`);

  const cls = await api.volume(198);
  add('Classifications volume', cls, cls.ok && `“${cls.node.name}” · ID ${cls.node.id}`, { optional: true });

  const search = await api.searchWorks();
  add('Search', { endpoint: '/api/v2/search', ...search }, 'The search API answers');

  const bw = await api.businessWorkspaceTypes();
  add('Business workspace types (Extended ECM)', { endpoint: '/api/v2/businessworkspacetypes', ...bw }, bw.ok && plural(bw.count, 'workspace type', 'workspace types'), { optional: true });

  return { checkedAt: new Date().toISOString(), rows };
}

module.exports = { diagnose };
