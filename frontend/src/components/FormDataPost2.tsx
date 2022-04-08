import { defineComponent, ref } from 'vue';

export const FormDataPost2 = defineComponent({
  setup() {
    const inputTextRef = ref<HTMLInputElement | null>(null);
    const inputFileRef = ref<HTMLInputElement | null>(null);

    const html = ref('');
    const sendByFormData = async () => {
      if (!inputTextRef.value || !inputFileRef.value || !inputFileRef.value.files?.length) return;
      const inputEl = inputTextRef.value;
      const file: File = inputFileRef.value.files[0];
      const formData = new FormData();
      formData.append(file.name, file);
      formData.append(inputEl.name, inputEl.value);
      const res = await fetch('/multipart_post2', {
        method: 'POST',
        body: formData,
      });
      html.value = await res.text();
    };

    return () => (
      <>
        <h2>自前で組み立てたFormDataをリクエストボディに指定してfetchでPOST</h2>
        <p>
          `FormData#append`を使い、送信対象データを追加した後、リクエストボディに指定してPOSTする。
        </p>
        <div class="form">
          <div>
            name:
            <input name="name" type="text" value="山田太郎" ref={inputTextRef} />
            <input name="attached" type="file" ref={inputFileRef} />
          </div>
          <button onClick={sendByFormData}>send</button>
        </div>
        <h3>response</h3>
        <div class="response" v-html={html.value}></div>
      </>
    );
  },
});
