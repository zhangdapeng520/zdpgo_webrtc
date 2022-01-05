import React from "react";

/**
 * 捕获Video作为媒体流示例
 */
class CaptureVideo extends React.Component {
    constructor(props) {
        super(props);
    }

    //开始播放
    canPlay = () => {
        let sourceVideo = this.refSourceVideo; // 源视频dom对象
        let playerVideo = this.refPlayerVideo;// 播放视频dom对象
        let stream; // MediaStream对象
        const fps = 0; // 捕获侦率

        // 浏览器兼容判断,捕获媒体流
        if (sourceVideo.captureStream) {
            stream = sourceVideo.captureStream(fps);
        } else if (sourceVideo.mozCaptureStream) {
            stream = sourceVideo.mozCaptureStream(fps);
        } else {
            console.error('captureStream不支持');
            stream = null;
        }

        // 将播放器源指定为stream
        playerVideo.srcObject = stream;
    }

    render() {
        return (
            <div className="container">
                <h1>
                    <span>捕获Video作为媒体流示例</span>
                </h1>
                {/* 源视频 显示控制按钮 循环播放 */}
                <video ref={(el) => this.refSourceVideo = el} playsInline controls loop muted onCanPlay={this.canPlay}>
                    {/* mp4视频路径 */}
                    <source src="./assets/webrtc.mp4" type="video/mp4"/>
                </video>
                <video ref={(el) => this.refPlayerVideo = el} playsInline autoPlay/>
            </div>
        );
    }
}

//导出组件
export default CaptureVideo;
