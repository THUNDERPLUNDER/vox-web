/* CONTRACT: Minimal KlarLyd Task Layer v0 using GitHub Projects v2 as source of truth. */
/**
 * Required env:
 * - GITHUB_TOKEN (classic PAT with repo + project scope, or fine-grained equivalent)
 *
 * Examples:
 * - node scripts/kl-task-layer.mjs setup-foundation --owner THUNDERPLUNDER --repo vox-web
 * - node scripts/kl-task-layer.mjs list_tasks --owner THUNDERPLUNDER --project "Minimal KlarLyd Task Layer v0"
 * - node scripts/kl-task-layer.mjs create_task --owner THUNDERPLUNDER --repo vox-web --project "Minimal KlarLyd Task Layer v0" --title "Polish trust layer" --status "Neste" --priority P2 --area "Content UI" --workstream "Ops / Architecture" --level Task --start-date 2026-04-16 --target-date 2026-04-18 --notes "Small copy pass" --link "https://github.com/THUNDERPLUNDER/vox-web/issues/1" --body "Kort brief"
 * - node scripts/kl-task-layer.mjs move_task --owner THUNDERPLUNDER --project "Minimal KlarLyd Task Layer v0" --issue 123 --status "I arbeid"
 * - node scripts/kl-task-layer.mjs set_priority --owner THUNDERPLUNDER --project "Minimal KlarLyd Task Layer v0" --issue 123 --priority P1
 * - node scripts/kl-task-layer.mjs set_workstream --owner THUNDERPLUNDER --project "Minimal KlarLyd Task Layer v0" --issue 123 --workstream "Ops / Architecture"
 * - node scripts/kl-task-layer.mjs set_level --owner THUNDERPLUNDER --project "Minimal KlarLyd Task Layer v0" --issue 123 --level Track
 * - node scripts/kl-task-layer.mjs set_dates --owner THUNDERPLUNDER --project "Minimal KlarLyd Task Layer v0" --issue 123 --start-date 2026-04-16 --target-date 2026-04-20
 */

const API_URL = "https://api.github.com/graphql";
const token = process.env.GITHUB_TOKEN;

if (!token) {
  console.error("Missing GITHUB_TOKEN in environment.");
  process.exit(1);
}

const STATUS_OPTIONS = ["Backlog", "Neste", "I arbeid", "Review", "Ferdig", "Senere"];
const WORKFLOW_FIELD_NAME = "KL Status";
const PRIORITY_OPTIONS = ["P1", "P2", "P3"];
const AREA_OPTIONS = ["Content UI", "AI UI", "IA", "CMS", "Tech", "Ops", "Strategy"];
const WORKSTREAM_OPTIONS = ["Content", "IA", "AI Agent", "AI Training", "UI Design", "Ops / Architecture"];
const LEVEL_OPTIONS = ["Track", "Task"];
const DEFAULT_PROJECT_TITLE = "Minimal KlarLyd Task Layer v0";
const START_DATE_FIELD = "Start date";
const TARGET_DATE_FIELD = "Target date";

function printResult(event, payload) {
  const body = { event, ...payload };
  console.log(`RESULT ${JSON.stringify(body)}`);
}

function parseArgs(argv) {
  const [command, ...rest] = argv;
  const args = {};
  for (let i = 0; i < rest.length; i += 1) {
    const k = rest[i];
    if (!k.startsWith("--")) continue;
    const v = rest[i + 1];
    args[k.slice(2)] = v;
    i += 1;
  }
  return { command, args };
}

async function gql(query, variables = {}) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`GitHub API failed ${res.status}`);
  const data = await res.json();
  if (data.errors?.length) throw new Error(data.errors.map((e) => e.message).join(" | "));
  return data.data;
}

async function getOwner(ownerLogin) {
  const data = await gql(
    `
      query($owner: String!) {
        repositoryOwner(login: $owner) {
          __typename
          login
          id
        }
      }
    `,
    { owner: ownerLogin },
  );
  return data.repositoryOwner;
}

