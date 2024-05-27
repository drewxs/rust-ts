export default {
  branches: ["+([0-9])?(.{+([0-9]),x}).x", "main"],
  plugins: [
    [
      "@semantic-release/commit-analyzer",
      {
        preset: "conventionalcommits",
        releaseRules: [
          {type: "docs", release: "patch"},
          {type: "refactor", release: "patch"},
          {type: "style", release: "patch"},
          {type: "build", release: "patch"},
        ],
        parserOpts: {noteKeywords: ["BREAKING CHANGE"]},
      },
    ],
    [
      "@semantic-release/release-notes-generator",
      {
        preset: "conventionalcommits",
        parserOpts: {noteKeywords: ["BREAKING CHANGE"]},
        writerOpts: {commitsSort: ["subject", "scope"]},
      },
    ],
    ["@semantic-release/changelog", {changelogFile: "CHANGELOG.md"}],
    ["@semantic-release/npm", {npmPublish: true}],
    [
      "@semantic-release/git",
      {
        assets: ["CHANGELOG.md", "package.json"],
        message: "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",
      },
    ],
  ],
};
