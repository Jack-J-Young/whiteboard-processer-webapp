<script>
    function handleFileChange(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imageSrc = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }
</script>

<div>
    <button> Upload image </button>
    <button> Generate... </button>
</div>
