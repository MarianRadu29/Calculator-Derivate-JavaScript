
class TreeNode {
    constructor(value, left = null, right = null) {
      this.value = value; 
      this.left = left;   
      this.right = right; 
    }
  
    
    toString() {
      if (!this.left && !this.right) {
        // Nodul este o frunza (constanta sau variabila)
        return this.value;
      }
  
      const leftString = this.left!=null ? this.left.toString() : '';
      const rightString = this.right!=null ? this.right.toString() : '';
  
      switch (this.value) 
      {
        case '+':
        case '-':
        case '*':
        case '/':
        case '^':
           return `(${leftString}${this.value}${rightString})`;
        case 'ln':
            return `ln(${rightString})`;
        case 'log':
            return `log(${rightString})`;
        case 'sin':
            return `sin(${rightString})`;
        case 'cos':
            return `cos(${rightString})`;
        case 'tg':
            return `tg(${rightString})`;
        case 'ctg':
            return `ctg(${rightString})`;
        case 'arcsin':
            return `arcsin(${rightString})`;
        case 'arccos':
            return `arccos(${rightString})`;
        case 'arctg':
            return `arctg(${rightString})`;
        case 'arcctg':
            return `arcctg(${rightString})`;
        case 'sqrt':
            return `sqrt(${leftString},${rightString})`;
        default:
          return `${this.value}`;
      }
    }
  }

 function postfixata(expresie) {
    const precedence = {
        '+': 1,
        '-': 1,
        '*': 2,
        '/': 2,
        '^': 3
    };

    const functions = ['log', 'ln', 'sin', 'cos', 'tg', 'ctg', 'arcsin', 'arccos', 'arctg', 'arcctg'];
    const output = [];
    const operators = [];
   
    
    // parsarea expresiei pentru a crea token-uri
    const operatori = "+-*/^()";  // operatori posibili
    const cifra = "0123456789";   //
    const litera = "abcdefghijklmnopqrstuvwyz";
    let tokens = [];  // Array pentru a stoca cuvintele expresiei
    let nr_cuvinte_expresie = 0;

    for (let i = 0; i < expresie.length; i++) {
        if (expresie[i] === 'x' || operatori.includes(expresie[i]) || expresie[i] === 'e') {
            tokens.push(expresie[i]);
        } else if (cifra.includes(expresie[i])) {  // avem un numar
            let numar = "";
            while (i < expresie.length && cifra.includes(expresie[i])) {
                numar += expresie[i++];
            }
            i--; 
            tokens.push(numar);
        } else if (litera.includes(expresie[i]) && expresie[i] !== 'e') {  // Avem o functie
            let functie = "";
            while (i < expresie.length && litera.includes(expresie[i])) {
                functie += expresie[i++];
            }
            i--;  // revin cu un pas inapoi
            tokens.push(functie);
        }
    }

    // lipim semnul minus la un numar sau la 'x' dacă este cazul
    let i = 0;
    while (i < tokens.length) {
        if (tokens[i] === '-' && (cifra.includes(tokens[i + 1]?.[0]) || tokens[i + 1] === 'x') && 
            (i === 0 || tokens[i - 1] === '(' || operatori.includes(tokens[i - 1]))) {
            tokens[i] += tokens[i + 1];
            tokens.splice(i + 1, 1);  // Eliminam elementul urmator (numarul sau `x` după minus)
        }
        i++;
    }
    // Procesarea token-urilor
    tokens.forEach(token => {
        if (!isNaN(token)) {
            // token este un numar sau numar negativ
            output.push(token);
        } else if (functions.includes(token)) {
            // token este o functie
            operators.push(token);
        } else if (token === '(') {
            // token este o paranteza stanga
            operators.push(token);
        } else if (token === ')') {
            // token este o paranteza dreapta
            while (operators.length > 0 && operators[operators.length - 1] !== '(') {
                output.push(operators.pop());
            }
            operators.pop(); // Scoate '(' din stiva

            // Daca dupa paranteza se afla o functie, adaug o in output
            if (operators.length > 0 && functions.includes(operators[operators.length - 1])) 
            {
                output.push(operators.pop());
            }
        } 
        else if (precedence[token]) 
        {
            // token este un operator
            while (operators.length > 0 && precedence[operators[operators.length - 1]] >= precedence[token]) 
            {
                output.push(operators.pop());
            }
            operators.push(token);
        }
        else 
        {
            // token este o variabila
            output.push(token);
        }
    });

    while (operators.length > 0) {
        output.push(operators.pop());
    }

    return output;
}


 function isFunction(token)
{
    return ["sin", "cos", "log", "ln", "tg", "ctg", "arcsin", "arccos", "arctg", "arcctg"].includes(token);
}

 function buildExpressionTree(postfix)
{
    const stack = [];

    postfix.forEach(token => {
        
        if (!isNaN(token) || /^[a-zA-Z]+$/.test(token) && !isFunction(token)) 
        {
            stack.push(new TreeNode(token));
        }
         else if (isFunction(token)) 
        {
            let operandNode = stack.pop();
            
            const functionNode = new TreeNode(token);

            functionNode.right = operandNode; 
            
            stack.push(functionNode);
        } 
        else 
        { 
            const rightNode = stack.pop();
            const leftNode = stack.pop();

            const operatorNode = new TreeNode(token);
            operatorNode.left = leftNode;
            operatorNode.right = rightNode;
            
            stack.push(operatorNode);
        }
    });

   
    if (stack.length !== 1) 
    {    
        console.log(stack.length)
        throw new Error("Expresia postfixata este invalida");
    }

    return stack.pop();
}

