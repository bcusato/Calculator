//Calculator
const calculate = function (n1, operator, n2) {
    const num1 = parseFloat(n1);
    const num2 = parseFloat(n2);
    switch (operator) {
        case 'add': return num1 + num2;
        case 'subtract': return num1 - num2;
        case 'multiply': return num1 * num2;
        case 'divide': return num1 / num2;
    }
}
//find the type of key 
const getKeyType = key => {
    const { action } = key.dataset;
    if (!action) return 'number';
    if (action === 'add' || action === 'subtract' || action === 'multiply' || action === 'divide')
        return 'operator';
    return action;
}

//Create result string
const createResultString = (key, displayedNum, state) => {
    const keyContent = key.textContent;
    const keyType = getKeyType(key);
    const { firstValue, operator, modValue, previousKeyType } = state;

    if (keyType === 'number') {
        return displayedNum === '0' || previousKeyType === 'operator' || previousKeyType === 'calculate' ?
            keyContent : displayedNum + keyContent;
    }

    if (keyType === 'decimal') {
        if (previousKeyType === 'operator' || previousKeyType === 'calculate') return '0.'
        if (!displayedNum.includes('.')) return displayedNum + '.'
        return displayedNum
    }

    if (keyType === 'operator') {
        return firstValue &&
            operator &&
            previousKeyType !== 'operator' &&
            previousKeyType !== 'calculate'
            ? calculate(firstValue, operator, displayedNum) : displayedNum;
    }

    if (keyType === 'clear') return 0;

    if (keyType === 'calculate') {
        return firstValue
            ? previousKeyType === 'calculate'
                ? calculate(displayedNum, operator, modValue)
                : calculate(firstValue, operator, displayedNum)
            : displayedNum;
    }
}

//Update the calculator's state
const updateCalculatorState = (key, calculator, calculatedValue, displayedNum) => {

    const keyType = getKeyType(key);
    const {
        firstValue,
        operator,
        modValue,
        previousKeyType
    } = calculator.dataset;

    calculator.dataset.previousKeyType = keyType;

    if (keyType === 'operator') {
        calculator.dataset.operator = key.dataset.action
        calculator.dataset.firstValue = firstValue &&
            operator &&
            previousKeyType !== 'operator' &&
            previousKeyType !== 'calculate'
            ? calculatedValue
            : displayedNum;
    }

    if (keyType === 'calculate') {
        calculator.dataset.modValue = firstValue && previousKeyType === 'calculate'
            ? modValue
            : displayedNum;
    }

    if (keyType === 'clear' && key.textContent === 'AC') {
        calculator.dataset.firstValue = '';
        calculator.dataset.operator = '';
        calculator.dataset.modValue = '';
        calculator.dataset.previousKeyType = '';
    }
}

//Update the display state
const updateVisualState = (key, calculator) => {
    const keyType = getKeyType(key);
    Array.from(key.parentNode.children).forEach(k => k.classList.remove('is-depressed'));

    if (keyType === 'operator') key.classList.add('is-depressed');

    if (keyType === 'clear' && key.textContent !== 'AC') key.textContent = 'AC';

    if (keyType !== 'clear') {
        const clearButton = calculator.querySelector('[data-action=clear]');
        clearButton.textContent = 'CE';
    }
}

const calculator = document.querySelector('.calculator');
const keys = calculator.querySelector('.calculator__keys');
const display = document.querySelector('.calculator__display');

keys.addEventListener('click', e => {
    if (!e.target.matches('button')) return
    const key = e.target;
    const displayedNum = display.textContent;
    const resultString = createResultString(key, displayedNum, calculator.dataset);

    display.textContent = resultString;
    updateCalculatorState(key, calculator, resultString, displayedNum);
    updateVisualState(key, calculator);

})
