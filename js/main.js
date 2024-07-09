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
  container.innerHTML = "";
  dailyData.forEach((item) => {
    const div = document.createElement("div");
    div.textContent = `${item.title}: Daily - Current: ${item.daily.current}, Previous: ${item.daily.previous}`;
    container.appendChild(div);
  });
}

function renderWeeklyData(weeklyData) {
  const container = document.getElementById("panel-weekly");
  container.innerHTML = "";
  weeklyData.forEach((item) => {
    const div = document.createElement("div");
    div.textContent = `${item.title}: Weekly - Current: ${item.weekly.current}, Previous: ${item.weekly.previous}`;
    container.appendChild(div);
  });
}

function renderMonthlyData(monthlyData) {
  const container = document.getElementById("panel-monthly");
  container.innerHTML = "";
  monthlyData.forEach((item) => {
    const div = document.createElement("div");
    div.textContent = `${item.title}: Monthly - Current: ${item.monthly.current}, Previous: ${item.monthly.previous}`;
    container.appendChild(div);
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
