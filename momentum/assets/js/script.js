const momentum = new Momentum();
const updateTime = 1000;

Start();

async function Start() {
  await momentum.preloadImages();
  momentum.updateTime();
  momentum.setCity();
  momentum.getWeather();
  momentum.setName();
  momentum.setGoal();
  momentum.setGoodText();
  momentum.setBackground();
  momentum.getQuote();

  let sliding = false;
  let slidingTimer;
  const slidingOffTime = 550;

  setTimeout(() => {
    document.getElementById("preloader").classList.add("hide");
  }, 1400);

  document.getElementById("new-quote-btn").addEventListener("click", () => {
    momentum.getQuote();
  });

  //// Я обещаю, что отправлю эту работу в список лучших
  //// Пообещал? Выполняй!!! :)

  let timeUpdater = setInterval(momentum.updateTime.bind(momentum), updateTime);

  //// Переключение изображений
  const leftArrowElement = document.getElementById("left-arrow");
  const rightArrowElement = document.getElementById("right-arrow");

  leftArrowElement.addEventListener("click", () => {
    if(!sliding) {
      sliding = true;
      momentum.changeBackground(-1);
      if(slidingTimer) {
        clearTimeout(slidingTimer);
      }
      slidingTimer = setTimeout(slidingOff, slidingOffTime);
    }
  });

  rightArrowElement.addEventListener("click", () => {
    if(!sliding) {
      sliding = true;
      momentum.changeBackground(1);
      if(slidingTimer) {
        clearTimeout(slidingTimer);
      }
      slidingTimer = setTimeout(slidingOff, slidingOffTime);
    }
  });

  function slidingOff() {
    sliding = false;
  }
  ////

  const cityElement = document.getElementById("city");

  cityElement.addEventListener("keydown", (e) => {
    if(e.keyCode === 13) {
      e.preventDefault();
      if(e.currentTarget.innerText.trim()) {
        localStorage.setItem("city", e.currentTarget.innerText);
        momentum.getWeather();
      }
      e.currentTarget.blur();
    }
  });

  cityElement.addEventListener("input", (e) => {
    let city = e.currentTarget;
    if(city.innerText.trim()) {
      localStorage.setItem("city", city.innerText);
    }
  });

  cityElement.addEventListener("click", (e) => {
    e.currentTarget.innerText = "";
  });

  cityElement.addEventListener("focusout", (e) => {
    momentum.setCity();
    momentum.getWeather();
  });

  //// Goal
  const goalElement = document.getElementById("goal");

  goalElement.addEventListener("keydown", (e) => {
    if(e.keyCode === 13) {
      e.preventDefault();
      if(e.currentTarget.innerText.trim()) {
        localStorage.setItem("goal", e.currentTarget.innerText);
      }
      e.currentTarget.blur();
    }
  });

  goalElement.addEventListener("input", (e) => {
    let goal = e.currentTarget;
    if(goal.innerText.trim()) {
      localStorage.setItem("goal", goal.innerText);
    }
  });

  goalElement.addEventListener("click", (e) => {
    e.currentTarget.innerText = "";
  });

  goalElement.addEventListener("focusout", (e) => {
    momentum.setGoal();
  });

  //// Name
  const nameElement = document.getElementById("name");

  nameElement.addEventListener("keydown", (e) => {
    if(e.keyCode === 13) {
      e.preventDefault();
      if(e.currentTarget.innerText.trim()) {
        localStorage.setItem("name", e.currentTarget.innerText);
      }
      e.currentTarget.blur();
    }
  });

  nameElement.addEventListener("input", (e) => {
    let name = e.currentTarget;
    if(name.innerText.trim()) {
      localStorage.setItem("name", name.innerText);
    }
  });

  nameElement.addEventListener("click", (e) => {
    e.currentTarget.innerText = "";
  });

  nameElement.addEventListener("focusout", (e) => {
    momentum.setName();
  });
}
