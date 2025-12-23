function createButton() {
    const btn = document.createElement('button');
    btn.className = 'pr-merger-btn btn';
    btn.innerText = '✨ Auto Squash';
    btn.type = 'button';
    btn.onclick = handleAutoSquash;
    return btn;
}

function extractTicket(element) {
    if (!element) return [];
    const text = element.innerText;
    // Regex to find things like JIRA-123, PROJ-456.
    const ticketRegex = /([A-Z]+-\d+)/g;
    const matches = text.match(ticketRegex);
    if (matches && matches.length > 0) {
        const unique = [...new Set(matches)];
        return unique.map(t => {
            const link = Array.from(element.querySelectorAll('a')).find(a => a.innerText.includes(t));
            return {
                id: t,
                url: link ? link.href : null
            };
        });
    }
    return [];
}

function determinePrefix(branchName) {
    if (branchName.startsWith('fix/') || branchName.startsWith('bugfix/')) return 'fix():';
    if (branchName.startsWith('feat/') || branchName.startsWith('feature/')) return 'feat():';
    if (branchName.startsWith('chore/')) return 'chore():';
    if (branchName.startsWith('docs/')) return 'docs():';
    return 'feat():';
}

function handleAutoSquash() {
    console.log('PR Merger: Starting Auto Squash...');

    // 1. Get Metadata
    const titleElement = document.querySelector('.js-issue-title');
    const numberElement = document.querySelector('.gh-header-number');
    const bodyElement = document.querySelector('.comment-body');
    const branchElement = document.querySelector('.head-ref');

    if (!titleElement || !numberElement) {
        alert('Could not find PR title or number. Is the page fully loaded?');
        return;
    }

    const prTitle = titleElement.innerText.trim();
    const prNumber = numberElement.innerText.trim();
    const prBody = bodyElement ? bodyElement.innerText : '';
    const branchName = branchElement ? branchElement.innerText.trim() : '';

    // 2. Compute New Values
    const prefix = determinePrefix(branchName);
    const tickets = extractTicket(bodyElement);

    let newTitle = prTitle;
    const commonPrefixes = ['feat', 'fix', 'chore', 'docs', 'refactor', 'test', 'ci', 'perf'];
    const hasExistingPrefix = commonPrefixes.some(p => prTitle.toLowerCase().startsWith(p));

    if (!hasExistingPrefix) {
        newTitle = `${prefix} ${prTitle}`;
    }

    let newBody = '';
    if (tickets.length > 0) {
        newBody += `Tickets:\n`;
        tickets.forEach(t => {
            if (t.url) {
                newBody += `- ${t.url}\n`;
            } else {
                newBody += `- ${t.id}\n`;
            }
        });
    }

    const footer = `${prNumber}`;
    const finalBody = `${newBody}\n${footer}`.trim();

    // Combined Content for Single Box
    const combinedContent = `${newTitle}\n\n${finalBody}`;

    // 3. Show Sidebar
    toggleSidebar(combinedContent);
}

function toggleSidebar(content) {
    let sidebar = document.getElementById('pr-merger-sidebar');

    if (sidebar) {
        const textarea = sidebar.querySelector('textarea');
        if (textarea) textarea.value = content;
        sidebar.style.display = 'flex';
        return;
    }

    // Create Sidebar
    sidebar = document.createElement('div');
    sidebar.id = 'pr-merger-sidebar';
    sidebar.className = 'pr-merger-sidebar';

    // Header
    const header = document.createElement('div');
    header.className = 'pr-merger-sidebar-header';
    header.innerHTML = '<h3>Squash Payload</h3>';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'pr-merger-close-btn';
    closeBtn.innerText = '×';
    closeBtn.onclick = () => {
        sidebar.style.display = 'none';
    };
    header.appendChild(closeBtn);

    // Content
    const bodyDiv = document.createElement('div');
    bodyDiv.className = 'pr-merger-sidebar-body';

    const textarea = document.createElement('textarea');
    textarea.className = 'pr-merger-textarea';
    textarea.value = content;
    textarea.rows = 20;
    bodyDiv.appendChild(textarea);

    const copyBtn = document.createElement('button');
    copyBtn.className = 'btn btn-primary pr-merger-copy-btn btn-block';
    copyBtn.innerText = 'Copy All';
    copyBtn.onclick = () => {
        navigator.clipboard.writeText(textarea.value).then(() => {
            const originalText = copyBtn.innerText;
            copyBtn.innerText = 'Copied!';
            setTimeout(() => copyBtn.innerText = originalText, 1500);
        });
    };
    bodyDiv.appendChild(copyBtn);

    sidebar.appendChild(header);
    sidebar.appendChild(bodyDiv);
    document.body.appendChild(sidebar);
}

// Observer to inject button
const observer = new MutationObserver((mutations) => {
    const buttonGroup = document.querySelector('.discussion-timeline-actions');
    if (buttonGroup && !document.querySelector('.pr-merger-btn')) {
        const btn = createButton();
        buttonGroup.insertBefore(btn, buttonGroup.firstChild);
    }
});

observer.observe(document.body, { childList: true, subtree: true });

setTimeout(() => {
    const buttonGroup = document.querySelector('.discussion-timeline-actions');
    if (buttonGroup && !document.querySelector('.pr-merger-btn')) {
        const btn = createButton();
        buttonGroup.insertBefore(btn, buttonGroup.firstChild);
    }
}, 1000);
