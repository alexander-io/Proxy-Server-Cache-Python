// setTimeout(function(){
//   document.getElementById('developer').style.visibility = 'visible'
// }, 3000)

// setTimeout(function(){
//   document.getElementById('kodama').addEventListener("mouseover", function(){
//     document.getElementById('developer').style.visibility = 'visible'
//   })
// },2000)
// console.log(document.getElementById('kodama').)

document.getElementById('kodama-container').addEventListener("mouseover", function(){
  document.getElementById('developer').style.visibility = 'visible'
  // Materialize.toast('You\'ve found the controls!', 2500)
})

document.getElementById('kodama').addEventListener("mouseover", function(){

  // document.getElementById('developer').style.visibility = 'visible'
  Materialize.toast('You\'ve found the controls!', 2500)
  // setTimeout(function(){
  //   // console.log('you have found the controls!')
  //   // alert('you found the controls')
  //
  // }, 3000)
})


document.getElementById('drop1').addEventListener("click", function(){
  Materialize.toast('<i class="material-icons">keyboard_arrow_up</i>', 1000)
})
document.getElementById('drop2').addEventListener("click", function(){
  Materialize.toast('<i class="material-icons">keyboard_arrow_down</i>', 1000)
})
document.getElementById('drop3').addEventListener("click", function(){
  Materialize.toast('<i class="material-icons">keyboard_arrow_left</i>', 1000)
})
document.getElementById('drop4').addEventListener("click", function(){
  Materialize.toast('<i class="material-icons">keyboard_arrow_right</i>', 1000)
})

document.getElementById('kodama').addEventListener("mouseout", function(){

  setTimeout(function(){
    document.getElementById('developer').style.visibility = 'hidden'
  },3300)
})

// $("kodama").mouseenter(function(){
//     clearTimeout($(this).data('timeoutId'));
//     $(this).find(".tooltip").fadeIn("slow");
// }).mouseleave(function(){
//     var someElement = $(this),
//         timeoutId = setTimeout(function(){
//             someElement.find(".tooltip").fadeOut("slow");
//         }, 650);
//     //set the timeoutId, allowing us to clear this trigger if the mouse comes back over
//     someElement.data('timeoutId', timeoutId);
// });
