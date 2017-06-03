// Curriculum Template Code
//
// What it does
// * Handles navigation between the activity steps
// * Shows the correct step based on the URL (when sending someone a link to a specific step, for example)
// * Keeps the left-hand navigation fixed to the top of the page when in desktop mode

var navTop, navEl, windowHeight, navHeight;

$(document).ready(function(){
  navEl = $(".agenda-navigation");
  var navOffset = navEl.offset();
  navTop = navOffset.top;

  navigate(window.location.hash);

  // If there is already a hardcoded menu in the markup.
  var hasMenu = $(".activity-menu").length > 0;

  if(hasMenu) {
    $(".activity-menu .toggle").on("click",function(){
      $(".activity-menu ol").slideToggle();
      $(this).toggleClass("menu-open");
      return false;
    });
  }

  if(!hasMenu) {
    jQuery.getScript("activity-menu.js", function( data, textStatus, jqxhr ) {
      buildActivityMenu(title, activities);
    }).error(function(){
      console.log("This activity does not have a menu.");
    });
  }

  navEl.on("click","a",function(){
    var step = $(this).attr("href");
    navigate(step);
    return false;
  });

  $(window).on("scroll",function(){
    if($(".wrapper").width() > 600){
      scroll();
    }
  });

  $("aside img").on("load",function(){
    navOffset = navEl.offset();
    navTop = navOffset.top;
  });
});


function buildActivityMenu(title, activities){

  var path = window.location.pathname;
  var index = path.indexOf("session");
  var activityNum = parseInt(path.substring(index + 7,index + 9)) || 0;

  var menu = $("<div class='activity-menu'></div>");
  var activityCount = activities.length;
  var toggle = $("<a class='toggle'><strong>" + title + "</strong> - Activity <span class='current-activity'>1</span> of " + activityCount + "</a>");
  var activityList = $("<ol class='activity-list'/>");

  menu.append(toggle);
  menu.append(activityList);

  for(var i = 0; i < activities.length; i ++){
    var activity = activities[i];
    var activityItem = $("<li><a href='" + activity.url + "'>" + activity.title + "</li>");
    activityList.append(activityItem);

    if(activity.extension){
      var link = $("<br/><span class='extension'>Extension - <a href='"+activity.extension.url+"'>"+activity.extension.title+"</a></span>");
      activityItem.append(link);
    }
  }

  $(toggle).find(".current-activity").text(activityNum);
  $(activityList).find("li:nth-child("+activityNum+")").addClass("current");

  $(toggle).on("click",function(){
    $(".activity-menu ol").slideToggle();
    $(this).toggleClass("menu-open");
    return false;
  });

  $(".main").prepend(menu);
}


function navigate(hash){
  // First, we'll hide all of the conten
  $(".agenda > li").hide();
  $("section.overview").hide();

  // Next, we'll try to figure out what step to show based on the hash.
  hash = hash.toLowerCase();
  var numberOfSteps = $(".agenda > li").length;
  var overview = true;
  if(hash.indexOf("step") > 0) {
    var step = hash.replace("#step-","");
    if(step <= numberOfSteps){
      overview = false;
    }
  }

  // If there's a step number in the hash, we'll show that step.
  // Otherwise, we'll default to the overview.
  if(overview) {
    hash = "#overview";
    $("section.overview").show();
    $("body").attr("mode","overview");
  } else {
    $(".agenda > li:nth-child("+step+")").show();
    $("body").attr("mode","step");
  }

  // Add the selected class to the activity navigation link.
  navEl.find(".selected").removeClass("selected");
  navEl.find("a[href="+hash+"]").parent().addClass("selected");

  // Scroll the page to the top
  $(window).scrollTop(0);

  window.location.hash = hash;
}

function scroll(){
  var scrolled = $(window).scrollTop();
  var imgHeight = $("aside .image").height() || 0;

  if(scrolled > imgHeight){
    $(".agenda-navigation").addClass("fixed")
  } else {
    $(".agenda-navigation").removeClass("fixed");
  }
}
