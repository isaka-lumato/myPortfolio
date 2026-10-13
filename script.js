const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');

menuButton?.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
  navigation?.classList.toggle('is-open', !isOpen);
});

navigation?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', 'Open navigation');
    navigation.classList.remove('is-open');
  });
});

document.querySelector('#year').textContent = new Date().getFullYear();

const skillContent = {
  creative: {
    number: '01',
    name: 'Creative thinking',
    description: 'I shape the concept, then decide how it should look and sound. The Inkryptus twin-me ad and the Simba SC skit are two very different examples.',
  },
  editing: {
    number: '02',
    name: 'Video editing',
    description: 'I bring footage, sound, timing, and motion together so the idea stays clear and the edit keeps its energy.',
  },
  programming: {
    number: '03',
    name: 'Programming',
    description: 'I turn app ideas into usable software, breaking a big problem into smaller pieces and working through the code until it runs.',
  },
  ai: {
    number: '04',
    name: 'AI workflows',
    description: 'I use AI for film, visuals, motion graphics, and software, then decide what works and shape it into the finished piece.',
  },
};

const skillTabs = [...document.querySelectorAll('.skill-tab')];
const skillPanel = document.querySelector('#skill-panel');

function activateSkill(tab) {
  const skill = skillContent[tab.dataset.skill];
  if (!skill) return;

  skillTabs.forEach((item) => {
    const isActive = item === tab;
    item.classList.toggle('is-active', isActive);
    item.setAttribute('aria-selected', String(isActive));
    item.tabIndex = isActive ? 0 : -1;
  });

  skillPanel.setAttribute('aria-labelledby', tab.id);
  document.querySelector('#skill-count').textContent = skill.number;
  document.querySelector('#skill-name').textContent = skill.name;
  document.querySelector('#skill-description').textContent = skill.description;
  document.querySelector('#skill-mark').textContent = skill.number;
}

skillTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activateSkill(tab));
  tab.addEventListener('keydown', (event) => {
    let nextIndex = index;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % skillTabs.length;
    else if (event.key === 'ArrowLeft') nextIndex = (index - 1 + skillTabs.length) % skillTabs.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = skillTabs.length - 1;
    else return;

    event.preventDefault();
    skillTabs[nextIndex].focus();
    activateSkill(skillTabs[nextIndex]);
  });
});

function makePlayer(button) {
  const platform = button.dataset.platform;
  const videoId = button.dataset.videoId;
  const source = platform === 'youtube'
    ? `https://www.youtube-nocookie.com/embed/${videoId}?rel=0`
    : `https://www.instagram.com/reel/${videoId}/embed/?hidecaption=true`;
  const iframe = document.createElement('iframe');
  iframe.className = `video-frame${platform === 'youtube' ? ' is-youtube' : ' is-instagram'}`;
  iframe.src = source;
  iframe.title = button.dataset.videoTitle;
  iframe.loading = 'eager';
  iframe.allow = 'accelerometer; encrypted-media; gyroscope; picture-in-picture; web-share';
  iframe.allowFullscreen = true;
  iframe.referrerPolicy = 'strict-origin-when-cross-origin';
  return iframe;
}

document.querySelectorAll('.watch-toggle').forEach((button) => {
  button.addEventListener('click', () => {
    const wasOpen = button.getAttribute('aria-expanded') === 'true';
    button.dataset.playLabel ||= button.childNodes[0]?.textContent.trim() || 'Play this video';

    document.querySelectorAll('.watch-toggle[aria-expanded="true"]').forEach((openButton) => {
      openButton.setAttribute('aria-expanded', 'false');
      openButton.innerHTML = `${openButton.dataset.playLabel} <span aria-hidden="true">▶</span>`;
      const openShell = document.getElementById(openButton.getAttribute('aria-controls'));
      openShell.hidden = true;
      openShell.querySelector('.player-mount').replaceChildren();
    });

    if (wasOpen) return;

    const shell = document.getElementById(button.getAttribute('aria-controls'));
    shell.querySelector('.player-mount').append(makePlayer(button));
    shell.hidden = false;
    button.setAttribute('aria-expanded', 'true');
    button.innerHTML = 'Close player <span aria-hidden="true">×</span>';
  });
});