async function listProjects(ownerLogin) {
  const data = await gql(
    `
      query($owner: String!) {
        repositoryOwner(login: $owner) {
          ... on User {
            projectsV2(first: 50) { nodes { id title number } }
          }
          ... on Organization {
            projectsV2(first: 50) { nodes { id title number } }
          }
        }
      }
    `,
    { owner: ownerLogin },
  );
  return (data.repositoryOwner?.projectsV2?.nodes || []).filter(Boolean);
}

async function getOrCreateProject(ownerLogin, projectTitle = DEFAULT_PROJECT_TITLE) {
  const projects = await listProjects(ownerLogin);
  const existing = projects.find((p) => p.title === projectTitle);
  if (existing) return existing;

  const owner = await getOwner(ownerLogin);
  if (!owner) throw new Error(`Owner not found: ${ownerLogin}`);
  const created = await gql(
    `
      mutation($ownerId: ID!, $title: String!) {
        createProjectV2(input: { ownerId: $ownerId, title: $title }) {
          projectV2 { id title number }
        }
      }
    `,
    { ownerId: owner.id, title: projectTitle },
  );
  return created.createProjectV2.projectV2;
}

async function getProjectFields(projectId) {
  const data = await gql(
    `
      query($projectId: ID!) {
        node(id: $projectId) {
          ... on ProjectV2 {
            fields(first: 50) {
              nodes {
                ... on ProjectV2FieldCommon { id name dataType }
                ... on ProjectV2SingleSelectField {
                  id
                  name
                  dataType
                  options { id name }
                }
              }
            }
          }
        }
      }
    `,
    { projectId },
  );
  return data.node.fields.nodes;
}

async function createSingleSelectField(projectId, name, optionNames) {
  const options = optionNames.map((n) => ({ name: n, color: "GRAY", description: "" }));
  await gql(
    `
      mutation($projectId: ID!, $name: String!, $options: [ProjectV2SingleSelectFieldOptionInput!]!) {
        createProjectV2Field(
          input: {
            projectId: $projectId
            dataType: SINGLE_SELECT
            name: $name
            singleSelectOptions: $options
          }
        ) {
          projectV2Field { ... on ProjectV2FieldCommon { id name } }
        }
      }
    `,
    { projectId, name, options },
  );
}

async function createTextField(projectId, name) {
  await gql(
    `
      mutation($projectId: ID!, $name: String!) {
        createProjectV2Field(input: { projectId: $projectId, dataType: TEXT, name: $name }) {
          projectV2Field { ... on ProjectV2FieldCommon { id name } }
        }
      }
    `,
    { projectId, name },
  );
}

async function createDateField(projectId, name) {
  await gql(
    `
      mutation($projectId: ID!, $name: String!) {
        createProjectV2Field(input: { projectId: $projectId, dataType: DATE, name: $name }) {
          projectV2Field { ... on ProjectV2FieldCommon { id name } }
        }
      }
    `,
    { projectId, name },
  );
}

