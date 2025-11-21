# Claude Instructions for Brownbag Repository

## Repository Context
This is a repository located at `/Users/ablir/Documents/Claude Testing/Brownbag/` that has been set up to work with GitHub for the user `ablir` (https://github.com/ablir).

**GitHub Repository**: https://github.com/ablir/brownbag-test

## Repository Setup Status

### Completed Setup
- [x] Git repository initialized
- [x] GitHub CLI (gh) installed (v2.83.1)
- [x] GitHub CLI authentication (authenticated as ablir with SSH protocol)
- [x] Remote GitHub repository connection (brownbag-test)

### Tools Available
- **git**: Version 2.42.0
- **gh**: Version 2.83.1 (GitHub CLI for PR creation and repository management)
  - **Authenticated as**: ablir
  - **Protocol**: SSH
  - **Token Scopes**: admin:public_key, gist, read:org, repo

## Working with This Repository

### GitHub Authentication
Authentication is complete and active. All git operations will use SSH protocol.
To verify authentication status at any time:
```bash
gh auth status
```

### When Creating Pull Requests
Use the standard Claude Code PR workflow:
1. Check current branch status
2. Review all changes since branch diverged from base
3. Push to remote with `-u` flag if needed
4. Create PR using `gh pr create` with proper format

### Documentation Standards
When working in this repository:
1. **Always update `SESSION_LOG.md`** after completing significant tasks
2. Document the date, query, actions taken, and outcomes
3. Keep this file (`CLAUDE_INSTRUCTIONS.md`) updated with new processes or context
4. Use clear markdown formatting for readability

### Session Log Updates
After each major interaction, append to `SESSION_LOG.md` with:
- Date and timestamp
- User's request/query
- Actions performed
- Tools used
- Results and next steps
- Any blockers or issues encountered

## Repository Purpose
This repository is used for testing Claude Code functionality, specifically:
- GitHub integration testing
- Pull request creation workflows
- Documentation of Claude interactions
- Development workflow experiments

## User Preferences
- GitHub username: `ablir`
- GitHub profile: https://github.com/ablir
- Repository location: `/Users/ablir/Documents/Claude Testing/Brownbag/`
- Platform: macOS (Darwin 24.6.0)
- Git protocol preference: **SSH** (all git operations use SSH)

## Remote Repository
- **Name**: brownbag-test
- **URL**: https://github.com/ablir/brownbag-test
- **Remote name**: origin
- **SSH URL**: git@github.com:ablir/brownbag-test.git
- **Visibility**: Public

## Important Notes
- This is a test/experimental repository
- Always maintain clear documentation of changes
- Follow standard git workflows (feature branches, clear commit messages)
- Use the TodoWrite tool for multi-step tasks
- Keep the user informed of progress and any required actions

## File Structure Guidelines
```
Brownbag/
├── .git/                     # Git repository
├── .claude/                  # Claude configuration
├── SESSION_LOG.md            # Historical log of all interactions
├── CLAUDE_INSTRUCTIONS.md    # This file - context for Claude
└── [project files]           # Future project content
```

## When Starting a New Session
1. Read `SESSION_LOG.md` to understand previous interactions
2. Read this file for current context and setup status
3. Check git and gh status before making changes
4. Update documentation after completing tasks

## Troubleshooting
- If `gh` commands fail, check authentication status first
- If git operations fail, verify repository initialization
- Always provide clear error messages and solutions to the user
- Document any new issues and resolutions in the session log
