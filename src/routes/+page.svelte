<script lang="ts">
    import DebugPopup from "../DebugPopup.svelte";
    import ImageViewer from "../ImageViewer.svelte";
    // import UIButtons from '../UIButtons.svelte';
    let imageViewer: ImageViewer;

    let imageSrc = "";
    let returnSrc = "";

    let showPopup = false;

    const processorApiUrl = 'https://api.jackyoung.xyz' // import.meta.env.VITE_WB_PROCESSOR_API;
    // const processorApiUrl = 'https://localhost' // import.meta.env.VITE_WB_PROCESSOR_API;

    function handleFileChange(event: any) {
        const target = event.target;
        const file = target.files ? target.files[0] : null;
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                var result = e.target?.result;
                if (typeof result === "string") {
                    console.log("Image loaded");
                    imageSrc = result;
                    imageViewer.loadImageFromSrc(imageSrc);
                }
            };
            reader.readAsDataURL(file);
        }
    }

    // function loadImageIntoCanvas() {
    //     if (!imageSrc || !overlayCanvas) return;

    //     const img = new Image();
    //     img.onload = () => {
    //         const ctx = overlayCanvas.getContext("2d");
    //         if (ctx) {
    //             overlayCanvas.width = img.width;
    //             overlayCanvas.height = img.height;
    //             ctx.drawImage(img, 0, 0); // Draw image onto canvas at (0,0)
    //         }
    //     };
    //     img.src = imageSrc;
    // }

    function triggerFileInput() {
        document.getElementById("fileInput")?.click();
    }

    async function downloadFileFromResponse(response: Response) {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = "transformed_image.png"; // Set the download filename
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url); // Clean up
    }

    async function requestTransformedImage() {
        if (!imageViewer.hasQuads()) {
            alert("Please select a region to transform");
            return;
        }

        let imgResponse = await fetch(imageSrc);
        let blob = await imgResponse.blob();

        // let imageData: ImageData = {
        //     image: new File([blob], 'image.jpg', { type: 'image/jpeg' }),
        //     quadPoints: imageViewer.getQuadPoints(),
        // };

        let formData = new FormData();
        formData.append("image", blob);
        let quadPoints = imageViewer.getQuadPoints();
        let formPoints = [];

        for (let i = 0; i < quadPoints.length; i++) {
            formPoints.push([quadPoints[i].x, quadPoints[i].y]);
        }

        formData.append("quad_points", JSON.stringify(formPoints));

        let response = await fetch(`${processorApiUrl}/whiteboard/process`, {
            method: "POST",
            body: formData,
            
        });

        // downloadFileFromResponse(response)
        const blobData = await response.blob();
        returnSrc = URL.createObjectURL(blobData);
        showPopup = true;

        console.log(response);
    }

    function closePopup() {
        showPopup = false;

        URL.revokeObjectURL(returnSrc);
        returnSrc = "";
    }
</script>

<div class="main-contianer">
    <div class="image-viewer">
        <ImageViewer {imageSrc} bind:this={imageViewer} />
    </div>
    <input
        id="fileInput"
        class="hidden-file-input"
        type="file"
        accept="image/*"
        on:change={handleFileChange}
    />
    <button class="upload-button" on:click={triggerFileInput}>
        Upload Image</button
    >
    <button class="generate-button" on:click={requestTransformedImage}>
        Generate...
    </button>
    <DebugPopup {showPopup} imageSrc={returnSrc} onClose={closePopup} />
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
