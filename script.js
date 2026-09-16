const songData = [
    {name:"山风等",singer:"2026热门歌曲9月",src:"https://v95-aw-web.douyinvod.com/d06776bf1a5214ab8fc8c3bd97cad4cb/6aab6221/video/tos/cn/tos-cn-ve-15/278c98c53e904f29bc0aa95766622691/media-audio-und-mp4a/",favorite:false},

    {name:"山风山风等等我",singer:"万海东",src:"山风山风等等我.mp3",favorite:false},

//以下是网络链接
    {name:"女声翻唱串烧",singer:"定西Dj小苏",src:"https://st.92kk.com/2025/串烧舞曲/202512/20251217/定西Dj小苏_全国语柔歌最美磁性女声翻唱榜单精选集车载连版串烧.mp3",favorite:false},
    {name:"车载CD音乐",singer:"串烧001",src:"https://st.92kk.com/2019/串烧舞曲/201903/20190328/DJ傻妞[为我的男人唱情歌]最美女声重新诠释13首乐韵柔扬连版92KK车载CD音乐.mp3",favorite:false},
    {name:"醉入心女声",singer:"串烧002",src:"https://st.92kk.com//2021/串烧舞曲/202111/20211125/[Mp3]全国语慢歌连版4月抒情音乐声声醉入心女声HQ串烧.mp3",favorite:false},
    {name:"笑容都没你的甜串烧",singer:"串烧003",src:"https://st.92kk.com//2021/串烧舞曲/202111/20211125/[Mp3]全国语慢歌连版SuperIdol的笑容都没你的甜串烧.mp3",favorite:false},
    {name:"好听抒情",singer:"串烧004",src:"https://st.92kk.com//2021/串烧舞曲/202111/20211125/[Mp3]全国语慢歌连版抖音流行前线磁性好听抒情串烧.mp3",favorite:false},
    {name:"一生中最爱的人DJ",singer:"阿福",src:"https://m4a.hy57.com:883/zw/2017/05/31666_www_Hy57_com.m4a",favorite:false},
    {name:"潇洒走一回DJ",singer:"叶倩文",src:"https://m4a.hy57.com:883/zw/2017/04/31419_www_Hy57_com.m4a",favorite:false},
    {name:"三月里的小雨DJ",singer:"童丽",src:"https://m4a.hy57.com:883/zw/2011/007/19110_www_Hy57_com.m4a",favorite:false},
    {name:"一生与你擦肩而过DJ",singer:"阿悠悠",src:"https://m4a.hy57.com:883/zw/2021/08/139673_www_hy57_com.m4a",favorite:false},
    {name:"多想把你抱住DJ",singer:"高进",src:"https://m4a.hy57.com:883/zw/2021/08/139675_www_hy57_com.m4a",favorite:false},
    {name:"风中有朵雨做的云DJ",singer:"莫叫姐姐",src:"https://m4a.hy57.com:883/zw/2021/08/139668_www_hy57_com.m4a",favorite:false},
    {name:"读爱",singer:"颜小健",src:"https://m4a.hy57.com:883/zw/2025/05/187352_www_hy57_com.m4a",favorite:false},
    {name:"那一夜DJ",singer:"宝贝",src:"https://m4a.hy57.com:883/zw/2011/002/16610_www_Hy57_com.m4a",favorite:false},
    {name:"我只能离开DJ",singer:"颜中人",src:"https://m4a.hy57.com:883/zw/2025/05/187350_www_hy57_com.m4a",favorite:false},
    {name:"爱情里没有谁对谁错DJ",singer:"郑源",src:"https://m4a.hy57.com:883/zw/2025/05/187335_www_hy57_com.m4a",favorite:false},
    {name:"音乐串烧DJ",singer:"music",src:"https://m4a.hy57.com:883/myxc/2021/05/138030_www_hy57_com.m4a",favorite:false},
    {name:"No Limit",singer:"野狼王的士高",src:"https://car-bj.kuwo.cn/0e7493315b531b4dcddbefd1b82b03ff/6a587082/lu/resource/a1/91/41/1633476833.aac",favorite:false}
];

const audio          = document.getElementById('audioPlayer');
const songListDom    = document.getElementById('songList');
const searchInput    = document.getElementById('searchInput');
const randomBtn      = document.getElementById('randomBtn');
const favModeBtn     = document.getElementById('favModeBtn');
const playBtn        = document.getElementById('playBtn');
const prevBtn        = document.getElementById('prevBtn');
const nextBtn        = document.getElementById('nextBtn');
const progressBar    = document.getElementById('progressBar');
const volumeSlider   = document.getElementById('volumeSlider');
const volumeBtn      = document.getElementById('volumeBtn');
const nowPlayName    = document.getElementById('nowPlayName');
const nowPlaySinger  = document.getElementById('nowPlaySinger');
const currentTimeDom = document.getElementById('currentTime');
const totalTimeDom   = document.getElementById('totalTime');
const tipDom         = document.getElementById('tip');

