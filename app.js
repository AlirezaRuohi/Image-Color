//#region Setting
//--------------Notification
const durationInput = document.getElementById('duration');
const textColorInput = document.getElementById('textColor');
const bgColorInput = document.getElementById('bgColor');
const progressColorInput = document.getElementById('progressColor');
//--------------Copy-Button
const buttonSizeInput = document.getElementById('buttonSize');
const buttonTextSizeInput = document.getElementById('buttonTextSize');
const buttonTextColorInput = document.getElementById('buttonTextColor');
const buttonBgColorInput = document.getElementById('buttonBgColor');
const buttonFontInput = document.getElementById('buttonFont');
//--------------Reset-Button
const resetButtonSizeInput = document.getElementById('resetButtonSize');
const resetButtonTextSizeInput = document.getElementById('resetButtonTextSize');
const resetButtonTextColorInput = document.getElementById('resetButtonTextColor');
const resetButtonBgColorInput = document.getElementById('resetButtonBgColor');
const resetButtonFontInput = document.getElementById('resetButtonFont');
//---------------Labl
const lablTextSizeInput = document.getElementById('lablTextSize');
const lablTextColorInput = document.getElementById('lablTextColor');
const lablBgColorInput = document.getElementById('lablBgColor');
const lablFontInput = document.getElementById('lablFont');
//----------------Image
const imageSizeInput = document.getElementById('imageSize');
const imageBorderColorInput = document.getElementById('imageBrColor');
//----------------SaveChange-Button
const saveChangesButton = document.getElementById('saveChanges');
const settingsToggle = document.getElementById('settingsToggle');
//-----------------Setting
const settings = document.getElementById('settings');
const settingsText = document.getElementById('settingsText');
//#endregion
//------------------Main---------------------------------------------
const upload = document.getElementById('upload');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const colorLabel = document.getElementById('colorLabel');
const copyButton = document.getElementById('copyButton');
const resetButton = document.getElementById('resetButton');
//----------------Notification
const notification = document.getElementById('notification');
const colorBox = document.getElementById('colorBox');
const notificationText = document.getElementById('notificationText');
//----------------image
const zoomCanvas = document.getElementById('zoom');
const zoomCtx = zoomCanvas.getContext('2d');

let currentColor = '';
let colorLocked = false;
let imageLoaded = false;

//////////////////////////////Open Setting///////////////////////////////////


const settingsClose = document.getElementById('settingsClose');

settingsToggle.addEventListener('click', () => {
    settings.classList.toggle('open');
});

settingsClose.addEventListener('click', () => {
    settings.classList.remove('open');
});

document.addEventListener('click', (event) => {
    if (!settings.contains(event.target) && !settingsToggle.contains(event.target) && !settingsClose.contains(event.target)) {
        settings.classList.remove('open');
    }
});


///////////////////////////////SaveChanges///////////////////////////////////


