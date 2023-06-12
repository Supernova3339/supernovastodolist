document.addEventListener("DOMContentLoaded", function () {
    const themeToggle = document.getElementById("theme-toggle-input");
    const notificationToggle = document.getElementById("notification-toggle-input");
  
    // Theme toggle event listener
    themeToggle.addEventListener("change", function () {
      const theme = themeToggle.checked ? "dark" : "light";
      chrome.storage.sync.set({ theme: theme });
      document.body.classList.toggle("dark-mode");
    });

    // Notification toggle event listener
  notificationToggle.addEventListener("change", function () {
    const notificationsEnabled = notificationToggle.checked;
    chrome.storage.sync.set({ notificationsEnabled: notificationsEnabled });
  });
  
    // Retrieve theme preference from storage
    chrome.storage.sync.get("theme", function (data) {
      if (data.theme === "dark") {
        themeToggle.checked = true;
        document.body.classList.add("dark-mode");
      }
    });

    // Retrieve notification preference from storage
    chrome.storage.sync.get("notificationsEnabled", function (data) {
      if (data.notificationsEnabled) {
        notificationToggle.checked = true;
      }
    });
  });