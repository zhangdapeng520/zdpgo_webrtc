import React from "react";
// antd按钮使用参考文档：https://ant.design/components/button-cn/
import {Button} from "antd";
import '../styles/css/canvas.scss';


let video; // 视频

/**
 * 截取视频示例
 */
class Canvas extends React.Component {
    constructor(props) {
        super(props);
    }

    // 挂载组件：生命周期函数
    // 在挂载的时候自动获取摄像头的音视频流，并渲染在视频组件中
    componentDidMount() {
        // 获取video对象dom元素
        video = this.refVideo;

        // 约束条件
        const constraints = {
            // 是否启用音频
            audio: false,
            // 是否启用视频
            video: true
        };

        // 根据约束获取视频流
        navigator.mediaDevices.getUserMedia(constraints).then(this.handleSuccess).catch(this.handleError);
    }

    //获取视频成功
    handleSuccess = (stream) => {
        window.stream = stream;

        // 将视频源指定为视频流
        video.srcObject = stream;
    }

    //截屏处理
    takeSnap = async (e) => {
        // 获取画布对象
        let canvas = this.refCanvas;

        // 设置画面宽度
        canvas.width = video.videoWidth;

        // 设置画面高度
        canvas.height = video.videoHeight;

        // 根据视频对象,xy坐标,画布宽,画布高绘制位图
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    }

    //错误处理
    handleError(error) {
        console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
    }

    render() {

        return (
            <div className="container">
                <h1>
                    <span>截取视频示例</span>
                </h1>
                <div>
                    <video className="small-video" ref={(el) => this.refVideo = el} playsInline autoPlay/>
                    {/* 画布Canvas */}
                    <canvas className="small-canvas" ref={(el) => this.refCanvas = el}/>
                </div>
                <Button className="button" onClick={this.takeSnap}>截屏</Button>
            </div>
        );
    }
}

//导出组件
export default Canvas;
