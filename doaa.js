(function() {
  var android, app, audio, cover, items, lightbox, player, safari, time, title, ua;

  ua = navigator.userAgent.toLowerCase();

  android = ua.indexOf('android') !== -1;

  safari = ua.indexOf('safari') !== -1;

  items = document.getElementsByTagName('li');

  player = document.getElementById('player');

  audio = document.getElementById('audio');

  title = document.getElementById('title');

  time = document.getElementById('time');

  cover = document.getElementById('cover');

  lightbox = document.getElementById('lightbox');

  app = {
    timeout: false,
    playing: false,
    ended: false,
    wheels: '⎈',
    titles: ["NY Doesn't Care", "Answers [Cadence]", "THAI No. 1", "First Snow", "You+Yours", "Somewhere to Run", "One of Two Colors", "Big Sky Goodbye", "THAI No. 2", "Shortsighted", "…a Nosedive", "Crestfalling", "BA3 — Sunk Cost", "P58 [Reprise]", "Sunday Morning"],
    offsets: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140],
    update_ui: function() {
      var ft, t;
      if (this.playing) {
        t = this.current_time();
        ft = this.formatted_time(t);
        title.innerHTML = this.titles[this.track_index(t)];
        time.innerHTML = audio.readyState === 4 ? ft : this.wheels;
        return player.className = 'playing';
      } else if (this.ended) {
        title.innerHTML = '&nbsp;';
        time.innerHTML = '&nbsp;';
        return player.className = '';
      } else {
        return player.className = '';
      }
    },
    update_wheels: function() {
      if (time.textContent === '⎈') {
        time.innerHTML = '⎈⎈';
      } else if (time.textContent === '⎈⎈') {
        time.innerHTML = '⎈⎈⎈';
      } else if (time.textContent === '⎈⎈⎈') {
        time.innerHTML = '⎈';
      } else {
        return;
      }
      return this.animate_wheels();
    },
    animate_wheels: function() {
      if (this.timeout !== false) {
        window.clearTimeout(this.timeout);
      }
      return this.timeout = window.setTimeout(this.update_wheels.bind(this), 500);
    },
    reset_animation: function() {
      this.wheels = '⎈';
      this.update_ui();
      return this.animate_wheels();
    },
    current_time: function() {
      return Math.round(audio.currentTime);
    },
    formatted_time: function(t) {
      var minutes, s, seconds;
      s = t - this.offsets[this.track_index(t)];
      minutes = Math.floor(s / 60);
      seconds = Math.floor(s % 60);
      if (seconds < 10) {
        seconds = '0' + seconds;
      }
      return minutes + ':' + seconds;
    },
    track_index: function(s) {
      var i, j, len, offset, ref;
      ref = this.offsets;
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        offset = ref[i];
        if (s < this.offsets[i + 1]) {
          return i;
        }
      }
      return this.offsets.length - 1;
    },
    player_toggle: function() {
      if (this.playing) {
        return this.pause();
      } else {
        return this.play();
      }
    },
    play: function() {
      this.reset_animation();
      if (this.playing) {
        return;
      }
      this.playing = true;
      this.ended = false;
      audio.play();
      return this.update_ui();
    },
    pause: function() {
      if (!this.playing) {
        return;
      }
      this.playing = false;
      audio.pause();
      return this.update_ui();
    },
    track_toggle: function(i) {
      this.pause();
      if (android) {
        audio.load();
      }
      audio.currentTime = this.offsets[i];
      return this.play();
    },
    audio_ended: function() {
      this.playing = false;
      this.ended = true;
      return this.update_ui();
    },
    next_track: function() {
      var track;
      track = this.track_index(this.current_time());
      if (track > -1 && track < this.titles.length - 1) {
        return this.track_toggle(track + 1);
      }
    },
    previous_track: function() {
      var track;
      track = this.track_index(this.current_time());
      if (track > 0) {
        return this.track_toggle(track - 1);
      }
    },
    show_lightbox: function() {
      return lightbox.className = '';
    },
    hide_lightbox: function() {
      return lightbox.className = 'hidden';
    },
    li_toggle: function(i) {
      return function() {
        return this.track_toggle(i);
      };
    },
    key_down: function(e) {
      if (e.keyCode === 32) {
        e.preventDefault();
        return this.player_toggle();
      } else if (e.keyCode === 39 || e.keyCode === 40 || e.keyCode === 74 || e.keyCode === 76) {
        e.preventDefault();
        return this.next_track();
      } else if (e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 72 || e.keyCode === 75) {
        e.preventDefault();
        return this.previous_track();
      }
    },
    start: function() {
      var i, j, len, li, results;
      document.addEventListener('keydown', this.key_down.bind(this));
      cover.addEventListener('click', this.show_lightbox.bind(this));
      player.addEventListener('click', this.player_toggle.bind(this));
      lightbox.addEventListener('click', this.hide_lightbox.bind(this));
      audio.addEventListener('ended', this.audio_ended.bind(this));
      audio.addEventListener('timeupdate', this.update_ui.bind(this));
      audio.addEventListener('canplay', this.update_ui.bind(this));
      audio.addEventListener('waiting', this.update_ui.bind(this));
      audio.addEventListener('stalled', this.update_ui.bind(this));
      audio.addEventListener('playing', this.update_ui.bind(this));
      results = [];
      for (i = j = 0, len = items.length; j < len; i = ++j) {
        li = items[i];
        results.push(li.addEventListener('click', this.li_toggle(i).bind(this)));
      }
      return results;
    }
  };

  app.start();

}).call(this);
