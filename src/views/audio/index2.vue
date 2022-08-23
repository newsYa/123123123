<template>
  <div
    class="mixin-components-container"
    style="width: 100%;"
  >
    <div
      class="box-card"
      style="width:100%;text-align:left;background: #43444c;height:210px;"
    >
      <div
        id="wave-timeline"
        ref="wave-timeline"
        style="margin-top: 20px;"
      >
        <!--时间轴 -->
      </div>
      <div
        id="waveform"
        ref="waveform"
      >
        <!-- Here be the waveform -->
      </div>

      <div style="margin-top: 10px;padding-bottom: 10px;">
        <el-select
          v-model="ds"
          placeholder="请选择播放速度"
          style="float: left;background: #363740;color:#bfc0dc;margin-left: 10px;"
          @change="DoubleSpeed"
        >
          <el-option
            v-for="item in audiominmax"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <!-- <img src="../../assets/img/audio1.png" alt="" title="音量"
					style="float: left;margin-left: 30px;margin-right: 14px;margin-top: 9px;cursor: pointer;width: 20px;height:20px;"> -->
        <i
          class="el-icon-microphone"
          title="音量"
          style="float: left;margin-left: 30px;margin-right: 14px;margin-top: 5px;cursor: pointer;font-size:24px;color:#bfc0dd;"
        />
        <el-slider
          v-model="value"
          input-size="mini"
          style="width:100px;float: left;margin-right:30px;cursor: pointer;"
          @change="setVolume"
        />
        <i
          class="el-icon-d-arrow-left"
          alt=""
          title="快退"
          style="float: left;margin-top: 11px;margin-left: 10px;cursor: pointer;font-size:20px;color:#bfc0dd;"
          @click="rew"
        />
        <i
          class="el-icon-arrow-left"
          title="上一个"
          style="float: left;margin-top: 11px;margin-left: 10px;cursor: pointer;font-size:20px;color:#bfc0dd;"
        />	
					
        <i
          v-if="audioplay"
          class="el-icon-video-play"
          alt=""
          title="播放"
          style="float: left;margin-top: 11px;margin-left: 4px;cursor: pointer;font-size:20px;color:#bfc0dd;"
          @click="plays"
        />
        <i
          v-if="!audioplay"
          class="el-icon-video-pause"
          alt=""
          title="暂停"
          style="float: left;margin-top: 11px;margin-left: 4px;cursor: pointer;font-size:20px;color:#bfc0dd;"
          @click="plays"
        />
					
        <i
          class="el-icon-arrow-right"
          title="下一个"
          style="float: left;margin-top: 11px;margin-left: 10px;cursor: pointer;font-size:20px;color:#bfc0dd;"
        />	
        <i
          class="el-icon-d-arrow-right"
          alt=""
          title="快进"
          style="float: left;margin-top: 11px;margin-left: 6px;cursor: pointer;font-size:20px;color:#bfc0dd;"
          @click="speek"
        />
        <i
          class="el-icon-refresh"
          alt=""
          title="重放"
          style="float: left;margin-top: 11px;margin-left: 20px;cursor: pointer;font-size:20px;color:#bfc0dd;"
          @click="replay"
        />
        <!-- <img src="../../assets/img/audio2.png" @click="rew" alt="" title="快退"
					style="float: left;margin-top: 11px;margin-left: 10px;cursor: pointer;width: 20px;height:20px;">
				<img src="../../assets/img/audio5.png" v-if="audioplay" @click="plays" alt="" title="播放"
					style="float: left;margin-top: 11px;margin-left: 4px;cursor: pointer;width: 20px;height:20px;">
				<img src="../../assets/img/audio3.png" v-if="!audioplay" @click="plays" alt="" title="播放"
					style="float: left;margin-top: 11px;margin-left: 4px;cursor: pointer;width: 20px;height:20px;">

				<img src="../../assets/img/audio4.png" @click="speek" alt="" title="快进"
					style="float: left;margin-top: 11px;margin-left: 4px;cursor: pointer;width: 20px;height:20px;">

				<img src="../../assets/img/audio6.png" @click="replay" alt="" title="重放"
					style="float: left;margin-top: 11px;margin-left: 20px;cursor: pointer;width: 20px;height:20px;"> -->
        <!-- <el-button type="primary" @click="rew">后退</el-button>
          <el-button type="primary" @click="plays">
            <i class="el-icon-video-play"></i>
            播放 /
            <i class="el-icon-video-pausee"></i>
            暂停
          </el-button>
           <el-button type="primary" @click="speek">前进</el-button>
           <el-button type="primary" @click="replay">重放</el-button>
             <el-tooltip class="item" effect="dark" content="指定播放" placement="bottom">
              <el-popover placement="top" width="200" trigger="click">
                <el-input v-model="appointTime" placeholder="请输入内容" class="input-with-select">
                  <el-button slot="append" @click="appointPlay">播放</el-button>
                </el-input>
                <el-button slot="reference" circle>
                  指定播放
                </el-button>
              </el-popover>
            </el-tooltip>
             <span style="border: 2px solid #2f4f4f;margin-left: 8px;margin-right: 4px" /> -->
      <!--   <el-tooltip
          class="item"
          effect="dark"
          content="音量"
          placement="bottom"
        >
          <el-popover
            placement="top-start"
            trigger="click"
            style="min-width: 38px;margin-left: 10px"
          >
            <div
              class="block"
              style="width: 42px"
            >
              <el-slider
                v-model="value"
                vertical
                @change="setVolume"
              />
            </div>
            <el-button
              slot="reference"
              circle
            >
              音量
            </el-button>
          </el-popover>
        </el-tooltip> -->
      </div>
    </div>
  </div>
