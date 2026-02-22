// Bu ekran artık kullanılmıyor — Services tab'ına taşındı.
import { Redirect } from 'expo-router';
export default function Explore() {
  return <Redirect href="/(tabs)/services" />;
}
