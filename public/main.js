const dashboardHeader = document.getElementById("dashboard-header");
const tabsContainer = document.getElementById("tabs-container");
const tabsList = document.getElementById("tabs");
const tabButtons = tabsList.querySelectorAll("a");
const tabPanels = tabsContainer.querySelectorAll(".tab__panel");

// ---Panels---
const dailyPanel = document.getElementById("panel-daily");
const weeklyPanel = document.getElementById("panel-weekly");
const monthlyPanel = document.getElementById("panel-monthly");

async function fetchData() {
  const response = await fetch("data.json");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return await response.json();
}

function getDailyData(data) {
  return data.map((item) => ({
    title: item.title,
    daily: item.timeframes.daily,
  }));
}

function getWeeklyData(data) {
  return data.map((item) => ({
    title: item.title,
    weekly: item.timeframes.weekly,
  }));
}

function getMonthlyData(data) {
  return data.map((item) => ({
    title: item.title,
    monthly: item.timeframes.monthly,
  }));
}

function renderDailyData(dailyData) {
  const container = document.getElementById("panel-daily");
  container.innerHTML = "<div class='stats__wrapper'></div>";
  dailyData.forEach((item) => {
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
            <p class="stat-card__data-current">${item.daily.current}hrs</p>
            <p class="stat-card__data-previous">Yesterday - ${item.daily.previous}hrs</p>
          </div>
        </div>
      `;
    container.querySelector(".stats__wrapper").appendChild(statCard);
  });
}

function renderWeeklyData(weeklyData) {
  const container = document.getElementById("panel-weekly");
  container.innerHTML = "<div class='stats__wrapper'></div>";
  weeklyData.forEach((item) => {
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
            <p class="stat-card__data-current">${item.weekly.current}hrs</p>
            <p class="stat-card__data-previous">Last Week - ${item.weekly.previous}hrs</p>
          </div>
        </div>
      `;
    container.querySelector(".stats__wrapper").appendChild(statCard);
  });
}

function renderMonthlyData(monthlyData) {
  const container = document.getElementById("panel-monthly");
  container.innerHTML = "<div class='stats__wrapper'></div>";
  monthlyData.forEach((item) => {
    const statCard = document.createElement("div");
    statCard.classList.add("stat-card");
    statCard.setAttribute("data-title", item.title);
    statCard.innerHTML = `
        <div class="stat-card__container" data-title="${item.title}">
          <div class="stat-card__header">
            <h3 class="stat-card__title">${item.title}</h3>
            <a href="#" class="stat-card__more-infos" aria-label="${item.title} stats details">···</a>
          </div>
          <div class="stat-card__timeframes">
            <p class="stat-card__data-current">${item.monthly.current}hrs</p>
            <p class="stat-card__data-previous">Last Month - ${item.monthly.previous}hrs</p>
          </div>
        </div>
      `;
    container.querySelector(".stats__wrapper").appendChild(statCard);
  });
}

fetchData().then((data) => {
  const dailyData = getDailyData(data);
  const weeklyData = getWeeklyData(data);
  const monthlyData = getMonthlyData(data);

  renderDailyData(dailyData);
  renderWeeklyData(weeklyData);
  renderMonthlyData(monthlyData);
});

// ---Tabs---
tabButtons.forEach((tab, index) => {
  if (index === 0) {
  } else {
    tabPanels[index].setAttribute("hidden", true);
  }
});

dashboardHeader.addEventListener("click", (e) => {
  const clickedTab = e.target.closest("a");
  if (!clickedTab) return;
  e.preventDefault();

  const activePanelId = clickedTab.getAttribute("href");
  const activePanel = tabsContainer.querySelector(activePanelId);

  // loop through all pannels and hide them
  tabPanels.forEach((panel) => {
    panel.setAttribute("hidden", true);
  });
  activePanel.removeAttribute("hidden");
});
