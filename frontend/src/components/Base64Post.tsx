import { defineComponent, ref } from 'vue';

const toBase64Async = (file: File): Promise<string> => {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result as string;
      resolve(base64);
    };
  });
};

export const Base64Post = defineComponent({
  setup() {
    const inputTextRef = ref<HTMLInputElement | null>(null);
    const inputFileRef = ref<HTMLInputElement | null>(null);

    const html = ref('');
    const sendByBase64 = async () => {
      if (!inputTextRef.value || !inputFileRef.value || !inputFileRef.value.files?.length) return;
      const inputEl = inputTextRef.value;
      const file: File = inputFileRef.value.files[0];
      if (!/^image\/(png|jpeg|jpg|bmp)$/.test(file.type)) {
        alert('png|jpeg|jpg|bmp を指定してください');
        return;
      }
      const base64 = await toBase64Async(file);
      const res = await fetch('/json_post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          base64,
          fileName: file.name,
          [inputEl.name]: inputEl.value,
        }),
      });
      html.value = await res.text();
    };

    return () => (
      <>
        <h2>画像をbase64にしてjsonに包んでPOST</h2>
        <p>
          `content-type`には`application/json`を指定し、`JSON#stringify`した値をリクエストボディに指定してPOSTする。
        </p>
        <div class="form">
          <div>
            name:
            <input name="name" type="text" value="山田太郎" ref={inputTextRef} />
            <input name="attached" type="file" ref={inputFileRef} />
          </div>
          <button onClick={sendByBase64}>send</button>
        </div>
        <h3>response</h3>
        <div class="response" v-html={html.value}></div>
      </>
    );
  },
});
