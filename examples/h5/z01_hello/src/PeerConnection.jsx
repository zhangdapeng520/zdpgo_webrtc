import React from "react";
import {Button} from "antd";

let localVideo; // 本地视频
let remoteVideo; // 远端视频
let localStream; // 本地流
let peerConnA; // PeerA连接对象
let peerConnB; // PeerB连接对象

/**
 * 连接建立示例。
 */
class PeerConnection extends React.Component {

    componentDidMount() {
        localVideo = this.refLocalVideo; // 初始化本地视频对象
        remoteVideo = this.refRemoteVideo; // 初始化远端视频对象

        // 获取本地视频尺寸
        localVideo.addEventListener('loadedmetadata', () => {
            console.log(`本地视频尺寸为: videoWidth: ${localVideo.videoWidth}px,  videoHeight: ${localVideo.videoHeight}px`);
        });

        // 获取远端视频尺寸
        remoteVideo.addEventListener('loadedmetadata', () => {
            console.log(`远端视频尺寸为: videoWidth: ${remoteVideo.videoWidth}px,  videoHeight: ${remoteVideo.videoHeight}px`);
        });

        // 监听远端视频尺寸大小变化
        remoteVideo.addEventListener('resize', () => {
            console.log(`远端视频尺寸为: ${remoteVideo.videoWidth}x${remoteVideo.videoHeight}`);
        });

    }

    // 开始
    start = async () => {
        console.log('开始获取本地媒体流');
        try {
            // 获取音视频流
            const stream = await navigator.mediaDevices.getUserMedia({audio: true, video: true});
            console.log('获取本地媒体流成功');

            // 本地视频获取流
            localVideo.srcObject = stream;
            localStream = stream;
        } catch (e) {
            console.log("getUserMedia错误:" + e);
        }
    }

    // 呼叫
    call = async () => {
        console.log('开始呼叫...');
        const videoTracks = localStream.getVideoTracks(); // 视频轨道
        const audioTracks = localStream.getAudioTracks(); // 音频轨道

        if (videoTracks.length > 0) { // 判断视频轨道是否有值
            console.log(`使用的视频设备为: ${videoTracks[0].label}`); // 输出摄像头的名称
        }

        if (audioTracks.length > 0) { // 判断音频轨道是否有值
            console.log(`使用的音频设备为: ${audioTracks[0].label}`); // 输出麦克风的名称
        }

        // 设置ICE Server,使用Google服务器
        let configuration = {"iceServers": [{"url": "stun:stun.l.google.com:19302"}]};

        // 创建RTCPeerConnection对象
        peerConnA = new RTCPeerConnection(configuration);
        console.log('创建本地PeerConnection成功:peerConnA');

        // 监听返回的Candidate信息
        peerConnA.addEventListener('icecandidate', this.onIceCandidateA);

        // 创建RTCPeerConnection对象
        peerConnB = new RTCPeerConnection(configuration);
        console.log('创建本地PeerConnection成功:peerConnB');

        // 监听返回的Candidate信息
        peerConnB.addEventListener('icecandidate', this.onIceCandidateB);

        // 监听ICE状态变化
        peerConnA.addEventListener('iceconnectionstatechange', this.onIceStateChangeA);

        // 监听ICE状态变化
        peerConnB.addEventListener('iceconnectionstatechange', this.onIceStateChangeB);

        // 监听track事件,可以获取到远端视频流
        peerConnB.addEventListener('track', this.gotRemoteStream);

        // peerConnA.addStream(localStream);
        // 循环迭代本地流的所有轨道
        localStream.getTracks().forEach((track) => {
            // 把音视频轨道添加到连接里去
            peerConnA.addTrack(track, localStream);
        });
        console.log('将本地流添加到peerConnA里');

        try {
            console.log('peerConnA创建提议Offer开始');
            const offer = await peerConnA.createOffer(); // 创建提议Offer
            await this.onCreateOfferSuccess(offer); // 创建Offer成功
        } catch (e) {
            this.onCreateSessionDescriptionError(e); // 创建Offer失败
        }
    }

    // 创建会话描述错误
    onCreateSessionDescriptionError = (error) => {
        console.log(`创建会话描述SD错误: ${error.toString()}`);
    }

    // 创建提议Offer成功
    onCreateOfferSuccess = async (desc) => {
        // peerConnA创建Offer返回的SDP信息
        console.log(`peerConnA创建Offer返回的SDP信息\n${desc.sdp}`);
        console.log('设置peerConnA的本地描述start');
        try {
            await peerConnA.setLocalDescription(desc); // 设置peerConnA的本地描述
            this.onSetLocalSuccess(peerConnA);
        } catch (e) {
            this.onSetSessionDescriptionError();
        }

        console.log('peerConnB开始设置远端描述');
        try {
            await peerConnB.setRemoteDescription(desc); // 设置peerConnB的远端描述
            this.onSetRemoteSuccess(peerConnB);
        } catch (e) {
            this.onSetSessionDescriptionError(); // 创建会话描述错误
        }

        console.log('peerConnB开始创建应答Answer');
        try {
            const answer = await peerConnB.createAnswer(); // 创建应答Answer
            await this.onCreateAnswerSuccess(answer); // 创建应答成功
        } catch (e) {
            this.onCreateSessionDescriptionError(e); // 创建会话描述错误
        }
    }