async function ensureFoundation(owner, repo, projectTitle) {
  const project = await getOrCreateProject(owner, projectTitle);
  let fields = await getProjectFields(project.id);
  const byName = new Map(fields.map((f) => [f.name, f]));

  if (!byName.has(WORKFLOW_FIELD_NAME)) await createSingleSelectField(project.id, WORKFLOW_FIELD_NAME, STATUS_OPTIONS);
  if (!byName.has("Priority")) await createSingleSelectField(project.id, "Priority", PRIORITY_OPTIONS);
  if (!byName.has("Area")) await createSingleSelectField(project.id, "Area", AREA_OPTIONS);
  if (!byName.has("Workstream")) await createSingleSelectField(project.id, "Workstream", WORKSTREAM_OPTIONS);
  if (!byName.has("Level")) await createSingleSelectField(project.id, "Level", LEVEL_OPTIONS);
  if (!byName.has("Owner")) await createTextField(project.id, "Owner");
  if (!byName.has("Notes")) await createTextField(project.id, "Notes");
  if (!byName.has("Link")) await createTextField(project.id, "Link");
  if (!byName.has(START_DATE_FIELD)) await createDateField(project.id, START_DATE_FIELD);
  if (!byName.has(TARGET_DATE_FIELD)) await createDateField(project.id, TARGET_DATE_FIELD);

  fields = await getProjectFields(project.id);

  // Ensure repo is linked to project for clearer UX (optional; safe if already linked)
  const repoData = await gql(
    `
      query($owner: String!, $repo: String!) {
        repository(owner: $owner, name: $repo) { id nameWithOwner }
      }
    `,
    { owner, repo },
  );
  const repositoryId = repoData.repository?.id;
  if (repositoryId) {
    try {
      await gql(
        `
          mutation($projectId: ID!, $repoId: ID!) {
            linkProjectV2ToRepository(input: { projectId: $projectId, repositoryId: $repoId }) {
              repository { id nameWithOwner }
            }
          }
        `,
        { projectId: project.id, repoId: repositoryId },
      );
    } catch {
      // no-op if already linked or not allowed
    }
  }

  console.log(`Project ready: ${project.title} (#${project.number})`);
  console.log("Fields:");
  for (const f of fields) {
    if (
      [
        "Title",
        WORKFLOW_FIELD_NAME,
        "Priority",
        "Area",
        "Workstream",
        "Level",
        "Owner",
        "Notes",
        "Link",
        START_DATE_FIELD,
        TARGET_DATE_FIELD,
      ].includes(f.name)
    ) {
      const suffix = f.options?.length ? ` [${f.options.map((o) => o.name).join(", ")}]` : "";
      console.log(`- ${f.name}${suffix}`);
    }
  }
  printResult("setup_foundation_done", {
    projectTitle: project.title,
    projectNumber: project.number,
    owner,
    repo,
  });
}

async function getProjectByTitle(owner, projectTitle) {
  const projects = await listProjects(owner);
  const project = projects.find((p) => p.title === projectTitle);
  if (!project) throw new Error(`Project not found: ${projectTitle}`);
  return project;
}

async function getRepoId(owner, repo) {
  const data = await gql(
    `query($owner: String!, $repo: String!){ repository(owner:$owner, name:$repo){ id } }`,
    { owner, repo },
  );
  return data.repository.id;
}

async function createIssue(owner, repo, title, body) {
  const data = await gql(
    `
      mutation($repoId: ID!, $title: String!, $body: String) {
        createIssue(input: { repositoryId: $repoId, title: $title, body: $body }) {
          issue { id number url title }
        }
      }
    `,
    { repoId: await getRepoId(owner, repo), title, body: body || null },
  );
  return data.createIssue.issue;
}

async function addIssueToProject(projectId, issueId) {
  const data = await gql(
    `
      mutation($projectId: ID!, $contentId: ID!) {
        addProjectV2ItemById(input: { projectId: $projectId, contentId: $contentId }) {
          item { id }
        }
      }
    `,
    { projectId, contentId: issueId },
  );
  return data.addProjectV2ItemById.item.id;
}

function findField(fields, name) {
  const field = fields.find((f) => f.name === name);
  if (!field) throw new Error(`Field not found: ${name}`);
  return field;
}

function findOptionId(field, optionName) {
  const option = field.options?.find((o) => o.name === optionName);
  if (!option) throw new Error(`Option '${optionName}' not found for ${field.name}`);
  return option.id;
}

async function setSingleSelectField(projectId, itemId, fieldId, optionId) {
  await gql(
    `
      mutation($projectId: ID!, $itemId: ID!, $fieldId: ID!, $optionId: String!) {
        updateProjectV2ItemFieldValue(
          input: {
            projectId: $projectId
            itemId: $itemId
            fieldId: $fieldId
            value: { singleSelectOptionId: $optionId }
          }
        ) {
          projectV2Item { id }
        }
      }
    `,
    { projectId, itemId, fieldId, optionId },
  );
}

