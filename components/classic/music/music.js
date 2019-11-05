import classicBeh from "../classic-beh.js"
const mgr = wx.getBackgroundAudioManager()
Component({
  behaviors: [classicBeh],
  /**
   * 组件的属性列表
   */
  properties: {
    url: String,
    title: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    playImg: 'images/player@play.png',
    pauseImg: 'images/player@pause.png',
    isPlay: false
  },

  observers: {
    url() {
      if (this.properties.url === mgr.src && !mgr.paused) {
        this.playMusic(true)
      } else {
        this.playMusic(false)
      }
    }
  },

  lifetimes: {
    attached () {
      this.monitorMusic()
      // if (this.properties.url === mgr.src && !mgr.paused) {
      //   this.playMusic(true)
      // }
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onPlay() {
      this.mgrInit()
      if (this.data.isPlay) {
        mgr.pause()
      } else {
        mgr.play()
      }
      this.toggleMusicButton()
    },
    mgrInit() {
      mgr.src = this.properties.url
      mgr.title = this.properties.title
    },
    toggleMusicButton() {
      this.setData({
        isPlay: !this.data.isPlay
      })
    },
    monitorMusic() {
      mgr.onPlay(() => {
        this.playMusic(true)
      })
      mgr.onPause(() => {
        this.playMusic(false)
      })
    },
    playMusic(behavior) {
      this.setData({
        isPlay: behavior
      })
    }
  }
})