    // 设置本地描述完成
    onSetLocalSuccess = (pc) => {
        console.log(`${this.getName(pc)}设置本地描述完成:setLocalDescription`);
    }

    // 设置远端描述完成
    onSetRemoteSuccess = (pc) => {
        console.log(`${this.getName(pc)}设置远端描述完成:setRemoteDescription`);
    }

    // 设置描述SD错误
    onSetSessionDescriptionError = (error) => {
        console.log(`设置描述SD错误: ${error.toString()}`);
    }

    getName = (pc) => {
        return (pc === peerConnA) ? 'peerConnA' : 'peerConnB';
    }

    // 获取到远端视频流
    gotRemoteStream = (e) => {
        if (remoteVideo.srcObject !== e.streams[0]) {
            // 取集合第一个元素
            remoteVideo.srcObject = e.streams[0];
            console.log('peerConnB开始接收远端流');
        }
    }

    // 创建应答成功
    onCreateAnswerSuccess = async (desc) => {
        // 输出SDP信息
        console.log(`peerConnB的应答Answer数据:\n${desc.sdp}`);
        console.log('peerConnB设置本地描述开始:setLocalDescription');
        try {
            //设置peerConnB的本地描述信息
            await peerConnB.setLocalDescription(desc);
            this.onSetLocalSuccess(peerConnB);
        } catch (e) {
            this.onSetSessionDescriptionError(e);
        }
        console.log('peerConnA设置远端描述开始:setRemoteDescription');
        try {
            // 设置peerConnA的远端描述,即peerConnB的应答信息
            await peerConnA.setRemoteDescription(desc);
            this.onSetRemoteSuccess(peerConnA);
        } catch (e) {
            this.onSetSessionDescriptionError(e);
        }
    }

    // Candidate事件回调方法
    onIceCandidateA = async (event) => {
        try {
            if (event.candidate) {
                // 将会peerConnA的Candidate添加至peerConnB里
                await peerConnB.addIceCandidate(event.candidate);
                this.onAddIceCandidateSuccess(peerConnB);
            }
        } catch (e) {
            this.onAddIceCandidateError(peerConnB, e);
        }
        console.log(`IceCandidate数据:\n${event.candidate ? event.candidate.candidate : '(null)'}`);
    }

    // Candidate事件回调方法
    onIceCandidateB = async (event) => {
        try {
            if (event.candidate) {
                // 将会peerConnB的Candidate添加至peerConnA里
                await peerConnA.addIceCandidate(event.candidate);
                this.onAddIceCandidateSuccess(peerConnA);
            }
        } catch (e) {
            this.onAddIceCandidateError(peerConnA, e);
        }
        console.log(`IceCandidate数据:\n${event.candidate ? event.candidate.candidate : '(null)'}`);
    }

    // 添加Candidate成功
    onAddIceCandidateSuccess = (pc) => {
        console.log(`${this.getName(pc)}添加IceCandidate成功`);
    }

    // 添加Candidate失败
    onAddIceCandidateError = (pc, error) => {
        console.log(`${this.getName(pc)}添加IceCandidate失败: ${error.toString()}`);
    }

    // 监听ICE状态变化事件回调方法
    onIceStateChangeA = (event) => {
        console.log(`peerConnA连接的ICE状态: ${peerConnA.iceConnectionState}`);
        console.log('ICE状态改变事件: ', event);
    }

    // 监听ICE状态变化事件回调方法
    onIceStateChangeB = (event) => {
        console.log(`peerConnB连接的ICE状态: ${peerConnB.iceConnectionState}`);
        console.log('ICE状态改变事件: ', event);
    }

    // 断开连接
    hangup = () => {
        console.log('结束会话');
        peerConnA.close(); // 关闭peerConnA
        peerConnB.close(); // 关闭peerConnB
        peerConnA = null; // peerConnA置为空
        peerConnB = null; // peerConnB置为空
    }

    render() {
        return (
            <div className="container">
                <h1>
                    <span>RTCPeerConnection示例</span>
                </h1>
                {/* 本地视频 */}
                <video ref={(el) => this.refLocalVideo = el} playsInline autoPlay muted/>
                {/* 远端视频 */}
                <video ref={(el) => this.refRemoteVideo = el} playsInline autoPlay/>
                <div>
                    <Button ref="startButton" onClick={this.start} style={{marginRight: "10px"}}>开始</Button>
                    <Button ref="callButton" onClick={this.call} style={{marginRight: "10px"}}>呼叫</Button>
                    <Button ref="hangupButton" onClick={this.hangup} style={{marginRight: "10px"}}>挂断</Button>
                </div>
            </div>
        );
    }
}

//导出组件
export default PeerConnection;
