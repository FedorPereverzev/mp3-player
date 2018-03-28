    (function(){function fmtMSS(s) {
        return (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + Math.floor(s)
    };

    let mp3Arr = ['Dare.mp3', 'Knife Play.mp3', 'And the Moon Stopped.mp3', 'Cups.mp3']
    let tracklist = document.getElementById('tracklist');
    let time = document.getElementById('time');
    let controller = document.getElementById('controller');
    let volume = document.getElementById('volume');
    let play = false;
    let mute = false;
    let waveDiv = document.getElementById('loading');

    var wavesurfer = WaveSurfer.create({
        container: '#waveform',
        waveColor: 'lightgray',
        progressColor: 'black',
        barWidth: 1
    });

    

    for (let i = 0; i < mp3Arr.length; i += 1) {
        let li = document.createElement('li');
        tracklist.appendChild(li);
        ID3.loadTags(mp3Arr[i], function () {
            var tags = ID3.getAllTags(mp3Arr[i]);
            li.id = i;
            li.innerHTML = tags.artist + " - " + tags.title;
        });
    };
                
    wavesurfer.load(mp3Arr[0]);            

    var selectedTd;

    function highlight(node) {
        if (selectedTd) {
            selectedTd.style.backgroundColor = '';
        }
        selectedTd = node;
        selectedTd.style.backgroundColor = 'red';
    };

    tracklist.addEventListener('click', (e) => {
        let target = e.target;
        if (target.tagName === 'LI') {
            highlight(target);
        }

    });

    wavesurfer.on('loading', () => {
        waveDiv.style.display = 'block';
    });

    wavesurfer.on('ready', function () {
        waveDiv.style.display = 'none';
    });

    tracklist.addEventListener('click', (e) => {
        let target = e.target;
        wavesurfer.load(mp3Arr[target.id]);
        wavesurfer.on('ready', function () {
            waveDiv.style.display = 'none';
            wavesurfer.play();
        });
    });

    controller.addEventListener('click', (e) => {
        let target = e.target;
        switch (target.id) {

            case 'play':
                if (play) {
                    wavesurfer.pause();
                    play = false;
                    target.innerHTML = 'play_arrow';
                } else {
                    wavesurfer.play();
                    play = true;

                    target.innerHTML = 'pause';
                };
                break;

            case 'stop':
                wavesurfer.stop();
                play = false;
                target.previousElementSibling.innerHTML = 'play_arrow';
                time.innerHTML = '0:00';
                break;

            case 'mute':
                wavesurfer.toggleMute();
                if (mute) {
                    target.innerHTML = 'volume_up';
                    mute = false;
                } else {
                    mute = true;
                    target.innerHTML = 'volume_off';
                };
                break;
        };
    });

    wavesurfer.on('audioprocess', function () {
        time.innerHTML = fmtMSS(wavesurfer.getCurrentTime());
        /*    if (wavesurfer.getMute()) {
               wavesurfer.setVolume(0);
           } else {
               wavesurfer.setVolume(volume.value);
           };*/
    });
              }());
