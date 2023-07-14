async function handleImageInput(event) {
  const imageElement = document.createElement('img');
  const canvas = document.getElementById('output-canvas');
  const context = canvas.getContext('2d');
  const objectNamesElement = document.getElementById('object-names');
  objectNamesElement.innerHTML="Uploading Started";
  const file = event.target.files[0];
  const imageUrl = URL.createObjectURL(file);
  objectNamesElement.innerHTML="Image Uploaded";
  const model = await cocoSsd.load();
  objectNamesElement.innerHTML="Processing The Image";
  imageElement.onload = async function() {
    canvas.width = imageElement.width;
    canvas.height = imageElement.height;
    objectNamesElement.innerHTML="Getting Image Information";
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(imageElement, 0, 0);
    const predictions = await model.detect(imageElement);
    objectNamesElement.innerHTML="Object Detection Started";
    const objectCounts = {};
    predictions.forEach(prediction => {
    objectNamesElement.innerHTML="Final Processing";
      context.beginPath();
      context.rect(prediction.bbox[0], prediction.bbox[1], prediction.bbox[2], prediction.bbox[3]);
      context.lineWidth = 2;
      context.strokeStyle = '#ff4500';
      context.fillStyle = '#ff4500';
      context.globalAlpha = 0.5;
      context.stroke();
      context.fillText(`${prediction.class}: ${Math.round(prediction.score * 100)}%`, prediction.bbox[0], prediction.bbox[1] > 10 ? prediction.bbox[1] - 5 : 10);
      objectCounts[prediction.class] = (objectCounts[prediction.class] || 0) + 1;
    });
    objectNamesElement.innerHTML = '';
    for (const objectName in objectCounts) {
      const pElement = document.createElement('p');
      pElement.textContent = `${objectName} : ${objectCounts[objectName]}`;
      objectNamesElement.appendChild(pElement);
    }
  };

  imageElement.src = imageUrl;
}

const imageInput = document.getElementById('image-input');
imageInput.addEventListener('change', handleImageInput);
