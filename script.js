document.addEventListener('DOMContentLoaded', () => {
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
