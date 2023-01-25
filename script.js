//
let id;
let stats;
let fullName;
let statsCollection;
let userHasSearched = false;
const SUPERHERO_TOKEN = "10227695148228285";
const BASE_URL = `https://www.superheroapi.com/api.php/${SUPERHERO_TOKEN}`;
//
const headerText = document.querySelector('#header-text');
const superheroName = document.querySelector('#superheroName');
const powerStats = document.querySelector('#powerStats');
const powerStatsLabel = document.querySelector('#powerStatsLabel'); //
const statsInfo = document.querySelector('#statsInfo');
const statsList = document.querySelector('#statsList');
const scores = document.querySelectorAll('.scores');
const image = document.querySelector('#superheroImage');
//
const searchSuperheroButton = document.querySelector('#searchSuperheroButton');
searchSuperheroButton.addEventListener('click', searchSuperhero)
const randomSuperheroButton = document.querySelector('#randomSuperheroButton');
randomSuperheroButton.addEventListener('click', randomSuperhero)
const superheroImage = document.querySelector('#superheroImage');
const fallbackImageSrcs = [
    "https://i.pinimg.com/originals/97/22/44/-9722441d9baeee0d86c354910a2b9bb7.jpg", 
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png"
];
console.log(fallbackImageSrcs)
const superheroSearch = document.querySelector('#superhero-searchbox');
superheroSearch.addEventListener('keydown', function(event) {
    if (event.key == "Enter") {
        searchSuperhero();
    }
})
//
function getSuperhero(fetchResource, option) {
    fetch(`${fetchResource}`)
    .then(response => {
        if (response.ok) {
            // console.log(response)
            console.log("Successfully fetched data.")
            return response.json()
        }
            console.log("Could not fetch data.")
            return Promise.reject(response)
    })
    .then(data => {
        if (option === 1) {
            image.src = data.results[0].image.url;
            stats = JSON.stringify(data.results[0].powerstats);
            fullName = data.results[0].biography['full-name'];
            statsCollection = [data.results[0].powerstats.intelligence, 
                data.results[0].powerstats.strength,
                data.results[0].powerstats.speed,
                data.results[0].powerstats.combat
            ];
        }
        else {
            image.src = data.image.url;
            stats = JSON.stringify(data.powerstats);
            fullName = data['biography']['full-name'];
            statsCollection = [data.powerstats.intelligence, 
                data.powerstats.strength,
                data.powerstats.speed,
                data.powerstats.combat
            ];
        }
        if (!userHasSearched) {
            modifyDisplayStructure()
        }
        updateSuperheroInfo()
    }).catch(err => console.error(err));
}
//
function searchSuperhero() {
    if (superheroSearch.value) {
    let fetchResource = `${BASE_URL}/search/${superheroSearch.value}`;
    getSuperhero(fetchResource, 1);
    }
    else {
        document.querySelector('#superheroSearchBox')
        console.log("Enter a name")
    }
}
function randomSuperhero() {
    let id = randomization(1,731);
    let fetchResource = `${BASE_URL}/${id}`;
    getSuperhero(fetchResource, 2);
}
//
function randomization(min,max) {
    randomNumber = Math.floor(Math.random() * (max - min + 1) ) + min;
    return randomNumber;
}
function imageErrorHandling(userHasSearched) {
    image.onerror = (event) => {
        if (userHasSearched) {
            event.target.src = fallbackImageSrcs[1]
        }
        else {
            event.target.src = fallbackImageSrcs[0]
        }
        image.onerror = null;
    }
}
function modifyDisplayStructure() {
    document.querySelector('#header-text q').remove()
    headerText.textContent = "Name: "
    document.querySelector('h1').style.fontSize = "2.25vw"
    document.querySelector('#header').style.padding = "0"
    powerStats.style.visibility = "visible"
    userHasSearched = true;
}
function updateSuperheroInfo() {
    if (!image.onerror) {
        imageErrorHandling(userHasSearched)
    }
    if (!fullName) {
        fullName = "N/A"
    }
    superheroName.textContent = `${fullName}`;
    statsCollection.map((stat, index) => {
        if (stat == "null") {
            scores[index].textContent = "N/A"
        }
        else {
        scores[index].textContent = `${stat}`
        }
    })
}

/*
Error Handling
---------------
- Search superhero ~ 
1) empty spring
2) superhero not found (invalid character or etc)
    a: initial state
    b: after active state
- No available image
*/