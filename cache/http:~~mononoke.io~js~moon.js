// document.getElementById("moon").style.visibility = "hidden";
setTimeout(function(){
  // console.log(document.getElementById("moon"))
  document.getElementById("moon").style.visibility = "visible";
}, 1000)

var scrollVal
window.onscroll = function(){
  ancientScroll()
}


var ancientScroll = function(){
  scrollVal = document.body.scrollTop*-1
  // console.log(document.body.scrollTop)
  // console.log(document.getElementById("moon").style.right)
  document.getElementById("moon").style.right = scrollVal + 'px'
  // if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
  //   console.log(document.getElementById("moon"))
  // }
}
