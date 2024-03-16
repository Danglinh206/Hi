const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000; // You can use any other available port

app.get('/ramdonvdcosplay', async (req, res) => {
  try {
    const edits = ["@iconsrikka","@smiley_cosplay_26th1","@i_am_ngvtien06","@pmaosensei","@ngancosplay_204","@nnnnaa1","@anlmecos","@ninokawaiii","@ssarahh1311","@etamecosplay26","@dumbapples0","@ruuent","@maixphat","@etamecosplay26","@fuyuka05.7","@moli0n"];
    const randomIndex = Math.floor(Math.random() * edits.length);
    const randomEdit = edits[randomIndex];

    const response = await axios.get(
      `https://apibot.dungkon.me/tiktok?search=${encodeURIComponent(randomEdit)}`,
      {
        timeout: 5000 // wait for 5 seconds max
      }
    );

    if (response.status !== 200) {
      throw new Error("Máy chủ phản hồi với trạng thái không ổn");
    }

    const videos = response.data.data.videos;
    if (!videos || videos.length === 0) {
      return res.status(404).send("Không tìm thấy video nào.");
    }

    const randomVideoIndex = Math.floor(Math.random() * videos.length);
    const videoData = videos[randomVideoIndex];
  
    // Make sure the response is still pending before attempting to send data
    if (res.headersSent) {
      return;
    }

    const message = `Random Video Cosplay From TikTok\n\nPost by: ${videoData.author.nickname}\nUsername: ${videoData.author.unique_id}\n\nContent: ${videoData.title}`;
    // TODO: Send the message variable to the user with attachment

    const videoUrl = videoData.play;
    const videoResponse = await axios({
      method: 'get',
      url: videoUrl,
      responseType: 'stream',
      timeout: 5000
    });

    const filePath = path.join(__dirname, 'video');
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath, { recursive: true });
    }
    const videoFilePath = path.join(filePath, 'edit.mp4');
    const writer = fs.createWriteStream(videoFilePath);
    videoResponse.data.pipe(writer);

    writer.on('finish', () => {
      res.sendFile(videoFilePath, () => fs.unlinkSync(videoFilePath));
    });

  } catch (error) {
    if (error.code === 'ĐƯỢC KẾT NỐI') {
      res.status(500).send("Không truy xuất được, vui lòng thử lại sau.");
    } else {
      console.error('Error:', error.message);
      res.status(500).send("Đã xảy ra lỗi khi xử lý yêu cầu.");
    }
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
