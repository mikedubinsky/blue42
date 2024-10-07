import Chart from 'chart.js/auto'
import {addPlayAgainButton, checkPlayAgain} from './playAgain.js';

const voteResults = {};
const url = "https://il7bkysao3dscz7bylpledumk40tbmof.lambda-url.us-east-1.on.aws/questions";
const isCached = !!localStorage.getItem('answers');
const answers = localStorage.getItem('answers') ?? [];
let questions = localStorage.getItem('questions') ? JSON.parse(localStorage.getItem('questions')) : null;
let key = localStorage.getItem('key') ?? null;

const getStarted = document.getElementById('get-started');

getStarted.addEventListener('click', async function (event) {
    // show loading
    const getStartedButton = document.getElementById('get-started');
    const placeholderSlide = document.querySelector('#placeholder-slide .placeholder');
    placeholderSlide.classList.remove('hidden');
    getStartedButton.classList.add('hidden');
    await getStartedClick();
});


async function getStartedClick() {

    if (answers && answers.length > 0 && !checkPlayAgain()) {
        await postAnswers(JSON.parse(answers), isCached);
    } else {
        if (!questions || !key) {
            const questionResponse = await getQuestions();
            questions = questionResponse.questions ?? [];
            key = questionResponse.key ?? '';
        }

        if (questions.length === 0 || questions[0]?.error) {
            addPlayAgainButton('placeholder-slide', "Sorry, an error occurred. Please click to try again.", true);
        } else {
            localStorage.setItem('questions', JSON.stringify(questions));
            localStorage.setItem('key', key);
            addQuestions(questions);
        }
        const slides = document.querySelector('.slides');
        const slidesCount = document.querySelectorAll('.slide').length - 1;
        let currentIndex = 0;

        const updateSlidePosition = () => {
            slides.style.transform = `translateX(-${currentIndex * 100}%)`;
        };

        const handleButtonClick = async (answer) => {
            currentIndex++;
            updateSlidePosition();
            if (currentIndex < slidesCount) {
                answers.push(answer);
            } else {
                await postAnswers(answers, isCached);
            }
        };

        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('click', function (event) {
                const buttonValue = event.target.value;
                handleButtonClick(buttonValue);
            });
        });
    }
}

const handleResultsButtonClick = async (vote) => {
    // hide buttons
    const agree = document.getElementById('vote-results');
    agree.classList.add('hidden');

    createCandidatesResultsChart();
    if (!localStorage.getItem('voted')) {
        await putVote(vote);
        localStorage.setItem('voted', vote);
    }
    createVoteResultsChart(vote);
    showSupport();
    addPlayAgainButton('results');
};
document.querySelectorAll('.results-btn').forEach(button => {
    button.addEventListener('click', function (event) {
        const buttonValue = event.target.value;
        handleResultsButtonClick(buttonValue);
    });
});

async function getQuestions() {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Host': 'il7bkysao3dscz7bylpledumk40tbmof.lambda-url.us-east-1.on.aws',
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json(); // Parse JSON response

    } catch (error) {
        console.error('Error:', error);
        return [
            {
                "error": "Oops - Sorry! Something went wrong. Can I blame it on politics?"
            }
        ];
    }
}

async function postAnswers(answers, isCached) {
    const body = {
        'answers': answers,
        'isCached': isCached,
        'key': key
    }

    fetch(url, {
        method: 'POST',
        headers: {
            'Host': 'il7bkysao3dscz7bylpledumk40tbmof.lambda-url.us-east-1.on.aws',
            'Accept': '*/*',
            'Connection': 'keep-alive'
        },
        body: JSON.stringify(body)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json(); // Parse the JSON response if needed
        })
        .then(data => {
            localStorage.setItem('answers', JSON.stringify(answers));
            showResponse(data.message, data.imageUrl, data.voteResults);
            this.voteResults = data.voteResults;
        })
        .catch(error => {
            console.error('Error:', error.message);
            showResponse("Oops - Sorry! Something went wrong. Can I blame it on politics?");
            return {};
        });
}

