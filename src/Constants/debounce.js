function debounce(func, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        // Setting the parent variable using closure
        timer = setTimeout(() => {
            console.log("Debounced function executed");
            func(...args)
        }, delay);

    };
}

export default debounce