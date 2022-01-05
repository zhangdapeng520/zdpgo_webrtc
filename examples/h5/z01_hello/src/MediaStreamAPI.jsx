import React from "react";
import {Button} from "antd";

//MediaStream对象
let stream;

/**
 * 流与轨道API测试示例
 */
class MediaStreamAPI extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.openDevice().then(r => {
            console.log(r)
        }); // 打开设备
    }

    //打开音视频设备
    openDevice = async () => {
        try {
            //根据约束条件获取媒体
            stream = await navigator.mediaDevices.getUserMedia({
                audio: true, // 是否开启视频
                video: true // 是否开启音频
            });
            let video = this.refVideo; // 获取视频dom元素
            video.srcObject = stream; // 视频dom播放媒体流
        } catch (e) {
            console.log(`getUserMedia错误:` + e);
        }
    }

    // 获取音频轨道列表
    btnGetAudioTracks = () => {
        console.log("getAudioTracks 获取音频轨道列表");
        console.log(stream.getAudioTracks()); // 返回一个数据
    }

    // 根据Id获取音频轨道
    btnGetTrackById = () => {
        console.log("getTrackById 根据Id获取音频轨道");
        console.log(stream.getTrackById(stream.getAudioTracks()[0].id));
    }

    // 删除音频轨道
    btnRemoveAudioTrack = () => {
        console.log("removeAudioTrack() 删除音频轨道");
        stream.removeTrack(stream.getAudioTracks()[0]);
    }

    // 获取所有轨道,包括音频及视频
    btnGetTracks = () => {
        console.log("getTracks() 获取所有轨道,包括音频及视频");
        console.log(stream.getTracks());
    }

    // 获取视频轨道列表
    btnGetVideoTracks = () => {
        console.log("getVideoTracks() 获取视频轨道列表");
        console.log(stream.getVideoTracks());
    }

    // 删除视频轨道
    btnRemoveVideoTrack = () => {
        console.log("removeVideoTrack() 删除视频轨道");
        stream.removeTrack(stream.getVideoTracks()[0]);
    }

    render() {
        return (
            <div className="container">
                <h1>
                    <span>MediaStreamAPI测试</span>
                </h1>
                <video className="video" ref={(el) => this.refVideo = el} autoPlay playsInline/>
                <Button onClick={this.btnGetTracks} style={{width: '120px'}}>获取所有轨道</Button>
                <Button onClick={this.btnGetAudioTracks} style={{width: '120px'}}>获取音频轨道</Button>
                <Button onClick={this.btnGetTrackById} style={{width: '200px'}}>根据Id获取音频轨道</Button>
                <Button onClick={this.btnRemoveAudioTrack} style={{width: '120px'}}>删除音频轨道</Button>
                <Button onClick={this.btnGetVideoTracks} style={{width: '120px'}}>获取视频轨道</Button>
                <Button onClick={this.btnRemoveVideoTrack} style={{width: '120px'}}>删除视频轨道</Button>
            </div>
        );
    }
}

//导出组件
export default MediaStreamAPI;