saveChangesButton.addEventListener('click', () => {

    const duration = parseInt(durationInput.value) * 1000;
    const textColor = textColorInput.value;
    const bgColor = bgColorInput.value;
    const progressColor = progressColorInput.value;

    notification.style.color = textColor;
    notification.style.backgroundColor = bgColor;
    progress.style.backgroundColor = progressColor;

    notification.style.animationDuration = `${duration / 1000}s`;
    progress.style.animationDuration = `${duration / 1000}s`;

    const buttonSize = buttonSizeInput.value.split('x');
    if (buttonSize.length === 2) {
        copyButton.style.width = `${buttonSize[0]}px`;
        copyButton.style.height = `${buttonSize[1]}px`;
    }

    copyButton.style.fontSize = `${buttonTextSizeInput.value}px`;
    copyButton.style.color = buttonTextColorInput.value;
    copyButton.style.backgroundColor = buttonBgColorInput.value;
    copyButton.style.fontFamily = buttonFontInput.value || 'Arial, sans-serif';

    colorLabel.style.fontSize = `${lablTextSizeInput.value}px`;
    colorLabel.style.color = lablTextColorInput.value;
    colorLabel.style.backgroundColor = lablBgColorInput.value;
    colorLabel.style.fontFamily = lablFontInput.value || 'Arial, sans-serif';

    const imageSize = imageSizeInput.value.split('x');
    if (imageSize.length === 2) {
        canvas.style.width = `${imageSize[0]}px`;
        canvas.style.height = `${imageSize[1]}px`;
    }
    canvas.style.borderColor = imageBorderColorInput.value;

    const resetButtonSize = resetButtonSizeInput.value.split('x');
    if (resetButtonSize.length === 2) {
        resetButton.style.width = `${resetButtonSize[0]}px`;
        resetButton.style.height = `${resetButtonSize[1]}px`;
    }

    resetButton.style.fontSize = `${resetButtonTextSizeInput.value}px`;
    resetButton.style.color = resetButtonTextColorInput.value;
    resetButton.style.backgroundColor = resetButtonBgColorInput.value;
    resetButton.style.fontFamily = resetButtonFontInput.value || 'Arial, sans-serif';

    showNotification('Settings saved!','transparent');
});

//////////////////////////////////////////////////////////////////////////////


upload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            imageLoaded = true;
            canvas.style.cursor = 'crosshair'; 
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
});
//////////////////////////////////////////////////////////////////////////////

canvas.addEventListener('mousemove', (e) => {
    if (!imageLoaded) return;
    if (!colorLocked) {
        const rect = canvas.getBoundingClientRect();
        const x = Math.round((e.clientX - rect.left) / (rect.right - rect.left) * canvas.width);
        const y = Math.round((e.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height);
        const pixel = ctx.getImageData(x, y, 1, 1).data;
        currentColor = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
        colorLabel.textContent = `Color: ${currentColor}`;
    }

    zoomCanvas.style.display = 'block';
    zoomCanvas.style.left = `${e.pageX + 10}px`;
    zoomCanvas.style.top = `${e.pageY + 10}px`;

    const rect = canvas.getBoundingClientRect();
    const x = Math.round((e.clientX - rect.left) / (rect.right - rect.left) * canvas.width);
    const y = Math.round((e.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height);
    zoomCtx.clearRect(0, 0, zoomCanvas.width, zoomCanvas.height);
    zoomCtx.drawImage(canvas, x - 5, y - 5, 10, 10, 0, 0, zoomCanvas.width, zoomCanvas.height);
});

canvas.addEventListener('click', (e) => {
    if (!imageLoaded) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.round((e.clientX - rect.left) / (rect.right - rect.left) * canvas.width);
    const y = Math.round((e.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height);
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    currentColor = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
    colorLabel.textContent = `Color: ${currentColor}`;
    colorLocked = true;
});

canvas.addEventListener('mouseout', () => {
    zoomCanvas.style.display = 'none';
});
//////////////////////////////////////////////////////////////////////////////

copyButton.addEventListener('click', () => {
    if (!imageLoaded) {
        showNotification("No Color loaded!",'transparent');
        return;
    }
    navigator.clipboard.writeText(currentColor).then(() => {
        showNotification("Color copied to clipboard!",currentColor);
    }).catch(err => {
        console.error('Failed to copy color: ', err);
    });
});

resetButton.addEventListener('click', () => {
    if (!imageLoaded) {
        showNotification("No Color loaded!",'transparent');
        return;
    }
    colorLocked = false;
    colorLabel.textContent = 'Color: ';
    showNotification("Color reset!",'transparent');
});
//////////////////////////////////////////////////////////////////////////////

function showNotification(message,color) {
    colorBox.style.backgroundColor = color;
    notificationText.textContent = message;
    notification.style.display = 'flex';
    setTimeout(() => {
        notification.style.display = 'none';
    }, parseInt(durationInput.value) * 1000);
}