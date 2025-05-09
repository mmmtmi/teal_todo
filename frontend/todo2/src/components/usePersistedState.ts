import { ref, watch } from 'vue';
import type { Ref } from 'vue';

export function usePersistedState<T>(key: string, initial: T): Ref<T> {
    let parsed: T = initial;
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const candidate = JSON.parse(raw);
        if (typeof candidate === 'object' && candidate !== null) {
          parsed = candidate;
        }
      }
    } catch {
      parsed = initial;
    }
  
    // 万が一 undefined になってたら強制上書き
    if (parsed === undefined) {
      parsed = initial;
    }
  
    const state = ref(parsed) as Ref<T>;
    return state;
  }