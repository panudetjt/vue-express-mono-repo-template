import { ref, watchEffect } from "vue";
export const useLocalStorageJSON = <T>(key: string) => {
  const item = localStorage.getItem(key);
  const value = ref<T | null>(item ? JSON.parse(item) : null);
  const clear = () => {
    value.value = null;
    localStorage.removeItem(key);
  };

  watchEffect(() => {
    localStorage.setItem(key, JSON.stringify(value.value));
  });

  return {
    value,
    clear,
  };
};
