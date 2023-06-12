chrome.alarms.onAlarm.addListener(function (alarm) {
  chrome.storage.sync.get("notificationsEnabled", function (data) {
    if (data.notificationsEnabled) {
      if (alarm.name.startsWith("taskAlarm:")) {
        const taskText = alarm.name.substring("taskAlarm:".length);
        const notificationOptions = {
          type: "basic",
          iconUrl: "icon.png", // Extension's icon path
          title: "Task Reminder",
          message: `It's time for: ${taskText}`
        };
         chrome.notifications.create(`taskNotification:${taskText}`, notificationOptions);
      }
    }
  });  
  chrome.storage.sync.get("notificationsEnabled", function (data) {
    if (!data.notificationsEnabled) {
      chrome.storage.sync.set({ notificationsEnabled: true });
    }
  });
});