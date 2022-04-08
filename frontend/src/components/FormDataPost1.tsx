import { defineComponent, ref } from 'vue';

export const FormDataPost1 = defineComponent({
  setup() {
    const formRef = ref<HTMLFormElement | null>(null);
    const html = ref('');
    const sendByFormData = async (event: Event) => {
      event.preventDefault();
      event.stopPropagation();
      if (!formRef.value) return;
      const formData = new FormData(formRef.value);
      const res = await fetch('/multipart_post2', {
        method: 'POST',
        body: formData,
      });
      html.value = await res.text();
    };

    return () => (
      <>
        <h2>Form要素から生成したFormDataをリクエストボディに指定してfetchでPOST</h2>
        <p>
          `fetch`時に`content-type`にはなにも指定しないと、`FormData`内に`File`が存在すると`multipart/form-data`と`boundary`が設定される。
        </p>
        <form ref={formRef} onSubmit={sendByFormData}>
          <div>
            name:
            <input name="name" type="text" value="山田太郎" />
            <input name="attached" type="file" />
          </div>
          <button type="submit">send</button>
        </form>

        <h3>response</h3>
        <div class="response" v-html={html.value}></div>
      </>
    );
  },
});
