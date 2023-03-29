const numpad = document.getElementById("numpad");
const operations = document.getElementById("operations");
const specialButtons = document.getElementById("special-buttons");
const displayContent = document.getElementById("displayContent");
const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const createButton = ({
   name,
   symbol,
   className,
   type,
   textContent,
}) => `<button
class="p-5 block h-[80px] rounded-xl text-xl font-extrabold ${className} calc-button flex items-center justify-center"
data-type="${type}"
data-name="${name}"
data-value="${symbol}"
>
${textContent ?? symbol}
</button>`;
const decimalPoint = {
   name: "decimalPoint",
   symbol: ".",
   className: "bg-[#292929] col-span-2",
   type: "number",
};
const specialKeys = [
   {
      name: "cancel",
      symbol: "AC",
      className: "",
      type: "special",
   },
   {
      name: "clear",
      symbol: "clear",
      textContent: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9.75L14.25 12m0 0l2.25 2.25M14.25 12l2.25-2.25M14.25 12L12 14.25m-2.58 4.92l-6.375-6.375a1.125 1.125 0 010-1.59L9.42 4.83c.211-.211.498-.33.796-.33H19.5a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25h-9.284c-.298 0-.585-.119-.796-.33z" />
</svg>
`,
      className: "",
      type: "special",
   },
   {
      name: "modulo",
      symbol: "%",
      className: "bg-[#CC7F08]",
      type: "operation",
   },
   {
      name: "equal",
      symbol: "=",
      className: "bg-[#CC7F08]",
      type: "operation",
   },
];
const operationsArr = [
   {
      name: "divide",
      symbol: "&divide;",
      type: "operation",
   },
   {
      name: "add",
      symbol: "+",
      type: "operation",
   },
   {
      name: "minus",
      symbol: "-",
      type: "operation",
   },
   {
      name: "multiply",
      symbol: "&times",
      type: "operation",
   },
];
const numberButtons = numbers
   .map((num) =>
      createButton({
         name: num,
         symbol: num,
         className: "bg-[#292929]",
         type: "number",
      })
   )
   .join("");
const operationsButton = operationsArr
   .map((item) =>
      createButton({ ...item, className: `bg-[#CC7F08] ${item.className}` })
   )
   .join("");
const specialKeysArr = specialKeys
   .map((item) =>
      createButton({ ...item, className: `bg-[#848484] ${item.className}` })
   )
   .join("");
const logDisplayError = () => {
   throw new Error("Calculator display is not available");
};
/***
 * Cancels or clears the display element
 */
const handleSpecialAction = (action) => {
   if (displayContent) {
      if (action === "cancel" || action === "clear") {
         if (action === "cancel") {
            displayContent.textContent = "0";
         }
         if (action === "clear") {
            const contentOnScreen = displayContent.textContent;
            if (contentOnScreen) {
               displayContent.textContent = contentOnScreen.slice(0, -1);
            }
         }
      } else {
         throw new Error(`${action} is invalid`);
      }
   } else {
      logDisplayError();
   }
};
let CalculatorMemory = { action: null, number: null };
const _arithmeticLocal = (num1, num2, op) => {
   switch (op) {
      case "add":
         return num1 + num2;
      case "divide":
         return num1 / num2;
      case "minus":
         return num1 - num2;
      case "multiply":
         return num1 * num2;
      case "modulo":
         return num1 % num2;
      default:
         throw new Error("Unreachable action of type:" + op);
   }
};
const arithmeticHandler = (_number, op) => {
   const _booleanNum = parseFloat(_number);
   const { number } = CalculatorMemory;
   if (number) {
      const res = _arithmeticLocal(number, _booleanNum, op);
      displayContent.textContent = res.toString();
   } else {
      console.log(CalculatorMemory);
      displayContent.textContent = "";
      CalculatorMemory.number = _booleanNum;
      CalculatorMemory.action = op;
   }
};
const handleOperationAction = (operation) => {
   if (displayContent) {
      const onScreenElement = displayContent.textContent;
      if (onScreenElement) {
         const { number } = CalculatorMemory;
         if (operation !== "equal") {
            arithmeticHandler(onScreenElement.trim(), operation);
         }
         if (operation === "equal") {
            // displayContent.textContent = number ? arithmeticHandler(onScreenElement, ) : onScreenElement;
            // CalculatorMemory = { action: null, number: null };
         }
         console.log(operation, CalculatorMemory);
      }
   } else {
      logDisplayError();
   }
};
/**
 * Displays the current number to screen
 * */
const handleNumberAction = (number) => {
   if (displayContent) {
      if (displayContent.textContent) {
         const numberOnScreen = displayContent.textContent.trim();
         if (numberOnScreen === "0" && number !== ".") {
            /* user has typed in a decimal place i.e 0.*** */
            displayContent.textContent = number;
         } else if (numberOnScreen.includes(".") && number === ".") {
            /* checking if its already a decimal point number, you can't have 2.22.22 */
            displayContent.textContent = numberOnScreen;
         } else {
            displayContent.textContent = numberOnScreen + number;
         }
      } else {
         displayContent.textContent = number;
      }
   } else {
      logDisplayError();
   }
};
const handleButtonClick = (type, value) => {
   switch (type) {
      case "number":
         return handleNumberAction(value);
      case "operation":
         return handleOperationAction(value);
      case "special":
         return handleSpecialAction(value);
      default:
         throw new Error(
            `${type} is not compatible with "number", "operation" or "special" action`
         );
   }
};
window.onload = () => {
   numpad.innerHTML = numberButtons + createButton(decimalPoint);
   operations.innerHTML = operationsButton;
   specialButtons.innerHTML = specialKeysArr;
   const allButtons = document.querySelectorAll(".calc-button");
   allButtons.forEach((button) => {
      button.onclick = () => {
         const btnType = button.dataset.type;
         if (
            btnType === "number" ||
            btnType === "operation" ||
            btnType === "special"
         ) {
            handleButtonClick(btnType, button?.dataset?.name ?? "0");
         } else {
            throw new Error(
               `${btnType} is not compatible with "number", "operation" or "special" action`
            );
         }
      };
   });
};