async function setTextField(projectId, itemId, fieldId, text) {
  await gql(
    `
      mutation($projectId: ID!, $itemId: ID!, $fieldId: ID!, $text: String!) {
        updateProjectV2ItemFieldValue(
          input: {
            projectId: $projectId
            itemId: $itemId
            fieldId: $fieldId
            value: { text: $text }
          }
        ) {
          projectV2Item { id }
        }
      }
    `,
    { projectId, itemId, fieldId, text },
  );
}

async function setDateField(projectId, itemId, fieldId, date) {
  await gql(
    `
      mutation($projectId: ID!, $itemId: ID!, $fieldId: ID!, $date: Date!) {
        updateProjectV2ItemFieldValue(
          input: {
            projectId: $projectId
            itemId: $itemId
            fieldId: $fieldId
            value: { date: $date }
          }
        ) {
          projectV2Item { id }
        }
      }
    `,
    { projectId, itemId, fieldId, date },
  );
}

async function findProjectItemByIssueNumber(projectId, issueNumber) {
  const data = await gql(
    `
      query($projectId: ID!) {
        node(id: $projectId) {
          ... on ProjectV2 {
            items(first: 100) {
              nodes {
                id
                content {
                  ... on Issue { number title url }
                }
              }
            }
          }
        }
      }
    `,
    { projectId },
  );
  return data.node.items.nodes.find((i) => i.content?.number === Number(issueNumber));
}

async function listTasks(owner, projectTitle) {
  const project = await getProjectByTitle(owner, projectTitle);
  const data = await gql(
    `
      query($projectId: ID!) {
        node(id: $projectId) {
          ... on ProjectV2 {
            items(first: 100) {
              nodes {
                id
                content {
                  ... on Issue { number title url }
                }
                fieldValues(first: 20) {
                  nodes {
                    ... on ProjectV2ItemFieldSingleSelectValue {
                      field { ... on ProjectV2FieldCommon { name } }
                      name
                    }
                    ... on ProjectV2ItemFieldTextValue {
                      field { ... on ProjectV2FieldCommon { name } }
                      text
                    }
                    ... on ProjectV2ItemFieldDateValue {
                      field { ... on ProjectV2FieldCommon { name } }
                      date
                    }
                  }
                }
              }
            }
          }
        }
      }
    `,
    { projectId: project.id },
  );

  const items = data.node.items.nodes.filter((n) => n.content?.number);
  const rows = [];
  for (const item of items) {
    const fieldMap = Object.fromEntries(
      item.fieldValues.nodes.map((fv) => [fv.field?.name, fv.name ?? fv.text ?? fv.date]).filter((x) => x[0]),
    );
    const row = {
      issue: item.content.number,
      title: item.content.title,
      status: fieldMap[WORKFLOW_FIELD_NAME] || "-",
      priority: fieldMap.Priority || "-",
      area: fieldMap.Area || "-",
      workstream: fieldMap.Workstream || "-",
      level: fieldMap.Level || "-",
      startDate: fieldMap[START_DATE_FIELD] || "-",
      targetDate: fieldMap[TARGET_DATE_FIELD] || "-",
      url: item.content.url,
    };
    rows.push(row);
    console.log(`#${row.issue} ${row.title}`);
    console.log(
      `  status=${row.status} priority=${row.priority} workstream=${row.workstream} level=${row.level} area=${row.area}`,
    );
    console.log(`  start=${row.startDate} target=${row.targetDate}`);
    console.log(`  ${row.url}`);
  }
  printResult("list_tasks_done", { count: rows.length, tasks: rows });
}

