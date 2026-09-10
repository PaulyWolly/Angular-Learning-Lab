import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CRUMB_CORE, CRUMB_HOME } from '../../../shared/directives/lesson-breadcrumb/crumb-presets';
import { LessonBreadcrumbComponent } from '../../../shared/directives/lesson-breadcrumb/lesson-breadcrumb.component';
import { LessonSyntaxComponent } from '../../../shared/lesson-syntax/lesson-syntax.component';

@Component({
  selector: 'app-setup-lab',
  standalone: true,
  imports: [RouterLink, LessonBreadcrumbComponent, LessonSyntaxComponent],
  templateUrl: './setup-lab.component.html',
  styleUrl: './setup-lab.component.scss',
})
export class SetupLabComponent {
  readonly crumbs = [CRUMB_HOME, CRUMB_CORE, { label: 'Setup · Node · NVM · CLI' }];

  readonly whyTs = `// Why NVM (Node Version Manager)?
// - Angular projects pin a Node major (e.g. 20 or 22).
// - Without NVM you install one global Node and fight version conflicts.
// - With NVM you switch: nvm use 22  →  correct Node for this repo.`;

  readonly whyTpl = `# Check what you have now (run in a terminal)
node -v
npm -v

# Ideal for this lab (Angular 20): Node 20 LTS or 22 LTS
# If "node" is not recognized → install NVM, then Node (next cards).`;

  readonly nvmWinTs = `// Windows — use nvm-windows (NOT the Unix nvm script)
// Download installer:
// https://github.com/coreybutler/nvm-windows/releases
// Install "nvm-setup.exe", then open a NEW terminal.`;

  readonly nvmWinTpl = `# After nvm-windows is installed (new PowerShell / Git Bash / CMD):
nvm version

# Install a Node LTS, then select it:
nvm install 22
nvm use 22

node -v
npm -v`;

  readonly nvmUnixTs = `// macOS / Linux — classic nvm (bash/zsh)
// Install script (official):
// https://github.com/nvm-sh/nvm#installing-and-updating`;

  readonly nvmUnixTpl = `# Install nvm (then restart the terminal or source your profile)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

# Install + use Node LTS
nvm install --lts
nvm use --lts

node -v
npm -v`;

  readonly nvmModal = `# Windows (nvm-windows)
nvm install 22
nvm use 22
nvm list

# macOS / Linux (nvm-sh)
nvm install --lts
nvm use --lts
nvm ls

# Tip: put an .nvmrc file in a project root with "22"
# then: nvm use   (reads .nvmrc)`;

  readonly cliTs = `// Angular CLI is the official scaffold + build tool.
// Install it once globally (or use npx without a global install).`;

  readonly cliTpl = `# Global CLI (recommended while learning)
npm install -g @angular/cli

# Verify
ng version

# Prefer not to install globally?
npx -y @angular/cli@20 version`;

  readonly cliModal = `# Create a brand-new Angular app
ng new my-app --defaults
cd my-app
ng serve

# Or without a global CLI:
npx -y @angular/cli@20 new my-app --defaults
cd my-app
npm start`;

  readonly newAppTs = `// What ng new gives you
// - angular.json     → build / serve config
// - package.json     → scripts + dependencies
// - src/app/         → components, routes, config
// - src/main.ts      → bootstrapApplication(...)`;

  readonly newAppTpl = `# Scaffold (standalone + routing prompts depend on CLI flags)
ng new hello-angular --defaults --routing --style=scss

cd hello-angular
npm start
# → http://localhost:4200/

# Useful flags when creating:
#   --routing          add AppRoutingModule / routes file
#   --style=scss       SCSS instead of CSS
#   --ssr=false        skip SSR if you want a classic SPA`;

  readonly thisLabTs = `// This repo: Angular Learning Lab
// Remote: https://github.com/PaulyWolly/Angular-Learning-Lab
// Dev server port in package.json: 4201`;

  readonly thisLabTpl = `# Clone (or open your local copy)
git clone https://github.com/PaulyWolly/Angular-Learning-Lab.git
cd Angular-Learning-Lab

# Use the Node version you installed via NVM
nvm use 22   # Windows nvm-windows / Unix nvm

npm install
npm start
# → http://localhost:4201/

# Optional: work on the lab branch
git checkout dev`;

  readonly thisLabModal = `# package.json scripts used here
npm install   # install node_modules from package-lock.json
npm start     # ng serve --port 4201
npm run build # production build → dist/

# If port 4201 is busy:
npx ng serve --port 4202`;

  readonly checklistTs = `// Quick “am I ready?” checklist
// [ ] nvm available in a NEW terminal
// [ ] node -v shows 20.x or 22.x
// [ ] npm -v works
// [ ] ng version (or npx @angular/cli version) works
// [ ] npm start opens the app in the browser`;

  readonly checklistTpl = `# One-shot verify (copy/paste)
node -v && npm -v && (ng version || npx -y @angular/cli@20 version)`;
}
