
document.addEventListener('DOMContentLoaded', async () => {
    const questions = await getQuestions();
    const answers = [];
    let graphResults = {};
    // const questions = [];
    //todo: remove log
    console.log("Questions:", questions);

    if (questions.length === 0 || questions[0]?.error) {
        //TODO Add error message
    } else {
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
            graphResults = postAnswers(answers);
        }
    };

    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function (event) {
            const buttonValue = event.target.value;
            handleButtonClick(buttonValue);
        });
    });
});

async function getQuestions() {
    const url = "https://il7bkysao3dscz7bylpledumk40tbmof.lambda-url.us-east-1.on.aws/questions";
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

async function postAnswers(answers) {
    const url = "https://il7bkysao3dscz7bylpledumk40tbmof.lambda-url.us-east-1.on.aws/questions";

    fetch(url, {
        method: 'POST',
        headers: {
            'Host': 'il7bkysao3dscz7bylpledumk40tbmof.lambda-url.us-east-1.on.aws',
            'Accept': '*/*',
            'Connection': 'keep-alive'
        },
        body: JSON.stringify(answers) // Convert the array to a JSON string
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json(); // Parse the JSON response if needed
        })
        .then(data => {
            console.log("DATA: ", data);
            showResponse(data.message, data.imageUrl, data.voteResults);
            return data.voteResults;
        })
        .catch(error => {
            console.error('Error:', error);
            showResponse("Oops - Sorry! Something went wrong. Can I blame it on politics?");
            return {};
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
        const placeholder = document.getElementById("placeholder-slide");
        if (placeholder) {
            placeholder.remove();
        }
    });
}

function showResponse(message = "", imageUrl = "", voteResults) {
    const slogan = document.getElementById('slogan')
    slogan.textContent = "";

    // remove placeholder
    const results = document.getElementById('results-placeholder')
    console.log("PollResults: ", voteResults)
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
    slogan.textContent = message;

    results.scrollIntoView({behavior: 'smooth'});
}
