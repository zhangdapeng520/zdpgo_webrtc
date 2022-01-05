import React from "react";
import {Button, message} from "antd";

//约束条件
const constraints = window.constraints = {
    // 是否调用音频
    audio: true,
    // 是否调用视频
    video: true
};

/**
 * 摄像头组件
 */
class Camera extends React.Component {
    constructor(props) {
        super(props);
    }

    // 打开摄像头
    // 获取设备是一个I/O操作，需要消耗一定的时间，所以使用异步操作
    openCamera = async (e) => {
        try {
            // 适配不同的浏览器的写法
            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

            // 这里使用await关键字，就不用写回调函数了
            const stream = await navigator.mediaDevices.getUserMedia(constraints); // 根据约束条件获取媒体
            console.log('获取音视频媒体流成功。。。');
            this.handleSuccess(stream); // 处理媒体流
        } catch (e) {
            this.handleError(e);
        }
    }

    // 处理媒体流
    handleSuccess = (stream) => {
        // const video = this.refs['myVideo']; // this.refs弃用了
        // 获取dom元素
        const video = this.myVideoRef; // this.refs['myVideo'] 的替代写法

        // The getVideoTracks() method of the MediaStream interface returns a sequence of MediaStreamTrack objects representing（表示） the video tracks（轨道） in this stream.
        // 获取视频轨道
        const videoTracks = stream.getVideoTracks();
        console.log('通过设置限制条件获取到流:', constraints);
        console.log(`使用的视频设备: ${videoTracks[0].label}`);

        // 使得浏览器能访问到stream
        window.stream = stream;

        // 视频源播放流
        video.srcObject = stream;
    }

    // 处理错误信息
    handleError(error) {
        if (error.name === 'ConstraintNotSatisfiedError') {
            const v = constraints.video; // 视频属性
            message.error(`宽:${v.width.exact} 高:${v.height.exact} 设备不支持`).then(r => {
            }); // 宽高尺寸错误
        } else if (error.name === 'PermissionDeniedError') {
            message.error('没有摄像头和麦克风使用权限,请点击允许按钮').then(r => {
            }); // 摄像头权限错误
        } else if (error.name === 'NotFoundError') {
            message.error('找不到constraints中指定的媒体类型').then(r => {
            }); // 媒体类型找不到
        }
        message.error(`getUserMedia错误: ${error.name}`, error).then(r => {
        }); // api错误
    }

    // 渲染：组件核心内容
    render() {
        return (
            <div className="container">
                <h1>
                    <span>摄像头示例</span>
                </h1>
                {/*<video className="video" ref="myVideo" autoPlay playsInline/>*/}
                {/*autoPlay：视频自动播放，用户不需要点击播放按钮*/}
                {/*playsInline：防止用户拖动滚动条，用于不是点播视频，所以不要求快速*/}
                <video className="video" ref={(el) => this.myVideoRef = el} autoPlay playsInline/>
                <Button onClick={this.openCamera}>打开摄像头</Button>
            </div>
        );
    }
}

//导出组件
export default Camera;