const masterList   = songData.map((s, i) => ({ ...s, id: i }));
let filteredList   = [];
let currentIndex   = -1;
let currentSong    = null;
let isFavMode      = false;
let playToken      = 0;
let loadTimer      = null;
let failStreak     = 0;
let tipTimer       = null;

const MIME_MAP = {
    mp3:'audio/mpeg', mp2:'audio/mpeg', mpga:'audio/mpeg',
    m4a:'audio/mp4', m4b:'audio/mp4', m4r:'audio/mp4', mp4:'audio/mp4',
    aac:'audio/aac',
    wav:'audio/wav', wave:'audio/wav',
    ogg:'audio/ogg', oga:'audio/ogg', opus:'audio/opus',
    flac:'audio/flac',
    webm:'audio/webm', weba:'audio/webm',
    aif:'audio/aiff', aiff:'audio/aiff',
    amr:'audio/amr',
    wma:'audio/x-ms-wma',
    mid:'audio/midi', midi:'audio/midi',
    caf:'audio/x-caf',
    '3gp':'audio/3gpp'
};

const probeAudio  = document.createElement('audio');
const supportCache = new Map();

function getExt(url) {
    if (!url) return '';
    const clean = url.split('?')[0].split('#')[0];
    const seg   = clean.substring(clean.lastIndexOf('/') + 1);
    const dot   = seg.lastIndexOf('.');
    return dot > -1 ? seg.slice(dot + 1).toLowerCase() : '';
}

function canPlayFormat(url) {
    const ext = getExt(url);
    if (!ext) return true;
    if (supportCache.has(ext)) return supportCache.get(ext);
    const mime = MIME_MAP[ext];
    let ok;
    if (!mime) {
        ok = true;
    } else {
        const r = probeAudio.canPlayType(mime);
        ok = (r === 'probably' || r === 'maybe');
    }
    supportCache.set(ext, ok);
    return ok;
}

function formatTime(sec) {
    if (!isFinite(sec) || isNaN(sec) || sec < 0) return '00:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
}

function showTip(msg) {
    if (!tipDom) return;
    tipDom.textContent = msg;
    tipDom.classList.add('show');
    clearTimeout(tipTimer);
    tipTimer = setTimeout(() => tipDom.classList.remove('show'), 2200);
}

function setPlayIcon(isPlaying) {
    playBtn.innerHTML = isPlaying
        ? '<i class="fa fa-pause"></i>'
        : '<i class="fa fa-play"></i>';
}

function hardReset() {
    clearTimeout(loadTimer);
    loadTimer = null;
    try { audio.pause(); } catch (e) {}
    audio.removeAttribute('src');
    try { audio.load(); } catch (e) {}
}

function updateActiveRow() {
    const rows = songListDom.children;
    for (let i = 0; i < rows.length; i++) {
        rows[i].classList.toggle('active', i === currentIndex);
    }
}

function renderList() {
    const frag = document.createDocumentFragment();
    filteredList.forEach((song, idx) => {
        const row = document.createElement('div');
        row.className = 'song-row' + (idx === currentIndex ? ' active' : '');
        const nameEl = document.createElement('span');
        nameEl.className = 'truncate text-[12px] sm:text-sm';
        nameEl.textContent = song.name;
        const singerEl = document.createElement('span');
        singerEl.className = 'truncate text-[11px] sm:text-sm text-gray-300';
        singerEl.textContent = song.singer;
        const favEl = document.createElement('span');
        favEl.className = 'fav-toggle text-center text-cyber-pink text-sm sm:text-base leading-none py-1';
        favEl.innerHTML = '<i class="fa ' + (song.favorite ? 'fa-heart' : 'fa-heart-o') + '"></i>';
        row.append(nameEl, singerEl, favEl);
        row.addEventListener('click', (e) => {
            if (e.target.closest('.fav-toggle')) return;
            failStreak = 0;
            playSong(idx);
        });
        favEl.addEventListener('click', (e) => {
            e.stopPropagation();
            song.favorite = !song.favorite;
            favEl.querySelector('i').className =
                'fa ' + (song.favorite ? 'fa-heart' : 'fa-heart-o');
            if (isFavMode) filterSong();
        });
        frag.appendChild(row);
    });
    songListDom.innerHTML = '';
    songListDom.appendChild(frag);
}

function syncCurrentIndex() {
    if (!currentSong) { currentIndex = -1; return; }
    currentIndex = filteredList.indexOf(currentSong);
}

function filterSong() {
    const kw = searchInput.value.trim().toLowerCase();
    filteredList = masterList.filter(song => {
        const matchSearch = !kw
            || song.name.toLowerCase().includes(kw)
            || song.singer.toLowerCase().includes(kw);
        const matchFav = isFavMode ? song.favorite : true;
        return matchSearch && matchFav;
    });
    syncCurrentIndex();
    renderList();
}

