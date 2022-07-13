import { ref } from "vue";

export const usePromise = <T>(fn: CallableFunction) => {
  const result = ref<T | null>(null);
  const loading = ref(false);
  const error = ref<unknown>(null);
  const createPromise = async (...args: unknown[]) => {
    loading.value = true;
    result.value = null;
    error.value = null;
    try {
      result.value = await fn(...args);
    } catch (e) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  };

  return {
    result,
    loading,
    error,
    createPromise,
  };
};