async function createTask(args) {
  const owner = args.owner;
  const repo = args.repo;
  const projectTitle = args.project || DEFAULT_PROJECT_TITLE;
  const title = args.title;
  if (!owner || !repo || !title) throw new Error("create_task requires --owner --repo --title");

  const project = await getProjectByTitle(owner, projectTitle);
  const fields = await getProjectFields(project.id);
  const issue = await createIssue(owner, repo, title, args.body);
  const itemId = await addIssueToProject(project.id, issue.id);

  if (args.status) {
    const f = findField(fields, WORKFLOW_FIELD_NAME);
    await setSingleSelectField(project.id, itemId, f.id, findOptionId(f, args.status));
  }
  if (args.priority) {
    const f = findField(fields, "Priority");
    await setSingleSelectField(project.id, itemId, f.id, findOptionId(f, args.priority));
  }
  if (args.area) {
    const f = findField(fields, "Area");
    await setSingleSelectField(project.id, itemId, f.id, findOptionId(f, args.area));
  }
  if (args.workstream) {
    const f = findField(fields, "Workstream");
    await setSingleSelectField(project.id, itemId, f.id, findOptionId(f, args.workstream));
  }
  if (args.level) {
    const f = findField(fields, "Level");
    await setSingleSelectField(project.id, itemId, f.id, findOptionId(f, args.level));
  }
  if (args.ownerText) {
    const f = findField(fields, "Owner");
    await setTextField(project.id, itemId, f.id, args.ownerText);
  }
  if (args.notes) {
    const f = findField(fields, "Notes");
    await setTextField(project.id, itemId, f.id, args.notes);
  }
  if (args.link) {
    const f = findField(fields, "Link");
    await setTextField(project.id, itemId, f.id, args.link);
  }
  if (args["start-date"]) {
    const f = findField(fields, START_DATE_FIELD);
    await setDateField(project.id, itemId, f.id, args["start-date"]);
  }
  if (args["target-date"]) {
    const f = findField(fields, TARGET_DATE_FIELD);
    await setDateField(project.id, itemId, f.id, args["target-date"]);
  }

  console.log(`Created task: #${issue.number} ${issue.title}`);
  console.log(issue.url);
  printResult("create_task_done", {
    issue: issue.number,
    title: issue.title,
    url: issue.url,
    status: args.status || null,
    priority: args.priority || null,
    area: args.area || null,
    workstream: args.workstream || null,
    level: args.level || null,
    startDate: args["start-date"] || null,
    targetDate: args["target-date"] || null,
  });
}

async function moveTask(args) {
  const owner = args.owner;
  const projectTitle = args.project || DEFAULT_PROJECT_TITLE;
  const issue = args.issue;
  const status = args.status;
  if (!owner || !issue || !status) throw new Error("move_task requires --owner --issue --status");

  const project = await getProjectByTitle(owner, projectTitle);
  const fields = await getProjectFields(project.id);
  const statusField = findField(fields, WORKFLOW_FIELD_NAME);
  const item = await findProjectItemByIssueNumber(project.id, issue);
  if (!item) throw new Error(`Issue #${issue} not found in project`);
  await setSingleSelectField(project.id, item.id, statusField.id, findOptionId(statusField, status));
  console.log(`Moved #${issue} -> ${status}`);
  printResult("move_task_done", { issue: Number(issue), status });
}

async function setPriority(args) {
  const owner = args.owner;
  const projectTitle = args.project || DEFAULT_PROJECT_TITLE;
  const issue = args.issue;
  const priority = args.priority;
  if (!owner || !issue || !priority) throw new Error("set_priority requires --owner --issue --priority");

  const project = await getProjectByTitle(owner, projectTitle);
  const fields = await getProjectFields(project.id);
  const priorityField = findField(fields, "Priority");
  const item = await findProjectItemByIssueNumber(project.id, issue);
  if (!item) throw new Error(`Issue #${issue} not found in project`);
  await setSingleSelectField(project.id, item.id, priorityField.id, findOptionId(priorityField, priority));
  console.log(`Set priority #${issue} -> ${priority}`);
  printResult("set_priority_done", { issue: Number(issue), priority });
}

