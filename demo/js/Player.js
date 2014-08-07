function PlayerClass(id)
{
	var self = this;
    var plugin = null;
	this.TYPE = {
		CANPLAY: "canplay",
		PLAY: "play",
		PAUSE: "pause",
		ENDED: "ended",
		LOADEDDATA: "loadeddata",
		LOADEDMETADATA: "loadedmetadata",
		TIMEUPDATE: "timeupdate",
		PROGRESS: "progress",
		WAITING: "waiting",
		ERROR: "error"
	};
	
	// типы установленных перемещений
	this.MOVE = {
		FORWARD: "forward",
		BACKWARD: "backward"
	};
	
	var id_video = null;
	
	// конструктор	
	function init(id)
	{
		try
		{
			self.plugin = document.getElementById(id);
	        if (self.plugin) 
				id_video = id;
	    }
		catch (e)
		{
			//...
	    }
	};
	
	// деинициализация плеера
	this.deinit = function()
	{
		this.stopVideo();
		self.plugin.src = null;
		self.plugin = null;
	};
	
	// выставить url и (не)начать проигрывать
	this.setUrl = function(url, startVideo)
	{
		this.deinit();
		init(id_video);
		self.plugin.src = url;
		if (startVideo && self.plugin.src != null && self.plugin.src != "")
			self.playVideo();
	};
	
	// играть
	this.playVideo = function(pos)
	{
		self.plugin.play();
		if (pos > 0)
			self.jump_to(pos, true);
	};
	
	// пауза
	this.pauseVideo = function()
	{
		self.plugin.pause();
	};
	
	// стоп (аналог паузы)
	this.stopVideo = function()
	{
		self.plugin.pause();
	};
	
	this.playpauseVideo = function(start)
	{
		if (start)
			self.playVideo();
		else
			self.pauseVideo()
	};
	
	var freeze_jump = false;
	
	// перемотка
	this.jumpVideo = function(move, step, start)
	{
		if (!self.plugin.paused && !freeze_jump)
		{
			freeze_jump = true; // заморозить перемотку
			if (move == self.MOVE.FORWARD) // скачем вперед
			{
				if (self.plugin.currentTime + step < self.plugin.duration)
					self.plugin.currentTime += step;
				else
					self.plugin.currentTime = self.plugin.duration - 1; // чтобы уж совсем в конец не уходить
				self.playpauseVideo(start);
			}
			if (move == self.MOVE.BACKWARD) // скачем назад
			{
				if (self.plugin.currentTime - step > 0)
					self.plugin.currentTime -= step;
				else
					self.plugin.currentTime = 1; // чтобы уж совсем в начало не вставать
				self.playpauseVideo(start);
			}
			setTimeout(function () { freeze_jump = false; }, 2000);
		}
	};
	
	// объект для запоминания видео и его позиции при показе рекламы
	this.backVideo = {
		url: null, 
		pos: null,
		change: function(url, play) // сменить видео на другое (запоминать позицию основного видео)
		{
			if (url != null && self.plugin)
			{
				this.url = self.plugin.src;
				this.pos = self.plugin.currentTime;
				self.setUrl(url, play);
			}
		},
		set: function() // вставить основное видео обратно
		{
			if (this.url != null)
			{
				self.setUrl(this.url, true);
				return true;
			}
			return false;
		},
		start: function() // запустить основное видео на проигрывание
		{
			if (this.url != null && this.url == self.plugin.src)
			{
				self.playVideo((this.pos > 0) ? this.pos : 0);
				this.url = null;
				this.pos = null;
			}
		}
	};
	
	// вернуть длительность в секундах
	this.getPlayTimeSec = function() 
	{
		if (self.plugin)
        	return self.plugin.duration;
		else
			return 0;
    };
	
	// вернуть позицию в секундах
	this.getPlayPosSec = function() 
	{
		if (self.plugin)
        	return Math.round(self.plugin.currentTime);
		else
			return 0;
    };
	
	// прыгнуть на указанное место
    this.jump_to = function(sec, start) 
	{
		self.plugin.currentTime = sec;
		self.playpauseVideo(start);
    };
	
	// обработчик событий в плеере
	this.event = function(type, $callback)
	{
		switch (type)
		{
			case self.TYPE.CANPLAY: // можно начать проигрывание (лучше не юзать, потому что это событие постоянно валится)
				self.plugin.addEventListener("canplay", function() { $callback.canplay(); });
			break;
			case self.TYPE.PLAY: // запущено проигрывание
				self.plugin.addEventListener("play", function() { $callback.play(); });
			break;
			case self.TYPE.PAUSE: // нажата пауза
				self.plugin.addEventListener("pause", function() { $callback.pause(); });
			break;
			case self.TYPE.ENDED: // воспроизведение закончилось
				self.plugin.addEventListener("ended", function() { $callback.ended(); });
			break;
			case self.TYPE.LOADEDDATA: // Возникает, когда браузер загрузил достаточный объем видео данных для начала воспроизведения с текущей позиции.
				self.plugin.addEventListener("loadeddata", function() { $callback.loadeddata(); });
			break;
			case self.TYPE.LOADEDMETADATA: // Создается, когда объект получает достаточно данных о содержимом, чтобы определить продолжительность.
				self.plugin.addEventListener("loadedmetadata", function() { $callback.loadedmetadata(); });
			break;
			case self.TYPE.TIMEUPDATE: // изменена позиция проигрывания
				self.plugin.addEventListener("timeupdate", function() { $callback.timeupdate(self.getPlayPosSec(), self.getPlayTimeSec()); });
			break;
			case self.TYPE.PROGRESS: // прогресс подгрузки видео. НЕ буферизация
				self.plugin.addEventListener("progress", function() { $callback.progress(); });
			break;
			case self.TYPE.WAITING: // событие задержки при воспроизведении. буферизация
				self.plugin.addEventListener("waiting", function() { $callback.waiting(); });
			break;
			case self.TYPE.ERROR: // событие ошибки при воспроизведении
				self.plugin.addEventListener("error", function(type_err) { $callback.error(type_err); });
			break;
		}
	};
    init(id);
}

var myPlayer = null;