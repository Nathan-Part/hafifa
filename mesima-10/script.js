console.log(people); 

var parent = document.querySelector(".cards");

function generateCard(people)
{
    for (let i = 0; i < people.length; i++) 
    {
        const card = people[i];
        var age = card.age 
        var name = card.name 
        var admin = card.admin 
        var grades = card.grades 
        var address = card.address
        var houseNumber = card.houseNumber
        
        var cardsElement = document.createElement("div");
        cardsElement.classList.add('card');
        cardsElement.id = 'card'+i;
        
        var line1 = document.createElement("div");
        
        var nameCards = document.createElement('span');
        nameCards.innerText = name + ' '
        
        var crown = document.createElement('i');
        crown.classList.add('fas', 'fa-crown');
        crown.style.color = "orange";
        crown.title = "Admin";
        admin == "true" ? nameCards.appendChild(crown) : null;
        
        var ageCards = document.createElement('span');
        ageCards.innerText = age;
        
        var line2 = document.createElement("div");
        
        var addressCard = document.createElement('span');
        addressCard.innerText = address;
        
        var houseNumberCard = document.createElement('span');
        houseNumberCard.innerText = houseNumber;
        
        parent.appendChild(cardsElement);
        cardsElement.appendChild(line1);
        cardsElement.appendChild(line2);
        line1.appendChild(nameCards);
        line1.appendChild(ageCards);
        line2.appendChild(addressCard);
        line2.appendChild(houseNumberCard);
    }
}

generateCard(people);

function sum(array)
{
    var total = 0;
    for (let i = 0; i < array.length; i++) {
        const element = array[i];
        total += element;
    }
    total = total / array.length;
    return total;
}

function filterCard()
{
    var letter = document.getElementById('search').value;
    var category = document.getElementById('select').value;
    var newList = people.filter(function(people) {
        if(typeof people[category] == "string")
        {
            return people[category].toLowerCase().includes(letter.toLowerCase());
        }
        else if(typeof people[category] == "number")
        {
            return people[category].toString().includes(letter);
        }
        else if(category == "grades")
        {
            return sum(people[category]) >= letter;
        }
    });
    parent.innerHTML = "";
    generateCard(newList);
}

function agg()
{
    var letter = document.getElementById('search').value;
    var isAvailaible = true;
    var newList = people.filter(function(listGrades) {
        for (let i = 0; i < listGrades.grades.length; i++) {
            const element = listGrades.grades[i];
            if(element < letter)
            {
                isAvailaible = false;
            }
        }
        if(isAvailaible) return listGrades;
        isAvailaible = true;
    });
    parent.innerHTML = "";
    generateCard(newList);
}

function sgg()
{
    var letter = document.getElementById('search').value;
    var isAvailaible = false;
    var newList = people.filter(function(listGrades) {
        console.log(listGrades.grades);
        for (let i = 0; i < listGrades.grades.length; i++) {
            const element = listGrades.grades[i];
            if(element > letter)
            {
                isAvailaible = true;
                if(isAvailaible) return listGrades;
            }
        }
        isAvailaible = false;
    });
    parent.innerHTML = "";
    generateCard(newList);
}

function arrayFilter()
{
    var letter = document.getElementById('search').value;
    var newList = people.filter(function(people) {
        if(sum(people.grades) < letter && people.houseNumber > letter)
        {
            people.age += parseInt(letter);
            return people;
        }
    });
    parent.innerHTML = "";
    generateCard(newList);
}

// faire une fonction qui permet si par exemple je met 20 alors houseNumber dois être superieur et la moyenne des grades inferieur et additionner le chiffre entré avec l'age
