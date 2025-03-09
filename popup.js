document.addEventListener('DOMContentLoaded', function () {
  const interestList = document.getElementById("interestList");
  const addInterestButton = document.getElementById("addInterest");
  const toggleSettingsButton = document.getElementById("toggleSettingsBtn");
  const toggleHistoryBtn = document.getElementById("toggleHistoryBtn");
  const togglePlannedBtn = document.getElementById("togglePlannedBtn");
  const toggleNotificationsBtn = document.getElementById("toggleNotificationsBtn");
  const toggleArticlesBtn = document.getElementById("toggleArticlesBtn");
  const articlesArrow = document.getElementById("articlesArrow");

  const interestSettingsDiv = document.getElementById("interestSettings");
  const settingsIcon = document.getElementById("settingsIcon");

  const facts = [
    "Fact 1",
    "Fact 2",
    "Fact 3"
  ];

  let currentFactIndex = 0;

  function showFact(index) {
    document.getElementById("dailyFactText").innerText = facts[index];
  }

  document.getElementById("moreFactBtn").addEventListener("click", function () {
    currentFactIndex = (currentFactIndex + 1) % facts.length;
    showFact(currentFactIndex);
  });

  document.getElementById("knewThatBtn").addEventListener("click", function () {
    alert("Okay");
  });

  toggleSettingsButton.addEventListener("click", function () {
    if (interestSettingsDiv.style.display === "none") {
      interestSettingsDiv.style.display = "block";
      toggleNotificationsBtn.style.display = "none";
      toggleHistoryBtn.style.display = "none";
      toggleArticlesBtn.style.display = "none";
      togglePlannedBtn.style.display = "none";
      toggleSettingsButton.innerText = "Hide Interest Settings";
    } else {
      interestSettingsDiv.style.display = "none";
      toggleNotificationsBtn.style.display = "block";
      toggleHistoryBtn.style.display = "block";
      toggleArticlesBtn.style.display = "block";
      togglePlannedBtn.style.display = "block";
      toggleSettingsButton.innerText = "Show Interest Settings";
    }

  });

  function createInterestItem(interest = '', level = '1') {
    const interestItem = document.createElement('div');
    interestItem.className = 'interest-item';

    const interestInput = document.createElement('input');
    interestInput.type = 'text';
    interestInput.placeholder = 'Enter interest';
    interestInput.value = interest;

    const levelSelect = document.createElement('select');
    for (let i = 1; i <= 5; i++) {
      const option = document.createElement('option');
      option.value = i;
      option.textContent = `Level ${i}`;
      if (i == level) option.selected = true;
      levelSelect.appendChild(option);
    }

    const removeButton = document.createElement('span');
    removeButton.className = 'remove-button';
    removeButton.textContent = 'Remove';
    removeButton.onclick = function () {
      interestItem.remove();
    };

    interestItem.appendChild(interestInput);
    interestItem.appendChild(levelSelect);
    interestItem.appendChild(removeButton);

    interestList.appendChild(interestItem);
  }

  addInterestButton.addEventListener('click', function () {
    createInterestItem();
  });

  articlesArrow.addEventListener('click', function () {
    setConfigDisplayStyle("none");
    dailyFactBox.style.display = "block";
    dailyFactHeader.style.display = "block";

    interestSettingsDiv.style.display = "none";
  });

  chrome.storage.sync.get('interests', function (data) {
    if (data.interests) {
      data.interests.forEach(item => createInterestItem(item.interest, item.level));
    }
  });

  document.getElementById("interestForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const interests = [];
    const interestItems = document.querySelectorAll('.interest-item');

    interestItems.forEach(item => {
      const interest = item.querySelector('input').value;
      const level = item.querySelector('select').value;
      interests.push({ interest, level });
    });

    chrome.storage.sync.set({ interests }, function () {
      alert('Your study interests and levels have been saved!');
      dailyFactBox.style.display = "block";
      dailyFactHeader.style.display = "block";

      interestSettingsDiv.style.display = "none";

      toggleSettingsButton.innerText = "Show Interest Settings";
      setConfigDisplayStyle("none");
    });
  });

  settingsIcon.addEventListener("click", function () {
    dailyFactBox.style.display = "none";
    dailyFactHeader.style.display = "none";
    interestSettingsDiv.style.display = "none"

    setConfigDisplayStyle("block");
  });

  function setConfigDisplayStyle(displayStyle) {
    toggleSettingsButton.style.display = displayStyle;
    toggleArticlesBtn.style.display = displayStyle;
    toggleHistoryBtn.style.display = displayStyle;
    togglePlannedBtn.style.display = displayStyle;
    toggleNotificationsBtn.style.display = displayStyle;
    articlesArrow.style.display = displayStyle;
  }

  toggleArticlesBtn.addEventListener("click", function () {
    chrome.storage.sync.get("articles", function (data) {
      let savedArticles = data.articles || [];
  
      let articlesContainer = document.getElementById("savedArticlesContainer");
      if (!articlesContainer) {
        articlesContainer = document.createElement("div");
        articlesContainer.id = "savedArticlesContainer";
        toggleArticlesBtn.after(articlesContainer);
      }
  
      articlesContainer.innerHTML = "";
  
      if (savedArticles.length === 0) {
        articlesContainer.innerHTML = "<p>No saved articles.</p>";
      } else {
        let table = document.createElement("table");
        table.style.width = "100%";
        table.style.borderCollapse = "collapse";
  
        let headerRow = table.insertRow();
        ["#", "Article", "Remove"].forEach(text => {
          let th = document.createElement("th");
          th.textContent = text;
          th.style.border = "1px solid black";
          th.style.padding = "5px";
          headerRow.appendChild(th);
        });
  
        savedArticles.forEach((url, index) => {
          let row = table.insertRow();
          
          let indexCell = row.insertCell(0);
          indexCell.textContent = index + 1;
          indexCell.style.border = "1px solid black";
          indexCell.style.padding = "5px";
          indexCell.style.textAlign = "center";
  
          let linkCell = row.insertCell(1);
          let link = document.createElement("a");
          link.href = url;
          link.textContent = url;
          link.target = "_blank";
          linkCell.appendChild(link);
          linkCell.style.border = "1px solid black";
          linkCell.style.padding = "5px";
  
          let removeCell = row.insertCell(2);
          let removeButton = document.createElement("button");
          removeButton.textContent = "X";
          removeButton.style.background = "white";
          removeButton.style.color = "red";
          removeButton.style.border = "none";
          removeButton.style.cursor = "pointer";
          removeButton.onclick = function () {
            savedArticles.splice(index, 1);
            chrome.storage.sync.set({ articles: savedArticles }, function () {
              row.remove();
              if (savedArticles.length === 0) {
                articlesContainer.innerHTML = "<p>No saved articles.</p>";
              }
            });
          };
          removeCell.appendChild(removeButton);
          removeCell.style.border = "1px solid black";
          removeCell.style.padding = "5px";
          removeCell.style.textAlign = "center";
        });
  
        articlesContainer.appendChild(table);
      }
  
      articlesContainer.style.display = "block";
    });
  });
  


  showFact(currentFactIndex);
});