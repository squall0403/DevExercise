function changeContent() {
  document.getElementById('demo').innerHTML = "Changed";
}

function turnOff() {
  document.getElementById('lightBub').src = "http://www.w3schools.com/js/pic_bulboff.gif";
}

function turnOn() {
  document.getElementById('lightBub').src = "http://www.w3schools.com/js/pic_bulbon.gif";
}

function toggleLight() {
  if (document.getElementById('lightBub').src == "http://www.w3schools.com/js/pic_bulboff.gif") {
    document.getElementById('lightBub').src = "http://www.w3schools.com/js/pic_bulbon.gif";
    // alert("Off");
  } else {
    document.getElementById('lightBub').src = "http://www.w3schools.com/js/pic_bulboff.gif";
    // alert("ON");
  }
}

function stealLight() {
  if (document.getElementById('lightBub').style.display == "none") {
    document.getElementById('lightBub').style.display = "block";
  } else {
      document.getElementById('lightBub').style.display = "none";
  }
}

function writeDoc() {
  document.write("This this was written by script!");
}

var xcar = ["Volvo","BMW","Mer"];
console.log("The car type is: " + xcar[0]);

var car ={
  type: "Fiat",
  model: "500",
  color: "White"
};
console.log("The car type is: " + car.type);
console.log("The car model is: " + car.model);
console.log("The car color is: " + car.color);

var person = {
  firstName: "Duy", //Properties
  lastName: "Nguyen", //Properties
  age: 28, //Properties
  gender: "Male", //Properties
  fullName: function() {return this.firstName + " " + this.lastName;} //Method
};

console.log(person.fullName());
