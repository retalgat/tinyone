"use strict";const header=document.querySelector("header"),scrollChange=1;window.addEventListener("scroll",(function(){window.scrollY>=1?header.classList.add("header--scroll"):header.classList.remove("header--scroll")}));