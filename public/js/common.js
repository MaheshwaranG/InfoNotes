"use strict";function userProfilePopup(){var i=document.getElementById("myPopup");i.style.visibility="visible"}window.onclick=function(i){var e=document.getElementById("myPopup"),t=i.target.id;switch(t){case"mgAvatar":case"nav-profile-label":case"myPopup":e.style.visibility="visible";break;default:e.style.visibility="hidden"}};