</template>
<script>
	import WaveSurfer from 'wavesurfer.js'
	import CursorPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.cursor.js'
	import Timeline from 'wavesurfer.js/dist/plugin/wavesurfer.timeline.js'
	export default {
		name: "Details",
		// components: { MyWaveSurfer },
		data() {
			return {
				audiominmax: [{
					value: 1.50,
					label: '播放速度 150%'
				}, {
					value: 1.20,
					label: '播放速度 120%'
				}, {
					value: 1.00,
					label: '播放速度 100%'
				}, {
					value: 0.50,
					label: '播放速度 50%'
				}],
				wavesurfer: null,
				// 指定播放功能的播放时间点
				appointTime: 1,
				// 播放倍速
				ds: 1.00,
				// 设置音量
				value: 30,
				audioplay: true,
			};
		},
		beforeDestroy(){
			this.wavesurfer.destroy();
		},
		mounted() {
			let that=this;
			this.$nextTick(() => {
				console.log(WaveSurfer)
				this.wavesurfer = WaveSurfer.create({
					// 应该在其中绘制波形的CSS选择器或HTML元素。这是唯一必需的参数。
					container: this.$refs.waveform,
					// 更改波形容器的背景颜色。
					backgroundColor: '#000000',
					backend: 'MediaElement',

					//走动指针线颜色
					cursorColor: "red",
					//频率背景颜色
					waveColor: '#42d995',
					//走动颜色
					progressColor: "#42d995",
					// 音频播放时间轴
					mediaControls: false,
					// 播放音频的速度
					audioRate: '1',
					// 插件：此教程配置了光标插件和时间轴插件
					plugins: [
						// 光标插件
						CursorPlugin.create({
							showTime: true,
							opacity: 0,
							customShowTimeStyle: {
								'background-color': '#000',
								color: '#fff',
								padding: '2px',
								'font-size': '10px'
							}
						}),
						// 时间轴插件
						Timeline.create({
							container: '#wave-timeline'
						}),
					]
				});
				this.wavesurfer.on('ready', function(e) {
					console.warn('加载成功---',e);
					that.plays();
					that.wavesurfer.setVolume(30 / 100)
				});
				this.wavesurfer.on('finish', function(e) {
					console.warn('播放结束---',e);
					// that.plays();
					that.audioplay = true;
				});
				this.wavesurfer.on('error', function(e) {
					console.warn(e);
				});
				// this.wavesurfer.load('https://mindflowai-open.oss-cn-hangzhou.aliyuncs.com/505/6mariyokwzjuqjql.wav');
				this.wavesurfer.load(require("./mp3/tmp.mp3"));
				
				this.value = this.wavesurfer.getVolum()* 100
			})
		},
		methods: {
			// 播放时暂停，播放时暂停
			plays() {
				this.audioplay = !this.audioplay;
				this.wavesurfer.playPause()
			},
			// 后退，
			rew() {
				this.wavesurfer.skip(-3)
			},
			// 前进，
			speek() {
				this.wavesurfer.skip(3)
			},
			// 重放
			replay() {
				this.wavesurfer.stop()
			},
			// 设置音量：
			setVolume(val) {
				this.wavesurfer.setVolume(val / 100)
			},
			// 指定播放
			appointPlay() {
        console.log(this.appointTime)
				this.wavesurfer.play([this.appointTime, ])
			},
			//倍速播放
			DoubleSpeed(rate) {
        console.log(rate)
				this.wavesurfer.setPlaybackRate(rate)
				console.log(rate)
			}

		}
	}
</script>
<style scoped>
	::v-deep .el-input__inner {
		background-color: #363740;
		border: 1px solid #797979;
		color: #aeafc8;
	}
</style>

