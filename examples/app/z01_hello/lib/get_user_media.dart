import 'package:flutter/material.dart';

// import 'package:flutter_webrtc/webrtc.dart';
import 'package:flutter_webrtc/flutter_webrtc.dart';
import 'dart:core';

/**
 * GetUserMedia示例
 */
class GetUserMediaSample extends StatefulWidget {
  static String tag = 'GetUserMedia示例';

  @override
  _GetUserMediaSampleState createState() => _GetUserMediaSampleState();
}

class _GetUserMediaSampleState extends State<GetUserMediaSample> {
  //本地媒体流
  MediaStream? _localStream;

  // 本地视频渲染对象
  // 以纹理Texture的方式进行渲染，从而获取较高的渲染速度。有以下几个重要属性
  // textureId：纹理ID
  // rotation：旋转
  // width：宽度
  // height：高度
  // aspectRatio：宽高比
  // mirror：反转
  // objectFit：填充模式
  final _localRenderer = RTCVideoRenderer();

  //是否打开
  bool _isOpen = false;

  @override
  initState() {
    // 生命周期方法，在组件创建的时候自动执行
    super.initState();
    initRenderers(); // RTCVideoRenderer初始化
  }

  @override
  deactivate() {
    // 生命周期方法，在销毁dispose之前,会调用deactivate,可用于释放资源
    super.deactivate();
    if (_isOpen) {
      // 关闭处理
      _close();
    }
    //释放资源并停止渲染
    _localRenderer.dispose();
  }

  initRenderers() async {
    // RTCVideoRenderer初始化
    await _localRenderer.initialize();
  }

  // 打开设备,平台的消息是异步的,所以这里需要使用async
  _open() async {
    // 约束条件
    final Map<String, dynamic> mediaConstraints = {
      "audio": true,
      "video": {"width": 1280, "height": 720}
    };

    try {
      // 根据约束条件获取媒体流
      var stream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
      // _cameras = await Helper.cameras
      // 将获取到的流stream赋给_localStream
      _localStream = stream;
      // 将本地视频渲染对象与_localStream绑定
      _localRenderer.srcObject = _localStream;
    } catch (e) {
      print(e.toString());
    }

    //判断状态是否初始化完成
    if (!mounted) return;

    //设置当前状态为打开状态
    setState(() {
      _isOpen = true;
    });
  }

  //关闭设备
  _close() async {
    try {
      //释放本地流资源
      await _localStream!.dispose();
      //将本地渲染对象源置为空
      _localRenderer.srcObject = null;
    } catch (e) {
      print(e.toString());
    }
    //设置当前状态为关闭状态
    setState(() {
      _isOpen = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // 标题
      appBar: AppBar(
        title: Text('GetUserMedia示例'),
      ),
      // 根据手机旋转方向更新UI
      body: OrientationBuilder(
        builder: (context, orientation) {
          // 居中
          return Center(
            child: Container(
              // 设置外边距
              margin: EdgeInsets.fromLTRB(0.0, 0.0, 0.0, 0.0),
              // 设置容器宽度为页面宽度
              width: MediaQuery.of(context).size.width,
              // 设置容器高度为页面高度
              height: MediaQuery.of(context).size.height,
              // WebRTC视频渲染控件
              child: RTCVideoView(_localRenderer, mirror: true),
              // 设置背景色
              decoration: BoxDecoration(color: Colors.black54),
            ),
          );
        },
      ),
      // 右下角按钮
      floatingActionButton: FloatingActionButton(
        // 打开或关闭处理
        onPressed: _isOpen ? _close : _open,
        // 按钮图标
        child: Icon(_isOpen ? Icons.close : Icons.add),
      ),
    );
  }
}
