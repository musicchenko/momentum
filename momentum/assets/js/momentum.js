class Momentum {
  constructor({emptyName = "name", emptyGoal = "What is your goal?", emptyCity = "New York"} = {}) {
    this.days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    this.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    this.welcomeTexts = ["morning", "afternoon", "evening", "night"];
    this.images = {};
    this.maxImageId = 20;
    this.maxImagesCount = 6;
    this.partOfDay = this.getPartOfDay();
    this.backgroundIndex = 0;
    for(let i = 0; i < this.welcomeTexts.length; i++) {
      let temp = [];
      for(let j = 0; j < this.maxImagesCount; j++) {
        let randomImageName = this.addZero(this.randomRange(1, this.maxImageId + 1)) + ".jpg";
        while(temp.includes(randomImageName)) {
          randomImageName = this.addZero(this.randomRange(1, this.maxImageId + 1)) + ".jpg";
        }
        temp.push(randomImageName);
      }
      this.images[this.welcomeTexts[i]] = temp;
    }
    this.emptyName = emptyName;
    this.emptyGoal = emptyGoal;
    this.emptyCity = emptyCity;
  }
  randomRange(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
  async preloadImages() {
    for(let i = 0; i < Object.keys(this.images).length; i++) {
      for(let j = 0; j < this.images[Object.keys(this.images)[i]].length; j++) {
        let res = await new Promise(res => {
          const tempImg = new Image();
          tempImg.onload = () => res("Image loaded");
          tempImg.src = `./assets/images/${Object.keys(this.images)[i]}/${this.images[Object.keys(this.images)[i]][j]}`;
        });
      }
    }
  }
  async getQuote({service = "https://favqs.com/api/qotd"} = {}) {
    const quoteElement = document.getElementById("quote");
    const quoteRequest = await fetch(service);
    try {
      const quote = await quoteRequest.json();
      quoteElement.setAttribute("title", quote.quote.body);
      quoteElement.innerHTML = quote.quote.body;
    }
    catch {
      quoteElement.innerText = "There should have been a quote. But due to an unforeseen error, she is not here ¯\_(ツ)_/¯";
    }
  }
  async getWeather() {
    const city = localStorage.getItem("city") ? localStorage.getItem("city") : this.emptyCity;
    const temperatureElement = document.getElementById("temperature");
    function hideWeatherIcons() {
      const weatherIcons = document.getElementsByClassName("weather-icon");
      for(let i = 0; i < weatherIcons.length; i++) {
        weatherIcons[i].classList.remove("current-weather");
      }
    }
    try {
      const weather = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&lang=ru&appid=207b5cff8e3e57c85af438ade67e4fa9&units=metric`);
      const weatherData = await weather.json();
      temperatureElement.innerHTML = weatherData.main.temp + "°C";
      document.getElementById("humidity").innerText = "humidity " + weatherData.main.humidity + "%";
      document.getElementById("windy").innerText = "wind " + weatherData.wind.speed + "m/s";
      hideWeatherIcons();
      switch(weatherData.weather[0].main) {
        case "Mist":
        case "Clouds": {
          document.getElementById("cloud-icon").classList.add("current-weather");
          break;
        }
        case "Rain":
        case "Drizzle": {
          document.getElementById("rain-icon").classList.add("current-weather");
          break;
        }
        default:
        case "Clear": {
          document.getElementById("sun-icon").classList.add("current-weather");
          break;
        }
      }
    }
    catch {
      hideWeatherIcons();
      temperatureElement.innerText = "Server error";
      document.getElementById("humidity").innerText = "humidity: no data";
      document.getElementById("windy").innerText = "wind: no data";
    }
  }
  updateTime() {
    const timeElement = document.getElementById("time");
    const dateElement = document.getElementById("date");
    timeElement.innerText = this.getTime();
    dateElement.innerText = this.getDate();
    const date = new Date();
    if(date.getMinutes() === 0 && date.getSeconds() === 0) {
      if(this.getPartOfDay() !== this.partOfDay) {
        this.partOfDay = this.getPartOfDay();
        this.backgroundIndex = 0;
        this.changeBackground(0);
      }
      else {
        this.changeBackground(1);
      }
      this.setGoodText();
    }
  }
  changeBackground(step) {
    this.backgroundIndex += step;
    if(this.backgroundIndex >= this.maxImagesCount) {
      if(this.partOfDay === "night")  {
        this.partOfDay = "morning";
      }
      else {
        for(let i = 0; i < this.welcomeTexts.length; i++) {
          if(this.partOfDay === this.welcomeTexts[i]) {
            this.partOfDay = this.welcomeTexts[i+1];
            break;
          }
        }
      }
      this.backgroundIndex = 0;
    }
    else if(this.backgroundIndex < 0) {
      if(this.partOfDay === "morning")  {
        this.partOfDay = "night";
      }
      else {
        for(let i = 0; i < this.welcomeTexts.length; i++) {
          if(this.partOfDay === this.welcomeTexts[i]) {
            this.partOfDay = this.welcomeTexts[i-1];
            break;
          }
        }
      }
      this.backgroundIndex = this.maxImagesCount-1;
    }
    this.setBackground();
  }
  setBackground() {
    const date = new Date();
    const h = date.getHours();
    document.body.style.background = `url('./assets/images/${this.partOfDay}/${this.images[this.partOfDay][this.backgroundIndex]}') no-repeat center`;
    document.body.style.backgroundSize = "cover";
  }
  getPartOfDay() {
    const time = new Date();
    const hours = time.getHours();
    let result;
    switch(true) {
      case (hours >= 6 && hours <= 11): {
        result = "morning";
        break;
      }
      case (hours >= 12 && hours <= 17): {
        result = "afternoon";
        break;
      }
      case (hours >= 18 && hours <= 23): {
        result = "evening";
        break;
      }
      case (hours >= 0 && hours <= 5): {
        result = "night";
        break;
      }
    }
    return result;
  }
  setGoodText() {
    let goodText = "Good ";
    goodText += this.getPartOfDay();
    goodText += ", ";
    document.getElementById("good").innerText = goodText;
  }
  setCity() {
    const city = localStorage.getItem("city");
    const cityElement = document.getElementById("city");
    cityElement.innerText = city ? city : this.emptyCity;
  }
  setGoal() {
    const goal = localStorage.getItem("goal");
    const goalElement = document.getElementById("goal");
    goalElement.innerText = goal ? goal : this.emptyGoal;
  }
  setName() {
    const name = localStorage.getItem("name");
    const nameElement = document.getElementById("name");
    if(!name) {
      nameElement.innerText = this.emptyName;
    }
    else {
      nameElement.innerText = name;
    }
  }
  getTime() {
    const date = new Date();
    return date.getHours() + ":" + this.addZero(date.getMinutes()) + ":" + this.addZero(date.getSeconds());
  }
  getDate() {
    const date = new Date();
    return this.days[date.getDay()] + ", " + date.getDate() + " " + this.months[date.getMonth()];
  }
  addZero(value) {
    if(value <= 9) {
      return "0" + value;
    }
    else {
      return value;
    }
  }
}
