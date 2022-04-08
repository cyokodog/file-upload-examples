import { defineComponent, ref } from 'vue';

export const OctetStreamPost = defineComponent({
  setup() {
    const inputRef = ref<HTMLInputElement | null>(null);
    const html = ref('');
    const sendByOctetStream = async () => {
      if (!inputRef.value || !inputRef.value.files || !inputRef.value.files.length) return;
      const fileList: FileList = inputRef.value.files;
      const file: File = fileList[0];
      const query = new URLSearchParams({ fileName: file.name });
      const res = await fetch(`/octet_stream_post?${query}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/octet-stream',
        },
        body: file,
      });
      html.value = await res.text();
    };

    return () => (
      <>
        <h2>File自体をリクエストボディに指定してfetchでPOST</h2>
        <p>
          JSで`input[type=file]`を`fetch`のリクエストボディに、`content-type`に`application/octet-stream`を指定してPOSTする。
        </p>
        <div class="form">
          <input name="attached" type="file" id="octet-stream-file" ref={inputRef} />
          <button onClick={() => sendByOctetStream()}>send</button>
        </div>
        <h3>response</h3>
        <div class="response" v-html={html.value}></div>
      </>
    );
  },
});
