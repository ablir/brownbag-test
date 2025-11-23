# User Prompts Log

This file contains a chronological log of all user prompts/queries during Claude Code sessions with this repository.

---

## Session: 2025-11-22

### Prompt 1: Initial Repository Setup
```
I want you to setup this repo to be able to connect to github https://github.com/ablir
Install whats necessary for me to be able to create PR via claude code
```

**Context**: Initial session request to set up GitHub integration

**Result**:
- Installed GitHub CLI (gh)
- Initialized git repository
- Prepared for authentication

---

### Prompt 2: Documentation Request
```
document our interaction and query in and MD file
also add instruction for claude in a separate MD file so that youll be able to follow previous interaction and document
```

**Context**: Request to create documentation for tracking interactions

**Result**:
- Created SESSION_LOG.md
- Created CLAUDE_INSTRUCTIONS.md

---

### Prompt 3: Authentication Command
```
gh auth login
```

**Context**: User indicating they will run the authentication command

**Result**: Provided guidance on authentication options

---

### Prompt 4: Protocol Selection
```
choose ssh
```

**Context**: User preference for SSH protocol over HTTPS

**Result**: Updated instructions to use SSH protocol

---

### Prompt 5: Proceed with Authentication
```
proceed
```

**Context**: User completed authentication

**Result**:
- Verified authentication successful
- Updated documentation with authentication details

---

### Prompt 6: Repository Creation
```
create a repo for brownbag-test
```

**Context**: Request to create GitHub repository

**Result**:
- Created public repository: https://github.com/ablir/brownbag-test
- Connected local repository to remote
- Updated documentation

---

### Prompt 7: PR Template and Branch Creation
```
create a branch initial-claude-config and push it and create a PR for it
Create a config to autofill description with checklist
Create a check list for a front end react PR that a reviewer and creator can check for the MR
Create an appropriate title for the header as well
```

**Context**: Request to create PR workflow with automated template

**Result**:
- Created branch: initial-claude-config
- Created .github/pull_request_template.md with comprehensive React checklist
- Created PR #1: "Add GitHub PR Template and Repository Documentation"
- Established clean branch structure

---

### Prompt 8: Branch Structure Clarification
```
i want master to be empty and a PR for the initial branch to merge to master
```

**Context**: Mid-process clarification on desired branch structure

**Result**:
- Restructured branches
- Master branch: README only
- Feature branch: All configuration and documentation

---

### Prompt 9: Merge Request
```
approve that merge request and merge it
```

**Context**: Request to complete PR workflow

**Result**:
- Merged PR #1 successfully
- Deleted feature branch
- Updated documentation
- Master now contains all configuration

---

### Prompt 10: Prompts Log Request
```
log all my promts in a md file as well
```

**Context**: Request to document all user prompts

**Result**: Created this file (USER_PROMPTS.md)

---

---

## Session: 2025-11-23

### Prompt 11: Monorepo Setup Request
```
create a folder for frontend and one for backend
well be making a monorepo setup for a react component and an express node js backend and fakerjs to temporarily fill in our rest endpoint with data
Use vite setup for react, airbnb, eslint, typescript and prettify

Create an initial login page that proceeds to the user info page.
Add backend counterpart for this, for now accept any credentials
after login and proceeding info page
use material UI and google icons to fill our info page fetch the info from backend and use fakerjs to fill in the data needed for this user info page

add a nginx setup to connect both backend and frontend to a single port and avoid cors issue
```

**Context**: Request to create a full-stack monorepo with React frontend and Express backend

**Result**:
- Created monorepo structure (frontend/, backend/, nginx/)
- Setup Vite + React + TypeScript + Material UI
- Setup Express + TypeScript + Faker.js
- Created login and user info pages
- Created backend API endpoints
- Setup Nginx reverse proxy

---

### Prompt 12: Feature-Driven Development Request
```
follow Feature driven development for the frontend structure
```

**Context**: Request to reorganize frontend using FDD architecture

**Result**:
- Reorganized frontend into feature-based modules
- Created features/auth with components, hooks, API, pages, types
- Created features/user with components, hooks, API, pages, types
- Created shared API client and types
- Updated all imports to use feature modules

---

### Prompt 13: TypeScript Organization Request
```
make sure to separate the typescript definitions into their own file system
```

**Context**: Request to properly organize TypeScript type definitions

**Result**:
- Created separate types/ directory in each feature
- Created auth.types.ts for authentication types
- Created user.types.ts for user types
- Updated all imports to use feature-specific types
- Created shared types re-exports

---

### Prompt 14: Replace Docker with Startup Scripts
```
i only wwant a script that runs the nginx frontend and backend no need for a docker setup
```

**Context**: Request to remove Docker setup and create simple startup scripts

**Result**:
- Removed docker-compose.yml
- Created start.sh script to run all services with one command
- Created stop.sh script to stop all services
- Updated .gitignore for PID files
- Updated PROJECT_README.md with new startup instructions

---

## Summary Statistics

**Session Date**: 2025-11-22 to 2025-11-23
**Total Prompts**: 14
**Tasks Completed**:
- Repository setup and GitHub integration
- Documentation system established
- PR template with comprehensive checklists
- Complete PR workflow (create, merge, cleanup)
- Prompt logging system
- Full-stack monorepo setup
- Feature-Driven Development architecture
- TypeScript type organization

**Files Created**:
- SESSION_LOG.md (interaction history)
- CLAUDE_INSTRUCTIONS.md (context for future sessions)
- USER_PROMPTS.md (this file)
- .github/pull_request_template.md (React PR template)
- README.md (repository overview)
- PROJECT_README.md (comprehensive project documentation)
- Frontend: Complete FDD structure with auth and user features
- Backend: Express API with Faker.js integration
- Nginx: Reverse proxy configuration
- start.sh & stop.sh: Startup/shutdown scripts for all services
