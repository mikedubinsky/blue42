document.addEventListener('DOMContentLoaded', async () => {
    const questions = await getQuestions();
    // const questions = [];
    //todo: remove log
    console.log("Questions:", questions);

    if (questions.length === 0 || questions[0]?.error) {
        //TODO Add error message
    } else {
        addQuestions(questions);
    }
    const slides = document.querySelector('.slides');
    const slidesCount = document.querySelectorAll('.slide').length;
    let currentIndex = 0;

    const updateSlidePosition = () => {
        slides.style.transform = `translateX(-${currentIndex * 100}%)`;
    };

    const handleButtonClick = () => {
        currentIndex++;
        if (currentIndex < slidesCount) {
            updateSlidePosition();
        } else {
            alert('You have completed all the questions!');
        }
    };

    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', handleButtonClick);
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
        const index = Math.floor(Math.random() * question.answers.length);
        const answer1 = question.answers[index];
        question.answers.splice(index, 1);
        const answer2 = question.answers[Math.floor(Math.random() * question.answers.length)];
        // create container for random answers
        const answersDiv = document.createElement('div');
        answersDiv.classList.add('buttons');
        // answer 1
        const button1 = document.createElement('button');
        button1.classList.add('btn');
        button1.textContent = answer1;
        answersDiv.appendChild(button1);
        // answer 2
        const button2 = document.createElement('button');
        button2.classList.add('btn');
        button2.textContent = answer2;
        answersDiv.appendChild(button2);
        // answer 3? Add a wildcard button???
        // package it all together and present
        slideDiv.appendChild(answersDiv);
        document.getElementById('slides-container').appendChild(slideDiv);
        const placeholder = document.getElementById("placeholder-slide");
        if (placeholder) {
            placeholder.remove();
        }
    })
}
