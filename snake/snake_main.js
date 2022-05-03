

//ctx.fillStyle = 'rgb(0, 0, 255)';
//ctx.fillRect(Math.floor(Math.random() * 600), Math.floor(Math.random() * 600), 10, 10);
//x, y, width, height

let canvas, ctx



class Rectangle {
  constructor(x,y,width,height,colour) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.fillColour = colour;
  }
  draw () {
    ctx.fillStyle = this.fillColour;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Food extends Rectangle {
  constructor(x=Math.floor(Math.random() * 600),
              y=Math.floor(Math.random() * 600),
              width=10,
              height=10,
              colour='rgb(0,0,255)') {
    super(x,y,width,height,colour)
  }
}


class Snake extends Rectangle {
  constructor(x,y,width=20,height=20,colour='rgb(255,255,255)') {
    super(x,y,width,height,colour);
    //this.segments = new Array(3);
    this.segments = [{x:300,y:300}, {x:280,y:300}, {x:260,y:300}];
  //  this.segmentz=["a","b","c"];
    this.test = ["0","1","2"];
    console.log(this.test)
    console.log(this.segments)
    this.draw_snake()
  }
/*
  create_snake() {
    for (let i=0;i<this.STARTING_POSITIONS.length;i++) {
      this.add_segment(this.STARTING_POSITIONS[i].x, this.STARTING_POSITIONS[i].y)
    }
  }
*/


// for some reason this adds one to the length of segment array rather than just
// updating the positions
  move() {
    for (let i = this.segments.length; i > 0 ; i--) {
      let new_pos = this.segments[i-1];
      this.segments[i] = new_pos;
    }
    this.segments[0].x += 20;
  }

  add_segment(x,y) {
    this.x = x;
    this.y = y;
    this.segments.push({x:x,y:y});
  }

  draw_snake() {
    for (var i = 0; i < this.segments.length; i++) {
      this.x = this.segments[i].x;
      this.y = this.segments[i].y;
      this.draw()
    }
  }


}




// setup the Canvas
function init () {
  canvas = document.querySelector('.myCanvas');
  width = canvas.width = 600;
  height = canvas.height = 600;
  ctx = canvas.getContext('2d');
  ctx.fillStyle = 'rgb(0, 0, 0)';
  ctx.fillRect(0, 0, width, height);
  let newFood = new Food()
  newFood.draw()
  let newSnake = new Snake()
  //newSnake.create_snake()
  game_on = true;
  setTimeout(newSnake.move(), 1000);




  //while (game_on == true) {
  //  newSnake.move()
//  }






}


// Wait for html to load and then start canvas initialisation
document.addEventListener('DOMContentLoaded', init)

//while game_on === true {






//}






//game_on = true;

//while game_on {
  // sleep 0.1s
  // food.refesh
//}
