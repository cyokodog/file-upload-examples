import { defineComponent } from 'vue';
import { SimplePost1 } from './components/SimplePost1';
import { SimplePost2 } from './components/SimplePost2';
import { MultipartPost1 } from './components/MultipartPost1';
import { MultipartPost2 } from './components/MultipartPost2';
import { OctetStreamPost } from './components/OctetStreamPost';
import { FormDataPost1 } from './components/FormDataPost1';
import { FormDataPost2 } from './components/FormDataPost2';
import { Base64Post } from './components/Base64Post';
import { ClipBoardPost } from './components/ClipBoardPost';

export const App = defineComponent({
  setup() {
    return () => (
      <>
        <h1>FILE UPLOAD EXAMPLES</h1>
        <SimplePost1 />
        <SimplePost2 />
        <MultipartPost1 />
        <MultipartPost2 />
        <OctetStreamPost />
        <FormDataPost1 />
        <FormDataPost2 />
        <Base64Post />
        <ClipBoardPost />
      </>
    );
  },
});
