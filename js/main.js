
var mainfile = "https://mediasvck7tqz5mj5mttq.blob.core.windows.net/videos/76e760b4ed90472da01ba5a94b847b7d.mp4";
var advfile = "https://mediasvck7tqz5mj5mttq.blob.core.windows.net/videos/68055bf6de9fd78b5fd5d2c706374b2b.mp4";

$(document).ready(function(){
	
	initPlayerEventListeners();
	
    $("#start").on("click", function(e){
		myPlayer.setUrl(mainfile, true);
    });
	
	var Play = 1;
    $("#play-pause").on("click", function(e){
		Play *= -1;
		myPlayer.playpauseVideo((Play > 0) ? true : false);
    });
	
	$("#backward").on("click", function(){
		myPlayer.jumpVideo(myPlayer.MOVE.BACKWARD, 180, true);
	});

	$("#forward").on("click", function(){
		myPlayer.jumpVideo(myPlayer.MOVE.FORWARD, 180, true);
	});
	
	$("#stop").on("click", function(){
		myPlayer.stopVideo();
		myPlayer.deinit();
	});
	
});
