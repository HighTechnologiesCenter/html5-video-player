function initPlayerEventListeners()
{
	var advpause = 15; // sec. Позиция, на которой в видео будет вставлена "реклама"
	var AdvShowed = false; // указатель, что реклама была/ не была показана
	
	myPlayer = new PlayerClass("video"); // создаем класс плеера
	
	// событие окончания видео
	myPlayer.event(myPlayer.TYPE.ENDED, {ended: function(){
		
		console.log("ended");
		
		if (myPlayer.backVideo.url != null)
			myPlayer.backVideo.set();
	}});
	
	// событие паузы
	myPlayer.event(myPlayer.TYPE.PAUSE, {pause: function(){
	    console.log("pause");
	}});
	
	// событите играния видео
	myPlayer.event(myPlayer.TYPE.PLAY, {play: function() {
	    console.log("play");
	}});
	
	// загрузил полностью
	myPlayer.event(myPlayer.TYPE.LOADEDDATA, {loadeddata: function(){
		console.log("loadeddata");
		
		myPlayer.backVideo.start();
		
	}});
	
	// определять внешний вид плеера в зависимости от типа проигрываемого видео
	myPlayer.event(myPlayer.TYPE.LOADEDMETADATA, {loadedmetadata: function(){
		console.log("loadmetadata");
	}});
	
	// обновление времени
	myPlayer.event(myPlayer.TYPE.TIMEUPDATE, {timeupdate: function(pos, duration){
		
		console.log("pos: " + pos);
		//console.log("duration: " + duration);
		
		if (pos == advpause && !AdvShowed)
		{
			AdvShowed = true;
			myPlayer.backVideo.change(advfile, true); // вставить первый блок рекламы
		}
	}});
	
	// событие застопоривания видео
	myPlayer.event(myPlayer.TYPE.WAITING, {waiting: function() {
		console.log("waiting");
	}});
	
	// событие ошибки в плеере
	myPlayer.event(myPlayer.TYPE.ERROR, {error: function(type_err) {
		console.log("error");
	}});
}