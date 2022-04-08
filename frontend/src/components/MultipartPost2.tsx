import { defineComponent } from 'vue';

export const MultipartPost2 = defineComponent({
  setup() {
    return () => (
      <>
        <h2>Fileを含むform要素によるPOST2</h2>
        <p>enctype="multipart/form-data"を指定。</p>
        <p>
          サーバーでリクエストを授受した際、送信されてきたデータをexpress-fileuploadで組み立てファイルを保存し、それらにリンクしたa要素を含むhtmlを返す。
        </p>
        <form
          action="/multipart_post2"
          method="post"
          target="multipart_post2_response"
          enctype="multipart/form-data"
        >
          <div>
            name:
            <input name="name" type="text" value="山田太郎" />
            <input name="attached" type="file" multiple />
            <input name="attached" type="file" multiple />
          </div>
          <button type="submit">send</button>
        </form>
        <h3>response</h3>
        <iframe name="multipart_post2_response"></iframe>
      </>
    );
  },
});