function height(a)//inaltimea arborelui
{
    if (a != null)
        return 1 + Math.max(height(a.right), height(a.left));
    else
        return 0;
}

 function size(a)//numarul de noduri din arbore
{
    if (a != null)
        return 1 + size(a.left) + size(a.right);
    else
        return 0;
}

 function arbore_numar(a)//verifica daca toate operatiile din arbore contin numere
{
    if (a!=null)
    {
        if (cifra.includes(a.value[0])===true|| "-/*+^".includes(a.value[0] || isFunction(a.value)))//este numar/cifra sau este o operatie
            return 1 + arbore_numar(a.right) + arbore_numar(a.left);
        else
            return arbore_numar(a.left) + arbore_numar(a.right);
    }
    else
        return 0;
}

function derive(root)
{
    if(cifra.includes(root.value[0])===true || size(root)===arbore_numar(root) || root.value==="e")
    {
        return new TreeNode('0');
    }
    if(root.value==="x")
    {
        return new TreeNode('1');
    }

    const operator = root.value;

    if (operator === '+')
    {
        return new TreeNode('+', derive(root.left), derive(root.right));
    }

    if (operator === '-')
    {
        return new TreeNode('-', derive(root.left), derive(root.right));
    }

    if (operator === '*') 
    {
        // derivata produsului: u*v' + u'*v
        return new TreeNode(
            '+',
            new TreeNode('*', root.left, derive(root.right)),
            new TreeNode('*', derive(root.left), root.right)
        );
    }

    if (operator === '/') 
    {
        // Derivata catului: (u'v - uv') / v^2
        return new TreeNode(
            '/',
            new TreeNode('-',
                new TreeNode('*',derive(root.left), root.right),
                new TreeNode('*', root.left, derive(root.right))
            ),
            new TreeNode('*', root.right, root.right)
        );
    }

    if (operator === '^') 
    {
        let baza = root.left;
        let exponent = root.right;

        if (!isNaN(exponent.value)) //testez daca exponentul este un numar
        {   
            
            // Derivata puterii: n * x^(n-1) pentru x^n
            return new TreeNode
            ( 
                '*',
                new TreeNode(
                    '*',
                    new TreeNode(exponent.value),
                    new TreeNode('^',baza, new TreeNode((Number(exponent.value) - 1).toString())
                    ),
                ),
                derive(baza)
            )   

            //cazul in care si baza este numar este testat in prima conditie(primul if)
        }
        else
        {   
            if(cifra.includes(baza.value[0])===true)//baza este un numar
            {
                return new TreeNode(
                    '*',
                    root,
                    new TreeNode('ln',null,baza)
                );
            }
            else if(baza.value==='e')
            {
                return new TreeNode(
                    '*',
                    root,
                    derive(exponent)
                );
            }
            else//de ex x^x
            {
                return new TreeNode(
                    '+',
                    new TreeNode(
                        '*',
                        derive(exponent),
                        new TreeNode('ln',null,baza)
                        ),
                    new TreeNode(
                        '*',
                        exponent,
                        new TreeNode(
                            '*',
                            new TreeNode(
                                '^',
                                exponent,
                                new TreeNode(
                                    '-',
                                    exponent,
                                    new TreeNode('1')
                                )
                            ),
                            derive(baza)
                        )
                    )
                )
            }
        }
        
    }

    if(operator==='ln')
    {
       return new TreeNode(
            '*', 
            new TreeNode(
                '/',
                new TreeNode('1'),
                root.right
            ),
            derive(root.right)
       )
    }

    if(operator==='log')//este implicit in baza 2
    {
        return new TreeNode(
            '*',
            new TreeNode(
                '/',
                new TreeNode('1'),
                new TreeNode(
                    '*',
                    root.right,
                    new TreeNode(
                        'ln',
                        null,
                        new TreeNode('2')
                    )
                )
            ),
            derive(root.right)
        );
    }

    if(operator==='sin')
    {
        return new TreeNode(
            '*',
            new TreeNode(
                'cos',
                null,
                root.right
            ),
            derive(root.right)
        )
    }
    if(operator==='cos')
    {
        return new TreeNode(
            '*',
            new TreeNode('-1'),
            new TreeNode(
                '*',
                new TreeNode(
                    'sin',
                    null,
                    root.right
                ),
                derive(root.right)
            )
        )
    }

    if(operator==='tg')
    {
        return new TreeNode(
            '*',
            new TreeNode(
                '/',
                new TreeNode('1'),
                new TreeNode(
                    '^',
                    new TreeNode(
                        'cos',
                        null,
                        new TreeNode(root.right)
                    ),
                    new TreeNode('2')
                )
            ),
            derive(root.right)
        )
    }
    if(operator==='ctg')
    {
        return new TreeNode(
            '*',
            new TreeNode('-1'),
            new TreeNode(
                '/',
                new TreeNode('1'),
                new TreeNode(
                    '^',
                    new TreeNode(
                        'sin',
                        null,
                        root.right
                    ),
                    new TreeNode('2')
                )
            ),
            derive(root.right)
        )
    }
    if(operator==='arcsin')
    {
        return new TreeNode(
            '*',
            new TreeNode(
                '/',
                new TreeNode('1'),
                new TreeNode(
                    '^',
                    new TreeNode(
                        '-',
                        new TreeNode('1'),
                        new TreeNode(
                            '^',
                            root.right,
                            new TreeNode('2')
                        )
                    ),
                    new TreeNode(
                        '/',
                        new TreeNode('1'),
                        new TreeNode('2')
                    )
                )
            ),
            derive(root.right)
        )
    }
    if(operator==='arccos')
    {
        return new TreeNode(
            '*',
            new TreeNode('-1'),
            new TreeNode(
                '*',
                new TreeNode(
                    '/',
                    new TreeNode('1'),
                    new TreeNode(
                        '^',
                        new TreeNode(
                            '-',
                            new TreeNode('1'),
                            new TreeNode(
                                '^',
                                root.right,
                                new TreeNode('2')
                            )
                        ),
                        new TreeNode(
                            '/',
                            new TreeNode('1'),
                            new TreeNode('2')
                        )
                    )
                ),
                derive(root.right)
            )
        )
    }
    if(operator==='arctg')
    {
        return new TreeNode(
            '*',
            new TreeNode(
                '/',
                new TreeNode('1'),
                new TreeNode(
                    '+',
                    new TreeNode('1'),
                    new TreeNode(
                        '^',
                        root.right,
                        new TreeNode('2')
                    )
                )
            ),
            derive(root.right)
        )
    }

    if(operator==='arcctg')
    {
        return new TreeNode(
            '*',
            new TreeNode('-1'),
            new TreeNode(
                '*',
                new TreeNode(
                    '/',
                    new TreeNode('1'),
                    new TreeNode(
                        '+',
                        new TreeNode('1'),
                        new TreeNode(
                            '^',
                            root.right,
                            new TreeNode('2')
                        )
                    )
                ),
                derive(root.right)
            )
        )
    }
    
    //console.log(`"${operator}"`);
    throw new Error(`Operator nedefinit`);

}

