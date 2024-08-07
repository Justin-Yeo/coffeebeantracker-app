export const withTimeout = (promise, timeoutMs) => {
    let timeoutId;
    const timeoutPromise = new Promise((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(new Error('Operation timed out'));
      }, timeoutMs);
    });
  
    return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timeoutId));
  };
  