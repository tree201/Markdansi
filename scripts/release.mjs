import { execFileSync } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const packageFile = path.join(projectRoot, "package.json");
const changelogFile = path.join(projectRoot, "CHANGELOG.md");

export function bumpVersion(version, kind) {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(version);
  if (!match) throw new Error(`invalid current version: ${version}`);
  const major = Number(match[1]);
  const minor = Number(match[2]);
  const patch = Number(match[3]);
  if (kind === "major") return `${major + 1}.0.0`;
  if (kind === "minor") return `${major}.${minor + 1}.0`;
  if (kind === "patch") return `${major}.${minor}.${patch + 1}`;
  throw new Error(`unknown bump kind: ${kind}`);
}

export function resolveVersion(current, input) {
  const next = ["major", "minor", "patch"].includes(input)
    ? bumpVersion(current, input)
    : input.replace(/^v/, "");
  if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(next)) {
    throw new Error(`invalid release version: ${next}`);
  }
  if (next === current) throw new Error(`version ${next} is already current`);
  return next;
}

export function releaseChangelog(source, version, date) {
  const match = /^## Unreleased\n\n((?:- .+\n)+)/m.exec(source);
  if (!match) throw new Error("CHANGELOG.md needs at least one Unreleased entry");
  return source.replace(match[0], `## Unreleased\n\n## ${version} (${date})\n\n${match[1]}`);
}

export function unexpectedReleasePaths(paths) {
  return paths.filter(
    (file) => file !== "package.json" && file !== "CHANGELOG.md" && !file.startsWith("dist/"),
  );
}

function run(command, args, options = {}) {
  return execFileSync(command, args, {
    cwd: projectRoot,
    encoding: "utf8",
    stdio: options.inherit ? "inherit" : ["ignore", "pipe", "pipe"],
  });
}

function git(...args) {
  return run("git", args).trim();
}

function restoreAfterFailure(packageSource, changelogSource) {
  return Promise.all([
    writeFile(packageFile, packageSource),
    writeFile(changelogFile, changelogSource),
  ]).then(() => {
    run("git", ["restore", "--worktree", "--staged", "dist"], { inherit: true });
  });
}

export function releaseInput(argv) {
  return argv[2] === "--" ? argv[3] : argv[2];
}

async function main(argv) {
  const input = releaseInput(argv);
  if (!input) throw new Error("usage: pnpm release -- <version | major | minor | patch>");
  if (git("status", "--porcelain")) throw new Error("working tree must be clean before releasing");
  if (git("branch", "--show-current") !== "main") throw new Error("releases must run from main");

  const packageSource = await readFile(packageFile, "utf8");
  const changelogSource = await readFile(changelogFile, "utf8");
  const packageJson = JSON.parse(packageSource);
  const next = resolveVersion(packageJson.version, input);
  const tag = `v${next}`;
  if (git("tag", "--list", tag)) throw new Error(`tag ${tag} already exists`);

  packageJson.version = next;
  await writeFile(packageFile, `${JSON.stringify(packageJson, null, 2)}\n`);
  await writeFile(
    changelogFile,
    releaseChangelog(changelogSource, next, new Date().toISOString().slice(0, 10)),
  );

  try {
    run("pnpm", ["format"], { inherit: true });
    const changed = git("status", "--porcelain")
      .split("\n")
      .filter(Boolean)
      .map((line) => line.slice(3));
    const unexpected = unexpectedReleasePaths(changed);
    if (unexpected.length)
      throw new Error(`release formatting changed unexpected files: ${unexpected.join(", ")}`);
    run("pnpm", ["build"], { inherit: true });
  } catch (error) {
    await restoreAfterFailure(packageSource, changelogSource);
    throw error;
  }

  git("add", "package.json", "CHANGELOG.md", "dist");
  git("commit", "-m", `release: ${tag}`);
  git("tag", tag);
  run("git", ["push", "origin", "main"], { inherit: true });
  run("git", ["push", "origin", tag], { inherit: true });
  console.log(`Released ${tag}; npm publishing will run through GitHub Actions.`);
}

const invokedDirectly =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invokedDirectly) {
  main(process.argv).catch((error) => {
    console.error(`release: ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
  });
}
