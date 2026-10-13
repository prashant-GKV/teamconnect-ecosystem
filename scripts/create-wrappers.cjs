const fs = require('fs');
const path = require('path');

const uiDir = path.resolve(__dirname, '../teamconnect-frontend/src/components/ui');
const sharedDir = path.resolve(__dirname, '../teamconnect-frontend/src/components/shared');
const layoutDir = path.resolve(__dirname, '../teamconnect-frontend/src/components/layout');

const uiMap = {
  'Button.tsx': 'button',
  'Input.tsx': 'input',
  'Card.tsx': 'card',
  'Modal.tsx': 'modal',
  'Avatar.tsx': 'avatar',
  'Badge.tsx': 'badge',
  'ConfirmDialog.tsx': 'confirm-dialog',
  'Drawer.tsx': 'drawer',
  'EmptyState.tsx': 'empty-state',
  'ErrorState.tsx': 'error-state',
  'InlineAlert.tsx': 'inline-alert',
  'PermissionGate.tsx': 'permission-gate',
  'ProgressBar.tsx': 'progress-bar',
  'Skeleton.tsx': 'skeleton',
  'Textarea.tsx': 'textarea',
  'Toast.tsx': 'toast',
};

const sharedMap = {
  'AppLoadingScreen.tsx': 'app-loading-screen',
  'CreateRequestModal.tsx': 'create-request-modal',
  'CreateTaskModal.tsx': 'create-task-modal',
  'MembershipValidityBar.tsx': 'membership-validity-bar',
  'PageHeader.tsx': 'page-header',
  'StatCard.tsx': 'stat-card',
  'Stepper.tsx': 'stepper',
  'SubmitTaskModal.tsx': 'submit-task-modal',
  'Timeline.tsx': 'timeline',
};

const layoutMap = {
  'Sidebar.tsx': 'sidebar',
  'Topbar.tsx': 'topbar',
  'MobileNav.tsx': 'mobile-nav',
  'ImpersonateSwitcher.tsx': 'impersonate-switcher',
  'ThemeToggle.tsx': 'theme-toggle',
};

for (const [target, src] of Object.entries(uiMap)) {
  fs.writeFileSync(path.join(uiDir, target), `export * from "./${src}";\n`);
}

for (const [target, src] of Object.entries(sharedMap)) {
  fs.writeFileSync(path.join(sharedDir, target), `export * from "./${src}";\n`);
}

for (const [target, src] of Object.entries(layoutMap)) {
  fs.writeFileSync(path.join(layoutDir, target), `export * from "./${src}";\n`);
}

console.log('All PascalCase component files generated successfully.');
