import { defineComponent } from 'vue';

export const SimplePost1 = defineComponent({
  setup() {
    return () => (
      <>
        <h2>Fileを含まないform要素によるPOST1</h2>
        <p>サーバーでリクエストを授受した際、送信されてきたデータを自前で組み立てる。</p>
        <form action="/simple_post1" method="post" target="simple_post1_response">
          <div>
            name:
            <input name="name" type="text" value="山田太郎" />
          </div>
          <button type="submit">send</button>
        </form>
        <h3>response</h3>
        <iframe name="simple_post1_response"></iframe>
      </>
    );
  },
});