async function putVote(vote) {
    const body = {
        'vote': vote
    }

    fetch(url, {
        method: 'PUT',
        headers: {
            'Host': 'il7bkysao3dscz7bylpledumk40tbmof.lambda-url.us-east-1.on.aws',
            'Accept': '*/*',
            'Connection': 'keep-alive'
        },
        body: JSON.stringify(body)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function addQuestions(questions) {

    questions.forEach((question) => {
        // create container with class
        const slideDiv = document.createElement('div');
        slideDiv.classList.add('slide');
        // create question
        const slideQuestion = document.createElement('p');
        slideQuestion.classList.add('question');
        slideQuestion.appendChild(document.createTextNode(question.question));
        slideDiv.appendChild(slideQuestion);
        // create random answers; currently just 2, but maybe a loop here would be better to display all answers
        let index = Math.floor(Math.random() * question.answers.length);
        const answer1 = question.answers[index];
        question.answers.splice(index, 1);
        index = Math.floor(Math.random() * question.answers.length);
        const answer2 = question.answers[index];
        question.answers.splice(index, 1);
        index = Math.floor(Math.random() * question.answers.length);
        const answer3 = question.answers[index];
        question.answers.splice(index, 1);
        index = Math.floor(Math.random() * question.answers.length);
        const answer4 = question.answers[index];
        question.answers.splice(index, 1);

        // create container for random answers
        const answersDiv = document.createElement('div');
        answersDiv.classList.add('buttons');
        // answer 1
        const button1 = document.createElement('button');
        button1.classList.add('btn');
        button1.textContent = answer1;
        button1.value = answer1;
        answersDiv.appendChild(button1);
        // answer 2
        const button2 = document.createElement('button');
        button2.classList.add('btn');
        button2.textContent = answer2;
        button2.value = answer2;
        answersDiv.appendChild(button2);
        // answer 3
        const button3 = document.createElement('button');
        button3.classList.add('btn');
        button3.textContent = answer3;
        button3.value = answer3;
        answersDiv.appendChild(button3);
        // answer 4
        const button4 = document.createElement('button');
        button4.classList.add('btn');
        button4.textContent = answer4;
        button4.value = answer4;
        answersDiv.appendChild(button4);

        // answer 3? Add a wildcard button???
        // package it all together and present
        slideDiv.appendChild(answersDiv);
        document.getElementById('slides-container').prepend(slideDiv);
        removeMainPlaceholder();
    });
}

function removeMainPlaceholder() {
    const placeholder = document.getElementById("placeholder-slide");
    if (placeholder) {
        placeholder.remove();
    }
}

function showResponse(message = "", imageUrl = "", voteResults) {
    const slogan = document.getElementById('slogan')
    slogan.textContent = "";
    const aiDelay = document.getElementById('ai-delay');
    aiDelay.classList.add("hidden");


    // remove placeholders
    removeMainPlaceholder();
    const results = document.getElementById('results-placeholder')
    if (voteResults) {
        const agree = document.getElementById('vote-results');
        agree.classList.remove('hidden');
    }

    results.classList.remove('placeholder');

    // set image
    if (imageUrl) {
        const image = document.getElementById("aiImage");
        image.src = imageUrl;
        image.alt = message;
    }
    // set slogan
    slogan.textContent = message.replace(/^"|"$/g, '');

    results.scrollIntoView({behavior: 'smooth'});
}

function createCandidatesResultsChart() {
    const graph = document.getElementById('candidate-graph');
    graph.classList.remove('hidden');

    const candidateChartData = JSON.parse(JSON.stringify(this.voteResults));
    delete candidateChartData.candidates;
    delete candidateChartData.No;
    delete candidateChartData.Yes;
    if (candidateChartData.Unidentified < 1) {
        delete candidateChartData.Unidentified;
    }
    // const maxValue = Math.max(...Object.values(candidateChartData));

    new Chart(
        document.getElementById('aiResultsChart'),
        {
            type: 'bar',
            data: {
                labels: Object.keys(candidateChartData),
                datasets: [
                    {
                        label: 'Candidates',
                        data: Object.values(candidateChartData),
                        backgroundColor: ['aqua', 'pink', 'lightgreen', 'lightblue', 'gold'],
                        borderColor: ['blue', 'fuchsia', 'green', 'navy', 'black'],
                        borderWidth: 2,
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false,
                    },
                    title: {
                        display: true,
                        text: 'Candidates',
                        font: {
                            size: 24  // Increase title font size
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            font: {
                                size: 20
                            }
                        }
                    },
                    y: {
                        ticks: {
                            font: {
                                size: 20
                            }
                        },
                    }
                }
            }
        }
    );
    graph.scrollIntoView({behavior: 'smooth'});
}

function createVoteResultsChart(vote) {
    const voteData = {"Yes": this.voteResults.Yes ?? 0, "No": this.voteResults.No ?? 0};
    voteData[vote] = voteData[vote] + 1;

    const graph = document.getElementById('vote-graph');
    graph.classList.remove('hidden');

    const data = {
        labels: Object.keys(voteData),
        datasets: [{
            label: ' ',
            data: Object.values(voteData),
            backgroundColor: [
                'rgba(122,241,76,0.85)',
                'rgb(241,104,104)'
            ],
            hoverOffset: 4
        }]
    };
    const options = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Agree',
                font: {
                    size: 20
                }
            }
        }
    };

    // Configuration for the chart
    const config = {
        type: 'pie',
        data: data,
        options: options
    };

    // Render the chart in the canvas
    new Chart(
        document.getElementById('voteResultsChart'),
        config
    );
}

function showSupport() {
    const support = document.getElementById('stripe-container');
    support.classList.remove('hidden');
}
