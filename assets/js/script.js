const API_KEY = "9slVp9sJvfv19JYxxKL8ab3l6yI";
const API_URL = "https://ci-jshint.herokuapp.com/api";
const resultsModal = new bootstrap.Modal(document.getElementById("resultsModal"));

document.getElementById("status").addEventListener("click", e => getStatus(e));
document.getElementById("submit").addEventListener("click", e => postForm(e));

function processOptions(form){
    let optArray =[];

    for (let entry of form.entries()){
        if (entry[0] === "options"){
           optArray.push(entry[1]) ;
        }
    }
}

async function postForm(e){
    const form = processOptions(new FormData(document.getElementById("checksform")));

    for (let entry of form.entries()){
        console.log(entry);
    }

    const response = await fetch(API_URL, {
                        method: "POST",
                        headers: {
                                    "Authorization": API_KEY,
                                 },
                        body: form,
                        });
    const data = await response.json();
    
    if (response.ok){
        displayErrors(data);
    } else {
        throw new Error(data.error);
    }
}

function displayErrors(data){

    let heading = `JSHints results for ${data.file}`;
    if (data.total_errors === 0){
        results = "<div class = 'no_errors'> No errors reported!</div>";
    } else {
        results = ` <div> Tatal Errors: <span class = "errors_count">${data.total_errors}</span>`;
        for (let error of data.error_list){
            results += `<div> At line  <span class="line">${error.line}</span>,`;
            results += `column <span class = "column">${error.col}</span></div>`;
            results += `<divclass = "error">${error.error}</div>`;
        }
    }
    document.getElementById("resultsModalTitle").innerText = heading;
    document.getElementById("results-content").innerHTML = results;
    resultsModal.show();
}

async function getStatus(e){
    const queryString = `${API_URL}?api_key=${API_KEY}`;

    const response = await fetch(queryString);

    const data = await response.json();

    
    if (response.ok) {
        displayStatus(data);
    } else {
        throw new Error(data.error);
    }

}

function displayStatus(data){
    let heading = "API Key Status";
    let results = `<div>Your key is valid until:</div>`;
    results += `<div class="key-status">${data.expiry}</div>`

    document.getElementById("resultsModalTitle").innerText = heading;
    document.getElementById("results-content").innerHTML = results;

    resultsModal.show();
}