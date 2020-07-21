const character = document.querySelector("#character")
const bar = document.querySelector("#bar")
var next = document.querySelector("#block")
const status = document.querySelector("#status")
const score = document.querySelector("#score")
const bonus = document.querySelector("#bonus")

var start = document.querySelector("#start")

var time_hold = 0 // record the time the space_key is held
var timer_function = null // the event that the space key is held
var char_top = 77.5;  // character top (percentage)
var char_left = 1;
const char_width = 1.5;  
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
var keyDown = false;

const box_location = [
  {left: 10, width: 8},
  {left: 11, width: 5},
  {left: 14, width: 9},
  {left: 16, width: 10},
  {left: 12, width: 8},
  {left: 20, width: 4},
  {left: 19, width: 5},
  {left: 11, width: 3},
  {left: 20, width: 5},
  {left: 14, width: 4},
  {left: 20, width: 8},
  {left: 20, width: 3},
  {left: 20, width: 5},
  {left: 30, width: 4},
  {left: 20, width: 2},
  {left: 20, width: 3},
  {left: 20, width: 4},
  {left: 22, width: 4},
  {left: 26, width: 5},
  {left: 20, width: 3},
  {left: 20, width: 5},
  {left: 30, width: 4},
  {left: 20, width: 2},
  {left: 20, width: 3},
  {left: 20, width: 5},
  {left: 30, width: 4},
  {left: 20, width: 3},
  {left: 20, width: 5},
  {left: 20, width: 3},
  {left: 20, width: 5},
  {left: 30, width: 3},
  {left: 20, width: 2},
  {left: 20, width: 3},
  {left: 20, width: 1},
  {left: 30, width: 2},
  {left: 30, width: 2},
  {left: 20, width: 2},
  {left: 20, width: 3},
  {left: 20, width: 2},
  {left: 30, width: 1},
  {left: 20, width: 3},
  {left: 20, width: 3},
  {left: 30, width: 1},
  {left: 20, width: 2},
  {left: 20, width: 3},
  {left: 20, width: 2},
  {left: 30, width: 2},
  {left: 10, width: 1}
]

function key_hold_sound(){
  document.getElementById('audio_hold').play()
}

function key_hold_sound_pause(){
  document.getElementById('audio_hold').pause()
  document.getElementById('audio_hold').currentTime = 0
}

function land_sound(){
  document.getElementById('audio_land').play()
}

function fall_sound(){
  document.getElementById('audio_fall').play()
}


const keydown_function = function(event){
  keyDown = true

  
  if (event.repeat || event.keyCode !== 32) { return } //make sure space is pressed'
  key_hold_sound()
  timer_function = setInterval(function(){ 

      time_hold += 5;
      let bar_current_width = bar_width * (4000 - time_hold) / 4000
      if (bar_current_width > 0){
          bar.style = `width: ${bar_current_width}%`
      }
  }, 1);
           
}
const keyup_function = function(event){

  
  land_sound()
  if (!keyDown) {return}
  key_hold_sound_pause()
  if (event.isComposing || event.keyCode === 229 || event.keyCode !== 32) {
      return;
  }
  let height_percentage = time_hold > 4000 ? 1 : time_hold / 4000;
  jump(height_percentage)
  clearInterval(timer_function); //clear the hold down function

  bar.style = `width: ${bar_width}%` //reset the bar
  time_hold = 0
  keyDown = false;
}

document.addEventListener("keyup", keyup_function)
document.addEventListener("keydown", keydown_function)

function create_next_box(left = 30, width = 8){  //after start is hidden 
  if (left == null) left = 30
  if (width == null) width = 3
  start.style.left = left + "%"
  start.style.width = width + "%"
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
  // document.removeEventListener("keydown")
  // document.removeEventListener("keyup", keyup)
  document.removeEventListener("keyup", keyup_function)
  document.removeEventListener("keydown", keydown_function)


  function frame(){
    if (ct > shift_distance){
      clearInterval(id);
      bonus.innerText = ""
      start_left = next_left   //next box is shifted to the left 
      start_width = next_width  //next box becomes the new start box
      let tmp = next
      next = create_next_box(next_left + box_location[round_passed-1].left, box_location[round_passed-1].width); //next box becomes the new box created from start box
      start = tmp; //start box becomes the (then) next box    
      document.addEventListener("keyup", keyup_function)
      document.addEventListener("keydown", keydown_function)
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

    document.removeEventListener("keyup", keyup_function)
    document.removeEventListener("keydown", keydown_function)

    function frame() {
      if (current_top < max_height) {
        clearInterval(id);
        document.addEventListener("keyup", keyup_function)
        document.addEventListener("keydown", keydown_function)
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
    document.removeEventListener("keyup", keyup_function)
    document.removeEventListener("keydown", keydown_function)
    let max_length = jump_width;
    let checked = false;
    function frame() {
        if (current_top >= bottom_border){ //when the box touches the bottom
            fall_sound()
            status.innerText = "Failed"
            clearInterval(id);
            document.addEventListener("keyup", keyup_function)
            document.addEventListener("keydown", keydown_function)
            // alert("Failed")
            // window.location.reload(false); 
            score_number = 0
            score.innerText = ` Score: ${score_number }`

        }
        else if (current_top >= char_top) {
          
          char_left = current_left

          if (checkPass() && !checked) {   //if character lands on the next box
              document.addEventListener("keyup", keyup_function)
              document.addEventListener("keydown", keydown_function)
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
              if (char_left <= start_width + start_left){   //haven't leave the starting box
                document.addEventListener("keyup", keyup_function)
                document.addEventListener("keydown", keydown_function)
                clearInterval(id);
              }
              else {   //left the starting box but misses

                current_top += Math.sqrt(current_top - max_height + 0.01) /speed_factor_y;
                character.style.top = current_top + '%';

                if (current_left < right_border ){
                  if (current_left + char_width > next_left && current_left + char_width < next_left + next_width){return}
                   
                  current_left += speed_factor_x * height_percentage;
                  character.style.left = current_left + '%';
                }

              }
          }
          checked = true       
        } 
        
        else { //still flying above the height of the box
          current_top += Math.sqrt(current_top - max_height + 0.01) /speed_factor_y;
          character.style.top = current_top + '%';
          if (current_left < right_border ){
            if (current_left + char_width > next_left && current_left + char_width < next_left + next_width && current_top > char_top) {return }
            current_left += speed_factor_x * height_percentage;
            character.style.left = current_left + '%';
        }
        }
    }    
}

function checkPass(){
    let error_margin = next_width * 0.3
    if (char_left + char_width/2 > next_left + next_width /2 - error_margin && char_left + char_width /2 < next_left + next_width /2 + error_margin ){
      bonus.innerText = "+" + 10 * (Math.pow(2, consecutive_times - 1))
      bonus.style.left = char_left + "%"
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