import React from "react";

// antd按钮使用参考文档：https://ant.design/components/button-cn/
// antd消息使用参考文档：https://ant.design/components/message-cn/
import {Button, message} from "antd";

/**
 * 共享屏幕示例
 */
class ScreenSharing extends React.Component {

    //开始捕获桌面
    startScreenShare = async (e) => {
        try {
            //调用getDisplayMedia方法,约束设置成{video:true}即可
            const stream = await navigator.mediaDevices.getDisplayMedia({video: true});
            console.log('获取共享屏幕成功。。。');
            this.handleSuccess(stream);
        } catch (e) {
            this.handleError(e);
        }
    }

    //成功捕获,返回视频流
    handleSuccess = (stream) => {
        const video = this.refVideo;

        // 获取视频轨道
        const videoTracks = stream.getVideoTracks();

        // 读取视频资源名称
        console.log(`视频资源名称: ${videoTracks[0].label}`);

        // 将视频对象的源指定为stream
        window.stream = stream;
        video.srcObject = stream;
    }

    //错误处理
    handleError(error) {
        if (error.name === 'ConstraintNotSatisfiedError') {
            const v = constraints.video;
            //宽高尺寸错误
            message.error(`宽:${v.width.exact} 高:${v.height.exact} 设备不支持`).then(r => {
                console.log(r)
            });
        } else if (error.name === 'PermissionDeniedError') {
            message.error('没有摄像头和麦克风使用权限,请点击允许按钮').then(r => {
                console.log(r)
            });
        } else if (error.name === 'NotFoundError') {
            message.error('找不到constraints中指定的媒体类型').then(r => {
            }); // 媒体类型找不到
        }
        message.error(`getUserMedia错误: ${error.name}`, error).then(r => {
            console.log(r)
        });
    }

    render() {
        return (
            <div className="container">
                <h1>
                    <span>共享屏幕示例</span>
                </h1>
                {/* 捕获屏幕数据渲染 */}
                <video className="video" ref={(el) => this.refVideo = el} autoPlay playsInline/>
                <Button onClick={this.startScreenShare}>开始共享</Button>
            </div>
        );
    }
}

//导出组件
export default ScreenSharing;
