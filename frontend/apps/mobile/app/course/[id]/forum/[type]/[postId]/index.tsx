import { ForumThread } from '@alum-net/forums';
import Screen from '../../../../../../components/screen';

export default function ForumThreadScreen() {
  return (
    <Screen scrollable={false}>
      <ForumThread />;
    </Screen>
  );
}
