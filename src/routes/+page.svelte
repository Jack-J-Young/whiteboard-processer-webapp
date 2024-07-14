<script lang="ts">
    import ImageViewer from "../ImageViewer.svelte";
    // import UIButtons from '../UIButtons.svelte';

    let imageSrc = "";
    let overlayCanvas: HTMLCanvasElement;

    function handleFileChange(event) {
        const target = event.target;
        const file = target.files ? target.files[0] : null;
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imageSrc = e.target.result;
                // createOverlayCanvas(imageSrc);
                if (!overlayCanvas) {
                    overlayCanvas = document.createElement("canvas");
                }
                loadImageIntoCanvas();
            };
            reader.readAsDataURL(file);
        }
    }

    function createOverlayCanvas(src) {
        const img = new Image();
        img.onload = () => {
            overlayCanvas.width = img.width;
            overlayCanvas.height = img.height;
            console.log(img.width, img.height);
            const ctx = overlayCanvas.getContext("2d");
            if (ctx) {
                ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
                ctx.fillStyle = "rgba(0, 0, 0, 0)"; // Fully transparent fill
                ctx.fillRect(0, 0, overlayCanvas.width, overlayCanvas.height);
            }
        };
        img.src = src;
    }

    function loadImageIntoCanvas() {
        if (!imageSrc || !overlayCanvas) return;

        const img = new Image();
        img.onload = () => {
            const ctx = overlayCanvas.getContext("2d");
            if (ctx) {
                overlayCanvas.width = img.width;
                overlayCanvas.height = img.height;
                ctx.drawImage(img, 0, 0); // Draw image onto canvas at (0,0)

                // Debug: Check color of the first pixel
                const pixelData = ctx.getImageData(0, 0, 1, 1).data;
                console.log(
                    `Old Color of the first pixel: RGBA(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]}, ${pixelData[3]})`,
                );
            }
        };
        img.src = imageSrc;
    }

    function triggerFileInput() {
        document.getElementById("fileInput").click();
    }
</script>

<div class="main-contianer">
    <div class="image-viewer">
        <ImageViewer {imageSrc}/>
    </div>
    <input
        id="fileInput"
        class="hidden-file-input"
        type="file"
        accept="image/*"
        on:change={handleFileChange}
    />
    <button class="upload-button" on:click={triggerFileInput}
        >Upload Image</button
    >
    <button> Generate... </button>
</div>

<style>
    .hidden-file-input {
        display: none;
    }

    .main-contianer {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100vh;
    }

    .image-viewer {
        height: 80%;
        width: 80%;
    }
</style>