function playSong(idx) {
    const len = filteredList.length;
    if (!len) return;
    if (idx < 0) idx = len - 1;
    if (idx >= len) idx = 0;
    const song = filteredList[idx];
    if (!song) return;
    const token = ++playToken;
    clearTimeout(loadTimer);
    loadTimer = null;
    hardReset();
    currentIndex = idx;
    currentSong  = song;
    nowPlayName.textContent   = song.name;
    nowPlaySinger.textContent = song.singer;
    progressBar.value         = 0;
    currentTimeDom.textContent = '00:00';
    totalTimeDom.textContent   = '00:00';
    updateActiveRow();
    if (!canPlayFormat(song.src)) {
        const ext = getExt(song.src).toUpperCase() || '未知';
        console.warn('[格式不支持]', song.name, song.src);
        showTip('当前浏览器不支持 ' + ext + ' 格式，已跳过');
        setTimeout(() => { if (token === playToken) onFailure(); }, 120);
        return;
    }
    setPlayIcon(true);
    audio.src = song.src;
    try { audio.load(); } catch (e) {}
    loadTimer = setTimeout(() => {
        if (token !== playToken) return;
        console.warn('[加载超时]', song.name);
        onFailure();
    }, 12000);
    const p = audio.play();
    if (p && typeof p.catch === 'function') {
        p.catch(err => {
            if (token !== playToken) return;
            if (err && err.name === 'AbortError') return;
            console.warn('[播放失败]', err);
            onFailure();
        });
    }
}

function onFailure() {
    clearTimeout(loadTimer);
    loadTimer = null;
    failStreak++;
    if (failStreak > filteredList.length) {
        failStreak = 0;
        setPlayIcon(false);
        nowPlayName.textContent   = '暂无可用歌曲';
        nowPlaySinger.textContent = '--';
        showTip('列表内歌曲均无法播放，请检查网络');
        return;
    }
    const len = filteredList.length;
    if (!len) return;
    playSong((currentIndex + 1) % len);
}

function randomPlay() {
    const len = filteredList.length;
    if (!len) return;
    failStreak = 0;
    let r = Math.floor(Math.random() * len);
    if (len > 1 && r === currentIndex) r = (r + 1) % len;
    playSong(r);
}

function toggleFavMode() {
    isFavMode = !isFavMode;
    favModeBtn.innerHTML = isFavMode
        ? '<i class="fa fa-heart"></i>'
        : '<i class="fa fa-heart-o"></i>';
    filterSong();
}

function updateVolumeIcon() {
    const vol = audio.muted ? 0 : audio.volume;
    if (vol === 0)       volumeBtn.innerHTML = '<i class="fa fa-volume-off"></i>';
    else if (vol < 0.5)  volumeBtn.innerHTML = '<i class="fa fa-volume-down"></i>';
    else                 volumeBtn.innerHTML = '<i class="fa fa-volume-up"></i>';
}

volumeSlider.addEventListener('input', () => {
    audio.volume = volumeSlider.value / 100;
    if (audio.volume > 0) audio.muted = false;
    updateVolumeIcon();
});

volumeBtn.addEventListener('click', () => {
    audio.muted = !audio.muted;
    updateVolumeIcon();
});

playBtn.addEventListener('click', () => {
    if (!filteredList.length) return;
    if (!audio.getAttribute('src')) {
        playSong(currentIndex >= 0 ? currentIndex : 0);
        return;
    }
    if (audio.paused) {
        const p = audio.play();
        if (p && p.catch) p.catch(() => {});
        setPlayIcon(true);
    } else {
        audio.pause();
        setPlayIcon(false);
    }
});

prevBtn.addEventListener('click', () => {
    if (!filteredList.length) return;
    failStreak = 0;
    playSong(currentIndex - 1);
});

nextBtn.addEventListener('click', () => {
    if (!filteredList.length) return;
    failStreak = 0;
    playSong(currentIndex + 1);
});

audio.addEventListener('playing', () => {
    failStreak = 0;
    clearTimeout(loadTimer);
    loadTimer = null;
    setPlayIcon(true);
});

audio.addEventListener('timeupdate', () => {
    if (loadTimer) { clearTimeout(loadTimer); loadTimer = null; }
    const d = audio.duration;
    if (isFinite(d) && d > 0) {
        progressBar.value = (audio.currentTime / d) * 100;
        totalTimeDom.textContent = formatTime(d);
    }
    currentTimeDom.textContent = formatTime(audio.currentTime);
});

audio.addEventListener('loadedmetadata', () => {
    totalTimeDom.textContent = formatTime(audio.duration);
});

audio.addEventListener('error', () => {
    if (!audio.getAttribute('src')) return;
    if (!audio.error) return;
    onFailure();
});

audio.addEventListener('ended', () => {
    failStreak = 0;
    const len = filteredList.length;
    if (!len) return;
    playSong((currentIndex + 1) % len);
});

progressBar.addEventListener('input', () => {
    const d = audio.duration;
    if (isFinite(d) && d > 0) {
        audio.currentTime = (progressBar.value / 100) * d;
    }
});

randomBtn.addEventListener('click', randomPlay);
favModeBtn.addEventListener('click', toggleFavMode);
searchInput.addEventListener('input', filterSong);

filterSong();
audio.volume = 0.7;
volumeSlider.value = 70;
updateVolumeIcon();

window.addEventListener('resize', () => {
});
