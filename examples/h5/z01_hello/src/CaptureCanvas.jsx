import React from "react";
import '../styles/css/capture-canvas.scss';

let stream; // MediaStream对象
let canvas; // 画布对象
let context; // 画布2D内容

/**
 * 捕获Canvas作为媒体流示例
 */
class CaptureCanvas extends React.Component {

    componentDidMount() {
        canvas = this.refCanvas; // 获取canvas dom元素
        this.startCaptureCanvas(); // 开始捕获canvas内容
    }

    //开始捕获Canvas
    startCaptureCanvas = async (e) => {
        stream = canvas.captureStream(10); // 捕获canvas流
        const video = this.refVideo; // 获取视频dom元素
        video.srcObject = stream; // 将视频对象的源指定为stream
        this.drawLine(); // 绘制线条
    }

    //画线
    drawLine = () => {
        context = canvas.getContext("2d"); // 获取Canvas的2d内容
        context.fillStyle = '#CCC'; // 填充颜色
        context.fillRect(0, 0, 320, 240); // 绘制Canvas背景
        context.lineWidth = 1;
        context.strokeStyle = "#FF0000"; // 画笔颜色
        canvas.addEventListener("mousedown", this.startAction); // 监听画板鼠标按下事件 开始绘画
        canvas.addEventListener("mouseup", this.endAction); // 监听画板鼠标抬起事件 结束绘画
    }

    //鼠标按下事件
    startAction = (event) => {
        context.beginPath(); // 开始新的路径
        context.moveTo(event.offsetX, event.offsetY); // 将画笔移动到指定坐标，类似起点
        context.stroke(); // 开始绘制
        canvas.addEventListener("mousemove", this.moveAction); // 监听鼠标移动事件
    }

    //鼠标移动事件  
    moveAction = (event) => {
        context.lineTo(event.offsetX, event.offsetY); // 将画笔移动到结束坐标，类似终点
        context.stroke(); // 开始绘制
    }

    //鼠标抬起事件 
    endAction = () => {
        canvas.removeEventListener("mousemove", this.moveAction);// 移除鼠标移动事件
    }

    render() {
        return (
            <div className="container">
                <h1>
                    <span>捕获Canvas作为媒体流示例</span>
                </h1>
                <div>
                    {/* 画布Canvas容器 */}
                    <div className="small-canvas">
                        {/* Canvas不设置样式 */}
                        <canvas ref={(el) => this.refCanvas = el}/>
                    </div>
                    <video className="small-video" ref={(el) => this.refVideo = el} playsInline autoPlay/>
                </div>
            </div>
        );
    }
}

//导出组件
export default CaptureCanvas;
