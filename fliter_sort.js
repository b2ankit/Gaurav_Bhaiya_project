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