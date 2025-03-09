if (!document.getElementById("pluginFloatingIcon")) {
    const icon = document.createElement("div");
    icon.id = "pluginFloatingIcon";
    icon.innerText = "🔖"; 
    icon.style.position = "fixed";
    icon.style.bottom = "20px";
    icon.style.right = "20px";
    icon.style.width = "40px";
    icon.style.height = "40px";
    icon.style.background = "#3498db";
    icon.style.color = "white";
    icon.style.fontSize = "24px";
    icon.style.borderRadius = "50%";
    icon.style.display = "flex";
    icon.style.alignItems = "center";
    icon.style.justifyContent = "center";
    icon.style.cursor = "pointer";
    icon.style.boxShadow = "0px 4px 6px rgba(0,0,0,0.1)";
    icon.style.zIndex = "1000";
  
    icon.addEventListener("click", function () {
      toggleFloatingMenu();
    });
  
    document.body.appendChild(icon);
  }
  
  function toggleFloatingMenu() {
    let menu = document.getElementById("pluginFloatingMenu");
  
    if (menu) {
      menu.remove();
      return;
    }
  
    menu = document.createElement("div");
    menu.id = "pluginFloatingMenu";
    menu.style.position = "fixed";
    menu.style.bottom = "70px";
    menu.style.right = "20px";
    menu.style.width = "200px";
    menu.style.padding = "10px";
    menu.style.background = "white";
    menu.style.border = "1px solid #ddd";
    menu.style.boxShadow = "0px 4px 6px rgba(0,0,0,0.1)";
    menu.style.borderRadius = "5px";
    menu.style.zIndex = "1001";
  
    menu.innerHTML = `
      <p style="margin: 0; font-size: 14px;">Save this page?</p>
      <button id="saveArticleBtn" style="width: 100%; margin-top: 5px; padding: 5px;">Save</button>
    `;
  
    document.body.appendChild(menu);
  
    document.getElementById("saveArticleBtn").addEventListener("click", function () {
      const pageUrl = window.location.href;
      chrome.storage.sync.get({ articles: [] }, function (data) {
        const updatedArticles = [...data.articles, pageUrl];
        chrome.storage.sync.set({ articles: updatedArticles }, function () {
          alert("Article saved!");
          menu.remove();
        });
      });
    });
  }
  