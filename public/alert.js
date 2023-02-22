async function showAlert({ message, duration }) {
  document.getElementById("alert-text").innerText = message;
  const alert = document.getElementById("alert");
  const animationSpeed = 10;

  alert.style.opacity = 0;

  let scale = 0.1;
  let currentScale = scale;
  for (let i = 0; i < 13; i++) {
    if (i <= 10) {
      currentScale = currentScale + scale;
    } else {
      currentScale = currentScale - scale;
    }
    await new Promise((resolve) => setTimeout(resolve, animationSpeed));

    alert.style.opacity = currentScale;
    alert.style.transform = `scale(${currentScale})`;
  }

  await new Promise((resolve) => setTimeout(resolve, duration * 1000));
  alert.style.opacity = 0;
}
