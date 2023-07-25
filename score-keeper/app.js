const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs"); // Đặt engine mẫu là EJS
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use("/round/:id", express.static("public"));

// Xử lý yêu cầu trang chủ
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

// Xử lý yêu cầu khi người dùng gửi thông tin của 4 người chơi
app.post("/start", (req, res) => {
  const players = [
    { name: req.body.player1, score: 0 },
    { name: req.body.player2, score: 0 },
    { name: req.body.player3, score: 0 },
    { name: req.body.player4, score: 0 },
  ];

  const roundId = Date.now();
  const data = { roundId, players };

  fs.writeFile(`data/round-${roundId}.json`, JSON.stringify(data), (err) => {
    if (err) throw err;
    res.redirect(`/round/${roundId}`);
  });
});

// Xử lý yêu cầu khi người dùng truy cập trang "/round/:id"
app.get("/round/:id", (req, res) => {
  const roundId = req.params.id;

  fs.readFile(`data/round-${roundId}.json`, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.redirect("/");
    } else {
      const { players } = JSON.parse(data);
      res.render("round", { players, roundId });
    }
  });
});

// Xử lý yêu cầu khi người dùng tăng/giảm điểm
app.post("/update-score", (req, res) => {
  const { roundId, playerId, action } = req.body;

  fs.readFile(`data/round-${roundId}.json`, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.redirect("/");
    } else {
      const { players } = JSON.parse(data);
      const player = players.find((p) => p.name === playerId);

      if (player) {
        if (action === "increase") {
          player.score++;
        } else if (action === "decrease") {
          player.score--;
        }
      }

      fs.writeFile(
        `data/round-${roundId}.json`,
        JSON.stringify({ roundId, players }),
        (err) => {
          if (err) throw err;
          res.redirect(`/round/${roundId}`);
        }
      );
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
