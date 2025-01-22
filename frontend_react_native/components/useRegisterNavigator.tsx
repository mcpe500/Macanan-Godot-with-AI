import { nanoid } from 'nanoid';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useCallback } from 'react';

type ParamList = {
  [key: string]: any;
};

const useRegisterNavigator = () => {
  const navigation = useNavigation<NavigationProp<ParamList>>();

  const register = useCallback((name: string, params?: any) => {
    const id = nanoid();
    navigation.navigate(name, { id, ...params });
    return id;
  }, [navigation]);

  return { register };
};

export default useRegisterNavigator;


