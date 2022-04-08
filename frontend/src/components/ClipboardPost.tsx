import { defineComponent, ref } from 'vue';

const justifyImageSizeAsync = (file: File, params: { maxWidth: number }): Promise<File> => {
  const { maxWidth } = params;
  return new Promise(resolve => {
    if (!/^image\/(png|jpeg|jpg|bmp)$/.test(file.type)) {
      resolve(file);
      return;
    }
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const { naturalWidth, naturalHeight } = img;
      if (naturalWidth < maxWidth) {
        resolve(file);
        return;
      }
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      canvas.width = maxWidth;
      canvas.height = (naturalHeight * canvas.width) / naturalWidth;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(blob => {
        if (blob) {
          resolve(new File([blob], file.name));
        }
      });
    };
  });
};

const uploadFile = async (file: File) => {
  const justifiedFile: File = await justifyImageSizeAsync(file, { maxWidth: 800 });
  const formData = new FormData();
  formData.append('attached', justifiedFile);
  const res = await fetch('/multipart_post2', {
    method: 'POST',
    body: formData,
  });
  return res;
};

export const ClipBoardPost = defineComponent({
  setup() {
    const html = ref('');

    const onPaste = async (e: ClipboardEvent) => {
      const dataTransfer: DataTransfer | null = e.clipboardData;
      if (!dataTransfer) return;
      const files: FileList = dataTransfer.files;
      if (!files || !files.length) return;
      const file: File = files[0];
      const res = await uploadFile(file);
      html.value = await res.text();
    };

    const onDragover = (e: DragEvent) => {
      e.stopPropagation();
      e.preventDefault();
    };

    const onDrop = async (e: DragEvent) => {
      e.stopPropagation();
      e.preventDefault();
      if (!e.dataTransfer) return;
      const { files } = e.dataTransfer;
      if (!files || !files.length) return;
      const file: File = files[0];
      const res = await uploadFile(file);
      html.value = await res.text();
    };

    return () => (
      <>
        <h2>DataTransferから得たFileをFormDataにセットしてPOST</h2>
        <p>
          `paste`イベント、もしくは、`drop`イベントから得られる`DataTransfer`より`File`を取得し、
          `FormData`に追加後、リクエストボディに指定してPOSTする。
        </p>
        <p>また、対象ファイルが一定サイズを超える画像の場合は、`canvas`で縮小した後にPOSTする。</p>
        <textarea
          class="form"
          onPaste={onPaste}
          onDragover={onDragover}
          onDrop={onDrop}
          placeholder="クリップボード内のファイルやスクリーンショットをペースト、もしくはファイルをドロップするとアップロードされます。また、対象ファイルが一定サイズを超える画像の場合は、縮小したのちアップロードされます。"
        ></textarea>

        <h3>response</h3>
        <div class="response" v-html={html.value}></div>
      </>
    );
  },
});
