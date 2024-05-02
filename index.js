const apiKey = "861701d79f98ac79ff8a25472b5af910";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=imperial&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");
const background = document.querySelector(".background");
const sunCanvas = document.getElementById("sunCanvas");
const ctx = sunCanvas.getContext("2d");
let suns = [];
let clouds = [];
let searchCount = 0;

searchBtn.addEventListener("click", () => {
    searchCount++;

    if (searchCount === 3) {
        clouds = [];
        suns = []; // Clear the suns array
        ctx.clearRect(0, 0, sunCanvas.width, sunCanvas.height); // Clear the canvas to remove existing suns
        searchCount = 0;
    }

    // Reset cloud speed
    clouds.forEach(cloud => {
        cloud.speed = 0.5; // Reset the speed to its initial value
    });

    // Reset sun speed
    suns.forEach(sun => {
        sun.speed = 1; // Reset the speed to its initial value
    });

    checkWeather(searchBox.value);
});

async function checkWeather(city) {
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
    if (!response.ok) {
        document.querySelector(".error").style.display = "block";
        document.querySelector(".weather").style.display = "none";
    } else {
        var data = await response.json();

        document.querySelector(".city").innerHTML = data.name;
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°F";
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
        document.querySelector(".wind").innerHTML = data.wind.speed + "mph";
        

        // Remove existing background classes
        background.classList.remove('sunny-background', 'cloudy-background', 'rainy-background');

        if (data.weather[0].main == "Clear") {
            weatherIcon.src = "images/clear.png";
            background.classList.add('sunny-background');

            // Create mini sun elements and add them to the background
            const numAnimatedSuns = 10; // Adjust the number of mini suns as desired
            for (let i = 0; i < numAnimatedSuns; i++) {
                suns.push({
                    x: Math.random() * sunCanvas.width,
                    y: Math.random() * sunCanvas.height,
                    width: 50, // Adjust the width of the suns as needed
                    height: 50, // Adjust the height of the suns as needed
                    speed: 1, // Adjust the speed of the suns as needed
                });
            }
            

            // Start animation loop for suns
            animateSuns();
        } else if (data.weather[0].main == "Clouds") {
            weatherIcon.src = "images/clouds.png";
            // background.classList.add('cloudy-background');
            background.style.backgroundColor = "lightblue";

            // Create clouds and add them to the background
            const numClouds = 10; // Adjust the number of clouds as desired
            for (let i = 0; i < numClouds; i++) {
                clouds.push({
                    x: Math.random() * sunCanvas.width,
                    y: Math.random() * sunCanvas.height,
                    width: 50, // Adjust the width of the clouds as needed
                    height: 50, // Adjust the height of the clouds as needed
                    speed: 1, // Adjust the speed of the clouds as needed
                });
            }

            // Start animation loop for clouds
            animateClouds();
        }else if(data.weather[0].main == "Rain"){
                weatherIcon.src = "images/rain.png";
            }
            else if(data.weather[0].main == "Drizzle"){
                weatherIcon.src = "images/drizzle.png";
            }
            else if(data.weather[0].main == "Mist"){
                weatherIcon.src = "images/mist.png";
            }
        }

        document.querySelector(".weather").style.display = "block";
        document.querySelector(".error").style.display = "none";
    }

    sunCanvas.addEventListener("click", (event) => {
        const rect = sunCanvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        
        console.log("Clicked at:", mouseX, mouseY); // Add this line to log the click coordinates
        
        // Iterate through each sun and check if the click is within its bounds
        suns.forEach(sun => {
            if (
                mouseX >= sun.x && mouseX <= sun.x + sun.width &&
                mouseY >= sun.y && mouseY <= sun.y + sun.height
            ) {
                // Increase the size of the clicked sun
                sun.width += 10;
                sun.height += 10;
                redrawCanvas(); // Redraw the canvas after updating sun dimensions
            }
        });
    });
    
    function redrawCanvas() {
        // Clear the canvas
        ctx.clearRect(0, 0, sunCanvas.width, sunCanvas.height);
    
        // Redraw each sun with updated dimensions
        suns.forEach(sun => {
            const sunImage = new Image();
            sunImage.src = "images/clear.png";
            ctx.drawImage(sunImage, sun.x, sun.y, sun.width, sun.height);
        });
    }
    
    
    
function animateSuns() {
    // Clear the canvas
    ctx.clearRect(0, 0, sunCanvas.width, sunCanvas.height);

    // Update and draw each sun
    suns.forEach(sun => {
        // Update sun position
        sun.y += sun.speed;

        // Draw the sun image
        const sunImage = new Image();
        sunImage.src = "images/clear.png";
        ctx.drawImage(sunImage, sun.x, sun.y, sun.width, sun.height);

        // Reset sun position if it goes off-screen
        if (sun.y - sun.height > sunCanvas.height) {
            sun.y = -sun.height;
        }
    });

    // Request next frame
    requestAnimationFrame(animateSuns);
}

function animateClouds() {
    // Clear the canvas
    ctx.clearRect(0, 0, sunCanvas.width, sunCanvas.height);

    // Update and draw each cloud
    clouds.forEach(cloud => {
        // Update cloud position horizontally
        cloud.x += cloud.speed;

        // Draw the cloud image
        const cloudImage = new Image();
        cloudImage.src = "images/cartoon-cloud.png";
        ctx.drawImage(cloudImage, cloud.x, cloud.y, cloud.width, cloud.height);

        // Reset cloud position if it goes off-screen
        if (cloud.x - cloud.width > sunCanvas.width) {
            cloud.x = -cloud.width;
            cloud.y = Math.random() * sunCanvas.height; // Randomize cloud's y position
        }
    });

    // Request next frame
    requestAnimationFrame(animateClouds);
}

searchBtn.addEventListener("click", () => {
    checkWeather(searchBox.value);
});