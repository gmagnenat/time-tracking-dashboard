const tabsContainer = document.getElementById("tabs-container");
const tabsList = document.getElementById("tabs");
const tabButtons = tabsList.querySelectorAll("a");
const tabPanels = tabsContainer.querySelectorAll(".tab__panel");

const isDesktop = window.matchMedia("(min-width: 60em)");

tabsList.setAttribute("role", "tablist");
// tabsList.querySelectorAll("li").forEach((listItem) => {
//   listItem.setAttribute("role", "presentation");
// });

tabButtons.forEach((tab, index) => {
  tab.setAttribute("role", "tab");
  if (index === 0) {
    tab.setAttribute("aria-selected", "true");
  } else {
    tab.setAttribute("tabindex", "-1");
    tabPanels[index].setAttribute("hidden", "");
  }
});

tabPanels.forEach((panel) => {
  panel.setAttribute("role", "tabpanel");
  panel.setAttribute("tabindex", "0");
});

// store fetched data
let fetchedData = null;

// function to fetch data from the json file
async function fetchData() {
  try {
    const response = await fetch("data.json");
    if (!response.ok) {
      throw new Error("Failed to fetch data.");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error.message);
    throw error;
  }
}

// function to process data and return specific timeframe data
function processData(data, timeframe) {
  return data.map((item) => ({
    title: item.title,
    data: item.timeframes[timeframe],
  }));
}

function createStatCard(item, timeframeLabel) {
  const statCard = document.createElement("section");
  statCard.classList.add("stat-card");
  statCard.setAttribute("aria-label", item.title);
  statCard.innerHTML = `
    <div class="stat-card__container">
      <div class="stat-card__header">
        <h3><a href="#" class="stat-card__title">${item.title}</a></h3>
        <button class="stat-card__menu-toggle" aria-label="menu - ${item.title}" aria-expanded="false">···</button>
      </div>
      <div class="stat-card__timeframes">
        <p class="stat-card__data-current"><time datetime="PT${item.data.current}H">${item.data.current}hrs</time></p>
        <p class="stat-card__data-previous">${timeframeLabel} - <time datetime="PT${item.data.previous}H">${item.data.previous}hrs</time> </p>
      </div>
    </div>
  `;
  return statCard;
}

function renderData(data, panelId, timeframeLabel) {
  const container = document.getElementById(panelId);
  container.innerHTML = "<div class='stats__wrapper'></div>";
  const statsWrapper = container.querySelector(".stats__wrapper");
  statsWrapper.innerHTML = "";
  data.forEach((item) => {
    const statCard = createStatCard(item, timeframeLabel);
    statsWrapper.appendChild(statCard);
  });
}

// function to fetch data by a given timeframe and panelId
async function initializeTimeframe(timeframe, panelId, timeframeLabel) {
  try {
    if (!fetchedData) {
      fetchedData = await fetchData();
    }
    const processedData = processData(fetchedData, timeframe);
    renderData(processedData, panelId, timeframeLabel);
  } catch (error) {
    console.error("Error initializing timeframe:", error.message);
  }
}

// fetch data when tab is clicked
tabButtons.forEach((tab) => {
  tab.addEventListener("click", async (e) => {
    e.preventDefault();

    // get the clicked tab
    const clickedTab = e.target.closest("a");

    // switch tab
    switchTab(clickedTab);
  });

  // default event listeners for mobile
  if (!isDesktop.matches) {
    tab.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "ArrowLeft":
          moveLeft();
          break;
        case "ArrowRight":
          moveRight();
          break;
        case "Home":
          e.preventDefault();
          switchTab(tabButtons[0]);
          break;
        case "End":
          e.preventDefault();
          switchTab(tabButtons[tabButtons.length - 1]);
          break;
      }
    });
  }

  // event listeners for desktop
  if (isDesktop.matches) {
    tab.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "ArrowUp":
          moveLeft();
          break;
        case "ArrowDown":
          moveRight();
          break;
        case "Home":
          e.preventDefault();
          switchTab(tabButtons[0]);
          break;
        case "End":
          e.preventDefault();
          switchTab(tabButtons[tabButtons.length - 1]);
          break;
      }
    });
  }
});

function moveLeft() {
  const currentTab = document.activeElement;
  const previousTab = currentTab.previousElementSibling;
  if (!previousTab) {
    switchTab(tabButtons[tabButtons.length - 1]);
  } else {
    switchTab(previousTab);
  }
}

function moveRight() {
  const currentTab = document.activeElement;
  if (!currentTab.nextElementSibling) {
    switchTab(tabButtons[0]);
  } else {
    switchTab(currentTab.nextElementSibling);
  }
}

function switchTab(newTab) {
  const activePanelId = newTab.getAttribute("href");
  const activePanel = tabsContainer.querySelector(activePanelId);

  tabButtons.forEach((button) => {
    button.setAttribute("aria-selected", false);
    button.setAttribute("tabindex", "-1");
  });

  tabPanels.forEach((panel) => panel.setAttribute("hidden", true));
  activePanel.removeAttribute("hidden");

  newTab.setAttribute("aria-selected", true);
  newTab.setAttribute("tabindex", "0");
  newTab.focus();
}

// Initialize daily data on page load
window.addEventListener("DOMContentLoaded", async () => {
  // I initialize all panels here but it's possible to initialize only the default panel and the other ones when they are clicked
  await initializeTimeframe("daily", "panel-daily", "Yesterday");
  await initializeTimeframe("weekly", "panel-weekly", "Last Week");
  await initializeTimeframe("monthly", "panel-monthly", "Last Month");
});