function simplify_1_0(root) {
    if (!root || !root.left || !root.right) return;

    simplify_1_0(root.left);
    simplify_1_0(root.right);

    switch (root.value) {
        case '+':
            if (root.left.value === '0') 
            {
                root.value = root.right.value;
                root.left = root.right.left;
                root.right = root.right.right;
            } 
            else if (root.right.value === '0') 
            {
                root.value = root.left.value;
                root.right = root.left.right;
                root.left = root.left.left;
            }
            break;

        case '-':
            if (root.right.value === '0') 
            {
                root.value = root.left.value;
                root.right = root.left.right;
                root.left = root.left.left;
            } 
            else if (root.left.value === '0') 
            {
                root.value = '*';
                root.left.value = '-1';
            }
            break;

        case '*':
            if (root.left.value === '0' || root.right.value === '0') 
            {
                root.value = '0';
                root.left = null;
                root.right = null;
            } 
            else if (root.left.value === '1') 
            {
                root.value = root.right.value;
                root.left = root.right.left;
                root.right = root.right.right;
            } 
            else if (root.right.value === '1') 
            {
                root.value = root.left.value;
                root.right = root.left.right;
                root.left = root.left.left;
            }
            break;

        case '^':
            if (root.right.value === '0') 
            {
                root.value = '1';
                root.left = null;
                root.right = null;
            } 
            else if (root.right.value === '1') 
            {
                root.value = root.left.value;
                root.right = root.left.right;
                root.left = root.left.left;
            }
            break;
    }
}

