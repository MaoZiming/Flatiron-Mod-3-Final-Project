const character = document.querySelector("#character")
const bar = document.querySelector("#bar")
var next = document.querySelector("#block")
const status = document.querySelector("#status")
const score = document.querySelector("#score")
var start = document.querySelector("#start")

var time_hold = 0 // record the time the space_key is held
var timer_function = null // the event that the space key is held
var char_top = 77.5;  // character top (percentage)
var char_left = 1;
const char_width = 3;  
const jump_height = 50; 
const jump_width = 80;

var next_left = 20; //next box left (percentage)
var next_width = 5; //next box width (perecntage)

var start_width = 5; //start box width(percentage)
var start_left = 1; //start box left

const bar_width = 20;
const right_border = 95.3;
const bottom_border = 91.8;
const speed_factor_y = 5;
const speed_factor_x = 1;

var shift_distance = next_left- start_left; 

var from = start //the object where the character jumps from, used for landing on the same object

var round_passed = 0 //record the number of rounds passed
var score_number = 0;
var consecutive_times = 1;

const box_location = [
  {left: 0, width: 5},
  {left: 20, width: 5},
  {left: 30, width: 4},
  {left: 20, width: 2},
  {left: 20, width: 3},
  {left: 20, width: 5},
  {left: 30, width: 4},
  {left: 20, width: 2},
  {left: 20, width: 3},
  {left: 20, width: 5},
  {left: 30, width: 4},
  {left: 20, width: 2},
  {left: 20, width: 3},
  {left: 20, width: 5},
  {left: 30, width: 4},
  {left: 20, width: 2},
  {left: 20, width: 3},
  {left: 20, width: 4},
  {left: 22, width: 4},
  {left: 26, width: 5},
  {left: 10, width: 1}
]



document.addEventListener("keydown", function(){

    if (event.repeat || event.keyCode !== 32) { return } //make sure space is pressed
    timer_function = setInterval(function(){ 

        time_hold += 5;
        let bar_current_width = bar_width * (4000 - time_hold) / 4000
        if (bar_current_width > 0){
            bar.style = `width: ${bar_current_width}%`
        }

    }, 1);
              
})

document.addEventListener("keyup", function(){
    if (event.isComposing || event.keyCode === 229 || event.keyCode !== 32) {
        return;
    }
    let height_percentage = time_hold > 4000 ? 1 : time_hold / 4000;
    jump(height_percentage)
    clearInterval(timer_function); //clear the hold down function

    bar.style = `width: ${bar_width}%` //reset the bar
    time_hold = 0
})

function create_next_box(left = 30, width = 2){  //after start is hidden 
  if (left == null) left = 30
  if (width == null) width = 3
  start.style.left = left + "%"
  start.style.width = width + "vw"
  start.style.visibility = "visible"

  next_left = left 
  next_width = width
  return start
}

function shift_next(){
  let id = setInterval(frame, 1);
  let ct = 0;
  console.log(next_left - start_left)
  shift_distance = next_left - start_left
  function frame(){
    if (ct > shift_distance){
      clearInterval(id);

      start_left = next_left   //next box is shifted to the left 
      start_width = next_width  //next box becomes the new start box
      let tmp = next
      next = create_next_box(next_left + box_location[round_passed].left, box_location[round_passed].width); //next box becomes the new box created from start box
      start = tmp; //start box becomes the (then) next box
    }
    
    else {
      ct += shift_distance/200;
      next_left -= shift_distance/200
      char_left -= shift_distance/200
      next.style.left = next_left + "%"
      character.style.left = char_left + "%"
    }
  }

}
function jump(height_percentage){

   
    let id = setInterval(frame, 1);

    let current_top = char_top;
    let current_left = char_left;
    let max_height = char_top - jump_height * height_percentage
    let max_length = jump_width / 2;

    function frame() {
      if (current_top < max_height) {
        clearInterval(id);
        fall(current_top, max_height, current_left, height_percentage);
        
      } else {
        current_top-= Math.sqrt(current_top - max_height) / speed_factor_y; 
        // v^2 = 2gx => velocity is proportional to sqrt(distance)
        character.style.top = current_top + '%';
        if (current_left < right_border){
            current_left += speed_factor_x * height_percentage;
            character.style.left = current_left + '%';
        }
      }
    }
}

function fall(current_top, max_height, current_left, height_percentage){
    let id = setInterval(frame, 1);
    let max_length = jump_width;

    function frame() {
        if (current_top >= bottom_border){
            status.innerText = "Failed"
            clearInterval(id);
        }
        else if (current_top >= char_top) {
          
          char_left = current_left
          if (checkPass()) {   //if character lands on the next box
              
              clearInterval(id);
              status.innerText = "Pass" 
              start.style.visibility = "hidden" // hide the start box
              round_passed ++
              score_number += 10
              score.innerText = ` Score: ${score_number }`
              if (from == start){   //if the character is jumped from the start box
                from = next 
                shift_next()
              }
          }
          else {
              if (char_left > start_width + start_left){

                current_top += Math.sqrt(current_top - max_height + 0.01) /speed_factor_y;
                character.style.top = current_top + '%';

                if (current_left < right_border){
                  current_left += speed_factor_x * height_percentage;
                  character.style.left = current_left + '%';
                }

              }
              else {  //the character lands on the same box
                  clearInterval(id);
              }
          }       
        } else {
          current_top += Math.sqrt(current_top - max_height + 0.01) /speed_factor_y;
          character.style.top = current_top + '%';
          if (current_left < right_border){
            current_left += speed_factor_x * height_percentage;
            character.style.left = current_left + '%';
        }
        }
    }    
}

function checkPass(){
    let error_margin = 1
    if (char_left + char_width > next_left + next_width - error_margin && char_left + char_width < next_left + next_width + error_margin ){
      score_number += 10 * (Math.pow(2, consecutive_times - 1))
      consecutive_times ++ 
      score.innerText = ` Score: ${score_number }`
    }
    else {
      consecutive_times = 1
    }
    if (char_left + char_width > next_left && char_left + char_width < next_left + next_width) return true
    else if (char_left > next_left && char_left < next_left + next_width) return true
    else {
       return false
    }
}