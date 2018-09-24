const sas = "<SASトークン>";
const container = "<コンテナー名>";
const uri = "https://<ストレージ名>.blob.core.windows.net";


const blobService = AzureStorage.Blob.createBlobServiceWithSas(uri, sas);

$('#inputFile').on('change', (event) => {
    blobService.createContainerIfNotExists(container, (error, result) => {
        if (error) {
            console.error("create container error");
            return;
        }

        const file = event.target.files[0];
        const customBlockSize = (file.size > 1024 * 1024 * 32)? (1024 * 1024 * 4) : (1024 * 512);
        blobService.singleBlobPutThresholdInBytes = customBlockSize;

        const options = {
            blockSize: customBlockSize,
            contentSettings: {
                contentDisposition: "attachment"
            }
        };

        let finishedOrError = false;
        const speedSummary = blobService.createBlockBlobFromBrowserFile(container, "A.png", file, options, (error, result, response) => {
            finishedOrError = true;
            if (error) {
                console.error("error");
                return;
            }
            console.log("success");
        });
    });

});
