import Screen from '../../components/screen';
import { UpdateProfile } from '@alum-net/users';

export default function Profile() {
  return (
    <Screen edges={['top']}>
      <UpdateProfile />
    </Screen>
  );
}
