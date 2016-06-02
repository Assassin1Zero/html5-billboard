var ads = require('ad-utils');

window.AdOps = window.AdOps || {};

window.AdOps.billboard = function(options) {

	var qs = ads.helper.qsToObject();

    var config = {
        stage: '#Billboard_Stage',
        video: '#Billboard_Video',
        brandWrap: '#Billboard_Branding',
        click: '.ad-click',
        clickUrl: qs.clickTag || qs.clickTAG || 'http://www.example.com',
        poster: false,
        branding: 'branding.jpg',
        media: 'video.mp4',
        theme: 'white',
        autoplay: true,
        delay: 1500
    };

    var d = document,
        adReady = d.createEvent('Event'),
        videoEnded = d.createEvent('Event'),
        videoStart = d.createEvent('Event'),
        player,
        brandWrap,
        videoControl,
        audioControl,
        restartControl,
        isPlaying = false,
        isMuted = true,
        timer;

    adReady.initEvent('ADOPS_BILLBOARD_READY', true, true);
    videoStart.initEvent('ADOPS_BILLBOARD_STARTED', true, true);
    videoEnded.initEvent('ADOPS_BILLBOARD_ENDED', true, true);

    function setConfiguration() {

        for (var key in options) {

            if (config.hasOwnProperty(key)) {

                config[key] = options[key];
            }
        }
    }

    function getStage() {

        return d.getElementById(config.stage.replace('#', ''));
    }

    function getBranding() {

        return d.getElementById(config.brandWrap.replace('#', ''));
    }


    function getPlayer() {

        return d.getElementById(config.video.replace('#', ''));
    }

    function stopVideo() {

		isPlaying = false;
        player.pause();
        videoControl.classList.remove('video-stop');
        videoControl.classList.add('video-start');
        return;
    }

    function startVideo() {

    	isPlaying = true;
        player.play();
        videoControl.classList.remove('video-start');
        videoControl.classList.add('video-stop');
        audioControl.classList.remove('hide');
        restartControl.classList.remove('hide');
        d.dispatchEvent(videoStart);
        return;
    }

    function mute() {

    	isMuted = true;
    	player.volume = 0;
    	audioControl.classList.remove('audio-stop');
    	audioControl.classList.add('audio-start');
    	return;
    }

    function unmute() {

    	isMuted = false;
      	player.volume = 1;
      	audioControl.classList.remove('audio-start');
    	audioControl.classList.add('audio-stop');
    	return;
    }

    function togglePlay() {

		if (timer) clearTimeout(timer);

        if (isPlaying) return stopVideo();

		return startVideo();
    }

    function toggleAudio() {

    	if (isMuted) return unmute();

    	return mute();
    }

    if (options) {

        setConfiguration(options);
    }

    return {

        init: function() {

            player = getPlayer();
            brandWrap = getBranding();
            console.log(brandWrap);
            brandWrap.style.background = 'url('+ config.branding +') no-repeat';

			//Handle Click
            ads.helper.query(config.click, function(el) {

                ads.helper.addEvent('click', function(e) {

                    e.preventDefault();
                    window.open(config.clickUrl);
                }, el);
            });

			//Handle Video End
            ads.helper.addEvent('ended', function(el) {

				player.load();
				stopVideo();
				isMuted = true;
				isPlaying = false;
        		audioControl.classList.add('hide');
        		restartControl.classList.add('hide');
                document.dispatchEvent(videoEnded);

            }, player);

            if (config.poster) {

                player.setAttribute('poster', config.poster);
            }

			//Handle Video Button
            ads.helper.query('#Billboard_Controls .video', function(el) {

                videoControl = el;
                el.classList.add(config.theme);

                ads.helper.addEvent('click', function(e) {

                    e.preventDefault();
					togglePlay();
					unmute();
                }, el);
            });

			//Handle Audio Button
            ads.helper.query('#Billboard_Controls .audio', function(el) {

                audioControl = el;
                el.classList.add(config.theme);

                ads.helper.addEvent('click', function(e) {

                    e.preventDefault();
					toggleAudio();
                }, el);
            });

			//Handle Restart Button
            ads.helper.query('#Billboard_Controls .restart', function(el) {

                restartControl = el;
                el.classList.add(config.theme);
                el.classList.add('hide');

                ads.helper.addEvent('click', function(e) {

                    e.preventDefault();
                    player.currentTime = 0;

                }, el);
            });

			ads.helper.query('.ad-play', function(el) {

				ads.helper.addEvent('click', function(e) {

					e.preventDefault();
					togglePlay();
					unmute();
				}, el);

			});

			videoControl.classList.add('video-start');
			audioControl.classList.add('hide');

            player.setAttribute('src', config.media);
            document.dispatchEvent(adReady);

            if (config.autoplay && !isPlaying) {

            	timer = setTimeout(function() {
            		startVideo();
            		mute();
            	}, config.delay);

            }
        },

        addEvent: ads.helper.addEvent

    };

};
