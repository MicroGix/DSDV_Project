// set the initial value of panel
let slideIndex = 1;
showSlides(slideIndex);
// move the next slide
function plusSlides(n) {
  showSlides((slideIndex += n));
}
// move the previous slide

function currentSlide(n) {
  showSlides((slideIndex = n));
}
// show slide
function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " active";
}
