import { defineComponent } from 'vue';

export const MultipartPost1 = defineComponent({
  setup() {
    return () => (
      <>
        <h2>Fileを含むform要素によるPOST1</h2>
        <p>enctype="multipart/form-data"を指定。</p>
        <p>
          サーバーでリクエストを授受した際、送信されてきたデータを自前で組み立て、その値をそのまま返す。
        </p>
        <form
          action="/multipart_post1"
          method="post"
          target="multipart_post1_response"
          enctype="multipart/form-data"
        >
          <div>
            name:
            <input name="name" type="text" value="山田太郎" />
            <input name="attached" type="file" />
          </div>
          <button type="submit">send</button>
        </form>
        <h3>response</h3>
        <iframe name="multipart_post1_response"></iframe>
      </>
    );
  },
});
