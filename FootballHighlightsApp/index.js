const TOKEN = "MTgxNzBfMTY1MTE0MjE1MF9lMWMwNjc4N2I2NWZmZTMxMDBmZDQxY2YyYmI0NzkyMzhjZWMxZmE4";
const URL = `https://www.scorebat.com/video-api/v3/feed/?token=[${TOKEN}]`;
const CONTENT = document.getElementById("content");
const LOADING = document.querySelector('.loading');
const SEARCH_INPUT = document.getElementById("searchbar--search_input");
const SEARCH_BUTTTON = document.getElementById("searchbar--search_button");
const COMPETITION_CONTAINER = document.getElementById("competition--container");
const COMPETITION_ARROW = document.getElementById("competition--arrow");
const REFRESH_BUTTON = document.getElementById("toolbar--refresh");

window.addEventListener('scroll', () => {
	const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
	
	if((clientHeight + scrollTop >= scrollHeight - 5)) {
		showLoading();
	}
});

function showLoading() {
	LOADING.classList.add('show');
	
	setTimeout(getDataToFirstLoad, 1000)
}


async function getDataToFirstLoad() {
    fetch(URL)
    .then((res) => {
        return res.json()
    })
    .then((res) => {
        const data = res.response[getRandomNum()];
        addDataToDOM(data);
    })
}

function getRandomNum() {
    let randomNum = Math.floor(Math.random() * 89) + 1;
	return randomNum;
}

function addDataToDOM(data) {
	const matchHighlight = document.createElement('div');
    matchHighlight.classList.add("match")

    let date = convetFromStringToDate(data.date);

	matchHighlight.innerHTML = `
        <h2 class="match--title">${data.title}</h2>
        <span class="match--competition">${data.competition} • ${date}</span>
        <div class="match--video">
        ${data.videos[0].embed}
        </div>   
	`;
	CONTENT.appendChild(matchHighlight);
	LOADING.classList.remove('show');
}

function convetFromStringToDate(date){
    let mdy = date.split('T');
    return mdy[0];
}

async function getDataToSearch() {
    fetch(URL)
    .then((res) => {
        return res.json()
    })
    .then((res) => {
        const data = res.response;
        showSearchMatch(data);
    })
}

function showSearchMatch(data){
    CONTENT.innerHTML = "";
    let value = SEARCH_INPUT.value.toLowerCase();

    for(let i=0; i < data.length; i++){
        let title = data[i].title.toLowerCase();

        if(title.includes(value)){
            const matchHighlight = document.createElement('div');
            matchHighlight.classList.add("match")

            let date = convetFromStringToDate(data[i].date);

	        matchHighlight.innerHTML = `
                <h2 class="match--title">${data[i].title}</h2>
                <span class="match--competition">${data[i].competition} • ${date}</span>
                <div class="match--video">
                    ${data[i].videos[0].embed}
                </div>   
	        `;
	        CONTENT.appendChild(matchHighlight);
        }
    }
}

async function getDataOfCompetition() {
    fetch(URL)
    .then((res) => {
        return res.json()
    })
    .then((res) => {
        const data = res.response;
        createCompetitionName(data);
    })
}

function createCompetitionName(data){
    let names = []
    for(let i=0; i < data.length; i++){
        let name = getCompetitionName(data[i].competition)
        if(!names.includes(name)){
            names.push(name)
        }
    }

    addCompetitionNamesToDOM(names, data)
}

function getCompetitionName(competition){
    let competitionName = competition.split(':');
    return competitionName[0];
}

function addCompetitionNamesToDOM(names, data){
    for(let i = 0; i < names.length; i++){
        const competition = document.createElement('div');
        competition.classList.add("competition--item")
        competition.innerText = names[i]
        COMPETITION_CONTAINER.appendChild(competition)
    }

    const COMPETITION_ITEMS = document.querySelectorAll(".competition--item")
    let newData = data
    COMPETITION_ITEMS.forEach((element) => {
        element.addEventListener("click", (event, data) => {
            CONTENT.innerHTML = "";
            let pick = event.target.innerText.toLowerCase();
            data = newData

            for(let i = 0; i < data.length; i++){
                let competition = data[i].competition.toLowerCase();

                if(competition.includes(pick)){
                    const matchHighlight = document.createElement('div');
                    matchHighlight.classList.add("match")

                    let date = convetFromStringToDate(data[i].date);

	                matchHighlight.innerHTML = `
                        <h2 class="match--title">${data[i].title}</h2>
                        <span class="match--competition">${data[i].competition} • ${date}</span>
                        <div class="match--video">
                            ${data[i].videos[0].embed}
                        </div>   
	                `;
	                CONTENT.appendChild(matchHighlight);
                }
            }
        })
    });
}

getDataToFirstLoad();
getDataToFirstLoad();
getDataToFirstLoad();

getDataOfCompetition()

COMPETITION_ARROW.addEventListener("click", () => {
    COMPETITION_CONTAINER.classList.toggle("invisable")
    COMPETITION_ARROW.classList.toggle("down")
    COMPETITION_ARROW.classList.toggle("up")
})

REFRESH_BUTTON.addEventListener("click", () => {
    location.reload();
})

SEARCH_BUTTTON.addEventListener("click", getDataToSearch);

    






