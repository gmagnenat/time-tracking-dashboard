const tabsContainer = document.getElementById("tabs-container");
const tabsList = document.getElementById("tabs");
const tabButtons = tabsList.querySelectorAll("a");
const tabPanels = tabsContainer.querySelectorAll(".tab__panel");

tabsList.setAttribute("role", "tablist");
tabsList.querySelectorAll("li").forEach((listItem) => {
  listItem.setAttribute("role", "presentation");
});

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

function createStatCard(item) {
  const statCard = document.createElement("div");
  statCard.classList.add("stat-card");
  statCard.setAttribute("data-title", item.title);
  statCard.innerHTML = `
    <div class="stat-card__container">
      <div class="stat-card__header">
        <h3 class="stat-card__title">${item.title}</h3>
        <a href="#" class="stat-card__more-infos" aria-label="${item.title} stats details">···</a>
      </div>
      <div class="stat-card__timeframes">
        <p class="stat-card__data-current">${item.data.current}hrs</p>
        <p class="stat-card__data-previous">Yesterday - ${item.data.previous}hrs</p>
      </div>
    </div>
  `;
  return statCard;
}

function renderData(data, panelId) {
  const container = document.getElementById(panelId);
  container.innerHTML = "<div class='stats__wrapper'></div>";
  const statsWrapper = container.querySelector(".stats__wrapper");
  statsWrapper.innerHTML = "";
  data.forEach((item) => {
    const statCard = createStatCard(item);
    statsWrapper.appendChild(statCard);
  });
}

// function to fetch data by a given timeframe and panelId
async function initializeTimeframe(timeframe, panelId) {
  try {
    if (!fetchedData) {
      fetchedData = await fetchData();
    }
    const processedData = processData(fetchedData, timeframe);
    renderData(processedData, panelId);
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
    // if (!clickedTab) return;

    // // set timeframes and the panel to be displayed
    // const timeframe = clickedTab.getAttribute("data-timeframe");
    // const panelId = clickedTab.getAttribute("href").substring(1);

    // switch tab
    switchTab(clickedTab);

    // fetch data for the selected timeframe and render it to the active panel
    // await initializeTimeframe(timeframe, panelId);
  });

  tab.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "ArrowLeft":
        moveLeft();
        break;
      case "ArrowRight":
        moveRight();
        break;
    }
  });
});

function moveLeft() {
  const currentTab = document.activeElement;
  if (!currentTab.parentElement.previousElementSibling) {
    switchTab(tabButtons[tabButtons.length - 1]);
  } else {
    switchTab(
      currentTab.parentElement.previousElementSibling.querySelector("a")
    );
  }
}

function moveRight() {
  const currentTab = document.activeElement;
  if (!currentTab.parentElement.nextElementSibling) {
    switchTab(tabButtons[0]);
  } else {
    switchTab(currentTab.parentElement.nextElementSibling.querySelector("a"));
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
  await initializeTimeframe("daily", "panel-daily");
  await initializeTimeframe("weekly", "panel-weekly");
  await initializeTimeframe("monthly", "panel-monthly");
});
