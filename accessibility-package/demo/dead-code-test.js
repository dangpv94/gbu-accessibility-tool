// JavaScript file with mixed used and unused code

// Used function - called in HTML onclick
function showAlert() {
    alert('This function is used!');
}

// Used function - called by another function
function helperFunction() {
    return 'Helper function result';
}

// Used function - calls helperFunction
function mainFunction() {
    const result = helperFunction();
    console.log(result);
}

// Unused function - never called anywhere
function unusedFunction() {
    console.log('This function is never called');
    return false;
}

// Unused function - complex but never used
function complexUnusedFunction(param1, param2) {
    const calculations = param1 * param2 + Math.random();
    if (calculations > 0.5) {
        return 'High value';
    } else {
        return 'Low value';
    }
}

// Used variable
const usedVariable = 'This variable is used below';
console.log(usedVariable);

// Unused variable - declared but never used
const unusedVariable = 'This variable is never used';

// Unused variable with complex initialization
const anotherUnusedVariable = {
    property1: 'value1',
    property2: 'value2',
    method: function() {
        return 'method result';
    }
};

// Arrow function assigned to variable - used
const usedArrowFunction = () => {
    return 'Arrow function result';
};

// Call the used arrow function
usedArrowFunction();

// Arrow function assigned to variable - unused
const unusedArrowFunction = (x, y) => {
    return x + y;
};

// Event handler - should be detectable as used if referenced in HTML
function handleClick(event) {
    event.preventDefault();
    console.log('Click handled');
}

// Initialize app - commonly used pattern
function initApp() {
    console.log('App initialized');
    mainFunction();
}

// Call init - this makes initApp used
initApp();