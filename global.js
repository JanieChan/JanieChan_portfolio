console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const autoLabel = prefersDark ? "Automatic (Dark)" : "Automatic (Light)";
document.body.insertAdjacentHTML(
  'afterbegin',
  `
	<label class="color-scheme">
		Theme:
		<select>
			<option value="light" >Light</option>
      <option value="dark">Dark</option>
      <option value="light dark">${autoLabel}</option>
		</select>
	</label>`,
);
// navLinks = $$("nav a");

// let currentLink = navLinks.find(
//   (a) => a.host === location.host && a.pathname === location.pathname,
// );

// currentLink?.classList.add('current');

let pages = [
  { url: '', title: 'Home' },
  { url: 'projects/', title: 'Projects' },
  { url: 'https://github.com/JanieChan', title: 'Github'},
  { url: 'contact/', title: 'Contact' },
  { url: 'resume/', title: 'Resume' },
];
const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
  ? "/"                  // Local server
  : "/JanieChan_portfolio/";         // GitHub Pages repo name
  
let nav = document.createElement('nav');
document.body.prepend(nav);

for (let p of pages) {
  let url = p.url;
  let title = p.title;
  url = !url.startsWith('http') ? BASE_PATH + url : url;
  let a = document.createElement('a');
  a.href = url;
  a.textContent = title;
  nav.append(a);
  a.classList.toggle(
    'current',
    a.host === location.host && a.pathname === location.pathname,
  );
  if (a.host !== location.host) {
    a.target = "_blank";
  }
}
let select = document.querySelector('.color-scheme select');
function setColorScheme(colorScheme) {
  if (colorScheme === 'color-scheme') {
    document.documentElement.style.removeProperty('color-scheme');
  } else {
    document.documentElement.style.setProperty('color-scheme', colorScheme);
  }
}
if ("colorScheme" in localStorage) {
  let saved = localStorage.colorScheme;
  setColorScheme(saved);
  select.value = saved;
}
select.addEventListener('input', function (event) {
  let newScheme = event.target.value;
  console.log('color scheme changed to', newScheme);
  setColorScheme(newScheme);
  localStorage.colorScheme = newScheme;
});

let form = document.querySelector('form');
form?.addEventListener('submit', function (event) {
  event.preventDefault();
  let data = new FormData(form);
  let url = form.action + '?';
  let params = [];
  for (let [name, value] of data) {
    console.log(name, value);
    if (name === 'Message') {
      params.push(`body=${encodeURIComponent(value)}`);
    } else {
      params.push(`${name}=${encodeURIComponent(value)}`);
    }
  }
  url += params.join('&');
  location.href = url;
});
export async function fetchJSON(url) {
  try {
    // Fetch the JSON file from the given URL
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching or parsing JSON data:', error);
  }
}