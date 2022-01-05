package main

import (
	"image/jpeg"
	"os"

	"github.com/pion/mediadevices"
	"github.com/pion/mediadevices/pkg/prop"

	// This is required to register camera adapter
	_ "github.com/pion/mediadevices/pkg/driver/camera"
	// Note: If you don't have a camera or your adapters are not supported,
	//       you can always swap your adapters with our dummy adapters below.
	// _ "github.com/pion/mediadevices/pkg/driver/videotest"
)

func main() {
	stream, _ := mediadevices.GetUserMedia(mediadevices.MediaStreamConstraints{
		Video: func(constraint *mediadevices.MediaTrackConstraints) {
			// Query for ideal resolutions
			constraint.Width = prop.Int(600)
			constraint.Height = prop.Int(400)
		},
	})

	// Since track can represent audio as well, we need to cast it to
	// *mediadevices.VideoTrack to get video specific functionalities
	track := stream.GetVideoTracks()[0]
	videoTrack := track.(*mediadevices.VideoTrack)
	defer videoTrack.Close()

	// Create a new video reader to get the decoded frames. Release is used
	// to return the buffer to hold frame back to the source so that the buffer
	// can be reused for the next frames.
	videoReader := videoTrack.NewReader(false)
	frame, release, _ := videoReader.Read()
	defer release()

	// Since frame is the standard image.Image, it's compatible with Go standard
	// library. For example, capturing the first frame and store it as a jpeg image.
	output, _ := os.Create("frame.jpg")
	jpeg.Encode(output, frame, nil)
}
