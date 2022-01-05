import React from "react";
// antd选择器参考文档：https://ant.design/components/select-cn/
import {Select} from "antd";
import '../styles/css/video-filter.scss';

const {Option} = Select;


let video; // 视频

/**
 * 视频滤镜示例
 */
class VideoFilter extends React.Component {

    componentDidMount() {
        //获取video对象
        video = this.refVideo;

        //约束条件
        const constraints = {
            // 是否启用音频
            audio: false,
            // 是否启用视频
            video: true
        };

        //根据约束获取视频流
        navigator.mediaDevices.getUserMedia(constraints).then(this.handleSuccess).catch(this.handleError);
    }

    //获取视频成功
    handleSuccess = (stream) => {
        window.stream = stream;
        video.srcObject = stream; // 将视频源指定为视频流
    }

    //错误处理
    handleError(error) {
        console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
    }

    //选择框选择改变
    handleChange = (value) => {
        console.log(`选择的滤镜改变了： ${value}`);
        video.className = value; // 设置滤镜
    }

    render() {

        return (
            <div className="container">
                <h1>
                    <span>视频滤镜示例</span>
                </h1>
                {/* 视频渲染 */}
                <video ref={(el)=>this.refVideo = el} playsInline autoPlay/>
                {/* 滤镜属性选择 */}
                <Select defaultValue="none" style={{width: '100px'}} onChange={this.handleChange}>
                    <Option value="none">没有滤镜</Option>
                    <Option value="blur">模糊</Option>
                    <Option value="grayscale">灰度</Option>
                    <Option value="invert">反转</Option>
                    <Option value="sepia">深褐色</Option>
                </Select>
            </div>
        );
    }
}

//导出组件
export default VideoFilter;