async function setWorkstream(args) {
  const owner = args.owner;
  const projectTitle = args.project || DEFAULT_PROJECT_TITLE;
  const issue = args.issue;
  const workstream = args.workstream;
  if (!owner || !issue || !workstream) throw new Error("set_workstream requires --owner --issue --workstream");
  const project = await getProjectByTitle(owner, projectTitle);
  const fields = await getProjectFields(project.id);
  const field = findField(fields, "Workstream");
  const item = await findProjectItemByIssueNumber(project.id, issue);
  if (!item) throw new Error(`Issue #${issue} not found in project`);
  await setSingleSelectField(project.id, item.id, field.id, findOptionId(field, workstream));
  console.log(`Set workstream #${issue} -> ${workstream}`);
  printResult("set_workstream_done", { issue: Number(issue), workstream });
}

async function setLevel(args) {
  const owner = args.owner;
  const projectTitle = args.project || DEFAULT_PROJECT_TITLE;
  const issue = args.issue;
  const level = args.level;
  if (!owner || !issue || !level) throw new Error("set_level requires --owner --issue --level");
  const project = await getProjectByTitle(owner, projectTitle);
  const fields = await getProjectFields(project.id);
  const field = findField(fields, "Level");
  const item = await findProjectItemByIssueNumber(project.id, issue);
  if (!item) throw new Error(`Issue #${issue} not found in project`);
  await setSingleSelectField(project.id, item.id, field.id, findOptionId(field, level));
  console.log(`Set level #${issue} -> ${level}`);
  printResult("set_level_done", { issue: Number(issue), level });
}

async function setDates(args) {
  const owner = args.owner;
  const projectTitle = args.project || DEFAULT_PROJECT_TITLE;
  const issue = args.issue;
  const startDate = args["start-date"];
  const targetDate = args["target-date"];
  if (!owner || !issue || (!startDate && !targetDate)) {
    throw new Error("set_dates requires --owner --issue and at least one of --start-date --target-date");
  }
  const project = await getProjectByTitle(owner, projectTitle);
  const fields = await getProjectFields(project.id);
  const item = await findProjectItemByIssueNumber(project.id, issue);
  if (!item) throw new Error(`Issue #${issue} not found in project`);
  if (startDate) {
    const field = findField(fields, START_DATE_FIELD);
    await setDateField(project.id, item.id, field.id, startDate);
  }
  if (targetDate) {
    const field = findField(fields, TARGET_DATE_FIELD);
    await setDateField(project.id, item.id, field.id, targetDate);
  }
  console.log(`Set dates #${issue} -> start=${startDate || "-"} target=${targetDate || "-"}`);
  printResult("set_dates_done", { issue: Number(issue), startDate: startDate || null, targetDate: targetDate || null });
}

async function main() {
  const { command, args } = parseArgs(process.argv.slice(2));
  if (!command) {
    console.error(
      "Missing command. Use: setup-foundation | list_tasks | create_task | move_task | set_priority | set_workstream | set_level | set_dates",
    );
    process.exit(1);
  }

  if (command === "setup-foundation") {
    const owner = args.owner;
    const repo = args.repo;
    if (!owner || !repo) throw new Error("setup-foundation requires --owner and --repo");
    await ensureFoundation(owner, repo, args.project || DEFAULT_PROJECT_TITLE);
    return;
  }
  if (command === "list_tasks") {
    if (!args.owner) throw new Error("list_tasks requires --owner");
    await listTasks(args.owner, args.project || DEFAULT_PROJECT_TITLE);
    return;
  }
  if (command === "create_task") {
    await createTask(args);
    return;
  }
  if (command === "move_task") {
    await moveTask(args);
    return;
  }
  if (command === "set_priority") {
    await setPriority(args);
    return;
  }
  if (command === "set_workstream") {
    await setWorkstream(args);
    return;
  }
  if (command === "set_level") {
    await setLevel(args);
    return;
  }
  if (command === "set_dates") {
    await setDates(args);
    return;
  }

  throw new Error(`Unknown command: ${command}`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
