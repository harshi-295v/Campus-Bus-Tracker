// Route Data
const routeData = {
  "Route 1": ["Bus 1", "Bus 2", "Bus 3", "Bus 4"],
  "Route 2": ["Bus 5", "Bus 6", "Bus 7", "Bus 8"]
};

let favourites = {};
let pendingBus = null;
let currentRoute = null;

// ============ LOGIN / REGISTER ============
function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const storedUser = localStorage.getItem("user_" + username);

  if (!storedUser) {
    alert("User not found! Please register.");
    return;
  }

  const user = JSON.parse(storedUser);
  if (user.password === password) {
    localStorage.setItem("loggedInUser", username);
    window.location.href = "home.html";
  } else {
    alert("Incorrect password!");
  }
}

function register() {
  const username = document.getElementById("regUsername").value;
  const password = document.getElementById("regPassword").value;

  if (!username || !password) {
    alert("Please fill all fields");
    return;
  }

  if (localStorage.getItem("user_" + username)) {
    alert("User already exists!");
    return;
  }

  const user = { username, password };
  localStorage.setItem("user_" + username, JSON.stringify(user));
  alert("Registration successful! Please login.");
  showLogin();
}

function showRegister() {
  document.querySelector(".main-container").classList.add("hidden");
  document.getElementById("registerPage").classList.remove("hidden");
}

function showLogin() {
  document.querySelector(".main-container").classList.remove("hidden");
  document.getElementById("registerPage").classList.add("hidden");
}

function logout() {
  localStorage.removeItem("loggedInUser");
  alert("Logged out successfully!");
  window.location.href = "index.html";
}

// ============ HOME PAGE ============
window.onload = () => {
  const path = window.location.pathname;
  if (path.includes("home.html")) {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (!loggedInUser) {
      window.location.href = "index.html";
    } else {
      document.getElementById("loggedInUser").innerText = "Hello, " + loggedInUser;
      document.querySelector(".profile-icon").addEventListener("click", () => {
        document.getElementById("profileDropdown").classList.toggle("hidden");
      });
    }
  }
};

// ============ BUS FUNCTIONALITY ============
function showBuses() {
  currentRoute = document.getElementById("routeSelector").value;
  const busList = document.getElementById("busList");
  busList.innerHTML = "";

  let buses = [...routeData[currentRoute]];

  if (!favourites[currentRoute]) favourites[currentRoute] = [];

  let favs = favourites[currentRoute];
  let others = buses.filter(bus => !favs.includes(bus));
  let orderedBuses = [...favs, ...others];

  orderedBuses.forEach(bus => {
    const isFav = favs.includes(bus);
    const busDiv = document.createElement("div");
    busDiv.className = "bus-item";

    const busRow = document.createElement("div");
    busRow.className = "bus-row";

    const star = document.createElement("span");
    star.className = "star";
    star.innerHTML = "☆";
    if (isFav) star.classList.add("filled");

    star.onclick = () => {
      pendingBus = bus;
      showBuses();
    };

    busRow.innerHTML = `<span>${bus}</span>`;
    busRow.appendChild(star);
    busDiv.appendChild(busRow);

    if (pendingBus === bus) {
      const actionBtn = document.createElement("button");
      actionBtn.className = "add-button";

      if (!isFav) {
        actionBtn.innerText = "Add to Favourite";
        actionBtn.onclick = () => {
          favourites[currentRoute].push(bus);
          pendingBus = null;
          alert(bus + " added to favourite");
          showBuses();
        };
      } else {
        actionBtn.innerText = "Remove from Favourite";
        actionBtn.onclick = () => {
          favourites[currentRoute] = favourites[currentRoute].filter(b => b !== bus);
          pendingBus = null;
          alert(bus + " removed from favourite");
          showBuses();
        };
      }
      busDiv.appendChild(actionBtn);
    }

    busList.appendChild(busDiv);
  });
}
