import React from "react";

// antd按钮使用参考文档：https://ant.design/components/button-cn/
// antd选择器参考文档：https://ant.design/components/select-cn/
import {Button, Select} from "antd";

const {Option} = Select; // 选择器的配置

//QVGA 320*240
const qvgaConstraints = {
    video: {width: {exact: 320}, height: {exact: 240}}
};

//VGA 640*480
const vgaConstraints = {
    video: {width: {exact: 640}, height: {exact: 480}}
};

//高清 1280*720
const hdConstraints = {
    video: {width: {exact: 1280}, height: {exact: 720}}
};

//超清 1920*1080
const fullHdConstraints = {
    video: {width: {exact: 1920}, height: {exact: 1080}}
};

//2K 2560*1440
const twoKConstraints = {
    video: {width: {exact: 2560}, height: {exact: 1440}}
};

//4K 4096*2160
const fourKConstraints = {
    video: {width: {exact: 4096}, height: {exact: 2160}}
};

//8K 7680*4320
const eightKConstraints = {
    video: {width: {exact: 7680}, height: {exact: 4320}}
};


let stream; // 视频流
let video; // 视频对象

/**
 * 分辨率示例
 */
class Resolution extends React.Component {

    componentDidMount() {
        video = this.refVideo; // 获取video对象引用
        this.getMedia(qvgaConstraints); // 默认渲染qvga分辨率的视频
    }

    // 根据约束获取视频
    getMedia = (constraints) => {
        // 判断流对象是否为空
        if (stream) {
            //迭代并停止所有轨道
            stream.getTracks().forEach(track => {
                track.stop();
            });
        }

        // 重新获取视频
        navigator.mediaDevices.getUserMedia(constraints)
            //成功获取
            .then(this.gotStream)

            //错误
            .catch(e => {
                this.handleError(e);
            });
    }

    // 得到视频流处理
    gotStream = (mediaStream) => {
        stream = window.stream = mediaStream;
        video.srcObject = mediaStream; // 将video视频源指定为mediaStream
        const track = mediaStream.getVideoTracks()[0]; // 轨道
        const constraints = track.getConstraints(); // 约束条件
        console.log('约束条件为:' + JSON.stringify(constraints));
    }

    // 错误处理
    handleError(error) {
        console.log(`getUserMedia错误: ${error.name}`, error);
    }

    //选择框选择改变
    handleChange = (value) => {
        console.log(`选择框的值改变了： ${value}`);
        //根据选择框的值获取不同分辨率的视频
        switch (value) {
            case 'qvga':
                this.getMedia(qvgaConstraints);
                break;
            case 'vga':
                this.getMedia(vgaConstraints);
                break;
            case 'hd':
                this.getMedia(hdConstraints);
                break;
            case 'fullhd':
                this.getMedia(fullHdConstraints);
                break;
            case '2k':
                this.getMedia(twoKConstraints);
                break;
            case '4k':
                this.getMedia(fourKConstraints);
                break;
            case '8k':
                this.getMedia(eightKConstraints);
                break;
            default:
                this.getMedia(vgaConstraints);
                break;
        }
    }

    //动态改变分辨率
    dynamicChange = (e) => {
        const track = window.stream.getVideoTracks()[0]; // 获取当前的视频流中的视频轨道
        const constraints = {
            width: {min: 640, ideal: 1280},
            height: {min: 480, ideal: 720},
            advanced: [
                {width: 1920, height: 1280},
                {aspectRatio: 1.333}
            ]
        };
        console.log('应用高清效果:' + JSON.stringify(constraints)); // 使用超清约束作为测试条件
        track.applyConstraints(constraints)
            .then(() => {
                console.log('动态改变分辨率成功...', constraints);
            })
            .catch(err => {
                console.log('动态改变分辨率错误:', err.name);
            });
    }

    render() {
        return (
            <div className="container">
                <h1>
                    <span>视频分辨率示例</span>
                </h1>
                {/* 视频渲染 */}
                <video ref={(el) => this.refVideo = el} playsInline autoPlay/>
                {/* 清晰度选择 */}
                <Select defaultValue="qvga" style={{width: '100px', marginLeft: '20px'}} onChange={this.handleChange}>
                    <Option value="qvga">QVGA</Option>
                    <Option value="vga">VGA</Option>
                    <Option value="hd">高清</Option>
                    <Option value="fullhd">超清</Option>
                    <Option value="2k">2K</Option>
                    <Option value="4k">4K</Option>
                    <Option value="8k">8K</Option>
                </Select>
                <Button onClick={this.dynamicChange} style={{marginLeft: '20px'}}>动态设置</Button>
            </div>
        );
    }
}

//导出组件
export default Resolution;
