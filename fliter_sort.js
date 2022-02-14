function myFunction() {
    var mybox = document.getElementById("mybox");
    var myicon = document.getElementById("myicon");
    if (mybox.style.display === "block") {
        mybox.style.display = "none";
        myicon.style.opacity=1;
    } else {
        mybox.style.display = "block";
        myicon.style.opacity=0.6;
    }
    
  }

  var rangeBullet = document.getElementById("rs-bullet");
  var rangeSlider = document.getElementById("range_bar_1");

  rangeSlider.addEventListener("input", showSliderValue, false);

  function showSliderValue() {
    rangeBullet.innerHTML = "£"+(rangeSlider.value/100);
    var bulletPosition = Number(((rangeSlider.value - rangeSlider.min) * 100) / (rangeSlider.max - rangeSlider.min)); 
    rangeBullet.style.left = `calc(${bulletPosition}% + (${-8 - bulletPosition * 0.2}px))`;
  }

