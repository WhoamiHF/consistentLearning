document.addEventListener('DOMContentLoaded', function() {
  const interestList = document.getElementById("interestList");
  const addInterestButton = document.getElementById("addInterest");
  const toggleSettingsButton = document.getElementById("toggleSettingsBtn");
  const interestSettingsDiv = document.getElementById("interestSettings");
  
  const facts = [
    "Fact 1",
    "Fact 2",
    "Fact 3"
  ];

  let currentFactIndex = 0;

  function showFact(index) {
    document.getElementById("dailyFactText").innerText = facts[index];
  }

  document.getElementById("moreFactBtn").addEventListener("click", function() {
    currentFactIndex = (currentFactIndex + 1) % facts.length;
    showFact(currentFactIndex);
  });

  document.getElementById("knewThatBtn").addEventListener("click", function() {
    alert("Okay");
  });

  toggleSettingsButton.addEventListener("click", function() {
    if (interestSettingsDiv.style.display === "none") {
      interestSettingsDiv.style.display = "block";
      toggleSettingsButton.innerText = "Hide Interest Settings";
    } else {
      interestSettingsDiv.style.display = "none";
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
    removeButton.onclick = function() {
      interestItem.remove();
    };

    interestItem.appendChild(interestInput);
    interestItem.appendChild(levelSelect);
    interestItem.appendChild(removeButton);

    interestList.appendChild(interestItem);
  }

  addInterestButton.addEventListener('click', function() {
    createInterestItem();
  });

  chrome.storage.sync.get('interests', function(data) {
    if (data.interests) {
      data.interests.forEach(item => createInterestItem(item.interest, item.level));
    }
  });

  document.getElementById("interestForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const interests = [];
    const interestItems = document.querySelectorAll('.interest-item');

    interestItems.forEach(item => {
      const interest = item.querySelector('input').value;
      const level = item.querySelector('select').value;
      interests.push({ interest, level });
    });

    chrome.storage.sync.set({ interests }, function() {
      alert('Your study interests and levels have been saved!');
    });
  });

  showFact(currentFactIndex);
});