function GCD(x,y)
{
    while(x!=y)
    {
        if(x>y)
        {
            x-=y;
        }
        else{
            y-=x;
        }
    }
    return x;
}

function isInteger(value) {
    return Number.isInteger(parseFloat(value));
}

function simplifyTree(node) {
    
    if (node === null) return null;

    
    node.left = simplifyTree(node.left);
    node.right = simplifyTree(node.right);

    
    if (node.left && node.right && isInteger(node.left.value) && isInteger(node.right.value)) {
        const leftValue = parseInt(node.left.value, 10);
        const rightValue = parseInt(node.right.value, 10);
        let result;

        switch (node.value) {
            case '+':
                result = leftValue + rightValue;
                break;
            case '-':
                result = leftValue - rightValue;
                break;
            case '*':
                result = leftValue * rightValue;
                break;
            case '/':
                if (rightValue !== 0 && leftValue % rightValue === 0) {  
                    result = leftValue / rightValue;
                } else if(rightValue!==0){
                    let x = GCD(leftValue,rightValue);
                    let l = (leftValue/x).toString();
                    let r = (rightValue/x).toString();
                    node.left.value = l;
                    node.right.value = r;
                    return node;  
                }
                break;
            case '^':
                result = Math.pow(leftValue,rightValue);
                break;
            default:
                return node;
        }

        node.value = result.toString();
        node.left = null;
        node.right = null;
    }

    return node;
}


 function run(exp)
{
    const expressionTree = buildExpressionTree(postfixata(exp));
    let newRoot = derive(expressionTree);
    simplify_1_0(newRoot);
    simplify_1_0(newRoot);//pt reverificare
    newRoot = simplifyTree(newRoot);
    return newRoot.toString();
}


const display = document.getElementById("display");

document.getElementById('display').addEventListener('keydown', function(event) {
    //console.log(event.key);
    if (event.key === 'Enter') {
        calculate();
    }
});
function appendToDisplay(button)
{
    display.value +=button.innerText;
}

function clearDisplay()
{
    display.value = "";
}

function deleteLastCharacter()
{
    let currentValue = display.value;

    if (currentValue.length > 0) 
    {
        currentValue = currentValue.slice(0, -1);
        display.value = currentValue;
    }
}

function calculate()
{
    /*try{
        display.value = eval(display.value);
    }
    catch(error){
        display.value = "Error";
    }
    calculator simplu
    */

    let exp = display.value;
   // console.log(exp);
    exp = run(exp);
    //console.log(exp);
    display.value = exp;
    

}
const list1 = [
    "C","CE","^","⌫","7","8","9","+","4","5","6","-","1","2","3","*","<>","0",".","="
];

const list2 = [
    "C","CE","^","⌫","log","ln","(",")","sin","cos","tg","ctg","arcsin","arccos","arctg","arcctg","<>","0","x","="
];


let reverseList = true;

changeButtonText();
function changeButtonText() {

    const buttons = document.querySelectorAll('.btn');

    buttons.forEach((button, index) => {
        if (index < list1.length) {
            button.innerText = reverseList===false?list2[index]:list1[index];
        }
    });
    reverseList = !reverseList;
}

