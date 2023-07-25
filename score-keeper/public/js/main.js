function updateScore(roundId, playerId, action) {
  fetch("/update-score", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `roundId=${roundId}&playerId=${playerId}&action=${action}`,
  })
    .then(() => window.location.reload())
    .catch((error) => console.error("Error:", error));
}
