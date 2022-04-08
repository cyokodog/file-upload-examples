import { defineComponent } from 'vue';

export const SimplePost2 = defineComponent({
  setup() {
    return () => (
      <>
        <h2>Fileを含まないform要素によるPOST2</h2>
        <p>
          サーバーでリクエストを授受した際、送信されてきたデータをexpress.urlencodedで組み立てる。
        </p>
        <form action="/simple_post2" method="post" target="simple_post2_response">
          <div>
            name:
            <input name="name" type="text" value="山田太郎" />
          </div>
          <button type="submit">send</button>
        </form>
        <h3>response</h3>
        <iframe name="simple_post2_response"></iframe>
      </>
    );
  },
});
