//Create variables here
var dog , happyDog , database , foodS ,foodStock , dogImage;
var foodObj,fedTime,lastFed;
var bedroomImage,gardenImage,washroomImage;
var readState,changeState;
var garden,bedroom,washroom;

function preload()
{
  //load images here
  dogImage = loadImage("images/dogImg.png");
  happyDog = loadImage("images/dogImg1.png");
  bedroomImage = loadImage("images/virtual pet images/Bed Room.png");
  gardenImage = loadImage("images/virtual pet images/Garden.png");
  washroomImage = loadImage("images/virtual pet images/Wash Room.png");
}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);
  foodObj = new Food();

  dog = createSprite(800,60,50,50)
  dog.addImage(dogImage)
  dog.scale=0.15;
  // var dogposition = database.ref('dog/position')
  // dogposition.on("value",readPosition,showError)
  foodStock = database.ref('Food')
  foodStock.on("value",readStock)

  feed = createButton("FEED THE DOG")
  feed.position(900,95)
  feed.mousePressed(feedDog);

  addFood = createButton("ADD FOOD")
  addFood.position(800,95)
  addFood.mousePressed(addFoods);

  readState = database.ref('GameState');
  readState.on("value",function(data){
    gameState = data.val();
  });
}
function draw() {  
background(46,139,87)
foodObj.display();
//if(keyWentDown(UP_ARROW)){
 // writeStock(foodS);
  //dog.addImage(happyDog);
//}
 
  fill(255,255,254);
  stroke("black");
  text("Food remaining : "+foodS,150,50);
  textSize(13);
  
  fedTime = database.ref('FeedTime')
  fedTime.on("value",function(data){
    lastFed=data.val()
  });

  if(lastFed>=12){
    text("Last Feed : "+ lastFed%12 + " PM", 350,30);
   }else if(lastFed==0){
     text("Last Feed : 12 AM",350,30);
   }else{
     text("Last Feed : "+ lastFed + " AM", 350,30);
   }
   currentTime = hour();
   if(currentTime===(lastFed+1)){
     update("Playing");
     foodObj.garden();  
   }else if(currentTime===(lastFed+2)){
     update("Sleeping")
     foodObj.bedroom();
   }else if(currentTime>(lastFed+2)&&currentTime<=(lastFed+4)){
     update("Bathing")
     foodObj.washroom
   }else{
     update("Hungry")
     foodObj.display();
   }
if(gameState!="Hungry"){
  feed.hide();
  addFood.hide();
  dog.remove();
}else{
feed.show();
addFood.show();

}
   drawSprites();
}
function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
  }
  //Function to write values in DB
// function writeStock(x){
//   if(x<=0){
//     x=0;
//   }else{
//     x=x-1;
//   } 
//   database.ref('/').update({
//     Food:x
//   })
// }
function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}
